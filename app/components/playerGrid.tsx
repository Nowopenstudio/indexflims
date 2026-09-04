'use client'

import useMeasure from "react-use-measure"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { TextOn } from "@/lib/util/misc"
import { Cross, Laurel } from "./assets/svg"
import React from "react"
import Grid from "./grid"

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

export default function PlayGrid({ data, duration, currentTime, isPlaying, onToggle, onSeek }: any) {
  const router = useRouter()
  const [ref, { width, height }] = useMeasure()

  const [dragging, setDragging] = useState(false)
  const [dragProgress, setDragProgress] = useState(0)
  const scrubberHoldRef = useRef<HTMLDivElement>(null)

  const progress = dragging
    ? dragProgress
    : duration > 0 ? (currentTime / duration) * 100 : 0
  const displayTime = dragging ? (dragProgress / 100) * duration : currentTime

  const [dim, setDim] = useState(false)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const [hoveringOther, setHoveringOther] = useState(false)
  const [hoveringSeeker, setHoveringSeeker] = useState(false)

  const progressFromEvent = (e: { clientX: number }) => {
    const el = scrubberHoldRef.current
    if (!el) return 0
    const rect = el.getBoundingClientRect()
    return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)) * 100
  }

  const handleSeekPointerDown = (e: React.PointerEvent) => {
    e.stopPropagation()
    const pct = progressFromEvent(e)
    setDragging(true)
    setDragProgress(pct)
    onSeek?.((pct / 100) * duration)
      ; (e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handleSeekPointerMove = (e: React.PointerEvent) => {
    if (!dragging) return
    e.stopPropagation()
    const pct = progressFromEvent(e)
    setDragProgress(pct)
    onSeek?.((pct / 100) * duration)
  }

  const handleSeekPointerUp = (e: React.PointerEvent) => {
    if (!dragging) return
    e.stopPropagation()
    setDragging(false)
      ; (e.target as HTMLElement).releasePointerCapture(e.pointerId)
  }

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
    <React.Fragment>

      <div
        ref={ref}
        className="z-[38] pt-[20px] md:pt-[100px] relative md:fixed inset-0 w-screen md:h-screen overflow-hidden playerUI cursor-none"
        onClick={onToggle}
        onMouseMove={(e) => setMouse({ x: e.clientX, y: e.clientY })}
      >
        <div className="gridHold grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 w-full align-start">
          <div className="col-span-full grid grid-cols-6 relative">
            <div className="col-span-full lg:col-span-1 lg:aspect-square relative fadeIn p-4 text-(--white) uppercase">
              <h2 className="font-geis text-[24px] leading-tight uppercase text-(--white) mb-[40px] uppercase">{data.abbr}</h2>
              <h2 className="onNorm"><TextOn text={data.client} num={0} /></h2>
              <h2 className="mb-[40px] onNorm"><TextOn text={data.title} num={.5} /></h2>
              {data.credits ? (
                <div className="mb-[40px]">
                  {data.credits.map((item: any, i: number) => {
                    return (
                      <h2 key={i} className="onNorm"><TextOn text={`${item.role} : ${item.name}`} num={.5} /></h2>
                    )
                  })}
                </div>
              ) : ('')}
              <h2 className="onNorm">{data.type && <TextOn text={data.type?.join(", ")} num={2.0} />}</h2>

            </div>
            <div className="col-span-full lg:col-span-2 lg:col-start-3 pointer-events-none pt-8 lg:pt-0 px-4">
              <div className="w-full h-auto flex flex-wrap md:flex-nowrap justify-start lg:justify-center items-center gap-4 md:gap-8">
                {data.awards?.map((a: any, i: number) => {
                  return (
                    <div key={i} className="w-[100px] md:w-[120px] relative flex-shrink-0 h-auto">
                      <Laurel className="w-full h-auto" fill="white" />
                      <div className="w-full absolute h-full top-0 left-0 uppercase flex text-center items-center justify-center text-white z-10 px-4 pb-2">
                        <p className="caption">{a.title}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            <div
              className="absolute top-0 right-0 z-50 md:aspect-square md:relatove md:col-end-7 flex justify-end px-4 items-start backBut"
              onClick={(e) => {
                e.stopPropagation()
                router.push(sessionStorage.getItem('lastListPage') ?? '/')
              }}
              onMouseEnter={() => setHoveringOther(true)}
              onMouseLeave={() => setHoveringOther(false)}
            >
              <Cross stroke="white" className="w-[50px] h-auto rotate-[45deg]" />
            </div>
          </div>
          <div className="col-span-full grid grid-cols-6 ">
            <div className="aspect-square relative"></div>
          </div>
          <div className="col-span-full grid grid-cols-6 ">
            <div className="aspect-square relative"></div>
          </div>
        </div>
        <div ref={scrubberHoldRef} className="scrubberHold absolute w-full h-[1px] left-0 z-50 top-0 md:top-1/2 left-0 translate-y-[-50%]">
          <div
            className="scrubber h-full bg-(--oj) relative"
            style={{ width: `${progress}%`, transition: dragging ? 'none' : 'width 300ms linear' }}
          >
            <div
              id="seeker"
              className="text-(--oj) absolute bottom-0 right-0 translate-y-full pointer-events-auto  touch-none"
              onPointerDown={handleSeekPointerDown}
              onPointerMove={handleSeekPointerMove}
              onPointerUp={handleSeekPointerUp}
              onPointerCancel={handleSeekPointerUp}
              onClick={(e) => e.stopPropagation()}
              onMouseEnter={() => setHoveringSeeker(true)}
              onMouseLeave={() => setHoveringSeeker(false)}
            >
              <h2>{formatTime(displayTime)}</h2>
            </div>
          </div>
        </div>
        <div
          className="hidden md:block controls fixed pointer-events-none uppercase text-(--white) text-[12px] z-50"
          style={{ left: mouse.x, top: mouse.y, transform: 'translate(-50%, -50%)' }}
        >
          <h2>{hoveringOther ? 'Back' : (hoveringSeeker || dragging) ? 'Seek' : isPlaying ? 'Pause' : 'Play'}</h2>
        </div>
      </div >
    </React.Fragment>
  )
}
