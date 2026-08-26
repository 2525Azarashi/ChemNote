/**
 * questionDisplay.test.ts — 設問マーカーの表示ルールの回帰テスト
 *
 * ■ 背景（この機能を作った理由）
 *   (1) の中がさらに ①② に枝分かれしている設問があり、
 *   解答欄に表示されるマーカーがどちらも "(1)" になっていた。
 *   そのため「今どの問題を解いているのか分からない」状態だった。
 *
 *     例) label: "(3)① 非共有電子対を最も多くもつ分子"
 *         label: "(3)② 非共有電子対をもたない分子（すべて）"
 *         → 解答欄はどちらも "(3)" と表示されていた
 *
 *   そこで枝番（①② / (a)(b) / （ア）（イ））をマーカー側に含め、
 *   "(3)①" "(3)②" と表示するようにした。
 *
 * ■ ここで守りたいこと
 *   1. 枝番がある設問は、解答欄マーカーで必ず区別できる
 *   2. 左側の「設問一覧」も同じマーカーで並ぶ（左右を見比べられる）
 *   3. 枝番が無い従来の設問の表示を壊さない
 *   4. 「（記述）」のような本文の括弧を枝番と誤認しない
 *   5. 実データに同一マーカーの重複が残っていない
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  splitQuestionLabel,
  answerCardMarker,
  buildSubQuestionList,
  joinMarker,
  resolveAnswerMarkers,
  isSubQuestionListRedundant,
  extractInlineQuestionRows,
} from '../src/utils/questionDisplay';

const card = (label: string, index = 0) => answerCardMarker({ label }, index);

/** 1問分の label 配列から、解答欄に出るマーカー一覧を得る */
const markersOf = (labels: string[]): string[] => {
  const subQuestions = labels.map((label) => ({ label }));
  const resolved = resolveAnswerMarkers({ subQuestions });
  return subQuestions.map((sq) => resolved.get(sq)!);
};

describe('splitQuestionLabel — 枝番（①② / (a) / （ア））の切り出し', () => {
  it.each([
    // label                                   marker  sub     body
    ['(3)① 非共有電子対を最も多くもつ分子', '(3)', '①', '非共有電子対を最も多くもつ分子'],
    ['(3)② 非共有電子対をもたない分子（すべて）', '(3)', '②', '非共有電子対をもたない分子（すべて）'],
    ['問1① 分子式で表されているもの（すべて）', '問1', '①', '分子式で表されているもの（すべて）'],
    ['問3② 融解すると電気を通す理由', '問3', '②', '融解すると電気を通す理由'],
    ['(5) (a) H₂ の分子の形', '(5)', '(a)', 'H₂ の分子の形'],
    ['問1(1) Ca²⁺ と Cl⁻ の組成式', '問1', '(1)', 'Ca²⁺ と Cl⁻ の組成式'],
  ])('%s → marker=%s sub=%s', (label, marker, sub, body) => {
    const r = splitQuestionLabel(label as string, '問X');
    expect(r.marker).toBe(marker);
    expect(r.subMarker).toBe(sub);
    expect(r.body).toBe(body);
  });

  it('本文を持たない枝番だけのラベルも枝番として扱う（リード文中の空欄）', () => {
    // "問2 ①" 〜 "問2 ⑩" は文章中の（ ① ）を埋める形式で、本文は無い
    const r = splitQuestionLabel('問2 ①', '問X');
    expect(r.marker).toBe('問2');
    expect(r.subMarker).toBe('①');
    expect(r.body).toBe('');
  });

  it('全角括弧の枝番も拾う', () => {
    const r = splitQuestionLabel('問1（あ）', '問X');
    expect(r.marker).toBe('問1');
    expect(r.subMarker).toBe('(あ)');
  });

  it('大問マーカーが無く丸数字で始まるラベルは、丸数字自体をマーカーにする', () => {
    const r = splitQuestionLabel('① 空欄に入る語句を答えよ。', '問X');
    expect(r.marker).toBe('①');
    expect(r.subMarker).toBe('');
    expect(r.body).toBe('空欄に入る語句を答えよ。');
  });
});

