/**
 * ミッション達成トースト（アプリ全体で1つ）。
 *
 * どの画面にいても、デイリーミッションを達成した瞬間に上から出る。
 * 「受け取る」でミッション画面へ（受け取りはそこで行う＝報酬の二重付与を避ける）。
 * 通信はしない（growthStore の端末内イベントを聞くだけ）。
 */
import { useEffect, useRef, useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { subscribeMissionComplete, type MissionAnnouncement } from '../battle/data/growthStore';
import { play } from '../battle/ui/feedback';

const SHOW_MS = 5200;

export function MissionToast({ onOpen }: { onOpen: () => void }) {
  const [queue, setQueue] = useState<MissionAnnouncement[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => subscribeMissionComplete((ms) => {
    setQueue((q) => [...q, ...ms.filter((m) => !q.some((x) => x.id === m.id))]);
    try { play('badge', false); } catch { /* 音が出せなくても通知は出す */ }
  }), []);

  const current = queue[0];
  useEffect(() => {
    if (!current) return;
    timer.current = setTimeout(() => setQueue((q) => q.slice(1)), SHOW_MS);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [current]);

  if (!current) return null;
  return (
    <div className="mission-toast" role="status" aria-live="polite" data-mission-toast key={current.id}>
      <span className="mission-toast-icon" aria-hidden="true"><Trophy size={22} /></span>
      <div className="mission-toast-body">
        <strong>ミッション達成！</strong>
        <span>{current.label}</span>
        <small>+{current.rewardXp} XP ・ +{current.rewardCoins} マナコイン{queue.length > 1 ? `（ほか${queue.length - 1}件）` : ''}</small>
      </div>
      <button type="button" className="mission-toast-claim" onClick={() => { setQueue([]); onOpen(); }}>受け取る</button>
      <button type="button" className="mission-toast-close" aria-label="閉じる" onClick={() => setQueue((q) => q.slice(1))}><X size={16} /></button>
      <span className="mission-toast-timer" style={{ animationDuration: `${SHOW_MS}ms` }} aria-hidden="true" />
    </div>
  );
}
