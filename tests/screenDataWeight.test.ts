/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 画面ごとの「起動時に読み込む教科データの重さ」を守る共通ゲート
 * ==============================================================
 *
 * ★なぜ画面ごとにテストを書き散らさないのか★
 *
 * 「この画面は mathData を import していないこと」というような
 * 文字列検索のテストを画面ごとに足していくと、
 *
 *   - 画面が増えるたびに同じようなテストが増える
 *   - 直接 import していなくても、間に1枚ファイルを挟むと通ってしまう
 *     （＝重さは戻っているのにテストは緑になる、いちばん危ない失敗）
 *
 * という二つの問題が出る。
 * このアプリはこれから問題数が莫大になっていく前提なので、
 * 「重さが戻っていないこと」は ★依存を実際に辿って★ 確かめる必要がある。
 *
 * そこでこのファイルでは、静的 import の連鎖を実際に歩いて
 * 「その画面を表示するために本当に読み込まれる src/data」を出し、
 *
 *   (1) 教科データの「玄関」に到達していないこと
 *   (2) 合計バイト数が計測済みの予算を超えていないこと
 *
 * の二つを見る。画面を軽くしたら、この表に1行足すだけで固定できる。
 *
 * ★import type の扱い（ここが今回いちばん効いた知見）★
 *
 *   import type { X } from './y'   → 実行時に完全に消える（依存ではない）
 *   import { type X } from './y'   → ★モジュールの解決が走るので消えない★
 *
 * 後者は見た目が「型だけ」なので安全に見えるが、実際には y とその先が
 * 全部バンドルされる。下の歩き方は前者だけを除外しているので、
 * 後者を書いた瞬間ここが赤くなる（＝罠を機械が見張ってくれる）。
 */

import { readFileSync, existsSync, statSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { describe, it, expect } from 'vitest';

const ROOT = resolve(__dirname, '..');
const EXTS = ['.ts', '.tsx'];

/** 相対 import を実ファイルに解決する（node_modules は依存グラフに含めない） */
function resolveSpecifier(fromFile: string, spec: string): string | null {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), spec);
  for (const ext of EXTS) {
    if (existsSync(base + ext)) return base + ext;
  }
  if (existsSync(base) && statSync(base).isDirectory()) {
    for (const ext of EXTS) {
      const candidate = join(base, 'index' + ext);
      if (existsSync(candidate)) return candidate;
    }
  }
  return null;
}

/**
 * そのファイルが「実行時に」読み込む相対モジュールを返す。
 *
 * - `export { X } from './y'` も実行時の依存なので拾う（再公開も読み込みが走る）
 * - `import type ...` だけは実行時に消えるので除外する
 * - `import './x'`（副作用のみ）も依存として拾う
 * - 動的 import（`await import('./x')`）は「あとで読む」ものなので
 *   起動時の重さには数えない（＝これが軽くするための正しい逃げ道になる）
 */
function runtimeDeps(file: string): string[] {
  const src = readFileSync(file, 'utf8');
  const out: string[] = [];

  const re = /(?:^|\n)\s*(?:import|export)\s+([^;]*?)\s*from\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    // `import type { ... } from` / `export type { ... } from` は実行時に消える
    if (/^type\b/.test(m[1].trim())) continue;
    const resolved = resolveSpecifier(file, m[2]);
    if (resolved) out.push(resolved);
  }

  const sideEffectRe = /(?:^|\n)\s*import\s*['"](\.[^'"]+)['"]/g;
  while ((m = sideEffectRe.exec(src))) {
    const resolved = resolveSpecifier(file, m[1]);
    if (resolved) out.push(resolved);
  }

  return out;
}

/**
 * ★重さは「説明コメントを除いた実コード」で数える★
 *
 * 以前はファイルサイズ（statSync().size）をそのまま足していた。
 * これには測り方の嘘がある。コメントはビルド時に消えるので
 * 配信量には1バイトも入らないのに、重さとして数えられてしまう。
 *
 * 実測（このアプリの src/data）:
 *
 *   subjectLabels.ts       5,071 B 中 実コード   443 B（91% がコメント）
 *   advancedFields.ts      8,374 B 中 実コード   600 B（93% がコメント）
 *   chapterCatalog.ts      8,371 B 中 実コード 1,319 B（84% がコメント）
 *   chemistryData.ts      46,838 B 中 実コード 38,633 B（18% がコメント）
 *
 * つまり ★なぜそう書いたかを丁寧に書いたファイルほど重いと判定される★。
 * 実際にこの門は、教科名の対応表を1か所に集約した整理（実コード 443 B の
 * 追加）で予算を 1,029 バイト超過したと報告した。配信物は増えていない。
 *
 * これを「予算を緩める」で片付けると、門の目が本当に鈍る。
 * 数え方を直すのが正しい。コメントを消しても
 * 教科データ本体は 38,633 B 残るので、
 * 「問題データ本体が戻ってきた」ときは今までどおり必ず超える。
 *
 * 注意: ここでやっているのは行単位の素朴な除去で、
 * 構文解析ではない（文字列の中に // が入っていても消してしまう）。
 * それでも目的には足りる。見たいのは「桁」であって正確なバイト数ではなく、
 * 少なく数える方向の誤差しか出ないので、
 * ★重いものを軽いと誤判定する危険はない★（下の健康診断で確認している）。
 */
