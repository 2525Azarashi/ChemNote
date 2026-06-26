/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Firestore を使ったランキング同期ロジック
 *
 * コレクション設計:
 *   leaderboard_chapter / {chapterId}_{uid}
 *     - uid, nickname, photoURL, chapterId
 *     - bestScore, correctRate, totalCorrect, timeUsedSec
 *     - playedAt (Timestamp) ← 週間/月間集計用
 *
 *   leaderboard_total / {uid}
 *     - uid, nickname, photoURL
 *     - totalScore (全章ベストスコアの合計)
 *     - chapterScores (Record<chapterId, score>)
 *     - updatedAt (Timestamp)
 *
 *   leaderboard_events / {auto}
 *     - uid, nickname, photoURL
 *     - chapterId, score, correctRate
 *     - playedAt (Timestamp)  ← 週間/月間/全期間ランキングはこのコレクションから集計
 *
 * 仕様:
 *   - 章ベスト: 同一 chapterId & uid のドキュメントを 1 つだけ持つ（書き込み前に既存スコアと比較）
 *   - 全章合計: chapterScores を更新するたびに totalScore を再計算
 *   - 週間/月間: 全プレイ履歴(leaderboard_events)から playedAt の範囲で集計
 *   - ゲストモード（auth.currentUser が null）の場合は同期しない
 */

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  serverTimestamp,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { LEADERBOARD_PAGE_SIZE } from './scoring';

export interface ChapterScoreEntry {
  uid: string;
  nickname: string;
  photoURL?: string;
  chapterId: string;
  bestScore: number;
  correctRate: number;
  totalCorrect: number;
  totalQuestions: number;
  timeUsedSec: number;
  playedAt: Timestamp | null;
}

export interface TotalScoreEntry {
  uid: string;
  nickname: string;
  photoURL?: string;
  totalScore: number;
  chapterScores: Record<string, number>;
  updatedAt: Timestamp | null;
}

export type RankingPeriod = 'week' | 'month' | 'all';

export interface RankingResult<T> {
  rank: number;
  entry: T;
  isMe: boolean;
}

// ============================================================
// ニックネーム解決
// ============================================================

/**
 * プロフィール（localStorage）からニックネームを取得。
 * なければ displayName、それもなければ「名無しの化学者」を返す。
 */
export function resolveNickname(): string {
  const user = auth.currentUser;
  if (!user) return 'ゲスト';
  try {
    const local = localStorage.getItem(`profile_${user.uid}`);
    if (local) {
      const p = JSON.parse(local);
      if (p && typeof p.name === 'string' && p.name.trim().length > 0) {
        return p.name.trim().slice(0, 24);
      }
    }
  } catch {
    // noop
  }
  return (user.displayName || '名無しの化学者').slice(0, 24);
}

// ============================================================
// 章スコア書き込み
// ============================================================

export interface SubmitChapterScoreInput {
  chapterId: string;
  score: number;
  correctRate: number;
  totalCorrect: number;
  totalQuestions: number;
  timeUsedSec: number;
}

/**
 * 章のベストスコアを Firestore に書き込む。
 * - 既存スコアより低ければ書き込まない（ただし event 履歴には常に残す）
 * - ゲストモードでは何もしない
 * - 失敗してもアプリ動作は止めない（catch して console.error）
 */
