const { google } = require('googleapis');

exports.handler = async (event, context) => {
  // Allow only POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body);

    const {
      bookingId,
      name,
      phone,
      pickup,
      dropoff,
      location,
      total,
      timestamp
    } = body;

    // Authorize Google Sheets access using environment variables
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    // Append booking to the first sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          timestamp,
          bookingId,
          name,
          phone,
          pickup,
          dropoff,
          location,
          total
        ]]
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ status: 'success' })
    };

  } catch (error) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: 'error', message: error.message })
    };
  }
};
