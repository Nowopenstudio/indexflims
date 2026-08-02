"use client"
import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const SCRAMBLE_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
const SCRAMBLE_STEPS = 5
const SCRAMBLE_STEP_MS = 40
const LINE_MODE_THRESHOLD = 50
const LINE_STEP_S = 0.08

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

export const BREAKPOINTS = {
  md: '(min-width: 768px)',
  lg: '(min-width: 1024px)',
  xl: '(min-width: 1280px)',
}

export function useMediaQuery(query: string, defaultValue: boolean = false) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return defaultValue
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mql = window.matchMedia(query)
    const update = () => setMatches(mql.matches)
    update()
    mql.addEventListener('change', update)
    return () => mql.removeEventListener('change', update)
  }, [query])

  return matches
}

export function useViewportHeight() {
  const [height, setHeight] = useState(() => (typeof window === 'undefined' ? 0 : window.innerHeight))

  useEffect(() => {
    const update = () => setHeight(window.innerHeight)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return height
}

export function getGridLayout(width: number, height: number, columns: number) {
  const cellSize = columns > 0 ? width / columns : 0
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (columns < 6) rows *= 2
  if (rows > 0 && rows % 2 === 0) rows += 1
  const offsetTop = cellSize > 0 ? (height - rows * cellSize) / 2 : 0
  return { cellSize, rows, offsetTop }
}

export function TextOn({ text, num }: { text?: string; num?: number; }) {
  const chars = (text ?? '').split('')
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const [display, setDisplay] = useState<string[]>(chars)
  const [visible, setVisible] = useState<boolean[]>(() => chars.map((c) => c === ' '))

  useEffect(() => {
    setDisplay(chars)
    setVisible(chars.map((c) => c === ' '))
  }, [text])

  useEffect(() => {
    if (!inView) return

    const useLineMode = chars.length > LINE_MODE_THRESHOLD
    let lineOf: number[] = []
    if (useLineMode && ref.current) {
      const spans = Array.from(ref.current.children) as HTMLElement[]
      const tops: number[] = []
      lineOf = spans.map((span) => {
        const top = span.offsetTop
        let lineIndex = tops.indexOf(top)
        if (lineIndex === -1) {
          tops.push(top)
          lineIndex = tops.length - 1
        }
        return lineIndex
      })
    }

    // delay (ms) before each letter starts scrambling; -1 for letters that never animate (spaces)
    const delays = chars.map((char, i) => {
      if (char === ' ') return -1
      return useLineMode
        ? (lineOf[i] * LINE_STEP_S + (num ?? 0)) * 1000
        : (Number(i) * .03 + (num ?? 0)) * 1000
    })
    // how many scramble steps each letter has rendered so far; -1 = not started, SCRAMBLE_STEPS = settled
    const stepsDone = chars.map(() => -1)
    // working copies mutated across ticks, independent of React state closures
    const workingDisplay = [...chars]
    const workingVisible = chars.map((c) => c === ' ')

    const start = performance.now()
    const interval = setInterval(() => {
      const elapsed = performance.now() - start
      let displayChanged = false
      let visibleChanged = false
      let pending = false

      chars.forEach((char, i) => {
        if (delays[i] < 0 || stepsDone[i] >= SCRAMBLE_STEPS) return
        const t = elapsed - delays[i]
        if (t < 0) { pending = true; return }

        const targetStep = Math.min(SCRAMBLE_STEPS, Math.floor(t / SCRAMBLE_STEP_MS))
        if (targetStep > stepsDone[i]) {
          stepsDone[i] = targetStep
          workingDisplay[i] = targetStep >= SCRAMBLE_STEPS ? char : randomChar()
          displayChanged = true
          if (!workingVisible[i]) {
            workingVisible[i] = true
            visibleChanged = true
          }
        }
        if (stepsDone[i] < SCRAMBLE_STEPS) pending = true
      })

      if (displayChanged) setDisplay([...workingDisplay])
      if (visibleChanged) setVisible([...workingVisible])
      if (!pending) clearInterval(interval)
    }, SCRAMBLE_STEP_MS)

    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, text, num])

  return (
    <span ref={ref}>
      {display.map((char, i) => (
        <span key={`${text}-toolLetter-${i}`} className="toolLetter" style={{ opacity: visible[i] ? 1 : 0 }}>{char}</span>
      ))}
    </span>
  )
}


export default function ScrollUp() {
  useEffect(() => {
    window.document.scrollingElement?.scrollTo(0, 0)
    window.scrollTo(0, 0)


  }, [])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    window.document.scrollingElement?.scrollTo(0, 0)

  }, []);


  return null
}

export function H1Stroke({ text, color, bg, time }: any) {
  return (
    <div className="relative w-full">
      <h1 className='absolute z-0 top-0 left-0 textStroke' style={{ color: bg, WebkitTextStrokeColor: bg, WebkitTextStrokeWidth: '14px' }}>{text}</h1>
      <h1 className='relative z-1 textStroke' style={{ color: color, WebkitTextStrokeColor: color, WebkitTextStrokeWidth: '1.5px' }}>{text}</h1>
    </div>
  )
}

export function H3Stroke({ text, color, bg, time }: any) {
  return (
    <div className="relative w-full">
      <h3 className='absolute z-0 top-0 left-0 textStroke' style={{ color: bg, WebkitTextStrokeColor: bg, WebkitTextStrokeWidth: '14px' }}>{text}</h3>
      <h3 className='relative z-1 textStroke' style={{ color: color, WebkitTextStrokeColor: color, WebkitTextStrokeWidth: '1.5px' }}>{text}</h3>
    </div>
  )
}

