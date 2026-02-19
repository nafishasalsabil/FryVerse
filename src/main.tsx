import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import Lenis from '@studio-freight/lenis'
import { ScrollTrigger } from '@/animations/gsap.config'

// Initialize Lenis smooth scroll with optimized settings
const lenis = new Lenis({
  duration: 0.1,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  smoothWheel: true,
  wheelMultiplier: 0.8,
  touchMultiplier: 1.5,
  infinite: false,
})

// Optimize ScrollTrigger refresh
ScrollTrigger.config({
  limitCallbacks: true,
  autoRefreshEvents: 'visibilitychange,DOMContentLoaded,load',
})

// Sync Lenis with ScrollTrigger
let rafId: number | null = null;
function raf(time: number) {
  lenis.raf(time)
  rafId = requestAnimationFrame(raf)
}

rafId = requestAnimationFrame(raf)

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
    }
  })
}

// Register ScrollTrigger with Lenis
ScrollTrigger.scrollerProxy(document.body, {
  scrollTop(value?: number) {
    if (value !== undefined) {
      lenis.scrollTo(value, { immediate: true })
    }
    return lenis.scroll
  },
  getBoundingClientRect() {
    return {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight,
    }
  },
  pinType: document.body.style.transform ? 'transform' : 'fixed',
})

// Throttle ScrollTrigger updates for better performance
let ticking = false
let lastUpdate = 0
const UPDATE_INTERVAL = 16 // ~60fps

lenis.on('scroll', () => {
  const now = performance.now()
  if (!ticking && (now - lastUpdate) >= UPDATE_INTERVAL) {
    requestAnimationFrame(() => {
      ScrollTrigger.update()
      ticking = false
      lastUpdate = now
    })
    ticking = true
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
