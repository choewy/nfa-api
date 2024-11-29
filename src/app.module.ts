import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ContextModule } from './context/context.module';
import { NfaModule } from './nfa/nfa.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), HttpModule, ContextModule, NfaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
