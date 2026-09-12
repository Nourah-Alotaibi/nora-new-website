import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import stickers from "./laptopStickers.json";
import { laptopProjects, keyboardRows, type LaptopKey } from "./laptopProjects";

/** One hinged laptop. Exterior decals are individually configurable in laptopStickers.json. */
export function makeLaptop(wake: () => void, onProject: (index: number) => void) {
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
    mat: THREE.Material | THREE.Material[] = metal,
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
  box(group, 2.47, 0.026, 1.61, 0, 0.009, 0, materialMetal(0x434952), 0.02);
  box(group, 2.22, 0.01, 0.86, -0.035, 0.095, -0.245, black);
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x191c21, roughness: 0.58 });
  const keys: THREE.Mesh[] = [];
  const keyLabels: string[] = [];
  function materialMetal(color: number) {
    return new THREE.MeshStandardMaterial({ color, metalness: 0.65, roughness: 0.4 });
  }
  function keyIcon(c: CanvasRenderingContext2D, icon: string) {
    c.save(); c.translate(68, 49); c.strokeStyle = c.fillStyle = "#f6f6f0";
    c.lineWidth = 4; c.lineCap = "round";
    const line = (x:number,y:number,a:number,b:number) => {c.beginPath();c.moveTo(x,y);c.lineTo(a,b);c.stroke();};
    if (icon.startsWith("sun")) {
      c.beginPath();c.arc(0,0,9,0,Math.PI*2);c.stroke();
      for(let i=0;i<8;i++){const a=i*Math.PI/4;line(Math.cos(a)*15,Math.sin(a)*15,Math.cos(a)*21,Math.sin(a)*21);}
    } else if (icon === "windows") {
      for(let x=0;x<2;x++)for(let y=0;y<2;y++)c.fillRect(-20+x*22,-20+y*22,18,18);
    } else if (icon.startsWith("volume") || icon === "mute") {
      c.beginPath();c.moveTo(-20,-6);c.lineTo(-11,-6);c.lineTo(0,-16);c.lineTo(0,16);c.lineTo(-11,6);c.lineTo(-20,6);c.closePath();c.stroke();
      if(icon==='mute'){line(8,-10,23,10);line(8,10,23,-10);}
      else {c.beginPath();c.arc(0,0,14,-.7,.7);c.stroke();if(icon==='volume-high'){c.beginPath();c.arc(0,0,23,-.7,.7);c.stroke();}}
    } else if (icon === "wireless") {
      for(const r of [10,20,30]){c.beginPath();c.arc(0,17,r,-2.3,-.84);c.stroke();}c.beginPath();c.arc(0,13,3,0,7);c.fill();
    } else if (icon === "mic") {
      c.beginPath();c.roundRect(-7,-21,14,29,7);c.stroke();c.beginPath();c.arc(0,0,14,0,Math.PI);c.stroke();line(0,14,0,22);line(-8,22,8,22);line(-23,-22,23,22);
    } else if (icon === "camera") {
      c.strokeRect(-25,-16,50,32);c.beginPath();c.arc(0,0,9,0,7);c.stroke();
    } else if (icon === "display") {c.strokeRect(-24,-17,48,29);line(0,12,0,20);line(-13,20,13,20);}
    else if (icon === "keyboard") {c.strokeRect(-24,-13,48,26);for(let i=0;i<5;i++)line(-17+i*8,-5,-17+i*8,1);line(-13,7,13,7);}
    else {c.strokeRect(-21,-14,42,28);line(-12,-6,-12,6);line(0,-6,0,6);line(12,-6,12,6);}
    c.restore();
  }
  function addKey(spec: LaptopKey, x: number, z: number, width: number, depth: number) {
    const k = box(group, width, 0.024, depth, x, 0.117, z, keyMat, 0.009);
    k.userData.keyIndex = keys.length;
    k.userData.homeY = k.position.y;
    keys.push(k); keyLabels.push(spec.label);
    const label = canvasTexture(c => {
      c.fillStyle="#20242a";c.fillRect(0,0,256,160);c.fillStyle="#f6f6f0";c.textBaseline="middle";
      if(spec.icon) keyIcon(c,spec.icon);
      c.textAlign = spec.icon ? "right" : "center";
      c.font = `${spec.label.length > 2 ? 36 : 66}px Arial, sans-serif`;
      if(spec.label!=="Space" && spec.icon!=="windows") c.fillText(spec.label, spec.icon ? 230 : 128, spec.upper ? 111 : spec.icon ? 116 : 83);
      if(spec.upper){c.font="42px Arial, sans-serif";c.textAlign="center";c.fillText(spec.upper,128,43);}
    },256,160);
    // Explicit top-face UVs: left-to-right English, top of each label toward the hinge.
    const top=k.geometry.groups[2],pos=k.geometry.attributes.position,uv=k.geometry.attributes.uv;
    for(let i=top.start;i<top.start+top.count;i++)uv.setXY(i,pos.getX(i)/width+.5,.5-pos.getZ(i)/depth);
    label.anisotropy=8;
    const legendMaterial=new THREE.MeshBasicMaterial({map:label,toneMapped:false});
    k.material=[keyMat,keyMat,legendMaterial,keyMat,keyMat,keyMat];

  }
  keyboardRows.forEach((row, r) => {
    const total = row.reduce((n,k)=>n+(k.width||1),0);
    const unit=2.12/total;let left=-1.04;
    const z=-0.61+r*0.135;
    row.forEach(spec=>{
      const width=(spec.width||1)*unit;
      if(spec.split){
        addKey(spec,left+width/2,z-0.028,width-0.018,0.047);
        addKey({label:"▼"},left+width/2,z+0.028,width-0.018,0.047);
      } else addKey(spec,left+width/2,z,width-0.018,r===0?0.078:0.111);
      left+=width;
    });
  });
  box(group, 1.03, 0.005, 0.46, -0.02, 0.093, 0.47, materialMetal(0x424850), 0.02);
  box(group, 1.016, 0.006, 0.446, -0.02, 0.097, 0.47, materialMetal(0x666b74), 0.017);
  const power = new THREE.Mesh(new THREE.CylinderGeometry(0.051,0.051,0.007,36),materialMetal(0x414650));
  power.position.set(1.145,0.099,-0.54);group.add(power);
  const powerFace=new THREE.Mesh(new THREE.CylinderGeometry(0.045,0.045,0.008,36),metal);
  powerFace.position.set(1.145,0.102,-0.54);group.add(powerFace);
  box(group, 2.15, 0.055, 0.065, 0, 0.112, -0.758, materialMetal(0x3a3e44), 0.02);
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
  const screenMat = new THREE.MeshBasicMaterial({ color:0xffffff, toneMapped:false });
  const panel = new THREE.Mesh(new THREE.PlaneGeometry(2.24, 1.32), screenMat);
  panel.position.set(0, 0.86, 0.047);lid.add(panel);
  let projectIndex=0, disposed=false;
  const imageAspects = laptopProjects.map(()=>2.24/1.32);
  const projectTextures = laptopProjects.map((project,index)=>{
    if(project.image){
      const t = new THREE.TextureLoader().load(project.image,loaded=>{
        if(disposed){loaded.dispose();return;}
        imageAspects[index]=loaded.image.width/loaded.image.height;
        if(projectIndex===index) fitScreen(index);
        wake();
      });
      t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=16;textures.push(t);return t;
    }
    return canvasTexture(c=>{
      c.fillStyle="#11151c";c.fillRect(0,0,1600,1000);
      c.textAlign="center";c.fillStyle="#ecece6";c.font="56px Arial";
      c.fillText(project.title,800,440);c.fillStyle="#aeb8b9";c.font="30px Arial";
      c.fillText("Screenshot not supplied yet",800,515);
      c.font="24px Arial";c.fillText("Temporary placeholder",800,565);
    });
  });
  function fitScreen(index:number){
    const aspect=imageAspects[index], frame=2.24/1.32;
    panel.scale.set(aspect>frame?1:aspect/frame,aspect>frame?frame/aspect:1,1);
    screenMat.map=projectTextures[index];screenMat.needsUpdate=true;
  }
  fitScreen(0);
  function pressKey(index:number){
    const key=keys[index];if(!key)return;
    projectIndex=(projectIndex+1)%laptopProjects.length;
    fitScreen(projectIndex);
    onProject(projectIndex);
    key.position.y=key.userData.homeY-0.012;
    wake();
  }
  const bezelBrand=canvasTexture(c=>{c.clearRect(0,0,800,100);c.fillStyle="#c8cbd0";c.font="bold 60px Arial";c.textAlign="center";c.fillText("HUAWEI",400,74);},800,100);
  const frontBrand = new THREE.Mesh(new THREE.PlaneGeometry(0.32,0.04),new THREE.MeshBasicMaterial({map:bezelBrand,transparent:true,toneMapped:false}));
  frontBrand.position.set(0,0.121,0.049);lid.add(frontBrand);
  function palmSticker(texture:THREE.Texture,w:number,h:number,x:number,z:number,angle=0){
    const sticker=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:texture,transparent:true,toneMapped:false,depthWrite:false}));
    sticker.rotation.set(-Math.PI/2,0,angle);sticker.position.set(x,0.104,z);group.add(sticker);
  }
  const pick=canvasTexture(c=>{
    c.clearRect(0,0,400,480);c.beginPath();c.moveTo(200,25);c.bezierCurveTo(250,125,360,235,348,333);c.bezierCurveTo(329,455,70,455,52,333);c.bezierCurveTo(40,235,150,125,200,25);c.closePath();
    const grad=c.createLinearGradient(0,0,400,400);grad.addColorStop(0,"#78aaa7");grad.addColorStop(.4,"#8d69aa");grad.addColorStop(1,"#b883b6");c.fillStyle=grad;c.fill();c.strokeStyle="#e9d0d5";c.lineWidth=10;c.stroke();
    c.fillStyle="#fff5ed";c.textAlign="center";c.font="italic bold 80px Arial";c.fillText("PICK",200,290);c.font="22px Arial";c.fillText("DAILY",200,323);
  },400,480);
  palmSticker(pick,0.16,0.20,-1.155,-0.68,-0.3);
  const intel=canvasTexture(c=>{
    const grad=c.createLinearGradient(0,0,300,340);grad.addColorStop(0,"#1456aa");grad.addColorStop(.6,"#198fcd");grad.addColorStop(1,"#65d2d7");c.fillStyle=grad;c.fillRect(0,0,300,340);c.fillStyle="#fff";c.font="37px Arial";c.fillText("intel",22,55);c.font="65px Arial";c.fillText("CORE",20,160);c.font="50px Arial";c.fillText("i5",222,313);
  },300,340);
  palmSticker(intel,0.18,0.20,0.72,0.40);
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
    keys,
    keyLabels,
    screenPosition() { return panel.getWorldPosition(new THREE.Vector3()); },
    pressKey,
    nextProject() { pressKey(keyLabels.indexOf("Space")); },
    keyFromObject(object: THREE.Object3D) {
      let current:THREE.Object3D|null=object;
      while(current && current!==group){
        if(typeof current.userData.keyIndex==="number") return current.userData.keyIndex as number;
        current=current.parent;
      }
      return null;
    },
    reset() {
      target = 68;
    },
    setOpen(value: boolean) {
      target = value ? 108 : 0;
    },
    update(dt: number, reduced: boolean) {
      let keysMoving=false;
      keys.forEach(key=>{
        const home=key.userData.homeY;
        key.position.y=reduced?home:THREE.MathUtils.damp(key.position.y,home,22,dt);
        if(Math.abs(key.position.y-home)>0.0001)keysMoving=true;
      });
      angle = reduced ? target : THREE.MathUtils.damp(angle, target, 9, dt);
      lid.rotation.x = Math.PI / 2 - (angle * Math.PI) / 180;
      return Math.abs(angle - target) > 0.03 || keysMoving;
    },
    dispose() {
      disposed=true;
      textures.forEach(t => t.dispose());
    },
  };
}
