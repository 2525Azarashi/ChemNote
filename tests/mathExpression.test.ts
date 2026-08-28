/**
 * =====================================================================
 * 数式の同一視（src/utils/mathExpression.ts）を固定するテスト
 * =====================================================================
 *
 * ■ このテストが守っているもの
 *
 *   ① 実際に測って見つかった6件の誤判定が、二度と戻らないこと
 *   ② ★正解にしてはいけないものが正解にならないこと★（こちらが本命）
 *   ③ 化学・生物・英語の答えがこの層に入ってこないこと
 *   ④ このモジュールが葉のまま（他を import しない）であること
 *
 * ■ ★②を最重視する理由★
 *
 *   採点を緩めるコードは、緩めすぎたときに気づけない。
 *   ×が○になるのは生徒には見えないし、こちらにも報告が来ない。
 *   だから「これは○にしてはいけない」という側を厚く書く。
 *   救えない書き方が残るのは、これまでどおりの結果になるだけで害がない。
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  canonicalizeMathExpression,
  isMathematicallyEqual,
} from '../src/utils/mathExpression';
import { isAnswerCorrect } from '../src/utils/answerJudge';

const SRC = readFileSync(
  resolve(__dirname, '../src/utils/mathExpression.ts'),
  'utf-8',
);

/** コメントを外した本体。コメントの文字列でテストが満たされるのを防ぐ。 */
function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

/** 実際の採点入口を通した結果（ここが本番と同じ経路） */
function judge(correctAnswer: string, userAnswer: string): boolean {
  return isAnswerCorrect({ id: 'test', correctAnswer }, userAnswer);
}

// =====================================================================
describe('★実測した6件の誤判定が直っていること★', () => {
  // 直す前は、この6件すべてを不正解にしていた。
  const FIXED: Array<[string, string, string]> = [
    ['積分定数を小文字で書いた', 'x^5/5 + C', 'x^5/5 + c'],
    ['掛け算の記号を書いた', '2√x + C', '2*√x + C'],
    ['掛ける順番を変えた', '(2/3)x√x + C', 'x√x*2/3 + C'],
    ['足す順番を変えた', '2x + 3', '3 + 2x'],
    ['関数の後ろの空白と小文字', 'sin x + C', 'sinx + c'],
    ['分数と小数', '1/2', '0.5'],
  ];

  for (const [label, correct, user] of FIXED) {
    it(`${label}：「${correct}」に「${user}」は正解になる`, () => {
      expect(judge(correct, user)).toBe(true);
    });
  }

  it('係数を前に出す書き方も、分母に置く書き方も同じ式として扱う', () => {
    expect(judge('(1/5)x^5 + C', 'x^5/5 + C')).toBe(true);
    expect(judge('2x√x/3 + C', '(2x√x)/3 + C')).toBe(true);
    expect(judge('2√x + C', '√x*2 + C')).toBe(true);
  });
});

// =====================================================================
describe('★正解にしてはいけないもの（ここが本命）★', () => {
  it('積分定数の書き忘れは、これまでどおり不正解', () => {
    // 「+C 忘れは誤答」は問題データ側で決めた方針。緩和で壊してはいけない。
    expect(judge('x^5/5 + C', 'x^5/5')).toBe(false);
    expect(judge('2√x + C', '2√x')).toBe(false);
    expect(judge('sin x + C', 'sin x')).toBe(false);
  });

  it('累乗と数字の並びを混同しない（2^3 は 23 ではない）', () => {
    expect(judge('2^3', '23')).toBe(false);
    expect(isMathematicallyEqual('2^3', '23')).toBe(false);
    // 念のため、計算した値としては 8 になっていること
    expect(isMathematicallyEqual('2^3', '8')).toBe(true);
  });

  it('★展開と因数分解は別の式として扱う（問題の意図を壊さない）★', () => {
    // 「因数分解せよ」の答えに展開形を、
    // 「展開せよ」の答えに因数分解形を通してはいけない。
    expect(isMathematicallyEqual('(x+1)(x+2)', 'x^2+3x+2')).toBe(false);
    expect(isMathematicallyEqual('2(x+1)', '2x+2')).toBe(false);
    expect(isMathematicallyEqual('(x+1)^2', 'x^2+2x+1')).toBe(false);
  });

  it('係数が違う・項が違う式は不正解のまま', () => {
    expect(judge('2x + 3', '3x + 2')).toBe(false);
    expect(judge('2x + 3', '2x + 4')).toBe(false);
    expect(judge('x^2', 'x^3')).toBe(false);
    expect(judge('0.5', '0.05')).toBe(false);
  });

  it('割る向きが違う式は不正解のまま', () => {
    expect(isMathematicallyEqual('x/2', '2/x')).toBe(false);
    expect(isMathematicallyEqual('a/b', 'b/a')).toBe(false);
  });

  it('関数の中身が違う式は不正解のまま', () => {
    expect(isMathematicallyEqual('sinx*2', 'sin(2x)')).toBe(false);
    expect(isMathematicallyEqual('sin(x)', 'cos(x)')).toBe(false);
  });

  it('★どう読むか決められない書き方は判定しない（読み方を勝手に決めない）★', () => {
    // sin2x は sin(2x) とも sin(2)*x とも読める。
    // 決めて読むと、逆の意図で書いた生徒を取り違えて採点する。
    expect(canonicalizeMathExpression('sin2x')).toBeNull();
    expect(canonicalizeMathExpression('√2x')).toBeNull();
    expect(isMathematicallyEqual('sin2x', 'sin(2x)')).toBe(false);
    expect(isMathematicallyEqual('√2x', '√(2x)')).toBe(false);
  });

  it('かっこ付き・1文字・数字だけの引数は読み取れる', () => {
    expect(isMathematicallyEqual('√x', 'sqrt(x)')).toBe(true);
    expect(isMathematicallyEqual('sinθ', 'sin(θ)')).toBe(true);
    expect(isMathematicallyEqual('sin30', 'sin(30)')).toBe(true);
  });
});

