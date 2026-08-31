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
 * ★POOL_COUNTS を使う理由★
 * 実際の問題データ（教科あたり16〜222KB）を読まなくても件数が分かる。
 * 教科選択の段階で7教科ぶん読み込むと 494KB になるので、
 * 件数だけを持つ軽い表（生成物）を見る。
 * 実データは「対戦が始まる教科1つだけ」を後から読む。
 */

import { ArrowLeft, Info } from 'lucide-react';
import { subjectTheme } from '../../data/subjectTheme';
import type { SubjectKey } from '../../data/allChapters';
import { POOL_COUNTS } from '../data/battlePool';
import { effectiveRule } from '../data/battle';
import { BattleButton, BattleShell, BattleTitle, GOLD } from './BattleParts';
import type { BattleRule } from '../core/types';

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
  const entries = Object.keys(POOL_COUNTS)
    .map((subject) => ({
      subject,
      count: POOL_COUNTS[subject] || 0,
      rule: effectiveRule(subject),
    }))
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

      <p className="mb-3 flex items-start gap-1.5 text-[11px] font-bold leading-relaxed text-white/50">
        <Info size={13} className="mt-0.5 shrink-0" />
        <span>
          制限時間は問題ごとにちがいます（およそ8〜30秒）。
          <br />
          答え方は「えらぶ」だけで、キーボード入力はありません。
        </span>
      </p>

      <div className="grid gap-2.5">
        {entries.map(({ subject, count, rule }) => {
          const theme = subjectTheme(subject as SubjectKey);
          const note = formatNote(rule, count);

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
                  style={{ background: `${theme.accent}2E`, color: '#FFFFFF' }}
                >
                  {rule.questionCount}問しょうぶ
                </span>
              </div>

              <p className="mt-1 text-[11px] font-bold text-white/50">
                収録 <span className="tabular-nums text-white/75">{count}</span> 問
              </p>

              {note && (
                <p className="mt-1.5 text-[10px] font-bold leading-relaxed" style={{ color: GOLD }}>
                  {note}
                </p>
              )}
            </button>
          );
        })}
      </div>

      {entries.length === 0 && (
        <p className="py-10 text-center text-sm font-bold text-white/60">
          いま対戦できる教科がありません。
        </p>
      )}
    </BattleShell>
  );
}
