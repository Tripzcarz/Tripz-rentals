import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async (req, res) => {
  try {
    const result = await sql`SELECT date FROM bookings`;
    const bookedDates = result.map(row => row.date.toISOString().split('T')[0]);

    return new Response(JSON.stringify({ bookedDates }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Failed to load dates" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
