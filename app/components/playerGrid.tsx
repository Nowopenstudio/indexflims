'use client'

import useMeasure from "react-use-measure"
import { useEffect, useRef, useState } from "react"
import { TextOn } from "@/lib/util/misc"

const COLUMNS = 6
const IDLE_TIMEOUT = 4000

const formatTime = (time: number) => {
  const total = Math.max(0, time || 0)
  const minutes = Math.floor(total / 60)
  const seconds = Math.floor(total % 60)
  const milliseconds = Math.floor((total % 1) * 100)
  return [minutes, seconds, milliseconds]
    .map((n) => String(n).padStart(2, '0'))
    .join(':')
}

export default function PlayGrid({ data, duration, currentTime, isPlaying, onToggle }: any) {
  const [ref, { width, height }] = useMeasure()
  const cellSize = width / COLUMNS
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (rows > 0 && rows % 2 === 0) rows += 1

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  const [dim, setDim] = useState(false)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const resetIdle = () => {
      setDim(false)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      if (!isPlaying) return
      idleTimer.current = setTimeout(() => setDim(true), IDLE_TIMEOUT)
    }

    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel']
    events.forEach((event) => window.addEventListener(event, resetIdle))
    resetIdle()

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetIdle))
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [isPlaying])

  useEffect(() => {
    document.body.classList.toggle('dim', dim)
    return () => {
      document.body.classList.remove('dim')
    }
  }, [dim])

  return (
    <div
      ref={ref}
      className="z-[40] fixed inset-0 w-screen h-screen flex items-center overflow-hidden playerUI cursor-none"
      onClick={onToggle}
      onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
    >
      <div className="grid grid-cols-6 w-full align-start">

        <div className="col-span-full grid grid-cols-6">
          <div className="aspect-square relative fadeIn p-4 text-(--white) uppercase">

            <h2 className="font-geis text-[24px] leading-tight uppercase text-(--white) mb-[40px] uppercase">{data.abbr}</h2>

            <h2 className="onNorm"><TextOn text={data.client} num={0} /></h2>
            <h2 className="mb-[40px] onNorm"><TextOn text={data.title} num={.5} /></h2>
            <h2 className="onNorm">{data.type && <TextOn text={data.type?.join(", ")} num={2.0} />}</h2>

          </div>
        </div>
        <div className="col-span-full grid grid-cols-6 ">
          <div className="aspect-square relative"></div>
        </div>
        <div className="col-span-full grid grid-cols-6 ">
          <div className="aspect-square relative"></div>
        </div>
      </div>
      <div className="scrubberHold absolute w-full h-[1px] left-0 z-50  top-1/2 left-0 translate-y-[-50%]">
        <div className="scrubber h-full bg-(--oj) transition-[width] duration-300 ease-linear relative" style={{ width: `${progress}%` }}>
          <div className="text-(--oj) absolute bottom-0 right-0 translate-y-full "><h2>{formatTime(currentTime)}</h2></div>
        </div>
      </div>
      <div
        className="controls fixed pointer-events-none uppercase text-(--white) text-[12px] z-50"
        style={{ left: mouse.x, top: mouse.y, transform: 'translate(-50%, -50%)' }}
      >
        <h2>{isPlaying ? 'Pause' : 'Play'}</h2>
      </div>
    </div >
  )
}
