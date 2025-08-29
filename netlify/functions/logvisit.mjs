// netlify/functions/logVisit.mjs
import { getStore, connectLambda } from '@netlify/blobs';
import { lookupGeo } from './utils/geo.mjs';

export async function handler(event) {
  try {
    connectLambda(event); // 👈 Injects siteID, token, etc.

    const store = getStore('visit-logs');
    await store.set(Date.now().toString(), JSON.stringify({
      page: 'home',
      timestamp: new Date().toISOString()
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('Blob write error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Blob write failed' })
    };
  }
}
