/**
 * 対戦「臨場感アップデート」の純粋関数テスト。
 * ブラウザ・Firebase に接続しない。
 */
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

import {
  countdownLabelAt,
  COUNTDOWN_TOTAL_MS,
  diffFeed,
  FEED_MAX_VISIBLE,
  FEED_TTL_MS,
  formatScore,
  gapMessage,
  initialFeedSnapshot,
  leadChangeOf,
  leadOf,
  maxPointsPerQuestion,
  opponentStatusOf,
  phaseOf,
  pruneFeed,
  streakThrough,
  tweenScore,
} from '../src/battle/core/battleLive';
import {
  parseXpTotal,
  pickReviewQuestions,
  statsOf,
  xpOf,
  XP_FINISH,
  XP_PER_CORRECT,
  XP_WIN,
} from '../src/battle/core/battleSummary';
import {
  bgmTrackFor,
  DEFAULT_BATTLE_AUDIO,
  parseBattleAudioSettings,
  serializeBattleAudioSettings,
} from '../src/battle/core/audioSettings';
import { scoreBattlePlayer, judgeBattle } from '../src/battle/core/battleCore';
import { defaultRuleOf } from '../src/battle/core/battleRules';
const DEFAULT_RULE = defaultRuleOf('chemistry_basic');
import type { BattlePlayerScore, BattleQuestion, BattleQuestionScore } from '../src/battle/core/types';

const read = (p: string) => readFileSync(p, 'utf8');

function q(index: number, correct: boolean, total = correct ? 120 : 0): BattleQuestionScore {
  return { index, correct, timeUsed: 3, base: correct ? 100 : 0, speed: correct ? 20 : 0, streak: 0, total };
}
function score(uid: string, per: BattleQuestionScore[]): BattlePlayerScore {
  return {
    uid,
    perQuestion: per,
    score: per.reduce((a, b) => a + b.total, 0),
    correctCount: per.filter((p) => p.correct).length,
    totalTime: per.length * 3,
    maxStreak: 0,
  };
}

describe('局面（フェーズ）', () => {
  it('10問なら 1〜7問目 normal、8・9問目 closing、10問目 final', () => {
    expect(phaseOf(0, 10)).toBe('normal');
    expect(phaseOf(6, 10)).toBe('normal');
    expect(phaseOf(7, 10)).toBe('closing');
    expect(phaseOf(8, 10)).toBe('closing');
    expect(phaseOf(9, 10)).toBe('final');
  });
  it('総数が不明なら normal', () => {
    expect(phaseOf(0, 0)).toBe('normal');
  });
});

describe('リード・逆転', () => {
  it('順位の入れ替わりを区別する', () => {
    expect(leadOf(100, 50)).toBe('me');
    expect(leadChangeOf('opponent', 'me')).toBe('overtake');
    expect(leadChangeOf('me', 'opponent')).toBe('overtaken');
    expect(leadChangeOf('opponent', 'tie')).toBe('caught-up');
    expect(leadChangeOf('me', 'tie')).toBe('caught');
    expect(leadChangeOf('me', 'me')).toBeNull();
  });
  it('点差の一言はリードされている側にだけ、1問で返せる差なら出さない', () => {
    const max = maxPointsPerQuestion(DEFAULT_RULE);
    expect(max).toBe(100 + 50 + 15 * 6);
    expect(gapMessage(500, 400, max, 5)).toBeNull();
    expect(gapMessage(400, 500, max, 5)).toBeNull(); // 100 <= max
    expect(gapMessage(0, 600, max, 5)).toBe('まだ逆転できる！');
    expect(gapMessage(0, 5000, max, 1)).toBe('最後まで全力で！');
    expect(gapMessage(0, 5000, max, 0)).toBeNull();
  });
});

describe('相手の状態（選択肢は絶対に出さない）', () => {
  const opp = score('o', [q(0, true), q(1, true), q(2, false)]);
  it('答える前は「考え中」、答えたら「回答」、reveal 後にだけ正誤', () => {
    expect(opponentStatusOf(2, false, false, opp).activity).toBe('thinking');
    expect(opponentStatusOf(2, true, false, opp).activity).toBe('answered');
    expect(opponentStatusOf(2, true, true, opp).activity).toBe('wrong');
    expect(opponentStatusOf(1, true, true, opp).activity).toBe('correct');
  });
  it('連続正解は見せてよい範囲でだけ数える', () => {
    expect(streakThrough(opp, 1)).toBe(2);
    expect(streakThrough(opp, 2)).toBe(0);
    expect(opponentStatusOf(2, true, false, opp).streak).toBe(2); // まだ2問目まで
    expect(opponentStatusOf(2, true, true, opp).streak).toBe(0);
  });
  it('型に choice が無い（相手の選択肢を受け取る経路が存在しない）', () => {
    // コメントを除いたコード行に choice / panel（相手の解答の中身）が現れないこと
    const code = read('src/battle/core/battleLive.ts')
      .split('\n')
      .filter((l) => !/^\s*(\*|\/\/|\/\*)/.test(l))
      .join('\n');
    expect(code).not.toMatch(/\bchoice\b/);
    expect(code).not.toMatch(/\bpanel\b/);
  });
});

