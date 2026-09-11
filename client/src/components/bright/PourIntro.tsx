import { preloadPourAudio, startPourAudio, finishPourAudio, stopPourAudio } from "./pourAudio";
import { useEffect, useRef, useState } from "react";

export default function PourIntro({
  ready,
  onComplete,
  onPourFilled,
}: {
  ready: boolean;
  onComplete: () => void;
  onPourFilled?: () => void;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const filled = useRef(onPourFilled);
  filled.current = onPourFilled;
  const complete = useRef(onComplete);
  complete.current = onComplete;
  const [leaving, setLeaving] = useState(false);
  const skip = useRef<HTMLButtonElement>(null);
  const [started,setStarted] = useState(false);
  const [loading,setLoading] = useState(false);
  const [audioReady,setAudioReady] = useState(false);
  const [audioError,setAudioError] = useState(false);
  const alive = useRef(true);
  useEffect(()=>{alive.current=true;void preloadPourAudio().then(()=>{if(alive.current)setAudioReady(true);}).catch(()=>{if(alive.current)setAudioError(true);});return ()=>{alive.current=false;stopPourAudio();};},[]);
  const beginning = useRef(false);
  const begin = async () => {
    if(beginning.current || started) return;
    beginning.current=true;
    setLoading(true);
    try { await startPourAudio(); if(!alive.current)return; if(alive.current)setStarted(true); }
    catch { beginning.current=false; if(alive.current)setAudioError(true); }
    finally { if(alive.current)setLoading(false); }
  };
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      complete.current();
      return;
    }
    if (!started) return;
    const el = canvas.current;
    if (!el) {
      complete.current();
      return;
    }
    const ctx = el.getContext("2d");
    if (!ctx) {
      complete.current();
      return;
    }
    let raf = 0,
      exitTimer: ReturnType<typeof setTimeout> | undefined,
      finished = false;
    const start = performance.now();
    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 1.5);
      el.width = innerWidth * dpr;
      el.height = innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const render = (now: number) => {
      const t = (now - start) / 1000,
        w = innerWidth,
        h = innerHeight;
      const p = Math.min(t / 3.4, readyRef.current || t > 6 ? 1 : 0.9);
      ctx.clearRect(0, 0, w, h);
      const level = h * (1 - p) + Math.sin(t * 2.2) * 12 * (1 - p);
      // A ribbon from above joins a softly rolling, steadily rising surface.
      const ribbon = ctx.createLinearGradient(w * 0.5 - 25, 0, w * 0.5 + 30, 0);
      ribbon.addColorStop(0, "#a2b16e");
      ribbon.addColorStop(0.35, "#c0c996");
      ribbon.addColorStop(0.7, "#849a55");
      ribbon.addColorStop(1, "#667d40");
      ctx.fillStyle = ribbon;
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - 17, -20);
      for (let y = -20; y <= level + 20; y += 8)
        ctx.lineTo(w * 0.5 + Math.sin(y * 0.01 - t * 3) * 8 + 16, y);
      for (let y = level + 20; y >= -20; y -= 8)
        ctx.lineTo(w * 0.5 + Math.sin(y * 0.012 - t * 3) * 7 - 16, y);
      ctx.closePath();
      ctx.fill();
      const fill = ctx.createLinearGradient(0, level, 0, h);
      fill.addColorStop(0, "#a8bb76");
      fill.addColorStop(0.2, "#859d55");
      fill.addColorStop(1, "#4c6639");
      ctx.fillStyle = fill;
      const wave = (x: number) =>
        level +
        Math.sin(x * 0.007 + t * 2.4) * 14 * (1 - p) +
        Math.cos(x * 0.015 - t * 3) * 7 * (1 - p);
      ctx.beginPath();
      ctx.moveTo(0, h + 20);
      for (let x = 0; x <= w + 8; x += 8) ctx.lineTo(x, wave(x));
      ctx.lineTo(w + 8, h + 20);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#d4ddb096";
      ctx.lineWidth = 3;
      ctx.beginPath();
      for (let x = 0; x <= w + 8; x += 8) ctx.lineTo(x, wave(x) + 4);
      ctx.stroke();
      for (let i = 0; i < 55; i++) {
        const x = (i * 137.7) % w,
          y = level + 20 + ((i * 71.3 + t * 24) % Math.max(1, h - level));
        if (y > h) continue;
        ctx.fillStyle = i % 3 ? "#dbe3b22e" : "#e5eacb66";
        ctx.beginPath();
        ctx.ellipse(x, y, 2 + (i % 4), 1.5 + (i % 3), 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Ice enters near the end and settles into the liquid before the reveal.
      if (p > 0.74) {
        for (let i = 0; i < 3; i++) {
          const q = Math.min(1, (p - 0.74 - i * 0.035) / 0.13);
          if (q <= 0) continue;
          const x = w * (0.36 + i * 0.14),
            size = Math.min(65, w * 0.1),
            y =
              -90 +
              (h * 0.43 + 90) * q +
              Math.sin(q * Math.PI * 3) * (1 - q) * 40;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((i - 1) * 0.24 + Math.sin(t) * 0.05);
          ctx.fillStyle = "#f3f6dc80";
          ctx.strokeStyle = "#fbffe6bb";
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.roundRect(-size / 2, -size / 2, size, size, 12);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#ffffff25";
          ctx.fillRect(-size / 2 + 8, -size / 2 + 8, size * 0.55, 7);
          ctx.restore();
        }
      }
      if (p >= 1 && !finished) {
        finished = true;
        void finishPourAudio();
        filled.current?.();
        setLeaving(true);
        exitTimer = setTimeout(() => complete.current(), 650);
        return;
      }
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    skip.current?.focus({ preventScroll: true });
    return () => {
      stopPourAudio();
      cancelAnimationFrame(raf);
      if (exitTimer) clearTimeout(exitTimer);
      window.removeEventListener("resize", resize);
    };
  }, [started]);
  return (
    <div
      className={`pour-intro${leaving ? " pour-intro-out" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Introduction"
      onKeyDown={e => {
        if (e.key === "Escape") {
          onComplete();
        }
        if (e.key === "Tab") {
          e.preventDefault();
          if(started)skip.current?.focus();
          else document.getElementById("begin-pour")?.focus();
        }
      }}
    >
      <div className="pour-brand">
        nourah
      </div>
      <div className="pour-title">
        <span>A FRESH PERSPECTIVE</span>
        <p>
          Something good
          <br />
          is <em>on its way.</em>
        </p>
      </div>
      <canvas ref={canvas} aria-hidden="true" />
      <span className="pour-caption">{started ? "Preparing..." : "One tap to begin with sound."}</span>
      {!started && <button id="begin-pour" className="begin-pour" type="button" disabled={loading || (!audioReady && !audioError)} onPointerDown={e=>{if(e.isPrimary && e.button===0 && audioReady) void begin();}} onClick={begin}>{loading ? "Preparing..." : "Tap"}</button>}
      <button ref={skip} type="button" onClick={onComplete}>
        Skip intro ↗
      </button>
    </div>
  );
}
