/**
 * ===================================================================
 * 対戦モード: 試合の進行を1本にまとめたフック
 * ===================================================================
 *
 * ■ 責務
 *   ・部屋の購読（★1試合＝購読1本★）
 *   ・締切からの残り時間の計算（端末側で引き算）
 *   ・両者解答済み／締切到達で次の問題へ進める
 *   ・相手の切断（不戦勝）の判定
 *   ・結果の申告とレート反映
 *
 * ■ 点数計算はここではやらない
 * 計算は core/battleCore.ts（純関数）。
 * 通信・時間・React の都合をここに閉じ込め、
 * 「点数の決まり方」はテストしやすい純関数側に置く。
 *
 * -------------------------------------------------------------------
 * ■ 残り時間を「書き込まない」設計
 * -------------------------------------------------------------------
 * 残り秒数を Firestore に書くと、1問10秒×10問で
 * 1試合100回の書き込みになる（無料枠2万書き込み/日 → 200試合で枯渇）。
 * ★締切時刻を1回だけ書き、各端末が自分の時計で引き算する。★
 * 書き込みは1問1回（進行時）に収まり、1試合35回程度で済む。
 *
 * -------------------------------------------------------------------
 * ■ 「両者が進める」ようにしている理由
 * -------------------------------------------------------------------
 * 部屋主だけが進行役だと、部屋主の電波が切れた瞬間に試合が凍る。
 * 両者が同じ条件（次の番号）で進めれば、
 * どちらか生きている方が進めてくれる。
 * 同時に呼んでも同じ値を書くだけなので競合しても問題ない。
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { auth } from '../../firebase';
import {
  abortRoom,
  advanceQuestion,
  attestResult,
  saveHistory,
  startBattle,
  submitAnswer,
  watchRoom,
} from '../data/battle';
import { loadPool } from '../data/battlePool';
import { applyRatingResult } from '../data/battleRanking';
import {
  FORFEIT_STREAK,
  hasLeft,
  judgeBattle,
  NO_ANSWER,
  resolveTimeLimit,
  scoreBattlePlayer,
  trailingNoAnswerCount,
} from '../core/battleCore';
import { normalizeRule } from '../core/battleRules';
import { cycleKanaKey } from '../core/kanaKeyboard';
import { isClockSkewed, serverNow, toMillis } from '../core/serverClock';
import {
  canSubmitAnswer,
  didSuspend,
  offlineNotice,
  resumeNotice,
  type ConnectionState,
} from '../core/connection';
import type {
  BattleAnswerRecord,
  BattleAnswerSheet,
  BattlePlayerScore,
  BattleQuestion,
  BattleResultSummary,
  BattleRoom,
} from '../core/types';
import { answerIndexOf, answerKeyOf } from '../core/types';

/** 画面が使う対戦の状態 */
export interface BattleRoomState {
  loading: boolean;
  error: string | null;
  room: BattleRoom | null;
  /** 出題（部屋の questionIds を本体に戻したもの） */
  questions: BattleQuestion[];
  /** いま出ている問題 */
  current: BattleQuestion | null;
  /** 残りミリ秒（0で締切） */
  remainMs: number;
  /** 自分がこの問題に答えたか */
  answered: boolean;
  /** 相手が答えたか（「相手は解答済み」の表示に使う） */
  opponentAnswered: boolean;
  /** 自分が選んだ選択肢（表示のため） */
  myChoice: number;
  /** 自分が押したパネルの順 */
  myPanel: number[];
  /** 結果（試合終了後のみ） */
  result: BattleResultSummary | null;
  myScore: BattlePlayerScore | null;
  opponentScore: BattlePlayerScore | null;
  /** レートの変化（反映後のみ） */
  rating: { before: number; after: number } | null;
  /** 相手の離脱による決着か */
  byForfeit: boolean;
  /** 相手の表示名・アイコン */
  opponent: { uid: string; nickname: string; photoURL: string; rating: number } | null;
  /** 試合が終わったか */
  finished: boolean;
  /**
   * 端末の時計が大きくずれているか。
   * ずれていても対戦は成立する（サーバ時刻に寄せて計算している）が、
   * 端末側の設定を直してもらうために画面で伝える。
   */
  clockSkewed: boolean;
  /**
   * 通信の状態。
   * ★圏外でも購読は続く★ので、これがないと切れたことに気付けない。
   */
  connection: ConnectionState;
  /** 圏外の知らせ（出す必要がないときは null） */
  offlineMessage: string | null;
  /** 画面を離れて戻ってきたときの知らせ（同） */
  resumeMessage: string | null;
  /** 解答を送れる状態か（選択肢を押せるかの判断に使う） */
  submittable: boolean;
}

