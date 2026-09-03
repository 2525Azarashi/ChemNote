/**
 * ===================================================================
 * 高校入試 理科 — 3画面の入口
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ なぜこのファイルが必要なのか
 * -------------------------------------------------------------------
 * 受け取った理科の一式には、独立した3つの画面が入っている。
 *
 *   RikaPractice … 演習（条件を選んで1問ずつ解く）
 *   RikaSummary  … まとめ（32単元 / 163節）
 *   RikaTrend    … 出題傾向（★原典外・調べて作成★）
 *
 * この3つは ★どれも props を取らない自己完結型★ で、
 * 互いを呼び出す作りにもなっていない。つまり
 * 「どこから開くか」はアプリ側が決めなければならない。
 *
 * -------------------------------------------------------------------
 * ■ 既存の画面の流れに乗せられない理由
 * -------------------------------------------------------------------
 * 本体の教科は
 *
 *   教科を選ぶ → 学び方を選ぶ → 単元を選ぶ → 解く → 答え合わせ
 *
 * という流れで、単元選択も演習も本体の共通画面が担っている。
 * これは「章・大問・小問」という本体の形にデータが入っている前提。
 *
 * 理科はその形を持たない（原典が配布プリントで、空欄1つが1問）。
 * 単元の絞り込みも問題の出し方も ★RikaPractice が自分で持っている★。
 * だから本体の単元選択画面には並べられないし、並べる必要もない。
 *
 * そこで理科は「1つの入口の中で3画面を行き来する」形にした。
 * 本体の画面遷移をいじらずに済み、理科側のファイルも1行も直さなくてよい。
 *
 * -------------------------------------------------------------------
 * ■ ★理科側のファイルには手を入れない★
 * -------------------------------------------------------------------
 * このファイルがすることは
 *   ・3つのうちどれを出すかの切り替え
 *   ・「もどる」を1つ置く
 * だけである。中身の見た目・文言・データには触らない。
 *
 * 特に RikaTrend は原典に無い内容なので、
 *   ・「調べて作成（原典外）」のバッジ
 *   ・他画面と違う青系の見た目（クラス名 rikat-）
 *   ・下部の出典URL（20本）
 * の3つを外さない約束がある。中身を触らないので自動的に守られる。
 *
 * -------------------------------------------------------------------
 * ■ 3画面を必要になるまで読み込まない
 * -------------------------------------------------------------------
 * 理科のデータは合計で約900KB ある
 * （rikaData.ts 約570KB ＋ rikaSummaryData.ts 約260KB ほか）。
 * 入口を開いた時点で全部読むと、演習しか使わない生徒にも
 * まとめのデータを読ませることになる。
 * そこで3画面それぞれを React.lazy で分け、
 * ★押されたタブの分だけ読み込む★ ようにしている。
 */

import type React from 'react';
import { lazy, Suspense, useState } from 'react';

/**
 * ★それぞれを別に読み込む（まとめて import しない）★
 * import { RikaPractice, RikaSummary } のように書くと、
 * 3画面ぶんのデータが1つのまとまりになって同時に読み込まれる。
 */
const RikaPractice = lazy(() => import('./RikaPractice'));
const RikaSummary = lazy(() => import('./RikaSummary'));
const RikaTrend = lazy(() => import('./RikaTrend'));

/** 出している画面 */
type RikaTab = 'practice' | 'summary' | 'trend';

interface RikaHomeProps {
  /** もどる（呼び出し側の画面へ帰す） */
  onBack: () => void;
  /**
   * 最初に出す画面。
   * 対戦の結果から「この単元を演習する」で来たときは演習を出したいので、
   * 呼び出し側が指定できるようにしている。
   */
  initialTab?: RikaTab;
}

/**
 * 見た目について。
 *
 * 理科の3画面は自前の CSS（rika- / rikas- / rikat-）を持っていて、
 * アプリ本体の Tailwind とは別に完成している。
 * ここで色や余白を足すと二重になって崩れるので、
 * ★このファイルは「もどる」とタブだけを置き、中身の見た目には触らない★。
 *
 * タブの色は対戦の教科カードと同じ理科の色
 * （src/data/externalSubjects.ts のバイオレット）に合わせて、
 * 「いま理科を見ている」ことが分かるようにしてある。
 */
const RIKA_ACCENT = '#7B4FA8';
const RIKA_ACCENT_SOFT = '#D6C4E7';
const INK = '#2C3E50';

const TABS: readonly { id: RikaTab; label: string }[] = [
  { id: 'practice', label: '演習' },
  { id: 'summary', label: 'まとめ' },
  { id: 'trend', label: '出題傾向' },
];

export default function RikaHome({ onBack, initialTab = 'practice' }: RikaHomeProps) {
  const [tab, setTab] = useState<RikaTab>(initialTab);

  return (
    <div className="w-full">
      {/* 見出しと「もどる」 */}
      <div className="mb-3 flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border-2 px-3 py-1.5 text-[12px] font-black transition active:scale-[0.98]"
          style={{ borderColor: `${RIKA_ACCENT}55`, color: RIKA_ACCENT, background: '#FFFFFF' }}
        >
          もどる
        </button>
        <span className="text-[13px] font-black" style={{ color: RIKA_ACCENT }}>
          高校入試 理科
        </span>
      </div>

      {/* タブ */}
      <div className="mb-3 flex gap-1.5">
        {TABS.map((item) => {
          const active = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              aria-current={active ? 'page' : undefined}
              className="flex-1 rounded-xl border-2 px-3 py-2 text-[12px] font-black transition active:scale-[0.98]"
              style={{
                borderColor: active ? RIKA_ACCENT : `${RIKA_ACCENT_SOFT}AA`,
                background: active ? `${RIKA_ACCENT}1A` : '#FFFFFF',
                color: active ? RIKA_ACCENT : INK,
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/*
        読み込み中は何も描かない（fallback={null}）。
        本体の他の遅延読み込み画面（単元選択・演習・まとめプリント）も
        同じく null にしてあるので、そこにそろえている。
        ここだけローディング表示を出すと、一瞬だけ出て消える表示が増える。
      */}
      <Suspense fallback={null}>
        {tab === 'practice' && <RikaPractice />}
        {tab === 'summary' && <RikaSummary />}
        {tab === 'trend' && <RikaTrend />}
      </Suspense>
    </div>
  );
}

/** 呼び出し側が初期タブを指定するときに使う */
export type { RikaTab };
