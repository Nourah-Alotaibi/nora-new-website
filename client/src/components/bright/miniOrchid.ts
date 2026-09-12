import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

// Custom geometry studied from LEGO 10343's official assembly manual, pp. 34–40.
export function makeMiniOrchid() {
  const root = new THREE.Group();
  root.name = "Mini Orchid · 10343";
  // Median sRGB samples from the supplied photographs. Linear reflectance is
  // calibrated for the desk's warm 2.8-intensity sun and ACES exposure of 1.12.
  const plastic = (color:number, roughness=.29, reflectance=.72) => {
    const m=new THREE.MeshPhysicalMaterial({color,roughness,metalness:0,
      clearcoat:.7,clearcoatRoughness:.17,ior:1.46,specularIntensity:1,envMapIntensity:.55});
    m.color.multiplyScalar(reflectance);
    return m;
  };
  const clay=plastic(0xcf895b,.34,.65), wood=plastic(0x6e4031,.29,.8);
  const green=plastic(0x087443,.2,.88), leafGreen=plastic(0x126342,.22,.9);
  const lime=plastic(0xafc95c,.32);
  const peach=plastic(0xf6cab2,.28,.66), pink=plastic(0xf68fca,.21,.74);
  const magenta=plastic(0xce398f,.23,.78), orange=plastic(0xfb791c,.19,.8);
  const ivory=plastic(0xfff1df,.25,.88), recess=plastic(0xb78968,.43,.68);
  // Counter the warm environment's color compression without tinting the rest of the desk.
  peach.color.multiply(new THREE.Color().setRGB(1.15,.72,.58));
  pink.color.multiply(new THREE.Color().setRGB(1.0,.64,.91));
  orange.color.multiply(new THREE.Color().setRGB(1.0,.62,.45));
  const clipMat=plastic(0x202b25,.38), gold=new THREE.MeshStandardMaterial({
    color:0xc5a252,metalness:.72,roughness:.27,envMapIntensity:.9,
  });
  // Extruded faces and side walls use separate, related colors to reveal actual
  // molded thickness at desk scale, without painted outlines around the flowers.
  const moldedEdge=(face:THREE.MeshPhysicalMaterial, shade:number) => {
    const side=face.clone();side.color.multiplyScalar(shade);side.roughness=.32;
    side.clearcoat=.32;return side;
  };
  const peachEdge=moldedEdge(peach,.72), leafEdge=moldedEdge(leafGreen,.66);
  const pinkEdge=moldedEdge(pink,.72), orangeEdge=moldedEdge(orange,.73);
  function mesh(parent: THREE.Object3D, geo: THREE.BufferGeometry, mat: THREE.Material | THREE.Material[], x=0,y=0,z=0) {
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

  // Dense closed shells give the molded pieces real cross-sectional curvature.
  // Unlike a bent outline extrusion, every point across the face follows the cup.
  function moldedBlade(length:number,width:number,kind:"leaf"|"petal"|"throat") {
    const rows=36,cols=20,stride=cols+1,count=(rows+1)*stride;
    const positions:number[]=[],indices:number[]=[];
    const isLeaf=kind==="leaf",thickness=isLeaf?.025:.022;
    // LEGO's peach pieces have a defined shoulder and tapering shield silhouette.
    // Short softened joins retain the molded corners rather than an oval outline.
    const shieldProfile=[[0,.055],[.12,.35],[.25,.50],[.55,.32],[1,.003]];
    const shieldWidth=(t:number)=>{
      const end=shieldProfile.findIndex(p=>p[0]>=t);
      if(end<=0)return shieldProfile[0][1];
      const [a,wa]=shieldProfile[end-1],[b,wb]=shieldProfile[end];
      const u=(t-a)/(b-a),blend=.78*u+.22*u*u*(3-2*u);
      return wa+(wb-wa)*blend;
    };
    for(let side=0;side<2;side++)for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
      const t=j/rows,u=i/cols*2-1;
      const outline=isLeaf
        ? .045*(1-t)+.5*Math.pow(Math.sin(Math.PI*t),.55)
        : kind==="petal" ? shieldWidth(t) : .055*(1-t)+.56*Math.pow(Math.sin(Math.PI*t),.78)*(1.16-.36*t);
      const halfWidth=width*Math.max(.003,outline);
      const x=u*halfWidth+(kind==="petal"?width*.08*t*t:0);
      const bend=isLeaf?.16*Math.sin(t*Math.PI*.85)-.06*t*t:.09*t*t;
      const cup=isLeaf?.045*(1-u*u)*Math.sin(Math.PI*t):(kind==="petal"?.043:.066)*u*u*Math.sin(Math.PI*t);
      const crown=(side===0?1:-1)*thickness*.5*Math.sqrt(1-.72*u*u);
      positions.push(x,length*t,bend+cup+crown);
    }
    for(let side=0;side<2;side++)for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
      const a=side*count+j*stride+i,b=a+1,c=a+stride,d=c+1;
      if(side===0)indices.push(a,b,c,b,d,c);else indices.push(a,c,b,b,c,d);
    }
    const faceCount=indices.length;
    const edge=(a:number,b:number)=>indices.push(a,a+count,b,b,a+count,b+count);
    for(let i=0;i<cols;i++){edge(i,i+1);edge(rows*stride+i+1,rows*stride+i);}
    for(let j=0;j<rows;j++){edge((j+1)*stride,j*stride);edge(j*stride+cols,(j+1)*stride+cols);}
    // Separate rim normals keep the molded face-to-edge break crisp while
    // preserving the smooth curved faces and their broad glossy highlights.
    const rimVertices=new Map<number,number>();
    for(let i=faceCount;i<indices.length;i++) {
      const source=indices[i];let rim=rimVertices.get(source);
      if(rim===undefined){rim=positions.length/3;positions.push(positions[source*3],positions[source*3+1],positions[source*3+2]);rimVertices.set(source,rim);}
      indices[i]=rim;
    }
    const geometry=new THREE.BufferGeometry();
    geometry.setAttribute("position",new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);
    geometry.addGroup(0,faceCount,0);geometry.addGroup(faceCount,indices.length-faceCount,1);
    geometry.computeVertexNormals();return geometry;
  }
  // Two spreading glossy leaves on separate hinged mounts.
  [[-.08,.66,.02,-.08,1.01,1.08,.29],[.06,.66,-.08,-.17,-.53,1.15,.37]].forEach(([x,y,z,rx,rz,len,w])=>{
    const g=new THREE.Group();root.add(g);g.position.set(x,y,z);g.rotation.set(rx,0,rz);
    mesh(g,moldedBlade(len,w,"leaf"),[leafGreen,leafEdge]);
    const seamPoints=[];
    for(let i=0;i<=24;i++){const t=.05+i/24*.9;seamPoints.push(new THREE.Vector3(0,len*t,.16*Math.sin(t*Math.PI*.85)-.06*t*t+.045*Math.sin(Math.PI*t)+.013));}
    mesh(g,new THREE.TubeGeometry(new THREE.CatmullRomCurve3(seamPoints),32,.0018,4,false),leafGreen);
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
  function petal(length:number,width:number, rounded=false) {
    return moldedBlade(length,width,rounded?"throat":"petal");
  }
  const bloomPositions=[[-.28,1.24,.15],[.20,1.55,.17],[.08,2.02,.13],[.64,2.06,.19],[1.00,2.43,.08]];
  bloomPositions.forEach(([x,y,z],i)=>{
    const anchor=stalk[i<2?2:i<4?4:5];rod(root,anchor,new THREE.Vector3(x,y,z),.024,green);
    const bloom=new THREE.Group();root.add(bloom);bloom.position.set(x,y,z);bloom.rotation.set(-.13,.05+(i%2)*.19,(i%2?-.12:.10));bloom.scale.setScalar(1.08);
    const back=mesh(bloom,new THREE.TorusGeometry(.09,.012,8,24),gold,0,0,-.035);
    back.name="Flower connector loop";
    [0,1.32,-1.32].forEach((a,petalIndex)=>{const m=mesh(bloom,petal(petalIndex===0?.265:.245,petalIndex===0?.19:.215),[peach,peachEdge],-Math.sin(a)*.052,Math.cos(a)*.052,-.012);m.rotation.z=a;m.rotation.x=petalIndex===0?-.22:.12;m.rotation.y=petalIndex===1?-.22:petalIndex===2?.22:0;
      const mount=new THREE.Group();bloom.add(mount);mount.rotation.z=a;
      mesh(mount,new RoundedBoxGeometry(.065,.073,.044,2,.005),recess,0,.035,-.032);
      const peg=mesh(mount,new THREE.CylinderGeometry(.016,.016,.055,12),peach,0,.045,-.074);peg.rotation.x=Math.PI/2;
    });
    [-2.48,2.48].forEach(a=>{
      const sepal=new THREE.Group();bloom.add(sepal);sepal.rotation.z=a;
      const frameShape=new THREE.Shape();frameShape.moveTo(-.025,0);
      frameShape.quadraticCurveTo(-.076,.085,0,.22);
      frameShape.quadraticCurveTo(.076,.085,.025,0);frameShape.closePath();
      const lowerHole=new THREE.Path();lowerHole.moveTo(-.023,.032);lowerHole.lineTo(.023,.032);lowerHole.lineTo(.025,.088);lowerHole.lineTo(-.025,.088);lowerHole.closePath();
      const upperHole=new THREE.Path();upperHole.moveTo(-.022,.11);upperHole.lineTo(.022,.11);upperHole.quadraticCurveTo(.015,.148,0,.182);upperHole.quadraticCurveTo(-.015,.148,-.022,.11);upperHole.closePath();
      frameShape.holes.push(lowerHole,upperHole);
      const frame=mesh(sepal,new THREE.ExtrudeGeometry(frameShape,{depth:.026,bevelEnabled:true,bevelSize:.004,bevelThickness:.004,bevelSegments:2,curveSegments:12}),[peach,peachEdge],0,0,.044);
      frame.name="Recessed LEGO sepal frame";
      // Set the backing behind the frame so lighting resolves the socket depth.
      const backing=frameShape.clone();backing.holes=[];
      mesh(sepal,new THREE.ExtrudeGeometry(backing,{depth:.008,bevelEnabled:false,curveSegments:12}),recess,0,0,.016);
      const hole=mesh(sepal,new THREE.TorusGeometry(.014,.005,6,16),peach,0,.056,.043);hole.name="Molded sepal socket";

    });
    [-.60,0,.60].forEach(a=>{
      const throat=new THREE.Group();bloom.add(throat);throat.position.set(0,.007,.056);throat.rotation.z=a;
      mesh(throat,petal(.135,.083,true),[pink,pinkEdge]);
      const ridge=new THREE.CatmullRomCurve3([new THREE.Vector3(0,.028,.028),new THREE.Vector3(0,.075,.053),new THREE.Vector3(0,.116,.063)]);
      mesh(throat,new THREE.TubeGeometry(ridge,12,.006,8,false),pink);
    });
    mesh(bloom,new THREE.TorusGeometry(.036,.013,8,24),magenta,0,.009,.091);
    const pin=mesh(bloom,new THREE.CylinderGeometry(.014,.014,.10,16),ivory,0,.008,.145);pin.rotation.x=Math.PI/2;
    const nozzle=mesh(bloom,new THREE.TorusGeometry(.010,.004,6,18),ivory,0,.008,.198);
    nozzle.name="Hollow ivory flower column";
    const crossbar=mesh(bloom,new THREE.CylinderGeometry(.010,.010,.064,12),ivory,0,.008,.135);crossbar.rotation.z=Math.PI/2;
    // The orange lip is a three-lobed molded piece with rounded, glossy ends.
    const lipShape=new THREE.Shape();lipShape.moveTo(-.025,.018);
    lipShape.bezierCurveTo(-.11,.025,-.10,-.055,-.047,-.057);
    lipShape.bezierCurveTo(-.045,-.115,.045,-.115,.047,-.057);
    lipShape.bezierCurveTo(.10,-.055,.11,.025,.025,.018);lipShape.closePath();
    const lip=mesh(bloom,new THREE.ExtrudeGeometry(lipShape,{depth:.019,bevelEnabled:true,bevelSize:.008,bevelThickness:.006,bevelSegments:3,curveSegments:12}),[orange,orangeEdge],0,-.026,.135);
    lip.rotation.x=.65;lip.scale.set(.70,.70,1);
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
