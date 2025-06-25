import { neon } from '@neondatabase/serverless';
const db = neon(process.env.DATABASE_URL);

export default async () => {
  try {
    const result = await db`SELECT pickup, dropoff FROM bookings`;
    const bookedDates = new Set();

    result.forEach(({ pickup, dropoff }) => {
      let curr = new Date(pickup);
      const end = new Date(dropoff);
      while (curr <= end) {
        const iso = curr.toLocaleDateString("sv-SE", { timeZone: "Asia/Kolkata" });
        bookedDates.add(iso);
        curr.setDate(curr.getDate() + 1);
      }
    });

    return Response.json({ bookedDates: Array.from(bookedDates) });
  } catch (err) {
    console.error("❌ get-booked-dates error:", err);
    return Response.json({ bookedDates: [] });
  }
};
