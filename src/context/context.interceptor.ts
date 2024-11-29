import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';

import { ContextService } from './context.service';

@Injectable()
export class ContextInterceptor implements NestInterceptor {
  constructor(private readonly contextService: ContextService) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    this.contextService.setExecutionContext(context);

    return next.handle();
  }
}
