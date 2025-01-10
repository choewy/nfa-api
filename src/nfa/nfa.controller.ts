import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { NfaGetLastChangedStatusesParamDTO } from './dto/nfa-get-last-changed-statuses-param.dto';
import { NfaGetProductOrdersParamDTO } from './dto/nfa-get-product-orders-param.dto';
import { NfaSendInvoicesParamsDTO } from './dto/nfa-send-invoices-params.dto';
import { NfaGuard } from './nfa.guard';
import { NfaService } from './nfa.service';

import { RequestHeader } from '@/common/enums';

@ApiTags('NFA')
@ApiSecurity(RequestHeader.NfaClientId)
@ApiSecurity(RequestHeader.NfaClientSecret)
@ApiSecurity(RequestHeader.NfaAccountId)
@UseGuards(NfaGuard)
@Controller('api/nfa')
export class NfaController {
  constructor(private readonly nfaService: NfaService) {}

  @Get('tokens')
  async getTokens() {
    return this.nfaService.getNfaOAuth();
  }

  @Get('lastChangedStatuses')
  async getLastChangeStatuses(@Query() queryParam: NfaGetLastChangedStatusesParamDTO) {
    return this.nfaService.getLastChangedStatuses(queryParam);
  }

  @Get('productOrders')
  async getProductOrders(@Query() queryParam: NfaGetProductOrdersParamDTO) {
    return this.nfaService.getProductOrders(queryParam);
  }

  @Post('sendInvoices')
  async sendInvoices(@Body() body: NfaSendInvoicesParamsDTO) {
    return this.nfaService.sendInvoices(body);
  }
}
