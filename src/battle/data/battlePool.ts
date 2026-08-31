/**
 * ===================================================================
 * 対戦用 出題プールの読み込み口（自動生成・手で編集しないこと）
 * ===================================================================
 *
 * ★このファイルは scripts/gen-battle-pool.mts が生成する。★
 *
 * -------------------------------------------------------------------
 * ■ 役割
 * -------------------------------------------------------------------
 * 教科ごとに分かれた生成ファイル（pool.*.generated.ts）を
 * ★必要になった教科だけ★ 動的に読み込む。
 *
 * 全教科をまとめると約900KBある。対戦画面を開いた時点で全部読むと、
 * 化学基礎で対戦する人が英語・数学・地理の問題まで
 * ダウンロードすることになる。教科は対戦開始時に決まっているので、
 * その1教科だけを取れば十分である。
 *
 * -------------------------------------------------------------------
 * ■ 一度読んだ教科は使い回す
 * -------------------------------------------------------------------
 * 1試合の中で何度も呼ばれる（問題を1問ずつ引く）ので、
 * 読み込み結果はモジュール内に保持する。
 * 同じ教科で連続して対戦しても再ダウンロードは起きない。
 */

import type { BattleAnswerFormat, BattleQuestion } from '../core/types';

/** 教科ごとの収録数（UIで「この教科は◯問あります」と出すために使う） */
export const POOL_COUNTS: Readonly<Record<string, number>> = {
  chemistry_basic: 763,
  chemistry: 46,
  english_listening: 146,
  math: 100,
  biology_basic: 348,
  english_grammar: 100,
  geography: 25,
};

const FORMATS: readonly BattleAnswerFormat[] = ['choice4', 'word', 'panel'];

/**
 * タプルを BattleQuestion に戻す。
 *
 * ★並びは生成ファイル側の toTuple() と対応している。★
 * どちらか片方だけ変えると全教科が壊れるので、必ず同時に変えること。
 */
function expand(subject: string, t: readonly unknown[]): BattleQuestion {
  return {
    id: t[0] as string,
    subject,
    chapterId: t[1] as string,
    problemId: t[2] as string,
    subQuestionId: t[3] as string,
    // 形式番号が範囲外なら choice4 に寄せる。
    // 生成データが壊れていた場合でも「画面が真っ白」にはしない
    // （4択として描画すれば、少なくとも問題文と選択肢は読める）。
    format: FORMATS[t[4] as number] ?? 'choice4',
    prompt: t[5] as string,
    label: t[6] as string,
    options: t[7] as string[],
    answerIndex: t[8] as number,
    panelOrder: t[9] as number[],
    timeLimit: t[10] as number,
    imageUrl: (t[11] as string) || undefined,
  };
}

async function loadRaw(subject: string): Promise<readonly unknown[][]> {
  switch (subject) {
    case 'chemistry_basic':
      return (await import('./pool.chemistry_basic.generated')).POOL;
    case 'chemistry':
      return (await import('./pool.chemistry.generated')).POOL;
    case 'english_listening':
      return (await import('./pool.english_listening.generated')).POOL;
    case 'math':
      return (await import('./pool.math.generated')).POOL;
    case 'biology_basic':
      return (await import('./pool.biology_basic.generated')).POOL;
    case 'english_grammar':
      return (await import('./pool.english_grammar.generated')).POOL;
    case 'geography':
      return (await import('./pool.geography.generated')).POOL;
    default:
      return [];
  }
}

/** 読み込み済みの教科（教科ID → 出題の配列） */
const cache = new Map<string, readonly BattleQuestion[]>();
/** 読み込み中の教科（同時に2回呼ばれても1回しか取りに行かないため） */
const inflight = new Map<string, Promise<readonly BattleQuestion[]>>();

/**
 * 教科の出題プールを読み込む。
 *
 * ★並び順はプールの並び（ID昇順）で固定★
 * 抽選は「部屋IDを種にした決定論的な乱数」でこの並びに対して行うため、
 * 順序が変わると同じ種でも違う問題が選ばれ、
 * 対戦相手と出題がズレる（＝対戦が成立しない）。
 * 生成時にID昇順で固定してあるので、問題を足さない限り順序は変わらない。
 */
export async function loadPool(subject: string): Promise<readonly BattleQuestion[]> {
  const cached = cache.get(subject);
  if (cached) return cached;

  const running = inflight.get(subject);
  if (running) return running;

  const promise = loadRaw(subject)
    .then((raw) => {
      const list = raw.map((t) => expand(subject, t));
      cache.set(subject, list);
      inflight.delete(subject);
      return list as readonly BattleQuestion[];
    })
    .catch((error) => {
      inflight.delete(subject);
      throw error;
    });

  inflight.set(subject, promise);
  return promise;
}

/**
 * 出題ID → 出題。
 * 部屋に保存されているのは questionIds だけなので、これで本体に戻す。
 * ★読み込み済みの教科でしか引けない★（先に loadPool を呼ぶこと）
 */
export function questionByIdSync(subject: string, id: string): BattleQuestion | undefined {
  const list = cache.get(subject);
  if (!list) return undefined;
  return list.find((q) => q.id === id);
}

/** 出題IDの一覧（形式で絞り込む）。抽選の母集団に使う */
export async function poolIdsOf(
  subject: string,
  formats: readonly BattleAnswerFormat[],
): Promise<string[]> {
  const list = await loadPool(subject);
  return list.filter((q) => formats.includes(q.format)).map((q) => q.id);
}

/** 読み込み済みの出題を全部返す（テスト・検証用） */
export function loadedPool(subject: string): readonly BattleQuestion[] {
  return cache.get(subject) || [];
}
