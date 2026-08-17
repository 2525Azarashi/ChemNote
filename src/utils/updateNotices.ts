/**
 * ===================================================================
 * updateNotices.ts（utils）― お知らせの既読管理
 * ===================================================================
 *
 * ■ 役割
 *   「どのお知らせまで読んだか」を端末に覚えさせ、
 *   未読件数（ベルのバッジ）を計算する。
 *
 * ■ なぜアカウントに紐づけないのか
 *   お知らせは全員に同じ内容が届くので、端末ごとの既読で十分。
 *   ログインしていない利用者にも同じ体験を提供でき、
 *   Firestore の読み書きも発生しない（無料枠を消費しない）。
 *
 * ■ 保存する値
 *   「最後に開いたときの最新お知らせID」ではなく
 *   「最後に開いた時刻（epoch ミリ秒）」ではなく、
 *   **既読にしたお知らせIDの集合**を持つ。
 *   IDの集合にしている理由は、過去に遡って1件だけ追加した場合でも
 *   （日付が古いお知らせを後から足したときでも）取りこぼさないため。
 *   件数が増えても1件あたり十数バイトなので容量の心配はない。
 */

import { UPDATE_NOTICES, type UpdateNotice } from '../data/updateNotices';

/** localStorage のキー */
const READ_KEY = 'update_notices_read_v1';

function safeStorage(): Storage | null {
  try {
    const ls = (globalThis as any)?.localStorage;
    if (ls && typeof ls.getItem === 'function') return ls as Storage;
  } catch {
    // プライベートブラウズ等で参照できない場合がある
  }
  return null;
}

/** 既読にしたお知らせIDの集合を読む。壊れた値は空として扱う。 */
export function loadReadIds(): Set<string> {
  const storage = safeStorage();
  if (!storage) return new Set();
  try {
    const raw = storage.getItem(READ_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(parsed) ? parsed.filter((v) => typeof v === 'string') : []);
  } catch {
    return new Set();
  }
}

/**
 * 日付・時刻の新しい順に並べたお知らせ。
 * date + time を文字列比較できる形（'2026-08-17 19:10'）にして比較する。
 * ゼロ埋めされた固定長なので、文字列比較でそのまま時系列順になる。
 */
export function sortedNotices(): UpdateNotice[] {
  return [...UPDATE_NOTICES].sort((a, b) =>
    `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`),
  );
}

/** 未読のお知らせ一覧（新しい順）。 */
export function unreadNotices(): UpdateNotice[] {
  const read = loadReadIds();
  return sortedNotices().filter((n) => !read.has(n.id));
}

/** 未読件数。ベルのバッジに出す。 */
export function unreadNoticeCount(): number {
  return unreadNotices().length;
}

/**
 * すべて既読にする（お知らせ画面を開いたときに呼ぶ）。
 *
 * 保存に失敗しても例外は投げない。既読にできない環境では
 * 毎回バッジが出るだけで、機能そのものは壊れない。
 */
export function markAllNoticesRead(): void {
  const storage = safeStorage();
  if (!storage) return;
  try {
    const ids = UPDATE_NOTICES.map((n) => n.id);
    storage.setItem(READ_KEY, JSON.stringify(ids));
  } catch {
    // 保存できなくても致命的ではない
  }
}

/**
 * 日時の表示文字列（'2026-08-17' + '19:10' → '2026年8月17日 19:10'）。
 * 「簡易的な修正・追加内容と日時程度」というご要望どおり、
 * 秒までは出さず、分単位で読みやすく整える。
 */
export function formatNoticeDateTime(notice: UpdateNotice): string {
  const [y, m, d] = notice.date.split('-');
  const month = String(Number(m));
  const day = String(Number(d));
  return `${y}年${month}月${day}日 ${notice.time}`;
}

/**
 * 「今日／きのう／それ以前」の相対表記。
 * 日付だけだと更新の勢いが伝わらないため、直近のものは相対表記にする。
 * @param now テストから固定時刻を渡せるようにしている
 */
export function relativeNoticeLabel(notice: UpdateNotice, now: Date = new Date()): string {
  const [y, m, d] = notice.date.split('-').map(Number);
  const target = new Date(y, (m || 1) - 1, d || 1);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86400000);
  if (diffDays <= 0) return '今日';
  if (diffDays === 1) return 'きのう';
  if (diffDays < 7) return `${diffDays}日前`;
  return formatNoticeDateTime(notice).split(' ')[0];
}
