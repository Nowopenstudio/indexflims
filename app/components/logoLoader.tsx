'use client'

import { motion, useMotionValue, animate } from "motion/react"
import useMeasure from "react-use-measure"
import { useEffect, useMemo, useRef, useState } from "react"
import { LOGO_PATHS, LOGO_VIEWBOX } from "./assets/svg"

const [, , VB_WIDTH_STR, VB_HEIGHT_STR] = LOGO_VIEWBOX.split(' ')
const LOGO_WIDTH = Number(VB_WIDTH_STR)
const LOGO_HEIGHT = Number(VB_HEIGHT_STR)
const LOGO_DISPLAY_WIDTH = 400
const MIN_DURATION = 2

export default function LogoLoader({ percent, onSettled, onScaleStart }: any) {
  const [ref, { width, height }] = useMeasure()
  const scale = LOGO_DISPLAY_WIDTH / LOGO_WIDTH
  const displayHeight = LOGO_HEIGHT * scale
  const centerX = width / 2
  const centerY = height / 2
  const pivotX = centerX + width * 0.7
  const tx = centerX - LOGO_DISPLAY_WIDTH / 2
  const ty = centerY - displayHeight / 2
  const bigScale = (Math.max(width, height) / LOGO_HEIGHT) * 4
  const anchorX = LOGO_WIDTH * 0.5 + LOGO_WIDTH * 0.2
  const anchorY = LOGO_HEIGHT / 2
  const bigTx = pivotX - bigScale * anchorX
  const bigTy = centerY - bigScale * anchorY

  const startRef = useRef(Date.now())
  const [complete, setComplete] = useState(false)
  const duration = useMemo(() => {
    if (percent < 100) return 0.6
    const elapsed = (Date.now() - startRef.current) / 1000
    return elapsed < MIN_DURATION ? MIN_DURATION - elapsed : 0.6
  }, [percent])

  const progress = useMotionValue(0)
  const [holeTransform, setHoleTransform] = useState(`translate(${tx}, ${ty}) scale(${scale})`)

  useEffect(() => {
    const apply = (v: number) => {
      const x = tx + (bigTx - tx) * v
      const y = ty + (bigTy - ty) * v
      const s = scale + (bigScale - scale) * v
      setHoleTransform(`translate(${x}, ${y}) scale(${s})`)
    }
    apply(progress.get())
    return progress.on("change", apply)
  }, [progress, tx, ty, scale, bigTx, bigTy, bigScale])

  useEffect(() => {
    if (!complete) return
    let controls: ReturnType<typeof animate> | undefined
    const timer = setTimeout(() => {
      onScaleStart?.()
      controls = animate(progress, 1, { duration: 1.6, ease: "easeInOut" })
      controls.then(() => onSettled?.())
    }, 1000)
    return () => {
      clearTimeout(timer)
      controls?.stop()
    }
  }, [complete, progress, onSettled, onScaleStart])


  return (
    <motion.div
      ref={ref}
      className="fixed inset-0 h-screen w-screen z-[40] overflow-hidden"
      animate={{ opacity: complete ? 0 : 1 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: complete ? 2.6 : 0 }}
      style={{ pointerEvents: complete ? "none" : "auto" }}
    >
      <svg className="absolute inset-0 w-full h-full">
        <mask id="logoMask">
          {width > 0 && (
            <g transform={`translate(${tx}, ${ty}) scale(${scale})`}>
              {LOGO_PATHS.map((d, i) => (
                <path key={i} d={d} fill="white" />
              ))}
            </g>
          )}
        </mask>
        <mask id="holeMask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          {width > 0 && (
            <g transform={holeTransform}>
              {LOGO_PATHS.map((d, i) => (
                <path key={i} d={d} fill="black" />
              ))}
            </g>
          )}
        </mask>
        <rect x="0" y="0" width="100%" height="100%" className="fill-(--black)" mask="url(#holeMask)" />
        <clipPath id="wipeClip">
          <motion.rect
            y="0"
            width={width}
            height={height}
            animate={{ x: complete ? width : 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        </clipPath>
        <g clipPath="url(#wipeClip)">
          <rect x="0" y="0" width="100%" height="100%" fill="#2A2A2A" mask="url(#logoMask)" />
          <motion.rect
            x="0"
            y="0"
            height="100%"
            className="fill-(--oj)"
            mask="url(#logoMask)"
            animate={{ width: (percent / 100) * width }}
            transition={{ duration, ease: "linear" }}
            onAnimationComplete={() => {
              if (percent >= 100) setComplete(true)
            }}
          />
        </g>
      </svg>

    </motion.div>
  )
}
