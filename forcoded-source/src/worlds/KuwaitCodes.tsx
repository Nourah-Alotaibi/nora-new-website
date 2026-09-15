import { useState } from "react";
import { Play, RotateCcw, ArrowUpRight } from "lucide-react";
const blocks = ["light = sense_light()", "if light < 30:", "    turn_on()"];
function PythonLab({ onComplete }: { onComplete: () => void }) {
  const [code, setCode] = useState<string[]>([]);
  const [light, setLight] = useState(15);
  const [lit, setLit] = useState(false);
  const [message, setMessage] = useState(
    "Build a smart light. Read the sensor, check the condition, then turn it on.",
  );
  return (
    <div className="lab">
      <div className="lab-title">
        <span className="eyebrow">PYTHON WITH AI / SMART LIGHT</span>
      </div>
      <div className="code-lab">
        <div>
          <h3>Logic makes things happen.</h3>
          <p>Arrange these lines into a working program.</p>
          <div className="code-blocks">
            {blocks.map((b) => (
              <button
                key={b}
                disabled={code.includes(b)}
                onClick={() => setCode((s) => [...s, b])}
              >
                {b}
              </button>
            ))}
          </div>
          <pre className="code-editor">
            {code.length
              ? code.map((b, i) => `${i + 1}  ${b}`).join("\n")
              : "# Your program goes here"}
          </pre>
          <div className="lab-actions">
            <button
              className="button orange"
              onClick={() => {
                if (code.join("|") !== blocks.join("|")) {
                  setLit(false);
                  setMessage(
                    "Not quite. Read the sensor before checking it, and put turn_on inside the condition.",
                  );
                  return;
                }
                setLit(light < 30);
                setMessage(
                  light < 30
                    ? "RUN ✓ It’s dark. Your smart light is on."
                    : "RUN ✓ There’s enough daylight. Your smart light stays off.",
                );
                onComplete();
              }}
            >
              <Play size={15} />
              Run Python
            </button>
            <button
              className="icon-button"
              aria-label="Reset Python"
              onClick={() => {
                setCode([]);
                setLit(false);
              }}
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>
        <div className={`smart-light ${lit ? "lit" : ""}`}>
          <div className="lamp-shade" />
          <div className="lamp-stem" />
          <div className="lamp-base" />
          <span>{lit ? "LIGHT ON" : "LIGHT OFF"}</span>
          <label>
            Daylight level: {light}
            <input
              type="range"
              min="0"
              max="100"
              value={light}
              onChange={(e) => setLight(Number(e.target.value))}
            />
          </label>
        </div>
      </div>
      <div className="incident-log" role="status">
        <p>{message}</p>
      </div>
    </div>
  );
}
export function WebLab({ onComplete }: { onComplete: () => void }) {
  const [parts, setParts] = useState<string[]>([]);
  const [color, setColor] = useState("#785b99");
  const [clicks, setClicks] = useState(0);
  const [shipped, setShipped] = useState(false);
  return (
    <div className="lab">
      <div className="lab-title">
        <span className="eyebrow">WEB WITH AI / YOUR FIRST SITE</span>
      </div>
      <div className="web-lab">
        <div>
          <h3>A website you can change.</h3>
          <p>Add structure, content and an interaction. Make it yours.</p>
          <div className="choice-group">
            {["Layout", "Content", "Interaction"].map((p) => (
              <button
                aria-pressed={parts.includes(p)}
                className={parts.includes(p) ? "active" : ""}
                key={p}
                onClick={() => {
                  setShipped(false);
                  setParts((s) =>
                    s.includes(p) ? s.filter((v) => v !== p) : [...s, p],
                  );
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="color-picker" aria-label="Website color">
            {["#785b99", "#648f72", "#bd683f"].map((c) => (
              <button
                key={c}
                style={{ background: c }}
                aria-label={`Choose ${c} color`}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <button
            className="button orange"
            disabled={parts.length !== 3}
            onClick={() => {
              setShipped(true);
              onComplete();
            }}
          >
            Ship site <ArrowUpRight size={16} />
          </button>
        </div>
        <div
          className="site-preview"
          style={{ "--site-color": color } as React.CSSProperties}
        >
          <div className="browser-chrome">
            <i />
            <i />
            <i />
            <span>my-first-site.local</span>
          </div>
          {parts.includes("Layout") && (
            <div className="preview-nav">
              <strong>hello.kw</strong>
              <span>Made by me ↗</span>
            </div>
          )}
          <div className="preview-body">
            {parts.includes("Content") ? (
              <>
                <span className="eyebrow">BUILT IN KUWAIT</span>
                <h3>
                  Small idea.
                  <br />
                  Big possibility.
                </h3>
                <p>I’m learning to build things that matter.</p>
              </>
            ) : (
              <div className="preview-empty">
                Add some content to your canvas.
              </div>
            )}
            {parts.includes("Interaction") && (
              <button onClick={() => setClicks((n) => n + 1)}>
                Say hello {clicks > 0 ? `(${clicks})` : "↗"}
              </button>
            )}
          </div>
        </div>
      </div>
      {shipped && (
        <div className="achievement" role="status">
          <span>✳</span>
          <div>
            <strong>SITE SHIPPED.</strong>
            <p>
              Your interactive site is running in this preview. Change it, test
              it, make it yours.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
function CaptureFlag({ onComplete }: { onComplete: () => void }) {
  const [choice, setChoice] = useState("");
  const [message, setMessage] = useState(
    "A login message arrives. Inspect the domain, urgency and request before trusting it.",
  );
  const [done, setDone] = useState(false);
  return (
    <div className="lab">
      <div className="lab-title">
        <span className="eyebrow">CYBERSECURITY / CAPTURE THE FLAG</span>
      </div>
      <div className="phishing-message">
        <span>FROM: help@c0ded-login.example</span>
        <h3>URGENT: Your account closes in 10 minutes!</h3>
        <p>Send us your password now so we can keep your access active.</p>
        <small>Fictional training message. No link is active.</small>
      </div>
      <div className="lab-actions">
        {["Send the password", "Report phishing", "Ignore the spelling"].map(
          (c) => (
            <button
              key={c}
              className={`button ${choice === c ? "dark" : "outline"}`}
              onClick={() => {
                setChoice(c);
                if (c === "Report phishing") {
                  setDone(true);
                  setMessage(
                    "Flag captured! A lookalike domain, artificial urgency and a password request are warning signs.",
                  );
                  onComplete();
                } else {
                  setDone(false);
                  setMessage(
                    "Look again: a legitimate support team should not ask for your password.",
                  );
                }
              }}
            >
              {c}
            </button>
          ),
        )}
      </div>
      <div className="incident-log" role="status">
        <p>
          {done ? "⚑ " : ""}
          {message}
        </p>
      </div>
    </div>
  );
}
export default function KuwaitCodes({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [track, setTrack] = useState("Python with AI");
  return (
    <>
      <div
        className="track-switch"
        role="group"
        aria-label="Kuwait Codes tracks"
      >
        {["Python with AI", "Web with AI", "Cybersecurity"].map((t) => (
          <button
            key={t}
            className={track === t ? "active" : ""}
            aria-pressed={track === t}
            onClick={() => setTrack(t)}
          >
            {t}
          </button>
        ))}
      </div>
      {track === "Python with AI" ? (
        <PythonLab onComplete={onComplete} />
      ) : track === "Web with AI" ? (
        <WebLab onComplete={onComplete} />
      ) : (
        <CaptureFlag onComplete={onComplete} />
      )}
    </>
  );
}
