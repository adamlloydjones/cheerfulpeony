// netlify/functions/viewBlobs.mjs
import { getStore } from '@netlify/blobs';

export async function handler() {
  const store = getStore('visitor-logs');
  const keys = await store.list();

  const entries = await Promise.all(
    keys.map(async key => {
      const value = await store.get(key);
      return { key, value: JSON.parse(value) };
    })
  );

  return {
    statusCode: 200,
    body: JSON.stringify(entries, null, 2)
  };
}
