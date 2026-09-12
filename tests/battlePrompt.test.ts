import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { BATTLE_BLANK as B, buildSingleBlankDisplay, singleQuestionLabel, sourceBlankKey, stripExerciseHeading } from '../src/battle/core/questionPrompt';
import { loadPool, POOL_COUNTS } from '../src/battle/data/battlePool';
import { SUBJECTS, getChaptersOfSubject } from '../src/data/allChapters';
import { BattleQuestionView } from '../src/battle/ui/BattleQuestionView';

const sub = (id: string, label: string, correctAnswer: string) => ({ id, label, correctAnswer, type: 'short_answer' });

describe('単独出題の空欄変換', () => {
  it.each(['(3) 語句を答えよ', '（３） 語句を答えよ', '問2（3）① 語句を答えよ'])('旧設問番号を残さない: %s', label => {
    expect(singleQuestionLabel(label)).toBe('語句を答えよ');
  });
  it('炭素(C)や式・単位・本文中の参照を空欄として扱わない', () => {
    expect(sourceBlankKey('(1) ③ 炭素(C)の同素体')).toBeNull();
    expect(singleQuestionLabel('(3) 炭素(C)の同素体')).toBe('炭素(C)の同素体');
    expect(stripExerciseHeading('(3) 水は極性分子か。')).toBe('水は極性分子か。');
    expect(stripExerciseHeading('(3)² + 2')).toBe('(3)² + 2');
    expect(singleQuestionLabel('操作(3)の温度は300 K')).toBe('操作(3)の温度は300 K');
  });
  it('対象以外を元の正答で補完し、入力データを変更しない', () => {
    const siblings = [sub('a', '(ア)', 'ミトコンドリア'), sub('b', '（イ）', '葉緑体')];
    const original = JSON.stringify(siblings);
    const d = buildSingleBlankDisplay('呼吸の場は（ ア ）、光合成の場は（イ）である。', siblings[0], siblings);
    expect(d?.prompt).toBe(`呼吸の場は${B}、光合成の場は葉緑体である。`);
    expect(JSON.stringify(siblings)).toBe(original);
  });
  it('科学上の1文字Bも正しく補完し、塩基記号(C)は残す', () => {
    const siblings = [sub('a', '(ア)', 'ヘルパー'), sub('b', '(イ)', 'B')];
    expect(buildSingleBlankDisplay('（ア）T細胞は（イ）細胞の増殖を助ける。', siblings[0], siblings)?.prompt)
      .toBe(`${B}T細胞はB細胞の増殖を助ける。`);
    const dna = [sub('a', '(ア)', 'シトシン')];
    expect(buildSingleBlankDisplay('塩基の（ア）（C）を答える。', dna[0], dna)?.prompt).toContain('（C）');
  });
  it('選択肢併記の空欄を選択肢番号ではなく正しい語句にする', () => {
    const siblings = [sub('a', '(ア)', 'アミラーゼ'), { ...sub('b', '(イ)', '②'), type: 'multiple_choice', options: ['細胞内のみ', '細胞外でも'] }];
    expect(buildSingleBlankDisplay('酵素（ア）は（イ：細胞内のみ・細胞外でも）働く。', siblings[0], siblings)?.prompt)
      .toBe(`酵素${B}は細胞外でも働く。`);
  });
  it('解答不明や同名マーカーの衝突を推測で埋めない', () => {
    const siblings = [sub('a', '(ア)', '核'), sub('b', '(イ)', 'DNA'), sub('c', '(イ)', 'RNA')];
    expect(buildSingleBlankDisplay('（ア）は（イ）を含む。', siblings[0], siblings)?.answerable).toBe(false);
    expect(buildSingleBlankDisplay('（ア）は（ウ）を含む。', siblings[0], siblings)?.answerable).toBe(false);
  });
  it('「ア〜エを答えよ」という指示を本文と誤認しない', () => {
    const siblings = [sub('a', '(ア)', '+'), sub('b', '(イ)', '-')];
    const d = buildSingleBlankDisplay('次の（ア）〜（イ）を答えよ。\nNa(固) → Na(気) ΔHの符号は（ア）。', siblings[0], siblings);
    expect(d?.prompt).toBe(`Na(固) → Na(気) ΔHの符号は${B}。`);
  });
  it('数値での文字切りをせず、対象の文を文末まで残す', () => {
    const siblings = [sub('a', '(ア)', '物質')];
    const text = `これは${'長い説明'.repeat(40)}で、（ア）と呼ぶ。`;
    expect(buildSingleBlankDisplay(text, siblings[0], siblings)?.prompt).toBe(text.replace('（ア）', B));
  });
});

