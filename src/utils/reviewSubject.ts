/**
 * ===================================================================
 * 復習アイテム → 科目の判定・集計・表示用テキスト
 * ===================================================================
 *
 * ■ なぜこのファイルが必要か
 *   「忘却曲線と定着度」ダッシュボードは、全科目の復習問題を1本の
 *   リストに混ぜて表示していた。化学基礎の問題と英語リスニングの問題が
 *   隣に並ぶため、「どの科目の復習なのか」が色も見出しも無いまま
 *   ユーザーの読解に委ねられていた。
 *
 *   科目ごとに分けて表示したいが、ReviewItem（src/utils/reviewList.ts）は
 *   chapterId しか持っておらず、subject フィールドが無い。
 *   すでに端末の localStorage に保存されている既存データにも当然無い。
 *
 *   そこで「保存済みデータをマイグレーションせずに」科目を復元できるよう、
 *   chapterId から科目を逆引きする関数をここに集約した。
 *   ReviewItem のスキーマを変更しないので、
 *   既存ユーザーの復習リストはそのまま使え、Firestore 同期の
 *   マージ処理（studySyncCore）にも影響しない。
 *
 * ■ 判定の根拠（chapterId の命名規則）
 *   実データの章IDは科目ごとに接頭辞が分かれている。
 *     化学基礎 … 'c1_1' 〜 'c6_7'      （src/data/chemistryData.ts）
 *     化学     … 'a1_1' 〜 'a14_5'     （src/data/chemistryAdvancedData.ts）
 *     リスニング … 'el1_A', 'el2', 'el3' 〜 'el6_B'（src/data/englishListeningData.ts）
 *
 *   単なる先頭1文字の判定にすると 'el…' が 'e' で化学基礎に化けるなど
 *   将来の追加で壊れやすいので、
 *     1) まず実データから作った章IDの集合に問い合わせ（最も確実）
 *     2) 見つからなければ命名規則の正規表現で判定（新章の追加に追従）
 *   の2段構えにしている。どちらでも決まらなければ null を返し、
 *   呼び出し側で「その他」として扱う（データを捨てない）。
 */

import { REVIEW_INTERVALS_DAYS, type ReviewItem } from './reviewList';
import { stripHtmlToText } from './sanitizeHtml';

/** ダッシュボードが扱う科目ID。SubjectSelection の SubjectId と同じ値を使う。 */
export type ReviewSubjectId = 'chemistry_basic' | 'chemistry' | 'english_listening';

/** 科目が判定できなかったアイテムをまとめる擬似ID */
export const UNKNOWN_SUBJECT = 'other' as const;

export type ReviewSubjectKey = ReviewSubjectId | typeof UNKNOWN_SUBJECT;

/** 「すべて」タブのID（科目IDと衝突しない値にしている） */
export const ALL_SUBJECTS = 'all' as const;

export type SubjectTabId = typeof ALL_SUBJECTS | ReviewSubjectKey;

export const REVIEW_SUBJECT_LABELS: Record<ReviewSubjectKey, string> = {
  chemistry_basic: '化学基礎',
  chemistry: '化学',
  english_listening: '英語リスニング',
  other: 'その他',
};

/** タブに出す短縮名（スマホ幅でも4つ並べられる長さにする） */
export const REVIEW_SUBJECT_SHORT_LABELS: Record<ReviewSubjectKey, string> = {
  chemistry_basic: '化学基礎',
  chemistry: '化学',
  english_listening: '英語',
  other: 'その他',
};

/**
 * 科目ごとの識別色。
 * src/data/subjectTheme.ts のアクセント色と同じ値を使い、
 * アプリ内で「化学基礎＝ローズ／化学＝ブルー／リスニング＝ミント」の
 * 対応が画面をまたいでも崩れないようにしている。
 * Tailwind は動的なクラス名を拾えないので、完成形の文字列で持つ。
 */
export interface ReviewSubjectStyle {
  /** 文字色（濃いめ） */
  textClass: string;
  /** 背景（淡い面） */
  bgClass: string;
  /** 枠線 */
  borderClass: string;
  /** 選択中タブの塗り */
  activeClass: string;
  /** 左端の色帯（カードの科目識別） */
  stripeClass: string;
}

