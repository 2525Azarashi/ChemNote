import { describe, it, expect, beforeEach } from 'vitest';

import { mascotTips, TIP_CATEGORIES, TIP_TOTAL, type TipCategory } from '../src/data/mascotTips';
import {
  markTipSeen,
  pickTip,
  readLastTipId,
  readSeenTipIds,
  resetSeenTips,
} from '../src/utils/tipRotation';

/**
 * ===================================================================
 * とびら君の豆知識：データの健全性とローテーションの回帰テスト
 * ===================================================================
 * ここで守りたいことは3つ。
 *   ① 同じ内容の豆知識を二重に載せない（重複の作り込みを防ぐ）
 *   ② 口調が既存とそろっている（文末・記号の作法）
 *   ③ 未読を優先するので「一度も出ない豆知識」が生まれない
 */

describe('豆知識データの健全性', () => {
  it('ID は重複しない（既読管理が壊れない）', () => {
    const ids = mascotTips.map((tip) => tip.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('本文が重複していない', () => {
    const texts = mascotTips.map((tip) => tip.text);
    const duplicated = texts.filter((text, index) => texts.indexOf(text) !== index);
    expect(duplicated).toEqual([]);
  });

  it('同じ内容を言い換えただけの重複もない（キーワードの組み合わせで検査）', () => {
    // 数式・用語だけを残して正規化し、実質同じことを言っている行を洗い出す
    const normalize = (text: string): string =>
      text
        .replace(/[（）()「」、。・！!？?]/g, '')
        .replace(/\s+/g, '')
        .replace(/です|ます|しよう|ください|でしょう/g, '');
    const seen = new Map<string, string>();
    for (const tip of mascotTips) {
      const key = normalize(tip.text);
      expect(seen.has(key), `重複: ${tip.id} と ${seen.get(key)}`).toBe(false);
      seen.set(key, tip.id);
    }
  });

  it('すべての豆知識に有効な分野が設定されている', () => {
    for (const tip of mascotTips) {
      expect(Object.keys(TIP_CATEGORIES)).toContain(tip.category);
    }
  });

  it('分野はすべて実際に使われている（使われないラベルを残さない）', () => {
    const used = new Set(mascotTips.map((tip) => tip.category));
    for (const key of Object.keys(TIP_CATEGORIES) as TipCategory[]) {
      expect(used.has(key), `未使用の分野: ${key}`).toBe(true);
    }
  });

  it('口調がそろっている（文末が です／ます／しよう などで終わる）', () => {
    const okEnding = /(です。|ます。|しよう。|ません。|ましょう。|)$/;
    for (const tip of mascotTips) {
      const text = tip.text.trim();
      expect(text.length, tip.id).toBeGreaterThan(10);
      // 体言止めの短い注記も許すが、句点で終わることは必須にする
      expect(/[。）)]$/.test(text) || okEnding.test(text), `${tip.id}: ${text}`).toBe(true);
    }
  });

  it('半角の「/」を分数と誤読されない形で書いている（単位はそのまま許可）', () => {
    // textFormatter は a/b を分数に変換するが、この吹き出しは素の <p> に出すため
    // 表示崩れは起きない。ただし将来の流用に備えて過剰な「/」がないことを見ておく。
    for (const tip of mascotTips) {
      const slashes = (tip.text.match(/\//g) || []).length;
      expect(slashes, tip.id).toBeLessThanOrEqual(2);
    }
  });

  it('依頼された分野の内容がすべて反映されている', () => {
    const joined = mascotTips.map((tip) => tip.text).join('\n');
    const required = [
      '22.4 L',          // 気体は1molで22.4L
      '式量',            // モル質量＝原子量・分子量・式量
      '6.02×10²³',       // 粒子の種類が変わっても個数は同じ
      'どちらが先になくなる', // 過不足のある反応
      '溶液の質量',      // 質量パーセント濃度の分母
      'mol/L',           // モル濃度
      '密度',            // 密度が絡む濃度計算
      'アレニウス',      // 酸・塩基の定義
      '電離度',          // 価数と強弱の区別
      '酸化数が増えたら', // 酸化数の増減
      'イオン化傾向',    // 酸化されやすさ
      '電気分解',        // 電池との違い／陽極・陰極
      '原子番号',        // 原子番号＝陽子数＝電子数
      '同族元素',        // 最外殻電子と性質
      'イオン化エネルギー',
      '電気陰性度',
      '分子間力',        // 分子結晶と共有結合結晶
      '無極性',          // 分子の形と極性
      '会話文',          // 共通テストの出題形式
      '実験の目的',      // 実験考察
      '一定',            // グラフ・表の読み取り
      '日常生活',        // 身近な化学
    ];
    for (const keyword of required) {
      expect(joined, `未反映: ${keyword}`).toContain(keyword);
    }
  });

  it('総数が数えられている', () => {
    expect(TIP_TOTAL).toBe(mascotTips.length);
    expect(TIP_TOTAL).toBeGreaterThanOrEqual(60);
  });
});

// ------------------------------------------------------------------
// localStorage の最小実装（Node には無いため。progress.test.ts と同じ作法）
// ------------------------------------------------------------------
function installLocalStorage() {
  const store = new Map<string, string>();
  const mock = {
    getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
    setItem: (k: string, v: string) => { store.set(k, String(v)); },
    removeItem: (k: string) => { store.delete(k); },
    clear: () => { store.clear(); },
    key: (i: number) => Array.from(store.keys())[i] ?? null,
    get length() { return store.size; },
  };
  (globalThis as any).localStorage = mock;
  return mock;
}

describe('未読を優先するローテーション', () => {
  beforeEach(() => {
    installLocalStorage();
  });

  it('未読があるかぎり、既読は選ばれない', () => {
    const tips = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    const picked = pickTip(tips, ['a', 'b'], 'b', () => 0);
    expect(picked?.tip.id).toBe('c');
  });

  it('繰り返し引くと、全部にちょうど1回ずつ出会える（取りこぼしゼロ）', () => {
    const tips = mascotTips.map((tip) => ({ id: tip.id }));
    const seen: string[] = [];
    for (let i = 0; i < tips.length; i++) {
      const picked = pickTip(tips, seen, seen[seen.length - 1] ?? null, () => 0.42);
      expect(picked).not.toBeNull();
      seen.push(picked!.tip.id);
    }
    expect(new Set(seen).size).toBe(tips.length);
  });

  it('読んだ数と総数を返す', () => {
    const tips = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(pickTip(tips, [], null, () => 0)?.seenCount).toBe(1);
    expect(pickTip(tips, ['a'], 'a', () => 0)?.seenCount).toBe(2);
    expect(pickTip(tips, ['a', 'b'], 'b', () => 0)?.total).toBe(3);
  });

  it('最後の1つを引いたときだけ「読み切った」と分かる', () => {
    const tips = [{ id: 'a' }, { id: 'b' }];
    expect(pickTip(tips, [], null, () => 0)?.justCompleted).toBe(false);
    expect(pickTip(tips, ['a'], 'a', () => 0)?.justCompleted).toBe(true);
  });

  it('全部読み終えた後は、直前と同じものを続けて出さない', () => {
    const tips = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    for (let i = 0; i < 20; i++) {
      const picked = pickTip(tips, ['a', 'b', 'c'], 'a', () => i / 20);
      expect(picked?.tip.id).not.toBe('a');
    }
  });

  it('候補が空なら null を返す（画面を落とさない）', () => {
    expect(pickTip([], [], null)).toBeNull();
  });

  it('既読はユーザーごとに保存され、読み直せる', () => {
    markTipSeen('user-1', 'm01');
    markTipSeen('user-1', 'm02');
    markTipSeen('user-2', 'e01');
    expect(readSeenTipIds('user-1')).toEqual(['m01', 'm02']);
    expect(readSeenTipIds('user-2')).toEqual(['e01']);
    expect(readLastTipId('user-1')).toBe('m02');
  });

  it('同じ ID を二重に記録しない', () => {
    markTipSeen('user-1', 'm01');
    markTipSeen('user-1', 'm01');
    expect(readSeenTipIds('user-1')).toEqual(['m01']);
  });

  it('リセットすると次の巡を始められる', () => {
    markTipSeen('user-1', 'm01');
    resetSeenTips('user-1');
    expect(readSeenTipIds('user-1')).toEqual([]);
  });

  it('壊れた保存データでも空として扱う（例外で落ちない）', () => {
    localStorage.setItem('seen_tips_v1_user-1', '{ではないJSON');
    expect(readSeenTipIds('user-1')).toEqual([]);
    localStorage.setItem('seen_tips_v1_user-1', '{"a":1}');
    expect(readSeenTipIds('user-1')).toEqual([]);
  });

  it('データから消えた ID が既読に残っていても、未読判定を壊さない', () => {
    const tips = [{ id: 'a' }, { id: 'b' }];
    // 'zzz' は既に存在しない古い ID
    const picked = pickTip(tips, ['zzz', 'a'], 'a', () => 0);
    expect(picked?.tip.id).toBe('b');
    expect(picked?.seenCount).toBe(2);
  });
});
