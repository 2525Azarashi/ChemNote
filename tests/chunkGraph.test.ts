/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * チャンクの分け方が「真っ白」を起こさないことを守る門
 * ====================================================
 *
 * ★なぜこのファイルが必要になったのか（実際に踏んだ失敗の記録）★
 *
 * 問題データ（src/data）を教科ごとのチャンクに割るとき、過去に
 *   Cannot access 'D' before initialization
 * で画面が真っ白になったことがある。原因は
 * ★チャンク間の循環★ で、
 *   チャンクA が B の中身を待ち、B も A の中身を待つ
 * という状態になると、片方がまだ初期化されていないまま参照される。
 *
 * 今回そこを避けるために、設定を書く前に自作スクリプトで
 * 依存の辺を数えて「循環なし」を確認した。
 * ★ところがビルドしたら循環が出た。★
 *
 *   Circular chunk: data-shared -> data -> data-shared
 *
 * 自作スクリプトが src/data の中の辺しか見ていなかったためで、
 * 実際の回り道は src/utils を経由していた:
 *
 *   src/data/explanationPostProcess → src/utils/explanationFormat
 *                                   → src/data/teachingTypes
 *   src/data/mockExamData           → src/data/unitTeaching
 *
 * ★教訓: 依存グラフの一部だけを見た「安全です」は信用できない。★
 * しかもこの間違いは「自分の測定器が嘘をついていた」ので、
 * ビルドを回すまで気づけなかった。
 *
 * だから、その場しのぎでコメントに書き残すのではなく、
 * ★src 配下すべてを対象にした循環検査を常設の門にする。★
 * 教科を増やすとき・チャンクの分け方を変えるときに、
 * ビルドを待たずにここで落ちる。
 *
 * ■ この門が守っているもの（2つ）
 *
 *   (1) manualChunks の分け方でチャンク間の循環ができないこと
 *       → 真っ白（Cannot access 'D' before initialization）の再発防止
 *   (2) vite.config.ts の振り分け規則と、この検査の規則がズレていないこと
 *       → 「検査は通るが実物は違う」という、いちばん危ない嘘を防ぐ
 *
 * (2) が無いと、vite.config.ts だけ書き換えたときに
 * この門が「古い分け方」を検査して緑のままになってしまう。
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { describe, it, expect } from 'vitest';

const ROOT = resolve(__dirname, '..');
const EXTS = ['.ts', '.tsx'];

const rel = (p: string) => relative(ROOT, p).split('\\').join('/');

/** 相対 import を実ファイルに解決する（拡張子付きの指定も拾う） */
function resolveSpecifier(fromFile: string, spec: string): string | null {
  if (!spec.startsWith('.')) return null;
  const base = resolve(dirname(fromFile), spec);
  if (existsSync(base) && statSync(base).isFile()) return base;
  for (const ext of EXTS) if (existsSync(base + ext)) return base + ext;
  if (existsSync(base) && statSync(base).isDirectory()) {
    for (const ext of EXTS) {
      const c = join(base, 'index' + ext);
      if (existsSync(c)) return c;
    }
  }
  return null;
}

/**
 * そのファイルが「実行時に静的に」読み込む相対モジュールを返す。
 *
 * - `export { X } from './y'`（再公開）も実行時の依存なので拾う
 * - `import type ...` は実行時に消えるので除外
 * - 動的 import（`await import('./x')`）は★チャンクの境界そのもの★なので
 *   循環判定では辺として数えない（数えると正しい逃げ道が禁止されてしまう）
 */
function staticDeps(file: string): string[] {
  const src = readFileSync(file, 'utf8');
  const out: string[] = [];
  const re = /(?:^|\n)\s*(?:import|export)\s+([^;]*?)\s*from\s*['"]([^'"]+)['"]/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (/^type\b/.test(m[1].trim())) continue;
    const r = resolveSpecifier(file, m[2]);
    if (r) out.push(r);
  }
  // 副作用のみの import（import './x'）
  const re2 = /(?:^|\n)\s*import\s*['"]([^'"]+)['"]/g;
  while ((m = re2.exec(src))) {
    const r = resolveSpecifier(file, m[1]);
    if (r) out.push(r);
  }
  return out;
}

