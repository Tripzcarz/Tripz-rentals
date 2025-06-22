import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async (req, res) => {
  try {
    const { bookingId } = JSON.parse(req.body);
    if (!bookingId) throw new Error("Missing bookingId");

    await sql`DELETE FROM bookings WHERE booking_id = ${bookingId}`;
    res.status(200).json({ status: "success", message: "Booking deleted." });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ error: "Failed to delete booking" });
  }
};
