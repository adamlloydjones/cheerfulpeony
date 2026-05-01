// netlify/functions/pinterest-auth-start.mjs
import { withAuth } from './_auth.js';

const PINTEREST_AUTH_URL = 'https://www.pinterest.com/oauth/';

export default async (request) => {
  const clientId = process.env.PINTEREST_CLIENT_ID;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI;
  const scope = 'pins:read,pins:write,boards:read,boards:write';

  const url = new URL(PINTEREST_AUTH_URL);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope);
  // In production, generate a real CSRF token and tie it to a session
  url.searchParams.set('state', 'demo-state');

  return Response.redirect(url.toString(), 302);
};
