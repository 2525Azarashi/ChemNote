/**
 * ===================================================================
 * ユーザーフィードバック収集ユーティリティ
 * ===================================================================
 *
 * 【収集先について】
 * 「メールアドレス（mntobira@gmail.com）に届くのか、Google スプレッドシート
 * に溜まるのか、まだ決めきれていない」という要件に対応するため、
 * “あとから切り替えられる” 3 系統の送信口（sink）を用意している。
 *
 *   ① Firestore（既定・常時ON）
 *      `feedback` コレクションに1件1ドキュメントで保存する。
 *      Firebase コンソールからそのまま閲覧・CSV エクスポートできるので、
 *      「とりあえず消えずに全部溜まる」土台として最優先で書き込む。
 *
 *   ② Google Apps Script Web アプリ（任意・環境変数で有効化）
 *      `VITE_FEEDBACK_WEBHOOK_URL` に GAS のデプロイURLを設定すると、
 *      同じ内容を GAS へ POST する。GAS 側（docs/feedback-gas.js）で
 *        - Google スプレッドシートへ1行追記
 *        - mntobira@gmail.com へメール通知
 *      の両方（または片方だけ）を行える。つまり「スプレッドシート」か
 *      「メール」かの判断を、アプリのコードを触らずに後から決められる。
 *
 *   ③ mailto: フォールバック（任意・最後の手段）
 *      ①②がどちらも失敗した／未設定のときに、本文を差し込んだ
 *      メール作成画面を開くリンクを提示する。宛先は FEEDBACK_EMAIL。
 *
 * さらに、通信失敗時は localStorage の再送キューに積み、次回起動時に
 * 自動で再送する（flushFeedbackQueue）。
 */

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';

/** フィードバックの送付先メールアドレス（mailto フォールバック／GAS 通知先の既定値） */
export const FEEDBACK_EMAIL = 'mntobira@gmail.com';

/** Firestore のコレクション名 */
export const FEEDBACK_COLLECTION = 'feedback';

/** 再送キューを保存する localStorage キー */
export const FEEDBACK_QUEUE_KEY = 'feedback_outbox_v1';

/** 再送キューに保持する最大件数（localStorage 肥大化の防止） */
export const FEEDBACK_QUEUE_LIMIT = 20;

/** 自由記述の最大文字数（Firestore ルール側の上限と揃える） */
export const FEEDBACK_MESSAGE_MAX = 2000;

/** フィードバックの種類 */
export type FeedbackCategory =
  | 'praise'      // よかった点
  | 'problem'     // 問題・解説の内容について
  | 'bug'         // 不具合・表示崩れ
  | 'request'     // 新機能・改善の要望
  | 'other';      // その他

export const FEEDBACK_CATEGORY_LABELS: Record<FeedbackCategory, string> = {
  praise: 'よかった点',
  problem: '問題・解説の内容',
  bug: '不具合・表示崩れ',
  request: '要望・改善案',
  other: 'その他',
};

/** どの画面から送られたか */
export type FeedbackScreen =
  | 'title'            // タイトル（ホーム）画面
  | 'chapter_result'   // 単元の結果・解説画面
  | 'mock_exam_result' // 模擬試験の結果画面
  | 'other';

export const FEEDBACK_SCREEN_LABELS: Record<FeedbackScreen, string> = {
  title: 'タイトル画面',
  chapter_result: '単元の結果画面',
  mock_exam_result: '模擬試験の結果画面',
  other: 'その他の画面',
};

/** 画面から渡す入力値 */
export interface FeedbackInput {
  /** 送信元画面 */
  screen: FeedbackScreen;
  /** 種類 */
  category: FeedbackCategory;
  /** 5段階評価（0 = 未選択） */
  rating: number;
  /** 自由記述（必須） */
  message: string;
  /** 返信を希望する場合の連絡先メール（任意） */
  contactEmail?: string;
  /** 画面ごとの付帯情報（単元ID・スコアなど） */
  context?: Record<string, unknown>;
}

/** 実際に送信されるペイロード（メタ情報付き） */
export interface FeedbackPayload extends FeedbackInput {
  /** クライアント側で採番する一意ID（重複送信の検出用） */
  id: string;
  /** ログイン中なら uid、ゲストなら null */
  uid: string | null;
  /** ログイン中の表示名 */
  displayName: string | null;
  /** ログイン中のメールアドレス（本人特定用・任意） */
  authEmail: string | null;
  /** 送信時刻（ISO8601・端末ローカル時刻由来） */
  createdAtIso: string;
  /** UserAgent */
  userAgent: string;
  /** 画面サイズ（不具合報告の再現用） */
  viewport: string;
  /** アプリのバージョン（package.json 由来ではなくビルド時定数を想定） */
  appVersion: string;
}

