// /netlify/functions/get-booked-dates.js
import { neon } from '@neondatabase/serverless';
const db = neon(process.env.DATABASE_URL);

// ✅ This ensures UTC → Local conversion before extracting yyyy-mm-dd
function getLocalISO(date) {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().split("T")[0];
}

export default async () => {
  try {
    const result = await db`SELECT pickup, dropoff FROM bookings`;
    const bookedDates = [];

    for (const row of result) {
      const start = new Date(row.pickup);
      const end = new Date(row.dropoff);

      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        bookedDates.push(getLocalISO(d));  // ✅ LOCALIZED date
      }
    }

    return Response.json({ bookedDates });
  } catch (err) {
    console.error("❌ get-booked-dates error:", err);
    return Response.json({ bookedDates: [] });
  }
};
