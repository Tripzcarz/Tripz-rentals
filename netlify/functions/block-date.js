import { neon } from '@neondatabase/serverless';

export default async (req) => {
  const db = neon(process.env.DATABASE_URL);

  try {
    const { start, end } = await req.json();

    console.log("📦 Blocking range:", start, "→", end);

    if (!start || !end) {
      console.warn("❗ Missing start or end date");
      return Response.json({ error: "Missing dates" }, { status: 400 });
    }

    const result = await db`
      INSERT INTO blocked_dates (date)
      SELECT * FROM generate_series(${start}::date, ${end}::date, interval '1 day')::date
      ON CONFLICT DO NOTHING
    `;

    console.log("✅ Blocked result:", result);

    return Response.json({ status: "blocked" });
  } catch (err) {
    console.error("❌ Error inserting blocked dates:", err);
    return Response.json(
      { error: "Block failed", message: err.message, trace: err.stack },
      { status: 500 }
    );
  }
};
