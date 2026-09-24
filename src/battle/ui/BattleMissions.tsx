/**
 * ===================================================================
 * BattleMissions — きょうのミッション
 * ===================================================================
 *
 * ★毎日3つ。日付だけで決まるので全員同じ★（core/growth.ts の missionsForDate）
 * 対戦系2つ＋学習（穴を埋める）系1つ。対戦に勝てない日でも、
 * 学習すれば報酬が受け取れる。
 *
 * ★報酬は「うけとる」を押して初めて入る★
 * 自動で入れると、何が増えたか気づかないまま終わる。
 * 押す行為そのものが小さな達成感になる（みんはやのデイリーと同じ）。
 *
 * ★入れ替わりまでの時間を出す★
 * 「あと3時間で消える」が見えると、今日中にやる理由になる。
 * 1分ごとにしか更新しない（毎秒描き直す価値は無い）。
 */

import { useEffect, useState } from 'react';
import { ArrowLeft, CalendarCheck, Clock, Coins, Gift, PartyPopper, Sparkles, Zap } from 'lucide-react';
import { allMissionsForDate, canOpenDailyChest, DAILY_CHEST_ID, DAILY_CHEST_REWARD, localDateKey, missionsForDate, msUntilNextDay, rolloverDaily, type GrowthProgress } from '../core/growth';
import { claimMissionReward, loadMyGrowth, openChest, subscribeGrowth } from '../data/growthStore';
import { play, primeAudio } from './feedback';
import { AMBER, BattleButton, BattleLoading, BattleNotice, BattleShell, BattleTitle, GOLD, INK, INK_SUB, LINE } from './BattleParts';
import { GrowthAvatar, LevelBar, MissionRow } from './GrowthParts';

function remainLabel(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  if (h > 0) return `${h}時間${m}分`;
  return `${m}分`;
}