/** 送信結果 */
export interface FeedbackResult {
  /** 1つ以上の送信口に届いたか */
  ok: boolean;
  /** 成功した送信口 */
  delivered: Array<'firestore' | 'webhook'>;
  /** 失敗した送信口とエラーメッセージ */
  failed: Array<{ sink: 'firestore' | 'webhook'; reason: string }>;
  /** 全滅して再送キューに退避したか */
  queued: boolean;
  /** 手動送信用の mailto: URL（常に生成しておく） */
  mailtoUrl: string;
  /** 実際に送信したペイロード */
  payload: FeedbackPayload;
}

/** 入力検証の結果 */
export interface FeedbackValidation {
  valid: boolean;
  errors: string[];
}

// -------------------------------------------------------------------
// 環境変数アクセス（テスト環境では import.meta.env が無いこともある）
// -------------------------------------------------------------------

function readEnv(key: string): string {
  try {
    const env = (import.meta as any)?.env;
    const value = env ? env[key] : undefined;
    if (typeof value === 'string') return value.trim();
  } catch {
    // import.meta が使えない環境（Node の CJS 実行など）は無視する
  }
  try {
    const value = (globalThis as any)?.process?.env?.[key];
    if (typeof value === 'string') return value.trim();
  } catch {
    // process が無い環境も無視
  }
  return '';
}

/** GAS Web アプリ（スプレッドシート／メール転送）のURL。未設定なら '' */
export function getFeedbackWebhookUrl(): string {
  const url = readEnv('VITE_FEEDBACK_WEBHOOK_URL');
  return /^https?:\/\//.test(url) ? url : '';
}

/** 送信先メールアドレス（環境変数で上書き可能） */
export function getFeedbackEmail(): string {
  return readEnv('VITE_FEEDBACK_EMAIL') || FEEDBACK_EMAIL;
}

/**
 * 現在有効な収集先の一覧（UI で「どこに届くか」を案内するために使う）
 */
export function describeFeedbackSinks(): string[] {
  const sinks = ['アプリの管理データベース（Firestore）'];
  if (getFeedbackWebhookUrl()) {
    sinks.push('Google スプレッドシート／メール通知');
  }
  return sinks;
}

// -------------------------------------------------------------------
// 入力検証
// -------------------------------------------------------------------

/**
 * 送信前の入力チェック。
 * 「空送信」「長すぎる本文」「不正なメール形式」を弾く。
 */
export function validateFeedback(input: Partial<FeedbackInput>): FeedbackValidation {
  const errors: string[] = [];
  const message = (input.message || '').trim();

  if (message.length === 0) {
    errors.push('ご意見・ご感想を入力してください。');
  }
  if (message.length > FEEDBACK_MESSAGE_MAX) {
    errors.push(`本文は${FEEDBACK_MESSAGE_MAX}文字以内で入力してください。`);
  }
  const rating = input.rating ?? 0;
  if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
    errors.push('評価は0〜5の範囲で選択してください。');
  }
  const contact = (input.contactEmail || '').trim();
  if (contact && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
    errors.push('返信用メールアドレスの形式が正しくありません。');
  }

  return { valid: errors.length === 0, errors };
}

// -------------------------------------------------------------------
// ペイロード生成
// -------------------------------------------------------------------

