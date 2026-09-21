import { useEffect, useState, lazy, Suspense, type FormEvent } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  KeyRound,
  Moon,
  Sun,
  Sprout,
  Fingerprint,
} from "lucide-react";
import type { SupabaseClient, Session } from "@supabase/supabase-js";
import { useTheme } from "../contexts/ThemeContext";
import { labClient, labApi, type Member } from "../lab/client";
import "../lab/lab.css";
const Workspace = lazy(() => import("../lab/Workspace"));
export default function SecretLab() {
  const { theme, toggleTheme } = useTheme();
  const [client, setClient] = useState<SupabaseClient>();
  const [session, setSession] = useState<Session | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const title = document.title;
    document.title = "Nora × Sara — Secret Lab";
    const robots = document.createElement("meta");
    robots.name = "robots";
    robots.content = "noindex, nofollow, noarchive";
    document.head.append(robots);
    return () => {
      document.title = title;
      robots.remove();
    };
  }, []);
  useEffect(() => {
    let alive = true;
    let generation = 0;
    let unsubscribe = () => {};
    setReady(false);
    setError("");
    labClient()
      .then(async db => {
        if (!alive) return;
        setClient(db);
        const check = async (value: Session | null) => {
          const run = ++generation;
          setMember(null);
          setSession(null);
          setReady(false);
          if (!value) {
            setReady(true);
            return;
          }
          const { data, error: failure } = await db
            .from("lab_members")
            .select("user_id,username")
            .eq("user_id", value.user.id)
            .maybeSingle();
          if (!alive || run !== generation) return;
          if (failure) {
            setError("Unable to verify Lab access. Please retry.");
            setReady(true);
            return;
          }
          if (!data) {
            await db.auth.signOut({ scope: "local" });
            window.location.replace("/");
            return;
          }
          setMember(data as Member);
          setSession(value);
          setReady(true);
        };
        const { data: listener } = db.auth.onAuthStateChange(
          (_event, value) => {
            void check(value);
          }
        );
        unsubscribe = () => listener.subscription.unsubscribe();
      })
      .catch(e => {
        if (alive) {
          setError(e.message);
          setReady(true);
        }
      });
    return () => {
      alive = false;
      generation++;
      unsubscribe();
    };
  }, [retry]);
  async function login(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      const result = await labApi("login", {
        username: form.get("username"),
        password: form.get("password"),
      });
      const { error: failure } = await client!.auth.setSession(result);
      if (failure) throw failure;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="secret-lab" data-theme={theme}>
      <header className="lab-site-header">
        <Link href="/" className="lab-wordmark">
          nourah<span>✳</span>
        </Link>
        <span className="lab-private-label">
          <KeyRound size={13} /> a little room behind the portfolio
        </span>
        <button
          className="lab-icon"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
        </button>
      </header>
      {session && member && client ? (
        <Suspense
          fallback={
            <p className="lab-loading" role="status">
              Opening your workspace…
            </p>
          }
        >
          <Workspace
            client={client}
            session={session}
            member={member}
            onAccessLost={() => {
              setMember(null);
              setSession(null);
              window.location.replace("/");
            }}
          />
        </Suspense>
      ) : (
        <main className="lab-door">
          <section className="lab-door-story">
            <p className="lab-eyebrow">
              <span className="lab-dot" /> TWO MINDS. ONE SECRET ROOM.
            </p>
            <h1>
              A little curious.
              <br />A little chaotic.
              <br />
              <em>Entirely ours.</em>
            </h1>
            <p className="lab-door-description">
              A home for half-formed ideas, rabbit holes worth following, and
              things we’ll make together.
            </p>
            <div className="lab-door-art" aria-hidden="true">
              <div className="lab-orbit" />
              <div className="lab-art-note">
                <span>FIELD NOTE / 001</span>
                <p>
                  what if
                  <br />
                  we tried…
                </p>
                <Sprout size={36} />
              </div>
              <div className="lab-art-stamp">
                N × S<br />
                <small>SECRET LAB</small>
              </div>
              <span className="lab-art-star">✳</span>
              <div className="lab-art-caption">
                good ideas start with a tiny clue ↗
              </div>
            </div>
            <Link href="/" className="lab-back">
              <ArrowLeft size={15} /> Back to Nora’s world
            </Link>
          </section>
          <section className="lab-login-panel">
            <div className="lab-login-top">
              <span>MEMBERS ONLY</span>
              <span>01 / 02</span>
            </div>
            <div className="lab-key">
              <Fingerprint size={32} />
            </div>
            <p className="lab-eyebrow">YOU FOUND THE SECRET DOOR</p>
            <h2>
              Nora <em>×</em> Sara
              <br />
              Secret Lab<span>.</span>
            </h2>
            <p className="lab-muted">
              Your ideas are waiting on the other side.
            </p>
            <form onSubmit={login}>
              <label>
                Username
                <input
                  name="username"
                  autoComplete="username"
                  placeholder="nora or sara"
                  required
                  maxLength={32}
                  disabled={!client || !ready || busy}
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="Our little secret"
                  required
                  maxLength={256}
                  disabled={!client || !ready || busy}
                />
              </label>
              <button
                className="lab-primary"
                disabled={!client || !ready || busy}
              >
                {busy
                  ? "Unlocking…"
                  : !ready
                    ? "Checking the door…"
                    : "Enter the Lab"}
                <ArrowUpRight size={19} />
              </button>
            </form>
            {error && (
              <div className="lab-error" role="alert">
                {error}
                <button onClick={() => setRetry(x => x + 1)}>
                  Retry connection
                </button>
              </div>
            )}
            <p className="lab-login-foot">
              <KeyRound size={12} /> Just Nora & Sara. Just between us.
            </p>
          </section>
        </main>
      )}
    </div>
  );
}
