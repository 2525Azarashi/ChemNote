/**
 * ===================================================================
 * 英語リスニング：問題文（選択肢）と解答欄を同期させる整形のテスト
 * ===================================================================
 * ご要望：
 *   「英語リスニングでは問題文と解答欄を分離しないで。
 *     問題文(選択肢)と解答欄が同期するようにしたい。」
 *
 * 実装方針
 *   データ（problem.text）は書き換えず、Quiz の表示時に
 *     ① problem.text から ①〜④ の本文を取り出して解答欄のボタンに載せる
 *     ② 左ペインからは問N 以降のブロックを落として重複を消す
 *   という2つの整形を行う。
 *
 * ここが壊れると
 *   ・選択肢の本文と正解の対応がズレる（＝正しく解いても誤答になる）
 *   ・左右に同じ文が二重表示される（＝分離状態に逆戻り）
 * という致命的な不具合になるため、実データ全問で検証する。
 */
import { describe, it, expect } from 'vitest';
import {
  buildListeningOptionTexts,
  parseListeningOptionBlocks,
  stripListeningQuestionBlocks,
  subQuestionNumber,
} from '../src/utils/listeningOptions';
import { EL1_A_PROBLEMS } from '../src/data/englishListeningQ1AProblems';
import { EL1_A_EXTRA_PROBLEMS } from '../src/data/englishListeningQ1ASets';
import { EL1_B_PROBLEMS } from '../src/data/englishListeningQ1BProblems';

const MARKS = ['①', '②', '③', '④'];
const Q1A = [...EL1_A_PROBLEMS, ...EL1_A_EXTRA_PROBLEMS];

describe('parseListeningOptionBlocks：問題文から ①〜④ の本文を取り出す', () => {
  const TEXT = [
    '第2回　第1問 A（4問・2回読み）',
    '',
    '第1問 A では、短い英文が2回読まれます。',
    '',
    '────────────────────',
    '問1（話者：女性（高校生））',
    '① She went to bed early last night.',
    '② She plans to go to bed early tonight.',
    '③ She is not sleepy at all.',
    '④ She will stay up late tonight.',
    '',
    '────────────────────',
    '問2（話者：男性（会社員））',
    '① He found a seat on the train.',
    '② He drove to the office.',
    '③ He stood on the train the whole way.',
    '④ He took a bus to the office.',
  ].join('\n');

  it('設問番号ごとに 4件ずつ、順番どおりに取り出す', () => {
    const blocks = parseListeningOptionBlocks(TEXT);
    expect(blocks.size).toBe(2);
    expect(blocks.get(1)).toEqual([
      'She went to bed early last night.',
      'She plans to go to bed early tonight.',
      'She is not sleepy at all.',
      'She will stay up late tonight.',
    ]);
    expect(blocks.get(2)![2]).toBe('He stood on the train the whole way.');
  });

  it('マーク記号（①など）は本文から外す', () => {
    for (const bodies of parseListeningOptionBlocks(TEXT).values()) {
      for (const body of bodies) {
        expect(MARKS.some((m) => body.startsWith(m))).toBe(false);
      }
    }
  });

  it('①〜④が揃っていない設問は採用しない（中途半端な表示を防ぐ）', () => {
    const broken = ['問1', '① one', '② two', '③ three'].join('\n');
    expect(parseListeningOptionBlocks(broken).size).toBe(0);
  });

  it('選択肢を持たない問題文では何も取り出さない（イラスト選択・化学など）', () => {
    const noOptions = ['問1（話者：女性）', 'イラスト①〜④から選びなさい。'].join('\n');
    expect(parseListeningOptionBlocks(noOptions).size).toBe(0);
  });
});

describe('stripListeningQuestionBlocks：左ペインからは問N 以降を落とす', () => {
  it('リード文（指示文・解き方のコツ）は残す', () => {
    const out = stripListeningQuestionBlocks(
      '第1問 A の指示文です。\n\n【解き方のコツ】\nまず違いを言語化する。\n\n────────────────────\n問1（話者：女性）\n① aaa\n② bbb',
    );
    expect(out).toContain('第1問 A の指示文です。');
    expect(out).toContain('まず違いを言語化する。');
  });

  it('問N 以降（設問文・選択肢）と直前の区切り線は消す', () => {
    const out = stripListeningQuestionBlocks(
      'リード文\n\n────────────────────\n問1（話者：女性）\n① aaa\n② bbb',
    );
    expect(out).not.toContain('問1');
    expect(out).not.toContain('aaa');
    expect(out).not.toContain('─');
    expect(out).toBe('リード文');
  });

  it('問N を含まない文章は変えない（化学などに影響しない）', () => {
    const text = '次の文章を読み、下の問いに答えよ。\n\n実験1では…';
    expect(stripListeningQuestionBlocks(text)).toBe(text);
  });
});

