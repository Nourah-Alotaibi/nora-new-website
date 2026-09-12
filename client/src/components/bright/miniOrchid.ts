import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Custom geometry studied from LEGO 10343's official assembly manual, pp. 34–40.
export function makeMiniOrchid() {
  const root = new THREE.Group();
  root.name = "Mini Orchid · 10343";
  const plastic = (color: number, roughness = .26) => new THREE.MeshPhysicalMaterial({
    color, roughness, metalness: 0, clearcoat: .52, clearcoatRoughness: .21,
  });
  const clay = plastic(0xd7a077, .4), wood = plastic(0x774325, .36);
  const green = plastic(0x064f32), lime = plastic(0x94b839);
  const peach = plastic(0xf6ce9f), pink = plastic(0xe899c8);
  const magenta = plastic(0xa74890), orange = plastic(0xb95717);
  const ivory = plastic(0xfff1d9), recess = plastic(0xc29165, .5);
  const clipMat = plastic(0x28312c), gold = new THREE.MeshStandardMaterial({color:0xcba554, metalness:.68, roughness:.28});
  function mesh(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material, x=0,y=0,z=0) {
    const m=new THREE.Mesh(geo,mat); m.position.set(x,y,z); m.castShadow=m.receiveShadow=true; parent.add(m); return m;
  }
  function rod(parent: THREE.Object3D, a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: THREE.Material) {
    const m=mesh(parent,new THREE.CylinderGeometry(radius,radius,a.distanceTo(b),12),mat);
    m.position.copy(a).add(b).multiplyScalar(.5);
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),b.clone().sub(a).normalize()); return m;
  }
  function ring(parent: THREE.Object3D, radius:number, tube:number, mat:THREE.Material, x:number,y:number,z:number) {
    const m=mesh(parent,new THREE.TorusGeometry(radius,tube,8,32),mat,x,y,z);m.rotation.x=Math.PI/2;return m;
  }
  // Four-piece turned bowl and wood-effect foot, with separate gold belt tiles.
  const bowlProfile=[[.22,.17],[.29,.19],[.36,.25],[.415,.34],[.438,.45],[.44,.58],[.423,.63],[.35,.66],[.30,.64],[.30,.58]].map(([x,y])=>new THREE.Vector2(x,y));
  const smoothBowl = new THREE.SplineCurve(bowlProfile).getPoints(64);
  for(let i=0;i<4;i++) mesh(root,new THREE.LatheGeometry(smoothBowl,32,i*Math.PI/2+.004,Math.PI/2-.008),clay);
  mesh(root,new THREE.CylinderGeometry(.435,.40,.085,64),wood,0,.115,0);
  ring(root,.403,.026,wood,0,.16,0);
  for(let i=0;i<4;i++) {
    const a=i*Math.PI/2+Math.PI/4;
    const foot=mesh(root,new THREE.TorusGeometry(.07,.032,8,18,Math.PI*1.5),wood,Math.sin(a)*.40,.067,Math.cos(a)*.40);
    foot.rotation.y=a;foot.rotation.z=-.4;
  }
  for(let i=0;i<16;i++) {
    const a=i*Math.PI/8;
    const belt=mesh(root,new THREE.CylinderGeometry(.444,.444,.065,4,1,true,a+.005,Math.PI/8-.01),gold,0,.52,0);
    belt.name="Gold belt tile";
    const notch=mesh(root,new THREE.BoxGeometry(.026,.019,.024),wood,Math.sin(a)*.432,.572,Math.cos(a)*.432);notch.rotation.y=a;
  }
  mesh(root,new THREE.CylinderGeometry(.30,.30,.02,40),wood,0,.622,0);
  for(let i=0;i<15;i++) {const a=i*2.39996,r=.08+(i%3)*.071; mesh(root,new THREE.CylinderGeometry(.031,.031,.025,10),wood,Math.sin(a)*r,.648,Math.cos(a)*r);}

  // Four broad molded leaves: two tall blades, two low horizontal pieces.
  function leaf(length:number,width:number) {
    const shape=new THREE.Shape();shape.moveTo(-width*.15,0);
    shape.lineTo(-width*.36,length*.24);
    shape.bezierCurveTo(-width*.55,length*.61,-width*.53,length*.87,-width*.22,length*.97);
    shape.quadraticCurveTo(0,length*1.04,width*.22,length*.97);
    shape.bezierCurveTo(width*.53,length*.87,width*.55,length*.61,width*.36,length*.24);
    shape.lineTo(width*.15,0);shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.022,bevelEnabled:true,bevelThickness:.011,bevelSize:.012,bevelSegments:3,curveSegments:16,steps:1});
    const pos=geo.attributes.position;
    for(let i=0;i<pos.count;i++){const t=pos.getY(i)/length;pos.setZ(i,pos.getZ(i)+.12*Math.sin(t*Math.PI*.8)-Math.abs(pos.getX(i))*.19);}
    geo.computeVertexNormals();return geo;
  }
  [[-.08,.66,.02,-.18,-.8,1.04,.32],[.06,.66,-.03,.10,.46,1.13,.36],[-.05,.67,.10,1.25,-.65,.49,.29],[.10,.67,.05,1.30,1.30,.55,.30]].forEach(([x,y,z,rx,rz,len,w])=>{
    const g=new THREE.Group();root.add(g);g.position.set(x,y,z);g.rotation.set(rx,0,rz);
    mesh(g,leaf(len,w),green);
    const seam=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.02,.038),new THREE.Vector3(0,len*.5,.15),new THREE.Vector3(0,len*.95,.12)]);
    mesh(g,new THREE.TubeGeometry(seam,16,.0035,4,false),green);
    // Small mounting plate and stud under each molded leaf.
    mesh(g,new RoundedBoxGeometry(.09,.12,.035,2,.006),green,0,.05,-.025);
    const stud=mesh(g,new THREE.CylinderGeometry(.027,.027,.028,16),green,0,.07,-.052);stud.rotation.x=Math.PI/2;
  });

  const stalk=[[-.04,.65,0],[-.04,1.08,0],[.04,1.42,0],[.21,1.74,0],[.44,2.04,0],[.73,2.24,0],[1.00,2.34,0]].map(p=>new THREE.Vector3(...p as [number,number,number]));
  for(let i=0;i<stalk.length-1;i++) {
    rod(root,stalk[i],stalk[i+1],.033,green);
    const direction=stalk[i+1].clone().sub(stalk[i]);
    const collar=mesh(root,new THREE.CylinderGeometry(.041,.041,.065,16),clipMat);
    collar.position.copy(stalk[i]).addScaledVector(direction,.72);
    collar.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),direction.normalize());
    const node=mesh(root,new THREE.CylinderGeometry(.052,.052,.05,12),green,...stalk[i].toArray() as [number,number,number]);node.rotation.x=Math.PI/2;
    const socket=ring(root,.027,.009,clipMat,stalk[i].x,stalk[i].y,.033);socket.rotation.x=0;
  }
  rod(root,new THREE.Vector3(-.15,.65,-.05),new THREE.Vector3(-.15,1.98,-.05),.023,wood);
  for(let i=0;i<6;i++)ring(root,.024,.003,wood,-.15,.75+i*.20,-.05);
  [.91,1.27].forEach(y=>{const c=mesh(root,new RoundedBoxGeometry(.14,.06,.085,2,.012),clipMat,-.075,y,-.01);c.rotation.z=-.08;});

  // Three broad pointed petals, two recessed boat-shaped sepals and a pink throat.
  function petal(length:number,width:number) {
    const shape=new THREE.Shape();shape.moveTo(-width*.11,0);
    // Broad quarter-circle / shield silhouette of the actual molded LEGO petal.
    shape.quadraticCurveTo(-width*.56,length*.15,-width*.49,length*.57);
    shape.quadraticCurveTo(-width*.37,length*.84,0,length);
    shape.quadraticCurveTo(width*.37,length*.84,width*.49,length*.57);
    shape.quadraticCurveTo(width*.56,length*.15,width*.11,0);shape.closePath();
    const geo=new THREE.ExtrudeGeometry(shape,{depth:.022,bevelEnabled:true,bevelSize:.005,bevelThickness:.005,bevelSegments:2,curveSegments:14,steps:1});
    const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const t=pos.getY(i)/length;pos.setZ(i,pos.getZ(i)+.055*t*t);}geo.computeVertexNormals();return geo;
  }
  const bloomPositions=[[-.25,1.32,.11],[.17,1.49,.12],[.16,1.98,.09],[.58,2.08,.12],[.89,2.37,.05]];
  bloomPositions.forEach(([x,y,z],i)=>{
    const anchor=stalk[i<2?2:i<4?4:5];rod(root,anchor,new THREE.Vector3(x,y,z),.024,green);
    const bloom=new THREE.Group();root.add(bloom);bloom.position.set(x,y,z);bloom.rotation.set(-.22,.18+(i%2)*.15,(i%2?-.1:.08));
    const back=mesh(bloom,new THREE.TorusGeometry(.09,.012,8,24),gold,0,0,-.035);
    back.name="Flower connector loop";
    [0,1.20,-1.20].forEach(a=>{const m=mesh(bloom,petal(.29,.245),peach,0,0,0);m.rotation.z=a;m.rotation.x=-.10;
      const mount=new THREE.Group();bloom.add(mount);mount.rotation.z=a;
      mesh(mount,new RoundedBoxGeometry(.065,.073,.044,2,.005),recess,0,.035,-.032);
      const peg=mesh(mount,new THREE.CylinderGeometry(.016,.016,.055,12),peach,0,.045,-.074);peg.rotation.x=Math.PI/2;
    });
    [-2.48,2.48].forEach(a=>{
      const sepal=new THREE.Group();bloom.add(sepal);sepal.rotation.z=a;
      mesh(sepal,petal(.22,.12),peach,0,0,.025);
      const inset=mesh(sepal,petal(.15,.072),recess,0,.023,.049);
      const rib=mesh(sepal,new THREE.BoxGeometry(.012,.13,.014),peach,0,.10,.069);rib.rotation.x=.18;
      mesh(sepal,new RoundedBoxGeometry(.08,.065,.035,2,.004),peach,0,.049,.07);
      const hole=mesh(sepal,new THREE.TorusGeometry(.018,.007,6,16),recess,0,.05,.093);hole.name="Molded sepal socket";
      inset.name="Recessed sepal underside";
    });
    [-.60,0,.60].forEach(a=>{const m=mesh(bloom,petal(.13,.09),pink,0,.007,.056);m.rotation.z=a;});
    mesh(bloom,new THREE.TorusGeometry(.036,.013,8,24),magenta,0,.009,.091);
    const pin=mesh(bloom,new THREE.CylinderGeometry(.014,.014,.10,16),ivory,0,.008,.145);pin.rotation.x=Math.PI/2;
    const nozzle=mesh(bloom,new THREE.TorusGeometry(.010,.004,6,18),ivory,0,.008,.198);
    nozzle.name="Hollow ivory flower column";
    const crossbar=mesh(bloom,new THREE.CylinderGeometry(.010,.010,.064,12),ivory,0,.008,.135);crossbar.rotation.z=Math.PI/2;
    for(let j=0;j<3;j++){const a=(j-1)*.8;const lip=mesh(bloom,petal(.105,.065),orange,0,-.036,.11);lip.rotation.set(.8,0,Math.PI+a);}
  });
  const tip=new THREE.Vector3(1.24,2.36,0);rod(root,stalk[6],tip,.016,green);
  for(let i=0;i<3;i++) {
    const a=(i-1)*1.7,end=tip.clone().add(new THREE.Vector3(.12,Math.sin(a)*.10,Math.cos(a)*.09));rod(root,tip,end,.01,green);
    const bud=mesh(root,new THREE.SphereGeometry(.046,12,8),lime,...end.toArray() as [number,number,number]);bud.scale.set(1.45,.72,.75);
  }
  for(const side of [-1,1]) {const m=mesh(root,new THREE.SphereGeometry(.06,16,10),green,1.06,2.34+side*.09,.015);m.scale.set(1.45,.67,.6);}
  root.rotation.y=.35;
  root.scale.setScalar(.9);
  return root;
}
