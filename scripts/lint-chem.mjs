#!/usr/bin/env node
/**
 * lint-chem
 * ------------------------------------------------------------------
 * ChemNote の問題データ（src/data/*.ts）における「表記ゆれ」を検出・修正する
 * 簡易リンター。ルールの根拠は docs/UNIT_GUIDE.md を参照。
 *
 * 使い方:
 *   node scripts/lint-chem.mjs          # 検出のみ（違反があれば exit 1）
 *   node scripts/lint-chem.mjs --fix    # 安全に正規化できる違反を自動修正
 *
 * 設計方針:
 *   - 「数値・単位・数式に使う英数字/記号は半角へ」正規化する。
 *   - 日本語の可読性を損なう変換（全角括弧 （ ）、全角コロン ：、全角空白、
 *     中点 ・、乗除記号 × ÷ など）は *行わない*。
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

// 対象ファイル
const TARGET_FILES = [
  'src/data/acidBaseProblems.ts',
  'src/data/chemistryData.ts',
  'src/data/mockExamData.ts',
  'src/data/trendData.ts',
];

// ------------------------------------------------------------------
// 安全に半角化できる文字マップ（1文字→1文字）
// ------------------------------------------------------------------
/** 全角英字→半角 */
function fwLatinToHalf(ch) {
  const code = ch.codePointAt(0);
  // Ａ(0xFF21)-Ｚ(0xFF3A), ａ(0xFF41)-ｚ(0xFF5A)
  if ((code >= 0xff21 && code <= 0xff3a) || (code >= 0xff41 && code <= 0xff5a)) {
    return String.fromCodePoint(code - 0xfee0);
  }
  return null;
}
/** 全角数字→半角 */
function fwDigitToHalf(ch) {
  const code = ch.codePointAt(0);
  if (code >= 0xff10 && code <= 0xff19) return String.fromCodePoint(code - 0xfee0);
  return null;
}

// 単純置換テーブル（記号）
const SYMBOL_MAP = {
  '／': '/',   // 全角スラッシュ
  '＝': '=',   // 全角イコール
  '＋': '+',   // 全角プラス
  '＜': '<',   // 全角小なり
  '＞': '>',   // 全角大なり
  '％': '%',   // 全角パーセント
  '［': '[',   // 全角角括弧（モル濃度 [H⁺] 用）
  '］': ']',
};

// 「科学的/数値的な文脈」を判定するための文字クラス。
// これらに隣接している全角記号のみ半角化し、日本語の散文中で意匠的に使われる
// 全角記号（例: 蒸気圧＋濃度計算, 小問集合10問／第2問…）は変換しない。
const SCI_CONTEXT = /[0-9A-Za-z０-９ａ-ｚＡ-Ｚ\[\]（）()×÷⁺⁻²³⁴⁵⁶⁷⁸⁹¹⁰₀-₉\+\-=\/.．]/;

/** 記号 ch (chars[i]) が科学的文脈に隣接しているか */
function isSciContext(chars, i) {
  const prev = chars[i - 1] || '';
  const next = chars[i + 1] || '';
  return SCI_CONTEXT.test(prev) || SCI_CONTEXT.test(next);
}

// ------------------------------------------------------------------
// ルール定義: detect(ch, chars, i) / fix(ch)
// ------------------------------------------------------------------
const RULES = [
  {
    id: 'fullwidth-digit',
    desc: '全角数字は半角に（例 ０→0）',
    detect: (ch) => fwDigitToHalf(ch) !== null,
    fix: (ch) => fwDigitToHalf(ch),
  },
  {
    id: 'fullwidth-latin',
    desc: '全角英字は半角に（例 ｍｏｌ→mol, Ｌ→L, ｐＨ→pH）',
    detect: (ch) => fwLatinToHalf(ch) !== null,
    fix: (ch) => fwLatinToHalf(ch),
  },
  {
    id: 'fullwidth-symbol',
    desc: '全角記号は半角に（／＝＋＜＞％［］ ※数値・式に隣接する場合のみ）',
    detect: (ch, chars, i) =>
      Object.prototype.hasOwnProperty.call(SYMBOL_MAP, ch) && isSciContext(chars, i),
    fix: (ch) => SYMBOL_MAP[ch],
  },
];

