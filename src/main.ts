import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { SwaggerInitializer } from './swagger/swagger.initializer';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  new SwaggerInitializer(app).setup('api-docs');

  await app.listen(3000);
}

bootstrap();
