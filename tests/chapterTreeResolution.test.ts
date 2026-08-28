/**
 * ===================================================================
 * 章ID → ロジックツリー（フローチャート）の対応付けを固定するテスト
 * ===================================================================
 *
 * ■ 目的
 *   ChapterFlowchartModal.tsx（単元選択のフローチャート）と
 *   PracticeExplanationTree.tsx（問題解説のツリー）は、
 *   「章ID からその章のツリーを引く」処理を**別々に持っていた**。
 *
 *     - Modal   : if 文を17本並べて代入していく方式（返り値 NodeData | null）
 *     - Practice: Record を引いてから c5/c6 をフォールバックする方式
 *                 （返り値 NodeData | undefined）
 *
 *   書き方は違うが、対応表の中身（17章＋c5/c6）は同じ。
 *   これを1か所にまとめる前に、
 *
 *     「実在する29章すべてで、旧2実装と新実装が同じツリーを返すこと」
 *
 *   を**オブジェクトの同一性（toBe）**で固定しておく。
 *   ツリーは巨大なので、内容比較ではなく参照が同一であることを見る。
 *   参照が同じなら、画面に出るものは絶対に同じ。
 *
 * ■ null / undefined の扱いについて（重要）
 *   2つの画面は「該当ツリーが無いとき」の型が違う（null と undefined）。
 *   ここは**画面側の分岐に直結する**ため、共通化しても各画面の
 *   返り値の形は変えない。そのことも下でテストしている。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import {
  substanceTreeData,
  separationTreeData,
  componentDetectionTreeData,
  thermalMotionTreeData,
  atomicStructureTreeData,
  ionTreeData,
  ionGenerationTreeData,
  ionSizeTreeData,
  chemicalBondTreeData,
  crystalTreeData,
  interactionTreeData,
  atomicWeightTreeData,
  amountOfSubstanceTreeData,
  chemicalEquationTreeData,
  concentrationTreeData,
  acidBaseTreeData,
  redoxTreeData,
} from '../src/data/chemistryData';
import type { NodeData } from '../src/utils/logicTreeTypes';

/** 実在する化学基礎の章ID（src/data/allChapters.ts から実際に列挙したもの） */
const REAL_CHAPTER_IDS = [
  'c1_1', 'c1_2_A', 'c1_2_B', 'c1_3',
  'c2_1', 'c2_2', 'c2_3', 'c2_4',
  'c3_1', 'c3_2', 'c3_3',
  'c4_1', 'c4_2', 'c4_3', 'c4_4',
  'c5_1', 'c5_2', 'c5_3', 'c5_4', 'c5_5', 'c5_6', 'c5_7',
  'c6_1', 'c6_2', 'c6_3', 'c6_4', 'c6_5', 'c6_6', 'c6_7',
];

/** 単元トップや他教科・想定外のIDも一緒に確認する */
const EXTRA_IDS = ['c5', 'c6', 'c1', 'c7_1', 'a1_1', 'el1_A', '', 'c5_99', 'C5_2'];

const ALL_IDS = [...REAL_CHAPTER_IDS, ...EXTRA_IDS];

// -------------------------------------------------------------------
// 旧実装の複製（ChapterFlowchartModal.tsx の if 羅列方式）
// -------------------------------------------------------------------
function legacyModalResolve(chapterId: string): NodeData | null {
  let fullTreeData: NodeData | null = null;
  if (chapterId === 'c1_1') fullTreeData = substanceTreeData;
  if (chapterId === 'c1_2_A') fullTreeData = separationTreeData;
  if (chapterId === 'c1_2_B') fullTreeData = componentDetectionTreeData;
  if (chapterId === 'c1_3') fullTreeData = thermalMotionTreeData;
  if (chapterId === 'c2_1') fullTreeData = atomicStructureTreeData;
  if (chapterId === 'c2_2') fullTreeData = ionTreeData;
  if (chapterId === 'c2_3') fullTreeData = ionGenerationTreeData;
  if (chapterId === 'c2_4') fullTreeData = ionSizeTreeData;
  if (chapterId === 'c3_1') fullTreeData = chemicalBondTreeData;
  if (chapterId === 'c3_2') fullTreeData = crystalTreeData;
  if (chapterId === 'c3_3') fullTreeData = interactionTreeData;
  if (chapterId === 'c4_1') fullTreeData = atomicWeightTreeData;
  if (chapterId === 'c4_2') fullTreeData = amountOfSubstanceTreeData;
  if (chapterId === 'c4_3') fullTreeData = chemicalEquationTreeData;
  if (chapterId === 'c4_4') fullTreeData = concentrationTreeData;
  if (chapterId === 'c5' || chapterId.startsWith('c5_')) fullTreeData = acidBaseTreeData;
  if (chapterId === 'c6' || chapterId.startsWith('c6_')) fullTreeData = redoxTreeData;
  return fullTreeData;
}

