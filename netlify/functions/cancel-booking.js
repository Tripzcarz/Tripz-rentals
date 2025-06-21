import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export default async (req, context) => {
  try {
    const { bookingId } = JSON.parse(req.body);

    if (!bookingId) {
      return new Response(JSON.stringify({ error: "Missing bookingId" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Delete from temp_locks table
    await sql`DELETE FROM temp_locks WHERE booking_id = ${bookingId}`;

    // Optionally: Delete the pending booking from bookings table too (if added early)
    // await sql`DELETE FROM bookings WHERE booking_id = ${bookingId} AND payment_verified = false`;

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);
    return new Response(JSON.stringify({ error: "Failed to cancel booking" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
