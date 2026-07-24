import React from "react";
import FooterScroll from "./footerScroll";
import { PortableText } from "next-sanity";

export default function Footer({ data }: any) {
    console.log(data)
    return (
        <div id="footer" className='w-screen bg-(--black)'>
            <div className="w-screen  text-(--white) mb-[200px] uppercase grid grid-cols-6 ">
                <div className="col-span-3 p-4 "><div className="w-2/3">
                    <div className="w-full flex items-center mb-4  text-(--gray)"><p>INFO</p></div>
                    <PortableText value={data?.about} />
                </div></div>
                {data?.contact?.map((item: any, i: number) => (
                    <div key={i} className="col-span-1 p-4 uppercase">
                        <div className="w-full flex items-center mb-4  text-(--gray)"><p>{item.contactType}</p></div>
                        {item.contacts?.map((single: any, s: number) => (
                            <React.Fragment key={i + s} >
                                <div className="w-full mb-8">
                                    <a className="singleNav" href={`mailto:${single.email}`}>
                                        <p>{single.email}</p>
                                    </a>
                                    <p>{single.phone}</p>
                                </div>

                                {single.street && (
                                    <div className="w-full mb-8">
                                        <p>{single.street}</p>
                                        <p>{single.city}, {single.state} {single.zip}</p>
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                ))}
                <div className="col-span-1 col-end-5 px-4 pt-[100px]">
                    {data.socials?.map((item: any, i: number) => (
                        <React.Fragment key={`social-${i}`} >
                            <div className="w-full text-(--white) singleNav">
                                <a href={item.link} target="_blank">
                                    <p><span className="text-(--gray)">{item.title}:</span> {item.handle}</p>
                                </a>
                            </div>
                        </React.Fragment>
                    ))}
                </div>

            </div>

            <div className="w-screen h-auto overflow-x-hidden">
                <FooterScroll time={20} />
            </div>
        </div>
    );
}