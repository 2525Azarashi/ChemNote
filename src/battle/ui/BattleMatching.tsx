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
 * -------------------------------------------------------------------
 * ■ 2026-08 の作り直し（★待ち時間の演出★）
 * -------------------------------------------------------------------
 * 前の実装は、動くものが
 *   ・animate-ping の同心円1つ
 *   ・増えていく秒数
 * だけだった。理屈のうえでは「待っていること」は伝わるが、
 * 利用者が求めたのは「ポケポケ・イーフットボールみたいにすごい感じ」。
 * それらのマッチング画面がなぜ待てるのかを分解すると、
 *   ① 探索が「進んでいる」ように見える（レーダーが回る・段階が進む）
 *   ② いま何をしているのかが言葉で分かる（探索中→照合中→部屋を用意）
 *   ③ 見つかった瞬間に閃光が走る（ご褒美）
 * の3点だった。
 *
 * ★①②を「本当の進捗」ではなく段階表示にした理由★
 * Firestore の待機票は「拾われたかどうか」しか分からないので、
 * 進捗率のような値は原理的に存在しない。存在しない数値を
 * 偽のプログレスバーで見せるのは、待ち時間を裏切る行為になる。
 * そこで ★経過秒数から決まる「いま何をしているか」の説明★ だけを出す。
 * これは嘘ではない（探索は本当に継続している）し、
 * 文字が変わるので画面が生きていることも伝わる。
 *
 * ★経過秒数を出す理由（変えていない）★
 * 人が少ない時間帯は数分待つ。何も動かない画面は「固まった」と見える。
 */

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { Radar, Users, Wifi, X, Zap } from 'lucide-react';
import { subjectTheme } from '../../data/subjectTheme';
import type { SubjectKey } from '../../data/allChapters';
import { findOrEnqueue, leaveQueue, watchMatched } from '../data/battle';
import {
  AMBER,
  BattleButton,
  BattleNotice,
  BattleShell,
  BattleTitle,
  INK,
  INK_SUB,
  LINE,
} from './BattleParts';

/** これ以上待ったら「フレンド対戦にしませんか」と案内する秒数 */
const SUGGEST_FRIEND_AFTER_SEC = 45;

/**
 * 経過秒数に応じて出す説明。
 *
 * ★「進捗率」ではなく「いま起きていること」を書く★
 * 探索は待機票を置いて拾われるのを待つ仕組みなので、
 * 何%進んだという概念が無い。代わりに、待ち時間が伸びるにつれて
 * 利用者が知りたいことが変わる——という事実に合わせて文面を変える。
 *   最初  : 何をしているのか
 *   30秒  : まだ動いているのか
 *   45秒〜: 待ち続けるべきか（＝別の選択肢の提示）
 */
const PHASES: { after: number; label: string; detail: string }[] = [
  {
    after: 0,
    label: '相手をさがしています',
    detail: '同じ教科を選んだ人を全国から探しています',
  },
  {
    after: 12,
    label: 'まだ探しています',
    detail: 'レートの近い人を優先して照合しています',
  },
  {
    after: 30,
    label: '範囲をひろげました',
    detail: 'レートの条件をゆるめて、より広く探しています',
  },
  {
    after: SUGGEST_FRIEND_AFTER_SEC,
    label: '待っている人が少ないようです',
    detail: 'フレンド対戦なら、待たずにすぐ始められます',
  },
];

