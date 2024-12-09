import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from '@nestjs/swagger';

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
      .addApiKey(
        {
          name: RequestHeader.NfaAccountId,
          type: 'apiKey',
          in: 'header',
        },
        RequestHeader.NfaAccountId,
      )
      .build();
  }

  private get customOptions() {
    const configService = this.app.get(ConfigService);

    const nfaClientId = configService.get('SWAGGER_NFA_CLIENT_ID');
    const nfaClientSecret = configService.get('SWAGGER_NFA_CLIENT_SECRET');
    const nfaAccountId = configService.get('SWAGGER_NFA_ACCOUNT_ID');
    const customOptions: SwaggerCustomOptions = { swaggerOptions: { docExpansion: 'none', authAction: {} } };

    if (nfaClientId) {
      customOptions.swaggerOptions.authAction[RequestHeader.NfaClientId] = {
        schema: {
          type: 'apiKey',
          in: 'header',
        },
        value: nfaClientId,
      };
    }

    if (nfaClientSecret) {
      customOptions.swaggerOptions.authAction[RequestHeader.NfaClientSecret] = {
        schema: {
          type: 'apiKey',
          in: 'header',
        },
        value: nfaClientSecret,
      };
    }

    if (nfaAccountId) {
      customOptions.swaggerOptions.authAction[RequestHeader.NfaAccountId] = {
        schema: {
          type: 'apiKey',
          in: 'header',
        },
        value: nfaAccountId,
      };
    }

    return customOptions;
  }

  setup(path = 'swagger') {
    SwaggerModule.setup(path, this.app, SwaggerModule.createDocument(this.app, this.config), this.customOptions);
  }
}
