// netlify/functions/pinterest-auth-callback.mjs
import { query } from './db.mjs';
import { withAuth } from './_auth.js';

const TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token';

export default async (request) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code) {
    return Response.json({ error: 'Missing code' }, { status: 400 });
  }

  // TODO: validate `state` if you implement CSRF protection

  const clientId = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;
  const redirectUri = process.env.PINTEREST_REDIRECT_URI;

  const tokenRes = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret
    })
  });

  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    return Response.json(
      { error: 'Token exchange failed', details: text },
      { status: 500 }
    );
  }

  const tokenJson = await tokenRes.json();
  const { access_token, refresh_token, expires_in } = tokenJson;

  // Fetch Pinterest user profile
  const meRes = await fetch('https://api.pinterest.com/v5/user_account', {
    headers: { Authorization: `Bearer ${access_token}` }
  });

  if (!meRes.ok) {
    const text = await meRes.text();
    return Response.json(
      { error: 'Failed to fetch user', details: text },
      { status: 500 }
    );
  }

  const me = await meRes.json();
  const expiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

  await query(
    `INSERT INTO users (pinterest_user_id, access_token, refresh_token, token_expires_at)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (pinterest_user_id)
     DO UPDATE SET
       access_token = EXCLUDED.access_token,
       refresh_token = EXCLUDED.refresh_token,
       token_expires_at = EXCLUDED.token_expires_at`,
    [me.id, access_token, refresh_token, expiresAt]
  );

  // Redirect back to frontend
  return Response.redirect('/?connected=pinterest', 302);
};
