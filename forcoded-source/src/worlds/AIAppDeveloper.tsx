import { useState } from "react";
import { ArrowUpRight, Check, Plus, Trash2, LockKeyhole } from "lucide-react";
const parts = [
  ["UI", "A usable interface"],
  ["API", "Read and write tasks"],
  ["DATABASE", "Remember your work"],
  ["AUTH", "Protect the workspace"],
  ["ANALYTICS", "Understand activity"],
];
export default function AIAppDeveloper({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [name, setName] = useState("Buildboard");
  const [features, setFeatures] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string[]>([
    "Sketch a big idea",
    "Build a first version",
  ]);
  const [draft, setDraft] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [shipped, setShipped] = useState(false);
  const [events, setEvents] = useState(0);
  const [notice, setNotice] = useState(
    "Choose the pieces your product needs. Then test it in the preview.",
  );
  const has = (f: string) => features.includes(f);
  function addTask() {
    if (!has("API")) {
      setNotice(
        "Your interface needs an API before it can create tasks. Connect API.",
      );
      return;
    }
    if (!draft.trim()) return;
    setTasks((t) => [...t, draft.trim().slice(0, 80)]);
    setDraft("");
    setEvents((n) => n + 1);
    setNotice("API → database: task created in this session.");
    setShipped(false);
  }
  return (
    <div className="lab">
      <div className="lab-title">
        <span className="eyebrow">PRODUCT MACHINE / LOCAL SIMULATION</span>
        <span className="eyebrow">IDEA → LIVE PREVIEW</span>
      </div>
      <div className="product-builder">
        <div>
          <label className="field-label">
            YOUR PRODUCT NAME
            <input
              maxLength={32}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <p>
            Problem: scattered ideas. User: a team that wants to build together.
          </p>
          <div className="feature-list">
            {parts.map(([id, description]) => (
              <button
                key={id}
                className={has(id) ? "active" : ""}
                aria-pressed={has(id)}
                onClick={() => {
                  setFeatures((f) =>
                    has(id) ? f.filter((x) => x !== id) : [...f, id],
                  );
                  setShipped(false);
                }}
              >
                <span className="feature-check">
                  {has(id) ? <Check size={15} /> : <Plus size={15} />}
                </span>
                <strong>{id}</strong>
                <small>{description}</small>
              </button>
            ))}
          </div>
          <button
            className="button orange"
            disabled={features.length < 5}
            onClick={() => {
              setShipped(true);
              setNotice(
                "Your product is running in the local preview. You connected UI, API, database, auth and analytics.",
              );
              onComplete();
            }}
          >
            Ship it <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="product-preview">
          <div className="browser-chrome">
            <i />
            <i />
            <i />
            <span>
              {(name || "my-app").toLowerCase().replace(/[^a-z0-9-]/g, "-")}
              .local
            </span>
          </div>
          {has("UI") ? (
            <div className="preview-body">
              <span className="eyebrow">YOUR FIRST PRODUCT</span>
              <h3>{name || "Your app"}</h3>
              {has("AUTH") && !unlocked ? (
                <div className="demo-login">
                  <LockKeyhole size={27} />
                  <p>This workspace has an auth gate.</p>
                  <button
                    className="button dark"
                    onClick={() => setUnlocked(true)}
                  >
                    Enter as demo user
                  </button>
                  <small>
                    Simulated sign-in. No account or password needed.
                  </small>
                </div>
              ) : (
                <>
                  <ul className="demo-tasks">
                    {tasks.map((t, i) => (
                      <li key={i}>
                        <span>{t}</span>
                        <button
                          aria-label={`Delete ${t}`}
                          onClick={() => {
                            if (!has("API")) {
                              setNotice("Connect API to update tasks.");
                              return;
                            }
                            setTasks((s) => s.filter((_, j) => i !== j));
                            setEvents((n) => n + 1);
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <form
                    className="task-form"
                    onSubmit={(e) => {
                      e.preventDefault();
                      addTask();
                    }}
                  >
                    <input
                      aria-label="New task"
                      placeholder="Your next idea…"
                      value={draft}
                      maxLength={80}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <button aria-label="Add task">
                      <Plus size={17} />
                    </button>
                  </form>
                  {has("DATABASE") && (
                    <span className="demo-meta">
                      DATABASE / {tasks.length} records in session
                    </span>
                  )}
                  {has("ANALYTICS") && (
                    <span className="demo-meta">
                      ANALYTICS / {events} task events
                    </span>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="preview-empty">
              Connect UI to bring your product to life.
            </div>
          )}
        </div>
      </div>
      <div className="incident-log" role="status">
        <p>{notice}</p>
      </div>
      {shipped && (
        <div className="achievement">
          <span>✳</span>
          <div>
            <strong>SHIPPED.</strong>
            <p>
              A working product is a connected system. This local simulation
              shows how the pieces fit.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
