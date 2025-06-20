import { Client } from '@neondatabase/serverless';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  const {
    bookingId, name, phone, pickup, dropoff, location, total, timestamp
  } = req.body;

  try {
    await client.query(`
      INSERT INTO bookings (booking_id, name, phone, pickup, dropoff, location, total, timestamp)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [bookingId, name, phone, pickup, dropoff, location, total, timestamp]);

    return res.status(200).json({ status: "success" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: "error", message: "DB error" });
  } finally {
    await client.end();
  }
};
