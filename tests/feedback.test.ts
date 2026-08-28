import { readFileSync, existsSync } from 'node:fs';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readCode } from './helpers/sourceScan';

/**
 * ユーザーフィードバック収集機能の回帰テスト。
 *
 * 実際の送信（Firestore / GAS Webhook）はネットワークに依存するため、
 * ここでは「送信前後の純粋なロジック」を検証する。
 *   - 入力検証（空送信・長文・不正メール・範囲外の評価を弾けるか）
 *   - ペイロード生成（必須メタ情報が揃うか・本文が上限で切られるか）
 *   - mailto: 生成（宛先・件名・本文に必要情報が載るか）
 *   - 再送キュー（重複しないか・上限を守るか）
 *   - ラベル定義がルール／GASと矛盾しないか
 */

// firebase 実体を読み込むと初期化＆ネットワークが走るためモックする
vi.mock('../src/firebase', () => ({
  auth: { currentUser: null },
  db: {},
  provider: {},
}));
vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(async () => ({ id: 'mock' })),
  collection: vi.fn(() => ({})),
  serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
}));

import {
  validateFeedback,
  buildFeedbackPayload,
  buildFeedbackMailto,
  enqueueFeedback,
  readFeedbackQueue,
  pendingFeedbackCount,
  describeFeedbackSinks,
  getFeedbackEmail,
  getFeedbackWebhookUrl,
  setFeedbackWebhookUrl,
  isAllowedFeedbackWebhookUrl,
  FEEDBACK_EMAIL,
  FEEDBACK_MESSAGE_MAX,
  FEEDBACK_QUEUE_KEY,
  FEEDBACK_QUEUE_LIMIT,
  FEEDBACK_CATEGORY_LABELS,
  FEEDBACK_SCREEN_LABELS,
  DEFAULT_FEEDBACK_WEBHOOK_URL,
  FEEDBACK_WEBHOOK_OVERRIDE_KEY,
  type FeedbackInput,
} from '../src/utils/feedback';

// ------------------------------------------------------------------
// localStorage の簡易モック（Node 環境には存在しない）
// ------------------------------------------------------------------
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) { return this.store.has(key) ? this.store.get(key)! : null; }
  setItem(key: string, value: string) { this.store.set(key, value); }
  removeItem(key: string) { this.store.delete(key); }
  clear() { this.store.clear(); }
  get length() { return this.store.size; }
  key(index: number) { return Array.from(this.store.keys())[index] ?? null; }
}

const storage = new MemoryStorage();
(globalThis as any).localStorage = storage;

const baseInput: FeedbackInput = {
  screen: 'title',
  category: 'request',
  rating: 4,
  message: '復習リストに単元名も表示してほしいです。',
};

beforeEach(() => {
  storage.clear();
});

describe('validateFeedback', () => {
  it('正常な入力は通る', () => {
    expect(validateFeedback(baseInput)).toEqual({ valid: true, errors: [] });
  });

  it('本文が空・空白のみなら弾く', () => {
    for (const message of ['', '   ', '\n\t ']) {
      const result = validateFeedback({ ...baseInput, message });
      expect(result.valid).toBe(false);
      expect(result.errors.join()).toContain('ご意見・ご感想を入力してください');
    }
  });

  it('本文が上限を超えたら弾く', () => {
    const result = validateFeedback({ ...baseInput, message: 'あ'.repeat(FEEDBACK_MESSAGE_MAX + 1) });
    expect(result.valid).toBe(false);
    expect(result.errors.join()).toContain(`${FEEDBACK_MESSAGE_MAX}文字以内`);
  });

  it('評価は1〜5の整数が必須（0＝未選択は弾く）', () => {
    // スプレッドシートで AVERAGE() を取れるようにしたいので、
    // 星評価は「任意」から「必須」に変更した。
    for (const rating of [1, 2, 3, 4, 5]) {
      expect(validateFeedback({ ...baseInput, rating }).valid).toBe(true);
    }
    // 0（未選択）・未指定はエラーになる
    for (const input of [{ ...baseInput, rating: 0 }, { ...baseInput, rating: undefined }]) {
      const result = validateFeedback(input);
      expect(result.valid).toBe(false);
      expect(result.errors.join()).toContain('満足度');
    }
    for (const rating of [-1, 6, 2.5]) {
      expect(validateFeedback({ ...baseInput, rating }).valid).toBe(false);
    }
  });

  it('返信用メールは未入力ならOK、形式不正なら弾く', () => {
    expect(validateFeedback({ ...baseInput, contactEmail: '' }).valid).toBe(true);
    expect(validateFeedback({ ...baseInput, contactEmail: 'user@example.com' }).valid).toBe(true);
    for (const contactEmail of ['user', 'user@', 'user@example', 'a b@example.com']) {
      const result = validateFeedback({ ...baseInput, contactEmail });
      expect(result.valid).toBe(false);
      expect(result.errors.join()).toContain('返信用メールアドレス');
    }
  });
});

