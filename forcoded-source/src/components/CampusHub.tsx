import { lazy, Suspense } from "react";
import { ArrowUpRight } from "lucide-react";
import { findProgram } from "../data/programs";
const WorldStage = lazy(() => import("../worlds/WorldStage"));
const projects = [
  {
    id: "agentic-ai",
    icon: "✳",
    name: "An AI operations team",
    caption: "Connect a workflow. Make the final call.",
  },
  {
    id: "ai-app",
    icon: "⌘",
    name: "A product that works",
    caption: "Build it. Use it. Ship it.",
  },
  {
    id: "cyber",
    icon: "◇",
    name: "A network defended",
    caption: "Follow the evidence. Contain the threat.",
  },
  {
    id: "data",
    icon: "▥",
    name: "Data with a purpose",
    caption: "Clean it. Train it. Make a prediction.",
  },
  {
    id: "kuwait-codes",
    icon: "</>",
    name: "A first website",
    caption: "Small code. Real possibility.",
  },
  {
    id: "unicode",
    icon: "⌥",
    name: "A project worth showing",
    caption: "Debug a real boundary condition.",
  },
  {
    id: "academy-x",
    icon: "↗",
    name: "An idea with a voice",
    caption: "Create your venture. Pitch your vision.",
  },
  {
    id: "camps",
    icon: "▣",
    name: "A robot with a plan",
    caption: "Your instructions bring it to life.",
  },
];
export default function CampusHub({
  section,
  onSection,
  onExplore,
  stamps,
  reduced,
}: {
  section: string;
  onSection: (s: string) => void;
  onExplore: (id: string) => void;
  stamps: string[];
  reduced: boolean;
}) {
  const navigation = (
    <div className="hub-tabs" role="group" aria-label="Shared campus areas">
      {[
        ["demo", "Demo stage"],
        ["projects", "Project portals"],
        ["builders", "Wall of builders"],
      ].map(([id, name]) => (
        <button
          key={id}
          aria-pressed={section === id}
          className={section === id ? "active" : ""}
          onClick={() => onSection(id)}
        >
          {name}
        </button>
      ))}
    </div>
  );
  if (section === "builders")
    return (
      <>
        {navigation}
        <span className="eyebrow">WALL OF BUILDERS</span>
        <h2>
          It starts with
          <br />
          “I built this.”
        </h2>
        <p>
          Every program leads to something you can show. Your passport is a
          record of the worlds you’ve explored.
        </p>
        <div className="builder-wall">
          {projects.map((p, i) => (
            <button
              key={p.id}
              onClick={() => onExplore(p.id)}
              className={stamps.includes(p.id) ? "visited" : ""}
            >
              <span>
                {stamps.includes(p.id) ? "✳" : String(i + 1).padStart(2, "0")}
              </span>
              <strong>{findProgram(p.id).title}</strong>
              <small>
                {stamps.includes(p.id)
                  ? "YOU EXPLORED THIS WORLD"
                  : "YOUR NEXT POSSIBILITY"}
              </small>
            </button>
          ))}
        </div>
        <p className="quiet">
          This concept uses program demonstrations. Real student projects and
          stories can be added when provided by CODED.
        </p>
      </>
    );
  return (
    <>
      {navigation}
      <span className="eyebrow">
        {section === "arcade"
          ? "A LITTLE PLAY. A LOT OF POSSIBILITY."
          : "THE SHARED CODED STAGE"}
      </span>
      <h2>
        {section === "arcade"
          ? "One more round?"
          : section === "projects"
            ? "Step inside an idea."
            : "You learn by building."}
      </h2>
      <p>
        {section === "arcade"
          ? "Pick a challenge. Your only opponent is your last attempt."
          : "Try a live concept demo, then discover the program behind it."}
      </p>
      {section === "demo" && (
        <div className="demo-stage-scene">
          <Suspense fallback={null}>
            <WorldStage kind="academy-x" active reduced={reduced} />
          </Suspense>
          <span>I BUILT THIS.</span>
        </div>
      )}
      <div className="project-portals">
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => onExplore(p.id)}
            style={
              {
                "--portal-color": findProgram(p.id).color,
              } as React.CSSProperties
            }
          >
            <span className="project-orb">
              <span>{p.icon}</span>
              <ArrowUpRight size={16} />
            </span>
            <strong>{p.name}</strong>
            <small>{p.caption}</small>
          </button>
        ))}
      </div>
      <p className="quiet">
        Interactive concept demos. Enrollment and current program details are
        handled by CODED.
      </p>
    </>
  );
}
