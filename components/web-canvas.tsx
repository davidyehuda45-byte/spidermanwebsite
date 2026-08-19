'use client'

import { useEffect, useRef } from 'react'

type Strand = { x: number; y: number; cornerX: number; cornerY: number; born: number }

export class WebStringPhysics {
  anchorX: number; anchorY: number; targetX: number; targetY: number; vx = 0; vy = 0
  stiffness = 0.15; damping = 0.82
  constructor(startX: number, startY: number) {
    this.anchorX = startX; this.anchorY = startY; this.targetX = startX; this.targetY = startY
  }
  update(mouseX: number, mouseY: number) {
    const dx = mouseX - this.targetX; const dy = mouseY - this.targetY
    this.vx = (this.vx + dx * this.stiffness) * this.damping
    this.vy = (this.vy + dy * this.stiffness) * this.damping
    this.targetX += this.vx; this.targetY += this.vy
  }
}

function webSound() {
  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return
  const context = new AudioContextClass()
  const oscillator = context.createOscillator()
  const gain = context.createGain()
  oscillator.type = 'sawtooth'
  oscillator.frequency.setValueAtTime(900, context.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(130, context.currentTime + 0.12)
  gain.gain.setValueAtTime(0.06, context.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.13)
  oscillator.connect(gain).connect(context.destination)
  oscillator.start(); oscillator.stop(context.currentTime + 0.13)
}

export function WebCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const physics = new WebStringPhysics(innerWidth / 2, innerHeight / 2)
    const pointer = { x: innerWidth / 2, y: innerHeight / 2 }
    const strands: Strand[] = []
    let frame = 0
    const resize = () => { const dpr = Math.min(devicePixelRatio, 2); canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr; canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`; ctx.setTransform(dpr, 0, 0, dpr, 0, 0) }
    const move = (event: PointerEvent) => { pointer.x = event.clientX; pointer.y = event.clientY }
    const click = (event: PointerEvent) => {
      if ((event.target as HTMLElement).closest('button, a')) return
      const corners = [[0,0], [innerWidth,0], [0,innerHeight], [innerWidth,innerHeight]]
      const nearest = corners.reduce((a, b) => Math.hypot(event.clientX-b[0], event.clientY-b[1]) < Math.hypot(event.clientX-a[0], event.clientY-a[1]) ? b : a)
      strands.push({ x: event.clientX, y: event.clientY, cornerX: nearest[0], cornerY: nearest[1], born: performance.now() })
      const pop = document.createElement('span'); pop.className = 'thwip-pop'; pop.textContent = 'THWIP!'; pop.style.left = `${event.clientX}px`; pop.style.top = `${event.clientY}px`; document.body.appendChild(pop); setTimeout(() => pop.remove(), 700)
      webSound()
    }
    const draw = (time: number) => {
      ctx.clearRect(0, 0, innerWidth, innerHeight)
      if (reduced) { physics.targetX = pointer.x; physics.targetY = pointer.y } else physics.update(pointer.x, pointer.y)
      ctx.strokeStyle = 'rgba(253,241,225,.5)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(innerWidth * .57, innerHeight * .38); ctx.quadraticCurveTo(physics.targetX, physics.targetY, pointer.x, pointer.y); ctx.stroke()
      for (let i = strands.length - 1; i >= 0; i--) {
        const strand = strands[i]; const age = (time - strand.born) / 1200
        if (age > 1) { strands.splice(i, 1); continue }
        ctx.globalAlpha = 1 - age; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(strand.cornerX, strand.cornerY)
        const mx = (strand.cornerX + strand.x) / 2; const my = (strand.cornerY + strand.y) / 2
        ctx.quadraticCurveTo(mx + Math.sin(age * 20) * 20, my, strand.x, strand.y); ctx.stroke()
        ctx.globalAlpha = 1
      }
      frame = requestAnimationFrame(draw)
    }
    resize(); addEventListener('resize', resize); addEventListener('pointermove', move); addEventListener('pointerdown', click); frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize); removeEventListener('pointermove', move); removeEventListener('pointerdown', click) }
  }, [])
  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none fixed inset-0 z-[99]" />
}

export function ElasticWebLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); if (!ctx) return
    let point = { x: 320, y: 180 }; let dragging = false; let frame = 0
    const physics = new WebStringPhysics(30, 180); physics.targetX = point.x; physics.targetY = point.y
    const resize = () => { const rect = canvas.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio, 2); canvas.width = rect.width * dpr; canvas.height = rect.height * dpr; ctx.setTransform(dpr,0,0,dpr,0,0); point = { x: rect.width * .72, y: rect.height * .52 } }
    const locate = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); point = { x: e.clientX-r.left, y: e.clientY-r.top } }
    const down = (e: PointerEvent) => { dragging = true; canvas.setPointerCapture(e.pointerId); locate(e) }
    const move = (e: PointerEvent) => { if (dragging) locate(e) }
    const up = () => { dragging = false }
    const draw = () => { const r=canvas.getBoundingClientRect(); physics.update(point.x, point.y); ctx.clearRect(0,0,r.width,r.height); ctx.strokeStyle='#FDF1E1'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(30,r.height/2); ctx.quadraticCurveTo(r.width/2,r.height/2 + (physics.targetY-r.height/2)*.45,physics.targetX,physics.targetY); ctx.stroke(); ctx.fillStyle='#E62429'; ctx.beginPath(); ctx.arc(physics.targetX,physics.targetY,10,0,Math.PI*2); ctx.fill(); frame=requestAnimationFrame(draw) }
    resize(); canvas.addEventListener('pointerdown',down); canvas.addEventListener('pointermove',move); canvas.addEventListener('pointerup',up); frame=requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); canvas.removeEventListener('pointerdown',down); canvas.removeEventListener('pointermove',move); canvas.removeEventListener('pointerup',up) }
  }, [])
  return <canvas ref={canvasRef} aria-label="Drag the red web node to test web tension" className="h-80 w-full cursor-crosshair touch-none" />
}