describe('subQuestionNumber：ラベルから設問番号を読む', () => {
  it('「問2 …」から 2 を読む', () => {
    expect(subQuestionNumber({ label: '問2 話者の発話に最も近い英文' }, 0)).toBe(2);
  });

  it('番号が書かれていなければ並び順を使う', () => {
    expect(subQuestionNumber({ label: '発話に合うイラスト' }, 2)).toBe(3);
  });
});

describe('実データ検証：第1問A 全14セット（56問）', () => {
  it('すべてのセットで4問ぶんの選択肢本文が取り出せる', () => {
    for (const p of Q1A) {
      const map = buildListeningOptionTexts(p);
      expect(map.size, `${p.id} の選択肢本文が取り出せていない`).toBe(
        p.subQuestions.length,
      );
    }
  });

  it('選択肢本文は「設問IDごとに4件・空文字なし」', () => {
    for (const p of Q1A) {
      for (const sq of p.subQuestions as any[]) {
        const bodies = buildListeningOptionTexts(p).get(sq.id)!;
        expect(bodies.length).toBe(4);
        for (const body of bodies) expect(body.length).toBeGreaterThan(0);
      }
    }
  });

  it('正解のマークに対応する本文が、解説に載っている「正解の選択肢」と一致する', () => {
    // ここがズレると「正しく選んだのに誤答」になる。最重要の検証。
    //
    // 解説は「問1 …／問2 …」と行頭見出しで区切られているので、
    // まず設問ごとのブロックに切り分けてから照合する
    // （切らずに正規表現で拾うと隣の設問の行を掴んでしまう）。
    let checked = 0;
    for (const p of Q1A) {
      const blocks = new Map<string, string[]>();
      let cur: string | null = null;
      for (const line of p.explanation.split('\n')) {
        const head = line.match(/^\s*問\s*(\d+)/u);
        if (head) {
          cur = head[1];
          blocks.set(cur, [line]);
        } else if (cur) {
          blocks.get(cur)!.push(line);
        }
      }

      const map = buildListeningOptionTexts(p);
      for (const sq of p.subQuestions as any[]) {
        const bodies = map.get(sq.id)!;
        const picked = bodies[MARKS.indexOf(sq.correctAnswer)];
        expect(picked, `${sq.id}: 正解マークに対応する本文が無い`).toBeTruthy();

        const no = sq.id.slice(sq.id.lastIndexOf('_') + 1);
        const block = (blocks.get(no) || []).join('\n');
        const m = block.match(/正解の選択肢：(.+)/);
        // 手書きの第1回には「正解の選択肢：」行が無いのでスキップする
        if (!m) continue;
        expect(m[1].trim(), `${sq.id} の解説と選択肢本文が食い違っている`).toBe(picked);
        checked += 1;
      }
    }
    // PDF 由来の13セット（52問）は必ず照合できていること
    expect(checked).toBe(52);
  });

  it('左ペイン用に整形しても、リード文（指示文）は必ず残る', () => {
    for (const p of Q1A) {
      const lead = stripListeningQuestionBlocks(p.text);
      expect(lead.length, `${p.id} のリード文が空になっている`).toBeGreaterThan(20);
      // 選択肢の英文は残っていない（＝解答欄との重複が無い）
      expect(lead).not.toMatch(/^\s*[①②③④]/mu);
    }
  });
});

describe('実データ検証：第1問B（イラスト選択）は本文を持たない', () => {
  it('選択肢本文が無いので、マークのみのボタンになる', () => {
    for (const p of EL1_B_PROBLEMS) {
      expect(buildListeningOptionTexts(p).size).toBe(0);
    }
  });

  it('代わりに設問ごとのイラストを持っている（判断材料が解答欄の中にある）', () => {
    for (const p of EL1_B_PROBLEMS) {
      for (const sq of p.subQuestions as any[]) {
        expect(sq.imageUrl).toMatch(/^\/listening_q1b\/.+\.jpg$/);
      }
    }
  });
});
