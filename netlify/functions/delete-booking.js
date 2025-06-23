// netlify/functions/delete-booking.js
import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  const db = neon(process.env.DATABASE_URL);
  const { bookingId } = await req.json();

  try {
    await db`DELETE FROM bookings WHERE booking_id = ${bookingId}`;
    return Response.json({ status: "deleted" });
  } catch (err) {
    console.error("❌ Error deleting booking:", err);
    return Response.json({ error: "Delete failed", message: err.message }, { status: 500 });
  }
};
