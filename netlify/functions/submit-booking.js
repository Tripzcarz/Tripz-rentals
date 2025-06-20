import { Pool } from '@neondatabase/serverless';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true
});

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);

    const {
      bookingId, name, phone,
      pickup, dropoff, location,
      total, timestamp
    } = data;

    const query = `
      INSERT INTO bookings (booking_id, name, phone, pickup, dropoff, location, total)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    await pool.query(query, [
      bookingId, name, phone,
      pickup, dropoff, location,
      total
    ]);

    return {
      statusCode: 200,
      body: JSON.stringify({ status: "success" })
    };

  } catch (err) {
    console.error("Booking DB Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ status: "error", message: err.message })
    };
  }
}
