import { store } from './blobs-store.mjs';

export async function logVisit(ip, userAgent) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    ip,
    userAgent,
    timestamp
  };

  try {
    await store.set(timestamp, JSON.stringify(logEntry));
    console.log(`✅ Visit logged at ${timestamp}`);
  } catch (err) {
    console.error('❌ Failed to log visit:', err.message);
  }
}
