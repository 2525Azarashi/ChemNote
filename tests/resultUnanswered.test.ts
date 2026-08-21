import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

/**
 * ===================================================================
 * 「一問しか解いてないのに他のが全部不正解扱いになる」バグの回帰テスト
 * ===================================================================
 * ユーザー報告（単元の結果画面）：
 *   「バグって一問しか解いてないのに他のが全部不正解扱いになる」
 *
 * 原因は2つ重なっていた。
 *
 *   ① Quiz.tsx の clearAnswersForQuestionIfUnscored が
 *      「採点済みかどうか」を run.perQuestion しか見ていなかった。
 *      リスニングの1問ずつモードの採点記録は run.perStep
 *      （キー = 大問ID::小問ID）に入るため、大問を移動しただけで
 *      採点済みの解答まで削除されていた。
 *
 *   ② Explanation.tsx の結果画面が「未解答」と「不正解」を
 *      区別せず、isAnswerCorrect が false ＝ すべて不正解として
 *      集計・表示していた。1問だけ解いて結果画面を見ると、
 *      残り全部が赤い✕（不正解）に見える。
 *
 * ここではソースレベルで両方の修正が保たれていることを固定する。
 */

const quizSource = readFileSync('src/components/Quiz.tsx', 'utf8');
const explanationSource = readFileSync('src/components/Explanation.tsx', 'utf8');

describe('① 採点済み解答の誤削除（Quiz.tsx）', () => {
  it('採点済み判定は perQuestion と perStep の両方を見る', () => {
    // perQuestion 側
    expect(quizSource).toContain('const scoredAsQuestion = !!run.perQuestion[q.id];');
    // perStep 側（キーは「大問ID::小問ID」なので前方一致で調べる）
    expect(quizSource).toContain('const scoredAsStep = Object.keys(run.perStep || {}).some(');
    expect(quizSource).toContain('key.startsWith(`${q.id}::`)');
    expect(quizSource).toContain('if (scoredAsQuestion || scoredAsStep) return;');
  });

  it('perQuestion だけを見る旧実装に戻っていない', () => {
    expect(quizSource).not.toContain('const scored = !!run.perQuestion[q.id];');
  });
});

describe('② 未解答と不正解の区別（Explanation.tsx）', () => {
  it('isAttempted（空・空白のみは未解答）ヘルパーが存在する', () => {
    expect(explanationSource).toContain('function isAttempted(answer: string | undefined | null): boolean {');
    expect(explanationSource).toContain("return String(answer ?? '').trim().length > 0;");
  });

  it('採点結果の集計は 正解 / 不正解 / 未解答 の3値に分ける', () => {
    // 不正解 = 「手を付けたのに間違えた」問だけ
    expect(explanationSource).toContain(
      '(sq: any) => isAttempted(answers[sq.id]) && !isAnswerCorrect(sq, answers[sq.id])',
    );
    // 未解答は独立して数える
    expect(explanationSource).toContain(
      'const unansweredSqs = objectiveSqs.filter((sq: any) => !isAttempted(answers[sq.id]));',
    );
    // 見出しにも未解答数を出す（0件のときは出さない）
    expect(explanationSource).toContain('未解答 {unansweredSqs.length}');
    expect(explanationSource).toContain('{unansweredSqs.length > 0 && (');
  });

  it('未解答の問には赤い✕ではなく「未解答」バッジを出す', () => {
    expect(explanationSource).toContain('未解答 — まだ解いていない問です');
    // renderSq / renderSubQuestionCheck の両方で未解答フラグを使う
    const count = (explanationSource.match(/const isUnanswered = sq\.type !== 'descriptive' && !\w*[aA]ttempted/g) || []).length;
    expect(count).toBeGreaterThanOrEqual(2);
  });

  it('解いた問の正誤表示（正解！/不正解）は従来どおり残っている', () => {
    expect(explanationSource).toContain("'正解！' : '不正解 — ここが伸びしろ'");
  });
});
