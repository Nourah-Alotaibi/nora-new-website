import { Canvas, useFrame } from "@react-three/fiber";
import { Component, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { supportsWebGL } from "./capabilities";
import * as THREE from "three";
import { Box, Label, Person, Robot, Plant } from "./Objects";
function Model({
  kind,
  active,
  reduced,
}: {
  kind: string;
  active: boolean;
  reduced: boolean;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (g.current && !reduced)
      g.current.rotation.y = Math.sin(clock.elapsedTime * 0.23) * 0.08;
  });
  const tech = kind === "cyber" || kind === "agentic-ai" || kind === "data";
  return (
    <group ref={g} position={[0, -0.7, 0]}>
      <Box
        size={[7, 0.2, 4.1]}
        color={tech ? "#423d52" : "#b5a5cc"}
        radius={0.13}
      />
      <Box
        position={[0, 1.45, -1.8]}
        size={[6.9, 2.8, 0.13]}
        color={tech ? "#5b526f" : "#d6c7df"}
      />
      <Label
        text={
          kind === "agentic-ai"
            ? "OPERATIONS / ONLINE"
            : kind === "cyber"
              ? "RED TEAM  /  BLUE TEAM"
              : kind === "data"
                ? "RAW DATA → INTELLIGENCE"
                : kind === "academy-x"
                  ? "DESIGN. BUILD. PITCH."
                  : "IDEA → SOMETHING REAL"
        }
        position={[0, 2.25, -1.71]}
        width={5.8}
        height={0.3}
        color="#f9eee9"
      />
      {kind === "cyber" ? (
        <>
          {[-2, 0, 2].map((x, i) => (
            <group key={x}>
              <Box
                position={[x, 0.8, -0.8]}
                size={[0.85, 1.55, 0.7]}
                color="#2c2c3e"
              />
              {[0, 1, 2, 3].map((j) => (
                <Box
                  key={j}
                  position={[x, 0.25 + j * 0.3, -0.42]}
                  size={[0.66, 0.12, 0.03]}
                  color={active ? "#b4e1ba" : i === 2 ? "#f57c61" : "#8f89b1"}
                />
              ))}
              <Box
                position={[x, 0.15, 0.3]}
                size={[0.07, 0.02, 1.4]}
                color={active ? "#9ad4ad" : "#eb9e77"}
              />
            </group>
          ))}
          <Box
            position={[0, 0.15, 0.8]}
            size={[4.1, 0.03, 0.05]}
            color="#a19ac6"
          />
          <Label
            text={active ? "THREAT CONTAINED" : "TRAFFIC / MONITORING"}
            position={[0, 0.17, 1.35]}
            rotation={[-Math.PI / 2, 0, 0]}
            width={4}
            height={0.4}
            color={active ? "#b8e8b8" : "#d3c1dd"}
          />
        </>
      ) : kind === "data" ? (
        <>
          {Array.from({ length: 20 }, (_, i) => (
            <Box
              key={i}
              position={[
                -2.5 + (i % 5) * 1.2,
                active ? 0.3 + (i % 5) * 0.18 : 0.25 + (i % 3) * 0.25,
                -0.9 + Math.floor(i / 5) * 0.7,
              ]}
              size={[0.36, active ? 0.2 + (i % 5) * 0.35 : 0.35, 0.36]}
              color={
                active
                  ? ["#ae96d2", "#d8bedf", "#f6ab79", "#a7c8ad", "#d1c48c"][
                      i % 5
                    ]
                  : "#746580"
              }
            />
          ))}
        </>
      ) : kind === "agentic-ai" ? (
        <>
          <Robot position={[0, 0.15, 0]} awake reduced={reduced} />
          {[-2, 2].map((x, i) => (
            <group key={x}>
              <Box
                position={[x, 0.65, 0]}
                size={[1.3, 1.05, 0.2]}
                color="#2f2c40"
              />
              <Label
                text={i ? "TOOLS" : "DATA"}
                position={[x, 0.7, 0.13]}
                width={1.1}
                height={0.3}
                color="#e1cdeb"
              />
              <Box
                position={[x / 2, 0.14, 0.15]}
                size={[1.4, 0.025, 0.05]}
                color="#f69471"
              />
            </group>
          ))}
        </>
      ) : (
        <>
          <Box
            position={[0, 0.85, 0]}
            size={[3.4, 0.12, 1.6]}
            color="#f5e9da"
          />
          <Box
            position={[0, 1.3, -0.35]}
            size={[1.4, 0.75, 0.08]}
            color="#4c415d"
          />
          <Label
            text={active ? "SHIPPED ✓" : "{ BUILD }"}
            position={[0, 1.3, -0.29]}
            width={1.2}
            height={0.3}
            color="#e9d7e8"
          />
          <Person
            position={[-1.5, 0.12, 0.8]}
            female={kind === "academy-x"}
            index={0}
            color="#dfab4b"
            reduced={reduced}
          />
          <Person
            position={[1.5, 0.12, 0.8]}
            female
            index={2}
            color="#ad8bbb"
            reduced={reduced}
          />
          <Plant position={[2.7, 0.35, -1.1]} scale={0.8} />
        </>
      )}
    </group>
  );
}
class StageBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export default function WorldStage({
  kind,
  active = false,
  reduced = false,
}: {
  kind: string;
  active?: boolean;
  reduced?: boolean;
}) {
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  if (!supportsWebGL()) return null;
  return (
    <div className="world-stage" aria-hidden="true">
      <StageBoundary>
        <Canvas
          frameloop={hidden ? "never" : reduced ? "demand" : "always"}
          orthographic
          camera={{ position: [7, 6, 10], zoom: 38 }}
          dpr={1}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={2} />
          <directionalLight position={[-4, 8, 5]} intensity={3} />
          <Model kind={kind} active={active} reduced={reduced} />
        </Canvas>
      </StageBoundary>
    </div>
  );
}
