// netlify/functions/logVisit.mjs
import { getStore } from '@netlify/blobs';
import { lookupGeo } from './utils/geo.mjs';

export async function handler(event) {
  const body = JSON.parse(event.body || '{}');
  const ip =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['client-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0] ||
    '';

  const geo = await lookupGeo(ip);
  const store = getStore('visitor-logs');
  const key = `visit-${Date.now()}`;

  const data = {
    timestamp: new Date().toISOString(),
    url: body.url || '',
    referrer: body.referrer || '',
    geo,
    ip
  };

  await store.set(key, JSON.stringify(data));

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
}
