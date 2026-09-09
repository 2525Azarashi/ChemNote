import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BattleRaceTrack, buildLane, currentStreak, leadLabel } from '../src/battle/ui/BattleRaceTrack';
import type { BattlePlayerScore, BattleQuestionScore } from '../src/battle/core/types';

/**
 * ===================================================================
 * 対戦中の「相手の位置・点差・連続正解」表示
 * ===================================================================
 *
 * ご指摘（原文）：
 *   > 今、相手がどれぐらいの問題の位置にいるかって言うのも消えてない？
 *   > なんか色々バトル画面も消えてるので、もっと面白みが出るようにしてほしい。
 *
 * ■ この検査が守ること
 *   ① レースのマスが「終わった問＝○×／いまの問＝答えた・まだ／先＝空」になる
 *   ② ★答え合わせ前（reveal=false）は、いまの問の ○× を絶対に出さない★
 *      出すと相手の正誤から自分の答えを変えられる（不正の手がかり）。
 *   ③ 点差の一言は 3 通り（リード／おくれ／同点）で、数字は差だけ
 *   ④ 点差も reveal 前はいまの問を含めない（同じ理由）
 *   ⑤ 連続正解は 3 以上で炎が出る（scoring の STREAK_THRESHOLD と同じ）
 *   ⑥ online / AI の両方の画面に組み込まれている
 */

const q = (index: number, correct: boolean, total = correct ? 100 : 0): BattleQuestionScore =>
  ({ index, correct, timeUsed: 5, base: correct ? 100 : 0, speed: 0, streak: 0, total }) as BattleQuestionScore;

const player = (per: BattleQuestionScore[]): BattlePlayerScore => ({
  uid: 'u', perQuestion: per, score: per.reduce((a, p) => a + p.total, 0),
  correctCount: per.filter((p) => p.correct).length, totalTime: 0, maxStreak: 0,
});

describe('① ② レースのマス', () => {
  it('終わった問は ○×、いまの問は 答えた／まだ、先は空', () => {
    const me = player([q(0, true), q(1, false)]);
    // 3問目（index 2）を解いている途中、まだ答えていない、答え合わせ前
    expect(buildLane(me, 5, 2, false, false)).toEqual(['correct', 'wrong', 'current', 'pending', 'pending']);
    // 答えた（でも答え合わせ前）
    expect(buildLane(me, 5, 2, true, false)).toEqual(['correct', 'wrong', 'answered', 'pending', 'pending']);
  });

  it('★reveal 前は、いまの問の正誤を出さない★（perQuestion に正誤があっても）', () => {
    // 採点関数はいまの問の正誤も計算済みで perQuestion に入っている。
    // それでも画面には出さないのがこの部品の責務。
    const me = player([q(0, true), q(1, true), q(2, true)]);
    const lane = buildLane(me, 5, 2, true, false);
    expect(lane[2]).toBe('answered');
    expect(lane[2]).not.toBe('correct');
  });

  it('reveal 後はいまの問の ○× が出る', () => {
    const me = player([q(0, true), q(1, true), q(2, false)]);
    expect(buildLane(me, 5, 2, true, true)[2]).toBe('wrong');
  });

  it('採点が無い（相手が未接続など）ときは全部 空／いま', () => {
    expect(buildLane(null, 3, 0, false, false)).toEqual(['current', 'pending', 'pending']);
    // 終わった問で採点が無いのは「無回答＝不正解」
    expect(buildLane(null, 3, 1, false, false)[0]).toBe('wrong');
  });
});

describe('③ 点差の一言', () => {
  it('リード／おくれ／同点 の 3 通りで、数字は差だけ', () => {
    expect(leadLabel(150, 100)).toEqual({ text: '50 点リード', tone: 'lead' });
    expect(leadLabel(100, 180)).toEqual({ text: '80 点おくれ', tone: 'behind' });
    expect(leadLabel(120, 120)).toEqual({ text: '同点！', tone: 'even' });
  });
});

describe('⑤ 連続正解', () => {
  it('直近から数えて、途切れたら止まる', () => {
    const me = player([q(0, true), q(1, false), q(2, true), q(3, true), q(4, true)]);
    expect(currentStreak(me, 4)).toBe(3);
    expect(currentStreak(me, 1)).toBe(0);
    expect(currentStreak(me, 0)).toBe(1);
    expect(currentStreak(null, 4)).toBe(0);
  });
});

describe('描画（online / AI 共通の部品）', () => {
  const render = (over: Partial<Parameters<typeof BattleRaceTrack>[0]> = {}) =>
    renderToStaticMarkup(React.createElement(BattleRaceTrack, {
      total: 5, current: 2,
      me: player([q(0, true), q(1, true), q(2, true)]),
      opponent: player([q(0, true), q(1, false), q(2, true)]),
      meAnswered: true, opponentAnswered: true, reveal: false,
      ...over,
    }));

  it('④ reveal 前の点差はいまの問を含めない（100 vs 100 → 同点）', () => {
    // 両者とも 3 問目を正解しているが、答え合わせ前なので 2 問目までで比べる
    const html = render({ reveal: false });
    expect(html).toContain('data-battle-lead="lead"'); // 2問目まで: 200 vs 100
    expect(html).toContain('100 点リード');
  });

  it('reveal 後はいまの問を含める', () => {
    const html = render({ reveal: true });
    expect(html).toContain('100 点リード'); // 300 vs 200
  });

  it('⑤ 3 連続以上で炎が出る（reveal 後）', () => {
    const html = render({ reveal: true });
    expect(html).toContain('data-battle-streak="3"');
    expect(html).toContain('3連続');
    expect(html).toContain('lucide-flame');
  });

  it('何問目かが出る', () => {
    expect(render()).toContain('3 / 5 問目');
  });

  it('⑥ online / AI の両方の対戦中画面に組み込まれている', () => {
    for (const f of ['BattleRoomScreen', 'BattleAiRoomScreen']) {
      const src = readFileSync(`src/battle/ui/${f}.tsx`, 'utf8');
      expect(src, `★${f} にレース表示がありません★`).toContain('<BattleRaceTrack');
      // reveal を渡している（答え合わせ前に正誤を漏らさない）
      expect(src).toMatch(/<BattleRaceTrack[\s\S]*?reveal=\{reveal\}/u);
    }
  });
});
