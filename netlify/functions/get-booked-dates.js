import { neon } from '@neondatabase/serverless';
const db = neon(process.env.DATABASE_URL);

function formatYMD(date) {
  return date.toLocaleDateString("sv-SE", { timeZone: "Asia/Kolkata" });
}

export default async () => {
  try {
    const result = await db`SELECT pickup, dropoff FROM bookings`;
    const bookedDates = [];
for (const row of result) {
  let d = new Date(row.pickup);
  const end = new Date(row.dropoff);
  while (d < end) {
    bookedDates.push(formatYMD(d));
    d.setDate(d.getDate() + 1);
  }
}

    return Response.json({ bookedDates });
  } catch (err) {
    console.error("❌ get-booked-dates error:", err);
    return Response.json({ bookedDates: [] });
  }
};



