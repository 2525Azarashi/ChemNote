/**
 * ===================================================================
 * BattleRoomScreen — 1つの部屋の全体（待機 → 対戦 → 結果）
 * ===================================================================
 *
 * ★3つの状態を1つの画面部品で扱う理由★
 * 待機・対戦・結果を別画面として上位で切り替えると、
 * 切り替えのたびに useBattleRoom が作り直され、
 * onSnapshot の購読が張り直される（＝読み取り回数が増える）。
 * さらに startsRef（問題ごとの開始時刻）が消えて速度点が0になってしまう。
 * 購読とタイマーを1か所に閉じ込め、中身だけを差し替える。
 *
 * ★正解を見せるタイミング★
 * 「両者が答えた」または「締切が来た」ときだけ reveal=true にする。
 * 自分が答えた直後に正解が見えると、画面を見せ合える環境で不正ができる。
 */

import { useEffect, useMemo, useState } from 'react';
import { LogOut } from 'lucide-react';
import { auth } from '../../firebase';
import { useBattleRoom } from '../hooks/useBattleRoom';
import { BattleLobby } from './BattleLobby';
import { BattleQuestionView } from './BattleQuestionView';
import { BattleResult } from './BattleResult';
import {
  BattleButton,
  BattleLoading,
  BattleNotice,
  BattleShell,
  BattleTitle,
  GOLD,
  INK,
  LINE,
  PlayerBadge,
} from './BattleParts';

/** 結果画面に切り替わるまでの間（最後の1問の正解を見る時間） */
const REVEAL_HOLD_MS = 1800;

/** 復帰の知らせを出しておく長さ（読める長さで、かつ邪魔にならない長さ） */
const RESUME_NOTICE_HOLD_MS = 4000;

