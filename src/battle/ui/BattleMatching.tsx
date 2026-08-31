/**
 * ===================================================================
 * BattleMatching — 全国対戦の相手さがし
 * ===================================================================
 *
 * ★探し方（data/battle.ts の findOrEnqueue と対応）★
 *   1. 同じ教科で待っている人がいれば、その待機票を消して部屋を作る
 *   2. いなければ自分の待機票を置いて、拾われるのを待つ
 * 「待機票を消せた側だけが部屋を作れる」ので、
 * 2人が同時に相手を見つけても部屋が2つできない。
 *
 * ★この画面が必ず leaveQueue を呼ぶ理由★
 * 待機票を置いたまま画面を閉じると、次に来た人が
 * 「もういない相手」とマッチングして永遠に始まらない部屋を作る。
 * 画面を離れるとき（戻る・アンマウント）に必ず消す。
 * 万一残っても、部屋は30分で古い扱いになる（ROOM_STALE_MINUTES）。
 *
 * ★経過秒数を出す理由★
 * 人が少ない時間帯は数分待つ。何も動かない画面は「固まった」と見える。
 * 秒数が増えていれば、待っていることが伝わる。
 */

import { useEffect, useRef, useState } from 'react';
import { Users, Wifi, X } from 'lucide-react';
import { subjectTheme } from '../../data/subjectTheme';
import type { SubjectKey } from '../../data/allChapters';
import { findOrEnqueue, leaveQueue, watchMatched } from '../data/battle';
import {
  BattleButton,
  BattleNotice,
  BattleShell,
  BattleTitle,
  GOLD,
} from './BattleParts';

/** これ以上待ったら「フレンド対戦にしませんか」と案内する秒数 */
const SUGGEST_FRIEND_AFTER_SEC = 45;

export function BattleMatching({
  subject,
  onMatched,
  onCancel,
  onSwitchToFriend,
}: {
  subject: string;
  onMatched: (roomId: string) => void;
  onCancel: () => void;
  /** 待ちが長いときに「フレンド対戦にする」導線 */
  onSwitchToFriend: () => void;
}) {
  const theme = subjectTheme(subject as SubjectKey);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);

  /** onMatched を二重に呼ばないための記録 */
  const doneRef = useRef(false);
  const finish = (roomId: string) => {
    if (doneRef.current) return;
    doneRef.current = true;
    onMatched(roomId);
  };

  // 経過秒数
  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // マッチング本体
  useEffect(() => {
    let alive = true;
    let stopWatch: (() => void) | null = null;

    findOrEnqueue(subject)
      .then(({ roomId }) => {
        if (!alive) return;
        if (roomId) {
          // 相手を拾えた（自分が部屋を作った側）
          finish(roomId);
          return;
        }
        // 待機票を置いた側。拾われるのを待つ
        stopWatch = watchMatched((matchedRoomId) => {
          if (!alive) return;
          finish(matchedRoomId);
        });
      })
      .catch((e: Error) => {
        if (alive) setError(e.message);
      });

    return () => {
      alive = false;
      stopWatch?.();
      // ★成立していない場合だけ待機票を消す★
      //   成立している場合、待機票は相手が既に消している。
      if (!doneRef.current) void leaveQueue();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  const cancel = () => {
    void leaveQueue();
    onCancel();
  };

  return (
    <BattleShell
      footer={
        <div className="grid gap-2.5">
          {elapsed >= SUGGEST_FRIEND_AFTER_SEC && (
            <BattleButton
              variant="ghost"
              onClick={() => {
                void leaveQueue();
                onSwitchToFriend();
              }}
              icon={<Users size={18} />}
            >
              フレンド対戦にする
            </BattleButton>
          )}
          <BattleButton variant="danger" onClick={cancel} icon={<X size={18} />}>
            やめる
          </BattleButton>
        </div>
      }
    >
      <BattleTitle subtitle={`${theme.label} ／ 全国対戦`} />

      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10">
        {/* 探索中のしるし（同心円） */}
        <div className="relative flex h-28 w-28 items-center justify-center">
          <span
            className="absolute inset-0 animate-ping rounded-full"
            style={{ background: `${theme.accent}22` }}
          />
          <span
            className="absolute inset-4 rounded-full"
            style={{ background: `${theme.accent}2E` }}
          />
          <Wifi size={34} style={{ color: theme.accent }} className="relative" />
        </div>

        <div className="text-center">
          <p className="text-lg font-black text-white">相手をさがしています</p>
          <p className="mt-1 text-2xl font-black tabular-nums" style={{ color: GOLD }}>
            {Math.floor(elapsed / 60)}:{String(elapsed % 60).padStart(2, '0')}
          </p>
        </div>

        {error && <BattleNotice message={error} />}

        {elapsed >= SUGGEST_FRIEND_AFTER_SEC && !error && (
          <BattleNotice
            message="いま対戦を待っている人が少ないようです。フレンド対戦ならすぐに始められます。"
            tone="info"
          />
        )}

        <p className="text-center text-[10px] font-bold leading-relaxed text-white/35">
          相手が見つかると自動で始まります。
          <br />
          この画面を離れると、さがすのをやめます。
        </p>
      </div>
    </BattleShell>
  );
}