describe('splitQuestionLabel — 枝番と誤認してはいけないもの', () => {
  it.each([
    // 「（記述）」「（すべて）」などは本文の一部。枝番ではない
    ['(6) その理由（「価電子」を用いて記述）', '(6)', 'その理由（「価電子」を用いて記述）'],
    ['(2) 二重結合をもつ分子', '(2)', '二重結合をもつ分子'],
    ['(2) 同素体の説明と炭素以外の例（記述）', '(2)', '同素体の説明と炭素以外の例（記述）'],
    ['（1） 112 L の CH₄ を完全燃焼させたときに放出される熱量', '(1)', '112 L の CH₄ を完全燃焼させたときに放出される熱量'],
  ])('%s は枝番なし', (label, marker, body) => {
    const r = splitQuestionLabel(label as string, '問X');
    expect(r.marker).toBe(marker);
    expect(r.subMarker).toBe('');
    expect(r.body).toBe(body);
  });

  it('括弧の中身が3文字以上なら枝番にしない（本文の括弧を守る）', () => {
    const r = splitQuestionLabel('(4) （大きく／小さく）のどちらか', '問X');
    expect(r.marker).toBe('(4)');
    expect(r.subMarker).toBe('');
  });

  it('マーカーが取れないラベルは全体が本文になる', () => {
    const r = splitQuestionLabel('強酸と強塩基の中和エンタルピーがほぼ一定になる理由（約60字）', '問7');
    expect(r.marker).toBe('問7');
    expect(r.subMarker).toBe('');
    expect(r.body).toBe('強酸と強塩基の中和エンタルピーがほぼ一定になる理由（約60字）');
  });

  it('空ラベルでも落ちない', () => {
    expect(splitQuestionLabel('', '問1')).toEqual({ marker: '問1', body: '', subMarker: '' });
  });
});

describe('joinMarker', () => {
  it('マーカーと枝番を連結する', () => {
    expect(joinMarker('(3)', '①')).toBe('(3)①');
  });
  it('枝番が無ければマーカーのみ', () => {
    expect(joinMarker('(3)', '')).toBe('(3)');
  });
  it('マーカーが無ければ枝番のみ', () => {
    expect(joinMarker('', '①')).toBe('①');
  });
});

describe('answerCardMarker — 解答欄に枝番まで表示する', () => {
  it('★ 同じ (3) の中の ①② が解答欄で区別できる', () => {
    const a = card('(3)① 非共有電子対を最も多くもつ分子');
    const b = card('(3)② 非共有電子対をもたない分子（すべて）');
    expect(a).toBe('(3)①');
    expect(b).toBe('(3)②');
    expect(a).not.toBe(b); // ← これが直したかった不具合そのもの
  });

  it('★ 問2 ①〜⑩ が10個すべて別のマーカーになる', () => {
    const marks = ['①', '②', '③', '④', '⑤', '⑥', '⑦', '⑧', '⑨', '⑩'].map((n) =>
      card(`問2 ${n}`),
    );
    expect(marks).toEqual([
      '問2①', '問2②', '問2③', '問2④', '問2⑤',
      '問2⑥', '問2⑦', '問2⑧', '問2⑨', '問2⑩',
    ]);
    expect(new Set(marks).size).toBe(10);
  });

  it('枝番の無い設問の表示は変わらない', () => {
    expect(card('(2) 二重結合をもつ分子')).toBe('(2)');
    expect(card('(ア) 同じ族では、原子番号が…')).toBe('(ア)');
    expect(card('問1 次の問いに答えよ')).toBe('問1');
  });

  it('マーカーが取れない場合は 問N にフォールバックする', () => {
    expect(card('中和エンタルピーがほぼ一定になる理由', 6)).toBe('問7');
  });

  it('係数入力グループでも枝番が保たれる', () => {
    const m = answerCardMarker({ label: '(1)②', group: '①式 C3H8 + O2 → CO2 + H2O' }, 0);
    expect(m).toContain('(1)②');
  });
});