describe('buildFeedbackPayload', () => {
  it('必須メタ情報が揃う', () => {
    const payload = buildFeedbackPayload(baseInput);
    expect(payload.id).toMatch(/^fb_/);
    expect(payload.screen).toBe('title');
    expect(payload.category).toBe('request');
    expect(payload.rating).toBe(4);
    expect(payload.message).toBe(baseInput.message);
    // 未ログイン（モック）なので uid は null → ルール上ゲスト投函として通る
    expect(payload.uid).toBeNull();
    expect(typeof payload.createdAtIso).toBe('string');
    expect(new Date(payload.createdAtIso).toString()).not.toBe('Invalid Date');
    expect(typeof payload.userAgent).toBe('string');
    expect(typeof payload.viewport).toBe('string');
    expect(typeof payload.appVersion).toBe('string');
  });

  it('IDは毎回ユニークになる（重複送信の検出に使う）', () => {
    const ids = new Set(Array.from({ length: 50 }, () => buildFeedbackPayload(baseInput).id));
    expect(ids.size).toBe(50);
  });

  it('本文は前後の空白を落とし、上限で切り詰める', () => {
    const payload = buildFeedbackPayload({ ...baseInput, message: `   ${'あ'.repeat(FEEDBACK_MESSAGE_MAX + 500)}   ` });
    expect(payload.message.length).toBe(FEEDBACK_MESSAGE_MAX);
  });

  it('空の任意項目は undefined にして Firestore へ余計なキーを送らない', () => {
    const payload = buildFeedbackPayload({ ...baseInput, contactEmail: '   ', context: {} });
    expect(payload.contactEmail).toBeUndefined();
    expect(payload.context).toBeUndefined();
  });

  it('context は渡した内容がそのまま載る（結果画面のスコア添付用）', () => {
    const payload = buildFeedbackPayload({
      ...baseInput,
      screen: 'chapter_result',
      context: { chapterId: 'c3_2', totalScore: 120 },
    });
    expect(payload.context).toEqual({ chapterId: 'c3_2', totalScore: 120 });
  });
});

describe('buildFeedbackMailto', () => {
  it('既定の宛先は mntobira@gmail.com', () => {
    expect(getFeedbackEmail()).toBe(FEEDBACK_EMAIL);
    expect(FEEDBACK_EMAIL).toBe('mntobira@gmail.com');
  });

  it('件名と本文に必要情報が載る', () => {
    const payload = buildFeedbackPayload({
      ...baseInput,
      screen: 'mock_exam_result',
      category: 'bug',
      message: '選択肢が重なって表示されます',
      context: { correct: 12, total: 20 },
    });
    const url = buildFeedbackMailto(payload);

    expect(url.startsWith(`mailto:${FEEDBACK_EMAIL}?`)).toBe(true);

    const decoded = decodeURIComponent(url);
    expect(decoded).toContain('【まなとび】フィードバック');
    expect(decoded).toContain(FEEDBACK_SCREEN_LABELS.mock_exam_result);
    expect(decoded).toContain(FEEDBACK_CATEGORY_LABELS.bug);
    expect(decoded).toContain('選択肢が重なって表示されます');
    expect(decoded).toContain('correct: 12');
    expect(decoded).toContain(payload.id);
  });

  it('評価は「数字のみ」で書く（シートで平均を取れるように）', () => {
    const decoded = decodeURIComponent(buildFeedbackMailto(buildFeedbackPayload({ ...baseInput, rating: 4 })));
    expect(decoded).toContain('評価: 4');
    // '4 / 5' のような文字列にはしない（AVERAGE() の対象外になる）
    expect(decoded).not.toContain('4 / 5');
  });

  it('評価未選択（0）のときは空欄にする（旧版アプリからの保険）', () => {
    const decoded = decodeURIComponent(buildFeedbackMailto(buildFeedbackPayload({ ...baseInput, rating: 0 })));
    expect(decoded).toContain('評価: ');
    expect(decoded).not.toContain('評価: 0');
  });

  it('改行や記号を含む本文でも壊れない（URLエンコードされる）', () => {
    const message = '1行目\n2行目 & 3行目 ?=#';
    const url = buildFeedbackMailto(buildFeedbackPayload({ ...baseInput, message }));
    // 生の & や # が body に混ざるとパラメータが壊れる
    expect(url.split('body=')[1]).not.toContain('&');
    expect(url.split('body=')[1]).not.toContain('#');
    expect(decodeURIComponent(url)).toContain(message);
  });
});

