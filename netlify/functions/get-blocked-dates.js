import { neon } from '@neondatabase/serverless';
const db = neon(process.env.DATABASE_URL);

export default async () => {
  try {
    const result = await db`SELECT date FROM blocked_dates ORDER BY date ASC`;
    
    // Do NOT convert with new Date() or toISOString — just send as is
 const blockedDates = result.map(r => 
  new Date(r.date).toLocaleDateString("sv-SE") // returns YYYY-MM-DD
);
  } catch (err) {
    console.error("❌ get-blocked-dates error:", err);
    return Response.json({ blockedDates: [] });
  }
};


