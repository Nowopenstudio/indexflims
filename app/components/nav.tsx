'use client'

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import { useLenis } from "lenis/react"
import LogoScroll from "./logoScroll"
import React from "react"
import Link from "next/link"

export default function Nav() {
    const pathname = usePathname()
    const lenis = useLenis()
    const [workMode, setWorkMode] = useState(false)
    const prevPathname = useRef<string | undefined>(undefined)

    const scrollToFooterEl = (attempts = 0) => {
        if (!lenis) return
        const target = document.querySelector('#footer')
        if (target) {
            lenis.scrollTo(target as HTMLElement, {
                duration: 1.5,
                easing: (t: number) => 1 - Math.pow(1 - t, 3),
            })
        } else if (attempts < 20) {
            setTimeout(() => scrollToFooterEl(attempts + 1), 100)
        }
    }

    const goToFooter = (e: React.MouseEvent) => {
        if (pathname !== '/') return
        e.preventDefault()
        window.history.pushState(null, '', '/#footer')
        scrollToFooterEl()
    }

    useEffect(() => {
        setWorkMode(pathname?.includes('work') ?? false)
    }, [pathname])

    useEffect(() => {
        document.body.classList.toggle('pageReady', pathname !== '/')
    }, [pathname])

    useEffect(() => {
        if (pathname === '/' && prevPathname.current && prevPathname.current !== '/') {
            sessionStorage.setItem('skipLoader', 'true')
            if (window.location.hash === '#footer') {
                setTimeout(() => scrollToFooterEl(), 750)
            }
        }
        prevPathname.current = pathname
    }, [pathname, lenis])

    return (
        <React.Fragment>
            <div className="fixed w-screen z-50 pointer-events-none mix-blend-difference bg-blend-difference playerUI"><div className="p-4 flex justify-end text-white readyIn gap-8 uppercase "><Link className="pointer-events-auto singleNav" href="/work/all"><h2>Work</h2></Link><Link href="/#footer" scroll={false} className="pointer-events-auto singleNav" onClick={goToFooter}><h2>Info</h2></Link></div></div>
            <div className={`nav absolute overflow-x-hidden top-0 left-0 h-screen w-screen pointer-events-none flex ${workMode ? 'items-end' : 'items-center'} z-50`}>
                <div className={`w-screen h-auto logoHold`}>
                    <LogoScroll time={20} workMode={workMode} />
                </div>
            </div>
        </React.Fragment>
    );
}
