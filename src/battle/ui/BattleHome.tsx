/**
 * ===================================================================
 * BattleHome — 対戦モードの入口
 * ===================================================================
 *
 * ★2026-08 に作り直した★
 * 利用者から
 *   「マッチングのところがやっぱりフレンドと全国で少しわかんないので
 *     もっとわかりやすくして　ポケポケとかイーフットボールみたいに
 *     すごい感じにして」
 * という指摘を受けた。
 *
 * -------------------------------------------------------------------
 * ■ 何が「わかんない」のかを分解した
 * -------------------------------------------------------------------
 * 前の実装は、2つのモードの違いを 11px の小さな説明文で
 *   フレンド「4文字の合言葉を作って、友達に口で伝えるだけ。」
 *   全国    「近いレートの人と自動でマッチングします。」
 * と書いていただけだった。
 * これは「やり方」の説明であって、選ぶ前に本当に知りたいこと——
 *   ・誰と当たるのか
 *   ・すぐ始まるのか
 *   ・レートは動くのか
 *   ・名前は相手に見えるのか
 * ——に答えていない。しかも2つの説明が同じ書式・同じ大きさなので、
 * 並べても違いが浮かび上がらない。
 *
 * そこで ★同じ4項目を、同じ順番で、両モードに並べる★ ことにした。
 * 「違い」は文章で語るのではなく、同じ枠の同じ位置にある値の差として
 * 見えるようにする（表と同じ原理）。
 *
 * -------------------------------------------------------------------
 * ■ 「ポケポケ・イーフットボールみたいにすごい感じ」の正体
 * -------------------------------------------------------------------
 * それらのゲームの対戦入口が「すごい」のは、暗い画面だからではない。
 *   ① 主動線が画面の主役として大きく置かれている（迷う余地がない）
 *   ② カードに光沢が走り、待っていても何かが動いている
 *   ③ 押す前から「これから戦う」という temperature がある（VS・レート）
 * この3つを、地色を変えずに作る。
 * 演出は src/index.css の .battle-sheen / .battle-card-in / .battle-vs-pulse
 * に置いてある（prefers-reduced-motion で一括停止できるようにするため）。
 *
 * ★地色は絶対に変えない★
 * 前回「暗くしたら乖離した」と指摘されたのがまさにこの点。
 * 対戦は別アプリではなく、同じノートの中の1ページ。
 *
 * -------------------------------------------------------------------
 * ■ フレンド対戦を上に置いている理由（変えていない）
 * -------------------------------------------------------------------
 * 利用者の指示が「フレンド対戦もできる、てかそっちメイン」だったため。
 * 全国対戦は「相手がいないと始まらない」＝最初は必ず待たされる機能なので、
 * 人が少ない時間帯に最初に押されると「壊れている」と受け取られやすい。
 *
 * ★ゲストを弾く場所をここにした理由★
 * 対戦は Firestore のルールで「部屋の players に自分の uid が入っていること」を
 * 読み書きの条件にしている。uid を持たないゲストはルール上どうやっても
 * 部屋に入れないので、押せるボタンを出してから失敗させるのではなく、
 * 入口で理由を説明して Google ログインに誘導する。
 */

import { useEffect, useState } from 'react';
import {
  Clock,
  Eye,
  EyeOff,
  History,
  LogIn,
  Shuffle,
  Swords,
  TrendingUp,
  Trophy,
  UserRound,
  Users,
  Wifi,
  X,
  Zap,
} from 'lucide-react';
import type { CSSProperties, ReactNode } from 'react';
import { auth } from '../../firebase';
import {
  AMBER,
  BattleButton,
  BattleLoading,
  BattleNotice,
  BattleShell,
  BattleTitle,
  GOLD,
  INK,
  INK_SUB,
  LINE,
} from './BattleParts';
import { fetchMyRankingRow, ratingProgress, ratingTitle } from '../data/battleRanking';
import type { BattleRankingRow } from '../data/battleRanking';

export type BattleHomeChoice = 'friend-create' | 'friend-join' | 'national' | 'ranking' | 'history';

/**
 * モードカードに並べる4項目。
 *
 * ★両モードで「同じ項目・同じ順番」にすることが仕様★
 * 片方だけ項目が多い／順番が違うと、読み手は差分を探すために
 * 2つのカードを行き来しなければならない。位置を揃えれば、
 * 目を横に動かすだけで違いが分かる。
 */
interface ModeFact {
  icon: ReactNode;
  /** 項目名（両モード共通の見出し） */
  key: string;
  /** そのモードでの値 */
  value: string;
  /** 値を強調するか（そのモードの「売り」なら true） */
  strong?: boolean;
}

