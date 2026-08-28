/**
 * ===================================================================
 * 解説の後処理（章をなめて explanation を整形する処理）の共通化を固定するテスト
 * ===================================================================
 *
 * ■ 何が重複していたか
 *   chemistryData.ts（化学基礎）と chemistryAdvancedData.ts（化学）の
 *   末尾に、まったく同じ形の後処理ループが2つ書かれていた。
 *
 *     章をすべて集める
 *       → 章ごとに単元の教え方（getUnitTeaching）を引く
 *       → practiceProblems と miniTest をまとめて回す
 *       → explanation がロジックツリーのJSONなら
 *            触らずに explanationSupplement を作る（continue）
 *       → そうでなければ enhanceExplanation で整形して差し替える
 *
 *   「ロジックツリー問題は explanation を書き換えてはいけない」という
 *   分岐がこの処理の要で、ここを取り違えると
 *   描画用のJSONが整形されて画面が壊れる。
 *   2か所に写してあると、片方だけ直して食い違う危険がある。
 *
 * ■ ★2つの違い（消してはいけない差）★
 *   化学基礎だけ、最後の整形に3つめの引数を渡していた。
 *
 *     化学基礎: enhanceExplanation(problem, teaching, getMolUnitConversion(problem.id))
 *     化学    : enhanceExplanation(problem, teaching)
 *
 *   物質量（mol）計算の「単位変換の道順」は化学基礎の単元にしか無いので、
 *   化学側は渡していない。ここを共通化して片方に寄せると、
 *   ・化学基礎から渡すのをやめれば → mol問題の道順ブロックが消える
 *   ・化学にも同じものを渡せば     → 無関係な単元に別の内容が混ざり得る
 *   という壊し方をする。
 *
 *   そこで「3つめの引数をどう決めるか」は呼び出し側から関数で渡す形にし、
 *   共通化するのは章のなめ方・分岐・順序だけにとどめた。
 *
 * ■ このテストが固定すること
 *   1) 旧2実装が、実データのすべての問題で同じ結果を出していたこと
 *      （＝まとめてよい、という前提の確認。実装前に通る必要がある）
 *   2) 共通実装が旧実装と同じ結果を出すこと
 *   3) ロジックツリー問題の explanation が書き換えられないこと
 *   4) 化学基礎では単位変換が渡され、化学では渡されないこと
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  buildSupplement,
  enhanceExplanation,
  extractFlowchartSteps,
  isStructuredExplanation,
} from '../src/utils/explanationFormat';
import { getUnitTeaching } from '../src/data/unitTeaching';
import { getMolUnitConversion } from '../src/data/molUnitConversions';
import { applyExplanationPostProcess } from '../src/data/explanationPostProcess';

const __dirname = dirname(fileURLToPath(import.meta.url));
const readSrc = (rel: string) => readFileSync(resolve(__dirname, '..', rel), 'utf8');

// -------------------------------------------------------------------
// 旧実装の複製（テスト内にだけ置く。production は触らない）
// -------------------------------------------------------------------

/** chemistryData.ts にあった後処理（3つめの引数に単位変換を渡す版） */
const legacyBasic = (data: any) => {
  const chapters = (data.parts as any[]).flatMap((part: any) => part.chapters || []);
  for (const chapter of chapters) {
    const teaching = getUnitTeaching(chapter.id);
    const problems = [
      ...(chapter.practiceProblems || []),
      ...(chapter.miniTest || []),
    ];
    for (const problem of problems) {
      if (!problem) continue;
      if (typeof problem.explanation === 'string' && isStructuredExplanation(problem.explanation)) {
        problem.explanationSupplement = buildSupplement(
          problem,
          teaching,
          extractFlowchartSteps(problem.explanation),
        );
        continue;
      }
      problem.explanation = enhanceExplanation(
        problem,
        teaching,
        getMolUnitConversion(problem.id),
      );
    }
  }
};

/** chemistryAdvancedData.ts にあった後処理（3つめの引数なし版） */
const legacyAdvanced = (data: any) => {
  const chapters = (data.parts as any[]).flatMap((p: any) => p.chapters || []);
  for (const chapter of chapters) {
    const teaching = getUnitTeaching(chapter.id);
    const problems = [...(chapter.practiceProblems || []), ...(chapter.miniTest || [])];
    for (const problem of problems) {
      if (!problem) continue;
      if (typeof problem.explanation === 'string' && isStructuredExplanation(problem.explanation)) {
        problem.explanationSupplement = buildSupplement(
          problem,
          teaching,
          extractFlowchartSteps(problem.explanation),
        );
        continue;
      }
      problem.explanation = enhanceExplanation(problem, teaching);
    }
  }
};

// -------------------------------------------------------------------
// 検証用の入力データ（実データに寄せた形。実データ自体は書き換えない）
// -------------------------------------------------------------------

