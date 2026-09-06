// このファイルは tools/build_app_pack.py が自動生成します。手で直さないでください。
// 原典: 三重県後期選抜入試対策理科最終プリント

/**
 * 答え合わせ。画面に依存しない純粋な関数だけを置く。
 * web版（drill.html）と同じ判定になるようにしている。
 */

/**
 * 全角の記号・英数字を半角にそろえる。
 *
 * ★英数字だけでは足りない★
 *   原典は「＋極」「１０００ｍＡ＝１Ａ」のように記号まで全角で書いてある。
 *   生徒がふつうに打つのは半角の「+極」「1000mA=1A」なので、
 *   英数字しか変換しないと正解なのに×になる（実際に外れた）。
 *   U+FF01〜U+FF5E は ASCII 0x21〜0x7E と1対1に並んでいるので
 *   この範囲をまとめて落とす。全角スペースはこのあとの空白除去で消える。
 */
const z2h = (s: string): string =>
  s.replace(/[\uFF01-\uFF5E]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0xfee0))

/** 比べる前に、書き方のゆれを取り除く */
export function norm(s: string): string {
  let t = (s || '').trim()
  t = z2h(t).toLowerCase()
  t = t.replace(/[\s\u3000]/g, '')
  t = t.replace(/[（）()「」『』［］\[\]｛｝{}]/g, '')
  t = t.replace(/[、。,.\u30fb・…‥\-ー－—~〜]/g, '')
  return t
}

/** カタカナをひらがなにする（「ホウ酸」「ほう酸」のような原典内のゆれ用） */
export function kana(s: string): string {
  return norm(s).replace(/[\u30a1-\u30f6]/g, (c) =>
    String.fromCharCode(c.charCodeAt(0) - 0x60))
}

/** 記述の答え合わせ */
export function same(a: string, b: string): boolean {
  if (!a || !b) return false
  return norm(a) === norm(b) || kana(a) === kana(b)
}

/** 選択肢の取り出し（noUncheckedIndexedAccess でも通る形） */
export function optionAt(options: readonly string[], i: number): string {
  const v = options[i]
  return typeof v === 'string' ? v : ''
}

/** 4択の答え合わせ */
export function judgeChoice(answerIndex: number, picked: number): boolean {
  return picked >= 0 && picked === answerIndex
}

/**
 * 記述の答え合わせ。
 * 「わからない」を押したときは空文字が来るので、必ず不正解にする。
 */
export function judgeWord(answer: string, given: string): boolean {
  if (!given || !given.trim()) return false
  return same(answer, given)
}

export const BLANK_MARK = '［　？　］'

/**
 * 穴埋めの問題文を、空欄で切り分ける。
 * 画面側は「文字 / 空欄 / 文字 …」の順に並べればよい。
 */
export function splitBlank(prompt: string): readonly string[] {
  return (prompt || '').split(BLANK_MARK)
}
