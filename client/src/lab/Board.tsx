import { useRef, useState, type PointerEvent } from "react";
import { Grip, Pencil, Plus } from "lucide-react";
import { safeUrl, type Item } from "./client";

export const sections = {
  ideas: "Ideas",
  subideas: "Sub-ideas",
  resources: "Resources",
  coding: "Coding",
};
type Section = keyof typeof sections;
export function sectionOf(item: Item): Section {
  return (
    item.board_section ||
    (item.kind === "case"
      ? "ideas"
      : item.kind === "resource"
        ? "resources"
        : item.kind === "task"
          ? "coding"
          : "subideas")
  );
}
export default function Board({
  items,
  projectOnly = false,
  author,
  update,
  create,
  edit,
}: {
  items: Item[];
  projectOnly?: boolean;
  author: (id: string) => string;
  update: (item: Item, changes: Partial<Item>) => Promise<boolean>;
  create: (changes: Partial<Item>) => Promise<boolean>;
  edit: (item: Item) => void;
}) {
  const [color, setColor] = useState("sage");
  const [section, setSection] = useState<Section>(
    projectOnly ? "subideas" : "ideas"
  );
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const origin = useRef({ x: 0, y: 0 });
  const visibleSections = Object.entries(sections).filter(
    ([key]) => !projectOnly || key !== "ideas"
  );
  const itemSection = (item: Item) =>
    projectOnly && sectionOf(item) === "ideas" ? "subideas" : sectionOf(item);
  const ordered = (key: Section) =>
    items
      .filter(i => itemSection(i) === key)
      .sort(
        (a, b) =>
          (a.board_order || 0) - (b.board_order || 0) ||
          a.id.localeCompare(b.id)
      );
  async function move(item: Item, key: Section, before?: string) {
    const list = ordered(key).filter(i => i.id !== item.id);
    const index = before ? list.findIndex(i => i.id === before) : -1;
    const next =
      index >= 0
        ? list[index].board_order || 0
        : (list.at(-1)?.board_order || 0) + 2;
    const previous = index > 0 ? list[index - 1].board_order || 0 : next - 2;
    setBusy(true);
    try {
      await update(item, {
        board_section: key,
        board_order: (previous + next) / 2,
      });
    } finally {
      setBusy(false);
    }
  }
  function target(e: PointerEvent) {
    const node = document.elementFromPoint(e.clientX, e.clientY);
    return {
      section: node?.closest<HTMLElement>("[data-board-section]")?.dataset
        .boardSection as Section | undefined,
      before:
        node?.closest<HTMLElement>("[data-board-item]")?.dataset.boardItem,
    };
  }
  return (
    <div className="lab-board-layout">
      <aside className="lab-paper-tray">
        <p className="lab-eyebrow">YOUR LITTLE NOTE STACK</p>
        <h2>Leave a thought.</h2>
        <p className="lab-muted">Pick a paper, write anything, pin it up.</p>
        <div className="lab-swatches" aria-label="Note colors">
          {Object.entries({
            sage: "Mint",
            butter: "Butter",
            rose: "Peach",
            paper: "Lilac",
          }).map(([value, label]) => (
            <button
              key={value}
              className={`lab-paper-${value}`}
              aria-label={label}
              aria-pressed={color === value}
              onClick={() => setColor(value)}
            />
          ))}
        </div>
        <form
          onSubmit={async e => {
            e.preventDefault();
            if (!text.trim() || busy) return;
            setBusy(true);
            try {
              const content = text.trim();
              const line = content.split("\n")[0];
              if (
                await create({
                  kind:
                    section === "resources"
                      ? "resource"
                      : section === "coding"
                        ? "task"
                        : "note",
                  title: line.slice(0, 160),
                  body:
                    line.length <= 160
                      ? content.slice(line.length).trim()
                      : content,
                  color,
                  board_section: section,
                  board_order: (ordered(section).at(-1)?.board_order || 0) + 1,
                })
              )
                setText("");
            } finally {
              setBusy(false);
            }
          }}
        >
          <textarea
            className={`lab-blank-paper lab-paper-${color}`}
            aria-label="Write on the board"
            placeholder="A what-if, a link, a few lines of code…"
            value={text}
            onChange={e => setText(e.target.value)}
            required
            maxLength={12000}
            rows={7}
          />
          <label>
            Pin under
            <select
              value={section}
              onChange={e => setSection(e.target.value as Section)}
            >
              {visibleSections.map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <button className="lab-primary" disabled={busy || !text.trim()}>
            <Plus size={16} /> {busy ? "Saving…" : "Pin to board"}
          </button>
        </form>
        <p className="lab-muted">
          Drag using the dotted handle. Or use a note’s “Move to” menu.
        </p>
        <p className="lab-board-status" role="status">
          {dragging
            ? "Drag to a section or above another note."
            : busy
              ? "Saving your board…"
              : "A shared space for unfinished thoughts."}
        </p>
      </aside>
      <div className="lab-shared-board" aria-label="Our shared board">
        {visibleSections.map(([key, label]) => (
          <section
            key={key}
            data-board-section={key}
            className={`lab-board-section ${hover === key ? "is-drop-target" : ""}`}
          >
            <header>
              <h2>{label}</h2>
              <span>{ordered(key as Section).length}</span>
              <button
                className="lab-icon"
                aria-label={`Write in ${label}`}
                onClick={() => {
                  setSection(key as Section);
                  document
                    .querySelector<HTMLTextAreaElement>(
                      '[aria-label="Write on the board"]'
                    )
                    ?.focus();
                }}
              >
                <Plus size={17} />
              </button>
            </header>
            <div className="lab-board-stack">
              {ordered(key as Section).map(item => (
                <article
                  data-board-item={item.id}
                  key={item.id}
                  className={`lab-board-note lab-paper-${item.color} ${dragging === item.id ? "is-dragging" : ""}`}
                >
                  <div className="lab-note-tools">
                    <button
                      className="lab-grab"
                      aria-label={`Drag ${item.title}`}
                      disabled={busy}
                      onPointerDown={e => {
                        if (e.button !== 0) return;
                        origin.current = { x: e.clientX, y: e.clientY };
                        e.currentTarget.setPointerCapture(e.pointerId);
                        setDragging(item.id);
                      }}
                      onPointerMove={e => {
                        if (dragging === item.id)
                          setHover(target(e).section || null);
                      }}
                      onPointerCancel={() => {
                        setDragging(null);
                        setHover(null);
                      }}
                      onPointerUp={e => {
                        if (dragging !== item.id) return;
                        const dest = target(e);
                        setDragging(null);
                        setHover(null);
                        if (
                          dest.section &&
                          dest.before !== item.id &&
                          Math.hypot(
                            e.clientX - origin.current.x,
                            e.clientY - origin.current.y
                          ) > 5
                        )
                          void move(item, dest.section, dest.before);
                      }}
                    >
                      <Grip size={18} />
                    </button>
                    <span>@{author(item.created_by)}</span>
                    <button
                      className="lab-icon"
                      aria-label={`Edit ${item.title}`}
                      onClick={() => edit(item)}
                    >
                      <Pencil size={14} />
                    </button>
                  </div>
                  <h3>{item.title}</h3>
                  {item.body && <p>{item.body}</p>}
                  {safeUrl(item.url) && (
                    <a
                      href={safeUrl(item.url)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Open resource ↗
                    </a>
                  )}
                  <div className="lab-note-bottom">
                    <select
                      aria-label={`Move ${item.title} to`}
                      value={itemSection(item)}
                      disabled={busy}
                      onChange={e => void move(item, e.target.value as Section)}
                    >
                      {visibleSections.map(([value, name]) => (
                        <option key={value} value={value}>
                          Move to {name}
                        </option>
                      ))}
                    </select>
                  </div>
                </article>
              ))}
            </div>
            {!ordered(key as Section).length && (
              <p className="lab-board-empty">
                Room for a little possibility.
                <br />
                Drop a note here.
              </p>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
