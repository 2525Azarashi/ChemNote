import { useRef, useState } from 'react';
import { Gift, Coins, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
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
 const oddsDialog=useRef<HTMLDialogElement>(null);
 const [collectionFilter,setCollectionFilter]=useState<'all'|'owned'|'missing'>('all');
 const items=gachaItems();
 const [previewIndex,setPreviewIndex]=useState(0);
 const previewItem=items[previewIndex % items.length];
 const ownedCount=items.filter(item=>progress?.owned.includes(item.id)).length;
 const [confirm,setConfirm]=useState(false);const [error,setError]=useState('');
 const [result,setResult]=useState<{item:ItemDef;duplicate:boolean;refund:number}|null>(null);
 const draw=async()=>{
  if(lock.current)return;lock.current=true;setBusy(true);setError('');setConfirm(false);primeAudio();
  try {const r=await drawGacha(crypto.randomUUID(),owner);if(!r?.result){setError('抽選できませんでした。残高や保存設定を確認してください。');return;}setResult(r.result);play('badge',false);}
  catch {setError('抽選できませんでした。再度お試しください。');}finally{lock.current=false;setBusy(false);}
 };
 return <section className={`gacha-room ${result?'has-result':''}`}>{!embedded && <button type="button" className="arena-back" onClick={onBack}><ArrowLeft size={18}/>マイページ</button>}
  <p className="home-eyebrow">TOBIRA COLLECTION</p><h1>とびら君の装飾ガチャ</h1>
  <p>全{items.length}種類のポーズ＆フレーム。とびら君を自分らしく。</p>
  <div className={`gacha-machine gacha-preview-stage ${busy?'is-spinning':''}`} aria-label="ラインナップのプレビュー">
    <span className="gacha-preview-tag">LINEUP PREVIEW</span>
    <button type="button" className="gacha-preview-prev" aria-label="前の装飾をプレビュー" disabled={busy} onClick={()=>setPreviewIndex(i=>(i+items.length-1)%items.length)}><ChevronLeft /></button>
    <div className="gacha-exhibit">{progress && <GrowthAvatar progress={{...progress,equipped:{...progress.equipped,[previewItem.kind]:previewItem.id}}} size={120} showLevel={false}/>}</div>
    <button type="button" className="gacha-preview-next" aria-label="次の装飾をプレビュー" disabled={busy} onClick={()=>setPreviewIndex(i=>(i+1)%items.length)}><ChevronRight /></button>
    <div className="gacha-preview-info" aria-live="polite"><strong>{previewItem.label}</strong><span>{previewIndex+1} / {items.length} · 各{100/items.length}%</span></div>
  </div>
  <p className="gacha-balance"><Coins size={20}/>所持 {progress?.coins ?? '—'} マナコイン</p>
  {result ? <div className="gacha-result" role="status"><h2>{result.duplicate?'重複アイテム':'NEW!'} {result.item.label}</h2>
    <div className="gacha-result-art">{progress && <GrowthAvatar progress={{...progress,equipped:{...progress.equipped,[result.item.kind]:result.item.id}}} size={88} showLevel={false}/>}</div>
    <p>{result.duplicate?`重複分 ${result.refund} マナコイン返還（実質消費 ${GACHA_COST-result.refund}枚）`:'コレクションに追加しました'}</p>
    <button type="button" onClick={async()=>{if(await equip(result.item.id))setError('装備しました。ホームと対戦に反映されます。');else setError('装備を保存できませんでした。');}}>この装飾をつける</button>
    <button type="button" onClick={()=>{setResult(null);setError('');}}>抽選画面にもどる</button></div>
    : confirm ? <div className="gacha-confirm" role="group" aria-label="ガチャ購入確認"><p>{GACHA_COST}マナコインを使って1回引きますか？</p><button type="button" disabled={busy} onClick={()=>void draw()}>50枚で確定する</button><button type="button" onClick={()=>setConfirm(false)}>キャンセル</button></div>
    : <button type="button" className="gacha-pull" disabled={busy || !progress || progress.coins<GACHA_COST} onClick={()=>setConfirm(true)}><Gift size={20} aria-hidden="true"/>ガチャを1回引く · {GACHA_COST}枚</button>}
  {error && <p role="status">{error}</p>}
  {progress && progress.coins<GACHA_COST && <button type="button" className="arena-back" onClick={onMissions}>ミッションでコインをためる</button>}
  <div className="gacha-collection-meter" aria-label={`コレクション ${ownedCount}/${items.length}種類`}><span>COLLECTION <strong>{ownedCount} / {items.length}</strong></span><progress value={ownedCount} max={items.length} aria-label="装飾の収集状況" /></div>
  <button type="button" className="gacha-odds-toggle" aria-haspopup="dialog" onClick={()=>oddsDialog.current?.showModal()}>コレクション・提供割合を見る</button>
  <dialog ref={oddsDialog} className="game-details-dialog" aria-labelledby="gacha-odds-title">
    <header><h2 id="gacha-odds-title">装飾コレクション・提供割合</h2><button type="button" autoFocus onClick={()=>oddsDialog.current?.close()}>閉じる</button></header>
    <div className="game-details-body gacha-odds">
      <p>全{items.length}種類、各{100/items.length}%。毎回独立の抽選。重複は{GACHA_DUPLICATE_REFUND}枚返還。課金・換金なし／天井なし。フレーム・一部ポーズはショップ交換、おさんぽ・勉強中・考え中はレベルアップでも獲得できます。</p>
      <div className="gacha-collection-filters" role="group" aria-label="所持状況で絞り込む">{([['all','すべて'],['owned','所持済み'],['missing','未所持']] as const).map(([id,label])=><button key={id} type="button" aria-pressed={collectionFilter===id} onClick={()=>setCollectionFilter(id)}>{label}</button>)}</div>
      <ul className="gacha-collection-grid">{items.filter(item=>collectionFilter==='all'||(collectionFilter==='owned')===!!progress?.owned.includes(item.id)).map(item=>{
        const owned=!!progress?.owned.includes(item.id);
        return <li key={item.id} data-owned={owned}>
          {progress && <GrowthAvatar progress={{...progress,equipped:{...progress.equipped,[item.kind]:item.id}}} size={76} showLevel={false}/>}
          <strong>{item.label}</strong><span>{owned?'所持済み':'未所持'} · {100/items.length}%</span>
        </li>;
      })}</ul>
      {collectionFilter==='missing' && ownedCount===items.length && <p>全種類コレクション済みです。</p>}
      {collectionFilter==='owned' && ownedCount===0 && <p>まだガチャ対象の装飾を持っていません。</p>}
      <p>プレビューは装備・コインを変更しません。装飾はこのブラウザのアカウントごとに保存されます。強さは変わりません。</p>
    </div>
  </dialog>
 </section>;
}
