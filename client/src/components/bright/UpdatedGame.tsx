import "./UpdatedGame.css";

export default function UpdatedGame() {
  return (
    <details className="werewolf-update">
      <summary>Updated Werewolf’s Curse 2026 <span aria-hidden="true">↗</span></summary>
      <div className="werewolf-update-body">
        <p>A new third-person adventure. Watch the full journey from the cave to the cure.</p>
        <video controls playsInline preload="none" aria-label="Werewolf’s Curse 2026 full gameplay">
          <source src="/videos/werewolf-full-playthrough-2026.mp4" type="video/mp4" />
          <a href="/videos/werewolf-full-playthrough-2026.mp4">Watch the gameplay video</a>
        </video>
        <a className="werewolf-play-link" href="/werewolf/" target="_blank" rel="noopener noreferrer">Play Werewolf’s Curse 2026 ↗</a>
        <p className="werewolf-computer-note">Computer only · Keyboard and mouse required.</p>
      </div>
    </details>
  );
}