function legacyModalIsShared(chapterId: string): boolean {
  return (
    chapterId === 'c5' || chapterId.startsWith('c5_') ||
    chapterId === 'c6' || chapterId.startsWith('c6_')
  );
}

// -------------------------------------------------------------------
// 旧実装の複製（PracticeExplanationTree.tsx の Record 方式）
// -------------------------------------------------------------------
const LEGACY_TREE_BY_CHAPTER: Record<string, NodeData> = {
  c1_1: substanceTreeData,
  c1_2_A: separationTreeData,
  c1_2_B: componentDetectionTreeData,
  c1_3: thermalMotionTreeData,
  c2_1: atomicStructureTreeData,
  c2_2: ionTreeData,
  c2_3: ionGenerationTreeData,
  c2_4: ionSizeTreeData,
  c3_1: chemicalBondTreeData,
  c3_2: crystalTreeData,
  c3_3: interactionTreeData,
  c4_1: atomicWeightTreeData,
  c4_2: amountOfSubstanceTreeData,
  c4_3: chemicalEquationTreeData,
  c4_4: concentrationTreeData,
};

function legacyPracticeResolve(chapterId: string | undefined): NodeData | undefined {
  if (!chapterId) return undefined;
  if (LEGACY_TREE_BY_CHAPTER[chapterId]) return LEGACY_TREE_BY_CHAPTER[chapterId];
  if (chapterId === 'c5' || chapterId.startsWith('c5_')) return acidBaseTreeData;
  if (chapterId === 'c6' || chapterId.startsWith('c6_')) return redoxTreeData;
  return undefined;
}

function legacyPracticeIsShared(chapterId: string | undefined): boolean {
  return !!chapterId && (
    chapterId === 'c5' || chapterId.startsWith('c5_') ||
    chapterId === 'c6' || chapterId.startsWith('c6_')
  );
}

