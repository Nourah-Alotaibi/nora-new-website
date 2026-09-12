export type DeskBody = {name:string;x:number;z:number;radius:number};
export const deskRadii = {matcha:0.90,cookie:0.96,plant:0.53};
const LAPTOP={x:1.65,z:-1.45,angle:Math.PI+0.08};
function local(x:number,z:number){const dx=x-LAPTOP.x,dz=z-LAPTOP.z,c=Math.cos(LAPTOP.angle),s=Math.sin(LAPTOP.angle);return {x:c*dx-s*dz,z:s*dx+c*dz};}
function world(x:number,z:number){const c=Math.cos(LAPTOP.angle),s=Math.sin(LAPTOP.angle);return {x:LAPTOP.x+c*x+s*z,z:LAPTOP.z-s*x+c*z};}
export function onLaptopBase(x:number,z:number){const p=local(x,z);return Math.abs(p.x)<1.12 && p.z>-.20 && p.z<.72;}
function pushRectangle(x:number,z:number,r:number,cx:number,cz:number,hx:number,hz:number){
 const qx=Math.max(cx-hx,Math.min(cx+hx,x)),qz=Math.max(cz-hz,Math.min(cz+hz,z));
 const dx=x-qx,dz=z-qz,d=Math.hypot(dx,dz);
 if(d>=r)return {x,z};
 if(d>1e-7)return {x:qx+dx/d*r,z:qz+dz/d*r};
 const edges=[{d:x-(cx-hx),x:cx-hx-r,z},{d:cx+hx-x,x:cx+hx+r,z},{d:z-(cz-hz),x,z:cz-hz-r},{d:cz+hz-z,x,z:cz+hz+r}];
 edges.sort((a,b)=>a.d-b.d);return edges[0];
}
export function constrainDeskPosition(name:keyof typeof deskRadii,from:{x:number;z:number},to:{x:number;z:number},others:DeskBody[]){
 const r=deskRadii[name],distance=Math.hypot(to.x-from.x,to.z-from.z),steps=Math.max(1,Math.ceil(distance/.07));
 const obstacles=[...others,{name:'bowl',x:-.15,z:-1.6,radius:.58}].filter(b=>b.name!==name);
 const clear=(x:number,z:number)=>{
  if(Math.abs(x)>3.65-r+.001 || Math.abs(z)>2.75-r+.001)return false;
  if(obstacles.some(b=>Math.hypot(x-b.x,z-b.z)<r+b.radius+.024))return false;
  const p=local(x,z);
  const screen=pushRectangle(p.x,p.z,r+.024,0,-.79,1.27,.12);
  if(Math.hypot(screen.x-p.x,screen.z-p.z)>.001)return false;
  if(!onLaptopBase(x,z)){
   const base=pushRectangle(p.x,p.z,r+.019,0,0,1.25,.82);
   if(Math.hypot(base.x-p.x,base.z-p.z)>.001)return false;
  }
  return true;
 };
 let x=from.x,z=from.z;
 for(let step=1;step<=steps;step++){
  const previous={x,z};
  x+=(to.x-from.x)/steps;z+=(to.z-from.z)/steps;
  for(let pass=0;pass<5;pass++){
   x=Math.max(-3.65+r,Math.min(3.65-r,x));z=Math.max(-2.75+r,Math.min(2.75-r,z));
   let p=local(x,z);
   // The vertical screen is always solid; the keyboard can support an object.
   p=pushRectangle(p.x,p.z,r+.025,0,-.79,1.27,.12);
   const supported=Math.abs(p.x)<1.12 && p.z>-.20 && p.z<.72;
   if(!supported)p=pushRectangle(p.x,p.z,r+.02,0,0,1.25,.82);
   ({x,z}=world(p.x,p.z));
   // Keep the whisking bowl solid as well.
   for(const b of [...others,{name:'bowl',x:-.15,z:-1.6,radius:.58}]){
    if(b.name===name)continue;
    const dx=x-b.x,dz=z-b.z,d=Math.hypot(dx,dz),minimum=r+b.radius+.025;
    if(d<minimum){const ux=d>.0001?dx/d:1,uz=d>.0001?dz/d:0;x=b.x+ux*minimum;z=b.z+uz*minimum;}
   }
  }
  if(!clear(x,z)){x=previous.x;z=previous.z;}
 }
 return {x,z};
}
