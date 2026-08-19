'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { Menu, Radio, Bug, Volume2, X } from 'lucide-react'
import { useRef, useState } from 'react'
import { ElasticWebLab, WebCanvas } from './web-canvas'
import { SuitVault } from './suit-vault'

function senseSound() {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return
  const ctx = new AudioContextClass(); const osc = ctx.createOscillator(); const gain = ctx.createGain()
  osc.frequency.setValueAtTime(440, ctx.currentTime); osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + .3)
  gain.gain.setValueAtTime(.08, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .45)
  osc.connect(gain).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + .45)
}

function Header({ triggerSense }: { triggerSense: () => void }) {
  const [open, setOpen] = useState(false)
  return <header className="fixed inset-x-0 top-0 z-[100] flex items-center justify-between border-b border-border bg-background/70 px-5 py-4 backdrop-blur-xl md:px-10">
    <a href="#intro" className="flex items-center gap-3 font-black tracking-tight"><Bug aria-hidden="true" className="text-primary"/><span>SPIDER-MAN <span className="hidden font-mono text-xs font-normal text-muted-foreground sm:inline">// EARTH-616</span></span></a>
    <nav aria-label="Main navigation" className="hidden items-center gap-8 font-mono text-xs tracking-widest md:flex"><a href="#suits">SUITS</a><a href="#multiverse">MULTIVERSE</a><a href="#mechanics">LAB</a><a href="#gallery">GALLERY</a></nav>
    <div className="flex items-center gap-2"><button onClick={triggerSense} className="sense-button flex items-center gap-2 border border-primary bg-primary px-4 py-2 font-mono text-xs font-bold text-primary-foreground"><Radio aria-hidden="true"/> <span className="hidden sm:inline">SPIDER-SENSE</span></button><button onClick={() => setOpen(!open)} aria-label="Toggle menu" aria-expanded={open} className="border border-border p-2 md:hidden">{open ? <X/> : <Menu/>}</button></div>
    {open && <nav className="absolute inset-x-0 top-full flex flex-col gap-5 border-b border-border bg-background p-6 font-mono text-sm md:hidden"><a onClick={()=>setOpen(false)} href="#suits">SUITS</a><a onClick={()=>setOpen(false)} href="#multiverse">MULTIVERSE</a><a onClick={()=>setOpen(false)} href="#mechanics">LAB</a></nav>}
  </header>
}

function Hero() {
  const ref = useRef<HTMLElement>(null); const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const titleScale = useTransform(scrollYProgress, [0, .5], [1.5, 1]); const titleOpacity = useTransform(scrollYProgress, [.2, .55], [1, 0])
  const heroX = useTransform(scrollYProgress, [0, .55], reduced ? ['0vw','0vw'] : ['60vw','0vw']); const heroY = useTransform(scrollYProgress, [0, .55], reduced ? ['0vh','0vh'] : ['-35vh','3vh']); const heroRotate = useTransform(scrollYProgress, [0, .55], [-35, 0]); const heroScale = useTransform(scrollYProgress, [0, .6], [.72, 1.08])
  return <section ref={ref} id="intro" className="relative h-[190vh]">
    <div className="sticky top-0 h-screen overflow-hidden">
      <div className="absolute inset-0 scale-105 bg-cover bg-center opacity-55" style={{ backgroundImage: "linear-gradient(to bottom, rgba(2,11,26,.3), #020b1a), url('https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1920&auto=format&fit=crop')" }}/>
      <div className="web-grid absolute inset-0 opacity-35"/>
      <motion.div style={{ scale: titleScale, opacity: titleOpacity }} className="absolute inset-0 z-10 flex items-center justify-center"><h1 className="hero-title text-center font-black italic leading-[.75] tracking-[-.08em] text-primary">SPIDER<br/><span className="text-foreground">MAN</span></h1></motion.div>
      <motion.img src="https://pngimg.com/uploads/spider_man/spider_man_PNG18.png" alt="Spider-Man swinging above the New York skyline" style={{ x: heroX, y: heroY, rotate: heroRotate, scale: heroScale }} className="absolute bottom-[-2%] left-1/2 z-20 h-[72vh] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_30px_35px_rgba(0,0,0,.8)] md:h-[90vh]"/>
      <motion.div initial={{ opacity: 0, scale: .4, rotate: -18 }} whileInView={{ opacity: 1, scale: 1, rotate: -8 }} className="comic-badge absolute right-[8%] top-[27%] z-30 bg-accent px-5 py-3 text-3xl font-black italic text-accent-foreground md:text-5xl">THWIP!</motion.div>
      <div className="absolute bottom-7 left-5 z-30 font-mono text-xs tracking-[.25em] text-muted-foreground md:left-10">SCROLL TO ENTER THE SPIDER-VERSE</div>
    </div>
  </section>
}

