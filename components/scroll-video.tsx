'use client'

import { useEffect, useRef, useState } from 'react'

const VIDEO_URL = '/hero.mp4'

export function ScrollVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasFrame, setHasFrame] = useState(false)
  const [cacheReady, setCacheReady] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    const context = canvas.getContext('2d')
    if (!context) return

    let cancelled = false
    let animationFrame = 0
    let target = 0
    let smoothed = 0
    const frames: ImageBitmap[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
    }

    const drawCover = (source: CanvasImageSource, width: number, height: number) => {
      const scale = Math.max(canvas.width / width, canvas.height / height)
      const drawWidth = width * scale
      const drawHeight = height * scale
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(source, (canvas.width - drawWidth) / 2, (canvas.height - drawHeight) / 2, drawWidth, drawHeight)
    }

    const updateTarget = () => {
      const range = document.documentElement.scrollHeight - window.innerHeight
      target = range > 0 ? Math.min(1, Math.max(0, window.scrollY / range)) : 0
    }

    const animate = () => {
      smoothed += (target - smoothed) * 0.12
      if (frames.length) {
        const frame = frames[Math.min(frames.length - 1, Math.round(smoothed * (frames.length - 1)))]
        drawCover(frame, frame.width, frame.height)
      } else if (video.duration && !video.seeking) {
        const nextTime = smoothed * Math.max(0, video.duration - 0.05)
        if (Math.abs(video.currentTime - nextTime) > 0.04) video.currentTime = nextTime
      }
      animationFrame = requestAnimationFrame(animate)
    }

    const extractFrames = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300))
      const extractor = document.createElement('video')
      extractor.crossOrigin = 'anonymous'
      extractor.muted = true
      extractor.playsInline = true
      extractor.preload = 'auto'
      extractor.src = VIDEO_URL
      await new Promise<void>((resolve, reject) => {
        extractor.addEventListener('loadedmetadata', () => resolve(), { once: true })
        extractor.addEventListener('error', () => reject(new Error('Video unavailable')), { once: true })
      })
      const count = Math.min(90, Math.max(24, Math.floor(extractor.duration * 12)))
      const width = Math.min(960, extractor.videoWidth)
      const height = Math.round(width * (extractor.videoHeight / extractor.videoWidth))
      const buffer = document.createElement('canvas')
      buffer.width = width
      buffer.height = height
      const bufferContext = buffer.getContext('2d')
      if (!bufferContext) return

      for (let index = 0; index < count && !cancelled; index += 1) {
        extractor.currentTime = (index / (count - 1)) * Math.max(0, extractor.duration - 0.05)
        await new Promise<void>((resolve) => extractor.addEventListener('seeked', () => resolve(), { once: true }))
        bufferContext.drawImage(extractor, 0, 0, width, height)
        frames.push(await createImageBitmap(buffer))
      }
      if (!cancelled && frames.length) setCacheReady(true)
    }

    const onLoaded = () => {
      setHasFrame(true)
      void extractFrames().catch(() => undefined)
    }

    resize()
    updateTarget()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', updateTarget, { passive: true })
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      onLoaded()
    } else {
      video.addEventListener('loadeddata', onLoaded, { once: true })
    }
    animationFrame = requestAnimationFrame(animate)

    return () => {
      cancelled = true
      cancelAnimationFrame(animationFrame)
      frames.forEach((frame) => frame.close())
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', updateTarget)
      video.removeEventListener('loadeddata', onLoaded)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background" aria-hidden="true">
      <div className={`absolute inset-0 bg-background transition-opacity duration-500 ${hasFrame || cacheReady ? 'opacity-0' : 'opacity-100'}`} />
      <video
        ref={videoRef}
        className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${hasFrame && !cacheReady ? 'opacity-100' : 'opacity-0'}`}
        src={VIDEO_URL}
        crossOrigin="anonymous"
        muted
        playsInline
        preload="auto"
      />
      <canvas ref={canvasRef} className={`absolute inset-0 size-full transition-opacity duration-500 ${cacheReady ? 'opacity-100' : 'opacity-0'}`} />
      <div className="absolute inset-0 bg-background/15" />
    </div>
  )
}
