/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 復習リスト（間違えた問題）ユーティリティ
 *
 * 設計方針:
 *   - 端末内 localStorage をソース・オブ・トゥルースとして完結（オフラインでも動作）。
 *   - 誤答は採点時に自動でキャプチャし、忘却曲線（間隔反復）で再出題スケジュールを持つ。
 *   - ゲスト（未ログイン）でも uid = 'guest' として同じ仕組みで保存できる。
 *   - 将来的な Firestore 同期に備え、各アイテムは updatedAt を持ち「新しい方優先」でマージ可能な形にしている。
 *     （本PRではローカル完結。Firestore 同期は後続PRで addReviewItems() 等の純データ関数を再利用する）
 *
 * ⚠️ データエクスポート系（// DO NOT MODIFY / protected 領域）には一切触れない。
 *    これは新規の独立モジュールであり、既存の problem JSON / Firestore スキーマを変更しない。
 */

const STORAGE_PREFIX = 'review_list_';

/**
 * 忘却曲線（間隔反復）の復習間隔（日数）。
 * box 0 = 当日, box 1 = 翌日, box 2 = 3日後 ... と段階的に間隔を伸ばす。
 * 正解するたびに box を1つ進め、間違えると box 0 に戻す。
 */
export const REVIEW_INTERVALS_DAYS = [0, 1, 3, 7, 14, 30, 60] as const;

const DAY_MS = 24 * 60 * 60 * 1000;

export interface ReviewItem {
  /** 一意キー: `${chapterId}::${questionId}::${subQuestionId}` */
  key: string;
  chapterId: string;
  chapterTitle?: string;
  /** 章内の問題番号（1始まり、表示用） */
  questionIndex?: number;
  questionId: string;
  subQuestionId: string;
  /** 設問ラベル（例: 「(1)」「問1」） */
  subLabel?: string;
  /** 問題文（プレビュー用、長い場合は呼び出し側で切り詰め） */
  questionText?: string;
  /** 正答（表示用） */
  correctAnswer?: string;
  /** 直近に誤答した際のユーザー解答（表示用） */
  lastWrongAnswer?: string;
  /** 間隔反復のボックス番号（0〜REVIEW_INTERVALS_DAYS.length-1） */
  box: number;
  /** 次回復習予定日時（epoch ms）。この時刻を過ぎたものが「復習対象」 */
  dueAt: number;
  /** 累計の間違い回数 */
  wrongCount: number;
  /** 累計の正解回数（復習で正解した回数） */
  correctCount: number;
  /** 初回登録日時 */
  createdAt: number;
  /** 最終更新日時（Firestore マージ時の勝敗判定に使用） */
  updatedAt: number;
}

function storageKey(uid: string | null | undefined): string {
  return `${STORAGE_PREFIX}${uid || 'guest'}`;
}

function makeItemKey(chapterId: string, questionId: string, subQuestionId: string): string {
  return `${chapterId}::${questionId}::${subQuestionId}`;
}

/** 指定日数後の epoch ms を返す（当日基準、時刻はそのまま） */
function dueAfterDays(days: number, from: number = Date.now()): number {
  return from + days * DAY_MS;
}

function boxToDue(box: number, from: number = Date.now()): number {
  const clamped = Math.max(0, Math.min(box, REVIEW_INTERVALS_DAYS.length - 1));
  return dueAfterDays(REVIEW_INTERVALS_DAYS[clamped], from);
}

// ============================================================
// 読み書き（純粋なストレージ操作）
// ============================================================

export function loadReviewList(uid: string | null | undefined): ReviewItem[] {
  try {
    const raw = localStorage.getItem(storageKey(uid));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as ReviewItem[];
  } catch {
    return [];
  }
}

export function saveReviewList(uid: string | null | undefined, items: ReviewItem[]): void {
  try {
    localStorage.setItem(storageKey(uid), JSON.stringify(items));
  } catch {
    /* noop: ストレージ枯渇時などは黙って無視 */
  }
}

// ============================================================
// キャプチャ（採点時に呼ばれる）
// ============================================================

export interface WrongAnswerInput {
  chapterId: string;
  chapterTitle?: string;
  questionIndex?: number;
  questionId: string;
  subQuestionId: string;
  subLabel?: string;
  questionText?: string;
  correctAnswer?: string;
  wrongAnswer?: string;
}

/**
 * 誤答を1件、復習リストに登録（既存なら間違い回数を加算しスケジュールを box 0 に戻す）。
 * 副作用なし版（items を受け取り新配列を返す）。ストレージ書き込みは行わない。
 */
