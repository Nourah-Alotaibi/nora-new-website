// Vercel function: the private database credential never reaches the browser.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const url = process.env.SUPABASE_URL;
  const key = (process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY);
  if (!url || !key) return res.status(503).json({ error: "Notes are not connected yet" });
  let data;
  try { data = typeof req.body === "string" ? JSON.parse(req.body) : req.body; }
  catch { return res.status(400).json({ error: "Invalid note" }); }
  if (typeof data?.note !== "string" || !data.note.trim() || data.note.length > 4000 ||
      (data.name !== undefined && (typeof data.name !== "string" || data.name.length > 100)))
    return res.status(400).json({ error: "Invalid note" });
  try {
    const result = await fetch(`${url.replace(/\/$/, "")}/rest/v1/private_notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: key, ...(key.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${key}` }), Prefer: "return=minimal" },
      body: JSON.stringify({ name: data.name?.trim() || null, note: data.note.trim() }),
      signal: AbortSignal.timeout(10000),
    });
    if (!result.ok) return res.status(502).json({ error: "Unable to save note" });
    return res.status(201).json({ saved: true });
  } catch { return res.status(502).json({ error: "Unable to save note" }); }
}
