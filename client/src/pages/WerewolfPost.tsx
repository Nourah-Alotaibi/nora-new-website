import { useEffect } from "react";
import "./werewolf-post.css";

export default function WerewolfPost() {
  useEffect(() => {
    const previous = document.title;
    document.title = "From First Place in 2D to a New World in 3D | Nourah Alotaibi";
    return () => { document.title = previous; };
  }, []);
  return (
    <div className="werewolf-journal">
      <header className="journal-header">
        <a href="/" className="journal-wordmark">nourah.</a>
        <a href="/">← Back to my studio</a>
      </header>
      <main id="main" className="journal-article">
        <article>
          <div className="journal-eyebrow">The blog · Game development</div>
          <h1>From first place in 2D to a new world in 3D.</h1>
          <p className="journal-deck">Werewolf’s Curse has a new chapter. I’ve independently reimagined the award-winning 2D game as a playable 3D online adventure.</p>
          <p className="journal-byline">By Nourah Alotaibi <span aria-hidden="true">·</span> <time dateTime="2026-10-03">October 3, 2026</time></p>
          <figure className="journal-film">
            <video controls playsInline preload="metadata" poster="/videos/werewolf-intro-2026-poster.jpg" aria-label="Werewolf’s Curse: full 29-second 3D game introduction">
              <source src="/videos/werewolf-intro-2026.mp4" type="video/mp4" />
              <a href="/videos/werewolf-intro-2026.mp4">Watch the 29-second game introduction</a>
            </video>
            <figcaption>The actual 3D game introduction: the confrontation, the witch’s curse, and the beginning of the search for a cure. 29 seconds.</figcaption>
          </figure>
          <div className="journal-body">
            <h2>An award was a milestone. I wanted to keep building.</h2>
            <p>The original Werewolf’s Curse was created in three intense days for the National Cultural Game Jam — Season Two. It earned First Place for Best Game in Kuwait and the Best Game Design Award, both in the Creative Category.</p>
            <p>That achievement remains a proud part of the game’s story. But I kept wondering what this adventure could become in a different dimension.</p>
            <p>For this new 3D version, I took on the development independently. Revisiting the idea gave me a chance to apply what I’ve learned, experiment, and build a world players can explore from a new perspective.</p>
            <h2>One curse. A journey back to being human.</h2>
            <p>A man confronts a witch, only to be cursed and transformed into a werewolf. He wakes in a strange cave, where his search for a way out begins.</p>
            <p>The adventure takes him across cave ledges and past bats, into a forest to collect ingredients, and finally to a hidden laboratory. There, the right mixture can break the curse and restore his human form.</p>
            <p>The video above shows the full opening from the actual game. You can then step into the adventure yourself.</p>
            <h2>Old ideas can open new doors.</h2>
            <p>Returning to a project can show you how much you’ve grown. An idea you once brought to life under a deadline can become a new challenge, with more room to explore and learn.</p>
            <p>If there’s something you still think about building, give it another chance. Start with what you know, stay curious, and see how far you can take it.</p>
          </div>
          <aside className="journal-play">
            <h2>Your turn to break the curse.</h2>
            <p>Play on a computer with a keyboard and mouse.</p>
            <a href="/werewolf/" className="journal-play-button">Play Werewolf’s Curse ↗</a>
            <small>WASD to move · Space to jump · E to interact</small>
          </aside>
        </article>
      </main>
      <footer className="journal-footer"><a href="/">Back to Nourah’s studio ↗</a></footer>
    </div>
  );
}
