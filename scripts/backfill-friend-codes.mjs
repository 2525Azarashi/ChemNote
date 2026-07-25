/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * 既存ユーザーの friend_profiles から friend_codes 逆引きインデックスを生成する。
 *
 * 新設コレクション `friend_codes` は通常クライアント側の ensureFriendProfile()
 * が初回ログイン時に自動登録するが、ログインを待たずに全ユーザー分を先に
 * 埋めておきたい場合に使う。
 *
 * 使い方:
 *   npm i -D firebase-admin
 *   GOOGLE_APPLICATION_CREDENTIALS=./serviceAccount.json \
 *     node scripts/backfill-friend-codes.mjs [--dry-run]
 *
 * サービスアカウントキーは Firebase Console →
 *   プロジェクトの設定 → サービス アカウント → 新しい秘密鍵の生成
 */

import { cert, initializeApp, applicationDefault } from 'firebase-admin/app';
import { FieldValue, getFirestore } from 'firebase-admin/firestore';

const DRY_RUN = process.argv.includes('--dry-run');
const CODE_PATTERN = /^MNTB-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/** クライアント側 makeFriendCode と同一のアルゴリズム（コードの一貫性を保つ）。 */
function makeFriendCode(uid) {
  let hashA = 2166136261;
  let hashB = 0x9e3779b9;
  for (const char of uid || 'mntb') {
    const value = char.charCodeAt(0);
    hashA = Math.imul(hashA ^ value, 16777619) >>> 0;
    hashB = Math.imul(hashB ^ value, 2246822519) >>> 0;
  }
  const base = `${hashA.toString(36)}${hashB.toString(36)}`
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '0')
    .padEnd(8, '0')
    .slice(0, 8);
  return `MNTB-${base.slice(0, 4)}-${base.slice(4, 8)}`;
}

async function main() {
  initializeApp({
    credential: process.env.GOOGLE_APPLICATION_CREDENTIALS
      ? applicationDefault()
      : cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')),
  });
  const db = getFirestore();

  const profiles = await db.collection('friend_profiles').get();
  console.log(`friend_profiles: ${profiles.size} 件`);

  let created = 0;
  let skipped = 0;
  let conflicts = 0;
  let batch = db.batch();
  let pending = 0;

  for (const snap of profiles.docs) {
    const data = snap.data();
    const uid = data.uid || snap.id;
    const code = CODE_PATTERN.test(data.friendCode || '')
      ? data.friendCode
      : makeFriendCode(uid);

    const codeRef = db.collection('friend_codes').doc(code);
    const existing = await codeRef.get();

    if (existing.exists) {
      if (existing.data()?.uid === uid) {
        skipped += 1;
      } else {
        // 同一コードが別 uid を指している（ハッシュ衝突）。手動確認が必要。
        console.warn(`⚠ 衝突: ${code} は ${existing.data()?.uid} が使用中（${uid} は未登録）`);
        conflicts += 1;
      }
      continue;
    }

    if (!DRY_RUN) {
      batch.set(codeRef, {
        uid,
        nickname: (data.nickname || '名無しの化学者').slice(0, 24),
        photoURL: data.photoURL || '',
        updatedAt: FieldValue.serverTimestamp(),
      });
      pending += 1;
      // Firestore のバッチ上限は 500 operation
      if (pending >= 400) {
        await batch.commit();
        batch = db.batch();
        pending = 0;
      }
    }
    created += 1;
  }

  if (!DRY_RUN && pending > 0) await batch.commit();

  console.log(
    `${DRY_RUN ? '[dry-run] ' : ''}作成: ${created} / スキップ(既存): ${skipped} / 衝突: ${conflicts}`
  );
  if (conflicts > 0) {
    console.log('衝突したユーザーは、次回ログイン時に別コードを再発行する必要があります。');
  }
}

main().catch((e) => {
  console.error('backfill に失敗しました:', e);
  process.exit(1);
});
