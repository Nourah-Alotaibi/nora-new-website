import { useEffect, useMemo, useRef } from "react";
import { Model } from "./AssetModel";
import { RoundedBox } from "@react-three/drei/core/RoundedBox.js";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { ThreeElements } from "@react-three/fiber";
type V3 = [number, number, number];
export function Box({
  position = [0, 0, 0],
  size = [1, 1, 1],
  color = "#e9e6e2",
  radius = 0.06,
  ...props
}: { position?: V3; size?: V3; color?: string; radius?: number } & Omit<
  ThreeElements["mesh"],
  "position" | "args" | "ref"
>) {
  return (
    <RoundedBox
      args={size}
      radius={Math.min(radius, ...size.map((n) => n / 3))}
      smoothness={2}
      position={position}
      castShadow
      receiveShadow
      {...props}
    >
      <meshStandardMaterial color={color} roughness={0.62} />
    </RoundedBox>
  );
}
export function Cylinder({
  position = [0, 0, 0],
  radius = 0.2,
  height = 0.5,
  color = "#eee",
  top,
  rotation,
}: {
  position?: V3;
  radius?: number;
  height?: number;
  color?: string;
  top?: number;
  rotation?: V3;
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <cylinderGeometry args={[top ?? radius, radius, height, 32]} />
      <meshStandardMaterial color={color} roughness={0.48} />
    </mesh>
  );
}
export function Label({
  text,
  position = [0, 0, 0],
  width = 2,
  height = 0.5,
  color = "#282735",
  background,
  rotation = [0, 0, 0],
}: {
  text: string;
  position?: V3;
  width?: number;
  height?: number;
  color?: string;
  background?: string;
  rotation?: V3;
}) {
  const texture = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = Math.round((1024 * height) / width);
    const ctx = c.getContext("2d")!;
    if (background) {
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, c.width, c.height);
    }
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `bold ${Math.min(c.height * 0.56, 95)}px monospace`;
    ctx.fillText(text, 512, c.height / 2, 980);
    return new THREE.CanvasTexture(c);
  }, [text, width, height, color, background]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} transparent toneMapped={false} />
    </mesh>
  );
}
export function Dallah({
  position = [0, 0, 0],
  pouring = false,
}: {
  position?: V3;
  pouring?: boolean;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (g.current)
      g.current.rotation.z = THREE.MathUtils.damp(
        g.current.rotation.z,
        pouring ? -0.55 : 0,
        6,
        dt,
      );
  });
  return (
    <group position={position} ref={g}>
      <mesh castShadow>
        <latheGeometry
          args={[
            [
              new THREE.Vector2(0.2, 0),
              new THREE.Vector2(0.36, 0.12),
              new THREE.Vector2(0.39, 0.35),
              new THREE.Vector2(0.25, 0.65),
              new THREE.Vector2(0.16, 0.95),
              new THREE.Vector2(0.2, 1.02),
            ],
            40,
          ]}
        />
        <meshStandardMaterial
          color="#b79257"
          metalness={0.72}
          roughness={0.27}
        />
      </mesh>
      <Cylinder
        position={[0, 1.02, 0]}
        radius={0.23}
        top={0.04}
        height={0.22}
        color="#c9a967"
      />
      <Cylinder
        position={[0, 1.18, 0]}
        radius={0.05}
        height={0.12}
        color="#b79257"
      />
      <mesh position={[-0.31, 0.54, 0]} rotation={[0, 0, 0.15]} castShadow>
        <torusGeometry args={[0.32, 0.055, 10, 30, Math.PI * 1.8]} />
        <meshStandardMaterial color="#b79257" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh castShadow position={[0, 0, -0.055]}>
        <extrudeGeometry
          args={[
            new THREE.Shape()
              .moveTo(0.2, 0.42)
              .bezierCurveTo(0.55, 0.42, 0.81, 0.68, 1.02, 1.12)
              .bezierCurveTo(0.76, 0.95, 0.57, 0.84, 0.2, 0.78)
              .closePath(),
            {
              depth: 0.11,
              bevelEnabled: true,
              bevelSegments: 2,
              steps: 1,
              bevelSize: 0.018,
              bevelThickness: 0.015,
              curveSegments: 20,
            },
          ]}
        />
        <meshStandardMaterial
          color="#b79257"
          metalness={0.9}
          roughness={0.25}
        />
      </mesh>
      {pouring && (
        <Cylinder
          position={[0.8, 0.15, 0]}
          radius={0.022}
          height={1.1}
          color="#b97c30"
        />
      )}
    </group>
  );
}
export function Cup({
  position = [0, 0, 0],
  level = 1,
}: {
  position?: V3;
  level?: number;
}) {
  const liquid = useRef<THREE.Mesh>(null);
  const profile = useMemo(
    () =>
      [
        [0, -0.165],
        [0.14, -0.165],
        [0.17, -0.14],
        [0.235, 0.1],
        [0.25, 0.16],
        [0.245, 0.18],
        [0.227, 0.17],
        [0.217, 0.1],
        [0.145, -0.12],
        [0, -0.12],
      ].map((p) => new THREE.Vector2(...(p as [number, number]))),
    [],
  );
  useFrame((_, dt) => {
    if (liquid.current) {
      liquid.current.position.y = THREE.MathUtils.damp(
        liquid.current.position.y,
        level ? 0.105 : -0.115,
        4,
        dt,
      );
      liquid.current.scale.setScalar(
        THREE.MathUtils.damp(liquid.current.scale.x, level ? 1 : 0.63, 4, dt),
      );
    }
  });
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <latheGeometry args={[profile, 40]} />
        <meshPhysicalMaterial
          color="#faf3e5"
          roughness={0.23}
          clearcoat={0.32}
        />
      </mesh>
      <mesh
        ref={liquid}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.105, 0]}
      >
        <circleGeometry args={[0.216, 40]} />
        <meshPhysicalMaterial color="#9d6429" roughness={0.2} clearcoat={0.6} />
      </mesh>
      <mesh position={[0, 0.14, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.241, 0.005, 6, 40]} />
        <meshStandardMaterial
          color="#b49355"
          metalness={0.85}
          roughness={0.25}
        />
      </mesh>
    </group>
  );
}
export function Robot({
  position = [0, 0, 0],
  awake = false,
  annoyed = false,
  reduced = false,
}: {
  position?: V3;
  awake?: boolean;
  annoyed?: boolean;
  reduced?: boolean;
}) {
  return (
    <group position={position}>
      <Model
        asset="robot"
        height={1.15}
        animate={awake && !annoyed}
        reduced={reduced}
      />
      <Label
        text={
          annoyed ? "ONE THING AT A TIME" : awake ? "READY TO BUILD" : "z z z"
        }
        position={[0, 1.32, 0]}
        width={annoyed ? 1.4 : 0.9}
        height={0.14}
        color="#65596d"
      />
    </group>
  );
}
export function Plant({
  position = [0, 0, 0],
  scale = 1,
}: {
  position?: V3;
  scale?: number;
}) {
  return (
    <group position={position} scale={scale}>
      <Cylinder radius={0.26} top={0.32} height={0.55} color="#ad735a" />
      {Array.from({ length: 7 }, (_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 2) * 0.21,
            0.65 + (i % 3) * 0.16,
            Math.cos(i * 2) * 0.21,
          ]}
          rotation={[0.2 * Math.cos(i), i, 0.4 * Math.sin(i)]}
          castShadow
        >
          <sphereGeometry args={[0.2, 10, 10]} />
          <meshStandardMaterial color={i % 2 ? "#6e8658" : "#526e48"} />
        </mesh>
      ))}
    </group>
  );
}
export function Person({
  position = [0, 0, 0],
  color = "#9187bb",
  female = false,
  index = 0,
  reduced = false,
}: {
  position?: V3;
  color?: string;
  female?: boolean;
  index?: number;
  reduced?: boolean;
}) {
  const head = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (head.current && !reduced)
      head.current.rotation.y =
        Math.sin(clock.elapsedTime * 0.7 + index * 2) * 0.2;
  });
  return (
    <group position={position} scale={0.8}>
      <Box
        size={[0.5, 0.6, 0.33]}
        position={[0, 0.64, 0]}
        color={color}
        radius={0.15}
      />
      <group position={[0, 1.19, 0]} ref={head}>
        <mesh castShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#c99572" />
        </mesh>
        <mesh position={[0, 0.11, -0.055]}>
          <sphereGeometry
            args={[
              0.24,
              16,
              16,
              0,
              Math.PI * 2,
              0,
              female ? Math.PI * 0.75 : Math.PI * 0.5,
            ]}
          />
          <meshStandardMaterial color={female ? "#454050" : "#352e31"} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.075, 0.02, 0.23]}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshStandardMaterial color="#211f2a" />
          </mesh>
        ))}
        <Label
          text="⌣"
          position={[0, -0.08, 0.241]}
          width={0.12}
          height={0.08}
        />
      </group>
      {[-1, 1].map((s) => (
        <group key={s}>
          <Box
            size={[0.16, 0.4, 0.18]}
            position={[s * 0.14, 0.18, 0]}
            color="#45414f"
          />
          <Box
            size={[0.19, 0.12, 0.31]}
            position={[s * 0.14, 0.01, 0.05]}
            color="#f9f1e0"
          />
          <Box
            size={[0.15, 0.48, 0.18]}
            position={[s * 0.33, 0.65, 0.07]}
            rotation={[0, 0, s * 0.2]}
            color={color}
          />
        </group>
      ))}
    </group>
  );
}
