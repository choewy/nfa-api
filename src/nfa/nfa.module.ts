import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { NfaController } from './nfa.controller';
import { NfaService } from './nfa.service';

@Module({
  imports: [HttpModule],
  controllers: [NfaController],
  providers: [NfaService],
})
export class NfaModule {}
