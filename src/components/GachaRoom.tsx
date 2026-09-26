import { useRef, useState } from 'react';
import { CinematicClip, CINEMATIC_CLIPS } from './CinematicClip';
import { Gift, Coins, ArrowLeft, ChevronLeft, ChevronRight, FileText, Download } from 'lucide-react';
import { useGrowthProgress } from '../hooks/useGrowthProgress';
import { GACHA_COST, GACHA_DUPLICATE_REFUND_BY_RARITY, GACHA_RARITY_LABELS, GACHA_RARITY_ORDER, GACHA_RARITY_RATES, gachaItems, gachaItemsByRarity, gachaItemRate } from '../battle/core/arenaEconomy';
import { drawGacha, drawGachaMulti, equip, GACHA_MULTI_COUNT } from '../battle/data/growthStore';
import { GrowthAvatar } from '../battle/ui/GrowthParts';
import { gachaRarityOf, printOf, type ItemDef, type GachaRarity, type GrowthProgress } from '../battle/core/growth';
import { play, primeAudio } from '../battle/ui/feedback';

const pct=(r:number)=>{const v=r*100;return (v>=10?v.toFixed(1):v>=1?v.toFixed(2):v.toFixed(3)).replace(/\.?0+$/,'');};
function RarityTag({rarity}:{rarity:GachaRarity}){return <span className="gacha-rarity" data-rarity={rarity} aria-label={GACHA_RARITY_LABELS[rarity]}>{rarity}</span>;}
/** 結果の中でいちばん高いレア度 */
const bestOf=(list:{rarity:GachaRarity}[]):GachaRarity=>GACHA_RARITY_ORDER.find(r=>list.some(x=>x.rarity===r)) ?? 'N';
/** アイテムの見た目：装備なら扉くんに着せたプレビュー、学習プリントなら1ページ目のサムネイル */
function ItemArt({item,progress,size}:{item:ItemDef;progress:GrowthProgress|null;size:number}){
 const print=item.kind==='print'?printOf(item.id):undefined;
 if(print) return <span className="gacha-print-thumb" style={{width:size,height:Math.round(size*1.414)}}><img src={print.thumb} alt={`${print.label}の1ページ目`} loading="lazy" decoding="async" width={size} height={Math.round(size*1.414)}/><em>{print.category}</em></span>;
 return progress ? <GrowthAvatar progress={{...progress,equipped:{...progress.equipped,[item.kind]:item.id}}} size={size} showLevel={false}/> : null;
}
/** 学習プリントを開く・保存するリンク（同じサイト内の PDF だけ） */
function PrintLinks({item,compact=false}:{item:ItemDef;compact?:boolean}){
 const print=printOf(item.id);if(!print)return null;
 const name=`${print.label.replace(/[\\/:*?"<>|\s]+/g,'_')}.pdf`;
 return <span className={`gacha-print-links ${compact?'is-compact':''}`}>
  <a href={print.file} target="_blank" rel="noopener" aria-label={`${print.label}（PDF・${print.pages}ページ）を開く`}><FileText size={compact?14:16} aria-hidden="true"/>{compact?'開く':`PDFを開く（${print.pages}ページ）`}</a>
  <a href={print.file} download={name} aria-label={`${print.label}をダウンロード`}><Download size={compact?14:16} aria-hidden="true"/>{compact?'保存':'ダウンロード'}</a>
 </span>;
}
type GachaProps = {onBack:()=>void;onMissions:()=>void;embedded?:boolean};
export function GachaRoom(props:GachaProps) {
 const {uid}=useGrowthProgress();
 return <GachaRoomContent key={uid} owner={uid} {...props}/>;
}
function GachaRoomContent({onBack,onMissions,owner,embedded=false}:GachaProps & {owner:string;key?:string}) {
 const {progress}=useGrowthProgress();const lock=useRef(false);const [busy,setBusy]=useState(false);
 const oddsDialog=useRef<HTMLDialogElement>(null);
 const [collectionFilter,setCollectionFilter]=useState<'all'|'owned'|'missing'>('all');
 const items=gachaItems();const tiers=gachaItemsByRarity();
 const [previewIndex,setPreviewIndex]=useState(0);
 const previewItem=items[previewIndex % items.length];
 const ownedCount=items.filter(item=>progress?.owned.includes(item.id)).length;
 const [confirm,setConfirm]=useState(false);const [error,setError]=useState('');
 const [revealing,setRevealing]=useState(false);
 const [result,setResult]=useState<{item:ItemDef;rarity:GachaRarity;duplicate:boolean;refund:number}|null>(null);
 const [multi,setMulti]=useState<{item:ItemDef;rarity:GachaRarity;duplicate:boolean;refund:number}[]|null>(null);
 const bestRarity:GachaRarity|null=result?result.rarity:multi?bestOf(multi):null;
 const decor=items.filter(item=>item.kind!=='print');const prints=items.filter(item=>item.kind==='print');
 const ownedPrints=prints.filter(item=>progress?.owned.includes(item.id));
 const [collectionKind,setCollectionKind]=useState<'decor'|'print'>('decor');
 const [confirmMulti,setConfirmMulti]=useState(false);
 const multiCost=GACHA_COST*GACHA_MULTI_COUNT;
 const drawMulti=async()=>{
  if(lock.current)return;lock.current=true;setBusy(true);setError('');setConfirmMulti(false);primeAudio();
  try {const r=await drawGachaMulti(crypto.randomUUID(),owner);if(!r?.results){setError('抽選できませんでした。残高や保存設定を確認してください。');return;}setResult(null);setMulti(r.results);setRevealing(true);play(['UR','SR'].includes(bestOf(r.results))?'jackpot':'gacha',false);}
  catch {setError('抽選できませんでした。再度お試しください。');}finally{lock.current=false;setBusy(false);}
 };
 const draw=async()=>{
  if(lock.current)return;lock.current=true;setBusy(true);setError('');setConfirm(false);primeAudio();
  try {const r=await drawGacha(crypto.randomUUID(),owner);if(!r?.result){setError('抽選できませんでした。残高や保存設定を確認してください。');return;}setMulti(null);setResult(r.result);setRevealing(true);play(r.result.rarity==='UR'||r.result.rarity==='SR'?'jackpot':'gacha',false);}
  catch {setError('抽選できませんでした。再度お試しください。');}finally{lock.current=false;setBusy(false);}
 };
 return <section className={`gacha-room ${result?'has-result':''}`} data-best-rarity={!revealing && bestRarity ? bestRarity : undefined}>{!embedded && <button type="button" className="arena-back" onClick={onBack}><ArrowLeft size={18}/>マイページ</button>}
  <p className="home-eyebrow">TOBIRA COLLECTION</p><h1>とびら君の装飾ガチャ</h1>
  <p>ポーズ＆フレーム{decor.length}種＋<strong className="gacha-ur-lead">大当たり 学習プリント{prints.length}種</strong>（共テ出題傾向レポート・演習プリント・単語テスト）。</p>
  <ul className="gacha-rarity-rates" aria-label="レア度ごとの提供割合">{GACHA_RARITY_ORDER.map(r=><li key={r} data-rarity={r}><RarityTag rarity={r}/>{pct(GACHA_RARITY_RATES[r])}%<small>{tiers[r].length}種</small></li>)}</ul>
  <div className={`gacha-machine gacha-preview-stage ${busy?'is-spinning':''}`} aria-label="ラインナップのプレビュー">
    <span className="gacha-preview-tag">LINEUP PREVIEW</span>
    <button type="button" className="gacha-preview-prev" aria-label="前の装飾をプレビュー" disabled={busy} onClick={()=>setPreviewIndex(i=>(i+items.length-1)%items.length)}><ChevronLeft /></button>
    <div className="gacha-exhibit" data-kind={previewItem.kind}><ItemArt item={previewItem} progress={progress} size={previewItem.kind==='print'?100:120}/></div>
    <button type="button" className="gacha-preview-next" aria-label="次の装飾をプレビュー" disabled={busy} onClick={()=>setPreviewIndex(i=>(i+1)%items.length)}><ChevronRight /></button>
    <div className="gacha-preview-info" aria-live="polite"><strong><RarityTag rarity={gachaRarityOf(previewItem)}/> {previewItem.label}</strong><span>{previewIndex+1} / {items.length} · {pct(gachaItemRate(previewItem))}%</span></div>
  </div>
  <p className="gacha-balance"><Coins size={20}/>所持 {progress?.coins ?? '—'} マナコイン</p>
  {revealing ? <div className="gacha-cinema" data-rarity={bestRarity ?? undefined}><p>{bestRarity==='UR'?'🌈📄 画面が七色に…！大当たりの学習プリント！？':bestRarity==='SR'?'✨ 虹色に光った…！スーパーレアの予感':bestRarity==='R'?'金色に光った！レア以上が来る':'コレクションが届きました'}</p><CinematicClip src={CINEMATIC_CLIPS.gacha.src} label="ガチャの開封動画" onComplete={()=>setRevealing(false)} /><button type="button" onClick={()=>setRevealing(false)}>結果を見る</button></div> : result ? <div className="gacha-result" role="status" data-rarity={result.rarity}><h2><RarityTag rarity={result.rarity}/> {result.duplicate?'重複':'NEW!'} {result.item.label}</h2>{result.rarity==='UR' && <p className="gacha-sr-banner gacha-ur-banner">大当たり！ JACKPOT!</p>}{result.rarity==='SR' && <p className="gacha-sr-banner">SUPER RARE!</p>}
    <div className="gacha-result-art" data-kind={result.item.kind}><ItemArt item={result.item} progress={progress} size={result.item.kind==='print'?96:88}/></div>
    <p>{result.duplicate?`重複分 ${result.refund} マナコイン返還（実質消費 ${GACHA_COST-result.refund}枚）`:result.item.kind==='print'?'マイプリントに追加しました。いつでも開けます':'コレクションに追加しました'}</p>
    {result.item.kind==='print' ? <PrintLinks item={result.item}/> : <button type="button" onClick={async()=>{if(await equip(result.item.id))setError('装備しました。ホームと対戦に反映されます。');else setError('装備を保存できませんでした。');}}>この装飾をつける</button>}
    <button type="button" onClick={()=>{setResult(null);setError('');}}>抽選画面にもどる</button></div>
    : multi ? <div className="gacha-result gacha-multi-result" role="status" data-gacha-multi><h2>{GACHA_MULTI_COUNT}連の結果 · NEW {multi.filter(r=>!r.duplicate).length}種</h2>
      <ul className="gacha-multi-grid">{multi.map((r,i)=><li key={`${r.item.id}:${i}`} data-new={!r.duplicate} data-rarity={r.rarity} style={{animationDelay:`${i*0.12}s`}}>
        <ItemArt item={r.item} progress={progress} size={r.item.kind==='print'?52:64}/>
        <RarityTag rarity={r.rarity}/><strong>{r.duplicate?'重複':'NEW!'}</strong><span>{r.item.label}</span>
        {r.item.kind==='print' ? <PrintLinks item={r.item} compact/> : !r.duplicate && <button type="button" onClick={async()=>{if(await equip(r.item.id))setError(`${r.item.label}を装備しました。`);else setError('装備を保存できませんでした。');}}>つける</button>}
      </li>)}</ul>
      <p>{multi.some(r=>r.duplicate)?`重複分 合計${multi.reduce((n,r)=>n+r.refund,0)}マナコイン返還`:'すべて新しい装飾です！'}</p>
      <button type="button" onClick={()=>{setMulti(null);setError('');}}>抽選画面にもどる</button></div>
    : confirmMulti ? <div className="gacha-confirm" role="group" aria-label="5連ガチャ購入確認"><p>{multiCost}マナコインを使って{GACHA_MULTI_COUNT}回まとめて引きますか？<br/><small>5連は R 以上が1つ以上確定！</small></p><button type="button" disabled={busy} onClick={()=>void drawMulti()}>{multiCost}枚で確定する</button><button type="button" onClick={()=>setConfirmMulti(false)}>キャンセル</button></div>
    : confirm ? <div className="gacha-confirm" role="group" aria-label="ガチャ購入確認"><p>{GACHA_COST}マナコインを使って1回引きますか？</p><button type="button" disabled={busy} onClick={()=>void draw()}>50枚で確定する</button><button type="button" onClick={()=>setConfirm(false)}>キャンセル</button></div>
    : <button type="button" className="gacha-pull" disabled={busy || !progress || progress.coins<GACHA_COST} onClick={()=>setConfirm(true)}><Gift size={20} aria-hidden="true"/>ガチャを1回引く · {GACHA_COST}枚</button>}
  {!revealing && !result && !multi && !confirm && !confirmMulti && <button type="button" className="gacha-pull gacha-pull-multi" disabled={busy || !progress || progress.coins<multiCost} onClick={()=>setConfirmMulti(true)} data-gacha-multi-pull><Gift size={20} aria-hidden="true"/>{GACHA_MULTI_COUNT}連ガチャ · {multiCost}枚 <small className="gacha-guarantee">R以上1つ確定</small></button>}
  {error && <p role="status">{error}</p>}
  {progress && progress.coins<GACHA_COST && <button type="button" className="arena-back" onClick={onMissions}>ミッションでコインをためる</button>}
  {ownedPrints.length>0 && <section className="gacha-my-prints" aria-labelledby="gacha-my-prints-title">
    <h2 id="gacha-my-prints-title"><FileText size={18} aria-hidden="true"/>マイプリント <small>{ownedPrints.length} / {prints.length}</small></h2>
    <ul>{ownedPrints.map(item=>{const p=printOf(item.id)!;return <li key={item.id}><ItemArt item={item} progress={progress} size={56}/><span><strong>{p.label}</strong><small>{p.category} · {p.pages}ページ</small><PrintLinks item={item} compact/></span></li>;})}</ul>
  </section>}
  <div className="gacha-collection-meter" aria-label={`コレクション ${ownedCount}/${items.length}種類`}><span>COLLECTION <strong>{ownedCount} / {items.length}</strong></span><progress value={ownedCount} max={items.length} aria-label="装飾の収集状況" /></div>
  <button type="button" className="gacha-odds-toggle" aria-haspopup="dialog" onClick={()=>oddsDialog.current?.showModal()}>コレクション・提供割合を見る</button>
  <dialog ref={oddsDialog} className="game-details-dialog" aria-labelledby="gacha-odds-title">
    <header><h2 id="gacha-odds-title">装飾コレクション・提供割合</h2><button type="button" autoFocus onClick={()=>oddsDialog.current?.close()}>閉じる</button></header>
    <div className="game-details-body gacha-odds">
      <p>全{items.length}種類。まず<strong>レア度</strong>を抽選（UR {pct(GACHA_RARITY_RATES.UR)}%・SR {pct(GACHA_RARITY_RATES.SR)}%・R {pct(GACHA_RARITY_RATES.R)}%・N {pct(GACHA_RARITY_RATES.N)}%）し、同じレア度の中から等確率で1つ出ます。<strong>UR（大当たり）は学習プリント{tiers.UR.length}種</strong>で、1種あたり約{pct(GACHA_RARITY_RATES.UR/Math.max(1,tiers.UR.length))}%。<strong>5連は最後の1回が「R以上確定」</strong>（それまでにR以上が出ていなければ、UR {pct(GACHA_RARITY_RATES.UR/(1-GACHA_RARITY_RATES.N))}%・SR {pct(GACHA_RARITY_RATES.SR/(1-GACHA_RARITY_RATES.N))}%・R {pct(GACHA_RARITY_RATES.R/(1-GACHA_RARITY_RATES.N))}% で抽選）。重複は N {GACHA_DUPLICATE_REFUND_BY_RARITY.N}枚・R {GACHA_DUPLICATE_REFUND_BY_RARITY.R}枚・SR {GACHA_DUPLICATE_REFUND_BY_RARITY.SR}枚・UR {GACHA_DUPLICATE_REFUND_BY_RARITY.UR}枚返還。課金・換金なし／天井なし。UR・SR はガチャ限定です。フレームや一部ポーズはショップ交換・レベル・称号でも獲得できます。学習プリントの問題・正解はアプリ内の問題（確認済み）から作っています。</p>
      <div className="gacha-collection-filters" role="group" aria-label="種類で切り替える">{([['decor',`装飾 ${decor.length}種`],['print',`学習プリント ${prints.length}種`]] as const).map(([id,label])=><button key={id} type="button" aria-pressed={collectionKind===id} onClick={()=>setCollectionKind(id)}>{label}</button>)}</div>
      <div className="gacha-collection-filters" role="group" aria-label="所持状況で絞り込む">{([['all','すべて'],['owned','所持済み'],['missing','未所持']] as const).map(([id,label])=><button key={id} type="button" aria-pressed={collectionFilter===id} onClick={()=>setCollectionFilter(id)}>{label}</button>)}</div>
      <ul className="gacha-collection-grid" data-kind={collectionKind}>{(collectionKind==='print'?prints:decor).filter(item=>collectionFilter==='all'||(collectionFilter==='owned')===!!progress?.owned.includes(item.id)).map(item=>{
        const owned=!!progress?.owned.includes(item.id);
        return <li key={item.id} data-owned={owned}>
          <ItemArt item={item} progress={progress} size={item.kind==='print'?64:76}/>
          <strong><RarityTag rarity={gachaRarityOf(item)}/> {item.label}</strong><span>{owned?'所持済み':'未所持'} · {pct(gachaItemRate(item))}%</span>
          {owned && item.kind==='print' && <PrintLinks item={item} compact/>}
        </li>;
      })}</ul>
      {(()=>{const list=collectionKind==='print'?prints:decor;const n=list.filter(item=>progress?.owned.includes(item.id)).length;
        return <>{collectionFilter==='missing' && n===list.length && <p>全種類コレクション済みです。</p>}
        {collectionFilter==='owned' && n===0 && <p>{collectionKind==='print'?'まだ学習プリントを持っていません。大当たり（UR）で出ます。':'まだガチャ対象の装飾を持っていません。'}</p>}</>;})()}
      <p>プレビューは装備・コインを変更しません。装飾はこのブラウザのアカウントごとに保存されます。強さは変わりません。</p>
    </div>
  </dialog>
 </section>;
}
