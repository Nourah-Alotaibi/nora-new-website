import { useEffect } from "react";
import { useRoute } from "wouter";
import { sortedBlogPosts } from "@/data/blogPosts";
import { useTheme } from "@/contexts/ThemeContext";
import NotFound from "./NotFound";
import "./werewolf-post.css";

const displayDate = (date: string) => new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

function ArticleText({ text }: { text: string }) {
  return <>{text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => part.startsWith("**") ? <strong key={i}>{part.slice(2, -2)}</strong> : part.startsWith("*") ? <em key={i}>{part.slice(1, -1)}</em> : part)}</>;
}

export default function Blog() {
  const [, params] = useRoute("/blog/:slug");
  const post = params ? sortedBlogPosts.find(item => item.slug === params.slug) : undefined;
  const { theme, toggleTheme } = useTheme();
  useEffect(() => {
    const previous = document.title;
    document.title = `${post?.title ?? "Blog"} | Nourah Alotaibi`;
    return () => { document.title = previous; };
  }, [post]);
  if (params && !post) return <NotFound />;
  return (
    <div className={`werewolf-journal journal-theme-${theme}`}>
      <header className="journal-header">
        <a href="/" className="journal-wordmark">nourah.</a>
        <nav aria-label="Blog navigation">
          <a href="/project">Project</a>
          <a href={post ? "/blog" : "/"}>{post ? "← Back to Blog" : "← Back to my studio"}</a>
          <button type="button" onClick={toggleTheme}>{theme === "light" ? "Dark mode" : "Bright mode"}</button>
        </nav>
      </header>
      <main id="main" className={`journal-article${post ? "" : " journal-index"}`}>
        {post ? (
          <article>
            <div className="journal-eyebrow">Notes from my corner of the internet.</div>
            <h1>{post.title}</h1>
            <p className="journal-byline"><time dateTime={post.date}>{displayDate(post.date)}</time></p>
            {post.video && <figure className="journal-film">
              <video controls playsInline preload="metadata" poster={post.video.poster} aria-label={`${post.title} — game video`}>
                <source src={post.video.src} type="video/mp4" />
                <a href={post.video.src}>Watch the game video</a>
              </video>
              {post.video.caption && <figcaption>{post.video.caption}</figcaption>}
            </figure>}
            <div className="journal-body">
              {post.content.filter(block => !block.hidden).map((block, index) => block.type === "gallery" ? <div className="journal-mode-gallery" aria-label={block.text} key={index}>{block.images?.map(image => <a href={image.src} key={image.src} aria-label={`View ${image.alt} screenshot`}><img src={image.src} alt={image.alt} loading="lazy" /></a>)}</div> : block.type === "image" ? <figure className={`journal-post-image${block.href?.includes("snake-panel-") ? " journal-panel-image" : ""}`} key={index}><img src={block.href} alt={block.text} loading="lazy" /><figcaption>{block.text}</figcaption></figure> : block.type === "heading" ? <h2 key={index}>{block.text}</h2> : block.type === "quote" ? <blockquote className="journal-quote" dir="auto" lang={block.lang} key={index}>{block.text}</blockquote> : block.type === "link" ? <p className="journal-story-link" key={index}><a href={block.href}>{block.text}</a></p> : <p key={index}><ArticleText text={block.text} /></p>)}
            </div>
            {post.playHref && <aside className="journal-play">
              <h2>Your turn to break the curse.</h2>
              <p>Play on a computer with a keyboard and mouse.</p>
              <a href={post.playHref} className="journal-play-button">Play Werewolf’s Curse ↗</a>
              <small>WASD to move · Space to jump · E to interact</small>
            </aside>}
          </article>
        ) : (
          <>
            <div className="journal-eyebrow">Nourah’s studio</div>
            <h1>Blog</h1>
            <p className="journal-deck">Notes from my corner of the internet.</p>
            <div className="journal-list">
              {sortedBlogPosts.map(item => <article className="journal-preview" key={item.slug}>
                <a className="journal-card" href={`/blog/${item.slug}`} aria-label={`Read ${item.title}`}>
                  {item.cover && <div className={`journal-card-cover${item.coverStyle === "portrait" ? " journal-cover-portrait" : ""}`}>
                    {item.coverStyle === "portrait" ? <div className="journal-portrait-art"><img src={item.cover} alt="" loading="lazy" /><span className="journal-cover-note">How it all started.</span></div> : <img src={item.cover} alt="" loading="lazy" />}
                  </div>}
                  <div className="journal-card-content">
                    <div className="journal-card-meta"><span>{item.category ?? "Studio notes"}</span><time dateTime={item.date}>{displayDate(item.date)}</time></div>
                    <h2>{item.title}</h2>
                    <p>{item.excerpt}</p>
                    <span className="journal-card-read">Read the story <span aria-hidden="true">↗</span></span>
                  </div>
                </a>
              </article>)}
            </div>
          </>
        )}
      </main>
      <footer className="journal-footer"><a href={post ? "/blog" : "/"}>{post ? "← Back to Blog" : "Back to Nourah’s studio ↗"}</a></footer>
    </div>
  );
}
