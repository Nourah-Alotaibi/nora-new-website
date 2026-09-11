import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import "./privateNotes.css";

export const NOTES_ROUTE = "/n-1350c3164f9571a92386ede205b5e6e17aa891a12291d21a";
export const SIGN_IN_ROUTE = "/s-20bbf1274fbb9e796eb540bad32c3931ae0dd27ebf3dee27";
type Note = { id: string; name: string | null; note: string; created_at: string; is_read: boolean; is_favorite: boolean };
type Filter = "all" | "new" | "favorites";
class SessionEnded extends Error {}
async function api(action: string, method = "GET", data?: unknown, query = "") {
  const response = await fetch(`/api/private-notes?action=${action}${query}`, {
    method, credentials: "same-origin", cache: "no-store",
    ...(data ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) } : {}),
  });
  if ((response.status === 404 || response.status === 401) && action !== "login") throw new SessionEnded();
  if (!response.ok) throw new Error(action === "login" ? "Unable to unlock. Check your passcode or try again later." : "Couldn’t connect. Please try again.");
  return response.json();
}
const date = (value: string) => new Date(value).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

export default function PrivateNotes() {
  const signingIn = location.pathname === SIGN_IN_ROUTE;
  const { theme, toggleTheme } = useTheme();
  const [auth, setAuth] = useState<"checking" | "out" | "in" | "error">("checking");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [counts, setCounts] = useState({ total: 0, unread: 0 });
  const [more, setMore] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Note | null>(null);
  const [expired, setExpired] = useState(false);
  const confirmation = useRef<HTMLDialogElement>(null);
  const detailHeading = useRef<HTMLHeadingElement>(null);
  const generation = useRef(0);
  const selectedTrigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const previous = document.title;
    const meta = document.createElement("meta");
    meta.name = "robots"; meta.content = "noindex, nofollow, noarchive";
    document.head.appendChild(meta);
    return () => { meta.remove(); document.title = previous; };
  }, []);
  useEffect(() => { document.title = auth === "in" ? "Nourah’s Notes 📝" : "Unlock"; }, [auth]);
  function fail(reason: unknown) {
    if (reason instanceof SessionEnded) {
      generation.current++; setNotes([]); setSelected(null); setAuth("out"); setExpired(true); setError("");
      confirmation.current?.close();
    } else setError(reason instanceof Error ? reason.message : "Couldn’t connect. Please try again.");
  }
  async function check() {
    setAuth("checking"); setError("");
    try { await api("session"); setAuth("in"); }
    catch (reason) { setAuth(reason instanceof SessionEnded ? "out" : "error"); }
  }
  useEffect(() => { void check(); }, []);
  async function load(append = false) {
    const current = ++generation.current;
    setLoading(true); setError("");
    try {
      const data = await api("notes", "GET", undefined, `&filter=${filter}&offset=${append ? notes.length : 0}`);
      if (generation.current !== current) return;
      setNotes(old => append ? [...old, ...data.notes] : data.notes);
      setCounts({ total: data.total, unread: data.unread }); setMore(data.hasMore);
    } catch (reason) { if (generation.current === current) fail(reason); }
    finally { if (generation.current === current) setLoading(false); }
  }
  useEffect(() => { if (auth === "in") { setNotes([]); void load(); } }, [auth, filter]);
  useEffect(() => {
    if (auth !== "in") return;
    // Recheck when returning to the app and while it remains open.
    const verify = () => { if (document.visibilityState === "visible") void api("session").catch(fail); };
    const interval = window.setInterval(verify, 60000);
    document.addEventListener("visibilitychange", verify);
    return () => { clearInterval(interval); document.removeEventListener("visibilitychange", verify); };
  }, [auth]);
  useEffect(() => { if (selected) { window.scrollTo(0, 0); detailHeading.current?.focus(); } }, [selected?.id]);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy) return;
    setBusy(true); setError("");
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      await api("login", "POST", { password: data.get("password") });
      form.reset(); setExpired(false);
      if (signingIn) location.replace(NOTES_ROUTE); else setAuth("in");
    } catch (reason) { fail(reason); }
    finally { setBusy(false); }
  }
  async function signOut() {
    setBusy(true); setError("");
    try { await api("logout", "POST"); setNotes([]); setSelected(null); setAuth("out"); }
    catch (reason) { fail(reason); }
    finally { setBusy(false); }
  }
  async function update(field: "is_read" | "is_favorite") {
    if (!selected || busy) return;
    setBusy(true); setError("");
    try {
      const data = await api("update", "PATCH", { id: selected.id, [field]: !selected[field] });
      setSelected(data.note); await load();
    } catch (reason) { fail(reason); }
    finally { setBusy(false); }
  }
  async function remove() {
    if (!selected || busy) return;
    setBusy(true); setError("");
    try { await api("delete", "DELETE", { id: selected.id, confirm: true }); confirmation.current?.close(); setSelected(null); await load(); }
    catch (reason) { confirmation.current?.close(); fail(reason); }
    finally { setBusy(false); }
  }
  return <main className={`owner-notes ${theme === "dark" ? "owner-night" : ""}`}>
    {auth !== "in" ? <div className="owner-entry">
      <>
        <h1>A little key.</h1>
        {auth === "checking" && <p role="status">Opening…</p>}
        {expired && <p className="owner-muted">Enter your passcode again to continue.</p>}
        <form onSubmit={login}>
          <label htmlFor="owner-password">Passcode</label><input id="owner-password" name="password" type="password" autoComplete="current-password" required maxLength={1024} />
          {error && <p role="alert">{error}</p>}
          <button disabled={busy || auth === "checking"}>{busy ? "Opening…" : "Open"}</button>
        </form>
        {auth === "error" && <button onClick={check}>Retry</button>}
      </>
    </div> : <div className="owner-shell">
      <header className="owner-header">
        <div><span className="owner-eyebrow">A little space for your visitors’ thoughts</span><h1>Nourah’s Notes 📝</h1><p>{counts.total} {counts.total === 1 ? "note" : "notes"} · {counts.unread} unread</p></div>
        <div className="owner-utilities"><button onClick={toggleTheme} aria-label={`Use ${theme === "light" ? "dark" : "light"} mode`}>{theme === "light" ? "☾" : "☀"}</button><button onClick={signOut} disabled={busy}>Lock</button></div>
      </header>
      {error && <div className="owner-error" role="alert">{error} <button onClick={() => load()} disabled={loading}>Try again</button></div>}
      {selected ? <article className="owner-detail">
        <button className="owner-back" onClick={() => { setSelected(null); requestAnimationFrame(() => selectedTrigger.current?.focus()); }}>← All notes</button>
        <div className="owner-detail-heading"><h2 ref={detailHeading} tabIndex={-1}>{selected.name || "Anonymous"}</h2><time dateTime={selected.created_at}>{date(selected.created_at)}</time></div>
        <div className="owner-status"><span>{selected.is_read ? "Read" : "New · Unread"}</span><span>{selected.is_favorite ? "★ Favorite" : "Not favorited"}</span></div>
        <p className="owner-full-message">{selected.note}</p>
        <div className="owner-actions">
          <button disabled={busy} onClick={() => update("is_read")}>{selected.is_read ? "Mark unread" : "Mark read"}</button>
          <button disabled={busy} onClick={() => update("is_favorite")}>{selected.is_favorite ? "Unfavorite" : "Favorite"}</button>
          <button className="owner-delete" disabled={busy} onClick={() => confirmation.current?.showModal()}>Delete</button>
        </div>
      </article> : <>
        <div className="owner-filters" aria-label="Filter notes">{(["all", "new", "favorites"] as Filter[]).map(value => <button key={value} aria-pressed={filter === value} onClick={() => setFilter(value)}>{value === "all" ? "All" : value === "new" ? "New" : "Favorites"}</button>)}<button className="owner-refresh" onClick={() => load()} disabled={loading}>Refresh</button></div>
        {loading && <p role="status" className="owner-muted">Gathering your notes…</p>}
        {!loading && !error && notes.length === 0 && <div className="owner-empty"><span aria-hidden="true">✉</span><h2>{filter === "all" ? "No notes yet." : filter === "new" ? "You’re all caught up." : "No favorites yet."}</h2></div>}
        <div className="owner-cards">{notes.map(note => <button className={`owner-card ${!note.is_read ? "owner-unread" : ""}`} key={note.id} onClick={event => { selectedTrigger.current = event.currentTarget; setSelected(note); }}>
          <span className="owner-card-top"><strong>{note.name || "Anonymous"}</strong><span className="owner-badges">{!note.is_read && <span>New</span>}{note.is_favorite && <span aria-label="Favorite">★</span>}</span></span>
          <span className="owner-preview">{note.note}</span><time dateTime={note.created_at}>{date(note.created_at)}</time>
        </button>)}</div>
        {more && <button className="owner-more" disabled={loading} onClick={() => load(true)}>Load more</button>}
      </>}
      <dialog ref={confirmation} className="owner-confirm" aria-labelledby="owner-delete-heading" onCancel={event => { if (busy) event.preventDefault(); }}
        onKeyDown={event => { if (event.key === "Tab") {
          const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
          if (!buttons.length) { event.preventDefault(); return; }
          if (event.shiftKey && document.activeElement === buttons[0]) { event.preventDefault(); buttons[buttons.length - 1].focus(); }
          else if (!event.shiftKey && document.activeElement === buttons[buttons.length - 1]) { event.preventDefault(); buttons[0].focus(); }
        } }}>
        <h2 id="owner-delete-heading">Delete this note?</h2><p>This can’t be undone.</p>
        <div className="owner-actions"><button autoFocus disabled={busy} onClick={() => confirmation.current?.close()}>Cancel</button><button className="owner-delete" disabled={busy} onClick={remove}>{busy ? "Deleting…" : "Delete"}</button></div>
      </dialog>
    </div>}
  </main>;
}
