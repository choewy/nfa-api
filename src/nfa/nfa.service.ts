import { HttpService } from '@nestjs/axios';

import { ContextService } from '@/context/context.service';

export class NfaService {
  constructor(
    private readonly contextService: ContextService,
    private readonly httpService: HttpService,
  ) {}
}
