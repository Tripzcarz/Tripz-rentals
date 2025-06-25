// netlify/functions/get-blocked-dates.js
import { neon } from '@neondatabase/serverless';
const db = neon(process.env.DATABASE_URL);

// Convert date to YYYY-MM-DD without UTC shift
function formatYMDLocal(date) {
  return date.toLocaleDateString("sv-SE"); // e.g. "2025-07-07"
}

export default async () => {
  try {
    const result = await db`SELECT date FROM blocked_dates ORDER BY date ASC`;
    const blockedDates = result.map(r => formatYMDLocal(new Date(r.date)));

    return Response.json({ blockedDates });
  } catch (err) {
    console.error("❌ get-blocked-dates error:", err);
    return Response.json({ blockedDates: [] });
  }
};
