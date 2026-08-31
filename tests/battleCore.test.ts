/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * ===================================================================
 * 対戦モード — 採点・判定・抽選の純粋ロジックのテスト
 * ===================================================================
 *
 * ■ なぜこのファイルが必要か
 *
 *   対戦の点数は Firestore に保存しない。
 *   保存するのは「何番を押したか」と「いつ押したか（サーバー時刻）」だけで、
 *   点数は両者の端末が src/battle/core/battleCore.ts で計算し直す。
 *
 *   つまり ★このファイルの関数が両者で同じ答えを出すこと★ が
 *   対戦の成立条件そのものである。ここがズレると
 *     ・両者の申告が食い違って毎回「無効試合」になる
 *     ・レートが動かず、対戦モードが機能しなくなる
 *   という形で壊れる。壊れ方が「エラーではなく静かな不成立」なので、
 *   テストで固定しておかないと気づけない。
 *
 * ■ このテストが実際に見つけた不具合（記録として残す）
 *
 *   1. answeredAt が Firestore の Timestamp オブジェクトで来るのに、
 *      採点側が `typeof answeredAt === 'number'` だけを見ていた。
 *      条件が常に false になり ★速さボーナスが常に0★ になっていた。
 *      型定義が unknown（Firestore の値をそのまま持つ）なので
 *      TypeScript では検出できなかった。
 *
 *   2. scoreBattlePlayer の questionStarts が配列型なのに、
 *      呼び出し側（useBattleRoom）が Map を渡していた。
 *      `questionStarts[i]` が常に undefined になり、
 *      こちらも ★速さボーナスが常に0★ になっていた。
 *
 *   どちらも「動くが点が入らない」種類の壊れ方で、
 *   画面を見ただけでは気づけない。以下のテストで両方を固定する。
 */

import { describe, expect, it } from 'vitest';
import {
  FORFEIT_RATING_RATIO,
  NO_ANSWER,
  RATING_FLOOR,
  RATING_INITIAL,
  RATING_K,
  FORFEIT_STREAK,
  SPEED_GRANULARITY_MS,
  STREAK_CAP,
  STREAK_THRESHOLD,
  answeredAtMillis,
  buildQuestionOrder,
  createRandom,
  hasLeft,
  hashString,
  isBattleAnswerCorrect,
  judgeBattle,
  nextRating,
  pickRandom,
  resolveTimeLimit,
  scoreBattlePlayer,
  scoreBattleQuestion,
  trailingNoAnswerCount,
  winProbabilityPercent,
} from '../src/battle/core/battleCore';
import { BATTLE_RULES, defaultRuleOf, normalizeRule } from '../src/battle/core/battleRules';
// 回答キー（q0, q1 …）の変換関数。
// 保存形式を配列からマップへ変えたときに追加したもので、
// 両者の端末で同じ解釈にならないと採点がずれるため、ここでも直接試験する。
import { answerIndexOf, answerKeyOf } from '../src/battle/core/types';
import type {
  BattleAnswerRecord,
  BattleQuestion,
  BattleRule,
} from '../src/battle/core/types';

// ============================================================
// テスト用の材料
// ============================================================

const RULE: BattleRule = defaultRuleOf('chemistry_basic');

function choiceQuestion(over: Partial<BattleQuestion> = {}): BattleQuestion {
  return {
    id: 'q:test:1',
    subject: 'chemistry_basic',
    chapterId: 'c1_1',
    problemId: 'p1',
    subQuestionId: 's1',
    format: 'choice4',
    prompt: 'テスト問題',
    label: '',
    options: ['ア', 'イ', 'ウ', 'エ'],
    answerIndex: 2,
    panelOrder: [],
    timeLimit: 20,
    ...over,
  };
}

function panelQuestion(over: Partial<BattleQuestion> = {}): BattleQuestion {
  return choiceQuestion({
    id: 'p:test:1',
    format: 'panel',
    options: ['素', '水', '酸', '化'],
    answerIndex: -1,
    panelOrder: [2, 3],
    ...over,
  });
}

function record(over: Partial<BattleAnswerRecord> = {}): BattleAnswerRecord {
  return {
    index: 0,
    choice: NO_ANSWER,
    panel: [],
    answeredAt: null,
    ...over,
  };
}

/** Firestore の Timestamp を真似たもの（firebase を import せずに再現する） */
function fakeTimestamp(millis: number) {
  return {
    seconds: Math.floor(millis / 1000),
    nanoseconds: (millis % 1000) * 1e6,
    toMillis: () => millis,
  };
}

// ============================================================
// answeredAt の取り出し
// ============================================================

describe('answeredAtMillis — 回答時刻の取り出し', () => {
  it('素の数値をそのまま返す（テストや将来の実装のため）', () => {
    expect(answeredAtMillis(1700000000000)).toBe(1700000000000);
  });

  it('★Firestore の Timestamp（toMillis を持つ）を受け取れる★', () => {
    // ここが false になると速さボーナスが常に0になる。
    expect(answeredAtMillis(fakeTimestamp(1700000000123))).toBe(1700000000123);
  });

  it('toMillis が無く seconds だけある形も受け取れる', () => {
    expect(answeredAtMillis({ seconds: 1700000000, nanoseconds: 0 })).toBe(1700000000000);
  });

  it('未確定（null / undefined）は null を返す', () => {
    expect(answeredAtMillis(null)).toBeNull();
    expect(answeredAtMillis(undefined)).toBeNull();
  });

  it('壊れた値でも例外を投げない', () => {
    expect(answeredAtMillis('いつか')).toBeNull();
    expect(answeredAtMillis(Number.NaN)).toBeNull();
    expect(answeredAtMillis({})).toBeNull();
  });
});

