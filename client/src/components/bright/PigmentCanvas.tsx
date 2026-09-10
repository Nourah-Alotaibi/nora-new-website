import { useEffect, useRef, useState } from "react";

export type Palette = "matcha" | "clay" | "deepBlue";
export const palettes = {
  matcha: {
    name: "Matcha",
    accent: "#536947",
    soft: "#e6e9d9",
    sky: "#d6ded4",
    back: "#b7c4a2",
    middle: "#8eaa86",
    front: "#506b58",
  },
  clay: {
    name: "Clay",
    accent: "#955b44",
    soft: "#eeded1",
    sky: "#e9caba",
    back: "#cead90",
    middle: "#b17d66",
    front: "#76564c",
  },
  deepBlue: {
    name: "Deep blue",
    accent: "#577b9a",
    soft: "#e8eef2",
    sky: "#dfe9ef",
    back: "#b5c9d8",
    middle: "#8aa9be",
    front: "#587b98",
  },
};

export default function PigmentCanvas({ palette }: { palette: Palette }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const controls = useRef({ reveal: () => {}, reset: () => {} });
  const [painted, setPainted] = useState(false);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = 1000,
      h = 660;
    canvas.width = w;
    canvas.height = h;
    const art = document.createElement("canvas");
    art.width = w;
    art.height = h;
    const a = art.getContext("2d")!;
    const mask = document.createElement("canvas");
    mask.width = w;
    mask.height = h;
    const m = mask.getContext("2d")!;
    const layer = document.createElement("canvas");
    layer.width = w;
    layer.height = h;
    const l = layer.getContext("2d")!;
    const p = palettes[palette];
    a.fillStyle = p.sky;
    a.fillRect(0, 0, w, h);
    a.fillStyle = "#f2e7c9";
    a.beginPath();
    a.arc(690, 155, 60, 0, Math.PI * 2);
    a.fill();
    function hill(color: string, base: number, amp: number, phase: number) {
      a.fillStyle = color;
      a.beginPath();
      a.moveTo(0, h);
      for (let x = 0; x <= w; x += 5) {
        const y =
          base +
          Math.sin(x * 0.006 + phase) * amp +
          Math.sin(x * 0.014 + phase) * amp * 0.19;
        a.lineTo(x, y);
      }
      a.lineTo(w, h);
      a.closePath();
      a.fill();
    }
    hill(p.back, 325, 70, 2);
    hill(p.middle, 415, 92, 4);
    hill(p.front, 565, 80, 1);
    // Seeded dry-brush marks, made in code rather than a downloaded painting.
    let seed = 72;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 18500; i++) {
      const x = random() * w,
        y = random() * h;
      a.globalAlpha = 0.025 + random() * 0.065;
      a.strokeStyle = random() > 0.5 ? "#fff9e7" : "#2e3a29";
      a.lineWidth = 0.5 + random() * 2.4;
      a.beginPath();
      a.moveTo(x, y);
      a.lineTo(x + 3 + random() * 28, y + random() * 2);
      a.stroke();
    }
    a.globalAlpha = 1;
    function render() {
      ctx!.clearRect(0, 0, w, h);
      ctx!.filter = "grayscale(1) opacity(0.3)";
      ctx!.drawImage(art, 0, 0);
      ctx!.filter = "none";
      l.clearRect(0, 0, w, h);
      l.globalCompositeOperation = "source-over";
      l.drawImage(art, 0, 0);
      l.globalCompositeOperation = "destination-in";
      l.drawImage(mask, 0, 0);
      l.globalCompositeOperation = "source-over";
      ctx!.drawImage(layer, 0, 0);
    }
    function dab(x: number, y: number) {
      m.fillStyle = "#fff";
      for (let i = 0; i < 20; i++) {
        const angle = i * 2.39996,
          r = 8 + Math.sqrt(i / 20) * 43;
        m.globalAlpha = 0.55 + (i % 3) * 0.2;
        m.beginPath();
        m.ellipse(
          x + Math.cos(angle) * r,
          y + Math.sin(angle) * r * 0.65,
          12 + (i % 5),
          7 + (i % 4),
          -0.25,
          0,
          Math.PI * 2
        );
        m.fill();
      }
      m.globalAlpha = 1;
    }
    let prev: { x: number; y: number } | null = null;
    let down = false;
    const point = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect();
      return {
        x: ((e.clientX - b.left) / b.width) * w,
        y: ((e.clientY - b.top) / b.height) * h,
      };
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && !down) return;
      const next = point(e);
      const last = prev ?? next;
      const steps = Math.max(
        1,
        Math.ceil(Math.hypot(next.x - last.x, next.y - last.y) / 12)
      );
      for (let i = 0; i <= steps; i++)
        dab(
          last.x + ((next.x - last.x) * i) / steps,
          last.y + ((next.y - last.y) * i) / steps
        );
      prev = next;
      setPainted(true);
      render();
    };
    const start = (e: PointerEvent) => {
      down = true;
      canvas.setPointerCapture(e.pointerId);
      move(e);
    };
    const end = () => {
      down = false;
      prev = null;
    };
    controls.current = {
      reveal: () => {
        m.fillStyle = "#fff";
        m.fillRect(0, 0, w, h);
        setPainted(true);
        render();
      },
      reset: () => {
        m.clearRect(0, 0, w, h);
        setPainted(false);
        render();
      },
    };
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerdown", start);
    canvas.addEventListener("pointerup", end);
    canvas.addEventListener("pointercancel", end);
    canvas.addEventListener("pointerleave", end);
    setPainted(false);
    render();
    return () => {
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerdown", start);
      canvas.removeEventListener("pointerup", end);
      canvas.removeEventListener("pointercancel", end);
      canvas.removeEventListener("pointerleave", end);
    };
  }, [palette]);
  return (
    <div className="pigment-piece">
      <div className="canvas-tape" aria-hidden="true" />
      <canvas
        ref={ref}
        aria-label="Interactive landscape: brush across the canvas to reveal its colors"
        role="img"
      />
      <div className="painting-footer">
        <span>
          {painted
            ? "A little more color in the world."
            : "Your cursor is the brush."}
        </span>
        <div>
          <button type="button" onClick={() => controls.current.reveal()}>
            Reveal all ↗
          </button>
          <button type="button" onClick={() => controls.current.reset()}>
            Start fresh
          </button>
        </div>
      </div>
    </div>
  );
}
