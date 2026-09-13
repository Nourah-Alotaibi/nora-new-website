import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import "./UpdatedGame.css";

export default function UpdatedGame({ onOpen }: { onOpen: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return <>
    <div className="updated-game">
      <button ref={trigger} type="button" aria-haspopup="dialog" onClick={() => {
        onOpen();
        setOpen(true);
        dialog.current?.showModal();
      }}><span aria-hidden="true">▶ </span>Updated game in 2026</button>
      <p>Version 3 · Made with Meshy and Blender.</p>
    </div>
    {createPortal(<dialog ref={dialog} className="updated-game-dialog" aria-labelledby="updated-game-title"
      onClose={() => {
        video.current?.pause();
        setOpen(false);
        trigger.current?.focus({ preventScroll: true });
      }} onClick={event => {
        if (event.target !== event.currentTarget) return;
        const r = event.currentTarget.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.current?.close();
      }}>
      <header><h2 id="updated-game-title">Werewolf Curse · 2026</h2>
        <button type="button" aria-label="Close updated gameplay" onClick={() => dialog.current?.close()}>Close ×</button>
      </header>
      {open && <video ref={video} src="/videos/Werewolfs-Curse-Gameplay.mp4" controls playsInline preload="metadata" aria-label="Werewolf Curse version 3 gameplay" />}
    </dialog>, document.body)}
  </>;
}
