/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * firestore.rules のフレンド機能に関するユニットテスト。
 *
 * 実行:
 *   npm run test:rules
 *   （内部で Firestore エミュレータを起動する）
 */

import { readFileSync } from 'node:fs';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import { collection, doc, getDoc, getDocs, query, setDoc, deleteDoc, where, writeBatch, serverTimestamp } from 'firebase/firestore';

const ALICE = 'uid_alice';
const BOB = 'uid_bob';
const CAROL = 'uid_carol';

const ALICE_CODE = 'MNTB-1VZW-OCU3';
const BOB_CODE = 'MNTB-1QHZ-RF1K';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'mntb-rules-test',
    firestore: {
      rules: readFileSync('firestore.rules', 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  // 事前データはルールを無視して投入する
  await testEnv.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'friend_codes', ALICE_CODE), { uid: ALICE, nickname: 'アリス', photoURL: '' });
    await setDoc(doc(db, 'friend_codes', BOB_CODE), { uid: BOB, nickname: 'ボブ', photoURL: '' });
    await setDoc(doc(db, 'friend_profiles', ALICE), { uid: ALICE, nickname: 'アリス', photoURL: '', friendCode: ALICE_CODE });
    await setDoc(doc(db, 'friend_profiles', BOB), { uid: BOB, nickname: 'ボブ', photoURL: '', friendCode: BOB_CODE });
    await setDoc(doc(db, 'friend_profiles', CAROL), { uid: CAROL, nickname: 'キャロル', photoURL: '', friendCode: 'MNTB-ZZZZ-ZZZZ' });
  });
});

function ctxFor(uid: string) {
  return testEnv.authenticatedContext(uid).firestore();
}

describe('friend_codes（コード逆引き）', () => {
  it('コードを知っていれば get できる', async () => {
    const db = ctxFor(ALICE);
    const snap = await assertSucceeds(getDoc(doc(db, 'friend_codes', BOB_CODE)));
    expect(snap.data()?.uid).toBe(BOB);
  });

  it('コレクション全体の list は禁止（総当り収集を防ぐ）', async () => {
    const db = ctxFor(ALICE);
    await assertFails(getDocs(collection(db, 'friend_codes')));
  });

  it('未認証では get できない', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, 'friend_codes', BOB_CODE)));
  });

  it('自分の uid を指すコードは作成できる', async () => {
    const db = ctxFor(CAROL);
    await assertSucceeds(setDoc(doc(db, 'friend_codes', 'MNTB-AAAA-BBBB'), {
      uid: CAROL, nickname: 'キャロル', photoURL: '', updatedAt: serverTimestamp(),
    }));
  });

  it('他人の uid を指すコードは作成できない（なりすまし防止）', async () => {
    const db = ctxFor(CAROL);
    await assertFails(setDoc(doc(db, 'friend_codes', 'MNTB-AAAA-CCCC'), {
      uid: ALICE, nickname: 'アリス', photoURL: '', updatedAt: serverTimestamp(),
    }));
  });

  it('他人の既存コードを奪えない', async () => {
    const db = ctxFor(CAROL);
    await assertFails(setDoc(doc(db, 'friend_codes', ALICE_CODE), {
      uid: CAROL, nickname: 'キャロル', photoURL: '', updatedAt: serverTimestamp(),
    }));
  });

  it('他人のコードを削除できない', async () => {
    const db = ctxFor(CAROL);
    await assertFails(deleteDoc(doc(db, 'friend_codes', ALICE_CODE)));
  });

  it('コード形式が不正な新規作成は拒否', async () => {
    const db = ctxFor(CAROL);
    await assertFails(setDoc(doc(db, 'friend_codes', 'not-a-code'), {
      uid: CAROL, nickname: 'キャロル', photoURL: '', updatedAt: serverTimestamp(),
    }));
  });

  it('想定外フィールドの注入は拒否', async () => {
    const db = ctxFor(CAROL);
    await assertFails(setDoc(doc(db, 'friend_codes', 'MNTB-DDDD-EEEE'), {
      uid: CAROL, nickname: 'キャロル', photoURL: '', updatedAt: serverTimestamp(), isAdmin: true,
    }));
  });

  it('自分のコードは再保存できる（表示名の更新）', async () => {
    const db = ctxFor(ALICE);
    await assertSucceeds(setDoc(doc(db, 'friend_codes', ALICE_CODE), {
      uid: ALICE, nickname: 'アリス改', photoURL: '', updatedAt: serverTimestamp(),
    }));
  });
});

