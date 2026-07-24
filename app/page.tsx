import { getData } from "@/lib/util/sanity";
import React from "react";
import WorkGrid from "./components/workGrid";
import Footer from "./components/footer";

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const query = await getData(`{
    'data':*[_type=='settings'][0]{about,reel{"image":image.asset->url, "vid":video.asset->playbackId, "ratio":video.asset->data.aspect_ratio},feat[]->{title,type,client,abbr,"slug":slug.current,copy,loop{"image":image.asset->url, "vid":video.asset->playbackId, "ratio":video.asset->data.aspect_ratio}},contact,socials }
    }`)
  const { data } = query.data
  return (
    <React.Fragment>
      <div className="w-screen h-screen top-0 left-0 z-0">
        <WorkGrid data={data.feat} />
        <div className="absolute w-screen h-screen top-0 left-0 z-0">
          {/* <div className="h-full w-full bgMux noControl z-0 opacity-[.8]">
            <MuxVideoBG playbackId={data.reel.vid} title="Shows Video" ratio={data.reel.ratio} />
          </div> */}
        </div>
      </div>
      <Footer data={data} />
    </React.Fragment>
  );
}
