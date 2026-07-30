
import { getData } from "@/lib/util/sanity";
import React from "react";
import Catalog from "./catalog";
import Grid from "@/app/components/grid";





export default async function Home({ params }: any) {
  const { slug } = await params
  const query = await getData(`{
    'data':*[_type=='projects']|order(orderRank){title, client,abbr,type,"slug":slug.current}
 }`)



  const { data, pro } = query.data
  console.log(data, slug)
  return (


    <React.Fragment>
      <div className="w-screen md:h-screen top-0 left-0 z-0 bg-(--white)">
        {/* <Grid /> */}
        <Catalog data={data} />
      </div >

    </React.Fragment>


  );
}

export async function generateMetadata() {
  const query = await getData(`{
    'data':*[_type=='settings'][0]{meta{title,description,keywords,"image":image.asset->url},}
 }`)
  const { data } = query.data
  return {
    title: `Work | Index Films`,
    keywords: `${data.meta.keywords}`,
    description: `${data.meta.description}`,
    openGraph: {
      images: data.meta.image
    }
  };
}