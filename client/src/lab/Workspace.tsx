import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import type { Session, SupabaseClient } from "@supabase/supabase-js";
import {
  ArrowUpRight,
  Check,
  FlaskConical,
  Folder,
  LayoutDashboard,
  Search,
  StickyNote,
  Columns3,
  CalendarDays,
  BookOpen,
  ShoppingBag,
  Plus,
  LogOut,
  Sparkles,
  X,
  Pencil,
  Trash2,
  Link2,
  Send,
  RefreshCw,
} from "lucide-react";
import { labApi, safeUrl, type Item, type Member, type Edge } from "./client";
import Board from "./Board";
const views = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Detective", icon: Search },
  { name: "Sticky notes", icon: StickyNote },
  { name: "Cases", icon: Folder },
  { name: "Kanban", icon: Columns3 },
  { name: "Timeline", icon: CalendarDays },
  { name: "Resources", icon: BookOpen },
  { name: "Shopping", icon: ShoppingBag },
];
const labels = {
  note: "Sticky note",
  case: "Case",
  task: "Task",
  resource: "Resource",
  shopping: "Shopping item",
};
const stages = {
  idea: "On the radar",
  doing: "In the works",
  done: "Case closed",
};
const blank = (kind: Item["kind"]): Partial<Item> => ({
  kind,
  title: "",
  body: "",
  status: "idea",
  color: "sage",
  url: "",
  due_date: null,
  parent_id: null,
});
export default function Workspace({
  client,
  session,
  member,
  onAccessLost,
}: {
  client: SupabaseClient;
  session: Session;
  member: Member;
  onAccessLost: () => void;
}) {
  const [view, setView] = useState("Board");
  const [items, setItems] = useState<Item[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState("Connecting");
  const [query, setQuery] = useState("");
  const [caseId, setCaseId] = useState("");
  const [draft, setDraft] = useState<Partial<Item> | null>(null);
  const [saving, setSaving] = useState(false);
  const [assistant, setAssistant] = useState(false);
  const [messages, setMessages] = useState<{ role: string; text: string }[]>(
    []
  );
  const [asking, setAsking] = useState(false);
  const [discovery, setDiscovery] = useState<
    { title: string; url: string; description: string }[]
  >([]);
  const [discovering, setDiscovering] = useState(false);
  const [linkFrom, setLinkFrom] = useState("");
  const [linkTo, setLinkTo] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const sequence = useRef(0);
  const alive = useRef(true);
  const refresh = useCallback(async () => {
    const run = ++sequence.current;
    const result = await client.from("lab_members").select("user_id,username");
    if (!alive.current || run !== sequence.current) return;
    if (result.error) {
      setError("Could not verify access. Reconnect to load your Lab.");
      setItems([]);
      setEdges([]);
      setLoading(false);
      return;
    }
    if (!result.data?.some(m => m.user_id === session.user.id)) {
      setItems([]);
      setEdges([]);
      onAccessLost();
      return;
    }
    const [records, links] = await Promise.all([
      client
        .from("lab_items")
        .select("*")
        .eq("deleted", false)
        .order("created_at", { ascending: false }),
      client.from("lab_edges").select("*").eq("deleted", false),
    ]);
    if (!alive.current || run !== sequence.current) return;
    if (records.error || links.error) {
      setError(
        "The Lab could not sync. Your edits have not been lost. Try refreshing."
      );
      setLoading(false);
      return;
    }
    setMembers(result.data as Member[]);
    setItems(records.data as Item[]);
    setEdges(links.data as Edge[]);
    setLoading(false);
  }, [client, session.user.id]);
  useEffect(() => {
    alive.current = true;
    void refresh();
    const channel = client
      .channel("nora-sara-lab")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lab_items" },
        () => void refresh()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lab_edges" },
        () => void refresh()
      )
      .subscribe(status => {
        if (alive.current)
          setConnection(
            status === "SUBSCRIBED"
              ? "Live sync"
              : status === "CHANNEL_ERROR" || status === "TIMED_OUT"
                ? "Reconnecting"
                : "Connecting"
          );
      });
    const timer = window.setInterval(() => void refresh(), 30000);
    const focus = () => {
      if (!document.hidden) void refresh();
    };
    document.addEventListener("visibilitychange", focus);
    return () => {
      alive.current = false;
      sequence.current++;
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", focus);
      void client.removeChannel(channel);
    };
  }, [client, refresh]);
  useEffect(() => {
    if (draft) {
      setConfirmDelete(false);
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [draft]);
  const author = (id: string) =>
    members.find(m => m.user_id === id)?.username || "Lab member";
  const filtered = items.filter(
    i =>
      (!caseId || i.id === caseId || i.parent_id === caseId) &&
      `${i.title} ${i.body}`.toLowerCase().includes(query.toLowerCase())
  );
  const cases = items.filter(i => i.kind === "case");
  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!draft || saving) return;
    setSaving(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const changes = {
      kind: form.get("kind"),
      title: String(form.get("title")).trim(),
      body: String(form.get("body") || ""),
      status: form.get("status"),
      color: form.get("color"),
      due_date: form.get("due_date") || null,
      url: String(form.get("url") || ""),
      parent_id: form.get("parent_id") || null,
    };
    if (changes.url && !safeUrl(changes.url)) {
      setError("Use a complete http or https link.");
      setSaving(false);
      return;
    }
    const result = draft.id
      ? await client
          .from("lab_items")
          .update(changes)
          .eq("id", draft.id)
          .eq("version", draft.version)
          .select("id")
      : await client.from("lab_items").insert(changes).select("id");
    setSaving(false);
    if (result.error) {
      setError("Could not save. Check your connection and try again.");
      return;
    }
    if (!result.data?.length) {
      setError(
        "This item changed in the other workspace. Close this editor and reopen the updated item before saving."
      );
      await refresh();
      return;
    }
    setDraft(null);
    await refresh();
  }
  async function update(item: Item, changes: Partial<Item>) {
    const { data, error: failure } = await client
      .from("lab_items")
      .update(changes)
      .eq("id", item.id)
      .eq("version", item.version)
      .select("id");
    if (failure || !data?.length)
      setError(
        "Could not update: it may have changed in the other workspace. Refresh and try again."
      );
    await refresh();
    return !failure && !!data?.length;
  }
  async function link() {
    if (!linkFrom || !linkTo || linkFrom === linkTo) return;
    const { error: failure } = await client
      .from("lab_edges")
      .insert({ source_id: linkFrom, target_id: linkTo });
    if (failure)
      setError("Could not connect those clues. They may already be connected.");
    else {
      setLinkFrom("");
      setLinkTo("");
    }
    await refresh();
  }
  async function ask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (asking) return;
    const form = e.currentTarget;
    const prompt = String(new FormData(form).get("prompt")).trim();
    if (!prompt) return;
    setMessages(m => [...m, { role: "You", text: prompt }]);
    form.reset();
    setAsking(true);
    try {
      const { data } = await client.auth.getSession();
      const result = await labApi(
        "assistant",
        { prompt },
        data.session?.access_token
      );
      if (alive.current)
        setMessages(m => [...m, { role: "Gemini", text: result.text }]);
    } catch (e) {
      if (alive.current)
        setMessages(m => [
          ...m,
          {
            role: "Notice",
            text: e instanceof Error ? e.message : "Assistant unavailable.",
          },
        ]);
    } finally {
      setAsking(false);
    }
  }
  async function discover(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setDiscovering(true);
    setError("");
    try {
      const { data } = await client.auth.getSession();
      const result = await labApi(
        "discover",
        { source: form.get("source"), query: form.get("query") },
        data.session?.access_token
      );
      setDiscovery(result.items);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search unavailable.");
    } finally {
      setDiscovering(false);
    }
  }
  function card(item: Item) {
    return (
      <article key={item.id} className={`lab-card lab-paper-${item.color}`}>
        <div className="lab-card-type">
          <span>{labels[item.kind]}</span>
          <button
            className="lab-icon"
            aria-label={`Edit ${item.title}`}
            onClick={() => setDraft(item)}
          >
            <Pencil size={14} />
          </button>
        </div>
        <h3>{item.title}</h3>
        {item.body && <p className="lab-card-body">{item.body}</p>}
        {item.url && safeUrl(item.url) && (
          <a
            className="lab-text-link"
            href={safeUrl(item.url)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Open resource <ArrowUpRight size={14} />
          </a>
        )}
        <footer>
          <span className="lab-by">
            <b>{author(item.created_by).slice(0, 1).toUpperCase()}</b>
            {author(item.created_by)}
          </span>
          <span>
            {item.due_date
              ? new Date(item.due_date + "T12:00:00").toLocaleDateString(
                  undefined,
                  { month: "short", day: "numeric" }
                )
              : stages[item.status]}
          </span>
        </footer>
        {(view === "Kanban" || item.kind === "shopping") && (
          <label className="lab-status-select">
            Progress
            <select
              aria-label={`Status of ${item.title}`}
              value={item.status}
              onChange={e =>
                void update(item, { status: e.target.value as Item["status"] })
              }
            >
              {Object.entries(stages).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
            </select>
          </label>
        )}
      </article>
    );
  }
  function grid(list: Item[], empty: string) {
    return list.length ? (
      <div className="lab-grid">{list.map(card)}</div>
    ) : (
      <div className="lab-empty">
        <SproutMark />
        <h3>{empty}</h3>
        <p>A tiny thought is a perfectly good place to start.</p>
        <button
          className="lab-secondary"
          onClick={() =>
            setDraft(
              blank(
                view === "Cases"
                  ? "case"
                  : view === "Shopping"
                    ? "shopping"
                    : view === "Resources"
                      ? "resource"
                      : view === "Kanban"
                        ? "task"
                        : "note"
              )
            )
          }
        >
          <Plus size={16} /> Add the first one
        </button>
      </div>
    );
  }
  return (
    <div className={`lab-layout ${view === "Board" ? "lab-board-view" : ""}`}>
      <aside className="lab-sidebar">
        <div className="lab-brand">
          <div>
            <FlaskConical size={22} />
          </div>
          <span>
            Nora × Sara<small>THE SECRET LAB</small>
          </span>
        </div>
        <p className="lab-eyebrow">OUR LITTLE UNIVERSE</p>
        <nav aria-label="Lab workspace">
          {[
            { name: "Board", icon: StickyNote },
            { name: "Cases", icon: Folder },
          ].map(v => (
            <button
              key={v.name}
              className={view === v.name ? "active" : ""}
              onClick={() => setView(v.name)}
            >
              <v.icon size={18} />
              {v.name}
              {v.name === "Detective" && <span className="lab-new">✧</span>}
            </button>
          ))}
          <label className="lab-tools-menu">
            More tools
            <select
              aria-label="More Lab tools"
              value={view === "Board" || view === "Cases" ? "" : view}
              onChange={e => {
                if (e.target.value) setView(e.target.value);
              }}
            >
              <option value="">Choose a tool...</option>
              {views
                .filter(v => v.name !== "Cases" && v.name !== "Sticky notes")
                .map(v => (
                  <option key={v.name}>{v.name}</option>
                ))}
            </select>
          </label>
        </nav>
        <div className="lab-sidebar-bottom">
          <div className="lab-members">
            <b>N</b>
            <b>S</b>
            <span>Better together.</span>
          </div>
          <p>
            <span
              className={`lab-dot ${connection === "Live sync" ? "" : "lab-dot-wait"}`}
            />
            {connection}
          </p>
          <button
            className="lab-back"
            onClick={async () => {
              setItems([]);
              setEdges([]);
              const { error: failure } = await client.auth.signOut({
                scope: "local",
              });
              if (failure) setError("Could not sign out. Please try again.");
            }}
          >
            <LogOut size={15} /> Sign out @{member.username}
          </button>
        </div>
      </aside>
      <main className="lab-workspace">
        <div className="lab-breadcrumb">
          THE LAB <span>/</span> {view.toUpperCase()}{" "}
          <span className="lab-private-pill">
            <KeyIcon /> Private space
          </span>
        </div>
        <div className="lab-page-heading">
          <div>
            <p className="lab-eyebrow">
              {view === "Dashboard"
                ? "LET’S MAKE SOMETHING GOOD"
                : "FOLLOW YOUR CURIOSITY"}
            </p>
            <h1>
              {view === "Board" ? (
                <>
                  Our shared <em>board</em>
                </>
              ) : view === "Dashboard" ? (
                <>
                  Hello, {member.username}
                  <em> ☘</em>
                </>
              ) : view === "Detective" ? (
                <>
                  Connect the <em>clues</em>
                </>
              ) : (
                view
              )}
              <span className="lab-heading-dot">.</span>
            </h1>
            <p className="lab-muted">
              {view === "Board"
                ? "Ideas, little tangents, useful finds. Make a little room for all of it."
                : view === "Dashboard"
                  ? "A fresh page, a shared brain, a hundred little possibilities."
                  : view === "Detective"
                    ? "Find the thread between an idea, a resource, and the next big thing."
                    : "Every little piece has a place here."}
            </p>
          </div>
          <button
            className="lab-primary"
            onClick={() =>
              setDraft(
                blank(
                  view === "Cases"
                    ? "case"
                    : view === "Shopping"
                      ? "shopping"
                      : view === "Resources"
                        ? "resource"
                        : view === "Kanban"
                          ? "task"
                          : "note"
                )
              )
            }
          >
            <Plus size={17} /> Add something
          </button>
        </div>
        {error && (
          <div className="lab-error" role="alert">
            {error}
            <button
              onClick={() => {
                setError("");
                void refresh();
              }}
            >
              Refresh
            </button>
          </div>
        )}
        <div className="lab-toolbar">
          <label className="lab-search">
            <Search size={16} />
            <input
              aria-label="Search the Lab"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Find a thought, clue, or case…"
            />
          </label>
          <select
            aria-label="Filter by case"
            value={caseId}
            onChange={e => setCaseId(e.target.value)}
          >
            <option value="">All cases</option>
            {cases.map(c => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <button
            className="lab-icon"
            aria-label="Refresh workspace"
            onClick={() => void refresh()}
          >
            <RefreshCw size={16} />
          </button>
        </div>
        {loading ? (
          <p role="status" className="lab-loading">
            Gathering your ideas…
          </p>
        ) : (
          <>
            {view === "Board" && (
              <Board
                items={filtered}
                author={author}
                update={update}
                edit={setDraft}
                create={async changes => {
                  setError("");
                  const { error: failure } = await client
                    .from("lab_items")
                    .insert({
                      ...blank("note"),
                      ...changes,
                      parent_id: caseId || null,
                    });
                  if (failure) {
                    setError(
                      "Could not save your note. Your writing is still in the tray; try again."
                    );
                    return false;
                  }
                  await refresh();
                  return true;
                }}
              />
            )}
            {view === "Dashboard" && (
              <>
                <div className="lab-stats">
                  {[
                    [
                      "Open cases",
                      items.filter(
                        i => i.kind === "case" && i.status !== "done"
                      ).length,
                    ],
                    [
                      "Little ideas",
                      items.filter(i => i.kind === "note").length,
                    ],
                    [
                      "In motion",
                      items.filter(i => i.status === "doing").length,
                    ],
                    [
                      "Things we finished",
                      items.filter(i => i.status === "done").length,
                    ],
                  ].map(([name, count]) => (
                    <div key={name}>
                      <span>{name}</span>
                      <strong>{String(count).padStart(2, "0")}</strong>
                    </div>
                  ))}
                </div>
                <section className="lab-invitation">
                  <div>
                    <p className="lab-eyebrow">
                      A PLACE FOR THE NOT-YET-POSSIBLE
                    </p>
                    <h2>
                      Big ideas.
                      <br />
                      <em>Tiny first steps.</em>
                    </h2>
                    <p>Pin a thought. Open a case. See where it takes us.</p>
                    <button
                      onClick={() => setView("Detective")}
                      className="lab-text-link"
                    >
                      Enter Detective Mode <ArrowUpRight size={17} />
                    </button>
                  </div>
                  <div className="lab-invite-art" aria-hidden="true">
                    <span>✳</span>
                    <p>
                      collect clues.
                      <br />
                      connect dots.
                      <br />
                      make magic.
                    </p>
                    <small>NORA × SARA / FIELD NOTES</small>
                  </div>
                </section>
                <div className="lab-section-heading">
                  <h2>
                    Fresh from our brains <span>↘</span>
                  </h2>
                  <button onClick={() => setView("Board")}>
                    All notes <ArrowUpRight size={14} />
                  </button>
                </div>
                {grid(
                  filtered.slice(0, 6),
                  "The board is full of possibilities."
                )}
              </>
            )}
            {view === "Sticky notes" &&
              grid(
                filtered.filter(i => i.kind === "note"),
                "Your next idea belongs here."
              )}
            {view === "Cases" &&
              grid(
                filtered.filter(i => i.kind === "case"),
                "Our first case is waiting."
              )}
            {view === "Shopping" &&
              grid(
                filtered.filter(i => i.kind === "shopping"),
                "A wishlist for our next experiment."
              )}
            {view === "Kanban" && (
              <div className="lab-kanban">
                {Object.entries(stages).map(([key, label]) => (
                  <section key={key}>
                    <h2>
                      <span className={`lab-stage-dot ${key}`} />
                      {label}
                      <small>
                        {
                          filtered.filter(
                            i => i.kind === "task" && i.status === key
                          ).length
                        }
                      </small>
                    </h2>
                    {filtered
                      .filter(i => i.kind === "task" && i.status === key)
                      .map(card)}
                    <button
                      className="lab-add-column"
                      onClick={() =>
                        setDraft({
                          ...blank("task"),
                          status: key as Item["status"],
                        })
                      }
                    >
                      <Plus size={15} /> Add a task
                    </button>
                  </section>
                ))}
              </div>
            )}
            {view === "Timeline" && (
              <div className="lab-timeline">
                {!filtered.length && grid([], "Nothing on the horizon yet.")}
                {Array.from(
                  new Set(filtered.map(i => i.due_date || "Unscheduled"))
                )
                  .sort((a, b) =>
                    a === "Unscheduled"
                      ? 1
                      : b === "Unscheduled"
                        ? -1
                        : a.localeCompare(b)
                  )
                  .map(date => (
                    <section key={date}>
                      <h2>
                        {date === "Unscheduled"
                          ? date
                          : new Date(date + "T12:00:00").toLocaleDateString(
                              undefined,
                              {
                                weekday: "short",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                      </h2>
                      <div className="lab-grid">
                        {filtered
                          .filter(i => (i.due_date || "Unscheduled") === date)
                          .map(card)}
                      </div>
                    </section>
                  ))}
              </div>
            )}
            {view === "Detective" && (
              <>
                <div className="lab-clue-board">
                  <div className="lab-board-label">
                    EVIDENCE BOARD / {filtered.length} CLUES
                  </div>
                  {grid(filtered, "Every mystery starts with one clue.")}
                </div>
                <section className="lab-connections">
                  <h2>
                    <Link2 size={20} /> Follow a thread
                  </h2>
                  <div className="lab-connect-form">
                    <select
                      aria-label="First clue"
                      value={linkFrom}
                      onChange={e => setLinkFrom(e.target.value)}
                    >
                      <option value="">First clue</option>
                      {items.map(i => (
                        <option key={i.id} value={i.id}>
                          {i.title}
                        </option>
                      ))}
                    </select>
                    <span>↔</span>
                    <select
                      aria-label="Second clue"
                      value={linkTo}
                      onChange={e => setLinkTo(e.target.value)}
                    >
                      <option value="">Second clue</option>
                      {items
                        .filter(i => i.id !== linkFrom)
                        .map(i => (
                          <option key={i.id} value={i.id}>
                            {i.title}
                          </option>
                        ))}
                    </select>
                    <button
                      className="lab-secondary"
                      disabled={!linkFrom || !linkTo}
                      onClick={() => void link()}
                    >
                      Connect clues
                    </button>
                  </div>
                  {edges
                    .filter(edge =>
                      filtered.some(
                        i => i.id === edge.source_id || i.id === edge.target_id
                      )
                    )
                    .map(edge => (
                      <div className="lab-thread" key={edge.id}>
                        <span>
                          {items.find(i => i.id === edge.source_id)?.title ||
                            "Archived clue"}
                        </span>
                        <span className="lab-thread-line" />
                        <span>
                          {items.find(i => i.id === edge.target_id)?.title ||
                            "Archived clue"}
                        </span>
                        <button
                          className="lab-icon"
                          aria-label="Remove connection"
                          onClick={async () => {
                            const { error: failure } = await client
                              .from("lab_edges")
                              .update({ deleted: true })
                              .eq("id", edge.id);
                            if (failure)
                              setError("Could not remove connection.");
                            await refresh();
                          }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                </section>
              </>
            )}
            {view === "Resources" && (
              <>
                <form className="lab-discovery" onSubmit={discover}>
                  <div>
                    <h2>
                      Down the rabbit hole <Sparkles size={18} />
                    </h2>
                    <p className="lab-muted">
                      Discover something worth keeping.
                    </p>
                  </div>
                  <input
                    name="query"
                    aria-label="Discovery search"
                    placeholder="What are we curious about?"
                    required
                    maxLength={150}
                  />
                  <select name="source" aria-label="Discovery source">
                    <option value="github">GitHub</option>
                    <option value="youtube">YouTube</option>
                  </select>
                  <button className="lab-secondary" disabled={discovering}>
                    {discovering ? "Searching…" : "Discover"}
                    <Search size={15} />
                  </button>
                </form>
                {!!discovery.length && (
                  <div className="lab-grid lab-discovery-results">
                    {discovery.map((r, index) => (
                      <article className="lab-card" key={index}>
                        <h3>{r.title}</h3>
                        <p>{r.description}</p>
                        <a
                          href={safeUrl(r.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="lab-text-link"
                        >
                          Visit <ArrowUpRight size={14} />
                        </a>
                        <button
                          className="lab-secondary"
                          onClick={() =>
                            setDraft({
                              ...blank("resource"),
                              title: r.title,
                              body: r.description,
                              url: r.url,
                            })
                          }
                        >
                          <Plus size={14} /> Save to Lab
                        </button>
                      </article>
                    ))}
                  </div>
                )}
                <div className="lab-section-heading">
                  <h2>The good stuff, collected.</h2>
                </div>
                {grid(
                  filtered.filter(i => i.kind === "resource"),
                  "Save a link worth coming back to."
                )}
              </>
            )}
          </>
        )}
        <footer className="lab-workspace-footer">
          MADE OF CURIOSITY & A LITTLE MATCHA.<span>N × S ✳</span>
        </footer>
      </main>
      <button
        className="lab-assistant-toggle"
        onClick={() => setAssistant(!assistant)}
        aria-expanded={assistant}
        aria-label="Toggle Gemini assistant"
      >
        <Sparkles size={20} />
        <span>A little help?</span>
      </button>
      {assistant && (
        <section className="lab-assistant" aria-label="Gemini assistant">
          <header>
            <span>
              <Sparkles size={18} /> Our thinking buddy
            </span>
            <button
              className="lab-icon"
              onClick={() => setAssistant(false)}
              aria-label="Close assistant"
            >
              <X size={17} />
            </button>
          </header>
          <p className="lab-assistant-notice">
            Powered by Gemini. Only the question you send is shared with Google;
            your board stays in the Lab.
          </p>
          <div className="lab-messages" aria-live="polite">
            {!messages.length && (
              <p>
                Untangle an idea, plan an experiment, or ask where to start.
              </p>
            )}
            {messages.map((m, i) => (
              <article key={i}>
                <b>{m.role}</b>
                <p>{m.text}</p>
              </article>
            ))}
            {asking && <p role="status">Thinking…</p>}
          </div>
          <form onSubmit={ask}>
            <input
              name="prompt"
              aria-label="Message to Gemini"
              placeholder="What if we…"
              maxLength={4000}
              required
            />
            <button
              aria-label="Send to Gemini"
              className="lab-icon"
              disabled={asking}
            >
              <Send size={19} />
            </button>
          </form>
        </section>
      )}
      <dialog
        ref={dialog}
        className="lab-editor"
        aria-label="Edit Lab item"
        onCancel={() => setDraft(null)}
        onClose={() => setDraft(null)}
      >
        {draft && (
          <form onSubmit={save}>
            <header>
              <div>
                <p className="lab-eyebrow">A LITTLE PIECE OF OUR WORLD</p>
                <h2>{draft.id ? "Edit the details" : "Something new"}</h2>
              </div>
              <button
                type="button"
                className="lab-icon"
                aria-label="Close editor"
                onClick={() => setDraft(null)}
                disabled={saving}
              >
                <X size={20} />
              </button>
            </header>
            <div className="lab-form-row">
              <label>
                Type
                <select name="kind" defaultValue={draft.kind}>
                  {Object.entries(labels).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Paper
                <select name="color" defaultValue={draft.color}>
                  <option value="sage">Sage green</option>
                  <option value="butter">Butter yellow</option>
                  <option value="rose">Rose pink</option>
                  <option value="paper">Warm paper</option>
                </select>
              </label>
            </div>
            <label>
              A name for it
              <input
                name="title"
                defaultValue={draft.title}
                required
                maxLength={160}
                autoFocus
              />
            </label>
            <label>
              The idea
              <textarea
                name="body"
                defaultValue={draft.body}
                rows={4}
                maxLength={12000}
              />
            </label>
            <div className="lab-form-row">
              <label>
                Progress
                <select name="status" defaultValue={draft.status}>
                  {Object.entries(stages).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                When
                <input
                  name="due_date"
                  type="date"
                  defaultValue={draft.due_date || ""}
                />
              </label>
            </div>
            <label>
              Related case
              <select name="parent_id" defaultValue={draft.parent_id || ""}>
                <option value="">No case yet</option>
                {cases
                  .filter(c => c.id !== draft.id)
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
              </select>
            </label>
            <label>
              Link
              <input
                name="url"
                type="url"
                placeholder="https://"
                defaultValue={draft.url}
                maxLength={2048}
              />
            </label>
            {draft.id && (
              <p className="lab-muted">
                Created by {author(draft.created_by!)} · Last edited by{" "}
                {author(draft.updated_by!)}
              </p>
            )}
            {error && (
              <p className="lab-error" role="alert">
                {error}
              </p>
            )}
            <footer>
              {draft.id && (
                <button
                  type="button"
                  className="lab-delete"
                  disabled={saving}
                  onClick={async () => {
                    if (!confirmDelete) {
                      setConfirmDelete(true);
                      return;
                    }
                    setSaving(true);
                    if (await update(draft as Item, { deleted: true }))
                      setDraft(null);
                    setSaving(false);
                  }}
                >
                  <Trash2 size={15} />
                  {confirmDelete ? "Confirm archive" : "Archive"}
                </button>
              )}
              <button className="lab-primary" disabled={saving}>
                {saving ? "Saving…" : "Save to our Lab"}
                <Check size={17} />
              </button>
            </footer>
          </form>
        )}
      </dialog>
    </div>
  );
}
function SproutMark() {
  return <FlaskConical size={28} />;
}
function KeyIcon() {
  return <span aria-hidden="true">⌑</span>;
}
