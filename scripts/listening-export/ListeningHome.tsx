import React, { useEffect, useState, type ComponentProps } from 'react';
import { ArrowRight, BookOpen, Check, Coins, Gift, Headphones, HelpCircle, Repeat2, Swords, Volume2, VolumeX } from 'lucide-react';
import type { Home as IntegratedHome } from './Home';
import type { GrowthProgress } from '../battle/core/growth';
import { equippedPoseSrc, levelOf } from '../battle/core/growth';
import { useGrowthProgress } from '../hooks/useGrowthProgress';
import { GrowthHomeStrip } from '../battle/ui/GrowthHomeStrip';
import { countSolvedProblemsIn, isProblemSolved } from '../utils/progress';
import { getDueCount } from '../utils/reviewList';
import { VOCABULARY_COUNT } from '../data/listeningVocabularyMeta.generated';
import './listening-home.css';
const ListeningSupport=React.lazy(()=>import('./ListeningSupport').then(m=>({default:m.ListeningSupport})));
type Props=ComponentProps<typeof IntegratedHome>&{onListeningStart?:(chapter:string,index:number)=>void};
export function ListeningHome(props:Props) {
  const {uid,progress}=useGrowthProgress();
  return <ListeningHomeContent key={uid} {...props} owner={uid} growth={progress}/>;
}
function ListeningHomeContent({owner,growth,onStart,onStudyMode,onNoteList,onIntro,onBattle,onGrowth,onLeaderboard,onListeningStart,isBgmEnabled,onToggleBgm}:Props&{owner:string;growth:GrowthProgress|null;key?:string}) {
  const [support,setSupport]=useState<'words'|'grammar'|null>(null);
  const [next,setNext]=useState<{chapter:string;index:number;label:string}|null>(null);
  const [solved,setSolved]=useState(0);const [retry,setRetry]=useState(0);const [error,setError]=useState('');
  const due=getDueCount(owner);
  useEffect(()=>{
    let alive=true;setError('');
    import('../data/englishListeningData').then(({getAllListeningChapters})=>{
      if(!alive)return;const chapters=getAllListeningChapters();
      const rounds=chapters.flatMap(c=>c.practiceProblems.map((p:any,index:number)=>({chapter:c.id,index,label:`${c.abstractTitle}・第${index+1}回`,problem:p.id})));
      const first=rounds.find(r=>!isProblemSolved(owner,r.chapter,r.problem))||rounds[0];
      setNext(first);setSolved(Math.min(135,countSolvedProblemsIn(owner,chapters.map(c=>c.id))));
    }).catch(()=>{if(alive)setError('おすすめの回を読み込めませんでした。大問一覧からも始められます。');});
    return()=>{alive=false;};
  },[owner,retry]);
  const study=()=>onStudyMode?onStudyMode('practice'):onStart();
  return <main className="listening-home" data-listening-home>
    <div className="lh-container">
      <header className="lh-header"><div className="lh-brand"><img src="/manatobi-logo.jpg" alt="マナトビ" width={1024} height={367}/><span>LISTENING</span></div><div className="lh-header-tools">{onGrowth&&<button className="lh-wallet" onClick={()=>onGrowth('overview')} aria-label="マナコインの使い道を開く"><Coins size={17}/>{growth?growth.coins.toLocaleString():'—'}</button>}<button aria-label={isBgmEnabled?'BGMをオフにする':'BGMをオンにする'} onClick={()=>onToggleBgm?.(!isBgmEnabled)}>{isBgmEnabled?<Volume2 size={19}/>:<VolumeX size={19}/>}</button></div></header>
      <section className="lh-hero" aria-labelledby="listening-home-title"><div><p className="lh-eyebrow">毎日ひとつ、聞こえる英語を。</p><h1 id="listening-home-title">聞くほど、<br/><em>わかる。</em></h1><p>単語が不安でも大丈夫。<br/>聞く・確かめる・もう一度。</p></div><div className="lh-mascot"><span><Headphones size={22}/></span><img src={growth?equippedPoseSrc(growth):'/mascots/basic.png'} alt="とびら君"/><small>Lv.{levelOf(growth?.xp||0).level}</small></div></section>
      <div className="lh-workspace">
        <section className="lh-listen-block" aria-label="メインのリスニング学習"><button className="lh-main" aria-label="おすすめのリスニングを始める" disabled={!next&&!error} onClick={()=>next&&onListeningStart?onListeningStart(next.chapter,next.index):study()}><span className="lh-main-icon"><Headphones size={29}/></span><span><small>今日の1回</small><strong>リスニングを始める</strong><span>{next?.label||(error?'大問一覧から選ぶ':'おすすめを読み込み中…')}</span></span><ArrowRight size={23}/></button>
          {error&&<p className="lh-error" role="alert">{error}<button onClick={()=>setRetry(n=>n+1)}>再読み込み</button></p>}
          <div className="lh-listen-links"><button onClick={study} aria-label="大問を選ぶ"><BookOpen size={17}/>大問から選ぶ<small>第1問A〜第6問B</small></button><button onClick={onNoteList}><Repeat2 size={17}/>復習ノート<small>{due?`今日の復習 ${due}問`:'聞き直して定着'}</small></button></div>
          <div className="lh-progress"><span><Check size={14}/>演習の積み重ね</span><b>{solved}<small> / 135大問</small></b><progress aria-label="リスニングの演習進捗" value={solved} max={135}/></div>
        </section>
        <section className="lh-support-block" aria-labelledby="listening-support-heading"><div className="lh-section-heading"><h2 id="listening-support-heading">聞くための基礎</h2><span>必要なときに、少しずつ。</span></div><div className="lh-support-buttons"><button onClick={()=>setSupport('words')} aria-label="単語・熟語の補助学習を開く"><span className="lh-letter">Aa</span><span><strong>単語・熟語</strong><small>{VOCABULARY_COUNT.toLocaleString()}語・1章20語</small></span><ArrowRight size={17}/></button><button onClick={()=>setSupport('grammar')} aria-label="英文法の補助学習を開く"><BookOpen size={23}/><span><strong>英文法</strong><small>聞き取りの8ポイント</small></span><ArrowRight size={17}/></button></div><p>まずは「意味が分かる」を増やそう。<br className="lh-mobile-break"/>単語は大問別でも探せます。</p></section>
        {onBattle&&<section className="lh-battle-block"><button onClick={onBattle} aria-label="オンライン対戦を開く"><span className="lh-battle-icon"><Swords size={24}/></span><span><strong>聞く力を、対戦で試す</strong><small>友だち・全国対戦 ／ AIならゲストでも</small></span><ArrowRight size={19}/></button></section>}
      </div>
      <details className="lh-growth"><summary><Gift size={17}/>学びのごほうび<small>マナコイン・ガチャ・きせかえ</small></summary>{onGrowth&&<GrowthHomeStrip homeLayout onProfile={()=>onGrowth('outfit')} onMissions={()=>onGrowth('missions')} onWallet={()=>onGrowth('overview')} onGacha={()=>onGrowth('gacha')}/>}<div className="lh-growth-links">{onGrowth&&<><button onClick={()=>onGrowth('gacha')}>ガチャ</button><button onClick={()=>onGrowth('missions')}>ミッション</button><button onClick={()=>onGrowth('outfit')}>きせかえ</button></>}{onLeaderboard&&<button onClick={onLeaderboard}>ランキング</button>}</div></details>
      <footer className="lh-footer"><span>音源を聞くときはイヤホン推奨</span><button onClick={onIntro}><HelpCircle size={15}/>使い方</button></footer>
    </div>
    {support&&<React.Suspense fallback={<div className="lh-load" role="status">補助学習を読み込んでいます…<button onClick={()=>setSupport(null)}>閉じる</button></div>}><ListeningSupport initialTab={support} uid={owner} onClose={()=>setSupport(null)} onPractice={(chapter,index)=>{setSupport(null);onListeningStart?onListeningStart(chapter,index):study();}}/></React.Suspense>}
  </main>;
}
