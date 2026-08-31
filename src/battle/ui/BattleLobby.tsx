/**
 * ===================================================================
 * BattleLobby — 部屋の待機画面（合言葉を見せて相手を待つ）
 * ===================================================================
 *
 * ★合言葉を画面いっぱいに出す理由★
 * この画面の役目は「相手に4文字を伝える」ことだけ。
 * 目の前の友達に見せる／通話で読み上げる／写真に撮ってもらう、
 * どの使い方でも一発で読めるサイズにする。
 *
 * ★「はじめる」を部屋主だけに出す理由★
 * 両方が押せると、押した瞬間に deadlineAt が2回書かれ、
 * 後から書かれた方に上書きされて片方の残り時間がずれる。
 * 開始の書き込みは1人に限定する（進行中の advanceQuestion は
 * 逆に両者が呼べる設計にしてある。部屋主が落ちても止まらないように）。
 *
 * ★相手が入るまで「はじめる」を押させない理由★
 * 1人で開始すると相手は「もう始まっている試合」に途中参加することになり、
 * 最初の数問を無回答で失う。相手の参加を待ってから開始する。
 */

import { Check, Copy, Share2, X } from 'lucide-react';
import { useState } from 'react';
import type { CSSProperties } from 'react';
import { subjectTheme } from '../../data/subjectTheme';
import type { SubjectKey } from '../../data/allChapters';
import type { BattleRoom } from '../core/types';
import {
  AMBER,
  BattleButton,
  BattleNotice,
  BattleShell,
  BattleTitle,
  GOLD,
  INK,
  INK_SUB,
  LINE,
  PlayerBadge,
} from './BattleParts';

