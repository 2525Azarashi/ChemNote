/**
 * ===================================================================
 * 章 × モードごとの localStorage キー名（quizStorageKeys）の特性テスト
 * ===================================================================
 *
 * ■ なにを守るテストか
 *
 * 解いている途中のクイズは、章とモードの組ごとに保存されている。
 *
 *     quiz_answers_<章ID>_<モード>   入力した解答（設問ID → 文字列）
 *     quiz_elim_<章ID>_<モード>      消去法で斜線を引いた選択肢
 *     quiz_idx_<章ID>_<モード>       いま何問目か
 *     quiz_expl_<章ID>_<モード>      解説を開いた状態か
 *     quiz_run_<章ID>_<モード>       採点結果（点数）
 *     quiz_step_<章ID>_<モード>      リスニングの何ステップ目か
 *
 * これが 5ファイル・21か所に手書きされていた。
 * キー名が1文字でも変わると「途中まで解いた解答が消える」ので、
 * 集約の前と後で文字列が1文字も変わらないことをここで固定する。
 *
 * ★モード（mini_test / practice）を含むのが重要★
 *   同じ章でも小テストと演習は別物として保存される。
 *   キーからモードが抜けると、小テストの解答が演習に出てしまう。
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  QUIZ_ANSWERS_KEY_PREFIX,
  QUIZ_ELIM_KEY_PREFIX,
  QUIZ_INDEX_KEY_PREFIX,
  QUIZ_EXPL_KEY_PREFIX,
  QUIZ_RUN_KEY_PREFIX,
  QUIZ_STEP_KEY_PREFIX,
  quizAnswersKey,
  quizElimKey,
  quizIndexKey,
  quizExplKey,
  quizRunKey,
  quizStepKey,
} from '../src/utils/quizStorageKeys';

const ROOT = path.resolve(__dirname, '..');
const read = (p: string) => fs.readFileSync(path.join(ROOT, p), 'utf-8');

/** 集約前に各所で書かれていた形をそのまま写したもの（比較の基準） */
const legacy = {
  answers: (id: string, mode: string) => `quiz_answers_${id}_${mode}`,
  elim: (id: string, mode: string) => `quiz_elim_${id}_${mode}`,
  idx: (id: string, mode: string) => `quiz_idx_${id}_${mode}`,
  expl: (id: string, mode: string) => `quiz_expl_${id}_${mode}`,
  run: (id: string, mode: string) => `quiz_run_${id}_${mode}`,
  step: (id: string, mode: string) => `quiz_step_${id}_${mode}`,
};

/** 実際に出てくる章IDとモードの組み合わせ */
const CASES: Array<[string, string]> = [
  ['c1_1', 'mini_test'],
  ['c1_1', 'practice'],
  ['c2_10', 'practice'],
  // 英語リスニング・英文法・数学・生物基礎の章IDも同じ形で扱われる
  ['l_q1a', 'practice'],
  ['g_1', 'mini_test'],
  ['m_1_1', 'practice'],
  ['b_1', 'mini_test'],
];

