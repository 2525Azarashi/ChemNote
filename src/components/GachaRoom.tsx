import { useRef, useState } from 'react';
import { Gift, Coins, ArrowLeft, Sparkles } from 'lucide-react';
import { useGrowthProgress } from '../hooks/useGrowthProgress';
import { GACHA_COST, GACHA_DUPLICATE_REFUND, gachaItems } from '../battle/core/arenaEconomy';
import { drawGacha, equip } from '../battle/data/growthStore';
import { GrowthAvatar } from '../battle/ui/GrowthParts';
import type { ItemDef } from '../battle/core/growth';
import { play, primeAudio } from '../battle/ui/feedback';
type GachaProps = {onBack:()=>void;onMissions:()=>void;embedded?:boolean};
export function GachaRoom(props:GachaProps) {
 const {uid}=useGrowthProgress();
 return <GachaRoomContent key={uid} owner={uid} {...props}/>;
}
function GachaRoomContent({onBack,onMissions,owner,embedded=false}:GachaProps & {owner:string;key?:string}) {
 const {progress}=useGrowthProgress();const lock=useRef(false);const [busy,setBusy]=useState(false);
 const [confirm,setConfirm]=useState(false);const [error,setError]=useState('');
 const [result,setResult]=useState<{item:ItemDef;duplicate:boolean;refund:number}|null>(null);
 const draw=async()=>{
  if(lock.current)return;lock.current=true;setBusy(true);setError('');setConfirm(false);primeAudio();
  try {const r=await drawGacha(crypto.randomUUID(),owner);if(!r?.result){setError('抽選できませんでした。残高や保存設定を確認してください。');return;}setResult(r.result);play('badge',false);}
  catch {setError('抽選できませんでした。再度お試しください。');}finally{lock.current=false;setBusy(false);}
 };
 return <section className="gacha-room">{!embedded && <button type="button" className="arena-back" onClick={onBack}><ArrowLeft size={18}/>マイページ</button>}
  <p className="home-eyebrow">TOBIRA COLLECTION</p><h1>とびら君の装飾ガチャ</h1>
  <p>学んでためたマナコインで、新しいスタイルに出会おう。</p>
  <div className={`gacha-machine ${busy?'is-spinning':''}`}><Sparkles/>{progress && <GrowthAvatar progress={progress} size={120}/>}<Gift size={42}/></div>
  <p className="gacha-balance"><Coins size={20}/>所持 {progress?.coins ?? '—'} マナコイン</p>
  {result ? <div className="gacha-result" role="status"><h2>{result.duplicate?'重複アイテム':'NEW!'} {result.item.label}</h2>
    {result.item.kind==='pose'?<img src={result.item.value} alt={result.item.label}/>:<div className="gacha-frame" style={{borderColor:result.item.value}}/>}
    <p>{result.duplicate?`重複分 ${result.refund} マナコイン返還（実質消費 ${GACHA_COST-result.refund}枚）`:'コレクションに追加しました'}</p>
    <button type="button" onClick={async()=>{if(await equip(result.item.id))setError('装備しました。ホームと対戦に反映されます。');else setError('装備を保存できませんでした。');}}>この装飾をつける</button>
    <button type="button" onClick={()=>{setResult(null);setError('');}}>抽選画面にもどる</button></div>
    : confirm ? <div className="gacha-confirm" role="group" aria-label="ガチャ購入確認"><p>{GACHA_COST}マナコインを使って1回引きますか？</p><button type="button" disabled={busy} onClick={()=>void draw()}>50枚で確定する</button><button type="button" onClick={()=>setConfirm(false)}>キャンセル</button></div>
    : <button type="button" className="gacha-pull" disabled={busy || !progress || progress.coins<GACHA_COST} onClick={()=>setConfirm(true)}>ガチャを1回引く · {GACHA_COST}枚</button>}
  {error && <p role="status">{error}</p>}
  {progress && progress.coins<GACHA_COST && <button type="button" className="arena-back" onClick={onMissions}>ミッションでコインをためる</button>}
  <details className="gacha-odds"><summary>ラインナップ・提供割合・注意事項</summary><p>全{gachaItems().length}種類、各{100/gachaItems().length}%。毎回独立の抽選。重複は{GACHA_DUPLICATE_REFUND}枚返還。課金・換金なし／天井なし。ショップで直接交換もできます。</p><ul>{gachaItems().map(i=><li key={i.id}>{i.label} · {100/gachaItems().length}%</li>)}</ul><p>装飾はこのブラウザのアカウントごとに保存されます。強さは変わりません。</p></details>
 </section>;
}
