import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function ProjectImageZoom({ src, alt }: { src: string; alt: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  return <>
    <button ref={trigger} type="button" className="project-image-open" aria-label="Enlarge project image" aria-haspopup="dialog"
      onClick={() => { setZoom(1); setOpen(true); dialog.current?.showModal(); }}>
      <img src={src} alt={alt} loading="lazy" />
      <span>Tap to zoom</span>
    </button>
    {createPortal(<dialog ref={dialog} className="project-image-viewer" aria-label={alt}
      onClose={() => { setOpen(false); trigger.current?.focus({ preventScroll: true }); }}
      onClick={event => { if (event.target === event.currentTarget) {
        const r = event.currentTarget.getBoundingClientRect();
        if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.current?.close();
      } }}
      onKeyDown={event => {
        if (event.key !== "Tab") return;
        const buttons = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not(:disabled)"));
        const first = buttons[0], last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }}>
      <div className="project-image-tools">
        <button type="button" aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(z => Math.max(1, z - .5))}>−</button>
        <span aria-live="polite">{Math.round(zoom * 100)}%</span>
        <button type="button" aria-label="Zoom in" disabled={zoom >= 4} onClick={() => setZoom(z => Math.min(4, z + .5))}>＋</button>
        <button type="button" onClick={() => setZoom(1)}>Reset</button>
        <button type="button" aria-label="Close image" onClick={() => dialog.current?.close()}>×</button>
      </div>
      <div className="project-image-scroll"><img src={src} alt={alt} style={{ width: `${zoom * 100}%` }} /></div>
      <p>Use + to zoom, then swipe or scroll to explore.</p>
    </dialog>, document.body)}
  </>;
}
