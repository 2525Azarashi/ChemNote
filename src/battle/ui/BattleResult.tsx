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
 *
 * -------------------------------------------------------------------
 * ★★「答え＋ひと言の理由＋この単元を演習する」を出す理由（請求⑦-A）★★
 * -------------------------------------------------------------------
 * このアプリの構造は
 *
 *     ① オンライン対戦  ⇒  ② 演習・インプット
 *
 * である。①だけで終わると「楽しかった」で終わり、
 * 間違えた問題は間違えたままになる。
 * 負けた直後は「なんでこれが答えなの」がいちばん知りたい瞬間なので、
 * そこで ★答え・ひと言の理由・その単元の演習への入口★ を並べる。
 *
 * ■ ★なぜ試合中ではなく試合後なのか★
 *   試合中に理由まで出すと、画面を見せ合える環境（同じ教室）で
 *   相手に答えが渡る。だから解答は試合が終わってからまとめて出す。
 *
 * ■ ★答えのデータをここで動的 import する理由★
 *   1行解答（oneLine）は出題プールとは別のファイルに分けてある
 *   （data/answer.<教科>.generated.ts）。出題プールは対戦開始前に
 *   読み込まれるので、そこに答えを混ぜると通信を覗くだけで
 *   全問の答えが読めてしまう。この画面が出た時点ではもう試合は
 *   終わっているので、ここで初めて読む。
 *
 * ■ 読み込みに失敗しても画面は壊さない
 *   答えが出ないだけで、点数・レート・1問ずつの内訳は今までどおり出る。
 *   （リザルトが真っ白になるほうが、答えが出ないよりはるかに悪い）
 */

import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Minus,
  RotateCcw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { subjectTheme } from '../../data/subjectTheme';
// 外部教科（本体に教科データを持たない教科）の単元名
import { externalChapterTitleOf } from '../../data/externalSubjects';
import type { SubjectKey } from '../../data/allChapters';
import type {
  BattlePlayerScore,
  BattleQuestion,
  BattleResultSummary,
} from '../core/types';
import { loadBattleAnswers } from '../data/battlePool';
import { ratingTitle } from '../data/battleRanking';
/**
 * ★章名は「軽い索引」から引く（教科データ本体を読まない）★
 * data/chapterIndex.generated.ts は章ID・章名・大問数だけを持つ自動生成ファイルで、
 * 何も import しない葉モジュールである。ここで allChapters（約2.6MB）を
 * 引き込むと、対戦モードのチャンクに教科データ全部が入ってしまう。
 */
