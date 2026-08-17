import { getData } from "@/lib/util/sanity";
import React from "react";
import WorkGrid from "./components/workGrid";
import Footer from "./components/footer";
import PageReadyGate from "./components/PageReadyGate";

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const query = await getData(`{
    'data':*[_type=='settings'][0]{about,reel{"image":image.asset->url, "vid":video.asset->playbackId, "ratio":video.asset->data.aspect_ratio},all{"image":image.asset->url, "vid":video.asset->playbackId, "ratio":video.asset->data.aspect_ratio},feat[]->{title,type,client,abbr,"slug":slug.current,copy,loop{"image":image.asset->url, "vid":video.asset->playbackId, "ratio":video.asset->data.aspect_ratio, "mobImage":mobileImage.asset->url, "mobVid":mobileVideo.asset->playbackId, "mobRatio":mobileVideo.asset->data.aspect_ratio}},contact,socials,awards }
    }`)
  const { data } = query.data
  return (
    <React.Fragment>
      <div className="w-screen  z-0">
        <WorkGrid data={data.feat} all={data.all} />
        {/* <div className="absolute w-screen h-screen top-0 left-0 z-0">
          <div className="h-full w-full bgMux noControl z-0 opacity-[.8]">
            <MuxVideoBG playbackId={data.reel.vid} title="Shows Video" ratio={data.reel.ratio} />
          </div>
        </div> */}
      </div>
      <PageReadyGate>
        <Footer data={data} />
      </PageReadyGate>
    </React.Fragment>
  );
}


export async function generateMetadata() {
  const query = await getData(`{
    'data':*[_type=='settings'][0]{meta{title,description,keywords,"image":image.asset->url},}
 }`)
  const { data } = query.data
  return {
    title: `${data.meta.title}`,
    keywords: `${data.meta.keywords}`,
    description: `${data.meta.description}`,
    openGraph: {
      images: data.meta.image
    }
  };
}