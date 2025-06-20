import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  const db = neon(process.env.DATABASE_URL);
  const { bookingId, name, phone, pickup, dropoff, location, total, timestamp } = await req.json();

  try {
    await db`INSERT INTO bookings (booking_id, name, phone, pickup, dropoff, location, total, timestamp) VALUES (${bookingId}, ${name}, ${phone}, ${pickup}, ${dropoff}, ${location}, ${total}, ${timestamp})`;

    return Response.json({ status: "success" });
  } catch (err) {
    console.error("DB error:", err);
    return Response.json({ status: "error", message: err.message }, { status: 500 });
  }
};