function walk(dir: string, acc: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.tsx?$/.test(e.name)) acc.push(p);
  }
  return acc;
}

/**
 * ★vite.config.ts の manualChunks と同じ振り分け規則★
 *
 * ここを手で二重に書いているのは、vite.config.ts をテストから
 * そのまま読み込むと defineConfig やプラグインまで動いてしまうため。
 * 二重に書くとズレる危険があるので、下の
 * 「vite.config.ts と規則がズレていない」テストで
 * ★条件に出てくるファイル名がすべて vite.config.ts にも書かれていること★
 * を機械的に確認している。
 */
const CHUNK_RULES: { pattern: string; chunk: string }[] = [
  { pattern: '/src/data/learningContent/', chunk: 'data-learning' },
  { pattern: '/src/data/chapterIndex.generated', chunk: 'index' },
  { pattern: '/src/data/chapterCatalog', chunk: 'index' },
  { pattern: '/src/data/subjectLabels', chunk: 'index' },
  { pattern: '/src/data/allChapters', chunk: 'data-hub' },

  { pattern: '/src/data/problemCount', chunk: 'data-core' },
  { pattern: '/src/data/explanationPostProcess', chunk: 'data-core' },
  { pattern: '/src/data/listeningPostProcess', chunk: 'data-core' },
  { pattern: '/src/data/unitTeaching', chunk: 'data-core' },
  { pattern: '/src/data/teachingTypes', chunk: 'data-core' },
  { pattern: '/src/utils/explanationFormat', chunk: 'data-core' },
  { pattern: '/src/utils/listeningExplanation', chunk: 'data-core' },
  { pattern: '/src/utils/sanitizeHtml', chunk: 'data-core' },

  { pattern: '/src/data/advancedFields', chunk: 'data-leaf' },

  { pattern: '/src/data/chemistryTreeData', chunk: 'data-tree' },
  { pattern: '/src/data/chapterTreeMap', chunk: 'data-tree' },

  { pattern: '/src/data/chemistryAdvancedTrendData', chunk: 'data-trend' },
  { pattern: '/src/data/trendData', chunk: 'data-trend' },

  { pattern: '/src/data/chemistryData', chunk: 'data-chem-basic' },
  { pattern: '/src/data/chemProblemsC', chunk: 'data-chem-basic' },
  { pattern: '/src/data/acidBaseProblems', chunk: 'data-chem-basic' },
  { pattern: '/src/data/crystalProblems', chunk: 'data-chem-basic' },
  { pattern: '/src/data/molUnitConversions', chunk: 'data-chem-basic' },
  { pattern: '/src/data/redoxProblems', chunk: 'data-chem-basic' },

  { pattern: '/src/data/chemistryAdvancedData', chunk: 'data-chem-adv' },
  { pattern: '/src/data/advancedThermoProblems', chunk: 'data-chem-adv' },

  { pattern: '/src/data/englishListening', chunk: 'data-english-l' },

  { pattern: '/src/data/englishGrammar', chunk: 'data-english-g' },
  { pattern: '/src/data/egProblems', chunk: 'data-english-g' },

  { pattern: '/src/data/mathData', chunk: 'data-math' },
  { pattern: '/src/data/mathProblemKit', chunk: 'data-math' },
  { pattern: '/src/data/mathIntegerProblems', chunk: 'data-math' },
  { pattern: '/src/data/mathIntegralProblems', chunk: 'data-math' },
  { pattern: '/src/data/mathProbabilityProblems', chunk: 'data-math' },
  { pattern: '/src/data/mathVectorProblems', chunk: 'data-math' },

  { pattern: '/src/data/biologyBasic', chunk: 'data-biology' },
];

