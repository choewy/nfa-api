import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { NfaService } from './nfa.service';

@ApiTags('NFA')
@Controller('api/nfa')
export class NfaController {
  constructor(private readonly nfaService: NfaService) {}
}
