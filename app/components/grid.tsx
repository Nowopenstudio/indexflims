'use client'

import useMeasure from "react-use-measure"
import { usePathname } from "next/navigation"
import { BREAKPOINTS, useMediaQuery, getGridLayout } from "@/lib/util/misc"
import { Cross } from "./assets/svg"

export default function Grid() {
  const [ref, { width, height }] = useMeasure()
  const pathname = usePathname()
  const isXlUp = useMediaQuery(BREAKPOINTS.xl)
  const isMdUp = useMediaQuery(BREAKPOINTS.md)
  const columns = isXlUp ? 6 : isMdUp ? 4 : 2

  const { rows } = getGridLayout(width, height, columns)

  return (
    <div
      ref={ref}
      className="crossGrid z-50 hidden md:flex absolute inset-0 w-screen h-screen items-center overflow-hidden pointer-events-none -z-10"
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