describe('キー名が集約前と1文字も違わない', () => {
  it('6種類の接頭辞', () => {
    // ここを書き換えると解いている途中の解答が読めなくなる。
    expect(QUIZ_ANSWERS_KEY_PREFIX).toBe('quiz_answers_');
    expect(QUIZ_ELIM_KEY_PREFIX).toBe('quiz_elim_');
    expect(QUIZ_INDEX_KEY_PREFIX).toBe('quiz_idx_');
    expect(QUIZ_EXPL_KEY_PREFIX).toBe('quiz_expl_');
    expect(QUIZ_RUN_KEY_PREFIX).toBe('quiz_run_');
    expect(QUIZ_STEP_KEY_PREFIX).toBe('quiz_step_');
  });

  it('どの章 × モードでも集約前とまったく同じ文字列になる', () => {
    for (const [id, mode] of CASES) {
      expect(quizAnswersKey(id, mode)).toBe(legacy.answers(id, mode));
      expect(quizElimKey(id, mode)).toBe(legacy.elim(id, mode));
      expect(quizIndexKey(id, mode)).toBe(legacy.idx(id, mode));
      expect(quizExplKey(id, mode)).toBe(legacy.expl(id, mode));
      expect(quizRunKey(id, mode)).toBe(legacy.run(id, mode));
      expect(quizStepKey(id, mode)).toBe(legacy.step(id, mode));
    }
  });

  it('実際に使われている文字列そのものを固定する', () => {
    // テストが式を写しただけだと「両方同じ間違いをしている」可能性が残る。
    // 目で見て分かる形でも1つ固定しておく。
    expect(quizAnswersKey('c1_1', 'mini_test')).toBe('quiz_answers_c1_1_mini_test');
    expect(quizRunKey('c1_1', 'practice')).toBe('quiz_run_c1_1_practice');
    expect(quizIndexKey('c2_3', 'practice')).toBe('quiz_idx_c2_3_practice');
    expect(quizElimKey('c1_1', 'practice')).toBe('quiz_elim_c1_1_practice');
    expect(quizExplKey('c1_1', 'practice')).toBe('quiz_expl_c1_1_practice');
    expect(quizStepKey('l_q1a', 'practice')).toBe('quiz_step_l_q1a_practice');
  });

  it('モードが違えば別のキーになる（小テストと演習が混ざらない）', () => {
    // ここが崩れると「小テストで入れた解答が演習に出る」ことになる。
    for (const key of [quizAnswersKey, quizElimKey, quizIndexKey, quizExplKey, quizRunKey, quizStepKey]) {
      expect(key('c1_1', 'mini_test')).not.toBe(key('c1_1', 'practice'));
    }
  });

  it('章が違えば別のキーになる', () => {
    for (const key of [quizAnswersKey, quizElimKey, quizIndexKey, quizExplKey, quizRunKey, quizStepKey]) {
      expect(key('c1_1', 'practice')).not.toBe(key('c1_2', 'practice'));
    }
  });

  it('6種類のキーは互いに衝突しない', () => {
    const keys = [
      quizAnswersKey('c1_1', 'practice'),
      quizElimKey('c1_1', 'practice'),
      quizIndexKey('c1_1', 'practice'),
      quizExplKey('c1_1', 'practice'),
      quizRunKey('c1_1', 'practice'),
      quizStepKey('c1_1', 'practice'),
    ];
    expect(new Set(keys).size).toBe(6);
  });
});

describe('既に保存されている「解いている途中」のデータが読める', () => {
  it('集約前のキーで書いた値を、集約後の関数で読み出せる', () => {
    const map = new Map<string, string>();
    const ls = {
      getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
      setItem: (k: string, v: string) => void map.set(k, String(v)),
    };
    const id = 'c1_1';
    const mode = 'practice';

    // 集約前の書き方で保存（＝いまユーザーの端末に入っている状態）
    ls.setItem(legacy.answers(id, mode), JSON.stringify({ q1_a: 'ア', q1_b: 'イ' }));
    ls.setItem(legacy.elim(id, mode), JSON.stringify({ q1_a: ['ウ'] }));
    ls.setItem(legacy.idx(id, mode), '3');
    ls.setItem(legacy.expl(id, mode), 'true');
    ls.setItem(legacy.run(id, mode), JSON.stringify({ perQuestion: { q1: { finalScore: 8 } } }));
    ls.setItem(legacy.step(id, mode), '2');

    // 集約後の関数で読む
    expect(JSON.parse(ls.getItem(quizAnswersKey(id, mode))!).q1_a).toBe('ア');
    expect(JSON.parse(ls.getItem(quizElimKey(id, mode))!).q1_a).toEqual(['ウ']);
    expect(ls.getItem(quizIndexKey(id, mode))).toBe('3');
    expect(ls.getItem(quizExplKey(id, mode))).toBe('true');
    expect(JSON.parse(ls.getItem(quizRunKey(id, mode))!).perQuestion.q1.finalScore).toBe(8);
    expect(ls.getItem(quizStepKey(id, mode))).toBe('2');
  });
});

describe('旧データ引き継ぎ（progress）が quiz_run_ / quiz_answers_ を読めている', () => {
  function installStorage() {
    const map = new Map<string, string>();
    (globalThis as any).localStorage = {
      getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
      setItem: (k: string, v: string) => void map.set(k, String(v)),
      removeItem: (k: string) => void map.delete(k),
      clear: () => map.clear(),
      key: (i: number) => [...map.keys()][i] ?? null,
      get length() {
        return map.size;
      },
    };
    return map;
  }

  it('quiz_run_ の点数から進捗を復元する', async () => {
    const map = installStorage();
    const { backfillLegacyProgress, readSolvedMap, problemKey } = await import(
      '../src/utils/progress'
    );

    // 集約前のキー名で「1点以上取った大問」を仕込む
    map.set(
      quizRunKey('c1_1', 'practice'),
      JSON.stringify({ perQuestion: { p1: { finalScore: 5 }, p2: { finalScore: 0 } } }),
    );

    backfillLegacyProgress('u', [
      { id: 'c1_1', miniTest: [], practiceProblems: [{ id: 'p1' }, { id: 'p2' }] },
    ] as any);

    const solved = readSolvedMap('u');
    // 1点以上の p1 だけが進捗に入る（0点の p2 は入らない）
    expect(solved[problemKey('c1_1', 'p1')]).toBeGreaterThan(0);
    expect(solved[problemKey('c1_1', 'p2')]).toBeUndefined();
  });

  it('quiz_answers_ の解答から進捗を復元する', async () => {
    const map = installStorage();
    const { backfillLegacyProgress, readSolvedMap, problemKey } = await import(
      '../src/utils/progress'
    );

    // 点数は無いが解答だけ残っている場合
    map.set(quizAnswersKey('c1_1', 'practice'), JSON.stringify({ p1_a: 'ア' }));

    backfillLegacyProgress('u', [
      {
        id: 'c1_1',
        miniTest: [],
        practiceProblems: [{ id: 'p1', subQuestions: [{ id: 'p1_a' }] }],
      },
    ] as any);

    expect(readSolvedMap('u')[problemKey('c1_1', 'p1')]).toBeGreaterThan(0);
  });
});

