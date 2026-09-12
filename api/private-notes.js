import { createHmac, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
// Per-instance throttle supplements the host's network-level protections.
const attempts = new Map();
const COOKIE = "nourah_notes_session";
const REFRESH_COOKIE = "nourah_notes_refresh";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const notFound = res => res.status(404).json({ error: "Not found" });
function cookie(res, token = "", age = 0, refresh = "") {
  const flags = `HttpOnly; SameSite=Strict; Path=/api/private-notes${process.env.NODE_ENV === "production" ? "; Secure" : ""}`;
  res.setHeader("Set-Cookie", [
    `${COOKIE}=${encodeURIComponent(token)}; ${flags}; Max-Age=${age}`,
    `${REFRESH_COOKIE}=${encodeURIComponent(refresh)}; ${flags}; Max-Age=${refresh ? 2592000 : 0}`,
  ]);
}
function body(req) {
  const value = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid body");
  return value;
}
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("Vary", "Cookie");
  const action = req.query?.action || "session";
  const methods = { session: "GET", login: "POST", logout: "POST", notes: "GET", update: "PATCH", delete: "DELETE" };
  if (!methods[action] || req.method !== methods[action]) return notFound(res);
  // All state changes require a same-origin browser request, including login.
  if (req.method !== "GET") {
    let origin;
    try { origin = new URL(req.headers.origin); } catch { return res.status(403).json({ error: "Request not allowed" }); }
    if (origin.host !== req.headers.host || !["http:", "https:"].includes(origin.protocol) ||
        (process.env.NODE_ENV === "production" && origin.protocol !== "https:"))
      return res.status(403).json({ error: "Request not allowed" });
    if (action !== "logout" && !String(req.headers["content-type"] || "").startsWith("application/json"))
      return res.status(415).json({ error: "Request not allowed" });
  }
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const passcodeHash = process.env.NOTES_PASSCODE_HASH;
  if (!url || !key || !/^[a-f0-9]{32}:[a-f0-9]{128}$/.test(passcodeHash || "")) return action === "login"
    ? res.status(503).json({ error: "Unlocking is unavailable. Try again later." }) : notFound(res);
  // Signing is bound to both secrets: rotating either invalidates existing sessions.
  const sign = value => createHmac('sha256', key).update(passcodeHash + ':' + value).digest('hex');
  const equal = (a, b) => a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
  const request = (path, options = {}) => fetch(`${url}${path}`, {
    ...options, headers: { apikey: key, "Content-Type": "application/json",
      ...(key.startsWith('sb_secret_') ? {} : { Authorization: `Bearer ${key}` }), ...options.headers },
    signal: AbortSignal.timeout(10000),
  });
  try {
    if (action === "login") {
      let data;
      try { data = body(req); } catch { return res.status(400).json({ error: "Unable to unlock." }); }
      if (typeof data.password !== "string" || !data.password || data.password.length > 1024)
        return res.status(400).json({ error: "Unable to unlock." });
      const ip = req.headers['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
      const now = Date.now();
      for (const [address, entry] of attempts) if (entry.until <= now) attempts.delete(address);
      const attempt = attempts.get(ip) || { count: 0, until: now + 900000 };
      if (attempt.count >= 5) {
        res.setHeader('Retry-After', String(Math.ceil((attempt.until - now) / 1000)));
        return res.status(429).json({ error: 'Too many attempts. Please try again later.' });
      }
      attempt.count++;
      attempts.set(ip, attempt);
      const [salt, expected] = passcodeHash.split(':');
      const actual = scryptSync(data.password, salt, 64).toString('hex');
      if (!equal(actual, expected)) return res.status(401).json({ error: "Unable to unlock. Check your passcode or try again later." });
      attempts.delete(ip);
      const payload = `${Math.floor(Date.now() / 1000) + 86400}.${randomBytes(24).toString('hex')}`;
      cookie(res, `${payload}.${sign(payload)}`, 86400);
      return res.status(200).json({ authorized: true });
    }
    if (action === "logout") {
      cookie(res);
      return res.status(200).json({ signedOut: true });
    }
    let token;
    try {
      token = decodeURIComponent((req.headers.cookie || '').split(';').map(x => x.trim()).find(x => x.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1) || '');
    } catch { return notFound(res); }
    const parts = token.split('.');
    if (parts.length !== 3 || !/^\d+$/.test(parts[0]) || !/^[a-f0-9]{48}$/.test(parts[1]) ||
        !/^[a-f0-9]{64}$/.test(parts[2]) || Number(parts[0]) <= Date.now() / 1000 ||
        Number(parts[0]) > Date.now() / 1000 + 86400 || !equal(sign(`${parts[0]}.${parts[1]}`), parts[2])) {
      cookie(res); return notFound(res);
    }
    if (action === "session") return res.status(200).json({ authorized: true });
    if (action === "notes") {
      const filter = req.query.filter || "all";
      const offset = Number(req.query.offset || 0);
      if (!["all", "new", "favorites"].includes(filter) || !Number.isSafeInteger(offset) || offset < 0)
        return res.status(400).json({ error: "Invalid request" });
      const suffix = filter === "new" ? "&is_read=eq.false" : filter === "favorites" ? "&is_favorite=eq.true" : "";
      const [list, total, unread] = await Promise.all([
        request(`/rest/v1/private_notes?select=id,name,note,created_at,is_read,is_favorite&order=created_at.desc,id.desc&limit=51&offset=${offset}${suffix}`, {}, token),
        request("/rest/v1/private_notes?select=id", { method: "HEAD", headers: { Prefer: "count=exact" } }, token),
        request("/rest/v1/private_notes?select=id&is_read=eq.false", { method: "HEAD", headers: { Prefer: "count=exact" } }, token),
      ]);
      if (![list, total, unread].every(r => r.ok)) throw new Error("Database unavailable");
      const rows = await list.json();
      const count = r => Number(r.headers.get("content-range")?.split("/")[1] || 0);
      return res.status(200).json({ notes: rows.slice(0, 50), hasMore: rows.length > 50, total: count(total), unread: count(unread) });
    }
    let data;
    try { data = body(req); } catch { return res.status(400).json({ error: "Invalid request" }); }
    if (!UUID.test(data.id || "")) return res.status(400).json({ error: "Invalid request" });
    if (action === "delete" && data.confirm !== true) return res.status(400).json({ error: "Confirmation required" });
    const changes = {};
    if (action === "update") {
      if (Object.keys(data).some(k => !["id", "is_read", "is_favorite"].includes(k))) return res.status(400).json({ error: "Invalid request" });
      for (const field of ["is_read", "is_favorite"]) {
        if (data[field] !== undefined) {
          if (typeof data[field] !== "boolean") return res.status(400).json({ error: "Invalid request" });
          changes[field] = data[field];
        }
      }
      if (!Object.keys(changes).length) return res.status(400).json({ error: "Invalid request" });
    }
    const response = await request(`/rest/v1/private_notes?id=eq.${data.id}`, {
      method: action === "delete" ? "DELETE" : "PATCH", headers: { Prefer: "return=representation" },
      ...(action === "update" ? { body: JSON.stringify(changes) } : {}),
    }, token);
    if (!response.ok) throw new Error("Database unavailable");
    const rows = await response.json();
    if (!rows.length) return notFound(res);
    return res.status(200).json(action === "delete" ? { deleted: true } : { note: rows[0] });
  } catch {
    return res.status(502).json({ error: "Unable to connect. Please try again." });
  }
}
