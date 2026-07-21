'use client'

import useMeasure from "react-use-measure"
import { Cross } from "./assets/svg"
import React, { useState } from "react"
import Link from "next/link"
import { TextOn } from "@/lib/util/misc"
import { MuxVideoBG } from "@/lib/util/muxPlayer"

const COLUMNS = 6

export default function WorkGrid({ data }: any) {
  const [ref, { width, height }] = useMeasure()
  const [current, setCurrent] = useState(0)
  const cellSize = width / COLUMNS
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (rows > 0 && rows % 2 === 0) rows += 1

  const Hover = (i: any, e: any) => {
    setCurrent(i);
    document.body.classList.add('hoverActive');
    e.currentTarget.classList.add('active');
  }
  const UnHover = (i: any, e: any) => {
    document.body.classList.remove('hoverActive');
    e.currentTarget.classList.remove('active');
  }

  return (
    <React.Fragment>
      <div className="absolute w-screen h-screen top-0 left-0 z-0">
        <div className="h-full w-full bgMux noControl z-0 opacity-[.8]">
          <MuxVideoBG playbackId={data[current].loop.vid} title="Shows Video" ratio={data[current].loop.ratio} />
        </div>
      </div>
      <div
        ref={ref}
        className="z-50 absolute inset-0 w-screen h-screen flex items-center overflow-hidden z-10"
      >
        <div className="grid grid-cols-6 w-full">
          <div className="col-span-full grid grid-cols-6 ">
            <div className="aspect-square relative"></div>
          </div>
          {data?.map((item: any, i: any) => (
            <React.Fragment key={i}>
              <Link href={`/work/${item.slug}`} onMouseEnter={(e) => { Hover(i, e) }} onMouseLeave={(e) => { UnHover(i, e) }} className="aspect-square relative fadeIn p-4 text-(--white) uppercase" style={{ animationDelay: `${i * .00}s` }}>
                <div className="flex mb-4 w-[30px] aspect-square items-center justify-center  bg-(--white) text-(--black)"><p >{i + 1}</p> </div>
                <h2 className=" text-[24px] leading-tight uppercase text-(--white) mb-[40px] uppercase onNorm infoHide"> <TextOn text={item.abbr} num={.25 + (i * .1)} /></h2>
                <h2 className="onNorm infoHide"><TextOn text={item.client} num={(i * .2) + .5} /></h2>
                <h2 className="onNorm infoHide mb-[40px]"><TextOn text={item.title} num={(i * .3) + .75} /></h2>
                {i == current && item.type && <h2 className="onNorm"><TextOn text={item.type?.join(", ")} num={0} /></h2>}
              </Link>
              <div className="aspect-square"></div>
              {i == 2 ? (
                <React.Fragment>
                  <div className="col-span-full grid grid-cols-6 ">
                    <div className="aspect-square relative"></div>
                  </div>
                  <div className="aspect-square relative"></div>
                  <div className="aspect-square relative"></div>
                </React.Fragment>
              ) : ('')}
            </React.Fragment>
          ))}
          <div className="col-span-full grid grid-cols-6 ">
            <div className="aspect-square relative"></div>
          </div>
        </div>
      </div >

    </React.Fragment>
  )
}
