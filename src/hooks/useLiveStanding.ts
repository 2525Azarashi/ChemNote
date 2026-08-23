/**
 * ===================================================================
 * 解答中に「いま何位か」を出すためのフック
 * ===================================================================
 *
 * ■ 設計で一番気をつけたこと：通信を増やさない
 * 解答中はスコアが1問ごとに動く。そのたびに Firestore を読みに行くと
 * 読み取り回数が跳ね上がるし、通信待ちで数字がカクつく（＝臨場感が壊れる）。
 *
 * そこで
 *   ・章のベストスコア一覧（ライバル表）は「開いたときに1回だけ」取る
 *   ・順位はスコアが動くたびに手元で計算し直す（computeLiveStanding）
 * とした。これなら通信は1回で、順位表示は即座に動く。
 *
 * ■ ゲスト／未ログイン
 * ランキングに載らないので取得しない（standing は null）。
 * 呼び出し側は null のときは表示しなければよい。
 */

import { useEffect, useMemo, useRef, useState } from 'react';
import { auth } from '../firebase';
import { fetchChapterRanking } from '../utils/leaderboard';
import { computeLiveStanding, type LadderEntry, type LiveStanding } from '../utils/liveRank';
import { displayNicknameForNational } from '../utils/nicknamePrivacy';

export interface UseLiveStandingResult {
  /** 暫定順位の情報。取得前・ゲスト時は null */
  standing: LiveStanding | null;
  /** 直前の順位から何人抜いたか（負なら抜かれた）。演出の起点に使う */
  delta: number;
  /** ライバル表の取得が終わったか */
  ready: boolean;
}

export function useLiveStanding(
  chapterId: string,
  myScore: number,
  isGuest: boolean,
): UseLiveStandingResult {
  const [ladder, setLadder] = useState<LadderEntry[] | null>(null);
  const [delta, setDelta] = useState(0);
  const previousRankRef = useRef<number | null>(null);

  // ライバル表の取得は「章を開いたとき1回だけ」
  useEffect(() => {
    let cancelled = false;
    if (isGuest || !auth.currentUser) {
      setLadder(null);
      return;
    }
    (async () => {
      try {
        const rows = await fetchChapterRanking(chapterId, 100);
        if (cancelled) return;
        setLadder(
          rows.map((row) => ({
            uid: row.entry.uid,
            // 解答中の「すぐ上の相手」表示も全国ランキング由来なので、
            // 他人の名前は部分マスクしてから保持する（個人情報保護）。
            nickname: displayNicknameForNational(
              row.entry.nickname || '名無しの化学者',
              row.entry.uid === auth.currentUser?.uid,
            ),
            score: row.entry.bestScore || 0,
          })),
        );
      } catch {
        // ランキングが取れなくても学習は止めない
        if (!cancelled) setLadder(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [chapterId, isGuest]);

  const standing = useMemo(() => {
    if (!ladder) return null;
    return computeLiveStanding(ladder, auth.currentUser?.uid || null, myScore);
  }, [ladder, myScore]);

  // 順位が動いた瞬間だけ delta を立てる（演出のトリガー）
  //
  // ★順位が変わらなかったときは必ず 0 に戻すこと★
  // 前回の値を残したままにすると、スコアだけ動いて順位が動かなかった場合に
  // 「2人抜き！」という古い実況がもう一度出てしまう（＝嘘の演出になる）。
  useEffect(() => {
    if (!standing) return;
    const prev = previousRankRef.current;
    previousRankRef.current = standing.rank;
    // 初回は比較対象がないので演出しない
    setDelta(prev == null ? 0 : prev - standing.rank);
  }, [standing]);

  return { standing, delta, ready: ladder != null };
}
