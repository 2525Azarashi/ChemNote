import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { ITEMS, emptyProgress, equipItem, equippedAccessory, equippedWallpaper, normalizeProgress, unequipKind, gachaRarityOf } from '../src/battle/core/growth';
import { ACCESSORY_SLOTS, POSE_ANCHORS, anchorOf, parseAccessory, wallpaperOf, WALLPAPERS } from '../src/battle/core/tobiraParts';
import { gachaItems, gachaItemRate } from '../src/battle/core/arenaEconomy';

const own = (...ids: string[]) => ({ ...emptyProgress('a'), owned: [...emptyProgress('a').owned, ...ids] });

describe('とびら君の部位アクセサリ・壁紙', () => {
  it('すべてのポーズ画像に取り付け位置があり、値は画像の中に収まる', () => {
    const poses = ITEMS.filter(i => i.kind === 'pose').map(i => i.value);
    for (const src of [...poses, '/mascots/walking.webp']) {
      expect(POSE_ANCHORS[src], src).toBeTruthy();
      expect(existsSync(path.join(process.cwd(), 'public', src))).toBe(true);
      const { head, eyes } = anchorOf(src);
      for (const [x, y, w] of [head, eyes]) { expect(x).toBeGreaterThan(0); expect(x).toBeLessThan(1); expect(y).toBeGreaterThanOrEqual(0); expect(y).toBeLessThan(1); expect(w).toBeGreaterThan(0.1); }
    }
  });
  it('部位ごとに N / R / SR がそろい、見た目の定義が全部読める', () => {
    for (const slot of ACCESSORY_SLOTS) {
      const list = ITEMS.filter(i => i.kind === slot);
      expect(list.length, slot).toBeGreaterThanOrEqual(5);
      expect(new Set(list.map(gachaRarityOf)).has('N')).toBe(true);
      for (const i of list) { expect(parseAccessory(slot, i.value), i.id).not.toBeNull(); expect('gacha' in i.unlock).toBe(true); }
    }
    const walls = ITEMS.filter(i => i.kind === 'wallpaper');
    expect(walls.length).toBeGreaterThanOrEqual(12);
    for (const w of walls) expect(wallpaperOf(w.value), w.id).not.toBeNull();
    expect(Object.keys(WALLPAPERS).length).toBeGreaterThanOrEqual(walls.length);
  });
  it('壁紙の CSS は外部 URL を読まない（data: の SVG とグラデーションだけ）', () => {
    for (const w of Object.values(WALLPAPERS)) {
      expect(w.css).not.toMatch(/https?:/);
      for (const m of w.css.matchAll(/url\("([^"]+)"\)/g)) expect(m[1].startsWith('data:image/svg+xml,')).toBe(true);
    }
  });
  it('装備と外すが部位ごとに独立。持っていないもの・壊れた値は無視', () => {
    let p = own('hat_crown', 'glasses_round', 'wall_night');
    p = equipItem(equipItem(equipItem(p, 'hat_crown'), 'glasses_round'), 'wall_night');
    expect(p.equipped.hat).toBe('hat_crown'); expect(p.equipped.glasses).toBe('glasses_round');
    expect(equippedAccessory(p, 'hat')).toBe('crown:#F6C744'); expect(equippedWallpaper(p)).toBe('night');
    expect(p.equipped.pose).toBe('pose_basic');
    p = unequipKind(p, 'hat');
    expect(p.equipped.hat).toBe(''); expect(equippedAccessory(p, 'glasses')).toBe('round:#3B2F2F');
    expect(unequipKind(p, 'pose')).toBe(p);
    expect(equipItem(p, 'hat_wizard')).toBe(p); // 持っていない
    const broken = normalizeProgress('a', { owned: ['hat_crown'], equipped: { hat: 'frame_gold', wallpaper: 'nope' } });
    expect(equippedAccessory(broken, 'hat')).toBeUndefined(); expect(equippedWallpaper(broken)).toBe('');
    // 古いデータ（部位の欄がない）も読める
    const old = normalizeProgress('a', { equipped: { pose: 'pose_basic', frame: 'frame_paper', title: '' } });
    expect(old.equipped.hat).toBe(''); expect(old.equipped.wallpaper).toBe('');
  });
  it('提供割合の合計は 100% のまま', () => {
    expect(gachaItems().reduce((n, i) => n + gachaItemRate(i), 0)).toBeCloseTo(1, 9);
  });
});
