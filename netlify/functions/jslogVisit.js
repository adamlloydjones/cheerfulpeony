// netlify/functions/logVisit.js
const { getStore } = require('@netlify/blobs');
const fetch = require('node-fetch');

exports.handler = async function (event) {
  const body = JSON.parse(event.body || '{}');
  const ip =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['client-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0] ||
    '';

  let geo = {};
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    geo = await res.json();
  } catch {
    geo = { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
  }

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
};
