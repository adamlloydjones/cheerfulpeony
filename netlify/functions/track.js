const { google } = require('googleapis');

exports.handler = async (event) => {
  const payload = JSON.parse(event.body);

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = process.env.GOOGLE_SHEET_ID;

  const values = [[
    new Date().toISOString(),
    payload.url,
    payload.referrer,
    payload.utm.source,
    payload.utm.medium,
    payload.utm.campaign,
    payload.screen.width,
    payload.screen.height,
    payload.userAgent
  ]];

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    requestBody: { values }
  });

  return {
    statusCode: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    body: 'Logged'
  };
};
