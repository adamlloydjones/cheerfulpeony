// netlify/functions/run-pinterest-scheduler.mjs
import { query } from './db.mjs';
import { withAuth } from './_auth.js';

const PINS_URL = 'https://api.pinterest.com/v5/pins';
const TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token';

async function ensureAccessToken(user) {
  const now = Date.now();
  const expiresAt = new Date(user.token_expires_at).getTime();

  if (expiresAt - now > 60_000) {
    return user.access_token;
  }

  const clientId = process.env.PINTEREST_CLIENT_ID;
  const clientSecret = process.env.PINTEREST_CLIENT_SECRET;

  const res = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: user.refresh_token,
      client_id: clientId,
      client_secret: clientSecret
    })
  });

  if (!res.ok) {
    throw new Error(`Failed to refresh token for user ${user.id}`);
  }

  const json = await res.json();
  const { access_token, expires_in } = json;
  const newExpiresAt = new Date(Date.now() + expires_in * 1000).toISOString();

  await query(
    `UPDATE users
     SET access_token = $1, token_expires_at = $2
     WHERE id = $3`,
    [access_token, newExpiresAt, user.id]
  );

  return access_token;
}

export const config = {
  schedule: '*/5 * * * *' // every 5 minutes
};

export default async () => {
  const postsRes = await query(
    `SELECT sp.*, u.id AS user_id, u.pinterest_user_id,
            u.access_token, u.refresh_token, u.token_expires_at
     FROM scheduled_posts sp
     JOIN users u ON sp.user_id = u.id
     WHERE sp.status = 'pending'
       AND sp.scheduled_at <= NOW()
     ORDER BY sp.scheduled_at ASC
     LIMIT 50`
  );

  const posts = postsRes.rows;
  let successCount = 0;

  for (const post of posts) {
    try {
      const accessToken = await ensureAccessToken(post);

      const pinRes = await fetch(PINS_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          board_id: post.board_id,
          media_source: {
            source_type: 'image_url',
            url: post.media_url
          },
          title: post.title,
          description: post.description
        })
      });

      if (!pinRes.ok) {
        const text = await pinRes.text();
        console.error('Pinterest error', text);
        await query(
          `UPDATE scheduled_posts
           SET status = 'failed'
           WHERE id = $1`,
          [post.id]
        );
        continue;
      }

      const pinJson = await pinRes.json();

      await query(
        `UPDATE scheduled_posts
         SET status = 'posted', pinterest_pin_id = $1
         WHERE id = $2`,
        [pinJson.id, post.id]
      );

      successCount++;
    } catch (err) {
      console.error('Error posting pin', err);
      await query(
        `UPDATE scheduled_posts
         SET status = 'failed'
         WHERE id = $1`,
        [post.id]
      );
    }
  }

  return Response.json({ processed: posts.length, posted: successCount });
};
