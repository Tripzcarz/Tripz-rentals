import { neon } from '@neondatabase/serverless';
const sql = neon(process.env.DATABASE_URL);

export default async (req, res) => {
  try {
    const { dates } = JSON.parse(req.body);
    if (!dates || !Array.isArray(dates)) throw new Error("Invalid input");

    for (let date of dates) {
      await sql`INSERT INTO booked_dates (date) VALUES (${date}) ON CONFLICT DO NOTHING`;
    }

    res.status(200).json({ status: "success", message: "Dates blocked." });
  } catch (err) {
    console.error("Block Error:", err);
    res.status(500).json({ error: "Failed to block dates" });
  }
};
