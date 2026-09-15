import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { Html } from "@react-three/drei/web/Html.js";
import * as THREE from "three";
import { Box, Cylinder, Label, Dallah, Cup, Robot, Plant } from "./Objects";
export type DeskAction =
  | "coffee"
  | "pour"
  | "spill"
  | "robot"
  | "laptop"
  | "passport"
  | "keyboard"
  | "cookie"
  | "dates"
  | "monitor"
  | "button"
  | "duck";
function MovableDallah({
  pouring,
  onAction,
  onDragState,
}: {
  pouring: boolean;
  onAction: (a: DeskAction) => void;
  onDragState: (active: boolean) => void;
}) {
  const ref = useRef<THREE.Group>(null);
  const drag = useRef(false);
  const moved = useRef(false);
  const point = useRef(new THREE.Vector3(4.5, 0.2, 0.25));
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.2);
  const [spill, setSpill] = useState(false);
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target?.closest("input,textarea,[contenteditable=true]") ||
        e.isComposing ||
        e.shiftKey ||
        e.altKey
      )
        return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        point.current.set(4.5, 0.2, 0.25);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (!spill) return;
    const t = setTimeout(() => setSpill(false), 3500);
    return () => clearTimeout(t);
  }, [spill]);
  useFrame((_, dt) => {
    if (ref.current) {
      const target = pouring
        ? new THREE.Vector3(2.9, 0.95, 1.75)
        : point.current.clone().setY(drag.current ? 0.6 : 0.2);
      ref.current.position.lerp(target, 1 - Math.exp(-10 * Math.min(dt, 0.05)));
    }
  });
  function down(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation();
    drag.current = true;
    moved.current = false;
    onDragState(true);
    (
      e.target as unknown as { setPointerCapture: (id: number) => void }
    ).setPointerCapture(e.pointerId);
  }
  function move(e: ThreeEvent<PointerEvent>) {
    if (!drag.current) return;
    e.stopPropagation();
    const hit = new THREE.Vector3();
    if (e.ray.intersectPlane(plane, hit)) {
      point.current.set(
        THREE.MathUtils.clamp(hit.x, -5, 5),
        0.2,
        THREE.MathUtils.clamp(hit.z, -2.4, 2.4),
      );
      moved.current = true;
    }
  }
  function up(e: ThreeEvent<PointerEvent>) {
    if (!drag.current) return;
    e.stopPropagation();
    drag.current = false;
    onDragState(false);
    (
      e.target as unknown as { releasePointerCapture: (id: number) => void }
    ).releasePointerCapture(e.pointerId);
    if (
      !moved.current ||
      point.current.distanceTo(new THREE.Vector3(3.4, 0.2, 1.75)) < 1.3
    )
      onAction("pour");
    else {
      setSpill(true);
      onAction("spill");
    }
  }
  return (
    <>
      <group
        ref={ref}
        position={[4.5, 0.2, 0.25]}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={() => {
          drag.current = false;
          onDragState(false);
        }}
        onPointerOver={() => (document.body.style.cursor = "grab")}
        onPointerOut={() => (document.body.style.cursor = "auto")}
      >
        <Dallah pouring={pouring} />
      </group>
      {spill && (
        <group position={[point.current.x, 0.195, point.current.z]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} scale={[1, 0.55, 1]}>
            <circleGeometry args={[0.35, 24]} />
            <meshStandardMaterial color="#a46e40" transparent opacity={0.5} />
          </mesh>
          <Robot position={[0.65, 0, 0]} awake />
        </group>
      )}
    </>
  );
}
export default function DeskWorld({
  awake,
  laptopReady,
  coffee,
  pouring,
  cookie,
  dates,
  onAction,
  portal,
  reduced,
  onDragState,
}: {
  awake: number;
  laptopReady: boolean;
  coffee: number;
  pouring: boolean;
  cookie: number;
  dates: number;
  onAction: (a: DeskAction) => void;
  portal: boolean;
  reduced: boolean;
  onDragState: (active: boolean) => void;
}) {
  const robot = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (robot.current)
      robot.current.position.x = THREE.MathUtils.damp(
        robot.current.position.x,
        awake > 0 ? 3.1 : 4,
        2,
        dt,
      );
  });
  const action = (a: DeskAction) => ({
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      onAction(a);
    },
    onPointerOver: () => {
      document.body.style.cursor = "pointer";
    },
    onPointerOut: () => {
      document.body.style.cursor = "auto";
    },
  });
  return (
    <group position={[0, -0.3, 0]}>
      <Box
        position={[0, 0, 0]}
        size={[11, 0.35, 5.6]}
        color="#c9bce0"
        radius={0.22}
      />
      <Box position={[0, -0.23, 0]} size={[10.8, 0.13, 5.4]} color="#ad9ec4" />
      {[-4.6, 4.6].flatMap((x) =>
        [-1.8, 1.8].map((z) => (
          <Box
            key={`${x}${z}`}
            position={[x, -1.45, z]}
            size={[0.35, 2.8, 0.35]}
            color="#b5a7c5"
          />
        )),
      )}
      <Box
        position={[0.35, 0.205, 0.8]}
        size={[5.6, 0.025, 2.8]}
        color="#b2a5c8"
        radius={0.2}
      />
      <group position={[0.8, 0.2, -0.4]} {...action("laptop")}>
        <Box
          position={[0, 0.07, 0.55]}
          size={[3.45, 0.16, 2.2]}
          color="#b4afb9"
        />
        <group position={[0, 1.34, -0.42]} rotation={[-0.12, 0, 0]}>
          <Box size={[3.45, 2.5, 0.15]} color="#373441" radius={0.1} />
          <Box
            position={[0, 0, 0.085]}
            size={[3.19, 2.23, 0.014]}
            color={laptopReady ? "#1e2030" : "#49405c"}
          />
          <Label
            text={laptopReady ? "> curiosity = high" : "{ CODED }"}
            position={[0, 0.5, 0.105]}
            width={2.7}
            height={0.32}
            color={laptopReady ? "#b9cda7" : "#b7a7d5"}
          />
          <Label
            text={laptopReady ? "> ready to build?" : "a world of builders_"}
            position={[0, 0.02, 0.11]}
            width={2.7}
            height={0.32}
            color="#e9dfec"
          />
          <Label
            text={laptopReady ? "ENTER CODED →" : "tap to wake"}
            position={[0, -0.6, 0.11]}
            width={2.4}
            height={0.32}
            color={laptopReady ? "#ff875e" : "#aaa0b6"}
          />
          <Cylinder
            position={[0, 1.15, 0.095]}
            radius={0.02}
            height={0.02}
            rotation={[Math.PI / 2, 0, 0]}
            color="#aaa"
          />
        </group>
        {Array.from({ length: 36 }, (_, i) => (
          <Box
            key={i}
            position={[
              -1.37 + (i % 12) * 0.25,
              0.18,
              0.0 + Math.floor(i / 12) * 0.27,
            ]}
            size={[0.21, 0.035, 0.2]}
            color={i === 0 ? "#ff865c" : "#696372"}
            radius={0.018}
          />
        ))}
        <Box
          position={[0, 0.171, 1.25]}
          size={[1, 0.01, 0.55]}
          color="#9c95a3"
        />
        {laptopReady && !portal && (
          <Html position={[0, 2.9, -0.2]} center zIndexRange={[10, 0]}>
            <button
              className="scene-enter"
              onClick={(e) => {
                e.stopPropagation();
                onAction("laptop");
              }}
            >
              Enter CODED <span>↗</span>
            </button>
          </Html>
        )}
      </group>
      <group
        position={[-3.4, 0.2, -1.2]}
        rotation={[0, 0.16, 0]}
        {...action("monitor")}
      >
        <Cylinder
          position={[0, 0.4, 0]}
          radius={0.12}
          height={0.8}
          color="#eee8df"
        />
        <Box
          position={[0, 0.1, 0.15]}
          size={[1.3, 0.12, 0.7]}
          color="#eee8df"
        />
        <Box
          position={[0, 1.72, 0]}
          size={[2.8, 2.05, 0.24]}
          color="#f0e9df"
          radius={0.11}
        />
        <Box
          position={[0, 1.72, 0.13]}
          size={[2.52, 1.77, 0.01]}
          color="#625b7b"
        />
        <Label
          text="hello, world."
          position={[0, 2.16, 0.15]}
          width={2.15}
          height={0.38}
          color="#e6daee"
        />
        {[
          "const future = {",
          "  builtBy: you,",
          "  possibilities: ∞",
          "};",
        ].map((s, i) => (
          <Label
            key={s}
            text={s}
            position={[0, 1.8 - i * 0.23, 0.15]}
            width={2.1}
            height={0.21}
            color={i === 1 ? "#f6b695" : "#bfb5d4"}
          />
        ))}
      </group>
      <group
        position={[-2.5, 0.22, 1.1]}
        rotation={[0, 0.08, 0]}
        {...action("keyboard")}
      >
        <Box size={[2.7, 0.15, 1]} color="#ede6db" />
        {Array.from({ length: 30 }, (_, i) => (
          <Box
            key={i}
            position={[
              -1.16 + (i % 10) * 0.26,
              0.1,
              -0.3 + Math.floor(i / 10) * 0.28,
            ]}
            size={[0.22, 0.055, 0.23]}
            color={i === 0 ? "#ff8255" : i % 5 === 0 ? "#bbaad6" : "#fcf8f0"}
            radius={0.025}
          />
        ))}
        <Label
          text="RUN"
          position={[1.01, 0.14, 0.25]}
          rotation={[-Math.PI / 2, 0, 0]}
          width={0.33}
          height={0.15}
        />
      </group>
      <group position={[3.4, 0.42, 1.75]} {...action("coffee")}>
        <Cylinder
          position={[0, -0.16, 0]}
          radius={0.4}
          height={0.025}
          color="#eee3cd"
        />
        <Cup level={coffee} />
      </group>
      <MovableDallah
        pouring={pouring}
        onAction={onAction}
        onDragState={onDragState}
      />
      <group position={[4, 0, -1.5]} ref={robot} {...action("robot")}>
        <Robot
          position={[0, 0.25, 0]}
          awake={awake > 0}
          annoyed={awake > 3}
          reduced={reduced}
        />
      </group>
      <group
        position={[-4.3, 0.25, 1.4]}
        rotation={[0, -0.2, 0]}
        {...action("passport")}
      >
        <Box size={[1.05, 0.18, 1.45]} color="#fb673f" />
        <Label
          text="CODED"
          position={[0, 0.1, -0.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          width={0.8}
          height={0.3}
          color="#fff0d9"
        />
        <Label
          text="PASSPORT"
          position={[0, 0.1, 0.2]}
          rotation={[-Math.PI / 2, 0, 0]}
          width={0.8}
          height={0.16}
          color="#fff0d9"
        />
        <Box
          position={[0.4, 0.11, 0]}
          size={[0.035, 0.025, 1.45]}
          color="#dc462c"
        />
      </group>
      <Plant position={[-4.75, 0.47, -2.1]} scale={0.8} />
      <Plant position={[4.75, 0.52, -2.2]} scale={1.1} />
      <group position={[-0.6, 0.2, -2.1]}>
        <Box position={[0, 0.45, 0]} size={[0.8, 0.9, 0.5]} color="#3e3d4d" />
        {[0, 1, 2].map((i) => (
          <group key={i}>
            <Box
              position={[0, 0.2 + i * 0.23, 0.26]}
              size={[0.64, 0.13, 0.02]}
              color="#5c596c"
            />
            <Box
              position={[0.2, 0.2 + i * 0.23, 0.28]}
              size={[0.06, 0.04, 0.025]}
              color="#bad4a5"
            />
          </group>
        ))}
      </group>
      <group position={[2.8, 0.35, -2.05]}>
        <Box size={[1.3, 0.27, 0.8]} color="#f4e9d7" />
        <Box position={[0, 0.2, 0]} size={[1.15, 0.12, 0.73]} color="#807792" />
        <Label
          text="BUILD / REPEAT"
          position={[0, 0.27, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          width={1.05}
          height={0.22}
        />
      </group>
      <group position={[1.1, 0.23, 2.3]} {...action("cookie")}>
        {cookie < 4 && (
          <>
            <Cylinder radius={0.3} height={0.09} color="#c79359" />
            {Array.from({ length: 6 - cookie }, (_, i) => (
              <Cylinder
                key={i}
                position={[Math.cos(i) * 0.18, 0.05, Math.sin(i) * 0.18]}
                radius={0.03}
                height={0.025}
                color="#69482e"
              />
            ))}
          </>
        )}
      </group>
      <group position={[-0.6, 0.25, 2.05]} {...action("dates")}>
        <Cylinder radius={0.42} top={0.48} height={0.12} color="#e6d7bb" />
        {Array.from({ length: dates }, (_, i) => (
          <mesh
            key={i}
            position={[Math.cos(i * 2) * 0.23, 0.1, Math.sin(i * 2) * 0.22]}
            scale={[0.11, 0.08, 0.18]}
          >
            <sphereGeometry args={[1, 12, 12]} />
            <meshStandardMaterial color="#79503d" roughness={0.65} />
          </mesh>
        ))}
      </group>
      <group position={[2.85, 0.32, 0.7]} {...action("button")}>
        <Cylinder radius={0.16} height={0.13} color="#fa6036" />
        <Cylinder
          position={[0, -0.06, 0]}
          radius={0.22}
          height={0.06}
          color="#373241"
        />
      </group>
      <Box
        position={[-1.25, 0.25, -0.45]}
        size={[0.7, 0.035, 0.7]}
        color="#e9d881"
        rotation={[0, 0.2, 0]}
      />
      <Label
        text="what if?"
        position={[-1.25, 0.28, -0.45]}
        rotation={[-Math.PI / 2, 0, 0.2]}
        width={0.62}
        height={0.23}
      />
      <group position={[2.9, 0.25, -0.5]}>
        <Box size={[0.4, 0.2, 0.65]} color="#f1ece5" radius={0.15} />
        <Box
          position={[0, 0.12, -0.06]}
          size={[0.04, 0.02, 0.13]}
          color="#9c94ad"
        />
      </group>
      <group position={[-2.2, 0.4, -2.1]} {...action("duck")}>
        <mesh scale={[0.23, 0.17, 0.28]}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshStandardMaterial color="#e8be51" />
        </mesh>
        <mesh position={[0.08, 0.2, 0.07]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#e8be51" />
        </mesh>
        <Box
          position={[0.1, 0.17, 0.23]}
          size={[0.16, 0.06, 0.15]}
          color="#e89043"
        />
        {[-0.025, 0.17].map((x) => (
          <mesh key={x} position={[x, 0.24, 0.17]}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshStandardMaterial color="#38313e" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
