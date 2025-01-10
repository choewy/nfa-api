import { HttpService } from '@nestjs/axios';
import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DateTime } from 'luxon';
import { lastValueFrom } from 'rxjs';

import { NfaOAuthContext } from './context/nfa-oauth';
import { NfaGetLastChangedStatusesParamDTO } from './dto/nfa-get-last-changed-statuses-param.dto';
import { NfaGetProductOrdersParamDTO } from './dto/nfa-get-product-orders-param.dto';
import { NfaSendInvoicesParamsDTO } from './dto/nfa-send-invoices-params.dto';
import { NfaApiUrlPath, NfaDeliveryMethod, NfaUrl } from './persistent/enums';
import { NfaDispatchProductOrderRequestBody, NfaOAuthTokenResponseBody } from './persistent/interfaces';

import { ConfigKey, NodeEnv } from '@/common/enums';
import { toArray } from '@/common/transformer/to-array';
import { ContextService } from '@/context/context.service';

@Injectable()
export class NfaService {
  constructor(
    private readonly configService: ConfigService,
    private readonly contextService: ContextService,
    private readonly httpService: HttpService,
  ) {}

  private get baseURL() {
    return (this.configService.getOrThrow(ConfigKey.NodeEnv) as NodeEnv) === NodeEnv.Production ? NfaUrl.Production : NfaUrl.Sandbox;
  }

  private createUrl(path: string) {
    if (path.startsWith('/') === false) {
      path = `/${path}`;
    }

    return `${this.baseURL}${path}`;
  }

