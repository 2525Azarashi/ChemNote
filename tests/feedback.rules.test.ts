/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * firestore.rules の `feedback`（ユーザーフィードバック投函箱）に関するテスト。
 *
 * 実行:
 *   npm run test:rules
 *   （内部で Firestore エミュレータを起動する）
 *
 * ※ エミュレータ（Java 必須）が起動していない環境では自動的に skip する。
 *   ローカルで `npx vitest run` を叩いたときにテスト全体を赤くしないための配慮。
 */

import { readFileSync } from 'node:fs';
import { connect } from 'node:net';
import { afterAll, beforeAll, beforeEach, describe, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

const EMULATOR_HOST = '127.0.0.1';
const EMULATOR_PORT = 8080;

const USER = 'uid_student';
const OTHER = 'uid_other';

/** エミュレータが待ち受けているか確認する（起動していなければ skip する） */
function isEmulatorUp(): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ host: EMULATOR_HOST, port: EMULATOR_PORT });
    const done = (up: boolean) => { socket.destroy(); resolve(up); };
    socket.setTimeout(1500);
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    socket.once('timeout', () => done(false));
  });
}

let testEnv: RulesTestEnvironment | null = null;
const emulatorAvailable = await isEmulatorUp();

beforeAll(async () => {
  if (!emulatorAvailable) return;
  testEnv = await initializeTestEnvironment({
    projectId: 'mntb-rules-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: EMULATOR_HOST,
      port: EMULATOR_PORT,
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  if (testEnv) await testEnv.clearFirestore();
});

/** ログイン済みユーザーの Firestore */
function authed(uid: string) {
  return testEnv!.authenticatedContext(uid).firestore();
}

/** 未ログイン（ゲスト）の Firestore */
function guest() {
  return testEnv!.unauthenticatedContext().firestore();
}

/**
 * ルールが受け付ける最小構成 ＋ 上書き。
 * uid は「ゲストなら null / ログイン中なら本人の uid」を渡す。
 */
function validDoc(overrides: Record<string, unknown> = {}) {
  return {
    id: 'fb_test_0001',
    screen: 'title',
    category: 'request',
    rating: 4,
    message: '復習リストに単元名も表示してほしいです。',
    uid: null,
    displayName: null,
    authEmail: null,
    contactEmail: null,
    context: null,
    userAgent: 'vitest',
    viewport: '1024x768',
    appVersion: 'test',
    createdAtIso: new Date().toISOString(),
    createdAt: serverTimestamp(),
    status: 'new',
    ...overrides,
  };
}

describe.skipIf(!emulatorAvailable)('firestore.rules: feedback（投函のみ許可）', () => {
  describe('create: 許可されるケース', () => {
    it('未ログインのゲストでも投函できる（意見を集める入口を塞がない）', async () => {
      await assertSucceeds(addDoc(collection(guest(), 'feedback'), validDoc()));
    });

    it('ログイン中のユーザーは自分の uid を付けて投函できる', async () => {
      await assertSucceeds(addDoc(collection(authed(USER), 'feedback'), validDoc({
        uid: USER,
        displayName: '生徒A',
        authEmail: 'student@example.com',
      })));
    });

    it('4種類の送信画面すべてが通る', async () => {
      for (const screen of ['title', 'chapter_result', 'mock_exam_result', 'other']) {
        await assertSucceeds(addDoc(collection(guest(), 'feedback'), validDoc({ screen })));
      }
    });

    it('5種類の種類すべてが通る', async () => {
      for (const category of ['praise', 'problem', 'bug', 'request', 'other']) {
        await assertSucceeds(addDoc(collection(guest(), 'feedback'), validDoc({ category })));
      }
    });

    it('評価未選択（rating = 0）でも通る', async () => {
      await assertSucceeds(addDoc(collection(guest(), 'feedback'), validDoc({ rating: 0 })));
    });

    it('結果画面のスコア添付（context）付きでも通る', async () => {
      await assertSucceeds(addDoc(collection(guest(), 'feedback'), validDoc({
        screen: 'chapter_result',
        context: { chapterId: 'c3_2', totalScore: 120, correct: 9, judgeable: 10 },
      })));
    });

    it('本文が上限ちょうど（2000文字）なら通る', async () => {
      await assertSucceeds(addDoc(collection(guest(), 'feedback'), validDoc({ message: 'あ'.repeat(2000) })));
    });
  });

  describe('create: 拒否されるケース', () => {
    it('本文が空なら拒否（空送信でコレクションを荒らせない）', async () => {
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ message: '' })));
    });

    it('本文が2001文字なら拒否', async () => {
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ message: 'あ'.repeat(2001) })));
    });

    it('未知の screen / category は拒否', async () => {
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ screen: 'admin_panel' })));
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ category: 'spam' })));
    });

    it('評価が範囲外なら拒否', async () => {
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ rating: -1 })));
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ rating: 6 })));
    });

    it('他人の uid を騙って投函できない（なりすまし防止）', async () => {
      await assertFails(addDoc(collection(authed(USER), 'feedback'), validDoc({ uid: OTHER })));
    });

    it('ゲストが適当な uid を付けて投函できない', async () => {
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ uid: USER })));
    });

    it('必須フィールドが欠けていたら拒否', async () => {
      for (const key of ['id', 'screen', 'category', 'rating', 'message', 'uid', 'createdAt']) {
        const data: Record<string, unknown> = validDoc();
        delete data[key];
        await assertFails(addDoc(collection(guest(), 'feedback'), data));
      }
    });

    it('想定外のフィールドを混ぜたら拒否', async () => {
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ isAdmin: true })));
    });

    it('createdAt を端末時刻で偽装したら拒否（並び順を荒らせない）', async () => {
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ createdAt: new Date(2000, 0, 1) })));
    });

    it('status を new 以外にしたら拒否（対応済みを勝手に名乗れない）', async () => {
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ status: 'resolved' })));
    });

    it('context のキーが多すぎたら拒否（ペイロード肥大の防止）', async () => {
      const context: Record<string, number> = {};
      for (let i = 0; i < 21; i += 1) context[`k${i}`] = i;
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ context })));
    });

    it('UserAgent が長すぎたら拒否', async () => {
      await assertFails(addDoc(collection(guest(), 'feedback'), validDoc({ userAgent: 'x'.repeat(401) })));
    });
  });

  describe('read / update / delete: 全面禁止', () => {
    beforeEach(async () => {
      await testEnv!.withSecurityRulesDisabled(async (ctx) => {
        await setDoc(doc(ctx.firestore(), 'feedback', 'fb_existing'), {
          id: 'fb_existing',
          screen: 'title',
          category: 'praise',
          rating: 5,
          message: '既存の意見',
          uid: USER,
          contactEmail: 'student@example.com',
          status: 'new',
        });
      });
    });

    it('投函者本人でも読み取れない（他人の連絡先を覗けない）', async () => {
      await assertFails(getDoc(doc(authed(USER), 'feedback', 'fb_existing')));
    });

    it('ゲストも一覧取得できない', async () => {
      await assertFails(getDocs(collection(guest(), 'feedback')));
    });

    it('第三者も読み取れない', async () => {
      await assertFails(getDoc(doc(authed(OTHER), 'feedback', 'fb_existing')));
    });

    it('更新できない（送信後の改変不可）', async () => {
      await assertFails(updateDoc(doc(authed(USER), 'feedback', 'fb_existing'), { message: '書き換え' }));
    });

    it('削除できない（都合の悪い意見を消せない）', async () => {
      await assertFails(deleteDoc(doc(authed(USER), 'feedback', 'fb_existing')));
      await assertFails(deleteDoc(doc(guest(), 'feedback', 'fb_existing')));
    });
  });
});
