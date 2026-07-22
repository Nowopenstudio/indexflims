import React from "react";
import FooterScroll from "./footerScroll";

export default function Footer({ data }: any) {
    console.log(data)
    return (
        <div className='w-screen bg-(--black)'>
            <div className="w-screen  text-(--white) mb-[200px] uppercase grid grid-cols-6 pt-8">
                {data?.contact?.map((item: any, i: number) => (
                    <div key={i} className="col-span-1 p-4 uppercase">
                        <div className="w-full flex items-center p-2 mb-4  text-(--white) border-[.5px] border-(--white)"><p>{item.contactType}</p></div>
                        {item.contacts?.map((single: any, s: number) => (
                            <React.Fragment key={i + s} >
                                <div className="w-full mb-8">
                                    <p>{single.email}</p>
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
                <div className="col-span-1 col-end-7 p-4">
                    {data.socials?.map((item: any, i: number) => (
                        <React.Fragment key={`social-${i}`} >
                            <div className="w-full text-(--white)">
                                <p><span className="text-(--gray)">{item.title}:</span> {item.handle}</p>
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