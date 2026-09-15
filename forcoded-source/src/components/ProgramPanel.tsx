import { ArrowUpRight } from "lucide-react";
import type { Program } from "../data/programs";
export default function ProgramPanel({ program }: { program: Program }) {
  return (
    <aside className="program-panel">
      <span className="eyebrow">YOUR NEXT CHAPTER</span>
      <h2>{program.title}</h2>
      <div className="tags">
        <span>{program.audience}</span>
        <span>{program.level}</span>
        <span>{program.format}</span>
        {program.genderEligibility !== "All" && (
          <span>{program.genderEligibility}</span>
        )}
        {program.age !== "Details TBA" && <span>{program.age}</span>}
      </div>
      <p>{program.outcomes}</p>
      <div className="panel-bottom">
        <strong className="eyebrow">{program.freeOrPaid}</strong>
        {program.applyURL ? (
          <a
            className="button dark"
            href={program.applyURL}
            target="_blank"
            rel="noreferrer"
          >
            Apply at CODED <ArrowUpRight size={17} />
          </a>
        ) : (
          <a
            className="button dark"
            href="https://coded.kw/"
            target="_blank"
            rel="noreferrer"
          >
            Check availability <ArrowUpRight size={17} />
          </a>
        )}
      </div>
      <small>
        Current dates and application details are confirmed by CODED.
      </small>
    </aside>
  );
}
