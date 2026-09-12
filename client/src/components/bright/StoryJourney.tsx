import { useState, useRef } from "react";
import StoryDiorama from "./StoryDiorama";
import { journeyChapters } from "@/data/portfolio";

const chapters = [
  {
    label: "A first direction",
    short:
      "Mechanical engineering at AUM. Learning how things work, one question at a time.",
    object: "books",
    color: "butter",
  },
  {
    label: "The spark",
    short:
      "One web-development bootcamp. My first lines of code. A whole new world of possibilities.",
    object: "laptop",
    color: "peach",
  },
  {
    label: "A change of major",
    short: "I followed my curiosity and switched to Computer Engineering.",
    object: "books",
    color: "sage",
  },
  {
    label: "Giving back",
    short:
      "Back at CODED, this time as a student mentor. Helping someone else find their spark.",
    object: "laptop",
    color: "lilac",
  },
  {
    label: "Finding my people",
    short:
      "Joining AUM’s first Google Developer Student Club, teaching web development, and learning together.",
    object: "books",
    color: "peach",
  },
  {
    label: "Ideas with impact",
    short:
      "The UC Berkeley AI & Entrepreneurship program led to EVA, an award-winning assistive AI project.",
    object: "robot",
    color: "butter",
  },
  {
    label: "A new challenge in a new world",
    short:
      "Cybersecurity, CTFs, and a new way to think about solving problems.",
    object: "laptop",
    color: "lilac",
  },
  {
    label: "Care meets code",
    short:
      "Building EpiCare with clinical collaborators. Then graduating with Honors in June 2025.",
    object: "books",
    color: "sage",
  },
  {
    label: "Inspiring the next generations",
    short:
      "Teaching AI, Python, robotics, and entrepreneurship—from little learners to graduates.",
    object: "robot",
    color: "peach",
  },
  {
    label: "Still curious",
    short:
      "A Master’s in Data Science & AI. Exploring healthcare, agentic AI, and what comes next.",
    object: "robot",
    color: "sage",
  },
];
export default function StoryJourney() {
  const [open, setOpen] = useState(false);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(0);
  const item = chapters[active],
    full = journeyChapters[active];
  return (
    <section
      id="about"
      className="studio-about story-studio"
      aria-labelledby="about-title"
    >
      <div className="studio-section-top">
        <span className="section-index">02 / A STORY THAT’S STILL GROWING</span>
        <span>FOLLOW THE LITTLE SPARKS</span>
      </div>
      <div className="story-heading">
        <div>
          <h2 id="about-title">
            A curious mind.
            <br />
            <em>A colorful journey.</em>
          </h2>
          <p>A few turns, a few firsts, and a lot of learning along the way.</p>
        </div>
      </div>
      <div className={`journey-book ${open ? "book-open" : "book-closed"}`}>
        {!open ? (
          <button
            className="journey-cover"
            onClick={() => setOpen(true)}
            aria-label="Open Nourah’s journey book"
          >
            <span className="book-edition">A FEW TURNS, A FEW FIRSTS</span>
            <strong>
              Nourah’s
              <br />
              <em>journey</em>
            </strong>
            <span className="book-cover-portrait">
              <img src="/image.png" alt="Nourah Alotaibi" loading="lazy" />
              <i>hi, it’s me ↙</i>
            </span>
            <span className="book-cover-years">2020 — TODAY</span>
            <span className="book-open-label">Open my story ↗</span>
          </button>
        ) : (
          <>
            <div className="book-toolbar">
              <span>
                Nourah’s journey <small> / swipe to turn a page</small>
              </span>
              <button onClick={() => setOpen(false)}>Close book ×</button>
            </div>
            <div
              className="story-stops"
              role="group"
              aria-label="Choose a story chapter"
            >
              {chapters.map((chapter, i) => (
                <button
                  type="button"
                  className={`stop-${chapter.color}`}
                  key={chapter.label}
                  aria-label={`Chapter ${i + 1}: ${chapter.label}`}
                  aria-pressed={active === i}
                  onClick={() => setActive(i)}
                >
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <small>{journeyChapters[i].date.match(/\d{4}/)?.[0]}</small>
                </button>
              ))}
            </div>
            <article
              key={active}
              tabIndex={0}
              style={{ cursor: active < chapters.length - 1 ? "pointer" : "auto" }}
              onClick={e => {
                if (e.currentTarget.dataset.swiped === "yes") { e.currentTarget.dataset.swiped = ""; return; }
                if ((e.target as HTMLElement).closest("button,summary,a,details")) return;
                if (window.getSelection()?.toString()) return;
                setActive(current => Math.min(chapters.length - 1, current + 1));
              }}
              onKeyDown={e => {
                if (e.target !== e.currentTarget) return;
                if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(Math.min(9, active + 1));
                }
                if (e.key === "ArrowLeft") {
                  e.preventDefault();
                  setActive(Math.max(0, active - 1));
                }
              }}
              onPointerDown={e => {
                e.currentTarget.dataset.swiped = "";
                if (
                  e.pointerType !== "mouse" &&
                  !(e.target as HTMLElement).closest("button,summary,a")
                )
                  touch.current = { x: e.clientX, y: e.clientY };
              }}
              onPointerUp={e => {
                const start = touch.current;
                touch.current = null;
                if (!start) return;
                const dx = e.clientX - start.x,
                  dy = e.clientY - start.y;
                if (Math.abs(dx) > 10 || Math.abs(dy) > 10) e.currentTarget.dataset.swiped = "yes";
                if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.4)
                  setActive(
                    Math.max(0, Math.min(9, active + (dx < 0 ? 1 : -1)))
                  );
              }}
              onPointerCancel={() => {
                touch.current = null;
              }}
              className={`story-postcard postcard-${item.color}`}
              aria-labelledby="chapter-heading"
              onPointerMove={e => {
                if (
                  e.pointerType !== "mouse" ||
                  matchMedia("(prefers-reduced-motion: reduce)").matches
                )
                  return;
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty(
                  "--rx",
                  `${((e.clientY - r.top) / r.height - 0.5) * -12}deg`
                );
                e.currentTarget.style.setProperty(
                  "--ry",
                  `${((e.clientX - r.left) / r.width - 0.5) * 16}deg`
                );
              }}
              onPointerLeave={e => {
                e.currentTarget.style.setProperty("--rx", "0deg");
                e.currentTarget.style.setProperty("--ry", "0deg");
              }}
            >
              <div className="story-object-stage">
                <span className="postcard-stamp">
                  CHAPTER
                  <br />
                  <strong>{String(active + 1).padStart(2, "0")}</strong>
                </span>
                <StoryDiorama chapter={active} />
              </div>
              <div className="postcard-story">
                <span className="book-date">{full.date}</span>
                <h3 id="chapter-heading">
                  {item.label}
                  <span>.</span>
                </h3>
                <p>{item.short}</p>
                <details key={active}>
                  <summary>The whole chapter ↗</summary>
                  <p>{full.story}</p>
                </details>
                <div className="story-paging">
                  <button
                    type="button"
                    disabled={active === 0}
                    onClick={() => setActive(active - 1)}
                    aria-label="Previous chapter"
                  >
                    ←
                  </button>
                  <span aria-live="polite">
                    {String(active + 1).padStart(2, "0")} / 10
                  </span>
                  <button
                    type="button"
                    disabled={active === 9}
                    onClick={() => setActive(active + 1)}
                    aria-label="Next chapter"
                  >
                    →
                  </button>
                </div>
              </div>
              {active < chapters.length - 1 && (
                <button
                  type="button"
                  className="book-page-corner"
                  aria-label="Turn to next chapter"
                  title="Turn to next chapter"
                  onClick={() => setActive(current => Math.min(chapters.length - 1, current + 1))}
                >
                  
                </button>
              )}
            </article>
          </>
        )}
      </div>
    </section>
  );
}
