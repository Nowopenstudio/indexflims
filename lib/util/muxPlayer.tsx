'use client'

import MuxPlayer from "@mux/mux-player-react";
import { useEffect, useRef } from 'react';


export function MuxVideoBG({ playbackId, title, ratio }: any) {
  const playerRef = useRef<any>(null);
  useEffect(() => {
    // Cleanup function runs on dismount
    return () => {
      if (playerRef.current) {
        playerRef.current.pause(); // Pauses video/sound on dismount [12]
      }
    };
  }, []);

  if (!playbackId) return null

  return <MuxPlayer key={`${playbackId}-${title}`} ref={playerRef} poster={`https://image.mux.com/${playbackId}/thumbnail.webp?time=0`} playbackId={playbackId} metadata={title ? { video_title: title } : undefined} muted playsInline autoPlay={true} loop={true} style={{ aspectRatio: `${ratio.split(':')[0]}/${ratio.split(':')[1]}` }} />
}

export function MuxVideo({ playbackId, title, poster, ratio, play, auto, onTimeUpdate, onDurationChange, onPlay, onPause, playerRef: externalRef }: any) {
  const internalRef = useRef<any>(null);
  const playerRef = externalRef ?? internalRef;
  useEffect(() => {
    // Cleanup function runs on dismount
    return () => {
      if (playerRef.current) {
        playerRef.current.pause(); // Pauses video/sound on dismount [12]
      }
    };
  }, []);
  if (!playbackId) return null


  return <MuxPlayer key={`${playbackId}-${title}`} ref={playerRef} poster={poster ? poster : `https://image.mux.com/${playbackId}/thumbnail.webp?time=0`} playbackId={playbackId} playsInline autoPlay={true} metadata={title ? { video_title: title } : undefined} onTimeUpdate={onTimeUpdate} onDurationChange={onDurationChange} onPlay={onPlay} onPause={onPause} style={{ aspectRatio: `${ratio.split(':')[0]}/${ratio.split(':')[1]}` }} />
}