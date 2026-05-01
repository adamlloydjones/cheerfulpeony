// netlify/functions/list-scheduled-posts.mjs
import { query } from './db.mjs';
import { withAuth } from './_auth.js';

export default async (request) => {
  const url = new URL(request.url);
  const pinterest_user_id = url.searchParams.get('pinterest_user_id');

  if (!pinterest_user_id) {
    return Response.json({ error: 'Missing pinterest_user_id' }, { status: 400 });
  }

  const userRes = await query(
    `SELECT id FROM users WHERE pinterest_user_id = $1`,
    [pinterest_user_id]
  );

  if (userRes.rows.length === 0) {
    return Response.json({ posts: [] });
  }

  const userId = userRes.rows[0].id;

  const postsRes = await query(
    `SELECT * FROM scheduled_posts
     WHERE user_id = $1
     ORDER BY scheduled_at DESC`,
    [userId]
  );

  return Response.json({ posts: postsRes.rows });
};
