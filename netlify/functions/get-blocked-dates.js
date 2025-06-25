import { neon } from '@neondatabase/serverless';
const db = neon(process.env.DATABASE_URL);

export default async () => {
  try {
    const result = await db`SELECT date FROM blocked_dates ORDER BY date ASC`;

    const blockedDates = result.map(r =>
      new Date(r.date).toLocaleDateString("sv-SE")
    );

    return new Response(JSON.stringify({ blockedDates }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("❌ get-blocked-dates error:", err);

    // Failsafe fallback
    return new Response(JSON.stringify({ blockedDates: [] }), {
      headers: { "Content-Type": "application/json" },
      status: 500
    });
  }
};
