/**
 * ===================================================================
 * 化学（発展）・無機化学 演習問題の回帰テスト
 * ===================================================================
 *
 * 何を守るテストか
 * ----------------
 * 無機化学のパート（adv_inorganic）は、これまで ch() ヘルパーで作られた
 * 「章の枠だけ」で、practiceProblems が全章 [] だった。
 * そのため
 *   ・Quiz で解けない
 *   ・Explanation で解説が読めない
 *   ・対戦（バトル）の出題元にもできない
 * という三重の行き止まりになっていた。
 * ユーザーの指示「無機化学いこう」に従って src/data/inorganicProblems.ts に
 * 演習問題の実体を書いたので、その収録が静かに壊れないよう機械で固定する。
 *
 * ここで特に守りたいのは、次の「静かな事故」の3種類。
 *
 *  ① 章IDのタイポで、書いた問題がどこにも刺さらない
 *     → 画面はエラーにならず「単元はあるのに0問」になるだけなので気づけない。
 *  ② 解説の見出しが行頭にないため、アコーディオンを開いても空になる
 *     → enhanceExplanation() が小問ごとに切り分けられなくなる。
 *  ③ 原典（chemistryAdvancedTrendData.ts の weapons）に無い知識を
 *     勝手に作ってしまう
 *     → 共通テスト対策として無意味な問題になる。
 *       そこで「答えが原典の武器に実在するか」を照合する。
 */
import { describe, it, expect } from 'vitest';
import { getAllAdvancedChapters, getAdvancedFieldStats } from '../src/data/chemistryAdvancedData';
import { chapterTrendsAdvanced } from '../src/data/chemistryAdvancedTrendData';
// 対戦プールの生成物。章IDが2列目に入っているので、
// 「収録した章が対戦にも供給されているか」を機械的に確かめられる。
// 手書き禁止の生成ファイルなので、ここでは読むだけ。
import { POOL } from '../src/battle/data/pool.chemistry.generated';
import {
  sliceEnhancedBySubQuestion,
  sliceEnhancedByQuestion,
  questionGroupKey,
} from '../src/utils/explanationFormat';

/** 演習問題を収録した無機化学の章ID（収録が進んだらここに足す） */
const INORGANIC_DONE = [
  'a7_3',
  'a7_4',
  'a7_5',
  'a7_7',
  'a8_1',
  'a8_2',
  'a8_3',
  'a9_2',
  'a9_3',
  'a9_5',
  'a9_6',
] as const;

const chaptersById = new Map(getAllAdvancedChapters().map((c) => [c.id, c]));

const allProblems = INORGANIC_DONE.flatMap((id) =>
  (chaptersById.get(id)?.practiceProblems ?? []).map((p: any) => ({ chapterId: id, problem: p })),
);

/** Explanation.tsx の sliceForSq と同じ手順で、小問ぶんの解説を切り出す */
function sliceForSq(enhanced: string, sq: any): string {
  const sub = sliceEnhancedBySubQuestion(enhanced);
  if (sub) {
    const key = String(sq?.id ?? '');
    const hit = sub.subs.filter((x) => x.id === key);
    if (hit.length > 0) {
      return [hit.map((x) => x.body).join('\n'), sub.shared].filter((t) => t.trim()).join('\n');
    }
    if (sub.shared.trim()) return sub.shared;
  }
  const qs = sliceEnhancedByQuestion(enhanced);
  if (!qs) return '';
  const key = questionGroupKey(sq?.label);
  if (!key) return '';
  return qs.groups
    .filter((g) => g.key === key)
    .map((g) => g.text)
    .join('\n');
}

