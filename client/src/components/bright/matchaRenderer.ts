import { constrainDeskPosition, deskRadii, onLaptopBase } from "./deskPhysics";
import { createDeskSounds } from "./deskSounds";
import { makeLaptop } from "./laptopModel";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { TessellateModifier } from "three/addons/modifiers/TessellateModifier.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

export type DeskObject = "matcha" | "cookie" | "plant";

/** A sunlit, bounded desk. The render loop runs only while something is moving. */
export function mountMatcha(
  host: HTMLDivElement,
  reduced: boolean,
  onBite: (count: number) => void,
  onInspect: (value: boolean) => void,
  onRitualAction: (action: "brew" | "ice" | "stir") => void,
  onProject: (index: number) => void,
  onPlantClick: () => void
) {
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(
    Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.75)
  );
  renderer.setClearColor(0, 0);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.appendChild(renderer.domElement);
  // Gestures belong to the board; the surrounding page remains scrollable.
  host.style.touchAction = "none";
  const scene = new THREE.Scene();
  const sounds = createDeskSounds();
  const environment = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environmentMap = pmrem.fromScene(environment, 0.06);
  scene.environment = environmentMap.texture;
  scene.environmentIntensity = 0.7;
  environment.dispose();
  pmrem.dispose();
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
  camera.position.set(7, 8.5, 10.5);
  camera.lookAt(0, 0.2, 0);
  scene.add(new THREE.HemisphereLight(0xfff5de, 0x82765c, 0.85));
  const sun = new THREE.DirectionalLight(0xffe4b4, 2.8);
  sun.position.set(-5, 8, -3);
  sun.castShadow = true;
  sun.shadow.mapSize.set(
    innerWidth < 700 ? 1024 : 2048,
    innerWidth < 700 ? 1024 : 2048
  );
  sun.shadow.bias = -0.0002;
  sun.shadow.normalBias = 0.03;
  sun.shadow.camera.left = -6;
  sun.shadow.camera.right = 6;
  sun.shadow.camera.top = 6;
  sun.shadow.camera.bottom = -6;
  sun.shadow.camera.far = 25;
  sun.shadow.radius = 3;
  scene.add(sun);
  const fill = new THREE.DirectionalLight(0xe8f0e6, 0.65);
  fill.position.set(4, 3, 6);
  scene.add(fill);
  const objects = {} as Record<DeskObject, THREE.Group>;
  const homes = {} as Record<DeskObject, THREE.Vector3>;
  const disposableTextures: THREE.Texture[] = [];
  function material(color: number, roughness = 0.7) {
    return new THREE.MeshStandardMaterial({ color, roughness });
  }
  function add(
    parent: THREE.Object3D,
    geo: THREE.BufferGeometry,
    mat: THREE.Material,
    x = 0,
    y = 0,
    z = 0
  ) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function object(name: DeskObject, x: number, z: number) {
    const g = new THREE.Group();
    g.position.set(x, 0.24, z);
    g.userData.deskObject = name;
    scene.add(g);
    objects[name] = g;
    homes[name] = g.position.clone();
    return g;
  }
  function texture(draw: (c: CanvasRenderingContext2D) => void) {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = 1024;
    draw(c.getContext("2d")!);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    disposableTextures.push(t);
    return t;
  }
  const wood = texture(c => {
    c.fillStyle = "#d9b98d";
    c.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 1000; i++) {
      c.strokeStyle = `rgba(${i % 3 ? 110 : 255},${i % 3 ? 80 : 236},${i % 3 ? 50 : 197},${0.015 + (i % 11) * 0.004})`;
      c.lineWidth = 0.4 + (i % 5) * 0.5;
      c.beginPath();
      for (let x = 0; x <= 1024; x += 20)
        c.lineTo(
          x,
          i * 1.03 +
            Math.sin(x * 0.007 + i * 0.7) * 2 +
            Math.sin(x * 0.022 + i) * 0.7
        );
      c.stroke();
    }
  });
  const desk = add(
    scene,
    new RoundedBoxGeometry(7.5, 0.3, 5.7, 3, 0.12),
    new THREE.MeshStandardMaterial({ map: wood, roughness: 0.82 }),
    0,
    0,
    0
  );
  desk.receiveShadow = true;
  const linen = texture(c => {
    c.fillStyle = "#eae5d6";
    c.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 1024; i += 3) {
      c.fillStyle = i % 2 ? "#d7d1c32b" : "#fffdf03d";
      c.fillRect(i, 0, 1, 1024);
      c.fillRect(0, i, 1024, 1);
    }
  });
  const mat = add(
    scene,
    new RoundedBoxGeometry(4.1, 0.026, 3.8, 2, 0.07),
    new THREE.MeshStandardMaterial({ map: linen, roughness: 1 }),
    -0.7,
    0.17,
    0.15
  );
  mat.rotation.y = 0.1;
  // Long, softly transparent window-frame shadows across the tabletop.
  const shadeMat = new THREE.MeshBasicMaterial({
    color: 0x60533b,
    transparent: true,
    opacity: 0.08,
    depthWrite: false,
  });
  for (let i = 0; i < 3; i++) {
    const shadow = add(
      scene,
      new THREE.PlaneGeometry(0.16, 6),
      shadeMat,
      -2.4 + i * 2.25,
      0.189,
      0
    );
    shadow.rotation.set(-Math.PI / 2, 0, -0.48);
    shadow.castShadow = false;
  }
  const cup = object("matcha", -0.9, 0.6);
  cup.rotation.y = -0.15;
  const saucer = new THREE.Group();
  saucer.position.copy(cup.position);
  saucer.rotation.y = cup.rotation.y;
  scene.add(saucer);
  const ceramic = new THREE.MeshStandardMaterial({
    color: 0xe8deca,
    roughness: 0.42,
    metalness: 0.03,
  });
  add(
    saucer,
    new THREE.CylinderGeometry(1.2, 1.14, 0.095, 80),
    ceramic,
    0,
    0.015,
    0
  );
  const saucerRim = add(
    saucer,
    new THREE.TorusGeometry(1.15, 0.03, 12, 80),
    ceramic,
    0,
    0.07,
    0
  );
  saucerRim.rotation.x = Math.PI / 2;
  const profile = [
    new THREE.Vector2(0.58, 0.1),
    new THREE.Vector2(0.6, 0.16),
    new THREE.Vector2(0.74, 1.95),
    new THREE.Vector2(0.714, 1.99),
    new THREE.Vector2(0.687, 1.91),
    new THREE.Vector2(0.555, 0.17),
  ];
  const glass = add(
    cup,
    new THREE.LatheGeometry(profile, 80),
    new THREE.MeshPhysicalMaterial({
      color: 0xf8fbef,
      roughness: 0.04,
      metalness: 0,
      transmission: 1,
      thickness: 0.075,
      ior: 1.46,
      transparent: true,
      opacity: 1,
      envMapIntensity: 1.1,
      side: THREE.DoubleSide,
    }),
    0,
    0.1,
    0
  );
  glass.castShadow = false;
  const rim = add(
    cup,
    new THREE.TorusGeometry(0.725, 0.023, 12, 80),
    new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.65,
      thickness: 0.04,
    }),
    0,
    2.08,
    0
  );
  rim.rotation.x = Math.PI / 2;
  rim.castShadow = false;
  const milk = add(
    cup,
    new THREE.CylinderGeometry(0.649, 0.572, 0.89, 80),
    material(0xe4d8b5, 0.38),
    0,
    0.7,
    0
  );
  const tea = add(
    cup,
    new THREE.CylinderGeometry(0.692, 0.649, 0.58, 80),
    material(0x79933f, 0.3),
    0,
    1.44,
    0
  );
  const marbling = new THREE.ShaderMaterial({
    vertexShader: `varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}`,
    fragmentShader: `varying vec2 vUv;void main(){float edge=.4+sin(vUv.x*28.)*.18+sin(vUv.x*53.)*.06;vec3 c=mix(vec3(.81,.78,.59),vec3(.38,.49,.18),smoothstep(edge-.17,edge+.2,vUv.y));c*=.76+sin(vUv.x*6.28)*.12;gl_FragColor=vec4(c,1.);}`,
  });
  const teaMarbling = add(
    cup,
    new THREE.CylinderGeometry(0.656, 0.641, 0.27, 80, 1, true),
    marbling,
    0,
    1.13,
    0
  );
  const liquidMat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uEnergy: { value: 0 },
      uPoint: { value: new THREE.Vector2() },
    },
    vertexShader: `varying vec2 vP;uniform float uTime,uEnergy;uniform vec2 uPoint;void main(){vP=position.xy;vec3 p=position;float r=length(p.xy-uPoint);p.z=sin(r*27.-uTime*7.)*exp(-r*2.)*uEnergy*.04;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,
    fragmentShader: `varying vec2 vP;uniform float uTime,uEnergy;uniform vec2 uPoint;float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.54);}void main(){float r=length(vP),a=atan(vP.y,vP.x)+uEnergy*sin(r*8.-uTime*2.);float swirl=sin(a*3.+r*20.-uTime*.3)*.5+.5;float wave=sin(length(vP-uPoint)*27.-uTime*7.)*exp(-length(vP-uPoint)*2.)*uEnergy;vec3 c=mix(vec3(.24,.34,.09),vec3(.51,.62,.24),swirl*.5+.3);c+=wave*.15;float foam=step(.97,hash(floor(vP*180.)));c=mix(c,vec3(.72,.77,.49),foam*.65+smoothstep(.60,.70,r)*.35);gl_FragColor=vec4(c,1.);}`,
    side: THREE.DoubleSide,
  });
  const liquid = add(
    cup,
    new THREE.CircleGeometry(0.692, 80),
    liquidMat,
    0,
    1.733,
    0
  );
  liquid.rotation.x = -Math.PI / 2;
  liquid.castShadow = false;
  const iceMat = new THREE.MeshPhysicalMaterial({
    color: 0xecf7f5,
    roughness: 0.13,
    transmission: 0.82,
    clearcoat: 1,
    clearcoatRoughness: 0.08,
    thickness: 0.35,
    ior: 1.31,
    transparent: true,
    opacity: 0.96,
    envMapIntensity: 1.1,
  });
  const ice = [
    [-0.32, 0.1],
    [0.18, 0.28],
    [0.24, -0.3],
  ].map(([x, z], i) => {
    const m = add(
      cup,
      new RoundedBoxGeometry(0.43, 0.39, 0.44, 5, 0.065),
      iceMat,
      x,
      1.83 + i * 0.02,
      z
    );
    m.rotation.set(0.15 + i * .08, i * .85, .12 - i * .13);
    m.scale.set(1 - i * .06, 1 + i * .045, 1 + i * .025);
    const frost = new THREE.Mesh(new RoundedBoxGeometry(.24,.23,.25,3,.055),
      new THREE.MeshPhysicalMaterial({color:0xf3faf8,transparent:true,opacity:.16,roughness:.65,depthWrite:false}));
    frost.position.set(-.025,-.01,.015);m.add(frost);
    const bubbleMat = new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:.14,transparent:true,opacity:.5,depthWrite:false});
    for(let j=0;j<5;j++) {
      const bubble = new THREE.Mesh(new THREE.SphereGeometry(.009+(j%3)*.004,8,6),bubbleMat);
      bubble.position.set(Math.sin(j*2.3+i)*.12,Math.cos(j*1.7+i)*.12,Math.sin(j*3.2)*.11);
      m.add(bubble);
    }
    const glint = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-.15,.197,.11),new THREE.Vector3(-.08,.199,.16),new THREE.Vector3(.04,.197,.16)
    ]),10,.004,4,false),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.65}));
    m.add(glint);
    return m;
  });
  ice.forEach(m => {
    m.visible = false;
  });
  function fillTea(amount: number) {
    tea.visible = amount > 0;
    tea.scale.y = Math.max(0.001, amount);
    tea.position.y = 1.15 + 0.29 * amount;
    liquid.position.y = 1.15 + 0.583 * amount;
    liquid.visible = amount > 0;
    teaMarbling.visible = amount > 0.15;
  }
  fillTea(0);
  const straw = add(
    cup,
    new THREE.CylinderGeometry(0.026, 0.026, 1.9, 12),
    material(0xb9a374, 0.5),
    0.42,
    2,
    -0.25
  );
  straw.rotation.set(0.1, 0, -0.2);
  // Condensation catches the window light instead of outlining the entire glass.
  const dropMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.06,
    transmission: 0.4,
    thickness: 0.02,
  });
  for (let i = 0; i < 65; i++) {
    const angle = i * 2.39996,
      y = 0.35 + (i % 9) * 0.15,
      r = 0.6 + y * 0.062;
    const d = add(
      cup,
      new THREE.SphereGeometry(0.012 + (i % 3) * 0.004, 6, 5),
      dropMat,
      Math.cos(angle) * r,
      y,
      Math.sin(angle) * r
    );
    d.scale.y = 1.4;
    d.castShadow = false;
  }
  const cookie = object("cookie", 1.45, 0.65);
  const bakedTexture = texture(c => {
    c.fillStyle = "#edcfaa";
    c.fillRect(0, 0, 1024, 1024);
    // Broad toasted islands stay visible even when the cookie is small on screen.
    for (let i = 0; i < 95; i++) {
      const x = random(i + 1200) * 1024, y = random(i + 4200) * 1024;
      const r = 18 + random(i + 2100) * 65;
      const patch = c.createRadialGradient(x, y, 0, x, y, r);
      patch.addColorStop(0, i % 3 ? "#946b4670" : "#f6dfbc55");
      patch.addColorStop(1, "#c4a17b00");
      c.fillStyle = patch;
      c.fillRect(x - r, y - r, r * 2, r * 2);
    }
    for (let i = 0; i < 6500; i++) {
      const x = random(i + 2200) * 1024, y = random(i + 5200) * 1024;
      c.fillStyle = i % 3 ? "#92745238" : "#f7dfbb80";
      c.beginPath();
      c.ellipse(x, y, 0.8 + random(i + 3100) * 3.2,
        0.6 + random(i + 4100) * 2, random(i) * Math.PI, 0, Math.PI * 2);
      c.fill();
    }
    // Fine branching fissures with a pale raised lip, like fresh baked dough.
    c.lineCap = "round";
    for (let i = 0; i < 115; i++) {
      const x = random(i + 6500) * 1024, y = random(i + 7500) * 1024;
      c.save();
      c.translate(x, y);
      c.rotate(random(i + 8500) * Math.PI * 2);
      c.scale(1.7, 1.7);
      for (const lip of [true, false]) {
        c.strokeStyle = lip ? "#f5dcb570" : "#72513795";
        c.lineWidth = lip ? 7 : 3.5;
        c.beginPath();
        c.moveTo(0, lip ? -2 : 0);
        c.lineTo(8, 4); c.lineTo(17, 1); c.lineTo(26, 7);
        c.lineTo(36 + random(i + 9500) * 16, 4);
        c.moveTo(17, 1); c.lineTo(21, -7);
        c.stroke();
      }
      c.restore();
    }
    // Deeper, irregular fractures between baked dough mounds.
    for(let i=0;i<24;i++){
      const x=160+random(i+23100)*700,y=160+random(i+24100)*700;
      const angle=random(i+25100)*Math.PI*2,length=75+random(i+26100)*125;
      c.save();c.translate(x,y);c.rotate(angle);
      for(const highlight of [true,false]){
        c.strokeStyle=highlight?"#f5d8ae95":"#7452329a";
        c.lineWidth=highlight?8:3+random(i+27100)*3;
        c.beginPath();c.moveTo(0,highlight?-3:0);
        c.bezierCurveTo(length*.23,-17,length*.36,25,length*.57,7);
        c.quadraticCurveTo(length*.78,-13,length,10);
        c.stroke();
        if(i%3===0){c.lineWidth=2.5;c.beginPath();c.moveTo(length*.57,7);c.quadraticCurveTo(length*.55,28,length*.7,43);c.stroke();}
      }
      c.restore();
    }
    const toastedRim=c.createRadialGradient(512,512,325,512,512,490);
    toastedRim.addColorStop(0,"#81522e00");toastedRim.addColorStop(.65,"#81522e13");toastedRim.addColorStop(1,"#73452060");
    c.fillStyle=toastedRim;c.fillRect(0,0,1024,1024);
  });
  const biscuitMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    vertexColors: true,
    roughness: 0.93,
    map: bakedTexture,
    bumpMap: bakedTexture,
    bumpScale: 0.065,
  });
  const crumbMat = material(0xc39761, 0.94);
  const chipMats = [0x32170e, 0x49251a, 0x28140d, 0x623824].map(c =>
    material(c, 0.38)
  );
  const contactMats = [0.055, 0.075].map(
    opacity =>
      new THREE.MeshBasicMaterial({
        color: 0x705332,
        transparent: true,
        opacity,
        depthWrite: false,
      })
  );
  function random(i: number) {
    const n = Math.sin(i * 127.1 + 37.7) * 43758.5453;
    return n - Math.floor(n);
  }
  const chips: { x: number; z: number; size: number; seed: number }[] = [];
  for (let i = 0; chips.length < 24 && i < 200; i++) {
    const x = (random(i * 3 + 1) - 0.5) * 1.64,
      z = (random(i * 3 + 2) - 0.5) * 1.64;
    if (
      Math.hypot(x, z) > 0.8 ||
      chips.some(p => Math.hypot(x - p.x, z - p.z) < 0.18)
    )
      continue;
    chips.push({ x, z, size: 0.06 + random(i * 3 + 3) * 0.052, seed: i });
  }
  let bites = 0;
  const biteAngles = [-0.4, 0.45, -1.25, 1.3, 2.4];
  function bitten(x: number, y: number) {
    return biteAngles
      .slice(0, bites)
      .some(
        a => Math.hypot(x - Math.cos(a) * 0.83, y - Math.sin(a) * 0.83) < 0.58
      );
  }
  function doughRise(x: number, z: number) {
    const dome = Math.max(0, 1 - (x * x + z * z) / 0.86);
    const crag = Math.sin(x * 24 + Math.sin(z * 15)) * Math.cos(z * 27 - x * 9);
    return dome * (0.055 + crag * 0.014 + Math.sin(x * 48 + z * 31) * 0.005);
  }
  function cookieGeometry() {
    while (cookie.children.length) {
      const child = cookie.children[0] as THREE.Mesh;
      child.geometry.dispose();
      cookie.remove(child);
    }
    if (bites >= 6) return;
    const shape = new THREE.Shape();
    for (let i = 0; i <= 240; i++) {
      const a = (i / 240) * Math.PI * 2;
      let r =
        0.92 +
        Math.sin(a * 7 + 0.4) * 0.026 +
        Math.sin(a * 13) * 0.017 +
        Math.cos(a * 3) * 0.014;
      for (const ba of biteAngles.slice(0, bites)) {
        const d = 0.83,
          delta = a - ba,
          discriminant = 0.58 ** 2 - (d * Math.sin(delta)) ** 2;
        if (discriminant >= 0 && Math.cos(delta) > 0)
          r = Math.min(
            r,
            Math.max(0.05, d * Math.cos(delta) - Math.sqrt(discriminant))
          );
      }
      const x = Math.cos(a) * r,
        y = Math.sin(a) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const mesh = add(
      cookie,
      new THREE.ExtrudeGeometry(shape, {
        depth: 0.16,
        bevelEnabled: true,
        bevelSegments: 4,
        steps: 2,
        bevelSize: 0.05,
        bevelThickness: 0.035,
      }),
      biscuitMat,
      0,
      0.125,
      0
    );
    mesh.rotation.x = Math.PI / 2;
    const flatGeometry = mesh.geometry;
    mesh.geometry = new TessellateModifier(0.085, 6).modify(flatGeometry);
    flatGeometry.dispose();
    const pos = mesh.geometry.attributes.position;
    const uv = mesh.geometry.attributes.uv;
    const colors = new Float32Array(pos.count * 3);
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i),
        y = pos.getY(i),
        z = pos.getZ(i);
      // The upper face is negative Z before rotating the cookie onto the board.
      const rise = doughRise(x, -y);
      pos.setZ(i, z - rise * (1 - THREE.MathUtils.smoothstep(z, 0, 0.16)));
      uv.setXY(i, x / 2 + 0.5, y / 2 + 0.5);
      const edge = THREE.MathUtils.smoothstep(Math.hypot(x, y), 0.55, 0.95);
      const baked = THREE.MathUtils.clamp(
        edge * 0.52 +
          z * 0.65 +
          (Math.sin(x * 9 + y * 5) * Math.cos(y * 11 - x * 3) + 1) * 0.055,
        0,
        0.75
      );
      const c = new THREE.Color(0xd1ac7c).lerp(
        new THREE.Color(0x946b48),
        baked
      );
      c.toArray(colors, i * 3);
    }
    mesh.geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    mesh.geometry.computeVertexNormals();
    contactMats.forEach((m, i) => {
      const shadow = add(
        cookie,
        new THREE.ShapeGeometry(shape),
        m,
        0,
        -0.048 - i * 0.002,
        0
      );
      shadow.rotation.x = Math.PI / 2;
      shadow.scale.setScalar(1.015 + i * 0.025);
      shadow.castShadow = false;
      shadow.receiveShadow = false;
    });
    chips.forEach(({ x, z, size, seed }) => {
      if (bitten(x, z)) return;
      const geo =
        seed % 3 === 0
          ? new RoundedBoxGeometry(
              size * 1.65,
              size,
              size * 1.4,
              2,
              size * 0.24
            )
          : new THREE.DodecahedronGeometry(size, 1);
      const chip = add(
        cookie,
        geo,
        chipMats[seed % 4],
        x,
        0.143 + doughRise(x, z) + random(seed + 8) * 0.012,
        z
      );
      chip.rotation.set(
        random(seed + 9) * 0.35,
        random(seed + 10) * 6.28,
        random(seed + 11) * 0.3
      );
      chip.scale.set(
        0.8 + random(seed + 12) * 0.45,
        0.48 + random(seed + 13) * 0.3,
        0.8 + random(seed + 14) * 0.4
      );
    });
    for (let i = 0; i < 65; i++) {
      const x = (random(i + 600) - 0.5) * 1.65,
        z = (random(i + 800) - 0.5) * 1.65;
      if (
        Math.hypot(x, z) > 0.83 ||
        bitten(x, z) ||
        chips.some(p => Math.hypot(x - p.x, z - p.z) < 0.11)
      )
        continue;
      const mark = add(
        cookie,
        new THREE.SphereGeometry(0.012 + random(i + 900) * 0.008, 5, 3),
        crumbMat,
        x,
        0.161 + doughRise(x, z),
        z
      );
      mark.scale.y = 0.4;
      mark.castShadow = false;
    }
    for (let i = 0; i < 4; i++) {
      const a = 1.9 + i * 0.35,
        r = 1.01 + random(i + 333) * 0.08,
        x = Math.cos(a) * r,
        z = Math.sin(a) * r;
      if (bitten(x, z)) continue;
      const crumb = add(
        cookie,
        new THREE.DodecahedronGeometry(0.018 + random(i + 44) * 0.013),
        crumbMat,
        x,
        -0.055,
        z
      );
      crumb.scale.y = 0.65;
    }
  }
  cookieGeometry();
  function bite() {
    discoverDesk();
    if (bites >= 6) return;
    sounds.bite();
    bites++;
    cookieGeometry();
    onBite(bites);
    wake();
  }
  function freshCookie() {
    bites = 0;
    cookieGeometry();
    onBite(0);
    wake();
  }
  const plant = object("plant", -2.65, -0.4);
  add(
    plant,
    new THREE.CylinderGeometry(0.45, 0.33, 0.66, 48),
    material(0xc79973, 0.88),
    0,
    0.34,
    0
  );
  add(
    plant,
    new THREE.CylinderGeometry(0.4, 0.4, 0.03, 48),
    material(0x504638),
    0,
    0.68,
    0
  );
  // Molded botanical pieces: thick pink petals, visible connectors and angular leaves.
  const stemMat = material(0x176447, .28);
  const leafMat = new THREE.MeshPhysicalMaterial({color:0x237655, roughness:.28, clearcoat:.55, flatShading:true});
  const pinks = [0xf2a5cf,0xe88dbc,0xd96ca7].map(color => new THREE.MeshPhysicalMaterial({color,roughness:.25,clearcoat:.65,clearcoatRoughness:.22}));
  for(let i=0;i<6;i++){
    const angle=i*2.39996;
    const shape=new THREE.Shape();
    shape.moveTo(0,0);shape.lineTo(-.14,.22);shape.lineTo(0,.51);shape.lineTo(.14,.22);shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.026,bevelEnabled:true,bevelSize:.008,bevelThickness:.008,bevelSegments:1,steps:1});
    const leaf=add(plant,geo,leafMat,Math.cos(angle)*.19,.86+(i%3)*.10,Math.sin(angle)*.19);
    leaf.rotation.set(-.85,angle,.15);
  }
  function brickPetal(layer:number){
    const shape=new THREE.Shape();
    const w=.14-layer*.029,h=.25-layer*.043;
    shape.moveTo(-w*.65,0);shape.lineTo(-w,h*.66);
    shape.quadraticCurveTo(-w,h,w*.1,h);
    shape.quadraticCurveTo(w,h,w,h*.67);shape.lineTo(w*.65,0);shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.022,bevelEnabled:true,bevelSize:.009,bevelThickness:.007,bevelSegments:2,curveSegments:7,steps:4});
    const pos=geo.attributes.position;
    for(let i=0;i<pos.count;i++){
      const x=pos.getX(i),y=pos.getY(i);
      pos.setZ(i,pos.getZ(i)+.04+Math.pow(x/w,2)*.065+Math.sin(y/h*Math.PI)*.033);
    }
    geo.computeVertexNormals();return geo;
  }
  [[.28,1.44,.26],[-.25,1.65,.13],[.07,1.87,-.17]].forEach(([x,y,z],flower)=>{
    add(plant,new THREE.CylinderGeometry(.025,.025,y-.7,10),stemMat,x,(y+.7)/2,z);
    for(let j=0;j<3;j++) add(plant,new THREE.CylinderGeometry(.037,.037,.035,10),stemMat,x,.84+j*.23,z);
    const rose=new THREE.Group();rose.position.set(x,y-.07,z);rose.rotation.set(.32,flower*1.7,-.17+flower*.16);plant.add(rose);
    add(rose,new THREE.CylinderGeometry(.13,.065,.055,10),stemMat,0,0,0);
    for(let layer=0;layer<3;layer++){
      const count=layer===0?5:4;
      for(let j=0;j<count;j++){
        const angle=j/count*Math.PI*2+layer*.85;
        const petal=add(rose,brickPetal(layer),pinks[(flower+layer)%3],Math.sin(angle)*(.065-layer*.021),layer*.035,Math.cos(angle)*(.065-layer*.021));
        petal.rotation.y=angle;
      }
    }
    const heart=add(rose,new THREE.TorusGeometry(.042,.013,8,20),pinks[2],0,.17,0);heart.rotation.x=-Math.PI/2;
    add(rose,new THREE.CylinderGeometry(.023,.023,.033,12),pinks[0],0,.168,0);
  });
  const floor = add(
    scene,
    new THREE.PlaneGeometry(30, 30),
    new THREE.ShadowMaterial({ color: 0x544630, opacity: 0.13 }),
    0,
    -0.18,
    0
  );
  floor.rotation.x = -Math.PI / 2;
  floor.castShadow = false;
  const bowl = new THREE.Group();
  scene.add(bowl);
  const bowlHome = new THREE.Vector3(-0.15, 0.24, -1.6);
  bowl.position.copy(bowlHome);
  const bowlProfile = [
    new THREE.Vector2(0.24, 0),
    new THREE.Vector2(0.33, 0.08),
    new THREE.Vector2(0.56, 0.37),
    new THREE.Vector2(0.58, 0.48),
    new THREE.Vector2(0.54, 0.5),
    new THREE.Vector2(0.49, 0.37),
    new THREE.Vector2(0.29, 0.11),
  ];
  add(
    bowl,
    new THREE.LatheGeometry(bowlProfile, 64),
    new THREE.MeshStandardMaterial({
      color: 0x6e8052,
      roughness: 0.4,
      side: THREE.DoubleSide,
    })
  );
  const bowlTea = add(
    bowl,
    new THREE.CircleGeometry(0.47, 64),
    liquidMat,
    0,
    0.38,
    0
  );
  bowlTea.rotation.x = -Math.PI / 2;
  bowlTea.castShadow = false;
  const whisk = new THREE.Group();
  bowl.add(whisk);
  whisk.position.set(0.05, 0.32, 0);
  whisk.rotation.z = -0.2;
  add(
    whisk,
    new THREE.CylinderGeometry(0.065, 0.09, 0.47, 12),
    material(0xd9ba7b),
    0,
    0.54,
    0
  );
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(Math.cos(a) * 0.065, 0.32, Math.sin(a) * 0.065),
      new THREE.Vector3(Math.cos(a) * 0.2, 0.08, Math.sin(a) * 0.2),
      new THREE.Vector3(Math.cos(a) * 0.18, 0, Math.sin(a) * 0.18),
    ]);
    add(
      whisk,
      new THREE.TubeGeometry(curve, 12, 0.009, 4, false),
      material(0xd6b777)
    );
  }
  const stream = add(
    scene,
    new THREE.CylinderGeometry(0.043, 0.025, 1, 12),
    material(0x81964c, 0.24)
  );
  stream.visible = false;
  stream.castShadow = false;
  const ray = new THREE.Raycaster(),
    pointer = new THREE.Vector2(),
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.24),
    hitPoint = new THREE.Vector3(),
    dragOffset = new THREE.Vector3();
  let selected: DeskObject = "matcha",
    dragging: DeskObject | null = null,
    frame = 0,
    disposed = false,
    visible = true,
    energy = 0,
    last = 0,
    start = performance.now(),
    settle = 0;
  let action: "brew" | "ice" | null = null,
    actionStart = 0,
    resolveAction: (() => void) | null = null;
  function finishAction() {
    action = null;
    resolveAction?.();
    resolveAction = null;
  }
  let pourSoundStarted = false;
  function brew() {
    discoverDesk();
    if (action) return Promise.resolve();
    sounds.whisk();
    pourSoundStarted = false;
    if (reduced) {
      fillTea(1);
      wake();
      return Promise.resolve();
    }
    action = "brew";
    actionStart = performance.now();
    wake();
    return new Promise<void>(resolve => {
      resolveAction = resolve;
    });
  }
  function addIce() {
    if (action) return Promise.resolve();
    sounds.ice(reduced);
    ice.forEach(m => {
      m.visible = true;
    });
    if (reduced) {
      energy = 1;
      wake();
      return Promise.resolve();
    }
    action = "ice";
    actionStart = performance.now();
    wake();
    return new Promise<void>(resolve => {
      resolveAction = resolve;
    });
  }
  let mixed = 0,
    mixing = false;
  const milkColor = new THREE.Color(0xe4d8b5),
    teaColor = new THREE.Color(0x79933f),
    mixedColor = new THREE.Color(0x819e49);
  let yaw = 0.588,
    pitch = 0.59,
    zoomLevel = 1,
    viewMode = false,
    rotating = false;
  let pointerX = 0,
    pointerY = 0;
  const laptop = makeLaptop(wake, onProject);
  laptop.group.position.set(1.65, 0.24, -1.45);
  laptop.group.rotation.y = Math.PI + 0.08;
  scene.add(laptop.group);
  const spillMaterial = new THREE.MeshStandardMaterial({
    color: 0x719043, roughness: 0.25, transparent: true, opacity: 0.88,
    depthWrite: false, side: THREE.DoubleSide,
  });
  const spillGroup = new THREE.Group();
  scene.add(spillGroup);
  const spills = Array.from({ length: 48 }, (_, i) => {
    const puddle = new THREE.Mesh(new THREE.CircleGeometry(1, 18), spillMaterial);
    const drop = new THREE.Mesh(new THREE.SphereGeometry(0.038, 8, 6), spillMaterial);
    puddle.visible = drop.visible = false;
    puddle.renderOrder = 3;
    spillGroup.add(puddle, drop);
    return { puddle, drop, from: new THREE.Vector3(), to: new THREE.Vector3(),
      time: 0, active: false, size: 0.12 + random(i + 14000) * 0.14 };
  });
  const spillRay = new THREE.Raycaster();
  let spillIndex = 0, spillTravel = 0, tiltX = 0, tiltZ = 0;
  const surfaceObjects = [desk, mat, saucer, laptop.group];
  function spillMatcha() {
    if (action || inspecting) return;
    discoverDesk();
    scene.updateMatrixWorld(true);
    const from = cup.localToWorld(new THREE.Vector3(0.48, 1.94, 0.08));
    const landing = from.clone().add(new THREE.Vector3(0.15, 0, 0.12));
    spillRay.set(new THREE.Vector3(landing.x, 8, landing.z), new THREE.Vector3(0, -1, 0));
    const hit = spillRay.intersectObjects(surfaceObjects, true)[0];
    if (!hit) return;
    const item = spills[spillIndex++ % spills.length];
    const normal = hit.face!.normal.clone().transformDirection(hit.object.matrixWorld);
    item.to.copy(hit.point).addScaledVector(normal, 0.012);
    item.from.copy(from);
    item.puddle.position.copy(item.to);
    item.puddle.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    item.puddle.rotateZ(random(spillIndex + 18000) * Math.PI);
    item.puddle.scale.set(item.size, item.size * 0.68, 1);
    item.puddle.visible = reduced;
    item.drop.position.copy(from);
    item.drop.visible = !reduced;
    item.time = 0;
    item.active = !reduced;
    spillMaterial.color.set(tea.visible ? 0x719043 : 0xd6c9a5);
    tiltZ = -0.07;
    energy = 1;
    settle = 1;
    wake();
  }
  function clearSpills() {
    spills.forEach(p => { p.active = false; p.drop.visible = p.puddle.visible = false; });
    cup.rotation.x = cup.rotation.z = tiltX = tiltZ = 0;
    wake();
  }
  let hintsKnown = false;
  try {
    hintsKnown = localStorage.getItem("nourah-desk-discovered") === "yes";
  } catch {}
  const hints = hintsKnown
    ? []
    : [
        { object: laptop.group, offset: new THREE.Vector3(0, 1.7, 0) },
        { object: objects.matcha, offset: new THREE.Vector3(0, 2.35, 0) },
        { object: objects.cookie, offset: new THREE.Vector3(0, 0.4, 0) },
        { object: objects.plant, offset: new THREE.Vector3(0, 1.2, 0) },
      ].map(item => {
        const el = document.createElement("span");
        el.className = "desk-discovery-sparkle";
        el.textContent = "✨";
        el.setAttribute("aria-hidden", "true");
        host.appendChild(el);
        return { ...item, el };
      });
  function discoverDesk() {
    if (hintsKnown) return;
    hintsKnown = true;
    hints.forEach(h => h.el.classList.add("sparkle-discovered"));
    try {
      localStorage.setItem("nourah-desk-discovered", "yes");
    } catch {}
  }

  const inspectionHidden = new Map<THREE.Object3D, boolean>();
  let inspecting = false,
    cameraMoving = false;
  const targetPosition = new THREE.Vector3(),
    cameraFocus = new THREE.Vector3(0, 0.45, 0),
    targetFocus = cameraFocus.clone();
  let savedView = [yaw, pitch, zoomLevel];
  function inspect(value: boolean) {
    if (value === inspecting) return;
    if (value) discoverDesk();
    if (value) {
      savedView = [yaw, pitch, zoomLevel];
      yaw = Math.PI + 0.08;
      pitch = 0.46;
      laptop.setOpen(true);
      zoomLevel = 1;
    } else {
      [yaw, pitch, zoomLevel] = savedView;
    }
    if (value) {
      scene.children.forEach(o => {
        if (o !== laptop.group && !(o instanceof THREE.Light)) {
          inspectionHidden.set(o, o.visible);
          o.visible = false;
        }
      });
    } else {
      inspectionHidden.forEach((v, o) => (o.visible = v));
      inspectionHidden.clear();
    }
    if (!value) laptop.reset();
    inspecting = value;
    rotating = false;
    dragging = null;
    host.style.touchAction = "none";
    onInspect(value);
    resize();
    wake();
  }
  function updateCamera() {
    const radius =
      (inspecting
        ? Math.max(innerWidth < 760 ? 4.9 : 5.6, 3.5 / camera.aspect)
        : Math.max(12.2, 9.8 / camera.aspect)) / zoomLevel;
    targetFocus.copy(
      inspecting
        ? laptop.group.position.clone().add(new THREE.Vector3(0, 0.65, 0))
        : new THREE.Vector3(0, 0.45, 0)
    );
    targetPosition.set(
      Math.sin(yaw) * Math.cos(pitch) * radius,
      Math.sin(pitch) * radius,
      Math.cos(yaw) * Math.cos(pitch) * radius
    );
    if (inspecting) targetPosition.add(targetFocus);
    cameraMoving = true;
    if (reduced) {
      camera.position.copy(targetPosition);
      cameraFocus.copy(targetFocus);
      camera.lookAt(cameraFocus);
      cameraMoving = false;
    }
  }
  function zoom(delta: number) {
    zoomLevel = THREE.MathUtils.clamp(zoomLevel + delta, 0.75, 1.8);
    updateCamera();
    wake();
  }
  function rotate(dx: number, dy = 0) {
    yaw += dx;
    pitch = THREE.MathUtils.clamp(pitch + dy, 0.3, 1.25);
    updateCamera();
    wake();
  }
  function resetView() {
    yaw = 0.588;
    pitch = 0.59;
    zoomLevel = 1;
    updateCamera();
    wake();
  }
  function setViewMode(value: boolean) {
    viewMode = value;
    host.style.touchAction = "none";
  }
  function wheel(e: WheelEvent) {
    if (!viewMode && !inspecting) return;
    e.preventDefault();
    zoom(-e.deltaY * 0.001);
  }

  function restingHeight(name:DeskObject) {
    const g=objects[name];
    const base={matcha:.20,cookie:-.07,plant:.015}[name];
    let surface=.19;
    if(onLaptopBase(g.position.x,g.position.z))surface=.37;
    if(name==='matcha' && Math.hypot(g.position.x-saucer.position.x,g.position.z-saucer.position.z)<.4)surface=.318;
    return surface-base+.01;
  }
  function moveObject(name:DeskObject,x:number,z:number){
    const g=objects[name];
    const others=Object.entries(objects).map(([key,obj])=>({name:key,x:obj.position.x,z:obj.position.z,radius:deskRadii[key as DeskObject]}));
    const safe=constrainDeskPosition(name,g.position,{x,z},others);
    g.position.x=safe.x;g.position.z=safe.z;
    // Raise first when crossing onto a support, so the base cannot tunnel into it.
    g.position.y=Math.max(g.position.y,restingHeight(name)+(dragging===name?.24:0));
  }
  function draw(now: number) {
    frame = 0;
    if (disposed || !visible || document.hidden) return;
    const dt = Math.min((now - (last || now)) / 1000, 0.05);
    last = now;
    const lidMoving = laptop.update(dt, reduced);
    if (cameraMoving) {
      camera.position.lerp(targetPosition, 1 - Math.exp(-dt * 9));
      cameraFocus.lerp(targetFocus, 1 - Math.exp(-dt * 9));
      camera.lookAt(cameraFocus);
      cameraMoving =
        camera.position.distanceTo(targetPosition) > 0.001 ||
        cameraFocus.distanceTo(targetFocus) > 0.001;
    }
    let spillMoving = false;
    for (const p of spills) {
      if (!p.active) continue;
      p.time += dt;
      const t = Math.min(1, p.time / 0.42);
      p.drop.position.lerpVectors(p.from, p.to, t * t);
      p.drop.scale.set(0.75, 1.5 - t * 0.7, 0.75);
      if (t === 1) {
        p.active = false; p.drop.visible = false; p.puddle.visible = true;
      } else spillMoving = true;
    }
    const tilting = Math.abs(cup.rotation.x) + Math.abs(cup.rotation.z) > 0.002;
    if (!dragging) { tiltX *= Math.exp(-dt * 7); tiltZ *= Math.exp(-dt * 7); }
    cup.rotation.x = reduced ? 0 : THREE.MathUtils.lerp(cup.rotation.x, tiltX, Math.min(1, dt * 12));
    cup.rotation.z = reduced ? 0 : THREE.MathUtils.lerp(cup.rotation.z, tiltZ, Math.min(1, dt * 12));
    energy *= Math.exp(-dt * 1.25);
    settle *= Math.exp(-dt * 4);
    if (action === "brew") {
      const t = (now - actionStart) / 1000;
      if (t < 1) {
        whisk.rotation.y = t * 18;
        whisk.position.x = Math.sin(t * 22) * 0.07;
        energy = 0.65;
      }
      const approach = THREE.MathUtils.smoothstep(t, 1, 1.8),
        retreat = THREE.MathUtils.smoothstep(t, 3.3, 4);
      const lift = approach * (1 - retreat);
      bowl.position.lerpVectors(
        bowlHome,
        new THREE.Vector3(cup.position.x - 0.73, 3.05, cup.position.z),
        lift
      );
      bowl.rotation.z = -lift * 0.95;
      whisk.visible = t < 1.05 || t > 3.8;
      const amount = THREE.MathUtils.smoothstep(t, 1.8, 3.3);
      fillTea(amount);
      stream.visible = t > 1.8 && t < 3.3;
      if (stream.visible && !pourSoundStarted) { sounds.pour(); pourSoundStarted = true; }
      if (stream.visible) {
        const from = bowl.localToWorld(new THREE.Vector3(0.51, 0.42, 0));
        const to = cup.localToWorld(
          new THREE.Vector3(-0.1, liquid.position.y, 0)
        );
        stream.position.copy(from).add(to).multiplyScalar(0.5);
        stream.scale.y = from.distanceTo(to);
        stream.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          from.clone().sub(to).normalize()
        );
        energy = 0.7;
      }
      if (t >= 4) {
        bowl.position.copy(bowlHome);
        bowl.rotation.z = 0;
        whisk.visible = true;
        stream.visible = false;
        finishAction();
      }
    }
    if (mixing) {
      mixed = reduced ? 1 : Math.min(1, mixed + dt * 0.55);
      (milk.material as THREE.MeshStandardMaterial).color.lerpColors(
        milkColor,
        mixedColor,
        mixed
      );
      (tea.material as THREE.MeshStandardMaterial).color.lerpColors(
        teaColor,
        mixedColor,
        mixed
      );
      teaMarbling.visible = mixed < 0.75;
      if (mixed === 1) mixing = false;
    }
    liquidMat.uniforms.uTime.value = reduced ? 0 : (now - start) / 1000;
    liquidMat.uniforms.uEnergy.value = energy;
    if (!reduced) {
      ice.forEach((m, i) => {
        const base = 1.83 + i * 0.02;
        const fall =
          action === "ice"
            ? THREE.MathUtils.clamp(
                ((now - actionStart) / 1000 - i * 0.15) / 0.65,
                0,
                1
              )
            : 1;
        m.position.y =
          base +
          (1 - fall * fall) * 1.6 +
          Math.sin((now - start) * 0.0025 + i) * energy * 0.035;
        m.rotation.y += dt * energy * 0.15;
      });
      if (action === "ice") {
        energy = 0.9;
        if (now - actionStart > 1150) finishAction();
      }
      for (const [key, g] of Object.entries(objects)) {
        const target = restingHeight(key as DeskObject) + (dragging === key ? .24 : 0);
        g.position.y += (target - g.position.y) * Math.min(1, dt * 12);
      }
    }
    if (!hintsKnown)
      hints.forEach(h => {
        const p = h.object.position.clone().add(h.offset).project(camera);
        h.el.style.left = `${(p.x + 1) * 50}%`;
        h.el.style.top = `${(1 - p.y) * 50}%`;
        h.el.style.visibility = inspecting ? "hidden" : "visible";
      });
    renderer.render(scene, camera);
    if (
      !reduced &&
      (energy > 0.012 ||
        settle > 0.003 ||
        dragging ||
        action ||
        mixing ||
        cameraMoving ||
        lidMoving || spillMoving || tilting)
    )
      frame = requestAnimationFrame(draw);
  }
  function wake() {
    if (!frame && !disposed && visible && !document.hidden) {
      last = 0;
      frame = requestAnimationFrame(draw);
    }
  }
  function stir() {
    discoverDesk();
    sounds.stir();
    if (tea.visible) mixing = true;
    energy = 1;
    liquidMat.uniforms.uPoint.value.set(0.04, 0.02);
    wake();
  }
  function locate(e: PointerEvent) {
    const b = host.getBoundingClientRect();
    pointer.set(
      ((e.clientX - b.left) / b.width) * 2 - 1,
      (-(e.clientY - b.top) / b.height) * 2 + 1
    );
    ray.setFromCamera(pointer, camera);
  }
  let dragged = false;
  let pendingTap: "bowl" | "laptop" | null = null;
  const pointers = new Map<number, { x: number; y: number }>();
  let multiGesture = false;
  function gesturePair() {
    const [a, b] = Array.from(pointers.values());
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2,
      distance: Math.hypot(a.x - b.x, a.y - b.y), angle: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  function down(e: PointerEvent) {
    if (e.button !== 0 || action) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    host.setPointerCapture(e.pointerId);
    if (pointers.size > 1) {
      multiGesture = true; dragged = true; dragging = null; rotating = false; pendingTap = null;
      return;
    }
    pointerX = e.clientX;
    pointerY = e.clientY;
    dragged = false;
    pendingTap = null;
    locate(e);
    const laptopHit = ray.intersectObject(laptop.group, true)[0];
    const hit = ray.intersectObjects(Object.values(objects), true)[0];
    const keyIndex = laptopHit ? laptop.keyFromObject(laptopHit.object) : null;
    if (keyIndex !== null && (inspecting || !hit || laptopHit!.distance < hit.distance)) {
      laptop.pressKey(keyIndex);
      dragged = true;
      return;
    }
    if (inspecting || viewMode) { rotating = true; return; }
    const bowlHit = ray.intersectObject(bowl, true)[0];
    if (bowlHit && (!hit || bowlHit.distance < hit.distance) &&
        (!laptopHit || bowlHit.distance < laptopHit.distance)) {
      pendingTap = "bowl"; return;
    }
    if (laptopHit && (!hit || laptopHit.distance < hit.distance)) {
      pendingTap = "laptop"; return;
    }
    // Dragging an empty part of the board turns the whole scene.
    if (!hit) { rotating = true; return; }
    let g: THREE.Object3D | null = hit.object;
    while (g && !g.userData.deskObject) g = g.parent;
    if (!g) return;
    selected = g.userData.deskObject;
    discoverDesk();
    dragging = selected;
    spillTravel = 0;
    ray.ray.intersectPlane(dragPlane, hitPoint);
    dragOffset.copy(g.position).sub(hitPoint);
    host.style.cursor = "grabbing";
    settle = 1;
    wake();
  }
  function move(e: PointerEvent) {
    if (pointers.has(e.pointerId) && pointers.size > 1) {
      const before = gesturePair();
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const after = gesturePair();
      const twist = Math.atan2(Math.sin(after.angle - before.angle), Math.cos(after.angle - before.angle));
      rotate((before.x - after.x) * 0.008 + twist, (after.y - before.y) * 0.006);
      if (before.distance > 10) zoom((after.distance / before.distance - 1) * zoomLevel);
      return;
    }
    if (multiGesture) return;
    if (pointers.has(e.pointerId)) pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pendingTap && Math.hypot(e.clientX - pointerX, e.clientY - pointerY) > 6) {
      pendingTap = null; rotating = true; dragged = true;
    }
    if (rotating) {
      rotate((pointerX - e.clientX) * 0.008, (e.clientY - pointerY) * 0.006);
      pointerX = e.clientX; pointerY = e.clientY;
      return;
    }
    locate(e);
    if (dragging) {
      if (Math.hypot(e.clientX - pointerX, e.clientY - pointerY) > 6) dragged = true;
      if (!dragged) return;
      ray.ray.intersectPlane(dragPlane, hitPoint);
      const g = objects[dragging];
      const x = THREE.MathUtils.clamp(hitPoint.x + dragOffset.x, -2.65, 2.65);
      const z = THREE.MathUtils.clamp(hitPoint.z + dragOffset.z, -1.85, 1.85);
      const dx = x - g.position.x, dz = z - g.position.z;
      moveObject(dragging,x,z);
      settle = 1;
      if (dragging === "matcha") {
        energy = 0.8;
        tiltX = THREE.MathUtils.clamp(dz * 3, -0.07, 0.07);
        tiltZ = THREE.MathUtils.clamp(-dx * 3, -0.07, 0.07);
        spillTravel += Math.hypot(dx, dz);
        if (spillTravel > 0.28) { spillMatcha(); spillTravel = 0; }
      }
      wake(); return;
    }
    if (e.pointerType === "mouse") {
      settle = 1;
      const hit = ray.intersectObjects(Object.values(objects), true)[0];
      const bowlHit = ray.intersectObject(bowl, true)[0];
      host.style.cursor = bowlHit && (!hit || bowlHit.distance < hit.distance) ? "pointer" : "grab";
      const liquidHit = ray.intersectObject(liquid)[0];
      if (liquidHit) {
        const local = liquid.worldToLocal(liquidHit.point.clone());
        liquidMat.uniforms.uPoint.value.set(local.x, local.y);
        energy = Math.max(energy, 0.4);
      }
      wake();
    }
  }
  function up(e: PointerEvent) {
    if (!pointers.has(e.pointerId)) return;
    pointers.delete(e.pointerId);
    const cancelled = e.type === "pointercancel" || e.type === "lostpointercapture";
    if (!cancelled && !multiGesture && !dragged && !action) {
      if (pendingTap === "bowl") onRitualAction("brew");
      else if (pendingTap === "laptop") inspect(true);
      else if (dragging === "matcha") onRitualAction(ice.some(m => m.visible) ? "stir" : "ice");
      else if (dragging === "cookie") bite();
      else if (dragging === "plant") onPlantClick();
    }
    pendingTap = null; rotating = false; dragging = null;
    if (!pointers.size) multiGesture = false;
    settle = 1;
    host.style.cursor = "grab";
    wake();
  }
  function resize() {
    const b = host.getBoundingClientRect();
    renderer.setPixelRatio(inspecting ? Math.min(Math.max(devicePixelRatio, 2), 3) : Math.min(devicePixelRatio, innerWidth < 700 ? 1.25 : 1.75));
    renderer.setSize(b.width, b.height, false);
    camera.aspect = b.width / b.height;
    camera.fov = 42;
    updateCamera();
    camera.updateProjectionMatrix();
    wake();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) wake();
    else {
      cancelAnimationFrame(frame);
      frame = 0;
    }
  });
  io.observe(host);
  const visibility = () => {
    if (document.hidden) {
      cancelAnimationFrame(frame);
      frame = 0;
    } else wake();
  };
  const lost = (e: Event) => {
    e.preventDefault();
    cancelAnimationFrame(frame);
    frame = 0;
  };
  renderer.domElement.addEventListener("webglcontextlost", lost);
  renderer.domElement.addEventListener("webglcontextrestored", wake);
  document.addEventListener("visibilitychange", visibility);
  host.addEventListener("wheel", wheel, { passive: false });
  host.addEventListener("pointerdown", down);
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerup", up);
  host.addEventListener("pointercancel", up);
  host.addEventListener("lostpointercapture", up);
  resize();
  return {
    inspect,
    nextLaptopProject: laptop.nextProject,
    resetLaptop() {
      yaw = Math.PI + 0.08;
      pitch = 0.46;
      zoomLevel = 1;
      laptop.setOpen(true);
      updateCamera();
      wake();
    },
    laptopFront() {
      yaw = Math.PI + 0.08;
      pitch = 0.46;
      laptop.setOpen(true);
      updateCamera();
      wake();
    },
    laptopBack() {
      yaw = 0.08;
      pitch = 0.3;
      updateCamera();
      wake();
    },
    laptopLid(value: boolean) {
      laptop.setOpen(value);
      wake();
    },
    bite,
    freshCookie,
    spillMatcha,
    clearSpills,
    zoom,
    rotate,
    resetView,
    setViewMode,
    stir,
    brew,
    addIce,
    nudge(name: DeskObject, dx: number, dz: number) {
      if (action) return;
      const g = objects[name];
      moveObject(name,g.position.x+dx,g.position.z+dz);
      settle = 1;
      wake();
    },
    reset() {
      if (action) return;
      clearSpills();
      resetView();
      for (const [key, g] of Object.entries(objects))
        g.position.copy(homes[key as DeskObject]);
      energy = 0.3;
      settle = 1;
      wake();
    },
    dispose() {
      disposed = true;
      sounds.dispose();
      finishAction();
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      host.removeEventListener("wheel", wheel);
      host.removeEventListener("pointerdown", down);
      host.removeEventListener("pointermove", move);
      host.removeEventListener("pointerup", up);
      host.removeEventListener("pointercancel", up);
      host.removeEventListener("lostpointercapture", up);
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      renderer.domElement.removeEventListener("webglcontextrestored", wake);
      scene.traverse(o => {
        if (o instanceof THREE.Mesh) {
          o.geometry.dispose();
          (Array.isArray(o.material) ? o.material : [o.material]).forEach(m =>
            m.dispose()
          );
        }
      });
      hints.forEach(h => h.el.remove());
      laptop.dispose();
      biscuitMat.dispose();
      crumbMat.dispose();
      chipMats.forEach(m => m.dispose());
      contactMats.forEach(m => m.dispose());
      disposableTextures.forEach(t => t.dispose());
      environmentMap.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
