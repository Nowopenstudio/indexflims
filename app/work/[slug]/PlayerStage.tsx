'use client'

import { useRef, useState } from "react"
import { MuxVideo } from "@/lib/util/muxPlayer"
import PlayGrid from "@/app/components/playerGrid"

export default function PlayerStage({ data }: any) {
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const playerRef = useRef<any>(null)

  const togglePlay = () => {
    const player = playerRef.current
    if (!player) return
    if (player.paused) {
      player.play()
    } else {
      player.pause()
    }
  }

  const handleSeek = (time: number) => {
    const player = playerRef.current
    if (!player) return
    player.currentTime = time
    setCurrentTime(time)
  }

  return (
    <>
      <div className="md:h-full pt-[56px] md:pt-0 h-auto w-full md:flex md:items-center noControl z-0 opacity-[.8] pb-[23px]">
        {data && data.full.vid && <MuxVideo
          playbackId={data.full.vid}
          title="Shows Video"
          ratio={data.full.ratio}
          playerRef={playerRef}
          onDurationChange={(e: any) => setDuration(e.target.duration)}
          onTimeUpdate={(e: any) => setCurrentTime(e.target.currentTime)}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />}
      </div>
      <PlayGrid data={data} duration={duration} currentTime={currentTime} isPlaying={isPlaying} onToggle={togglePlay} onSeek={handleSeek} />
    </>
  )
}
