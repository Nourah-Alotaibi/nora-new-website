import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as T from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
function Box({
  position,
  size,
  color,
}: {
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}
const cache = new Map<string, Promise<T.Group>>();
function load(url: string) {
  if (!cache.has(url))
    cache.set(
      url,
      new GLTFLoader()
        .loadAsync(url)
        .then((g) => {
          g.scene.traverse((o: any) => {
            if (o.isMesh) {
              o.castShadow = true;
              o.receiveShadow = true;
            }
          });
          return g.scene;
        })
        .catch((e) => {
          cache.delete(url);
          throw e;
        }),
    );
  return cache.get(url)!;
}
export function Model({
  asset,
  position = [0, 0, 0],
  height = 1,
  rotation = 0,
  reduced = false,
  animate = false,
}: {
  asset: "chair" | "robot";
  position?: [number, number, number];
  height?: number;
  rotation?: number;
  reduced?: boolean;
  animate?: boolean;
}) {
  const [object, setObject] = useState<T.Group | null>(null);
  const [version, setVersion] = useState(0);
  const ref = useRef<T.Group>(null);
  const tier = matchMedia("(max-width:700px)").matches ? "mobile" : "desktop";
  useEffect(() => {
    let alive = true;
    load(new URL(`models/${asset}-${tier}.glb`, document.baseURI).href)
      .then((g) => {
        if (alive) setObject(g.clone(true));
      })
      .catch(() => {
        window.dispatchEvent(new CustomEvent("coded-asset-error"));
      });
    return () => {
      alive = false;
    };
  }, [asset, tier, version]);
  useEffect(() => {
    const retry = () => setVersion((v) => v + 1);
    window.addEventListener("coded-retry-assets", retry);
    return () => window.removeEventListener("coded-retry-assets", retry);
  }, []);
  useFrame(({ clock }) => {
    if (ref.current && animate && !reduced) {
      ref.current.position.x =
        position[0] + Math.sin(clock.elapsedTime * 0.65) * 0.23;
      ref.current.rotation.y =
        rotation + Math.sin(clock.elapsedTime * 0.65) * 0.35;
    }
  });
  return (
    <group
      ref={ref}
      position={position}
      rotation={[0, rotation, 0]}
      scale={height}
    >
      {object ? (
        <primitive object={object} />
      ) : asset === "robot" ? (
        <mesh>
          <capsuleGeometry args={[0.2, 0.4, 4, 8]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
      ) : (
        <>
          <Box
            position={[0, 0.45, 0]}
            size={[0.55, 0.1, 0.5]}
            color="#b4a0bf"
          />
          <Box
            position={[0, 0.73, -0.2]}
            size={[0.55, 0.6, 0.06]}
            color="#b4a0bf"
          />
          <Box position={[0, 0.23, 0]} size={[0.07, 0.45, 0.07]} color="#777" />
        </>
      )}
    </group>
  );
}