function createId(): string {
  try {
    const uuid = (globalThis as any)?.crypto?.randomUUID?.();
    if (uuid) return `fb_${uuid}`;
  } catch {
    // randomUUID が無い環境はフォールバックへ
  }
  return `fb_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}

function safeViewport(): string {
  try {
    const w = (globalThis as any)?.window;
    if (w?.innerWidth) return `${w.innerWidth}x${w.innerHeight}`;
  } catch {
    // SSR / テスト環境
  }
  return 'unknown';
}

function safeUserAgent(): string {
  try {
    const ua = (globalThis as any)?.navigator?.userAgent;
    if (typeof ua === 'string') return ua.slice(0, 300);
  } catch {
    // SSR / テスト環境
  }
  return 'unknown';
}

/**
 * 入力値にメタ情報（uid・端末情報・時刻）を付けて送信ペイロードを組み立てる。
 * 副作用を持たない純関数なのでテストしやすい。
 */
export function buildFeedbackPayload(input: FeedbackInput): FeedbackPayload {
  let uid: string | null = null;
  let displayName: string | null = null;
  let authEmail: string | null = null;
  try {
    const user = auth?.currentUser;
    if (user) {
      uid = user.uid;
      displayName = user.displayName || null;
      authEmail = user.email || null;
    }
  } catch {
    // Firebase 未初期化（テスト等）でも送信できるようにする
  }

  return {
    id: createId(),
    screen: input.screen,
    category: input.category,
    rating: input.rating ?? 0,
    message: (input.message || '').trim().slice(0, FEEDBACK_MESSAGE_MAX),
    contactEmail: (input.contactEmail || '').trim() || undefined,
    context: input.context && Object.keys(input.context).length > 0 ? input.context : undefined,
    uid,
    displayName,
    authEmail,
    createdAtIso: new Date().toISOString(),
    userAgent: safeUserAgent(),
    viewport: safeViewport(),
    appVersion: readEnv('VITE_APP_VERSION') || 'dev',
  };
}

// -------------------------------------------------------------------
// mailto: フォールバック
// -------------------------------------------------------------------

/** 人が読める1行ラベルに整える */
function contextLines(context?: Record<string, unknown>): string[] {
  if (!context) return [];
  return Object.entries(context).map(([key, value]) => `  - ${key}: ${String(value)}`);
}

/**
 * mailto: リンクを生成する。
 * ①②が使えない環境（オフライン・ルール未反映・webhook 未設定）でも
 * ユーザーが自分のメーラーから送れるようにする最後の砦。
 */
export function buildFeedbackMailto(payload: FeedbackPayload, to: string = getFeedbackEmail()): string {
  const subject = `【まなとび】フィードバック（${FEEDBACK_SCREEN_LABELS[payload.screen]}／${FEEDBACK_CATEGORY_LABELS[payload.category]}）`;
  const body = [
    'ご意見・ご感想：',
    payload.message,
    '',
    '--- 以下は自動で付与された情報です（そのまま送信してください）---',
    `送信画面: ${FEEDBACK_SCREEN_LABELS[payload.screen]}`,
    `種類: ${FEEDBACK_CATEGORY_LABELS[payload.category]}`,
    `評価: ${payload.rating > 0 ? `${payload.rating} / 5` : '未選択'}`,
    `返信希望先: ${payload.contactEmail || '（なし）'}`,
    `送信日時: ${payload.createdAtIso}`,
    `ユーザー: ${payload.displayName || 'ゲスト'}${payload.uid ? `（uid: ${payload.uid}）` : ''}`,
    `アプリ版: ${payload.appVersion}`,
    `画面サイズ: ${payload.viewport}`,
    `UserAgent: ${payload.userAgent}`,
    ...(payload.context ? ['付帯情報:', ...contextLines(payload.context)] : []),
    `管理ID: ${payload.id}`,
  ].join('\n');

  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// -------------------------------------------------------------------
// 送信口①：Firestore
// -------------------------------------------------------------------

async function sendToFirestore(payload: FeedbackPayload): Promise<void> {
  await addDoc(collection(db, FEEDBACK_COLLECTION), {
    // ルール側で検証する必須フィールド
    id: payload.id,
    screen: payload.screen,
    category: payload.category,
    rating: payload.rating,
    message: payload.message,
    uid: payload.uid,
    // 付帯情報
    displayName: payload.displayName,
    authEmail: payload.authEmail,
    contactEmail: payload.contactEmail ?? null,
    context: payload.context ?? null,
    userAgent: payload.userAgent,
    viewport: payload.viewport,
    appVersion: payload.appVersion,
    createdAtIso: payload.createdAtIso,
    // サーバー時刻（並べ替えの基準にする）
    createdAt: serverTimestamp(),
    status: 'new',
  });
}

// -------------------------------------------------------------------
// 送信口②：Google Apps Script Web アプリ（スプレッドシート／メール）
// -------------------------------------------------------------------

async function sendToWebhook(payload: FeedbackPayload, url: string): Promise<void> {
  // GAS の doPost は CORS プリフライトを返せないため、
  // "text/plain" にして simple request（プリフライト不要）で投げる。
  const response = await fetch(url, {
    method: 'POST',
    // GAS はリダイレクトを返すため follow のままにする
    redirect: 'follow',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`webhook responded ${response.status}`);
  }
}

// -------------------------------------------------------------------
// 再送キュー（localStorage）
// -------------------------------------------------------------------

function readStorage(): Storage | null {
  try {
    const ls = (globalThis as any)?.localStorage;
    if (ls && typeof ls.getItem === 'function') return ls as Storage;
  } catch {
    // プライベートブラウズ等で localStorage が使えない場合
  }
  return null;
}

/** 再送キューを読み出す */
export function readFeedbackQueue(): FeedbackPayload[] {
  const ls = readStorage();
  if (!ls) return [];
  try {
    const raw = ls.getItem(FEEDBACK_QUEUE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FeedbackPayload[]) : [];
  } catch {
    return [];
  }
}

function writeFeedbackQueue(items: FeedbackPayload[]): void {
  const ls = readStorage();
  if (!ls) return;
  try {
    // 古いものから捨てて上限を守る
    const trimmed = items.slice(-FEEDBACK_QUEUE_LIMIT);
    if (trimmed.length === 0) ls.removeItem(FEEDBACK_QUEUE_KEY);
    else ls.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify(trimmed));
  } catch {
    // 容量超過などは黙って諦める（ユーザー操作を妨げない）
  }
}

/** 送信に失敗したフィードバックをキューへ退避する */
export function enqueueFeedback(payload: FeedbackPayload): void {
  const queue = readFeedbackQueue();
  if (queue.some((item) => item.id === payload.id)) return;
  queue.push(payload);
  writeFeedbackQueue(queue);
}

/** キューの件数（UI 表示用） */
export function pendingFeedbackCount(): number {
  return readFeedbackQueue().length;
}

// -------------------------------------------------------------------
// 送信本体
// -------------------------------------------------------------------

/**
 * 全ての有効な送信口へ並行して送る。
 * 1つでも成功すれば ok = true とし、全滅した場合のみ再送キューへ積む。
 */
async function deliver(payload: FeedbackPayload): Promise<FeedbackResult> {
  const delivered: Array<'firestore' | 'webhook'> = [];
  const failed: Array<{ sink: 'firestore' | 'webhook'; reason: string }> = [];
  const webhookUrl = getFeedbackWebhookUrl();

  const tasks: Array<Promise<void>> = [
    sendToFirestore(payload).then(
      () => { delivered.push('firestore'); },
      (error) => { failed.push({ sink: 'firestore', reason: String(error?.message || error) }); },
    ),
  ];

  if (webhookUrl) {
    tasks.push(
      sendToWebhook(payload, webhookUrl).then(
        () => { delivered.push('webhook'); },
        (error) => { failed.push({ sink: 'webhook', reason: String(error?.message || error) }); },
      ),
    );
  }

  await Promise.all(tasks);

  const ok = delivered.length > 0;
  if (!ok) enqueueFeedback(payload);

  return {
    ok,
    delivered,
    failed,
    queued: !ok,
    mailtoUrl: buildFeedbackMailto(payload),
    payload,
  };
}

/**
 * 画面から呼ぶメインAPI。
 * 検証 → ペイロード生成 → 送信 を行い、UI 表示に必要な情報を返す。
 *
 * @throws 入力が不正な場合は Error（メッセージは日本語・そのまま表示可）
 */
export async function submitFeedback(input: FeedbackInput): Promise<FeedbackResult> {
  const validation = validateFeedback(input);
  if (!validation.valid) {
    throw new Error(validation.errors.join('\n'));
  }
  const payload = buildFeedbackPayload(input);
  return deliver(payload);
}

/**
 * 溜まっている未送信フィードバックをまとめて再送する。
 * アプリ起動時に1回呼べばよい（失敗したものはキューに残る）。
 *
 * @returns 送信に成功した件数
 */
export async function flushFeedbackQueue(): Promise<number> {
  const queue = readFeedbackQueue();
  if (queue.length === 0) return 0;

  const remaining: FeedbackPayload[] = [];
  let sent = 0;

  for (const payload of queue) {
    try {
      const result = await deliver(payload);
      if (result.ok) sent += 1;
      else remaining.push(payload);
    } catch {
      remaining.push(payload);
    }
  }

  // deliver() が失敗時に enqueue するため、いったん消してから書き戻す
  writeFeedbackQueue([]);
  if (remaining.length > 0) writeFeedbackQueue(remaining);

  return sent;
}
