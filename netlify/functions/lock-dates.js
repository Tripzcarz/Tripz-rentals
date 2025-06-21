import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { bookingId, dates } = JSON.parse(req.body);

    if (!bookingId || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid data' });
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes from now

    // Build bulk insert
    const rows = dates.map(date => ({
      booking_id: bookingId,
      date,
      expires_at: expiresAt.toISOString()
    }));

    const values = rows.map(
      row => `('${row.booking_id}', '${row.date}', '${row.expires_at}')`
    ).join(',');

    await sql.unsafe(`
      INSERT INTO temp_locks (booking_id, date, expires_at)
      VALUES ${values}
      ON CONFLICT (date) DO NOTHING
    `);

    return res.status(200).json({ status: 'locked' });
  } catch (err) {
    console.error('Error locking dates:', err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
