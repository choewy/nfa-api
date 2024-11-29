import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { ContextInterceptor } from './context/context.interceptor';
import { SwaggerInitializer } from './swagger/swagger.initializer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  new SwaggerInitializer(app).setup('api-docs');

  app.useGlobalInterceptors(app.get(ContextInterceptor));

  await app.listen(3000);
}

bootstrap();
