import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL);

export default async (req, context) => {
  try {
    const result = await sql`SELECT pickup, dropoff FROM bookings`;
    const bookedDates = [];

    for (const row of result) {
      const d1 = new Date(row.pickup);
      const d2 = new Date(row.dropoff);
      for (let d = new Date(d1); d <= d2; d.setDate(d.getDate() + 1)) {
        bookedDates.push(d.toISOString().split('T')[0]);
      }
    }

    return new Response(JSON.stringify({ bookedDates }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Failed to get booked dates", err);
    return new Response(JSON.stringify({ error: "Failed to load dates" }), {
      status: 500
    });
  }
};
