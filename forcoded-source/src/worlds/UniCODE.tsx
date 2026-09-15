import { useState } from "react";
import {
  Check,
  Folder,
  GitCommitHorizontal,
  Play,
  ArrowUpRight,
} from "lucide-react";
export default function UniCODE({ onComplete }: { onComplete: () => void }) {
  const [track, setTrack] = useState("Web");
  const [operator, setOperator] = useState("<");
  const [tested, setTested] = useState(false);
  const [committed, setCommitted] = useState(false);
  const [deployed, setDeployed] = useState(false);
  const [message, setMessage] = useState(
    "Your project should select scores of 60 or higher. Inspect the comparison, fix it and run the tests.",
  );
  return (
    <div className="lab">
      <div className="lab-title">
        <span className="eyebrow">
          <Folder size={16} />
          UNIVERSITY → REAL TECH WORK
        </span>
        <span className="eyebrow">LOCAL PROJECT LAB</span>
      </div>
      <div className="unicode-layout">
        <div className="project-files">
          <span className="eyebrow">PICK A DEMO</span>
          <div className="choice-group">
            {["Web", "Data", "Cyber"].map((t) => (
              <button
                key={t}
                className={track === t ? "active" : ""}
                onClick={() => setTrack(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <p>
            These are sample project themes. Actual cohort tracks are announced
            by CODED.
          </p>
          <div className="file-tree">
            <span>▾ my-{track.toLowerCase()}-project</span>
            <span>　├─ README.md</span>
            <span className="active">　├─ select.js</span>
            <span>　└─ select.test.js</span>
          </div>
        </div>
        <div className="project-editor">
          <span className="eyebrow">BUILD / DEBUG</span>
          <pre>
            {
              "const scores = [45, 60, 82];\n\nfunction select(scores) {\n  return scores.filter(score =>\n    score "
            }
            {operator}
            {" 60\n  );\n}"}
          </pre>
          <label className="field-label">
            FIX THE COMPARISON
            <select
              value={operator}
              onChange={(e) => {
                setOperator(e.target.value);
                setTested(false);
                setCommitted(false);
                setDeployed(false);
              }}
            >
              {["<", ">", ">=", "==="].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <div className="lab-actions">
            <button
              className="button dark"
              onClick={() => {
                const valid = operator === ">=";
                setTested(valid);
                setMessage(
                  valid
                    ? "PASS: select([45,60,82]) → [60,82]. Both expected records are included."
                    : "FAIL: expected [60,82]. Include the boundary value 60 and scores above it.",
                );
              }}
            >
              <Play size={15} />
              Run tests
            </button>
            <button
              className="button outline"
              disabled={!tested}
              onClick={() => {
                setCommitted(true);
                setMessage(
                  "Local commit created: fix score selection. Next, prepare the demo.",
                );
              }}
            >
              <GitCommitHorizontal size={16} />
              Commit project
            </button>
            <button
              className="button orange"
              disabled={!committed}
              onClick={() => {
                setDeployed(true);
                setMessage(
                  "Demo ready: 60 and 82. Your project now has passing tests and a recorded change.",
                );
                onComplete();
              }}
            >
              Deploy demo <ArrowUpRight size={16} />
            </button>
          </div>
        </div>
      </div>
      <div className="incident-log" role="status">
        <p>{message}</p>
      </div>
      {deployed && (
        <div className="achievement">
          <Check size={30} />
          <div>
            <strong>BUILD SOMETHING YOU CAN SHOW.</strong>
            <p>
              Learn → build → debug → commit → demo. A local simulation of a
              real project workflow.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
