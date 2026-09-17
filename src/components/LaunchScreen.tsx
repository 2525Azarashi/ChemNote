import { useState } from 'react';
import { CinematicClip, CINEMATIC_CLIPS } from './CinematicClip';
import { ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { useGrowthProgress } from '../hooks/useGrowthProgress';
import { equippedPoseSrc, equippedFrameColor, equippedFramePattern } from '../battle/core/growth';

/** A visual title screen only. It never resets the saved app route or account data. */
export function LaunchScreen({ onStart, soundEnabled, onToggleSound }: {
  onStart: () => void; soundEnabled: boolean; onToggleSound: () => void;
}) {
  const { progress } = useGrowthProgress();
  const [walkReady, setWalkReady] = useState(false);
  const [movieActive,setMovieActive] = useState(false);
  return <main className="launch-screen" aria-label="マナトビ タイトル画面" data-launch-screen>
    <div className="launch-paper-lines" aria-hidden="true" />
    <div className="launch-content">
      <button type="button" className="launch-sound" aria-label={soundEnabled ? 'BGMをオフにする' : 'BGMをオンにする'} aria-pressed={soundEnabled} onClick={onToggleSound}>
        {soundEnabled ? <Volume2 size={19} /> : <VolumeX size={19} />}<span>BGM {soundEnabled ? 'ON' : 'OFF'}</span>
      </button>
      <div className="launch-brand"><p>学びの扉を、ひらこう。</p><h1><img src="/manatobi-logo.jpg" width={1024} height={367} alt="マナトビ" fetchPriority="high" /></h1></div>
      <div className={`launch-stage ${movieActive ? 'has-movie' : ''}`} aria-label="とびら君の登場演出">
        <div className="launch-arch" /><div className="launch-stage-floor" data-frame-pattern={progress ? equippedFramePattern(progress) : 'plain'} style={{borderColor: progress ? equippedFrameColor(progress) : undefined}} />
        <div className={`launch-arrival ${walkReady ? 'walk-ready' : ''}`}>
          <div className="launch-gait">
            <img className="launch-walking-pose" src="/mascots/walking.png" alt="" draggable={false} onLoad={() => setWalkReady(true)} />
            <img className="launch-equipped-pose" src={progress ? equippedPoseSrc(progress) : '/mascots/basic.png'} alt="" draggable={false} />
          </div>
        </div>
        <i /><i />
        <CinematicClip src={CINEMATIC_CLIPS.title.src} label="とびら君の登場動画" onActiveChange={setMovieActive} />
      </div>
      <p className="launch-caption">ひとりでも、みんなでも。<br />とびら君と、今日もひとつ先へ。</p>
      <button type="button" className="launch-start" onClick={onStart}>はじめる<ArrowRight size={21} /></button>
      <p className="launch-note">タップして学習のつづきへ</p>
    </div>
  </main>;
}
