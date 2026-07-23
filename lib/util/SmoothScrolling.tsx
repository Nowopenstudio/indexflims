"use client";
import { ReactLenis, useLenis} from "lenis/react";
import { usePathname } from 'next/navigation';
import { useEffect } from "react";

export default function SmoothScrolling({ children }:any) {
    const pathname = usePathname();

  const lenis = useLenis();

  useEffect(() => {

    if (lenis) {

      lenis.stop()
      requestAnimationFrame(() => {
        lenis.start()

        if (window.location.hash) {
          setTimeout(() => {
            const target = document.querySelector(window.location.hash)
            if (target) {
              lenis.scrollTo(target as HTMLElement)
            }
          }, 100)
        } else {
          lenis.scrollTo(0, { immediate: true });
        }
      })
    }
    if (!window.location.hash) {
      window.scrollTo(0, 0);
    }

  }, [pathname, lenis])
  
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, wheelMultiplier: 1.2, orientation:'vertical'}}>
      {children}
    </ReactLenis>
  );
}
