import { neon } from '@neondatabase/serverless';
const db = neon(process.env.DATABASE_URL);

export default async (req) => {
  try {
    const { start, end } = await req.json();

    console.log("📦 Blocking range:", start, "→", end);

    if (!start || !end) {
      return Response.json({ error: "Start and end dates required" }, { status: 400 });
    }

    const sql = `
      INSERT INTO blocked_dates (date)
      SELECT * FROM generate_series('${start}'::date, '${end}'::date, interval '1 day')
      ON CONFLICT DO NOTHING;
    `;

    await db(sql);

    console.log("✅ Dates blocked successfully");
    return Response.json({ status: "blocked" });
  } catch (err) {
    console.error("❌ Error inserting blocked dates:", err);
    return Response.json({ error: "Block failed", message: err.message }, { status: 500 });
  }
};
