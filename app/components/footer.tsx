'use client'

import React, { useRef } from "react";
import { motion, useInView } from "motion/react";
import FooterScroll from "./footerScroll";
import { PortableText } from "next-sanity";
import { TextOn } from "@/lib/util/misc";

function InView({ as: Tag = 'p', className = '', children }: any) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, margin: '-10% 0px' })
    return <Tag ref={ref} className={`${className}${inView ? ' onNorm' : ''}`}>{children}</Tag>
}

const portableTextComponents = {
    block: {
        normal: ({ value }: any) => (
            <InView><TextOn text={value.children?.map((c: any) => c.text).join('') ?? ''} num={0} /></InView>
        ),
    },
}

export default function Footer({ data }: any) {
    console.log(data)
    return (
        <motion.div
            id="footer"
            className='w-screen bg-(--black)'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
        >
            <div className="w-screen  text-(--white) mb-[200px] uppercase grid grid-cols-6 py-12">
                <div className="mb-8 2xl:mb-0 col-span-full 2xl:col-span-3 px-4 "><div className="w-full lg:w-2/3">
                    <div className="w-full flex items-center mb-4  text-(--gray)"><InView><TextOn text={"info"} num={0} /></InView></div>
                    <PortableText value={data?.about} components={portableTextComponents} />
                </div></div>
                {data?.contact?.map((item: any, i: number) => (
                    <div key={i} className="col-span-full lg:col-span-2 xl:col-span-1 p-4 uppercase">
                        <div className="w-full flex items-center mb-4  text-(--gray)"><InView><TextOn text={item.contactType} num={0} /></InView></div>
                        {item.contacts?.map((single: any, s: number) => (
                            <React.Fragment key={i + s} >
                                <div className="w-full mb-8">
                                    <a className="singleNav" href={`mailto:${single.email}`}>
                                        <InView><TextOn text={single.email} num={i * .25 + s * .15} /></InView>
                                    </a>
                                    <InView><TextOn text={single.phone} num={i * .5 + s * .2} /></InView>
                                </div>

                                {single.street && (
                                    <div className="w-full mb-8">
                                        <InView><TextOn text={single.street} num={0} /></InView>
                                        <InView><TextOn text={`${single.city}, ${single.state} ${single.zip}`} num={0} /></InView>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ))}
                <div className="col-span-full 2xl:col-span-1 2xl:col-end-5 px-4 2xl:pt-[100px]">
                    {data.socials?.map((item: any, i: number) => (
                        <React.Fragment key={`social-${i}`} >
                            <div className="w-full text-(--white) singleNav">
                                <a href={item.link} target="_blank">
                                    <InView><InView as="span" className="text-(--gray)"><TextOn text={item.title} num={.75 + i * .15} />:</InView> <TextOn text={item.handle} num={.8125 + i * .150} /></InView>
                                </a>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

            </div>

            {/* <div className="w-screen h-auto overflow-x-hidden">
                <FooterScroll time={20} />
            </div> */}
        </motion.div>
    );
}