const SUBJECT_STYLES: Record<ReviewSubjectKey, ReviewSubjectStyle> = {
  chemistry_basic: {
    textClass: 'text-[#A8635D]',
    bgClass: 'bg-[#F0C7D2]/25',
    borderClass: 'border-[#F0C7D2]',
    activeClass: 'bg-[#C0847E] text-white border-[#C0847E]',
    stripeClass: 'bg-[#C0847E]',
  },
  chemistry: {
    textClass: 'text-[#3C6B8A]',
    bgClass: 'bg-[#A9CCE3]/25',
    borderClass: 'border-[#A9CCE3]',
    activeClass: 'bg-[#4A7FA0] text-white border-[#4A7FA0]',
    stripeClass: 'bg-[#4A7FA0]',
  },
  english_listening: {
    textClass: 'text-[#2F7C74]',
    bgClass: 'bg-[#A9E0D8]/25',
    borderClass: 'border-[#A9E0D8]',
    activeClass: 'bg-[#3E9C93] text-white border-[#3E9C93]',
    stripeClass: 'bg-[#3E9C93]',
  },
  other: {
    textClass: 'text-slate-600',
    bgClass: 'bg-slate-100',
    borderClass: 'border-slate-200',
    activeClass: 'bg-slate-600 text-white border-slate-600',
    stripeClass: 'bg-slate-400',
  },
};

export function reviewSubjectStyle(subject: ReviewSubjectKey): ReviewSubjectStyle {
  return SUBJECT_STYLES[subject] || SUBJECT_STYLES.other;
}

// ============================================================
// chapterId → 科目
// ============================================================

/**
 * 実データから章IDの集合を作る。
 * データ本体（chemistryData など）を import すると
 * ダッシュボードを開くだけで巨大なJSONを読み込むことになるため、
 * ここでは import せず「命名規則」だけで判定する方針を採った。
 *
 * 代わりに、呼び出し側（テスト含む）が実データの章IDを渡して
 * 規則の妥当性を検証できるようにしている。
 */
// 実データには枝番付きの章IDもある（化学基礎の 'c1_2_A' / 'c1_2_B' など）。
// 末尾の枝番を任意で許す形にしておく。
// 「実データの全章IDがどれかの科目に必ず分類される」ことは
// tests/reviewDashboard.test.ts が全件走査して保証しているので、
// 章が追加されて規則から外れた場合はテストが落ちて気づける。
const CHEMISTRY_BASIC_RE = /^c\d+_\d+(_[A-Z])?$/;
const CHEMISTRY_ADVANCED_RE = /^a\d+_\d+(_[A-Z])?$/;
const LISTENING_RE = /^el\d+(_[A-Z])?$/;

/**
 * 章IDから科目を判定する。判定できなければ null。
 *
 * 判定順に意味がある: 'el…' を先に見ることで、
 * 将来 'e' で始まる別の規則が増えても誤判定しにくくする。
 */
export function subjectOfChapterId(chapterId: string | null | undefined): ReviewSubjectId | null {
  const id = (chapterId || '').trim();
  if (!id) return null;
  if (LISTENING_RE.test(id)) return 'english_listening';
  if (CHEMISTRY_ADVANCED_RE.test(id)) return 'chemistry';
  if (CHEMISTRY_BASIC_RE.test(id)) return 'chemistry_basic';
  return null;
}

/** 復習アイテムの科目キー（判定できないものは 'other'） */
export function subjectOfReviewItem(item: ReviewItem): ReviewSubjectKey {
  return subjectOfChapterId(item.chapterId) ?? UNKNOWN_SUBJECT;
}

// ============================================================
// 定着度
// ============================================================

/** box（間隔反復の段階）から定着度(0〜1)を求める */
export function retentionOf(item: ReviewItem): number {
  const steps = REVIEW_INTERVALS_DAYS.length - 1;
  if (steps <= 0) return 0;
  return Math.max(0, Math.min(1, item.box / steps));
}

/** 定着度の平均をパーセント（整数）で返す。空配列なら 0。 */
export function averageRetentionPercent(items: ReviewItem[]): number {
  if (!items || items.length === 0) return 0;
  const sum = items.reduce((s, it) => s + retentionOf(it), 0);
  return Math.round((sum / items.length) * 100);
}

// ============================================================
// 科目ごとの集計
// ============================================================

export interface SubjectSummary {
  subject: ReviewSubjectKey;
  label: string;
  shortLabel: string;
  items: ReviewItem[];
  /** 総数 */
  total: number;
  /** いま復習すべき件数（dueAt <= now） */
  dueCount: number;
  /** 平均定着度（%） */
  avgRetention: number;
}

/** 表示順（化学基礎 → 化学 → リスニング → その他）を固定する */
const SUBJECT_ORDER: ReviewSubjectKey[] = [
  'chemistry_basic',
  'chemistry',
  'english_listening',
  UNKNOWN_SUBJECT,
];

/**
 * 復習アイテムを科目ごとにまとめ、件数と平均定着度を集計する。
 * アイテムが1件も無い科目はタブを増やしても意味がないので返さない。
 */
