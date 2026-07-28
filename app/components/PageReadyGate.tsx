'use client'

import { useEffect, useState } from "react"

export default function PageReadyGate({ children }: any) {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        if (document.body.classList.contains('pageReady')) {
            setReady(true)
            return
        }

        const observer = new MutationObserver(() => {
            if (document.body.classList.contains('pageReady')) {
                setReady(true)
                observer.disconnect()
            }
        })
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] })
        return () => observer.disconnect()
    }, [])

    if (!ready) return null

    return children
}
