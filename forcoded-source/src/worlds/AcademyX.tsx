import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
export default function AcademyX({ onComplete }: { onComplete: () => void }) {
  const [name, setName] = useState("Second Chapter");
  const [problem, setProblem] = useState(
    "Books are expensive and often used only once.",
  );
  const [audience, setAudience] = useState("Students");
  const [solution, setSolution] = useState("A campus book-swap app");
  const [channel, setChannel] = useState("Campus ambassadors");
  const [color, setColor] = useState("#c59735");
  const [pitched, setPitched] = useState(false);
  const [step, setStep] = useState(0);
  const steps = [
    "PROBLEM",
    "DESIGN",
    "AI",
    "BRAND",
    "MARKETING",
    "BUSINESS",
    "PROTOTYPE",
    "PITCH",
  ];
  return (
    <div className="lab academy-lab">
      <div className="lab-title">
        <span className="eyebrow">GIRLS ONLY / HIGH SCHOOL + UNIVERSITY</span>
        <span className="eyebrow">FREE</span>
      </div>
      <div className="journey-rail">
        {steps.map((s, i) => (
          <button
            key={s}
            aria-pressed={i === step}
            className={i === step ? "active" : ""}
            onClick={() => setStep(i)}
          >
            <small>0{i + 1}</small>
            {s}
          </button>
        ))}
      </div>
      <div className="pitch-builder">
        <div>
          <span className="eyebrow">{steps[step]} / YOUR IDEA TAKES SHAPE</span>
          <h3>
            {
              [
                "Start with a real problem.",
                "Design around your audience.",
                "Give your AI a useful job.",
                "Make the idea recognizable.",
                "Reach the right people.",
                "Think about value.",
                "Put it in someone’s hands.",
                "Tell a story worth hearing.",
              ][step]
            }
          </h3>
          <p>
            {
              [
                "What would you change for people around you?",
                "Who needs your idea most? Make one clear promise.",
                "Example AI brief: summarize book listings and suggest relevant swaps. Review suggestions before using them.",
                "A name and a palette give your idea a voice.",
                "Where will your audience discover you?",
                "Start with a free pilot. Learn whether it saves students time or money.",
                "This live preview updates as you shape your idea.",
                "Bring the problem, audience, solution and plan together.",
              ][step]
            }
          </p>
          <label className="field-label">
            PROJECT NAME
            <input
              maxLength={40}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setPitched(false);
              }}
            />
          </label>
          <label className="field-label">
            PROBLEM
            <textarea
              maxLength={180}
              value={problem}
              onChange={(e) => {
                setProblem(e.target.value);
                setPitched(false);
              }}
            />
          </label>
          <label className="field-label">
            WHO IS IT FOR?
            <select
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
            >
              {["Students", "Young creators", "Local communities"].map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <label className="field-label">
            YOUR SOLUTION
            <input
              maxLength={100}
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
            />
          </label>
          <label className="field-label">
            HOW WILL YOU REACH THEM?
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              {[
                "Campus ambassadors",
                "Creator-led stories",
                "Community events",
              ].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <div className="pitch-poster" style={{ background: color }}>
            <span>ACADEMY X / MY FIRST VENTURE</span>
            <span className="poster-star">✳</span>
            <h3>{name || "Your next big idea"}</h3>
            <p>{solution || "An idea worth building."}</p>
            <small>FOR {audience.toUpperCase()}</small>
          </div>
          <div className="color-picker">
            {["#c59735", "#8ca3c7", "#71957a"].map((c) => (
              <button
                key={c}
                aria-label={`Set brand color ${c}`}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <button
            className="button orange"
            disabled={!name.trim() || !problem.trim() || !solution.trim()}
            onClick={() => {
              setPitched(true);
              setStep(7);
              onComplete();
            }}
          >
            Pitch it <ArrowUpRight size={15} />
          </button>
          {pitched && (
            <div className="pitch-script" role="status">
              <Check size={22} />
              <h3>Your pitch.</h3>
              <p>
                {problem} We’re building <strong>{name}</strong>:{" "}
                {solution.toLowerCase()} for {audience.toLowerCase()}. We’ll
                reach our first users through {channel.toLowerCase()}, test a
                prototype, and improve it with their feedback.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
