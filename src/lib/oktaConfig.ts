export const oktaConfig = {
  clientId: '0oacy37evxw4CBYZL5d7',
  issuer: 'https://dev-74151017.okta.com/oauth2/default',
  redirectUri: 'https://localhost:3000/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
  disableHttpsCheck: true,
};