// =====================================================================
describe('★化学・生物・英語の答えはこの層に入らない（門が効いている）★', () => {
  it('化学式は数式として読み取らない（H2O を H×2×O と読まない）', () => {
    // 数式として読むと H2O ＝ OH2 になってしまう。それを門で防いでいる。
    expect(canonicalizeMathExpression('H2O')).toBeNull();
    expect(canonicalizeMathExpression('NaCl')).toBeNull();
    expect(canonicalizeMathExpression('SO4^2-')).toBeNull();
    expect(canonicalizeMathExpression('CaCO3')).toBeNull();

    expect(judge('H2O', 'OH2')).toBe(false);
    expect(judge('NaCl', 'ClNa')).toBe(false);
    expect(judge('CaCO3', 'CO3Ca')).toBe(false);
    // 正しい答えはもちろん正解のまま
    expect(judge('H2O', 'H2O')).toBe(true);
  });

  it('単位つきの数値は数式として読み取らない', () => {
    expect(canonicalizeMathExpression('40mL')).toBeNull();
    expect(canonicalizeMathExpression('0.10mol/L')).toBeNull();
    expect(judge('40mL', '40Lm')).toBe(false);
  });

  it('★英単語・用語は数式として読み取らない（並べ替えを正解にしない）★', () => {
    // 数式として読むと掛け算の順番を無視するため、
    // listen と silent、he と eh が同じ式になってしまう。
    expect(canonicalizeMathExpression('listen')).toBeNull();
    expect(canonicalizeMathExpression('he')).toBeNull();
    expect(canonicalizeMathExpression('mol')).toBeNull();

    expect(judge('listen', 'silent')).toBe(false);
    expect(judge('he', 'eh')).toBe(false);
    expect(judge('cat', 'act')).toBe(false);
    expect(judge('mol', 'lom')).toBe(false);
    expect(judge('2mol', '2lom')).toBe(false);
  });

  it('組合せ・順列の記法は数式として読み取らない（5C3 と 3C5 を混同しない）', () => {
    expect(canonicalizeMathExpression('5C3')).toBeNull();
    expect(canonicalizeMathExpression('nP2')).toBeNull();
    expect(judge('5C3', '3C5')).toBe(false);
  });

  it('日本語の答えは数式として読み取らない', () => {
    expect(canonicalizeMathExpression('ろ過')).toBeNull();
    expect(canonicalizeMathExpression('酸化還元反応')).toBeNull();
  });

  it('空・空白だけは判定しない', () => {
    expect(canonicalizeMathExpression('')).toBeNull();
    expect(canonicalizeMathExpression('   ')).toBeNull();
    expect(isMathematicallyEqual('', '')).toBe(false);
  });
});

// =====================================================================
describe('★大文字を通す例外は「行末の +C」だけ★', () => {
  it('行末の +C は小文字 c と同じ扱いになる', () => {
    expect(isMathematicallyEqual('x+C', 'x+c')).toBe(true);
  });

  it('式の途中の大文字は救わない（化学式を守るため）', () => {
    // ここを緩めると H2O が入ってきてしまう。
    expect(canonicalizeMathExpression('C+x')).toBeNull();
    expect(canonicalizeMathExpression('2C')).toBeNull();
    expect(canonicalizeMathExpression('x+Cy')).toBeNull();
  });
});

// =====================================================================
describe('健全性', () => {
  it('★mathExpression.ts は葉のまま（他モジュールを import しない）★', () => {
    // 採点の中心にある純粋な計算。画面・通信・教科データに触れさせない。
    const body = stripComments(SRC);
    expect(body).not.toMatch(/^\s*import\s/m);
    expect(body).not.toContain('require(');
  });

  it('★NFKC を使っていない（上付き文字を潰すと別の数値を正解にする）★', () => {
    const body = stripComments(SRC);
    expect(body).not.toContain('NFKC');
  });

  it('数式として読めないときは null を返す（例外を投げない）', () => {
    const WEIRD = ['((((', ')))', '1/0', '+', '-', '^', '*', '/', '()', '1+'];
    for (const input of WEIRD) {
      expect(() => canonicalizeMathExpression(input)).not.toThrow();
    }
  });

  it('同じ式を2回読ませたら同じ形になる（判定がぶれない）', () => {
    for (const input of ['2x+3', '(2/3)x√x+c', 'sin(x)+c', '1/2']) {
      expect(canonicalizeMathExpression(input)).toBe(
        canonicalizeMathExpression(input),
      );
    }
  });
});