describe('章ID → ロジックツリーの対応付け', () => {
  it('旧2実装は、実在29章＋想定外IDのすべてで同じツリーを返していた（前提の確認）', () => {
    for (const id of ALL_IDS) {
      const a = legacyModalResolve(id);
      const b = legacyPracticeResolve(id);
      // null と undefined の違いだけは許容し、ツリーの参照が同じことを見る
      expect(a ?? null, `章ID ${id} で旧2実装がずれている`).toBe(b ?? null);
    }
  });

  it('★新実装（共通化後）が旧 Modal 実装と完全に一致する★', async () => {
    const { resolveChapterTree } = await import('../src/data/chapterTreeMap');
    for (const id of ALL_IDS) {
      expect(resolveChapterTree(id) ?? null, `章ID ${id}`).toBe(legacyModalResolve(id));
    }
  });

  it('★新実装（共通化後）が旧 Practice 実装と完全に一致する★', async () => {
    const { resolveChapterTree } = await import('../src/data/chapterTreeMap');
    for (const id of ALL_IDS) {
      expect(resolveChapterTree(id) ?? null, `章ID ${id}`).toBe(legacyPracticeResolve(id) ?? null);
    }
    // Practice 側は chapter?.id が undefined になりうる
    expect(resolveChapterTree(undefined) ?? null).toBe(legacyPracticeResolve(undefined) ?? null);
  });

  it('★isSharedUnitTree（c5/c6 判定）も旧2実装と完全に一致する★', async () => {
    const { isSharedUnitTree } = await import('../src/data/chapterTreeMap');
    for (const id of ALL_IDS) {
      expect(isSharedUnitTree(id), `章ID ${id}`).toBe(legacyModalIsShared(id));
      expect(isSharedUnitTree(id), `章ID ${id}`).toBe(legacyPracticeIsShared(id));
    }
    expect(isSharedUnitTree(undefined)).toBe(legacyPracticeIsShared(undefined));
  });

  it('c5/c6 の下位章はすべて単元共有ツリーに解決される', async () => {
    const { resolveChapterTree, isSharedUnitTree } = await import('../src/data/chapterTreeMap');
    for (const id of REAL_CHAPTER_IDS.filter((x) => x.startsWith('c5_'))) {
      expect(resolveChapterTree(id)).toBe(acidBaseTreeData);
      expect(isSharedUnitTree(id)).toBe(true);
    }
    for (const id of REAL_CHAPTER_IDS.filter((x) => x.startsWith('c6_'))) {
      expect(resolveChapterTree(id)).toBe(redoxTreeData);
      expect(isSharedUnitTree(id)).toBe(true);
    }
  });

  it('c1〜c4 は専用ツリーで、単元共有ではない', async () => {
    const { resolveChapterTree, isSharedUnitTree } = await import('../src/data/chapterTreeMap');
    const c1toC4 = REAL_CHAPTER_IDS.filter((x) => /^c[1-4]_/.test(x));
    expect(c1toC4.length).toBe(15);
    const seen = new Set<NodeData>();
    for (const id of c1toC4) {
      const t = resolveChapterTree(id);
      expect(t, `章ID ${id} にツリーが無い`).toBeTruthy();
      expect(isSharedUnitTree(id)).toBe(false);
      // 15章それぞれに別のツリーが割り当たっている（取り違えの検出）
      expect(seen.has(t!), `章ID ${id} のツリーが他章と重複している`).toBe(false);
      seen.add(t!);
    }
  });

  it('実在29章すべてにツリーが存在する（表示できない章を作っていない）', async () => {
    const { resolveChapterTree } = await import('../src/data/chapterTreeMap');
    const missing = REAL_CHAPTER_IDS.filter((id) => !resolveChapterTree(id));
    expect(missing, `ツリーが引けない章: ${missing.join(', ')}`).toEqual([]);
  });

  it('未知・他教科の章IDではツリーを返さない（誤ったフローチャートを出さない）', async () => {
    const { resolveChapterTree } = await import('../src/data/chapterTreeMap');
    for (const id of ['c1', 'c7_1', 'a1_1', 'el1_A', '', 'C5_2']) {
      expect(resolveChapterTree(id) ?? null, `章ID ${id}`).toBe(null);
    }
  });
});

// -------------------------------------------------------------------
// 番人：共通化がちゃんと行われていること
// -------------------------------------------------------------------
const ROOT = resolve(__dirname, '..');
const MAP_FILE = resolve(ROOT, 'src/data/chapterTreeMap.ts');
const MODAL = resolve(ROOT, 'src/components/ChapterFlowchartModal.tsx');
const PRACTICE = resolve(ROOT, 'src/components/PracticeExplanationTree.tsx');

// -------------------------------------------------------------------
// 旧実装の複製（Explanation.tsx の hasFlowchart。3つめのコピー）
// -------------------------------------------------------------------
function legacyHasFlowchart(chapterId: string | undefined): boolean {
  return !!(
    ['c1_1', 'c1_2_A', 'c1_2_B', 'c1_3', 'c2_1', 'c2_2', 'c2_3', 'c2_4',
     'c3_1', 'c3_2', 'c3_3', 'c4_1', 'c4_2', 'c4_3', 'c4_4'].includes(chapterId as string)
    || chapterId === 'c5' || chapterId?.startsWith('c5_')
    || chapterId === 'c6' || chapterId?.startsWith('c6_')
  );
}

describe('「その章にフローチャートがあるか」の判定', () => {
  /**
   * Explanation.tsx には hasFlowchart という、17章ぶんの章IDを
   * 直接並べた3つめのコピーがあった。
   * これは「対応表にツリーがあるか」と同じ意味なので、
   * 対応表から導出するように変えた。
   * （章を足したときに、ツリーはあるのにブロックが描画されない
   *   という食い違いを防ぐため）
   */
  it('★新実装が旧 hasFlowchart と38パターン完全一致する★', async () => {
    const { hasChapterTree } = await import('../src/data/chapterTreeMap');
    for (const id of ALL_IDS) {
      expect(hasChapterTree(id), `章ID ${id}`).toBe(legacyHasFlowchart(id));
    }
    expect(hasChapterTree(undefined)).toBe(legacyHasFlowchart(undefined));
  });

  it('hasChapterTree と resolveChapterTree の結果が矛盾しない', async () => {
    const { hasChapterTree, resolveChapterTree } = await import('../src/data/chapterTreeMap');
    for (const id of [...ALL_IDS, undefined]) {
      expect(hasChapterTree(id), `章ID ${id}`).toBe(!!resolveChapterTree(id));
    }
  });

  it('★Explanation.tsx に章IDを並べたコピーが残っていない★', () => {
    const src = readFileSync(resolve(ROOT, 'src/components/Explanation.tsx'), 'utf8');
    // 15章の羅列（'c1_1', ... 'c4_4'）が残っていないこと
    expect(src, "Explanation.tsx に章IDの羅列が残っている").not.toMatch(/'c1_2_A',\s*'c1_2_B'/u);
    expect(src, "Explanation.tsx に c5/c6 の startsWith 判定が残っている")
      .not.toMatch(/startsWith\('c5_'\)/u);
  });
});

