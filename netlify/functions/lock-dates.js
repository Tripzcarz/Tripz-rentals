import { sql } from "@vercel/postgres"; // or your preferred library

export default async (req, res) => {
  const { bookingId, dates } = JSON.parse(req.body);
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

  for (const date of dates) {
    await sql`
      INSERT INTO temp_locks (date, booking_id, expires_at)
      VALUES (${date}, ${bookingId}, ${expiresAt})
      ON CONFLICT (date) DO UPDATE SET booking_id = ${bookingId}, expires_at = ${expiresAt};
    `;
  }

  return res.json({ status: "locked" });
};
