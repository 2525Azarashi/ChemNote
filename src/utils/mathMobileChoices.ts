/**
 * スマホの演習（数学）を4択にするための選択肢。
 *
 * ■ なぜ
 *   スマホで「x^2 + 1/2」「(3, -4)」を記号パレットで打つのは時間がかかり、
 *   計算はできているのに入力で疲れてしまう。スマホだけ4択にして、考えることに集中できるようにする。
 *   PC は今までどおり入力（書けるかどうかも確かめられる）。
 *
 * ■ 誤答の出どころ
 *   src/data/mathChoices.generated.json（scripts/math-choices/gen_choices.py が作る。手で編集しない）
 *   ・手書きの対戦4択の誤答（正解が一致するもの）
 *   ・典型的な誤りの形（符号・±1・2倍/半分・係数1つの取り違え）
 *   ・同じ単元の別の設問の答え（同じ形のものだけ）
 *   正解・別解と等しいものは sympy で機械的に除いてある。
 *
 * ■ 採点は変えない
 *   選んだ選択肢の文字列（＝正解なら correctAnswer そのもの）を入力欄の答えとして採点する。
 *   設問の type（short_answer）も変えないので、学習記録・復習の仕組みはそのまま。
 *
 * ■ 読み込み
 *   約80KBあるので、数学の演習を開いたときだけ読む（他の教科・PCでは読まない）。
 */
import { useEffect, useState } from 'react';

export type MathChoiceTable = Record<string, string[]>;
let cache: MathChoiceTable | null = null;
let loading: Promise<MathChoiceTable> | null = null;

export function loadMathChoices(): Promise<MathChoiceTable> {
  if (cache) return Promise.resolve(cache);
  loading ??= import('../data/mathChoices.generated.json').then((m) => {
    cache = (m.default ?? m) as MathChoiceTable;
    return cache;
  });
  return loading;
}

/** 数学のスマホ演習でだけ表を読み込む（それ以外は null のまま） */
export function useMathChoices(enabled: boolean): MathChoiceTable | null {
  const [table, setTable] = useState<MathChoiceTable | null>(enabled ? cache : null);
  useEffect(() => {
    if (!enabled) { setTable(null); return; }
    let alive = true;
    void loadMathChoices().then((t) => { if (alive) setTable(t); }).catch(() => {});
    return () => { alive = false; };
  }, [enabled]);
  return table;
}

/** 並びは設問IDから決める（開くたびに正解の位置が変わらないように） */
export function seededOrder(id: string, n: number): number[] {
  let h = 2166136261;
  for (let i = 0; i < id.length; i += 1) { h ^= id.charCodeAt(i); h = Math.imul(h, 16777619); }
  const idx = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i -= 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
    const j = h % (i + 1);
    [idx[i], idx[j]] = [idx[j]!, idx[i]!];
  }
  return idx;
}

/** 4択用に作り直した設問（MultipleChoiceControl にそのまま渡せる形）。作れなければ null */
export function asMobileChoiceSub<T extends { id: string; type?: string; correctAnswer?: unknown }>(
  sq: T,
  table: MathChoiceTable | null,
): (T & { options: string[] }) | null {
  if (!table || sq.type !== 'short_answer') return null;
  const wrong = table[sq.id];
  if (!Array.isArray(wrong) || wrong.length !== 3) return null;
  const all = [String(sq.correctAnswer ?? ''), ...wrong];
  return { ...sq, options: seededOrder(sq.id, all.length).map((i) => all[i]!) };
}
