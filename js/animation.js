// Constellation Grid adapted from the supplied component for the existing vanilla-JS site.
// Fixed simulation steps and spatial buckets keep the spring response stable and comparisons local.
export function initField(){
 const canvas=document.querySelector('#field');if(!canvas)return;
 const hero=canvas.parentElement,ctx=canvas.getContext('2d');if(!ctx)return;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let width=0,height=0,nodes=[],frame=0,last=0,accumulator=0,visible=true,destroyed=false;
 const mouse={x:-1000,y:-1000,previousX:-1000,previousY:-1000,speed:0,active:false};
 const radius=220,connectionDistance=75;
 function resetPointer(){mouse.active=false;mouse.x=mouse.y=mouse.previousX=mouse.previousY=-1000;mouse.speed=0;}
 function rebuild(){
  const rect=canvas.getBoundingClientRect();if(!rect.width||!rect.height)return;
  if(width===rect.width&&height===rect.height&&nodes.length)return;
  width=rect.width;height=rect.height;const dpr=Math.min(devicePixelRatio||1,2);
  canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
  const spacing=width<650?72:55;nodes=[];
  for(let i=0;i<=Math.ceil(width/spacing);i++)for(let j=0;j<=Math.ceil(height/spacing);j++){
   const x=i*spacing,y=j*spacing;
   nodes.push({x,y,vx:0,vy:0,baseX:x,baseY:y,radius:1.2+Math.random()*1.2,pulse:Math.random()*Math.PI*2,label:(i*7).toString(16).toUpperCase()+':'+(j*11).toString(16).toUpperCase()});
  }
  resetPointer();restart();
 }
 function move(e){
  if(reduced.matches||e.pointerType==='touch')return;
  const r=canvas.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;
  if(x<0||y<0||x>width||y>height){resetPointer();return;}
  if(!mouse.active){mouse.previousX=x;mouse.previousY=y;}
  mouse.x=x;mouse.y=y;mouse.active=true;
 }
 function simulate(dt){
  const damping=Math.pow(.82,dt*60);
  for(const n of nodes){
   n.pulse+=dt*3;
   const dx=mouse.x-n.x,dy=mouse.y-n.y,dist=Math.hypot(dx,dy);
   if(mouse.active&&dist<radius&&dist>.01){
    const force=(1-dist/radius)*(1500+mouse.speed*150);
    n.vx-=dx/dist*force*dt;n.vy-=dy/dist*force*dt;
   }
   n.vx+=(n.baseX-n.x)*18*dt;n.vy+=(n.baseY-n.y)*18*dt;
   n.vx*=damping;n.vy*=damping;n.x+=n.vx*dt*60;n.y+=n.vy*dt*60;
  }
 }
 function paint(){
  ctx.clearRect(0,0,width,height);
  const buckets=new Map();
  for(let i=0;i<nodes.length;i++){
   const n=nodes[i],gx=Math.floor(n.x/connectionDistance),gy=Math.floor(n.y/connectionDistance),key=gx+','+gy;
   if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(i);
  }
  for(let i=0;i<nodes.length;i++){
   const n=nodes[i],gx=Math.floor(n.x/connectionDistance),gy=Math.floor(n.y/connectionDistance);
   for(let x=gx-1;x<=gx+1;x++)for(let y=gy-1;y<=gy+1;y++)for(const j of buckets.get(x+','+y)||[]){
    if(j<=i)continue;const m=nodes[j],distance=Math.hypot(n.x-m.x,n.y-m.y);if(distance>=connectionDistance)continue;
    const active=mouse.active&&Math.hypot(mouse.x-n.x,mouse.y-n.y)<radius;
    ctx.strokeStyle=active?`rgba(180,83,48,${(1-distance/connectionDistance)*.30})`:`rgba(21,21,21,${(1-distance/connectionDistance)*.18})`;
    ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(n.x,n.y);ctx.lineTo(m.x,m.y);ctx.stroke();
   }
  }
  for(const n of nodes){
   const distance=mouse.active?Math.hypot(mouse.x-n.x,mouse.y-n.y):Infinity,near=distance<radius;
   ctx.fillStyle=near?'rgba(203,88,49,.9)':`rgba(21,21,21,${.18+Math.sin(n.pulse)*.07})`;
   ctx.beginPath();ctx.arc(n.x,n.y,Math.max(.5,near?n.radius*2.2:n.radius+Math.sin(n.pulse)*.3),0,Math.PI*2);ctx.fill();
   if(distance<90){
    const ring=((n.pulse*20)%30)+4;
    ctx.strokeStyle=`rgba(203,88,49,${(1-ring/34)*.35})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(n.x,n.y,ring,0,Math.PI*2);ctx.stroke();
    ctx.font='10px Manrope, Arial, sans-serif';ctx.fillStyle='rgba(160,66,37,.8)';ctx.fillText(n.label,n.x+10,n.y-10);
   }
  }
 }
 function render(now){
  if(destroyed||!visible||document.hidden)return;
  const dt=last?Math.min(Math.max((now-last)/1000,0),.05):1/60;last=now;
  if(!reduced.matches){
   mouse.speed=mouse.active?Math.min(8,Math.hypot(mouse.x-mouse.previousX,mouse.y-mouse.previousY)/Math.max(1,dt*1000)):0;
   mouse.previousX=mouse.x;mouse.previousY=mouse.y;accumulator+=dt;
   while(accumulator>=1/120){simulate(1/120);accumulator-=1/120;}
  }
  paint();if(!reduced.matches)frame=requestAnimationFrame(render);
 }
 function restart(){cancelAnimationFrame(frame);last=0;accumulator=0;if(!destroyed&&visible&&!document.hidden)frame=requestAnimationFrame(render);}
 function preferenceChanged(){resetPointer();for(const n of nodes){n.x=n.baseX;n.y=n.baseY;n.vx=n.vy=0;}restart();}
 hero.addEventListener('pointermove',move);hero.addEventListener('pointerleave',resetPointer);
 document.addEventListener('visibilitychange',restart);reduced.addEventListener('change',preferenceChanged);
 const resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(rebuild):null;
 const intersectionObserver=typeof IntersectionObserver==='function'?new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;resetPointer();restart();}):null;
 rebuild();resizeObserver?.observe(canvas);intersectionObserver?.observe(hero);
 if(!resizeObserver)addEventListener('resize',rebuild);
 return ()=>{destroyed=true;cancelAnimationFrame(frame);resizeObserver?.disconnect();intersectionObserver?.disconnect();hero.removeEventListener('pointermove',move);hero.removeEventListener('pointerleave',resetPointer);document.removeEventListener('visibilitychange',restart);reduced.removeEventListener('change',preferenceChanged);if(!resizeObserver)removeEventListener('resize',rebuild);};
}