export interface BattleRoomActions {
  /** 選択肢を押す（4択・2〜3択・5〜6択） */
  choose: (index: number) => void;
  /** パネル／五十音キーボードのキーを押す */
  pushPanel: (index: number) => void;
  /** 1つ戻す */
  popPanel: () => void;
  /**
   * かな入力: 最後の1文字を「゛゜小」で切り替える。
   * カ→ガ→カ のように一周して戻るので、押しすぎても詰まらない。
   */
  cyclePanel: () => void;
  /**
   * かな入力: 「けってい」で解答を送る。
   *
   * ★文字パネルには対応する操作が無い★
   * 文字パネルは札が揃った瞬間に自動で送っている（1タップぶん速い）。
   * かな入力は最後の文字に濁点を付ける余地があるので、
   * 自動で送ると「ダイヤモント」で確定してしまう。だから明示的に送る。
   */
  commitKana: () => void;
  /** 部屋主が対戦を開始する */
  start: () => void;
  /** 部屋を離脱する */
  leave: () => void;
  /** 復帰の知らせを消す */
  dismissResumeMessage: () => void;
}

/** 締切をまたいだ判定に使う猶予（ms）。表示と受付のズレを吸収する */
const DEADLINE_GRACE_MS = 250;

export function useBattleRoom(roomId: string | null): BattleRoomState & BattleRoomActions {
  const uid = auth.currentUser?.uid || '';

  const [room, setRoom] = useState<BattleRoom | null>(null);
  const [pool, setPool] = useState<readonly BattleQuestion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // ★Date.now() ではなく serverNow()（推定サーバ時刻）を使う★
  //
  // 残り時間は「締切 − 現在時刻」で出すが、
  // 締切（deadlineAt）はサーバ側の時間軸であり、
  // 受付の可否もルールが request.time（サーバ時刻）で決める。
  // ここで端末時刻を混ぜると、時計が遅れている端末で
  // 「残り3秒」と見えているのにサーバでは締切後となり、
  // ★答えたのに解答が消える★。
  const [now, setNow] = useState(() => serverNow());
  const [panel, setPanel] = useState<number[]>([]);
  const [rating, setRating] = useState<{ before: number; after: number } | null>(null);

  /**
   * 通信の状態。
   * 既定を 'online' にしているのは、購読が始まる前の一瞬に
   * 「通信が切れています」と出すと誤解を招くため。
   */
  const [connection, setConnection] = useState<ConnectionState>('online');

  /** 画面を離れて戻ってきたときに出す知らせ */
  const [resumeMessage, setResumeMessage] = useState<string | null>(null);

  /** 二重実行を防ぐための記録（進行・申告・レート反映） */
  const advancedRef = useRef<number>(-1);
  const attestedRef = useRef(false);
  const ratedRef = useRef(false);

  // ------------------------------------------------------------
  // 部屋の購読
  // ------------------------------------------------------------
  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const stop = watchRoom(
      roomId,
      (next) => {
        setLoading(false);
        if (!next) {
          setError('この対戦はすでに終了しています。');
          setRoom(null);
          return;
        }
        setRoom(next);
      },
      (e) => {
        setLoading(false);
        setError(e.message);
      },
      // 通信の状態を受け取る（圏外でも購読は続くので、これが無いと気付けない）
      setConnection,
    );
    return stop;
  }, [roomId]);

  // ------------------------------------------------------------
  // 教科のプールを読み込む（★選ばれた1教科だけ★）
  // ------------------------------------------------------------
  const subject = room?.subject;
  useEffect(() => {
    if (!subject) return;
    let alive = true;
    loadPool(subject)
      .then((list) => {
        if (alive) setPool(list);
      })
      .catch(() => {
        if (alive) setError('問題の読み込みに失敗しました。通信環境をご確認ください。');
      });
    return () => {
      alive = false;
    };
  }, [subject]);

  // ------------------------------------------------------------
  // 時計を進める（残り時間の表示用）
  // ------------------------------------------------------------
  const status = room?.status;

  /**
   * 端末が休止していたことを検知するための記録。
   *
   * ★タイマーの飛びで判定する理由★
   * visibilitychange だけでは足りない。機種やブラウザによって
   * 画面消灯・別アプリへの移動で発火しない場合があるうえ、
   * 「どれだけの間離れていたか」が分からない。
   * タイマーが実際に何ミリ秒飛んだかを見れば、
   * どんな理由で止まっていても確実に分かる。
   */
  const lastTickRef = useRef<number>(Date.now());
  /** 休止に入る直前の状況（復帰時に何が変わったかを比べるため） */
  const beforeSuspendRef = useRef<{ index: number } | null>(null);
  /** 復帰の検知フラグ（実際の知らせは下の useEffect が作る） */
  const [suspendedAt, setSuspendedAt] = useState<number>(0);

  useEffect(() => {
    if (status !== 'playing') return;
    lastTickRef.current = Date.now();

    // 200ms 間隔。★1秒間隔にしない理由★
    // 締切直前の「残り0.4秒」が表示に出ず、
    // 押せたのに間に合わなかったように見えてしまう。
    const timer = window.setInterval(() => {
      const localNow = Date.now();
      // ★端末が休止していたかを、タイマーの飛びで見る★
      // 画面消灯・別アプリへの移動・端末の省電力で割り込みは止まる。
      // 止まっていた間に問題が進んだり試合が終わっていることがあるので、
      // 復帰したことを記録して、あとで利用者に伝える。
      if (didSuspend(lastTickRef.current, localNow)) {
        setSuspendedAt(localNow);
      }
      lastTickRef.current = localNow;
      setNow(serverNow());
    }, 200);
    return () => window.clearInterval(timer);
  }, [status]);

  /**
   * 画面が見えなくなった瞬間を捉える。
   *
   * ★タイマーの飛びだけに頼らない理由★
   * 離れる「前」の状況（何問目だったか）を覚えておかないと、
   * 復帰時に「問題が進んだ」ことを判定できない。
   * visibilitychange は離れる瞬間に発火するので、そこで控えておく。
   * 発火しない機種のために、タイマーの飛びによる検知も併用している
   * （どちらか片方でも動けば知らせが出る）。
   */
  const currentIndexForSuspend = room?.currentIndex ?? 0;
  useEffect(() => {
    if (status !== 'playing') return;

    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        beforeSuspendRef.current = { index: currentIndexForSuspend };
        // タイマーが止まる直前の時刻を入れておく。
        // これが無いと、復帰時の飛びが「離れていた時間」にならない。
        lastTickRef.current = Date.now();
      }
    };
    document.addEventListener('visibilitychange', onHide);
    return () => document.removeEventListener('visibilitychange', onHide);
  }, [status, currentIndexForSuspend]);

  // ------------------------------------------------------------
  // 部屋の中身を扱いやすい形に直す
  // ------------------------------------------------------------
  const rawRules = room?.rules;
  const rules = useMemo(
    () => normalizeRule(subject || '', rawRules),
    [subject, rawRules],
  );

  const questionIds = room?.questionIds;
  const questions = useMemo(() => {
    if (!questionIds || pool.length === 0) return [];
    const byId = new Map(pool.map((q) => [q.id, q]));
    return questionIds
      .map((id) => byId.get(id))
      .filter((q): q is BattleQuestion => Boolean(q));
  }, [questionIds, pool]);

  const currentIndex = room?.currentIndex ?? 0;
  const current = questions[currentIndex] || null;

  const players = room?.players;
  const opponentUid = useMemo(
    () => (players || []).find((p) => p !== uid) || '',
    [players, uid],
  );

  const profiles = room?.profiles;
  const opponent = useMemo(() => {
    if (!opponentUid) return null;
    const p = profiles?.[opponentUid];
    return p
      ? { uid: opponentUid, nickname: p.nickname, photoURL: p.photoURL, rating: p.rating }
      : { uid: opponentUid, nickname: '対戦相手', photoURL: '', rating: 1500 };
  }, [profiles, opponentUid]);

  // ★回答は「q0, q1 …」をキーにしたマップ★
  //   配列ではない理由は types.ts の BattleAnswerSheet を参照。
  //   （配列だと serverTimestamp() が使えず、そもそも回答できない）
  const answersMap = room?.answers;
  const mySheet = useMemo<BattleAnswerSheet>(
    () => (answersMap?.[uid] as BattleAnswerSheet) || {},
    [answersMap, uid],
  );
  const opponentSheet = useMemo<BattleAnswerSheet>(
    () => (answersMap?.[opponentUid] as BattleAnswerSheet) || {},
    [answersMap, opponentUid],
  );

  const myRecord = mySheet[answerKeyOf(currentIndex)] || null;
  const answered = Boolean(myRecord);
  const opponentAnswered = Boolean(opponentSheet[answerKeyOf(currentIndex)]);

  // ------------------------------------------------------------
  // 残り時間
  // ------------------------------------------------------------
  const rawDeadline = room?.deadlineAt;
  const deadlineMs = useMemo(() => toMillis(rawDeadline) ?? 0, [rawDeadline]);

  const remainMs = deadlineMs > 0 ? Math.max(0, deadlineMs - now) : 0;

  /**
   * 端末の時計が実害の出るほどずれているか。
   *
   * ★黙って補正するだけにしない理由★
   * serverNow() で補正しているので対戦は成立するが、
   * 補正は推定なので完墧ではない。
   * また端末の時計がずれていると、このアプリ以外（学習記録など）でも
   * 日付がごろごろになる。利用者に一度は伝えた方がよい。
   */
  const clockSkewed = status === 'playing' && isClockSkewed();

  // 問題が変わったらパネルの入力を捨てる
  useEffect(() => {
    setPanel([]);
  }, [currentIndex]);

  // ------------------------------------------------------------
  // 各問題の開始時刻を覚える（速度点の計算に使う）
  // ------------------------------------------------------------
  /**
   * ★問題ごとの開始時刻を端末側で記録する理由★
   * 速度点は「締切までの残り時間」で決まる。
   * 部屋には現在の問題の締切しか入っていないので、
   * 過去の問題の開始時刻はここで覚えておく必要がある。
   * Firestore に問題ごとの開始時刻を書くと書き込みが倍になるので置かない。
   *
   * 記録できていない問題は速度点0で計算する（推測しない）。
   * 途中参加・再読み込みの端末で点が水増しされるのを防ぐため。
   */
  const startsRef = useRef(new Map<number, number>());
  useEffect(() => {
    if (deadlineMs <= 0 || !current) return;
    if (startsRef.current.has(currentIndex)) return;
    startsRef.current.set(currentIndex, deadlineMs - resolveTimeLimit(current, rules) * 1000);
  }, [deadlineMs, current, currentIndex, rules]);

  // ------------------------------------------------------------
  // 自動進行
  // ------------------------------------------------------------
  useEffect(() => {
    if (!roomId || status !== 'playing' || !current) return;
    if (questions.length === 0) return;

    const bothAnswered = answered && opponentAnswered;
    const timeUp = deadlineMs > 0 && now >= deadlineMs + DEADLINE_GRACE_MS;
    if (!bothAnswered && !timeUp) return;

    // 最終問題なら進めない（結果の申告は別の useEffect が行う）
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) return;

    // 同じ番号で何度も進めないようにする
    if (advancedRef.current >= currentIndex) return;
    advancedRef.current = currentIndex;

    void advanceQuestion(roomId, nextIndex, resolveTimeLimit(questions[nextIndex], rules));
  }, [
    roomId,
    status,
    current,
    questions,
    answered,
    opponentAnswered,
    now,
    deadlineMs,
    currentIndex,
    rules,
  ]);

  // ------------------------------------------------------------
  // 終了判定と点数の計算
  // ------------------------------------------------------------
  const lastQuestionDone =
    questions.length > 0 &&
    currentIndex >= questions.length - 1 &&
    ((answered && opponentAnswered) ||
      (deadlineMs > 0 && now >= deadlineMs + DEADLINE_GRACE_MS));

  const finished = status === 'finished' || (status === 'playing' && lastQuestionDone);

  /**
   * 復帰したときの知らせを作る。
   *
   * ★黙って進めない理由★
   * 画面を離れている間に問題が進んだり試合が終わったりするのは正しい挙動だが、
   * 何も言わないと利用者には
   *   「勝手に進んだ」「答えたのに点が入っていない」
   * と見える。実際に何が起きたのかをそのまま伝える。
   */
  useEffect(() => {
    if (suspendedAt === 0) return;

    const before = beforeSuspendRef.current;
    const message = resumeNotice({
      suspended: true,
      // 離れる前の問題番号を控えられていた場合だけ比較する。
      // 控えが無い（visibilitychange が発火しなかった）場合は
      // 「進んだかどうか」を偽らずに false として扱う。
      indexChanged: before != null && before.index !== currentIndex,
      finished,
    });

    beforeSuspendRef.current = null;
    setSuspendedAt(0);
    setResumeMessage(message);
  }, [suspendedAt, currentIndex, finished]);

  /** 復帰の知らせを消す（画面側から呼ぶ） */
  const dismissResumeMessage = useCallback(() => setResumeMessage(null), []);

  const scores = useMemo(() => {
    if (questions.length === 0) return null;
    const starts = startsRef.current;
    return {
      me: scoreBattlePlayer(uid, questions, mySheet, rules, starts),
      other: scoreBattlePlayer(opponentUid, questions, opponentSheet, rules, starts),
    };
  }, [questions, uid, opponentUid, mySheet, opponentSheet, rules]);

  /**
   * 相手の離脱（不戦勝）の判定。
   *
   * ★2つの経路を区別する★
   *
   *   ① 明示的な離脱（相手が「もどる」を押した）
   *      abortRoom() が left.{uid} を書き込むので確実に分かる。
   *      待つ意味がないので即座に決着させる。
   *
   *   ② 推測（無回答が続いている）
   *      電源が切れた・圏外・強制終了では何も書き込めないので、
   *      無回答が続くことからの推測しかできない。
   *      ★ここを短くしすぎてはいけない★。
   *      トンネルや地下で30〜60秒圏外になるのは日常的に起き、
   *      1問10〜20秒なら数問は簡単に飛ぶ。
   *      短いと「席を立った人」ではなく「トンネルに入った人」を
   *      不戦敗にしてレートを削ることになる。
   *
   * 自分が圏外のときは判定しない。自分に相手の書き込みが届いていないだけで、
   * 相手は普通に答えている可能性がある。
   * ★自分の電波が悪いことを相手の離脱と取り違えてはいけない★。
   */
  const leftMap = room?.left;
  const byForfeit = useMemo(() => {
    if (status !== 'playing') return false;

    // ① 明示的な離脱は即座に成立
    if (hasLeft(leftMap, opponentUid)) return true;

    // ★自分が圏外なら推測しない★
    // 端末内の控えを見ているだけなので、相手の回答が届いていないだけの
    // 可能性が高い。ここで不戦勝にすると、電波の悪い側が
    // 「相手が逃げた」と誤解したまま試合が終わる。
    if (connection === 'offline') return false;

    // ② 無回答の連続からの推測
    // キー名（q0, q1 …）から問題番号を取り出す。
    // 壊れたキーは answerIndexOf が null を返すので捨てる。
    const answeredIndexes = Object.keys(opponentSheet)
      .map((k) => answerIndexOf(k))
      .filter((n): n is number => n != null);
    const trailing = trailingNoAnswerCount(answeredIndexes, currentIndex);
    return trailing >= FORFEIT_STREAK;
  }, [status, leftMap, opponentUid, connection, opponentSheet, currentIndex]);

  const result = useMemo(() => {
    if (!scores || !finished) return null;
    return judgeBattle(scores.me, scores.other, rules);
  }, [scores, finished, rules]);

  // ------------------------------------------------------------
  // 結果の申告
  // ------------------------------------------------------------
  useEffect(() => {
    if (!roomId || !result || !scores || attestedRef.current) return;
    attestedRef.current = true;
    void attestResult(roomId, {
      myScore: scores.me.score,
      opponentScore: scores.other.score,
      outcome: result.outcome,
    });
  }, [roomId, result, scores]);

  // ------------------------------------------------------------
  // レート反映（★相互確認が揃ってから★）
  // ------------------------------------------------------------
  const attest = room?.attest;
  useEffect(() => {
    if (!roomId || !result || !scores || !subject || ratedRef.current) return;

    const mine = attest?.[uid];
    const theirs = opponentUid ? attest?.[opponentUid] : undefined;

    // 相手が離脱した場合は相手の申告が来ないので、
    // 不戦勝として（変化量を半分にして）反映する。
    const forfeit = byForfeit && !theirs;
    if (!mine) return;
    if (!theirs && !forfeit) return;

    // 申告が食い違ったら無効試合（レートを動かさない）
    if (theirs) {
      const agreed =
        (mine.outcome === 'win' && theirs.outcome === 'lose') ||
        (mine.outcome === 'lose' && theirs.outcome === 'win') ||
        (mine.outcome === 'draw' && theirs.outcome === 'draw');
      if (!agreed) {
        ratedRef.current = true;
        return;
      }
    }

    ratedRef.current = true;
    const opponentRating = opponent?.rating ?? 1500;

    void applyRatingResult(roomId, opponentRating, result.outcome, forfeit).then((change) => {
      if (change) setRating(change);
      void saveHistory({
        roomId,
        subject,
        outcome: result.outcome,
        myScore: scores.me.score,
        opponentScore: scores.other.score,
        opponentNickname: opponent?.nickname || '対戦相手',
        ratingBefore: change?.before ?? 0,
        ratingAfter: change?.after ?? 0,
      });
    });
  }, [roomId, result, scores, subject, attest, uid, opponentUid, opponent, byForfeit]);

  // ------------------------------------------------------------
  // 操作
  // ------------------------------------------------------------
  /**
   * 解答を送れる状態か。
   *
   * ★圏外を弾く理由★
   * Firestore は圏外でも書き込みを端末に溜め、購読は即座に
   * 「反映済みのように見える」通知を返す。画面は解答済みになる。
   * ところが通信が戻って実際に送られるときには締切を過ぎているので
   * ルールが拒否し、★答えたはずの解答が黙って消える★。
   * それなら最初から「電波が戻るまで解答できません」と伝えた方が良い。
   */
  const submittable = canSubmitAnswer({ connection, remainMs, answered });

  const choose = useCallback(
    (index: number) => {
      if (!roomId || !current || !submittable) return;
      void submitAnswer(roomId, currentIndex, { choice: index, panel: [] }, answered).catch(
        (e: Error) => setError(e.message),
      );
    },
    [roomId, current, submittable, answered, currentIndex],
  );

  /**
   * パネルの解答を送る。
   *
   * ★「決定」ボタンを押させない理由★
   * 制限時間が短いので、1タップの差がそのまま点数差になる。
   * 必要な文字数を並べ終えた時点が解答意思の表明とみなせるので、
   * 揃った瞬間に送る（押した順は panel が保持している）。
   */
  const commitPanel = useCallback(
    (order: number[]) => {
      if (!roomId || !current || !submittable) return;
      if (order.length !== current.panelOrder.length) return;
      void submitAnswer(roomId, currentIndex, { choice: NO_ANSWER, panel: order }, answered).catch(
        (e: Error) => setError(e.message),
      );
    },
    [roomId, current, submittable, answered, currentIndex],
  );

  const pushPanel = useCallback(
    (index: number) => {
      // ★圏外ではパネルも押せないようにする★
      // 押せてしまうと、揃った瞬間に自動で送信を試みて
      // 「答えたのに消えた」が起きる。入力の段階で止める。
      if (!current || !submittable) return;
      const need = current.panelOrder.length;
      const isKana = current.format === 'kana';
      setPanel((prev) => {
        /**
         * ★同じキーを2回押せるかどうかは形式で変わる★
         *
         * 文字パネル（panel）は「画面に並んだ札を取る」形なので、
         * 一度取った札をもう一度取ることはできない。
         *
         * 五十音キーボード（kana）は札ではなくキーなので、
         * 同じキーを何度でも押せる必要がある。ここを塞ぐと
         * 「バリウム」「アルミニウム」のように同じ文字を2回使う語が
         * ★入力しようとしても入らない★ という不具合になる。
         */
        if (!isKana && prev.includes(index)) return prev;
        if (prev.length >= need) return prev;
        const next = [...prev, index];
        /**
         * ★かな入力では「揃った瞬間の自動送信」をしない★
         *
         * かな入力の最後の1文字が「゛゜小」で作る文字であることがある
         * （実測9語：ダイヤモン「ド」／ステッ「プ」／アミラー「ゼ」など）。
         * 自動で送ってしまうと、濁点を付ける前の「ダイヤモント」で
         * 確定してしまい、正しく覚えている人が誤答になる。
         * そこで、かな入力だけは利用者が「けってい」を押すまで待つ。
         *
         * 文字パネルは札を取るだけで後から変化しないので、
         * 今まで通り揃った瞬間に送る（1タップぶん速い）。
         */
        if (!isKana && next.length === need) commitPanel(next);
        return next;
      });
    },
    [current, submittable, commitPanel],
  );

  /**
   * かな入力の最後の1文字を「゛゜小」で切り替える。
   *
   * ★最後の1文字だけを対象にしている理由★
   * 途中の文字を選んで直せるようにすると、どの文字を選んでいるかを
   * 示す仕組みが必要になり、短い制限時間の中で操作が増える。
   * 「押した直後に切り替える」形なら、キーボードの流れが途切れない。
   */
  const cyclePanel = useCallback(() => {
    if (!current || current.format !== 'kana' || !submittable) return;
    setPanel((prev) => {
      if (prev.length === 0) return prev;
      const last = prev[prev.length - 1];
      if (last === undefined) return prev;
      const next = cycleKanaKey(last);
      if (next === last) return prev;
      return [...prev.slice(0, -1), next];
    });
  }, [current, submittable]);

  /** かな入力の「けってい」（文字パネルは自動確定なので使わない） */
  const commitKana = useCallback(() => {
    if (!current || current.format !== 'kana') return;
    commitPanel(panel);
  }, [current, commitPanel, panel]);

  const popPanel = useCallback(() => {
    if (answered) return;
    setPanel((prev) => prev.slice(0, -1));
  }, [answered]);

  const start = useCallback(() => {
    if (!roomId || questions.length === 0) return;
    void startBattle(roomId, resolveTimeLimit(questions[0], rules)).catch((e: Error) =>
      setError(e.message),
    );
  }, [roomId, questions, rules]);

  const leave = useCallback(() => {
    if (!roomId) return;
    void abortRoom(roomId);
  }, [roomId]);

  return {
    loading,
    error,
    room,
    questions,
    current,
    remainMs,
    answered,
    opponentAnswered,
    myChoice: myRecord?.choice ?? NO_ANSWER,
    myPanel: myRecord ? myRecord.panel || [] : panel,
    result,
    myScore: scores?.me || null,
    opponentScore: scores?.other || null,
    rating,
    byForfeit,
    opponent,
    finished,
    clockSkewed,
    connection,
    offlineMessage: offlineNotice({ connection, playing: status === 'playing' }),
    resumeMessage,
    submittable,
    choose,
    pushPanel,
    popPanel,
    cyclePanel,
    commitKana,
    start,
    leave,
    dismissResumeMessage,
  };
}