const FRIEND_FACTS: ModeFact[] = [
  { icon: <UserRound size={13} />, key: 'あいて', value: '合言葉を教えた人', strong: true },
  { icon: <Clock size={13} />, key: 'まちじかん', value: 'なし（すぐ始まる）', strong: true },
  { icon: <TrendingUp size={13} />, key: 'レート', value: 'うごく' },
  { icon: <Eye size={13} />, key: 'なまえ', value: 'おたがいに見える' },
];

const NATIONAL_FACTS: ModeFact[] = [
  { icon: <Shuffle size={13} />, key: 'あいて', value: '近いレートの知らない人', strong: true },
  { icon: <Clock size={13} />, key: 'まちじかん', value: 'あり（数十秒〜数分）' },
  { icon: <TrendingUp size={13} />, key: 'レート', value: 'うごく' },
  { icon: <EyeOff size={13} />, key: 'なまえ', value: 'かくれる（マ＊＊＊）', strong: true },
];

/**
 * モードカード。
 *
 * ★カード全体をボタンにしていない理由★
 * フレンド対戦には「つくる」と「入る」の2つの動作がある。
 * カードごとタップにすると、どちらに進むのか決められない。
 * カードは「説明の器」、動作は中のボタンに限定する。
 */
function ModeCard({
  badge,
  title,
  lead,
  facts,
  accent,
  facePaint,
  children,
  delay,
}: {
  /** 「おすすめ」などの札。無い場合は出さない */
  badge?: string;
  title: string;
  /** カードの一行目。「何をする機能か」を1文で */
  lead: string;
  facts: ModeFact[];
  /** カードの主色 */
  accent: string;
  /** 見出し行のアイコン */
  facePaint: ReactNode;
  /** 動作ボタン */
  children: ReactNode;
  /** 立ち上がりの遅延（上から順に出す） */
  delay: string;
}) {
  return (
    <section
      className="battle-card-in battle-sheen rounded-3xl border-2 p-4"
      style={
        {
          borderColor: `${accent}66`,
          background: '#FFFFFF',
          boxShadow: `0 6px 0 ${accent}22`,
          '--card-delay': delay,
          '--sheen-delay': delay,
        } as CSSProperties
      }
    >
      {/* 見出し */}
      <header className="relative z-[2] mb-2 flex items-center gap-2">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl"
          style={{ background: `${accent}1F`, color: accent }}
        >
          {facePaint}
        </span>
        <h2 className="font-handwriting text-xl font-black" style={{ color: INK }}>
          {title}
        </h2>
        {badge && (
          <span
            className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black"
            style={{ background: GOLD, color: INK }}
          >
            {badge}
          </span>
        )}
      </header>

      <p className="relative z-[2] mb-3 text-xs font-bold leading-relaxed" style={{ color: INK_SUB }}>
        {lead}
      </p>

      {/* ★4項目の対比表★ 両モードで同じ位置・同じ順番 */}
      <dl
        className="relative z-[2] mb-3.5 grid gap-1 rounded-2xl px-3 py-2.5"
        style={{ background: '#FAF8F3', border: `1px solid ${LINE}` }}
      >
        {facts.map((f) => (
          <div key={f.key} className="flex items-baseline gap-2 text-[11px]">
            <dt
              className="flex w-[5.6rem] shrink-0 items-center gap-1 font-black"
              style={{ color: INK_SUB }}
            >
              <span style={{ color: accent }}>{f.icon}</span>
              {f.key}
            </dt>
            <dd
              className="min-w-0 font-bold"
              style={{ color: f.strong ? accent : INK }}
            >
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="relative z-[2] grid gap-2">{children}</div>
    </section>
  );
}

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
            style={{ background: `${GOLD}33`, color: AMBER }}
          >
            <LogIn size={30} />
          </div>
          <div>
            <p className="font-handwriting text-lg font-black" style={{ color: INK }}>
              Googleログインが必要です
            </p>
            <p className="mt-2 text-xs font-bold leading-relaxed" style={{ color: INK_SUB }}>
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

      {/*
        自分のレート。
        ★対戦入口の一番上に置く理由★
        これから戦う前の「自分の現在地」。ポケポケの入口でランクが
        真っ先に見えるのと同じで、押す前に温度を作る役目がある。
      */}
      <section
        id="battle-my-rating"
        className="battle-card-in mb-4 rounded-3xl border-2 p-4"
        style={
          {
            borderColor: `${title.color}55`,
            background: `${title.color}0F`,
            '--card-delay': '0s',
          } as CSSProperties
        }
      >
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[10px] font-black tracking-wide" style={{ color: INK_SUB }}>
              いまのレート
            </p>
            <p className="flex items-baseline gap-2">
              <span
                className="battle-pop text-3xl font-black tabular-nums"
                style={{ color: title.color }}
              >
                {rating}
              </span>
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-black"
                style={{ background: `${title.color}26`, color: title.color }}
              >
                {title.label}
              </span>
            </p>
          </div>
          <p className="text-right text-[11px] font-bold" style={{ color: INK_SUB }}>
            {played === 0 ? (
              'まだ対戦していません'
            ) : (
              <>
                {wins}
                <span style={{ color: `${INK_SUB}99` }}>勝</span> {losses}
                <span style={{ color: `${INK_SUB}99` }}>敗</span> {draws}
                <span style={{ color: `${INK_SUB}99` }}>分</span>
              </>
            )}
          </p>
        </div>

        {/* 次の称号までのバー */}
        <div className="mt-3">
          <div
            className="mb-1 flex justify-between text-[10px] font-bold"
            style={{ color: INK_SUB }}
          >
            <span>つぎ: {progress.next}</span>
            <span>{progress.remain > 0 ? `あと ${progress.remain}` : '最高ランク'}</span>
          </div>
          <div
            className="h-2 w-full overflow-hidden rounded-full"
            style={{ background: '#E8E2D6' }}
          >
            <div
              className="h-full rounded-full transition-[width] duration-700 ease-out"
              style={{ width: `${progress.ratio * 100}%`, background: title.color }}
            />
          </div>
        </div>
      </section>

      {/*
        ★2つのモードを「同じ形のカード」で並べる★
        違いは、同じ位置にある4項目の値の差として読み取ってもらう。
      */}
      <div className="grid gap-3">
        <ModeCard
          badge="おすすめ"
          title="フレンド対戦"
          lead="4文字の合言葉を作って、目の前の友達に伝えるだけ。フレンド登録していなくても対戦できます。"
          facts={FRIEND_FACTS}
          accent={AMBER}
          facePaint={<Users size={19} />}
          delay="0.06s"
        >
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
        </ModeCard>

        <ModeCard
          title="全国対戦"
          lead="ボタンひとつで、同じ教科を選んだ全国の人とつながります。相手が見つかるまで待つ画面になります。"
          facts={NATIONAL_FACTS}
          accent="#2E86C1"
          facePaint={<Wifi size={19} />}
          delay="0.12s"
        >
          <BattleButton
            variant="ghost"
            onClick={() => onChoose('national')}
            icon={<Zap size={18} />}
          >
            相手をさがす
          </BattleButton>
        </ModeCard>
      </div>

      {/*
        ★2つのモードで「変わらないこと」を最後に1回だけ書く★
        利用者が混乱していたのは「違い」が見えないことだったが、
        逆に「同じところ」を明示しないと、今度は
        「フレンド戦はレートが動かないのかも」という別の誤解が生まれる。
        実装上、レートは両モードで同じように動く（useBattleRoom の
        applyRatingResult は joinCode を見ていない）。
      */}
      <p
        className="mt-3 rounded-2xl px-3 py-2.5 text-center text-[10px] font-bold leading-relaxed"
        style={{ background: `${GOLD}1C`, color: INK_SUB, border: `1px dashed ${GOLD}` }}
      >
        どちらも出題・制限時間・点数の計算・レートの増減は同じです。
        <br />
        ちがうのは<span style={{ color: AMBER }}>「相手の決まり方」</span>と
        <span style={{ color: AMBER }}>「名前が見えるか」</span>だけ。
      </p>

      {/* サブ動線 */}
      <section className="mt-auto grid grid-cols-2 gap-2.5 pt-4">
        <button
          type="button"
          id="battle-open-ranking"
          onClick={() => onChoose('ranking')}
          className="flex flex-col items-center gap-1 rounded-2xl border-2 px-3 py-3 text-[11px] font-black transition active:translate-y-[2px] active:scale-[0.98]"
          style={{ borderColor: LINE, background: '#FFFFFF', color: INK }}
        >
          <Trophy size={17} style={{ color: AMBER }} />
          対戦ランキング
        </button>
        <button
          type="button"
          id="battle-open-history"
          onClick={() => onChoose('history')}
          className="flex flex-col items-center gap-1 rounded-2xl border-2 px-3 py-3 text-[11px] font-black transition active:translate-y-[2px] active:scale-[0.98]"
          style={{ borderColor: LINE, background: '#FFFFFF', color: INK }}
        >
          <History size={17} style={{ color: INK_SUB }} />
          たいせん履歴
        </button>
      </section>
    </BattleShell>
  );
}
