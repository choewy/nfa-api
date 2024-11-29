import { ExecutionContext, Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';

import { ContextKey } from './enums';

@Injectable()
export class ContextService {
  constructor(private readonly clsService: ClsService) {}

  get reequestId() {
    return this.clsService.get(ContextKey.RequestId);
  }

  setExecutionContext(executionContext: ExecutionContext) {
    this.clsService.set(ContextKey.ExecutionContext, executionContext);
  }

  get executionContext(): ExecutionContext {
    return this.clsService.get(ContextKey.ExecutionContext) ?? null;
  }

  setNfaClientId(nfaClientId: string) {
    this.clsService.set(ContextKey.NfaClientId, nfaClientId);
  }

  get nfaClientId(): string | null {
    return this.clsService.get(ContextKey.NfaClientId);
  }

  setNfaClientSecret(nfaClientSecret: string) {
    this.clsService.set(ContextKey.NfaClientSecret, nfaClientSecret);
  }

  get nfaClientSecret(): string | null {
    return this.clsService.get(ContextKey.NfaClientSecret);
  }
}