// ============================================================
// 正誤判定
// ============================================================

describe('isBattleAnswerCorrect — 正誤判定', () => {
  it('4択: 正解の番号と一致すれば正解', () => {
    const q = choiceQuestion();
    expect(isBattleAnswerCorrect(q, record({ choice: 2 }))).toBe(true);
    expect(isBattleAnswerCorrect(q, record({ choice: 0 }))).toBe(false);
  });

  it('4択: 無回答（-1）は誤答あつかい', () => {
    expect(isBattleAnswerCorrect(choiceQuestion(), record({ choice: NO_ANSWER }))).toBe(false);
  });

  it('回答が存在しない（undefined）なら誤答', () => {
    expect(isBattleAnswerCorrect(choiceQuestion(), undefined)).toBe(false);
  });

  it('パネル: 押した順が完全一致したときだけ正解', () => {
    const q = panelQuestion(); // 正解の押し順 [2,3]
    expect(isBattleAnswerCorrect(q, record({ panel: [2, 3] }))).toBe(true);
    // ★順番が逆なら誤答★（「酸化」と「化酸」は別語）
    expect(isBattleAnswerCorrect(q, record({ panel: [3, 2] }))).toBe(false);
    // 文字数が足りない／多い
    expect(isBattleAnswerCorrect(q, record({ panel: [2] }))).toBe(false);
    expect(isBattleAnswerCorrect(q, record({ panel: [2, 3, 0] }))).toBe(false);
  });

  it('パネル: choice の値は無視される（形式ごとに見る場所を分ける）', () => {
    const q = panelQuestion();
    // choice に正解らしい値が入っていても、panel が違えば誤答
    expect(isBattleAnswerCorrect(q, record({ choice: 2, panel: [] }))).toBe(false);
  });
});

// ============================================================
// 制限時間
// ============================================================

describe('resolveTimeLimit — 制限時間', () => {
  it('既定では問題ごとの秒数を使う', () => {
    expect(resolveTimeLimit(choiceQuestion({ timeLimit: 17 }), RULE)).toBe(17);
  });

  it('rules.timeLimitOverride があればそれで固定される', () => {
    const rule: BattleRule = { ...RULE, timeLimitOverride: 12 };
    expect(resolveTimeLimit(choiceQuestion({ timeLimit: 30 }), rule)).toBe(12);
  });

  it('override が 0 や null のときは問題ごとの秒数に戻る', () => {
    expect(resolveTimeLimit(choiceQuestion({ timeLimit: 25 }), { ...RULE, timeLimitOverride: 0 })).toBe(25);
    expect(resolveTimeLimit(choiceQuestion({ timeLimit: 25 }), { ...RULE, timeLimitOverride: null })).toBe(25);
  });
});

// ============================================================
// 1問の採点
// ============================================================

