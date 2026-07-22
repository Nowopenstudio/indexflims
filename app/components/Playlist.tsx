'use client'

import useMeasure from "react-use-measure"
import { Cross } from "./assets/svg"
import React, { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { TextOn } from "@/lib/util/misc"
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

  useEffect(() => {
    setCurr(filterKey(data, "slug", slug))
  }, [data, slug])






  return (
    <div
      ref={ref}
      className="z-[40] fixed inset-0 w-screen h-screen flex items-center overflow-hidden playlist cursor-pointer pointer-events-none"
    >
      <div className="grid grid-cols-6 w-full align-start">

        <div className="col-span-full grid grid-cols-6">
          <div className="aspect-square relative fadeIn p-4 text-(--white) uppercase">

          </div>
        </div>
        <div className="col-span-full grid grid-cols-6 ">
          <div className="aspect-square relative"></div>
        </div>
        <div className="col-span-full flex gap-0">
          {data?.map((item: any, i: any) => (
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
          ))}
        </div>
      </div>

    </div >
  )
}
