'use client'

import { useEffect, useRef } from 'react'

type Strand = { x: number; y: number; anchorX: number; anchorY: number; born: number; life: number }
type Particle = { x: number; y: number; vx: number; vy: number; life: number }

export class WebStringPhysics {
  targetX: number; targetY: number; vx = 0; vy = 0; stiffness = .15; damping = .82
  constructor(x:number,y:number){this.targetX=x;this.targetY=y}
  update(x:number,y:number){this.vx=(this.vx+(x-this.targetX)*this.stiffness)*this.damping;this.vy=(this.vy+(y-this.targetY)*this.stiffness)*this.damping;this.targetX+=this.vx;this.targetY+=this.vy}
}

function webSound(){const AC=window.AudioContext||(window as typeof window&{webkitAudioContext:typeof AudioContext}).webkitAudioContext;if(!AC)return;const c=new AC(),o=c.createOscillator(),g=c.createGain();o.type='sawtooth';o.frequency.setValueAtTime(950,c.currentTime);o.frequency.exponentialRampToValueAtTime(120,c.currentTime+.12);g.gain.setValueAtTime(.045,c.currentTime);g.gain.exponentialRampToValueAtTime(.001,c.currentTime+.14);o.connect(g).connect(c.destination);o.start();o.stop(c.currentTime+.14)}

