import PlayGrid from "@/app/components/playerGrid";
import { MuxVideo, MuxVideoBG } from "@/lib/util/muxPlayer";
import { getData } from "@/lib/util/sanity";
import React from "react";





export default async function Home({ params }: any) {
  const { slug } = await params
  const query = await getData(`{
      'pro':*[_type=='settings'][0]{feat[]->{title,client,abbr,"slug":slug.current,copy,loop{"image":image.asset->url, "vid":video.asset->playbackId, "ratio":video.asset->data.aspect_ratio}}},
    'data':*[_type=='projects' && slug.current=="${slug}"][0]{full{"image":image.asset->url, "vid":video.asset->playbackId, "ratio":video.asset->data.aspect_ratio}, title, client,abbr,type}
 }`)



  const { data, pro } = query.data
  console.log(data, slug)
  return (


    <React.Fragment>
      <div className="w-screen h-screen top-0 left-0 z-0 ">
        <div className="h-full w-full flex items-center noControl z-0 opacity-[.8]">
          <MuxVideo playbackId={data.full.vid} title="Shows Video" ratio={data.full.ratio} />
        </div>
        <PlayGrid data={data} />
      </div >

    </React.Fragment>


  );
}

// export async function generateMetadata({ params }: any) {
//   const { slug } = await params
//   const query = await getData(`{
//     'data':*[_type=='info'][0]{meta{title,description,keywords,"image":image.asset->url}},
//      'head':*[_type=='work' && slug.current=="${slug}"][0]{cover{"image":image.asset->url}, client, title, "summary":pt::text(summary)}
//  }`)

//   const { data, head } = query.data
//   return {
//     title: `${head.client} - ${head.title} | Ryan Adair`,
//     description: head.summary ?? data.meta.description,
//     keywords: data.meta.keywords,
//     openGraph: {
//       images: head.cover.image ? `${head.cover.image}?auto=format&amp;w=500` : `${data.meta.image}?auto=format&amp;w=500`
//     }
//   };
// }