describe('番人（共通化の維持）', () => {
  it('★2つの画面が共通の対応表を使っている★', () => {
    for (const f of [MODAL, PRACTICE]) {
      expect(readFileSync(f, 'utf8'), `${f} が chapterTreeMap を使っていない`)
        .toMatch(/from '\.\.\/data\/chapterTreeMap'/u);
    }
  });

  it('★画面側に17本のツリーを個別 import したコピーが残っていない★', () => {
    for (const f of [MODAL, PRACTICE]) {
      const src = readFileSync(f, 'utf8');
      expect(src, `${f} に chemistryData の直接 import が残っている`)
        .not.toMatch(/from '\.\.\/data\/chemistryData'/u);
    }
  });

  it('★画面側に対応表・c5c6判定のコピーが残っていない★', () => {
    for (const f of [MODAL, PRACTICE]) {
      const src = readFileSync(f, 'utf8');
      expect(src, `${f} に TREE_BY_CHAPTER のコピーが残っている`)
        .not.toMatch(/TREE_BY_CHAPTER\s*:\s*Record/u);
      expect(src, `${f} に isSharedUnitTree の実装コピーが残っている`)
        .not.toMatch(/(const|function)\s+isSharedUnitTree\s*[=(]/u);
      // c5/c6 の startsWith 判定を画面側で再実装していない
      expect(src, `${f} に c5/c6 の startsWith 判定が残っている`)
        .not.toMatch(/startsWith\('c5_'\)/u);
    }
  });

  it('★対応表は data 層に置く（utils → data の逆流を作らない）★', () => {
    const src = readFileSync(MAP_FILE, 'utf8');

    /*
     * このテストが守りたいのは「対応表が data 層にあり、
     * utils へ逆流していないこと」である。
     *
     * もともとは `from './chemistryData'` があることを確かめていたが、
     * それは「data 層の隣のファイルからツリーを読んでいる」ことの
     * 代理表現にすぎなかった。
     *
     * ★いまは図データ専用のファイル（chemistryTreeData）から読む★
     * この対応表が使うのは図だけで、問題文・選択肢・解説は使わない。
     * それなのに chemistryData 経由で読むと、この表を読み込んだ画面すべてに
     * 化学基礎の問題データがついてきてしまっていた
     * （13 ファイル / 1,187,105 バイト → 2 ファイル / 272,053 バイト）。
     *
     * chemistryData 側は再公開しているだけなので、
     * 直接読んでも 17 ツリーすべて `===` で同一参照になる（確認済み）。
     */
    expect(src, '図データを data 層の隣のファイルから読んでいない')
      .toMatch(/from '\.\/chemistryTreeData'/u);

    /*
     * ★軽さを固定する（元に戻したら赤くする）★
     * chemistryData を読むと問題データ約 900KB がついてくるので、
     * この対応表からは読まない。
     */
    expect(src, 'chemistryData を読むと問題データまでついてくる')
      .not.toMatch(/from '\.\/chemistryData'/u);

    // 型以外で utils を実行時 import していないこと（型は import type のみ）
    const runtimeUtilsImport = /^import\s+(?!type)[^;]*from '\.\.\/utils\//mu;
    expect(src, 'chapterTreeMap.ts が utils を実行時 import している').not.toMatch(runtimeUtilsImport);
  });

  it('対応表の章数が17（c1〜c4の15章 + c5 + c6）である', async () => {
    const { CHAPTER_TREE_COUNT } = await import('../src/data/chapterTreeMap');
    expect(CHAPTER_TREE_COUNT).toBe(17);
  });
});