describe('scoreBattleQuestion — 1問の採点', () => {
  const START = 1_700_000_000_000;

  it('誤答は0点（減点しない）', () => {
    const s = scoreBattleQuestion(
      choiceQuestion(),
      record({ choice: 0, answeredAt: fakeTimestamp(START + 1000) }),
      RULE,
      0,
      START,
    );
    expect(s.correct).toBe(false);
    expect(s.total).toBe(0);
    expect(s.base).toBe(0);
    expect(s.speed).toBe(0);
  });

  it('無回答も0点（挑戦した方が損をしない設計）', () => {
    const s = scoreBattleQuestion(choiceQuestion(), undefined, RULE, 0, START);
    expect(s.total).toBe(0);
  });

  it('★正解を早く答えるほど速さ点が高い★', () => {
    const q = choiceQuestion({ timeLimit: 20 });
    const fast = scoreBattleQuestion(
      q,
      record({ choice: 2, answeredAt: fakeTimestamp(START + 2000) }),
      RULE,
      0,
      START,
    );
    const slow = scoreBattleQuestion(
      q,
      record({ choice: 2, answeredAt: fakeTimestamp(START + 18000) }),
      RULE,
      0,
      START,
    );

    expect(fast.correct).toBe(true);
    expect(slow.correct).toBe(true);
    expect(fast.base).toBe(RULE.pointsCorrect);
    expect(slow.base).toBe(RULE.pointsCorrect);
    // ここが 0 === 0 になっていたのが実際の不具合だった
    expect(fast.speed).toBeGreaterThan(0);
    expect(fast.speed).toBeGreaterThan(slow.speed);
    expect(fast.speed).toBeLessThanOrEqual(RULE.pointsSpeedMax);
  });

  it('★通信のゆらぎ程度の差では点差がつかない（粒度500ms）★', () => {
    const q = choiceQuestion({ timeLimit: 20 });
    // 切り下げは「残り時間」に対してかかる。制限20秒＝20000msなので、
    // バケツの境目は使った時間が 500ms の倍数の位置にくる。
    // 3100ms と 3400ms は同じバケツ（残り16900→16500 / 残り16600→16500）。
    const a = scoreBattleQuestion(
      q,
      record({ choice: 2, answeredAt: fakeTimestamp(START + 3100) }),
      RULE,
      0,
      START,
    );
    const b = scoreBattleQuestion(
      q,
      record({ choice: 2, answeredAt: fakeTimestamp(START + 3400) }),
      RULE,
      0,
      START,
    );
    expect(a.speed).toBe(b.speed);
    expect(a.speed).toBeGreaterThan(0);

    // 逆に、バケツをまたぐ差（境目の 3000ms を挟む）ではきちんと差がつく。
    // ＝粒度が「全部同じ点」になって速さ点が死んでいるのではないことの確認。
    const c = scoreBattleQuestion(
      q,
      record({ choice: 2, answeredAt: fakeTimestamp(START + 3000) }),
      RULE,
      0,
      START,
    );
    expect(c.speed).toBeGreaterThan(a.speed);
    // ゆらぎの幅は粒度1個ぶんまで（大差にはならない）
    expect(c.speed - a.speed).toBeLessThanOrEqual(
      Math.ceil((RULE.pointsSpeedMax * SPEED_GRANULARITY_MS) / (20 * 1000)) + 1,
    );
  });

  it('開始時刻が不明（0）なら速さ点は0にする（推測しない）', () => {
    const s = scoreBattleQuestion(
      choiceQuestion({ timeLimit: 20 }),
      record({ choice: 2, answeredAt: fakeTimestamp(START + 1000) }),
      RULE,
      0,
      0, // 記録できていない
    );
    expect(s.correct).toBe(true);
    expect(s.base).toBe(RULE.pointsCorrect);
    expect(s.speed).toBe(0);
  });

  it('締切を超えた時刻でも速さ点はマイナスにならない', () => {
    const s = scoreBattleQuestion(
      choiceQuestion({ timeLimit: 20 }),
      record({ choice: 2, answeredAt: fakeTimestamp(START + 999_000) }),
      RULE,
      0,
      START,
    );
    expect(s.speed).toBe(0);
    expect(s.total).toBe(RULE.pointsCorrect);
  });

  it('連続正解ボーナスは3連続目から付く', () => {
    const q = choiceQuestion();
    const rec = record({ choice: 2, answeredAt: fakeTimestamp(START + 1000) });
    // runningStreak は「この問題より前の連続数」
    expect(scoreBattleQuestion(q, rec, RULE, 0, START).streak).toBe(0); // 1連続目
    expect(scoreBattleQuestion(q, rec, RULE, 1, START).streak).toBe(0); // 2連続目
    expect(scoreBattleQuestion(q, rec, RULE, STREAK_THRESHOLD - 1, START).streak).toBeGreaterThan(0);
  });

  it('連続正解ボーナスには上限がある（無限には伸びない）', () => {
    const q = choiceQuestion();
    const rec = record({ choice: 2, answeredAt: fakeTimestamp(START + 1000) });
    const atCap = scoreBattleQuestion(q, rec, RULE, STREAK_CAP - 1, START).streak;
    const beyond = scoreBattleQuestion(q, rec, RULE, STREAK_CAP + 20, START).streak;
    expect(beyond).toBe(atCap);
  });
});

// ============================================================
// 試合全体の採点
// ============================================================