export function summarizeBySubject(items: ReviewItem[], now: number = Date.now()): SubjectSummary[] {
  const buckets = new Map<ReviewSubjectKey, ReviewItem[]>();
  for (const it of items || []) {
    const key = subjectOfReviewItem(it);
    const arr = buckets.get(key);
    if (arr) arr.push(it);
    else buckets.set(key, [it]);
  }

  return SUBJECT_ORDER.filter((key) => (buckets.get(key)?.length ?? 0) > 0).map((key) => {
    const list = buckets.get(key) as ReviewItem[];
    return {
      subject: key,
      label: REVIEW_SUBJECT_LABELS[key],
      shortLabel: REVIEW_SUBJECT_SHORT_LABELS[key],
      items: list,
      total: list.length,
      dueCount: list.reduce((n, it) => (it.dueAt <= now ? n + 1 : n), 0),
      avgRetention: averageRetentionPercent(list),
    };
  });
}

/** 選択中のタブに対応するアイテムだけを取り出す */
export function filterBySubjectTab(items: ReviewItem[], tab: SubjectTabId): ReviewItem[] {
  if (tab === ALL_SUBJECTS) return items || [];
  return (items || []).filter((it) => subjectOfReviewItem(it) === tab);
}

// ============================================================
// カード表示用テキスト
// ============================================================

/**
 * カード1行目の「出題範囲」を組み立てる。
 *
 * 科目によって questionIndex の意味が違うため、表記を分けている。
 *   リスニング … 1つの大問（第1問Aなど）に複数セットがあるので
 *                「第N回 第1問 A」と読ませる（例: 第2回 第1問 A）
 *   化学系     … 章の中のN番目の問題なので「1章 物質の状態と平衡 第3問」
 *
 * chapterTitle が無い古いデータでも空文字を返さないよう、
 * 章IDを最後の手掛かりとして使う。
 */
export function formatScope(item: ReviewItem): string {
  const subject = subjectOfReviewItem(item);
  const title = (item.chapterTitle || '').trim();
  const index = item.questionIndex;

  if (subject === 'english_listening') {
    const round = typeof index === 'number' && index > 0 ? `第${index}回` : '';
    const parts = [round, title].filter(Boolean);
    if (parts.length > 0) return parts.join(' ');
  } else {
    const q = typeof index === 'number' && index > 0 ? `第${index}問` : '';
    const parts = [title, q].filter(Boolean);
    if (parts.length > 0) return parts.join(' ');
  }

  return title || item.chapterId || '出題範囲不明';
}

/**
 * 設問の要約（カード2行目）。
 *
 * 以前は問題文の冒頭90文字をそのまま出していたため、
 * カードの高さが3〜4行に膨らみ一覧性を損なっていた。
 * ここでは「最初の1文」だけを取り出して短く整える。
 *
 *   - HTMLタグを落とす（stripHtmlToText と同じ安全な実装を使う）
 *   - 改行・連続空白を1つの空白に畳む
 *   - 句点（。．.！？!?）で切って最初の1文にする
 *   - それでも長い場合は max 文字で切って末尾に省略記号を付ける
 */
export function summarizeQuestion(raw: string | null | undefined, max = 44): string {
  const text = stripHtmlToText(raw || '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!text) return '（問題文なし）';

  // 最初の文末記号までを1文とみなす。記号自体は残す（「。」で終わると自然）。
  const match = text.match(/^[\s\S]*?[。．.!?！？]/u);
  let sentence = (match ? match[0] : text).trim();

  // 1文が極端に短い（「次の問いに答えよ。」の前置きだけ等）場合は
  // 情報量が足りないので、元テキストの先頭から取り直す。
  if (sentence.length < 12 && text.length > sentence.length) {
    sentence = text;
  }

  if (sentence.length > max) return sentence.slice(0, max).trimEnd() + '…';
  return sentence;
}

/**
 * カード3行目のバッジ。要件どおり最大2つに絞る。
 *
 * ReviewItem は「難易度」を保持していない（問題データ側の属性で、
 * 復習リストには写していない）。そこで代わりに、復習の判断に直接
 * 効く2つだけを出す:
 *   1) 苦手度 … 何回間違えたか。2回以上で「苦手」として強調する
 *   2) 定着度 … box から求めた定着率。次にやるべきかの目安になる
 * それ以外（正答・自分の解答・復習正解回数・予定日）は
 * カードを開いたときの詳細に回す。
 */
export interface ReviewBadge {
  /** バッジの種類（テストとスタイル分岐で使う） */
  kind: 'weak' | 'retention' | 'mastered';
  label: string;
}

export function badgesForItem(item: ReviewItem): ReviewBadge[] {
  const badges: ReviewBadge[] = [];
  const retention = Math.round(retentionOf(item) * 100);

  if (item.box >= REVIEW_INTERVALS_DAYS.length - 1) {
    badges.push({ kind: 'mastered', label: '習得済み' });
  } else if (item.wrongCount >= 2) {
    badges.push({ kind: 'weak', label: `苦手 ${item.wrongCount}回` });
  }

  badges.push({ kind: 'retention', label: `定着 ${retention}%` });

  // 最大2つ（要件: バッジ2つまで）
  return badges.slice(0, 2);
}