export function BattleRoomScreen({
  roomId,
  onExit,
  onRematch,
  onPractice,
}: {
  roomId: string;
  /** 対戦メニューに戻る。message があれば入口に伝える */
  onExit: (message?: string) => void;
  /** 同じ設定でもう1回（フレンド戦のみ渡す） */
  onRematch?: (subject: string) => void;
  /** ★リザルトの「この単元を演習する」（請求⑦-A）★ そのまま下に渡すだけ */
  onPractice?: (subject: string, chapterId: string) => void;
}) {
  const uid = auth.currentUser?.uid || '';
  const {
    loading,
    error,
    room,
    questions,
    current,
    remainMs,
    answered,
    opponentAnswered,
    myChoice,
    myPanel,
    result,
    myScore,
    opponentScore,
    rating,
    byForfeit,
    opponent,
    finished,
    clockSkewed,
    offlineMessage,
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
  } = useBattleRoom(roomId);

  /**
   * 復帰の知らせを自動で消す。
   *
   * ★手動で消すボタンを置かない理由★
   * 制限時間が短いので、知らせを消すために1タップ使わせると
   * その分だけ解答が遅れて不利になる。読む時間を置いて自動で消す。
   */
  useEffect(() => {
    if (!resumeMessage) return;
    const timer = window.setTimeout(dismissResumeMessage, RESUME_NOTICE_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [resumeMessage, dismissResumeMessage]);

  /**
   * ★最後の1問の答え合わせを見せてから結果に移る★
   * finished になった瞬間に結果画面へ飛ばすと、
   * 最後の問題の正解が一瞬も表示されない。
   */
  const [showResult, setShowResult] = useState(false);
  useEffect(() => {
    if (!finished) return;
    const timer = window.setTimeout(() => setShowResult(true), REVEAL_HOLD_MS);
    return () => window.clearTimeout(timer);
  }, [finished]);

  const reveal = useMemo(
    () => (answered && opponentAnswered) || remainMs <= 0,
    [answered, opponentAnswered, remainMs],
  );

  const backButton = (
    <BattleButton variant="ghost" onClick={() => onExit()} icon={<LogOut size={18} />}>
      対戦メニューにもどる
    </BattleButton>
  );

  // ------------------------------------------------------------
  // 読み込み中
  // ------------------------------------------------------------
  if (loading) {
    return (
      <BattleShell>
        <BattleTitle />
        <BattleLoading message="部屋にはいっています…" />
      </BattleShell>
    );
  }

  // ------------------------------------------------------------
  // 部屋が無い／読めない
  // ------------------------------------------------------------
  if (!room) {
    return (
      <BattleShell footer={backButton}>
        <BattleTitle />
        <div className="flex flex-1 items-center justify-center py-16">
          <BattleNotice message={error || 'この部屋はもうありません。'} />
        </div>
      </BattleShell>
    );
  }

  // ------------------------------------------------------------
  // 中断された
  // ------------------------------------------------------------
  if (room.status === 'aborted') {
    return (
      <BattleShell footer={backButton}>
        <BattleTitle />
        <div className="flex flex-1 items-center justify-center py-16">
          <BattleNotice message="この対戦は中断されました。" />
        </div>
      </BattleShell>
    );
  }

  const me = room.profiles[uid];

  // ------------------------------------------------------------
  // 結果
  // ------------------------------------------------------------
  if (showResult && result) {
    return (
      <BattleResult
        result={result}
        questions={questions}
        subject={room.subject}
        opponent={opponent}
        meNickname={me?.nickname || 'あなた'}
        mePhotoURL={me?.photoURL}
        rating={rating}
        byForfeit={byForfeit}
        maskOpponent={!room.joinCode}
        onRematch={onRematch && room.joinCode ? () => onRematch(room.subject) : undefined}
        onExit={() => onExit()}
        onPractice={onPractice}
      />
    );
  }

  // ------------------------------------------------------------
  // 待機
  // ------------------------------------------------------------
  if (room.status === 'waiting') {
    return (
      <BattleLobby
        room={room}
        myUid={uid}
        onStart={start}
        onLeave={() => {
          leave();
          onExit();
        }}
      />
    );
  }

  // ------------------------------------------------------------
  // 対戦中
  // ------------------------------------------------------------
  if (!current) {
    return (
      <BattleShell>
        <BattleTitle />
        <BattleLoading message="問題を読みこんでいます…" />
      </BattleShell>
    );
  }

  return (
    <BattleShell>
      {/* 得点表（常に見える位置に固定） */}
      <section
        id="battle-scoreboard"
        className="mb-3 flex items-center gap-2 rounded-2xl border-2 px-3 py-2"
        style={{ borderColor: LINE, background: '#FFFFFF' }}
      >
        <PlayerBadge
          nickname={me?.nickname || 'あなた'}
          photoURL={me?.photoURL}
          rating={me?.rating ?? 1500}
          isMe
          answered={answered}
          score={myScore?.score ?? 0}
        />
        {/* ★VS を金地にしている★ ライト地では金の文字は読めないので、面に使う */}
        <span
          className="battle-vs-pulse shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-black"
          style={{ background: GOLD, color: INK }}
        >
          VS
        </span>
        <PlayerBadge
          nickname={opponent?.nickname || '対戦相手'}
          photoURL={opponent?.photoURL}
          rating={opponent?.rating ?? 1500}
          mask={!room.joinCode}
          answered={opponentAnswered}
          score={opponentScore?.score ?? 0}
          align="right"
        />
      </section>

      {/*
        ★知らせは一度に一つだけ出す★
        並べて出すと問題そのものが画面から押し出されてしまう。
        「いま利用者の行動が変わるか」の順に並べ、上から最初の一つを出す。
          ① 圏外       … 押しても解答が残らないので最優先で伝える
          ② 復帰       … 離れていた間に何が起きたか
          ③ 時計のずれ … 対戦は成立しているので後回しでよい
          ④ 不戦勝の予告
      */}
      {offlineMessage ? (
        <div className="mb-2">
          <BattleNotice message={offlineMessage} />
        </div>
      ) : resumeMessage ? (
        <div className="mb-2">
          <BattleNotice message={resumeMessage} tone="info" />
        </div>
      ) : clockSkewed ? (
        <div className="mb-2">
          <BattleNotice
            message="この端末の時計が実際の時刻とずれています。対戦は正しく進みますが、端末の「日付と時刻」を自動設定にしてください。"
            tone="info"
          />
        </div>
      ) : byForfeit ? (
        <div className="mb-2">
          <BattleNotice message="相手の応答がありません。まもなく不戦勝になります。" />
        </div>
      ) : null}

      <BattleQuestionView
        question={current}
        index={room.currentIndex}
        total={questions.length}
        remainMs={remainMs}
        answered={answered}
        // ★押しても解答が残らない状態（圏外）を画面にも伝える★
        //   answered ではないのに押せない、という状態が実際にある。
        locked={!submittable && !answered}
        myChoice={myChoice}
        myPanel={myPanel}
        reveal={reveal}
        onChoose={choose}
        onPushPanel={pushPanel}
        onPopPanel={popPanel}
        onCyclePanel={cyclePanel}
        onCommitKana={commitKana}
      />

      {error && (
        <div className="mt-2">
          <BattleNotice message={error} />
        </div>
      )}
    </BattleShell>
  );
}
