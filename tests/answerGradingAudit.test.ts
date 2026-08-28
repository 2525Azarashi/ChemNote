/**
 * =====================================================================
 * 全教科の答えを実データで総ざらいする検査
 * =====================================================================
 *
 * ■ なぜこの検査が必要か
 *
 *   採点を緩める変更は、緩めすぎたときに気づけない。
 *   ・× が ○ になる事故は、生徒の画面上は「正解した」と見えるだけ
 *   ・こちらにも報告が来ない
 *   つまり ★静かに間違い続ける★ 種類の不具合になる。
 *
 *   そこで、作った例文で確かめるのではなく
 *   ★実際に配信している全教科の正解データそのもの★を突き合わせる。
 *
 * ■ この検査が見ているもの
 *
 *   ① 自己一致：正解データそのものを入力したら正解になるか
 *      これが落ちる＝その問題は誰も正解できない。最優先の不具合。
 *
 *   ② 別解一致：問題データに書いた別解が全部正解になるか
 *      落ちる＝「これも正解にする」と書いたのに × にしている。
 *
 *   ③ ★取り違え★：別の問題の正解どうしが「同じ答え」と判定されないか
 *      落ちる＝別の問題の答えを書いても正解になる（採点が緩すぎる）。
 *
 * ■ ③に許容リストを置いている理由
 *
 *   「1」と「1.0」、「6」と「+6」は、数値としては同じ。
 *   これは数式の判定を入れる前から数値比較の層が同一視していたもので、
 *   設問文で符号や桁を指定している前提の問題なので実害がない。
 *   ★ただし件数を固定する。★
 *   新しく同一視される組が増えたら、この検査が落ちて気づける。
 *
 * ■ ★この検査だけでは足りないこと（役割分担）★
 *
 *   故障注入で実際に確かめた結果、次のように分かれた。
 *
 *     採点の門を壊したとき          この検査    単体テスト
 *     ──────────────────────────────────────────────────
 *     化学式が数式として読まれる      落ちる      落ちる
 *     （K2L8M2 ＝ K2 L8 M2 になる）
 *     英単語が数式として読まれる      落ちない    落ちる
 *     （listen ＝ silent になる）
 *
 *   英単語のほうが落ちないのは、いま配信している問題データの中に
 *   「小文字だけ・並べ替えると別の答えになる」組が入っていないため。
 *   ★つまり「実データで落ちない」は「安全」を意味しない。★
 *   並べ替えの事故は tests/mathExpression.test.ts が受け持つ。
 *   両方そろって初めて守られている。
 */

import { describe, it, expect } from 'vitest';
import { isAnswerCorrect, normalizeAnswer } from '../src/utils/answerJudge';
import { isEquivalentAnswer } from '../src/utils/answerEquivalence';
import { isMathematicallyEqual } from '../src/utils/mathExpression';
import { SUBJECTS, getChaptersOfSubject } from '../src/data/allChapters';

interface AnswerRow {
  subject: string;
  chapterId: string;
  subId: string;
  correct: string;
  accepted: string[];
}

/** 配信している全教科から、自動採点の対象になる答えを集める */
function collectAnswers(): AnswerRow[] {
  const rows: AnswerRow[] = [];
  for (const subject of SUBJECTS as ReadonlyArray<{ id: string }>) {
    for (const chapter of getChaptersOfSubject(subject.id)) {
      const problems = [
        ...(chapter?.practiceProblems ?? []),
        ...(chapter?.miniTest?.problems ?? []),
      ];
      for (const problem of problems) {
        for (const sq of problem?.subQuestions ?? []) {
          if (sq?.type === 'descriptive') continue; // 記述式は自動採点しない
          const correct = sq?.correctAnswer;
          if (typeof correct !== 'string' || !correct.trim()) continue;
          rows.push({
            subject: subject.id,
            chapterId: chapter.id,
            subId: sq.id,
            correct,
            accepted: Array.isArray(sq.acceptedAnswers) ? sq.acceptedAnswers : [],
          });
        }
      }
    }
  }
  return rows;
}

const ROWS = collectAnswers();

describe('全教科の正解データを実際に採点にかける', () => {
  it('検査の土台が空でない（データの形が変わったら気づけるように）', () => {
    // ★この検査が一番怖いのは「0件を調べて合格した」と出ること。★
    // 章の形（practiceProblems / miniTest）が変わって集められなくなったら、
    // 静かに何も検査しないテストになる。だから件数の下限を置く。
    expect(ROWS.length).toBeGreaterThan(1500);

    const subjects = new Set(ROWS.map((r) => r.subject));
    // 問題を持っている教科が一通り入っていること
    expect(subjects.has('chemistry_basic')).toBe(true);
    expect(subjects.has('math')).toBe(true);
    expect(subjects.has('biology_basic')).toBe(true);
    expect(subjects.has('english_grammar')).toBe(true);
  });

  it('★正解データそのものを入力したら必ず正解になる★', () => {
    // 落ちる＝その問題は誰も正解できない。
    const broken = ROWS.filter(
      (r) =>
        !isAnswerCorrect(
          { id: r.subId, correctAnswer: r.correct, acceptedAnswers: r.accepted },
          r.correct,
        ),
    ).map((r) => `${r.subject}/${r.chapterId}/${r.subId}: ${JSON.stringify(r.correct)}`);

    expect(broken, `正解データ自身が不正解になる設問:\n${broken.join('\n')}`).toEqual([]);
  });

  it('★問題データに書いた別解は全部正解になる★', () => {
    // 落ちる＝「これも正解にする」と書いたのに × にしている。
    const broken: string[] = [];
    for (const r of ROWS) {
      for (const accepted of r.accepted) {
        if (typeof accepted !== 'string' || !accepted.trim()) continue;
        const ok = isAnswerCorrect(
          { id: r.subId, correctAnswer: r.correct, acceptedAnswers: r.accepted },
          accepted,
        );
        if (!ok) {
          broken.push(`${r.subject}/${r.subId}: ${JSON.stringify(accepted)}`);
        }
      }
    }
    expect(broken, `別解が不正解になる設問:\n${broken.join('\n')}`).toEqual([]);
  });
});

