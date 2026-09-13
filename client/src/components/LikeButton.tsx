import { useEffect, useRef, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import "./likeButton.css";

export default function LikeButton() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [count, setCount] = useState(28);
  const [liked, setLiked] = useState(false);
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const pending = useRef(false);
  useEffect(() => {
    const update = () => setVisible(document.readyState === "complete" && !document.querySelector(".pour-intro"));
    update();
    window.addEventListener("load", update);
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList:true, subtree:true });
    return () => { observer.disconnect(); window.removeEventListener("load", update); };
  }, []);
  async function load(method = "GET") {
    const response = await fetch("/api/likes", { method, credentials:"same-origin" });
    if (!response.ok) throw new Error();
    const data = await response.json();
    if (!Number.isSafeInteger(data.count) || data.count < 28 || typeof data.liked !== "boolean") throw new Error();
    setCount(data.count); setLiked(data.liked); setReady(true);
    return data;
  }
  useEffect(() => { void load().catch(() => setError("Likes unavailable. Tap to retry.")); }, []);
  async function like() {
    if (pending.current || liked) return;
    pending.current = true; setBusy(true); setError("");
    try {
      const state = ready ? { liked } : await load();
      if (!state.liked) await load("POST");
    } catch { setError("Couldn’t save your like. Tap to retry."); }
    finally { pending.current = false; setBusy(false); }
  }
  if (!visible || dismissed) return null;
  return <div className={`site-like note-${theme}`}>
    <button className="site-like-dismiss" aria-label="Hide like button" onClick={() => setDismissed(true)}>×</button>
    <button className="site-like-button" onClick={like} disabled={busy || liked} aria-pressed={liked} aria-label={liked ? `Liked. ${count} likes` : `Like this website. ${count} likes`}>
      <span className="site-like-heart" aria-hidden="true">{liked ? "♥" : "♡"}</span>
      <span aria-live="polite">{count} {liked ? "Liked" : "Likes"}</span>
    </button>
    {error && <span className="site-like-error" role="status">{error}</span>}
  </div>;
}