export function BattleLobby({
  room,
  myUid,
  onStart,
  onLeave,
}: {
  room: BattleRoom;
  myUid: string;
  onStart: () => void;
  onLeave: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const theme = subjectTheme(room.subject as SubjectKey);

  const isHost = room.hostUid === myUid;
  const opponentUid = room.players.find((p) => p !== myUid) || '';
  const me = room.profiles[myUid];
  const opponent = opponentUid ? room.profiles[opponentUid] : null;
  const ready = Boolean(opponent);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(room.joinCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // クリップボードが使えない環境（iOSの一部）では何もしない。
      // 合言葉は画面に大きく出ているので手で伝えられる。
    }
  };

  const share = async () => {
    // Web Share API があるときだけ出す（LINEに直接送れる端末が多い）
    const nav = navigator as Navigator & {
      share?: (data: { title?: string; text?: string }) => Promise<void>;
    };
    if (!nav.share) return;
    try {
      await nav.share({
        title: 'マナトビ 対戦モード',
        text: `マナトビの対戦しよう！ 合言葉は「${room.joinCode}」（${theme.label}）`,
      });
    } catch {
      // 共有をキャンセルしただけなので無視する
    }
  };

  const canShare = typeof navigator !== 'undefined' && 'share' in navigator;

  return (
    <BattleShell
      footer={
        <div className="grid gap-2.5">
          {isHost ? (
            <BattleButton onClick={onStart} disabled={!ready}>
              {ready ? 'はじめる' : '相手を待っています…'}
            </BattleButton>
          ) : (
            <BattleNotice
              message={ready ? '相手がはじめるのを待っています…' : '部屋に入りました'}
              tone="info"
            />
          )}
          <BattleButton variant="danger" onClick={onLeave} icon={<X size={18} />}>
            部屋をでる
          </BattleButton>
        </div>
      }
    >
      <BattleTitle subtitle={`${theme.label} ／ ${room.rules.questionCount}問しょうぶ`} />

      {/* 合言葉 */}
      {room.joinCode ? (
        <section
          id="battle-join-code"
          className="battle-card-in battle-sheen mb-5 rounded-3xl border-2 p-5 text-center"
          style={{
            borderColor: `${GOLD}AA`,
            background: '#FFFFFF',
            boxShadow: `0 6px 0 ${GOLD}33`,
          }}
        >
          <p
            className="relative z-[2] text-[10px] font-black tracking-widest"
            style={{ color: INK_SUB }}
          >
            あいことば
          </p>
          {/*
            ★合言葉の文字色をゴールドにしない★
            アイボリー地の上の #F4D03F は輝度が近すぎて読めない。
            この4文字は「相手に読み上げてもらう」のが全てなので、
            視認性を優先して濃紺にし、ゴールドは下地に使う。
          */}
          <p
            className="relative z-[2] my-1 inline-block rounded-2xl px-4 py-1 text-5xl font-black tracking-[0.2em] tabular-nums"
            style={{ background: `${GOLD}3D`, color: INK }}
          >
            {room.joinCode}
          </p>
          <p className="relative z-[2] mb-3 text-[11px] font-bold" style={{ color: INK_SUB }}>
            相手に伝えて「合言葉で参加する」から入ってもらってください
          </p>
          <div className="relative z-[2] flex justify-center gap-2">
            <button
              type="button"
              onClick={() => void copyCode()}
              className="flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-[11px] font-black transition active:translate-y-[2px] active:scale-95"
              style={{ borderColor: LINE, background: '#FFFFFF', color: INK }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? 'コピーしました' : 'コピー'}
            </button>
            {canShare && (
              <button
                type="button"
                onClick={() => void share()}
                className="flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-[11px] font-black transition active:translate-y-[2px] active:scale-95"
                style={{ background: GOLD, borderColor: '#E5B93C', color: INK }}
              >
                <Share2 size={13} />
                おくる
              </button>
            )}
          </div>
        </section>
      ) : (
        <div className="mb-5">
          <BattleNotice message="全国対戦の部屋です" tone="info" />
        </div>
      )}

      {/* 対戦カード */}
      <section
        className="battle-card-in rounded-3xl border-2 p-4"
        style={
          { borderColor: LINE, background: '#FFFFFF', '--card-delay': '0.08s' } as CSSProperties
        }
      >
        <div className="flex items-center gap-2">
          <PlayerBadge
            nickname={me?.nickname || 'あなた'}
            photoURL={me?.photoURL}
            rating={me?.rating ?? 1500}
            isMe
          />
          <span
            className="battle-vs-pulse shrink-0 rounded-lg px-1.5 py-0.5 text-xs font-black"
            style={{ background: GOLD, color: INK }}
          >
            VS
          </span>
          {opponent ? (
            <PlayerBadge
              nickname={opponent.nickname}
              photoURL={opponent.photoURL}
              rating={opponent.rating}
              mask={!room.joinCode}
              align="right"
            />
          ) : (
            <div className="flex min-w-0 flex-1 flex-row-reverse items-center gap-2 text-right">
              <div
                className="h-9 w-9 shrink-0 animate-pulse rounded-full border-2"
                style={{ background: '#F1EDE4', borderColor: LINE }}
              />
              <div className="min-w-0">
                <p className="truncate text-xs font-black" style={{ color: INK_SUB }}>
                  相手を待っています
                  {/* ★点々で「この画面は生きている」と伝える★ */}
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
                <p className="text-[10px] font-bold" style={{ color: INK_SUB }}>
                  合言葉を伝えましたか？
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {room.rules.note && (
        <p className="mt-4 text-center text-[11px] font-bold leading-relaxed" style={{ color: AMBER }}>
          {room.rules.note}
        </p>
      )}

      <div className="mt-auto pt-6">
        <p
          className="text-center text-[10px] font-bold leading-relaxed"
          style={{ color: INK_SUB }}
        >
          先に押した方が勝ちではありません。
          <br />
          同じ問題が2人に同時に出て、正解と速さで点が決まります。
          <br />
          回線の速さで勝敗は変わりません。
        </p>
      </div>
    </BattleShell>
  );
}
