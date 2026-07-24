'use client'

import useMeasure from "react-use-measure"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TextOn } from "@/lib/util/misc"
import { MuxVideoBG } from "@/lib/util/muxPlayer"
import MuxPlayer from "@mux/mux-player-react"
import LogoLoader from "./logoLoader"

const COLUMNS = 6

export default function WorkGrid({ data }: any) {
  const [ref, { width, height }] = useMeasure()
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
      return
    }
    if (sessionStorage.getItem('skipLoader') === 'true') {
      sessionStorage.removeItem('skipLoader')
      setPageReady(true)
      setShowLoader(false)
      document.body.classList.add('pageReady')
    }
  }, [pathname])

  const videoIds: string[] = Array.from(new Set<string>(data?.map((item: any) => item.loop?.vid).filter(Boolean) ?? []))
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

  const Hover = (i: any, e: any) => {
    setCurrent(i);
    document.body.classList.add('hoverActive');
    e.currentTarget.classList.add('active');
  }
  const UnHover = (e: any) => {
    setCurrent(null)
    document.body.classList.remove('hoverActive');
    e.currentTarget.classList.remove('active');
  }

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
      {showLoader && (
        <LogoLoader
          percent={loaderPercent}
          onScaleStart={() => setPageLoading(true)}
          onSettled={() => {
            setPageReady(true)
            setShowLoader(false)
          }}
        />
      )}
      <div className="absolute w-screen h-screen top-0 left-0 z-0 pointer-events-none">
        <div className="h-full w-full bgMux noControl z-0 opacity-[.8]">
          {current && current == data.length ? (<MuxVideoBG playbackId={data[0].loop.vid} title="Shows Video" ratio={data[0].loop.ratio} />) : (
            <MuxVideoBG playbackId={data[current ? current : 0].loop.vid} title="Shows Video" ratio={data[current ? current : 0].loop.ratio} />
          )}

        </div>
      </div>
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
        ref={ref}
        className={`z-50 absolute inset-0 w-screen h-screen flex items-center overflow-hidden z-10${pageLoading ? ' pageReady' : ''} pointer-events-none`}
      >
        <div className="grid grid-cols-6 w-full">
          <div className="col-span-full grid grid-cols-6 pointer-events-none ">
            <div className="aspect-square relative"></div>
          </div>
          {pageReady && data?.map((item: any, i: any) => (
            <React.Fragment key={i}>
              <Link href={`/work/${item.slug}`} onMouseEnter={(e) => { Hover(i, e) }} onMouseLeave={(e) => { UnHover(e) }} className="aspect-square relative fadeIn p-4 text-(--white) uppercase pointer-events-auto" style={{ animationDelay: `${i * .01}s` }}>
                <div className="flex mb-4 w-[30px] aspect-square items-center justify-center  bg-(--white) text-(--black)"><p >{i + 1}</p> </div>
                <h2 className=" text-[24px] leading-tight uppercase text-(--white) mb-[40px] uppercase onNorm infoHide"> <TextOn text={item.abbr} num={.5 + (i * .1)} /></h2>
                <h2 className="onNorm infoHide"><TextOn text={item.client} num={(i * .2) + .75} /></h2>
                <h2 className="onNorm infoHide mb-[40px]"><TextOn text={item.title} num={(i * .3) + 1} /></h2>
                {i == current && <h2 className="onNorm">{<TextOn text="view project" num={0} />}</h2>}
              </Link>
              <div className="aspect-square"></div>
              {i == 2 ? (
                <React.Fragment>
                  <div className="col-span-full grid grid-cols-6 pointer-events-none">
                    <div className="aspect-square relative"></div>
                  </div>
                  <div className="aspect-square relative"></div>
                </React.Fragment>
              ) : ('')}
            </React.Fragment>
          ))}
          {pageReady && <Link href={`/work/all`} onMouseEnter={(e) => { Hover(data.length, e) }} onMouseLeave={(e) => { UnHover(e) }} className="aspect-square relative fadeIn p-4 text-(--white) uppercase pointer-events-auto" style={{ animationDelay: `${data.length * .00}s` }}>
            <div className="flex mb-4 w-[30px] aspect-square items-center justify-center  bg-(--white) text-(--black)"><p >{">"}</p> </div>
            <h2 className=" text-[24px] leading-tight uppercase text-(--white) mb-[40px] uppercase onNorm infoHide"> <TextOn text={'full project list'} num={.5 + (data.length * .1)} /></h2>


            {data.length == current && <h2 className="onNorm">{<TextOn text="view all" num={0} />}</h2>}
          </Link>}

          <div className="col-span-full grid grid-cols-6 pointer-events-none ">
            <div className="aspect-square relative"></div>
          </div>
        </div>
      </div >

    </React.Fragment>
  )
}
