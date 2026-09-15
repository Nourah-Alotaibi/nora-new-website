import { useState } from "react";
import { ShieldCheck, Search, Ban, Unplug, RotateCcw } from "lucide-react";
const hosts = [
  {
    name: "Workstation",
    ip: "10.0.0.12",
    status: "Normal activity",
    log: "12 successful logins. Standard office traffic.",
    icon: "⌨",
  },
  {
    name: "Gateway",
    ip: "10.0.0.1",
    status: "Incoming traffic",
    log: "Traffic passes through to the internal network.",
    icon: "◇",
  },
  {
    name: "App server",
    ip: "10.0.0.20",
    status: "Normal activity",
    log: "Regular API calls from authenticated users.",
    icon: "▣",
  },
  {
    name: "Database",
    ip: "10.0.0.30",
    status: "Unusual access",
    log: "87 failed logins from an unfamiliar external source in 60 seconds. Then a successful login. Investigate this route.",
    icon: "▤",
  },
];
export default function Cybersecurity({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [investigated, setInvestigated] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [done, setDone] = useState(false);
  const [red, setRed] = useState(false);
  const [message, setMessage] = useState(
    "Select a node to inspect its activity. Look for evidence before taking action.",
  );
  function act(a: string) {
    if (selected !== 3) {
      setMessage(
        "This node has no confirmed incident. Inspect other nodes before disrupting service.",
      );
      return;
    }
    if (a === "investigate") {
      setInvestigated(true);
      setMessage(
        "Confirmed: the external route used repeated login attempts, then accessed the database. Block the source.",
      );
    }
    if (a === "block") {
      if (!investigated) {
        setMessage("Investigate the suspicious activity first.");
        return;
      }
      setBlocked(true);
      setMessage(
        "Source blocked at the gateway. The database may still be compromised. Isolate it.",
      );
    }
    if (a === "isolate") {
      if (!blocked) {
        setMessage(
          "Block the suspicious source first to stop incoming traffic.",
        );
        return;
      }
      setDone(true);
      setMessage(
        "Threat contained. The database is isolated and the external source is blocked.",
      );
      onComplete();
    }
  }
  return (
    <div className="lab cyber-lab">
      <div className="lab-title">
        <span className="eyebrow">
          <ShieldCheck size={15} />
          NETWORK DEFENSE LAB
        </span>
        <div className="segmented">
          <button className={red ? "active" : ""} onClick={() => setRed(true)}>
            Red team
          </button>
          <button
            className={!red ? "active" : ""}
            onClick={() => setRed(false)}
          >
            Blue team
          </button>
        </div>
      </div>
      <div className="cyber-network">
        <svg
          viewBox="0 0 800 220"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M100 110 H700"
            stroke="#9e8daf"
            strokeWidth="2"
            fill="none"
          />
          <path
            d="M700 0 V110"
            stroke={blocked ? "#91ba92" : "#e38361"}
            strokeWidth="2"
            strokeDasharray="6 6"
            fill="none"
          />
        </svg>
        {hosts.map((host, i) => (
          <button
            key={host.name}
            className={`host ${selected === i ? "selected" : ""} ${i === 3 ? "alert" : ""} ${done && i === 3 ? "contained" : ""}`}
            onClick={() => {
              setSelected(i);
              setMessage(host.log);
            }}
            aria-label={`Inspect ${host.name}`}
          >
            <span className="host-icon">{host.icon}</span>
            <strong>{host.name}</strong>
            <small>{host.ip}</small>
            <span className="host-status">
              {done && i === 3
                ? "ISOLATED"
                : i === 3
                  ? "UNUSUAL ACCESS"
                  : "ONLINE"}
            </span>
          </button>
        ))}
      </div>
      {red && (
        <div className="red-explanation">
          <strong>Attack simulation</strong>
          <p>
            An unfamiliar source repeatedly guesses database credentials. Follow
            the dotted route and inspect the logs to see what the defender sees.
          </p>
        </div>
      )}
      <div className="incident-log" role="status">
        <span className="eyebrow">
          {selected === null
            ? "SOC / WAITING"
            : `LOG / ${hosts[selected].name}`}
        </span>
        <p>{message}</p>
      </div>
      <div className="lab-actions">
        <button
          className="button outline"
          onClick={() => act("investigate")}
          disabled={done}
        >
          <Search size={16} />
          Investigate
        </button>
        <button
          className="button outline"
          onClick={() => act("block")}
          disabled={done}
        >
          <Ban size={16} />
          Block
        </button>
        <button
          className="button orange"
          onClick={() => act("isolate")}
          disabled={done}
        >
          <Unplug size={16} />
          Isolate
        </button>
        <button
          className="icon-button"
          aria-label="Reset security simulation"
          onClick={() => {
            setSelected(null);
            setInvestigated(false);
            setBlocked(false);
            setDone(false);
            setMessage("Select a node to inspect its activity.");
          }}
        >
          <RotateCcw size={17} />
        </button>
      </div>
      {done && (
        <div className="achievement">
          <span>✳</span>
          <div>
            <strong>THREAT CONTAINED</strong>
            <p>
              You used evidence, blocked the route, and isolated the endpoint.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
