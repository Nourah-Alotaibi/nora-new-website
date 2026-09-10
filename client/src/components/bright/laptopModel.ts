import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import stickers from "./laptopStickers.json";

/** One hinged laptop. Exterior decals are individually configurable in laptopStickers.json. */
export function makeLaptop(wake: () => void) {
  const group = new THREE.Group(),
    lid = new THREE.Group();
  const textures: THREE.Texture[] = [];
  const metal = new THREE.MeshStandardMaterial({
    color: 0x555c69,
    metalness: 0.65,
    roughness: 0.39,
  });
  const black = new THREE.MeshStandardMaterial({
    color: 0x141923,
    roughness: 0.65,
  });
  function box(
    parent: THREE.Object3D,
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material = metal,
    r = 0.025
  ) {
    const mesh = new THREE.Mesh(
      new RoundedBoxGeometry(w, h, d, 3, Math.min(r, h / 3, d / 3)),
      mat
    );
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  box(group, 2.5, 0.09, 1.65, 0, 0.045, 0);
  box(group, 2.28, 0.016, 0.69, 0, 0.099, -0.26, black);
  const keyMat = new THREE.MeshStandardMaterial({
    color: 0x242936,
    roughness: 0.55,
  });
  for (let row = 0; row < 5; row++)
    for (let col = 0; col < 14; col++)
      box(
        group,
        0.136,
        0.018,
        0.105,
        -1.04 + col * 0.16,
        0.113,
        -0.53 + row * 0.132,
        keyMat,
        0.008
      );
  box(group, 0.72, 0.017, 0.1, 0, 0.115, 0.115, keyMat, 0.009);
  box(
    group,
    0.88,
    0.012,
    0.43,
    0,
    0.096,
    0.48,
    new THREE.MeshStandardMaterial({
      color: 0x666e7c,
      metalness: 0.45,
      roughness: 0.5,
    }),
    0.015
  );
  box(group, 0.28, 0.02, 0.025, -0.91, 0.05, 0.825, black);
  lid.position.set(0, 0.11, -0.8);
  group.add(lid);
  box(lid, 2.5, 1.64, 0.065, 0, 0.82, 0, metal, 0.025);
  box(lid, 2.38, 1.49, 0.012, 0, 0.835, 0.039, black, 0.018);
  function canvasTexture(
    draw: (c: CanvasRenderingContext2D) => void,
    w = 1600,
    h = 1000
  ) {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    draw(c.getContext("2d")!);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    textures.push(t);
    return t;
  }
  const screen = canvasTexture(c => {
    c.fillStyle = "#edf2ef";
    c.fillRect(0, 0, 1600, 1000);
    c.fillStyle = "#203b38";
    c.fillRect(0, 0, 1600, 100);
    c.fillStyle = "#fff";
    c.font = "32px sans-serif";
    c.fillText("nourah / research studio", 55, 63);
    c.font = "22px sans-serif";
    c.fillText("AI + DATA SCIENCE", 1230, 61);
    c.fillStyle = "#fff";
    c.fillRect(40, 140, 890, 805);
    c.fillRect(965, 140, 590, 380);
    c.fillRect(965, 555, 590, 390);
    c.fillStyle = "#4b726a";
    c.font = "27px sans-serif";
    c.fillText("treatment_exploration.ipynb", 70, 190);
    c.font = "25px monospace";
    [
      "# Learning from patterns",
      "import numpy as np",
      "from sklearn.model_selection import train_test_split",
      "",
      "X_train, X_test, y_train, y_test = (",
      "    train_test_split(X, y, random_state=42)",
      ")",
      "",
      "model.fit(X_train, y_train)",
      "predictions = model.predict(X_test)",
      "",
      "# Explore. Evaluate. Improve.",
    ].forEach((line, i) => c.fillText(line, 70, 265 + i * 43));
    c.font = "27px sans-serif";
    c.fillText("Model evaluation", 1000, 193);
    c.font = "20px sans-serif";
    c.fillText("Illustrative research workspace", 1000, 228);
    ["Baseline", "Model A", "Model B"].forEach((s, i) => {
      c.fillStyle = "#648d80";
      c.fillRect(1110, 270 + i * 66, 190 + i * 55, 28);
      c.fillStyle = "#334f49";
      c.fillText(s, 987, 292 + i * 66);
    });
    c.font = "27px sans-serif";
    c.fillText("Signals → insights", 1000, 607);
    c.strokeStyle = "#c5d9d0";
    c.lineWidth = 2;
    for (let i = 0; i < 5; i++) {
      c.beginPath();
      c.moveTo(1000, 665 + i * 50);
      c.lineTo(1520, 665 + i * 50);
      c.stroke();
    }
    c.strokeStyle = "#649b9c";
    c.lineWidth = 5;
    c.beginPath();
    for (let i = 0; i < 100; i++) {
      let x = 1000 + i * 5.2,
        y = 785 + Math.sin(i * 0.3) * 32 - Math.sin(i * 0.07) * 60;
      i ? c.lineTo(x, y) : c.moveTo(x, y);
    }
    c.stroke();
  });
  const panel = new THREE.Mesh(
    new THREE.PlaneGeometry(2.24, 1.32),
    new THREE.MeshBasicMaterial({ map: screen, toneMapped: false })
  );
  panel.position.set(0, 0.86, 0.047);
  lid.add(panel);
  const webcam = new THREE.Mesh(new THREE.SphereGeometry(0.012, 10, 8), black);
  webcam.position.set(0, 1.548, 0.049);
  lid.add(webcam);
  const brand = canvasTexture(
    c => {
      c.clearRect(0, 0, 800, 150);
      c.fillStyle = "#161b23";
      c.font = "bold 87px sans-serif";
      c.textAlign = "center";
      c.fillText("HUAWEI", 400, 105);
    },
    800,
    150
  );
  function decal(
    t: THREE.Texture,
    w: number,
    h: number,
    x: number,
    y: number,
    z: number,
    rotation = 0
  ) {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        map: t,
        transparent: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -1,
        toneMapped: false,
      })
    );
    m.position.set(x, y, z);
    m.rotation.set(0, Math.PI, rotation);
    lid.add(m);
    return m;
  }
  decal(brand, 0.65, 0.12, 0, 0.87, -0.034);
  const loader = new THREE.TextureLoader();
  stickers
    .filter(s => s.visible)
    .forEach(s => {
      const t = loader.load(s.texture, wake);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 4;
      textures.push(t);
      decal(
        t,
        (s.scale[0] / 800) * 2.4,
        (s.scale[1] / 560) * 1.54,
        (0.5 - s.position[0] / 800) * 2.4,
        (1 - s.position[1] / 560) * 1.54 + 0.05,
        -0.035 - s.zOffset,
        (s.rotation * Math.PI) / 180
      );
    });
  let angle = 68,
    target = 68;
  lid.rotation.x = Math.PI / 2 - (angle * Math.PI) / 180;
  return {
    group,
    reset() {
      target = 68;
    },
    setOpen(value: boolean) {
      target = value ? 108 : 0;
    },
    update(dt: number, reduced: boolean) {
      angle = reduced ? target : THREE.MathUtils.damp(angle, target, 9, dt);
      lid.rotation.x = Math.PI / 2 - (angle * Math.PI) / 180;
      return Math.abs(angle - target) > 0.03;
    },
    dispose() {
      textures.forEach(t => t.dispose());
    },
  };
}
