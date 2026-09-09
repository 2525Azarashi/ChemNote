import { useEffect, useState } from 'react';
import { loadMyGrowth, subscribeGrowth, touchLogin } from '../data/growthStore';
import { emptyProgress, localDateKey, type GrowthProgress, type LoginBonus } from '../core/growth';
import { GrowthAvatar, LevelBar } from './GrowthParts';
import { LoginBonusSheet } from './GrowthFx';

/** Compact, optional entry: never place an automatic reward overlay in front of matchmaking. */
export function GrowthHomeStrip({ onProfile, onMissions }: { onProfile: () => void; onMissions: () => void }) {
  const [progress, setProgress] = useState<GrowthProgress>(() => emptyProgress('guest'));
  const [bonus, setBonus] = useState<LoginBonus | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [today, setToday] = useState(localDateKey);
  useEffect(() => {
    let alive = true;
    void loadMyGrowth().then(p => { if (alive) setProgress(p); });
    const off = subscribeGrowth(p => { if (alive) setProgress(p); });
    const timer = setInterval(() => setToday(localDateKey()), 60_000);
    return () => { alive = false; off(); clearInterval(timer); };
  }, []);
  return <section className="my-2 rounded-2xl border border-gray-200 bg-white p-2" aria-label="この端末の成長">
    <div className="flex items-center gap-3">
      <button type="button" onClick={onProfile} aria-label="成長プロフィールを開く" className="shrink-0 p-1">
        <GrowthAvatar progress={progress} size={40} />
      </button>
      <div className="min-w-0 flex-1"><LevelBar xp={progress.xp} compact />
        <p className="mt-1 text-[10px] text-gray-600">端末保存 · {progress.coins} コイン · {progress.loginStreak}日連続</p>
      </div>
    </div>
    <div className="mt-2 grid grid-cols-3 gap-1 text-[11px] font-bold">
      <button type="button" onClick={onProfile} className="min-h-11 rounded-xl bg-blue-50">称号・きせかえ</button>
      <button type="button" onClick={onMissions} className="min-h-11 rounded-xl bg-blue-50">ミッション</button>
      <button type="button" disabled={busy || progress.lastLoginDate >= today}
        className="min-h-11 rounded-xl bg-amber-100 disabled:opacity-50"
        onClick={async () => {
          setBusy(true); setError('');
          const r = await touchLogin();
          setBusy(false);
          if (!r) setError('端末に保存できません。保存設定・空き容量を確認してください。');
          else { setProgress(r.progress); setBonus(r.bonus); }
        }}>{progress.lastLoginDate >= today ? '本日受取済み' : '日替わりボーナス'}</button>
    </div>
    {error && <p role="alert" className="mt-2 text-xs text-red-700">{error}</p>}
    {bonus && <LoginBonusSheet bonus={bonus} progress={progress} onClose={() => setBonus(null)} />}
  </section>;
}
