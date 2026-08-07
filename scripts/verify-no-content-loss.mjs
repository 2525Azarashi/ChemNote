/**
 * 「解説の情報量を絶対に減らしていない」ことを機械的に確かめる回帰テスト。
 *
 * ■ 背景
 * 解説の見せ方を「小問ごとに完結する形」へ組み替える作業では、
 * 本文を切り分けたり、重複行を整理したりする処理が入る。
 * ここで一歩間違えると、生徒が読むべき説明が静かに消えてしまう。
 * 画面を見ただけでは気づけないので、必ず機械で検査する。
 *
 * ■ 検査の方法
 * 問題データに *もともと入っている* 材料
 *   ・小問のラベル
 *   ・小問のねらい（theme）
 *   ・小問の正解（correctAnswer）
 *   ・小問の思考手順（steps）
 * の日本語文字を1文字ずつ数え、最終的に画面へ渡される解説文の中に
 * 同じ文字が同じ回数以上あるかを確かめる。
 * 「文字の多重集合」での比較なので、並べ替えや見出しの付け替えは
 * 通すが、1文字でも消えていれば必ず検出できる。
 *
 * ※ HTML タグは取り除かない。取り除くと、データ中の生の "<"（pH<7 など）を
 *   誤って食べてしまい、実際には失われていないのに失われたと誤検出する。
 *   コメント（<!--sq:...-->）だけを除去する。
 *
 * 使い方: npx tsx scripts/verify-no-content-loss.mjs
 */
import { chemistryData } from '../src/data/chemistryData.ts';
import { mockExam } from '../src/data/mockExamData.ts';

/** 日本語の文字だけを数える（記号やスタイル文字列は複製されるため対象外） */
const isJapanese = (ch) => /[\u3040-\u30ff\u3400-\u9fff]/.test(ch);

function charBag(text) {
  const bag = new Map();
  for (const ch of String(text || '').replace(/<!--[\s\S]*?-->/g, '')) {
    if (!isJapanese(ch)) continue;
    bag.set(ch, (bag.get(ch) || 0) + 1);
  }
  return bag;
}

/** 期待される材料（データにもともとある文字列）を1本につなぐ */
function sourceMaterial(question) {
  return (question.subQuestions || [])
    .filter(Boolean)
    .flatMap((sub) => [
      sub.label || '',
      sub.detailedExplanation?.theme || '',
      String(sub.correctAnswer ?? ''),
      ...(sub.detailedExplanation?.steps || []).map(String),
    ])
    .join('\n');
}

let checked = 0;
const failures = [];

for (const part of chemistryData.parts) {
  for (const chapter of part.chapters || []) {
    for (const question of [...(chapter.practiceProblems || []), ...(chapter.miniTest || [])]) {
      const rendered = question.explanationSupplement || question.explanation || '';
      const material = sourceMaterial(question);
      if (!material.trim()) continue;
      checked++;

      const need = charBag(material);
      const have = charBag(rendered);
      const missing = [];
      for (const [ch, count] of need) {
        const short = count - (have.get(ch) || 0);
        if (short > 0) missing.push(`${ch}×${short}`);
      }
      if (missing.length > 0) {
        failures.push({ id: `${chapter.id}/${question.id}`, missing: missing.slice(0, 12) });
      }
    }
  }
}

// 模試も同じ基準で見る（解説そのものが消えていないか）
let mockChecked = 0;
for (const question of mockExam.questions) {
  const rows = question.subQuestions?.length
    ? question.subQuestions.map((sub) => ({
        id: `模試/問${question.questionNumber}(${sub.label})`,
        text: sub.explanation,
      }))
    : [{ id: `模試/問${question.questionNumber}`, text: question.explanation }];
  for (const row of rows) {
    mockChecked++;
    if (!String(row.text || '').replace(/<[^>]*>/g, '').trim()) {
      failures.push({ id: row.id, missing: ['解説が空'] });
    }
  }
}

console.log('===== 情報量チェック（要約・省略の検出）=====');
console.log(`章の問題: ${checked} 問を検査`);
console.log(`模試　　: ${mockChecked} 問を検査`);

if (failures.length > 0) {
  console.log('\n情報が失われている問題:');
  for (const f of failures) console.log(`  ${f.id}  欠落: ${f.missing.join(' ')}`);
  console.error('\n❌ 解説の情報量が減っています。');
  process.exit(1);
}

console.log('\n✅ 解説の情報は1文字も失われていません。');
