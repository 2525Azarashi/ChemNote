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
// ランキングへの参加登録（0pt でも掲載する）
// ============================================================

/**
 * ランキングに「自分」を登録する（スコア 0 のままでも掲載されるようにする）。
 *
 * ■ なぜ必要か
 *   これまで leaderboard_total のドキュメントは
 *   「1問でも採点してスコアを更新したとき」にしか作られていなかった。
 *   そのため Google 連携直後のユーザーはランキングに現れず、
 *   「参加していないのか、0点なのか」が本人にも他人にも分からなかった。
 *
 *   ご要望どおり「Google アカウント連携したユーザーは全員掲載」にするため、
 *   ログイン直後にこの関数を呼び、totalScore: 0 の枠を先に作っておく。
 *
 * ■ 既存スコアを絶対に壊さないための作り
 *   単純な merge でも totalScore を書くと、既にスコアを持つ人の値を
 *   0 に巻き戻してしまう危険がある。そこで
 *     ・ドキュメントが存在しない場合 → totalScore: 0 で新規作成
 *     ・存在する場合                 → nickname / photoURL だけ更新
 *   と経路を分ける。ニックネームやアイコンの変更が
 *   スコアを出すまで反映されない問題も同時に解消する。
 *
 * ■ 失敗してもアプリは止めない
 *   ランキングは学習の付随機能なので、通信・権限のエラーは警告に留める。
 *
 * @returns 新規に枠を作ったか（テスト・ログ用）
 */
export async function ensureRankingEntry(): Promise<{ created: boolean }> {
  const user = auth.currentUser;
  if (!user) return { created: false }; // ゲストは掲載対象外（識別子を持たない）

  const nickname = resolveNickname();
  const photoURL = user.photoURL || '';
  const ref = doc(db, 'leaderboard_total', user.uid);

  try {
    const snap = await getDoc(ref);
    if (snap.exists()) {
      // すでに枠がある人：スコアには一切触れず、表示名とアイコンだけ最新化する。
      const data = snap.data() as TotalScoreEntry;
      if (data.nickname === nickname && (data.photoURL || '') === photoURL) {
        return { created: false }; // 変化なし。無駄な書き込みをしない。
      }
      await setDoc(ref, { nickname, photoURL, updatedAt: serverTimestamp() }, { merge: true });
      return { created: false };
    }

    // 初回：0pt の枠を作る。これで「連携済みなら必ず載る」状態になる。
    await setDoc(ref, {
      uid: user.uid,
      nickname,
      photoURL,
      totalScore: 0,
      chapterScores: {},
      updatedAt: serverTimestamp(),
    });
    return { created: true };
  } catch (e) {
    console.warn('[Leaderboard] ensureRankingEntry failed:', e);
    return { created: false };
  }
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
// ニックネーム変更の即時反映
// ============================================================

/**
 * プロフィールで名前を変えたとき、ランキング上の表示名をその場で同期する。
 *
 * ■ なぜ必要か
 *   ランキングの名前は各ドキュメントに書き込み時点の値が保存されている
 *   （非正規化）。そのため
 *     ・leaderboard_total   … 次のログインかスコア更新まで旧名のまま
 *     ・leaderboard_chapter … その章を次にプレイするまで旧名のまま
 *   となり、「プロフィールの名前を変えたのにランキングが変わらない」
 *   という状態になっていた。プロフィール保存時にこの関数を呼び、
 *   自分の全ドキュメントの nickname / photoURL を最新化する。
 *
 * ■ leaderboard_events は更新しない
 *   セキュリティルールが create 専用（改ざん防止）のため書き換えられない。
 *   代わりに fetchPeriodRanking 側で「最新のプレイの名前」を採用する。
 *
 * ■ 失敗してもアプリは止めない（ランキングは付随機能）
 */
export async function syncRankingNickname(): Promise<void> {
  const user = auth.currentUser;
  if (!user) return;
  const nickname = resolveNickname();
  const photoURL = user.photoURL || '';
  try {
    // 全章合計（leaderboard_total）は既存の参加登録ロジックがそのまま使える
    await ensureRankingEntry();

    // 章別ベスト（leaderboard_chapter）の自分の行をすべて最新化
    const snaps = await getDocs(
      query(collection(db, 'leaderboard_chapter'), where('uid', '==', user.uid))
    );
    await Promise.all(
      snaps.docs.map((s) => {
        const d = s.data() as ChapterScoreEntry;
        if (d.nickname === nickname && (d.photoURL || '') === photoURL) {
          return Promise.resolve(); // 変化なし。無駄な書き込みをしない。
        }
        return setDoc(s.ref, { nickname, photoURL }, { merge: true });
      })
    );
  } catch (e) {
    console.warn('[Leaderboard] syncRankingNickname failed:', e);
  }
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
    // chapterId の単一条件で取得してクライアント側で並べる。
    // 複合インデックスが未デプロイの環境でもランキングを確実に表示できる。
    const q = query(collection(db, 'leaderboard_chapter'), where('chapterId', '==', chapterId));
    const snaps = await getDocs(q);
    const entries = snaps.docs
      .map((item) => item.data() as ChapterScoreEntry)
      .sort((a, b) => (b.bestScore || 0) - (a.bestScore || 0) || (a.timeUsedSec || 0) - (b.timeUsedSec || 0))
      .slice(0, topN);
    return entries.map((entry, index) => ({
      rank: index + 1,
      entry,
      isMe: !!me && entry.uid === me.uid,
    }));
  } catch (e) {
    console.error('[Leaderboard] fetchChapterRanking failed:', e);
    return [];
  }
}