describe('resolveAnswerMarkers — 枝番が書かれていない重複には自動採番する', () => {
  it('★ 同じ (5) が2つあるとき ①② を補って区別する', () => {
    // 「(5) きわめて硬いのはどちらか」「(5) その理由（記述）」のように
    // 元の問題文では枝番が無いが、解答欄には2枚のカードが並ぶケース
    expect(markersOf(['(5) きわめて硬いのはどちらか', '(5) その理由（記述）'])).toEqual([
      '(5)①',
      '(5)②',
    ]);
  });

  it('★ 同じ 問1 が5つあるとき ①〜⑤ を振る', () => {
    expect(
      markersOf([
        '問1 A の結晶の種類',
        '問1 B の結晶の種類',
        '問1 C の結晶の種類',
        '問1 D の結晶の種類',
        '問1 E の結晶の種類',
      ]),
    ).toEqual(['問1①', '問1②', '問1③', '問1④', '問1⑤']);
  });

  it('ラベルに枝番が書かれているならそれを尊重し、番号を足さない', () => {
    expect(markersOf(['(3)① 非共有電子対を最も多くもつ分子', '(3)② 非共有電子対をもたない分子'])).toEqual([
      '(3)①',
      '(3)②',
    ]);
  });

  it('★ 自動採番が既にある枝番とぶつからないように番号を飛ばす', () => {
    // "(3)①" が既に存在するので、重複している "(3)" は ② から振り始める
    const m = markersOf([
      '(3)① 明記された枝番',
      '(3) 枝番なし その1',
      '(3) 枝番なし その2',
    ]);
    expect(new Set(m).size).toBe(3);
    expect(m[0]).toBe('(3)①');
    expect(m).not.toContain('(3)');
  });

  it('重複が無ければ自動採番せず、表示は従来どおり', () => {
    expect(markersOf(['(1) 三重結合をもつ分子', '(2) 二重結合をもつ分子', '(4) 極性分子'])).toEqual([
      '(1)',
      '(2)',
      '(4)',
    ]);
  });

  it('★ 枝番つきの重複（問1(1) が2つ）にも番号を振って区別する', () => {
    // 「組成式」と「その名称」で解答欄が2枚並ぶが、元ラベルはどちらも 問1(1)
    expect(markersOf(['問1(1) Ca²⁺ と Cl⁻ の組成式', '問1(1) その名称'])).toEqual([
      '問1(1)①',
      '問1(1)②',
    ]);
  });

  it('⑳ を超える重複はハイフン付き連番にフォールバックする', () => {
    const m = markersOf(Array.from({ length: 22 }, () => '問1 同じラベル'));
    expect(new Set(m).size).toBe(22);
    expect(m[20]).toBe('問1-21');
    expect(m[21]).toBe('問1-22');
  });

  it('subQuestions が無くても落ちない', () => {
    expect(resolveAnswerMarkers({}).size).toBe(0);
    expect(resolveAnswerMarkers(null).size).toBe(0);
  });
});

describe('buildSubQuestionList — 左側の設問一覧も同じマーカーで並ぶ', () => {
  it('★ 枝番つきの設問一覧が (3)① / (3)② で区別される', () => {
    const list = buildSubQuestionList({
      subQuestions: [
        { label: '(1) 三重結合をもつ分子' },
        { label: '(3)① 非共有電子対を最も多くもつ分子' },
        { label: '(3)② 非共有電子対をもたない分子（すべて）' },
      ],
    });
    expect(list.map((i) => i.marker)).toEqual(['(1)', '(3)①', '(3)②']);
    // 枝番は本文側から取り除かれている（マーカーと二重表示にならない）
    expect(list[1].body).toBe('非共有電子対を最も多くもつ分子');
    expect(list[1].body.startsWith('①')).toBe(false);
  });

  it('★ 左側の設問一覧と右側の解答欄で同じマーカーが出る（枝番あり）', () => {
    const question = {
      subQuestions: [
        { label: '(3)① 非共有電子対を最も多くもつ分子' },
        { label: '(3)② 非共有電子対をもたない分子（すべて）' },
      ],
    };
    const list = buildSubQuestionList(question);
    question.subQuestions.forEach((sq, i) => {
      expect(answerCardMarker(sq, i, question)).toBe(list[i].marker);
    });
  });

  it('★ 自動採番したときも左右のマーカーが一致する', () => {
    const question = {
      subQuestions: [
        { label: '(5) きわめて硬いのはどちらか' },
        { label: '(5) その理由（記述）' },
      ],
    };
    const list = buildSubQuestionList(question);
    expect(list.map((i) => i.marker)).toEqual(['(5)①', '(5)②']);
    question.subQuestions.forEach((sq, i) => {
      expect(answerCardMarker(sq, i, question)).toBe(list[i].marker);
    });
  });

  it('本文を持たない設問（リード文中の空欄）は一覧に出さない', () => {
    const list = buildSubQuestionList({
      subQuestions: [{ label: '問2 ①' }, { label: '問2 ②' }],
    });
    expect(list).toEqual([]);
  });
});

