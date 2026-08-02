'use client'

import useMeasure from "react-use-measure"
import React, { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useInView } from "motion/react"
import { BREAKPOINTS, TextOn, useMediaQuery } from "@/lib/util/misc"
import { MuxVideoBG } from "@/lib/util/muxPlayer"
import MuxPlayer from "@mux/mux-player-react"
import LogoLoader from "./logoLoader"
import Grid from "./grid"

const COLUMNS = 6

function FeatItem({ item, i, current, isLgUp, activate, deactivate }: any) {
  const itemRef = useRef<HTMLAnchorElement>(null)
  const inView = useInView(itemRef, { once: false, margin: "-15% 0px -75% 0px" })

  useEffect(() => {
    if (isLgUp) return
    if (inView) activate(i)
    else deactivate(i)
  }, [inView, isLgUp, i, activate, deactivate])

  return (
    <Link ref={itemRef} href={`/work/${item.slug}`} onMouseEnter={isLgUp ? () => activate(i) : undefined} onMouseLeave={isLgUp ? () => deactivate(i) : undefined} className={`singleFeat lg:aspect-square relative fadeIn p-4 text-(--white) uppercase pointer-events-auto${current === i ? ' active' : ''}`} style={{ animationDelay: `${i * .01}s` }}>
      <div className="flex mb-4 w-[30px] aspect-square items-center justify-center  bg-(--white) text-(--black) counter"><p >{i + 1}</p> </div>
      <h2 className=" text-[24px] leading-tight uppercase mb-[40px] uppercase onNorm infoHide"> <TextOn text={item.abbr} num={.5 + (i * .1)} /></h2>
      <h2 className="onNorm infoHide"><TextOn text={item.client} num={(i * .2) + .75} /></h2>
      <h2 className="onNorm infoHide mb-[40px]"><TextOn text={item.title} num={(i * .3) + 1} /></h2>
      {i == current && <h2 className="onNorm">{<TextOn text="view project" num={0} />}</h2>}
    </Link>
  )
}

function AllItem({ i, current, isLgUp, activate, deactivate }: any) {
  const itemRef = useRef<HTMLAnchorElement>(null)
  const inView = useInView(itemRef, { once: false, margin: "-15% 0px -75% 0px" })

  useEffect(() => {
    if (isLgUp) return
    if (inView) activate(i)
    else deactivate(i)
  }, [inView, isLgUp, i, activate, deactivate])

  return (
    <Link ref={itemRef} href={`/work/all`} onMouseEnter={isLgUp ? () => activate(i) : undefined} onMouseLeave={isLgUp ? () => deactivate(i) : undefined} className={`singleFeat lg:aspect-square relative fadeIn p-4 text-(--white) uppercase pointer-events-auto${current === i ? ' active' : ''} pb-[60vh] md:pb-4`} style={{ animationDelay: `${i * .01}s` }}>
      <div className="flex mb-4 w-[30px] aspect-square items-center justify-center  bg-(--white) text-(--black) counter"><p >{">"}</p> </div>
      <h2 className=" leading-tight uppercase mb-[40px] uppercase onNorm infoHide"> <TextOn text={'full project list'} num={.5 + (i * .1)} /></h2>
      {i == current && <h2 className="onNorm">{<TextOn text="view all" num={0} />}</h2>}
    </Link>
  )
}

