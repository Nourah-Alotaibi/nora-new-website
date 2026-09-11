import { useEffect, useRef, useState, type FormEvent } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import "./leaveNote.css";

export default function LeaveNote() {
  const { theme } = useTheme();
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const endpoint = import.meta.env.VITE_NOTE_ENDPOINT as string | undefined;

  useEffect(() => {
    const update = () => {
      // Stay available everywhere once the page and opening experience finish.
      setVisible(document.readyState === "complete" && !document.querySelector(".pour-intro"));
    };
    update();
    window.addEventListener("load", update);
    const observer = new MutationObserver(update);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener("load", update);
      observer.disconnect();
    };
  }, [theme]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [open]);

  function close() { dialog.current?.close(); }
  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending" || !endpoint) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const note = String(data.get("note") || "").trim();
    if (!note) {
      (form.elements.namedItem("note") as HTMLTextAreaElement).focus();
      return;
    }
    setStatus("sending");
    try {
      const response = await fetch(endpoint, {
        method: "POST", headers: { "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ name: String(data.get("name") || "").trim(), note }),
      });
      if (!response.ok || !(await response.json()).saved) throw new Error("Note delivery failed");
      setStatus("success");
      form.reset();
    } catch { setStatus("error"); }
  }

  return <div className={`leave-note-widget note-${theme}`}>
    <button ref={trigger} type="button" className={`note-trigger${visible && !dismissed ? " is-visible" : ""}`}
      tabIndex={visible && !dismissed ? 0 : -1} aria-hidden={!visible || dismissed} aria-label="Leave a note" aria-haspopup="dialog"
      onClick={() => { setStatus("idle"); dialog.current?.showModal(); setOpen(true); }}>
      <span aria-hidden="true">📝</span><span className="note-trigger-label">Leave a note</span>
      <span className="note-sparkles" aria-hidden="true"><i>✨</i><i>✨</i><i>✨</i></span>
    </button>
    {visible && !dismissed && <button type="button" className="note-dismiss" aria-label="Hide note button" onClick={() => setDismissed(true)}><span aria-hidden="true">×</span></button>}
    <dialog ref={dialog} className="note-panel" aria-labelledby="note-heading" aria-describedby="note-description"
      onKeyDown={event => {
        if (event.key !== "Tab") return;
        const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), input, textarea, a[href]'));
        const first = items[0], last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }}
      onClose={() => { setOpen(false); if (trigger.current?.getBoundingClientRect()) trigger.current?.focus({ preventScroll: true }); }}
      onClick={event => { if (event.target === event.currentTarget) {
        const rect = event.currentTarget.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close();
      } }}>
      <button className="note-close" type="button" aria-label="Close note" onClick={close}>×</button>
      <h2 id="note-heading">Your turn…</h2>
      <p id="note-description">I made a whole website. You can have this little box. Tell me anything—about me, the website, or whatever’s on your mind.</p>
      {status === "success" ? <p className="note-success" role="status">Thanks for leaving a note.</p> :
        <form onSubmit={send}>
          <label htmlFor="note-name">Your name <span>— optional</span></label>
          <input id="note-name" name="name" autoComplete="name" maxLength={100} />
          <label htmlFor="note-message">Your note <span>— required</span></label>
          <textarea id="note-message" name="note" required maxLength={4000} rows={5} />
          {status === "error" && <p className="note-error" role="alert">Your note wasn’t sent. Please try again.</p>}
          <button className="note-send" type="submit" disabled={!endpoint || status === "sending"}>{status === "sending" ? "Sending…" : "Send note"}</button>
        </form>}
    </dialog>
  </div>;
}
