'use client'

import useMeasure from "react-use-measure"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import { Cross } from "./assets/svg"

export default function Grid() {
  const [ref, { width, height }] = useMeasure()
  const pathname = usePathname()
  const [columns, setColumns] = useState(() => {
    if (typeof window === 'undefined') return 2
    if (window.matchMedia('(min-width: 1280px)').matches) return 6
    if (window.matchMedia('(min-width: 768px)').matches) return 4
    return 2
  })

  useEffect(() => {
    const mdMql = window.matchMedia('(min-width: 768px)')
    const xlMql = window.matchMedia('(min-width: 1280px)')
    const update = () => setColumns(xlMql.matches ? 6 : mdMql.matches ? 4 : 2)
    update()
    mdMql.addEventListener('change', update)
    xlMql.addEventListener('change', update)
    return () => {
      mdMql.removeEventListener('change', update)
      xlMql.removeEventListener('change', update)
    }
  }, [])

  const cellSize = width / columns
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (columns < 6) rows *= 2
  if (rows > 0 && rows % 2 === 0) rows += 1

  return (
    <div
      ref={ref}
      className="crossGrid z-50 hidden md:block absolute inset-0 w-screen h-screen flex items-center overflow-hidden pointer-events-none -z-10"
    >
      <div className="gridHold grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 w-full">
        {Array.from({ length: rows * columns }).map((_, i) => (
          <div key={i} className="aspect-square relative  fadeIn" style={{ animationDelay: `${i * .05}s` }}>
            <Cross className="w-[50px] h-[50px] absolute top-0 left-0 translate-x-[-51%] translate-y-[-50%]" stroke={pathname === "/work/all" ? "black" : "white"} strokeWidth={.5} />
            {(i + 1) % columns === 0 ? (
              <Cross className="w-[50px] h-[50px] absolute top-0 right-0 translate-x-[50%] translate-y-[-50%]" stroke={pathname === "/work/all" ? "black" : "white"} strokeWidth={.5} />

            ) : ('')}
          </div>
        ))}
      </div>
    </div>
  )
}
