import Image from 'next/image'
import { ChevronRight, Hexagon } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { ScrollVideo } from '@/components/scroll-video'

const services = ['/ AI AUTOMATION', '/ AI INTEGRATION', '/ AI AGENT DEVELOPMENT']
const navLinks = ['Projects', 'About', 'Blog', 'Contact']
const capabilities = [
  ['01', 'Real-time vision', 'Reads context as it happens and surfaces what matters before you ask.'],
  ['02', 'Layered insight', 'Moves from rough outline to sharp output without losing the thread.'],
  ['03', 'Adaptive speed', 'Learns your cadence and tightens every pass as you work.'],
]

const badgeClass = 'border-l-2 border-white bg-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-foreground backdrop-blur-md'
const sectionClass = 'flex min-h-screen flex-col justify-between px-5 pt-24 pb-12 sm:px-8 sm:pt-28 md:px-12 md:pb-16 supports-[height:100svh]:min-h-[100svh]'

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 px-5 sm:px-8 md:px-12">
      <nav className="flex h-16 items-center justify-between" aria-label="Main navigation">
        <Reveal className="flex items-center gap-2">
          <Hexagon size={24} strokeWidth={1.5} aria-hidden="true" />
          <span className="text-lg font-medium tracking-tight sm:text-xl">novaai</span>
        </Reveal>
        <div className="hidden items-center gap-8 md:flex lg:gap-10">
          {navLinks.map((link, index) => (
            <Reveal key={link} delay={100 + index * 100}>
              <a href={`#${link.toLowerCase()}`} className="text-sm text-white/85 transition-colors duration-300 hover:text-foreground">
                {link}{link === 'Projects' && <sup className="ml-1 font-mono text-[10px] text-white/60">6</sup>}
              </a>
            </Reveal>
          ))}
        </div>
        <Reveal delay={500}>
          <a href="#contact" className="rounded-md border border-white/20 bg-white/15 px-4 py-2 text-xs backdrop-blur-md transition-colors duration-300 hover:bg-white/25 sm:px-5 sm:text-sm">Get Free Consultation</a>
        </Reveal>
      </nav>
    </header>
  )
}

function HeroSection() {
  return (
    <section className={sectionClass} aria-labelledby="hero-heading">
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2">
          {services.map((service, index) => <Reveal key={service} delay={150 + index * 120}><p className="font-mono text-xs uppercase tracking-[0.15em] text-white/90 drop-shadow-md">{service}</p></Reveal>)}
        </div>
        <Reveal delay={300} className="max-w-xs sm:text-right">
          <p className="text-lg leading-relaxed text-foreground drop-shadow-md sm:text-xl">We design automation that brings clarity, precision, and efficiency to the way your company operates.</p>
        </Reveal>
      </div>
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal delay={150} className="mb-5"><span className={badgeClass}>We Automate 100+ Businesses</span></Reveal>
          <Reveal delay={280}>
            <h1 id="hero-heading" className="text-balance text-5xl leading-[1.05] font-normal tracking-tight text-foreground drop-shadow-lg sm:text-6xl lg:text-7xl">Clear. Precise.<br />Automated.</h1>
          </Reveal>
        </div>
        <Reveal delay={420}>
          <div id="contact" className="flex items-center gap-4 rounded-xl bg-white/15 p-3 backdrop-blur-md">
            <Image src="/mitha.webp" alt="Mitha, co-founder of NovaAI" width={80} height={96} className="h-24 w-20 rounded-lg object-cover" />
            <div className="flex flex-col gap-1.5 pr-2">
              <p className="text-sm font-medium text-foreground">Talk with Mitha</p>
              <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">Co-founder of NovaAI</p>
              <a href="#contact" className="mt-1.5 flex items-center gap-1 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-colors duration-300 hover:bg-white/85">Book 15-mins call <ChevronRight size={14} aria-hidden="true" /></a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function CapabilitySection() {
  return (
    <section id="about" className={sectionClass} aria-labelledby="capability-heading">
      <div className="flex flex-col gap-8 sm:flex-row sm:justify-between">
        <Reveal delay={120}><span className={badgeClass}>Insight On Demand</span></Reveal>
        <Reveal delay={220} className="max-w-sm sm:text-right"><p className="text-lg leading-relaxed text-foreground drop-shadow-md sm:text-xl">Our AI doesn&apos;t just respond — it interprets, sharpens, and delivers the signal you need.</p></Reveal>
      </div>
      <div className="flex flex-1 flex-col justify-end gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
        <div className="max-w-xl">
          <Reveal delay={180}><h2 id="capability-heading" className="text-balance text-5xl leading-[1.05] font-normal tracking-tight text-foreground drop-shadow-lg sm:text-6xl lg:text-7xl">Learn to see<br />brilliantly.</h2></Reveal>
          <Reveal delay={320} className="mt-6 max-w-md"><p className="text-sm leading-relaxed text-white/80 drop-shadow-md sm:text-base">From the first sketch to the final render, Nova turns raw intent into decisions your team can act on — quietly, precisely, at speed.</p></Reveal>
          <Reveal delay={420} className="mt-8 flex flex-wrap gap-3">
            <a href="#demo" className="flex items-center gap-1 rounded-full bg-foreground px-5 py-2.5 text-xs font-medium text-background transition-colors duration-300 hover:bg-white/85 sm:text-sm">Run the demo <ChevronRight size={14} aria-hidden="true" /></a>
            <a href="#contact" className="rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-xs backdrop-blur-md transition-colors duration-300 hover:bg-white/20 sm:text-sm">Free consultation</a>
          </Reveal>
        </div>
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/10 px-5 backdrop-blur-md sm:px-6">
          {capabilities.map(([index, title, body], rowIndex) => (
            <Reveal key={index} delay={300 + rowIndex * 110} className={rowIndex < capabilities.length - 1 ? 'border-b border-white/15' : undefined}>
              <div className="group flex gap-5 py-5">
                <span className="font-mono text-[11px] tracking-[0.15em] text-white/55">{index}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between"><h3 className="text-base font-medium text-foreground sm:text-lg">{title}</h3><ChevronRight size={16} className="text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" /></div>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">{body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function NovaLanding() {
  return <div className="relative min-h-screen bg-transparent text-foreground"><ScrollVideo /><div className="relative z-10"><Navbar /><main><HeroSection /><div className="h-[80vh]" aria-hidden="true" /><CapabilitySection /></main></div></div>
}
