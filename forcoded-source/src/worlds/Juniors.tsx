import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Play,
  RotateCcw,
  Undo2,
} from "lucide-react";
const moves = { UP: -4, RIGHT: 1, DOWN: 4, LEFT: -1 };
type Command = keyof typeof moves;
export default function Juniors({ onComplete }: { onComplete: () => void }) {
  const [commands, setCommands] = useState<Command[]>([]);
  const [position, setPosition] = useState(8);
  const [running, setRunning] = useState(false);
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState(
    "Help your robot reach the star. Start on the left. Watch out for the two blocks.",
  );
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!running) return;
    const timer = setTimeout(() => {
      if (index >= commands.length) {
        setRunning(false);
        if (position === 3) {
          setDone(true);
          setMessage("You did it! Your code brought an idea to life.");
          onComplete();
        } else
          setMessage(
            "Your robot stopped here. Change the commands and try again.",
          );
        return;
      }
      const command = commands[index];
      const next = position + moves[command];
      const across =
        (command === "RIGHT" && position % 4 === 3) ||
        (command === "LEFT" && position % 4 === 0);
      if (next < 0 || next > 11 || across || [5, 6].includes(next)) {
        setRunning(false);
        setMessage("Oops, a block! Debug your route and try again.");
        return;
      }
      setPosition(next);
      setIndex((n) => n + 1);
    }, 350);
    return () => clearTimeout(timer);
  }, [running, index, commands, position, onComplete]);
  return (
    <div className="lab junior-lab">
      <div className="lab-title">
        <span className="eyebrow">CODE + LOGIC + PLAY</span>
        <span className="eyebrow">ROBOT RUN</span>
      </div>
      <div className="robot-layout">
        <div
          className="robot-grid"
          role="img"
          aria-label={`Robot at row ${Math.floor(position / 4) + 1}, column ${(position % 4) + 1}. Goal at row 1, column 4. Obstacles at row 2 columns 2 and 3.`}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div
              className={`robot-tile ${[5, 6].includes(i) ? "wall" : ""} ${i === 3 ? "goal" : ""}`}
              key={i}
            >
              {position === i ? (
                <span className="little-bot" aria-hidden="true">
                  ▣<small>• •</small>
                </span>
              ) : i === 3 ? (
                "✳"
              ) : [5, 6].includes(i) ? (
                "▰"
              ) : (
                <span className="grid-coordinate">
                  {Math.floor(i / 4) + 1},{(i % 4) + 1}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="robot-code">
          <h3>Your robot. Your instructions.</h3>
          <p>Tap arrows to queue commands. Then run your code.</p>
          <div className="direction-controls">
            {Object.keys(moves).map((c, i) => (
              <button
                key={c}
                aria-label={`Queue ${c.toLowerCase()}`}
                disabled={running || commands.length >= 12}
                onClick={() => setCommands((s) => [...s, c as Command])}
              >
                {[<ArrowUp />, <ArrowRight />, <ArrowDown />, <ArrowLeft />][i]}
              </button>
            ))}
          </div>
          <div className="command-queue" aria-label="Queued commands">
            {commands.length ? (
              commands.map((c, i) => (
                <span
                  key={i}
                  className={running && i === index ? "current" : ""}
                >
                  {c}
                </span>
              ))
            ) : (
              <small>Your program starts here.</small>
            )}
          </div>
          <div className="lab-actions">
            <button
              className="button orange"
              disabled={!commands.length || running}
              onClick={() => {
                setPosition(8);
                setIndex(0);
                setDone(false);
                setRunning(true);
                setMessage("Running your instructions…");
              }}
            >
              <Play size={15} />
              Run robot
            </button>
            <button
              className="icon-button"
              aria-label="Undo command"
              disabled={running}
              onClick={() => setCommands((s) => s.slice(0, -1))}
            >
              <Undo2 size={17} />
            </button>
            <button
              className="icon-button"
              aria-label="Reset robot"
              onClick={() => {
                setCommands([]);
                setPosition(8);
                setIndex(0);
                setRunning(false);
                setDone(false);
                setMessage("A fresh start. Where will your robot go?");
              }}
            >
              <RotateCcw size={17} />
            </button>
          </div>
        </div>
      </div>
      <div className={`incident-log ${done ? "completed" : ""}`} role="status">
        <p>{message}</p>
      </div>
      <div className="learning-note">
        A small taste of creative technology. CODED Juniors also explores games,
        AI, digital creation and circuits. Activities and eligibility vary by
        program.
      </div>
    </div>
  );
}
