import { useMemo, useState } from "react";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";
const raw = [
  { id: 1, x: 1, y: 18 },
  { id: 2, x: 2, y: 25 },
  { id: 3, x: 3, y: 31 },
  { id: 3, x: 3, y: 31 },
  { id: 4, x: 4, y: 41 },
  { id: 5, x: null, y: 44 },
  { id: 6, x: 5, y: 47 },
  { id: 7, x: 6, y: 57 },
  { id: 8, x: 7, y: 64 },
  { id: 9, x: 8, y: 71 },
];
export default function DataScience({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [cleaned, setCleaned] = useState(false);
  const [trained, setTrained] = useState(false);
  const [model, setModel] = useState("Linear model");
  const [deployed, setDeployed] = useState(false);
  const [input, setInput] = useState(4);
  const [message, setMessage] = useState(
    "Inspect the raw data. A duplicate and a missing value are hiding in plain sight.",
  );
  const clean = useMemo(
    () =>
      raw.filter(
        (r, i, all) =>
          r.x !== null && all.findIndex((a) => a.id === r.id) === i,
      ),
    [],
  );
  const train = clean.slice(0, 6);
  const test = clean.slice(6);
  const meanX = train.reduce((a, r) => a + r.x!, 0) / train.length;
  const meanY = train.reduce((a, r) => a + r.y, 0) / train.length;
  const slope =
    model === "Mean baseline"
      ? 0
      : train.reduce((a, r) => a + (r.x! - meanX) * (r.y - meanY), 0) /
        train.reduce((a, r) => a + (r.x! - meanX) ** 2, 0);
  const intercept = meanY - slope * meanX;
  const mae =
    test.reduce((a, r) => a + Math.abs(slope * r.x! + intercept - r.y), 0) /
    test.length;
  return (
    <div className="lab">
      <div className="lab-title">
        <span className="eyebrow">DATA → MODEL → PREDICTION</span>
        <span className="eyebrow">SYNTHETIC PRACTICE DATA</span>
      </div>
      <div className="data-layout">
        <div>
          <div className="data-readout">
            <span>
              <strong>{cleaned ? clean.length : raw.length}</strong>ROWS
            </span>
            <span>
              <strong>{cleaned ? "0" : "2"}</strong>QUALITY ISSUES
            </span>
            <span>
              <strong>{trained ? mae.toFixed(2) : "—"}</strong>TEST MAE
            </span>
          </div>
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Record</th>
                  <th>Practice hours</th>
                  <th>Demo score</th>
                </tr>
              </thead>
              <tbody>
                {(cleaned ? clean : raw).map((r, i) => (
                  <tr
                    key={i}
                    className={
                      r.x === null || (!cleaned && i === 3) ? "bad-row" : ""
                    }
                  >
                    <td>{r.id}</td>
                    <td>{r.x ?? "MISSING"}</td>
                    <td>{r.y}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="lab-actions">
            <button
              className="button outline"
              onClick={() => {
                setCleaned(true);
                setTrained(false);
                setDeployed(false);
                setMessage(
                  "Cleaned: removed one duplicate and one record with a missing input. Eight usable records remain.",
                );
              }}
            >
              <Sparkles size={15} />
              Clean data
            </button>
            <button
              className="button dark"
              disabled={!cleaned}
              onClick={() => {
                setTrained(true);
                setDeployed(false);
                setMessage(
                  `Trained on 6 records. Tested on 2 held-out records. Mean absolute error: ${mae.toFixed(2)} score points.`,
                );
              }}
            >
              <Play size={15} />
              Train model
            </button>
          </div>
        </div>
        <div className="model-view">
          <span className="eyebrow">EXPLORE / VISUALIZE</span>
          <svg
            viewBox="0 0 350 230"
            role="img"
            aria-label="Practice hours against demo scores, with a fitted line after training"
          >
            <path d="M30 15 V200 H335" fill="none" stroke="#c5b0c8" />
            {[1, 2, 3, 4].map((i) => (
              <path
                key={i}
                d={`M30 ${200 - i * 40} H335`}
                stroke="#e3d5e5"
                strokeDasharray="4 4"
              />
            ))}
            {clean.map((r) => (
              <circle
                key={r.id}
                cx={30 + r.x! * 35}
                cy={200 - r.y * 2.2}
                r="5"
                fill="#a780b9"
              />
            ))}
            {trained && (
              <path
                d={`M65 ${200 - (slope + intercept) * 2.2} L310 ${200 - (slope * 8 + intercept) * 2.2}`}
                stroke="#ec8155"
                strokeWidth="3"
              />
            )}
            <text x="155" y="224" fill="#a88cab" fontSize="8">
              PRACTICE HOURS
            </text>
          </svg>
          <div className="choice-group">
            {["Linear model", "Mean baseline"].map((m) => (
              <button
                key={m}
                aria-pressed={model === m}
                className={model === m ? "active" : ""}
                onClick={() => {
                  setModel(m);
                  setTrained(false);
                  setDeployed(false);
                }}
              >
                {m}
              </button>
            ))}
          </div>
          <p>
            Compare models on unseen data. Lower mean absolute error (MAE) means
            predictions are closer to the test scores.
          </p>
          <button
            className="button orange"
            disabled={!trained}
            onClick={() => {
              setDeployed(true);
              onComplete();
              setMessage(
                "Your model is live in this local prediction tool. Move the slider to query it.",
              );
            }}
          >
            Deploy model <ArrowUpRight size={15} />
          </button>
          {deployed && (
            <div className="prediction">
              <label>
                Practice hours: {input}
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={input}
                  onChange={(e) => setInput(Number(e.target.value))}
                />
              </label>
              <strong>{(slope * input + intercept).toFixed(1)}</strong>
              <span>PREDICTED DEMO SCORE</span>
            </div>
          )}
        </div>
      </div>
      <div className="incident-log" role="status">
        <p>{message}</p>
      </div>
      <div className="learning-note">
        This tiny regression exercise introduces data quality, visualization,
        training, evaluation and deployment. The program goes further into
        Python, machine learning, deep learning, GenAI and agents. Demo scores
        are synthetic and are not educational predictions.
      </div>
    </div>
  );
}
