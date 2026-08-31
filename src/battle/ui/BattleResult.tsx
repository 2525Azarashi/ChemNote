/**
 * ===================================================================
 * BattleResult — リザルト画面
 * ===================================================================
 *
 * ★1問ずつの内訳を必ず出す理由★
 * 点数だけを出すと「なぜ負けたのか」が分からず、
 * 速さボーナスがあるゲームでは特に不透明に見える。
 * 「正解したか」「何秒だったか」「速さで何点もらったか」を並べると、
 * 負けた側も納得できるし、次にどこを縮めればよいか分かる。
 *
 * ★レートの増減を「相手のレート」と一緒に見せる理由★
 * Elo では強い相手に勝つと大きく増える。
 * 相手のレートを出さないと、増減の大きさが理由なく変わって見える。
 *
 * ★無効試合をはっきり書く理由★
 * 両者の申告が食い違ったときはレートを動かさない設計になっている。
 * 黙って0のままにすると「レートが反映されないバグ」に見える。
 */

import { ArrowLeft, Minus, RotateCcw, TrendingDown, TrendingUp } from 'lucide-react';
import { subjectTheme } from '../../data/subjectTheme';
import type { SubjectKey } from '../../data/allChapters';
import type {
  BattlePlayerScore,
  BattleQuestion,
  BattleResultSummary,
} from '../core/types';
import { ratingTitle } from '../data/battleRanking';
import {
  BattleButton,
  BattleShell,
  GOLD,
  OutcomeBanner,
  PlayerBadge,
} from './BattleParts';

function ScoreColumn({
  score,
  label,
  color,
}: {
  score: BattlePlayerScore | null;
  label: string;
  color: string;
}) {
  return (
    <div className="flex-1 text-center">
      <p className="text-[10px] font-black text-white/45">{label}</p>
      <p className="text-3xl font-black tabular-nums" style={{ color }}>
        {score?.score ?? 0}
      </p>
      <p className="text-[10px] font-bold text-white/45">
        {score ? `${score.correctCount}問せいかい` : '—'}
      </p>
    </div>
  );
}

