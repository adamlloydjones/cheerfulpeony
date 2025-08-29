// tracker.mjs
const payload = {
  url: window.location.href,
  referrer: document.referrer,
  timestamp: new Date().toISOString()
};

fetch('/.netlify/functions/logVisit', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
