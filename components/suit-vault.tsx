'use client'

import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useState, type MouseEvent } from 'react'

const suits = [
  { name: 'CLASSIC', detail: 'Red & Blue', code: '616', color: '#e62429', image: '/suits/classic.png', type: 'classic' },
  { name: 'MILES', detail: 'Morales Strike', code: '1610', color: '#ff174f', image: '/suits/miles.png', type: 'miles' },
  { name: 'IRON SPIDER', detail: 'Nanotech', code: '199999', color: '#ffd166', image: '/suits/iron.png', type: 'iron' },
  { name: 'MIGUEL', detail: "O'Hara 2099", code: '928', color: '#00e5ff', image: '/suits/miguel.png', type: 'miguel' },
]

function SuitCard({ suit, index, activate }: { suit: typeof suits[number]; index: number; activate: () => void }) {
  const reduced = useReducedMotion(); const x = useMotionValue(0); const y = useMotionValue(0)
  const rotateX = useSpring(y, { stiffness: 180, damping: 18 }); const rotateY = useSpring(x, { stiffness: 180, damping: 18 })
  const move = (event: MouseEvent<HTMLButtonElement>) => { if (reduced) return; const r = event.currentTarget.getBoundingClientRect(); x.set(((event.clientX-r.left)/r.width-.5)*18); y.set(-((event.clientY-r.top)/r.height-.5)*14) }
  return <motion.button role="listitem" onMouseMove={move} onMouseLeave={()=>{x.set(0);y.set(0)}} onMouseEnter={activate} onFocus={activate} onClick={activate} initial={reduced?false:{opacity:0,y:50}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:index*.08}} style={{rotateX,rotateY,transformPerspective:1100,'--suit-accent':suit.color} as never} className={`suit-card suit-card-${suit.type} group relative min-h-[34rem] overflow-hidden border bg-card/70 p-6 text-left backdrop-blur-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring`}>
    <span className="relative z-20 font-mono text-xs text-muted-foreground">EARTH-{suit.code}</span>
    <div className="suit-photo-wrap"><div className="suit-photo-aura"/><img src={suit.image} alt={`${suit.name} cinematic suit render`} className="suit-photo"/></div>
    <div className="absolute inset-x-6 bottom-6 z-20"><h3 className="text-3xl font-black italic tracking-tight">{suit.name}</h3><p className="mt-1 font-mono text-sm text-muted-foreground">{suit.detail}</p></div>
  </motion.button>
}

export function SuitVault(){const[active,setActive]=useState(0);return <section id="suits" className="relative z-10 overflow-hidden px-5 py-28 md:px-10 lg:px-16"><div className="mx-auto max-w-7xl"><div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-sm tracking-[.3em] text-accent">EARTH DATABASE / 04 FILES</p><h2 className="mt-3 max-w-3xl font-sans text-5xl font-black italic leading-none tracking-tighter md:text-7xl">MULTIVERSE<br/>SUIT VAULT</h2></div><p className="max-w-sm font-mono text-sm leading-relaxed text-muted-foreground">Select a universe file. Move across each photoreal armor scan to inspect its dimensional profile.</p></div><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" role="list" aria-label="Spider suit variants">{suits.map((s,i)=><SuitCard key={s.name} suit={s} index={i} activate={()=>setActive(i)}/>)}</div></div><div className="pointer-events-none absolute inset-0 -z-10 opacity-20 transition-colors duration-500" style={{background:`radial-gradient(circle at 50% 65%,${suits[active].color},transparent 45%)`}}/></section>}
