import { neon } from '@neondatabase/serverless';
const db = neon(process.env.DATABASE_URL);

function formatYMDLocal(date) {
  return date.toLocaleDateString("sv-SE"); // sv-SE gives yyyy-mm-dd in local time
}

export default async () => {
  try {
    const result = await db`SELECT pickup, dropoff FROM bookings`;
    const bookedDates = [];

    for (const row of result) {
      const start = new Date(row.pickup);
      const end = new Date(row.dropoff);

      for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
        bookedDates.push(formatYMDLocal(new Date(d)));
      }
    }

    return Response.json({ bookedDates });
  } catch (err) {
    console.error("❌ get-booked-dates error:", err);
    return Response.json({ bookedDates: [] });
  }
};