/**
 * 全章合計ランキングを取得
 *
 * ■ 0pt のユーザーも掲載する（ご要望）
 *   ensureRankingEntry() がログイン時に totalScore: 0 の枠を作るため、
 *   Google 連携済みのユーザーは全員このコレクションに存在する。
 *   ここでは絞り込み（where）を一切かけないので、0pt の人もそのまま並ぶ。
 *
 * ■ 同点の並び順
 *   Firestore の orderBy('totalScore','desc') だけでは同点内の順序が
 *   ドキュメントID順（実質ランダム）になり、0pt の人が大量に並ぶと
 *   毎回順番が入れ替わって落ち着かない。
 *   そこで取得後に「スコア降順 → 更新が新しい順 → 名前順」で安定化させる。
 *
 * ■ 同順位の扱い
 *   同点なら同じ順位を与える（0pt の人が全員違う順位になるのは不自然なため）。
 *   例：100pt, 50pt, 0pt, 0pt, 0pt → 1位, 2位, 3位, 3位, 3位
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
    const entries: TotalScoreEntry[] = [];
    snaps.forEach((s) => entries.push(s.data() as TotalScoreEntry));

    entries.sort((a, b) => {
      const diff = (b.totalScore || 0) - (a.totalScore || 0);
      if (diff !== 0) return diff;
      // 同点：最近プレイした人を上に（0pt 同士でも順序が毎回変わらないようにする）
      const at = a.updatedAt?.toMillis?.() ?? 0;
      const bt = b.updatedAt?.toMillis?.() ?? 0;
      if (bt !== at) return bt - at;
      return (a.nickname || '').localeCompare(b.nickname || '', 'ja');
    });

    const list: RankingResult<TotalScoreEntry>[] = [];
    let rank = 0;
    let prevScore: number | null = null;
    entries.forEach((entry, index) => {
      const score = entry.totalScore || 0;
      // 同点は同順位。違うスコアになったら「その要素の通し番号」を順位にする。
      if (prevScore === null || score !== prevScore) rank = index + 1;
      prevScore = score;
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

    // イベントは playedAt 降順で届く＝各 uid の最初の1件が「最新のプレイ」。
    // 名前・アイコンはその最新イベントの値を使う。
    // （events はルール上 create 専用で書き換えられないため、
    //   プロフィール改名後の名前は「いちばん新しいプレイの記録」にしか
    //   入っていない。ベストスコア時点の古い名前で上書きしない。）
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
