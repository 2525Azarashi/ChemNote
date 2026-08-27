/**
 * ===================================================================
 * 解説の後処理（章をなめて explanation を整形する）
 * ===================================================================
 *
 * ■ なぜこのファイルを置いたのか
 *   chemistryData.ts（化学基礎）と chemistryAdvancedData.ts（化学）の
 *   末尾に、まったく同じ形の後処理ループが2つ書かれていた。
 *
 *     章をすべて集める
 *       → 章ごとに単元の教え方（getUnitTeaching）を引く
 *       → practiceProblems と miniTest をまとめて回す
 *       → explanation がロジックツリーのJSONなら
 *            explanation は触らず explanationSupplement を作る
 *       → そうでなければ enhanceExplanation で整形して差し替える
 *
 *   ★「ロジックツリー問題の explanation を書き換えない」という分岐が
 *     この処理の要★で、ここを取り違えると描画用のJSONが整形されて
 *     フローチャートの画面が壊れる。
 *   同じ処理が2か所にあると、片方だけ直して食い違う危険がある。
 *
 * ■ ★2つの違い（消してはいけない差）★
 *   化学基礎だけ、最後の整形に3つめの引数を渡していた。
 *
 *     化学基礎: enhanceExplanation(problem, teaching, getMolUnitConversion(problem.id))
 *     化学    : enhanceExplanation(problem, teaching)
 *
 *   物質量（mol）計算の「単位変換の道順」は化学基礎の単元にしかないため、
 *   化学側は渡していない。ここを片方に寄せると、
 *   ・化学基礎から外す → mol問題の道順ブロックが消える
 *   ・化学にも渡す     → 無関係な単元に別の内容が混ざり得る
 *   という壊し方をする。
 *
 *   そこで共通化したのは「章のなめ方・分岐・順序」だけにとどめ、
 *   3つめの引数をどう決めるかは呼び出し側が関数で渡す形にした。
 *
 * ■ 置き場所について
 *   utils ではなく data に置いている。
 *   この処理は getUnitTeaching（data/unitTeaching.ts）を使うため、
 *   utils に置くと utils → data の依存が生まれ、
 *   以前つぶした utils→data→utils の循環を作り直してしまう。
 *   （utils/explanationFormat.ts が data から型だけを import している
 *     現状の一方向を崩さないため）
 */

import {
  buildSupplement,
  enhanceExplanation,
  extractFlowchartSteps,
  isStructuredExplanation,
} from '../utils/explanationFormat';
import { getUnitTeaching } from './unitTeaching';
import type { UnitConversionWalk } from './teachingTypes';

/** 後処理の対象になるデータの形（{ parts: [{ chapters: [...] }] }） */
interface SubjectDataLike {
  parts: any[];
}

export interface ExplanationPostProcessOptions {
  /**
   * 問題IDから「単位変換の道順」を引く関数。
   *
   * 渡した場合だけ、整形の3つめの引数として使われる
   * （化学基礎の物質量計算のための仕組み）。
   * 渡さなければ、従来の化学（発展）側と同じ挙動になる。
   */
  unitConversionOf?: (problemId: string) => UnitConversionWalk | undefined;
}

/**
 * 1教科ぶんのデータをなめて、解説を表示用の形に整える。
 *
 * enhanceExplanation は冪等（整形済みマーカーで二重適用を防ぐ）なので、
 * HMR などで2回走っても内容は変わらない。
 *
 * @param data    { parts: [...] } の形をした教科データ
 * @param options unitConversionOf を渡すと単位変換ブロックが有効になる
 */
export function applyExplanationPostProcess(
  data: SubjectDataLike,
  options: ExplanationPostProcessOptions = {},
): void {
  const { unitConversionOf } = options;

  const chapters = (data.parts as any[]).flatMap((part: any) => part.chapters || []);

  for (const chapter of chapters) {
    const teaching = getUnitTeaching(chapter.id);
    const problems = [
      ...(chapter.practiceProblems || []),
      ...(chapter.miniTest || []),
    ];

    for (const problem of problems) {
      if (!problem) continue;

      if (typeof problem.explanation === 'string' && isStructuredExplanation(problem.explanation)) {
        // ロジックツリー問題：explanation は描画用の構造化データなので触らず、
        // 解答・思考手順・出題傾向は補足ブロックとして別フィールドに持たせる。
        // 思考手順はフローチャートの STEP を参照する形で組み立てる。
        problem.explanationSupplement = buildSupplement(
          problem,
          teaching,
          extractFlowchartSteps(problem.explanation),
        );
        continue;
      }

      // 物質量（mol）計算問題は、まとめプリントの「単位変換の図」に沿った
      // 道順ブロックを解答の直後に差し込む（molUnitConversions.ts が供給）。
      // unitConversionOf を渡していない教科では、これまでどおり
      // 引数なしで呼んだのと同じ結果になる。
      problem.explanation = enhanceExplanation(
        problem,
        teaching,
        unitConversionOf ? unitConversionOf(problem.id) : undefined,
      );
    }
  }
}
