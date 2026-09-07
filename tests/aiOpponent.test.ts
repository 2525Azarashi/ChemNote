/**
 * AI 対戦相手の強さが、プリセットの数値どおりに出ているかを確かめる。
 *
 * ★「よわい AI は本当に弱いか」を数値で見る★
 * 正解率は乱数で決まるので、1問では判定できない。
 * 同じ強さで 400 問ぶん行動させ、正解率が accuracy ±8pt に収まることを見る。
 */
import { describe, expect, it } from 'vitest';
import {
  AI_LEVELS,
  aiAnswerRecord,
  aiProfileOf,
  decideAiMove,
} from '../src/battle/core/aiOpponent';
import { isBattleAnswerCorrect, NO_ANSWER } from '../src/battle/core/battleCore';
import type { BattleQuestion } from '../src/battle/core/types';

function choiceQuestion(i: number, answerIndex = i % 4): BattleQuestion {
  return {
    id: `q${i}`,
    subject: 'chemistry_basic',
    chapterId: 'c1',
    problemId: 'p1',
    subQuestionId: `s${i}`,
    format: 'choice4',
    prompt: '次のうち、単体はどれか。'.repeat(1 + (i % 3)),
    label: '',
    options: ['水', '酸素', '食塩水', '空気'],
    answerIndex,
    panelOrder: [],
    timeLimit: 15,
  };
}

function kanaQuestion(i: number): BattleQuestion {
  return {
    ...choiceQuestion(i),
    id: `k${i}`,
    format: 'kana',
    options: [],
    answerIndex: -1,
    // 「ダイヤモンド」相当の 6 キー（値は到達可能な範囲であれば何でもよい）
    panelOrder: [57, 1, 35, 66, 24, 61],
    timeLimit: 20,
  };
}

describe('AI 対戦相手', () => {
  it('同じ種・同じ問題なら毎回同じ行動をする（決定論）', () => {
    const p = aiProfileOf('normal');
    const q = choiceQuestion(3);
    const a = decideAiMove(p, q, 15, 'room-1', 3);
    const b = decideAiMove(p, q, 15, 'room-1', 3);
    expect(a).toEqual(b);
    // 種が変われば変わりうる（少なくとも遅延は違う）
    const c = decideAiMove(p, q, 15, 'room-2', 3);
    expect(c.delayMs === a.delayMs && c.correct === a.correct).toBe(false);
  });

  it('正解率がプリセットの accuracy に収まる（選択式）', () => {
    for (const level of AI_LEVELS) {
      const p = aiProfileOf(level);
      let hit = 0;
      const N = 400;
      for (let i = 0; i < N; i += 1) {
        const q = choiceQuestion(i);
        const move = decideAiMove(p, q, 15, `seed-${level}`, i);
        const rec = aiAnswerRecord(i, move, 0);
        const ok = isBattleAnswerCorrect(q, rec ?? undefined);
        // move.correct と実際の正誤が一致していること
        expect(ok).toBe(move.correct);
        if (ok) hit += 1;
      }
      const rate = hit / N;
      expect(Math.abs(rate - p.accuracy)).toBeLessThan(0.08);
    }
  });

  it('強い AI ほど正解率が高く、速い', () => {
    const rates: number[] = [];
    const delays: number[] = [];
    for (const level of AI_LEVELS) {
      const p = aiProfileOf(level);
      let hit = 0;
      let sumDelay = 0;
      const N = 300;
      for (let i = 0; i < N; i += 1) {
        const q = choiceQuestion(i);
        const move = decideAiMove(p, q, 15, 'seed-x', i);
        if (move.correct) hit += 1;
        sumDelay += move.delayMs;
      }
      rates.push(hit / N);
      delays.push(sumDelay / N);
    }
    for (let i = 1; i < rates.length; i += 1) {
      expect(rates[i]).toBeGreaterThan(rates[i - 1] as number);
      expect(delays[i]).toBeLessThan(delays[i - 1] as number);
    }
  });

  it('解答時刻は制限時間内に収まり、読む時間より前には答えない', () => {
    const p = aiProfileOf('expert');
    const q = { ...choiceQuestion(0), prompt: 'あ'.repeat(240) }; // 長文
    for (let i = 0; i < 50; i += 1) {
      const move = decideAiMove(p, q, 15, 'seed-long', i);
      expect(move.delayMs).toBeLessThanOrEqual(15 * 1000 * 0.92 + 1);
      // 240文字 / 12 = 20秒 だが制限が15秒なので上限で打ち切られる
      expect(move.delayMs).toBeGreaterThanOrEqual(15 * 1000 * 0.9);
    }
    const short = choiceQuestion(0);
    for (let i = 0; i < 50; i += 1) {
      const move = decideAiMove(p, short, 15, 'seed-short', i);
      expect(move.delayMs).toBeGreaterThan(600);
    }
  });

  it('かな入力では正解率が下がり、間違いは「惜しい間違い」になる', () => {
    const p = aiProfileOf('hard');
    let hit = 0;
    const N = 300;
    for (let i = 0; i < N; i += 1) {
      const q = kanaQuestion(i);
      const move = decideAiMove(p, q, 20, 'seed-kana', i);
      const rec = aiAnswerRecord(i, move, 0);
      expect(rec).not.toBeNull();
      expect(rec!.choice).toBe(NO_ANSWER);
      expect(rec!.panel.length).toBe(q.panelOrder.length);
      const ok = isBattleAnswerCorrect(q, rec!);
      expect(ok).toBe(move.correct);
      if (!ok) {
        // ちょうど1文字だけ違う
        const diff = rec!.panel.filter((k, idx) => k !== q.panelOrder[idx]).length;
        expect(diff).toBe(1);
      }
      if (ok) hit += 1;
    }
    const rate = hit / N;
    expect(rate).toBeLessThan(p.accuracy);
    expect(Math.abs(rate - p.accuracy * p.kanaPenalty)).toBeLessThan(0.08);
  });

  it('誤答の選択肢は正解と一致しない', () => {
    const p = aiProfileOf('easy');
    for (let i = 0; i < 200; i += 1) {
      const q = choiceQuestion(i, 2);
      const move = decideAiMove(p, q, 15, 'seed-wrong', i);
      if (!move.correct) {
        expect(move.answer?.choice).not.toBe(2);
        expect(move.answer?.choice).toBeGreaterThanOrEqual(0);
        expect(move.answer?.choice).toBeLessThan(4);
      }
    }
  });
});
