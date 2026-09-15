import { useEffect, useState } from "react";
import { ArrowRight, Check, Play, RotateCcw, ShieldCheck } from "lucide-react";
import ProgramPanel from "../components/ProgramPanel";
import { findProgram } from "../data/programs";
const nodes = [
  { title: "DATA", sub: "3 incoming invoices", icon: "▤" },
  { title: "AGENT", sub: "Finance operator", icon: "✳" },
  { title: "TOOLS", sub: "Validate + calculate", icon: "⌘" },
  { title: "MEMORY", sub: "Supplier history", icon: "◷" },
  { title: "APPROVAL", sub: "You make the call", icon: "◇" },
  { title: "ACTION", sub: "Update the ledger", icon: "↗" },
];
const invoices = [
  { id: "INV-101", supplier: "Studio North", amount: 120, known: true },
  { id: "INV-102", supplier: "Cloud Works", amount: 85, known: true },
  { id: "INV-103", supplier: "New Vendor", amount: 240, known: false },
];
export default function AgenticAI({ onComplete }: { onComplete: () => void }) {
  const [connected, setConnected] = useState(0);
  const [state, setState] = useState<"build" | "running" | "approval" | "done">(
    "build",
  );
  const [step, setStep] = useState(0);
  const [hint, setHint] = useState(
    "Tap DATA to begin. Connect each node from left to right.",
  );
  const [decision, setDecision] = useState("");
  const log = [
    "Read 3 invoice records from the data source.",
    "Finance agent: check amounts, suppliers and duplicates.",
    "Validation tool: 3 records valid. Total: 445 demo credits.",
    "Memory lookup: 2 known suppliers, 1 new supplier.",
    "Handoff → human reviewer. New supplier needs your approval.",
  ];
  useEffect(() => {
    if (state !== "running") return;
    const timer = setTimeout(() => {
      if (step < 4) setStep((s) => s + 1);
      else setState("approval");
    }, 650);
    return () => clearTimeout(timer);
  }, [state, step]);
  function connect(i: number) {
    if (state !== "build") return;
    if (i === connected) {
      setConnected(i + 1);
      setHint(
        i === 5
          ? "Your workflow is connected. Delegate it."
          : `Connected ${nodes[i].title}. Now connect ${nodes[i + 1].title}.`,
      );
    } else if (i > connected)
      setHint(
        `Connect ${nodes[connected].title} first. Every agent needs a complete workflow.`,
      );
  }
  function finish(approve: boolean) {
    setDecision(
      approve
        ? "Approved all 3 invoices. Ledger updated: 445 demo credits."
        : "Held the new supplier. Ledger updated with 2 known suppliers: 205 demo credits.",
    );
    setState("done");
    onComplete();
  }
  function reset() {
    setState("build");
    setConnected(0);
    setStep(0);
    setDecision("");
    setHint("Tap DATA to begin. Connect each node from left to right.");
  }
  return (
    <div className="agent-world">
      <div className="world-heading">
        <div>
          <span className="eyebrow">01 / PROFESSIONALS / AGENTIC AI</span>
          <h1>
            Stop prompting.
            <br />
            <em>Start delegating.</em>
          </h1>
          <p>Build a team that gets things done. You’re the one in charge.</p>
        </div>
        <span className="simulation-tag">
          <span className="status-dot" /> INTERACTIVE SIMULATION
        </span>
      </div>
      <div className="operations">
        <div className="ops-header">
          <span>
            <span className="status-dot" /> FINANCE OPERATIONS
          </span>
          <span>WORKFLOW_001</span>
        </div>
        <div className="node-track">
          {nodes.map((n, i) => (
            <div className="node-wrap" key={n.title}>
              <button
                className={`workflow-node ${i < connected ? "connected" : ""} ${i === connected ? "next" : ""} ${state === "running" && step === i ? "processing" : ""}`}
                onClick={() => connect(i)}
                draggable={state === "build" && i < connected}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", String(i))
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (Number(e.dataTransfer.getData("text/plain")) === i - 1)
                    connect(i);
                  else setHint("Connect neighboring nodes in order.");
                }}
                aria-label={`Connect ${n.title}`}
                aria-pressed={i < connected}
              >
                <span className="node-index">
                  0{i + 1}
                  {i < connected && <Check size={13} />}
                </span>
                <span className="node-icon">{n.icon}</span>
                <strong>{n.title}</strong>
                <small>{n.sub}</small>
              </button>
              {i < 5 && (
                <span
                  className={`connector ${i < connected - 1 ? "live" : ""}`}
                >
                  <ArrowRight size={18} />
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="workflow-controls">
          <p role="status">{hint}</p>
          <button
            className="button orange"
            disabled={connected < 6 || state !== "build"}
            onClick={() => {
              setState("running");
              setHint("Your agent is working. Watch the handoffs below.");
            }}
          >
            <Play size={15} fill="currentColor" />
            Delegate
          </button>
          <button
            className="icon-button"
            aria-label="Reset workflow"
            onClick={reset}
          >
            <RotateCcw size={18} />
          </button>
        </div>
        <div className="ops-bottom">
          <div className="sample-data">
            <span className="eyebrow">INCOMING DATA · DEMO CREDITS</span>
            {invoices.map((i) => (
              <div key={i.id}>
                <span>
                  {i.supplier}
                  <small>{i.id}</small>
                </span>
                <span>{i.amount}</span>
                <span className={`data-status ${i.known ? "" : "new"}`}>
                  {i.known ? "KNOWN" : "NEW"}
                </span>
              </div>
            ))}
          </div>
          <div className="execution-log" aria-live="polite">
            <span className="eyebrow">EXECUTION LOG</span>
            {state === "build" ? (
              <p className="waiting">
                Your agent is waiting for a workflow.
                <br />
                <span>Data → decisions → action.</span>
              </p>
            ) : (
              log.slice(0, step + 1).map((l, i) => (
                <p key={i}>
                  <span>0{i + 1}</span>
                  {l}
                </p>
              ))
            )}
            {state === "done" && (
              <p className="success">
                <Check size={15} />
                {decision}
              </p>
            )}
          </div>
        </div>
        {state === "approval" && (
          <div
            className="approval-box"
            role="region"
            aria-label="Human approval"
          >
            <ShieldCheck size={27} />
            <div>
              <strong>A new supplier needs your approval.</strong>
              <p>
                New Vendor · 240 demo credits. The agent paused before taking
                action.
              </p>
            </div>
            <button className="button dark" onClick={() => finish(true)}>
              Approve all
            </button>
            <button className="button outline" onClick={() => finish(false)}>
              Hold new supplier
            </button>
          </div>
        )}
        {state === "done" && (
          <div className="achievement">
            <span>✳</span>
            <div>
              <strong>DELEGATED. WITH YOU IN CONTROL.</strong>
              <p>{decision}</p>
            </div>
          </div>
        )}
      </div>
      <ProgramPanel program={findProgram("agentic-ai")} />
    </div>
  );
}
