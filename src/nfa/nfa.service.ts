import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

import { ContextService } from '@/context/context.service';

@Injectable()
export class NfaService {
  constructor(
    private readonly contextService: ContextService,
    private readonly httpService: HttpService,
  ) {}

  private;
}