export function BattleMissions({ onBack, onBattle, onReview, onShop, onRush, standalone = false }: { onBack: () => void; onBattle?: () => void; onReview?: () => void; onShop?: () => void; onRush?: () => void; standalone?: boolean; key?: string }) {
  const [progress, setProgress] = useState<GrowthProgress | null>(null);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [justClaimed, setJustClaimed] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [remain, setRemain] = useState(() => msUntilNextDay());
  const today = localDateKey();

  useEffect(() => {
    let alive = true;
    void loadMyGrowth().then((p) => alive && setProgress(p));
    const off = subscribeGrowth((p) => alive && setProgress(p));
    const tick = window.setInterval(() => setRemain(msUntilNextDay()), 60_000);
    return () => {
      alive = false;
      off();
      window.clearInterval(tick);
    };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(t);
  }, [toast]);

  const claim = async (id: string) => {
    primeAudio();
    play('tap');
    setClaiming(id);
    const r = await claimMissionReward(id);
    setClaiming(null);
    if (r?.reward) {
      play('coin');
      setJustClaimed(id);
      setToast(`+${r.reward.xp} XP ／ +${r.reward.coins} コイン をうけとりました`);

    } else if (r === null) {
      setToast('端末に保存できませんでした。ブラウザの保存設定・空き容量を確認してください。');
    }
  };

  const openTreasure = async () => {
    primeAudio();
    setClaiming(DAILY_CHEST_ID);
    const r = await openChest();
    setClaiming(null);
    if (r?.reward) {
      play('levelup');
      setToast(`宝箱をひらいた！ +${r.reward.xp} XP ／ +${r.reward.coins} コイン`);
    } else if (r === null) {
      setToast('端末に保存できませんでした。ブラウザの保存設定・空き容量を確認してください。');
    }
  };

  if (!progress) {
    return (
      <BattleShell>
        {standalone ? <h1 className="mb-4 text-center font-handwriting text-2xl font-black">きょうのミッション</h1> : <BattleTitle subtitle="きょうのミッション" />}
      <p className="mb-3 text-xs text-gray-600">この端末だけの成長記録です。AI対戦でも進みます。復習ミッションは「復習リスト」で「できた」にした問題を1問1日1回数えます。</p>
        <BattleLoading message="ミッションを読みこんでいます…" />
      </BattleShell>
    );
  }

  // 日付が変わっていれば表示上は空で始める（書き込みは次の試合・ログイン時）
  const daily = rolloverDaily(progress.daily, today);
  const battleMissions = missionsForDate(today);
  const missions = allMissionsForDate(today);
  const bonusMissions = missions.slice(battleMissions.length);
  const done = missions.filter((m) => (daily.progress[m.id] ?? 0) >= m.goal);
  const claimable = done.filter((m) => !daily.claimed.includes(m.id)).length;
  const allClaimed = missions.every((m) => daily.claimed.includes(m.id));
  const chestOpened = daily.claimed.includes(DAILY_CHEST_ID);
  const chestReady = canOpenDailyChest({ ...progress, daily }, today);
  const claimedCount = missions.filter((m) => daily.claimed.includes(m.id)).length;
  const totalXp = missions.reduce((a, m) => a + m.rewardXp, 0);
  const totalCoins = missions.reduce((a, m) => a + m.rewardCoins, 0);

  return (
    <BattleShell
      footer={
        <div className="grid gap-2.5">
          {onRush && !allClaimed && (
            <BattleButton onClick={onRush} icon={<Zap size={18} />}>
              マナラッシュでミッションを進める
            </BattleButton>
          )}
          {onBattle && !allClaimed && (
            <BattleButton onClick={onBattle} icon={<Sparkles size={18} />}>
              対戦してミッションを進める
            </BattleButton>
          )}
          {onReview && <BattleButton variant="ghost" onClick={onReview}>復習でミッションを進める</BattleButton>}
          {onShop && <BattleButton variant="ghost" onClick={onShop}>マナコインをショップで使う</BattleButton>}
          <BattleButton variant="ghost" onClick={onBack} icon={<ArrowLeft size={18} />}>
            もどる
          </BattleButton>
        </div>
      }
    >
      {standalone ? <h1 className="mb-4 text-center font-handwriting text-2xl font-black">きょうのミッション</h1> : <BattleTitle subtitle="きょうのミッション" />}
      <p className="mb-3 text-xs text-gray-600">この端末だけの成長記録です。AI対戦でも進みます。復習ミッションは「復習リスト」で「できた」にした問題を1問1日1回数えます。</p>

      {toast && (
        <div className="mb-3">
          <BattleNotice message={toast} tone="info" />
        </div>
      )}

      {/* 今日の状態 */}
      <section
        id="battle-missions-summary"
        className="battle-card-in mb-4 rounded-3xl border-2 p-4"
        style={{ borderColor: claimable > 0 ? `${GOLD}AA` : LINE, background: claimable > 0 ? `${GOLD}12` : '#FFFFFF' }}
      >
        <div className="flex items-center gap-3">
          <GrowthAvatar progress={progress} size={56} />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 text-[10px] font-black" style={{ color: INK_SUB }}>
              <CalendarCheck size={12} />
              {today.replace(/-/g, '/')}
              <span className="ml-auto inline-flex items-center gap-1 tabular-nums">
                <Clock size={11} /> 入れかわりまで {remainLabel(remain)}
              </span>
            </p>
            <p className="mt-0.5 text-sm font-black" style={{ color: INK }}>
              {allClaimed ? (
                <span className="inline-flex items-center gap-1" style={{ color: AMBER }}>
                  <PartyPopper size={15} /> きょうは全部うけとりました
                </span>
              ) : claimable > 0 ? (
                <span style={{ color: AMBER }}>うけとれる報酬が {claimable}件</span>
              ) : (
                `${done.length}/${missions.length} たっせい`
              )}
            </p>
            <div className="mt-1.5">
              <LevelBar xp={progress.xp} compact />
            </div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-2xl px-3 py-2 text-[10px] font-bold" style={{ background: '#FAF8F3', border: `1px solid ${LINE}`, color: INK_SUB }}>
          <span>きょう全部やると</span>
          <span className="flex items-center gap-2 tabular-nums" style={{ color: INK }}>
            <span className="inline-flex items-center gap-0.5"><Sparkles size={11} style={{ color: AMBER }} /> +{totalXp} XP</span>
            <span className="inline-flex items-center gap-0.5"><Coins size={11} style={{ color: AMBER }} /> +{totalCoins}</span>
          </span>
          <span>もってる <span className="tabular-nums font-black" style={{ color: AMBER }}>{progress.coins}</span> コイン</span>
        </div>
      </section>

      <h2 className="mb-2 text-xs font-black" style={{ color: INK_SUB }}>対戦ミッション</h2>
      <div className="grid gap-2.5">
        {battleMissions.map((m) => (
          <MissionRow
            key={m.id}
            id={m.id}
            progress={daily.progress[m.id] ?? 0}
            claimed={daily.claimed.includes(m.id)}
            claiming={claiming === m.id}
            justClaimed={justClaimed === m.id}
            onClaim={() => void claim(m.id)}
          />
        ))}
      </div>

      <h2 className="mb-2 mt-4 text-xs font-black" style={{ color: INK_SUB }}>ボーナスミッション（演習・マナラッシュ）</h2>
      <div className="grid gap-2.5" data-bonus-missions>
        {bonusMissions.map((m) => (
          <MissionRow
            key={m.id}
            id={m.id}
            progress={daily.progress[m.id] ?? 0}
            claimed={daily.claimed.includes(m.id)}
            claiming={claiming === m.id}
            justClaimed={justClaimed === m.id}
            onClaim={() => void claim(m.id)}
          />
        ))}
      </div>

      <section className={`daily-chest mt-4 rounded-3xl border-2 p-4 ${chestReady ? 'is-ready' : ''}`} data-daily-chest
        style={{ borderColor: chestReady ? `${GOLD}CC` : LINE, background: chestReady ? `${GOLD}1A` : '#FFFFFF' }}>
        <div className="flex items-center gap-3">
          <span className="daily-chest-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: chestOpened ? '#EEF1F3' : `${GOLD}55`, color: chestOpened ? INK_SUB : AMBER }} aria-hidden>
            <Gift size={26} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-black" style={{ color: INK }}>{chestOpened ? 'きょうの宝箱はひらきました' : 'コンプリート宝箱'}</p>
            <p className="text-[11px] font-bold" style={{ color: INK_SUB }}>
              {chestOpened ? 'また明日ちょうせんしよう' : `全${missions.length}ミッションを受け取るとひらく（${claimedCount}/${missions.length}）`}
            </p>
            <p className="text-[11px] font-black tabular-nums" style={{ color: AMBER }}>+{DAILY_CHEST_REWARD.xp} XP ／ +{DAILY_CHEST_REWARD.coins} コイン</p>
          </div>
          <button type="button" disabled={!chestReady || claiming === DAILY_CHEST_ID} onClick={() => void openTreasure()}
            className="min-h-11 rounded-xl px-3 text-xs font-black disabled:opacity-40" style={{ background: chestReady ? GOLD : '#EEF1F3', color: INK }}>
            {chestOpened ? '受取済' : 'ひらく'}
          </button>
        </div>
      </section>

      <p className="mt-4 flex items-start gap-1.5 text-[10px] font-bold leading-relaxed" style={{ color: INK_SUB }}>
        <Sparkles size={12} className="mt-0.5 shrink-0" style={{ color: AMBER }} />
        ミッションは毎日0時に入れかわり、全員おなじ内容です。ボーナスミッションは演習（大問に得点）とマナラッシュで進みます。コインは「プロフィール」でとびら君の装備と交換できます。
        復習リストの「できた」で進みます。同じ問題は1日1回までです。
      </p>
    </BattleShell>
  );
}
