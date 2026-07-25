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

function makeFriendCode(uid: string) {
  // UIDそのものを露出せず、UID全体から安定したコードを生成する。
  let hashA = 2166136261;
  let hashB = 0x9e3779b9;
  for (const char of uid || 'mntb') {
    const value = char.charCodeAt(0);
    hashA = Math.imul(hashA ^ value, 16777619) >>> 0;
    hashB = Math.imul(hashB ^ value, 2246822519) >>> 0;
  }
  const base = `${hashA.toString(36)}${hashB.toString(36)}`.toUpperCase().replace(/[^A-Z0-9]/g, '0').padEnd(8, '0').slice(0, 8);
  return `MNTB-${base.slice(0, 4)}-${base.slice(4, 8)}`;
}

export async function ensureFriendProfile(): Promise<FriendProfile | null> {
  const user = auth.currentUser;
  if (!user) return null;
  // 一度発行したコードは変更せず、共有済みコードを無効にしない。
  let friendCode = makeFriendCode(user.uid);
  try {
    const existing = await getDoc(doc(db, 'friend_profiles', user.uid));
    const savedCode = existing.data()?.friendCode;
    if (typeof savedCode === 'string' && savedCode.length > 0) friendCode = savedCode;
  } catch {
    // オフライン時も決定的なコードを表示できる。
  }
  const profile: FriendProfile = {
    uid: user.uid,
    nickname: resolveNickname(),
    photoURL: user.photoURL || '',
    friendCode,
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
  const rawCode = friendCode.trim().toUpperCase().replace(/\s/g, '');
  const compact = rawCode.replace(/[^A-Z0-9]/g, '');
  const code = compact.startsWith('MNTB') && compact.length === 12
    ? `MNTB-${compact.slice(4, 8)}-${compact.slice(8, 12)}`
    : rawCode;
  if (!code) throw new Error('フレンドコードを入力してください。');
  if (!/^MNTB-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) throw new Error('フレンドコードの形式を確認してください。');

  const snaps = await getDocs(query(collection(db, 'friend_profiles'), where('friendCode', '==', code)));
  if (snaps.empty) throw new Error('該当するフレンドコードが見つかりません。');
  const target = snaps.docs[0].data() as FriendProfile;
  if (target.uid === me.uid) throw new Error('自分自身には申請できません。');

  const friendship = await getDoc(doc(db, 'friends', me.uid, 'items', target.uid));
  if (friendship.exists()) throw new Error(`${target.nickname} さんとはすでにフレンドです。`);
  // friend_requests の単一ドキュメント get は、存在しない場合に Firestore ルールが
  // resource.data から申請者を判定できず permission-denied になる。参加者を where で
  // 明示したクエリならルールが認可可能で、未申請時も安全に空結果として取得できる。
  const incoming = await getDocs(query(
    collection(db, 'friend_requests'),
    where('fromUid', '==', target.uid),
    where('toUid', '==', me.uid),
  ));
  if (!incoming.empty) throw new Error('相手から申請が届いています。「届いている申請」から承認してください。');
  const outgoing = await getDocs(query(
    collection(db, 'friend_requests'),
    where('fromUid', '==', me.uid),
    where('toUid', '==', target.uid),
  ));
  if (!outgoing.empty) return `${target.nickname} さんへ申請済みです。`;

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
  if (!me) throw new Error('Googleログインが必要です。');
  if (req.toUid !== me.uid) throw new Error('この申請を承認する権限がありません。');

  // 双方向の関係作成と申請削除を一括で確定する。
  const batch = writeBatch(db);
  batch.set(doc(db, 'friends', me.uid, 'items', req.fromUid), {
    uid: req.fromUid,
    nickname: req.fromNickname,
    photoURL: req.fromPhotoURL || '',
    addedAt: serverTimestamp(),
  });
  batch.set(doc(db, 'friends', req.fromUid, 'items', me.uid), {
    uid: me.uid,
    nickname: me.nickname,
    photoURL: me.photoURL || '',
    addedAt: serverTimestamp(),
  });
  batch.delete(doc(db, 'friend_requests', req.id));
  await batch.commit();
}

export async function rejectFriendRequest(req: FriendRequest) {
  const user = auth.currentUser;
  if (!user || req.toUid !== user.uid) throw new Error('この申請を拒否する権限がありません。');
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
  if (!user) throw new Error('Googleログインが必要です。');
  const batch = writeBatch(db);
  batch.delete(doc(db, 'friends', user.uid, 'items', friendUid));
  batch.delete(doc(db, 'friends', friendUid, 'items', user.uid));
  await batch.commit();
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