describe('再送キュー', () => {
  it('積んだものが読み出せる（未達の送信先つき）', () => {
    const payload = buildFeedbackPayload(baseInput);
    enqueueFeedback(payload, ['webhook']);
    expect(pendingFeedbackCount()).toBe(1);
    const queue = readFeedbackQueue();
    expect(queue[0].payload.id).toBe(payload.id);
    expect(queue[0].pending).toEqual(['webhook']);
  });

  it('同じIDは二重に積まれず、未達の送信先が統合される', () => {
    const payload = buildFeedbackPayload(baseInput);
    enqueueFeedback(payload, ['webhook']);
    enqueueFeedback(payload, ['firestore']);
    enqueueFeedback(payload, ['webhook']);
    expect(pendingFeedbackCount()).toBe(1);
    expect(readFeedbackQueue()[0].pending.sort()).toEqual(['firestore', 'webhook']);
  });

  it('未達の送信先が空なら積まない', () => {
    enqueueFeedback(buildFeedbackPayload(baseInput), []);
    expect(pendingFeedbackCount()).toBe(0);
  });

  it('スプレッドシートだけ未達の場合、Firestoreは再送対象に含めない（二重登録の防止）', () => {
    const payload = buildFeedbackPayload(baseInput);
    enqueueFeedback(payload, ['webhook']);
    expect(readFeedbackQueue()[0].pending).not.toContain('firestore');
  });

  it('上限を超えたら古いものから捨てる', () => {
    for (let i = 0; i < FEEDBACK_QUEUE_LIMIT + 5; i += 1) {
      enqueueFeedback(buildFeedbackPayload({ ...baseInput, message: `意見${i}` }), ['webhook']);
    }
    const queue = readFeedbackQueue();
    expect(queue.length).toBe(FEEDBACK_QUEUE_LIMIT);
    // 最後に積んだものは必ず残る
    expect(queue[queue.length - 1].payload.message).toBe(`意見${FEEDBACK_QUEUE_LIMIT + 4}`);
  });

  it('壊れたJSONが入っていても空配列として扱う（例外を投げない）', () => {
    storage.setItem(FEEDBACK_QUEUE_KEY, '{not json');
    expect(readFeedbackQueue()).toEqual([]);
    expect(pendingFeedbackCount()).toBe(0);
  });

  it('旧フォーマット（ペイロード直置き）のキューも読める＝アプリ更新で意見を失わない', () => {
    const payload = buildFeedbackPayload(baseInput);
    storage.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify([payload]));
    const queue = readFeedbackQueue();
    expect(queue.length).toBe(1);
    expect(queue[0].payload.id).toBe(payload.id);
    // 旧データは全送信先を未達として扱う
    expect(queue[0].pending.sort()).toEqual(['firestore', 'webhook']);
  });

  it('配列でない／壊れた要素は無視する', () => {
    storage.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify({ nope: true }));
    expect(readFeedbackQueue()).toEqual([]);
    storage.setItem(FEEDBACK_QUEUE_KEY, JSON.stringify([null, 42, 'x', {}]));
    expect(readFeedbackQueue()).toEqual([]);
  });
});

