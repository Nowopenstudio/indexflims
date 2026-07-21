'use client'

import { animate, useMotionValue, motion } from "motion/react"
import useMeasure from "react-use-measure"
import { useEffect } from "react"
import { Logo } from "./assets/svg"
import Link from "next/link"

const ITEM_COUNT = 10

export default function LogoScroll({ data, time }: any) {
  const [ref, { width }] = useMeasure()
  const xTranslation = useMotionValue(0)

  useEffect(() => {
    if (!width) return
    const controls = animate(xTranslation, [-width + width / 3, -width / 3], {
      ease: "linear",
      duration: time,
      repeat: Infinity,
      repeatType: "loop",
      repeatDelay: 0,
    })
    return controls.stop
  }, [xTranslation, width, time])

  return (
    <motion.div
      ref={ref}
      className="flex left-0 items-center top-[0] z-[1] gap-[450px] w-max h-full navHold"
      style={{ x: xTranslation, color: "black" }}
    >
      {Array.from({ length: ITEM_COUNT }).map((_, i) => (
        <Link
          key={i}
          href={`/`}
          className="flex flex-shrink-0 items-center uppercase gap-4"
        >

          <Logo className="w-[150px] h-auto readyIn" fill="white" style={{ animationDelay: `${.5 + (i * .15)}s` }} />
        </Link>
      ))}

    </motion.div>
  )
}
