import { useEffect, useRef, useState } from "react";

const descriptions = [
  "A miniature university building, engineering gear, and drafting ruler",
  "A light-blue computer displaying print('Hello world!'), floating 3D stars, and a little coffee cup",
  "A mechanical engine followed by a raised arrow pointing to a computer",
  "A teacher standing beside the board with an arm raised to explain, two student seats, and lesson books",
  "A dimensional Google-colored G, three community members, and a developer podium",
  "A UC Berkeley tower, an EVA assistant, first and second place trophies, a smaller red trophy, a gold medal resting on the ground, an INTERNATIONAL sign, and a black wearable AI camera pin",
  "An armored security shield with raised SECURITY lettering and a laptop showing green Linux terminal code",
  "A wired brain connected to an EpiCare epilepsy research dashboard and AI treatment-prediction display, with a graduation cap and diploma",
  "Nourah in an all-navy hijab and outfit, with a visible smiling face, holds a tiny white EVE-style robot to four children typing at computers, beside a board labeled ROBOTEX, AI, and BUSINESS",
  "A polished white EVE-style robot head with a dark visor, bright blue eyes and no mouth, beside a grey PC tower with blue and purple illuminated fans, connected by a cable to a large desktop data-visualization monitor and an idea network",
];

export default function StoryDiorama({ chapter }: { chapter: number }) {
  const host = useRef<HTMLDivElement>(null);
  const scene=useRef<ReturnType<typeof import("./storyRenderer").mountStory>|null>(null);
  const [zoom,setZoom]=useState(1);
  const [ready,setReady]=useState(false);
  useEffect(() => {
    let cancelled = false;
    setZoom(1);setReady(false);
    let dispose: (() => void) | undefined;
    import("./storyRenderer").then(({ mountStory }) => {
      if (!cancelled && host.current) {
        try {
          scene.current = mountStory(host.current, chapter);
          dispose=scene.current.dispose;setReady(true);
        } catch {
          /* Keep the chapter description available. */
        }
      }
    });
    return () => {
      cancelled = true;
      dispose?.();scene.current=null;
    };
  }, [chapter]);
  return (
    <>
    <div
      className="story-diorama"
      ref={host}
      role="img"
      aria-label={descriptions[chapter]}
    />
    {ready && <div className="story-zoom-controls" role="group" aria-label="3D scene view controls" onPointerDown={e=>e.stopPropagation()} onPointerUp={e=>e.stopPropagation()}>
      <button aria-label="Zoom into chapter objects" disabled={zoom>=3} onClick={()=>{const next=Math.min(3,zoom+.4);setZoom(next);scene.current?.zoom(next);}}>＋</button>
      <span aria-live="polite">{Math.round(zoom*100)}%</span>
      <button aria-label="Zoom out of chapter objects" disabled={zoom<=1} onClick={()=>{const next=Math.max(1,zoom-.4);setZoom(next);scene.current?.zoom(next);}}>−</button>
      <button onClick={()=>{setZoom(1);scene.current?.reset();}}>Reset</button>
      {zoom>1 && <div className="story-pan-controls">
        <button aria-label="Look left" onClick={()=>scene.current?.pan(-.3,0)}>←</button>
        <button aria-label="Look up" onClick={()=>scene.current?.pan(0,.3)}>↑</button>
        <button aria-label="Look down" onClick={()=>scene.current?.pan(0,-.3)}>↓</button>
        <button aria-label="Look right" onClick={()=>scene.current?.pan(.3,0)}>→</button>
      </div>}
    </div>}
    </>
  );
}
