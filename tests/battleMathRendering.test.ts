import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { BattleText } from '../src/battle/ui/BattleText';
import { BattleQuestionView } from '../src/battle/ui/BattleQuestionView';
import { BattleResult } from '../src/battle/ui/BattleResult';
import type { BattleQuestion, BattleResultSummary } from '../src/battle/core/types';
import { POOL } from '../src/battle/data/pool.math.generated';
import { ANSWERS } from '../src/battle/data/answer.math.generated';
import { splitMathPieces, toLatex } from '../src/utils/mathTypeset';

const textHtml = (text: string, subject = 'math') =>
  renderToStaticMarkup(React.createElement(BattleText, { text, subject }));
const question: BattleQuestion = {
  id: 'math-render', subject: 'math', chapterId: 'm1_1', problemId: 'p', subQuestionId: 's',
  format: 'choice4', prompt: '∫ x^4 dx を求めよ。', label: 'x^5/5 + C を選ぶ。',
  options: ['x^5/4 + C', '4x^3 + C', 'x^5/5 + C', 'x^5 + C'],
  answerIndex: 2, panelOrder: [], timeLimit: 15,
};
const props = {
  question, index: 0, total: 10, remainMs: 12000, answered: false,
  myChoice: -1, myPanel: [], reveal: false,
  onChoose: () => {}, onPushPanel: () => {}, onPopPanel: () => {},
  onCyclePanel: () => {}, onCommitKana: () => {},
};
const questionHtml = (extra = {}) =>
  renderToStaticMarkup(React.createElement(BattleQuestionView, { ...props, ...extra }));

