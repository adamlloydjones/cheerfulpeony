// netlify/functions/logVisit.js
const fetch = require('node-fetch');
const { google } = require('googleapis');

exports.handler = async function (event) {
  const body = JSON.parse(event.body || '{}');

  const ip =
    event.headers['x-nf-client-connection-ip'] ||
    event.headers['client-ip'] ||
    event.headers['x-forwarded-for']?.split(',')[0] ||
    '';

  let geo = {};
  if (ip) {
    try {
      const res = await fetch(`https://ipapi.co/${ip}/json/`);
      geo = await res.json();
    } catch (err) {
      geo = { city: 'Unknown', region: 'Unknown', country: 'Unknown' };
    }
  }

  const row = [
    body.timestamp,
    body.url,
    body.referrer,
    geo.city || '',
    geo.region || '',
    geo.country || '',
    ip
  ];

  try {
    await appendToSheet(row);
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

// Modular Google Sheets appender
async function appendToSheet(row) {
  const auth = new google.auth.GoogleAuth({
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }
  });

  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values: [row] }
  });
}