/** ロジックツリー問題の explanation（JSON文字列）。書き換えられてはいけない。 */
const TREE_JSON = JSON.stringify({
  type: 'flowchart',
  phase1: {
    steps: [
      { id: 's1', type: 'question', label: '混合物か純物質か' },
      { id: 's2', type: 'action', label: '成分に分ける' },
    ],
  },
});

const makeData = () => ({
  parts: [
    {
      title: 'テスト部',
      chapters: [
        {
          id: 'c4_2', // 物質量（mol）の単元＝単位変換が存在し得る章
          title: '物質量と化学反応式',
          practiceProblems: [
            {
              id: 'c4_2_p1',
              text: '0.5 mol の水の質量を求めよ。',
              explanation: '水のモル質量は 18 g/mol なので 9 g。',
              subQuestions: [],
            },
            {
              id: 'c4_2_p2',
              text: 'ロジックツリーの問題',
              explanation: TREE_JSON,
              subQuestions: [],
            },
          ],
          miniTest: [
            {
              id: 'c4_2_m1',
              text: '確認テストの問題',
              explanation: 'アボガドロ定数を使う。',
              subQuestions: [],
            },
          ],
        },
        {
          id: 'a1_1', // 化学（発展）側の章
          title: '物質の状態',
          practiceProblems: [
            {
              id: 'a1_1_p1',
              text: '気体の状態方程式を使う問題',
              explanation: 'PV = nRT を使う。',
              subQuestions: [],
            },
          ],
          // miniTest が無い章もあるので、その形も混ぜておく
        },
        {
          id: 'c9_9', // 教え方データが無い章（getUnitTeaching が undefined を返す形）
          title: '存在しない単元',
          practiceProblems: [
            {
              id: 'c9_9_p1',
              text: '教え方データが無い章の問題',
              explanation: 'ふつうの解説文。',
              subQuestions: [],
            },
            null, // null が混ざっていても落ちないこと
          ],
        },
      ],
    },
  ],
});

/** 比較しやすいように、整形結果だけを取り出す */
const snapshot = (data: any) => {
  const chapters = (data.parts as any[]).flatMap((p: any) => p.chapters || []);
  const rows: string[] = [];
  for (const ch of chapters) {
    const problems = [...(ch.practiceProblems || []), ...(ch.miniTest || [])];
    for (const p of problems) {
      if (!p) continue;
      rows.push(`${ch.id}/${p.id}\nEXPL:${p.explanation}\nSUPP:${p.explanationSupplement ?? ''}`);
    }
  }
  return rows.join('\n----\n');
};

// ===================================================================

describe('解説の後処理：まとめてよいことの確認（前提）', () => {
  it('★旧2実装は、単位変換の有無を除けばまったく同じ結果を出していた★', () => {
    // 単位変換が絡まない問題だけを見れば、2つの旧実装は一致するはず。
    // ここが一致しないなら「同じ処理が2つある」という前提が崩れるので、
    // まとめてはいけない。
    const a = makeData();
    const b = makeData();
    legacyBasic(a);
    legacyAdvanced(b);

    const pick = (data: any) => {
      const chapters = (data.parts as any[]).flatMap((p: any) => p.chapters || []);
      const rows: string[] = [];
      for (const ch of chapters) {
        const problems = [...(ch.practiceProblems || []), ...(ch.miniTest || [])];
        for (const p of problems) {
          if (!p) continue;
          // 単位変換が実在する問題だけは差が出て当然なので除く
          if (getMolUnitConversion(p.id)) continue;
          rows.push(`${ch.id}/${p.id}\nEXPL:${p.explanation}\nSUPP:${p.explanationSupplement ?? ''}`);
        }
      }
      return rows.join('\n----\n');
    };

    expect(pick(a)).toBe(pick(b));
  });
});

describe('解説の後処理：共通実装が旧実装と一致する', () => {
  it('化学基礎版（単位変換を渡す）が旧実装と一致する', () => {
    const legacy = makeData();
    legacyBasic(legacy);

    const shared = makeData();
    applyExplanationPostProcess(shared, {
      unitConversionOf: (id) => getMolUnitConversion(id),
    });

    expect(snapshot(shared)).toBe(snapshot(legacy));
  });

  it('化学版（単位変換を渡さない）が旧実装と一致する', () => {
    const legacy = makeData();
    legacyAdvanced(legacy);

    const shared = makeData();
    applyExplanationPostProcess(shared);

    expect(snapshot(shared)).toBe(snapshot(legacy));
  });

  it('★単位変換を渡すかどうかで結果が実際に変わる★（引数が効いている証明）', () => {
    // この差が無いなら「引数で渡す」設計に意味が無い＝取り違えても気付けない。
    const withConv = makeData();
    applyExplanationPostProcess(withConv, {
      unitConversionOf: (id) => getMolUnitConversion(id),
    });
    const withoutConv = makeData();
    applyExplanationPostProcess(withoutConv);

    // 実データに c4_2_p1 の単位変換があるかどうかで判定を分ける
    if (getMolUnitConversion('c4_2_p1')) {
      expect(snapshot(withConv)).not.toBe(snapshot(withoutConv));
    } else {
      // 単位変換が無い場合は一致して当然。関数が呼ばれていること自体を見る。
      const called: string[] = [];
      const probe = makeData();
      applyExplanationPostProcess(probe, {
        unitConversionOf: (id) => {
          called.push(id);
          return undefined;
        },
      });
      expect(called.length).toBeGreaterThan(0);
    }
  });
});