describe('battle math rendering', () => {
  it.each([
    'x^5/5 + C', '4x^3 + C', '5/42', '1/cos^2 x', '∫ 1/{t(t+1)} dt',
    '∫[0→π/2] sin x dx', 'lim[n→∞] (1/n) Σ[k=1→n] (k/n)^2',
    '√(x²+y²)', '7C3', 'a = (2, -1)', 'P_A(B) = P(A∩B)/P(A)',
  ])('typesets %s without parse errors', (text) => {
    const html = textHtml(text);
    expect(html).toContain('class="katex"');
    expect(html).not.toContain('katex-error');
  });

  it('keeps entire grouped denominators and probability functions in the fraction', () => {
    expect(toLatex('∫ 1/{t(t+1)} dt')).toBe('\\int \\frac{1}{t(t+1)} \\,dt');
    expect(toLatex('P(A∩B)/P(A)')).toBe('\\frac{P(A \\cap B)}{P(A)}');
    expect(toLatex('1/cos^2 x')).toBe('\\frac{1}{\\cos^{2} x}');
  });

  it('does not change the conservative default for short fractions', () => {
    expect(splitMathPieces('5/42')).toEqual([{ kind: 'text', value: '5/42' }]);
    expect(splitMathPieces('5/42', { context: 'math' })[0].value).toBe('\\frac{5}{42}');
  });

  it('formats both problem fields and every choice without mutating source data', () => {
    const before = JSON.stringify(question);
    const html = questionHtml();
    expect(html.match(/class="katex"/g)).toHaveLength(6);
    expect(html.match(/<button /g)).toHaveLength(4);
    expect(html).not.toContain('lucide-check');
    expect(JSON.stringify(question)).toBe(before);
  });

  it('preserves blank highlighting, Japanese text and line breaks', () => {
    const html = questionHtml({ question: { ...question, prompt: 'x^2 の積分は［　？　］。\n理由を選べ。' } });
    expect(html).toContain('<mark');
    expect(html).toContain('？</mark>');
    expect(html).toContain('の積分は');
    expect(html).toContain('\n理由を選べ。');
    expect(html).toContain('aria-label="x^2"');
  });

  it('keeps answers hidden until reveal and keeps answered/offline controls disabled', () => {
    expect(questionHtml({ answered: true, myChoice: 1 })).not.toContain('lucide-check');
    expect(questionHtml({ answered: true, myChoice: 1 })).toContain('あいてを まっています');
    expect(questionHtml({ answered: true, myChoice: 1 }).match(/disabled=""/g)).toHaveLength(4);
    expect(questionHtml({ locked: true }).match(/disabled=""/g)).toHaveLength(4);
    expect(questionHtml({ reveal: true, myChoice: 1 }).match(/lucide-check/g)).toHaveLength(1);
  });

  /*
    ★以前ここにあった「英語以外でも H2O が素の文字のまま出る」検査は消した★

    利用者から「文字をしっかりと反映させろって言ったよね？」と指摘があり、
    対戦画面で <u>二酸化硫黄</u> がタグのまま、H2O2 が下付きにならずに
    出ていた。その「素の文字のまま」を守っていたのがこの検査だった。
    いまは演習画面と同じ整形器（formatText）を通すのが仕様なので、
    新しい契約は tests/battleTextRendering.test.ts に置いてある。
  */
  it.each(['english_listening', 'english_grammar'])(
    'keeps English prose plain in %s (no chemistry styling on words)', (subject) => {
      const html = textHtml('The ratio is 3/4. Where is the umbrella?', subject);
      expect(html).toContain('The ratio is 3/4. Where is the umbrella?');
      expect(html).not.toContain('katex');
      expect(html).not.toContain('Cambria Math');
      expect(textHtml('$\\frac{1}{2}$', subject)).toContain('class="katex"');
    },
  );

  it('does not put the math auto-detector on non-math subjects (5/42 stays a plain ratio)', () => {
    // 数学だけは分数・指数を積極的に組む。他教科で同じことをすると
    // 化学の g/mol や 22.4 L / 1 mol が斜体の分数に化ける。
    for (const subject of ['chemistry_basic', 'biology_basic', 'geography', 'rika']) {
      expect(textHtml('5/42', subject)).not.toContain('katex');
    }
    expect(textHtml('5/42', 'math')).toContain('katex');
  });

  it('escapes HTML and disables untrusted LaTeX commands', () => {
    const html = textHtml('<img src=x onerror=alert(1)> & $\\href{javascript:alert(1)}{x}$');
    expect(html).not.toMatch(/<img|<script|<a\s|<[^>]*\sonerror=/);
    expect(textHtml('自然数 a < b')).toContain('aria-label="a &lt; b"');
    expect(() => textHtml('$\\frac{1}{$')).not.toThrow();
  });

  it('typesets the result answer in a full-width row, without truncation', () => {
    const score = { index: 0, correct: true, total: 100, timeUsed: 2, speed: 10, streak: 0 };
    const result = {
      outcome: 'win', decidedByTime: false,
      me: { score: 100, correctCount: 1, perQuestion: [score] }, opponent: null,
    } as BattleResultSummary;
    const html = renderToStaticMarkup(React.createElement(BattleResult, {
      result, questions: [question], subject: 'math', opponent: null, meNickname: 'テスト',
      rating: null, byForfeit: false, maskOpponent: false, onExit: () => {},
    }));
    const detail = html.slice(html.indexOf('id="battle-result-detail"'));
    expect(detail).toContain('class="katex"');
    expect(detail).toContain('aria-label="x^5/5 + C"');
    expect(detail).not.toContain('truncate');
  });

  it('shares rendering between AI/online and keeps reason loading after the match', () => {
    for (const file of ['BattleAiRoomScreen', 'BattleRoomScreen']) {
      expect(readFileSync(`src/battle/ui/${file}.tsx`, 'utf8')).toContain('<BattleQuestionView');
    }
    const result = readFileSync('src/battle/ui/BattleResult.tsx', 'utf8');
    expect(result).toContain('<BattleText text={oneLine}');
    expect(result).toMatch(/useEffect\([\s\S]*loadBattleAnswers\(subject\)/);
    for (const file of ['BattleQuestionView', 'BattleText']) {
      expect(readFileSync(`src/battle/ui/${file}.tsx`, 'utf8')).not.toContain('loadBattleAnswers');
    }
  });

  it('renders 240 preserved and 114 new math questions without KaTeX errors', () => {
    expect(POOL).toHaveLength(354);
    expect(POOL.filter(row => !(row[1] as string).startsWith('mc'))).toHaveLength(240);
    expect(ANSWERS).toHaveLength(240);
    for (const row of POOL) {
      for (const text of [row[5], row[6], ...(row[7] as string[])]) {
        expect(textHtml(text as string), `${row[0]}: ${text}`).not.toContain('katex-error');
      }
    }
    for (const [id, text] of ANSWERS) {
      expect(textHtml(text), id).not.toContain('katex-error');
    }
  });
});
