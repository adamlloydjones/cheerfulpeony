function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    source: params.get('utm_source') || '',
    medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || ''
  };
}

function buildPayload() {
  return {
    url: window.location.href,
    referrer: document.referrer,
    utm: getUTMParams(),
    screen: {
      width: window.screen.width,
      height: window.screen.height
    },
    userAgent: navigator.userAgent
  };
}

function sendTrackingData() {
  fetch('/.netlify/functions/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPayload())
  })
    .then(res => res.text())
    .then(data => console.log('[Trackinator] Logged:', data))
    .catch(err => console.error('[Trackinator] Error:', err));
}

window.Trackinator = { send: sendTrackingData };
sendTrackingData();
