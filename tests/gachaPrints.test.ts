import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { GACHA_PRINTS } from '../src/data/gachaPrints.generated';
import { GACHA_RARITY_RATES, GACHA_DUPLICATE_REFUND_BY_RARITY, GACHA_COST, gachaItems, gachaItemRate, gachaItemsByRarity, rollGacha, pickGachaItem } from '../src/battle/core/arenaEconomy';
import { emptyProgress, equipItem, gachaRarityOf, itemById, printOf } from '../src/battle/core/growth';

const pub = (p: string) => path.join(process.cwd(), 'public', p.replace(/^\//, ''));

describe('ガチャ大当たり（UR）＝学習プリント', () => {
  it('たくさんある（40種以上）・id は重複しない・カテゴリは3種類', () => {
    expect(GACHA_PRINTS.length).toBeGreaterThanOrEqual(40);
    expect(new Set(GACHA_PRINTS.map(p => p.id)).size).toBe(GACHA_PRINTS.length);
    expect(new Set(GACHA_PRINTS.map(p => p.category))).toEqual(new Set(['出題傾向', '演習プリント', '単語テスト']));
    // 共テの出題傾向レポートと、ハブの二次関数プリントが入っている
    expect(GACHA_PRINTS.filter(p => p.category === '出題傾向').length).toBeGreaterThanOrEqual(10);
    expect(GACHA_PRINTS.some(p => p.id === 'print_math_quadratic_weekly')).toBe(true);
  });
  it('PDF とサムネイルが実在し、PDF として読める（同じサイト内のパスだけ）', () => {
    for (const p of GACHA_PRINTS) {
      expect(p.file).toMatch(/^\/prints\/[a-z0-9_]+\.pdf$/);
      expect(p.thumb).toMatch(/^\/prints\/thumbs\/[a-z0-9_]+\.webp$/);
      expect(existsSync(pub(p.file)), p.file).toBe(true);
      expect(existsSync(pub(p.thumb)), p.thumb).toBe(true);
      expect(readFileSync(pub(p.file)).subarray(0, 5).toString()).toBe('%PDF-');
      expect(statSync(pub(p.file)).size).toBeLessThan(3 * 1024 * 1024);
      expect(p.pages).toBeGreaterThan(0);
    }
  });
  it('UR 枠は合計 5%・1種あたり 0.1% 台（0.x%）', () => {
    const ur = gachaItemsByRarity().UR;
    expect(ur.map(i => i.id).sort()).toEqual(GACHA_PRINTS.map(p => p.id).sort());
    expect(GACHA_RARITY_RATES.UR).toBeCloseTo(0.05, 9);
    expect(ur.reduce((n, i) => n + gachaItemRate(i), 0)).toBeCloseTo(0.05, 9);
    for (const i of ur) { expect(gachaItemRate(i)).toBeLessThan(0.01); expect(gachaItemRate(i)).toBeGreaterThan(0.0005); }
    // 全体の合計はちょうど 100%
    expect(gachaItems().reduce((n, i) => n + gachaItemRate(i), 0)).toBeCloseTo(1, 9);
  });
  it('プリントはガチャ限定・UR・装備できない', () => {
    for (const p of GACHA_PRINTS) {
      const item = itemById(p.id)!;
      expect(item.kind).toBe('print');
      expect(item.value).toBe(p.file);
      expect(gachaRarityOf(item)).toBe('UR');
      expect('gacha' in item.unlock).toBe(true);
      expect(printOf(p.id)).toEqual(p);
    }
    const owned = { ...emptyProgress('a'), owned: [...emptyProgress('a').owned, GACHA_PRINTS[0].id] };
    expect(equipItem(owned, GACHA_PRINTS[0].id)).toBe(owned);
  });
  it('乱数の先頭 5% で UR が出て、重複は全額返還', () => {
    const progress = { ...emptyProgress('a'), coins: 200 };
    for (let i = 0; i < 50; i += 1) expect(pickGachaItem((i / 50) * 0.05)?.rarity).toBe('UR');
    expect(pickGachaItem(0.0500001)?.rarity).not.toBe('UR');
    const a = rollGacha(progress, 0.001)!; expect(a.rarity).toBe('UR'); expect(a.duplicate).toBe(false);
    const b = rollGacha(a.next, 0.001)!; expect(b.duplicate).toBe(true);
    expect(b.refund).toBe(GACHA_DUPLICATE_REFUND_BY_RARITY.UR); expect(b.refund).toBe(GACHA_COST);
  });
  it('5連の R 以上確定枠でも UR が出うる', () => {
    expect(pickGachaItem(0, 'R')?.rarity).toBe('UR');
    expect(pickGachaItem(0.999, 'R')?.rarity).toBe('R');
  });
});
