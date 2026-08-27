/**
 * ロジックツリー用ユーティリティ（src/utils/logicTreeUtils.ts）のテスト
 *
 * ■ このテストが守っているもの
 *   1. 実際に使われている extractSectionByChapter のふるまい
 *      （c5/c6 のフローチャートを章ごとに切り出す処理。ここが壊れると
 *        フローチャートに関係ない章の内容まで出る／出なくなる）
 *   2. 使われていない関数が「使われていないまま」であること
 *      ＝ 誰かが使い始めたらテストが落ちて気づけるようにする
 *   3. utils → data の import が復活していないこと
 *
 * ■ なぜ「使われていない」ことをテストするのか
 *   logicTreeUtils.ts には、どこからも呼ばれていない関数が残っていた。
 *   単に消すのではなく、まず「本当に誰も使っていない」ことを機械的に
 *   検査してから消す。将来同じ形の関数が復活したときも、このテストが
 *   「呼ばれていないものが増えた」ことを教えてくれる。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { extractSectionByChapter } from '../src/utils/logicTreeUtils';
import type { NodeData } from '../src/utils/logicTreeTypes';

const SRC_DIR = resolve(__dirname, '..', 'src');
const HOME = resolve(SRC_DIR, 'utils/logicTreeUtils.ts');

/** src 配下の .ts / .tsx を全部読み込む（走査は1回だけにする） */
function readAllSources(): { path: string; text: string }[] {
  const out: { path: string; text: string }[] = [];
  const { readdirSync, statSync } = require('node:fs') as typeof import('node:fs');
  const walk = (dir: string) => {
    for (const name of readdirSync(dir)) {
      const p = resolve(dir, name);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (/\.tsx?$/.test(name)) out.push({ path: p, text: readFileSync(p, 'utf8') });
    }
  };
  walk(SRC_DIR);
  return out;
}

const ALL_SOURCES = readAllSources();

/** 与えた名前が logicTreeUtils.ts 以外の src ファイルに出てくるか */
function mentionedOutsideHome(name: string): string[] {
  const re = new RegExp(`\\b${name}\\b`);
  return ALL_SOURCES.filter((f) => f.path !== HOME && re.test(f.text)).map((f) =>
    f.path.replace(SRC_DIR, 'src'),
  );
}

// ===================================================================
// 1. 実際に使われている extractSectionByChapter
// ===================================================================
describe('extractSectionByChapter（c5/c6 のフローチャートを章ごとに切り出す）', () => {
  const tree: NodeData = {
    id: 'root',
    label: '酸と塩基',
    step: null,
    children: [
      { id: 's1', label: '重要事項①', step: 1, children: [{ id: 's1c', label: '子1', step: null }] },
      { id: 's2', label: '重要事項②', step: 2, children: [{ id: 's2c', label: '子2', step: null }] },
      { id: 's3', label: '重要事項③', step: 3 },
    ],
  } as NodeData;

  it('下位章（c5_2）は対応する1セクションだけを子に持つ', () => {
    const r = extractSectionByChapter(tree, 'c5_2');
    expect(r).not.toBeNull();
    expect(r!.id).toBe('root');
    expect(r!.children).toHaveLength(1);
    expect(r!.children![0].id).toBe('s2');
    // 切り出したセクションの中身は削らない
    expect(r!.children![0].children?.[0].id).toBe('s2c');
  });

  it('章番号は1始まりで children の index に対応する', () => {
    expect(extractSectionByChapter(tree, 'c5_1')!.children![0].id).toBe('s1');
    expect(extractSectionByChapter(tree, 'c5_3')!.children![0].id).toBe('s3');
    expect(extractSectionByChapter(tree, 'c6_2')!.children![0].id).toBe('s2');
  });

  it('単元トップ（c5 / c6）はフルツリーをそのまま返す', () => {
    expect(extractSectionByChapter(tree, 'c5')).toBe(tree);
    expect(extractSectionByChapter(tree, 'c6')).toBe(tree);
  });

  it('想定外の章IDはフルツリーをそのまま返す（画面を空にしない）', () => {
    for (const id of ['', 'c1_1', 'c5_', 'c7_2', 'c5_2_A', 'xxx']) {
      expect(extractSectionByChapter(tree, id), id).toBe(tree);
    }
  });

  it('存在しない章番号はフルツリーに落とす（フォールバック）', () => {
    expect(extractSectionByChapter(tree, 'c5_9')).toBe(tree);
    expect(extractSectionByChapter(tree, 'c5_0')).toBe(tree);
  });

  it('ツリーが無いときは null', () => {
    expect(extractSectionByChapter(null, 'c5_2')).toBeNull();
    expect(extractSectionByChapter(undefined, 'c5_2')).toBeNull();
  });

  it('元のツリーを書き換えない（他の画面に影響しない）', () => {
    const before = JSON.stringify(tree);
    extractSectionByChapter(tree, 'c5_2');
    expect(JSON.stringify(tree)).toBe(before);
  });
});

// ===================================================================
// 2. 「使われていない関数」が増えていないことの検査
// ===================================================================
describe('logicTreeUtils の使用状況', () => {
  it('extractSectionByChapter は実際に画面から使われている', () => {
    const users = mentionedOutsideHome('extractSectionByChapter');
    expect(users.length).toBeGreaterThan(0);
    // 呼び出しているのはフローチャートを出す2画面
    expect(users.some((p) => p.endsWith('components/PracticeExplanationTree.tsx'))).toBe(true);
    expect(users.some((p) => p.endsWith('components/ChapterFlowchartModal.tsx'))).toBe(true);
  });

  it('★どこからも使われていない関数を残していない★', () => {
    const home = readFileSync(HOME, 'utf8');
    // logicTreeUtils.ts が export している名前を全部拾う
    const exported = [...home.matchAll(/export\s+(?:const|function)\s+([a-zA-Z_][a-zA-Z0-9_]*)/gu)].map(
      (m) => m[1],
    );
    expect(exported.length).toBeGreaterThan(0);

    const unused = exported.filter((name) => mentionedOutsideHome(name).length === 0);
    expect(
      unused,
      `logicTreeUtils.ts が export しているが誰も使っていない: ${unused.join(', ')}`,
    ).toEqual([]);
  });

  it('★utils → data の import を持ち込んでいない（依存の向きを守る）★', () => {
    const home = readFileSync(HOME, 'utf8');
    expect(home, 'logicTreeUtils.ts が src/data を import している').not.toMatch(
      /from '\.\.\/data\//u,
    );
  });

  it('画面側（Explanation.tsx）に同じ実装のコピーを残していない', () => {
    const exp = readFileSync(resolve(SRC_DIR, 'components/Explanation.tsx'), 'utf8');
    // filterTree は logicTreeUtils.ts と1文字違い（export の有無）のコピーだった
    expect(exp, 'Explanation.tsx に filterTree のコピーが残っている').not.toMatch(
      /const filterTree\s*=/u,
    );
  });
});
