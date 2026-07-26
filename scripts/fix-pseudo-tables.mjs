#!/usr/bin/env node
/**
 * fix-pseudo-tables
 * ------------------------------------------------------------------
 * src/data/*.ts のソース中の文字列リテラルを走査し、
 * 「｜」を並べただけのプレーンテキスト疑似テーブルを
 * Markdown テーブル（| 項目 | 項目 |）へ書き換える。
 *
 * ソースの文字列リテラルは改行が \n でエスケープされているため、
 * リテラル単位で取り出して unescape → 変換 → escape し直す。
 *
 * 使い方:
 *   node scripts/fix-pseudo-tables.mjs          # 変更内容のプレビュー
 *   node scripts/fix-pseudo-tables.mjs --write  # 実際に書き込む
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { convertPseudoTables, findPseudoTableBlocks } from './pseudo-table.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WRITE = process.argv.includes('--write');

const TARGET_FILES = [
  'src/data/chemistryData.ts',
  'src/data/acidBaseProblems.ts',
  'src/data/redoxProblems.ts',
  'src/data/mockExamData.ts',
];

/**
 * ソース中のダブルクォート／シングルクォート文字列リテラルを列挙する。
 * テンプレートリテラルは対象外（このデータ群では使われていない）。
 */
function* iterStringLiterals(src) {
  const re = /(["'])((?:\\.|(?!\1)[^\\\n])*)\1/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    yield { start: m.index, end: m.index + m[0].length, quote: m[1], body: m[2] };
  }
}

/** リテラル本体（エスケープ済み）を実際の文字列へ */
function unescapeLiteral(body) {
  return body
    .replace(/\\n/g, '\n')
    .replace(/\\t/g, '\t')
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, '\\');
}

/** 実際の文字列をリテラル本体（エスケープ済み）へ */
function escapeLiteral(text, quote) {
  let out = text
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t');
  out = quote === '"' ? out.replace(/"/g, '\\"') : out.replace(/'/g, "\\'");
  return out;
}

let totalTables = 0;
const report = [];

for (const rel of TARGET_FILES) {
  const abs = join(ROOT, rel);
  let src = readFileSync(abs, 'utf8');

  // 後方から置換して index のずれを防ぐ
  const literals = [...iterStringLiterals(src)];
  let fileTables = 0;

  for (let i = literals.length - 1; i >= 0; i--) {
    const lit = literals[i];
    if (!/[｜|]/.test(lit.body)) continue;

    const plain = unescapeLiteral(lit.body);
    const blocks = findPseudoTableBlocks(plain);
    if (blocks.length === 0) continue;

    const { text: converted, converted: n } = convertPseudoTables(plain);
    if (n === 0 || converted === plain) continue;

    const line = src.slice(0, lit.start).split('\n').length;
    report.push({ file: rel, line, tables: n, sample: blocks[0].lines[0].slice(0, 50) });
    fileTables += n;
    totalTables += n;

    src = src.slice(0, lit.start) + lit.quote + escapeLiteral(converted, lit.quote) + lit.quote + src.slice(lit.end);
  }

  if (fileTables > 0 && WRITE) {
    writeFileSync(abs, src, 'utf8');
    console.log(`✔ ${rel}: ${fileTables} 表を Markdown テーブルへ変換`);
  } else if (fileTables > 0) {
    console.log(`… ${rel}: ${fileTables} 表が変換対象（--write で適用）`);
  }
}

console.log('');
for (const r of report) console.log(`  ${r.file}:${r.line} (${r.tables}表) ${r.sample}`);
console.log(`\n合計: ${totalTables} 表${WRITE ? ' を変換しました' : '（プレビュー）'}`);
