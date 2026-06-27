// 共通テストまでの残り日数を計算するユーティリティ
// 2027年度（令和9年度）大学入学共通テストは 2027年1月16日(土)・17日(日) 実施予定

// 試験初日（この日を「当日」とし、それまでの残り日数をカウントする）
export const EXAM_DATE = new Date(2027, 0, 16); // 月は0始まりなので 0 = 1月
export const EXAM_DATE_LABEL = '2027年1月16日・17日';

/**
 * 今日から共通テスト初日までの残り日数を返す。
 * 当日以降は 0 を返す（マイナスにはしない）。
 */
export function getDaysUntilExam(from: Date = new Date()): number {
  // 時刻を切り捨てて「日付」だけで差分を取る
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(EXAM_DATE.getFullYear(), EXAM_DATE.getMonth(), EXAM_DATE.getDate());
  const diffMs = end.getTime() - start.getTime();
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(0, days);
}