/** そのファイルがどのチャンクに入るか（vite と同じ順で先に一致したもの勝ち） */
function chunkOf(file: string): string {
  const id = '/' + rel(file);
  for (const r of CHUNK_RULES) {
    if (id.includes(r.pattern)) return r.chunk;
  }
  if (id.includes('/src/data/')) return 'data';
  return 'index'; // components / utils などアプリ本体
}

interface Graph {
  edges: Map<string, string[]>; // "A->B" → 具体例
  adj: Map<string, Set<string>>;
}

function buildChunkGraph(): Graph {
  const files = walk(join(ROOT, 'src'));
  const edges = new Map<string, string[]>();
  for (const f of files) {
    const a = chunkOf(f);
    for (const t of staticDeps(f)) {
      const b = chunkOf(t);
      if (a === b) continue;
      const k = `${a}->${b}`;
      if (!edges.has(k)) edges.set(k, []);
      edges.get(k)!.push(`${rel(f)} → ${rel(t)}`);
    }
  }
  const adj = new Map<string, Set<string>>();
  for (const k of edges.keys()) {
    const [a, b] = k.split('->');
    if (!adj.has(a)) adj.set(a, new Set());
    adj.get(a)!.add(b);
  }
  return { edges, adj };
}

function findCycles(adj: Map<string, Set<string>>): string[][] {
  const cycles: string[][] = [];
  const state = new Map<string, number>();
  const stack: string[] = [];
  const dfs = (n: string) => {
    state.set(n, 1);
    stack.push(n);
    for (const m of adj.get(n) ?? []) {
      if (state.get(m) === 1) cycles.push(stack.slice(stack.indexOf(m)).concat(m));
      else if (!state.has(m)) dfs(m);
    }
    stack.pop();
    state.set(n, 2);
  };
  for (const n of adj.keys()) if (!state.has(n)) dfs(n);
  return cycles;
}