/* ------------------------------------------------------------------
 * 実データ検査
 *   問題データ側にマーカーの重複が残っていないかを直接確かめる。
 *   ここが落ちたら「解答欄に同じ番号が2つ並ぶ」状態が復活している。
 * ------------------------------------------------------------------ */
describe('実データ：同じ問題内でマーカーが重複しない', () => {
  const dataDir = resolve(__dirname, '../src/data');

  /** 問題データから subQuestions の label 配列を素朴に抽出する */
  const collectLabelGroups = (src: string): string[][] => {
    const groups: string[][] = [];
    const re = /subQuestions:\s*\[/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(src))) {
      // 対応する ] まで括弧の深さを数えて切り出す
      let depth = 1;
      let i = m.index + m[0].length;
      for (; i < src.length && depth > 0; i++) {
        if (src[i] === '[') depth++;
        else if (src[i] === ']') depth--;
      }
      const block = src.slice(m.index, i);
      const labels = [...block.matchAll(/label:\s*'((?:[^'\\]|\\.)*)'/g)].map((x) => x[1]);
      if (labels.length > 1) groups.push(labels);
    }
    return groups;
  };

  const files = readdirSync(dataDir).filter((f) => f.endsWith('.ts'));

  it('検査対象の問題が見つかっている', () => {
    const total = files.reduce(
      (n, f) => n + collectLabelGroups(readFileSync(resolve(dataDir, f), 'utf8')).length,
      0,
    );
    expect(total).toBeGreaterThan(10);
  });

  it.each(files)('%s: 解答欄マーカーが問題内で一意', (file) => {
    const src = readFileSync(resolve(dataDir, file), 'utf8');
    const dupes: string[] = [];
    for (const labels of collectLabelGroups(src)) {
      // 実際の描画と同じ経路（question を渡して自動採番を効かせる）で確認する
      const subQuestions = labels.map((label) => ({ label }));
      const question = { subQuestions };
      const seen = new Map<string, string>();
      subQuestions.forEach((sq, i) => {
        const marker = answerCardMarker(sq, i, question);
        const prev = seen.get(marker);
        if (prev !== undefined) {
          dupes.push(`${marker} ← "${prev}" / "${sq.label}"`);
        }
        seen.set(marker, sq.label);
      });
    }
    expect(dupes).toEqual([]);
  });
});

/**
 * =====================================================================
 * 設問一覧が問題文の丸写しになっている問題を見分ける
 * =====================================================================
 * ご要望（原文）：
 *   > 数学の問題でさ、設問一覧と問題が同じなので、同じやつはもう設問一覧いらない
 *
 * ■ なぜ「数学なら消す」にしないのか
 *   ご指摘のとおり「問題によって作りが違う」ので、科目で決め打ちすると壊れる。
 *   全306問を実測すると、重複の有無は科目では決まらなかった。
 *     ・数学にも重複しない問題が 6 件（消すと設問が読めなくなる）
 *     ・化学基礎にも完全重複が 30 件（消して良い）
 *     ・最も危険なのは「一部だけ重複」41 件
 *       → 一覧ごと消すと、問題文に載っていない設問が読めなくなる
 *
 * ■ 守りたい不変条件
 *   「1項目でも問題文に見つからなければ一覧を残す」＝ 安全側に倒す。
 *   情報が消えるより、少し重複して表示されるほうが害が小さい。
 */
