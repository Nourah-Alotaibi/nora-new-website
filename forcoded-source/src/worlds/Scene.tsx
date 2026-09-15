import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei/core/OrbitControls.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import * as THREE from "three";
import { getRoom, type RoomId, type CampusView } from "../data/rooms";
import DeskWorld from "./DeskWorld";
import type { DeskAction } from "./DeskWorld";
import Dollhouse from "./Dollhouse";
import type { Audience } from "../data/programs";
import { supportsWebGL } from "./capabilities";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
export type SceneProps = {
  room?: RoomId;
  campusView?: CampusView;
  onRoom?: (id: RoomId) => void;
  world: "desk" | "dollhouse" | "program";
  revealed: boolean;
  awake: number;
  laptopReady: boolean;
  coffee: number;
  pouring: boolean;
  cookie: number;
  dates: number;
  onAction: (a: DeskAction) => void;
  portal: boolean;
  reduced: boolean;
  audience: Audience;
  onAudience: (a: Audience) => void;
  onExplore: (id: string) => void;
  highlight: string | null;
  onReady: () => void;
};
function CameraRig({
  portal,
  reduced,
  world,
  revealed,
  dragging,
  room,
  campusView,
}: {
  portal: boolean;
  reduced: boolean;
  world: string;
  audience: Audience;
  revealed: boolean;
  dragging: boolean;
  room?: RoomId;
  campusView?: CampusView;
}) {
  const { camera, size } = useThree();
  const controls = useRef<OrbitControlsImpl>(null);
  const target = useRef(new THREE.Vector3());
  const initialized = useRef(false);
  useEffect(() => {
    camera.position.set(
      ...((world === "dollhouse" ? [4, 5, 24] : [10, 10, 14]) as [
        number,
        number,
        number,
      ]),
    );
    target.current.set(0, 0, 0);
    initialized.current = false;
  }, [world, camera]);
  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const mobile = window.innerWidth < 700;
    const campus = world === "dollhouse";
    const focus = getRoom(room || "ai");
    const normalZoom = campus
      ? Math.min(
          size.width / (campusView === "room" ? 6.2 : 19.5),
          size.height /
            (campusView === "room" ? 5.8 : campusView === "floor" ? 6.5 : 11.2),
        )
      : Math.min(
          size.width / (world === "desk" ? 15.7 : 17),
          size.height / (mobile ? 10 : 11),
        );
    const goalZoom = portal
      ? normalZoom * 7
      : !revealed
        ? normalZoom * 3
        : normalZoom;
    const coffeeAnchor = [3.4, 0.3, 1.75],
      laptopAnchor = [0.8, 1.3, -0.4];
    const roomAnchor = campus
      ? [
          campusView === "room" ? focus.x : 0,
          campusView === "building" ? 0.4 : focus.floor * 3.5 - 1.25,
          0,
        ]
      : [0, 0, 0];
    const desired = new THREE.Vector3(
      ...(!revealed ? coffeeAnchor : portal ? laptopAnchor : roomAnchor),
    );
    const before = target.current.clone();
    if (!initialized.current || reduced) target.current.copy(desired);
    else target.current.lerp(desired, 1 - Math.exp(-3.5 * dt));
    camera.position.add(target.current.clone().sub(before));
    controls.current?.target.copy(target.current);
    const cam = camera as THREE.OrthographicCamera;
    cam.zoom =
      reduced || !initialized.current
        ? goalZoom
        : THREE.MathUtils.damp(cam.zoom, goalZoom, portal ? 3 : 3.5, dt);
    cam.updateProjectionMatrix();
    controls.current?.update();
    initialized.current = true;
  });
  return (
    <OrbitControls
      ref={controls}
      enableZoom={false}
      enablePan={false}
      enableRotate={
        !portal &&
        revealed &&
        !dragging &&
        !(world === "dollhouse" && window.innerWidth < 700)
      }
      minPolarAngle={world === "dollhouse" ? 1.3 : 0.68}
      maxPolarAngle={world === "dollhouse" ? 1.43 : 1.04}
      minAzimuthAngle={-0.3}
      maxAzimuthAngle={world === "dollhouse" ? 0.35 : 0.8}
      rotateSpeed={0.3}
    />
  );
}
function Studio() {
  const { gl, scene } = useThree();
  const last = useRef(0);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const environment = new RoomEnvironment();
    const texture = pmrem.fromScene(environment, 0.05);
    scene.environment = texture.texture;
    scene.environmentIntensity = 0.35;
    environment.dispose();
    pmrem.dispose();
    return () => {
      scene.environment = null;
      texture.dispose();
    };
  }, [gl, scene]);
  useFrame(({ clock }) => {
    if (clock.elapsedTime - last.current > 1) {
      last.current = clock.elapsedTime;
      gl.domElement.dataset.renderStats = JSON.stringify({
        calls: gl.info.render.calls,
        triangles: gl.info.render.triangles,
        textures: gl.info.memory.textures,
        geometries: gl.info.memory.geometries,
      });
    }
  });
  return null;
}
function Ready({ onReady }: { onReady: () => void }) {
  useEffect(onReady, [onReady]);
  return null;
}
export default function Scene(props: SceneProps) {
  const [dragging, setDragging] = useState(false);
  const [low] = useState(
    () =>
      matchMedia("(max-width: 700px)").matches ||
      (navigator.hardwareConcurrency || 4) <= 4,
  );
  const [hidden, setHidden] = useState(document.hidden);
  useEffect(() => {
    const change = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", change);
    return () => document.removeEventListener("visibilitychange", change);
  }, []);
  const [supported] = useState(supportsWebGL);
  useEffect(() => {
    if (!supported) props.onReady();
  }, [supported, props.onReady]);
  if (!supported)
    return (
      <div className="scene-fallback">
        <span>{"{ CODED }"}</span>
        <p>
          The world is still yours to explore.
          <br />
          Use the controls below or browse programs.
        </p>
      </div>
    );
  return (
    <Canvas
      role="group"
      frameloop={hidden ? "never" : props.reduced ? "demand" : "always"}
      orthographic
      camera={{
        position: props.world === "dollhouse" ? [6, 7, 22] : [10, 10, 14],
        zoom: 60,
        near: 0.1,
        far: 100,
      }}
      dpr={low ? 1 : [1, 1.5]}
      shadows={!low}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.setClearColor("#eeeae5", 0);
      }}
      aria-label={
        props.world === "desk"
          ? "Interactive 3D developer desk"
          : "Interactive 3D CODED campus"
      }
    >
      <Studio />
      <ambientLight intensity={props.world === "desk" ? 1.5 : 0.65} />
      <hemisphereLight
        args={["#fff5e2", "#aaa0bd", props.world === "desk" ? 2 : 1.2]}
      />
      <directionalLight
        position={[-6, 12, 7]}
        intensity={props.world === "desk" ? 3 : 2.5}
        castShadow={!low}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-bias={-0.001}
      />
      <directionalLight position={[8, 5, -6]} intensity={1.5} color="#c3bbeb" />
      <Suspense fallback={null}>
        {props.world === "desk" ? (
          <DeskWorld {...props} onDragState={setDragging} />
        ) : (
          <Dollhouse {...props} />
        )}
        <Ready onReady={props.onReady} />
      </Suspense>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -3.2, 0]}
        receiveShadow
      >
        <planeGeometry args={[200, 200]} />
        <shadowMaterial transparent opacity={0.12} />
      </mesh>
      <CameraRig {...props} dragging={dragging} />
    </Canvas>
  );
}