function phaseOf(elapsed: number) {
  // 後ろから見て、最初に条件を満たした段階を返す
  for (let i = PHASES.length - 1; i >= 0; i -= 1) {
    const p = PHASES[i];
    if (p && elapsed >= p.after) return p;
  }
  return PHASES[0]!;
}

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
  /**
   * 見つかった瞬間の閃光を見せるための状態。
   *
   * ★すぐ画面遷移せず一瞬だけ止める理由★
   * 相手が見つかると即座に部屋の画面へ切り替わるので、
   * 前の実装では「押した覚えのないまま試合が始まっている」ように見えた。
   * 0.7秒だけ「みつかりました！」を出すと、
   *   ・自分の操作の結果として始まったことが分かる
   *   ・次の画面に何が出るか身構えられる
   * ポケポケの「対戦相手が見つかりました」と同じ役目。
   */
  const [found, setFound] = useState(false);

  /** onMatched を二重に呼ばないための記録 */
  const doneRef = useRef(false);
  /** 閃光のタイマー（アンマウント時に片付ける） */
  const flashTimerRef = useRef<number | null>(null);

  const finish = (roomId: string) => {
    if (doneRef.current) return;
    doneRef.current = true;
    setFound(true);
    // ★遷移を 0.7 秒だけ遅らせる★
    //   この間に待機票の後片付けは走らない（doneRef が立っているため）。
    flashTimerRef.current = window.setTimeout(() => onMatched(roomId), 700);
  };

  // 経過秒数
  useEffect(() => {
    const timer = window.setInterval(() => setElapsed((v) => v + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // 閃光タイマーの片付け
  useEffect(
    () => () => {
      if (flashTimerRef.current !== null) window.clearTimeout(flashTimerRef.current);
    },
    [],
  );

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
        stopWatch = watchMatched(
          (matchedRoomId) => {
            if (!alive) return;
            finish(matchedRoomId);
          },
          // ★購読が失敗したら利用者に伝える★
          //
          // 以前はここでエラーを黙って捨てていた。
          // そのため索引が無い環境では購読が即失敗し、
          // 画面は「対戦相手を探しています…」のまま
          // ★永遠に何も起きない★状態になっていた。
          // 待っても無駄だと分かるようにしておく。
          () => {
            if (!alive) return;
            setError(
              '対戦相手の検索に失敗しました。通信を確かめて、もう一度お試しください。',
            );
          },
        );
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

  const phase = phaseOf(elapsed);
  const mmss = `${Math.floor(elapsed / 60)}:${String(elapsed % 60).padStart(2, '0')}`;

  // ------------------------------------------------------------
  // 見つかった（0.7秒だけ表示する）
  // ------------------------------------------------------------
  if (found) {
    return (
      <BattleShell>
        <BattleTitle subtitle={`${theme.label} ／ 全国対戦`} />
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10">
          <div className="relative flex h-32 w-32 items-center justify-center">
            <span
              className="battle-flash absolute inset-0 rounded-full"
              style={{ background: `${theme.accent}44` }}
            />
            <span
              className="absolute inset-5 rounded-full"
              style={{ background: `${theme.accent}26` }}
            />
            <Zap
              size={44}
              className="battle-pop relative"
              style={{ color: theme.accent }}
              strokeWidth={2.4}
            />
          </div>
          <p className="battle-pop font-handwriting text-2xl font-black" style={{ color: INK }}>
            相手が見つかりました！
          </p>
          <p className="text-xs font-bold" style={{ color: INK_SUB }}>
            部屋を用意しています…
          </p>
        </div>
      </BattleShell>
    );
  }

  // ------------------------------------------------------------
  // 探索中
  // ------------------------------------------------------------
  return (
    <BattleShell
      footer={
        <div className="grid gap-2.5">
          {elapsed >= SUGGEST_FRIEND_AFTER_SEC && (
            <BattleButton
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

      <div className="flex flex-1 flex-col items-center justify-center gap-5 py-6">
        {/*
          ★レーダー★
          外側に広がる輪 3つ（時間差）＋ 中を回る走査線 ＋ 中心のアイコン。
          「探索が続いている」ことを、秒数以外の手段でも伝える。
        */}
        <div className="relative flex h-36 w-36 items-center justify-center">
          {['0s', '0.8s', '1.6s'].map((delay) => (
            <span
              key={delay}
              className="battle-radar-ring absolute inset-0 rounded-full border-2"
              style={
                {
                  borderColor: `${theme.accent}55`,
                  '--ring-delay': delay,
                } as CSSProperties
              }
            />
          ))}

          {/* 走査線（円錐グラデーションの扇形） */}
          <span
            className="battle-radar-sweep absolute inset-3 rounded-full"
            style={{
              background: `conic-gradient(from 0deg, ${theme.accent}00 0deg, ${theme.accent}00 300deg, ${theme.accent}3D 350deg, ${theme.accent}66 360deg)`,
            }}
            aria-hidden
          />

          {/* 中心 */}
          <span
            className="relative flex h-16 w-16 items-center justify-center rounded-full border-2"
            style={{
              background: '#FFFFFF',
              borderColor: `${theme.accent}77`,
              boxShadow: `0 4px 0 ${theme.accent}22`,
            }}
          >
            <Radar size={30} style={{ color: theme.accent }} />
          </span>
        </div>

        {/* 段階の説明＋秒数 */}
        <div className="text-center">
          <p className="font-handwriting text-xl font-black" style={{ color: INK }}>
            {phase.label}
            {/* ★点々★ 文字が固まっていないことの合図 */}
            {['0s', '0.15s', '0.3s'].map((d) => (
              <span
                key={d}
                className="battle-dot inline-block"
                style={{ '--dot-delay': d } as CSSProperties}
              >
                .
              </span>
            ))}
          </p>
          <p className="mt-1 text-[11px] font-bold" style={{ color: INK_SUB }}>
            {phase.detail}
          </p>
          <p
            className="mt-2 inline-block rounded-full px-3 py-1 text-2xl font-black tabular-nums"
            style={{ background: '#FAF8F3', border: `1px solid ${LINE}`, color: AMBER }}
            aria-label={`経過 ${mmss}`}
          >
            {mmss}
          </p>
        </div>

        {/*
          ★段階を点で示す★
          進捗率は存在しないが、「どの段階か」は本当に存在する情報なので
          これは偽の進捗ではない。
        */}
        <ol className="flex items-center gap-1.5" aria-label="探索の段階">
          {PHASES.map((p) => {
            const on = elapsed >= p.after;
            return (
              <li
                key={p.after}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: p === phase ? 28 : 14,
                  background: on ? theme.accent : LINE,
                }}
              />
            );
          })}
        </ol>

        {error && <BattleNotice message={error} />}

        {elapsed >= SUGGEST_FRIEND_AFTER_SEC && !error && (
          <BattleNotice
            message="いま対戦を待っている人が少ないようです。フレンド対戦なら、合言葉を伝えるだけですぐ始められます。"
            tone="info"
          />
        )}

        <p
          className="flex items-center gap-1.5 text-center text-[10px] font-bold leading-relaxed"
          style={{ color: INK_SUB }}
        >
          <Wifi size={12} className="shrink-0" />
          相手が見つかると自動で始まります。この画面を離れると、さがすのをやめます。
        </p>
      </div>
    </BattleShell>
  );
}
