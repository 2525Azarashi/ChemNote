import { describe, it, expect } from 'vitest';

import { chemistryData } from '../src/data/chemistryData';
import { mockExam } from '../src/data/mockExamData';
import { getUnitTeaching } from '../src/data/unitTeaching';
import {
  STEPS_TITLE,
  DETAIL_TITLE,
  UNIT_KATA_TITLE,
  buildUnitKataBlock,
  dedupeAgainstSteps,
  questionGroupKey,
  sliceEnhancedByQuestion,
  splitBodyByQuestionGroups,
} from '../src/utils/explanationFormat';

/**
 * ===================================================================
 * 解答・解説の構成（並び・配置・見せ方）の回帰テスト
 * ===================================================================
 * 依頼された6項目のうち、機械的に検証できるものをここで固定する。
 *
 *   ① 「この単元の思考の型」は単元につき1回だけ（解説本文には出さない）
 *   ② 問ごとに ［解法の思考手順 → 詳しい解説］ が隣接する
 *   ③ 完全重複だけを1回にまとめる（計算式・反応式・表・結論は絶対に残す）
 *   ④ 採点画面の小問アコーディオンへ「その問の解説」を配れる
 *   ⑤ どの単元・どの出題形式でも同じ設計で動く
 *
 * ★最重要★ 情報量は絶対に減らさない。
 * 「切り出しは可逆（連結すれば元に戻る）」ことをテストで担保する。
 */

type AnyQuestion = Record<string, any>;

const allChapters = (chemistryData.parts as any[]).flatMap((part) => part.chapters || []);
const allProblems: { chapterId: string; problem: AnyQuestion }[] = [];
for (const chapter of allChapters) {
  for (const problem of [...(chapter.practiceProblems || []), ...(chapter.miniTest || [])]) {
    if (problem) allProblems.push({ chapterId: chapter.id, problem });
  }
}
const bodyOf = (problem: AnyQuestion): string =>
  String(problem.explanationSupplement || problem.explanation || '');

describe('① この単元の思考の型は単元につき1回だけ', () => {
  it('解説本文には「この単元の思考の型」を一切埋め込まない', () => {
    const offenders = allProblems
      .filter(({ problem }) => bodyOf(problem).includes(UNIT_KATA_TITLE))
      .map(({ chapterId, problem }) => `${chapterId}/${problem.id}`);
    expect(offenders).toEqual([]);
  });

  it('模試の解説にも埋め込まない', () => {
    const texts: string[] = [];
    for (const question of (mockExam as any).questions || []) {
      if (question.subQuestions?.length) {
        for (const sub of question.subQuestions) texts.push(String(sub.explanation || ''));
      } else {
        texts.push(String(question.explanation || ''));
      }
    }
    expect(texts.filter((t) => t.includes(UNIT_KATA_TITLE))).toEqual([]);
  });

  it('画面側で使う buildUnitKataBlock は、型を持つ単元でだけ本文を返す', () => {
    const withKata = allChapters.filter((chapter) => buildUnitKataBlock(getUnitTeaching(chapter.id)));
    expect(withKata.length).toBeGreaterThan(0);
    for (const chapter of withKata) {
      const block = buildUnitKataBlock(getUnitTeaching(chapter.id));
      // ラベルは1個だけ（＝1単元1回）
      expect((block.match(new RegExp(UNIT_KATA_TITLE, 'g')) || []).length).toBe(1);
      // 丸数字の思考手順であること（STEP は使わない）
      expect(/[①②③]/.test(block)).toBe(true);
    }
  });

  it('型を持たない単元では空文字を返す（何も描画しない）', () => {
    expect(buildUnitKataBlock(undefined)).toBe('');
    expect(buildUnitKataBlock({ steps: [] } as any)).toBe('');
  });
});

describe('② 問ごとに［解法の思考手順 → 詳しい解説］が隣接する', () => {
  const multiQuestionProblems = allProblems.filter(({ problem }) => {
    const keys = new Set<string>();
    for (const sub of problem.subQuestions || []) {
      const key = questionGroupKey(sub?.label);
      if (key) keys.add(key);
    }
    return keys.size >= 2;
  });

  it('複数の「問」を含む大問が実在する（テストが空振りしていないことの確認）', () => {
    expect(multiQuestionProblems.length).toBeGreaterThanOrEqual(15);
  });

  it('思考手順と詳しい解説の2ブロックは統合も削除もされていない', () => {
    for (const { chapterId, problem } of multiQuestionProblems) {
      const body = bodyOf(problem);
      expect(body, `${chapterId}/${problem.id}`).toContain(STEPS_TITLE);
      expect(body, `${chapterId}/${problem.id}`).toContain(DETAIL_TITLE);
    }
  });

  it('思考手順が詳しい解説より先に来る（問ごとの読み順）', () => {
    for (const { chapterId, problem } of multiQuestionProblems) {
      const slices = sliceEnhancedByQuestion(bodyOf(problem));
      if (!slices) continue;
      for (const group of slices.groups) {
        const stepsAt = group.text.indexOf(STEPS_TITLE);
        const detailAt = group.text.indexOf(DETAIL_TITLE);
        if (stepsAt >= 0 && detailAt >= 0) {
          expect(stepsAt, `${chapterId}/${problem.id} 問${group.key}`).toBeLessThan(detailAt);
        }
      }
    }
  });

  it('本文の問単位分割は可逆（1行も落とさず・並べ替えない）', () => {
    const body = ['リード文', '問1 まずこれ', 'つづき', '問2 つぎにこれ', 'おわり'].join('\n');
    const result = splitBodyByQuestionGroups(body, ['1', '2']);
    expect(result).not.toBeNull();
    const rebuilt = [result!.lead, ...result!.segments.map((s) => s.text)].filter((s) => s !== '').join('\n');
    expect(rebuilt).toBe(body);
  });
});

