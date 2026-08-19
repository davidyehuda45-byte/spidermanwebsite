'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useState } from 'react'

const suits = [
  { name: 'CLASSIC', detail: 'Red & Blue', code: '616', color: 'var(--spidey-red)' },
  { name: 'MILES', detail: 'Morales Strike', code: '1610', color: 'var(--suit-glitch)' },
  { name: 'IRON SPIDER', detail: 'Nanotech', code: '199999', color: 'var(--web-gold)' },
  { name: 'MIGUEL', detail: "O'Hara 2099", code: '928', color: 'var(--web-cyan)' },
]

export function SuitVault() {
  const [active, setActive] = useState(0)
  const reduced = useReducedMotion()
  return (
    <section id="suits" className="relative overflow-hidden px-5 py-28 md:px-10 lg:px-16" style={{ '--suit-accent': suits[active].color } as React.CSSProperties}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div><p className="font-mono text-sm tracking-[.3em] text-accent">EARTH DATABASE / 04 FILES</p><h2 className="mt-3 max-w-3xl font-sans text-5xl font-black italic leading-none tracking-tighter md:text-7xl">MULTIVERSE<br/>SUIT VAULT</h2></div>
          <p className="max-w-sm font-mono text-sm leading-relaxed text-muted-foreground">Select a universe file. Hover to destabilize the dimensional color profile.</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" role="list" aria-label="Spider suit variants">
          {suits.map((suit, index) => (
            <motion.button key={suit.name} role="listitem" onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => setActive(index)} initial={reduced ? false : { opacity: 0, rotateY: -30, y: 50 }} whileInView={{ opacity: 1, rotateY: 0, y: 0 }} viewport={{ once: true, margin: '-15%' }} transition={{ delay: index * .08 }} className="suit-card group relative min-h-96 overflow-hidden border border-border bg-card p-6 text-left transition-colors hover:border-[var(--suit-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
              <span className="font-mono text-xs text-muted-foreground">EARTH-{suit.code}</span>
              <div className="suit-mask mx-auto my-10 flex aspect-[3/4] w-40 items-center justify-center rounded-[48%] border-2 border-[var(--suit-accent)] bg-secondary transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3"><div className="eye-shape"/><div className="eye-shape scale-x-[-1]"/></div>
              <h3 className="text-3xl font-black italic tracking-tight">{suit.name}</h3><p className="mt-1 font-mono text-sm text-muted-foreground">{suit.detail}</p>
            </motion.button>
          ))}
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-15 transition-colors duration-500" style={{ background: `radial-gradient(circle at 50% 70%, ${suits[active].color}, transparent 45%)` }} />
    </section>
  )
}
