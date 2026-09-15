import { programs, audiences } from "../data/programs";
export default function Passport({
  stamps,
  onExplore,
}: {
  stamps: string[];
  onExplore: (id: string) => void;
}) {
  return (
    <>
      <div className="passport-heading">
        <span className="passport-symbol">↗</span>
        <div>
          <h2>Your builder passport.</h2>
          <p>A little curiosity. A new possibility.</p>
        </div>
      </div>
      <div className="passport-count">
        <strong>{stamps.length.toString().padStart(2, "0")}</strong>
        <span>
          WORLDS EXPLORED
          <br />
          NO FINISH LINE REQUIRED
        </span>
      </div>
      {audiences.map((a) => (
        <section key={a} className="passport-section">
          <h3 className="eyebrow">{a}</h3>
          <div className="stamp-grid">
            {programs
              .filter((p) => p.audience === a)
              .map((p) => (
                <button
                  key={p.id}
                  className={`stamp ${stamps.includes(p.id) ? "earned" : ""}`}
                  onClick={() => onExplore(p.id)}
                >
                  <span>{stamps.includes(p.id) ? "✳" : "＋"}</span>
                  {p.title}
                  <small>
                    {stamps.includes(p.id) ? "EXPLORED" : "UNEXPLORED"}
                  </small>
                </button>
              ))}
          </div>
        </section>
      ))}
      <p className="quiet">
        Saved on this device. Explore any world to collect a stamp.
      </p>
    </>
  );
}
