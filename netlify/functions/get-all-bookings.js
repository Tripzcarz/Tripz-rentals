import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export async function handler() {
  try {
    const result = await sql`SELECT * FROM bookings ORDER BY timestamp DESC;`;
    console.log("✅ Raw result:", result); // 👈 Add this

    return {
      statusCode: 200,
      body: JSON.stringify({ bookings: result.rows })
    };
  } catch (err) {
    console.error("❌ Error fetching bookings:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch bookings" })
    };
  }
}
