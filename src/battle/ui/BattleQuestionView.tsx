/**
 * ===================================================================
 * 対戦モード: 出題と解答の画面
 * ===================================================================
 *
 * ■ 3つの解答形式を1画面で扱う
 *   choice4 … 4つの選択肢から選ぶ（元から4択の問題）
 *   word    … 4つの語句カードから選ぶ（元が短答・記述）
 *   panel   … 文字パネルを順に押して語を組み立てる（元が短答の2〜5文字）
 *
 * ★手で入力する形式を1つも作っていない★
 * 制限時間が10〜30秒しかないところに日本語IMEの変換が入ると、
 * 端末やIMEの差で実力と関係なく勝敗が決まってしまう。
 * 「押すだけ」で答えられる形に統一している。
 *
 * -------------------------------------------------------------------
 * ■ 答えた直後に正解を見せない
 * -------------------------------------------------------------------
 * 相手がまだ考えている間に自分の画面で正解が分かると、
 * 画面を見せ合える環境（教室・通話）で不正ができてしまう。
 * ★両者が答えるか締切が来るまで、正解は隠す。★
 * 自分が押した選択肢だけを「選択中」として示す。
 */

import type { ReactNode } from 'react';
import { Check, Hourglass, RotateCcw } from 'lucide-react';

import { subjectTheme } from '../../data/subjectTheme';
import type { SubjectKey } from '../../data/allChapters';
import type { BattleQuestion } from '../core/types';
import { GOLD, NAVY, TimeBar } from './BattleParts';

/** 空欄の目印（生成スクリプトと同じ文字列） */
const BLANK_MARK = '［　？　］';

interface Props {
  question: BattleQuestion;
  /** 何問目か（0始まり） */
  index: number;
  total: number;
  remainMs: number;
  answered: boolean;
  /**
   * 解答の受付を止めているか（★answered とは別の意味★）。
   *
   * answered は「自分がもう答えた」。
   * locked は「いま押しても解答として残らない」。
   * 圏外がこれに当たる。Firestore は圏外でも書き込みを端末に溜め、
   * 画面上は解答済みに見えるのに、通信が戻ったときには締切を過ぎていて
   * ルールに拒否される（＝答えたのに消える）。
   *
   * 2つを同じ値で扱うと「答えたのか、押せないだけなのか」が
   * 画面から区別できなくなるので、別の prop にしている。
   */
  locked?: boolean;
  /** 自分が選んだ選択肢 */
  myChoice: number;
  /** 自分が押したパネルの順 */
  myPanel: number[];
  /** 正解を見せてよい状態か（両者解答済み／締切後） */
  reveal: boolean;
  onChoose: (index: number) => void;
  onPushPanel: (index: number) => void;
  onPopPanel: () => void;
}

