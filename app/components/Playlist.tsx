'use client'

import useMeasure from "react-use-measure"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BREAKPOINTS, TextOn, useMediaQuery } from "@/lib/util/misc"
import { filterKey } from "@/lib/util/sanity"


const COLUMNS = 6



export default function Playlist({ data }: any) {
  const [ref, { width, height }] = useMeasure()
  const cellSize = width / COLUMNS
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (rows > 0 && rows % 2 === 0) rows += 1

  const pathname = usePathname()
  const slug = pathname?.split('/').filter(Boolean).pop()
  const [curr, setCurr] = useState<any>(null)
  const [hovered, setHovered] = useState<any>(null)
  const isMdUp = useMediaQuery(BREAKPOINTS.md, true)

  useEffect(() => {
    setCurr(filterKey(data, "slug", slug))
  }, [data, slug])

  const currentIndex = data ? data.findIndex((item: any) => item.slug === slug) : -1
  const prevItem = data?.length && currentIndex >= 0 ? data[(currentIndex - 1 + data.length) % data.length] : null
  const nextItem = data?.length && currentIndex >= 0 ? data[(currentIndex + 1) % data.length] : null






  return (
    <div
      ref={ref}
      className="pb-[20px] lg:pb-[100px] z-[39] fixed inset-0 w-screen h-screen flex flex-col justify-end overflow-hidden playlist cursor-pointer pointer-events-none"
    >
      <div className="grid grid-cols-6 w-full align-start">


        <div className="col-span-full flex gap-0 justify-center md:justify-start">
          {isMdUp ? data?.map((item: any, i: any) => (
            <React.Fragment key={i}>
              <Link
                href={`/work/${item.slug}`}
                className={`aspect-square flex flex-col flex-shrink-none relative fadeIn p-4  uppercase pointer-events-auto justify-end ${curr?.[0] === item ? ' text-(--oj) pointer-events-none' : 'text-(--white)'}`}
                style={{ animationDelay: `${i * .00}s`, width: `${100 / COLUMNS}%` }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <h2 className=" text-[24px] leading-tight uppercase  uppercase onNorm infoHide"> <TextOn text={hovered === i ? `${item.client}: ${item.title}` : item.abbr} num={0} /></h2>


              </Link>

            </React.Fragment>
          )) : (
            <div className="flex w-full justify-between px-4">
              {prevItem && (
                <Link href={`/work/${prevItem.slug}`} className="pointer-events-auto uppercase text-(--white) fadeIn">
                  <h2 className="text-[24px] leading-tight onNorm"><TextOn text="previous" num={0} /></h2>
                  <h2 className="onNorm"><TextOn text={prevItem.abbr} num={.1} /></h2>
                </Link>
              )}
              {nextItem && (
                <Link href={`/work/${nextItem.slug}`} className="text-right pointer-events-auto uppercase text-(--white) fadeIn">
                  <h2 className="text-[24px] leading-tight onNorm"><TextOn text="next" num={0} /></h2>
                  <h2 className="onNorm"><TextOn text={nextItem.abbr} num={.1} /></h2>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

    </div >
  )
}
