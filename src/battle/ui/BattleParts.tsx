/**
 * ===================================================================
 * 対戦モード: 画面の共通部品
 * ===================================================================
 *
 * ■ ここに置くもの
 * 複数の対戦画面（入口・待機・対戦・結果）で使い回す小さな部品だけ。
 * 画面ごとの組み立ては各画面ファイルが持つ。
 *
 * ■ 見た目の方針
 * ★既存のマナトビの見た目から外れないこと★
 * 対戦モードだけ別アプリのように見えると、
 * 「知らない機能が生えた」という不安感になる。
 *   ・主役色は既存の #F4D03F（黄）と #1B2631（濃紺）
 *   ・教科ごとの色は既存の subjectTheme をそのまま使う
 *   ・角丸・影の付け方も既存カードに合わせる
 */

import type { ReactNode } from 'react';
import { Crown, Loader2, Swords, Timer, Trophy, UserRound } from 'lucide-react';

import { maskNickname } from '../../utils/nicknamePrivacy';
import { ratingTitle } from '../data/battleRanking';

/** アプリ共通の主役色（既存のマナトビと同じ） */
export const GOLD = '#F4D03F';
export const NAVY = '#1B2631';

// ============================================================
// 残り時間バー
// ============================================================

/**
 * 残り時間のバー。
 *
 * ★数字だけでなくバーも出す理由★
 * 制限時間が問題ごとに違う（13〜30秒）ので、
 * 「7」という数字だけでは急ぐべきか判断できない。
 * バーの残量なら一瞬で分かる。
 *
 * ★色を段階で変える理由★
 * 残り3秒を切ったら赤くする。音を出さない設計なので
 * （対戦は電車内でも遊ばれる）、色だけが焦りを伝える手段になる。
 */
export function TimeBar({
  remainMs,
  limitSec,
}: {
  remainMs: number;
  limitSec: number;
}) {
  const total = Math.max(1, limitSec * 1000);
  const ratio = Math.max(0, Math.min(1, remainMs / total));
  const seconds = Math.ceil(remainMs / 1000);

  const color = seconds <= 3 ? '#E74C3C' : seconds <= 6 ? '#E67E22' : GOLD;

  return (
    <section id="battle-time-bar" className="w-full" aria-label="残り時間">
      <div className="mb-1 flex items-center justify-between text-xs font-bold">
        <span className="flex items-center gap-1 text-white/70">
          <Timer size={13} />
          のこり
        </span>
        <span style={{ color }} className="tabular-nums text-base">
          {seconds}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-white/15">
        <div
          className="h-full rounded-full transition-[width] duration-200 ease-linear"
          style={{ width: `${ratio * 100}%`, background: color }}
        />
      </div>
    </section>
  );
}

// ============================================================
// 対戦相手の表示
// ============================================================

/**
 * プレイヤーの札（名前・アイコン・レート）。
 *
 * ★相手の名前をマスクする理由★
 * 全国ランダムマッチでは、知らない相手に本名が見えてしまう。
 * 既存の全国ランキングと同じ規則（先頭1文字＋＊）でマスクする。
 * ★フレンド対戦ではマスクしない★（合言葉を教え合った相手なので）。
 */
export function PlayerBadge({
  nickname,
  photoURL,
  rating,
  isMe,
  mask,
  answered,
  score,
  align = 'left',
}: {
  nickname: string;
  photoURL?: string;
  rating: number;
  isMe?: boolean;
  mask?: boolean;
  answered?: boolean;
  score?: number;
  align?: 'left' | 'right';
}) {
  const shown = mask && !isMe ? maskNickname(nickname) : nickname;
  const title = ratingTitle(rating);
  const right = align === 'right';

  return (
    <div
      className={`flex min-w-0 flex-1 items-center gap-2 ${right ? 'flex-row-reverse text-right' : ''}`}
    >
      <div className="relative shrink-0">
        {photoURL ? (
          <img
            src={photoURL}
            alt=""
            className="h-9 w-9 rounded-full border-2 object-cover"
            style={{ borderColor: isMe ? GOLD : 'rgba(255,255,255,0.35)' }}
          />
        ) : (
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white/10"
            style={{ borderColor: isMe ? GOLD : 'rgba(255,255,255,0.35)' }}
          >
            <UserRound size={16} className="text-white/70" />
          </div>
        )}
        {answered && (
          // 「相手が答えた」ことだけ伝える。★何を答えたかは出さない★
          // 見えてしまうと、それを見て答えを合わせられる。
          <span
            className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2"
            style={{ background: '#2ECC71', borderColor: NAVY }}
            aria-label="解答済み"
          />
        )}
      </div>

      <div className="min-w-0">
        <p className="truncate text-sm font-bold text-white">
          {shown}
          {isMe && <span className="ml-1 text-[10px] text-white/50">じぶん</span>}
        </p>
        <p className="flex items-center gap-1 text-[10px] font-bold" style={{ color: title.color }}>
          <span
            className={`flex items-center gap-1 ${right ? 'flex-row-reverse' : ''}`}
          >
            <Crown size={10} />
            {title.label} {rating}
          </span>
        </p>
      </div>

      {typeof score === 'number' && (
        <p
          className="shrink-0 tabular-nums text-xl font-black"
          style={{ color: isMe ? GOLD : '#FFFFFF' }}
        >
          {score}
        </p>
      )}
    </div>
  );
}

