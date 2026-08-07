/**
 * 小問アコーディオンの「中身が出るか」を全問チェックする回帰テスト。
 *
 * ■ 何を守るための検査か（要件②④⑤）
 * 採点結果の画面では、小問を1つ開くと
 *   ［その小問のカード］→［解法の思考手順］→［詳しい解説］
 * がその場で最後まで読める、という約束になっている。
 *
 * ところが解説の切り分けはラベルの書き方（(ア) / (1) / 問1 / a / 説明文…）に
 * 依存しているため、データを追加したときに「開いても中身が空」という
 * 事故が起こりやすい。実際、対策前は全1032小問のうち大多数が空だった。
 *
 * このスクリプトは Explanation.tsx の sliceForSq() をそのまま再現し、
 * 「1つでも空になる小問があれば失敗」とする。
 *
 * 使い方: npx tsx scripts/verify-subquestion-coverage.mjs
 */
import { chemistryData } from '../src/data/chemistryData.ts';
import {
  sliceEnhancedBySubQuestion,
  sliceEnhancedByQuestion,
  questionGroupKey,
} from '../src/utils/explanationFormat.ts';

/** Explanation.tsx の sliceForSq と同じ順序・同じ条件で切り出す */
function sliceForSq(enhanced, sq) {
  const sub = sliceEnhancedBySubQuestion(enhanced);
  if (sub) {
    const key = String(sq?.id ?? '');
    const hit = sub.subs.filter((x) => x.id === key);
    if (hit.length > 0) {
      return [hit.map((x) => x.body).join('\n'), sub.shared]
        .filter((t) => t.trim())
        .join('\n');
    }
    if (sub.shared.trim()) return sub.shared;
  }
  const qs = sliceEnhancedByQuestion(enhanced);
  if (!qs) return '';
  const key = questionGroupKey(sq?.label);
  if (!key) return '';
  return qs.groups.filter((g) => g.key === key).map((g) => g.text).join('\n');
}

let totalSq = 0;
let filled = 0;
const emptyByQuestion = new Map();

for (const part of chemistryData.parts) {
  for (const chapter of part.chapters || []) {
    for (const question of [...(chapter.practiceProblems || []), ...(chapter.miniTest || [])]) {
      const text = question.explanationSupplement || question.explanation || '';
      const subs = (question.subQuestions || []).filter(Boolean);
      // 小問が1つしかない大問は、解説全体がそのまま1問ぶんなので対象外
      if (subs.length < 2) continue;
      for (const sq of subs) {
        totalSq++;
        if (sliceForSq(text, sq).trim()) {
          filled++;
        } else {
          const key = `${chapter.id}/${question.id}`;
          emptyByQuestion.set(key, (emptyByQuestion.get(key) || 0) + 1);
        }
      }
    }
  }
}

const pct = totalSq === 0 ? '100.0' : ((filled / totalSq) * 100).toFixed(1);
console.log('===== 小問アコーディオンの中身チェック =====');
console.log(`対象の小問: ${totalSq}`);
console.log(`中身が出る: ${filled}（${pct}%）`);
console.log(`空になる　: ${totalSq - filled}`);

if (emptyByQuestion.size > 0) {
  console.log('\n中身が出ない大問:');
  for (const [key, count] of emptyByQuestion) console.log(`  ${key}  （${count}小問）`);
  console.error('\n❌ アコーディオンを開いても解説が出ない小問があります。');
  process.exit(1);
}

console.log('\n✅ すべての小問で、その場で解説が完結します。');
