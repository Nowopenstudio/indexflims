"use client";
import { ReactLenis } from "lenis/react";
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from "react";

export default function SmoothScrolling({ children }:any) {
    const pathname = usePathname();

  const lenisRef = useRef<any>(null);

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
