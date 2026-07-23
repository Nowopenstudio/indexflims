'use client'

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import LogoScroll from "./logoScroll"
import React from "react"
import Link from "next/link"

export default function Nav() {
    const pathname = usePathname()
    const [workMode, setWorkMode] = useState(false)

    useEffect(() => {
        setWorkMode(pathname?.includes('work') ?? false)
    }, [pathname])

    useEffect(() => {
        if (pathname !== '/') {
            document.body.classList.add('pageReady')
        }
    }, [pathname])

    return (
        <React.Fragment>
            <div className="fixed w-screen z-50 pointer-events-none mix-blend-diference bg-blend-difference"><div className="p-4 flex justify-end text-white readyIn gap-8 uppercase "><Link className="pointer-events-auto" href="/work/all"><h2>Work</h2></Link><Link href="/#footer" className="pointer-events-auto"><h2>Info</h2></Link></div></div>
            <div className={`nav absolute overflow-x-hidden top-0 left-0 h-screen w-screen pointer-events-none flex ${workMode ? 'items-end' : 'items-center'} z-50`}>
                <div className={`w-screen h-auto logoHold`}>
                    <LogoScroll time={20} workMode={workMode} />
                </div>
            </div>
        </React.Fragment>
    );
}