export function WebCanvas(){
 const canvasRef=useRef<HTMLCanvasElement>(null); const cursorRef=useRef<HTMLDivElement>(null)
 useEffect(()=>{const canvas=canvasRef.current,cursor=cursorRef.current;if(!canvas||!cursor)return;const ctx=canvas.getContext('2d');if(!ctx)return
  const pointer={x:innerWidth/2,y:innerHeight/2},smooth={x:pointer.x,y:pointer.y};const springs=[0,1,2,3].map(()=>new WebStringPhysics(pointer.x,pointer.y));const strands:Strand[]=[];let frame=0,soundIndex=0
  const resize=()=>{const d=Math.min(devicePixelRatio,2);canvas.width=innerWidth*d;canvas.height=innerHeight*d;ctx.setTransform(d,0,0,d,0,0)}
  const move=(e:PointerEvent)=>{pointer.x=e.clientX;pointer.y=e.clientY}
  const click=(e:PointerEvent)=>{const anchors=[[0,0],[innerWidth,0],[0,innerHeight],[innerWidth,innerHeight],[innerWidth/2,0],[innerWidth/2,innerHeight]];const a=anchors.reduce((p,n)=>Math.hypot(e.clientX-n[0],e.clientY-n[1])<Math.hypot(e.clientX-p[0],e.clientY-p[1])?n:p);strands.push({x:e.clientX,y:e.clientY,anchorX:a[0],anchorY:a[1],born:performance.now(),life:900});const words=['THWHIP!','BANG!','ZAP!'];const pop=document.createElement('span');pop.className='thwip-pop';pop.textContent=words[soundIndex++%words.length];pop.style.left=`${e.clientX}px`;pop.style.top=`${e.clientY}px`;document.body.appendChild(pop);setTimeout(()=>pop.remove(),650);document.querySelector('.hero-title')?.classList.add('impact-shake');setTimeout(()=>document.querySelector('.hero-title')?.classList.remove('impact-shake'),350);webSound()}
  const draw=(time:number)=>{ctx.clearRect(0,0,innerWidth,innerHeight);smooth.x+=(pointer.x-smooth.x)*.15;smooth.y+=(pointer.y-smooth.y)*.15;cursor.style.transform=`translate3d(${smooth.x}px,${smooth.y}px,0)`;const anchors=[[0,0],[innerWidth,0],[0,innerHeight],[innerWidth,innerHeight]];springs.forEach((s,i)=>{s.update(pointer.x,pointer.y);const a=anchors[i];ctx.strokeStyle='rgba(0,240,255,.25)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a[0],a[1]);const mx=(a[0]+s.targetX)/2,my=(a[1]+s.targetY)/2;ctx.quadraticCurveTo(mx+(s.vy*2),my-(s.vx*2),s.targetX,s.targetY);ctx.stroke()});for(let i=strands.length-1;i>=0;i--){const s=strands[i],age=(time-s.born)/s.life;if(age>1){strands.splice(i,1);continue}ctx.globalAlpha=1-age;ctx.strokeStyle='#fdf1e1';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(s.anchorX,s.anchorY);ctx.quadraticCurveTo((s.anchorX+s.x)/2+Math.sin(age*18)*24,(s.anchorY+s.y)/2,s.x,s.y);ctx.stroke();ctx.globalAlpha=1}frame=requestAnimationFrame(draw)}
  resize();addEventListener('resize',resize);addEventListener('pointermove',move);addEventListener('pointerdown',click);frame=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize);removeEventListener('pointermove',move);removeEventListener('pointerdown',click)}
 },[])
 return <><canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[999] size-full"/><div ref={cursorRef} aria-hidden="true" className="web-cursor"><i/><b/></div></>
}

export function ElasticWebLab(){
 const ref=useRef<HTMLCanvasElement>(null)
 useEffect(()=>{const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;let point={x:300,y:180},rest={...point},drag=false,frame=0;let vx=0,vy=0;const particles:Particle[]=[]
  const resize=()=>{const r=canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio,2);canvas.width=r.width*d;canvas.height=r.height*d;ctx.setTransform(d,0,0,d,0,0);rest={x:r.width*.72,y:r.height*.52};if(!drag)point={...rest}}
  const locate=(e:PointerEvent)=>{const r=canvas.getBoundingClientRect();point={x:e.clientX-r.left,y:e.clientY-r.top}}
  const down=(e:PointerEvent)=>{if(Math.hypot(e.offsetX-point.x,e.offsetY-point.y)<40){drag=true;canvas.setPointerCapture(e.pointerId)}};const move=(e:PointerEvent)=>{if(drag)locate(e)};const up=()=>{if(!drag)return;drag=false;vx=(rest.x-point.x)*.12;vy=(rest.y-point.y)*.12;for(let i=0;i<22;i++)particles.push({x:point.x,y:point.y,vx:(Math.random()-.5)*7,vy:(Math.random()-.5)*7,life:1})}
  const draw=()=>{const r=canvas.getBoundingClientRect();if(!drag){vx+=(rest.x-point.x)*.045;vy+=(rest.y-point.y)*.045;vx*=.86;vy*=.86;point.x+=vx;point.y+=vy}ctx.clearRect(0,0,r.width,r.height);ctx.strokeStyle='rgba(0,240,255,.12)';ctx.lineWidth=1;for(let x=0;x<r.width;x+=32){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,r.height);ctx.stroke()}for(let y=0;y<r.height;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(r.width,y);ctx.stroke()}ctx.strokeStyle='#00f0ff';ctx.shadowColor='#00f0ff';ctx.shadowBlur=12;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(25,r.height/2);ctx.quadraticCurveTo(r.width/2,r.height/2+(point.y-r.height/2)*.55,point.x,point.y);ctx.stroke();ctx.fillStyle='#e62429';ctx.shadowColor='#e62429';ctx.shadowBlur=22;ctx.beginPath();ctx.arc(point.x,point.y,12,0,Math.PI*2);ctx.fill();particles.forEach((p,i)=>{p.x+=p.vx;p.y+=p.vy;p.life-=.025;ctx.globalAlpha=Math.max(0,p.life);ctx.fillStyle='#fdf1e1';ctx.fillRect(p.x,p.y,2,2);if(p.life<=0)particles.splice(i,1)});ctx.globalAlpha=1;ctx.shadowBlur=0;frame=requestAnimationFrame(draw)}
  resize();addEventListener('resize',resize);canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);frame=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(frame);removeEventListener('resize',resize)}
 },[])
 return <canvas ref={ref} aria-label="Drag and release the red web node" className="h-96 w-full touch-none"/>
}
