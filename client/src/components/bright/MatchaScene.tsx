import { laptopProjects, isProjectTypingKey } from "./laptopProjects";
import { preloadDeskRecordings } from "./deskSounds";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import type { DeskObject, mountMatcha } from "./matchaRenderer";

type Desk = ReturnType<typeof mountMatcha>;
export default function MatchaScene({ onReady }: { onReady?: () => void }) {
  const host = useRef<HTMLDivElement>(null);
  const desk = useRef<Desk | null>(null);
  const callback = useRef(onReady);
  callback.current = onReady;
  const [status, setStatus] = useState("Opening the studio…");
  const [ready, setReady] = useState(false);
  const [movementSeen,setMovementSeen] = useState(false);
  const [bites, setBites] = useState(0);
  const [moveStuff, setMoveStuff] = useState(false);
  const [inspecting, setInspecting] = useState(false);
  const inspectButton = useRef<HTMLButtonElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const [projectInfoVisible, setProjectInfoVisible] = useState(true);
  const [projectIndex, setProjectIndex] = useState(0);
  const activeProject = laptopProjects[projectIndex];
  const [lidOpen, setLidOpen] = useState(true);
  const [viewMode, setViewMode] = useState(false);
  const [selected, setSelected] = useState<DeskObject>("matcha");
  const [ritual, setRitual] = useState<
    "start" | "pouring" | "ice" | "settling" | "welcome"
  >("start");
  const ritualAction = useRef<(action: "brew" | "ice" | "stir") => void>(() => {});
  ritualAction.current = action => {
    if (ritual === "pouring" || ritual === "settling") return;
    if (action === "brew") void prepare();
    else if (action === "ice") void ice();
    else {
      desk.current?.stir();
      setStatus("A proper stir. Creamy green, from top to bottom.");
    }
  };
  const reduce = useReducedMotion();
  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setRitual("start");
    setBites(0);
    setViewMode(false);
    import("./matchaRenderer")
      .then(async ({ mountMatcha }) => {
        await preloadDeskRecordings().catch(() => {});
        if (cancelled || !host.current) return;
        try {
          desk.current = mountMatcha(
            host.current,
            !!reduce,
            setBites,
            value => { setInspecting(value); if (value) setProjectInfoVisible(true); },
            action => ritualAction.current(action),
            setProjectIndex,
            () => setStatus("LEGO fan 🌸"),
            setProjectInfoVisible
          );
          setReady(true);
          setStatus("A desk for slow mornings & curious ideas.");
        } catch {
          setStatus("A little matcha, a little inspiration.");
        }
        callback.current?.();
      })
      .catch(() => {
        if (!cancelled) {
          setStatus("A little matcha, a little inspiration.");
          callback.current?.();
        }
      });
    return () => {
      cancelled = true;
      desk.current?.dispose();
      desk.current = null;
    };
  }, [reduce]);
  useEffect(() => {
    if (!inspecting) return;
    const previous = document.activeElement as HTMLElement | null;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButton.current?.focus();
    const key = (e: KeyboardEvent) => {
      if (isProjectTypingKey(e, e.target instanceof Element ? e.target : null)) {
        desk.current?.nextLaptopProject();
      }
      if (e.key === "Escape") {
        desk.current?.inspect(false);
      }
      if (e.key === "Tab") {
        const buttons = Array.from(
          document.querySelectorAll<HTMLButtonElement>(
            ".laptop-inspection button, .laptop-inspection a[href]"
          )
        );
        const first = buttons[0],
          last = buttons[buttons.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", key);
    return () => {
      document.body.style.overflow = priorOverflow;
      document.removeEventListener("keydown", key);
      (previous?.tagName === "BUTTON"
        ? previous
        : inspectButton.current
      )?.focus();
    };
  }, [inspecting]);
  useEffect(() => {
    if (!inspecting) return;
    const outside = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Element && !target.closest(".matcha-stage, .laptop-project-info, .laptop-inspection button, .laptop-inspection a")) setProjectInfoVisible(false);
    };
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [inspecting]);
  async function prepare() {
    const current = desk.current;
    if (!current) return;
    setRitual("pouring");
    setStatus("Whisking a little calm into the morning…");
    await current.brew();
    if (desk.current !== current) return;
    setRitual("ice");
    setStatus("Freshly poured. Tap the glass to add ice.");
  }
  async function ice() {
    const current = desk.current;
    if (!current) return;
    setRitual("settling");
    await current.addIce();
    if (desk.current !== current) return;
    setRitual("welcome");
    setStatus("Tap the glass again to stir your matcha.");
  }
  return (
    <div className={`matcha-art ${inspecting ? "inspecting-laptop" : ""}`}>

      <div
        className={`matcha-stage ${ready && !movementSeen ? "show-movement-hint" : ""}`}
        onPointerDown={()=>setMovementSeen(true)}
        ref={host}
        role="img"
        aria-label="Interactive wooden board with iced matcha, a biteable chocolate chip cookie, a whisking bowl, a plant, and one interactive sticker-covered Huawei laptop"
      >
        {ready && !movementSeen && !inspecting && <span className="desk-movement-hint" aria-hidden="true">Drag your drink to spill · Drag the board to turn</span>}
        {!ready && (
          <div className="matcha-fallback" aria-hidden="true">
            <div className="fallback-liquid" />
            <span />
            <span />
            <span />
          </div>
        )}
      </div>
      {inspecting && (
        <div
          className="laptop-inspection"
          role="dialog"
          aria-modal="true"
          aria-label="Inspect Nourah’s laptop"
        >
          <div>
            <span>NOURAH’S LAPTOP</span>
            <button
              ref={closeButton}
              onClick={() => desk.current?.inspect(false)}
            >
              Close ×
            </button>
          </div>
          <section className="laptop-project-info" hidden={!projectInfoVisible} aria-live="polite" aria-atomic="true">
            <span>PROJECT {projectIndex + 1} / {laptopProjects.length}</span>
            <h2>{activeProject.title}</h2>
            <p>{activeProject.description}</p>
            {activeProject.github && <a className="laptop-github-link" href={activeProject.github} target="_blank" rel="noopener noreferrer">Check full project on GitHub ↗</a>}
            {!activeProject.image && <p className="laptop-placeholder-note">Screenshot not supplied yet.</p>}
            {activeProject.image && <p><a className="laptop-github-link" href={activeProject.image} target="_blank" rel="noopener noreferrer">View full-size screenshot ↗</a></p>}
            <p className="laptop-key-hint">Tap any 3D key or type a letter to see the next project.</p>
            <button type="button" onClick={() => desk.current?.nextLaptopProject()}>Next project →</button>
          </section>
          <nav aria-label="Laptop inspection controls">
            <button
              onClick={() => {
                desk.current?.laptopFront();
                setLidOpen(true);
              }}
            >
              Screen
            </button>
            <button onClick={() => desk.current?.laptopBack()}>Stickers</button>
            <button
              onClick={() => {
                desk.current?.laptopLid(!lidOpen);
                setLidOpen(!lidOpen);
              }}
            >
              {lidOpen ? "Close lid" : "Open lid"}
            </button>
            <button
              aria-label="Rotate laptop left"
              onClick={() => desk.current?.rotate(-0.3)}
            >
              ↶
            </button>
            <button
              aria-label="Rotate laptop right"
              onClick={() => desk.current?.rotate(0.3)}
            >
              ↷
            </button>
            <button
              aria-label="Zoom into laptop"
              onClick={() => desk.current?.zoom(0.15)}
            >
              ＋
            </button>
            <button
              aria-label="Zoom out of laptop"
              onClick={() => desk.current?.zoom(-0.15)}
            >
              −
            </button>
            <button
              onClick={() => {
                desk.current?.resetLaptop();
                setLidOpen(true);
              }}
            >
              Reset
            </button>
          </nav>
          <small>Scroll or pinch to zoom · + / − to zoom · Drag to turn · Escape to return</small>
        </div>
      )}
      <div className="matcha-caption">
        <span role="status" aria-live="polite">
          {status}
        </span>
      </div>
      {ready && (
        <div className="matcha-ritual">
          {ritual === "start" && (
            <button className="desk-sparkle-button" type="button" onClick={prepare}>
              Whisk & pour <span aria-hidden="true">↗</span>
            </button>
          )}
          {ritual === "pouring" && (
            <span>Whisking → pouring → a moment to settle</span>
          )}
          {ritual === "ice" && (
            <button type="button" onClick={ice}>
              Add ice <span aria-hidden="true">＋</span>
            </button>
          )}
          {ritual === "settling" && <span>A little ice, a little ripple…</span>}
          {ritual === "welcome" && (
            <button
              type="button"
              onClick={() => {
                desk.current?.stir();
                setStatus("A proper stir. Creamy green, from top to bottom.");
              }}
            >
              Give it a stir ↻
            </button>
          )}
        </div>
      )}
      {ready && (
        <div className="board-play-controls">
          <div className="board-cookie">
            <button
              type="button"
              className={bites === 0 ? "desk-sparkle-button" : undefined}
              onClick={() =>
                bites < 6 ? desk.current?.bite() : desk.current?.freshCookie()
              }
            >
              {bites < 6 ? "Take a cookie bite ◔" : "Another cookie? ＋"}
            </button>
            <span role="status" hidden={bites === 0}>
              {bites === 0
                ? ""
                : bites < 6
                  ? `${bites} / 6 bites. A little moment of sweetness.`
                  : "All gone. That was a good cookie."}
            </span>
          </div>
          <button
            ref={inspectButton}
            type="button"
            onClick={() => desk.current?.inspect(true)}
          >
            Explore my laptop ↗
          </button>
          <button
            type="button"
            aria-expanded={moveStuff}
            aria-controls="move-stuff-controls"
            onClick={() => {
              setMoveStuff(!moveStuff);
              if (moveStuff) {
                setViewMode(false);
                desk.current?.setViewMode(false);
              }
            }}
          >
            Play with the desk
          </button>
          <div id="move-stuff-controls" hidden={!moveStuff}>
            <small className="desk-play-hint">Drag the glass to spill. Drag the board to turn, or use two fingers to turn and pinch. Scroll outside the board.</small>
            <button type="button" onClick={() => desk.current?.spillMatcha()}>Spill a little 🍵</button>
            <button type="button" onClick={() => desk.current?.clearSpills()}>Wipe spills</button>
            <div
              className="board-view"
              role="group"
              aria-label="Board view controls"
            >
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => desk.current?.zoom(0.15)}
              >
                ＋
              </button>
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => desk.current?.zoom(-0.15)}
              >
                −
              </button>
              <button
                type="button"
                aria-pressed={viewMode}
                onClick={() => {
                  const next = !viewMode;
                  setViewMode(next);
                  desk.current?.setViewMode(next);
                }}
              >
                Drag to rotate
              </button>
              <button type="button" onClick={() => desk.current?.resetView()}>
                Reset view
              </button>
            </div>
            <details className="view-fine">
              <summary>Fine-tune view</summary>
              <div>
                {" "}
                <button
                  type="button"
                  aria-label="Rotate board left"
                  onClick={() => desk.current?.rotate(-0.25)}
                >
                  ↶
                </button>
                <button
                  type="button"
                  aria-label="Rotate board right"
                  onClick={() => desk.current?.rotate(0.25)}
                >
                  ↷
                </button>
                <button
                  type="button"
                  aria-label="Tilt board up"
                  onClick={() => desk.current?.rotate(0, 0.12)}
                >
                  ↑
                </button>
                <button
                  type="button"
                  aria-label="Tilt board down"
                  onClick={() => desk.current?.rotate(0, -0.12)}
                >
                  ↓
                </button>
              </div>
            </details>
          </div>
          {moveStuff && viewMode && (
            <small>
              Drag to turn. On touch screens, use two fingers to turn or pinch to zoom.
            </small>
          )}
        </div>
      )}
      {ready && moveStuff && (
        <details className="desk-controls">
          <summary>
            Drag an object to make it yours <span>↗</span>
          </summary>
          <div>
            <label>
              Move{" "}
              <select
                value={selected}
                onChange={e => setSelected(e.target.value as DeskObject)}
                aria-label="Choose desk object"
              >
                <option value="matcha">Matcha</option>
                <option value="cookie">Cookie</option>
                <option value="plant">Plant</option>
              </select>
            </label>
            <div className="desk-nudges">
              <button
                type="button"
                onClick={() => desk.current?.nudge(selected, -0.2, 0)}
                aria-label="Move selected object left"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => desk.current?.nudge(selected, 0, -0.2)}
                aria-label="Move selected object back"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => desk.current?.nudge(selected, 0, 0.2)}
                aria-label="Move selected object forward"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => desk.current?.nudge(selected, 0.2, 0)}
                aria-label="Move selected object right"
              >
                →
              </button>
            </div>
            <button type="button" onClick={() => desk.current?.reset()}>
              Tidy desk ↺
            </button>
          </div>
        </details>
      )}
    </div>
  );
}
