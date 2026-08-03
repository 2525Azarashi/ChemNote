import { describe, it, expect } from 'vitest';

import {
  QUALIFY_LINE,
  computeLiveStanding,
  overtakeMessage,
  qualifyLineFor,
  rankDelta,
  type LadderEntry,
} from '../src/utils/liveRank';

/**
 * ===================================================================
 * ライブ順位の回帰テスト
 * ===================================================================
 * ここで守りたいのは「順位表示が嘘をつかないこと」。
 * 解答中にずっと出る数字なので、1回でも不正確だと信用を失い、
 * 臨場感どころか妨害になる。境界（同点・自分だけ・最下位）を厚めに検査する。
 */

const ladder = (...rows: [string, string, number][]): LadderEntry[] =>
  rows.map(([uid, nickname, score]) => ({ uid, nickname, score }));

describe('computeLiveStanding：暫定順位', () => {
  it('自分より高い人数 + 1 が順位になる', () => {
    const s = computeLiveStanding(
      ladder(['a', 'Aさん', 900], ['b', 'Bさん', 700], ['c', 'Cさん', 300]),
      'me',
      500,
    );
    expect(s.rank).toBe(3);
    expect(s.total).toBe(4); // 他3人 + 自分
    expect(s.score).toBe(500);
  });

  it('同点は上位として扱う（競技の慣習に合わせる）', () => {
    const s = computeLiveStanding(ladder(['a', 'Aさん', 500]), 'me', 500);
    // 相手は「自分より高い」ではないので、自分が1位
    expect(s.rank).toBe(1);
  });

  it('自分の過去ベストは二重に並べない（同一 uid を除外する）', () => {
    const s = computeLiveStanding(
      ladder(['me', '自分の過去ベスト', 2000], ['a', 'Aさん', 100]),
      'me',
      500,
    );
    // 過去ベスト2000が残っていれば2位になってしまう。除外されているので1位。
    expect(s.rank).toBe(1);
    expect(s.total).toBe(2);
  });

  it('参加者が自分だけなら1位・1人', () => {
    const s = computeLiveStanding([], 'me', 0);
    expect(s.rank).toBe(1);
    expect(s.total).toBe(1);
    expect(s.nextTarget).toBeNull();
    expect(s.pursuerGap).toBeNull();
  });

  it('ladder が null/undefined でも落ちない', () => {
    expect(computeLiveStanding(null as any, 'me', 10).rank).toBe(1);
    expect(computeLiveStanding(undefined as any, 'me', 10).total).toBe(1);
  });
});

describe('computeLiveStanding：すぐ上の相手（追う目標）', () => {
  it('自分より上の中で最もスコアが低い人が目標になる', () => {
    const s = computeLiveStanding(
      ladder(['a', 'Aさん', 2000], ['b', 'Bさん', 620], ['c', 'Cさん', 1500]),
      'me',
      600,
    );
    expect(s.nextTarget?.nickname).toBe('Bさん');
  });

  it('追い抜くのに必要な点は「差 + 1」（同点では抜けないため）', () => {
    const s = computeLiveStanding(ladder(['b', 'Bさん', 620]), 'me', 600);
    expect(s.nextTarget?.gap).toBe(21);
  });

  it('目標との差が0以下にはならない（最低1点）', () => {
    const s = computeLiveStanding(ladder(['b', 'Bさん', 600]), 'me', 599);
    expect(s.nextTarget?.gap).toBeGreaterThanOrEqual(1);
  });

  it('首位のときは目標が null', () => {
    const s = computeLiveStanding(ladder(['a', 'Aさん', 10]), 'me', 999);
    expect(s.rank).toBe(1);
    expect(s.nextTarget).toBeNull();
  });
});

describe('computeLiveStanding：すぐ下の相手（詰められている距離）', () => {
  it('自分以下の中で最も高い人との差になる', () => {
    const s = computeLiveStanding(
      ladder(['a', 'Aさん', 900], ['b', 'Bさん', 480], ['c', 'Cさん', 100]),
      'me',
      500,
    );
    expect(s.pursuerGap).toBe(20);
  });

  it('最下位なら追われていない（null）', () => {
    const s = computeLiveStanding(ladder(['a', 'Aさん', 900]), 'me', 10);
    expect(s.pursuerGap).toBeNull();
  });

  it('負の値にはならない', () => {
    const s = computeLiveStanding(ladder(['a', 'Aさん', 500]), 'me', 500);
    expect(s.pursuerGap).toBeGreaterThanOrEqual(0);
  });
});

describe('qualifyLineFor：進出ライン', () => {
  it('3人以下では線を引かない（全員圏内では意味がない）', () => {
    expect(qualifyLineFor(0)).toBeNull();
    expect(qualifyLineFor(3)).toBeNull();
  });

  it('少人数では上位半分に寄せる', () => {
    expect(qualifyLineFor(4)).toBe(2);
    expect(qualifyLineFor(6)).toBe(3);
  });

  it('人数が増えても上限を超えない', () => {
    expect(qualifyLineFor(1000)).toBe(QUALIFY_LINE);
  });

  it('ラインは必ず参加人数より小さい（全員が圏内にならない）', () => {
    for (let total = 4; total <= 60; total += 1) {
      const line = qualifyLineFor(total);
      expect(line).not.toBeNull();
      expect(line as number).toBeLessThan(total);
      expect(line as number).toBeGreaterThanOrEqual(2);
    }
  });
});

describe('rankDelta / overtakeMessage：順位変動の言語化', () => {
  it('順位が上がると正の数（小さい数字が上位なので符号を反転する）', () => {
    expect(rankDelta(7, 5)).toBe(2);
  });

  it('順位が下がると負の数', () => {
    expect(rankDelta(5, 7)).toBe(-2);
  });

  it('初回（前の順位がない）は0扱いで演出を出さない', () => {
    expect(rankDelta(null, 3)).toBe(0);
    expect(rankDelta(undefined, 3)).toBe(0);
  });

  it('抜いたときだけメッセージが出る', () => {
    expect(overtakeMessage(7, 5)).toBe('2人抜き！ 7位 → 5位');
    expect(overtakeMessage(5, 5)).toBeNull();
    expect(overtakeMessage(5, 7)).toBeNull();
  });

  it('1位になったときは専用の文になる', () => {
    expect(overtakeMessage(3, 1)).toBe('首位に立った！');
  });
});
