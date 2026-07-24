'use client'

import useMeasure from "react-use-measure"
import React, { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TextOn } from "@/lib/util/misc"

const COLUMNS = 6

export default function Catalog({ data }: any) {
  const [ref, { width, height }] = useMeasure()
  const pathname = usePathname()
  const [current, setCurrent] = useState(null)
  const cellSize = width / COLUMNS
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (rows > 0 && rows % 2 === 0) rows += 1


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

      <div className="absolute w-screen h-screen top-0 left-0 z-0 pointer-events-none">

      </div>
      <div
        ref={ref}
        className={`z-50 absolute inset-0 w-screen h-screen flex items-center overflow-hidden z-10 pointer-events-none`}
      >
        <div className="grid grid-cols-6 w-full items-start">

          {data?.map((item: any, i: any) => (
            <React.Fragment key={i}>
              <Link href={`/work/${item.slug}`} onMouseEnter={(e) => { Hover(i, e) }} onMouseLeave={(e) => { UnHover(e) }} className="aspect-square relative fadeIn p-4 text-(--black) uppercase pointer-events-auto" style={{ animationDelay: `${i * .1}s` }}>
                <div className="flex mb-4 w-[30px] aspect-square items-center justify-center  bg-(--black) text-(--white)"><p >{i + 1}</p> </div>
                <h2 className=" text-[24px] leading-tight uppercase text-(--black) mb-[40px] uppercase onNorm infoHide"> <TextOn text={item.abbr} num={.5 + (i * .1)} /></h2>
                <h2 className="onNorm infoHide"><TextOn text={item.client} num={(i * .2) + .75} /></h2>
                <h2 className="onNorm infoHide mb-[40px]"><TextOn text={item.title} num={(i * .3) + 1} /></h2>
                {i == current && <h2 className="onNorm text-(--oj)"> <TextOn text="view project" num={0} /></h2>}
              </Link>
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