describe('isSubQuestionListRedundant: 一覧が問題文の繰り返しか', () => {
  it('全項目が問題文にそのまま並んでいれば省略できる（数学の典型）', () => {
    // mathData の実データと同じ形。label が問題文の行そのもの。
    const q = {
      text: '次の不定積分を求めよ。積分定数は C とする。\n\n（1）∫ x^4 dx\n（2）∫ 1/x^3 dx\n（3）∫ √x dx',
      subQuestions: [
        { label: '（1）∫ x^4 dx' },
        { label: '（2）∫ 1/x^3 dx' },
        { label: '（3）∫ √x dx' },
      ],
    };
    expect(isSubQuestionListRedundant(q)).toBe(true);
  });

  it('★1項目でも問題文に無ければ残す★（情報が消えるのを防ぐ）', () => {
    const q = {
      text: '次の不定積分を求めよ。\n\n（1）∫ x^4 dx\n（2）∫ 1/x^3 dx',
      subQuestions: [
        { label: '（1）∫ x^4 dx' },
        { label: '（2）∫ 1/x^3 dx' },
        // ↓ 問題文に載っていない設問。ここが消えると解けなくなる。
        { label: '（3）上の結果を使って面積を求めよ' },
      ],
    };
    expect(isSubQuestionListRedundant(q)).toBe(false);
  });

  it('本文が1〜2文字でも「マーカー＋本文」で並んでいれば省略できる', () => {
    // 化学基礎の分類問題（p_c1_1_2 と同じ形）。
    // 本文だけだと "水" が "水溶液" 等に偶然当たるので、
    // マーカーと連続しているかで判定する。
    const q = {
      text: '問2 次の物質を分類しなさい。\n\n（1） 酸素　　（2） 海水　　（3） 水',
      subQuestions: [
        { label: '（1） 酸素' },
        { label: '（2） 海水' },
        { label: '（3） 水' },
      ],
    };
    expect(isSubQuestionListRedundant(q)).toBe(true);
  });

  it('★短い本文が偶然一致しただけでは省略しない★', () => {
    // "水" はリード文の "水溶液" に含まれるが、"(1)水" の並びは無い。
    // ここで true になってしまうと、設問が読めない問題が生まれる。
    const q = {
      text: '水溶液について答えよ。酸素と海水についても考える。',
      subQuestions: [
        { label: '（1） 水' },
        { label: '（2） 酸素' },
      ],
    };
    expect(isSubQuestionListRedundant(q)).toBe(false);
  });

  it('全角・半角の括弧と空白の違いは吸収する', () => {
    const q = {
      text: '次を求めよ。\n\n(1)∫x^4dx\n(2)∫1/x^3dx',
      subQuestions: [
        { label: '（1） ∫ x^4 dx' },   // 全角括弧＋空白あり
        { label: '（2） ∫ 1/x^3 dx' },
      ],
    };
    expect(isSubQuestionListRedundant(q)).toBe(true);
  });

  it('設問一覧が空、または問題文が空なら false（判定対象外）', () => {
    // マーカーのみのラベル（リード文中の空欄）は一覧に載らない。
    expect(isSubQuestionListRedundant({ text: 'なにか', subQuestions: [{ label: '(ア)' }] })).toBe(false);
    expect(isSubQuestionListRedundant({ text: '', subQuestions: [{ label: '(1) あいうえお' }] })).toBe(false);
    expect(isSubQuestionListRedundant({})).toBe(false);
    expect(isSubQuestionListRedundant(null)).toBe(false);
  });
});

/**
 * extractInlineQuestionRows — 小問行の横並び（スマホのみ）
 *
 * ■ 背景
 *   ご要望(8)「(1)から4問縦書きになってるけど、横書きにしたら
 *   1画面に収まるくない？」
 *
 * ■ ここで守りたいこと（ご注意(9) への対応）
 *   「化学基礎とかは問題によって問題文の長さが違うから、コードで
 *     形式的に作ると問題によっておかしくなる可能性がある」
 *
 *   そこで「数学なら横並び」という科目での決め打ちを禁止し、
 *   その問題自身が短いときだけ横並びにする。長い問題／表を含む問題／
 *   小問が多い問題では null を返し、従来の縦積みに必ず戻ることを固定する。
 */
