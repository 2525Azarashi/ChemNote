/**
 * ★見張り役（テスト）そのものの健康診断★
 *
 * ■ なぜこのファイルが必要になったか（実際に起きた事故）
 *
 * このリポジトリは「なぜこう直したか」を長いコメントで残す方針である。
 * その方針と、テストが「ソースをテキストとして検査する」やり方が
 * 正面衝突して、次の事故が起きた。
 *
 *   App.tsx にまとめプリントを遅延読み込みにした理由を書いたとき、
 *   その説明文の中に
 *
 *       元のコードは {appState === 'learning' && <LearningViewer … />} で…
 *
 *   という一行を含めた。すると tests/learningPrint.test.ts の
 *
 *       const at = appSrc.indexOf('<LearningViewer');
 *       expect(appSrc.slice(at, at + 300)).toContain('subject=');
 *
 *   が★本物の JSX ではなく、この説明文に先に当たって★落ちた。
 *   アプリは正しく動いていた（実機で確認済み）。
 *   壊れていたのは見張り役のほうだった。
 *
 * ■ もっと怖いのは「逆向き」である
 *
 *   落ちてくれた今回はまだ幸運だった。本当に怖いのは
 *
 *     ・「もう使っていないはずのクラス名が無いこと」を確かめるテストが、
 *       経緯を説明したコメントに一致して★永遠に落ちる★
 *     ・逆に「あるはずのコード」がコメントにしか残っていないのに
 *       ★緑のまま通り続ける★
 *
 *   後者は「見張り役が嘘をつく」状態で、いちばん危険な壊れ方である。
 *
 * ■ この門がやること
 *
 *   tests/ 配下を機械的に走査し、
 *   「ソースの中の位置（indexOf）で構造を判定しているのに、
 *     コメントを除去していない」箇所が新しく増えていないかを見る。
 *
 *   位置で判定する検査は必ず readCode()（tests/helpers/sourceScan.ts）
 *   を通し、TypeScript の removeComments が見ているコードだけを対象にする。
 *
 * ■ この門は「文章の禁止」ではない
 *
 *   toContain / toMatch で「その文字列が存在するか」だけを見る検査は
 *   対象外にしている。それらはコメントに引っかかっても
 *   意味が壊れにくく、逆に厳しくすると既存の大量のテストを
 *   意味なく書き換えることになる（＝綺麗にするためだけの変更）。
 *   ここで押さえたいのは★位置・順序を見る検査★に限る。
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { stripComments } from './helpers/sourceScan';

const testsDir = resolve(__dirname);

/** tests/ 直下の *.test.ts をすべて集める（vitest の include と同じ範囲） */
function allTestFiles(): string[] {
  return readdirSync(testsDir)
    .filter((n) => n.endsWith('.test.ts'))
    .sort();
}

/**
 * 「位置で構造を見ている」書き方の検出。
 *
 * 対象は `xxx.indexOf('<Yyy')` のように
 * JSX タグ開始をキーに位置を求めている行。
 * これは「どこに書かれているか」を問う検査であり、
 * コメントを含めてはいけない。
 *
 * 受け取り側（xxx）も一緒に取り出す。
 * どの変数に対して位置検査をしているのかが分からないと、
 * 「ファイル単位で免除」という粗い判定しかできず、
 * ★同じファイルの中に生ソースの位置検査を新しく足せてしまう★。
 */
