/**
 * ===================================================================
 * 教科名（表示名）の出どころが ★1か所だけ★ であることを守る門
 * ===================================================================
 *
 * 直前まで、教科名の対応表を組み立てるコードが
 *
 *   src/data/chapterCatalog.ts
 *   src/components/SubjectSelection.tsx
 *
 * の2か所に★1文字も違わない同じ3行★として重複していた。
 * さらに src/data/allChapters.ts には誰も import しない
 * SUBJECT_LABELS（死んだ輸出）が残っていた。
 *
 * ここで一番やっかいなのは
 * ★値が一致しているうちは、どのテストも異常を報告しない★ ことである。
 * 壊れるのは「片方の組み立て方だけを将来変えたとき」で、そのときは
 * 画面ごとに違う教科名が出て、どちらが正しいか誰にも分からない。
 *
 * つまりこれは「今バグっている」問題ではなく
 * 「将来バグる形になっている」問題なので、
 * 値を突き合わせるテストでは防げない。
 * 防げるのは ★組み立てが2つに増えたことを検出する門★ だけである。
 * それがこのファイル。
 *
 * -------------------------------------------------------------------
 * ■ このファイルが検査すること
 * -------------------------------------------------------------------
 *  1. 対応表を組み立てているファイルが src/ 全体でちょうど1つ
 *  2. 3つの入口（subjectLabels / chapterCatalog / SubjectSelection）が
 *     ★同一の実体★ を返す（別々に作った同じ値ではない）
 *  3. subjectLabels.ts から問題データに辿り着かない（軽さの維持）
 *  4. allChapters.ts に重い SUBJECT_LABELS が復活していない
 *  5. 中身が索引と一致し、未知の値でも従来どおり化学基礎に落ちる
 */

import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { SUBJECT_LABELS, labelOfSubject } from '../src/data/subjectLabels';
import { SUBJECT_LABELS as CATALOG_LABELS } from '../src/data/chapterCatalog';
import {
  SUBJECT_LABELS as SCREEN_LABELS,
  getSubjectLabel,
} from '../src/components/SubjectSelection';
import { SUBJECT_INDEX } from '../src/data/chapterIndex.generated';

const ROOT = join(__dirname, '..');
const SRC = join(ROOT, 'src');

/** src 配下の .ts / .tsx を全部集める */
function collectSources(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) {
      collectSources(full, out);
    } else if (/\.tsx?$/.test(name)) {
      out.push(full);
    }
  }
  return out;
}

/**
 * コメントを取り除く。
 * これを忘れると、説明のためにコメント内へ書いた
 * 「以前はこう書いていた」というコード例まで拾ってしまい、
 * 門が誤って発火する（過去に実際にやった間違い）。
 */
function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

