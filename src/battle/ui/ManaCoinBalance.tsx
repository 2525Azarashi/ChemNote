import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { Coins } from 'lucide-react';
import { auth } from '../../firebase';

/** Read the existing account-scoped balance; never create a second wallet. */
export function ManaCoinBalance() {
  const [uid, setUid] = useState(() => auth.currentUser?.uid || 'guest');
  const [balance, setBalance] = useState<{ uid: string; coins: number | null }>({ uid, coins: null });
  useEffect(() => onAuthStateChanged(auth, user => setUid(user?.uid || 'guest')), []);
  useEffect(() => {
    let alive = true;
    let off = () => {};
    void import('../data/growthStore').then(store => {
      if (!alive || (auth.currentUser?.uid || 'guest') !== uid) return;
      const value = store.cachedGrowth();
      setBalance({ uid, coins: value?.coins ?? null });
      off = store.subscribeGrowth(progress => { if (alive && progress.uid === uid) setBalance({ uid, coins: progress.coins }); });
    }).catch(() => { if (alive) setBalance({ uid, coins: null }); });
    return () => { alive = false; off(); };
  }, [uid]);
  const coins = balance.uid === uid ? balance.coins : null;
  return <div className="mt-2 inline-flex max-w-full flex-wrap items-center gap-1.5 rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-950"
    role="status" aria-label={`マナコイン残高 ${coins === null ? '確認できません' : coins + '枚'}`} title="この端末・このアカウントのマナコイン（端末保存）" data-mana-coins>
    <Coins size={17} aria-hidden="true" /><span>マナコイン</span><strong className="text-base tabular-nums">{coins === null ? '—' : coins.toLocaleString('ja-JP')}</strong>
  </div>;
}
