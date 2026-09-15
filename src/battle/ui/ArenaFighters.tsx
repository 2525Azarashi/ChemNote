import { useGrowthProgress } from '../../hooks/useGrowthProgress';
import { GrowthAvatar } from './GrowthParts';
import { Swords } from 'lucide-react';
export function ArenaFighters({answered=false,reveal=false,correct=false,opponentAnswered=false,waiting=false,offline=false,matched=false}:{answered?:boolean;reveal?:boolean;correct?:boolean;opponentAnswered?:boolean;waiting?:boolean;offline?:boolean;matched?:boolean}) {
 const {progress}=useGrowthProgress();
 return <div className={`arena-fighters ${waiting?'is-searching':''} ${reveal?(correct?'is-hit':'is-miss'):''}`} aria-label="とびら君の対戦ステージ">
  <div className={`arena-fighter mine ${answered?'is-ready':''}`}>{progress && <GrowthAvatar progress={progress} size={72}/>}<small>{matched?'準備OK':waiting?'あなたのとびら君':answered?'回答ロック':'考え中'}</small></div>
  <div className="arena-clash"><Swords/><strong>VS</strong></div>
  <div className={`arena-fighter opponent ${opponentAnswered?'is-ready':''}`}><img src="/mascots/thinking.png" alt="対戦相手のイメージ"/><small>{offline?'通信待ち':matched?'準備OK':waiting?'対戦相手を探索中':opponentAnswered?'回答済み':'考え中'}</small></div>
 </div>;
}
