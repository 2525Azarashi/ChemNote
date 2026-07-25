/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * フレンド機能（Google認証 + Firestore）
 *
 * ▼ コレクション設計
 *
 *   friend_codes/{friendCode}            ← コード → uid の逆引きインデックス
 *     { uid, nickname, photoURL, updatedAt }
 *     - get のみ許可 / list 禁止
 *     - 「コードを知っている人だけが相手の uid を引ける」ための入口。
 *       friend_profiles を where 検索する設計は、ルール上コレクション全体の
 *       read を開放することになり全ユーザーを吸い出せてしまうため採用しない。
 *
 *   friend_profiles/{uid}                ← 表示用プロフィール
 *     { uid, nickname, photoURL, friendCode, updatedAt }
 *     - 本人 / フレンド / 申請関係にある相手のみ get 可能、list 禁止
 *
 *   friend_requests/{toUid}_{fromUid}    ← 申請（1組につき必ず1件）
 *     { fromUid, toUid, fromNickname, fromPhotoURL, createdAt }
 *     - ドキュメントIDを固定することで重複申請を構造的に防ぐ
 *     - update 禁止。承認は「delete + friends 作成」で表現する
 *
 *   friends/{ownerUid}/items/{friendUid} ← 確定したフレンド関係（双方向に1件ずつ）
 *     { uid, nickname, photoURL, addedAt }
 *     - 作成時にルールが friend_requests の実在を検証するため、
 *       無関係な他人の一覧に割り込むことはできない
 */

import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
  type Timestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { resolveNickname } from './leaderboard';

export interface FriendProfile {
  uid: string;
  nickname: string;
  photoURL?: string;
  friendCode: string;
  updatedAt?: Timestamp | null;
}

export interface FriendRequest {
  id: string;
  fromUid: string;
  toUid: string;
  fromNickname: string;
  fromPhotoURL?: string;
  createdAt?: Timestamp | null;
}

export const FRIEND_CODE_PATTERN = /^MNTB-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

/** 申請ドキュメントIDは `${toUid}_${fromUid}` に固定（ルールと一致させる）。 */
function requestId(fromUid: string, toUid: string) {
  return `${toUid}_${fromUid}`;
}

/**
 * Firestore の権限エラーを、ユーザーに意味が伝わる日本語へ変換する。
 * 「Missing or insufficient permissions.」をそのまま出さないための共通処理。
 */
function toFriendlyError(error: any, fallback: string): Error {
  const code = error?.code as string | undefined;
  if (code === 'permission-denied') {
    return new Error(
      'この操作は許可されていません。firestore.rules のデプロイ（firebase deploy --only firestore:rules）が済んでいるか確認してください。'
    );
  }
  if (code === 'unavailable' || code === 'failed-precondition') {
    return new Error('通信状態が不安定です。オンラインに戻ってからもう一度お試しください。');
  }
  if (code === 'unauthenticated') {
    return new Error('Googleログインが必要です。もう一度ログインしてください。');
  }
  return new Error(error?.message ? `${fallback}（${error.message}）` : fallback);
}

function makeFriendCode(uid: string, salt = 0) {
  // UIDそのものを露出せず、UID全体から安定したコードを生成する。
  // salt はハッシュ衝突時の再試行用（salt=0 なら常に同じコードになる）。
  let hashA = 2166136261 ^ salt;
  let hashB = (0x9e3779b9 ^ (salt * 2654435761)) >>> 0;
  for (const char of uid || 'mntb') {
    const value = char.charCodeAt(0);
    hashA = Math.imul(hashA ^ value, 16777619) >>> 0;
    hashB = Math.imul(hashB ^ value, 2246822519) >>> 0;
  }
  const base = `${hashA.toString(36)}${hashB.toString(36)}`.toUpperCase().replace(/[^A-Z0-9]/g, '0').padEnd(8, '0').slice(0, 8);
  return `MNTB-${base.slice(0, 4)}-${base.slice(4, 8)}`;
}

/** 入力されたコードを `MNTB-XXXX-XXXX` 形式へ正規化する。 */
export function normalizeFriendCode(input: string): string {
  const raw = (input || '').trim().toUpperCase().replace(/\s/g, '');
  const compact = raw.replace(/[^A-Z0-9]/g, '');
  if (compact.startsWith('MNTB') && compact.length === 12) {
    return `MNTB-${compact.slice(4, 8)}-${compact.slice(8, 12)}`;
  }
  return raw;
}

/**
 * 自分のプロフィールとフレンドコード逆引きインデックスを用意する。
 * 一度発行したコードは変更せず、共有済みコードを無効にしない。
 */