describe('extractInlineQuestionRows（スマホの小問横並び）', () => {
  it('数学の実データ（4問・最長10字）は横並びできる', () => {
    const got = extractInlineQuestionRows(
      '次の不定積分を求めよ。積分定数は C とする。\n(1) ∫ x^4 dx\n(2) ∫ 1/x^3 dx\n(3) ∫ √x dx\n(4) ∫ 1/√x dx'
    );
    expect(got).not.toBeNull();
    expect(got!.lead).toBe('次の不定積分を求めよ。積分定数は C とする。');
    expect(got!.rows).toHaveLength(4);
    expect(got!.rows[0]).toEqual({ marker: '(1)', body: '∫ x^4 dx' });
    expect(got!.rows[3]).toEqual({ marker: '(4)', body: '∫ 1/√x dx' });
  });

  it('★化学基礎の長い小問（157字）は横並びにしない＝縦積みのまま', () => {
    // 実データ p_c5_5_2 相当。形式的に横並びにすると崩れるケース。
    const long =
      '標準状態において2.24Lのアンモニアを水に溶かして全体を500mLとした。' +
      'この水溶液から20mLを正確に量りとった。これを完全に中和するのに必要な' +
      ' 0.10mol/L の塩酸は何mLか。ここでは十分に長い本文であることが重要である。';
    expect(long.length).toBeGreaterThan(20);
    expect(extractInlineQuestionRows(`次の問いに答えよ。\n(1) ${long}\n(2) ${long}`)).toBeNull();
  });

  it('★科目では決めない：短い化学の小問は横並びできる', () => {
    // 実データ q_c2_4_7 相当（"F > O > N > C" など 16 字）。
    const got = extractInlineQuestionRows(
      '次の各組を大きい順に並べよ。\n(1) F > O > N > C\n(2) Li > Be > B > C\n(3) K > Na > Li > H'
    );
    expect(got).not.toBeNull();
    expect(got!.rows).toHaveLength(3);
    expect(got!.rows[1].body).toBe('Li > Be > B > C');
  });

  it('小問が5本以上なら横並びにしない（2列でも3段になり効果が薄い）', () => {
    const text = '次を答えよ。\n' + [1, 2, 3, 4, 5].map(i => `(${i}) x^${i}`).join('\n');
    expect(extractInlineQuestionRows(text)).toBeNull();
  });

  it('小問が1本だけなら横並びにしない（並べる意味がない）', () => {
    expect(extractInlineQuestionRows('次を答えよ。\n(1) ∫ x dx')).toBeNull();
  });

  it('小問の間に地の文が挟まる問題は横並びにしない（読み順が壊れる）', () => {
    // 実データ p_c5_6_3 のような「操作(i)…説明…操作(ii)」型。
    expect(
      extractInlineQuestionRows('実験を行った。\n(1) 短い操作\nこのとき溶液は白濁した。\n(2) 別の操作')
    ).toBeNull();
  });

  it('Markdown 表を含む問題は横並びにしない（表は横幅を必要とする）', () => {
    expect(
      extractInlineQuestionRows('表を見よ。\n| a | b |\n| - | - |\n(1) 短い\n(2) 短い')
    ).toBeNull();
  });

  it('本文が空（マーカーだけ）の行があれば横並びにしない', () => {
    expect(extractInlineQuestionRows('次を答えよ。\n(1)\n(2) ∫ x dx')).toBeNull();
  });

  it('全角括弧・①・問N のマーカーも認識する', () => {
    const zen = extractInlineQuestionRows('次を答えよ。\n（1） ∫ x dx\n（2） ∫ y dy');
    expect(zen!.rows.map(r => r.body)).toEqual(['∫ x dx', '∫ y dy']);
    const maru = extractInlineQuestionRows('次を答えよ。\n① ∫ x dx\n② ∫ y dy');
    expect(maru!.rows.map(r => r.marker)).toEqual(['①', '②']);
    const mon = extractInlineQuestionRows('次を答えよ。\n問1 ∫ x dx\n問2 ∫ y dy');
    expect(mon!.rows.map(r => r.body)).toEqual(['∫ x dx', '∫ y dy']);
  });

  it('リード文が無い（小問だけの）問題でも横並びできる', () => {
    const got = extractInlineQuestionRows('(1) ∫ x dx\n(2) ∫ y dy');
    expect(got).not.toBeNull();
    expect(got!.lead).toBe('');
    expect(got!.rows).toHaveLength(2);
  });

  it('空文字・空白のみ・null 相当は null（安全側）', () => {
    expect(extractInlineQuestionRows('')).toBeNull();
    expect(extractInlineQuestionRows('   \n  ')).toBeNull();
    expect(extractInlineQuestionRows(undefined as any)).toBeNull();
  });

  it('境界値：本文20字は横並び、21字は縦積み', () => {
    const b20 = 'あ'.repeat(20);
    const b21 = 'あ'.repeat(21);
    expect(extractInlineQuestionRows(`リード\n(1) ${b20}\n(2) ${b20}`)).not.toBeNull();
    expect(extractInlineQuestionRows(`リード\n(1) ${b20}\n(2) ${b21}`)).toBeNull();
  });
});
