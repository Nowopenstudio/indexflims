import PlayerStage from "./PlayerStage";
import { getData } from "@/lib/util/sanity";
import React from "react";





export default async function Home({ params }: any) {
  const { slug } = await params
  const query = await getData(`{
      'feat':*[_type=='settings'][0]{feat[]->{title,client,abbr,"slug":slug.current,copy,loop{"image":image.asset->url, "vid":video.asset->playbackId, "ratio":video.asset->data.aspect_ratio}}},
    'data':*[_type=='projects' && slug.current=="${slug}"][0]{awards,full{"image":image.asset->url, "vid":video.asset->playbackId, "ratio":video.asset->data.aspect_ratio}, title, client,abbr,type,credits}
 }`)



  const { data, pro } = query.data
  console.log(data, slug)
  return (


    <React.Fragment>
      <div className="w-screen h-screen top-0 left-0 z-0 ">
        <PlayerStage data={data} />
      </div >

    </React.Fragment>


  );
}

export async function generateMetadata({ params }: any) {
  const { slug } = await params
  const query = await getData(`{
    'data':*[_type=='settings'][0]{meta{title,description,keywords,"image":image.asset->url}},
     'head':*[_type=='projects' && slug.current=="${slug}"][0]{client,title,meta{description,keywords,"image":image.asset->url}}
 }`)

  const { data, head } = query.data
  const capitalize = (str: string) => str?.replace(/\b\w/g, (c: string) => c.toUpperCase())
  return {
    title: `${capitalize(head.client)} - ${capitalize(head.title)} | Index Films`,
    description: head.meta?.description ?? data.meta.description,
    keywords: data.meta.keywords,
    openGraph: {
      images: head.meta?.image ? `${head.meta.image}?auto=format&amp;w=500` : `${data.meta.image}?auto=format&amp;w=500`
    }
  };
}