describe('③ 重複は1回にまとめるが、必要な情報は必ず残す', () => {
  const steps = [
    '<b>① 陽イオンと陰イオンの電荷を確認する</b>',
    '　　└ 電荷の絶対値を入れ替えて添字にするのが基本になります',
    'x = 250 mL と求められます',
    'NaHCO₃ + HCl → NaCl + H₂O + CO₂ の反応が起こります',
    '| 物質 | 結晶の種類 | をきちんと対応させます',
    '■ 組成式をつくる思考手順（4問すべて共通）',
  ].join('\n');

  it('完全に重複した1行は1回にまとめる', () => {
    const body = '電荷の絶対値を入れ替えて添字にするのが基本になります';
    expect(dedupeAgainstSteps(body, steps).trim()).toBe('');
  });

  it('計算式・反応式は絶対に落とさない', () => {
    expect(dedupeAgainstSteps('x = 250 mL と求められます', steps)).toContain('250');
    expect(dedupeAgainstSteps('NaHCO₃ + HCl → NaCl + H₂O + CO₂ の反応が起こります', steps)).toContain('NaCl');
  });

  it('表・見出しは絶対に落とさない', () => {
    expect(dedupeAgainstSteps('| 物質 | 結晶の種類 | をきちんと対応させます', steps)).toContain('|');
    expect(dedupeAgainstSteps('■ 組成式をつくる思考手順（4問すべて共通）', steps)).toContain('■');
  });

  it('結論を述べる行は落とさない', () => {
    const body = 'よって電荷の絶対値を入れ替えて添字にするのが基本になります';
    expect(dedupeAgainstSteps(body, steps)).toContain('よって');
  });

  it('思考手順が空なら本文は一切変更しない', () => {
    const body = 'なにか長めの説明文がここに入ります';
    expect(dedupeAgainstSteps(body, '')).toBe(body);
  });
});

describe('④ 採点画面の小問アコーディオンへ「その問の解説」を配れる', () => {
  it('目印による切り出しは可逆（連結すると元の文字列に完全に戻る）', () => {
    let sliced = 0;
    for (const { chapterId, problem } of allProblems) {
      const text = bodyOf(problem);
      const slices = sliceEnhancedByQuestion(text);
      if (!slices) continue;
      sliced++;
      const rebuilt =
        slices.common + slices.groups.map((group) => `<!--grp:${group.key}-->${group.text}`).join('');
      expect(rebuilt, `${chapterId}/${problem.id}`).toBe(text);
    }
    expect(sliced).toBeGreaterThanOrEqual(15);
  });

  it('小問のもつ問番号は、必ずどれかの切り出しに対応する（解説の行き先が無い小問を作らない）', () => {
    for (const { chapterId, problem } of allProblems) {
      const slices = sliceEnhancedByQuestion(bodyOf(problem));
      if (!slices) continue;
      const groupKeys = new Set(slices.groups.map((group) => group.key));
      for (const sub of problem.subQuestions || []) {
        const key = questionGroupKey(sub?.label);
        if (!key) continue;
        expect(groupKeys.has(key), `${chapterId}/${problem.id} ${sub.label}`).toBe(true);
      }
    }
  });

  it('目印は画面に出ない HTML コメントである', () => {
    for (const { problem } of allProblems) {
      const text = bodyOf(problem);
      const marks = text.match(/<!--grp:[^-]*-->/g) || [];
      for (const mark of marks) {
        expect(mark.startsWith('<!--')).toBe(true);
        expect(mark.endsWith('-->')).toBe(true);
      }
    }
  });

  it('問が1つだけの大問は切り出さない（従来の見た目を崩さない）', () => {
    const single = allProblems.filter(({ problem }) => !sliceEnhancedByQuestion(bodyOf(problem)));
    expect(single.length).toBeGreaterThan(100);
  });
});

describe('⑤ どの単元・どの出題形式でも成り立つ', () => {
  it('すべての大問が解答・解説の本文をもつ', () => {
    const empty = allProblems
      .filter(({ problem }) => bodyOf(problem).trim() === '')
      .map(({ chapterId, problem }) => `${chapterId}/${problem.id}`);
    expect(empty).toEqual([]);
  });

  it('questionGroupKey は全角・半角・空白ゆれを吸収する', () => {
    expect(questionGroupKey('問1(1) 組成式')).toBe('1');
    expect(questionGroupKey('問 2 なにか')).toBe('2');
    expect(questionGroupKey('問１０ なにか')).toBe('10');
    expect(questionGroupKey('(ア) 空欄')).toBe('');
    expect(questionGroupKey(undefined)).toBe('');
  });

  it('思考手順の見出しが「STEP」になっていない（STEPはフローチャート参照時のみ）', () => {
    for (const { chapterId, problem } of allProblems) {
      const body = bodyOf(problem);
      const stripped = body.replace(/(?:フローチャート|ロジックツリー)[^。\n<]{0,30}STEP\s*\d+/g, '');
      expect(/\bSTEP\s*\d/.test(stripped), `${chapterId}/${problem.id}`).toBe(false);
    }
  });

  it('黄色マーカー（<u>）は問題解説で使わない', () => {
    for (const { chapterId, problem } of allProblems) {
      expect(/<u>/i.test(bodyOf(problem)), `${chapterId}/${problem.id}`).toBe(false);
    }
  });
});