export async function ensureFriendProfile(): Promise<FriendProfile | null> {
  const user = auth.currentUser;
  if (!user) return null;

  const nickname = resolveNickname();
  const photoURL = user.photoURL || '';

  // すでに発行済みのコードがあれば、それを維持する（共有済みコードを無効にしない）。
  let savedCode: string | null = null;
  try {
    const existing = await getDoc(doc(db, 'friend_profiles', user.uid));
    const value = existing.data()?.friendCode;
    if (typeof value === 'string' && FRIEND_CODE_PATTERN.test(value)) savedCode = value;
  } catch {
    // オフライン・初回でも決定的なコードを表示できる。
  }

  // 逆引きインデックスを確保する。ハッシュ衝突（別ユーザーが同じコードを
  // 使用中）の場合は salt を変えて再試行し、コードの一意性を保証する。
  let friendCode = savedCode ?? makeFriendCode(user.uid);
  if (!savedCode) {
    for (let salt = 0; salt < 8; salt += 1) {
      const candidate = makeFriendCode(user.uid, salt);
      try {
        const snap = await getDoc(doc(db, 'friend_codes', candidate));
        const ownerUid = snap.exists() ? (snap.data()?.uid as string | undefined) : undefined;
        if (!snap.exists() || ownerUid === user.uid) {
          friendCode = candidate;
          break;
        }
        // 他人が使用中 → 次の salt へ
      } catch {
        // 読み取り失敗時は既定コードのまま進める（表示は可能）。
        break;
      }
    }
  }

  const profile: FriendProfile = { uid: user.uid, nickname, photoURL, friendCode };

  // 保存に失敗してもコード自体は表示できるようにプロフィールを返す。
  try {
    await setDoc(
      doc(db, 'friend_profiles', user.uid),
      { ...profile, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (e) {
    console.error('フレンドプロフィールの保存に失敗しました（コードは利用できます）:', e);
  }

  // 逆引きインデックス。これが無いと相手からコード検索されない。
  try {
    await setDoc(
      doc(db, 'friend_codes', friendCode),
      { uid: user.uid, nickname, photoURL, updatedAt: serverTimestamp() },
      { merge: true }
    );
  } catch (e) {
    console.error('フレンドコードの登録に失敗しました:', e);
  }

  return profile;
}

/** コードから相手を1件だけ引く（get のみ。列挙はできない）。 */
async function lookupByFriendCode(code: string): Promise<{ uid: string; nickname: string; photoURL: string } | null> {
  try {
    const snap = await getDoc(doc(db, 'friend_codes', code));
    if (!snap.exists()) return null;
    const data = snap.data() as { uid?: string; nickname?: string; photoURL?: string };
    if (typeof data.uid !== 'string' || data.uid.length === 0) return null;
    return {
      uid: data.uid,
      nickname: data.nickname || '名無しの化学者',
      photoURL: data.photoURL || '',
    };
  } catch (e) {
    throw toFriendlyError(e, 'フレンドコードの検索に失敗しました。');
  }
}

/**
 * フレンド申請を送る。
 * 事前チェックはすべて「自分が読める範囲」だけで行い、権限エラーを起こさない。
 */
export async function sendFriendRequest(friendCode: string): Promise<string> {
  const me = await ensureFriendProfile();
  if (!me) throw new Error('Googleログインが必要です。');

  const code = normalizeFriendCode(friendCode);
  if (!code) throw new Error('フレンドコードを入力してください。');
  if (!FRIEND_CODE_PATTERN.test(code)) {
    throw new Error('フレンドコードの形式を確認してください。（例: MNTB-1QHZ-RF1K）');
  }
  if (code === me.friendCode) throw new Error('自分自身には申請できません。');

  const target = await lookupByFriendCode(code);
  if (!target) throw new Error('該当するフレンドコードが見つかりません。');
  if (target.uid === me.uid) throw new Error('自分自身には申請できません。');

  // すでにフレンドか？（自分の配下なので必ず読める）
  try {
    const friendship = await getDoc(doc(db, 'friends', me.uid, 'items', target.uid));
    if (friendship.exists()) throw new Error(`${target.nickname} さんとはすでにフレンドです。`);
  } catch (e: any) {
    if (e instanceof Error && e.message.includes('すでにフレンド')) throw e;
    throw toFriendlyError(e, 'フレンド状態の確認に失敗しました。');
  }

  // 相手から申請が届いていないか／自分が既に送っていないか。
  // 単一ドキュメントの get は「存在しない場合に resource.data が無く」
  // ルールが当事者判定できず permission-denied になるため、当事者を
  // where で明示したクエリで確認する（未申請時も安全に空結果になる）。
  try {
    const incoming = await getDocs(query(
      collection(db, 'friend_requests'),
      where('toUid', '==', me.uid),
      where('fromUid', '==', target.uid),
    ));
    if (!incoming.empty) {
      throw new Error('相手から申請が届いています。「届いている申請」から承認してください。');
    }

    const outgoing = await getDocs(query(
      collection(db, 'friend_requests'),
      where('fromUid', '==', me.uid),
      where('toUid', '==', target.uid),
    ));
    if (!outgoing.empty) return `${target.nickname} さんへ申請済みです。`;
  } catch (e: any) {
    if (e instanceof Error && e.message.includes('申請が届いています')) throw e;
    throw toFriendlyError(e, '申請状況の確認に失敗しました。');
  }

  try {
    await setDoc(doc(db, 'friend_requests', requestId(me.uid, target.uid)), {
      fromUid: me.uid,
      toUid: target.uid,
      fromNickname: me.nickname,
      fromPhotoURL: me.photoURL || '',
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    throw toFriendlyError(e, '申請の送信に失敗しました。');
  }

  return `${target.nickname} さんへ申請しました。`;
}

export async function fetchFriendRequests(): Promise<FriendRequest[]> {
  const user = auth.currentUser;
  if (!user) return [];
  try {
    const snaps = await getDocs(query(collection(db, 'friend_requests'), where('toUid', '==', user.uid)));
    return snaps.docs.map((s) => ({ id: s.id, ...(s.data() as Omit<FriendRequest, 'id'>) }));
  } catch (e) {
    // 権限エラー（ルール未デプロイなど）でもパネル全体を壊さないよう空配列で返す。
    console.error('フレンド申請の取得に失敗しました:', e);
    return [];
  }
}

/** 送信済み（自分発）の申請一覧。取り消し用。 */
export async function fetchSentFriendRequests(): Promise<FriendRequest[]> {
  const user = auth.currentUser;
  if (!user) return [];
  try {
    const snaps = await getDocs(query(collection(db, 'friend_requests'), where('fromUid', '==', user.uid)));
    return snaps.docs.map((s) => ({ id: s.id, ...(s.data() as Omit<FriendRequest, 'id'>) }));
  } catch (e) {
    console.error('送信済み申請の取得に失敗しました:', e);
    return [];
  }
}

// 届いている（自分宛の）フレンド申請の件数。設定ボタンのバッジ表示などに使用。
export async function countIncomingFriendRequests(): Promise<number> {
  const user = auth.currentUser;
  if (!user) return 0;
  try {
    const snaps = await getDocs(query(collection(db, 'friend_requests'), where('toUid', '==', user.uid)));
    return snaps.size;
  } catch {
    return 0;
  }
}

/**
 * 申請を承認する。
 * 双方の friends に1件ずつ作成し、申請を削除するところまでを1バッチで確定。
 * ルール側は「申請ドキュメントが実在すること」を検証するので、
 * 申請なしに他人の friends へ割り込むことはできない。
 */
export async function acceptFriendRequest(req: FriendRequest) {
  const me = await ensureFriendProfile();
  if (!me) throw new Error('Googleログインが必要です。');
  if (req.toUid !== me.uid) throw new Error('この申請を承認する権限がありません。');

  const batch = writeBatch(db);
  // 自分の一覧に相手を追加
  batch.set(doc(db, 'friends', me.uid, 'items', req.fromUid), {
    uid: req.fromUid,
    nickname: req.fromNickname || '名無しの化学者',
    photoURL: req.fromPhotoURL || '',
    addedAt: serverTimestamp(),
  });
  // 相手の一覧に自分を追加
  batch.set(doc(db, 'friends', req.fromUid, 'items', me.uid), {
    uid: me.uid,
    nickname: me.nickname,
    photoURL: me.photoURL || '',
    addedAt: serverTimestamp(),
  });
  // 申請を削除（friends 作成の検証より後に評価される）
  batch.delete(doc(db, 'friend_requests', requestId(req.fromUid, req.toUid)));

  try {
    await batch.commit();
  } catch (e) {
    throw toFriendlyError(e, '承認に失敗しました。');
  }
}

export async function rejectFriendRequest(req: FriendRequest) {
  const user = auth.currentUser;
  if (!user || req.toUid !== user.uid) throw new Error('この申請を拒否する権限がありません。');
  try {
    await deleteDoc(doc(db, 'friend_requests', requestId(req.fromUid, req.toUid)));
  } catch (e) {
    throw toFriendlyError(e, '申請の拒否に失敗しました。');
  }
}

/** 自分が送った申請を取り消す。 */
export async function cancelFriendRequest(req: FriendRequest) {
  const user = auth.currentUser;
  if (!user || req.fromUid !== user.uid) throw new Error('この申請を取り消す権限がありません。');
  try {
    await deleteDoc(doc(db, 'friend_requests', requestId(req.fromUid, req.toUid)));
  } catch (e) {
    throw toFriendlyError(e, '申請の取り消しに失敗しました。');
  }
}

export async function fetchFriends(): Promise<Array<{ uid: string; nickname: string; photoURL?: string }>> {
  const user = auth.currentUser;
  if (!user) return [];
  try {
    const snaps = await getDocs(collection(db, 'friends', user.uid, 'items'));
    return snaps.docs.map((s) => s.data() as { uid: string; nickname: string; photoURL?: string });
  } catch (e) {
    console.error('フレンド一覧の取得に失敗しました:', e);
    return [];
  }
}

/**
 * フレンドを解除する。
 * 自分の配下と、相手の配下にある「自分」の2件だけを削除する。
 * ルールは delete を `userId == me || friendUid == me` に限定しているので、
 * 第三者同士の関係には手を出せない。
 */
export async function removeFriend(friendUid: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('Googleログインが必要です。');
  const batch = writeBatch(db);
  batch.delete(doc(db, 'friends', user.uid, 'items', friendUid));
  batch.delete(doc(db, 'friends', friendUid, 'items', user.uid));
  try {
    await batch.commit();
  } catch (e) {
    throw toFriendlyError(e, 'フレンドの解除に失敗しました。');
  }
}

export async function fetchFriendUids(includeMe = true): Promise<string[]> {
  const user = auth.currentUser;
  if (!user) return [];
  const friends = await fetchFriends();
  return [...new Set([...(includeMe ? [user.uid] : []), ...friends.map((friend) => friend.uid)])];
}

export interface FriendCompetitionEntry {
  uid: string;
  nickname: string;
  photoURL: string;
  score: number;
  sub: string;
}

/** フレンド全員（自分を含む）の合計・章別・期間別スコアを漏れなく集計する。 */
export async function fetchFriendCompetition(
  mode: 'total' | 'chapter' | 'period',
  options: { chapterId?: string; since?: Date | null } = {}
): Promise<FriendCompetitionEntry[]> {
  const uids = await fetchFriendUids(true);
  if (uids.length === 0) return [];

  if (mode === 'total' || mode === 'chapter') {
    const entries = await Promise.all(uids.map(async (uid) => {
      const ref = mode === 'total'
        ? doc(db, 'leaderboard_total', uid)
        : doc(db, 'leaderboard_chapter', `${options.chapterId}_${uid}`);
      const snap = await getDoc(ref);
      if (!snap.exists()) return null;
      const data = snap.data() as any;
      return {
        uid,
        nickname: data.nickname || '名無しの化学者',
        photoURL: data.photoURL || '',
        score: mode === 'total' ? (data.totalScore || 0) : (data.bestScore || 0),
        sub: mode === 'total'
          ? `${Object.keys(data.chapterScores || {}).length} 章クリア`
          : `正答率 ${Math.round((data.correctRate || 0) * 100)}% / ${data.timeUsedSec || 0}秒`,
      } satisfies FriendCompetitionEntry;
    }));
    return entries.filter((entry): entry is FriendCompetitionEntry => entry !== null).sort((a, b) => b.score - a.score);
  }

  const entries = await Promise.all(uids.map(async (uid) => {
    const snaps = await getDocs(query(collection(db, 'leaderboard_events'), where('uid', '==', uid)));
    const events = snaps.docs.map((item) => item.data() as any).filter((event) => {
      if (!options.since) return true;
      const playedAt = event.playedAt?.toDate?.();
      return playedAt instanceof Date && playedAt >= options.since;
    });
    if (events.length === 0) return null;
    const best = events.reduce((current, event) => (event.score || 0) > (current.score || 0) ? event : current, events[0]);
    return {
      uid,
      nickname: best.nickname || '名無しの化学者',
      photoURL: best.photoURL || '',
      score: best.score || 0,
      sub: `${events.length} 回プレイ`,
    } satisfies FriendCompetitionEntry;
  }));
  return entries.filter((entry): entry is FriendCompetitionEntry => entry !== null).sort((a, b) => b.score - a.score);
}