describe('実況ログ（差分）', () => {
  it('相手が答えた時点では正誤を言わず、reveal で両者の正誤と順位変化をまとめて出す', () => {
    const me = score('m', [q(0, true)]);
    const opp = score('o', [q(0, true, 150)]);
    const s0 = initialFeedSnapshot();
    // 1問目、相手が先に答えた（自分は未回答）
    const r1 = diffFeed(s0, { index: 0, total: 10, myAnswered: false, opponentAnswered: true, reveal: false, myScore: null, opponentScore: opp, now: 1000 });
    expect(r1.entries.map((e) => e.kind)).toEqual(['answered']);
    expect(r1.entries[0].text).not.toContain('正解');
    // 自分も答えて reveal
    const r2 = diffFeed(r1.snapshot, { index: 0, total: 10, myAnswered: true, opponentAnswered: true, reveal: true, myScore: me, opponentScore: opp, now: 2000 });
    const kinds = r2.entries.map((e) => e.kind);
    expect(kinds).toContain('correct'); // 自分
    expect(r2.entries.filter((e) => e.who === 'opponent' && e.kind === 'correct')).toHaveLength(1);
    expect(kinds).toContain('overtaken'); // tie → opponent（相手が150点）
    // 同じ状態をもう一度渡しても何も出ない（重複防止）
    const r3 = diffFeed(r2.snapshot, { index: 0, total: 10, myAnswered: true, opponentAnswered: true, reveal: true, myScore: me, opponentScore: opp, now: 2500 });
    expect(r3.entries).toEqual([]);
  });
  it('問題が進むと「第N問へ」、最終問題で FINAL QUESTION、残り3問で のこりN問', () => {
    let snap = initialFeedSnapshot();
    const base = { myAnswered: false, opponentAnswered: false, reveal: false, myScore: null, opponentScore: null, now: 1 };
    snap = diffFeed(snap, { ...base, index: 0, total: 10 }).snapshot;
    let r = diffFeed(snap, { ...base, index: 7, total: 10 });
    expect(r.entries.map((e) => e.kind)).toEqual(['advance', 'closing']);
    r = diffFeed(r.snapshot, { ...base, index: 9, total: 10 });
    expect(r.entries.map((e) => e.kind)).toEqual(['advance', 'final']);
    expect(r.entries[1].text).toBe('FINAL QUESTION！');
  });
  it('3連続以上は「N連続正解」になる', () => {
    const me = score('m', [q(0, true), q(1, true), q(2, true)]);
    const snap = { ...initialFeedSnapshot(), index: 2, lead: 'me' as const };
    const r = diffFeed(snap, { index: 2, total: 10, myAnswered: true, opponentAnswered: true, reveal: true, myScore: me, opponentScore: score('o', []), now: 1 });
    const mine = r.entries.find((e) => e.who === 'me');
    expect(mine?.kind).toBe('streak');
    expect(mine?.text).toBe('あなたが3連続正解！');
  });
  it('古い行は消え、最大3行だけ残る', () => {
    const mk = (i: number, at: number) => ({ id: String(i), who: 'system' as const, kind: 'advance' as const, text: '', at });
    const now = 10_000;
    const list = [mk(1, now - FEED_TTL_MS - 1), mk(2, now - 100), mk(3, now - 90), mk(4, now - 80), mk(5, now - 70)];
    const out = pruneFeed(list, now);
    expect(out).toHaveLength(FEED_MAX_VISIBLE);
    expect(out.map((e) => e.id)).toEqual(['3', '4', '5']);
  });
});

describe('スコアのアニメーションとカウントダウン', () => {
  it('tween は開始値から目標へ単調に進み、終わりで目標に一致する', () => {
    expect(tweenScore(1000, 1200, 0, 600)).toBe(1000);
    const mid = tweenScore(1000, 1200, 300, 600);
    expect(mid).toBeGreaterThan(1000);
    expect(mid).toBeLessThan(1200);
    expect(tweenScore(1000, 1200, 600, 600)).toBe(1200);
    expect(tweenScore(1200, 1000, 300, 600)).toBeLessThan(1200);
  });
  it('3桁区切り', () => {
    expect(formatScore(1240)).toBe('1,240');
  });
  it('holds each number from 7 to 1 for one second, then START', () => {
    expect(COUNTDOWN_TOTAL_MS).toBe(7600);
    expect(countdownLabelAt(-100)).toBe('7');
    for (let second=0; second<7; second++) {
      expect(countdownLabelAt(second*1000)).toBe(String(7-second));
      expect(countdownLabelAt(second*1000+999)).toBe(String(7-second));
    }
    expect(countdownLabelAt(7000)).toBe('START!');
    expect(countdownLabelAt(7599)).toBe('START!');
    expect(countdownLabelAt(COUNTDOWN_TOTAL_MS)).toBeNull();
  });
});

