import { HttpService } from '@nestjs/axios';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';

import { NfaOAuthContext } from './context/nfa-oauth';
import { NfaApiUrlPath, NfaUrl } from './persistent/enums';
import { NfaOAuthTokenResponseBody } from './persistent/interfaces';

import { ConfigKey, NodeEnv } from '@/common/enums';
import { ContextService } from '@/context/context.service';

@Injectable()
export class NfaService {
  constructor(
    private readonly configService: ConfigService,
    private readonly contextService: ContextService,
    private readonly httpService: HttpService,
  ) {
    this.httpService.axiosRef.defaults.baseURL = this.baseURL;
  }

  private get baseURL() {
    return (this.configService.getOrThrow(ConfigKey.NodeEnv) as NodeEnv) === NodeEnv.Production ? NfaUrl.Production : NfaUrl.Sandbox;
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
      this.httpService.post<NfaOAuthTokenResponseBody>(NfaApiUrlPath.OAuthToken, nfaOAuthContext.requestBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );

    return nfaOAuthContext.setAccessToken(data.access_token, data.expires_in);
  }
}
