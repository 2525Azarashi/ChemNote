import { useEffect, useRef, useState } from 'react';

/** Locally hosted generated clips; no paid API or session-cookie URLs at runtime. */
export const CINEMATIC_CLIPS = {
  title: { src: '/cinematics/title.mp4' },
  special: { src: '/cinematics/attack.mp4' },
  gacha: { src: '/cinematics/gacha.mp4' },
  victory: { src: '/cinematics/victory.mp4' },
};
type Props = { src: string; label: string; onActiveChange?: (active: boolean) => void; onComplete?: () => void; playbackRate?: number };
export function CinematicClip(props: Props) {
  return props.src ? <ClipPlayback key={props.src} {...props} /> : null;
}
function ClipPlayback({src,label,onActiveChange,onComplete,playbackRate=1}: Props & {key?: string}) {
  const video=useRef<HTMLVideoElement>(null);
  const callbacks=useRef({onActiveChange,onComplete}); callbacks.current={onActiveChange,onComplete};
  const done=useRef(false); const started=useRef(false);
  const [allowed,setAllowed]=useState(false); const [stopped,setStopped]=useState(false); const [playing,setPlaying]=useState(false);
  const stop=()=>{
    if(done.current)return;done.current=true;video.current?.pause();setStopped(true);setPlaying(false);
    callbacks.current.onActiveChange?.(false);callbacks.current.onComplete?.();
  };
  useEffect(()=>{
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');
    const connection=(navigator as Navigator & {connection?:{saveData?:boolean}}).connection;
    const policy=()=>{if(reduce.matches||connection?.saveData||document.hidden)stop();else setAllowed(true);};
    policy();reduce.addEventListener('change',policy);
    const hide=()=>{if(document.hidden)stop();};document.addEventListener('visibilitychange',hide);
    return()=>{reduce.removeEventListener('change',policy);document.removeEventListener('visibilitychange',hide);callbacks.current.onActiveChange?.(false);};
  },[]);
  useEffect(()=>{
    if(!allowed||stopped||!video.current)return;
    let disposed=false;const el=video.current;el.playbackRate=playbackRate;
    const loading=setTimeout(()=>{if(!disposed&&!started.current)stop();},4000);
    const watchdog=setTimeout(()=>{if(!disposed)stop();},8000);
    el.play().catch(()=>{if(!disposed)stop();});
    return()=>{disposed=true;clearTimeout(loading);clearTimeout(watchdog);el.pause();};
  },[allowed,stopped,playbackRate]);
  if(!allowed||stopped)return null;
  return <div className={`cinematic-clip ${playing?'is-playing':''}`} role="group" aria-label={label}>
    <video ref={video} src={src} muted playsInline preload="none" disablePictureInPicture aria-hidden="true"
      onPlaying={()=>{started.current=true;setPlaying(true);callbacks.current.onActiveChange?.(true);}} onEnded={stop} onError={stop}/>
    {playing&&<button type="button" className="cinematic-skip" onClick={stop}>演出をスキップ</button>}
  </div>;
}