export function upsertWrongAnswer(items: ReviewItem[], input: WrongAnswerInput): ReviewItem[] {
  const key = makeItemKey(input.chapterId, input.questionId, input.subQuestionId);
  const now = Date.now();
  const idx = items.findIndex((it) => it.key === key);

  if (idx === -1) {
    const newItem: ReviewItem = {
      key,
      chapterId: input.chapterId,
      chapterTitle: input.chapterTitle,
      questionIndex: input.questionIndex,
      questionId: input.questionId,
      subQuestionId: input.subQuestionId,
      subLabel: input.subLabel,
      questionText: input.questionText,
      correctAnswer: input.correctAnswer,
      lastWrongAnswer: input.wrongAnswer,
      box: 0,
      dueAt: boxToDue(0, now),
      wrongCount: 1,
      correctCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    return [...items, newItem];
  }

  // 既存: 間違えたので box を 0 に戻し、当日復習対象へ
  const existing = items[idx];
  const updated: ReviewItem = {
    ...existing,
    // 表示情報は最新で上書き（問題文修正などに追従）
    chapterTitle: input.chapterTitle ?? existing.chapterTitle,
    questionIndex: input.questionIndex ?? existing.questionIndex,
    subLabel: input.subLabel ?? existing.subLabel,
    questionText: input.questionText ?? existing.questionText,
    correctAnswer: input.correctAnswer ?? existing.correctAnswer,
    lastWrongAnswer: input.wrongAnswer ?? existing.lastWrongAnswer,
    box: 0,
    dueAt: boxToDue(0, now),
    wrongCount: existing.wrongCount + 1,
    updatedAt: now,
  };
  const next = items.slice();
  next[idx] = updated;
  return next;
}

/**
 * 複数の誤答をまとめて登録し、localStorage へ保存する（採点時の呼び出し口）。
 */
export function captureWrongAnswers(
  uid: string | null | undefined,
  inputs: WrongAnswerInput[]
): void {
  if (!inputs || inputs.length === 0) return;
  let items = loadReviewList(uid);
  for (const input of inputs) {
    items = upsertWrongAnswer(items, input);
  }
  saveReviewList(uid, items);
}

// ============================================================
// 復習操作（ユーザーが「できた」「まだ」を押す）
// ============================================================

/**
 * 復習で正解 → box を1つ進め、次回予定日を先送りする。
 * 最終ボックスまで到達したら習得済みとして扱えるよう correctCount を加算。
 */
export function markReviewedCorrect(uid: string | null | undefined, key: string): ReviewItem[] {
  const items = loadReviewList(uid);
  const now = Date.now();
  const next = items.map((it) => {
    if (it.key !== key) return it;
    const nextBox = Math.min(it.box + 1, REVIEW_INTERVALS_DAYS.length - 1);
    return {
      ...it,
      box: nextBox,
      dueAt: boxToDue(nextBox, now),
      correctCount: it.correctCount + 1,
      updatedAt: now,
    };
  });
  saveReviewList(uid, next);
  return next;
}

/**
 * 復習で不正解 → box を 0 に戻して当日再出題対象へ。
 */
export function markReviewedWrong(uid: string | null | undefined, key: string): ReviewItem[] {
  const items = loadReviewList(uid);
  const now = Date.now();
  const next = items.map((it) => {
    if (it.key !== key) return it;
    return {
      ...it,
      box: 0,
      dueAt: boxToDue(0, now),
      wrongCount: it.wrongCount + 1,
      updatedAt: now,
    };
  });
  saveReviewList(uid, next);
  return next;
}

/**
 * 復習リストから完全に削除（「マスターした」「不要」）。
 */
export function removeReviewItem(uid: string | null | undefined, key: string): ReviewItem[] {
  const items = loadReviewList(uid).filter((it) => it.key !== key);
  saveReviewList(uid, items);
  return items;
}

/**
 * ユーザーが手動で1問を復習に追加する（採点フロー外からの導線）。
 */
export function addReviewItemManually(
  uid: string | null | undefined,
  input: WrongAnswerInput
): ReviewItem[] {
  const items = upsertWrongAnswer(loadReviewList(uid), input);
  saveReviewList(uid, items);
  return items;
}

// ============================================================
// 参照系（表示・スケジュール判定）
// ============================================================

/** 今復習すべき（dueAt <= now）アイテムのみを、緊急度順（古い予定日→間違い回数）で返す */
export function getDueReviewItems(
  uid: string | null | undefined,
  now: number = Date.now()
): ReviewItem[] {
  return loadReviewList(uid)
    .filter((it) => it.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt || b.wrongCount - a.wrongCount);
}

/** 全アイテムを更新日時の新しい順で返す（一覧表示用） */
export function getAllReviewItems(uid: string | null | undefined): ReviewItem[] {
  return loadReviewList(uid).sort((a, b) => b.updatedAt - a.updatedAt);
}

/** 復習対象件数（バッジ表示用） */
export function getDueCount(uid: string | null | undefined, now: number = Date.now()): number {
  return loadReviewList(uid).reduce((n, it) => (it.dueAt <= now ? n + 1 : n), 0);
}

/** アイテムが「習得済み」とみなせるか（最終ボックス到達） */
export function isMastered(item: ReviewItem): boolean {
  return item.box >= REVIEW_INTERVALS_DAYS.length - 1;
}
