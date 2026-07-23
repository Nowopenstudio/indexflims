
import { getData } from "@/lib/util/sanity";
import React from "react";
import Catalog from "./catalog";





export default async function Home({ params }: any) {
  const { slug } = await params
  const query = await getData(`{
    'data':*[_type=='projects']|order(orderRank){title, client,abbr,type}
 }`)



  const { data, pro } = query.data
  console.log(data, slug)
  return (


    <React.Fragment>
      <div className="w-screen h-screen top-0 left-0 z-0 bg-(--white)">
        <Catalog data={data} />
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
