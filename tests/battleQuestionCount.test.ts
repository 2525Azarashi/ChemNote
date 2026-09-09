import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BattleSubjectSelect, QUESTION_COUNT_CHOICES } from '../src/battle/ui/BattleSubjectSelect';
import { normalizeRule } from '../src/battle/core/battleRules';

/**
 * ===================================================================
 * 問題数を選べる（フレンド・AI）／全国は固定
 * ===================================================================
 *
 * ご指示（原文）：
 *   > 後問題数決めれるようにして
 *
 * ■ この検査が守ること
 *   ① 選べる値は Firestore ルール（3〜20）の範囲内
 *   ② 教科選択の画面に問題数の選択肢が出る（allowQuestionCount のとき）
 *   ③ 全国対戦の教科選択には出ない（待機列を割らない）
 *   ④ 選んだ数がフレンド（createFriendRoom の ruleOverride）と
 *      AI（useAiBattle の第4引数）の両方に渡っている
 *   ⑤ 「もう1回」でも同じ問題数が引き継がれる
 */

const RULES = readFileSync('firestore.rules', 'utf8');
const MODE = readFileSync('src/battle/ui/BattleMode.tsx', 'utf8');
const AI_HOOK = readFileSync('src/battle/hooks/useAiBattle.ts', 'utf8');

describe('① 選べる値は Firestore ルールの範囲内', () => {
  it('5 / 10 / 15 が選べる', () => {
    expect([...QUESTION_COUNT_CHOICES]).toEqual([5, 10, 15]);
  });

  it('どの値も firestore.rules の questionCount 3〜20 に収まる', () => {
    // ルールの数字をソースから読む（数字を二重に書かない）
    const m = RULES.match(/d\.rules\.questionCount >= (\d+) && d\.rules\.questionCount <= (\d+)/u);
    expect(m, '★firestore.rules の questionCount 制限が見つかりません★').not.toBeNull();
    const min = Number(m![1]);
    const max = Number(m![2]);
    for (const n of QUESTION_COUNT_CHOICES) {
      expect(n).toBeGreaterThanOrEqual(min);
      expect(n).toBeLessThanOrEqual(max);
    }
  });

  it('normalizeRule を通しても値が変わらない（クランプされない）', () => {
    for (const n of QUESTION_COUNT_CHOICES) {
      expect(normalizeRule('chemistry_basic', { questionCount: n }).questionCount).toBe(n);
    }
  });
});

describe('② ③ 教科選択の画面', () => {
  const render = (allow: boolean) =>
    renderToStaticMarkup(
      React.createElement(BattleSubjectSelect, {
        title: 'テスト',
        onPick: () => {},
        onBack: () => {},
        allowQuestionCount: allow,
      }),
    );

  it('allowQuestionCount のとき 3 つの選択肢が出て、既定は 10', () => {
    const html = render(true);
    expect(html).toContain('data-question-count="5"');
    expect(html).toContain('data-question-count="10"');
    expect(html).toContain('data-question-count="15"');
    expect(html).toMatch(/data-question-count="10"[^>]*aria-checked="true"|aria-checked="true"[^>]*data-question-count="10"/u);
    // 教科カードの「○問しょうぶ」が選んだ数（既定 10）で出る
    expect(html).toContain('10問しょうぶ');
  });

  it('★全国対戦（allowQuestionCount なし）には出ない★', () => {
    const html = render(false);
    expect(html).not.toContain('data-question-count');
    expect(html).not.toContain('role="radiogroup"');
  });
});

describe('④ ⑤ 選んだ数が両モードに渡る', () => {
  it('フレンド：createFriendRoom に questionCount が渡る', () => {
    expect(MODE).toMatch(/createFriendRoom\(\s*pick,\s*count \? \{ questionCount: count \} : undefined,?\s*\)/u);
  });

  it('AI：useAiBattle が第4引数で questionCount を受け、ルールに上書きする', () => {
    expect(AI_HOOK).toMatch(/questionCount\?: number,\s*\): AiBattleState & AiBattleActions/u);
    expect(AI_HOOK).toContain('questionCount ? { ...base, questionCount } : base');
    expect(MODE).toContain('questionCount={questionCount}');
  });

  it('全国対戦の教科選択は allowQuestionCount を渡さず、選択をリセットする', () => {
    const i = MODE.indexOf('title="全国対戦 ／ 教科をえらぶ"');
    expect(i).toBeGreaterThan(0);
    const block = MODE.slice(i, MODE.indexOf('/>', i));
    expect(block).not.toContain('allowQuestionCount');
    expect(block).toContain('setQuestionCount(undefined)');
  });

  it('「もう1回」は同じ問題数を引き継ぐ', () => {
    expect(MODE).toMatch(/void createRoom\(pick, questionCount\)/u);
  });
});
