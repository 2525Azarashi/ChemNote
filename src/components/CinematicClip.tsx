import { useEffect, useRef, useState } from 'react';

/** No movie is shipped yet. Empty src means no request and no substitute video.
 * Resume generation in this order after the user confirms a credit top-up.
 * Reference: https://www.genspark.ai/api/files/s/7MA35CaI
 * First attempt: Vidu Q3 turbo, silent 720p, 1:1, 4 seconds; blocked by credits.
 * Review identity/motion before adding the actual optimized MP4 paths below.
 */
export const CINEMATIC_CLIPS = {
  title: { src: '', targetPath: '/cinematics/tobira-title.mp4', priority: 1 },
  special: { src: '', targetPath: '/cinematics/tobira-special.mp4', priority: 2 },
};

export function CinematicClip({ src, label, onActiveChange }: {
  src: string; label: string; onActiveChange?: (active: boolean) => void;
}) {
  return src ? <ClipPlayback key={src} src={src} label={label} onActiveChange={onActiveChange} /> : null;
}

function ClipPlayback({ src, label, onActiveChange }: {
  src: string; label: string; onActiveChange?: (active: boolean) => void; key?: string;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const onActive = useRef(onActiveChange);
  onActive.current = onActiveChange;
  const [allowed, setAllowed] = useState(false);
  const [stopped, setStopped] = useState(false);
  const [playing, setPlaying] = useState(false);
  const stop = () => {
    video.current?.pause();
    setStopped(true);
    setPlaying(false);
    onActive.current?.(false);
  };

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    const update = () => {
      const enabled = !reduce.matches && !connection?.saveData && !document.hidden;
      setAllowed(enabled);
      if (!enabled) { video.current?.pause(); setPlaying(false); onActive.current?.(false); }
    };
    update();
    reduce.addEventListener('change', update);
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hide);
    return () => { reduce.removeEventListener('change', update); document.removeEventListener('visibilitychange', hide); onActive.current?.(false); };
  }, []);

  useEffect(() => {
    if (!allowed || stopped || !video.current) return;
    let disposed = false;
    const element = video.current;
    // Never wait indefinitely for a movie or block entry to the actual app.
    const timer = window.setTimeout(() => { if (!disposed && element.paused) stop(); }, 5000);
    element.play().catch(() => { if (!disposed) stop(); });
    return () => { disposed = true; window.clearTimeout(timer); element.pause(); };
  }, [allowed, stopped]);

  if (!allowed || stopped) return null;
  return <div className={`cinematic-clip ${playing ? 'is-playing' : ''}`} role="group" aria-label={label}>
    <video ref={video} src={src} muted playsInline preload="none" disablePictureInPicture aria-hidden="true"
      onPlaying={() => { setPlaying(true); onActive.current?.(true); }} onEnded={stop} onError={stop} />
    {playing && <button type="button" className="cinematic-skip" onClick={stop}>演出をスキップ</button>}
  </div>;
}