export function SpiderExperience() {
  const [sense, setSense] = useState(false)
  const triggerSense = () => { setSense(true); senseSound(); setTimeout(() => setSense(false), 900) }
  return <main className={`spidey-universe ${sense ? 'spider-sense-active' : ''}`}>
    <WebCanvas/><div aria-hidden="true" className="spider-sense-hud"/><Header triggerSense={triggerSense}/><Hero/>
    <section id="multiverse" className="glitch-divider flex min-h-[55vh] items-center justify-center overflow-hidden border-y border-border px-5 text-center"><div><p className="font-mono text-xs tracking-[.4em] text-accent">DIMENSIONAL BREACH DETECTED</p><h2 className="glitch-text mt-5 text-6xl font-black italic leading-none md:text-9xl" data-text="WHO ARE YOU?">WHO ARE YOU?</h2></div></section>
    <SuitVault/>
    <section id="mechanics" className="border-y border-border bg-secondary px-5 py-28 text-secondary-foreground md:px-10 lg:px-16"><div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.4fr_.6fr]"><div><p className="font-mono text-xs tracking-[.3em] text-primary">WEB-SHOOTER PROTOCOL</p><h2 className="mt-3 text-5xl font-black italic leading-none md:text-7xl">PHYSICS &<br/>WEB SHOOTER</h2><div className="lab-hud mt-10 overflow-hidden border border-[var(--web-cyan)]"><div className="flex items-center justify-between border-b border-[var(--web-cyan)]/30 px-4 py-2 font-mono text-[10px] tracking-[.2em] text-[var(--web-cyan)]"><span>STARK // ELASTICITY SIMULATOR</span><span>CORE ONLINE</span></div><ElasticWebLab/></div><p className="mt-3 font-mono text-xs opacity-70">DRAG THE RED NODE. RELEASE TO TEST ELASTIC RESPONSE.</p></div><aside className="flex flex-col justify-end gap-4"><div className="stat-block"><span>TENSILE STRENGTH</span><strong>950</strong><em>PSI</em></div><div className="stat-block"><span>SWING VELOCITY</span><strong>120</strong><em>MPH</em></div><div className="border border-current p-5 font-mono text-xs leading-relaxed"><Volume2 className="mb-3" aria-hidden="true"/>CLICK ANYWHERE TO FIRE A PROCEDURAL WEB STRAND.</div></aside></div></section>
    <footer id="gallery" className="flex flex-col gap-10 bg-background px-5 py-16 md:flex-row md:items-end md:justify-between md:px-10"><div><Bug className="mb-5 text-primary"/><p className="text-3xl font-black italic">WITH GREAT POWER<br/>COMES GREAT RESPONSIBILITY.</p></div><div className="max-w-md font-mono text-xs leading-relaxed text-muted-foreground"><p>UNOFFICIAL FAN-MADE INTERACTIVE EXPERIENCE.</p><p className="mt-2">SPIDER-MAN AND RELATED CHARACTERS ARE TRADEMARKS OF MARVEL ENTERTAINMENT.</p></div></footer>
  </main>
}
