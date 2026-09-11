// Owner-only management of the existing private_notes table.
// Use the publishable key + verified user's JWT so Supabase RLS remains active.
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
  const key = process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  const admin = process.env.NOTES_ADMIN_USER_ID;
  if (!url || !key || !UUID.test(admin || "")) return action === "login"
    ? res.status(503).json({ error: "Unlocking is unavailable. Try again later." }) : notFound(res);
  const request = (path, options = {}, token) => fetch(`${url}${path}`, {
    ...options, headers: { apikey: key, "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
    signal: AbortSignal.timeout(10000),
  });
  try {
    if (action === "login") {
      let data;
      try { data = body(req); } catch { return res.status(400).json({ error: "Unable to unlock." }); }
      const email = process.env.NOTES_ADMIN_EMAIL;
      if (!email) return res.status(503).json({ error: "Unlocking is unavailable. Try again later." });
      if (typeof data.password !== "string" || !data.password || data.password.length > 1024)
        return res.status(400).json({ error: "Unable to unlock." });
      const response = await request("/auth/v1/token?grant_type=password", { method: "POST", body: JSON.stringify({ email, password: data.password }) });
      if (!response.ok) return res.status(response.status === 429 ? 429 : 401).json({ error: "Unable to unlock. Check your passcode or try again later." });
      const session = await response.json();
      if (session.user?.id !== admin || typeof session.access_token !== "string") {
        // Do not leave an unauthorized session active after a valid password login.
        if (session.access_token) await request("/auth/v1/logout?scope=local", { method: "POST" }, session.access_token);
        cookie(res);
        return res.status(401).json({ error: "Unable to unlock. Check your passcode or try again later." });
      }
      cookie(res, session.access_token, Math.max(1, Math.min(3600, Number(session.expires_in) || 3600)), session.refresh_token);
      return res.status(200).json({ authorized: true });
    }
    let token, refresh;
    try {
      const read = name => decodeURIComponent((req.headers.cookie || "").split(";").map(x => x.trim()).find(x => x.startsWith(`${name}=`))?.slice(name.length + 1) || "");
      token = read(COOKIE); refresh = read(REFRESH_COOKIE);
    }
    catch { return notFound(res); }
    if (action === "logout") {
      cookie(res);
      if (!token && refresh) {
        const response = await request("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: refresh }) });
        if (response.ok) token = (await response.json()).access_token;
      }
      if (token) await request("/auth/v1/logout?scope=local", { method: "POST" }, token);
      return res.status(200).json({ signedOut: true });
    }
    // Never trust a decoded JWT, browser flag, email, or user-submitted ID.
    let user = token ? await request("/auth/v1/user", {}, token) : null;
    if ((!user || user.status === 401 || user.status === 403) && refresh) {
      const response = await request("/auth/v1/token?grant_type=refresh_token", { method: "POST", body: JSON.stringify({ refresh_token: refresh }) });
      if (!response.ok) {
        if (response.status >= 500 || response.status === 429) return res.status(502).json({ error: "Unable to connect. Please try again." });
        cookie(res); return notFound(res);
      }
      const session = await response.json();
      if (session.user?.id !== admin || !session.access_token || !session.refresh_token) { cookie(res); return notFound(res); }
      token = session.access_token;
      user = await request("/auth/v1/user", {}, token);
      if (user.ok) cookie(res, token, Math.max(1, Math.min(3600, Number(session.expires_in) || 3600)), session.refresh_token);
    }
    if (!user) return notFound(res);
    if (!user.ok) {
      if (user.status >= 500) return res.status(502).json({ error: "Unable to connect. Please try again." });
      cookie(res); return notFound(res);
    }
    if ((await user.json()).id !== admin) { cookie(res); return notFound(res); }
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
