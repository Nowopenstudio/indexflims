'use client'

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import LogoScroll from "./logoScroll"

export default function Nav() {
    const pathname = usePathname()
    const [workMode, setWorkMode] = useState(false)

    useEffect(() => {
        setWorkMode(pathname?.includes('work') ?? false)
    }, [pathname])

    return (
        <div className={`nav absolute overflow-x-hidden top-0 left-0 h-screen w-screen pointer-events-none flex ${workMode ? 'items-end' : 'items-center'} z-50`}>
            <div className={`w-screen h-auto logoHold`}>
                <LogoScroll time={20} workMode={workMode} />
            </div>
        </div>
    );
}
