const { google } = require('googleapis');

exports.handler = async function (event) {
  // Parse and validate input
  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    console.error('Invalid JSON:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Malformed request body' })
    };
  }

  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const page = typeof body.page === 'string' ? body.page.trim() : '';
  const timestamp = new Date().toISOString();

  if (!email || !page) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing email or page' })
    };
  }

  // Authenticate with Google Sheets
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });

  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  const range = 'Sheet1!A1:C1';

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: {
        values: [[timestamp, email, page]]
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    console.error('Google Sheets error:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to log data' })
    };
  }
};
