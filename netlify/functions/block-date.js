import { neon } from '@neondatabase/serverless';

export default async (req) => {
  const db = neon(process.env.DATABASE_URL);

  try {
    const { start, end } = await req.json();

    if (!start || !end) {
      return Response.json({ error: "Start and end dates are required" }, { status: 400 });
    }

    await db`
      INSERT INTO blocked_dates (date)
      SELECT * FROM generate_series(${start}::date, ${end}::date, interval '1 day')::date
      ON CONFLICT DO NOTHING
    `;

    return Response.json({ status: "blocked" });
  } catch (err) {
    console.error("❌ block-date error:", err);
    return Response.json({ error: "Block failed", message: err.message }, { status: 500 });
  }
};
