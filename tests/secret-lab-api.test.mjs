import test from "node:test";
import assert from "node:assert/strict";
import handler from "../api/lab.js";
const env = {
  SUPABASE_URL: "https://test.supabase.co",
  SUPABASE_SECRET_KEY: "sb_secret_test",
  SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test",
};
Object.assign(process.env, env);
async function call(action, body = {}, extra = {}) {
  let status = 200,
    output;
  const headers = {};
  const res = {
    setHeader(k, v) {
      headers[k] = v;
    },
    status(s) {
      status = s;
      return this;
    },
    json(v) {
      output = v;
      return this;
    },
  };
  await handler(
    {
      method: action === "config" ? "GET" : "POST",
      query: { action },
      headers: {
        origin: "http://localhost:3014",
        host: "localhost:3014",
        "content-type": "application/json",
        ...extra.headers,
      },
      socket: { remoteAddress: "127.0.0.1" },
      body,
      ...extra,
      headers: {
        origin: "http://localhost:3014",
        host: "localhost:3014",
        "content-type": "application/json",
        ...extra.headers,
      },
    },
    res
  );
  return { status, output, headers };
}
const response = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
test("public config exposes only the publishable key and never the service key", async () => {
  const result = await call("config");
  assert.equal(result.status, 200);
  assert.equal(result.output.key, env.SUPABASE_PUBLISHABLE_KEY);
  assert.ok(!JSON.stringify(result).includes(env.SUPABASE_SECRET_KEY));
  assert.equal(result.headers["Cache-Control"], "private, no-store");
});
test("cross-origin login rejected before upstream access", async () => {
  global.fetch = () => {
    throw Error("must not fetch");
  };
  assert.equal(
    (await call("login", {}, { headers: { origin: "https://evil.test" } }))
      .status,
    403
  );
});
test("malformed JSON is a client error", async () => {
  assert.equal((await call("login", "{bad")).status, 400);
});
test("unknown usernames have a generic rejection", async () => {
  global.fetch = async () => response(true);
  assert.equal(
    (await call("login", { username: "outsider", password: "password" }))
      .status,
    401
  );
});
test("rate limiting fails closed", async () => {
  global.fetch = async () => response(false);
  assert.equal(
    (await call("login", { username: "nora", password: "password" })).status,
    429
  );
});
test("username login maps approved UUID to Supabase auth; returns only session tokens", async () => {
  const calls = [];
  global.fetch = async (url, options) => {
    calls.push([url, options]);
    if (url.includes("lab_take_rate_limit")) return response(true);
    if (url.includes("lab_members"))
      return response([{ user_id: "approved-id" }]);
    if (url.includes("/admin/users"))
      return response({ email: "internal@lab.invalid" });
    return response({
      user: { id: "approved-id" },
      access_token: "access",
      refresh_token: "refresh",
    });
  };
  const result = await call("login", {
    username: "Nora",
    password: "correct password",
  });
  assert.equal(result.status, 200);
  assert.deepEqual(result.output, {
    access_token: "access",
    refresh_token: "refresh",
  });
  assert.equal(JSON.parse(calls.at(-1)[1].body).email, "internal@lab.invalid");
  assert.equal(calls.at(-1)[1].headers.apikey, env.SUPABASE_PUBLISHABLE_KEY);
});
test("wrong password yields generic failure", async () => {
  global.fetch = async url =>
    url.includes("lab_take")
      ? response(true)
      : url.includes("lab_members")
        ? response([{ user_id: "id" }])
        : url.includes("/admin/users")
          ? response({ email: "internal@lab.invalid" })
          : response({}, 400);
  assert.equal(
    (await call("login", { username: "sara", password: "wrong" })).status,
    401
  );
});
test("AI and discovery reject missing auth", async () => {
  for (const action of ["assistant", "discover"])
    assert.equal((await call(action, {})).status, 401);
});
test("authenticated outsiders cannot access AI or discovery", async () => {
  global.fetch = async url =>
    url.includes("/auth/v1/user") ? response({ id: "outsider" }) : response([]);
  for (const action of ["assistant", "discover"])
    assert.equal(
      (await call(action, {}, { headers: { authorization: "Bearer valid" } }))
        .status,
      403
    );
});
test("expired tokens rejected before membership lookup", async () => {
  global.fetch = async () => response({}, 401);
  assert.equal(
    (
      await call(
        "assistant",
        { prompt: "hello" },
        { headers: { authorization: "Bearer expired" } }
      )
    ).status,
    401
  );
});
test("missing AI configuration produces honest unavailable response", async () => {
  delete process.env.GEMINI_API_KEY;
  global.fetch = async url =>
    url.includes("/auth/v1/user")
      ? response({ id: "member" })
      : url.includes("lab_take")
        ? response(true)
        : response([{ user_id: "member" }]);
  assert.equal(
    (
      await call(
        "assistant",
        { prompt: "hello" },
        { headers: { authorization: "Bearer valid" } }
      )
    ).status,
    503
  );
});
test("missing Supabase config fails closed", async () => {
  delete process.env.SUPABASE_URL;
  assert.equal((await call("config")).status, 503);
  Object.assign(process.env, env);
});