import { getChapterIndexOfSubject } from '../../data/chapterIndex.generated';
import {
  AMBER,
  BattleButton,
  BattleShell,
  GOLD,
  INK,
  INK_SUB,
  LINE,
  OutcomeBanner,
  PlayerBadge,
  WRONG,
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
      <p className="text-[10px] font-black" style={{ color: INK_SUB }}>
        {label}
      </p>
      <p className="battle-pop text-3xl font-black tabular-nums" style={{ color }}>
        {score?.score ?? 0}
      </p>
      <p className="text-[10px] font-bold" style={{ color: INK_SUB }}>
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
  onPractice,
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
  /**
   * ★「この単元を演習する」を押したとき（請求⑦-A）★
   *
   * 対戦（①）から演習（②）へ渡す橋。渡されなかったときはボタンを出さない
   * （＝この画面だけでは演習画面に行けないので、出すと押しても何も起きない）。
   * chapterId は BattleQuestion がそのまま持っている元データの章IDなので、
   * 受け側は既存の handleSelectChapter にそのまま流せる。
   */
  onPractice?: (subject: string, chapterId: string) => void;
}) {
  const theme = subjectTheme(subject as SubjectKey);
  const delta = rating ? rating.after - rating.before : 0;
  const title = ratingTitle(rating?.after ?? 1500);

  /**
   * ★試合後の1行解答（出題ID → 「答え＋ひと言の理由」）★
   *
   * この画面が出たときに初めて読む（対戦前には端末に落ちてこない）。
   * 読み込み前・失敗時は空の Map なので、答えの行が出ないだけで
   * 点数・レート・内訳は今までどおり表示される。
   */
  const [answers, setAnswers] = useState<ReadonlyMap<string, string>>(new Map());

  useEffect(() => {
    /**
     * ★片付け（cancelled）が必要な理由★
     * 「もう1回たいせん」を素早く押すとこの画面が消える。
     * そのあとに解答が届いて setAnswers すると、
     * 消えた部品への更新になって React が警告を出す。
     */
    let cancelled = false;
    loadBattleAnswers(subject)
      .then((map) => {
        if (!cancelled) setAnswers(map);
      })
      .catch(() => {
        // 答えが出ないだけで試合結果は読める。画面は壊さない。
      });
    return () => {
      cancelled = true;
    };
  }, [subject]);

  /**
   * 出題に出た章（重複を除く・出た順）。
   * 「この単元を演習する」の行をここから作る。
   *
   * ★間違えた章だけに絞らない理由★
   * 全問正解した試合でも「もっとやる」入口は要る。
   * ただし ★間違えた章を先に並べる★（下の sort）。いま直したいのはそこだから。
   */
  /**
   * 章ID → 章名（軽い索引から作る。無い章は章IDをそのまま出す）
   *
   * ★外部教科（本体に教科データを持たない教科）もここで拾う★
   * 高校入試 理科は本体の索引に載らないため、拾わないと
   * ★「ch01 を演習する」という生の記号がそのまま画面に出る★。
   * 何の単元なのか生徒に伝わらないので、外部教科の登録簿から名前を引く。
   */
  const chapterTitleOf = (chapterId: string): string => {
    const entry = getChapterIndexOfSubject(subject).find((c) => c.id === chapterId);
    const known = entry?.abstractTitle || entry?.realTitle || entry?.title;
    if (known) return known;
    return externalChapterTitleOf(subject, chapterId) || chapterId;
  };

  const chapterRows = (() => {
    const wrongChapters = new Set<string>();
    for (const s of result.me.perQuestion) {
      if (!s.correct) {
        const q = questions[s.index];
        if (q) wrongChapters.add(q.chapterId);
      }
    }
    const seen = new Map<string, { chapterId: string; wrong: boolean }>();
    for (const s of result.me.perQuestion) {
      const q = questions[s.index];
      if (!q || !q.chapterId || seen.has(q.chapterId)) continue;
      seen.set(q.chapterId, { chapterId: q.chapterId, wrong: wrongChapters.has(q.chapterId) });
    }
    return Array.from(seen.values()).sort((x, y) => Number(y.wrong) - Number(x.wrong));
  })();

  const deltaIcon =
    delta > 0 ? <TrendingUp size={16} /> : delta < 0 ? <TrendingDown size={16} /> : <Minus size={16} />;
  // ★ライト地なので「増えた」の色にゴールドを使わない★
  //   アイボリーの上では #F4D03F の数字が読めない。琥珀に置き換える。
  const deltaColor = delta > 0 ? AMBER : delta < 0 ? WRONG : INK_SUB;

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
          style={{ background: `${GOLD}2E`, color: AMBER }}
        >
          相手の通信が切れたため、不戦勝あつかいになりました
          <br />
          （レートの変化は半分です）
        </p>
      )}

      {result.decidedByTime && (
        <p
          className="mb-3 rounded-xl px-3 py-2 text-center text-[11px] font-bold"
          style={{ background: '#2E86C114', color: '#2E86C1' }}
        >
          同点だったので、解答時間の合計で決まりました
        </p>
      )}

      {/* 点数 */}
      <section
        className="battle-card-in mb-4 rounded-3xl border-2 p-4"
        style={{ borderColor: LINE, background: '#FFFFFF' }}
      >
        <div className="mb-3 flex items-center gap-2">
          <PlayerBadge
            nickname={meNickname}
            photoURL={mePhotoURL}
            rating={rating?.before ?? 1500}
            isMe
          />
          <span
            className="battle-vs-pulse shrink-0 rounded-lg px-1.5 py-0.5 text-xs font-black"
            style={{ background: GOLD, color: INK }}
          >
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
          <ScoreColumn score={result.me} label="あなた" color={AMBER} />
          <span className="px-2" style={{ color: LINE }}>
            —
          </span>
          <ScoreColumn score={result.opponent} label="あいて" color={INK_SUB} />
        </div>
      </section>

      {/* レート */}
      <section
        className="mb-4 flex items-center justify-between rounded-2xl border-2 px-4 py-3"
        style={{ borderColor: `${title.color}44`, background: `${title.color}10` }}
      >
        <div>
          <p className="text-[10px] font-black" style={{ color: INK_SUB }}>
            レート
          </p>
          {rating ? (
            <p className="flex items-baseline gap-1.5">
              <span
                className="text-sm font-bold tabular-nums"
                style={{ color: INK_SUB }}
              >
                {rating.before}
              </span>
              <span style={{ color: INK_SUB }}>→</span>
              <span
                className="battle-pop text-2xl font-black tabular-nums"
                style={{ color: title.color, '--pop-delay': '0.2s' } as CSSProperties}
              >
                {rating.after}
              </span>
            </p>
          ) : (
            <p className="text-xs font-bold" style={{ color: INK_SUB }}>
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

      {/* 1問ずつの内訳 ＋ ★試合後の答えとひと言の理由（請求⑦-A）★ */}
      <section id="battle-result-detail" className="mb-4">
        <h2 className="mb-2 text-xs font-black" style={{ color: INK_SUB }}>
          1問ずつのけっか（答えあわせ）
        </h2>
        <div className="grid gap-1.5">
          {result.me.perQuestion.map((q) => {
            const question = questions[q.index];
            const other = result.opponent?.perQuestion.find((o) => o.index === q.index) || null;
            /**
             * ★正解の文字列★
             * choice 系は options[answerIndex]、kana は panelOrder から組み立てる。
             * （プールは答えの文字列そのものを持たない設計なので、ここで作る）
             */
            const correctText = question
              ? question.options[question.answerIndex] ??
                question.panelOrder.map((i) => question.options[i]).join('')
              : '';
            /**
             * ★ひと言の理由（oneLine）★
             * 手書き問題だけが持つ。機械生成の問題では undefined になるので、
             * その場合は理由の行を出さない（空の欄を出すと壊れて見える）。
             */
            const oneLine = question ? answers.get(question.id) : undefined;
            return (
              <div
                key={q.index}
                className="rounded-xl border-2 px-3 py-2"
                style={{
                  borderColor: q.correct ? `${theme.accent}55` : LINE,
                  background: q.correct ? `${theme.accent}12` : '#FFFFFF',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="w-5 shrink-0 text-[11px] font-black tabular-nums"
                      style={{ color: INK_SUB }}
                    >
                      {q.index + 1}
                    </span>
                    <span
                      className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-black"
                      style={{
                        background: q.correct ? theme.accent : `${WRONG}14`,
                        color: q.correct ? '#FFFFFF' : WRONG,
                      }}
                    >
                      {q.correct ? 'せいかい' : 'ちがう'}
                    </span>
                    {/*
                      ★ここは「正解」を出している欄★（試合中には出していない）
                      kana 形式は options が空なので panelOrder から組み立てる。
                      正解が空になることはないが、万一空でも行は崩れない。
                    */}
                    <span className="truncate text-[11px] font-bold" style={{ color: INK }}>
                      {correctText}
                    </span>
                  </span>
                  <span
                    className="shrink-0 text-right text-[10px] font-bold tabular-nums"
                    style={{ color: INK_SUB }}
                  >
                    <span style={{ color: q.correct ? AMBER : INK_SUB }}>{q.total}</span>
                    <span style={{ color: LINE }}> / </span>
                    {other?.total ?? 0}
                  </span>
                </div>
                {q.correct && (
                  <p className="mt-0.5 pl-7 text-[9px] font-bold" style={{ color: INK_SUB }}>
                    {q.timeUsed.toFixed(1)}秒 ／ 速さ +{q.speed}
                    {q.streak > 0 && ` ／ 連続 +${q.streak}`}
                  </p>
                )}

                {/*
                  ★ひと言の理由（請求⑦-A）★
                  「答えは分かったが、なぜそれが答えなのか」がここで埋まる。
                  間違えた問題では枠を強めて、目が先にそこへ行くようにする。
                */}
                {oneLine && (
                  <p
                    className="mt-1.5 flex items-start gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-bold leading-relaxed"
                    style={{
                      background: q.correct ? '#FFFFFF' : `${AMBER}12`,
                      color: INK,
                      border: `1px solid ${q.correct ? LINE : `${AMBER}44`}`,
                    }}
                  >
                    <Lightbulb
                      size={12}
                      className="mt-px shrink-0"
                      style={{ color: q.correct ? INK_SUB : AMBER }}
                    />
                    <span>{oneLine}</span>
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/*
        ★★この単元を演習する（請求⑦-A の出口）★★

        ここが「① 対戦 ⇒ ② 演習」の橋である。
        対戦で出た章を並べ、★間違えた章を先に★ 出す。
        押すとその章の演習画面に飛ぶ（既存の単元選択と同じ入口を使う）。

        onPractice が渡されていないときは何も出さない。
        押しても何も起きないボタンを出すのは、無いより悪い。
      */}
      {onPractice && chapterRows.length > 0 && (
        <section className="mb-4">
          <h2 className="mb-2 text-xs font-black" style={{ color: INK_SUB }}>
            つづけて演習する
          </h2>
          <div className="grid gap-1.5">
            {chapterRows.map((row) => (
              <button
                key={row.chapterId}
                type="button"
                onClick={() => onPractice(subject, row.chapterId)}
                className="flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-left transition active:scale-[0.99]"
                style={{
                  borderColor: row.wrong ? `${AMBER}55` : LINE,
                  background: row.wrong ? `${AMBER}0E` : '#FFFFFF',
                }}
              >
                <BookOpen size={16} className="shrink-0" style={{ color: theme.accent }} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[11px] font-black" style={{ color: INK }}>
                    {chapterTitleOf(row.chapterId)}
                  </span>
                  <span className="block text-[9px] font-bold" style={{ color: INK_SUB }}>
                    {row.wrong ? '★まちがえた単元★ この単元を演習する' : 'この単元を演習する'}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      <p
        className="mb-2 text-center text-[10px] font-bold leading-relaxed"
        style={{ color: INK_SUB }}
      >
        点数は両方の端末で同じ計算をして、
        <br />
        一致したときだけレートに反映されます。
      </p>
    </BattleShell>
  );
}
