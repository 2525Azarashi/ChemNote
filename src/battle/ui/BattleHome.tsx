/**
 * ===================================================================
 * BattleHome — 対戦モードの入口
 * ===================================================================
 *
 * ★フレンド対戦を一番上・一番大きく置いている理由★
 * 利用者の指示が「フレンド対戦もできる、てかそっちメイン」だったため、
 * 画面の優先順位もそれに合わせている。
 * 全国対戦は「相手がいないと始まらない」＝最初は必ず待たされる機能なので、
 * 人が少ない時間帯に最初に押されると「壊れている」と受け取られやすい。
 * 合言葉のフレンド戦なら、目の前の友達と必ず1戦できる。
 *
 * ★ゲストを弾く場所をここにした理由★
 * 対戦は Firestore のルールで「部屋の players に自分の uid が入っていること」を
 * 読み書きの条件にしている。uid を持たないゲストはルール上どうやっても
 * 部屋に入れないので、押せるボタンを出してから失敗させるのではなく、
 * 入口で理由を説明して Google ログインに誘導する。
 */

import { useEffect, useState } from 'react';
import { History, LogIn, Swords, Trophy, Users, Wifi, X } from 'lucide-react';
import { auth } from '../../firebase';
import {
  BattleButton,
  BattleLoading,
  BattleNotice,
  BattleShell,
  BattleTitle,
  GOLD,
  NAVY,
} from './BattleParts';
import { fetchMyRankingRow, ratingProgress, ratingTitle } from '../data/battleRanking';
import type { BattleRankingRow } from '../data/battleRanking';

export type BattleHomeChoice = 'friend-create' | 'friend-join' | 'national' | 'ranking' | 'history';

