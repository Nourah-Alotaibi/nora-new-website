import { createHmac } from "node:crypto";
const unavailable =
  "The Lab is not connected yet. Please try again after setup.";
const json = async response => {
  const value = await response.json();
  if (!response.ok) throw new Error("Upstream request failed");
  return value;
};
function isPublishableKey(key) {
  if (key?.startsWith("sb_publishable_")) return true;
  try {
    return (
      JSON.parse(Buffer.from(key.split(".")[1], "base64url").toString())
        .role === "anon"
    );
  } catch {
    return false;
  }
}
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  const action = req.query?.action;
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const secret =
    process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const key =
    process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !secret || !isPublishableKey(key))
    return res.status(503).json({ error: unavailable });
  const request = (path, options = {}, admin = false) =>
    fetch(`${url}${path}`, {
      ...options,
      headers: {
        apikey: admin ? secret : key,
        "Content-Type": "application/json",
        ...(admin && !secret.startsWith("sb_secret_")
          ? { Authorization: `Bearer ${secret}` }
          : {}),
        ...options.headers,
      },
      signal: AbortSignal.timeout(12000),
    });
  try {
    if (action === "config" && req.method === "GET")
      return res.status(200).json({ url, key });
    if (
      req.method !== "POST" ||
      !["login", "assistant", "discover"].includes(action)
    )
      return res.status(404).json({ error: "Not found" });
    let origin;
    try {
      origin = new URL(req.headers.origin);
    } catch {
      return res.status(403).json({ error: "Request not allowed" });
    }
    if (
      origin.host !== req.headers.host ||
      !["https:", "http:"].includes(origin.protocol) ||
      (process.env.NODE_ENV === "production" && origin.protocol !== "https:")
    )
      return res.status(403).json({ error: "Request not allowed" });
    if (
      !String(req.headers["content-type"] || "").startsWith("application/json")
    )
      return res.status(415).json({ error: "JSON required" });
    let body;
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    } catch {
      return res.status(400).json({ error: "Invalid request" });
    }
    if (
      !body ||
      Array.isArray(body) ||
      typeof body !== "object" ||
      JSON.stringify(body).length > 10000
    )
      return res.status(400).json({ error: "Invalid request" });
    const limit = async (bucket, max, seconds) =>
      json(
        await request(
          "/rest/v1/rpc/lab_take_rate_limit",
          {
            method: "POST",
            body: JSON.stringify({
              bucket,
              max_hits: max,
              window_seconds: seconds,
            }),
          },
          true
        )
      );
    if (action === "login") {
      const username =
        typeof body.username === "string"
          ? body.username.trim().toLowerCase()
          : "";
      const password = body.password;
      const ip =
        req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
      const digest = createHmac("sha256", secret)
        .update(String(ip))
        .digest("hex");
      if (!(await limit(`login:${digest}`, 10, 900))) {
        res.setHeader("Retry-After", "900");
        return res.status(429).json({
          error: "Too many attempts. Please try again in 15 minutes.",
        });
      }
      if (
        !["nora", "sara"].includes(username) ||
        typeof password !== "string" ||
        !password ||
        password.length > 256
      )
        return res
          .status(401)
          .json({ error: "Username or password is incorrect." });
      const rows = await json(
        await request(
          `/rest/v1/lab_members?username=eq.${username}&select=user_id`,
          {},
          true
        )
      );
      if (rows.length !== 1)
        return res
          .status(401)
          .json({ error: "Username or password is incorrect." });
      const user = await json(
        await request(`/auth/v1/admin/users/${rows[0].user_id}`, {}, true)
      );
      const auth = await request("/auth/v1/token?grant_type=password", {
        method: "POST",
        body: JSON.stringify({ email: user.email, password }),
      });
      if (!auth.ok)
        return res
          .status(401)
          .json({ error: "Username or password is incorrect." });
      const token = await auth.json();
      if (token.user?.id !== rows[0].user_id)
        return res.status(403).json({ error: "Access denied." });
      return res.status(200).json({
        access_token: token.access_token,
        refresh_token: token.refresh_token,
      });
    }
    const authorization = req.headers.authorization;
    if (!/^Bearer [A-Za-z0-9._-]+$/.test(authorization || ""))
      return res.status(401).json({ error: "Please sign in again." });
    const auth = await request("/auth/v1/user", {
      headers: { Authorization: authorization },
    });
    if (!auth.ok)
      return res.status(401).json({ error: "Please sign in again." });
    const user = await auth.json();
    const members = await json(
      await request(
        `/rest/v1/lab_members?user_id=eq.${encodeURIComponent(user.id)}&select=user_id`,
        { headers: { Authorization: authorization } }
      )
    );
    if (!members.length)
      return res.status(403).json({ error: "Access denied." });
    if (
      !(await limit(
        `${action}:${user.id}`,
        action === "assistant" ? 20 : 40,
        3600
      ))
    )
      return res.status(429).json({
        error: "That’s a lot of exploring. Please try again in an hour.",
      });
    if (action === "assistant") {
      if (!process.env.GEMINI_API_KEY || !process.env.GEMINI_MODEL)
        return res.status(503).json({
          error:
            "Gemini is not connected yet. Add its API key and model in the site environment.",
        });
      if (
        typeof body.prompt !== "string" ||
        !body.prompt.trim() ||
        body.prompt.length > 4000
      )
        return res
          .status(400)
          .json({ error: "Write a question of up to 4,000 characters." });
      const model = process.env.GEMINI_MODEL;
      if (!/^[a-zA-Z0-9._-]+$/.test(model))
        return res
          .status(503)
          .json({ error: "Gemini configuration needs attention." });
      const result = await json(
        await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": process.env.GEMINI_API_KEY,
            },
            body: JSON.stringify({
              systemInstruction: {
                parts: [
                  {
                    text: "You are the friendly creative thinking partner in Nora and Sara’s private lab. Help brainstorm, plan projects, and connect ideas. You cannot access or change their workspace. Be concise and truthful about this.",
                  },
                ],
              },
              contents: [{ role: "user", parts: [{ text: body.prompt }] }],
              generationConfig: { maxOutputTokens: 1500 },
            }),
            signal: AbortSignal.timeout(25000),
          }
        )
      );
      const text = result.candidates?.[0]?.content?.parts
        ?.map(p => p.text || "")
        .join("");
      return res.status(200).json({
        text: text || "I could not answer that question. Try rephrasing it.",
      });
    }
    if (
      typeof body.query !== "string" ||
      !body.query.trim() ||
      body.query.length > 150 ||
      !["github", "youtube"].includes(body.source)
    )
      return res
        .status(400)
        .json({ error: "Enter a search of up to 150 characters." });
    const q = encodeURIComponent(body.query);
    if (body.source === "github") {
      const result = await json(
        await fetch(
          `https://api.github.com/search/repositories?q=${q}&per_page=6&sort=stars`,
          {
            headers: {
              Accept: "application/vnd.github+json",
              "User-Agent": "Nora-Sara-Lab",
              ...(process.env.GITHUB_DISCOVERY_TOKEN
                ? {
                    Authorization: `Bearer ${process.env.GITHUB_DISCOVERY_TOKEN}`,
                  }
                : {}),
            },
            signal: AbortSignal.timeout(12000),
          }
        )
      );
      return res.status(200).json({
        items: result.items.map(i => ({
          title: i.full_name,
          url: i.html_url,
          description: (i.description || "").slice(0, 500),
        })),
      });
    }
    if (!process.env.YOUTUBE_API_KEY)
      return res.status(503).json({
        error:
          "YouTube discovery needs a YouTube Data API key in the site environment. You can still save YouTube links manually.",
      });
    const result = await json(
      await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=6&q=${q}&key=${encodeURIComponent(process.env.YOUTUBE_API_KEY)}`,
        { signal: AbortSignal.timeout(12000) }
      )
    );
    return res.status(200).json({
      items: result.items.map(i => ({
        title: i.snippet.title,
        url: `https://www.youtube.com/watch?v=${encodeURIComponent(i.id.videoId)}`,
        description: i.snippet.description,
      })),
    });
  } catch {
    return res.status(503).json({
      error:
        action === "login"
          ? "Unable to sign in right now. Please try again."
          : "This connection is unavailable right now. Please try again.",
    });
  }
}
