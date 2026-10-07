import { useEffect, useState } from "react";
import { ArrowDown, ArrowUpRight, Code2, FlaskConical, Lightbulb, Moon, Search, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { ProjectArt } from "@/components/bright/ProjectGallery";
import { studioProjects, githubProjects, type CollectionProject, type ProjectCategory } from "@/data/projectCollection";
import "./projects.css";

const categories: Array<"All projects" | ProjectCategory> = ["All projects", "AI & machine learning", "Data analysis", "Cybersecurity", "Games & applications"];

function ProjectCard({ project, index }: { project: CollectionProject; index: number }) {
  const external = project.href?.startsWith("https://") ?? false;
  return (
    <article className={`collection-card${project.metric ? " collection-experiment" : ""}`} id={project.id}>
      <div className={`collection-visual${project.artIndex !== undefined ? " collection-art" : ""}${project.metric && project.image ? " collection-chart" : ""}`}>
        {project.artIndex !== undefined ? <ProjectArt index={project.artIndex} /> : project.image ? (
          <img src={project.image} alt={project.imageAlt ?? project.title} loading="lazy" decoding="async" />
        ) : (
          <div className="collection-prototype-art" aria-hidden="true"><Code2 size={64} strokeWidth={1} /><span>an experiment in progress</span></div>
        )}
        <span className="collection-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
      </div>
      <div className="collection-card-body">
        <div className="collection-meta"><span>{project.category}</span>{project.status && <span className="collection-status">{project.status}</span>}</div>
        <h3>{project.shortTitle ?? project.title}</h3>
        <p className="collection-question">{project.question}</p>
        <p className="collection-description">{project.description}</p>
        {project.metric && <div className="collection-result"><strong>{project.metric.value}</strong><span>{project.metric.label}</span></div>}
        <ul className="collection-tags" aria-label="Skills and tools">{project.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>
        {project.note && <details className="collection-notes"><summary>{project.noteLabel ?? "Context & limitations"}</summary><p>{project.note}</p></details>}
        {project.screenshots && <details className="collection-screenshots"><summary>Inside the lab · {project.screenshots.length} screenshots</summary><div>{project.screenshots.map(shot => <figure key={shot.src}><a href={shot.src} target="_blank" rel="noopener noreferrer"><img src={shot.src} alt={shot.caption} loading="lazy" /><span className="sr-only">Open full-size screenshot in a new tab</span></a><figcaption>{shot.caption}</figcaption></figure>)}</div></details>}
        {project.video && <details className="collection-demo"><summary>Watch the original demo</summary><video controls playsInline preload="none" aria-label={`${project.title} project demo`}><source src={project.video} type="video/mp4" />Your browser does not support this video.</video></details>}
        {project.href && project.linkLabel && <a className="collection-project-link" href={project.href} target={external ? "_blank" : undefined} rel={external ? "noopener noreferrer" : undefined}>{project.linkLabel}<ArrowUpRight size={17} aria-hidden="true" /><span className="sr-only">{external ? " (opens in a new tab)" : ""}</span></a>}
        {project.sourceHref && <a className="collection-source-link" href={project.sourceHref} target="_blank" rel="noopener noreferrer">Code, experiments & technical report ↗<span className="sr-only"> (opens in a new tab)</span></a>}
      </div>
    </article>
  );
}

export default function Projects() {
  const { theme, toggleTheme } = useTheme();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All projects");
  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const previousDescription = description?.content;
    document.title = "My Virtual Lab | Nourah Alotaibi";
    if (description) description.content = "Step into Nourah Alotaibi’s lab: finished projects, experiments and works in progress, from competitions and websites to AI and data science.";
    return () => { document.title = previousTitle; if (description && previousDescription !== undefined) description.content = previousDescription; };
  }, []);

  const matches = (project: CollectionProject) => (category === "All projects" || project.category === category) && `${project.title} ${project.shortTitle ?? ""} ${project.question} ${project.subtitle} ${project.description} ${project.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase());
  const studio = studioProjects.filter(matches);
  const experiments = githubProjects.filter(matches);
  const count = studio.length + experiments.length;
  const total = studioProjects.length + githubProjects.length;

  return (
    <div className={`project-collection collection-theme-${theme}`}>
      <a className="collection-skip" href="#project-main">Skip to projects</a>
      <header className="collection-header">
        <a className="collection-wordmark" href="/" aria-label="Nourah Alotaibi home">nourah.</a>
        <nav aria-label="Main navigation">
          <a href="/">Studio</a><a href="/project" aria-current="page">Project</a><a href="/blog">Blog</a>
          <button type="button" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "bright"} mode`}>{theme === "light" ? <Moon size={15} /> : <Sun size={15} />}<span>{theme === "light" ? "Dark mode" : "Bright mode"}</span></button>
        </nav>
      </header>
      <main id="project-main" className="collection-main">
        <section className="collection-hero" aria-labelledby="collection-title">
          <div>
            <p className="collection-eyebrow">Ideas, experiments & projects</p>
            <h1 id="collection-title">My <span>virtual lab. <i aria-hidden="true" style={{ fontStyle: "normal", fontSize: ".55em", whiteSpace: "nowrap", display: "inline-block" }}>💻 🧪</i></span></h1>
            <p className="collection-intro">"What if I tried…?" is how almost everything here started. Sometimes it became a website. Sometimes a game, a competition entry, or an AI experiment that refused to stay small. <strong>AI and data science</strong> are home base. Curiosity picks the detours.</p>
            <p className="collection-intro">Some are finished. Some are experiments. Some are still on the workbench. They came out of college, CODED Academy, UC Berkeley × AUM, my master’s studies and, mostly, my free time and sleepless nights. These are the ones I wanted to bring out of the folders.</p>
            <p className="collection-intro"><em>The internet and open-source projects taught me so much. This is me giving back.</em></p>
            <a className="collection-jump" href="#studio-projects">Explore the collection <ArrowDown size={16} /></a>
          </div>
          <aside className="collection-hero-note" aria-label="About this collection">
            <span className="collection-note-icons" aria-hidden="true"><Lightbulb size={38} strokeWidth={1.5} /><FlaskConical size={38} strokeWidth={1.5} /></span>
            <p>From an idea<br />to something<br /><em>you can explore.</em></p>
            <div><strong>90+</strong><span>projects, and the folder keeps growing</span></div>
          </aside>
        </section>
        <div className="collection-toolbar">
          <div className="collection-filter-heading"><span><span aria-hidden="true">🐇 </span>Find your next rabbit hole</span><p role="status" aria-live="polite">{count} of {total} projects</p></div>
          <label className="collection-search"><Search size={18} aria-hidden="true" /><span className="sr-only">Search projects</span><input type="search" placeholder="Search a project, idea or tool…" value={query} onChange={event => setQuery(event.target.value)} /></label>
          <div className="collection-filters" role="group" aria-label="Filter projects by category">{categories.map(item => <button key={item} type="button" aria-pressed={item === category} onClick={() => setCategory(item)}>{item}</button>)}</div>
        </div>
        {count === 0 && <div className="collection-empty"><h2>No projects found</h2><p>Try another keyword or explore the whole collection.</p><button type="button" onClick={() => { setQuery(""); setCategory("All projects"); }}>Show all projects</button></div>}
        <section id="studio-projects" className="collection-section" aria-labelledby="studio-projects-title" hidden={studio.length === 0}>
          <div className="collection-section-heading"><div><p className="collection-eyebrow">01 / From the studio</p><h2 id="studio-projects-title">Ideas brought <em>to life.</em></h2></div><p>The projects you’ve met around my website, gathered in one place.</p></div>
          <div className="collection-grid">{studio.map(project => <ProjectCard key={project.id} project={project} index={studioProjects.indexOf(project)} />)}</div>
        </section>
        <section className="collection-section" aria-labelledby="github-projects-title" hidden={experiments.length === 0}>
          <div className="collection-section-heading"><div><p className="collection-eyebrow">02 / From GitHub</p><h2 id="github-projects-title">Questions turned <em>into experiments.</em></h2></div><p>Each project has its own repository, with the code, results and the reasoning behind them.</p></div>
          <div className="collection-grid">{experiments.map(project => <ProjectCard key={project.id} project={project} index={studioProjects.length + githubProjects.indexOf(project)} />)}</div>
        </section>
      </main>
      <footer className="collection-footer"><div><a className="collection-wordmark" href="/">nourah.</a><p>Always curious. Still building.</p></div><nav aria-label="Footer navigation"><a href="/">Back to the studio ↗</a><a href="/blog">Read the blog ↗</a><a href="https://github.com/Nourah-Alotaibi" target="_blank" rel="noopener noreferrer">More on GitHub ↗</a></nav></footer>
    </div>
  );
}
