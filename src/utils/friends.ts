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
  return `MNTB-${uid.slice(0, 6).toUpperCase()}`;
}

export async function ensureFriendProfile(): Promise<FriendProfile | null> {
  const user = auth.currentUser;
  if (!user) return null;
  const profile: FriendProfile = {
    uid: user.uid,
    nickname: resolveNickname(),
    photoURL: user.photoURL || '',
    friendCode: makeFriendCode(user.uid),
  };
  await setDoc(doc(db, 'friend_profiles', user.uid), {
    ...profile,
    updatedAt: serverTimestamp(),
  }, { merge: true });
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
  const snaps = await getDocs(query(collection(db, 'friend_requests'), where('toUid', '==', user.uid)));
  return snaps.docs.map((s) => ({ id: s.id, ...(s.data() as Omit<FriendRequest, 'id'>) }));
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
  const snaps = await getDocs(collection(db, 'friends', user.uid, 'items'));
  return snaps.docs.map((s) => s.data() as { uid: string; nickname: string; photoURL?: string });
}

export async function removeFriend(friendUid: string) {
  const user = auth.currentUser;
  if (!user) return;
  await deleteDoc(doc(db, 'friends', user.uid, 'items', friendUid));
  await deleteDoc(doc(db, 'friends', friendUid, 'items', user.uid));
}
