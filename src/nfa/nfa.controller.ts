import { Controller, Get } from '@nestjs/common';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

import { NfaService } from './nfa.service';

import { RequestHeader } from '@/common/enums';

@ApiTags('NFA')
@ApiSecurity(RequestHeader.NfaClientId)
@ApiSecurity(RequestHeader.NfaClientSecret)
@Controller('api/nfa')
export class NfaController {
  constructor(private readonly nfaService: NfaService) {}

  @Get()
  async hello() {
    return '';
  }
}
