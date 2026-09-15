import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  Component,
} from "react";
import type { ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Coffee,
  Compass,
  Hand,
  Menu,
  Monitor,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { programs, audiences, findProgram } from "./data/programs";
import {
  rooms,
  getRoom,
  roomForAudience,
  roomForProgram,
  type RoomId,
  type CampusView,
} from "./data/rooms";
import type { Audience } from "./data/programs";
import type { DeskAction } from "./worlds/DeskWorld";
import Modal from "./components/Modal";
import Passport from "./components/Passport";
const ProgramWorld = lazy(() => import("./worlds/ProgramWorld"));
const Scene = lazy(() => import("./worlds/Scene"));
const CampusHub = lazy(() => import("./components/CampusHub"));
const AgenticAI = lazy(() => import("./worlds/AgenticAI"));
type ModalName =
  | "passport"
  | "programs"
  | "path"
  | "companies"
  | "apply"
  | "demo"
  | "projects"
  | "builders"
  | "arcade"
  | "duck"
  | null;
class SceneBoundary extends Component<
  { children: ReactNode; onReady: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onReady();
  }
  render() {
    return this.state.failed ? (
      <div className="scene-fallback">
        <span>{"{ CODED }"}</span>
        <p>
          The world is still yours to explore.
          <br />
          Use the controls below or browse programs.
        </p>
      </div>
    ) : (
      this.props.children
    );
  }
}
function readStamps(): string[] {
  try {
    const stored = JSON.parse(localStorage.getItem("coded-passport") || "[]");
    return Array.isArray(stored)
      ? stored.filter(
          (s: unknown) =>
            typeof s === "string" && programs.some((p) => p.id === s),
        )
      : [];
  } catch {
    return [];
  }
}
export default function App() {
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);
  useEffect(() => {
    const resize = () => setViewportWidth(window.innerWidth);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);
  const [world, setWorld] = useState<"desk" | "dollhouse" | "program">("desk");
  const [selected, setSelected] = useState("agentic-ai");
  const [audience, setAudience] = useState<Audience>("Professionals");
  const [assetError, setAssetError] = useState(false);
  useEffect(() => {
    const onError = () => setAssetError(true);
    window.addEventListener("coded-asset-error", onError);
    return () => window.removeEventListener("coded-asset-error", onError);
  }, []);
  const [room, setRoom] = useState<RoomId>("ai");
  const [campusView, setCampusView] = useState<CampusView>(() =>
    window.innerWidth < 700 ? "room" : "building",
  );
  function chooseRoom(id: RoomId) {
    setRoom(id);
    setAudience(getRoom(id).audience);
    setCampusView("room");
  }
  function chooseAudience(a: Audience) {
    setAudience(a);
    setRoom(roomForAudience(a).id);
    setCampusView("floor");
    if (window.innerWidth < 901)
      requestAnimationFrame(() =>
        document
          .querySelector(".campus-programs")
          ?.scrollIntoView({ block: "nearest" }),
      );
  }
  const [modal, setModal] = useState<ModalName>(null);
  const [menu, setMenu] = useState(false);
  const [ready, setReady] = useState(false);
  const [welcome, setWelcome] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [awake, setAwake] = useState(0);
  const [laptopReady, setLaptopReady] = useState(false);
  const [coffee, setCoffee] = useState(1);
  const [pouring, setPouring] = useState(false);
  const [cookie, setCookie] = useState(0);
  const [dates, setDates] = useState(5);
  const [portal, setPortal] = useState(false);
  const [stamps, setStamps] = useState<string[]>(readStamps);
  const [toast, setToast] = useState("");
  const [muted, setMuted] = useState(true);
  const [reduced, setReduced] = useState(
    () => matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [help, setHelp] = useState(false);
  const [highlight, setHighlight] = useState<string | null>(null);
  const [pathStage, setPathStage] = useState("");
  const [interest, setInterest] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audio = useRef<AudioContext | null>(null);
  const main = useRef<HTMLElement>(null);
  const touch = useRef<number | null>(null);
  const schedule = useCallback((fn: () => void, ms: number) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
    return t;
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(
    () => () => {
      timers.current.forEach(clearTimeout);
      audio.current?.close();
    },
    [],
  );
  useEffect(() => {
    if (ready) {
      const t = schedule(() => setWelcome(true), reduced ? 0 : 1100);
      const t2 = schedule(() => setLoaded(true), reduced ? 150 : 2200);
      return () => {
        clearTimeout(t);
        clearTimeout(t2);
      };
    }
  }, [ready, reduced, schedule]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 4000);
    return () => clearTimeout(t);
  }, [toast]);
  useEffect(() => {
    try {
      localStorage.setItem("coded-passport", JSON.stringify(stamps));
    } catch {
      /* Private browsers may not allow storage. */
    }
  }, [stamps]);
  useEffect(() => {
    if (awake > 0 && !laptopReady) {
      const t = schedule(() => {
        setLaptopReady(true);
        setToast("Psst. Your next world is inside the laptop.");
      }, 1800);
      return () => clearTimeout(t);
    }
  }, [awake, laptopReady, schedule]);
  useEffect(() => {
    if (loaded) main.current?.focus({ preventScroll: true });
  }, [world, loaded]);
  function sound(freq = 400) {
    if (muted) return;
    try {
      audio.current ??= new AudioContext();
      void audio.current.resume();
      const o = audio.current.createOscillator();
      const g = audio.current.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.04, audio.current.currentTime);
      g.gain.exponentialRampToValueAtTime(
        0.001,
        audio.current.currentTime + 0.16,
      );
      o.connect(g);
      g.connect(audio.current.destination);
      o.start();
      o.stop(audio.current.currentTime + 0.18);
    } catch {
      /* Audio is optional. */
    }
  }
  function navigate(next: "desk" | "dollhouse") {
    setWorld(next);
    setModal(null);
    setMenu(false);
    setPortal(false);
    document.body.style.cursor = "auto";
  }
  function enter() {
    sound(620);
    if (reduced) {
      navigate("dollhouse");
      return;
    }
    setPortal(true);
    schedule(() => {
      setWorld("dollhouse");
      setPortal(false);
      document.body.style.cursor = "auto";
    }, 1600);
  }
  function explore(id: string) {
    setSelected(id);
    setAudience(findProgram(id).audience);
    setRoom(roomForProgram(id).id);
    setWorld("program");
    setModal(null);
    setStamps((s) => (s.includes(id) ? s : [...s, id]));
    setToast("New world, new possibility. Passport stamped.");
    sound(750);
    document.body.style.cursor = "auto";
  }
  function action(a: DeskAction) {
    sound(a === "robot" ? 620 : a === "pour" ? 180 : 400);
    if (a === "spill") setToast("The cleaning crew has questions.");
    if (a === "coffee") {
      if (coffee) {
        setCoffee(0);
        setToast("A little coffee. A lot of possibility.");
      } else setToast("Empty already? Tap the dallah to refill.");
    }
    if (a === "pour" && !pouring) {
      setPouring(true);
      schedule(() => {
        setCoffee(1);
        setPouring(false);
        setToast("Freshly poured. حيّاك");
      }, 850);
    }
    if (a === "robot") {
      setAwake((n) => n + 1);
      setToast(
        awake === 0
          ? "Oh, hello. I was just… compiling."
          : awake > 2
            ? "Okay, okay. I’m awake. Try the laptop."
            : "Follow my lead. There’s something in that laptop.",
      );
    }
    if (a === "laptop") {
      if (laptopReady) enter();
      else {
        setLaptopReady(true);
        setToast("> visitor detected   > ready to build?");
      }
    }
    if (a === "passport") setModal("passport");
    if (a === "keyboard") {
      setAwake((n) => Math.max(n, 1));
      setToast("RUN ✓ Curiosity compiled successfully.");
    }
    if (a === "cookie") {
      setCookie((n) => Math.min(n + 1, 4));
      setToast(
        cookie >= 3
          ? "Cookie accepted. You didn’t even read the policy."
          : "One byte at a time.",
      );
    }
    if (a === "dates") {
      setDates((n) => Math.max(n - 1, 0));
      setToast(dates <= 1 ? "تمر speedrun" : "+5 debugging patience");
    }
    if (a === "monitor") setToast("47 tabs open. One very good idea.");
    if (a === "button") {
      if (stamps.length > 0) setModal("arcade");
      else
        setToast("Explore a world, then come back. This button has a secret.");
    }
    if (a === "duck") setModal("duck");
  }
  function openModal(m: ModalName) {
    setModal(m);
    setMenu(false);
  }
  useEffect(() => {
    function key(e: KeyboardEvent) {
      if (e.key === "Escape" && !modal && world !== "desk")
        navigate("dollhouse");
      if (e.key === " " && e.target === document.body && world === "desk") {
        e.preventDefault();
        setAwake((n) => Math.max(n, 1));
        setToast("Robot: jump compiled.");
      }
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [world, modal]);
  const matched =
    pathStage === "Parent / Junior"
      ? "camps"
      : pathStage === "Company"
        ? "companies"
        : pathStage === "High school"
          ? interest === "Entrepreneurship"
            ? "academy-x"
            : "kuwait-codes"
          : pathStage === "University" || pathStage === "Fresh graduate"
            ? interest === "Entrepreneurship"
              ? "academy-x"
              : "unicode"
            : interest === "Cybersecurity"
              ? "cyber"
              : interest === "Data"
                ? "data"
                : interest === "App building" || interest === "Web"
                  ? "ai-app"
                  : "agentic-ai";
  return (
    <div
      data-viewport={viewportWidth}
      className={`app world-${world} ${reduced ? "reduced-motion" : ""}`}
    >
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header>
        <button
          className="wordmark"
          aria-label="CODED home"
          onClick={() => navigate("desk")}
        >
          CODED
          <span className="brand-square" />
        </button>
        <span className="brand-caption">
          A WORLD OF
          <br />
          BUILDERS.
        </span>
        <nav aria-label="Main navigation">
          <button onClick={() => openModal("programs")}>Programs</button>
          <button onClick={() => openModal("path")}>
            Find my path <ArrowUpRight size={13} />
          </button>
          <button onClick={() => openModal("companies")}>For companies</button>
        </nav>
        <div className="header-right">
          <button
            className="passport-button"
            aria-label={`Passport ${stamps.length}`}
            onClick={() => openModal("passport")}
          >
            <BookOpen size={17} />
            <span>Passport</span>
            <b>{stamps.length}</b>
          </button>
          <button className="header-apply" onClick={() => openModal("apply")}>
            Apply <ArrowUpRight size={15} />
          </button>
          <button
            className="icon-button menu-button"
            aria-label="Open menu"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      {menu && (
        <nav className="mobile-menu" aria-label="Mobile navigation">
          <button onClick={() => openModal("programs")}>
            Programs <ArrowUpRight size={16} />
          </button>
          <button onClick={() => openModal("path")}>
            Find my path <Compass size={16} />
          </button>
          <button onClick={() => openModal("companies")}>
            For companies <ArrowUpRight size={16} />
          </button>
          <button onClick={() => openModal("apply")}>
            Apply <ArrowUpRight size={16} />
          </button>
        </nav>
      )}
      {!loaded && (
        <div className="loader" aria-label="Preparing your world">
          <div className="pour-scene">
            <svg viewBox="0 0 250 210" aria-hidden="true">
              <path
                className="loader-dallah"
                d="M52 41 C24 73 27 115 63 119 C94 121 98 91 80 65 L81 47 L90 44 L73 33 L68 22 L62 34 Z M81 69 L126 49 L96 92 M38 56 C2 30 3 103 35 99"
              />
              <path className="pour-line" d="M126 52 Q151 61 161 128" />
              <path
                d="M131 133 L196 133 L185 177 Q165 192 143 177 Z"
                fill="#f4ede1"
                stroke="#b3a693"
                strokeWidth="2"
              />
              <clipPath id="cup-clip">
                <path d="M133 135 L194 135 L183 176 Q165 188 145 176 Z" />
              </clipPath>
              <rect
                className={`coffee-fill ${ready ? "filled" : ""}`}
                x="132"
                y="133"
                width="65"
                height="53"
                clipPath="url(#cup-clip)"
                fill="#b78347"
              />
              <path
                d="M147 119 Q138 105 151 93 M179 112 Q191 94 182 81"
                fill="none"
                stroke="#cec4b7"
                strokeWidth="2"
              />
            </svg>
            <span className="steam-symbol">{"</>"}</span>
          </div>
          <h2>{welcome ? "حيّاك" : "Good things are brewing."}</h2>
          <p>
            {welcome ? "MAKE YOURSELF AT HOME." : "PREPARING YOUR LITTLE WORLD"}
          </p>
          <button
            onClick={() => {
              setLoaded(true);
              openModal("programs");
            }}
          >
            Skip to programs <ArrowRight size={14} />
          </button>
        </div>
      )}
      <main id="main" ref={main} tabIndex={-1}>
        {world !== "program" ? (
          <>
            <div className="intro">
              <div className="eyebrow">
                <span className="status-dot" />
                {world === "desk"
                  ? "MADE OF CURIOSITY. BUILT IN KUWAIT."
                  : "WELCOME INSIDE. MAKE YOURSELF AT HOME."}
              </div>
              <h1>
                {world === "desk" ? (
                  <>
                    Great things start
                    <br />
                    with <em>a little curiosity.</em>
                    <span className="title-star">✳</span>
                  </>
                ) : (
                  <>
                    One world.
                    <br />
                    <em>Endless possibilities.</em>
                  </>
                )}
              </h1>
              <p>
                {world === "desk" ? (
                  <>
                    A desk full of possibilities. A world waiting inside.
                    <br />
                    Go on. Touch something.
                  </>
                ) : (
                  <>
                    Find your people. Step into a program.
                    <br />
                    Discover what you could build.
                  </>
                )}
              </p>
            </div>
            <div className="world-number">
              <span>{world === "desk" ? "01" : "02"}</span>
              <small>{world === "desk" ? "THE DESK" : "THE CAMPUS"}</small>
            </div>
            <div
              className={`scene-shell ${portal ? "entering" : ""}`}
              onTouchStart={(e) => {
                if (world === "dollhouse") touch.current = e.touches[0].clientX;
              }}
              onTouchEnd={(e) => {
                if (world === "dollhouse" && touch.current !== null) {
                  const dx = e.changedTouches[0].clientX - touch.current;
                  const list = rooms.filter(
                    (r) => r.floor === getRoom(room).floor,
                  );
                  const n = list.findIndex((r) => r.id === room);
                  if (Math.abs(dx) > 60)
                    chooseRoom(list[(n + (dx < 0 ? 1 : 2)) % 3].id);
                  touch.current = null;
                }
              }}
            >
              <SceneBoundary onReady={onReady}>
                <Suspense fallback={null}>
                  <Scene
                    world={world}
                    revealed={loaded}
                    awake={awake}
                    laptopReady={laptopReady}
                    coffee={coffee}
                    pouring={pouring}
                    cookie={cookie}
                    dates={dates}
                    onAction={action}
                    portal={portal}
                    reduced={reduced}
                    audience={audience}
                    onAudience={chooseAudience}
                    room={room}
                    campusView={campusView}
                    onRoom={chooseRoom}
                    onExplore={explore}
                    highlight={highlight}
                    onReady={onReady}
                  />
                </Suspense>
              </SceneBoundary>
            </div>
            {world === "desk" ? (
              <>
                <div className="desk-note">
                  <span className="note-arrow">↙</span>
                  <span>
                    Yes, even
                    <br />
                    the coffee.
                  </span>
                </div>
                <div className="desk-controls" aria-label="Desk interactions">
                  <button
                    onClick={() => action("pour")}
                    aria-label="Pour coffee"
                    title="Pour coffee"
                  >
                    <Coffee size={18} />
                    <span>Pour</span>
                  </button>
                  <button
                    onClick={() => action("coffee")}
                    aria-label="Drink coffee"
                    title="Drink coffee"
                  >
                    <span className="cup-symbol">◡</span>
                    <span>Drink</span>
                  </button>
                  <button
                    onClick={() => action("robot")}
                    aria-label="Wake robot"
                    title="Wake robot"
                  >
                    <Zap size={18} />
                    <span>Robot</span>
                  </button>
                  <button
                    onClick={() => action("laptop")}
                    aria-label={laptopReady ? "Enter laptop" : "Wake laptop"}
                    title={laptopReady ? "Enter laptop" : "Wake laptop"}
                  >
                    <Monitor size={18} />
                    <span>{laptopReady ? "Enter" : "Laptop"}</span>
                  </button>
                </div>
              </>
            ) : (
              <div
                className="audience-bar"
                onTouchStart={(e) => {
                  touch.current = e.touches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  if (touch.current !== null) {
                    const delta = e.changedTouches[0].clientX - touch.current;
                    if (Math.abs(delta) > 40) {
                      const idx = audiences.indexOf(audience);
                      chooseAudience(
                        audiences[(idx + (delta < 0 ? 1 : 2)) % 3],
                      );
                    }
                    touch.current = null;
                  }
                }}
                role="group"
                aria-label="Choose audience"
              >
                {audiences.map((a, i) => (
                  <button
                    key={a}
                    aria-pressed={a === audience}
                    className={a === audience ? "active" : ""}
                    onClick={() => chooseAudience(a)}
                  >
                    <span>0{i + 1}</span>
                    {a}
                    <ArrowUpRight size={15} />
                  </button>
                ))}
              </div>
            )}
            {world === "dollhouse" && (
              <div className="campus-extras">
                <button onClick={() => openModal("demo")}>
                  Demo stage <ArrowUpRight size={14} />
                </button>
                <button onClick={() => openModal("projects")}>
                  Project portals <ArrowUpRight size={14} />
                </button>
                <button onClick={() => openModal("builders")}>
                  Wall of builders <ArrowUpRight size={14} />
                </button>
              </div>
            )}
            {world === "dollhouse" && (
              <aside className="campus-directory" aria-label="Campus directory">
                {assetError && (
                  <div role="status" className="asset-retry">
                    Some props could not load.{" "}
                    <button
                      onClick={() => {
                        setAssetError(false);
                        window.dispatchEvent(new Event("coded-retry-assets"));
                      }}
                    >
                      Retry 3D assets
                    </button>
                  </div>
                )}
                <div className="campus-view-controls">
                  <button
                    aria-pressed={campusView === "building"}
                    onClick={() => setCampusView("building")}
                  >
                    Building overview
                  </button>
                  <button
                    aria-pressed={
                      campusView === "floor" && getRoom(room).floor === 1
                    }
                    onClick={() => {
                      setRoom("ai");
                      setAudience("Professionals");
                      setCampusView("floor");
                    }}
                  >
                    Upstairs
                  </button>
                  <button
                    aria-pressed={
                      campusView === "floor" && getRoom(room).floor === 0
                    }
                    onClick={() => {
                      setRoom("youth");
                      setAudience("Youth");
                      setCampusView("floor");
                    }}
                  >
                    Downstairs
                  </button>
                </div>
                <div
                  className="room-tabs"
                  role="group"
                  aria-label="Choose room"
                  onTouchStart={(e) => {
                    touch.current = e.touches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    if (touch.current !== null) {
                      const dx = e.changedTouches[0].clientX - touch.current;
                      const floorRooms = rooms.filter(
                        (r) => r.floor === getRoom(room).floor,
                      );
                      const n = floorRooms.findIndex((r) => r.id === room);
                      if (Math.abs(dx) > 40)
                        chooseRoom(floorRooms[(n + (dx < 0 ? 1 : 2)) % 3].id);
                      touch.current = null;
                    }
                  }}
                >
                  {rooms.map((r) => (
                    <button
                      key={r.id}
                      aria-pressed={campusView === "room" && r.id === room}
                      onClick={() => chooseRoom(r.id)}
                    >
                      <span>{r.number}</span>
                      {r.name}
                      <small>{r.floor ? "UPSTAIRS" : "DOWNSTAIRS"}</small>
                    </button>
                  ))}
                </div>
                <div className="room-programs campus-programs">
                  <span className="eyebrow">
                    {campusView === "room"
                      ? getRoom(room).name
                      : `EXPLORE ${audience}`}
                  </span>
                  <p className="room-story">{getRoom(room).story}</p>
                  {campusView === "room" && (
                    <button
                      className="room-story-action"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("coded-room-step", { detail: room }),
                        )
                      }
                    >
                      Play next story moment <span>▷</span>
                    </button>
                  )}
                  {programs
                    .filter((p) =>
                      campusView === "room"
                        ? (
                            getRoom(room).programs as readonly string[]
                          ).includes(p.id)
                        : p.audience === audience,
                    )
                    .map((p) => (
                      <button
                        className={highlight === p.id ? "matched" : ""}
                        key={p.id}
                        onClick={() => explore(p.id)}
                      >
                        {p.title}
                        <span>↗</span>
                      </button>
                    ))}
                </div>
              </aside>
            )}
            <div className="scene-caption">
              <span className="tiny-cross">＋</span>
              <span>
                {world === "desk"
                  ? "NOT JUST A WEBSITE. YOUR NEXT CHAPTER."
                  : "YOU LEARN BY BUILDING. START EXPLORING."}
              </span>
            </div>
          </>
        ) : (
          <div className="program-container">
            <button
              className="back-link"
              onClick={() => {
                setCampusView("room");
                navigate("dollhouse");
              }}
            >
              <ArrowLeft size={16} /> Back to room
            </button>
            <Suspense fallback={<p>Opening your world…</p>}>
              {selected === "agentic-ai" ? (
                <AgenticAI
                  onComplete={() =>
                    setToast("Delegated. With you in control. ✳")
                  }
                />
              ) : (
                <ProgramWorld key={selected} id={selected} reduced={reduced} />
              )}
            </Suspense>
          </div>
        )}
      </main>
      <footer>
        <div className="footer-left">
          {world === "desk" ? (
            <>
              <span className="location-dot" />
              KUWAIT <span className="divider">/</span>
              <span>29.3759° N, 47.9774° E</span>
            </>
          ) : (
            <button className="back-link" onClick={() => navigate("desk")}>
              <ArrowLeft size={14} />
              Back to the desk
            </button>
          )}
        </div>
        <div className="footer-middle">
          <Hand size={14} />
          {world === "desk"
            ? "DRAG TO LOOK AROUND"
            : "EXPLORE AT YOUR OWN PACE"}
        </div>
        <div className="footer-right">
          <button
            className="icon-button"
            aria-label={muted ? "Enable sound" : "Mute sound"}
            onClick={() => setMuted(!muted)}
          >
            {muted ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          <button
            className={`icon-button ${reduced ? "selected" : ""}`}
            aria-label={reduced ? "Enable animations" : "Reduce motion"}
            aria-pressed={reduced}
            onClick={() => setReduced(!reduced)}
          >
            <RotateCcw size={15} />
          </button>
          <button
            className="skip-exploration"
            onClick={() => {
              setLoaded(true);
              openModal("programs");
            }}
          >
            Skip exploration <ArrowRight size={14} />
          </button>
          <button
            className="help-button"
            aria-label="Interaction help"
            onClick={() => setHelp(!help)}
          >
            ?
          </button>
        </div>
      </footer>
      {help && (
        <div className="help-popover">
          <strong>A little nudge.</strong>
          <p>
            Tap objects to discover them. Drag the scene to look around. Use Tab
            and Enter for all essential controls. In the campus, select an
            audience and a program.
          </p>
          <div className="choice-group">
            <button onClick={() => action("dates")}>Try a date</button>
            <button onClick={() => action("cookie")}>Take a byte</button>
            <button onClick={() => action("keyboard")}>Press RUN</button>
            <button onClick={() => action("button")}>Red button</button>
            <button onClick={() => action("duck")}>Talk to the duck</button>
          </div>
          <button onClick={() => setHelp(false)}>
            Got it <Check size={15} />
          </button>
        </div>
      )}
      {toast && (
        <div className="toast" role="status">
          <span>✳</span>
          {toast}
        </div>
      )}
      {portal && (
        <div className="portal" aria-label="Entering CODED">
          <div className="portal-ring" />
          <div className="portal-ring second" />
          <div className="portal-code">
            DATA / IDEAS / BUILD / API / 01 / CODED
          </div>
          <span>SEE YOU ON THE INSIDE.</span>
        </div>
      )}
      {modal && (
        <Modal
          title={modal === "path" ? "FIND MY PATH" : modal.toUpperCase()}
          onClose={() => setModal(null)}
          wide={[
            "programs",
            "passport",
            "demo",
            "projects",
            "builders",
            "arcade",
          ].includes(modal)}
        >
          {["demo", "projects", "builders", "arcade"].includes(modal) && (
            <Suspense fallback={<p>Opening the stage…</p>}>
              <CampusHub
                section={modal}
                onSection={(s) => setModal(s as ModalName)}
                onExplore={explore}
                stamps={stamps}
                reduced={reduced}
              />
            </Suspense>
          )}
          {modal === "duck" && (
            <>
              <div className="rubber-duck">🦆</div>
              <h2>Talk it out.</h2>
              <p>
                Explain your bug to the duck. What should happen? What happens
                instead? What assumption could you test?
              </p>
              <label className="field-label" style={{ marginTop: 20 }}>
                YOUR DEBUGGING NOTES
                <textarea
                  placeholder="Dear duck, here’s what I expected…"
                  rows={5}
                />
              </label>
              <p className="quiet">
                No AI. No judgment. Just you, a duck, and a clearer thought.
                Notes stay in this dialog and are discarded when it closes.
              </p>
            </>
          )}
          {modal === "passport" && (
            <Passport stamps={stamps} onExplore={explore} />
          )}
          {(modal === "programs" || modal === "apply") && (
            <>
              <h2>
                {modal === "apply"
                  ? "Your next chapter starts here."
                  : "There’s a place for you here."}
              </h2>
              <p>Real skills. Real projects. Find your world.</p>
              <div className="program-directory">
                {audiences.map((a) => (
                  <section key={a}>
                    <h3 className="eyebrow">{a}</h3>
                    {programs
                      .filter((p) => p.audience === a)
                      .map((p) => (
                        <button key={p.id} onClick={() => explore(p.id)}>
                          <span>
                            {p.title}
                            <small>
                              {p.genderEligibility === "Girls only"
                                ? "Girls only · "
                                : ""}
                              {p.freeOrPaid}
                            </small>
                          </span>
                          <ArrowUpRight size={19} />
                        </button>
                      ))}
                  </section>
                ))}
              </div>
            </>
          )}
          {modal === "path" && (
            <>
              <h2>A path that feels like you.</h2>
              <p>Two little questions. A world of possibility.</p>
              <h3 className="eyebrow">01 / WHERE ARE YOU?</h3>
              <div className="choice-group">
                {[
                  "Professional",
                  "Fresh graduate",
                  "University",
                  "High school",
                  "Parent / Junior",
                  "Company",
                ].map((s) => (
                  <button
                    key={s}
                    className={pathStage === s ? "active" : ""}
                    onClick={() => setPathStage(s)}
                    aria-pressed={pathStage === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <h3 className="eyebrow">02 / WHAT SPARKS YOUR CURIOSITY?</h3>
              <div className="choice-group">
                {[
                  "AI",
                  "Automation",
                  "App building",
                  "Cybersecurity",
                  "Data",
                  "Web",
                  "Entrepreneurship",
                  "Creative technology",
                ].map((s) => (
                  <button
                    key={s}
                    className={interest === s ? "active" : ""}
                    onClick={() => setInterest(s)}
                    aria-pressed={interest === s}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {pathStage && interest && (
                <div className="path-result">
                  <span className="eyebrow">A GOOD PLACE TO START</span>
                  <h3>
                    {matched === "companies"
                      ? "For companies"
                      : findProgram(matched).title}
                  </h3>
                  {matched === "academy-x" && (
                    <p>
                      Academy X is for girls in high school and university.
                      Other learners can explore{" "}
                      {pathStage === "High school" ? "Kuwait Codes" : "UniCODE"}
                      .
                    </p>
                  )}
                  <button
                    className="button orange"
                    onClick={() => {
                      if (matched === "companies") {
                        setModal("companies");
                        return;
                      }
                      setHighlight(matched);
                      chooseRoom(roomForProgram(matched).id);
                      navigate("dollhouse");
                    }}
                  >
                    Show me the way <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
          {modal === "companies" && (
            <>
              <span className="eyebrow">FOR TEAMS THAT BUILD WHAT’S NEXT</span>
              <h2>
                Build your people.
                <br />
                Build your future.
              </h2>
              <p>
                Explore employee upskilling, custom training, graduate
                development and youth sponsorship with CODED.
              </p>
              <div className="company-list">
                {[
                  "Professional training",
                  "Custom team programs",
                  "CSR & youth sponsorship",
                  "Family initiatives",
                ].map((s) => (
                  <div key={s}>
                    {s}
                    <ArrowUpRight size={17} />
                  </div>
                ))}
              </div>
              <a
                className="button dark"
                href="https://coded.kw/companies"
                target="_blank"
                rel="noreferrer"
              >
                Talk to CODED <ArrowUpRight size={17} />
              </a>
            </>
          )}
        </Modal>
      )}
      <div className="bottom-mark" aria-hidden="true">
        <ArrowDown size={14} />
      </div>
    </div>
  );
}