describe('全4,180問の空欄・ラベル監査', () => {
  it.each(Object.keys(POOL_COUNTS))('%s: 旧番号・対象外の穴・切断が残らない', async subject => {
    const pool = await loadPool(subject);
    for (const q of pool) {
      expect(q.prompt + q.label, q.id).not.toMatch(/[（(]\s*[ア-ン]\s*[)）]/u);
      expect(q.label, q.id).not.toMatch(/^(?:問\d|[（(][0-9０-９]+[)）])/u);
      expect(q.prompt, q.id).not.toMatch(/^(?:問\d|演習\d|[（(][0-9０-９]+[)）])/u);
      if (q.prompt.includes(B)) {
        expect(q.prompt.split(B).length - 1, q.id).toBe(1);
        expect(q.prompt, q.id).not.toMatch(/_{2,}|[（(][\s＿_]+[)）]|^[…]|[…]$/u);
      }
    }
  });
  it('個別修正50件はすべて反映され、元の正答・選択肢順と対応する', async () => {
    const repairs = JSON.parse(readFileSync('scripts/data/battle_prompt_repairs.json', 'utf8'));
    const source = new Map<string, any>();
    for (const subject of SUBJECTS) for (const c of getChaptersOfSubject(subject.id) as any[]) {
      for (const p of [...c.practiceProblems || [], ...c.miniTest || []]) {
        for (const sq of p.subQuestions || []) source.set(`${c.id}:${p.id}:${sq.id}`, sq);
      }
    }
    const pool = (await Promise.all(Object.keys(POOL_COUNTS).map(loadPool))).flat();
    expect(pool).toHaveLength(4180);
    expect(pool.filter(q => !q.chapterId.startsWith('mc'))).toHaveLength(4066);
    expect(Object.keys(repairs)).toHaveLength(50);
    for (const [key, r] of Object.entries(repairs) as [string, any][]) {
      expect(source.get(key)?.correctAnswer, key).toBe(r.expectedAnswer);
      const matches = pool.filter(q => `${q.chapterId}:${q.problemId}:${q.subQuestionId}` === key);
      expect(matches, key).toHaveLength(1);
      expect(matches[0].prompt, key).toBe(r.prompt);
      expect(matches[0].label, key).toBe(r.label);
      if (matches[0].format !== 'kana') {
        const actual = matches[0].options[matches[0].answerIndex];
        expect(actual.replace(/\s/g, ''), key).toBe(r.expectedAnswer.replace(/\s/g, ''));
      }
    }
  });
  it('係数26問は正答を入れると元の係数の式に戻る', async () => {
    const pool = await loadPool('chemistry_basic');
    const coefficients = pool.filter(q => q.chapterId === 'c4_3' && ['q_c4_3_1', 'q_c4_3_3'].includes(q.problemId));
    expect(coefficients).toHaveLength(26);
    const chapter = (getChaptersOfSubject('chemistry_basic') as any[]).find(c => c.id === 'c4_3');
    for (const q of coefficients) {
      expect(q.prompt.split(B).length - 1, q.id).toBe(1);
      expect(q.prompt, q.id).not.toMatch(/[（(]\s*[a-kア-ン]\s*[)）]/u);
      expect(q.prompt, q.id).toContain('→');
      expect(q.options[q.answerIndex], q.id).toMatch(/^\d+$/);
      const problem = [...chapter.practiceProblems, ...chapter.miniTest].find(p => p.id === q.problemId);
      const sq = problem.subQuestions.find(s => s.id === q.subQuestionId);
      const answers = new Map(problem.subQuestions.map(s => [s.label, s.correctAnswer]));
      const expected = sq.group.replace(/^(?:[①-⑳]|[（(]\d+[)）])\s*/, '')
        .replace(/[（(]\s*([a-kア-ン])\s*[)）]/g, (_, key) => answers.get(key));
      expect(q.prompt.replace(B, q.options[q.answerIndex]).replace(/\s/g, ''), q.id)
        .toBe(expected.replace(/\s/g, ''));
    }
  });
  it('組合せ問題は必要な空欄だけを同じ見た目で強調する', async () => {
    const question = (await loadPool('geography')).find(q => q.subQuestionId === 'q_geo_r1_1_q6')!;
    const html = renderToStaticMarkup(React.createElement(BattleQuestionView, {
      question, index: 7, total: 10, remainMs: 10000, answered: false, myChoice: -1,
      myPanel: [], reveal: false, onChoose() {}, onPushPanel() {}, onPopPanel() {}, onCyclePanel() {}, onCommitKana() {},
    }));
    expect(html.match(/data-answer-blank/g)).toHaveLength(2);
    expect(html).toContain('空欄Ｘ');
    expect(html).toContain('空欄Ｙ');
    expect(html).not.toContain('問6');
  });
});