describe('friend_profiles（プロフィール）', () => {
  it('本人は自分のプロフィールを読める', async () => {
    const db = ctxFor(ALICE);
    await assertSucceeds(getDoc(doc(db, 'friend_profiles', ALICE)));
  });

  it('無関係な他人のプロフィールは読めない', async () => {
    const db = ctxFor(ALICE);
    await assertFails(getDoc(doc(db, 'friend_profiles', CAROL)));
  });

  it('list は禁止（全ユーザー収集を防ぐ）', async () => {
    const db = ctxFor(ALICE);
    await assertFails(getDocs(collection(db, 'friend_profiles')));
  });

  it('friendCode の where 検索は禁止されている（旧実装が動かない理由）', async () => {
    const db = ctxFor(ALICE);
    await assertFails(getDocs(query(collection(db, 'friend_profiles'), where('friendCode', '==', BOB_CODE))));
  });

  it('申請関係にある相手のプロフィールは読める', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'friend_requests', `${BOB}_${ALICE}`), {
        fromUid: ALICE, toUid: BOB, fromNickname: 'アリス', fromPhotoURL: '',
      });
    });
    const db = ctxFor(BOB);
    await assertSucceeds(getDoc(doc(db, 'friend_profiles', ALICE)));
  });

  it('フレンドのプロフィールは読める', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'friends', ALICE, 'items', CAROL), { uid: CAROL, nickname: 'キャロル', photoURL: '' });
    });
    const db = ctxFor(ALICE);
    await assertSucceeds(getDoc(doc(db, 'friend_profiles', CAROL)));
  });

  it('他人のプロフィールを書き換えられない', async () => {
    const db = ctxFor(ALICE);
    await assertFails(setDoc(doc(db, 'friend_profiles', BOB), { uid: BOB, nickname: '改変', photoURL: '', friendCode: BOB_CODE }));
  });
});

describe('friend_requests（申請）', () => {
  it('自分発の申請を、規定のIDで作成できる', async () => {
    const db = ctxFor(ALICE);
    await assertSucceeds(setDoc(doc(db, 'friend_requests', `${BOB}_${ALICE}`), {
      fromUid: ALICE, toUid: BOB, fromNickname: 'アリス', fromPhotoURL: '', createdAt: serverTimestamp(),
    }));
  });

  it('ID が規約 `${toUid}_${fromUid}` と違えば拒否（重複申請の防止）', async () => {
    const db = ctxFor(ALICE);
    await assertFails(setDoc(doc(db, 'friend_requests', 'arbitrary_id'), {
      fromUid: ALICE, toUid: BOB, fromNickname: 'アリス', fromPhotoURL: '', createdAt: serverTimestamp(),
    }));
  });

  it('他人を装った申請（fromUid 偽装）は拒否', async () => {
    const db = ctxFor(ALICE);
    await assertFails(setDoc(doc(db, 'friend_requests', `${BOB}_${CAROL}`), {
      fromUid: CAROL, toUid: BOB, fromNickname: 'キャロル', fromPhotoURL: '', createdAt: serverTimestamp(),
    }));
  });

  it('自分自身への申請は拒否', async () => {
    const db = ctxFor(ALICE);
    await assertFails(setDoc(doc(db, 'friend_requests', `${ALICE}_${ALICE}`), {
      fromUid: ALICE, toUid: ALICE, fromNickname: 'アリス', fromPhotoURL: '', createdAt: serverTimestamp(),
    }));
  });

  it('当事者を where で明示したクエリは読める', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'friend_requests', `${BOB}_${ALICE}`), {
        fromUid: ALICE, toUid: BOB, fromNickname: 'アリス', fromPhotoURL: '',
      });
    });
    const db = ctxFor(BOB);
    const snaps = await assertSucceeds(getDocs(query(collection(db, 'friend_requests'), where('toUid', '==', BOB))));
    expect(snaps.size).toBe(1);
  });

  it('第三者は他人宛の申請を読めない', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'friend_requests', `${BOB}_${ALICE}`), {
        fromUid: ALICE, toUid: BOB, fromNickname: 'アリス', fromPhotoURL: '',
      });
    });
    const db = ctxFor(CAROL);
    await assertFails(getDocs(query(collection(db, 'friend_requests'), where('toUid', '==', BOB))));
  });

  it('申請の内容を書き換えられない（update 全面禁止）', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'friend_requests', `${BOB}_${ALICE}`), {
        fromUid: ALICE, toUid: BOB, fromNickname: 'アリス', fromPhotoURL: '',
      });
    });
    const db = ctxFor(ALICE);
    await assertFails(setDoc(doc(db, 'friend_requests', `${BOB}_${ALICE}`), {
      fromUid: ALICE, toUid: BOB, fromNickname: '別名', fromPhotoURL: '',
    }, { merge: true }));
  });

  it('第三者は申請を削除できない', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'friend_requests', `${BOB}_${ALICE}`), {
        fromUid: ALICE, toUid: BOB, fromNickname: 'アリス', fromPhotoURL: '',
      });
    });
    const db = ctxFor(CAROL);
    await assertFails(deleteDoc(doc(db, 'friend_requests', `${BOB}_${ALICE}`)));
  });

  it('送信者は自分の申請を取り消せる', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'friend_requests', `${BOB}_${ALICE}`), {
        fromUid: ALICE, toUid: BOB, fromNickname: 'アリス', fromPhotoURL: '',
      });
    });
    const db = ctxFor(ALICE);
    await assertSucceeds(deleteDoc(doc(db, 'friend_requests', `${BOB}_${ALICE}`)));
  });
});