describe('教科名（表示名）の出どころ', () => {
  it('★対応表を組み立てているファイルは src 全体でちょうど1つ★', () => {
    const builders: string[] = [];

    for (const file of collectSources(SRC)) {
      const code = stripComments(readFileSync(file, 'utf-8'));
      // 「(何かの一覧).map(... => [ .id, .label ])」で表を作っている形を探す。
      // 索引から作る場合（SUBJECT_INDEX）と
      // 教科データから作る場合（SUBJECTS）の両方を対象にする。
      const buildsTable =
        /\.map\(\s*\(?\s*\w+\s*\)?\s*=>\s*\[\s*\w+\.id\s*,\s*\w+\.label\s*\]/.test(code);
      if (buildsTable) builders.push(relative(ROOT, file));
    }

    expect(
      builders,
      '教科名の対応表を組み立てている場所が1つではない。\n' +
        '見つかった場所: ' +
        (builders.join(' , ') || '(なし)') +
        '\n' +
        '教科名の「唯一の出どころ」は src/data/subjectLabels.ts だけにすること。\n' +
        '他のファイルは `export { SUBJECT_LABELS } from ...` で再公開する。\n' +
        '（2か所で組み立てると、片方だけ直したときに画面ごとに違う教科名が出る）',
    ).toEqual(['src/data/subjectLabels.ts']);
  });

  it('★3つの入口が同一の実体を返す（別々に作った同じ値ではない）★', () => {
    // toBe（同一性）で見るのが要点。toEqual だと
    // 「別々に組み立てたが今は値が同じ」を通してしまう。
    expect(CATALOG_LABELS, 'chapterCatalog が別の表を作っている').toBe(SUBJECT_LABELS);
    expect(SCREEN_LABELS, 'SubjectSelection が別の表を作っている').toBe(SUBJECT_LABELS);
    expect(getSubjectLabel, 'getSubjectLabel が labelOfSubject と別物になっている').toBe(
      labelOfSubject,
    );
  });

  it('subjectLabels.ts は葉しか読まない（問題データへ辿れない）', () => {
    const code = stripComments(readFileSync(join(SRC, 'data/subjectLabels.ts'), 'utf-8'));
    const froms = [...code.matchAll(/from\s+'([^']+)'/g)].map((m) => m[1]);

    // `import type` は消えるので重さに関係ない。値の import 文だけを見る。
    const valueImports = [...code.matchAll(/^import\s+(?!type\b)[^;]*?from\s+'([^']+)'/gm)].map(
      (m) => m[1],
    );

    /**
     * 値として読んでよい相手。
     *
     * ★この門が守りたいのは「ファイル名」ではなく★
     * ★「教科名を1つ引くだけで問題データ本体まで読み込まれないこと」★
     * なので、判定の要点は「相手が葉かどうか」である。
     * そのため許可した相手が本当に葉であることを、下でもう一度検査する
     * （名前を並べるだけだと、その相手が重くなったときに気づけない）。
     *
     *   ./chapterIndex.generated … 教科名の対応表のもと（生成物）
     *   ./externalSubjects        … 本体に教科データを持たない教科の
     *                               教科名（高校入試 理科など）。
     *                               索引には載らないので、こちらから引く。
     */
    const ALLOWED_LEAVES = ['./chapterIndex.generated', './externalSubjects'];

    for (const target of valueImports) {
      expect(
        ALLOWED_LEAVES,
        '教科名を引くためのファイルが、許可されていない相手を読み込んでいる。\n' +
          '見つかった読み込み: ' +
          froms.join(' , ') +
          '\n' +
          '値として読んでよいのは★何も import しない葉★だけ。\n' +
          'それ以外を読むと、教科名を1つ引くだけで\n' +
          '問題データ本体（約2.6MB）まで読み込まれる恐れがある。',
      ).toContain(target);
    }

    // ★許可した相手が本当に葉であることを確かめる★
    // ここを省くと「許可リストに載っているから」という理由だけで
    // 重いファイルを読めるようになってしまい、門の意味が無くなる。
    for (const leaf of ALLOWED_LEAVES) {
      const leafPath = join(SRC, 'data', `${leaf.replace('./', '')}.ts`);
      const leafCode = stripComments(readFileSync(leafPath, 'utf-8'));
      const leafValueImports = [
        ...leafCode.matchAll(/^import\s+(?!type\b)[^;]*?from\s+'([^']+)'/gm),
      ].map((m) => m[1]);

      expect(
        leafValueImports,
        `${leaf} が値の import を持っている。\n` +
          'このファイルは「教科名を引くための軽い入口」として\n' +
          'subjectLabels.ts から読まれるので、★何も import しない葉★' +
          'でなければならない。',
      ).toEqual([]);
    }
  });

  it('★allChapters.ts に重い SUBJECT_LABELS が復活していない★', () => {
    const code = stripComments(readFileSync(join(SRC, 'data/allChapters.ts'), 'utf-8'));
    expect(
      /export\s+(const|\{[^}]*)\s*SUBJECT_LABELS/.test(code),
      'allChapters.ts が SUBJECT_LABELS を公開している。\n' +
        'このファイルは6教科ぶんの問題データを静的に読むため、\n' +
        '「教科名を引くだけ」でも約2.5MB を連れてくる重い入口になる。\n' +
        '教科名は src/data/subjectLabels.ts から引くこと。',
    ).toBe(false);
  });

  it('中身が索引と一致する（表示は変わっていない）', () => {
    expect(Object.keys(SUBJECT_LABELS).sort()).toEqual(SUBJECT_INDEX.map((s) => s.id).sort());
    for (const subject of SUBJECT_INDEX) {
      expect(SUBJECT_LABELS[subject.id], `${subject.id} の表示名がずれている`).toBe(subject.label);
    }
  });

  it('未知の値でも化学基礎に落ちる（従来どおり）', () => {
    expect(labelOfSubject('chemistry_basic')).toBe('化学基礎');
    expect(labelOfSubject('chemistry')).toBe(SUBJECT_LABELS.chemistry);
    expect(labelOfSubject('__unknown__')).toBe(SUBJECT_LABELS.chemistry_basic);
    expect(labelOfSubject(null)).toBe(SUBJECT_LABELS.chemistry_basic);
    expect(labelOfSubject(undefined)).toBe(SUBJECT_LABELS.chemistry_basic);
    expect(labelOfSubject('')).toBe(SUBJECT_LABELS.chemistry_basic);
  });
});
