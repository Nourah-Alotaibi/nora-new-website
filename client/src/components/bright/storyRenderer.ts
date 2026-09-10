import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export function mountStory(host: HTMLDivElement, chapter: number) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene(),
    world = new THREE.Group();
  scene.add(world);
  const camera = new THREE.OrthographicCamera(-3.8, 3.8, 3.2, -3.2, 0.1, 40);
  camera.position.set(7, 6.2, 9);
  camera.lookAt(0, 0.9, 0);
  scene.add(new THREE.HemisphereLight(0xfffaee, 0xa2a691, 1.3));
  const sun = new THREE.DirectionalLight(0xfff0d7, 2.5);
  sun.position.set(-3, 7, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  sun.shadow.camera.left = -5;
  sun.shadow.camera.right = 5;
  sun.shadow.camera.top = 5;
  sun.shadow.camera.bottom = -5;
  sun.shadow.normalBias = 0.03;
  scene.add(sun);
  const mats = new Map<number, THREE.MeshStandardMaterial>();
  const textures: THREE.Texture[] = [];
  const sage = 0x839b70,
    cream = 0xe9debf,
    peach = 0xc89676,
    lilac = 0x9993bb,
    ink = 0x4c6050,
    butter = 0xd5b760;
  function mat(c: number) {
    if (!mats.has(c))
      mats.set(
        c,
        new THREE.MeshStandardMaterial({ color: c, roughness: 0.68 })
      );
    return mats.get(c)!;
  }
  function mesh(
    g: THREE.BufferGeometry,
    c: number,
    x: number,
    y: number,
    z: number,
    parent: THREE.Object3D = world
  ) {
    const m = new THREE.Mesh(g, mat(c));
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  }
  function box(
    w: number,
    h: number,
    d: number,
    c: number,
    x: number,
    y: number,
    z: number,
    p: THREE.Object3D = world
  ) {
    return mesh(new RoundedBoxGeometry(w, h, d, 2, 0.04), c, x, y, z, p);
  }
  function ball(
    r: number,
    c: number,
    x: number,
    y: number,
    z: number,
    p: THREE.Object3D = world
  ) {
    return mesh(new THREE.SphereGeometry(r, 20, 16), c, x, y, z, p);
  }
  function cyl(
    r: number,
    h: number,
    c: number,
    x: number,
    y: number,
    z: number,
    p: THREE.Object3D = world
  ) {
    return mesh(new THREE.CylinderGeometry(r, r, h, 32), c, x, y, z, p);
  }
  function label(
    text: string,
    w: number,
    h: number,
    x: number,
    y: number,
    z: number,
    p: THREE.Object3D = world
  ) {
    const canvas = document.createElement("canvas");
    // Match the actual sign proportions so letters are not stretched or crushed.
    canvas.width = 1536;
    canvas.height = Math.max(160, Math.round(1536 * h / w));
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#fcf7e8";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.fillStyle = "#253a2e";
    c.textAlign = "center";
    c.textBaseline = "middle";
    let size = Math.floor(canvas.height * .7);
    c.font = `600 ${size}px Arial, sans-serif`;
    while(c.measureText(text).width > canvas.width * .92 && size > 16) {
      size -= 2;
      c.font = `600 ${size}px Arial, sans-serif`;
    }
    c.fillText(text, canvas.width / 2, canvas.height / 2 + size * .035);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures.push(t);
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({ map: t, toneMapped: false })
    );
    m.position.set(x, y, z);
    p.add(m);
  }
  function book(x: number, z: number, c: number, y = 0.18) {
    box(0.95, 0.18, 0.7, c, x, y, z);
    box(0.85, 0.085, 0.69, cream, x, y + 0.025, z + 0.015);
  }
  function person(x: number, z: number, c: number) {
    cyl(0.16, 0.43, c, x, 0.38, z);
    ball(0.17, cream, x, 0.77, z);
  }
  function building(x: number, z: number, h: number, title: string, c = sage, roof = cream, windows = lilac, door = ink) {
    box(1.6, h, 1.05, c, x, h / 2 + 0.12, z);
    box(1.85, 0.16, 1.25, roof, x, h + 0.16, z);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 2; j++)
        box(
          0.22,
          0.28,
          0.035,
          windows,
          x - 0.5 + i * 0.5,
          0.54 + j * 0.49,
          z + 0.54
        );
    box(0.29, 0.55, 0.045, door, x, 0.4, z + 0.56);
    label(title, 1.4, 0.3, x, h - 0.12, z + 0.57);
  }
  function robot(x: number, z: number, scale = 1) {
    const g = new THREE.Group();
    g.position.set(x, 0.12, z);
    g.scale.setScalar(scale);
    world.add(g);
    box(0.85, 0.66, 0.52, sage, 0, 0.76, 0, g);
    box(0.7, 0.4, 0.04, ink, 0, 0.8, 0.28, g);
    ball(0.075, cream, -0.18, 0.83, 0.32, g);
    ball(0.075, cream, 0.18, 0.83, 0.32, g);
    box(0.57, 0.42, 0.4, lilac, 0, 0.2, 0, g);
    cyl(0.025, 0.25, butter, 0, 1.19, 0, g);
    ball(0.08, peach, 0, 1.35, 0, g);
    return g;
  }
  function smileBot(x: number, y: number, z: number, scale = 1) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.scale.setScalar(scale);
    world.add(g);
    const body = ball(0.3, 0xeef2ee, 0, 0.32, 0, g);
    body.scale.set(1, 0.9, 0.8);
    const head = ball(0.38, 0xf4f4ee, 0, 0.82, 0, g);
    head.scale.set(1.05, 0.86, 0.85);
    const face = ball(0.3, 0xb3dce8, 0, 0.82, 0.22, g);
    face.scale.set(1, 0.73, 0.34);
    for (const side of [-1, 1]) {
      const eye = ball(0.045, 0x385d70, side * 0.12, 0.87, 0.324, g);
      eye.scale.y = 1.2;
      const arm = ball(0.1, 0xc6e4ee, side * 0.34, 0.34, 0, g);
      arm.scale.y = 1.65;
      arm.rotation.z = side * 0.25;
      ball(0.075, 0xb3dce8, side * 0.14, 0.09, 0.14, g);
    }
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.105, 0.77, 0.329),
      new THREE.Vector3(0, 0.72, 0.343),
      new THREE.Vector3(0.105, 0.77, 0.329),
    ]);
    mesh(
      new THREE.TubeGeometry(curve, 16, 0.017, 6, false),
      0x385d70,
      0,
      0,
      0,
      g
    );
    return g;
  }
  function computer(x: number, z: number, y = 0.68, scale = 1) {
    const g = new THREE.Group();
    g.position.set(x, y, z);
    g.scale.setScalar(scale);
    world.add(g);
    box(0.82, 0.57, 0.09, 0xc8dfdf, 0, 0.43, -0.13, g);
    box(0.09, 0.2, 0.09, 0xa0b8bc, 0, 0.09, -0.13, g);
    box(0.38, 0.04, 0.24, 0xc8dfdf, 0, 0.02, -0.08, g);
    box(0.58, 0.04, 0.21, cream, 0, 0.025, 0.22, g);
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 320;
    const c = canvas.getContext("2d")!;
    c.fillStyle = "#263f47";
    c.fillRect(0, 0, 512, 320);
    c.font = "bold 30px monospace";
    const lines = [
      "def build():",
      "  idea = learn()",
      "  for step in ideas:",
      "    build(step)",
      '  return "hello!"',
    ];
    lines.forEach((line, i) => {
      c.fillStyle = ["#bddb99", "#b8deee", "#f0cea0", "#c9b6df", "#b8deee"][i];
      c.fillText(line, 22, 52 + i * 50);
    });
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures.push(t);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.72, 0.46),
      new THREE.MeshBasicMaterial({ map: t, toneMapped: false })
    );
    screen.position.set(0, 0.44, -0.077);
    g.add(screen);
    return g;
  }
  function table(x: number, z: number, w = 1.05, d = 0.72) {
    box(w, 0.1, d, cream, x, 0.62, z);
    for (const dx of [-w * 0.4, w * 0.4])
      for (const dz of [-d * 0.36, d * 0.36])
        box(0.06, 0.48, 0.06, peach, x + dx, 0.33, z + dz);
  }
  function securityShield() {
    const sh = new THREE.Shape();
    sh.moveTo(0, 2);
    sh.quadraticCurveTo(0.5, 1.78, 0.92, 1.72);
    sh.lineTo(0.86, 0.9);
    sh.quadraticCurveTo(0.65, 0.35, 0, 0.08);
    sh.quadraticCurveTo(-0.65, 0.35, -0.86, 0.9);
    sh.lineTo(-0.92, 1.72);
    sh.quadraticCurveTo(-0.5, 1.78, 0, 2);
    const outer = mesh(
      new THREE.ExtrudeGeometry(sh, {
        depth: 0.18,
        bevelEnabled: true,
        bevelSize: 0.045,
        bevelThickness: 0.04,
        bevelSegments: 3,
        steps: 1,
      }),
      0x9caeae,
      -0.6,
      0.17,
      -0.25
    );
    const inset = mesh(
      new THREE.ExtrudeGeometry(sh, {
        depth: 0.035,
        bevelEnabled: true,
        bevelSize: 0.025,
        bevelThickness: 0.02,
        bevelSegments: 3,
        steps: 1,
      }),
      0x718e85,
      -0.6,
      0.29,
      -0.015
    );
    inset.scale.set(0.82, 0.82, 1);
    mat(0x9caeae).metalness = 0.4;
    mat(0x9caeae).roughness = 0.38;
    for (const [x, y] of [
      [-0.72, 1.62],
      [0.72, 1.62],
      [-0.66, 0.99],
      [0.66, 0.99],
      [0, 0.36],
    ])
      ball(0.035, 0xd4d9c9, -0.6 + x, 0.17 + y, 0.01);

    box(0.47, 0.35, 0.1, cream, -0.6, 1.35, 0.085);
    const hoop = mesh(
      new THREE.TorusGeometry(0.17, 0.043, 10, 32, Math.PI),
      cream,
      -0.6,
      1.54,
      0.085
    );
    ball(0.037, ink, -0.6, 1.37, 0.151);
    box(0.025, 0.07, 0.02, ink, -0.6, 1.32, 0.15);
    // Raised rounded strokes form actual 3D letters on the shield.
    const glyphs: Record<string, number[][][]> = {
      S: [
        [
          [4, 6],
          [0, 6],
          [0, 3],
          [4, 3],
          [4, 0],
          [0, 0],
        ],
      ],
      E: [
        [
          [4, 6],
          [0, 6],
          [0, 0],
          [4, 0],
        ],
        [
          [0, 3],
          [3, 3],
        ],
      ],
      C: [
        [
          [4, 6],
          [0, 6],
          [0, 0],
          [4, 0],
        ],
      ],
      U: [
        [
          [0, 6],
          [0, 0],
          [4, 0],
          [4, 6],
        ],
      ],
      R: [
        [
          [0, 0],
          [0, 6],
          [4, 6],
          [4, 3],
          [0, 3],
        ],
        [
          [2, 3],
          [4, 0],
        ],
      ],
      I: [
        [
          [0, 6],
          [4, 6],
        ],
        [
          [2, 6],
          [2, 0],
        ],
        [
          [0, 0],
          [4, 0],
        ],
      ],
      T: [
        [
          [0, 6],
          [4, 6],
        ],
        [
          [2, 6],
          [2, 0],
        ],
      ],
      Y: [
        [
          [0, 6],
          [2, 3],
          [4, 6],
        ],
        [
          [2, 3],
          [2, 0],
        ],
      ],
    };
    "SECURITY".split("").forEach((ch, i) => {
      for (const path of glyphs[ch])
        for (let j = 1; j < path.length; j++) {
          const a = path[j - 1],
            b = path[j];
          rod(
            new THREE.Vector3(
              -1.23 + i * 0.165 + a[0] * 0.027,
              0.87 + a[1] * 0.043,
              0.09
            ),
            new THREE.Vector3(
              -1.23 + i * 0.165 + b[0] * 0.027,
              0.87 + b[1] * 0.043,
              0.09
            ),
            cream,
            0.016
          );
        }
    });
  }
  function board(x: number, z: number, text: string) {
    box(1.65, 0.95, 0.13, sage, x, 1.25, z);
    label(text, 1.4, 0.65, x, 1.25, z + 0.075);
    for (const dx of [-0.6, 0.6]) box(0.08, 1.35, 0.1, peach, x + dx, 0.69, z);
  }
  function eveRobot(x: number, z: number) {
    const g = new THREE.Group();
    g.position.set(x, 0.2, z);
    g.rotation.z = -0.09;
    world.add(g);
    const shell = 0xf2f0e3;
    const body = ball(0.38, shell, 0, 0.49, 0, g);
    body.scale.set(0.88, 1.28, 0.72);
    const head = ball(0.4, shell, 0, 1.06, 0.015, g);
    head.scale.set(1.12, 0.78, 0.78);
    const face = ball(0.32, 0x172a32, 0, 1.07, 0.22, g);
    face.scale.set(1.12, 0.64, 0.38);
    for (const side of [-1, 1]) {
      const eye = ball(0.075, 0x63d8ed, side * 0.145, 1.085, 0.335, g);
      eye.scale.set(1.15, 0.58, 0.3);
      eye.rotation.z = side * -0.17;
      const eyeMaterial = mat(0x63d8ed);
      eyeMaterial.emissive.setHex(0x31b5d7);
      eyeMaterial.emissiveIntensity = 0.65;
      const arm = ball(0.14, shell, side * 0.44, 0.58, 0.015, g);
      arm.scale.set(0.58, 2.05, 0.7);
      arm.rotation.z = side * 0.28;
    }
    const leaf = ball(0.055, sage, 0, 0.6, 0.28, g);
    leaf.scale.set(0.65, 1.3, 0.18);
    leaf.rotation.z = -0.4;
  }
  function rod(a: THREE.Vector3, b: THREE.Vector3, c: number, r = 0.025) {
    const m = cyl(r, a.distanceTo(b), c, 0, 0, 0);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      b.clone().sub(a).normalize()
    );
  }
  function plaque(text: string, x = 0, z = 1.37) {
    box(1.85, 0.28, 0.1, cream, x, 0.27, z);
    label(text, 1.7, 0.21, x, 0.28, z + 0.06);
  }
  function featuredPlaque(title: string, subtitle: string) {
    box(2.45, .52, .12, 0xf8f7ef, 0, .37, 1.37);
    label(title, 2.27, .27, 0, .48, 1.44);
    label(subtitle, 2.27, .15, 0, .255, 1.44);
  }
  function googleG() {
    const group = new THREE.Group();
    group.position.set(-0.3, 1.15, -0.3);
    world.add(group);
    const arcs = [
      [45, 135, 0xea665b],
      [135, 200, 0xe8bc46],
      [200, 270, 0x5d9a72],
      [270, 360, 0x5684c8],
    ];
    for (const [from, to, c] of arcs) {
      const arc = mesh(
        new THREE.TorusGeometry(
          0.63,
          0.145,
          16,
          48,
          ((to - from) * Math.PI) / 180
        ),
        c,
        0,
        0,
        0,
        group
      );
      arc.rotation.z = (from * Math.PI) / 180;
    }
    box(0.67, 0.26, 0.29, 0x5684c8, 0.36, 0, 0, group);
    box(0.27, 0.28, 0.29, 0x5684c8, 0.63, -0.13, 0, group);
  }
  // A small raised base makes each chapter a collectible scene.
  box(4.7, 0.18, 3.1, cream, 0, 0, 0);
  switch (chapter) {
    case 0: {
      building(-0.7, -0.35, 1.8, "AUM", 0xfafaf5, 0xffffff, 0x8e959a, 0xd0d3d3);
      for (let i = 0; i < 3; i++)
        box(
          1.8 - i * 0.2,
          0.06,
          0.2,
          cream,
          -0.7,
          0.13 + i * 0.06,
          0.35 + i * 0.14
        );
      box(2.55, .38, .12, 0xf8f7ef, 0, .32, 1.37);
      label("MECHANICAL ENGINEERING", 2.42, .29, 0, .33, 1.44);
      const gear = new THREE.Group();
      world.add(gear);
      gear.position.set(1.15, 0.63, 0.6);
      gear.rotation.x = 0.18;
      const ring = mesh(
        new THREE.TorusGeometry(0.43, 0.13, 12, 32),
        butter,
        0,
        0,
        0,
        gear
      );
      for (let i = 0; i < 10; i++) {
        const a = (i * Math.PI) / 5;
        const tooth = box(
          0.18,
          0.2,
          0.18,
          butter,
          Math.cos(a) * 0.52,
          Math.sin(a) * 0.52,
          0,
          gear
        );
        tooth.rotation.z = a;
      }
      box(1.4, 0.05, 0.2, peach, 0.6, 0.14, 1.1).rotation.y = -0.2;
      break;
    }
    case 1: {
      box(1.7, 0.12, 1.1, 0xb0d5e8, -0.55, 0.18, 0.3);
      box(1.6, 1.15, 0.14, 0xa3ccdf, -0.55, 0.82, -0.17);
      const hello = document.createElement("canvas");
      hello.width = 800;
      hello.height = 480;
      const ctx = hello.getContext("2d")!;
      ctx.fillStyle = "#dcedf6";
      ctx.fillRect(0, 0, 800, 480);
      ctx.fillStyle = "#abcddd";
      ctx.fillRect(0, 0, 800, 52);
      ctx.fillStyle = "#416779";
      ctx.font = "25px monospace";
      ctx.fillText("hello.py", 25, 35);
      ctx.font = "bold 43px monospace";
      ctx.fillText("print('Hello world!')", 30, 207);
      ctx.fillStyle = "#567e90";
      ctx.font = "32px monospace";
      ctx.fillText("Hello world!", 30, 292);
      const helloTexture = new THREE.CanvasTexture(hello);
      helloTexture.colorSpace = THREE.SRGBColorSpace;
      helloTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textures.push(helloTexture);
      const helloScreen = new THREE.Mesh(
        new THREE.PlaneGeometry(1.4, 0.94),
        new THREE.MeshBasicMaterial({ map: helloTexture })
      );
      helloScreen.position.set(-0.55, 0.82, -0.092);
      world.add(helloScreen);
      for (let row = 0; row < 3; row++)
        for (let k = 0; k < 8; k++)
          box(
            0.12,
            0.025,
            0.09,
            0xd0e7f2,
            -1.1 + k * 0.15,
            0.26,
            0.15 + row * 0.12
          );
      plaque("CODED · FIRST WEBSITE");
      box(0.5, 0.035, 0.3, 0x8ebbd2, -0.55, 0.27, 0.5);
      cyl(0.21, 0.32, cream, 1.1, 0.3, 0.8);
      const handle = mesh(
        new THREE.TorusGeometry(0.15, 0.035, 8, 20),
        cream,
        1.32,
        0.32,
        0.8
      );
      handle.rotation.y = Math.PI / 2;
      for (const [x, y, r, color] of [
        [1.1, 1.45, 0.3, butter],
        [1.65, 1.83, 0.16, 0xb1d6e8],
        [0.64, 1.91, 0.13, cream],
      ]) {
        const star = new THREE.Shape();
        for (let i = 0; i < 10; i++) {
          const a = Math.PI / 2 + (i * Math.PI) / 5,
            radius = i % 2 ? r * 0.44 : r;
          const sx = Math.cos(a) * radius,
            sy = Math.sin(a) * radius;
          if (i === 0) star.moveTo(sx, sy);
          else star.lineTo(sx, sy);
        }
        star.closePath();
        const sparkle = mesh(
          new THREE.ExtrudeGeometry(star, {
            depth: 0.07,
            bevelEnabled: true,
            bevelSize: 0.018,
            bevelThickness: 0.018,
            bevelSegments: 3,
            steps: 1,
          }),
          color,
          x,
          y,
          -0.35
        );
        sparkle.rotation.z = (x - 1) * 0.3;
      }
      book(-1.35, 1, lilac);
      break;
    }
    case 2: {
      // Mechanical engineering → computer engineering, told with three objects.
      const engine = new THREE.Group();
      world.add(engine);
      engine.position.set(-1.4, 0.15, 0);
      box(1.02, 0.67, 0.78, 0x9eaead, 0, 0.55, 0, engine);
      box(0.93, 0.2, 0.72, ink, 0, 0.17, 0, engine);
      for (const side of [-1, 1]) {
        const bank = box(
          0.36,
          0.4,
          0.76,
          0xb8c5bc,
          side * 0.3,
          0.97,
          0,
          engine
        );
        bank.rotation.z = side * -0.3;
        for (let i = 0; i < 3; i++) {
          const cap = cyl(
            0.095,
            0.13,
            cream,
            side * 0.36,
            1.19,
            -0.24 + i * 0.24,
            engine
          );
          cap.rotation.z = side * -0.3;
          box(
            0.35,
            0.045,
            0.05,
            0x718481,
            side * 0.48,
            0.48 + i * 0.13,
            0.415,
            engine
          );
        }
      }
      const flywheel = mesh(
        new THREE.TorusGeometry(0.27, 0.075, 12, 32),
        butter,
        0,
        0.55,
        0.46,
        engine
      );
      const hub = cyl(0.095, 0.14, ink, 0, 0.55, 0.46, engine);
      hub.rotation.x = Math.PI / 2;
      for (let i = 0; i < 4; i++) {
        const spoke = box(0.47, 0.035, 0.05, cream, 0, 0.55, 0.46, engine);
        spoke.rotation.z = (i * Math.PI) / 4;
      }
      const exhaust = mesh(
        new THREE.CylinderGeometry(0.075, 0.075, 0.55, 16),
        0x718481,
        -0.66,
        0.65,
        0,
        engine
      );
      exhaust.rotation.z = Math.PI / 2;
      const arrow = new THREE.Shape();
      arrow.moveTo(-0.36, -0.09);
      arrow.lineTo(0.07, -0.09);
      arrow.lineTo(0.07, -0.23);
      arrow.lineTo(0.39, 0);
      arrow.lineTo(0.07, 0.23);
      arrow.lineTo(0.07, 0.09);
      arrow.lineTo(-0.36, 0.09);
      arrow.closePath();
      const transitionArrow = mesh(
        new THREE.ExtrudeGeometry(arrow, {
          depth: 0.09,
          bevelEnabled: true,
          bevelSize: 0.02,
          bevelThickness: 0.02,
          bevelSegments: 3,
          steps: 1,
        }),
        butter,
        0,
        0.85,
        0.25
      );
      transitionArrow.scale.set(1.7, 1.15, 1);
      computer(1.37, 0.05, 0.2, 1.45);
      box(0.43, 0.89, 0.64, 0xa0b5ac, 2.03, 0.57, -0.38);
      box(0.3, 0.025, 0.02, ink, 2.03, 0.82, -0.05);
      ball(0.025, butter, 2.03, 0.71, -0.045);
      break;
    }
    case 3: {
      plaque("CODED · MENTOR");
      board(-0.3, -0.65, "CODED");
      // The mentor stands beside the board and gestures toward the lesson.
      const teacherX = -1.55,
        teacherZ = -0.38;
      for (const side of [-1, 1]) {
        cyl(0.065, 0.34, ink, teacherX + side * 0.085, 0.3, teacherZ);
        box(
          0.14,
          0.07,
          0.22,
          ink,
          teacherX + side * 0.085,
          0.14,
          teacherZ + 0.04
        );
      }
      const coat = mesh(
        new THREE.CylinderGeometry(0.15, 0.22, 0.53, 24),
        lilac,
        teacherX,
        0.68,
        teacherZ
      );
      ball(0.195, ink, teacherX, 1.13, teacherZ - 0.025);
      const face = ball(0.163, 0xd7b795, teacherX, 1.13, teacherZ + 0.065);
      face.scale.set(0.91, 1, 0.82);
      for (const side of [-1, 1])
        ball(0.018, ink, teacherX + side * 0.057, 1.15, teacherZ + 0.194);
      rod(
        new THREE.Vector3(teacherX - 0.14, 0.88, teacherZ),
        new THREE.Vector3(teacherX - 0.23, 0.62, teacherZ + 0.06),
        lilac,
        0.065
      );
      ball(0.063, 0xd7b795, teacherX - 0.23, 0.59, teacherZ + 0.06);
      rod(
        new THREE.Vector3(teacherX + 0.14, 0.88, teacherZ),
        new THREE.Vector3(-1.17, 1.02, -0.42),
        lilac,
        0.065
      );
      rod(
        new THREE.Vector3(-1.17, 1.02, -0.42),
        new THREE.Vector3(-0.98, 1.2, -0.49),
        lilac,
        0.055
      );
      ball(0.062, 0xd7b795, -0.98, 1.2, -0.49);
      rod(
        new THREE.Vector3(-0.96, 1.22, -0.5),
        new THREE.Vector3(-0.72, 1.46, -0.55),
        butter,
        0.018
      );
      for (const x of [-1, 0.65]) {
        box(0.55, 0.5, 0.12, lilac, x, 0.52, 0.7);
        box(0.55, 0.12, 0.5, peach, x, 0.32, 0.9);
        person(x, 1.1, sage);
      }
      book(1.45, -0.25, butter);
      book(1.45, -0.25, lilac, 0.36);
      break;
    }
    case 4: {
      googleG();
      person(-1.35, 0.75, peach);
      person(0, 1, lilac);
      person(1.35, 0.65, butter);
      box(0.6, 0.7, 0.5, sage, 1.35, 0.45, -0.65);
      label("</>", 0.47, 0.27, 1.35, 0.55, -0.39);
      plaque("GOOGLE · GDSC");
      break;
    }
    case 5: {
      box(0.62, 2.1, 0.65, peach, -1.2, 1.15, -0.55);
      mesh(
        new THREE.ConeGeometry(0.53, 0.42, 4),
        cream,
        -1.2,
        2.4,
        -0.55
      ).rotation.y = Math.PI / 4;
      label("UC", .55, .19, -1.2, 1.77, -.21);
      label("BERKELEY", .64, .17, -1.2, 1.58, -.21);
      const clock = mesh(
        new THREE.CircleGeometry(0.18, 32),
        cream,
        -1.2,
        2,
        -0.215
      );
      box(0.018, 0.14, 0.02, ink, -1.2, 2.04, -0.2);
      box(0.12, 0.018, 0.02, ink, -1.15, 2, -0.2);
      plaque("INTERNATIONAL");
      eveRobot(-0.45, 0.55);
      const award = (x:number,z:number,scale:number,title:string,color:number) => {
        const g=new THREE.Group();world.add(g);g.position.set(x,.1,z);g.scale.setScalar(scale);
        box(.72,.27,.55,ink,0,.16,0,g);
        if(title) label(title,.66,.2,0,.17,.285,g);
        cyl(.055,.43,color,0,.5,0,g);
        mesh(new THREE.CylinderGeometry(.31,.1,.38,32),color,0,.87,0,g);
        for(const dx of [-.29,.29])mesh(new THREE.TorusGeometry(.18,.04,8,24),color,dx,.89,0,g);
      }
      award(.8,-.48,1.05,"1st place",0xd7b95e);
      award(1.55,.48,.76,"2nd place",0xbfcbd1);
      award(1.78,-.68,.53,"",0xb65350);
      // Medal and ribbon resting flat on the front-left of the board.
      const medalGroup=new THREE.Group();world.add(medalGroup);
      medalGroup.position.set(-1.22,.16,1.04);medalGroup.rotation.x=-Math.PI/2;medalGroup.rotation.z=-.25;
      const ribbonL=box(.12,.48,.035,0x8a9ec0,-.085,.33,0,medalGroup);ribbonL.rotation.z=.25;
      const ribbonR=box(.12,.48,.035,0xb987a1,.085,.33,0,medalGroup);ribbonR.rotation.z=-.25;
      const medal=cyl(.21,.06,0xd7b95e,0,0,0,medalGroup);medal.rotation.x=Math.PI/2;
      mesh(new THREE.TorusGeometry(.18,.014,8,32),0xf2d786,0,0,.037,medalGroup);
      label("1",.14,.14,0,0,.04,medalGroup);
      // A small wearable camera pin, with a clip and a glassy inset lens.
      const pin=new THREE.Group();world.add(pin);pin.position.set(.65,.16,1.05);pin.rotation.y=-.12;
      box(.48,.13,.19,0x777c77,0,.06,-.04,pin);
      box(.43,.55,.14,0x252a2d,0,.32,0,pin);
      mesh(new THREE.CircleGeometry(.115,32),0x10191f,0,.43,.078,pin);
      mesh(new THREE.TorusGeometry(.115,.02,8,32),0x687d88,0,.43,.084,pin);
      ball(.04,0x93c4ce,-.027,.46,.089,pin);
      ball(.016,0xaac892,.14,.52,.085,pin);
      label("EVA AI",.32,.09,0,.17,.08,pin);

      break;
    }
    case 6: {
      plaque("CYBERSECURITY · CTF");
      securityShield();
      // An open laptop with a locally drawn Linux terminal.
      const laptop = new THREE.Group();
      world.add(laptop);
      laptop.position.set(1.08, 0.17, 0.55);
      laptop.rotation.y = -0.12;
      box(1.38, 0.1, 0.95, 0xa9bdba, 0, 0.04, 0, laptop);
      box(1.38, 0.92, 0.09, 0x839b98, 0, 0.52, -0.4, laptop);
      for (let r = 0; r < 3; r++)
        for (let k = 0; k < 10; k++)
          box(
            0.09,
            0.018,
            0.08,
            cream,
            -0.52 + k * 0.115,
            0.105,
            -0.15 + r * 0.11,
            laptop
          );
      box(0.34, 0.014, 0.17, 0xd3dfd4, 0, 0.105, 0.29, laptop);
      const terminal = document.createElement("canvas");
      terminal.width = 768;
      terminal.height = 480;
      const c = terminal.getContext("2d")!;
      c.fillStyle = "#152820";
      c.fillRect(0, 0, 768, 480);
      c.fillStyle = "#9adfa3";
      c.font = "bold 37px monospace";
      [
        "$ nourah@linux:~",
        "$ whoami",
        "nourah",
        "$ ./learn-security.sh",
        "[ok] curiosity enabled",
        "[ok] CTF lab ready",
        "$_",
      ].forEach((line, i) => c.fillText(line, 25, 57 + i * 58));
      const tex = new THREE.CanvasTexture(terminal);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textures.push(tex);
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(1.23, 0.78),
        new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
      );
      screen.position.set(0, 0.53, -0.348);
      laptop.add(screen);
      break;
    }
    case 7: {
      featuredPlaque("EPICARE", "AI FOR HEALTHCARE");
      cyl(0.65, 0.13, 0xaac4be, -1, 0.23, -0.12);
      cyl(0.4, 0.07, cream, -1, 0.33, -0.12);
      const brain = new THREE.Group();
      brain.position.set(-1, 1.12, -0.12);
      world.add(brain);
      for (const side of [-1, 1]) {
        const half = ball(0.4, 0xc89ba5, side * 0.22, 0, 0, brain);
        half.scale.set(0.76, 1, 0.94);
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          const lobe = ball(
            0.155,
            i % 3 === 0 ? 0xd8afb6 : 0xc99da9,
            side * (0.22 + Math.cos(a) * 0.11),
            Math.sin(a) * 0.3,
            Math.cos(a) * 0.24,
            brain
          );
          lobe.scale.set(0.85, 1, 0.9);
        }
        for (let i = 0; i < 3; i++) {
          const pts = Array.from({ length: 18 }, (_, j) => {
            const t = j / 17;
            return new THREE.Vector3(
              side * (0.11 + i * 0.09 + Math.sin(t * 10 + i) * 0.035),
              -0.23 + t * 0.47,
              0.31 + Math.sin(t * Math.PI) * 0.025
            );
          });
          mesh(
            new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3(pts),
              30,
              0.012,
              5,
              false
            ),
            0xa97c8d,
            0,
            0,
            0,
            brain
          );
        }
      }
      for (let i = 0; i < 4; i++) {
        const x = -1.28 + i * 0.18;
        const path = new THREE.CatmullRomCurve3([
          new THREE.Vector3(x, 0.91, 0.03),
          new THREE.Vector3(x, 0.55, 0.2),
          new THREE.Vector3(x + 0.22, 0.24, 0.5),
          new THREE.Vector3(0.65, 0.25, -0.4 + i * 0.13),
        ]);
        mesh(
          new THREE.TubeGeometry(path, 32, 0.017, 6, false),
          [0x9faebf, 0x789c87, 0xb6a0bb, 0xc6b473][i],
          0,
          0,
          0
        );
        ball(0.045, cream, x, 0.91, 0.03);
      }
      box(1.95, 0.14, 1.08, 0xa9beb3, 0.75, 0.24, -0.55);
      box(0.16, 0.45, 0.15, peach, 0.75, 0.52, -0.7);
      box(1.95, 1.32, 0.13, 0x9cb7af, 0.75, 1.32, -0.7);
      const dashboard = document.createElement("canvas");
      dashboard.width = 1100;
      dashboard.height = 740;
      const c = dashboard.getContext("2d")!;
      c.fillStyle = "#f5f3e7";
      c.fillRect(0, 0, 1100, 740);
      c.fillStyle = "#37594d";
      c.font = "bold 64px sans-serif";
      c.fillText("EpiCare", 45, 86);
      c.font = "28px sans-serif";
      c.fillText("EPILEPSY · RESEARCH DASHBOARD", 45, 137);
      c.fillStyle = "#e1e9dc";
      c.fillRect(35, 170, 1030, 218);
      c.fillStyle = "#4e6d5b";
      c.font = "bold 28px sans-serif";
      c.fillText("EEG / brain activity", 58, 208);
      c.strokeStyle = "#8a9b87";
      c.lineWidth = 1;
      for (let i = 0; i < 8; i++) {
        c.beginPath();
        c.moveTo(50, 232 + i * 18);
        c.lineTo(1045, 232 + i * 18);
        c.stroke();
      }
      c.strokeStyle = "#6d9385";
      c.lineWidth = 4;
      c.beginPath();
      for (let x = 55; x < 1045; x += 3) {
        const peak = Math.exp(-(((x - 420) / 22) ** 2)) * 55;
        const y =
          293 +
          Math.sin(x * 0.06) * 12 +
          Math.sin(x * 0.18) * 6 +
          peak * Math.sin(x * 0.2);
        if (x === 55) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
      c.fillStyle = "#dce6e8";
      c.fillRect(35, 415, 1030, 260);
      c.fillStyle = "#36564e";
      c.font = "bold 38px sans-serif";
      c.fillText("AI treatment prediction", 58, 470);
      c.font = "26px sans-serif";
      c.fillText("Patient data → model → treatment insights", 58, 515);
      ["MODEL", "INSIGHTS", "CLINICIAN REVIEW"].forEach((t, i) => {
        c.fillStyle = ["#afc8b1", "#b8b5ce", "#d7c5a4"][i];
        c.fillRect(60 + i * 327, 555, 299, 62);
        c.fillStyle = "#354c43";
        c.font = "bold 23px sans-serif";
        c.fillText(t, 74 + i * 327, 595);
      });
      c.fillStyle = "#708071";
      c.font = "21px sans-serif";
      c.fillText("Conceptual project illustration", 45, 716);
      const tex = new THREE.CanvasTexture(dashboard);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textures.push(tex);
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(1.79, 1.17),
        new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
      );
      panel.position.set(0.75, 1.32, -0.628);
      world.add(panel);
      cyl(0.34, 0.22, ink, 1.05, 0.45, 0.65);
      box(0.8, 0.07, 0.8, ink, 1.05, 0.6, 0.65).rotation.y = 0.3;
      const diploma = cyl(0.12, 0.95, cream, 0.55, 0.24, 1.08);
      diploma.rotation.z = Math.PI / 2;
      box(0.15, 0.26, 0.26, lilac, 0.55, 0.24, 1.08);
      break;
    }
    case 8: {
      plaque("CODED · TEACHING TOGETHER");
      box(1.9,1.15,.13,sage,-.6,1.5,-1.18);
      for(const dx of [-.7,.7])box(.08,1.3,.1,peach,-.6+dx,.75,-1.18);
      ["ROBOTEX","AI","BUSINESS"].forEach((t,i)=>label(t,1.65,.28,-.6,1.84-i*.33,-1.105));
      const skin=0xd4a982;
      // Nourah demonstrates a little wheeled robotics kit beside the board.
      const teacher=new THREE.Group();world.add(teacher);
      teacher.position.set(1.48,.1,-.63);teacher.rotation.y=.45;
      const navy=0x243650,navyLight=0x354b6b;
      mesh(new THREE.CylinderGeometry(.16,.27,.72,28),navy,0,.48,0,teacher);
      for(const dx of [-.1,.1])box(.13,.12,.23,navy,dx,.08,.035,teacher);
      const shoulders=ball(.23,navy,0,.78,0,teacher);shoulders.scale.set(1.05,.65,.72);
      const scarf=ball(.25,navy,0,1.06,-.015,teacher);scarf.scale.set(1,1.16,.88);
      const drape=ball(.21,navyLight,0,.89,.02,teacher);drape.scale.set(1,.85,.65);
      // Face sits forward of the scarf shell, keeping features clearly visible.
      const face=ball(.18,0xe0b58f,0,1.075,.205,teacher);face.scale.set(.88,1.04,.48);
      for(const dx of [-.058,.058]){
        ball(.017,0x27313d,dx,1.103,.285,teacher);
        const brow=box(.044,.012,.012,navy,dx,1.144,.278,teacher);brow.rotation.z=dx<0?.12:-.12;
      }
      ball(.022,0xd3a17d,0,1.069,.301,teacher);
      const smile=new THREE.EllipseCurve(0,0,.045,.018,Math.PI,Math.PI*2,false,0);
      const smilePath=new THREE.CatmullRomCurve3(smile.getPoints(12).map(p=>new THREE.Vector3(p.x,p.y+1.025,.287)));
      mesh(new THREE.TubeGeometry(smilePath,12,.007,5,false),0x9b6455,0,0,0,teacher);
      for(const side of [-1,1]){
        const sleeve=ball(.105,navy,side*.2,.69,.15,teacher);sleeve.scale.set(.85,1.7,1);sleeve.rotation.x=-.6;
        ball(.063,0xe0b58f,side*.14,.66,.34,teacher);
      }
      // A palm-sized EVE-inspired teaching robot cradled between both hands.
      const body=ball(.125,0xf2f3ed,0,.73,.35,teacher);body.scale.set(.85,1.35,.8);
      const head=ball(.145,0xf4f6f1,0,.945,.35,teacher);head.scale.set(1,.8,.83);
      const visor=ball(.12,0x152c38,0,.95,.43,teacher);visor.scale.set(1,.58,.42);
      for(const dx of [-.045,.045]){
        const eye=ball(.027,0x8bd6f2,dx,.953,.479,teacher);eye.scale.set(1,.55,.3);
        const arm=ball(.035,0xe7ece8,dx<0?-.135:.135,.76,.35,teacher);arm.scale.set(.8,2.2,.8);
      }
      let student=0;
      for (const x of [-1.2,.25]) for(const z of [-.35,.8]) {
        table(x,z);computer(x,z,.68,.65);
        const sz=z+.43,shirt=[0xa1b5c3,0xb8adca,0xa9ba92,0xd2b298][student++];
        box(.36,.08,.3,peach,x,.31,sz);
        box(.34,.4,.06,lilac,x,.48,sz+.13);
        cyl(.13,.28,shirt,x,.5,sz);
        ball(.15,skin,x,.82,sz);
        const hair=ball(.155,student%2?0x554536:0x383530,x,.89,sz+.015);hair.scale.y=.55;
        for(const dx of [-.1,.1]){
          rod(new THREE.Vector3(x+dx,.62,sz-.02),new THREE.Vector3(x+dx,.69,z+.12),shirt,.045);
          ball(.045,skin,x+dx,.695,z+.1);
          rod(new THREE.Vector3(x+dx,.36,sz),new THREE.Vector3(x+dx,.17,sz-.09),ink,.045);
        }
      }
      break;
    }
    case 9: {
      featuredPlaque("MASTER’S", "DATA SCIENCE & AI");
      const points = [
        new THREE.Vector3(0.55, 1.3, -0.5),
        new THREE.Vector3(1.5, 1.8, -0.4),
        new THREE.Vector3(1.45, 0.7, 0.1),
        new THREE.Vector3(0.8, 2, 0.1),
      ];
      points.forEach((p, i) => {
        ball(0.14, [lilac, butter, peach, sage][i], p.x, p.y, p.z);
        for (let j = 0; j < i; j++) rod(p, points[j], cream, 0.018);
      });
      table(0.7, 0.57, 2.15, 0.82);
      const monitor = new THREE.Group();
      monitor.position.set(.15,.68,.43);world.add(monitor);
      box(1.47,.94,.10,0x929da4,0,.67,-.12,monitor);
      box(.12,.29,.12,0x76858e,0,.15,-.12,monitor);
      box(.57,.05,.34,0xb4bdc1,0,.02,-.04,monitor);
      box(.88,.045,.25,0xc5cdd0,0,.035,.29,monitor);
      for(let row=0;row<3;row++) for(let col=0;col<11;col++)
        box(.056,.012,.041,0x738692,-.35+col*.07,.065,.21+row*.06,monitor);
      const robotHead = new THREE.Group();
      robotHead.position.set(1.43,1.17,.66);
      robotHead.rotation.set(-.05,.22,-.07);world.add(robotHead);
      const shell = new THREE.Mesh(new THREE.SphereGeometry(.32,48,32),new THREE.MeshPhysicalMaterial({color:0xf9fbff,roughness:.22,clearcoat:1,clearcoatRoughness:.12}));
      shell.scale.set(1.1,.9,.9);shell.castShadow=true;robotHead.add(shell);
      const visor = new THREE.Mesh(new THREE.SphereGeometry(.27,48,32),new THREE.MeshPhysicalMaterial({color:0x101f2b,roughness:.16,clearcoat:1,clearcoatRoughness:.1}));
      visor.position.set(0,-.015,.20);visor.scale.set(1,.66,.39);robotHead.add(visor);
      const eyeMaterial = new THREE.MeshBasicMaterial({color:0x75d9ff,toneMapped:false});
      for(const side of [-1,1]) {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(.073,32,20),eyeMaterial);
        eye.position.set(side*.112,.006,.302);eye.scale.set(1.13,.60,.19);eye.rotation.z=side*.19;robotHead.add(eye);
        const shine = new THREE.Mesh(new THREE.SphereGeometry(.022,16,12),new THREE.MeshBasicMaterial({color:0xdaf7ff,toneMapped:false}));
        shine.position.set(side*.112-.015,.021,.315);shine.scale.set(1.4,.35,.12);robotHead.add(shine);
      }
      cyl(0.27, 0.05, 0xa7beb4, 1.43, 0.71, 0.66);
      for (let i = 0; i < 4; i++) {
        const x = 1.28 + i * 0.1;
        const wire = new THREE.CatmullRomCurve3([
          new THREE.Vector3(x, 0.98, 0.66),
          new THREE.Vector3(x + 0.07, 0.87, 0.71),
          new THREE.Vector3(x, 0.74, 0.73),
          new THREE.Vector3(0.63, 0.72, 0.6 + i * 0.04),
        ]);
        mesh(
          new THREE.TubeGeometry(wire, 22, 0.014, 5, false),
          [0x97b6c8, 0xb7a4c0, 0x8da996, 0xc7b584][i],
          0,
          0,
          0
        );
      }
      const tower = new THREE.Group();
      tower.position.set(-1.35,.16,.66);tower.scale.setScalar(.85);world.add(tower);
      box(.83,1.47,.79,0x89959f,0,.76,0,tower);
      box(.70,1.30,.035,0x28323e,0,.77,.405,tower);
      for(const dx of [-.28,.28]) for(const dz of [-.25,.25]) box(.13,.09,.16,0x404d58,dx,.035,dz,tower);
      // Glass side window reveals a motherboard, light rails, and a GPU.
      box(.02,1.21,.63,0x263340,.424,.77,0,tower);
      box(.035,.63,.39,0x485361,.444,.87,0,tower);
      box(.065,.12,.49,0x667783,.46,.54,0,tower);
      const blue = new THREE.MeshStandardMaterial({color:0x7fc9ff,emissive:0x439fff,emissiveIntensity:1.2,roughness:.3});
      const purple = new THREE.MeshStandardMaterial({color:0xc4a0ff,emissive:0x9660ed,emissiveIntensity:1.1,roughness:.3});
      for(let i=0;i<3;i++) {
        const fan = new THREE.Mesh(new THREE.TorusGeometry(.19,.021,10,40),i%2?purple:blue);
        fan.position.set(0,.35+i*.4,.432);tower.add(fan);
        const hub=ball(.065,0x566673,0,.35+i*.4,.435,tower);hub.scale.z=.4;
        for(let blade=0;blade<6;blade++) {
          const angle=blade*Math.PI/3;
          const vane=box(.065,.15,.018,0x566777,Math.sin(angle)*.11,.35+i*.4+Math.cos(angle)*.11,.426,tower);
          vane.rotation.z=-angle+.35;
        }
      }
      for(let i=0;i<2;i++) {
        const rail=new THREE.Mesh(new RoundedBoxGeometry(.024,.42,.03,2,.008),i?purple:blue);
        rail.position.set(.469,1.01,-.12+i*.16);tower.add(rail);
      }
      const window = new THREE.Mesh(new THREE.PlaneGeometry(.63,1.2),new THREE.MeshPhysicalMaterial({color:0xc5ddf2,transparent:true,opacity:.12,roughness:.12,metalness:.1,depthWrite:false}));
      window.rotation.y=Math.PI/2;window.position.set(.49,.77,0);tower.add(window);
      box(.82,.06,.8,0xb6c1c9,0,1.50,0,tower);
      ball(.028,0xc0dfff,.22,1.54,.23,tower);
      const cable = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.367,.49,.337),new THREE.Vector3(-1.08,.22,-.02),
        new THREE.Vector3(-.35,.18,.03),new THREE.Vector3(.14,.48,.15),
        new THREE.Vector3(.15,1.12,.24)
      ]);
      mesh(new THREE.TubeGeometry(cable,36,.024,8,false),0x455665,0,0,0);
      const viz = document.createElement("canvas");
      viz.width = 800;
      viz.height = 500;
      const c = viz.getContext("2d")!;
      c.fillStyle = "#f2f1e8";
      c.fillRect(0, 0, 800, 500);
      c.fillStyle = "#3f5c51";
      c.font = "bold 45px sans-serif";
      c.fillText("DATA LAB", 35, 65);
      c.font = "25px sans-serif";
      c.fillText("patterns · models · possibilities", 35, 105);
      c.fillStyle = "#e0e7dc";
      c.fillRect(30, 135, 450, 315);
      c.strokeStyle = "#779c89";
      c.lineWidth = 5;
      c.beginPath();
      for (let i = 0; i < 60; i++) {
        const x = 45 + i * 7,
          y = 355 - i * 2.7 + Math.sin(i * 0.3) * 24;
        if (i === 0) c.moveTo(x, y);
        else c.lineTo(x, y);
      }
      c.stroke();
      for (let i = 0; i < 6; i++) {
        c.fillStyle = ["#98b8a0", "#a2b5ca", "#c3afd0"][i % 3];
        c.fillRect(515 + i * 42, 420 - (i + 1) * 39, 29, (i + 1) * 39);
      }
      const tex = new THREE.CanvasTexture(viz);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      textures.push(tex);
      const screen = new THREE.Mesh(
        new THREE.PlaneGeometry(1.34, 0.81),
        new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })
      );
      screen.position.set(0,.67,-.063);
      monitor.add(screen);

      break;
    }
  }
  let frame = 0,
    disposed = false;
  function draw() {
    frame = 0;
    if (!disposed) renderer.render(scene, camera);
  }
  function wake() {
    if (!frame && !disposed) frame = requestAnimationFrame(draw);
  }
  function move(e: PointerEvent) {
    if (
      e.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = host.getBoundingClientRect();
    world.rotation.y = ((e.clientX - r.left) / r.width - 0.5) * 0.45;
    wake();
  }
  function leave() {
    world.rotation.y = 0;
    wake();
  }
  function resize() {
    const r = host.getBoundingClientRect();
    renderer.setSize(r.width, r.height, false);
    const aspect = r.width / r.height;
    const h = Math.max(1.95, 2.9 / aspect);
    camera.left = -h * aspect;
    camera.right = h * aspect;
    camera.top = h;
    camera.bottom = -h;
    camera.updateProjectionMatrix();
    wake();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerleave", leave);
  resize();
  const dispose = () => {
    disposed = true;
    cancelAnimationFrame(frame);
    ro.disconnect();
    host.removeEventListener("pointermove", move);
    host.removeEventListener("pointerleave", leave);
    scene.traverse(o => {
      if (o instanceof THREE.Mesh) {
        o.geometry.dispose();
        if (
          !mats.has((o.material as THREE.MeshStandardMaterial).color?.getHex())
        )
          (o.material as THREE.Material).dispose();
      }
    });
    mats.forEach(m => m.dispose());
    textures.forEach(t => t.dispose());
    renderer.dispose();
    renderer.domElement.remove();
  };
  const cameraHome=camera.position.clone();
  return {
    dispose,
    zoom(value:number){camera.zoom=THREE.MathUtils.clamp(value,1,3);camera.updateProjectionMatrix();wake();},
    pan(x:number,y:number){camera.translateX(x);camera.translateY(y);wake();},
    reset(){camera.zoom=1;camera.position.copy(cameraHome);camera.updateProjectionMatrix();world.rotation.y=0;wake();}
  };
}
