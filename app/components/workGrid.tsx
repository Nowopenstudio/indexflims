'use client'

import useMeasure from "react-use-measure"
import { Cross } from "./assets/svg"
import React from "react"
import Link from "next/link"

const COLUMNS = 6

export default function WorkGrid({ data }: any) {
  const [ref, { width, height }] = useMeasure()
  const cellSize = width / COLUMNS
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (rows > 0 && rows % 2 === 0) rows += 1

  return (
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

            <Link href={`/work/${item.slug}`} className="aspect-square relative fadeIn p-4 text-(--white) uppercase" style={{ animationDelay: `${i * .05}s` }}>
              <div className="flex mb-4 w-[30px] aspect-square items-center justify-center  bg-(--white) text-(--black)">{i + 1} </div>
              <h2 className="font-geis text-[24px] leading-tight uppercase text-(--white) mb-[40px] uppercase">{item.abbr}</h2>

              <h2>{item.client}</h2>
              <h2>{item.title}</h2>

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
  )
}
