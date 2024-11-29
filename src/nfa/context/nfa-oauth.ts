import { hashSync } from 'bcrypt';
import { DateTime } from 'luxon';

import { NfaOAuthTokenRequestBody } from '../persistent/interfaces';

export class NfaOAuthContext {
  private readonly timestamp: number;
  private readonly accountId: string;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private accessToken: string;
  private expiresIn: DateTime;

  constructor(clientId: string, clientSercret: string, accountId: string) {
    this.clientId = clientId;
    this.clientSecret = clientSercret;
    this.accountId = accountId;
    this.timestamp = Date.now();
  }

  setAccessToken(accessToken: string, expireSeconds: number) {
    this.accessToken = accessToken;
    this.expiresIn = DateTime.local().plus({ seconds: expireSeconds });

    return this;
  }

  private get clientSecretSign() {
    const saltKey = `$2a$04$${this.clientSecret}$`;
    const signature = `${this.clientId}_${this.timestamp}`;
    const hashedSignature = hashSync(signature, saltKey);

    return Buffer.from(hashedSignature, 'binary').toString('base64');
  }

  get isExpired() {
    return this.expiresIn.diffNow('milliseconds').get('milliseconds') < 0;
  }

  get bearerAuth() {
    return `Bearer ${this.accessToken}`;
  }

  get requestBody(): NfaOAuthTokenRequestBody {
    return {
      type: 'SELLER',
      grant_type: 'client_credentials',
      timestamp: this.timestamp,
      account_id: this.accountId,
      client_id: this.clientId,
      client_secret_sign: this.clientSecretSign,
    };
  }
}
