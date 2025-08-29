// netlify/functions/utils/geo.mjs
import fetch from 'node-fetch';

export async function lookupGeo(ip) {
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    return await res.json();
  } catch {
    return { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
  }
}