describe('scoreBattlePlayer — 試合全体の採点', () => {
  const START = 1_700_000_000_000;
  const questions = [
    choiceQuestion({ id: 'q1', timeLimit: 20 }),
    choiceQuestion({ id: 'q2', timeLimit: 20 }),
    choiceQuestion({ id: 'q3', timeLimit: 20 }),
  ];

  const answers: BattleAnswerRecord[] = [
    record({ index: 0, choice: 2, answeredAt: fakeTimestamp(START + 2000) }),
    record({ index: 1, choice: 2, answeredAt: fakeTimestamp(START + 100_000 + 2000) }),
    record({ index: 2, choice: 0, answeredAt: fakeTimestamp(START + 200_000 + 2000) }),
  ];

  const startsArray = [START, START + 100_000, START + 200_000];
  const startsMap = new Map<number, number>([
    [0, START],
    [1, START + 100_000],
    [2, START + 200_000],
  ]);

  it('正解数・合計点を集計する', () => {
    const s = scoreBattlePlayer('me', questions, answers, RULE, startsArray);
    expect(s.uid).toBe('me');
    expect(s.correctCount).toBe(2);
    expect(s.perQuestion).toHaveLength(3);
    expect(s.score).toBeGreaterThan(RULE.pointsCorrect * 2);
  });

  it('★questionStarts に Map を渡しても配列と同じ結果になる★', () => {
    // 呼び出し側（useBattleRoom）は Map を渡す。
    // 配列しか受けられない形だと、全問の速さ点が0になっていた。
    const byArray = scoreBattlePlayer('me', questions, answers, RULE, startsArray);
    const byMap = scoreBattlePlayer('me', questions, answers, RULE, startsMap);
    expect(byMap.score).toBe(byArray.score);
    expect(byMap.perQuestion.map((q) => q.speed)).toEqual(
      byArray.perQuestion.map((q) => q.speed),
    );
    // そして速さ点は実際に入っていること（0 === 0 で通ってしまうのを防ぐ）
    expect(byMap.perQuestion[0].speed).toBeGreaterThan(0);
  });

  it('同じ問題番号の記録が2つ来たら最初の1つだけを使う', () => {
    const dup: BattleAnswerRecord[] = [
      record({ index: 0, choice: 0, answeredAt: fakeTimestamp(START + 1000) }), // 誤答
      record({ index: 0, choice: 2, answeredAt: fakeTimestamp(START + 1500) }), // 後から正解に差し替え
    ];
    const s = scoreBattlePlayer('me', questions, dup, RULE, startsArray);
    expect(s.perQuestion[0].correct).toBe(false);
  });

  it('回答が無い問題は無回答として扱われ、連続が切れる', () => {
    const s = scoreBattlePlayer('me', questions, [], RULE, startsArray);
    expect(s.score).toBe(0);
    expect(s.correctCount).toBe(0);
    expect(s.maxStreak).toBe(0);
  });

  it('同じ入力なら常に同じ出力になる（両端末で一致することの担保）', () => {
    const a = scoreBattlePlayer('me', questions, answers, RULE, startsArray);
    const b = scoreBattlePlayer('me', questions, answers, RULE, startsArray);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

// ============================================================
// 勝敗判定
// ============================================================

describe('judgeBattle — 勝敗判定', () => {
  const START = 1_700_000_000_000;
  const questions = [choiceQuestion({ timeLimit: 20 })];
  const starts = [START];

  function playerWith(uid: string, choice: number, atMs: number) {
    return scoreBattlePlayer(
      uid,
      questions,
      [record({ index: 0, choice, answeredAt: fakeTimestamp(atMs) })],
      RULE,
      starts,
    );
  }

  it('点数が高い方の勝ち', () => {
    const me = playerWith('me', 2, START + 1000); // 正解
    const other = playerWith('other', 0, START + 1000); // 誤答
    const r = judgeBattle(me, other, RULE);
    expect(r.outcome).toBe('win');
    expect(r.decidedByTime).toBe(false);
  });

  it('相手の方が高ければ負け', () => {
    const me = playerWith('me', 0, START + 1000);
    const other = playerWith('other', 2, START + 1000);
    expect(judgeBattle(me, other, RULE).outcome).toBe('lose');
  });

  it('★相手が居ない（null）なら勝敗をつけない＝無効試合★', () => {
    // 相手が部屋に来なかった場合は「勝ち」にしない。
    // 勝ちにするとレートを盛るために一人部屋を量産できてしまうため、
    // ここは仕様として draw（無効試合）を返す。
    // 不戦勝（相手が来たあとで抜けた）は forfeit 側で扱う。
    const me = playerWith('me', 2, START + 1000);
    const r = judgeBattle(me, null, RULE);
    expect(r.outcome).toBe('draw');
    expect(r.opponent).toBeNull();
    expect(r.needsSuddenDeath).toBe(false);
  });

  it('同点なら tiebreak:"draw" で引き分けになる', () => {
    const rule: BattleRule = { ...RULE, tiebreak: 'draw' };
    const me = playerWith('me', 2, START + 1000);
    const other = playerWith('other', 2, START + 1000);
    expect(judgeBattle(me, other, rule).outcome).toBe('draw');
  });

  it('完全に同じ内容なら tiebreak:"time" でも引き分け', () => {
    const me = playerWith('me', 2, START + 1000);
    const other = playerWith('other', 2, START + 1000);
    const r = judgeBattle(me, other, { ...RULE, tiebreak: 'time' });
    expect(r.outcome).toBe('draw');
  });

  it('tiebreak:"sudden" で完全同点ならサドンデスを要求する', () => {
    const rule: BattleRule = { ...RULE, tiebreak: 'sudden' };
    const me = playerWith('me', 2, START + 1000);
    const other = playerWith('other', 2, START + 1000);
    const r = judgeBattle(me, other, rule);
    expect(r.needsSuddenDeath).toBe(true);
  });
});

// ============================================================
// 離脱の検出
// ============================================================

describe('trailingNoAnswerCount — 離脱の検出', () => {
  it('末尾から連続する無回答の数を数える', () => {
    // 0,1 は答えたが 2,3,4 が無回答（今は4問目）
    expect(trailingNoAnswerCount([0, 1], 4)).toBe(3);
  });

  it('今の問題に答えていれば0', () => {
    expect(trailingNoAnswerCount([0, 1, 2], 2)).toBe(0);
  });

  it('1問も答えていなければ全部が無回答', () => {
    expect(trailingNoAnswerCount([], 2)).toBe(3);
  });

  it('順番が入れ替わって届いても数え間違えない', () => {
    expect(trailingNoAnswerCount([2, 0, 1], 2)).toBe(0);
  });
});

// ============================================================
// レート
// ============================================================

describe('nextRating — Elo レート', () => {
  it('勝てば上がり、負ければ下がる', () => {
    const win = nextRating(1500, 1500, 'win');
    const lose = nextRating(1500, 1500, 'lose');
    expect(win).toBeGreaterThan(1500);
    expect(lose).toBeLessThan(1500);
  });

  it('同レート同士の引き分けはほぼ動かない', () => {
    expect(nextRating(1500, 1500, 'draw')).toBe(1500);
  });

  it('強い相手に勝つと大きく上がる', () => {
    const vsStrong = nextRating(1500, 1900, 'win') - 1500;
    const vsEqual = nextRating(1500, 1500, 'win') - 1500;
    expect(vsStrong).toBeGreaterThan(vsEqual);
  });

  it('弱い相手に負けると大きく下がる', () => {
    const vsWeak = 1500 - nextRating(1500, 1100, 'lose');
    const vsEqual = 1500 - nextRating(1500, 1500, 'lose');
    expect(vsWeak).toBeGreaterThan(vsEqual);
  });

  it('★1試合の変動は K の範囲を超えない（ルールの上限60の根拠）★', () => {
    for (const mine of [800, 1200, 1500, 1900, 2400]) {
      for (const theirs of [800, 1200, 1500, 1900, 2400]) {
        for (const outcome of ['win', 'lose', 'draw'] as const) {
          const delta = Math.abs(nextRating(mine, theirs, outcome) - mine);
          expect(delta).toBeLessThanOrEqual(RATING_K);
        }
      }
    }
  });

  it('下限（RATING_FLOOR）を下回らない', () => {
    let r = RATING_FLOOR + 5;
    for (let i = 0; i < 30; i += 1) r = nextRating(r, 2400, 'lose');
    expect(r).toBeGreaterThanOrEqual(RATING_FLOOR);
  });

  it('不戦勝は変動が小さい（半分）', () => {
    const normal = nextRating(1500, 1500, 'win') - 1500;
    const forfeit = nextRating(1500, 1500, 'win', true) - 1500;
    expect(forfeit).toBeLessThan(normal);
    expect(forfeit).toBeCloseTo(Math.round(normal * FORFEIT_RATING_RATIO), 0);
  });

  it('初期レートは1500', () => {
    expect(RATING_INITIAL).toBe(1500);
  });
});

describe('winProbabilityPercent — 勝率の目安', () => {
  it('同レートなら50%', () => {
    expect(winProbabilityPercent(1500, 1500)).toBe(50);
  });

  it('レートが高いほど勝率が上がる', () => {
    expect(winProbabilityPercent(1900, 1500)).toBeGreaterThan(50);
    expect(winProbabilityPercent(1100, 1500)).toBeLessThan(50);
  });

  it('0〜100 の範囲に収まる', () => {
    expect(winProbabilityPercent(4000, 800)).toBeLessThanOrEqual(100);
    expect(winProbabilityPercent(800, 4000)).toBeGreaterThanOrEqual(0);
  });
});

// ============================================================
// 乱数と抽選
// ============================================================

describe('hashString / createRandom — 決定性のある乱数', () => {
  it('同じ文字列からは同じ数が出る', () => {
    expect(hashString('room-abc')).toBe(hashString('room-abc'));
  });

  it('違う文字列からは違う数が出る（衝突しにくい）', () => {
    expect(hashString('room-abc')).not.toBe(hashString('room-abd'));
  });

  it('同じ種なら同じ並びが出る（両端末で出題順が一致することの担保）', () => {
    const a = createRandom(123);
    const b = createRandom(123);
    const seqA = [a(), a(), a(), a(), a()];
    const seqB = [b(), b(), b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it('0以上1未満の値を返す', () => {
    const r = createRandom(7);
    for (let i = 0; i < 200; i += 1) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe('pickRandom — 重複なしの抽選', () => {
  it('指定した数だけ選ぶ', () => {
    const picked = pickRandom([1, 2, 3, 4, 5, 6, 7, 8], 3, createRandom(1));
    expect(picked).toHaveLength(3);
  });

  it('同じ要素を2回選ばない', () => {
    const picked = pickRandom([1, 2, 3, 4, 5, 6, 7, 8], 8, createRandom(2));
    expect(new Set(picked).size).toBe(8);
  });

  it('母集団より多く要求されたら、あるだけ返す', () => {
    const picked = pickRandom([1, 2, 3], 10, createRandom(3));
    expect(picked).toHaveLength(3);
  });

  it('元の配列を壊さない', () => {
    const src = [1, 2, 3, 4];
    pickRandom(src, 2, createRandom(4));
    expect(src).toEqual([1, 2, 3, 4]);
  });
});

describe('buildQuestionOrder — 出題順の決定', () => {
  const ids = Array.from({ length: 50 }, (_, i) => `q${i}`);

  it('★同じ部屋IDなら両端末で同じ出題順になる★', () => {
    const a = buildQuestionOrder(ids, 10, 'room-XYZ');
    const b = buildQuestionOrder(ids, 10, 'room-XYZ');
    expect(a).toEqual(b);
  });

  it('部屋が違えば出題順も変わる', () => {
    const a = buildQuestionOrder(ids, 10, 'room-A');
    const b = buildQuestionOrder(ids, 10, 'room-B');
    expect(a).not.toEqual(b);
  });

  it('指定した数だけ選び、重複しない', () => {
    const picked = buildQuestionOrder(ids, 10, 'room-1');
    expect(picked).toHaveLength(10);
    expect(new Set(picked).size).toBe(10);
  });

  it('★同じ小問から作られた問題は1試合に1問しか出さない（groupOf）★', () => {
    // 化学基礎では1つの小問から「語句」と「パネル」の2問が作られる。
    // グループ指定が効かないと、同じ問題が1試合に2回出てしまう。
    const paired = ['w:a', 'p:a', 'w:b', 'p:b', 'w:c', 'p:c', 'w:d', 'p:d'];
    const groupOf = (id: string) => id.slice(2); // 'a' / 'b' / ...
    const picked = buildQuestionOrder(paired, 4, 'room-1', groupOf);
    const groups = picked.map(groupOf);
    expect(new Set(groups).size).toBe(groups.length);
  });

  it('groupOf 付きでも決定的（同じ部屋なら同じ結果）', () => {
    const paired = ['w:a', 'p:a', 'w:b', 'p:b', 'w:c', 'p:c'];
    const groupOf = (id: string) => id.slice(2);
    const a = buildQuestionOrder(paired, 3, 'room-Z', groupOf);
    const b = buildQuestionOrder(paired, 3, 'room-Z', groupOf);
    expect(a).toEqual(b);
  });

  it('グループ数が要求数より少ないときは、あるだけ返す', () => {
    const paired = ['w:a', 'p:a', 'w:b', 'p:b'];
    const groupOf = (id: string) => id.slice(2);
    expect(buildQuestionOrder(paired, 10, 'r', groupOf)).toHaveLength(2);
  });
});

// ============================================================
// ルール
// ============================================================

describe('battleRules — 教科ごとのルール', () => {
  it('収録されている全教科に既定ルールがある', () => {
    for (const subject of Object.keys(BATTLE_RULES)) {
      const rule = BATTLE_RULES[subject];
      expect(rule.subject).toBe(subject);
      expect(rule.questionCount).toBeGreaterThanOrEqual(3);
      expect(rule.formats.length).toBeGreaterThan(0);
    }
  });

  it('知らない教科は enabled:false で返る（勝手に対戦に出ない）', () => {
    const rule = defaultRuleOf('unknown_subject');
    expect(rule.enabled).toBe(false);
  });

  it('★収録数が少ない教科は出題数が減らされている★', () => {
    // 地理は25問しか無いので、10問マッチだと同じ問題がすぐ回ってくる
    expect(BATTLE_RULES.geography.questionCount).toBeLessThan(
      BATTLE_RULES.chemistry_basic.questionCount,
    );
  });

  it('normalizeRule は壊れた値を既定値に戻す', () => {
    const rule = normalizeRule('chemistry_basic', {
      questionCount: 'たくさん',
      pointsCorrect: -50,
      formats: ['choice4', 'typing', 42],
      tiebreak: 'coinflip',
    });
    expect(typeof rule.questionCount).toBe('number');
    expect(rule.pointsCorrect).toBeGreaterThanOrEqual(0);
    // 存在しない形式（typing など）は落とされる
    expect(rule.formats).toEqual(['choice4']);
    expect(['time', 'sudden', 'draw']).toContain(rule.tiebreak);
  });

  it('★questionCount に極端な値を入れても上限で止まる★', () => {
    // Firestore のコンソールから 999 を入れられても、
    // 1試合で999問出て通信量が爆発しないようにする。
    const rule = normalizeRule('chemistry_basic', { questionCount: 999 });
    expect(rule.questionCount).toBeLessThanOrEqual(20);
  });

  it('★手打ち入力の形式は存在しない★', () => {
    // 利用者の指示「さすがに手打ち入力は現実見ないので」に対応。
    // 形式の集合に typing / input のような値が混ざらないことを固定する。
    for (const subject of Object.keys(BATTLE_RULES)) {
      for (const format of BATTLE_RULES[subject].formats) {
        expect(['choice4', 'word', 'panel']).toContain(format);
      }
    }
  });
});

// ============================================================
// 回答の保存形式（マップ）
// ============================================================

/**
 * ★なぜこの describe が必要か★
 *
 * 回答の保存形式を「配列」から「マップ（q0, q1 …）」に変えた。
 * 変えた理由は2つあり、どちらも重大だった:
 *
 *   ① Firestore は配列の中の serverTimestamp() を受け付けない。
 *      つまり配列である限り★1問も回答できなかった★（動作不能）。
 *   ② 配列だとルールから「もう答えたか」を検査できず、
 *      時刻偽装・後出し・締切後回答が全部通っていた。
 *
 * ここでは採点側（純粋関数）が新しい形を正しく読めることを確かめる。
 * 読めていないと「回答はできるのに全部0点」という、
 * 利用者が原因を説明できない壊れ方をする。
 */
describe('scoreBattlePlayer — 回答がマップ形式でも正しく採点できる', () => {
  const START = 1_700_000_000_000;

  function q(id: string, answerIndex: number): BattleQuestion {
    return choiceQuestion({ id, answerIndex, timeLimit: 20 });
  }

  it('★マップ形式（q0/q1）で渡しても正解が数えられる★', () => {
    const questions = [q('a', 2), q('b', 1)];
    const starts = new Map([
      [0, START],
      [1, START + 30_000],
    ]);

    const sheet = {
      q0: { index: 0, choice: 2, panel: [], answeredAt: fakeTimestamp(START + 2000) },
      q1: { index: 1, choice: 1, panel: [], answeredAt: fakeTimestamp(START + 31_000) },
    };

    const r = scoreBattlePlayer('me', questions, sheet, RULE, starts);
    expect(r.correctCount).toBe(2);
    expect(r.score).toBeGreaterThan(0);
  });

  it('★配列で渡しても同じ結果になる（形の違いで点が変わらない）★', () => {
    const questions = [q('a', 2), q('b', 1)];
    const starts = new Map([
      [0, START],
      [1, START + 30_000],
    ]);

    const sheet = {
      q0: { index: 0, choice: 2, panel: [], answeredAt: fakeTimestamp(START + 2000) },
      q1: { index: 1, choice: 1, panel: [], answeredAt: fakeTimestamp(START + 31_000) },
    };
    const asArray = [sheet.q0, sheet.q1];

    const fromMap = scoreBattlePlayer('me', questions, sheet, RULE, starts);
    const fromArray = scoreBattlePlayer('me', questions, asArray, RULE, starts);

    expect(fromMap.score).toBe(fromArray.score);
    expect(fromMap.correctCount).toBe(fromArray.correctCount);
    expect(fromMap.totalTime).toBe(fromArray.totalTime);
  });

  it('★速さボーナスがちゃんと乗る（マップでも0点にならない）★', () => {
    // ここが落ちると「回答できるのに速く解く意味が無い」状態。
    // 過去に2回、別の原因で同じ症状（全問の速さ点0）を出しているため、
    // 形を変えるたびに必ず確かめる。
    const questions = [q('a', 2)];
    const starts = new Map([[0, START]]);

    const fast = scoreBattlePlayer(
      'me',
      questions,
      { q0: { index: 0, choice: 2, panel: [], answeredAt: fakeTimestamp(START + 1000) } },
      RULE,
      starts,
    );
    const slow = scoreBattlePlayer(
      'me',
      questions,
      { q0: { index: 0, choice: 2, panel: [], answeredAt: fakeTimestamp(START + 15_000) } },
      RULE,
      starts,
    );

    expect(fast.perQuestion[0].speed).toBeGreaterThan(0);
    expect(fast.score).toBeGreaterThan(slow.score);
  });

  it('★空のマップは全問無回答として扱う（例外を投げない）★', () => {
    const questions = [q('a', 2), q('b', 1)];
    const r = scoreBattlePlayer('me', questions, {}, RULE, new Map());
    expect(r.correctCount).toBe(0);
    expect(r.score).toBe(0);
    expect(r.perQuestion.length).toBe(2);
  });

  it('★null / undefined を渡しても落ちない★', () => {
    // 部屋に入ったばかりで answers.{uid} がまだ無い瞬間に呼ばれる。
    // ここで例外が出ると結果画面が真っ白になる。
    const questions = [q('a', 2)];
    expect(() => scoreBattlePlayer('me', questions, null, RULE, new Map())).not.toThrow();
    expect(() => scoreBattlePlayer('me', questions, undefined, RULE, new Map())).not.toThrow();
  });

  it('★壊れたキー（qX）は無視され、1問目の解答として扱われない★', () => {
    // Number('X') は NaN。これを 0 に丸めると
    // 「1問目に正解した」ことになってしまう。捨てるのが正しい。
    const questions = [q('a', 2)];
    const r = scoreBattlePlayer(
      'me',
      questions,
      { qX: { index: 0, choice: 2, panel: [], answeredAt: fakeTimestamp(START + 100) } },
      RULE,
      new Map([[0, START]]),
    );
    expect(r.correctCount).toBe(0);
  });

  it('★壊れたキーが先にあっても、本物の q0 が捨てられない★', () => {
    // これは実際に埋め込んでしまった不具合の再現。
    //
    // かつて「キー名が読めなければ中身の index を使う」保険を入れていた。
    // オブジェクトの走査順はキーの挿入順なので、
    // 壊れたキー（qX, 中身 index:0）が q0 より先にあると
    // qX が0番の枠を先取りし、本物の q0 が捨てられていた。
    //
    // 症状は「正しく答えたのに0点」。利用者に原因を説明できない壊れ方なので、
    // 順序を入れ替えた形で必ず試験する。
    const questions = [q('a', 2)];
    const r = scoreBattlePlayer(
      'me',
      questions,
      {
        // ★壊れたキーを先に置く（ここが要点）★
        qX: { index: 0, choice: 0, panel: [], answeredAt: fakeTimestamp(START + 50) },
        q0: { index: 0, choice: 2, panel: [], answeredAt: fakeTimestamp(START + 100) },
      },
      RULE,
      new Map([[0, START]]),
    );
    expect(r.correctCount).toBe(1);
    expect(r.perQuestion[0].correct).toBe(true);
  });

  it('★キー名と中身の index が食い違ったらキー名を信じる★', () => {
    // ルールは「キー名 q{n} と中身の index が一致すること」を強制しているので、
    // 食い違う組み合わせは本来 Firestore に入らない。
    // 万一入っていた場合、キー名の方がルールで守られている＝信頼できる。
    const questions = [q('a', 2), q('b', 1)];
    const starts = new Map([
      [0, START],
      [1, START + 30_000],
    ]);
    // キーは q1 だが中身の index は 0。q1 の問題（正解1）として採点されるべき。
    const r = scoreBattlePlayer(
      'me',
      questions,
      { q1: { index: 0, choice: 1, panel: [], answeredAt: fakeTimestamp(START + 31_000) } },
      RULE,
      starts,
    );
    expect(r.correctCount).toBe(1);
    expect(r.perQuestion[1].correct).toBe(true);
    expect(r.perQuestion[0].correct).toBe(false);
  });

  it('★問題数より多いキーがあっても、出題ぶんだけ採点する★', () => {
    const questions = [q('a', 2)];
    const r = scoreBattlePlayer(
      'me',
      questions,
      {
        q0: { index: 0, choice: 2, panel: [], answeredAt: fakeTimestamp(START + 500) },
        q9: { index: 9, choice: 0, panel: [], answeredAt: fakeTimestamp(START + 600) },
      },
      RULE,
      new Map([[0, START]]),
    );
    expect(r.perQuestion.length).toBe(1);
    expect(r.correctCount).toBe(1);
  });
});

// ============================================================
// 回答キーの変換
// ============================================================

describe('answerKeyOf / answerIndexOf — キー名と問題番号の相互変換', () => {
  it('問題番号からキー名を作る', () => {
    expect(answerKeyOf(0)).toBe('q0');
    expect(answerKeyOf(7)).toBe('q7');
    expect(answerKeyOf(12)).toBe('q12');
  });

  it('キー名から問題番号に戻せる', () => {
    expect(answerIndexOf('q0')).toBe(0);
    expect(answerIndexOf('q7')).toBe(7);
    expect(answerIndexOf('q12')).toBe(12);
  });

  it('★往復して元に戻る（両者の端末で同じ解釈になる前提）★', () => {
    for (let i = 0; i < 25; i += 1) {
      expect(answerIndexOf(answerKeyOf(i))).toBe(i);
    }
  });

  it('★壊れたキーは null を返す（0 に丸めない）★', () => {
    // 0 に丸めると「1問目の解答」として混ざり、点数が狂う。
    expect(answerIndexOf('qX')).toBeNull();
    expect(answerIndexOf('q')).toBeNull();
    expect(answerIndexOf('0')).toBeNull();
    expect(answerIndexOf('')).toBeNull();
    expect(answerIndexOf('q-1')).toBeNull();
    expect(answerIndexOf('q1.5')).toBeNull();
    expect(answerIndexOf('index')).toBeNull();
  });
});

// ============================================================
// 不戦敗の判定（★レートを削る処理なので慎重に固める★）
// ============================================================

/**
 * ★この describe を足した理由★
 *
 * 不戦敗は「相手が逃げた」と判断してレートを動かす処理である。
 * つまり誤判定すると★何も悪いことをしていない人のレートが下がる★。
 * それにもかかわらず、ここには試験が1つも無かった。
 *
 * 特に危ないのは閾値（FORFEIT_STREAK）で、
 * これが短いと「トンネルに入った人」を「席を立った人」として
 * 負けにしてしまう。値の意味を試験として書き残す。
 */
describe('不戦敗の判定', () => {
  it('★閾値はトンネル1本ぶんを耐えられる長さである★', () => {
    // 当初は3問だったが、これは短すぎた。
    // 地下鉄・トンネル・エレベーターの圏外は30〜60秒あり、
    // 1問10〜20秒なら3問は簡単に飛ぶ。
    // 値そのものを固定して、安易に短くされないようにする。
    expect(FORFEIT_STREAK).toBe(5);

    // 1問あたり最短10秒として、耐えられる圏外の長さ。
    const shortestQuestionSec = 10;
    expect(FORFEIT_STREAK * shortestQuestionSec).toBeGreaterThanOrEqual(50);
  });

  it('★閾値未満の無回答では成立しない（難問を飛ばしただけ）★', () => {
    // 4問連続で無回答でも、まだ不戦敗にしてはいけない。
    const answered = [0];
    expect(trailingNoAnswerCount(answered, FORFEIT_STREAK - 1)).toBeLessThan(FORFEIT_STREAK);
  });

  it('★閾値に達したら成立する★', () => {
    // 0問目だけ答えて、そこから閾値ぶん無回答が続いた状態。
    const answered = [0];
    expect(trailingNoAnswerCount(answered, FORFEIT_STREAK)).toBe(FORFEIT_STREAK);
  });
});

describe('hasLeft — 明示的な離脱', () => {
  it('離脱の記録があれば true', () => {
    expect(hasLeft({ userA: 12345 }, 'userA')).toBe(true);
  });

  it('別の人の離脱では true にならない', () => {
    // ここを取り違えると「自分が抜けたのに相手が不戦勝」になる。
    expect(hasLeft({ userA: 12345 }, 'userB')).toBe(false);
  });

  it('★記録が無い場合は false（推測に任せる）★', () => {
    expect(hasLeft(undefined, 'userA')).toBe(false);
    expect(hasLeft(null, 'userA')).toBe(false);
    expect(hasLeft({}, 'userA')).toBe(false);
  });

  it('★uid が空なら false（未ログイン時に誤爆させない）★', () => {
    expect(hasLeft({ '': 1 }, '')).toBe(false);
  });

  it('★おかしな形の値でも落ちない★', () => {
    // 部屋の中身は他人も書き込めるので、想定外の形が入りうる。
    // ここで例外が出ると対戦画面が真っ白になる。
    expect(hasLeft('もじれつ', 'userA')).toBe(false);
    expect(hasLeft(123, 'userA')).toBe(false);
    expect(hasLeft([1, 2, 3], 'userA')).toBe(false);
  });

  it('★値が null の項目は離脱とみなさない★', () => {
    // 離脱を取り消す実装が入った場合に null が入りうる。
    expect(hasLeft({ userA: null }, 'userA')).toBe(false);
  });
});