function codeBytesOf(absFile: string): number {
  const kept: string[] = [];
  let inBlock = false;
  for (const line of readFileSync(absFile, 'utf8').split('\n')) {
    const t = line.trim();
    if (inBlock) {
      if (t.includes('*/')) inBlock = false;
      continue;
    }
    if (t.startsWith('/*')) {
      if (!t.includes('*/')) inBlock = true;
      continue;
    }
    if (t.startsWith('//')) continue;
    kept.push(line);
  }
  return Buffer.byteLength(kept.join('\n'), 'utf8');
}

interface Reach {
  files: string[];
  dataFiles: string[];
  dataBytes: number;
}

/** 入口から静的 import を辿って、到達するファイル一覧と src/data の重さを出す */
function reachFrom(entry: string): Reach {
  const start = join(ROOT, entry);
  if (!existsSync(start)) {
    throw new Error(`入口ファイルが見つからない: ${entry}`);
  }

  const seen = new Set<string>();
  const stack = [start];
  while (stack.length) {
    const file = stack.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    for (const dep of runtimeDeps(file)) {
      if (!seen.has(dep)) stack.push(dep);
    }
  }

  const files = [...seen].map((f) => relative(ROOT, f)).sort();
  const dataFiles = files.filter((f) => f.startsWith('src/data/'));
  const dataBytes = dataFiles.reduce((sum, f) => sum + codeBytesOf(join(ROOT, f)), 0);
  return { files, dataFiles, dataBytes };
}

/*
 * ★教科データの「玄関」★
 *
 * ここに一歩でも入ると、その教科の問題文・選択肢・解説が全部ついてくる。
 * allChapters は全教科をまとめる集約点なので、
 * 触れた時点で6教科ぶん全部が来る（いちばん重い経路）。
 *
 * 「玄関に入っていないこと」を見るのが要点で、
 * 個々の問題ファイル名を並べても意味がない（増え続けるので保守できない）。
 *
 * -------------------------------------------------------------------
 * ■ chapterCatalog.ts をこの一覧から外した理由
 * -------------------------------------------------------------------
 * 以前は chapterCatalog.ts も玄関だった（getPartsOfSubject 経由で
 * 6教科ぶんの本体を引き込み、実測 47 ファイル / 2,578,344 バイト）。
 * いまは軽い索引だけを読むように直したので、
 * ここを通っても問題データは一切ついてこない（実測 2 ファイル / 43,993 バイト）。
 *
 * ★「重くないこと」を名前で信じているのではない★
 * 下の SCREEN_BUDGETS に chapterCatalog.ts 自身の予算行を置いてあるので、
 * もし将来このファイルが教科データ本体を読むように戻れば、
 * そちらのテストが必ず落ちる。
 */
const SUBJECT_DATA_ENTRANCES = [
  'src/data/allChapters.ts',
  'src/data/chemistryData.ts',
  'src/data/chemistryAdvancedData.ts',
  'src/data/englishListeningData.ts',
  'src/data/mathData.ts',
  'src/data/biologyBasicData.ts',
  'src/data/englishGrammarData.ts',
] as const;

/*
 * ★軽くし終わった画面の一覧（予算表）★
 *
 * budget は「計測した実測値より少し上」に置いている。
 * ぴったりにすると、章名を1つ足しただけで赤くなって邪魔になるだけで、
 * 逆に緩すぎると教科データ本体が戻ってきても気づけない。
 * 教科データ本体は1ファイルで数十万バイトあるので、
 * この幅（数万バイト）なら「本体が戻った」ときは必ず超える。
 *
 * why には「なぜその画面がこれで足りるのか」を書く。
 * ここが説明できない画面は、そもそも軽くできていない。
 */
