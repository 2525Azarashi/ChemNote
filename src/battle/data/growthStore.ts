/** Device-local, account-scoped personal progression. No Firestore writes or public profiles.
 * Progress and reward receipts share one atomic localStorage write. Web Locks serialize tabs.
 * This is deliberately not an anti-cheat boundary: local cosmetics never affect online ratings.
 */
import { auth } from '../../firebase';
import { safeLocalStorage } from '../../utils/safeLocalStorage';
import { applyHolesFilled, applyLoginWithBonus, applyMatchToProgress, claimMission,
  emptyProgress, equipItem, equipTitle, localDateKey, normalizeProgress, purchaseItem,
  type GrowthProgress, type MatchSummaryForGrowth } from '../core/growth';

export const GROWTH_STORAGE_PREFIX = 'battle_growth_local_v1_';
type Envelope = { version: 1; progress: GrowthProgress; receipts: string[]; day: string };
const listeners = new Set<(p: GrowthProgress) => void>();
const scope = () => auth.currentUser?.uid || 'guest';
const keyOf = (uid: string) => GROWTH_STORAGE_PREFIX + encodeURIComponent(uid);
const initial = (uid: string): Envelope => ({ version: 1, progress: emptyProgress(uid), receipts: [], day: '' });

function read(uid: string): Envelope {
  const storage = safeLocalStorage();
  if (!storage) throw new Error('Storage unavailable');
  const raw = storage.getItem(keyOf(uid));
  if (!raw) return initial(uid);
  const value = JSON.parse(raw);
  if (value?.version !== 1 || !value.progress || !Array.isArray(value.receipts)
    || value.receipts.some((s: unknown) => typeof s !== 'string')) throw new Error('Invalid growth record');
  return { version: 1, progress: normalizeProgress(uid, value.progress),
    receipts: value.receipts, day: typeof value.day === 'string' ? value.day : '' };
}
function publish(p: GrowthProgress) {
  if (p.uid !== scope()) return;
  for (const fn of listeners) { try { fn(p); } catch { /* isolate UI listeners */ } }
}
export function subscribeGrowth(fn: (p: GrowthProgress) => void): () => void {
  const uid = scope();
  const scoped = (p: GrowthProgress) => { if (scope() === uid && p.uid === uid) fn(p); };
  const changed = (event: StorageEvent) => {
    if (event.key === keyOf(uid) && scope() === uid) { try { scoped(read(uid).progress); } catch { /* preserve display */ } }
  };
  listeners.add(scoped);
  globalThis.addEventListener?.('storage', changed);
  return () => { listeners.delete(scoped); globalThis.removeEventListener?.('storage', changed); };
}
export function cachedGrowth(): GrowthProgress | null {
  try { return read(scope()).progress; } catch { return null; }
}
export async function loadMyGrowth(): Promise<GrowthProgress> { return cachedGrowth() || emptyProgress(scope()); }

async function mutate<T>(fn: (p: GrowthProgress, today: string, seen: Set<string>) => { next: GrowthProgress; extra: T }, expectedUid = scope()) {
  const uid = expectedUid;
  const perform = () => {
    if (scope() !== uid) return null;
    try {
      const current = read(uid);
      // Clock rollback must not reopen a previously claimed daily reward.
      const today = [current.day, current.progress.daily.date, current.progress.lastLoginDate, localDateKey()].sort().at(-1)!;
      const receipts = new Set(current.receipts);
      const result = fn(current.progress, today, receipts);
      if (result.next !== current.progress || receipts.size !== current.receipts.length) {
        const storage = safeLocalStorage();
        if (!storage) return null;
        storage.setItem(keyOf(uid), JSON.stringify({ version: 1, progress: result.next, receipts: [...receipts], day: today }));
      }
      publish(result.next);
      return result;
    } catch { return null; } // Do not report a reward if persistence failed, or overwrite corrupt data.
  };
  try {
    const locks = typeof navigator !== 'undefined' ? navigator.locks : undefined;
    return locks ? await locks.request(keyOf(uid), perform) : perform();
  } catch { return null; }
}
export async function applyMatchGrowth(match: MatchSummaryForGrowth, expectedUid = scope()) {
  const out = await mutate((p, today, seen) => {
    const receipt = `match:${match.roomId}`;
    if (!match.roomId || seen.has(receipt) || !match.score.perQuestion.length) return { next: p, extra: null };
    const r = applyMatchToProgress(p, match, today);
    seen.add(receipt);
    return { next: r.next, extra: r.delta };
  }, expectedUid);
  return out ? { progress: out.next, delta: out.extra } : null;
}
export async function touchLogin() {
  const out = await mutate((p, today) => {
    const r = applyLoginWithBonus(p, today);
    return { next: r.next, extra: r.bonus };
  });
  return out ? { progress: out.next, bonus: out.extra } : null;
}
/** Called only after an existing review item has been marked correct. Once per question/day. */
export async function recordReviewGrowth(uid: string, reviewKey: string) {
  if (!reviewKey || scope() !== uid) return null;
  const out = await mutate((p, today, seen) => {
    const receipt = `review:${today}:${reviewKey}`;
    if (seen.has(receipt)) return { next: p, extra: null };
    seen.add(receipt);
    return { next: applyHolesFilled(p, 1, today), extra: null };
  }, uid);
  return out?.next || null;
}
export async function claimMissionReward(id: string) {
  const out = await mutate((p, today) => {
    const r = claimMission(p, id, today);
    return { next: r.next, extra: r.reward };
  });
  return out ? { progress: out.next, reward: out.extra } : null;
}
export async function equip(id: string) {
  return (await mutate(p => ({ next: equipItem(p, id), extra: null })))?.next || null;
}
export async function equipBadgeTitle(id: string) {
  return (await mutate(p => ({ next: equipTitle(p, id), extra: null })))?.next || null;
}
export async function buyItem(id: string) {
  const out = await mutate(p => {
    const r = purchaseItem(p, id);
    return { next: r.ok ? equipItem(r.next, id) : p, extra: { ok: r.ok, reason: r.reason } };
  });
  return out ? { progress: out.next, ...out.extra } : null;
}
