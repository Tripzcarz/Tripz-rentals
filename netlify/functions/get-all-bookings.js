// netlify/functions/get-all-bookings.js
import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  const db = neon(process.env.DATABASE_URL);

  try {
    const result = await db`
      SELECT booking_id, name, phone, pickup, dropoff, location, total
      FROM bookings
      ORDER BY timestamp DESC;
    `;

    console.log("✅ Bookings fetched:", result);
    return Response.json({ bookings: result });
  } catch (err) {
    console.error("❌ DB Error:", err);
    return Response.json({ error: "DB fetch failed", details: err.message }, { status: 500 });
  }
};
