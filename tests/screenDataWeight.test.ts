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

/**
 * 相対 import を実ファイルに解決する（node_modules は依存グラフに含めない）
 *
 * ★拡張子付きで書かれた import を必ず拾うこと★
 *
 * ここは一度、実際に取りこぼしていた。
 *   src/main.tsx: import App from './App.tsx';
 * のように拡張子まで書いてある場合、
 * `base + '.ts'` / `base + '.tsx'` だけを試すと
 * `App.tsx.ts` / `App.tsx.tsx` を探して見つからず、null を返していた。
 *
 * null を返すと、そのファイルから先の依存がすべて追跡されなくなる。
 * つまり ★重いデータを './heavy.ts' の形で読んでも「0バイト」と報告される★。
 * 落ちるのではなく緑になる壊れ方なので、いちばん危ない。
 *
 * そのため「そのパスがそのままファイルとして存在する場合」を
 * 最初に見るようにしてある。
 * この取りこぼしが起きていないことは
 * 「監視役そのものの健康診断」のテストが見張っている
 * （main.tsx から何も到達しなくなったら落ちる）。
 */
function resolveSpecifier(fromFile: string, spec: string): string | null {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), spec);

  // 1) 拡張子まで書かれている（'./App.tsx'）→ そのまま存在するか見る
  if (existsSync(base) && statSync(base).isFile()) return base;

  // 2) 拡張子が省略されている（'./App'）
  for (const ext of EXTS) {
    if (existsSync(base + ext)) return base + ext;
  }

  // 3) ディレクトリ指定（'./learningContent'）→ index.ts(x)
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

  /*
   * -------------------------------------------------------------------
   * ★アプリ全体の起動時の重さ（いちばん上位の指標）★
   * -------------------------------------------------------------------
   *
   * ■ なぜこの門が必要になったのか（私自身の誤報告の記録）
   *
   * 上の SCREEN_BUDGETS は「画面ごと」の重さを守る。
   * 画面を1枚ずつ軽くしていくのには有効だが、
   * ★画面が全部軽くても、アプリ全体が軽くなったとは限らない★。
   *
   * 実際にそうなっていた。
   * 私は以前、ビルド結果に対して
   *
   *     head -c 400 dist/assets/index-*.js | grep 'from"./data-'
   *
   * を実行し、何も出てこなかったことから
   * 「起動時チャンクは data チャンクを静的に読んでいない」と報告した。
   * これは誤りだった。head -c 400 は★先頭400バイトだけ★を見る検査で、
   * 実際の import 文はもっと後ろにもある。
   * ファイル全体を走査すると事実は逆で、
   *
   *   - index.html の modulepreload に data チャンクが入っている
   *   - index チャンクは data チャンクを静的 import している
   *   - 起動時に必ず落ちる JS が 5,253,265 B（5.01 MB）
   *   - ★遅延で落ちるチャンクは 0 B（1つも無い）★
   *
   * だった。つまり「画面を軽くした」成果は依存関係としては正しくても、
   * 配信量としては1バイトも遅延化できていなかった。
   *
   * この失敗の教訓は
   *   「部分の指標だけを見ていると、全体が悪いことに気づけない」
   *   「弱い測り方（先頭だけ・目視）は、嘘の安心を作る」
   * の二つで、どちらも人間の注意力では防げない。だから門にする。
   *
   * ■ この門が測るもの
   *
   * 本当の入口（src/main.tsx）から★静的 import だけ★で辿れる src/data の総量。
   * 動的 import（await import）は数えない。
   * これは「manualChunks が src/data を1つのチャンクにまとめている限り、
   * 起動時に必ずダウンロードされる量」の下限に相当する。
   *
   * ■ 予算の決め方
   *
   * 現状の実測は 75 ファイル。
   * 予算は「今より悪化したら落ちる」位置に置く。つまりこれは
   * ★上限であって目標ではない★。
   * 起動時の重さを減らす作業が進んだら、この数字を下げていく
   * （下げ忘れても悪化は検出できるが、下げれば後戻りも検出できる）。
   *
   * 実コードのバイト数ではなくファイル件数で見ているのは、
   * 問題を増やすとバイト数は正当に増えるのに対し、
   * ★「起動時に何ファイル引きずるか」は構造の性質で、問題数では増えない★ため。
   * 問題を1問足しただけでこの門が落ちるのでは、
   * 「問題を素早く増やせる」という目的と衝突してしまう。
   */
  it('★アプリ全体（main.tsx）の起動時 src/data 読み込みが悪化していない★', () => {
    const { dataFiles } = reachFrom('src/main.tsx');

    // 現状の実測値。ここを増やす変更は「起動が重くなる」変更なので止める。
    /*
     * 現状の実測値。作業が進むたびに★下げていく★。
     *
     * 履歴（下げた記録＝後戻りを検出できる範囲が広がった記録）:
     *   75 件 / 3,681,952 B … 全画面が静的 import だったとき（遅延チャンク 0 個）
     *   59 件 / 2,971,031 B … まとめプリント（LearningViewer）を遅延読み込みにした後
     *                          ビルド実測: 起動時 5,253,265 → 4,554,851 B（−698,414 B）
     *                          遅延        0 → 699,246 B（初めて遅延チャンクができた）
     *   16 件 /   854,132 B … 単元選択・演習・解説の3画面を遅延読み込みにし、
     *                          さらに data チャンクを教科ごとに割った後
     *                          ビルド実測: 起動時 4,554,851 → 2,628,864 B（−1,925,987 B / −42%）
     *                          遅延        699,246 → 2,629,867 B
     *                          ＝★教科の問題データが起動時から全部消えた★
     *   12 件 /   730,467 B … 分野選択（AdvancedFieldSelection）も遅延にした後
     *                          ビルド実測: 起動時 2,628,864 → 2,534,962 B（−93,902 B）
     *                          合計 4,554,851 → 2,534,962 B（★−2,019,889 B / −44%★）
     *                          この4本目は「思い込みで3本と決めていた」のを
     *                          ★下の玄関チェックが見つけた★もの。
     */
    const CURRENT = 12;

    expect(
      dataFiles.length,
      `★起動時に静的読み込みされる src/data のファイル数が ${dataFiles.length} 件（上限 ${CURRENT} 件）★\n` +
        'main.tsx から静的 import だけで辿れる src/data が増えている。\n' +
        '＝ その分が起動時に必ずダウンロードされる。\n' +
        '重い教科データを増やす場合は、静的 import ではなく\n' +
        '動的 import（await import）にするか、軽い索引（chapterIndex.generated）を使う。\n' +
        `到達している src/data:\n  ${dataFiles.join('\n  ')}`,
    ).toBeLessThanOrEqual(CURRENT);
  });

  it('この全体指標が本当に重さを見ている（監視役そのものの健康診断）', () => {
    /*
     * 上の門が「0件」を返して常に緑、という壊れ方をしていないか確かめる。
     *
     * ★この検査は前に「わざと落ちる」ように書いてあった★
     * 以前はここに
     *     expect(dataFiles).toContain('src/data/allChapters.ts');
     * と書いてあり、コメントに
     *   「起動時から教科データ本体を追い出せたら、この期待は成り立たなくなる。
     *     そのときは『玄関に到達していないこと』に書き換える。
     *     つまりこの行は、作業が完了したことを教えてくれる目印でもある。」
     * と残していた。
     *
     * 実際にその通りに落ちた（実測ログ）:
     *   AssertionError: expected [ 'src/data/advancedFields.ts', …(15) ]
     *                   to include 'src/data/allChapters.ts'
     *
     * ★これは「テストが壊れた」のではなく「目標に到達した」という合図★
     * なので、予定どおり逆向き（到達していないこと）に書き換える。
     * 落ちた事実そのものが、遅延読み込みが本当に効いた証拠になっている。
     */
    const { dataFiles, dataBytes } = reachFrom('src/main.tsx');

    // 門が「常に0件」を返す壊れ方をしていないこと（監視役が生きている確認）
    expect(dataFiles.length).toBeGreaterThan(0);
    expect(dataBytes).toBeGreaterThan(0);

    /*
     * ★全教科を集めるハブに起動時から到達していないこと★
     *
     * allChapters は6教科ぜんぶの問題データを import しているので、
     * ここに静的に届いた時点で「起動時に全教科ぶん落ちてくる」ことになる。
     * 逆に言えば、この1行を守り続ける限り、
     * 教科を何科目増やしても起動の重さは増えない。
     *
     * この行が赤くなったときは、どこかの画面が
     *   import { findChapterById } from '../data/allChapters'
     * のような静的 import を足したということ。
     * その画面を React.lazy にするか、章の検索を遅延側へ移すこと
     * （やり方は src/components/QuizScreens.tsx を参考にする）。
     */
    expect(dataFiles).not.toContain('src/data/allChapters.ts');

    /*
     * 各教科の問題データの「玄関」にも届いていないこと。
     * ハブ経由でなく直接 import された場合を捕まえる。
     */
    for (const entry of [
      'src/data/chemistryData.ts',
      'src/data/chemistryAdvancedData.ts',
      'src/data/englishListeningData.ts',
      'src/data/englishGrammarData.ts',
      'src/data/mathData.ts',
      'src/data/biologyBasicData.ts',
    ]) {
      expect(
        dataFiles,
        `★起動時に ${entry} へ静的に到達している★\n` +
          'これは「アプリを開いただけで、その教科の問題データを全部ダウンロードする」状態。\n' +
          'その画面を React.lazy にして、問題データを触る処理を遅延側へ移すこと。',
      ).not.toContain(entry);
    }
  });
});
