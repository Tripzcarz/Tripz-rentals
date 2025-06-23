// netlify/functions/get-all-bookings.js
import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export async function handler(event, context) {
  try {
    const result = await sql`SELECT booking_id, name, phone, pickup, dropoff, location, total FROM bookings ORDER BY timestamp DESC;`;

    console.log("✅ Bookings fetched:", result);         // Logs full object
    console.log("✅ Rows:", result.rows);                 // Logs rows array

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookings: result.rows || [] })  // SAFEGUARD
    };
  } catch (err) {
    console.error("❌ DB Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch bookings" })
    };
  }
}