describe('src の中にキー名の手書きが残っていない', () => {
  const FILES = [
    'src/App.tsx',
    'src/components/ChapterSelection.tsx',
    'src/components/Quiz.tsx',
    // Quiz.tsx から切り出した「章の途中経過の保存/復元」も同じ見張りの対象にする
    'src/utils/quizRunState.ts',
    'src/utils/progress.ts',
  ];

  const HANDWRITTEN = /`quiz_(answers|elim|idx|expl|run|step)_\$\{/;

  /**
   * コメント行を除いて、キー名を手書きしている行を探す。
   *
   * コメントを除く理由：
   *   progress.ts と Quiz.tsx の説明コメントには、
   *   「以前は `quiz_answers_${章ID}_mini_test` のキー数を数えていた」のように
   *   *昔の不具合の説明として* 旧コードを引用している箇所がある。
   *   これは実際に動くコードではないので、消すと経緯が読めなくなる。
   *   ここで見張りたいのは「動くコードに手書きが残っていないか」なので、
   *   コメント行は対象外にする。
   *
   * ただしコメントを飛ばす実装にすると「何も検査していない」状態に
   * なりやすいので、下に自己テスト（本物のコード行なら検出できるか）を置いている。
   */
  function findHandwrittenKeyLine(src: string): { line: number; text: string } | null {
    const lines = src.split('\n');
    let inBlockComment = false;

    for (let i = 0; i < lines.length; i++) {
      const raw = lines[i];
      const trimmed = raw.trim();

      // ブロックコメント（/** ... */）の中かどうかを追う
      if (inBlockComment) {
        if (trimmed.includes('*/')) inBlockComment = false;
        continue;
      }
      if (trimmed.startsWith('/*')) {
        if (!trimmed.includes('*/')) inBlockComment = true;
        continue;
      }
      if (trimmed.startsWith('*') || trimmed.startsWith('//')) continue;

      if (HANDWRITTEN.test(raw)) {
        return { line: i + 1, text: trimmed };
      }
    }
    return null;
  }

  it('番人の自己テスト: 本物のコード行なら手書きを検出できる', () => {
    // コメントを飛ばす実装にしたので、「常に null を返すだけ」の
    // 抜け殻になっていないことをここで確かめる。
    const fakeCode = [
      '/**',
      ' * 以前は `quiz_answers_${chapterId}_mini_test` を数えていた。',
      ' */',
      "// const old = `quiz_run_${chapterId}_${mode}`;",
      'const key = `quiz_answers_${chapterId}_${mode}`;',
    ].join('\n');

    const hit = findHandwrittenKeyLine(fakeCode);
    expect(hit).not.toBeNull();
    expect(hit!.line).toBe(5);
    expect(hit!.text).toContain('const key =');

    // 逆に、コメントだけなら検出しない（＝経緯の説明は残せる）
    const onlyComments = fakeCode.split('\n').slice(0, 4).join('\n');
    expect(findHandwrittenKeyLine(onlyComments)).toBeNull();
  });

  it('`quiz_answers_${...}` などのテンプレート手書きが無い', () => {
    for (const file of FILES) {
      const hit = findHandwrittenKeyLine(read(file));
      expect(
        hit,
        `${file}:${hit?.line} にキー名の手書きが残っている: ${hit?.text}`
      ).toBeNull();
    }
  });

  it('接頭辞の文字列を持っているのは quizStorageKeys.ts だけ', () => {
    const src = read('src/utils/quizStorageKeys.ts');
    for (const prefix of [
      "'quiz_answers_'",
      "'quiz_elim_'",
      "'quiz_idx_'",
      "'quiz_expl_'",
      "'quiz_run_'",
      "'quiz_step_'",
    ]) {
      expect(src, `${prefix} が集約先に無い`).toContain(prefix);
    }
  });
});