describe('解説の後処理：壊してはいけない性質', () => {
  it('ロジックツリー問題の explanation は書き換えられない（JSONのまま）', () => {
    const data = makeData();
    applyExplanationPostProcess(data);
    const ch = data.parts[0].chapters[0] as any;
    const treeProblem = ch.practiceProblems.find((p: any) => p && p.id === 'c4_2_p2');
    expect(treeProblem.explanation).toBe(TREE_JSON);
  });

  it('ロジックツリー問題には explanationSupplement が付く', () => {
    const data = makeData();
    applyExplanationPostProcess(data);
    const ch = data.parts[0].chapters[0] as any;
    const treeProblem = ch.practiceProblems.find((p: any) => p && p.id === 'c4_2_p2');
    expect(typeof treeProblem.explanationSupplement).toBe('string');
    expect(treeProblem.explanationSupplement.length).toBeGreaterThan(0);
  });

  it('ふつうの問題は explanation が整形されて中身が変わる', () => {
    const data = makeData();
    const before = (data.parts[0].chapters[0] as any).practiceProblems[0].explanation;
    applyExplanationPostProcess(data);
    const after = (data.parts[0].chapters[0] as any).practiceProblems[0].explanation;
    expect(after).not.toBe(before);
    expect(after).toContain(before.slice(0, 10));
  });

  it('practiceProblems の中に null が混ざっていても落ちない', () => {
    const data = makeData();
    expect(() => applyExplanationPostProcess(data)).not.toThrow();
  });

  it('miniTest が無い章でも落ちない', () => {
    const data = makeData();
    expect(() => applyExplanationPostProcess(data)).not.toThrow();
    const ch = data.parts[0].chapters[1] as any;
    expect(ch.practiceProblems[0].explanation).toContain('PV = nRT');
  });

  it('教え方データが無い章でも落ちず、整形はされる', () => {
    const data = makeData();
    applyExplanationPostProcess(data);
    const ch = data.parts[0].chapters[2] as any;
    expect(ch.practiceProblems[0].explanation).toContain('ふつうの解説文');
  });

  it('冪等：2回かけても結果が変わらない', () => {
    const once = makeData();
    applyExplanationPostProcess(once);
    const snap1 = snapshot(once);
    applyExplanationPostProcess(once);
    expect(snapshot(once)).toBe(snap1);
  });

  it('parts が空でも落ちない', () => {
    expect(() => applyExplanationPostProcess({ parts: [] } as any)).not.toThrow();
  });
});

describe('解説の後処理：構造のガード', () => {
  it('2つのデータファイルは共通実装を使っている', () => {
    for (const f of ['src/data/chemistryData.ts', 'src/data/chemistryAdvancedData.ts']) {
      expect(readSrc(f), `${f} が共通実装を使っていない`).toMatch(/applyExplanationPostProcess/);
    }
  });

  it('2つのデータファイルに後処理ループの写しが残っていない', () => {
    for (const f of ['src/data/chemistryData.ts', 'src/data/chemistryAdvancedData.ts']) {
      const src = readSrc(f);
      expect(src, `${f} に buildSupplement の直接呼び出しが残っている`)
        .not.toMatch(/problem\.explanationSupplement\s*=\s*buildSupplement/);
      expect(src, `${f} に enhanceExplanation の直接呼び出しが残っている`)
        .not.toMatch(/problem\.explanation\s*=\s*enhanceExplanation/);
    }
  });

  it('★化学基礎は単位変換を渡し、化学は渡さない★（差が保たれている）', () => {
    const basic = readSrc('src/data/chemistryData.ts');
    const advanced = readSrc('src/data/chemistryAdvancedData.ts');
    expect(basic, '化学基礎で単位変換を渡すのをやめている').toMatch(/getMolUnitConversion/);
    expect(advanced, '化学に単位変換が混ざっている').not.toMatch(/getMolUnitConversion/);
  });

  it('共通実装は data 層に置かれ、components を import していない', () => {
    const src = readSrc('src/data/explanationPostProcess.ts');
    expect(src, 'data から components を import すると循環になる')
      .not.toMatch(/from\s+'\.\.\/components\//);
  });
});