export function BattleQuestionView({
  question,
  index,
  total,
  remainMs,
  answered,
  locked = false,
  myChoice,
  myPanel,
  reveal,
  onChoose,
  onPushPanel,
  onPopPanel,
}: Props) {
  const theme = subjectTheme(question.subject as SubjectKey);

  return (
    <section id="battle-question" className="flex flex-1 flex-col">
      {/* 進捗と残り時間 */}
      <div className="mb-3">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-black text-white/70">
            <span style={{ color: GOLD }} className="text-base tabular-nums">
              {index + 1}
            </span>
            <span className="mx-0.5">/</span>
            {total}もん
          </p>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-black"
            style={{ background: `${theme.accent}33`, color: '#FFFFFF' }}
          >
            {formatLabel(question.format)}
          </span>
        </div>
        <TimeBar remainMs={remainMs} limitSec={question.timeLimit} />
      </div>

      {/* 問題文 */}
      <article
        className="mb-3 rounded-2xl border px-4 py-3.5"
        style={{
          borderColor: `${theme.accent}55`,
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        {question.prompt && (
          <p className="mb-2 text-[13px] leading-relaxed text-white/80">
            {renderWithBlank(question.prompt)}
          </p>
        )}
        <p className="text-[15px] font-bold leading-relaxed text-white">{question.label}</p>
      </article>

      {/* 解答欄 */}
      {question.format === 'panel' ? (
        <PanelAnswer
          question={question}
          answered={answered}
          locked={locked}
          myPanel={myPanel}
          reveal={reveal}
          onPush={onPushPanel}
          onPop={onPopPanel}
        />
      ) : (
        <ChoiceAnswer
          question={question}
          answered={answered}
          locked={locked}
          myChoice={myChoice}
          reveal={reveal}
          onChoose={onChoose}
        />
      )}

      {/* 待ちの案内 */}
      {answered && !reveal && (
        <p className="mt-3 flex items-center justify-center gap-1.5 text-xs font-bold text-white/50">
          <Hourglass size={13} className="animate-pulse" />
          あいてを まっています
        </p>
      )}
    </section>
  );
}

// ============================================================
// 4択・語句選択
// ============================================================

/**
 * 4つのカードから選ぶ。
 *
 * ★2列固定にしている理由★
 * 縦1列にすると、選択肢が長いとき下2つが画面外になり、
 * スクロールした人だけ不利になる。
 * 2列なら文字数の多い選択肢でも1画面に収まる。
 */
function ChoiceAnswer({
  question,
  answered,
  locked,
  myChoice,
  reveal,
  onChoose,
}: {
  question: BattleQuestion;
  answered: boolean;
  locked: boolean;
  myChoice: number;
  reveal: boolean;
  onChoose: (index: number) => void;
}) {
  // 選択肢が長いときは1列に落とす（2列だと1文字ずつ折り返して読めない）
  const longest = Math.max(...question.options.map((o) => o.length));
  const single = longest > 14;

  return (
    <div className={`grid gap-2 ${single ? 'grid-cols-1' : 'grid-cols-2'}`}>
      {question.options.map((option, i) => {
        const picked = myChoice === i;
        const correct = reveal && i === question.answerIndex;
        const wrongPick = reveal && picked && i !== question.answerIndex;

        // 色の決め方:
        //   正解が見えてよい状態 → 正解を金、自分の誤答を赤
        //   まだ見せない状態     → 自分が押したものだけ金枠
        const border = correct
          ? GOLD
          : wrongPick
            ? '#E74C3C'
            : picked
              ? GOLD
              : 'rgba(255,255,255,0.2)';
        const background = correct
          ? `${GOLD}22`
          : wrongPick
            ? '#E74C3C22'
            : picked
              ? `${GOLD}18`
              : 'rgba(255,255,255,0.05)';

        return (
          <button
            key={`${question.id}-${i}`}
            type="button"
            disabled={answered || locked}
            onClick={() => onChoose(i)}
            className="flex min-h-[58px] items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-2.5 text-center text-[13px] font-bold leading-snug text-white transition active:scale-[0.97] disabled:active:scale-100"
            // ★圏外のときだけ薄くする★
            // 解答済み（answered）では自分の選択を見せ続けたいので薄くしない。
            // 押せない理由（圏外）のときは、見た目でも伝わる必要がある。
            style={{ borderColor: border, background, opacity: locked && !answered ? 0.45 : 1 }}
          >
            {correct && <Check size={15} style={{ color: GOLD }} className="shrink-0" />}
            <span className="break-words">{option}</span>
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// 文字パネル
// ============================================================

/**
 * 文字パネルを順に押して語を組み立てる。
 *
 * ★手で入力する形式の代わり★
 * 4択だけだと「選択肢を見れば思い出せる」ので、
 * 用語を本当に覚えているかを問えない。
 * 文字パネルは自分で語を組み立てる必要があるため、
 * 手入力に近い手応えを、入力速度に左右されずに出せる。
 *
 * ★必要な文字数が並んだ瞬間に確定する★
 * 「決定」ボタンを押させると、その1タップぶん遅くなる。
 * 制限時間が短いので、その差が点数に出てしまう。
 */
function PanelAnswer({
  question,
  answered,
  locked,
  myPanel,
  reveal,
  onPush,
  onPop,
}: {
  question: BattleQuestion;
  answered: boolean;
  locked: boolean;
  myPanel: number[];
  reveal: boolean;
  onPush: (index: number) => void;
  onPop: () => void;
}) {
  const need = question.panelOrder.length;
  const correctText = question.panelOrder.map((i) => question.options[i]).join('');
  const myText = myPanel.map((i) => question.options[i]).join('');
  const isCorrect = reveal && myText === correctText;

  return (
    <div className="flex flex-col gap-3">
      {/* 組み立て中の欄 */}
      <div
        className="flex items-center justify-center gap-1.5 rounded-2xl border-2 px-3 py-3"
        style={{
          borderColor: reveal ? (isCorrect ? GOLD : '#E74C3C') : `${GOLD}66`,
          background: 'rgba(255,255,255,0.05)',
        }}
      >
        {Array.from({ length: need }).map((_, slot) => {
          const optionIndex = myPanel[slot];
          const filled = optionIndex !== undefined;
          return (
            <span
              key={`slot-${slot}`}
              className="flex h-11 w-11 items-center justify-center rounded-xl text-lg font-black"
              style={{
                background: filled ? GOLD : 'rgba(255,255,255,0.08)',
                color: filled ? NAVY : 'rgba(255,255,255,0.3)',
                border: filled ? 'none' : '2px dashed rgba(255,255,255,0.2)',
              }}
            >
              {filled ? question.options[optionIndex] : ''}
            </span>
          );
        })}
      </div>

      {/* 正解の表示（両者が答えた後だけ） */}
      {reveal && !isCorrect && (
        <p className="text-center text-xs font-bold" style={{ color: GOLD }}>
          こたえ: {correctText}
        </p>
      )}

      {/* 文字パネル */}
      <div className="flex flex-wrap justify-center gap-2">
        {question.options.map((char, i) => {
          const used = myPanel.includes(i);
          return (
            <button
              key={`${question.id}-panel-${i}`}
              type="button"
              disabled={answered || locked || used}
              onClick={() => onPush(i)}
              className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 text-xl font-black text-white transition active:scale-[0.94] disabled:opacity-25 disabled:active:scale-100"
              style={{
                borderColor: 'rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.07)',
              }}
            >
              {char}
            </button>
          );
        })}
      </div>

      {/* 1つ戻す */}
      {!answered && myPanel.length > 0 && (
        <button
          type="button"
          onClick={onPop}
          className="mx-auto flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-bold text-white/70"
          style={{ borderColor: 'rgba(255,255,255,0.25)' }}
        >
          <RotateCcw size={13} />
          1つもどす
        </button>
      )}
    </div>
  );
}

// ============================================================
// 表示のヘルパ
// ============================================================

function formatLabel(format: string): string {
  if (format === 'choice4') return '4つから えらぶ';
  if (format === 'word') return 'ことばを えらぶ';
  return 'もじを ならべる';
}

/**
 * 問題文の中の空欄を目立たせる。
 *
 * ★空欄を強調する理由★
 * 穴埋め問題は「長い文のどこか1箇所」を答える形なので、
 * どこを答えるのかが一目で分からないと、
 * 文章を読み直す時間だけで制限時間を使ってしまう。
 */
function renderWithBlank(text: string): ReactNode {
  if (!text.includes(BLANK_MARK)) return text;

  const parts = text.split(BLANK_MARK);
  return parts.map((part, i) => (
    <span key={`part-${i}`}>
      {part}
      {i < parts.length - 1 && (
        <mark
          className="mx-0.5 rounded px-1.5 py-0.5 text-[13px] font-black"
          style={{ background: GOLD, color: NAVY }}
        >
          ？
        </mark>
      )}
    </span>
  ));
}
