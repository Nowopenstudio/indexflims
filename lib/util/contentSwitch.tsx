import { MuxVideoBG } from "./muxPlayer";
import Image from "next/image";

export function SwitchContent({work, title}: {work?: any, title?:string;}) {
  if (!work) return null

  
  if (work.video){
    return <div className="w-full noControl object-fill"> <MuxVideoBG playbackId={work.video.asset.playbackId} title={title} /></div>
  

    }
   
  if (work.imageUrl) return <Image alt="image" height={0}  width={0} sizes="100vw"  src={work.imageUrl}  className="w-full object-fill"/>
    
 
}

