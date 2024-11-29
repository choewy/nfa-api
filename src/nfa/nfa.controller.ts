import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { NfaGuard } from './nfa.guard';
import { NfaService } from './nfa.service';

import { RequestHeader } from '@/common/enums';

@ApiTags('NFA')
@ApiSecurity(RequestHeader.NfaClientId)
@ApiSecurity(RequestHeader.NfaClientSecret)
@UseGuards(NfaGuard)
@Controller('api/nfa')
export class NfaController {
  constructor(private readonly nfaService: NfaService) {}

  @Get('tokens')
  async getTokens() {
    return '';
  }
}