const SCREEN_BUDGETS: Array<{ entry: string; budget: number; why: string }> = [
  {
    entry: 'src/components/SubjectSelection.tsx',
    budget: 40_000,
    why: 'タイトル画面。章の表示名と収録数の数字しか使わないので、索引だけで足りる',
  },
  {
    entry: 'src/components/Home.tsx',
    budget: 120_000,
    why: 'ホーム。進捗の分母（大問数）と章名だけ使うので、索引＋テーマ＋お知らせで足りる',
  },
  {
    entry: 'src/components/Leaderboard.tsx',
    budget: 100_000,
    why: 'ランキング。章の絞り込みプルダウンに ID と表示名を並べるだけなので索引で足りる',
  },
  /*
   * ここから下は「図（ロジックツリー）しか使わない」画面。
   *
   * 図データ（chemistryTreeData.ts）は 264,465 バイトあり索引より重いが、
   * ★これは実際に画面に描画している中身そのもの★ なので削れない。
   * 削れたのは「図を読むついでに問題データまで読んでいた」ぶんで、
   * chemistryData 経由をやめたことで約 900KB が消えた。
   */
  {
    entry: 'src/components/LogicalTree.tsx',
    budget: 300_000,
    why: 'ロジックツリー画面。描画するのは図だけなので図データのみで足りる',
  },
  {
    entry: 'src/components/Flowchart.tsx',
    budget: 300_000,
    why: 'フローチャート画面。描画するのは図だけなので図データのみで足りる',
  },
  {
    entry: 'src/data/chapterTreeMap.ts',
    budget: 300_000,
    why: '章ID→図の対応表。図の参照しか持たないので図データのみで足りる',
  },
  /*
   * ここから下は先生ダッシュボード側。
   *
   * 出しているのは到達率（解いた大問数 / その章の大問数）と章名だけで、
   * 問題文・選択肢・解説は1文字も表示していない。
   * それにも関わらず教科データ本体を読んでいたため、実測で
   *   chapterCatalog.ts   47 ファイル / 2,589,638 バイト
   *   TeacherDashboard    47 ファイル / 2,589,638 バイト
   * になっていた。索引に切り替えて 43,993 / 50,474 バイトになった。
   *
   * ★ここは「分母」を作る場所なので、軽さより正しさが優先★
   * 索引が古いと到達率の分母だけが古くなり、「解いたのに％が上がらない」
   * という最も原因の分からない不具合になる。それは
   * tests/chapterIndex.test.ts と tests/chapterCatalog.test.ts が
   * 教科データ本体と1件ずつ突き合わせて防いでいる。
   * この予算行が見ているのは重さだけである。
   */
  {
    entry: 'src/data/chapterCatalog.ts',
    budget: 80_000,
    why: '章カタログ。返すのは章ID・章名・大問数の3項目だけなので索引で足りる',
  },
  {
    entry: 'src/components/TeacherDashboard.tsx',
    budget: 100_000,
    why: '先生ダッシュボード。到達率の数字と章名しか出さないので索引＋テーマで足りる',
  },
];

describe('画面ごとの起動時の重さ（教科データを読み込みすぎていないか）', () => {
  it.each(SCREEN_BUDGETS)('$entry は教科データの玄関に到達しない（$why）', ({ entry }) => {
    const { dataFiles } = reachFrom(entry);
    const touched = SUBJECT_DATA_ENTRANCES.filter((e) => dataFiles.includes(e));
    expect(
      touched,
      `${entry} が教科データの玄関に到達している: ${touched.join(', ')}\n` +
        `到達している src/data:\n  ${dataFiles.join('\n  ')}`,
    ).toEqual([]);
  });

  it.each(SCREEN_BUDGETS)('$entry の src/data 読み込み量が予算内（$budget バイト以内）', ({ entry, budget }) => {
    const { dataFiles, dataBytes } = reachFrom(entry);
    expect(
      dataBytes,
      `${entry} の src/data が ${dataBytes.toLocaleString()} バイト（予算 ${budget.toLocaleString()}）\n` +
        `内訳（説明コメントを除いた実コードのバイト数）:\n  ${dataFiles
          .map((f) => `${codeBytesOf(join(ROOT, f))} ${f}`)
          .join('\n  ')}`,
    ).toBeLessThanOrEqual(budget);
  });

  it('この歩き方が本当に重さを検出できる（監視役そのものの健康診断）', () => {
    /*
     * ★テストが機能していることをテストする★
     *
     * 上のテストは「重くない」ことを確かめている。
     * だが歩き方（resolve や正規表現）が壊れていると、
     * 何も到達しなくなって全部緑になる ＝ 監視していないのに安心する、
     * という最悪の状態になりうる。
     *
     * そこで「重いことが分かっている入口」を1つ測って、
     * ちゃんと重さを検出できることを確認する。
     * ChapterSelection は現時点でまだ軽くできていない画面で、
     * 教科データ本体に到達しているのが正しい状態。
     */
    const heavy = reachFrom('src/components/ChapterSelection.tsx');
    expect(heavy.dataFiles.length).toBeGreaterThan(20);
    expect(heavy.dataBytes).toBeGreaterThan(1_000_000);
    expect(heavy.dataFiles).toContain('src/data/allChapters.ts');
  });

  it('索引そのものは教科データを一切読み込まない（葉であること）', () => {
    const { files, dataFiles } = reachFrom('src/data/chapterIndex.generated.ts');
    // 自分自身だけ
    expect(files).toEqual(['src/data/chapterIndex.generated.ts']);
    expect(dataFiles).toEqual(['src/data/chapterIndex.generated.ts']);
  });
});
