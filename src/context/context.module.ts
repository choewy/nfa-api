import { Global, Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { v4 } from 'uuid';

import { ContextInterceptor } from './context.interceptor';
import { ContextService } from './context.service';
import { ContextKey } from './enums';

@Global()
@Module({
  imports: [
    ClsModule.forRoot({
      middleware: {
        mount: true,
        setup(clsService, req, res) {
          req.id = req.get(ContextKey.RequestId) ?? v4();
          res.set(ContextKey.RequestId, req.id);

          clsService.set(ContextKey.RequestId, req.id);
        },
      },
    }),
  ],
  providers: [ContextService, ContextInterceptor],
  exports: [ContextService, ContextInterceptor],
})
export class ContextModule {}
