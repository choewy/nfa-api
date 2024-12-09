export enum NfaUrl {
  Sandbox = 'https://sandbox-api.commerce.naver.com',
  Production = 'https://api.commerce.naver.com',
}

export enum NfaApiUrlPath {
  OAuthToken = 'partner/v1/oauth2/token',
  ProductOrdersLastChangedStatuses = 'partner/v1/pay-order/seller/product-orders/last-changed-statuses',
  ProductOrdersQuery = 'partner/v1/pay-order/seller/product-orders/query',
  ProductOrdersConfirm = 'partner/v1/pay-order/seller/product-orders/confirm',
  ProductOrdersDispatch = 'partner/v1/pay-order/seller/product-orders/dispatch',
}
