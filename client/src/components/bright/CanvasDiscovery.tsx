import StudioNotes from "./StudioNotes";
import { useRef, useState, type ReactNode } from "react";
import "./CanvasDiscovery.css";

/** A frame around the original painting; neither face remounts on a flip. */
export default function CanvasDiscovery({ children, onMatchaFact }: { children: ReactNode; onMatchaFact: () => void }) {
  const [flipped, setFlipped] = useState(false);
  const [discovered, setDiscovered] = useState(false);
  const cornerTouch = useRef<{ x: number; y: number } | null>(null);
  const lastTouch = useRef(0);
  const toggle = useRef<HTMLButtonElement>(null);
  const turn = () => { setDiscovered(true); setFlipped(value => !value); toggle.current?.focus({ preventScroll: true }); };
  return (
    <>
    <div className={`canvas-discovery${flipped ? " is-flipped" : ""}`} onKeyDown={event => {
      if (event.key === "Escape" && flipped) { event.stopPropagation(); setFlipped(false); toggle.current?.focus({ preventScroll: true }); }
    }}>
      <div className="discovery-frame">
        <div className="discovery-face discovery-front" inert={flipped} aria-hidden={flipped}>{children}</div>
        <div className="discovery-face discovery-back" inert={!flipped} aria-hidden={!flipped}>
          <div className="discovery-linen">
            <span className="discovery-stretcher" aria-hidden="true" />
            <span className="discovery-staples" aria-hidden="true" />
            <div className="discovery-message"><strong>oh. you looked.</strong><span>there’s more underneath.</span><span aria-hidden="true">↓</span></div>
            <button type="button" className="discovery-matcha-card" onClick={onMatchaFact} aria-label="Open hidden Matcha fun fact">
              <span className="discovery-card-tape" aria-hidden="true" />
              <span className="discovery-matcha-cup" aria-hidden="true">🍵</span>
              <span>hidden fact</span>
            </button>
          </div>
        </div>
        <span className="discovery-edge edge-left" aria-hidden="true" />
        <span className="discovery-edge edge-right" aria-hidden="true" />
        <span className="discovery-edge edge-top" aria-hidden="true" />
        <span className="discovery-edge edge-bottom" aria-hidden="true" />
      </div>
      <button ref={toggle} type="button" className="discovery-turn" aria-describedby="canvas-touch-hint" aria-pressed={flipped} aria-label={flipped ? "Turn canvas back to the painting" : "Look behind the canvas"}
        onPointerDown={event => { if (event.pointerType !== "mouse" && event.isPrimary) cornerTouch.current = { x: event.clientX, y: event.clientY }; }}
        onPointerCancel={() => { cornerTouch.current = null; lastTouch.current = Date.now(); }}
        onPointerUp={event => {
          if (event.pointerType === "mouse") return;
          const start = cornerTouch.current; cornerTouch.current = null; lastTouch.current = Date.now();
          if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 12) { event.preventDefault(); turn(); }
        }}
        onClick={event => { if (event.detail === 0 || Date.now() - lastTouch.current > 700) turn(); }}>

        <span aria-hidden="true">↶</span><span className="discovery-corner-spark spark-a" aria-hidden="true">✨</span><span className="discovery-corner-spark spark-b" aria-hidden="true">✨</span><span className="discovery-corner-spark spark-c" aria-hidden="true">✨</span><span className="discovery-turn-label">{flipped ? "back" : "flip"}</span>
      </button>
      <p className="discovery-touch-hint" id="canvas-touch-hint">{flipped ? "Tap the matcha card to discover a little fact." : "Drag on the painting to paint · Tap the corner to flip."}</p>
    </div>
    <StudioNotes revealed={discovered} />
    </>
  );
}
