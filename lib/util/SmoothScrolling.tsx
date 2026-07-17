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

      })
           lenis.scrollTo(0, { immediate: true });
    }
window.scrollTo(0,0);
   
  }, [pathname, lenis])
  
  return (
    <ReactLenis root options={{ lerp: 0.05, duration: 1.5, wheelMultiplier: 1.2, orientation:'vertical'}}>
      {children}
    </ReactLenis>
  );
}