describe('★別の問題の答えを書いて正解にならないこと（採点が緩すぎないか）★', () => {
  /**
   * 数値としては同じだが、設問文で符号・桁を指定している前提の組。
   * ★この6組は、数式の判定を入れる前から数値比較の層が同一視していた。★
   * （実測で確認済み：isNumericallyEqual が true を返す）
   * 新しく増えたものではないので、数式層の検査からは除く。
   */
  const KNOWN_NUMERIC_PAIRS: ReadonlyArray<readonly [string, string]> = [
    // 有効数字の書き方の違い。桁数は設問文で指定している。
    ['1', '1.0'],
    // 酸化数の符号。「+を付けて答えよ」は設問文で指定している。
    ['3', '+3'],
    ['4', '+4'],
    ['5', '+5'],
    ['6', '+6'],
    ['7', '+7'],
  ];

  function isKnownNumericPair(a: string, b: string): boolean {
    return KNOWN_NUMERIC_PAIRS.some(
      ([x, y]) => (a === x && b === y) || (a === y && b === x),
    );
  }

  /** 正解文字列の重複を除いたもの（同一文字列の組は数えても意味がない） */
  const UNIQUE = [...new Set(ROWS.map((r) => r.correct))];

  it('★数式としての同一視で、新しく取り違えられる組は1つも無い★', () => {
    // ここが今回入れた判定の責任範囲。
    // 数式として「同じ式」と判定される組は、
    // もともと数値比較で同じだった6組だけであること。
    const collisions: string[] = [];
    for (let i = 0; i < UNIQUE.length; i++) {
      for (let j = i + 1; j < UNIQUE.length; j++) {
        const a = UNIQUE[i];
        const b = UNIQUE[j];
        if (normalizeAnswer(a) === normalizeAnswer(b)) continue;
        if (!isMathematicallyEqual(a, b)) continue;
        if (isKnownNumericPair(a, b)) continue;
        collisions.push(`${JSON.stringify(a)} <=> ${JSON.stringify(b)}`);
      }
    }
    expect(
      collisions,
      '★数式の判定が緩すぎる★\n' +
        '別の問題の正解どうしが同じ式と判定されている:\n' +
        collisions.join('\n'),
    ).toEqual([]);
  });

  it('★化学式・英単語が並べ替えで正解にならない（門が効いている）★', () => {
    // 数式として読むと掛け算の順番を無視するため、
    // 門が外れると H2O ＝ OH2、listen ＝ silent になってしまう。
    const MUST_DIFFER: ReadonlyArray<readonly [string, string]> = [
      ['H2O', 'OH2'],
      ['NaCl', 'ClNa'],
      ['CaCO3', 'CO3Ca'],
      ['CO2', 'O2C'],
      ['listen', 'silent'],
      ['cat', 'act'],
      ['mol', 'lom'],
    ];
    for (const [a, b] of MUST_DIFFER) {
      expect(
        isAnswerCorrect({ id: 'x', correctAnswer: a }, b),
        `${a} に ${b} を正解にしてはいけない`,
      ).toBe(false);
      // 正しい答えはもちろん正解のまま
      expect(isAnswerCorrect({ id: 'x', correctAnswer: a }, a)).toBe(true);
    }
  });

  it('採点全体の緩さが増えていない（既知の件数を超えない）', () => {
    /*
      ここは「採点の緩さ全体」の見張り番。

      ★注意：下の件数は「全部が正しい」という意味ではない★
      内訳は、意図して入れてある緩和がほとんどである。
        ・選択肢記号の書き方       「イ」＝「（イ）」、「1」＝「①」
        ・化学用語の同義語辞書     「三角フラスコ」＝「コニカルビーカー」
                                   「一酸化炭素」＝「CO」
        ・単位つき数値の換算       「40」＝「40 mL」
      これらは別の設問の答えとしては衝突するが、
      設問文が何を聞いているかで区別される前提で入れてある。

      いっぽうで、見直したほうがよいものもこの中に含まれている。
        ・「0.10 mol/L」＝「0.100 mol/L」（有効数字の桁が違う）
      これは今回の数式の判定とは別の、数値比較の許容誤差が原因。
      ★今回の変更で増えたものではない★ため、ここでは件数を固定するだけにして、
      別の作業として扱う。

      この数を固定しておくと、
      採点を緩める変更をしたときに増えた分だけが検査に出る。
    */
    const collisions: string[] = [];
    for (let i = 0; i < UNIQUE.length; i++) {
      for (let j = i + 1; j < UNIQUE.length; j++) {
        const a = UNIQUE[i];
        const b = UNIQUE[j];
        if (normalizeAnswer(a) === normalizeAnswer(b)) continue;
        if (isEquivalentAnswer(a, b)) {
          collisions.push(`${JSON.stringify(a)} <=> ${JSON.stringify(b)}`);
        }
      }
    }

    // 実測した件数（数式の判定を入れた後）。増えたら気づけるようにする。
    const MEASURED = 60;
    expect(
      collisions.length,
      '★別の問題の答えが正解になる組が増えた★\n' +
        `既知 ${MEASURED} 件 → 今回 ${collisions.length} 件\n` +
        '採点を緩める変更が緩めすぎている可能性がある。増えた組を確認する。\n' +
        collisions.join('\n'),
    ).toBeLessThanOrEqual(MEASURED);
  });
});
