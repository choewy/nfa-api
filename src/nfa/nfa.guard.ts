import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { RequestHeader } from '@/common/enums';
import { ContextService } from '@/context/context.service';

@Injectable()
export class NfaGuard implements CanActivate {
  constructor(private readonly contextService: ContextService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const req = http.getRequest<Request>();

    const nfaClientId = req.headers[RequestHeader.NfaClientId] as string;
    const nfaClientSecert = req.headers[RequestHeader.NfaClientSecret] as string;
    const nfaAccountId = req.headers[RequestHeader.NfaAccountId] as string;

    if (!nfaClientId) {
      throw new ForbiddenException(`${RequestHeader.NfaClientId} not in request headers`);
    }

    if (!nfaClientSecert) {
      throw new ForbiddenException(`${RequestHeader.NfaClientSecret} not in request headers`);
    }

    if (!nfaAccountId) {
      throw new ForbiddenException(`${RequestHeader.NfaAccountId} not in request headers`);
    }

    this.contextService.setNfaClientId(nfaClientId);
    this.contextService.setNfaClientId(nfaClientSecert);
    this.contextService.setNfaClientId(nfaAccountId);

    return true;
  }
}
