import { describe, expect, it } from 'vitest';
import { crystalProblems, pickCrystalProblems } from '../src/data/crystalProblems';
import { chemistryData, crystalTreeData } from '../src/data/chemistryData';
import { isAnswerCorrect } from '../src/utils/answerJudge';
import { normalizeGradingCriteria } from '../src/utils/gradingCriteria';
import { parseExplanationBlocks } from '../src/components/ExplanationBody';

const c3_2 = (chemistryData as any).parts
  .flatMap((p: any) => p.chapters)
  .find((c: any) => c.id === 'c3_2');

const allSubQuestions = (problems: any[]) => problems.flatMap((p: any) => p.subQuestions ?? []);

describe('crystalProblems（結晶単元の追加問題）', () => {
  it('6大問がすべて定義されている', () => {
    expect(crystalProblems.map((p: any) => p.id)).toEqual([
      'p_c3_2_ion',
      'p_c3_2_molecule',
      'p_c3_2_covalent',
      'p_c3_2_formula',
      'p_c3_2_classify',
      'p_c3_2_synthesis',
    ]);
  });

  it('pickCrystalProblems は指定順に取り出し、未知 id は無視する', () => {
    const picked = pickCrystalProblems('p_c3_2_classify', 'p_c3_2_ion', 'not_exist');
    expect(picked.map((p: any) => p.id)).toEqual(['p_c3_2_classify', 'p_c3_2_ion']);
  });

  it('小問 id が重複していない', () => {
    const ids = allSubQuestions(crystalProblems).map((s: any) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gradingCriteria / detailedExplanation.steps は必ず配列（結果画面クラッシュ防止）', () => {
    for (const sq of allSubQuestions(crystalProblems)) {
      if (sq.gradingCriteria !== undefined) {
        expect(Array.isArray(sq.gradingCriteria), sq.id).toBe(true);
        expect(normalizeGradingCriteria(sq.gradingCriteria).length, sq.id).toBeGreaterThan(0);
      }
      expect(Array.isArray(sq.detailedExplanation?.steps), sq.id).toBe(true);
      expect(sq.detailedExplanation.steps.length, sq.id).toBeGreaterThan(0);
    }
  });

  it('記述式には必ず採点基準（①②③形式）がある', () => {
    for (const sq of allSubQuestions(crystalProblems)) {
      if (sq.type !== 'descriptive') continue;
      expect(Array.isArray(sq.gradingCriteria), sq.id).toBe(true);
      for (const c of sq.gradingCriteria) {
        expect(c, sq.id).toMatch(/^[①②③④⑤⑥⑦⑧⑨⑩]/);
      }
    }
  });

  it('思考手順は ①②③… の丸数字で始まる（STEP はフローチャート参照専用）', () => {
    for (const sq of allSubQuestions(crystalProblems)) {
      for (const step of sq.detailedExplanation.steps) {
        expect(step, sq.id).toMatch(/^[①②③④⑤⑥⑦⑧⑨⑩]/);
        expect(step, sq.id).not.toMatch(/STEP/);
      }
    }
  });

  it('自動採点問題は correctAnswer / acceptedAnswers すべてで正解判定される', () => {
    for (const sq of allSubQuestions(crystalProblems)) {
      if (sq.type === 'descriptive') continue;
      for (const candidate of [sq.correctAnswer, ...(sq.acceptedAnswers ?? [])]) {
        expect(isAnswerCorrect(sq, candidate), `${sq.id} / ${candidate}`).toBe(true);
      }
    }
  });

  it('multiple_choice の correctAnswer は options に含まれる', () => {
    for (const sq of allSubQuestions(crystalProblems)) {
      if (sq.type !== 'multiple_choice') continue;
      expect(sq.options, sq.id).toContain(sq.correctAnswer);
    }
  });

  it('解答マーカーはピンク/オレンジで、黄色は使わない（フローチャートと衝突するため）', () => {
    // 現行の解答マーカーはブランドピンク（#E8688E → #F4A9C4）の
    // 下寄せグラデーション。以前の単色 #ffc0cb とは別実装なので
    // 「ピンク系の色が使われていること」を見る。
    const PINK_MARKER = /rgba\(233,\s*104,\s*142|rgba\(244,\s*169,\s*196|#ffc0cb|#E8688E|#F4A9C4/i;
    for (const p of crystalProblems) {
      expect(PINK_MARKER.test(p.explanation), p.id).toBe(true);
      // 黄色はフローチャートの配色と衝突するので禁止
      expect(p.explanation.toLowerCase(), p.id).not.toContain('yellow');
      expect(p.explanation.toLowerCase(), p.id).not.toMatch(/#ff0|#ffff00|#fff9c4|#fff6cc/);
      expect(p.explanation, p.id).not.toMatch(/<u>|<hl>/);
    }
  });

  it('全大問に共通テスト出題傾向ボックスがある', () => {
    for (const p of crystalProblems) {
      expect(p.explanation, p.id).toContain('ココが狙われる！共通テスト・センター試験のリアル');
    }
  });

  it('装飾用の span タグは開閉が対応している（表を跨がない）', () => {
    for (const p of crystalProblems) {
      const open = (p.explanation.match(/<span/g) ?? []).length;
      const close = (p.explanation.match(/<\/span>/g) ?? []).length;
      expect(close, p.id).toBe(open);
      // Markdown 表の行に HTML ボックスの開始タグが混ざっていないこと
      for (const line of p.explanation.split('\n')) {
        if (!line.trim().startsWith('|')) continue;
        const o = (line.match(/<span/g) ?? []).length;
        const c = (line.match(/<\/span>/g) ?? []).length;
        expect(c, `${p.id} / ${line}`).toBe(o);
      }
    }
  });

  it('Markdown 表として解析できるブロックを含む', () => {
    for (const p of crystalProblems) {
      const blocks = parseExplanationBlocks(p.explanation);
      expect(blocks.some((b: any) => b.kind === 'table'), p.id).toBe(true);
    }
  });
});

describe('c3_2 への組み込み（教科書順の配置）', () => {
  it('practiceProblems が基本教科書の学習順序で並んでいる', () => {
    expect(c3_2.practiceProblems.map((p: any) => p.id)).toEqual([
      'p_c3_2_ion',       // ① イオン結合とイオン結晶
      'p_c3_2_molecule',  // ② 共有結合と分子（電子式・極性）
      'p_c3_2_covalent',  // ③ 共有結合の結晶（同素体）
      'p_c3_2_formula',   // ④ 化学式の種類と物質中の化学結合
      'q_c3_2_n1',        // 追加：基礎の確認
      'q_c3_2_n2',
      'q_c3_2_n3',
      'q_c3_2_n4',
      'q_c3_2_1',         // 既存：語句網羅
      'p_c3_2_classify',  // ⑤ 4種類の結晶の分類（まとめ）
      'q_c3_2_2',
      'q_c3_2_3',
      'q_c3_2_n5',
      'q_c3_2_4',
      'q_c3_2_6',
      'q_c3_2_7',
      'q_c3_2_n6',
      'p_c3_2_synthesis', // ⑥ 章末の総合演習
    ]);
  });

  it('フローチャート（crystalTreeData）の関連問題リンクが全て実在する', () => {
    const ids = new Set<string>();
    c3_2.practiceProblems.forEach((p: any) => {
      ids.add(p.id);
      p.subQuestions.forEach((s: any) => ids.add(s.id));
    });

    const dangling: string[] = [];
    const counts: Array<{ id: string; length: number; subLabel: string }> = [];
    const walk = (node: any) => {
      if (Array.isArray(node.relatedQuestions)) {
        node.relatedQuestions.forEach((rq: any) => {
          if (!ids.has(rq.id)) dangling.push(`${node.id} -> ${rq.id}`);
        });
        counts.push({ id: node.id, length: node.relatedQuestions.length, subLabel: node.subLabel });
      }
      (node.children ?? []).forEach(walk);
    };
    walk(crystalTreeData as any);

    expect(dangling).toEqual([]);
    // subLabel の「n問」表示が実際のリンク数と一致していること
    for (const c of counts) {
      expect(c.subLabel, c.id).toBe(`${c.length}問`);
    }
  });
});
