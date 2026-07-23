'use client'

import useMeasure from "react-use-measure"
import { usePathname } from "next/navigation"
import { Cross } from "./assets/svg"

const COLUMNS = 6

export default function Grid() {
  const [ref, { width, height }] = useMeasure()
  const pathname = usePathname()
  const cellSize = width / COLUMNS
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (rows > 0 && rows % 2 === 0) rows += 1

  return (
    <div
      ref={ref}
      className="z-50 absolute inset-0 w-screen h-screen flex items-center overflow-hidden pointer-events-none -z-10"
    >
      <div className="grid grid-cols-6 w-full">
        {Array.from({ length: rows * COLUMNS }).map((_, i) => (
          <div key={i} className="aspect-square relative fadeIn" style={{ animationDelay: `${i * .05}s` }}>
            <Cross className="w-[50px] h-[50px] absolute top-0 left-0 translate-x-[-50%] translate-y-[-50%]" stroke={pathname === "/work/all" ? "black" : "white"} strokeWidth={.5} />
          </div>
        ))}
      </div>
    </div>
  )
}
