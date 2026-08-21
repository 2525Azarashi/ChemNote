import { readFileSync } from 'node:fs';
import { describe, it, expect, vi } from 'vitest';

/**
 * ===================================================================
 * フィードバック返信機能（運営 ⇄ 利用者）の回帰テスト
 * ===================================================================
 * ご要望「メッセージをしてくれた人に対する返答フォーム」に対応する。
 *
 * 検証すること
 *   - 運営判定（メール完全一致・未確認メールは拒否）が正しいか
 *   - クライアントの運営メール一覧と firestore.rules の
 *     isFeedbackAdmin() が同期しているか（ズレると片方だけ動かない）
 *   - mailto: 返信リンクに宛先・件名・元の本文が載るか
 *   - ルールが「返信の作成は運営のみ」「閲覧は宛先本人と運営のみ」
 *     「本人は readAt だけ更新可」を宣言しているか（ソースレベル）
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
  doc: vi.fn(() => ({})),
  getDocs: vi.fn(async () => ({ docs: [] })),
  limit: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  query: vi.fn(() => ({})),
  serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
  updateDoc: vi.fn(async () => undefined),
  where: vi.fn(() => ({})),
}));

import {
  isFeedbackAdmin,
  buildReplyMailto,
  FEEDBACK_ADMIN_EMAILS,
  FEEDBACK_REPLY_COLLECTION,
  FEEDBACK_REPLY_MAX,
  FEEDBACK_STATUS_LABELS,
  type AdminFeedbackItem,
} from '../src/utils/feedbackReply';

const rules = readFileSync('firestore.rules', 'utf8');

describe('運営判定（isFeedbackAdmin）', () => {
  it('運営メール（確認済み）だけを運営と判定する', () => {
    const admin = { email: FEEDBACK_ADMIN_EMAILS[0], emailVerified: true } as any;
    expect(isFeedbackAdmin(admin)).toBe(true);
  });

  it('一般ユーザー・未ログイン・未確認メールは運営ではない', () => {
    expect(isFeedbackAdmin(null)).toBe(false);
    expect(isFeedbackAdmin({ email: 'someone@example.com', emailVerified: true } as any)).toBe(false);
    expect(isFeedbackAdmin({ email: FEEDBACK_ADMIN_EMAILS[0], emailVerified: false } as any)).toBe(false);
  });

  it('クライアントの運営メール一覧と firestore.rules が同期している', () => {
    // rules 側: request.auth.token.email in ['a@b', ...]
    const match = rules.match(/isFeedbackAdmin\(\)[\s\S]*?email in \[([^\]]+)\]/);
    expect(match).not.toBeNull();
    const ruleEmails = (match![1].match(/'([^']+)'/g) || []).map((s) => s.replace(/'/g, ''));
    expect(new Set(ruleEmails)).toEqual(new Set(FEEDBACK_ADMIN_EMAILS));
  });
});

describe('メール返信リンク（buildReplyMailto）', () => {
  const base: AdminFeedbackItem = {
    docId: 'doc1',
    id: 'fb1',
    screen: 'chapter_result',
    category: 'bug',
    rating: 2,
    message: 'バグって一問しか解いてないのに他のが全部不正解扱いになる。',
    uid: null,
    displayName: null,
    authEmail: null,
    contactEmail: 'student@example.com',
    createdAtIso: '2026-08-20T10:00:00.000Z',
    status: 'new',
  };

  it('contactEmail 宛の mailto: に件名と元の本文が載る', () => {
    const link = buildReplyMailto(base);
    expect(link).not.toBeNull();
    expect(link!).toContain('mailto:student%40example.com');
    expect(decodeURIComponent(link!)).toContain('いただいたご意見への返信');
    expect(decodeURIComponent(link!)).toContain('一問しか解いてないのに');
  });

  it('contactEmail が無ければ authEmail を宛先に使う', () => {
    const link = buildReplyMailto({ ...base, contactEmail: null, authEmail: 'auth@example.com' });
    expect(link).toContain('mailto:auth%40example.com');
  });

  it('宛先が無い（匿名投函）ときは null', () => {
    expect(buildReplyMailto({ ...base, contactEmail: null, authEmail: null })).toBeNull();
  });
});

describe('firestore.rules（feedback / feedback_replies）', () => {
  it('feedback は運営だけが読める・status だけ更新できる', () => {
    expect(rules).toContain('allow read: if isFeedbackAdmin();');
    expect(rules).toContain("affectedKeys().hasOnly(['status'])");
    expect(rules).toContain("['new', 'in_progress', 'replied', 'closed']");
  });

  it('feedback_replies は運営のみ作成・宛先本人と運営のみ閲覧', () => {
    expect(rules).toContain(`match /${FEEDBACK_REPLY_COLLECTION}/{replyId}`);
    expect(rules).toContain('allow create: if isFeedbackAdmin() && isValidReply(request.resource.data);');
    expect(rules).toContain('resource.data.toUid == request.auth.uid');
  });

  it('宛先本人は readAt（既読）だけ更新できる', () => {
    expect(rules).toContain("affectedKeys().hasOnly(['readAt'])");
    expect(rules).toContain('request.resource.data.readAt == request.time');
  });

  it('返信の削除は禁止されている（証跡を残す）', () => {
    const replyBlock = rules.slice(rules.indexOf('match /feedback_replies/'));
    expect(replyBlock).toContain('allow delete: if false;');
  });

  it('返信本文の上限がルールとクライアントで一致する', () => {
    const replyBlock = rules.slice(rules.indexOf('match /feedback_replies/'));
    expect(replyBlock).toContain(`data.message.size() <= ${FEEDBACK_REPLY_MAX}`);
  });
});

describe('対応状況ラベル', () => {
  it('4状態すべてに日本語ラベルがある', () => {
    expect(Object.keys(FEEDBACK_STATUS_LABELS).sort()).toEqual(['closed', 'in_progress', 'new', 'replied']);
    Object.values(FEEDBACK_STATUS_LABELS).forEach((label) => expect(label.length).toBeGreaterThan(0));
  });
});