const POSITIONAL_JSX = /([A-Za-z_$][\w$]*)\s*\.indexOf\(\s*['"]</u;

/**
 * そのファイルの中で「コメント除去済みの文字列」を持っている変数名を集める。
 *
 * ■ なぜ変数まで追うのか（門そのものの弱点をつぶすため）
 *
 *   最初はファイル単位で
 *     「readCode を import していれば、そのファイルは免除」
 *   としていた。しかしこれでは、いったん import したファイルの中に
 *   生ソースへの位置検査を新しく書き足しても検出できない。
 *   つまり★門が緑のまま見逃す★。これは今回直した事故と同じ壊れ方なので、
 *   受け取り側の変数まで見る形にした。
 *
 * ■ 間接代入も追う
 *
 *   実際のテストは
 *       const code = readCode('src/…');
 *       const resultBlock = code.slice(code.indexOf('…'));
 *   のように、いったん切り出してから位置検査をする。
 *   resultBlock も安全な出自なので、
 *   「安全な変数から作られた変数」も安全として伝播させる。
 *   参照が前後どちらに書かれていても拾えるよう、
 *   増えなくなるまで繰り返す（不動点まで回す）。
 */
function safeCodeVars(src: string): Set<string> {
  const safe = new Set<string>();

  // 1) 直接 readCode()/stripComments() を受けた変数
  const direct = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*[^;\n]*\b(?:readCode|stripComments)\s*\(/gu;
  for (const m of src.matchAll(direct)) safe.add(m[1]);

  // 2) 安全な変数から作られた変数（.slice など）を、増えなくなるまで伝播
  const assign = /(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*([^;\n]+)/gu;
  for (let pass = 0; pass < 5; pass++) {
    const before = safe.size;
    for (const m of src.matchAll(assign)) {
      const [, name, rhs] = m;
      if (safe.has(name)) continue;
      for (const s of safe) {
        // 右辺が安全な変数を使っているなら、その結果も安全
        if (new RegExp(`\\b${s}\\b`, 'u').test(rhs)) {
          safe.add(name);
          break;
        }
      }
    }
    if (safe.size === before) break;
  }
  return safe;
}

describe('見張り役そのものの健康診断（テストがコメントに騙されない）', () => {
  it('★ソースの位置で構造を見る検査は、コメント除去済みのコードに対して行っている★', () => {
    const offenders: string[] = [];

    for (const name of allTestFiles()) {
      // このファイル自身は説明文の中に例を書いているので対象外
      if (name === 'testHealth.test.ts') continue;

      const src = readFileSync(join(testsDir, name), 'utf8');
      const safe = safeCodeVars(src);

      src.split('\n').forEach((line, i) => {
        const m = POSITIONAL_JSX.exec(line);
        if (!m) return;
        if (safe.has(m[1])) return; // コメント除去済みの変数に対する検査なので OK
        offenders.push(`${name}:${i + 1}  ${line.trim()}`);
      });
    }

    expect(
      offenders,
      [
        '★ソースの「位置」で構造を判定しているのに、コメントを除いていない検査があります★',
        '',
        offenders.join('\n'),
        '',
        'なぜ危険か:',
        '  経緯を説明したコメントの中に同じ JSX を書き写した瞬間に、',
        '  indexOf がその説明文に当たって判定が狂います。',
        '  実際に tests/learningPrint.test.ts でこの事故が起きました。',
        '',
        '直し方:',
        "  import { readCode } from './helpers/sourceScan';",
        '  const code = readCode(\'src/components/Xxx.tsx\');',
        '  ↑ TypeScript の removeComments を通した「実コード」だけを検査対象にします。',
      ].join('\n'),
    ).toEqual([]);
  });

  it('この門が本当に働いている（走査対象が空でない）', () => {
    /*
     * 門そのものが空振りしていないかを確かめる。
     * 走査したファイルが 0 件なら「何も見ていないのに緑」になるため、
     * ここで必ず気づけるようにしておく。
     */
    const files = allTestFiles();
    expect(files.length).toBeGreaterThan(50);
    expect(files).toContain('learningPrint.test.ts');
  });

  it('共有ヘルパー（sourceScan）は本当にコメントだけを消して JSX を残す', () => {
    /*
     * ヘルパーが壊れると、これを使っている全部の検査が
     * 静かに意味を失う（＝嘘をつく）。ここで直接確かめる。
     */
    const sample = [
      '/* 説明: 元のコードは <Foo bar="1" /> だった */',
      'export const X = () => (',
      '  <Foo baz="2" />',
      ');',
    ].join('\n');

    const out = stripComments(sample);
    // コメントの中の <Foo bar="1" /> は消えている
    expect(out).not.toContain('bar="1"');
    // 本物の JSX は残っている（関数呼び出しに変換されていない）
    expect(out).toContain('<Foo');
    expect(out).toContain('baz="2"');
  });

  it('★注意：removeComments を通すと空白・改行が整形される（この性質を忘れないための記録）★', () => {
    /*
     * ■ 実測して分かった大事な性質
     *
     *   stripComments に
     *       <Foo baz="2" />
     *   を渡すと、返ってくるのは
     *       <Foo baz="2"/>
     *   である（★ /> の前の空白が消える★）。
     *   改行やインデントも詰められる。
     *
     * ■ なぜここに書き残すのか
     *
     *   これを知らずに
     *       expect(readCode(f)).toContain('<Foo baz="2" />')
     *   と書くと、コードが正しいのに落ちる。
     *   逆に
     *       expect(readCode(f)).not.toContain('<Foo baz="2" />')
     *   と書くと、★本当は残っているのに緑になる★（見張り役が嘘をつく）。
     *
     * ■ 使い分けの結論
     *
     *   ・位置／順序を見る検査（indexOf, slice）→ readCode を使う
     *   ・空白まで含めた見た目どおりの一致を見たい検査
     *     （className の並び、テンプレートリテラルの中身など）
     *     → 素のソースを使う。ただしコメントに引っかからない文言を選ぶ
     *
     *   この門は前者だけを対象にしている（後者を巻き込むと
     *   「綺麗にするためだけの書き換え」を大量に生むため）。
     */
    const out = stripComments('const X = () => <Foo baz="2" />;\n');
    expect(out).toContain('<Foo baz="2"/>'); // 空白が詰まった形で入っている
    expect(out).not.toContain('<Foo baz="2" />'); // 元の見た目そのままでは入っていない
  });
});
