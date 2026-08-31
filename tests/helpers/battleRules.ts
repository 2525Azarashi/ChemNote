/**
 * ===================================================================
 * 対戦モードのルールを含む「本番と同じ1枚のルール」を返す
 * ===================================================================
 *
 * ■ 経緯（★ここが変わっている。読んでから触ること★）
 *
 * 対戦モードは当初「新規ファイルだけを渡し、既存ファイルへの変更は
 * 指示書（MANUAL_PATCH.md）で伝える」という受け渡し方式で作られていた。
 * そのため firestore.rules 本体には手を入れず、追記ぶんを
 * firestore.rules.battle-append.txt に別置きし、
 * ★このヘルパーがテスト時に本体＋追記を結合していた。★
 *
 * リポジトリへ取り込む段階で、追記ぶんは firestore.rules 本体の
 * 正しい位置（documents の閉じ括弧の直前）へ実際に貼り付けた。
 * 理由：deploy が読むのは firestore.rules だけなので、
 * 本体に入っていなければ本番のルールに対戦のぶんが存在しない。
 *
 * ■ ★結合をやめた理由（偽陰性の回避）★
 *
 * 本体へ取り込んだあとも結合を続けると、対戦のルールが2重に入る。
 * Firestore のルールは同じ match が2つあってもエラーにならず、
 * ★どちらか一方が許可すれば通る★ という評価をする。
 * つまり検査を1つ壊しても「もう片方が許可する」ので
 * assertFails のテストが緑のまま＝見張り役が嘘をつく状態になる。
 *
 * よって MANUAL_PATCH.md §7-2 の「A（推奨）」に従い、
 *   ・firestore.rules.battle-append.txt は削除
 *   ・この関数は本体を読むだけ
 * とした。
 *
 * ■ それでも検査は残す
 *
 * 「本体だけ返す」に変えた瞬間、取り込みが巻き戻された場合に
 * 対戦のルールが1行も無い状態を検査してしまい、
 * 全部 assertFails で通る偽の緑になる。
 * だから ★battle_rooms の match があることを必ず確認して throw する。★
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(__dirname, '..', '..');

/** 既存ルール本体のパス（対戦モードのぶんも取り込み済み） */
export const BASE_RULES_PATH = resolve(ROOT, 'firestore.rules');

/**
 * 本番と同じ1枚のルールを返す。
 *
 * ★テストは必ずこれを使う。★
 * 名前を mergedRules のまま残しているのは、
 * 呼び出し側（battle.rules.test.ts / battle.exploit.test.ts）を
 * 触らずに済ませるため。中身は「本体を読むだけ」になった。
 */
export function mergedRules(): string {
  const rules = readFileSync(BASE_RULES_PATH, 'utf8');

  // 取り込みが巻き戻された事故を検出する（黙って通さない）。
  if (!rules.includes('match /battle_rooms/')) {
    throw new Error(
      'firestore.rules に battle_rooms のルールが無い。' +
        '対戦モードの追記ぶんが本体から失われている（deploy しても権限エラーになる）。',
    );
  }
  return rules;
}