describe('収集先の案内', () => {
  it('既定の webhook URL が同梱されているのでシートも案内する', () => {
    // 利用者が URL を入力する欄は廃止し、アプリに既定 URL を同梱してある。
    expect(getFeedbackWebhookUrl()).toBe(DEFAULT_FEEDBACK_WEBHOOK_URL);
    expect(getFeedbackWebhookUrl()).toMatch(/^https:\/\/script\.google\.com\//);
    const sinks = describeFeedbackSinks();
    expect(sinks.length).toBe(2);
    expect(sinks[0]).toContain('Firestore');
    expect(sinks[1]).toContain('スプレッドシート');
  });

  it('承認済みの Apps Script URL だけを実行時設定として保存できる', () => {
    expect(isAllowedFeedbackWebhookUrl(DEFAULT_FEEDBACK_WEBHOOK_URL)).toBe(true);
    expect(setFeedbackWebhookUrl(DEFAULT_FEEDBACK_WEBHOOK_URL)).toBe(true);
    expect(storage.getItem(FEEDBACK_WEBHOOK_OVERRIDE_KEY)).toBe(DEFAULT_FEEDBACK_WEBHOOK_URL);
  });

  it('第三者の送信先・HTTP・Apps Script の別デプロイを拒否する', () => {
    expect(setFeedbackWebhookUrl('https://attacker.example/collect')).toBe(false);
    expect(setFeedbackWebhookUrl('http://script.google.com/macros/s/attacker/exec')).toBe(false);
    expect(setFeedbackWebhookUrl('https://script.google.com/macros/s/attacker/exec')).toBe(false);
    expect(storage.getItem(FEEDBACK_WEBHOOK_OVERRIDE_KEY)).toBeNull();
  });

  it('localStorage が改ざんされても不正URLを無視して既定URLへ戻る', () => {
    storage.setItem(FEEDBACK_WEBHOOK_OVERRIDE_KEY, 'https://attacker.example/collect');
    expect(getFeedbackWebhookUrl()).toBe(DEFAULT_FEEDBACK_WEBHOOK_URL);
  });
});

describe('設置場所（タイトル画面・各結果画面）', () => {
  const read = (path: string) => readFileSync(path, 'utf8');

  it('タイトル画面（Home.tsx）に screen="title" の入口がある', () => {
    const src = read('src/components/Home.tsx');
    expect(src).toContain("import { FeedbackButton } from './FeedbackButton'");
    expect(src).toMatch(/<FeedbackButton[\s\S]*?screen="title"/);
    // 既存カード（学習ノート／アプリ紹介）を壊していないこと
    expect(src).toContain('学習ノート');
    expect(src).toContain('アプリ紹介');
  });

  it('単元の結果画面（Explanation.tsx）に screen="chapter_result" の入口があり、結果カード内に置かれている', () => {
    const src = read('src/components/Explanation.tsx');
    expect(src).toContain("import { FeedbackButton } from './FeedbackButton'");
    /*
     * ★「どこに置かれているか」を位置で見る検査は readCode（コメント除去済み）で行う★
     *
     * 素のソースを indexOf で探すと、経緯を説明したコメントの中に
     * 同じ JSX を書き写した瞬間にそこへ当たってしまう。
     * 実際に learningPrint.test.ts でこの事故が起きた
     * （詳細は tests/helpers/sourceScan.ts の冒頭）。
     * 「置く順番」はコメントではなく実コードだけで決まるので、
     * 判定対象も実コードに揃える。
     */
    const code = readCode('src/components/Explanation.tsx');
    expect(code).toMatch(/<FeedbackButton[\s\S]*?screen="chapter_result"/);
    // isResultView（= 結果表示時のみ）のブロック内、ランキングパネルの後に置く
    const resultBlock = code.slice(code.indexOf('isResultView && displayTotalScore != null'));
    const rankingAt = resultBlock.indexOf('<ChapterRankingPanel');
    const feedbackAt = resultBlock.indexOf('<FeedbackButton');
    expect(rankingAt).toBeGreaterThan(-1);
    expect(feedbackAt).toBeGreaterThan(rankingAt);
    // 単元IDとスコアを添付していること（あとから分析できるようにする）
    expect(resultBlock.slice(feedbackAt, feedbackAt + 800)).toContain('chapterId: chapter.id');
  });

  it('模擬試験の結果画面（MockExam.tsx）に screen="mock_exam_result" の入口がある', () => {
    const src = read('src/components/MockExam.tsx');
    expect(src).toContain("import { FeedbackButton } from './FeedbackButton'");
    // 位置の検査は実コードだけを見る（上と同じ理由）
    const code = readCode('src/components/MockExam.tsx');
    expect(code).toMatch(/<FeedbackButton[\s\S]*?screen="mock_exam_result"/);
    // phase === 'result' のブロック内に置かれていること
    const resultBlock = code.slice(code.indexOf("if (phase === 'result')"));
    expect(resultBlock.indexOf('<FeedbackButton')).toBeGreaterThan(-1);
    // 得点・正答率・所要時間を添付していること
    const snippet = resultBlock.slice(resultBlock.indexOf('<FeedbackButton'));
    expect(snippet).toContain('percentage');
    expect(snippet).toContain('elapsedSec');
  });

  it('起動時に未送信キューを自動再送する（App.tsx）', () => {
    const src = read('src/App.tsx');
    // 「お問い合わせの送信状態」の欄を廃止しても、
    // 失敗した分の自動再送はここだけで成立していることを守る。
    expect(src).toMatch(/import \{[^}]*flushFeedbackQueue[^}]*\} from '\.\/utils\/feedback'/);
    expect(src).toContain('flushFeedbackQueue()');
    // オンライン復帰時にも再送する
    expect(src).toContain("addEventListener('online'");
  });

  it('「お問い合わせの送信状態」の欄は廃止されている', () => {
    // 診断・手動再送の UI は利用者には不要なので削除した。
    expect(existsSync('src/components/FeedbackRouteSettings.tsx')).toBe(false);
    const profile = read('src/components/ProfileModal.tsx');
    expect(profile).not.toContain('FeedbackRouteSettings');
  });

  it('firestore.rules に feedback の投函専用ルールがある', () => {
    const rules = read('firestore.rules');
    expect(rules).toContain('match /feedback/{docId}');
    // 投函は誰でも（ゲスト可）
    expect(rules).toContain('allow create: if isValidFeedback(request.resource.data);');
    // 閲覧は運営のみ（返信フォーム対応。一般ユーザーには従来どおり見せない）
    expect(rules).toContain('allow read: if isFeedbackAdmin();');
    // 更新は運営が status だけ変えられる。削除は誰にもさせない
    expect(rules).toContain("affectedKeys().hasOnly(['status'])");
    expect(rules).toContain('allow delete: if false;');
    // 本文長の上限がクライアント側（FEEDBACK_MESSAGE_MAX）と一致していること
    expect(rules).toContain(`data.message.size() <= ${FEEDBACK_MESSAGE_MAX}`);
    // 画面・種類の許可値がラベル定義と一致していること
    for (const screen of Object.keys(FEEDBACK_SCREEN_LABELS)) {
      expect(rules).toContain(`'${screen}'`);
    }
    for (const category of Object.keys(FEEDBACK_CATEGORY_LABELS)) {
      expect(rules).toContain(`'${category}'`);
    }
  });

  it('Google Apps Script と設定手順が同梱されている', () => {
    const gas = read('docs/feedback-gas.js');
    // スプレッドシート追記とメール通知の両方を切り替えられること
    expect(gas).toContain('APPEND_SHEET');
    expect(gas).toContain('SEND_EMAIL');
    expect(gas).toContain(FEEDBACK_EMAIL);
    expect(gas).toContain('function doPost');
    expect(gas).toContain('SpreadsheetApp');
    expect(gas).toContain('MailApp.sendEmail');
    // GAS 側のラベルがアプリ側と揃っていること
    for (const label of Object.values(FEEDBACK_SCREEN_LABELS)) {
      expect(gas).toContain(label);
    }
    expect(read('docs/FEEDBACK_SETUP.md')).toContain('VITE_FEEDBACK_WEBHOOK_URL');
    expect(read('.env.example')).toContain('VITE_FEEDBACK_WEBHOOK_URL');
  });
});

describe('ラベル定義の整合性', () => {
  it('画面・種類のキーが firestore.rules / GAS の許可値と一致する', () => {
    // ルール側で `in [...]` にハードコードした値と揃っていることを担保する
    expect(Object.keys(FEEDBACK_SCREEN_LABELS).sort())
      .toEqual(['chapter_result', 'mock_exam_result', 'other', 'title']);
    expect(Object.keys(FEEDBACK_CATEGORY_LABELS).sort())
      .toEqual(['bug', 'other', 'praise', 'problem', 'request']);
  });

  it('全ラベルが日本語で埋まっている（UIの空表示を防ぐ）', () => {
    for (const label of [...Object.values(FEEDBACK_SCREEN_LABELS), ...Object.values(FEEDBACK_CATEGORY_LABELS)]) {
      expect(label.trim().length).toBeGreaterThan(0);
    }
  });
});