/**
 * 全角小数点「．」は「数字にはさまれているときだけ」半角ピリオドに変換する。
 * （日本語の記号としての ． 誤用を避けるための文脈依存ルール）
 */
function fixFullwidthDecimal(text) {
  let count = 0;
  const out = text.replace(/([0-9０-９])．([0-9０-９])/g, (_m, a, b) => {
    count++;
    return `${a}.${b}`;
  });
  return { out, count };
}

// ------------------------------------------------------------------
// メイン
// ------------------------------------------------------------------
const FIX = process.argv.includes('--fix');

let totalViolations = 0;
let totalFixed = 0;
const perRule = {};

for (const rel of TARGET_FILES) {
  const abs = join(ROOT, rel);
  let content;
  try {
    content = readFileSync(abs, 'utf-8');
  } catch {
    continue; // ファイルが無ければスキップ
  }

  const lines = content.split('\n');
  const violationsInFile = [];
  let newContent = content;

  // 1) 文脈依存の小数点ルール（先に全体へ適用）
  if (FIX) {
    const dec = fixFullwidthDecimal(newContent);
    if (dec.count > 0) {
      newContent = dec.out;
      totalFixed += dec.count;
      perRule['fullwidth-decimal'] = (perRule['fullwidth-decimal'] || 0) + dec.count;
    }
  } else {
    // 検出のみ: 行ごとに数える
    lines.forEach((line, i) => {
      const m = line.match(/[0-9０-９]．[0-9０-９]/g);
      if (m) {
        violationsInFile.push({ line: i + 1, rule: 'fullwidth-decimal', sample: m[0] });
        perRule['fullwidth-decimal'] = (perRule['fullwidth-decimal'] || 0) + m.length;
      }
    });
  }

  // 2) 1文字単位のルール（文脈依存ルールのため char 配列上の index を保持する）
  if (FIX) {
    const chars = [...newContent];
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      for (const rule of RULES) {
        if (rule.detect(ch, chars, i)) {
          chars[i] = rule.fix(ch);
          totalFixed++;
          perRule[rule.id] = (perRule[rule.id] || 0) + 1;
          break;
        }
      }
    }
    newContent = chars.join('');
  } else {
    // 検出: 改行を保持したまま char 配列を走査し、行番号を数える
    const chars = [...newContent];
    let lineNo = 1;
    for (let i = 0; i < chars.length; i++) {
      const ch = chars[i];
      if (ch === '\n') { lineNo++; continue; }
      for (const rule of RULES) {
        if (rule.detect(ch, chars, i)) {
          violationsInFile.push({ line: lineNo, rule: rule.id, sample: ch });
          perRule[rule.id] = (perRule[rule.id] || 0) + 1;
          break;
        }
      }
    }
  }

  if (FIX) {
    if (newContent !== content) {
      writeFileSync(abs, newContent, 'utf-8');
      console.log(`  ✏️  fixed: ${rel}`);
    }
  } else if (violationsInFile.length > 0) {
    totalViolations += violationsInFile.length;
    console.log(`\n📄 ${rel}  (${violationsInFile.length} 件)`);
    // 行ごとにまとめて表示（先頭20件）
    const shown = violationsInFile.slice(0, 20);
    for (const v of shown) {
      console.log(`   L${v.line}  [${v.rule}]  ${JSON.stringify(v.sample)}`);
    }
    if (violationsInFile.length > shown.length) {
      console.log(`   … ほか ${violationsInFile.length - shown.length} 件`);
    }
  }
}

console.log('\n──────── lint-chem 結果 ────────');
for (const [rule, count] of Object.entries(perRule).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${rule}: ${count}`);
}

if (FIX) {
  console.log(`\n✅ 自動修正: 合計 ${totalFixed} 箇所を半角へ正規化しました。`);
  console.log('   → 必ず `npm run lint` と `npm run build` で確認してください。');
  process.exit(0);
} else {
  if (totalViolations === 0) {
    console.log('\n✅ 表記ゆれは検出されませんでした。');
    process.exit(0);
  } else {
    console.log(`\n❌ 表記ゆれ ${totalViolations} 件を検出しました。`);
    console.log('   → `npm run lint:chem:fix` で安全に自動修正できます。');
    process.exit(1);
  }
}