export function BattleResult({
  result,
  questions,
  subject,
  opponent,
  meNickname,
  mePhotoURL,
  rating,
  byForfeit,
  maskOpponent,
  onRematch,
  onExit,
}: {
  result: BattleResultSummary;
  questions: BattleQuestion[];
  subject: string;
  opponent: { nickname: string; photoURL: string; rating: number } | null;
  meNickname: string;
  mePhotoURL?: string;
  /** レート変化。無効試合・未反映のときは null */
  rating: { before: number; after: number } | null;
  byForfeit: boolean;
  /** 全国対戦なら相手の名前を隠す */
  maskOpponent: boolean;
  onRematch?: () => void;
  onExit: () => void;
}) {
  const theme = subjectTheme(subject as SubjectKey);
  const delta = rating ? rating.after - rating.before : 0;
  const title = ratingTitle(rating?.after ?? 1500);

  const deltaIcon =
    delta > 0 ? <TrendingUp size={16} /> : delta < 0 ? <TrendingDown size={16} /> : <Minus size={16} />;
  const deltaColor = delta > 0 ? GOLD : delta < 0 ? '#E74C3C' : '#8FA5B8';

  return (
    <BattleShell
      footer={
        <div className="grid gap-2.5">
          {onRematch && (
            <BattleButton onClick={onRematch} icon={<RotateCcw size={18} />}>
              もう1回たいせん
            </BattleButton>
          )}
          <BattleButton variant="ghost" onClick={onExit} icon={<ArrowLeft size={18} />}>
            対戦メニューにもどる
          </BattleButton>
        </div>
      }
    >
      <OutcomeBanner outcome={result.outcome} />

      {byForfeit && (
        <p
          className="mb-3 rounded-xl px-3 py-2 text-center text-[11px] font-bold"
          style={{ background: `${GOLD}18`, color: GOLD }}
        >
          相手の通信が切れたため、不戦勝あつかいになりました
          <br />
          （レートの変化は半分です）
        </p>
      )}

      {result.decidedByTime && (
        <p
          className="mb-3 rounded-xl px-3 py-2 text-center text-[11px] font-bold"
          style={{ background: 'rgba(93,173,226,0.16)', color: '#5DADE2' }}
        >
          同点だったので、解答時間の合計で決まりました
        </p>
      )}

      {/* 点数 */}
      <section
        className="mb-4 rounded-3xl border p-4"
        style={{ borderColor: 'rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.05)' }}
      >
        <div className="mb-3 flex items-center gap-2">
          <PlayerBadge
            nickname={meNickname}
            photoURL={mePhotoURL}
            rating={rating?.before ?? 1500}
            isMe
          />
          <span className="shrink-0 text-xs font-black" style={{ color: GOLD }}>
            VS
          </span>
          <PlayerBadge
            nickname={opponent?.nickname || '対戦相手'}
            photoURL={opponent?.photoURL}
            rating={opponent?.rating ?? 1500}
            mask={maskOpponent}
            align="right"
          />
        </div>
        <div className="flex items-center">
          <ScoreColumn score={result.me} label="あなた" color={GOLD} />
          <span className="px-2 text-white/25">—</span>
          <ScoreColumn score={result.opponent} label="あいて" color="#8FA5B8" />
        </div>
      </section>

      {/* レート */}
      <section
        className="mb-4 flex items-center justify-between rounded-2xl border-2 px-4 py-3"
        style={{ borderColor: `${title.color}44`, background: `${title.color}10` }}
      >
        <div>
          <p className="text-[10px] font-black text-white/45">レート</p>
          {rating ? (
            <p className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold tabular-nums text-white/45">{rating.before}</span>
              <span className="text-white/30">→</span>
              <span className="text-2xl font-black tabular-nums" style={{ color: title.color }}>
                {rating.after}
              </span>
            </p>
          ) : (
            <p className="text-xs font-bold text-white/55">
              反映されませんでした（無効試合）
            </p>
          )}
        </div>
        {rating && (
          <span
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-sm font-black tabular-nums"
            style={{ background: `${deltaColor}22`, color: deltaColor }}
          >
            {deltaIcon}
            {delta > 0 ? `+${delta}` : delta}
          </span>
        )}
      </section>

      {/* 1問ずつの内訳 */}
      <section id="battle-result-detail" className="mb-4">
        <h2 className="mb-2 text-xs font-black text-white/65">1問ずつのけっか</h2>
        <div className="grid gap-1.5">
          {result.me.perQuestion.map((q) => {
            const question = questions[q.index];
            const other = result.opponent?.perQuestion.find((o) => o.index === q.index) || null;
            return (
              <div
                key={q.index}
                className="rounded-xl border px-3 py-2"
                style={{
                  borderColor: q.correct ? `${theme.accent}55` : 'rgba(255,255,255,0.10)',
                  background: q.correct ? `${theme.accent}12` : 'rgba(255,255,255,0.03)',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="w-5 shrink-0 text-[11px] font-black tabular-nums text-white/45">
                      {q.index + 1}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black"
                      style={{
                        background: q.correct ? theme.accent : 'rgba(255,255,255,0.12)',
                        color: q.correct ? '#1B2631' : 'rgba(255,255,255,0.55)',
                      }}
                    >
                      {q.correct ? 'せいかい' : 'ちがう'}
                    </span>
                    <span className="truncate text-[11px] font-bold text-white/55">
                      {question
                        ? question.options[question.answerIndex] ??
                          question.panelOrder.map((i) => question.options[i]).join('')
                        : ''}
                    </span>
                  </span>
                  <span className="shrink-0 text-right text-[10px] font-bold tabular-nums text-white/45">
                    <span style={{ color: q.correct ? GOLD : 'rgba(255,255,255,0.35)' }}>
                      {q.total}
                    </span>
                    <span className="text-white/25"> / </span>
                    {other?.total ?? 0}
                  </span>
                </div>
                {q.correct && (
                  <p className="mt-0.5 pl-7 text-[9px] font-bold text-white/35">
                    {q.timeUsed.toFixed(1)}秒 ／ 速さ +{q.speed}
                    {q.streak > 0 && ` ／ 連続 +${q.streak}`}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <p className="mb-2 text-center text-[10px] font-bold leading-relaxed text-white/30">
        点数は両方の端末で同じ計算をして、
        <br />
        一致したときだけレートに反映されます。
      </p>
    </BattleShell>
  );
}
