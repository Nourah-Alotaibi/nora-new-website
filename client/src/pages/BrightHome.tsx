import { useEffect, useState, useRef } from "react";
import {
  ArrowUpRight,
  ArrowDown,
  Github,
  Mail,
  Moon,
  Sun,
  Linkedin,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { PA_PROJECTS } from "@/data/portfolio";
import MatchaScene from "@/components/bright/MatchaScene";
import PigmentCanvas, {
  palettes,
  type Palette,
} from "@/components/bright/PigmentCanvas";
import "./bright.css";
import { stopStudioAudio } from "@/components/bright/pourAudio";
import PourIntro from "@/components/bright/PourIntro";
import ProjectGallery, {
  ProjectArt,
  artColors,
} from "@/components/bright/ProjectGallery";
import StoryJourney from "@/components/bright/StoryJourney";

function PlainText({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\[\[(?:org|num|rank):[^\]]+\]\])/).map((part, i) => {
        const match = part.match(/^\[\[(?:org|num|rank):(.+)\]\]$/);
        return match ? <strong key={i}>{match[1]}</strong> : part;
      })}
    </>
  );
}

export function ModeSwitch() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      className={`header-mode ${theme === "dark" ? "header-mode-dark" : ""}`}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "bright"} mode`}
    >
      {theme === "light" ? <Moon size={15} /> : <Sun size={15} />}
      <span>{theme === "light" ? "Dark mode" : "Bright mode"}</span>
    </button>
  );
}

export default function BrightHome() {
  const funFactDialog = useRef<HTMLDialogElement>(null);
  const projectVideo = useRef<HTMLVideoElement>(null);
  const [filmPlaying, setFilmPlaying] = useState(false);
  useEffect(() => () => stopStudioAudio(), []);
  const [palette, setPalette] = useState<Palette>("matcha");
  const [active, setActive] = useState(0);
  const [deskReady, setDeskReady] = useState(false);
  const [intro, setIntro] = useState(() => {
    try {
      return !matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch {
      return false;
    }
  });
  useEffect(() => {
    if (!intro) return;
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = before;
    };
  }, [intro]);
  const finishIntro = () => {
    setIntro(false);
  };
  const p = PA_PROJECTS[active];
  return (
    <>
      {intro && <PourIntro ready={deskReady} onComplete={finishIntro} />}
      <div
        inert={intro ? true : undefined}
        className="bright-site"
        style={
          {
            "--studio-accent": palettes[palette].accent,
            "--studio-soft": palettes[palette].soft,
          } as React.CSSProperties
        }
      >
        <a className="studio-skip" href="#main">
          Skip to content
        </a>
        <header className="studio-header">
          <a
            href="#main"
            className="studio-wordmark"
            aria-label="Nourah Alotaibi home"
          >
            nourah
          </a>
          <nav aria-label="Main navigation">
            <a href="#studio">Off the screen</a>
          </nav>
          <a href="#connect" className="header-contact">
            Let’s talk <ArrowUpRight size={17} />
          </a>
          <ModeSwitch />
        </header>

        <main id="main">
          <section className="studio-hero" aria-labelledby="intro-title">
            <div className="studio-hero-grid">
              <div className="studio-intro">
                <h1 id="intro-title">
                  Nourah’s studio
                  <br />
                  <em className="hero-idea-line">
                    Welcome to the home of my ideas
                  </em>
                </h1>
                <div className="hero-role-caption">NOURAH ALOTAIBI · COMPUTER ENGINEER &amp; AI DEVELOPER</div>
                <p>
                  I enjoy building AI systems, working with data, getting creative with websites, and solving CTFs (cybersecurity challenges). Coding is my hobby, so most ideas somehow end up becoming projects.
                </p>
                <div className="studio-actions">
                  <a className="studio-button" href="#work">
                    Explore my work <ArrowUpRight size={19} />
                  </a>
                  <a className="studio-text-link" href="#about">
                    A little about me <ArrowDown size={15} />
                  </a>
                </div>
                <nav className="hero-contact-circles" aria-label="Get in touch">
                  <a
                    href="https://mail.google.com/mail/?view=cm&fs=1&to=noooriii760%40gmail.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Email Nourah in Gmail (opens in a new tab)"
                    title="Send a little hello in Gmail"
                  >
                    <Mail size={19} aria-hidden="true" />
                  </a>
                  <a
                    href="https://github.com/nourah-alotaibi"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Nourah on GitHub"
                    title="Find me on GitHub"
                  >
                    <Github size={19} aria-hidden="true" />
                  </a>
                  <a
                    href="https://www.linkedin.com/in/nourah-fahad-alotaibi-14b121226/"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Nourah on LinkedIn"
                    title="Find me on LinkedIn"
                  >
                    <Linkedin size={19} aria-hidden="true" />
                  </a>
                </nav>
              </div>
              <div className="hero-still-life morning-desk">
                <MatchaScene onReady={() => setDeskReady(true)} />
              </div>
            </div>
          </section>

          <section
            id="work"
            className="studio-work"
            aria-labelledby="work-title"
          >
            <div className="studio-section-top">
              <span className="section-index">01 / SELECTED WORK</span>
              <span>IDEAS, BROUGHT INTO THE WORLD</span>
            </div>
            <div className="section-intro">
              <h2 id="work-title">
                A few things <em>I’ve built.</em>
              </h2>
              <p>
                There’s more on GitHub, including security and CTF projects.
              </p>
            </div>
            <a className="studio-text-link" href="https://github.com/nourah-alotaibi" target="_blank" rel="noopener noreferrer">More on GitHub</a>
            <div
              className="project-exhibition"
              style={
                {
                  "--exhibit-color": artColors[active][0],
                } as React.CSSProperties
              }
            >
              <ProjectGallery active={active} onChange={setActive} />
              <a
                className="gallery-connection"
                href="#studio-project"
                style={
                  {
                    "--exhibit-color": artColors[active][0],
                  } as React.CSSProperties
                }
              >
                <span className="exhibit-thread" aria-hidden="true" />
                <span>YOU SELECTED THIS COVER</span>
                <strong>
                  {p.number} / {p.title}
                </strong>
                <span>
                  Its {p.video ? "demo" : "preview"} + explanation are right
                  below ↓
                </span>
              </a>
              <div className="sr-only" role="status" aria-live="polite">
                Showing {p.title}, project {active + 1} of {PA_PROJECTS.length}
              </div>
              <article
                key={p.id}
                id="studio-project"
                className="studio-project exhibit-case"
                style={
                  {
                    "--exhibit-color": artColors[active][0],
                  } as React.CSSProperties
                }
                aria-labelledby="project-title"
              >
                <header className="exhibit-heading">
                  <div className="exhibit-mini">
                    <ProjectArt index={active} />
                  </div>
                  <div>
                    <span>PROJECT SCREENING · {p.number}</span>
                    <strong>{p.title}</strong>
                  </div>
                  <a href="#work">Back to the shelf ↑</a>
                </header>
                <div className="project-film">
                  <span className="tv-handle" aria-hidden="true" />
                  <span className="tv-feet" aria-hidden="true"><i /><i /></span>
                  <div className="film-meta">
                    <span>{p.badge}</span>
                    <span>{p.number} / 05</span>
                  </div>
                  <div className={`project-screen project-screen-${p.id}`}>
                    {p.video ? (
                      <video
                        key={p.video}
                        ref={projectVideo}
                        onPlay={()=>setFilmPlaying(true)}
                        onPause={()=>setFilmPlaying(false)}
                        onEnded={()=>setFilmPlaying(false)}
                        src={p.video}
                        controls
                        playsInline
                        preload="metadata"
                        aria-label={`${p.title} project demo`}
                      />
                    ) : (
                      <img
                        src={p.image}
                        alt="RISE trading platform interface"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="vintage-tv-tuning">
                    <span className="tv-channel">CH {p.number}</span>
                    <button type="button" className="tv-dial" aria-label="Previous project channel" onClick={()=>setActive((active+PA_PROJECTS.length-1)%PA_PROJECTS.length)}><span aria-hidden="true">−</span></button>
                    <span className="tv-channel">TUNE</span>
                    <button type="button" className="tv-dial" aria-label="Next project channel" onClick={()=>setActive((active+1)%PA_PROJECTS.length)}><span aria-hidden="true">＋</span></button>
                    <span className="tv-speaker" aria-hidden="true" />
                    <span className="tv-brand">STUDIO TV</span>
                  </div>
                  <div className="film-caption">
                    <span>
                      {p.video
                        ? "A closer look · Play the project film"
                        : "In the making · Interface preview"}
                    </span>
                    {p.video && <button className="tv-play" aria-label={filmPlaying ? "Pause project film" : "Play project film"} onClick={()=>{const video=projectVideo.current;if(video){if(video.paused) void video.play().catch(()=>{});else video.pause();}}}>{filmPlaying ? "Ⅱ" : "▶"}</button>}
                  </div>
                </div>
                <div className="project-story">
                  <span className="project-category">{p.badge}</span>
                  <h3 id="project-title">
                    {p.title === "EPICARE"
                      ? "EpiCare"
                      : p.title === "WEREWOLF CURSE"
                        ? "Werewolf Curse"
                        : p.title === "AAFIYA"
                          ? "Aafiya"
                          : p.title}
                  </h3>
                  <h4>{p.subtitle}</h4>
                  {p.desc.split("\n\n").map((para, i) => (
                    <p key={i}>
                      <PlainText text={para} />
                    </p>
                  ))}
                  <ul className="project-recognitions">
                    {p.recognitions.map((r, i) => (
                      <li key={i}>
                        
                        <PlainText text={r.text} />
                      </li>
                    ))}
                  </ul>
                  <div className="studio-tags">
                    {p.tags.map(tag => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </article>
            </div>
          </section>

          <StoryJourney />

          <section
            id="studio"
            className="studio-play"
            aria-labelledby="studio-title"
          >
            <div className="studio-section-top">
              <span className="section-index">
                03 / OFF THE SCREEN, ON THE CANVAS
              </span>
              <span>A SMALL CREATIVE DETOUR</span>
            </div>
            <div className="play-grid">
              <div className="play-copy">
                <span className="small-flower" aria-hidden="true">
                  ✳
                </span>
                <h2 id="studio-title">
                  There’s always
                  <br />
                  room for
                  <br />
                  <em>a little color.</em>
                </h2>
                <p>
                  When I’m not building with code, I’m probably making a mess
                  with acrylics.
                </p>
                <p>Acrylic paint, matcha, and somewhere green usually help.</p>
                <p className="paint-instruction">
                  Brush across this little landscape to bring it to life. It’s
                  painted with code.
                </p>
                <fieldset className="studio-palette">
                  <legend>Pick a pigment</legend>
                  {(Object.keys(palettes) as Palette[]).map(key => (
                    <button
                      type="button"
                      key={key}
                      onClick={() => setPalette(key)}
                      aria-pressed={palette === key}
                      aria-label={`Use ${palettes[key].name} palette`}
                    >
                      <span style={{ background: palettes[key].accent }} />
                      {palettes[key].name}
                    </button>
                  ))}
                </fieldset>
                <button type="button" className="studio-fun-fact desk-sparkle-button" onClick={()=>funFactDialog.current?.showModal()}>Fun fact 🍵</button>
                <dialog ref={funFactDialog} className="matcha-fact-dialog" aria-labelledby="matcha-fact-title" onClick={e=>{if(e.target===e.currentTarget) funFactDialog.current?.close();}}>
                  <div className="matcha-fact-content">
                    <button type="button" className="matcha-fact-close" aria-label="Close fun fact" autoFocus onClick={()=>funFactDialog.current?.close()}>Close ×</button>
                    <h3 id="matcha-fact-title">A little matcha fact 🍵</h3>
                    <p>I’m a certified matcha specialist and tester too!</p>
                    <img src="/matcha-certificate.png" alt="Nourah Fahad Alotaibi’s certificate of completion for the Matcha Protocols Foundational Training Course, dated 10 September 2026" loading="lazy" />
                  </div>
                </dialog>
              </div>
              <PigmentCanvas palette={palette} />
            </div>
          </section>
          <section
            id="connect"
            className="studio-connect"
            aria-labelledby="connect-title"
          >
            <span className="section-index">
              04 / LET’S MAKE SOMETHING MEANINGFUL
            </span>
            <h2 id="connect-title">
              Good things start
              <br />
              with <em>a conversation.</em>
            </h2>
            <a className="contact-email" href="mailto:noooriii760@gmail.com">
              Say hello <ArrowUpRight />
            </a>
            <div className="contact-links">
              <a href="mailto:noooriii760@gmail.com">
                <Mail size={16} />
                noooriii760@gmail.com
              </a>
              <a
                href="https://github.com/nourah-alotaibi"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github size={16} />
                GitHub <ArrowUpRight size={15} />
              </a>
            </div>
          </section>
        </main>
        <footer className="studio-footer">
          <a className="studio-wordmark" href="#main">
            nourah
          </a>
          <span>© {new Date().getFullYear()} Nourah Alotaibi</span>
          <span>A little science. A little art. A lot of heart.</span>
          <button
            type="button"
            className="replay-pour"
            onClick={() => setIntro(true)}
          >
            Replay the pour ↻
          </button>
          <a href="#main">Back to top ↑</a>
        </footer>
      </div>
    </>
  );
}
