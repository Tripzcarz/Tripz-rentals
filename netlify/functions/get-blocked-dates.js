// netlify/functions/get-blocked-dates.js
import { neon } from '@neondatabase/serverless';
const db = neon(process.env.DATABASE_URL);

export default async () => {
  try {
    const result = await db`SELECT date FROM blocked_dates ORDER BY date ASC`;
    const blockedDates = result.map(r => r.date.toISOString().split("T")[0]);
    return Response.json({ blockedDates });
  } catch (err) {
    console.error("❌ get-blocked-dates error:", err);
    return Response.json({ blockedDates: [] });
  }
};