// ============================================================
// 見出し・枠
// ============================================================

/** 対戦画面の外枠（濃紺の背景）。全画面で共通にする */
export function BattleShell({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div
      id="battle-shell"
      className="flex min-h-[100dvh] flex-col"
      style={{ background: `radial-gradient(120% 90% at 50% 0%, #24313C 0%, ${NAVY} 60%)` }}
    >
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col px-4 pb-4 pt-4">
        {children}
      </main>
      {footer && (
        <footer className="mx-auto w-full max-w-xl px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {footer}
        </footer>
      )}
    </div>
  );
}

/** 対戦モードの見出し */
export function BattleTitle({ subtitle }: { subtitle?: string }) {
  return (
    <header id="battle-title" className="mb-4 text-center">
      <h1
        className="inline-flex items-center gap-2 text-2xl font-black"
        style={{ color: GOLD }}
      >
        <Swords size={22} />
        対戦モード
      </h1>
      {subtitle && <p className="mt-1 text-xs font-bold text-white/60">{subtitle}</p>}
    </header>
  );
}

/** 読み込み中 */
export function BattleLoading({ message }: { message: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 py-16">
      <Loader2 size={28} className="animate-spin" style={{ color: GOLD }} />
      <p className="text-sm font-bold text-white/70">{message}</p>
    </div>
  );
}

/** エラー表示（対戦を止めない範囲の案内） */
export function BattleNotice({ message, tone = 'warn' }: { message: string; tone?: 'warn' | 'info' }) {
  const color = tone === 'warn' ? '#E74C3C' : GOLD;
  return (
    <p
      className="rounded-xl border px-3 py-2 text-center text-xs font-bold"
      style={{ borderColor: `${color}55`, background: `${color}18`, color }}
      role="status"
    >
      {message}
    </p>
  );
}

/** 大きなボタン（対戦の主動線） */
export function BattleButton({
  children,
  onClick,
  disabled,
  variant = 'primary',
  icon,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
  icon?: ReactNode;
}) {
  const styles =
    variant === 'primary'
      ? { background: GOLD, color: NAVY, borderColor: GOLD }
      : variant === 'danger'
        ? { background: 'transparent', color: '#E74C3C', borderColor: '#E74C3C88' }
        : { background: 'rgba(255,255,255,0.06)', color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.25)' };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-base font-black transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
      style={styles}
    >
      {icon}
      {children}
    </button>
  );
}

/** 勝敗の帯 */
export function OutcomeBanner({ outcome }: { outcome: 'win' | 'lose' | 'draw' }) {
  const conf = {
    win: { label: 'かち！', color: GOLD, icon: <Trophy size={28} /> },
    lose: { label: 'まけ…', color: '#8FA5B8', icon: <Swords size={28} /> },
    draw: { label: 'ひきわけ', color: '#5DADE2', icon: <Swords size={28} /> },
  }[outcome];

  return (
    <div
      className="mb-4 flex flex-col items-center gap-1 rounded-3xl border-2 py-6"
      style={{ borderColor: `${conf.color}66`, background: `${conf.color}14` }}
    >
      <span style={{ color: conf.color }}>{conf.icon}</span>
      <p className="text-3xl font-black" style={{ color: conf.color }}>
        {conf.label}
      </p>
    </div>
  );
}