export async function submitChapterScore(
  input: SubmitChapterScoreInput
): Promise<{ updated: boolean; previousBest: number }> {
  const user = auth.currentUser;
  if (!user) return { updated: false, previousBest: 0 };

  const nickname = resolveNickname();
  const docId = `${input.chapterId}_${user.uid}`;
  const ref = doc(db, 'leaderboard_chapter', docId);

  let previousBest = 0;
  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data() as ChapterScoreEntry;
      previousBest = data.bestScore || 0;
    }
  } catch (e) {
    console.error('[Leaderboard] read chapter best failed:', e);
  }

  // プレイ履歴は常に記録（週間/月間ランキング用）
  try {
    await addDoc(collection(db, 'leaderboard_events'), {
      uid: user.uid,
      nickname,
      photoURL: user.photoURL || '',
      chapterId: input.chapterId,
      score: input.score,
      correctRate: input.correctRate,
      totalCorrect: input.totalCorrect,
      totalQuestions: input.totalQuestions,
      timeUsedSec: input.timeUsedSec,
      playedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error('[Leaderboard] add event failed:', e);
  }

  if (input.score <= previousBest) {
    return { updated: false, previousBest };
  }

  // 章ベスト更新
  try {
    await setDoc(ref, {
      uid: user.uid,
      nickname,
      photoURL: user.photoURL || '',
      chapterId: input.chapterId,
      bestScore: input.score,
      correctRate: input.correctRate,
      totalCorrect: input.totalCorrect,
      totalQuestions: input.totalQuestions,
      timeUsedSec: input.timeUsedSec,
      playedAt: serverTimestamp(),
    });
  } catch (e) {
    console.error('[Leaderboard] set chapter best failed:', e);
    return { updated: false, previousBest };
  }

  // 全章合計を更新
  try {
    await updateTotalScore(user.uid, nickname, user.photoURL || '');
  } catch (e) {
    console.error('[Leaderboard] update total failed:', e);
  }

  return { updated: true, previousBest };
}

async function updateTotalScore(uid: string, nickname: string, photoURL: string) {
  // 自分の章ベスト一覧を取得
  const q = query(
    collection(db, 'leaderboard_chapter'),
    where('uid', '==', uid)
  );
  const snaps = await getDocs(q);
  const chapterScores: Record<string, number> = {};
  let totalScore = 0;
  snaps.forEach((s) => {
    const d = s.data() as ChapterScoreEntry;
    chapterScores[d.chapterId] = d.bestScore || 0;
    totalScore += d.bestScore || 0;
  });

  const ref = doc(db, 'leaderboard_total', uid);
  await setDoc(ref, {
    uid,
    nickname,
    photoURL,
    totalScore,
    chapterScores,
    updatedAt: serverTimestamp(),
  });
}

// ============================================================
// ランキング取得
// ============================================================

/**
 * 章ベストランキングを取得（上位 N 件）
 */
export async function fetchChapterRanking(
  chapterId: string,
  topN: number = LEADERBOARD_PAGE_SIZE
): Promise<RankingResult<ChapterScoreEntry>[]> {
  const me = auth.currentUser;
  try {
    const q = query(
      collection(db, 'leaderboard_chapter'),
      where('chapterId', '==', chapterId),
      orderBy('bestScore', 'desc'),
      limit(topN)
    );
    const snaps = await getDocs(q);
    const list: RankingResult<ChapterScoreEntry>[] = [];
    let rank = 0;
    snaps.forEach((s) => {
      rank += 1;
      const entry = s.data() as ChapterScoreEntry;
      list.push({ rank, entry, isMe: !!me && entry.uid === me.uid });
    });
    return list;
  } catch (e) {
    console.error('[Leaderboard] fetchChapterRanking failed:', e);
    return [];
  }
}

/**
 * 全章合計ランキングを取得
 */
export async function fetchTotalRanking(
  topN: number = LEADERBOARD_PAGE_SIZE
): Promise<RankingResult<TotalScoreEntry>[]> {
  const me = auth.currentUser;
  try {
    const q = query(
      collection(db, 'leaderboard_total'),
      orderBy('totalScore', 'desc'),
      limit(topN)
    );
    const snaps = await getDocs(q);
    const list: RankingResult<TotalScoreEntry>[] = [];
    let rank = 0;
    snaps.forEach((s) => {
      rank += 1;
      const entry = s.data() as TotalScoreEntry;
      list.push({ rank, entry, isMe: !!me && entry.uid === me.uid });
    });
    return list;
  } catch (e) {
    console.error('[Leaderboard] fetchTotalRanking failed:', e);
    return [];
  }
}

/**
 * 期間ランキング（週間 / 月間 / 全期間）
 * leaderboard_events を期間で絞り、uid ごとに最高スコアを集計する。
 */
export async function fetchPeriodRanking(
  period: RankingPeriod,
  topN: number = LEADERBOARD_PAGE_SIZE
): Promise<RankingResult<{ uid: string; nickname: string; photoURL?: string; bestScore: number; playCount: number }>[]> {
  const me = auth.currentUser;
  try {
    let since: Date | null = null;
    if (period === 'week') {
      since = new Date();
      since.setDate(since.getDate() - 7);
    } else if (period === 'month') {
      since = new Date();
      since.setMonth(since.getMonth() - 1);
    }

    const constraints: any[] = [orderBy('playedAt', 'desc'), limit(500)];
    if (since) {
      constraints.unshift(where('playedAt', '>=', Timestamp.fromDate(since)));
    }
    const q = query(collection(db, 'leaderboard_events'), ...constraints);
    const snaps = await getDocs(q);

    const bucket = new Map<string, { uid: string; nickname: string; photoURL?: string; bestScore: number; playCount: number }>();
    snaps.forEach((s) => {
      const d = s.data() as any;
      const cur = bucket.get(d.uid);
      if (!cur) {
        bucket.set(d.uid, {
          uid: d.uid,
          nickname: d.nickname || '名無しの化学者',
          photoURL: d.photoURL || '',
          bestScore: d.score || 0,
          playCount: 1,
        });
      } else {
        cur.playCount += 1;
        if ((d.score || 0) > cur.bestScore) {
          cur.bestScore = d.score;
          cur.nickname = d.nickname || cur.nickname;
          cur.photoURL = d.photoURL || cur.photoURL;
        }
      }
    });

    const sorted = [...bucket.values()].sort((a, b) => b.bestScore - a.bestScore).slice(0, topN);
    return sorted.map((entry, i) => ({
      rank: i + 1,
      entry,
      isMe: !!me && entry.uid === me.uid,
    }));
  } catch (e) {
    console.error('[Leaderboard] fetchPeriodRanking failed:', e);
    return [];
  }
}

/**
 * 自分の章ベストスコアを取得（カード表示用）
 */
export async function fetchMyChapterBest(chapterId: string): Promise<number> {
  const user = auth.currentUser;
  if (!user) return 0;
  try {
    const ref = doc(db, 'leaderboard_chapter', `${chapterId}_${user.uid}`);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const d = snap.data() as ChapterScoreEntry;
      return d.bestScore || 0;
    }
  } catch (e) {
    console.error('[Leaderboard] fetchMyChapterBest failed:', e);
  }
  return 0;
}

/**
 * 自分の全章合計スコアを取得
 */
export async function fetchMyTotalScore(): Promise<TotalScoreEntry | null> {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const ref = doc(db, 'leaderboard_total', user.uid);
    const snap = await getDoc(ref);
    if (snap.exists()) return snap.data() as TotalScoreEntry;
  } catch (e) {
    console.error('[Leaderboard] fetchMyTotalScore failed:', e);
  }
  return null;
}
