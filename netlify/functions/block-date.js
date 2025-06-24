import { neon } from '@neondatabase/serverless';

export default async () => {
  const db = neon(process.env.DATABASE_URL);

  try {
    const result = await db`SELECT date FROM blocked_dates ORDER BY date ASC`;
    return Response.json({
      blockedDates: result.map(r => r.date.toISOString().split("T")[0])
    });
  } catch (err) {
    console.error("❌ get-blocked-dates error:", err);
    return Response.json({ blockedDates: [] });
  }
};
