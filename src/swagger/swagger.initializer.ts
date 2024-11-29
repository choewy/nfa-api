import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { RequestHeader } from '@/common/enums';

export class SwaggerInitializer {
  constructor(private readonly app: INestApplication) {}

  private get config() {
    return new DocumentBuilder()
      .setTitle(process.env.npm_package_name)
      .setVersion(process.env.npm_package_version)
      .addApiKey(
        {
          name: RequestHeader.NfaClientId,
          type: 'apiKey',
          in: 'header',
        },
        RequestHeader.NfaClientId,
      )
      .addApiKey(
        {
          name: RequestHeader.NfaClientSecret,
          type: 'apiKey',
          in: 'header',
        },
        RequestHeader.NfaClientSecret,
      )
      .build();
  }

  setup(path = 'swagger') {
    SwaggerModule.setup(path, this.app, SwaggerModule.createDocument(this.app, this.config));
  }
}