export function BattleHome({
  onChoose,
  onExit,
  onRequireLogin,
  notice,
}: {
  onChoose: (choice: BattleHomeChoice) => void;
  onExit: () => void;
  /** ログインしていないときに押す導線（App 側のログイン画面へ） */
  onRequireLogin?: () => void;
  /** 直前の操作の結果メッセージ（「相手が退出しました」など） */
  notice?: string | null;
}) {
  const user = auth.currentUser;
  const [row, setRow] = useState<BattleRankingRow | null>(null);
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
    if (!user) return;
    let alive = true;
    fetchMyRankingRow()
      .then((r) => {
        if (alive) {
          setRow(r);
          setLoading(false);
        }
      })
      .catch(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [user]);

  // ------------------------------------------------------------
  // 未ログイン
  // ------------------------------------------------------------
  if (!user) {
    return (
      <BattleShell
        footer={
          <BattleButton variant="ghost" onClick={onExit} icon={<X size={18} />}>
            もどる
          </BattleButton>
        }
      >
        <BattleTitle subtitle="1対1のリアルタイム対戦" />
        <div className="flex flex-1 flex-col items-center justify-center gap-5 py-10 text-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full"
            style={{ background: `${GOLD}22`, color: GOLD }}
          >
            <LogIn size={30} />
          </div>
          <div>
            <p className="text-lg font-black text-white">Googleログインが必要です</p>
            <p className="mt-2 text-xs font-bold leading-relaxed text-white/60">
              対戦モードは、あなたと相手の2人ぶんの回答を
              <br />
              サーバーで照合して勝敗を決めます。
              <br />
              そのため、だれの回答なのかを確かめられる
              <br />
              ログイン済みのアカウントが必要です。
            </p>
          </div>
          {onRequireLogin && (
            <div className="w-full max-w-xs">
              <BattleButton onClick={onRequireLogin} icon={<LogIn size={18} />}>
                ログインする
              </BattleButton>
            </div>
          )}
        </div>
      </BattleShell>
    );
  }

  if (loading) {
    return (
      <BattleShell>
        <BattleTitle />
        <BattleLoading message="レートを読みこんでいます…" />
      </BattleShell>
    );
  }

  // ------------------------------------------------------------
  // ログイン済み
  // ------------------------------------------------------------
  const rating = row?.rating ?? 1500;
  const title = ratingTitle(rating);
  const progress = ratingProgress(rating);
  const wins = row?.wins ?? 0;
  const losses = row?.losses ?? 0;
  const draws = row?.draws ?? 0;
  const played = wins + losses + draws;

  return (
    <BattleShell
      footer={
        <BattleButton variant="ghost" onClick={onExit} icon={<X size={18} />}>
          ホームにもどる
        </BattleButton>
      }
    >
      <BattleTitle subtitle="1対1のリアルタイム対戦" />

      {notice && (
        <div className="mb-3">
          <BattleNotice message={notice} tone="info" />
        </div>
      )}

      {/* 自分のレート */}
      <section
        id="battle-my-rating"
        className="mb-5 rounded-3xl border-2 p-4"
        style={{ borderColor: `${title.color}55`, background: `${title.color}12` }}
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-black tracking-wide text-white/50">いまのレート</p>
            <p className="flex items-baseline gap-2">
              <span className="text-3xl font-black tabular-nums" style={{ color: title.color }}>
                {rating}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-black"
                style={{ background: `${title.color}30`, color: title.color }}
              >
                {title.label}
              </span>
            </p>
          </div>
          <p className="text-right text-[11px] font-bold text-white/60">
            {played === 0 ? (
              'まだ対戦していません'
            ) : (
              <>
                {wins}
                <span className="text-white/40">勝</span> {losses}
                <span className="text-white/40">敗</span> {draws}
                <span className="text-white/40">分</span>
              </>
            )}
          </p>
        </div>

        {/* 次の称号までのバー */}
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[10px] font-bold text-white/50">
            <span>つぎ: {progress.next}</span>
            <span>{progress.remain > 0 ? `あと ${progress.remain}` : '最高ランク'}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/12">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress.ratio * 100}%`, background: title.color }}
            />
          </div>
        </div>
      </section>

      {/* フレンド対戦（メイン） */}
      <section className="mb-4">
        <h2 className="mb-2 flex items-center gap-1.5 text-xs font-black text-white/70">
          <Users size={14} style={{ color: GOLD }} />
          フレンド対戦
          <span
            className="rounded-full px-1.5 py-0.5 text-[9px] font-black"
            style={{ background: GOLD, color: NAVY }}
          >
            おすすめ
          </span>
        </h2>
        <p className="mb-3 text-[11px] font-bold leading-relaxed text-white/50">
          4文字の合言葉を作って、友達に口で伝えるだけ。
          <br />
          フレンド登録していない相手ともすぐ対戦できます。
        </p>
        <div className="grid gap-2.5">
          <BattleButton onClick={() => onChoose('friend-create')} icon={<Swords size={18} />}>
            部屋をつくる
          </BattleButton>
          <BattleButton
            variant="ghost"
            onClick={() => onChoose('friend-join')}
            icon={<LogIn size={18} />}
          >
            合言葉で参加する
          </BattleButton>
        </div>
      </section>

      {/* 全国対戦 */}
      <section className="mb-4">
        <h2 className="mb-2 flex items-center gap-1.5 text-xs font-black text-white/70">
          <Wifi size={14} className="text-white/50" />
          全国対戦
        </h2>
        <p className="mb-3 text-[11px] font-bold leading-relaxed text-white/50">
          近いレートの人と自動でマッチングします。
          <br />
          相手が見つかるまで待つことがあります。
        </p>
        <BattleButton variant="ghost" onClick={() => onChoose('national')} icon={<Wifi size={18} />}>
          相手をさがす
        </BattleButton>
      </section>

      {/* サブ動線 */}
      <section className="mt-auto grid grid-cols-2 gap-2.5 pt-4">
        <button
          type="button"
          id="battle-open-ranking"
          onClick={() => onChoose('ranking')}
          className="flex flex-col items-center gap-1 rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-[11px] font-black text-white/80 transition active:scale-[0.98]"
        >
          <Trophy size={17} style={{ color: GOLD }} />
          対戦ランキング
        </button>
        <button
          type="button"
          id="battle-open-history"
          onClick={() => onChoose('history')}
          className="flex flex-col items-center gap-1 rounded-2xl border border-white/15 bg-white/5 px-3 py-3 text-[11px] font-black text-white/80 transition active:scale-[0.98]"
        >
          <History size={17} className="text-white/60" />
          たいせん履歴
        </button>
      </section>
    </BattleShell>
  );
}