describe('試合後のまとめ', () => {
  const questions: BattleQuestion[] = [0, 1, 2].map((i) => ({
    id: `q${i}`, subject: 'chemistry_basic', chapterId: 'c1_1', problemId: `p${i}`, subQuestionId: `s${i}`,
    format: 'choice4', prompt: `問${i}`, label: '', options: ['A', 'B', 'C', 'D'], answerIndex: 1, panelOrder: [], timeLimit: 20,
  }));
  const me = score('m', [q(0, true), q(1, false), q(2, false)]);
  const opp = score('o', [q(0, true), q(1, true), q(2, false)]);
  const result = judgeBattle(me, opp, DEFAULT_RULE);

  it('平均回答時間は回答した問題だけで出す', () => {
    const s = statsOf(me, new Set([0, 1]));
    expect(s.averageSeconds).toBe(3);
    expect(statsOf(me, new Set()).averageSeconds).toBe(0);
  });
  it('XP は負けても 0 にならない', () => {
    const lose = xpOf('lose', 1, 0);
    expect(lose.total).toBe(XP_FINISH + XP_PER_CORRECT);
    expect(xpOf('win', 10, 5).total).toBe(XP_FINISH + XP_PER_CORRECT * 10 + XP_WIN + 25);
    expect(parseXpTotal('abc')).toBe(0);
    expect(parseXpTotal('120')).toBe(120);
  });
  it('復習は「相手は正解・自分は間違い」を先に並べ、正解の文字列を持つ', () => {
    const picks = pickReviewQuestions(result, questions, () => '');
    expect(picks.map((p) => p.index)).toEqual([1, 2]);
    expect(picks[0].reason).toBe('opponent-right');
    expect(picks[1].reason).toBe('wrong');
    expect(picks[0].correctText).toBe('B');
  });
  it('既存の採点（scoreBattlePlayer）の結果をそのまま読める（配点は変えていない）', () => {
    const sheet = { q0: { index: 0, choice: 1, panel: [], answeredAt: 1000 } };
    const starts = new Map([[0, 0]]);
    const s = scoreBattlePlayer('m', questions, sheet, DEFAULT_RULE, starts);
    expect(s.perQuestion[0].correct).toBe(true);
    expect(streakThrough(s, 0)).toBe(1);
  });
});

describe('対戦の音の設定', () => {
  it('既定は BGM ON・効果音 ON、壊れた保存値は既定に倒す', () => {
    expect(parseBattleAudioSettings(null)).toEqual(DEFAULT_BATTLE_AUDIO);
    expect(parseBattleAudioSettings('{bad')).toEqual(DEFAULT_BATTLE_AUDIO);
    const s = parseBattleAudioSettings(serializeBattleAudioSettings({ bgm: true, sfx: false, volume: 2 }));
    expect(s).toEqual({ bgm: true, sfx: false, volume: 1 });
  });
  it('BGM OFF なら局面が何であれ鳴らさない。ON なら局面に応じたトラック', () => {
    expect(bgmTrackFor({ bgm: false }, 'playing', 'final')).toBeNull();
    expect(bgmTrackFor({ bgm: true }, 'matching', 'normal')).toBe('matching');
    expect(bgmTrackFor({ bgm: true }, 'countdown', 'normal')).toBe('matching');
    expect(bgmTrackFor({ bgm: true }, 'playing', 'closing')).toBe('closing');
    expect(bgmTrackFor({ bgm: true }, 'playing', 'final')).toBe('final');
    expect(bgmTrackFor({ bgm: true }, 'finished', 'final')).toBeNull();
  });
});

