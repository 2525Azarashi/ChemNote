/**
 * ===================================================================
 * 分野の表示情報（data/advancedFields.ts）の検査
 * ===================================================================
 *
 * このファイルは「化学（発展）の分野名だけ」を持つ葉ファイルとして
 * chemistryAdvancedData.ts から切り出したもの。
 * 切り出しの目的は、分野名しか使わない画面（App.tsx / ChapterSelection.tsx）が
 * 化学（発展）の問題データ本体を読み込まずに済むようにすること。
 *
 * 守りたいことは3つある。
 *
 *   1. ★何も import しないこと★
 *      import を1行足すと、そこから先へ辿って問題データに行き着く可能性が
 *      生まれる。つまり「葉である」ことがこのファイルの仕様そのもの。
 *      うっかり足されても気づけるように機械検査する。
 *
 *   2. ★中身が元と同一であること★
 *      移動しただけで値を変えていないこと（並び順・id・title・latin・
 *      description）を、実データと突き合わせて確認する。
 *      分野カードの見た目や並びが変わっていないことの根拠になる。
 *
 *   3. ★元の場所からも今までどおり読めること★
 *      chemistryAdvancedData.ts が再エクスポートを続けているので、
 *      既存の呼び出し側は import 文を変えなくても動く。
 *      再エクスポートを消すと既存コードが壊れるので、それも検査する。
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import { ADVANCED_FIELDS } from '../src/data/advancedFields';
import {
  ADVANCED_FIELDS as ADVANCED_FIELDS_VIA_DATA,
  getAdvancedFieldStats,
} from '../src/data/chemistryAdvancedData';

const ROOT = path.resolve(__dirname, '..');
const LEAF = path.join(ROOT, 'src/data/advancedFields.ts');

describe('分野の表示情報（advancedFields.ts）', () => {
  it('★何も import しない★（葉であることがこのファイルの仕様）', () => {
    const src = fs.readFileSync(LEAF, 'utf8');
    // 説明用のコメントの中にも import という語が出てくるため、
    // コメントを取り除いてから調べる（行の除外ではなくコメントの除去）。
    const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

    const importLines = code
      .split('\n')
      .filter((line) => /^\s*(?:import|export)\s.*\sfrom\s/.test(line) || /^\s*import\s*['"]/.test(line));

    expect(
      importLines,
      'advancedFields.ts に import が増えている。' +
        'このファイルは「読んでも問題データへ辿り着かない」ことが仕様なので、' +
        '依存を足すと切り出した意味が無くなる:\n  ' +
        importLines.join('\n  '),
    ).toEqual([]);
  });

  it('分野は理論→無機→有機の順で3件（並び順が画面のカードの並び）', () => {
    expect(ADVANCED_FIELDS.map((f) => f.id)).toEqual(['theoretical', 'inorganic', 'organic']);
    expect(ADVANCED_FIELDS.map((f) => f.title)).toEqual(['理論化学', '無機化学', '有機化学']);
  });

  it('各分野が id / title / latin / description をすべて持っている', () => {
    for (const field of ADVANCED_FIELDS) {
      expect(typeof field.id).toBe('string');
      expect(field.title.length).toBeGreaterThan(0);
      expect(field.latin.length).toBeGreaterThan(0);
      expect(field.description.length).toBeGreaterThan(0);
    }
  });

  it('★元の場所（chemistryAdvancedData）からも同じものが読める★', () => {
    // 再エクスポートを消すと既存の呼び出し側（AdvancedFieldSelection.tsx など）が
    // 壊れるため、同一の実体であることを確認する。
    expect(ADVANCED_FIELDS_VIA_DATA).toBe(ADVANCED_FIELDS);
  });

  it('分野IDが実データの part.field と一致している（対応が取れている）', () => {
    // 分野名だけを別ファイルへ移したので、「実データ側の分野」と
    // 「表示用の分野」がズレていないことを実際に引いて確かめる。
    for (const field of ADVANCED_FIELDS) {
      const stats = getAdvancedFieldStats(field.id);
      expect(stats.units, `${field.title} の単元が引けていない`).toBeGreaterThan(0);
    }
  });

  it('分野名しか使わない画面が、問題データ本体を指していない', () => {
    // 切り出した目的そのものを検査する。
    // ここが元に戻ると、App.tsx / ChapterSelection.tsx から
    // 化学（発展）の問題データ全部が読み込まれる状態に戻る。
    const targets = ['src/App.tsx', 'src/components/ChapterSelection.tsx'];
    for (const rel of targets) {
      const src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
      const code = src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      const bad = code
        .split('\n')
        .filter(
          (line) =>
            /\bADVANCED_FIELDS\b|\bAdvancedFieldId\b/.test(line) &&
            /from\s*['"][^'"]*chemistryAdvancedData['"]/.test(line),
        );
      expect(
        bad,
        `${rel} が分野情報を問題データ本体（chemistryAdvancedData）から読んでいる。` +
          'data/advancedFields.ts から読むこと:\n  ' +
          bad.join('\n  '),
      ).toEqual([]);
    }
  });
});