describe('friends（承認と関係）', () => {
  async function seedRequest(fromUid: string, toUid: string, nickname: string) {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'friend_requests', `${toUid}_${fromUid}`), {
        fromUid, toUid, fromNickname: nickname, fromPhotoURL: '',
      });
    });
  }

  it('承認バッチ（双方に追加 + 申請削除）が成功する', async () => {
    await seedRequest(ALICE, BOB, 'アリス');
    const db = ctxFor(BOB);
    const batch = writeBatch(db);
    batch.set(doc(db, 'friends', BOB, 'items', ALICE), { uid: ALICE, nickname: 'アリス', photoURL: '', addedAt: serverTimestamp() });
    batch.set(doc(db, 'friends', ALICE, 'items', BOB), { uid: BOB, nickname: 'ボブ', photoURL: '', addedAt: serverTimestamp() });
    batch.delete(doc(db, 'friend_requests', `${BOB}_${ALICE}`));
    await assertSucceeds(batch.commit());
  });

  it('申請が無いのに他人の friends へ割り込めない（旧ルールの穴）', async () => {
    const db = ctxFor(CAROL);
    await assertFails(setDoc(doc(db, 'friends', ALICE, 'items', CAROL), {
      uid: CAROL, nickname: 'キャロル', photoURL: '', addedAt: serverTimestamp(),
    }));
  });

  it('申請が無いのに自分の friends へ相手を追加できない', async () => {
    const db = ctxFor(CAROL);
    await assertFails(setDoc(doc(db, 'friends', CAROL, 'items', ALICE), {
      uid: ALICE, nickname: 'アリス', photoURL: '', addedAt: serverTimestamp(),
    }));
  });

  it('他人のフレンド一覧は読めない', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'friends', ALICE, 'items', BOB), { uid: BOB, nickname: 'ボブ', photoURL: '' });
    });
    const db = ctxFor(CAROL);
    await assertFails(getDocs(collection(db, 'friends', ALICE, 'items')));
  });

  it('自分のフレンド一覧は読める', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      await setDoc(doc(ctx.firestore(), 'friends', ALICE, 'items', BOB), { uid: BOB, nickname: 'ボブ', photoURL: '' });
    });
    const db = ctxFor(ALICE);
    const snaps = await assertSucceeds(getDocs(collection(db, 'friends', ALICE, 'items')));
    expect(snaps.size).toBe(1);
  });

  it('★ 他人のフレンドを勝手に消せない（第三者による削除の防止）', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, 'friends', ALICE, 'items', BOB), { uid: BOB, nickname: 'ボブ', photoURL: '' });
      await setDoc(doc(db, 'friends', BOB, 'items', ALICE), { uid: ALICE, nickname: 'アリス', photoURL: '' });
    });
    const db = ctxFor(CAROL);
    // キャロルはアリスとボブの関係に一切手を出せない
    await assertFails(deleteDoc(doc(db, 'friends', ALICE, 'items', BOB)));
    await assertFails(deleteDoc(doc(db, 'friends', BOB, 'items', ALICE)));
  });

  it('フレンド解除は双方向に実行できる（当事者のみ）', async () => {
    await testEnv.withSecurityRulesDisabled(async (ctx) => {
      const db = ctx.firestore();
      await setDoc(doc(db, 'friends', ALICE, 'items', BOB), { uid: BOB, nickname: 'ボブ', photoURL: '' });
      await setDoc(doc(db, 'friends', BOB, 'items', ALICE), { uid: ALICE, nickname: 'アリス', photoURL: '' });
    });
    const db = ctxFor(ALICE);
    const batch = writeBatch(db);
    batch.delete(doc(db, 'friends', ALICE, 'items', BOB));
    batch.delete(doc(db, 'friends', BOB, 'items', ALICE));
    await assertSucceeds(batch.commit());
  });

  it('uid フィールドとドキュメントIDの不一致は拒否', async () => {
    await seedRequest(ALICE, BOB, 'アリス');
    const db = ctxFor(BOB);
    await assertFails(setDoc(doc(db, 'friends', BOB, 'items', ALICE), {
      uid: CAROL, nickname: '偽装', photoURL: '', addedAt: serverTimestamp(),
    }));
  });

  it('自分自身をフレンドに追加できない', async () => {
    const db = ctxFor(ALICE);
    await assertFails(setDoc(doc(db, 'friends', ALICE, 'items', ALICE), {
      uid: ALICE, nickname: 'アリス', photoURL: '', addedAt: serverTimestamp(),
    }));
  });
});
