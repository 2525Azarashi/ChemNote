/**
 * dump-data
 * ------------------------------------------------------------------
 * TypeScript の問題データを JSON（.audit-data.json）へ書き出す。
 * audit-explanations.mjs / fix スクリプトの入力に使う。
 *
 * 使い方: npx tsx scripts/dump-data.mts
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import * as chem from '../src/data/chemistryData';
import { mockExam } from '../src/data/mockExamData';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const trees: Record<string, unknown> = {};
for (const [key, value] of Object.entries(chem)) {
  if (key.endsWith('TreeData')) trees[key] = value;
}

writeFileSync(
  join(ROOT, '.audit-data.json'),
  JSON.stringify({ chemistryData: chem.chemistryData, trees, mockExam }, null, 2),
  'utf8'
);
console.log('wrote .audit-data.json');
