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
import { LogOut, X } from 'lucide-react';
import { auth } from '../../firebase';
import { useBattleRoom } from '../hooks/useBattleRoom';
import { normalizeRule } from '../core/battleRules';
import { ArenaFighters } from './ArenaFighters';
import { BattleLobby } from './BattleLobby';
import { BattleLiveStage } from './BattleLiveStage';
import { BattleResult } from './BattleResult';
import {
  BattleButton,
  BattleLoading,
  BattleNotice,
  BattleShell,
  BattleTitle,
  INK,
  LINE,
} from './BattleParts';

/** 結果画面に切り替わるまでの間（最後の1問の正解を見る時間） */
const REVEAL_HOLD_MS = 3500;

/** 復帰の知らせを出しておく長さ（読める長さで、かつ邪魔にならない長さ） */
const RESUME_NOTICE_HOLD_MS = 4000;

export function BattleRoomScreen({
  roomId,
  onExit,
  onRematch,
  onPractice,
  onOpenProfile, onOpenMissions, onActiveChange,
  onReview,
}: {
  roomId: string;
  /** 対戦メニューに戻る。message があれば入口に伝える */
  onExit: (message?: string) => void;
  /** 同じ設定でもう1回（フレンド戦のみ渡す） */
  onRematch?: (subject: string) => void;
  /** ★リザルトの「この単元を演習する」（請求⑦-A）★ そのまま下に渡すだけ */
  onPractice?: (subject: string, chapterId: string, problemId?: string, subQuestionId?: string) => void;
  onActiveChange?: (active: boolean) => void;
  onOpenProfile?: () => void;
  onOpenMissions?: () => void;
  /** ★リザルトの「復習する」（間違えた問題を復習リストに入れて学習ノートへ）★ */
  onReview?: () => void;
}) {
  const uid = auth.currentUser?.uid || '';
  const {
    loading,
    error,
    room,
    questions,
    current,
    remainMs,
    limitSec,
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
    preStartMs,
    myAnsweredIndexes,
    choose,
    pushPanel,
    popPanel,
    cyclePanel,
    commitKana,
    start,
    leave,
    dismissResumeMessage,
  } = useBattleRoom(roomId);

  useEffect(() => {
    onActiveChange?.(room?.status === 'waiting' || (room?.status === 'playing' && !finished));
    return () => onActiveChange?.(false);
  }, [room?.status, finished, onActiveChange]);

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
  /** 試合中の「やめる」の確認表示 */
  const [confirmQuit, setConfirmQuit] = useState(false);
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
        /* フレンド戦の再戦は「同じ科目で新しい部屋を作って招待し直す」動き。文言もそれに合わせる。 */
        rematchLabel="同じ科目で新しい部屋を作る"
        onExit={() => onExit()}
        onPractice={onPractice}
        growthMatchId={`online:${roomId}`}
        growthOwnerUid={uid}
        growthEligible={room.status === 'finished' && !!rating && !byForfeit}
        onOpenProfile={onOpenProfile}
        onOpenMissions={onOpenMissions}
        onReview={onReview}
        myAnsweredIndexes={myAnsweredIndexes}
        matchKey={roomId}
      />
    );
  }

  // ------------------------------------------------------------
  // 待機
  // ------------------------------------------------------------
  if (room.status === 'waiting') {
    if (!room.joinCode) return <BattleShell className="arena-matching"><BattleTitle subtitle="全国対戦・開始準備"/><ArenaFighters/><p className="text-center font-bold">2人がそろいました。まもなくスタート</p>{error && <BattleNotice message={error}/>}{error && <BattleButton onClick={start}>開始を再試行</BattleButton>}<BattleButton variant="ghost" onClick={()=>{leave();onExit();}}>対戦を終了する</BattleButton></BattleShell>;
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

  /**
   * ★知らせは一度に一つだけ出す★（従来どおり）
   *   ① 圏外 ② 復帰 ③ 時計のずれ ④ 不戦勝の予告
   */
  const notices = offlineMessage ? (
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
  ) : null;

  const footer = (
    <>
      {error && (
        <div className="mt-2">
          <BattleNotice message={error} />
        </div>
      )}

      {/*
        ★試合中の「やめる」★
        押し間違いで負けにならないよう、1回目は確認にする。
      */}
      <div className="mt-3">
        {confirmQuit ? (
          <div
            className="grid gap-2 rounded-2xl border-2 p-3"
            style={{ borderColor: LINE, background: '#FFFFFF' }}
          >
            <p className="text-center text-[11px] font-black" style={{ color: INK }}>
              対戦をやめますか？ やめると<span style={{ color: '#C0392B' }}>この試合は負け</span>になります。
            </p>
            <div className="grid grid-cols-2 gap-2">
              <BattleButton variant="ghost" onClick={() => setConfirmQuit(false)}>
                つづける
              </BattleButton>
              <BattleButton
                variant="danger"
                onClick={() => {
                  leave();
                  onExit('対戦をやめました。この試合は負けとして記録されます。');
                }}
                icon={<X size={16} />}
              >
                やめる
              </BattleButton>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmQuit(true)}
            className="w-full py-1 text-center text-[10px] font-bold underline-offset-2 hover:underline"
            style={{ color: '#9A948A' }}
          >
            対戦をやめる
          </button>
        )}
      </div>
    </>
  );

  /**
   * ★臨場感アップデート★
   * 得点表・実況・演出・音・カウントダウンは BattleLiveStage に集約した。
   * 進行・採点・同期は useBattleRoom のまま（ここは表示するだけ）。
   */
  return (
    <BattleShell className="arena-live-shell">
      <BattleLiveStage
        question={current}
        index={room.currentIndex}
        total={questions.length}
        rules={normalizeRule(room.subject, room.rules)}
        remainMs={remainMs}
        preStartMs={preStartMs}
        answered={answered}
        opponentAnswered={opponentAnswered}
        // ★押しても解答が残らない状態（圏外）を画面にも伝える★
        locked={!submittable && !answered}
        myChoice={myChoice}
        myPanel={myPanel}
        reveal={reveal}
        myScore={myScore}
        opponentScore={opponentScore}
        meNickname={me?.nickname || 'あなた'}
        opponentNickname={opponent?.nickname || '対戦相手'}
        maskOpponent={!room.joinCode}
        finished={finished}
        onChoose={choose}
        onPushPanel={pushPanel}
        onPopPanel={popPanel}
        onCyclePanel={cyclePanel}
        onCommitKana={commitKana}
        notices={notices}
        footer={footer}
        offline={Boolean(offlineMessage)}
      />
    </BattleShell>
  );
}