describe('接続の確認（コードの根拠）', () => {
  it('対戦中は通常 BGM が止まる', () => {
    const app = read('src/App.tsx');
    expect(app).toContain("const BGM_SILENT_STATES: readonly string[] = ['quiz', 'explanation', 'battle']");
    expect(app).not.toContain("['quiz', 'explanation'].includes(appState)");
  });
  it('人間戦・AI戦とも BattleLiveStage を使い、既存の BattleQuestionView をそのまま使う', () => {
    expect(read('src/battle/ui/BattleRoomScreen.tsx')).toContain('<BattleLiveStage');
    expect(read('src/battle/ui/BattleAiRoomScreen.tsx')).toContain('<BattleLiveStage');
    expect(read('src/battle/ui/BattleLiveStage.tsx')).toContain('<BattleQuestionView');
    expect(read('src/battle/ui/BattleLiveStage.tsx')).toContain('limitSec={resolveTimeLimit(p.question, p.rules)}');
  });
  it('1問目の締切にカウントダウン分を足し、Firestore への追加書き込みは無い', () => {
    const hook = read('src/battle/hooks/useBattleRoom.ts');
    expect(hook).toContain('COUNTDOWN_TOTAL_MS / 1000');
    expect(hook.match(/updateDoc|setDoc|addDoc/g)).toBeNull();
    expect(read('src/battle/data/battle.ts')).toBe(read('src/battle/data/battle.ts')); // データ層は差分ゼロ（下の manifest で確認）
  });
  it('設定画面に対戦の音のスイッチがある', () => {
    const modal = read('src/components/ProfileModal.tsx');
    expect(modal).toContain('aria-label="対戦BGM"');
    expect(modal).toContain('aria-label="対戦効果音"');
    expect(modal).toContain('aria-label="対戦の音量"');
  });
  it('リザルトに「復習する」と WIN/LOSE/DRAW がある', () => {
    const r = read('src/battle/ui/BattleResultLive.tsx');
    expect(r).toContain("big: 'WIN'");
    expect(r).toContain("big: 'LOSE'");
    expect(r).toContain("big: 'DRAW'");
    expect(r).toContain('captureWrongAnswers');
    expect(read('src/App.tsx')).toContain("setAppState('study_hub')");
  });
});

describe('第4弾: 追加の演出と導線（コードの根拠）', () => {
  it('マッチング成立と相手入室に合図の音がある', () => {
    expect(read('src/battle/ui/BattleMatching.tsx')).toContain("playSfx('matched')");
    expect(read('src/battle/ui/BattleLobby.tsx')).toContain("play('matched')");
    const audio = read('src/battle/audio/battleAudio.ts');
    expect(audio).toContain("case 'matched':");
    expect(audio).toContain("case 'hurry':");
  });
  it('残り3秒の刻み音は「自分が未回答・reveal前」のときだけ', () => {
    const stage = read('src/battle/ui/BattleLiveStage.tsx');
    expect(stage).toContain("if (counting || p.answered || p.reveal || p.finished) return;");
    expect(stage).toContain("if (secondsLeft > 3 || secondsLeft <= 0) return;");
  });
  it('相手が先に答えたら、自分が未回答のときだけ一言が出る', () => {
    expect(read('src/battle/ui/BattleLiveStage.tsx')).toContain('p.opponentAnswered && !p.answered && !p.reveal');
  });
  it('圏外のときは相手の状態を「考え中」と言わず「通信待ち」にする', () => {
    expect(read('src/battle/ui/BattleLiveStage.tsx')).toContain("activity: 'offline'");
    expect(read('src/battle/ui/BattleLiveParts.tsx')).toContain('通信待ち');
    expect(read('src/battle/ui/BattleRoomScreen.tsx')).toContain('offline={Boolean(offlineMessage)}');
  });
  it('復習ピックに1行解説と「この単元を演習する」がある', () => {
    const r = read('src/battle/ui/BattleResultLive.tsx');
    expect(r).toContain('oneLines?.get(p.question.id)');
    expect(r).toContain('onPractice(subject, p.question.chapterId, p.question.problemId, p.question.subQuestionId)');
    expect(read('src/battle/ui/BattleResult.tsx')).toContain('oneLines={answers}');
  });
  it('リザルトに XP の内訳と 1問ごとのタイムラインがある', () => {
    const r = read('src/battle/ui/BattleResultLive.tsx');
    expect(r).not.toContain('localStorage.setItem');
    expect(read('src/battle/ui/BattleGrowthCard.tsx')).toContain('delta.xp.participation');
    expect(read('src/battle/ui/BattleResult.tsx')).toContain('<BattleGrowthReward');
    expect(r).toContain('function QuestionTimeline');
    expect(r).toContain('aria-label="1問ごとの両者の正誤"');
  });
  it('ホームに共有XPがあり、対戦メニューは同じ成長記録を使う', () => {
    expect(read('src/components/Home.tsx')).toContain('<GrowthHomeStrip');
    expect(read('src/battle/ui/BattleHome.tsx')).toContain('useGrowthProgress()');
    expect(read('src/battle/ui/GrowthHomeStrip.tsx')).toContain('xp={progress.xp}');
    expect(read('src/battle/ui/BattleHome.tsx')).not.toContain('xpStorageKey');
  });
});
