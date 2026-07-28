"use client";
import { ReactLenis } from "lenis/react";
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from "react";

export default function SmoothScrolling({ children }:any) {
    const pathname = usePathname();

  const lenisRef = useRef<any>(null);

  useEffect(() => {
    const preventScroll = (e: Event) => {
      e.stopImmediatePropagation()
      e.preventDefault()
    }
    const preventScrollKeys = (e: KeyboardEvent) => {
      const keys = ['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']
      if (keys.includes(e.key)) {
        e.stopImmediatePropagation()
        e.preventDefault()
      }
    }

    const lock = () => {
      lenisRef.current?.lenis?.stop()
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      window.addEventListener('wheel', preventScroll, { passive: false, capture: true })
      window.addEventListener('touchmove', preventScroll, { passive: false, capture: true })
      window.addEventListener('keydown', preventScrollKeys, { passive: false, capture: true })
    }
    const unlock = () => {
      lenisRef.current?.lenis?.start()
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      window.removeEventListener('wheel', preventScroll, { capture: true })
      window.removeEventListener('touchmove', preventScroll, { capture: true })
      window.removeEventListener('keydown', preventScrollKeys, { capture: true })
    }

    if (document.body.classList.contains('pageSettled')) {
      unlock()
      return
    }

    lock()
    const observer = new MutationObserver(() => {
      if (document.body.classList.contains('pageSettled')) {
        unlock()
        observer.disconnect()
      }
    })
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
    return () => {
      observer.disconnect()
      unlock()
    }
  }, [])

  useEffect(() => {

    const lenis = lenisRef.current?.lenis

    if (window.location.hash) return

    if (lenis) {
      lenis.stop()
      requestAnimationFrame(() => {
        lenis.start()
        lenis.scrollTo(0, { immediate: true });
      })
    }
    window.scrollTo(0, 0);

  }, [pathname])

  return (
    <ReactLenis root ref={lenisRef} options={{ lerp: 0.05, duration: 1.5, wheelMultiplier: 1.2, orientation:'vertical'}}>
      {children}
    </ReactLenis>
  );
}
