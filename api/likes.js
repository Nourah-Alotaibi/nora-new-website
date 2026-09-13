import { randomUUID, createHmac, timingSafeEqual } from "node:crypto";
const COOKIE = "nourah_like_visitor";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("Vary", "Cookie");
  if (!["GET", "POST"].includes(req.method)) return res.status(405).json({ error: "Method not allowed" });
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return res.status(503).json({ error: "Likes unavailable" });
  if (req.method === "POST") {
    try { if (new URL(req.headers.origin).host !== req.headers.host) throw new Error(); }
    catch { return res.status(403).json({ error: "Request not allowed" }); }
  }
  const sign = id => createHmac("sha256", key).update(`website-like:${id}`).digest("hex");
  const token = (req.headers.cookie || "").split(";").map(v => v.trim()).find(v => v.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) || "";
  let [id, signature] = token.split(".");
  const valid = UUID.test(id || "") && /^[0-9a-f]{64}$/.test(signature || "") && timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(sign(id), "hex"));
  if (!valid) {
    if (req.method === "POST") return res.status(401).json({ error: "Please refresh and try again" });
    id = randomUUID();
  }
  res.setHeader("Set-Cookie", `${COOKIE}=${id}.${sign(id)}; Path=/api/likes; HttpOnly; SameSite=Lax; Max-Age=34560000${process.env.NODE_ENV === "production" ? "; Secure" : ""}`);
  const headers = { apikey: key, ...(key.startsWith("sb_secret_") ? {} : { Authorization: `Bearer ${key}` }) };
  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/website_likes`;
  const request = (suffix, options = {}) => fetch(endpoint + suffix, { ...options, headers: { ...headers, ...options.headers }, signal: AbortSignal.timeout(10000) });
  try {
    if (req.method === "POST") {
      const saved = await request("?on_conflict=visitor_id", { method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" }, body: JSON.stringify({ visitor_id: id }) });
      if (!saved.ok) throw new Error();
    }
    const [total, own] = await Promise.all([
      request("?select=visitor_id", { method: "HEAD", headers: { Prefer: "count=exact" } }),
      request(`?visitor_id=eq.${id}&select=visitor_id`),
    ]);
    if (!total.ok || !own.ok) throw new Error();
    const count = Number(total.headers.get("content-range")?.split("/")[1]);
    if (!Number.isSafeInteger(count) || count < 0) throw new Error();
    return res.status(200).json({ count: 28 + count, liked: (await own.json()).length > 0 });
  } catch { return res.status(502).json({ error: "Unable to load likes. Please try again." }); }
}
