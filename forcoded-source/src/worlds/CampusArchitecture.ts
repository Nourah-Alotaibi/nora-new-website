import * as T from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { rooms } from "../data/rooms";
export function buildCampus(detail = false) {
  const root = new T.Group(),
    buckets = new Map<string, T.BufferGeometry[]>(),
    mats = new Map<string, T.MeshStandardMaterial>();
  const add = (
    g: T.BufferGeometry,
    p: number[],
    c: string,
    rough = 0.65,
    metal = 0,
  ) => {
    g.translate(p[0], p[1], p[2]);
    const k = `${c}/${rough}/${metal}`;
    if (!buckets.has(k)) {
      buckets.set(k, []);
      mats.set(
        k,
        new T.MeshStandardMaterial({
          color: c,
          roughness: rough,
          metalness: metal,
        }),
      );
    }
    buckets.get(k)!.push(g);
  };
  const b = (
    p: number[],
    s: number[],
    c = "#e8e0d4",
    rough = 0.65,
    metal = 0,
  ) =>
    add(
      new RoundedBoxGeometry(
        s[0],
        s[1],
        s[2],
        1,
        Math.min(0.035, ...s.map((v) => v / 4)),
      ),
      p,
      c,
      rough,
      metal,
    );
  const cy = (p: number[], r: number, h: number, c: string) =>
    add(new T.CylinderGeometry(r, r, h, 12), p, c, 0.4, 0.3);
  const cream = "#e8e0d4",
    trim = "#c9bda9",
    dark = "#393944",
    wood = "#b8906f";
  b([0, -0.26, 0], [17, 0.5, 6.5]);
  b([0, -0.53, 0], [16.7, 0.06, 6.2], trim);
  for (let f = 0; f < 2; f++) {
    const y = f * 3.5;
    b([0, y - 0.08, 1.98], [14.1, 0.18, 1.15]);
    b([0, y + 0.05, 2.53], [14.1, 0.08, 0.06], trim, 0.35, 0.35);
    for (let x = -6.9; x <= 7; x += 2.3) {
      if (f) cy([x, y + 0.38, 2.48], 0.025, 0.72, dark);
      b([x, y + 1.5, -2.1], [0.12, 3.05, 0.16], trim);
    }
    if (f) b([0, y + 0.76, 2.48], [14, 0.045, 0.045], dark, 0.35, 0.5);
  }
  for (let i = 0; i < 18; i++) {
    b(
      [-7.7, ((i + 1) * 3.5) / 18 - 0.09, 2.18 - i * 0.245],
      [1.1, 0.18, 0.27],
      i % 2 ? cream : "#ded4c3",
    );
    cy([-8.2, ((i + 1) * 3.5) / 18 + 0.34, 2.18 - i * 0.245], 0.018, 0.7, trim);
  }
  b([-7.65, 3.4, -2.35], [1.2, 0.2, 1]);
  b([-7.1, 3.42, -1.96], [0.25, 0.18, 0.8]);
  for (const r of rooms) {
    const y = r.floor * 3.5;
    const rb = (
      x: number,
      yy: number,
      z: number,
      s: number[],
      c = cream,
      rough = 0.65,
      metal = 0,
    ) => b([r.x + x, y + yy, z], s, c, rough, metal);
    rb(0, 0, 0, [4.5, 0.15, 4.1], r.floor ? "#d9d0be" : "#e2d8c8");
    rb(0, 1.5, -2, [4.5, 3, 0.14]);
    rb(0, 1.6, -1.91, [4.22, 2.3, 0.035], r.color);
    rb(-2.22, 0.63, -0.32, [0.12, 1.26, 3.4]);
    rb(2.22, 0.63, -0.9, [0.12, 1.26, 2.2]);
    rb(0, 3, -1.7, [4.5, 0.12, 0.68]);
    rb(0, 2.89, -1.7, [3.5, 0.025, 0.09], "#fff1ca", 0.2);
    rb(0, 0.16, -1.86, [4.3, 0.12, 0.05], trim);
    for (let n = 0; n < 9; n++)
      rb(-2 + n * 0.5, 0.083, 0, [0.009, 0.005, 3.8], trim);
    if (!detail) continue;
    const desk = (x: number, z: number, w = 1.6) => {
      rb(x, 0.85, z, [w, 0.1, 0.78], wood, 0.45);
      for (const s of [-1, 1])
        rb(x + s * (w / 2 - 0.13), 0.43, z, [0.06, 0.78, 0.62], dark, 0.4, 0.5);
      rb(x, 0.97, z - 0.1, [0.52, 0.045, 0.35], "#96949a", 0.32, 0.6);
      rb(x, 1.24, z - 0.25, [0.58, 0.42, 0.035], dark, 0.35, 0.35);
      rb(x, 1.25, z - 0.223, [0.51, 0.34, 0.012], "#243e49", 0.35);
      for (let j = 0; j < 4; j++)
        rb(x - 0.13 + j * 0.08, 1.27, z - 0.213, [0.045, 0.01, 0.005], r.color);
      rb(x + 0.48, 0.93, z + 0.12, [0.13, 0.045, 0.2], cream, 0.3);
    };
    const shelf = (x: number) => {
      for (let n = 0; n < 3; n++) {
        rb(x, 0.55 + n * 0.5, -1.62, [0.9, 0.06, 0.35], wood);
        for (let j = 0; j < 4; j++)
          rb(
            x - 0.3 + j * 0.15,
            0.72 + n * 0.5,
            -1.63,
            [0.1, 0.3 - (j % 2) * 0.07, 0.2],
            j % 2 ? r.color : cream,
          );
      }
    };
    if (r.id === "ai") {
      desk(-1, -0.65);
      desk(1, 0.45);
      rb(0.85, 1.85, -1.77, [1.8, 0.9, 0.08], dark);
      for (let j = 0; j < 5; j++) {
        rb(
          0.13 + j * 0.34,
          1.87,
          -1.71,
          [0.22, 0.17, 0.06],
          j === 3 ? "#ce8b60" : r.color,
        );
        if (j < 4) rb(0.3 + j * 0.34, 1.87, -1.705, [0.1, 0.025, 0.025], cream);
      }
    } else if (r.id === "cyber") {
      desk(-0.7, 0.05, 2.35);
      rb(1.5, 0.94, -1.1, [0.75, 1.7, 0.7], dark, 0.36, 0.5);
      for (let j = 0; j < 7; j++) {
        rb(
          1.5,
          0.27 + j * 0.2,
          -0.735,
          [0.64, 0.14, 0.025],
          "#666771",
          0.4,
          0.6,
        );
        rb(1.7, 0.27 + j * 0.2, -0.712, [0.06, 0.025, 0.015], "#9fceb6");
      }
      rb(-0.6, 1.92, -1.78, [2.6, 0.87, 0.08], dark);
      for (let j = 0; j < 3; j++)
        rb(-1.35 + j * 0.75, 1.93, -1.72, [0.53, 0.58, 0.02], "#496d6a");
    } else if (r.id === "data") {
      desk(0.65, 0, 2.4);
      shelf(-1.6);
      rb(0.5, 1.98, -1.79, [2.55, 0.96, 0.07], "#f4eee0");
      for (let j = 0; j < 8; j++)
        rb(
          -0.5 + j * 0.27,
          1.67 + (j % 4) * 0.06,
          -1.73,
          [0.15, 0.18 + (j % 4) * 0.12, 0.025],
          j % 2 ? "#809caf" : "#a69ac1",
        );
    } else if (r.id === "youth") {
      desk(-1, -0.7);
      desk(1, 0.2);
      shelf(1.55);
      rb(-0.8, 2.04, -1.8, [2, 0.88, 0.06], "#efe5cb");
      for (let j = 0; j < 6; j++)
        rb(
          -1.5 + (j % 3) * 0.53,
          1.87 + Math.floor(j / 3) * 0.35,
          -1.75,
          [0.38, 0.25, 0.015],
          j % 2 ? "#b2bfd1" : "#c4b0c8",
        );
    } else if (r.id === "academy") {
      rb(0, 0.82, 0.3, [2.15, 0.12, 1.15], wood, 0.42);
      for (const x of [-0.8, 0.8])
        for (const z of [-0.1, 0.65])
          rb(x, 0.43, z, [0.06, 0.72, 0.06], dark, 0.3, 0.4);
      rb(0.9, 0.17, -0.85, [1.8, 0.25, 1.3], r.color);
      rb(0.65, 1.78, -1.8, [2.1, 1.17, 0.06]);
      rb(-1.62, 1.65, -1.75, [0.64, 1.35, 0.06], "#d1b674");
      for (let j = 0; j < 3; j++)
        rb(
          -0.6 + j * 0.5,
          0.9,
          0.3,
          [0.3, 0.025, 0.35],
          j % 2 ? cream : r.color,
        );
    } else {
      desk(-1, -0.8, 1.6);
      rb(0.85, 0.55, 0.32, [1.85, 0.12, 1.32], wood);
      for (const x of [0.15, 1.5])
        for (const z of [-0.12, 0.7]) rb(x, 0.28, z, [0.08, 0.48, 0.08]);
      rb(0.85, 0.619, 0.32, [1.65, 0.015, 1.15], "#dce0cc");
      for (let j = 0; j < 5; j++)
        rb(
          0.2 + j * 0.3,
          0.633,
          0.25,
          [0.16, 0.015, 0.13],
          j % 2 ? "#788b6b" : "#ddd0a4",
        );
      shelf(1.6);
      for (let j = 0; j < 3; j++)
        rb(
          -0.9 + j * 0.58,
          2.15,
          -1.75,
          [0.4, 0.52, 0.04],
          ["#c4b0c8", "#9bbcb5", "#d7c786"][j],
        );
    }
    rb(1.8, 0.32, 1.05, [0.48, 0.52, 0.65], r.color, 0.9);
    cy([r.x - 1.85, y + 0.26, 1.13], 0.16, 0.35, "#ac7e61");
    for (let i = 0; i < 5; i++) {
      const g = new T.SphereGeometry(0.14, 8, 6);
      g.scale(0.55, 1.65, 0.8);
      add(
        g,
        [
          r.x - 1.85 + Math.sin(i * 2) * 0.13,
          y + 0.55 + (i % 2) * 0.15,
          1.13 + Math.cos(i * 2) * 0.12,
        ],
        "#728565",
      );
    }
  }
  b([-7.65, 0.58, -1.65], [0.85, 1, 0.55], wood);
  b([-7.65, 1.11, -1.65], [0.98, 0.07, 0.64]);
  for (const [k, gs] of buckets) {
    const flat = gs.map((g) => (g.index ? g.toNonIndexed() : g));
    const mesh = new T.Mesh(mergeGeometries(flat, false)!, mats.get(k));
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    new Set([...gs, ...flat]).forEach((g) => g.dispose());
  }
  root.name = "CODED original six-room architecture";
  return root;
}