describe('チャンクの分け方（真っ白＝Cannot access before initialization の再発防止）', () => {
  it('★チャンク間に循環が無い★', () => {
    const { edges, adj } = buildChunkGraph();
    const cycles = findCycles(adj);

    const detail = cycles
      .map((c) => {
        const lines = [`  循環: ${c.join(' → ')}`];
        for (let i = 0; i < c.length - 1; i++) {
          const k = `${c[i]}->${c[i + 1]}`;
          lines.push(`    ${k}`);
          for (const s of (edges.get(k) ?? []).slice(0, 3)) lines.push(`      ${s}`);
        }
        return lines.join('\n');
      })
      .join('\n');

    expect(
      cycles,
      '★チャンク間に循環ができている★\n' +
        'この状態でビルドすると rollup が Circular chunk 警告を出し、\n' +
        '実機では Cannot access \'D\' before initialization で\n' +
        '★画面が真っ白になる★ ことがある（過去に実際に起きた）。\n\n' +
        '直し方: 循環に入っているファイルのうち\n' +
        '「どの教科からも呼ばれる一番下の土台」を data-core に寄せる。\n' +
        'ファイルの置き場所を動かす必要はない。\n' +
        'チャンクは「置き場所」ではなく「一緒にダウンロードする単位」なので、\n' +
        '層が同じものを同じチャンクに入れれば辺の向きが揃う。\n\n' +
        `見つかった循環:\n${detail}`,
    ).toEqual([]);
  });

  it('★共通の土台（data-core）から外へ出ていく辺が無い★', () => {
    /*
     * data-core は「どの教科からも呼ばれる一番下の層」である。
     * ここから外へ出ていく辺が1本でもあると、
     * その先が data-core を呼び返した瞬間に循環になる。
     *
     * 出ていく辺を0本に保っておけば、
     * 誰がどこから data-core を呼んでも循環に加われない。
     * ★これが「循環しない」ことの構造的な保証になっている。★
     * 上の循環検査だけだと「いまは偶然大丈夫」でも通ってしまうので、
     * 崩れにくさそのものを別に見張る。
     */
    const { edges } = buildChunkGraph();
    const outgoing = [...edges.entries()].filter(([k]) => k.startsWith('data-core->'));

    expect(
      outgoing.map(([k, v]) => `${k}\n      ${v.slice(0, 3).join('\n      ')}`),
      '★data-core から外へ出ていく依存ができている★\n' +
        'data-core は「一番下の土台」で、外へ出ていく辺が0本であることが\n' +
        '循環しないことの保証になっている。\n' +
        'ここに辺ができると、その先が data-core を呼び返した瞬間に\n' +
        '真っ白（Cannot access before initialization）の危険が戻る。\n\n' +
        '直し方: いま data-core に入っているファイルが\n' +
        '新しく何かを import した場合、その import 先も data-core に入れる\n' +
        '（vite.config.ts と、このファイルの CHUNK_RULES の両方）。\n' +
        'あるいは、その import 自体をやめて引数で受け取る形にする。',
    ).toEqual([]);
  });

  it('★この検査の規則が vite.config.ts とズレていない★', () => {
    /*
     * ここが無いと、いちばん危ない嘘が生まれる:
     * vite.config.ts だけ書き換えたのに、この検査は古い分け方を見て
     * ★緑のまま★になる。
     *
     * 完全な二重管理の解消（設定を1か所から読む）は、
     * vite.config.ts が defineConfig とプラグインを含む都合で難しい。
     * そこで「この検査に出てくる振り分け条件が、
     * vite.config.ts にも同じ文字列で書かれていること」を確かめる。
     *
     * これで少なくとも
     *   - vite 側で条件を消した／名前を変えた
     *   - チャンク名を変えた
     * は検出できる。
     */
    const viteSrc = readFileSync(join(ROOT, 'vite.config.ts'), 'utf8');

    const missingPattern = CHUNK_RULES.filter((r) => !viteSrc.includes(r.pattern)).map(
      (r) => `${r.pattern} → ${r.chunk}`,
    );
    expect(
      missingPattern,
      '★このテストの振り分け条件が vite.config.ts に見つからない★\n' +
        'vite.config.ts 側だけを変えたか、条件を消した可能性がある。\n' +
        'その場合この循環検査は「古い分け方」を見ており、\n' +
        '実物が循環していても緑になってしまう（＝嘘の門）。\n' +
        'vite.config.ts と、このファイルの CHUNK_RULES を必ず両方そろえること。',
    ).toEqual([]);

    const chunkNames = [...new Set(CHUNK_RULES.map((r) => r.chunk))].filter(
      (n) => n !== 'index',
    );
    const missingName = chunkNames.filter((n) => !viteSrc.includes(`'${n}'`));
    expect(
      missingName,
      '★このテストが使っているチャンク名が vite.config.ts に無い★\n' +
        'チャンク名を変えたなら、両方そろえること。',
    ).toEqual([]);
  });

  it('この検査そのものが生きている（監視役の健康診断）', () => {
    /*
     * 「グラフが空っぽ」「ファイルを1つも読めていない」という
     * 壊れ方をすると、循環検査は永遠に緑になる。
     * 依存を実際に辿れていることを確かめる。
     */
    const { edges, adj } = buildChunkGraph();

    // 辺がちゃんと集まっていること
    expect(edges.size).toBeGreaterThan(10);
    expect(adj.size).toBeGreaterThan(3);

    // 分割が実際に効いていること（教科ごとのチャンクが存在する）
    const chunks = new Set<string>();
    for (const k of edges.keys()) {
      const [a, b] = k.split('->');
      chunks.add(a);
      chunks.add(b);
    }
    for (const expected of [
      'data-hub',
      'data-core',
      'data-chem-basic',
      'data-english-l',
      'data-math',
      'data-biology',
    ]) {
      expect(chunks, `${expected} チャンクが依存グラフに現れていない`).toContain(expected);
    }

    // ハブが各教科へ繋がっていること（＝辿れている証拠）
    expect(adj.get('data-hub')?.size ?? 0).toBeGreaterThanOrEqual(5);
  });
});
