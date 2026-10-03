import { useEffect } from "react";
import { useRoute } from "wouter";
import { sortedBlogPosts } from "@/data/blogPosts";
import { useTheme } from "@/contexts/ThemeContext";
import NotFound from "./NotFound";
import "./werewolf-post.css";

const displayDate = (date: string) => new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));

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
          <a href={post ? "/blog" : "/"}>{post ? "← Back to Blog" : "← Back to my studio"}</a>
          <button type="button" onClick={toggleTheme}>{theme === "light" ? "Dark mode" : "Bright mode"}</button>
        </nav>
      </header>
      <main id="main" className="journal-article">
        {post ? (
          <article>
            <div className="journal-eyebrow">Notes from my corner of the internet.</div>
            <h1>{post.title}</h1>
            <p className="journal-byline"><time dateTime={post.date}>{displayDate(post.date)}</time></p>
            {post.video && <figure className="journal-film">
              <video controls playsInline preload="metadata" poster={post.video.poster} aria-label={`${post.title} — game introduction`}>
                <source src={post.video.src} type="video/mp4" />
                <a href={post.video.src}>Watch the game introduction</a>
              </video>
              <figcaption>{post.video.caption}</figcaption>
            </figure>}
            <div className="journal-body">
              {post.content.map((block, index) => block.type === "heading" ? <h2 key={index}>{block.text}</h2> : <p key={index}>{block.text}</p>)}
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
                <time dateTime={item.date}>{displayDate(item.date)}</time>
                <h2><a href={`/blog/${item.slug}`}>{item.title}</a></h2>
                <p>{item.excerpt}</p>
                <a className="journal-read" href={`/blog/${item.slug}`} aria-label={`Read ${item.title}`}>Read →</a>
              </article>)}
            </div>
          </>
        )}
      </main>
      <footer className="journal-footer"><a href={post ? "/blog" : "/"}>{post ? "← Back to Blog" : "Back to Nourah’s studio ↗"}</a></footer>
    </div>
  );
}
