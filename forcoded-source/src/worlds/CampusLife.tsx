import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as T from "three";
import { Model } from "./AssetModel";
import { Label } from "./Objects";
import { getRoom, type RoomId } from "../data/rooms";
function makePerson(
  female: boolean,
  child: boolean,
  color: string,
  index: number,
) {
  const g = new T.Group(),
    skin = new T.MeshStandardMaterial({
      color: ["#bb8564", "#d3a280", "#a66f51"][index % 3],
      roughness: 0.8,
    }),
    cloth = new T.MeshStandardMaterial({ color, roughness: 0.94 }),
    hair = new T.MeshStandardMaterial({
      color: index % 3 ? "#302b2c" : "#514039",
      roughness: 0.9,
    }),
    pants = new T.MeshStandardMaterial({ color: "#44414d", roughness: 0.88 }),
    white = new T.MeshStandardMaterial({ color: "#efe6d8", roughness: 0.8 }),
    eye = new T.MeshStandardMaterial({ color: "#22222c" });
  const sphere = (
    parent: T.Group,
    p: number[],
    s: number[],
    mat: T.Material,
  ) => {
    const mesh = new T.Mesh(new T.SphereGeometry(1, 12, 10), mat);
    mesh.position.set(...(p as [number, number, number]));
    mesh.scale.set(...(s as [number, number, number]));
    mesh.castShadow = true;
    parent.add(mesh);
    return mesh;
  };
  const limb = (
    parent: T.Group,
    p: number[],
    r: number,
    len: number,
    mat: T.Material,
  ) => {
    const m = new T.Mesh(new T.CapsuleGeometry(r, len, 3, 8), mat);
    m.position.set(...(p as [number, number, number]));
    m.castShadow = true;
    parent.add(m);
    return m;
  };
  for (const side of [-1, 1]) {
    limb(g, [side * 0.105, 0.32, 0], 0.067, 0.4, pants);
    sphere(g, [side * 0.105, 0.075, 0.06], [0.085, 0.065, 0.17], white);
  }
  sphere(g, [0, 0.75, 0], [female ? 0.19 : 0.21, 0.3, 0.13], cloth);
  limb(g, [0, 1.01, 0], 0.06, 0.1, skin);
  const head = new T.Group();
  head.position.y = 1.18;
  g.add(head);
  sphere(head, [0, 0, 0], [0.155, 0.19, 0.15], skin);
  sphere(head, [0, 0.08, -0.025], [0.163, 0.13, 0.15], hair);
  if (female) {
    sphere(head, [0, -0.06, -0.09], [0.165, 0.2, 0.085], hair);
    sphere(head, [0.14, -0.08, -0.06], [0.06, 0.16, 0.07], hair);
  }
  sphere(head, [0, -0.015, 0.15], [0.035, 0.043, 0.036], skin);
  const face = new T.Group();
  head.add(face);
  for (const side of [-1, 1]) {
    sphere(face, [side * 0.055, 0.025, 0.14], [0.018, 0.023, 0.014], white);
    sphere(face, [side * 0.055, 0.025, 0.153], [0.009, 0.014, 0.007], eye);
    const brow = limb(face, [side * 0.055, 0.066, 0.146], 0.009, 0.035, hair);
    brow.rotation.z = Math.PI / 2;
  }
  const mouth = limb(face, [0, -0.07, 0.139], 0.008, 0.038, hair);
  mouth.rotation.z = Math.PI / 2;
  const arms = [-1, 1].map((side) => {
    const a = new T.Group();
    a.position.set(side * 0.22, 0.93, 0);
    g.add(a);
    limb(a, [0, -0.12, 0], 0.055, 0.18, cloth);
    const elbow = new T.Group();
    elbow.position.y = -0.25;
    a.add(elbow);
    limb(elbow, [0, -0.07, 0], 0.044, 0.12, skin);
    sphere(elbow, [0, -0.16, 0.01], [0.055, 0.06, 0.032], skin);
    return a;
  });
  g.scale.setScalar(child ? 0.79 : 1.08);
  return { g, head, arms, face };
}
function Learner({
  position,
  female = false,
  child = false,
  color,
  index,
  reduced,
  active,
  task,
}: {
  position: [number, number, number];
  female?: boolean;
  child?: boolean;
  color: string;
  index: number;
  reduced: boolean;
  active: boolean;
  task: string;
}) {
  const { g, head, arms, face } = useMemo(
    () => makePerson(female, child, color, index),
    [female, child, color, index],
  );
  useEffect(
    () => () => {
      const mats = new Set<T.Material>();
      g.traverse((o: any) => {
        o.geometry?.dispose();
        if (o.material) mats.add(o.material);
      });
      mats.forEach((m) => m.dispose());
    },
    [g],
  );
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime + index;
    face.visible = (camera as T.OrthographicCamera).zoom > 30;
    if (!reduced && active) {
      head.rotation.y = Math.sin(t * 0.65) * 0.17;
      arms[0].rotation.x =
        task === "pitch"
          ? -0.4 - Math.sin(t * 0.8) * 0.4
          : -0.8 + Math.sin(t * 3) * 0.08;
      arms[1].rotation.x =
        task === "pitch" ? -0.35 : -0.8 + Math.sin(t * 3 + 1) * 0.08;
    } else {
      arms.forEach((a) => (a.rotation.x = -0.35));
      head.rotation.y = 0;
    }
  });
  return (
    <group
      position={position}
      rotation={[0, task === "pitch" ? 0.2 : Math.PI, 0]}
    >
      <primitive object={g} />
    </group>
  );
}
function Signal({
  id,
  step,
  active,
  reduced,
}: {
  id: RoomId;
  step: number;
  active: boolean;
  reduced: boolean;
}) {
  const ref = useRef<T.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = reduced || !active ? step / 4 : (clock.elapsedTime % 4) / 4;
      ref.current.position.x = -1.1 + t * 2.1;
      ref.current.scale.y = id === "data" ? 0.35 + step * 0.25 : 1;
    }
  });
  return (
    <mesh
      ref={ref}
      position={[
        0,
        id === "juniors" ? 0.66 : 1.85,
        id === "juniors" ? 0.3 : -1.67,
      ]}
    >
      <sphereGeometry args={[0.045, 8, 8]} />
      <meshStandardMaterial
        color={step === 1 ? "#d29753" : "#6da38d"}
        emissive={step === 1 ? "#d29753" : "#6da38d"}
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
const scripts: Record<RoomId, string[]> = {
  ai: ["TASK RECEIVED", "TOOLS CONNECTED", "HUMAN APPROVAL", "ACTION COMPLETE"],
  cyber: [
    "MONITORING",
    "ALERT DETECTED",
    "INVESTIGATING",
    "CONNECTION ISOLATED",
  ],
  data: ["RAW DATA", "CLEAN DATA", "MODEL TRAINING", "PREDICTION READY"],
  youth: ["BUILD A PAGE", "TEST THE PROJECT", "FIX THE BUG", "READY TO DEMO"],
  academy: [
    "A NEW IDEA",
    "BUILD THE STORY",
    "PRACTICE THE PITCH",
    "FEEDBACK & REFINE",
  ],
  juniors: ["MAKE A PLAN", "TRY THE ROBOT", "A WRONG TURN!", "TRY AGAIN"],
};
export function RoomLife({
  id,
  active,
  reduced,
}: {
  id: RoomId;
  active: boolean;
  reduced: boolean;
}) {
  const r = getRoom(id);
  const [step, setStep] = useState(0);
  useEffect(() => {
    const advance = (event: Event) => {
      if ((event as CustomEvent).detail === id) setStep((s) => (s + 1) % 4);
    };
    window.addEventListener("coded-room-step", advance);
    return () => window.removeEventListener("coded-room-step", advance);
  }, [id]);
  useEffect(() => {
    if (!active || reduced) return;
    const timer = setInterval(() => setStep((s) => (s + 1) % 4), 2600);
    return () => clearInterval(timer);
  }, [active, reduced]);
  return (
    <group position={[r.x, r.floor * 3.5, 0]}>
      <Signal id={id} step={step} active={active} reduced={reduced} />
      <Label
        text={scripts[id][step]}
        position={[0, 2.15, -1.72]}
        width={id === "academy" ? 1.8 : 2.9}
        height={0.22}
        color="#39343f"
        background="#f6f0e6"
      />
      <Learner
        position={[-0.85, 0.09, 0.35]}
        female={id === "academy" || id === "data"}
        child={id === "juniors"}
        color={r.color}
        index={r.floor * 3 + 1}
        reduced={reduced}
        active={active}
        task={id === "academy" ? "pitch" : "type"}
      />
      <Learner
        position={[
          id === "academy" ? 0.65 : 1.15,
          0.09,
          id === "academy" ? -0.65 : 1.2,
        ]}
        female={id === "academy" || id === "youth"}
        child={false}
        color={id === "academy" ? "#95709d" : "#bf825f"}
        index={r.floor * 3 + 2}
        reduced={reduced}
        active={active}
        task="pitch"
      />
      <Model
        asset="chair"
        position={[-0.85, 0.09, 0.8]}
        height={0.9}
        rotation={Math.PI}
      />
      {id === "ai" && (
        <Model
          asset="robot"
          position={[-1.55, 0.1, 1.3]}
          height={0.63}
          animate={active}
          reduced={reduced}
        />
      )}
      {id === "juniors" && (
        <Model
          asset="robot"
          position={[0.7, 0.64, 0.3]}
          height={0.32}
          animate={active}
          reduced={reduced}
        />
      )}
    </group>
  );
}
