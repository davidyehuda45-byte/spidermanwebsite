'use client'

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'motion/react'
import { useState, type MouseEvent } from 'react'

const suits = [
  { name: 'CLASSIC', detail: 'Red & Blue', code: '616', color: 'var(--spidey-red)', type: 'classic' },
  { name: 'MILES', detail: 'Morales Strike', code: '1610', color: 'var(--suit-glitch)', type: 'miles' },
  { name: 'IRON SPIDER', detail: 'Nanotech', code: '199999', color: 'var(--web-gold)', type: 'iron' },
  { name: 'MIGUEL', detail: "O'Hara 2099", code: '928', color: 'var(--web-cyan)', type: 'miguel' },
]

function SuitArtwork({ type }: { type: string }) {
  return <div className={`suit-art suit-${type}`} aria-hidden="true">
    <div className="suit-aura" />
    {type === 'iron' && <><i className="iron-arm arm-one"/><i className="iron-arm arm-two"/><i className="iron-arm arm-three"/><i className="iron-arm arm-four"/></>}
    <div className="suit-head"><i className="suit-eye left"/><i className="suit-eye right"/></div>
    <div className="suit-body"><i className="spider-mark"/><i className="shoulder shoulder-left"/><i className="shoulder shoulder-right"/></div>
  </div>
}

function SuitCard({ suit, index, activate }: { suit: typeof suits[number], index: number, activate: () => void }) {
  const reduced = useReducedMotion(); const rx = useMotionValue(0); const ry = useMotionValue(0)
  const rotateX = useSpring(rx, { stiffness: 220, damping: 20 }); const rotateY = useSpring(ry, { stiffness: 220, damping: 20 })
  const glowX = useTransform(ry, [-12, 12], ['35%', '65%']); const glowY = useTransform(rx, [-10, 10], ['35%', '65%'])
  const move = (event: MouseEvent<HTMLButtonElement>) => { if (reduced) return; const r = event.currentTarget.getBoundingClientRect(); ry.set(((event.clientX-r.left)/r.width-.5)*18); rx.set(-((event.clientY-r.top)/r.height-.5)*14) }
  const reset = () => { rx.set(0); ry.set(0) }
  return <motion.button role="listitem" onMouseMove={move} onMouseLeave={reset} onMouseEnter={activate} onFocus={activate} onClick={activate} initial={reduced ? false : { opacity: 0, y: 45 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-15%' }} transition={{ delay: index * .08 }} style={{ rotateX, rotateY, transformPerspective: 1000, '--glow-x': glowX, '--glow-y': glowY } as never} className={`suit-card suit-card-${suit.type} group relative min-h-[31rem] overflow-hidden border border-border bg-card p-6 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring`}>
    <span className="relative z-20 font-mono text-xs text-muted-foreground">EARTH-{suit.code}</span>
    <SuitArtwork type={suit.type}/>
    <div className="absolute inset-x-6 bottom-6 z-20"><h3 className="text-3xl font-black italic tracking-tight">{suit.name}</h3><p className="mt-1 font-mono text-sm text-muted-foreground">{suit.detail}</p></div>
  </motion.button>
}

export function SuitVault() {
  const [active, setActive] = useState(0)
  return <section id="suits" className="relative overflow-hidden px-5 py-28 md:px-10 lg:px-16" style={{ '--suit-accent': suits[active].color } as React.CSSProperties}>
    <div className="mx-auto max-w-7xl"><div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between"><div><p className="font-mono text-sm tracking-[.3em] text-accent">EARTH DATABASE / 04 FILES</p><h2 className="mt-3 max-w-3xl font-sans text-5xl font-black italic leading-none tracking-tighter md:text-7xl">MULTIVERSE<br/>SUIT VAULT</h2></div><p className="max-w-sm font-mono text-sm leading-relaxed text-muted-foreground">Select a universe file. Move across each suit to scan its dimensional armor profile.</p></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" role="list" aria-label="Spider suit variants">{suits.map((suit,index)=><SuitCard key={suit.name} suit={suit} index={index} activate={()=>setActive(index)}/>)}</div>
    </div><div className="pointer-events-none absolute inset-0 -z-10 opacity-15 transition-colors duration-500" style={{background:`radial-gradient(circle at 50% 70%, ${suits[active].color}, transparent 45%)`}}/>
  </section>
}
