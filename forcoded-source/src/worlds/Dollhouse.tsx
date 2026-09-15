import { useEffect, useMemo } from "react";
import { RoomLife } from "./CampusLife";
import { Label } from "./Objects";
import { buildCampus } from "./CampusArchitecture";
import { rooms, type RoomId, type CampusView } from "../data/rooms";
export default function Dollhouse({
  room,
  campusView,
  onRoom,
  reduced = false,
}: {
  reduced?: boolean;
  room?: RoomId;
  campusView?: CampusView;
  onRoom?: (id: RoomId) => void;
  [key: string]: unknown;
}) {
  const model = useMemo(() => buildCampus(true), []);
  useEffect(
    () => () => {
      model.traverse((o: any) => {
        o.geometry?.dispose();
        o.material?.dispose();
      });
    },
    [model],
  );
  return (
    <group position={[0, -2.7, 0]}>
      <primitive object={model} />
      {rooms.map((r) => (
        <RoomLife
          key={r.id}
          id={r.id}
          active={campusView === "building" || r.id === room}
          reduced={reduced}
        />
      ))}
      {rooms.map((r) => (
        <group key={r.id} position={[r.x, r.floor * 3.5, 0]}>
          <Label
            text={`${r.number} / ${r.name.toUpperCase()}`}
            position={[0, 2.47, -1.8]}
            width={3.85}
            height={0.3}
            color="#393944"
          />
          <mesh
            position={[0, 1.2, 0]}
            onClick={(e) => {
              e.stopPropagation();
              onRoom?.(r.id);
            }}
          >
            <boxGeometry args={[4.35, 2.4, 3.9]} />
            <meshBasicMaterial
              transparent
              opacity={room === r.id && campusView === "room" ? 0.035 : 0}
              color={r.color}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
      <Label
        text="C O D E D / A WORLD OF BUILDERS"
        position={[0, -0.24, 3.26]}
        width={10}
        height={0.22}
        color="#655d66"
      />
    </group>
  );
}
