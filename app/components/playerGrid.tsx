'use client'

import useMeasure from "react-use-measure"
import { Cross } from "./assets/svg"
import React from "react"
import Link from "next/link"
import { TextOn } from "@/lib/util/misc"

const COLUMNS = 6

export default function PlayGrid({ data }: any) {
  const [ref, { width, height }] = useMeasure()
  const cellSize = width / COLUMNS
  let rows = cellSize > 0 ? Math.ceil(height / cellSize) : 0
  if (rows > 0 && rows % 2 === 0) rows += 1

  return (
    <div
      ref={ref}
      className="z-50 fixed inset-0 w-screen h-screen flex items-center overflow-hidden "
    >
      <div className="grid grid-cols-6 w-full align-start">

        <div className="col-span-full grid grid-cols-6">
          <div className="aspect-square relative fadeIn p-4 text-(--white) uppercase">

            <h2 className="font-geis text-[24px] leading-tight uppercase text-(--white) mb-[40px] uppercase">{data.abbr}</h2>

            <h2 className="onNorm"><TextOn text={data.client} num={0} /></h2>
            <h2 className="mb-[40px] onNorm"><TextOn text={data.title} num={.5} /></h2>
            <h2 className="onNorm"><TextOn text={data.type?.join(", ")} num={2.0} /></h2>

          </div>
        </div>
        <div className="col-span-full grid grid-cols-6 ">
          <div className="aspect-square relative"></div>
        </div>
        <div className="col-span-full grid grid-cols-6 ">
          <div className="aspect-square relative"></div>
        </div>
      </div>

    </div >
  )
}
