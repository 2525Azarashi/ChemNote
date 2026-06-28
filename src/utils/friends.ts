import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
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

function makeFriendCode(uid: string) {
  // uid から英数字のみを抽出し、8 文字のフレンドコードを確定的に生成する。
  // 衝突を抑えつつ、入力・共有しやすいフォーマット（MNTB-XXXX-XXXX）にする。
  const cleaned = (uid || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  let base = cleaned.slice(0, 8);
  // 万一 uid が短い場合は uid のハッシュで補完して常に 8 文字を確保する。
  if (base.length < 8) {
    let hash = 0;
    for (let i = 0; i < (uid || 'mntb').length; i++) {
      hash = (hash * 31 + (uid || 'mntb').charCodeAt(i)) >>> 0;
    }
    const pad = hash.toString(36).toUpperCase().replace(/[^A-Z0-9]/g, '0');
    base = (base + pad + '00000000').slice(0, 8);
  }
  return `MNTB-${base.slice(0, 4)}-${base.slice(4, 8)}`;
}

export async function ensureFriendProfile(): Promise<FriendProfile | null> {
  const user = auth.currentUser;
  if (!user) return null;
  // フレンドコードは uid から確定的に生成するため、サーバ同期の成否に関わらず必ず発行できる。
  const profile: FriendProfile = {
    uid: user.uid,
    nickname: resolveNickname(),
    photoURL: user.photoURL || '',
    friendCode: makeFriendCode(user.uid),
  };
  // Firestore への保存に失敗しても、フレンドコード自体は表示できるようにプロフィールを返す。
  try {
    await setDoc(doc(db, 'friend_profiles', user.uid), {
      ...profile,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  } catch (e) {
    console.error('フレンドプロフィールの保存に失敗しました（コードは利用できます）:', e);
  }
  return profile;
}

export async function sendFriendRequest(friendCode: string): Promise<string> {
  const me = await ensureFriendProfile();
  if (!me) throw new Error('Googleログインが必要です。');
  const code = friendCode.trim().toUpperCase();
  if (!code) throw new Error('フレンドコードを入力してください。');

  const snaps = await getDocs(query(collection(db, 'friend_profiles'), where('friendCode', '==', code)));
  if (snaps.empty) throw new Error('該当するフレンドコードが見つかりません。');
  const target = snaps.docs[0].data() as FriendProfile;
  if (target.uid === me.uid) throw new Error('自分自身には申請できません。');

  await setDoc(doc(db, 'friend_requests', `${target.uid}_${me.uid}`), {
    fromUid: me.uid,
    toUid: target.uid,
    fromNickname: me.nickname,
    fromPhotoURL: me.photoURL || '',
    createdAt: serverTimestamp(),
  });
  return `${target.nickname} さんへ申請しました。`;
}

export async function fetchFriendRequests(): Promise<FriendRequest[]> {
  const user = auth.currentUser;
  if (!user) return [];
  try {
    const snaps = await getDocs(query(collection(db, 'friend_requests'), where('toUid', '==', user.uid)));
    return snaps.docs.map((s) => ({ id: s.id, ...(s.data() as Omit<FriendRequest, 'id'>) }));
  } catch (e) {
    // 権限エラー（ルール未デプロイなど）でもパネル全体を壊さないよう、空配列で返す。
    console.error('フレンド申請の取得に失敗しました:', e);
    return [];
  }
}

// 届いている（自分宛の）フレンド申請の件数を取得する。設定ボタンのバッジ表示などに使用。
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

export async function acceptFriendRequest(req: FriendRequest) {
  const me = await ensureFriendProfile();
  if (!me) return;
  await setDoc(doc(db, 'friends', me.uid, 'items', req.fromUid), {
    uid: req.fromUid,
    nickname: req.fromNickname,
    photoURL: req.fromPhotoURL || '',
    addedAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'friends', req.fromUid, 'items', me.uid), {
    uid: me.uid,
    nickname: me.nickname,
    photoURL: me.photoURL || '',
    addedAt: serverTimestamp(),
  });
  await deleteDoc(doc(db, 'friend_requests', req.id));
}

export async function rejectFriendRequest(req: FriendRequest) {
  await deleteDoc(doc(db, 'friend_requests', req.id));
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

export async function removeFriend(friendUid: string) {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(doc(db, 'friends', user.uid, 'items', friendUid));
  await deleteDoc(doc(db, 'friends', friendUid, 'items', user.uid));
}
