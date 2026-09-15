import { lazy, Suspense, useCallback, useState } from "react";
import { findProgram } from "../data/programs";
import ProgramPanel from "../components/ProgramPanel";
const WorldStage = lazy(() => import("./WorldStage"));
const Cybersecurity = lazy(() => import("./Cybersecurity"));
const KuwaitCodes = lazy(() => import("./KuwaitCodes"));
const Juniors = lazy(() => import("./Juniors"));
const AIAppDeveloper = lazy(() => import("./AIAppDeveloper"));
const DataScience = lazy(() => import("./DataScience"));
const UniCODE = lazy(() => import("./UniCODE"));
const AcademyX = lazy(() => import("./AcademyX"));
export default function ProgramWorld({
  id,
  reduced,
}: {
  id: string;
  reduced: boolean;
}) {
  const p = findProgram(id);
  const [done, setDone] = useState(false);
  const complete = useCallback(() => setDone(true), []);
  return (
    <div className="program-world">
      <div className="world-heading">
        <div>
          <span className="eyebrow">
            {p.audience} / {p.title}
          </span>
          <h1 style={{ whiteSpace: "pre-line" }}>{p.headline}</h1>
          <p>{p.outcomes}</p>
        </div>
        <Suspense fallback={null}>
          <WorldStage kind={id} active={done} reduced={reduced} />
        </Suspense>
      </div>
      <Suspense fallback={<p>Opening your workshop…</p>}>
        {id === "cyber" ? (
          <Cybersecurity onComplete={complete} />
        ) : id === "kuwait-codes" ? (
          <KuwaitCodes onComplete={complete} />
        ) : id === "ai-app" ? (
          <AIAppDeveloper onComplete={complete} />
        ) : id === "data" ? (
          <DataScience onComplete={complete} />
        ) : id === "unicode" ? (
          <UniCODE onComplete={complete} />
        ) : id === "academy-x" ? (
          <AcademyX onComplete={complete} />
        ) : (
          <Juniors onComplete={complete} />
        )}
      </Suspense>
      <ProgramPanel program={p} />
    </div>
  );
}
