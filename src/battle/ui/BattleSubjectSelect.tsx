/**
 * ===================================================================
 * BattleSubjectSelect — 対戦する教科をえらぶ
 * ===================================================================
 *
 * ★収録数をそのままカードに書く理由★
 * 教科によって使える小問の数が10倍以上ちがう（化学基礎763 / 地理25）。
 * 数を隠すと「地理で連戦したらまた同じ問題が出た＝バグ」と受け取られる。
 * 先に「25問から出ます」と書いておけば、同じ問題が回ってくることが
 * 仕様として理解できる。利用者からも
 * 「ただ 問題両少なかったらしんどい」と懸念が出ていた点なので、
 * 隠さずに見せる方針にした。
 *
 * ★索引（件数だけの軽い表）を使う理由★
 * 実際の問題データ（教科あたり16〜55KB）を読まなくても件数が分かる。
 * 教科選択の段階で全教科ぶん読み込むと 180KB になるので、
 * 件数だけを持つ軽い表（生成物）を見る。
 * 実データは「対戦が始まる教科1つだけ」を後から読む。
 *
 * ★POOL_COUNTS ではなく poolCountOf を使う★
 * POOL_COUNTS は形式を問わない総数なので、
 * そのルールで実際には出せない形式まで数に入ってしまう。
 * 例えば「収録159問」と書いてあるのに、ルールが使う形式は
 * その一部しか無い、という食い違いが起きる。
 * ★画面に出す数は必ず「そのルールで出せる数」でなければならない。★
 */

import { ArrowLeft, Info } from 'lucide-react';
import { subjectTheme } from '../../data/subjectTheme';
import type { SubjectKey } from '../../data/allChapters';
import { POOL_FORMAT_COUNTS, poolCountOf } from '../data/battlePool';
import { effectiveRule } from '../data/battle';
import { AMBER, BattleButton, BattleShell, BattleTitle, INK, INK_SUB, LINE } from './BattleParts';
import type { BattleAnswerFormat, BattleRule } from '../core/types';

/** 出題数に対して収録数が少ない教科の目印（1試合ぶんの3倍を下回るか） */
const THIN_POOL_FACTOR = 3;

function formatNote(rule: BattleRule, count: number): string {
  if (rule.note) return rule.note;
  if (count < rule.questionCount * THIN_POOL_FACTOR) {
    return '収録数が少ないため、同じ問題が出ることがあります';
  }
  return '';
}

export function BattleSubjectSelect({
  title,
  onPick,
  onBack,
}: {
  /** 「部屋をつくる」「相手をさがす」など、何のための選択かを出す */
  title: string;
  onPick: (subject: string) => void;
  onBack: () => void;
}) {
  // 収録があり、かつ有効な教科だけを並べる。
  // ★POOL_COUNTS の並び順をそのまま使う★
  //   生成器が「収録数の多い順」ではなく既存 SUBJECTS の順で書き出しているので、
  //   既存アプリの教科の並びと一致する（利用者が探す位置が変わらない）。
  const entries = Object.keys(POOL_FORMAT_COUNTS)
    .map((subject) => {
      const rule = effectiveRule(subject);
      return {
        subject,
        rule,
        // ★そのルールで実際に出せる数★（形式で絞った数）
        count: poolCountOf(subject, rule.formats),
        // かな入力（みんはや方式）が何問あるか。0なら案内も出さない。
        kanaCount: poolCountOf(subject, ['kana'] as BattleAnswerFormat[]),
      };
    })
    .filter((e) => e.rule.enabled && e.count > 0);

  return (
    <BattleShell
      footer={
        <BattleButton variant="ghost" onClick={onBack} icon={<ArrowLeft size={18} />}>
          もどる
        </BattleButton>
      }
    >
      <BattleTitle subtitle={title} />

      {/* ★「キーボード入力はありません」と書けなくなった★
          五十音キーボードで1文字ずつ押す形式を入れたので、
          「えらぶだけ」ではなくなっている。
          ただし手打ち入力（IMEの変換）は今も1つも無いので、
          そこを取り違えないように書き分けている。 */}
      <p
        className="mb-3 flex items-start gap-1.5 text-[11px] font-bold leading-relaxed"
        style={{ color: INK_SUB }}
      >
        <Info size={13} className="mt-0.5 shrink-0" />
        <span>
          制限時間は問題ごとにちがいます（およそ8〜30秒）。
          <br />
          答え方は「えらぶ」と「五十音を おす」の2つ。
          <br />
          文字を打ちこむ（へんかんする）ことはありません。
        </span>
      </p>

      <div className="grid gap-2.5">
        {entries.map(({ subject, count, kanaCount, rule }) => {
          const theme = subjectTheme(subject as SubjectKey);
          const note = formatNote(rule, count);
          // ★かな入力が混ざる教科だけに出す★
          // 地理やリスニングは0問なので、書くと嘘になる。
          const kanaPerMatch =
            kanaCount > 0 && rule.kanaShare > 0
              ? Math.min(Math.round(rule.questionCount * rule.kanaShare), kanaCount)
              : 0;

          return (
            <button
              key={subject}
              type="button"
              id={`battle-subject-${subject}`}
              onClick={() => onPick(subject)}
              className="w-full rounded-2xl border-2 px-4 py-3.5 text-left transition active:scale-[0.99]"
              style={{
                borderColor: `${theme.accent}66`,
                background: `${theme.accent}14`,
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-base font-black" style={{ color: theme.accent }}>
                  {theme.label}
                </span>
                <span
                  className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black tabular-nums"
                  // ★アイボリー地に白文字は読めない★
                  //   もとは color: '#FFFFFF' だったが、この画面は
                  //   紙の色（#FDFBF7）の上なので、白だとほぼ見えない。
                  style={{ background: `${theme.accent}2E`, color: INK }}
                >
                  {rule.questionCount}問しょうぶ
                </span>
              </div>

              <p className="mt-1 text-[11px] font-bold" style={{ color: INK_SUB }}>
                収録{' '}
                <span className="tabular-nums font-black" style={{ color: INK }}>
                  {count}
                </span>{' '}
                問
                {kanaPerMatch > 0 && (
                  <>
                    <span style={{ color: LINE }}> ｜ </span>
                    <span className="tabular-nums font-black" style={{ color: AMBER }}>
                      {kanaPerMatch}
                    </span>
                    <span style={{ color: AMBER }}> 問は 五十音で かく</span>
                  </>
                )}
              </p>

              {note && (
                // ★金（#F4D03F）は文字色に使えない★
                //   アイボリー地の上ではコントラストが1.5程度しかなく読めない。
                //   注意書きは読めることが目的なので AMBER を使う。
                <p className="mt-1.5 text-[10px] font-bold leading-relaxed" style={{ color: AMBER }}>
                  {note}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {entries.length === 0 && (
        <p className="py-10 text-center text-sm font-bold" style={{ color: INK_SUB }}>
          いま対戦できる教科がありません。
        </p>
      )}
    </BattleShell>
  );
}