  async getNfaOAuth() {
    const clientId = this.contextService.nfaClientId;
    const clientSecret = this.contextService.nfaClientSecret;
    const accountId = this.contextService.nfaAccountId;

    if (!clientId || !clientSecret) {
      throw new ForbiddenException();
    }

    const nfaOAuthContext = new NfaOAuthContext(clientId, clientSecret, accountId);

    const { data } = await lastValueFrom(
      this.httpService.post<NfaOAuthTokenResponseBody>(this.createUrl(NfaApiUrlPath.OAuthToken), nfaOAuthContext.requestBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    return nfaOAuthContext.setAccessToken(data.access_token, data.expires_in);
  }

  async validateOAuth(oauthContext: NfaOAuthContext) {
    const remainSeconds = oauthContext.remainSeconds;

    if (remainSeconds > 3) {
      return oauthContext;
    }

    return new Promise<NfaOAuthContext>(async (resolve) => {
      setTimeout(() => {
        resolve(this.getNfaOAuth());
      }, 1000 * remainSeconds);
    });
  }

  async getLastChangedStatuses(param: NfaGetLastChangedStatusesParamDTO, oAuthContext?: NfaOAuthContext) {
    if (!oAuthContext) {
      oAuthContext = await this.getNfaOAuth();
    }

    let lastChangedStatuses = [];

    const startAt = DateTime.fromJSDate(new Date(param.startAt)).startOf('day');
    const endAt = DateTime.fromJSDate(new Date(param.endAt)).endOf('day');
    const totalDays = endAt.diff(startAt, 'days').get('days') + 1;

    for (let days = 0; days < totalDays; days++) {
      const searchAt = startAt.plus({ days });
      const requestParam = {
        lastChangedFrom: searchAt.startOf('day').toISO({ includeOffset: true }),
        lastChangedTo: searchAt.endOf('day').toISO({ includeOffset: true }),
        lastChangedType: param.lastChangedType,
      };

      while (true) {
        oAuthContext = await this.validateOAuth(oAuthContext);

        if (oAuthContext.isExpired) {
          return lastChangedStatuses;
        }

        const { ok, data } = await lastValueFrom(
          this.httpService.get(this.createUrl('/partner/v1/pay-order/seller/product-orders/last-changed-statuses'), {
            headers: { Authorization: oAuthContext.bearerAuth },
            params: requestParam,
          }),
        )
          .then((response) => ({
            ok: true,
            data: response?.data,
          }))
          .catch((e) => ({
            ok: false,
            data: e?.response?.data,
          }));

        const lastChangeStatusRows = data?.data?.lastChangeStatuses;

        if (!ok || !lastChangeStatusRows) {
          break;
        }

        lastChangedStatuses = lastChangedStatuses.concat(lastChangeStatusRows);

        const more = data?.data?.more;
        const moreSequence = more?.moreSequence;
        const lastChangedFrom = more?.moreFrom;

        if (!more || !moreSequence || !lastChangedFrom) {
          break;
        }

        requestParam['moreSequence'] = moreSequence;
        requestParam['lastChangedFrom'] = lastChangedFrom;
      }
    }

    return lastChangedStatuses;
  }

  async getProductOrders(param: NfaGetProductOrdersParamDTO, oAuthContext?: NfaOAuthContext) {
    if (!oAuthContext) {
      oAuthContext = await this.getNfaOAuth();
    }

    if (!param.productOrderIds && (!param.startAt || !param.endAt || !param.lastChangedType)) {
      throw new BadRequestException('invalid params');
    }

    const allProductOrderIds = toArray(param.productOrderIds) ?? [];

    if (!param.productOrderIds) {
      const getLastChangedStatusesParamDTO = new NfaGetLastChangedStatusesParamDTO();

      getLastChangedStatusesParamDTO.startAt = param.startAt;
      getLastChangedStatusesParamDTO.endAt = param.endAt;
      getLastChangedStatusesParamDTO.lastChangedType = param.lastChangedType;

      const lastChangedStatuses = await this.getLastChangedStatuses(getLastChangedStatusesParamDTO, oAuthContext);

      for (const lastChangedStatus of lastChangedStatuses) {
        allProductOrderIds.push(lastChangedStatus['productOrderId']);
      }
    }

    let productOrders = [];

    while (true) {
      const productOrderIds = [];

      while (productOrderIds.length < 300 && allProductOrderIds.length > 0) {
        productOrderIds.push(allProductOrderIds.shift());
      }

      oAuthContext = await this.validateOAuth(oAuthContext);

      const { ok, data } = await lastValueFrom(
        this.httpService.post(
          this.createUrl('/partner/v1/pay-order/seller/product-orders/query'),
          {
            productOrderIds,
            quantityClaimCompatibility: true,
          },
          {
            headers: { Authorization: oAuthContext.bearerAuth },
          },
        ),
      )
        .then((response) => ({
          ok: true,
          data: response?.data,
        }))
        .catch((e) => ({
          ok: false,
          data: e?.response?.data,
        }));

      const productOrderRows = data?.data;

      if (!ok || !productOrderRows) {
        break;
      }

      productOrders = productOrders.concat(productOrderRows);
    }

    return productOrders;
  }

  async sendInvoices(body: NfaSendInvoicesParamsDTO) {
    const oAuthContext = await this.getNfaOAuth();

    const dispatchDate = DateTime.local().toISO({ includeOffset: true });
    const dispatchProductOrders: NfaDispatchProductOrderRequestBody[] = [];

    for (const row of body.rows) {
      dispatchProductOrders.push({
        productOrderId: row.productOrderId,
        deliveryMethod: row.expType === '직배' ? NfaDeliveryMethod.DeliveryDirectly : NfaDeliveryMethod.Delivery,
        deliveryCompanyCode: row.expKey,
        trackingNumber: row.invoice,
        dispatchDate,
      });
    }

    const { ok, data } = await lastValueFrom(
      this.httpService.post(
        this.createUrl('/partner/v1/pay-order/seller/product-orders/dispatch'),
        { dispatchProductOrders },
        { headers: { Authorization: oAuthContext.bearerAuth } },
      ),
    )
      .then((response) => ({
        ok: true,
        data: response?.data,
      }))
      .catch((e) => ({
        ok: false,
        data: e?.response?.data,
      }));

    return { ok, data };
  }
}
