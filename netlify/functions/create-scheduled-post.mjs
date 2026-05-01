// netlify/functions/create-scheduled-post.mjs
import { query } from './db.mjs';
import { withAuth } from './_auth.js';

export default async (request) => {
  if (request.method !== 'POST') {
    return Response.json({ error: 'Use POST' }, { status: 405 });
  }

  const body = await request.json();
  const {
    pinterest_user_id,
    board_id,
    media_url,
    title,
    description,
    scheduled_at
  } = body;

  if (!pinterest_user_id || !board_id || !media_url || !scheduled_at) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const userRes = await query(
    `SELECT id FROM users WHERE pinterest_user_id = $1`,
    [pinterest_user_id]
  );

  if (userRes.rows.length === 0) {
    return Response.json({ error: 'User not connected' }, { status: 400 });
  }

  const userId = userRes.rows[0].id;

  const insertRes = await query(
    `INSERT INTO scheduled_posts
      (user_id, board_id, media_url, title, description, scheduled_at, status)
     VALUES ($1,$2,$3,$4,$5,$6,'pending')
     RETURNING *`,
    [userId, board_id, media_url, title, description, scheduled_at]
  );

  return Response.json({ scheduled_post: insertRes.rows[0] });
};

