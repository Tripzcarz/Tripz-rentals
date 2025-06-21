import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async function handler(req, res) {
  try {
    const result = await sql`
      SELECT date
      FROM temp_locks
      WHERE expires_at > NOW()
    `;

    const lockedDates = result.map(row => row.date.toISOString().split('T')[0]);

    return res.status(200).json({ lockedDates });
  } catch (err) {
    console.error('Error fetching locked dates:', err);
    return res.status(500).json({ error: 'Failed to fetch locked dates' });
  }
}
