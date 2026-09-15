import { ITEMS, type GrowthProgress } from './growth';
import type { MatchSummaryForGrowth } from './growth';
export const GACHA_COST = 50;
export const GACHA_DUPLICATE_REFUND = 20;
export const gachaItems = () => ITEMS.filter(item => 'coins' in item.unlock);
export function matchCoins(match: MatchSummaryForGrowth) {
  const active = !match.forfeit && match.score.perQuestion.some(q => q.answered || q.correct);
  const finish = active ? 10 : 0;
  const correct = active ? Math.max(0, match.score.correctCount) * 2 : 0;
  const victory = active && match.outcome === 'win' ? 10 : 0;
  return { finish, correct, victory, total: finish + correct + victory };
}
export function rollGacha(progress: GrowthProgress, random: number) {
  if (!Number.isFinite(random) || random < 0 || random >= 1 || progress.coins < GACHA_COST) return null;
  const items = gachaItems(); const item = items[Math.floor(random * items.length)];
  if (!item) return null;
  const duplicate = progress.owned.includes(item.id);
  const refund = duplicate ? GACHA_DUPLICATE_REFUND : 0;
  return { next: { ...progress, coins: progress.coins - GACHA_COST + refund,
    owned: duplicate ? progress.owned : [...progress.owned, item.id] }, item, duplicate, refund };
}
