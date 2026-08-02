'use client'

import useMeasure from "react-use-measure"
import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useInView } from "motion/react"
import { BREAKPOINTS, TextOn, useMediaQuery } from "@/lib/util/misc"
import Grid from "@/app/components/grid"

const COLUMNS = 6

function CatalogItem({ item, i, current, onHover, onUnhover }: any) {
  const itemRef = useRef<HTMLAnchorElement>(null)
  const inView = useInView(itemRef, { once: true, margin: '0px 0px -10% 0px' })

  return (
    <Link
      ref={itemRef}
      href={`/work/${item.slug}`}
      onMouseEnter={(e) => onHover(i, e)}
      onMouseLeave={(e) => onUnhover(e)}
      className="md:aspect-square relative p-4 text-(--black) uppercase pointer-events-auto singleWork"
      style={{ opacity: inView ? 1 : 0, transition: 'opacity 0.6s ease-out', transitionDelay: `${(i % COLUMNS) * 0.06}s` }}
    >
      <div className="flex mb-4 w-[30px] aspect-square items-center justify-center  bg-(--black) text-white counter "><p >{i + 1}</p> </div>
      <h2 className=" text-[24px] leading-tight uppercase  mb-[40px] uppercase onNorm infoHide"> <TextOn text={item.abbr} num={.5 + (i * .1)} /></h2>
      <h2 className="onNorm infoHide"><TextOn text={item.client} num={(i * .2) + .75} /></h2>
      <h2 className="onNorm infoHide mb-[40px]"><TextOn text={item.title} num={(i * .3) + 1} /></h2>
      {i == current && <h2 className="onNorm hidden md:block"> <TextOn text="view project" num={0} /></h2>}
    </Link>
  )
}

export default function Catalog({ data }: any) {
  const [ref, { width, height }] = useMeasure()
  const contentRef = useRef<HTMLDivElement>(null)
  const setRefs = useCallback((el: HTMLDivElement | null) => {
    ref(el)
    contentRef.current = el
  }, [ref])
  const pathname = usePathname()
  const [current, setCurrent] = useState(null)
  const cellSize = width / COLUMNS
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (rows > 0 && rows % 2 === 0) rows += 1

  const isMdUp = useMediaQuery(BREAKPOINTS.md, true)
  const isXlUp = useMediaQuery(BREAKPOINTS.xl, true)

  const [alignedTop, setAlignedTop] = useState(100)
  const [layoutReady, setLayoutReady] = useState(false)

  useEffect(() => {
    const minTop = isXlUp ? 0 : 100

    if (!isMdUp) {
      setAlignedTop(minTop)
      setLayoutReady(true)
      return
    }

    const measure = () => {
      const contentEl = contentRef.current
      const gridHold = document.querySelector('.crossGrid .gridHold')
      const firstCell = gridHold?.children?.[0] as HTMLElement | undefined
      if (!contentEl || !gridHold || !firstCell) return

      const contentTop = contentEl.getBoundingClientRect().top
      const gridTop = gridHold.getBoundingClientRect().top
      const cellHeight = firstCell.getBoundingClientRect().height
      if (cellHeight <= 0) return

      const target = contentTop + minTop
      let steps = Math.round((target - gridTop) / cellHeight)
      let alignedY = gridTop + steps * cellHeight
      while (alignedY < 200) {
        steps += 1
        alignedY = gridTop + steps * cellHeight
      }
      setAlignedTop(Math.max(0, alignedY - contentTop))
      setLayoutReady(true)
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [isMdUp, isXlUp, width, height])

  const Hover = (i: any, e: any) => {
    setCurrent(i);

    e.currentTarget.classList.add('active');
  }
  const UnHover = (e: any) => {
    setCurrent(null);

    e.currentTarget.classList.remove('active');
  }


  return (
    <React.Fragment>

      <Grid />
      <div
        ref={setRefs}
        className={`z-40 relative inset-0 w-screen min-h-screen overflow-hidden z-10 pointer-events-none bg-(--white)`}
        style={{ paddingTop: alignedTop }}
      >
        <div className="catalogGrid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 w-full items-start">

          {layoutReady && data?.map((item: any, i: any) => (
            <React.Fragment key={i}>
              <CatalogItem item={item} i={i} current={current} onHover={Hover} onUnhover={UnHover} />
            </React.Fragment>
          ))}
          <div className="col-span-full grid grid-cols-6 pointer-events-none ">
            <div className="aspect-square relative"></div>
          </div>
        </div>
      </div >

    </React.Fragment>
  )
}
