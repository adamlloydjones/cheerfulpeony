import { getStore } from '@netlify/blobs';
import 'dotenv/config'; // Optional: loads .env in local dev

const siteID = process.env.SITE_ID;
const token = process.env.NETLIFY_API_TOKEN;

if (!siteID || !token) {
  throw new Error('❌ Netlify Blobs requires SITE_ID and NETLIFY_API_TOKEN to be set.');
}

export const store = getStore('visit-logs', {
  siteID,
  token
});