export default function WorkGrid({ data, all }: any) {
  const [ref, { width, height }] = useMeasure()
  const contentRef = useRef<HTMLDivElement>(null)
  const setRefs = useCallback((el: HTMLDivElement | null) => {
    ref(el)
    contentRef.current = el
  }, [ref])
  const [current, setCurrent] = useState(null)
  const [loadedIds, setLoadedIds] = useState<Set<string>>(new Set())
  const [loaderPercent, setLoaderPercent] = useState(0)
  const [showLoader, setShowLoader] = useState(true)
  const [pageLoading, setPageLoading] = useState(false)
  const [pageReady, setPageReady] = useState(false)
  const pathname = usePathname()
  const cellSize = width / COLUMNS
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (rows > 0 && rows % 2 === 0) rows += 1

  useEffect(() => {
    if (pathname !== '/') {
      setPageReady(true)
      setShowLoader(false)
      document.body.classList.add('pageReady')
      document.body.classList.add('pageSettled')
      return
    }
    if (sessionStorage.getItem('skipLoader') === 'true') {
      sessionStorage.removeItem('skipLoader')
      setPageReady(true)
      setShowLoader(false)
      document.body.classList.add('pageReady')
      document.body.classList.add('pageSettled')
    }
  }, [pathname])

  const isLgUp = useMediaQuery(BREAKPOINTS.lg, true)
  const isMdUp = useMediaQuery(BREAKPOINTS.md, true)
  const isXlUp = useMediaQuery(BREAKPOINTS.xl, true)

  const [alignedTop, setAlignedTop] = useState(100)

  useEffect(() => {
    const minTop = isXlUp ? 0 : 100

    if (!isMdUp) {
      setAlignedTop(minTop)
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
    }

    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [isMdUp, isXlUp, width, height])

  const videoIds: string[] = Array.from(new Set<string>(data?.map((item: any) => (isMdUp ? item.loop?.vid : item.loop?.mobVid)).filter(Boolean) ?? []))
  const allLoaded = loaderPercent >= 100
  const [preloadCount, setPreloadCount] = useState(1)

  const markLoaded = (id: string) => {
    setLoadedIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)))
  }

  useEffect(() => {
    if (videoIds.length === 0) return
    setLoaderPercent(Math.round((loadedIds.size / videoIds.length) * 100))
  }, [loadedIds, videoIds.length]);

  useEffect(() => {
    if (preloadCount >= videoIds.length) return
    const timer = setTimeout(() => setPreloadCount((c) => c + 1), 200)
    return () => clearTimeout(timer)
  }, [preloadCount, videoIds.length]);

  useEffect(() => {
    const timeout = setTimeout(() => setLoaderPercent((p) => (p < 100 ? 100 : p)), 2000)
    return () => clearTimeout(timeout)
  }, []);

  useEffect(() => {
    if (isLgUp) setCurrent(null)
  }, [isLgUp])

  useEffect(() => {
    document.body.classList.toggle('hoverActive', current !== null)
  }, [current])

  const activate = useCallback((i: any) => {
    setCurrent(i)
  }, [])
  const deactivate = useCallback((i: any) => {
    setCurrent((prev) => (prev === i ? null : prev))
  }, [])

  useEffect(() => {
    if (allLoaded) {
      document.body.classList.add('loadActive');
    }
  }, [allLoaded]);

  useEffect(() => {
    if (pageLoading) {
      document.body.classList.add('pageReady');
    }
  }, [pageLoading]);

  useEffect(() => {
    return () => {
      document.body.classList.remove('hoverActive');
      document.body.classList.remove('loadActive');

      document.querySelectorAll('.active').forEach((el) => el.classList.remove('active'));
    };
  }, []);

  return (
    <React.Fragment>
      <Grid />
      {showLoader && (
        <LogoLoader
          percent={loaderPercent}
          onScaleStart={() => setPageLoading(true)}
          onSettled={() => {
            setPageReady(true)
            setShowLoader(false)
            document.body.classList.add('pageSettled')
          }}
        />
      )}

      <div style={{ position: 'fixed', width: 1, height: 1, top: 0, left: 0, opacity: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden>
        {videoIds.slice(0, preloadCount).map((id) => (
          <MuxPlayer
            key={id}
            playbackId={id}
            preload="auto"
            muted
            playsInline
            onCanPlay={() => markLoaded(id)}
          />
        ))}
      </div>
      <div
        ref={setRefs}
        className={` inset-0 w-screen min-h-screen relative flex items-start  ${pageLoading ? ' pageReady' : ''} pointer-events-none`}
        style={{ paddingTop: alignedTop }}
      >
        <div className="absolute w-screen h-full top-0 left-0 z-0 pointer-events-none">
          <div className="h-screen w-full bgMux noControl z-0 opacity-[.8] sticky top-0">

            {isMdUp ? (current && current == data.length ? (<MuxVideoBG playbackId={all.vid} title="Shows Video" ratio={all.ratio} />) : (
              <MuxVideoBG playbackId={data[current ? current : 0].loop.vid} title="Shows Video" ratio={data[current ? current : 0].loop.ratio} />
            )) : (current && current == data.length ? (<MuxVideoBG playbackId={all.vid} title="Shows Video" ratio={all.ratio} />) : (
              <MuxVideoBG playbackId={data[current ? current : 0].loop.mobVid} title="Shows Video" ratio={data[current ? current : 0].loop.mobRatio} />
            ))}

          </div>
        </div>
        <div className="workGrid grid grid-cols-1 md:grid-cols-4 xl:grid-cols-6 w-full relative z-50">

          {pageReady && data?.map((item: any, i: any) => (
            <React.Fragment key={i}>

              <FeatItem item={item} i={i} current={current} isLgUp={isLgUp} activate={activate} deactivate={deactivate} />

              <div className="aspect-square hidden xl:block"></div>
              {i == 2 ? (
                <React.Fragment>

                  <div className="aspect-square relative hidden xl:block"></div>
                </React.Fragment>
              ) : ('')}
            </React.Fragment>
          ))}
          {pageReady && <AllItem i={data.length} current={current} isLgUp={isLgUp} activate={activate} deactivate={deactivate} />
          }
        </div>
      </div >

    </React.Fragment>
  )
}
