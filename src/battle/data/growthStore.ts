/** Device-local, account-scoped personal progression. No Firestore writes or public profiles.
 * Progress and reward receipts share one atomic localStorage write. Web Locks serialize tabs.
 * This is deliberately not an anti-cheat boundary: local cosmetics never affect online ratings.
 */
import { auth } from '../../firebase';
import { safeLocalStorage } from '../../utils/safeLocalStorage';
import { applyHolesFilled, applyLoginWithBonus, applyMatchToProgress, applyRushResult, applyStudySolved,
  claimMission, emptyProgress, equipItem, equipTitle, localDateKey, normalizeProgress, openCompleteChest,
  purchaseItem, RUSH_COIN_PLAYS_PER_DAY, type GrowthProgress, type ItemDef, type MatchSummaryForGrowth,
  type RushResult, type GachaRarity } from '../core/growth';

import { matchCoins, rollGacha } from '../core/arenaEconomy';

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
        storage.setItem(keyOf(uid), JSON.stringify({ version: 1, progress: result.next, receipts: pruneReceipts(receipts, today), day: today }));
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
    if (!r.delta) return { next: p, extra: null };
    const coins = matchCoins(match);
    return { next: { ...r.next, coins: r.next.coins + coins.total }, extra: r.delta ? { ...r.delta, coins } : null };
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
/** デイリーコンプリート宝箱を開ける（ミッション3つ受け取り後、1日1回） */
export async function openChest() {
  const out = await mutate((p, today) => {
    const r = openCompleteChest(p, today);
    return { next: r.next, extra: r.reward };
  });
  return out ? { progress: out.next, reward: out.extra } : null;
}
/**
 * 演習で大問に得点したとき。同じ大問は1日1回だけ報酬（何度解き直しても増えすぎない）。
 * 学習の保存（progress.ts）とは独立。失敗しても学習は止めない。
 */
export async function recordStudyGrowth(uid: string, problemKey: string) {
  if (!problemKey || problemKey.length > 200 || scope() !== uid) return null;
  const out = await mutate((p, today, seen) => {
    const receipt = `study:${today}:${problemKey}`;
    if (seen.has(receipt)) return { next: p, extra: null };
    seen.add(receipt);
    const r = applyStudySolved(p, today);
    return { next: r.next, extra: r.reward };
  }, uid);
  return out ? { progress: out.next, reward: out.extra } : null;
}
/** マナラッシュ1回ぶんの結果。runId ごとに1回だけ。コインは1日 RUSH_COIN_PLAYS_PER_DAY 回まで。 */
export async function applyRushGrowth(result: RushResult, expectedUid = scope()) {
  if (!result.runId || result.runId.length > 100 || !Number.isFinite(result.score)) return null;
  const out = await mutate((p, today, seen) => {
    const receipt = `rush:${result.runId}`;
    if (seen.has(receipt)) return { next: p, extra: null };
    const coinPlays = [...seen].filter(k => k.startsWith(`rushcoin:${today}:`)).length;
    const coinEligible = coinPlays < RUSH_COIN_PLAYS_PER_DAY && result.answered > 0;
    seen.add(receipt);
    if (coinEligible) seen.add(`rushcoin:${today}:${result.runId}`);
    const r = applyRushResult(p, result, today, coinEligible);
    return { next: r.next, extra: { reward: r.reward, newBest: r.newBest, newSubjectBest: r.newSubjectBest,
      coinPlaysLeft: Math.max(0, RUSH_COIN_PLAYS_PER_DAY - coinPlays - (coinEligible ? 1 : 0)) } };
  }, expectedUid);
  return out ? { progress: out.next, ...(out.extra ?? {}) } : null;
}
/** 今日のマナラッシュでコインがもらえる残り回数（表示用） */
export function rushCoinPlaysLeft(): number {
  try {
    const current = read(scope());
    const today = [current.day, localDateKey()].sort().at(-1)!;
    const used = current.receipts.filter(k => k.startsWith(`rushcoin:${today}:`)).length;
    return Math.max(0, RUSH_COIN_PLAYS_PER_DAY - used);
  } catch { return 0; }
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

/** One receipt and one atomic write for each confirmed draw. */
export async function drawGacha(requestId: string, expectedUid = scope()) {
  if (!requestId || requestId.length > 100) return null;
  const out = await mutate((p, _today, seen) => {
    const receipt = `gacha:${requestId}`;
    if (seen.has(receipt)) return { next: p, extra: null };
    const values = new Uint32Array(1); crypto.getRandomValues(values);
    const r = rollGacha(p, values[0] / 4294967296);
    if (!r) return { next: p, extra: null };
    seen.add(receipt);
    return { next: r.next, extra: { item: r.item, rarity: r.rarity, duplicate: r.duplicate, refund: r.refund } };
  }, expectedUid);
  return out ? { progress: out.next, result: out.extra } : null;
}

/** 5連ガチャ。1回の確認・1回の書き込みで5回ぶん引く（途中で残高が尽きたらそこまで）。 */
export const GACHA_MULTI_COUNT = 5;
export async function drawGachaMulti(requestId: string, expectedUid = scope()) {
  if (!requestId || requestId.length > 100) return null;
  const out = await mutate((p, _today, seen) => {
    const receipt = `gacha5:${requestId}`;
    if (seen.has(receipt)) return { next: p, extra: null };
    const values = new Uint32Array(GACHA_MULTI_COUNT); crypto.getRandomValues(values);
    let cur = p; const results: { item: ItemDef; rarity: GachaRarity; duplicate: boolean; refund: number }[] = [];
    for (let i = 0; i < GACHA_MULTI_COUNT; i += 1) {
      // 最後の1回は、それまでに R 以上が1つも出ていなければ「R以上確定」
      const last = i === GACHA_MULTI_COUNT - 1;
      const guaranteed = last && results.every(x => x.rarity === 'N');
      const r = rollGacha(cur, values[i] / 4294967296, guaranteed ? 'R' : 'N');
      if (!r) break;
      cur = r.next; results.push({ item: r.item, rarity: r.rarity, duplicate: r.duplicate, refund: r.refund });
    }
    if (results.length < GACHA_MULTI_COUNT) return { next: p, extra: null };
    seen.add(receipt);
    return { next: cur, extra: results };
  }, expectedUid);
  return out ? { progress: out.next, results: out.extra } : null;
}

/**
 * 受け取り記録（receipts）が増え続けないように、日付入りの記録（study / rushcoin）は今日の分だけ残す。
 * 日付が入っていない記録（match / gacha / rush / review）は従来どおりすべて残す。
 */
function pruneReceipts(receipts: Set<string>, today: string): string[] {
  return [...receipts].filter(k => !/^(study|rushcoin):/.test(k) || k.startsWith(`study:${today}:`) || k.startsWith(`rushcoin:${today}:`));
}
