export interface NfaOAuthTokenRequestBody {
  type: 'SELLER';
  grant_type: 'client_credentials';
  account_id: string;
  client_id: string;
  client_secret_sign: string;
  timestamp: number;
}

export interface NfaOAuthTokenResponseBody {
  token_type: string;
  access_token: string;
  expires_in: number;
}
