import { useRef, useState } from "react";
import { studioNotes } from "./studioNotesData";

export default function StudioNotes({ revealed }: { revealed: boolean }) {
  const [active, setActive] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const note = studioNotes[active];
  const step = (delta: number) => setActive(value => (value + delta + studioNotes.length) % studioNotes.length);
  return (
    <section className={`studio-kept-notes${revealed ? " is-revealed" : ""}`} aria-labelledby="studio-notes-title" aria-hidden={!revealed} inert={!revealed}>
      <div className="studio-kept-notes-inner">
        <header className="studio-notes-heading"><span>things I’ve kept with me</span><h3 id="studio-notes-title">studio notes.</h3></header>
        <div className="studio-notes-layout">
          <aside><h4>some things are worth keeping.</h4></aside>
          <div className="studio-notes-deck">
            <div className="studio-note-stack" tabIndex={0} role="group" aria-label="Studio notes. Use left and right arrow keys to turn a note." onKeyDown={event => {
              if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); step(event.key === "ArrowRight" ? 1 : -1); }
            }} onPointerDown={event => { if ((event.target as HTMLElement).closest("button")) return; if (event.isPrimary) { touch.current = { x:event.clientX, y:event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); } }} onPointerUp={event => {
              const start=touch.current; touch.current=null;
              if (!start) return;
              const dx=event.clientX-start.x, dy=event.clientY-start.y;
              if (Math.abs(dx)>45 && Math.abs(dx)>Math.abs(dy)*1.5) step(dx<0?1:-1);
            }} onPointerCancel={()=>{touch.current=null;}}>
              <span className="studio-note-scrap scrap-one" aria-hidden="true"/><span className="studio-note-scrap scrap-two" aria-hidden="true"/>
              <article className="studio-note-paper" key={active} aria-live="polite" aria-atomic="true">
                <span className="studio-note-clip" aria-hidden="true"/>
                
                <blockquote>“{note.text}”</blockquote>
                <div className="studio-note-credit"><strong>{note.author}</strong>{note.year && <span>{note.year}</span>}<i>{note.personal}</i></div>
              </article>
              <button type="button" className="studio-note-corner note-corner-prev" aria-label="Previous note from paper corner" onClick={()=>step(-1)}><span aria-hidden="true">←</span></button>
              <button type="button" className="studio-note-corner note-corner-next" aria-label="Next note from paper corner" onClick={()=>step(1)}><span aria-hidden="true">→</span></button>
            </div>
            <nav className="studio-note-controls" aria-label="Studio note navigation"><button type="button" onClick={()=>step(-1)} aria-label="Previous studio note">←</button><span>{String(active+1).padStart(2,"0")} / {String(studioNotes.length).padStart(2,"0")}</span><button type="button" onClick={()=>step(1)} aria-label="Next studio note">→</button></nav>
            <div className="studio-note-tabs" role="group" aria-label="Choose a studio note">{studioNotes.map((item,index)=><button type="button" key={item.theme} aria-label={`Read studio note ${index+1}: ${item.theme}`} aria-pressed={index===active} onClick={()=>setActive(index)}>{index+1}</button>)}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