describe('無機化学 演習問題の収録', () => {
  it('★収録した章に問題がちゃんと刺さっている（章IDのタイポ検出）★', () => {
    for (const id of INORGANIC_DONE) {
      const chapter = chaptersById.get(id);
      expect(chapter, `章 ${id} が存在しない`).toBeDefined();
      expect(
        chapter!.practiceProblems.length,
        `章 ${id} に問題が0問。ADVANCED_PROBLEMS への登録漏れか章IDのタイポ`,
      ).toBeGreaterThan(0);
    }
  });

  it('無機化学の収録問題数として集計される（単元選択のカード表示）', () => {
    const stats = getAdvancedFieldStats('inorganic');
    expect(stats.questions).toBe(allProblems.length);
    expect(stats.questions).toBeGreaterThan(0);
  });

  it('大問テキストが「演習N」で始まる（理論化学と同じ体裁）', () => {
    for (const { problem } of allProblems) {
      expect(/^演習\s*\d+/.test(String(problem.text)), `${problem.id} の書き出し`).toBe(true);
    }
  });
});

describe('無機化学 演習問題のデータ形式', () => {
  it('大問IDが一意', () => {
    const ids = allProblems.map(({ problem }) => problem.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('大問IDが章IDを含む（どの単元の問題か追える）', () => {
    for (const { chapterId, problem } of allProblems) {
      expect(String(problem.id), `${problem.id}`).toContain(chapterId);
    }
  });

  it('Explanation.tsx が参照する category が全問に入っている', () => {
    for (const { problem } of allProblems) {
      expect(typeof problem.category, `${problem.id} の category`).toBe('string');
      expect(problem.category.length).toBeGreaterThan(0);
    }
  });

  it('小問は id / label / type / correctAnswer を持つ', () => {
    for (const { problem } of allProblems) {
      expect(Array.isArray(problem.subQuestions)).toBe(true);
      expect(problem.subQuestions.length).toBeGreaterThan(0);
      for (const sq of problem.subQuestions) {
        expect(typeof sq.id, `${problem.id} の小問 id`).toBe('string');
        expect(sq.id.startsWith(problem.id)).toBe(true);
        expect(String(sq.label).length).toBeGreaterThan(0);
        expect(typeof sq.type).toBe('string');
        expect(String(sq.correctAnswer ?? '').trim().length).toBeGreaterThan(0);
      }
    }
  });

  it('小問IDが全体で一意（アコーディオンの切り出しキーになる）', () => {
    const sqIds = allProblems.flatMap(({ problem }) =>
      problem.subQuestions.map((sq: any) => sq.id),
    );
    expect(new Set(sqIds).size).toBe(sqIds.length);
  });

  it('Quiz.tsx が描き分けられる type だけを使っている', () => {
    const supported = new Set(['short_answer', 'multiple_choice', 'descriptive']);
    for (const { problem } of allProblems) {
      for (const sq of problem.subQuestions) {
        expect(supported.has(sq.type), `${sq.id} の type=${sq.type}`).toBe(true);
      }
    }
  });

  it('★選択式の正解が、必ず選択肢の中に入っている（採点が不可能にならない）★', () => {
    for (const { problem } of allProblems) {
      for (const sq of problem.subQuestions) {
        if (sq.type !== 'multiple_choice') continue;
        expect(Array.isArray(sq.options), `${sq.id} の options`).toBe(true);
        expect(sq.options.length).toBeGreaterThan(1);
        expect(
          sq.options.includes(sq.correctAnswer),
          `${sq.id} の正解「${sq.correctAnswer}」が選択肢に無い`,
        ).toBe(true);
      }
    }
  });

  it('★選択肢に重複が無い（同じものが2つ並ぶと正解が2つになる）★', () => {
    for (const { problem } of allProblems) {
      for (const sq of problem.subQuestions) {
        if (sq.type !== 'multiple_choice') continue;
        expect(new Set(sq.options).size, `${sq.id} の選択肢に重複`).toBe(sq.options.length);
      }
    }
  });

  it('記述式には採点の観点（gradingCriteria）が付いている', () => {
    for (const { problem } of allProblems) {
      for (const sq of problem.subQuestions) {
        if (sq.type !== 'descriptive') continue;
        expect(Array.isArray(sq.gradingCriteria), `${sq.id} の gradingCriteria`).toBe(true);
        expect(sq.gradingCriteria.length).toBeGreaterThanOrEqual(2);
      }
    }
  });
});

describe('無機化学 演習問題の解説', () => {
  it('enhanceExplanation で整形済み（解答カードが生成されている）', () => {
    for (const { problem } of allProblems) {
      const text: string = problem.explanationSupplement || problem.explanation;
      expect(text.startsWith('<!--fmt-v1-->'), `${problem.id} が未整形`).toBe(true);
      expect(text).toContain('解 答');
    }
  });

  it('★小問アコーディオンを開けば必ず中身が出る（空にならない）★', () => {
    for (const { problem } of allProblems) {
      const text: string = problem.explanationSupplement || problem.explanation;
      const subs = problem.subQuestions.filter(Boolean);
      if (subs.length < 2) continue;
      for (const sq of subs) {
        expect(sliceForSq(text, sq).trim().length, `${sq.id} の解説が空`).toBeGreaterThan(0);
      }
    }
  });

  /**
   * ★このテストを足した理由（実際に3小問ぶんの解説が画面から消えていた）★
   *
   * 上の「空にならない」テストは sliceForSq() を使うが、この関数は
   * 自分の小問の目印が見つからなかったとき★共通解説を代わりに返す★。
   * つまり「解説が1文字も紐付いていない小問」でも、共通解説のおかげで
   * 中身が空にならず、テストは合格してしまう。
   * 生徒の画面には、自分が解いた問とは無関係な共通文だけが出る。
   *
   * 実際に起きた事故：
   *   接触法の大問（q_a7_4_ex1）は小問7件のうち4件しか紐付いておらず、
   *   （3）（4）（5）の解説が丸ごと表示されなくなっていた。
   *   原因は explanationFormat.ts の findSubAnchors() が、
   *   マーカー直後が数字の行を見出しと認めない仕様だったこと
   *   （「(1)」が「(10)」の先頭に一致する事故を防ぐためのガード）。
   *   解説の見出しを「（3）1 mol」と書いていたため、"(3)" の直後が "1" で
   *   却下され、見出しとして扱われなかった。
   *   → 見出しを「（3）硫黄 1 mol から得られる硫酸 → 1 mol」に直して解決。
   *
   * ★ここで守るルール★
   *   解説の見出し行は「（N）」の直後に数字を置いてはいけない。
   * 人の目では絶対に見つけられない種類の事故なので、
   * 「各小問が自分専用の目印 <!--sq:ID--> を持っているか」を直接検査する。
   * 共通解説へのフォールバックを通さないので、紐付け漏れをそのまま検出できる。
   */
  it('★各小問が自分専用の解説セクションを持っている（共通解説での代替を許さない）★', () => {
    for (const { problem } of allProblems) {
      const text: string = problem.explanationSupplement || problem.explanation;
      const subs = problem.subQuestions.filter(Boolean);
      if (subs.length < 2) continue;

      const sliced = sliceEnhancedBySubQuestion(text);
      // 目印から直接引く（sliceForSq と違い、共通解説へ逃げない）
      const own = new Map((sliced?.subs ?? []).map((s) => [s.id, s.body]));

      for (const sq of subs) {
        expect(
          (own.get(sq.id) ?? '').trim().length,
          `${sq.id} に自分の解説セクションが無い。` +
            `解説本文の見出しが行頭に無いか、「（N）」の直後が数字になっている可能性がある` +
            `（例：「（3）1 mol」は見出しと認識されない。「（3）硫黄1molから…→ 1 mol」のように書く）`,
        ).toBeGreaterThan(0);
      }
    }
  });

  /**
   * ★このテストを足した理由（実際に穴が空いていた）★
   * 上の「空にならない」テストは length > 0 しか見ていないため、
   * 解説に見出しだけ書いて説明を書き忘れても通り抜けてしまう。
   * 実際、最初に書いた a7_3 の演習4（2）は
   *   「（2）AgCl の色 白」
   * の一行だけで、タグを除くと本文が18文字しかなかったのに合格していた。
   * 生徒がアコーディオンを開いて「答えの再掲だけ」が出るのは、
   * 解説が無いのと同じで、この状態を人の目で見つけるのは不可能に近い。
   * そこで「HTMLタグを除いた素の文字数」で下限を引いて機械に見張らせる。
   *
   * ★測り方の注意（ここで一度しくじった）★
   * sliceForSq() は「その小問ぶんの本文」に「大問全体の共通解説」を
   * 連結して返す。共通解説は毎回同じものが足されるので、
   * 連結後の長さで測ると、本文11文字の空っぽな小問でも
   * 共通解説79文字のおかげで合計90文字になり、しきい値を超えて素通りした。
   * したがって★共通解説を差し引いた、その小問だけの本文★で測る必要がある。
   *
   * しきい値の根拠：
   *   ・答えの再掲だけの行は 20 文字前後で終わる（上の実例が18文字、
   *     再現テストでは11文字だった）。
   *   ・説明が1文でも付けば、日本語では確実に 60 文字を超える
   *     （実際に書いた小問の本文は 74〜206 文字だった）。
   *   ・整形で必ず入る「解法の思考手順」「詳しい解説」などの
   *     見出し語ぶんは除いてから数える（下駄を履かせないため）。
   */
  it('★小問の解説が「答えの再掲だけ」で終わっていない（薄い解説を弾く）★', () => {
    /** 整形処理が必ず挿入する定型の見出し語。文字数の下駄になるので除く。 */
    const BOILERPLATE = ['解法の思考手順', '詳しい解説', 'この大問全体の解説', '解 答'];
    const bare = (html: string) => {
      let t = html.replace(/<[^>]*>/g, ' ');
      for (const w of BOILERPLATE) t = t.split(w).join(' ');
      return t.replace(/\s+/gu, '').trim();
    };

    for (const { problem } of allProblems) {
      const text: string = problem.explanationSupplement || problem.explanation;
      const subs = problem.subQuestions.filter(Boolean);
      if (subs.length < 2) continue;

      // 共通解説は差し引く（下駄を履かせないため）
      const sliced = sliceEnhancedBySubQuestion(text);
      const sharedLen = bare(sliced?.shared ?? '').length;

      for (const sq of subs) {
        const own = bare(sliceForSq(text, sq)).length - sharedLen;
        expect(
          own,
          `${sq.id} の解説が薄い（その小問だけの本文 ${own} 文字）。答えの再掲だけで、なぜそうなるかの説明が無い`,
        ).toBeGreaterThan(60);
      }
    }
  });

  it('禁止スタイル（<u> による黄色マーカー）を使っていない', () => {
    for (const { problem } of allProblems) {
      const text: string = problem.explanationSupplement || problem.explanation;
      expect(/<u>/i.test(text), `${problem.id}`).toBe(false);
    }
  });

  it('禁止語「STEP」を使っていない', () => {
    for (const { problem } of allProblems) {
      const text: string = problem.explanationSupplement || problem.explanation;
      expect(/STEP/i.test(text), `${problem.id}`).toBe(false);
    }
  });
});

describe('無機化学 演習問題が原典に根ざしている', () => {
  /** 章IDごとの出題傾向データ（weapons が一次資料） */
  const trendById = new Map(
    chapterTrendsAdvanced.flatMap((group: any) => (group.units ?? []).map((u: any) => [u.id, u])),
  );

  it('収録した章には、原典（出題傾向データ）の武器がそろっている', () => {
    for (const id of INORGANIC_DONE) {
      const trend: any = trendById.get(id);
      expect(trend, `${id} の出題傾向データが無い`).toBeDefined();
      expect(Array.isArray(trend.weapons)).toBe(true);
      expect(trend.weapons.length).toBeGreaterThan(0);
    }
  });

  /**
   * ★原典との照合★
   * chemistryAdvancedTrendData.ts の weapons に書かれている
   * 「共通テストで得点に直結する事実」が、実際に問題として出題されているかを見る。
   * 勝手な創作知識だけで埋めていないことの機械的な証拠になる。
   * weapons の本文は全角記号（＞など）を使っているので、
   * 照合はキーワード単位で行う。
   */
  const MUST_ASK: Record<string, string[]> = {
    // a7_3 ハロゲン：酸化力の順序 / AgF の可溶性 / HF の特異性 / 洗気瓶の順序
    a7_3: ['酸化力', 'AgF', 'HF', '洗気瓶', 'アンモニア水'],
    // a7_4 酸素・硫黄：接触法 / V2O5 / SO2 の両性 / 濃硫酸の脱水 / オゾンの検出
    a7_4: ['接触法', 'V₂O₅', '酸化剤', '還元剤', '脱水作用', 'オゾン'],
    // a7_5 窒素・リン：オストワルト法の量的計算 / NO と NO₂ の捕集法 /
    // 不動態（Fe・Ni・Al）/ 王水 / リンの同素体 / P₄O₁₀ が塩基性気体に使えないこと。
    // 原典 a7_5 の weapons 5本すべてに対応するキーワードを並べてある。
    a7_5: ['オストワルト法', '水上置換', '下方置換', '不動態', '王水', '黄リン', '赤リン', 'P₄O₁₀'],
    // a7_7 気体の製法と性質のまとめ：原典の武器 6 本に一対一で対応させてある。
    // 「水に溶けにくい→水上置換」「溶けて重い→下方置換」「溶けて軽い→上方置換」
    //   → 水上置換・下方置換・上方置換
    // 「NH₃ の乾燥はソーダ石灰のみ」→ ソーダ石灰
    // 「塩化カルシウムは NH₃ と反応する（頻出のひっかけ）」→ 塩化カルシウム
    // 「有色気体 Cl₂ 黄緑・NO₂ 赤褐・O₃ 淡青」→ 黄緑色・赤褐色・淡青色
    // ※ 有色の3気体を必須にしているのは、ここが同定問題の最短の手がかりで、
    //   1つでも欠けると「色から気体を当てる」練習が成立しなくなるため。
    // ※ 十酸化四リンは原典の乾燥剤4種の1つ。名称を漢字で書いておかないと
    //   P₄O₁₀ という式だけを覚えて選択肢の日本語が読めなくなる。
    a7_7: [
      '水上置換',
      '上方置換',
      '下方置換',
      'ソーダ石灰',
      '塩化カルシウム',
      '十酸化四リン',
      '黄緑色',
      '赤褐色',
      '淡青色',
      '不揮発性',
    ],
    // a8_1 アルカリ金属：原典の武器 5 本に一対一で対応させてある。
    // 「アンモニアソーダ法：NaCl 2mol から Na₂CO₃ 1mol（全体式で覚える）」
    //   → アンモニアソーダ法・ソルベー法
    // 「NaHCO₃ は加熱で分解」→ 熱分解
    // 「Na₂CO₃ 水溶液は加水分解で塩基性（強塩基＋弱酸の塩）」→ 加水分解
    // 「単体は水と激しく反応→石油中に保存」→ 石油
    // 「炎色反応：Li赤・Na黄・K紫・Cu青緑・Ca橙赤・Ba黄緑」
    //   → 炎色反応・黄色・紫色・橙赤色・青緑色・黄緑色
    // ※ 潮解・風解を必須にしているのは、原典の出題形式に
    //   「水酸化ナトリウムの潮解性と CO₂ 吸収」があり、
    //   かつ名前が似ていて逆向きの現象なので、
    //   両方そろっていないと対比して覚える練習にならないため。
    // ※ 「再利用」は原典が「NH₃ と CO₂ が循環して再利用される点も
    //   正誤で問われる」と明記している要素。
    a8_1: [
      'アンモニアソーダ法',
      'ソルベー法',
      '熱分解',
      '加水分解',
      '潮解',
      '風解',
      '石油',
      '炎色反応',
      '再利用',
      '橙赤色',
      '青緑色',
      '黄緑色',
    ],
    // a8_2 アルカリ土類金属：原典の武器 5 本に一対一で対応させてある。
    // 「Be・Mg は冷水と反応しない／Ca・Sr・Ba は冷水と反応して H₂ 発生」
    //   → 冷水・熱水（Mg は熱水なら反応する、が正誤の狙い目）
    // 「硫酸塩：MgSO₄ は溶ける／CaSO₄・BaSO₄ は溶けない」→ 硫酸塩
    // 「CaCO₃ は CO₂ を含む水には Ca(HCO₃)₂ として溶ける（鍾乳洞）」→ 鍾乳洞
    // 「生石灰 CaO ＋ 水 → 消石灰 Ca(OH)₂（発熱）」→ 生石灰・消石灰
    // 「2族の炎色反応：Ca橙赤・Sr紅・Ba黄緑」→ 炎色反応・橙赤・黄緑
    // ※ 原典の出題形式にある「硬水・軟水」「セッコウ」「BaSO₄ の造影剤」
    //   「CaF₂ の結晶構造」も必須にしてある。とくに面心立方格子は
    //   原典が「結晶構造側から2族が登場する形も要注意」と警告している要素で、
    //   ここが欠けると第1問との融合形に対応できない。
    a8_2: [
      '冷水',
      '熱水',
      '硫酸塩',
      '炎色反応',
      '橙赤',
      '黄緑',
      '生石灰',
      '消石灰',
      '鍾乳洞',
      '硬水',
      'セッコウ',
      '造影剤',
      '蛍石',
      '面心立方格子',
    ],
    // a8_3 アルミニウム・亜鉛：両性金属 / テトラヒドロキシドアルミン酸イオン /
    // 過剰のアンモニア水で Al と Zn が分かれる / ホール・エルー法と氷晶石 /
    // Al³⁺ 1 mol に電子 3 mol（ファラデーの法則）/ 不動態 / テルミット反応 / トタン・ブリキ。
    a8_3: [
      '両性金属',
      'テトラヒドロキシドアルミン酸イオン',
      'ホール・エルー法',
      '氷晶石',
      '不動態',
      'テルミット反応',
      'トタン',
      'ブリキ',
      '複塩',
    ],
    // a9_2 鉄：原典の武器 6 本に一対一で対応させてある。
    // 「製鉄 Fe₂O₃ ＋ 3CO → 2Fe」→ 溶鉱炉・銑鉄・転炉・鋼
    // 「Fe³⁺ ＋ KSCN → 血赤色」→ チオシアン酸カリウム・血赤色
    // 「Fe²⁺/Fe³⁺ ＋ 2種のシアニド錯塩 → 濃青色沈殿」→ ヘキサシアニド・濃青色
    // 「Fe は濃硝酸で不動態」→ 不動態
    // 「合金」→ ステンレス鋼
    // 酸化物の酸化数（FeO・Fe₂O₃・Fe₃O₄）→ 四酸化三鉄
    // ※「濃青色」を必須にしているのは、ここを「青色」などと書き崩すと
    //   原典の識別表と食い違い、学習者が試験本番で選択肢を選べなくなるため。
    a9_2: [
      '溶鉱炉',
      '銑鉄',
      '転炉',
      'チオシアン酸カリウム',
      '血赤色',
      'ヘキサシアニド',
      '濃青色',
      '不動態',
      'ステンレス鋼',
      '四酸化三鉄',
    ],
    // a9_3 銅・銀：原典の武器 5 本に一対一で対応させてある。
    // 「銅は塩酸・希硫酸に溶けない」→ イオン化傾向
    // 「希硝酸→NO / 濃硝酸→NO₂ / 熱濃硫酸→SO₂」→ 希硝酸・濃硝酸・熱濃硫酸
    // 「少量 NH₃ で青白沈殿、過剰で深青色錯イオン」→ 青白色・深青色
    // 「電解精錬で Ag・Au は陽極泥」→ 電解精錬・陽極泥
    // 「CuSO₄·5H₂O（青）→加熱→白→水で青に戻る」→ 五水和物
    a9_3: [
      'イオン化傾向',
      '希硝酸',
      '濃硝酸',
      '熱濃硫酸',
      '青白色',
      '深青色',
      '電解精錬',
      '陽極泥',
      '五水和物',
    ],
    // a9_5 錯イオン：配位数と立体構造（直線形・正方形・正四面体形・正八面体形）/
    // 配位子の名称（アンミン・アクア・シアニド・ヒドロキシド）/ 配位結合。
    a9_5: [
      '配位結合',
      '直線形',
      '正方形',
      '正四面体形',
      '正八面体形',
      'アンミン',
      'アクア',
      'シアニド',
      'ヒドロキシド',
      '非共有電子対',
    ],
    // a9_6 系統分析：分属の6段階 / 硫化物と水酸化物の色 /
    // 酸性では溶解度積の小さいものだけが沈殿 / 硫化水素のあと Fe²⁺ になっている。
    a9_6: [
      '炎色反応',
      '溶解度積',
      '赤褐色',
      '青白色',
      '深青色',
      '黄色',
      '淡桃色',
      '還元剤',
      '炎色',
    ],
  };

  for (const [chapterId, keywords] of Object.entries(MUST_ASK)) {
    it(`${chapterId}：原典の武器が実際に出題されている`, () => {
      const chapter = chaptersById.get(chapterId);
      const dump = JSON.stringify(chapter?.practiceProblems ?? []);
      for (const kw of keywords) {
        expect(dump, `${chapterId} で「${kw}」がどこにも問われていない`).toContain(kw);
      }
    });
  }

  it('a7_3：ハロゲン単体の酸化力の順序が正しい向きで書かれている', () => {
    const dump = JSON.stringify(chaptersById.get('a7_3')?.practiceProblems ?? []);
    // フッ素が最強・ヨウ素が最弱。逆順で書いたら即アウト。
    expect(dump).toContain('F₂ > Cl₂ > Br₂ > I₂');
    expect(dump).not.toContain('I₂ > Br₂ > Cl₂ > F₂');
  });

  it('a7_3：沸点と酸の強さで順序が逆転することを両方扱っている', () => {
    const dump = JSON.stringify(chaptersById.get('a7_3')?.practiceProblems ?? []);
    // 沸点は HF が先頭、酸の強さは HI が先頭。ここが同じ順序になっていたら誤り。
    expect(dump).toContain('HF > HI > HBr > HCl');
    expect(dump).toContain('HI > HBr > HCl > HF');
  });

  it('a7_4：接触法は「硫黄1molから硫酸1mol」の関係で作問されている', () => {
    const dump = JSON.stringify(chaptersById.get('a7_4')?.practiceProblems ?? []);
    expect(dump).toContain('S + O₂ → SO₂');
    expect(dump).toContain('2SO₂ + O₂ → 2SO₃');
    expect(dump).toContain('SO₃ + H₂O → H₂SO₄');
  });

  it('a7_4：熱濃硫酸で銅が溶ける反応で、水素が発生する誤りを書いていない', () => {
    const dump = JSON.stringify(chaptersById.get('a7_4')?.practiceProblems ?? []);
    expect(dump).toContain('Cu + 2H₂SO₄ → CuSO₄ + SO₂ + 2H₂O');
    // 「Cu + H2SO4 → CuSO4 + H2」は典型的な誤答。正解として置いていないこと。
    expect(dump).not.toContain('CuSO₄ + H₂');
  });
});

/**
 * ★対戦（バトル）に1問も出ない章を作ってしまう事故を防ぐ★
 *
 * ■ なぜこのテストが必要になったか（実際に踏んだ）
 *   a8_2（アルカリ土類金属）を 4大問24小問 で書き上げ、
 *   演習側のテストもすべて緑になったのに、
 *   npm run gen:battle-pool のあと chemistry の問題数が
 *   203問 のまま1問も増えなかった。
 *   内訳を見ると「未使用」が 194 → 218 と、ちょうど24件増えていた。
 *   つまり書いた24小問すべてが対戦プールから捨てられていた。
 *
 * ■ 原因
 *   scripts/gen-battle-pool.mts は
 *   USE_SYNTHESIZED_FORMATS === false のため、
 *   「元データの選択肢をそのまま使える問題」＝ options を持つ
 *   multiple_choice と、答えがカタカナの short_answer しか採用しない。
 *   （短答・記述から誤答を借りて4択を合成する処理は、
 *     問いとして成り立たない問題が混ざるので意図的に止められている）
 *   a8_2 は multiple_choice が 0 件で、
 *   short_answer の答えも「熱水」「硬水」など漢字だったため、
 *   採用条件をどれも満たさなかった。
 *
 * ■ なぜ既存のテストで気づけなかったか
 *   演習側のテスト（データ形式・解説の分割・原典の武器）は
 *   すべて通ってしまう。対戦への寄与を見ている検査が
 *   どこにも無かったので、生成ログの数字を人間が見比べるしか
 *   気づく方法がなかった。それは見落とすので機械化する。
 *
 * ■ このテストが守ること
 *   収録した章は、対戦プールに最低1問は寄与していること。
 *   落ちたら「その章に options を持つ設問が足りない」ということなので、
 *   multiple_choice の小問を足して gen:battle-pool を回し直す。
 */
describe('無機化学 演習問題が対戦にも供給されている', () => {
  it('★収録した章はすべて対戦プールに1問以上出ている（演習専用の章を作らない）★', () => {
    // 章IDは生成プールの2列目に入っている。
    // pool 側は型を持たない生の配列なので、位置で読む。
    const chapterIdsInPool = new Set(POOL.map((row) => String(row[1])));

    const missing = INORGANIC_DONE.filter((id) => !chapterIdsInPool.has(id));

    expect(
      missing,
      missing.length
        ? `次の章は演習には入っているが対戦プールに1問も出ていない: ${missing.join(', ')}\n` +
            '原因はほぼ確実に「options を持つ multiple_choice の小問が無い」こと。\n' +
            'gen-battle-pool.mts は選択肢をそのまま使える問題しか採用しない（誤答の合成は停止中）。\n' +
            '対策: その章に multiple_choice の小問を追加し、npm run gen:battle-pool を再実行する。'
        : '',
    ).toEqual([]);
  });

  it('収録した章は対戦プールに複数問寄与している（1問だけの偏りを防ぐ）', () => {
    const countByChapter = new Map<string, number>();
    for (const row of POOL) {
      const id = String(row[1]);
      countByChapter.set(id, (countByChapter.get(id) ?? 0) + 1);
    }

    // 1問しか出ていない章は、対戦で同じ問題ばかり当たることになる。
    // 4大問20小問前後を書いているのだから、最低3問は出るべき。
    const tooFew = INORGANIC_DONE.filter((id) => (countByChapter.get(id) ?? 0) < 3);

    expect(
      tooFew,
      tooFew.length
        ? `次の章は対戦プールへの寄与が3問未満: ${tooFew
            .map((id) => `${id}(${countByChapter.get(id) ?? 0}問)`)
            .join(', ')}`
        : '',
    ).toEqual([]);
  });
});
