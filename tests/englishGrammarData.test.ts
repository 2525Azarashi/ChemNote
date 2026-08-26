/**
 * ===================================================================
 * 英文法（単元別・4択演習）データの構造テスト
 * ===================================================================
 * ご要望（原文）：
 *   > 英文法単元別に追加してください。
 *   > スマホの方はしっかりと科目選択画面で１画面に収まるようにしてください。
 *   > ＋森田哲也の英文法講座とかユーチューブの動画をおモッキリ参考にして
 *   > 全網羅してください。問題は全網羅するようにしてください。
 *   > ＋基本的には４たくの問題（ねくすてとかスクランブルみたいな感じ）
 *   > いっかいつくって　リスニングのような形でつくると結構いいかも
 *
 * ★このファイルが守る不変条件★
 *
 *  1. 単元（章）と問題が 1:1 で正しく結びついている
 *     単元の配列を貼り間違えても TypeScript は通ってしまう（どちらも同じ型）。
 *     実際に一度、eg2_5 に接続詞の配列、eg3_2 に eg3_1 と同じ配列を
 *     割り当てるという取り違えが起きた。だから「章IDが問題IDに含まれるか」を
 *     機械的に検査して、二度と起きないようにする。
 *
 *  2. 単元が挙げた topics と、実際の問題が扱う topic が一字一句一致する
 *     「全網羅してください」というご要望に対して、
 *     単元の説明に書いたのに問題が無い（＝網羅していない）状態を防ぐ。
 *
 *  3. ★「リスニングのような形」が実際に成立している★
 *     解説の自動生成（buildListeningExplanation）は
 *       ・audioTracks[].subId === subQuestions[].id
 *       ・audioTracks[].script が空でない
 *       ・subQuestions[].label に「問N」がある
 *       ・explanation の見出しが行頭の「問N」である
 *     の 4 つが揃ったときだけ働く。1 つでも崩れると
 *     見た目は正常なまま解説だけが素の文章に落ちるので、気づけない。
 *     だから 4 条件すべてをここで固定する。
 *
 *  4. 4択（ネクステ／スクランブル型）である
 *     選択肢は必ず ①〜④ の 4 つ。正解はそのいずれか。
 */
import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import {
  englishGrammarData,
  getAllGrammarChapters,
  getGrammarStats,
} from '../src/data/englishGrammarData';
import { LISTENING_SCRIPT_FIRST_MARK } from '../src/utils/listeningExplanation';

const chapters = getAllGrammarChapters();
const allProblems = chapters.flatMap((c) => c.practiceProblems as any[]);
/** 全設問（小問）を単元とセットで平らに並べたもの */
const allSubs = chapters.flatMap((c) =>
  (c.practiceProblems as any[]).flatMap((p) =>
    (p.subQuestions as any[]).map((sq) => ({ chapter: c, problem: p, sq })),
  ),
);

describe('英文法の単元構成', () => {
  it('3 パート（文法／語法／イディオム・会話表現）に分かれている', () => {
    expect(englishGrammarData.parts.map((p) => p.id)).toEqual([
      'eg_grammar',
      'eg_usage',
      'eg_expression',
    ]);
  });

  it('全 20 単元ある（文法14／語法4／表現2）', () => {
    expect(englishGrammarData.parts.map((p) => p.chapters.length)).toEqual([14, 4, 2]);
    expect(chapters).toHaveLength(20);
  });

  it('単元 ID が重複していない（進捗は単元IDで管理するので衝突は致命的）', () => {
    const ids = chapters.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('単元 ID は eg<パート番号>_<連番> の形をしている', () => {
    for (const c of chapters) expect(c.id).toMatch(/^eg\d_\d$/u);
  });

  it('全単元に扱う内容（topics）と単元名がある', () => {
    for (const c of chapters) {
      expect(c.abstractTitle.length).toBeGreaterThan(0);
      expect(c.realTitle.length).toBeGreaterThan(0);
      expect(c.topics.length).toBeGreaterThan(0);
    }
  });
});

describe('★単元と問題の結びつき★（配列の貼り間違いを機械的に防ぐ）', () => {
  it('全 20 単元に問題が入っている（空の単元を作らない）', () => {
    const empty = chapters.filter((c) => (c.practiceProblems as any[]).length === 0);
    expect(empty.map((c) => c.id)).toEqual([]);
  });

  it('各単元の問題 ID には必ずその単元 ID が含まれる', () => {
    // ★これが eg2_5 / eg3_2 の取り違えを検出する見張り★
    const wrong: string[] = [];
    for (const c of chapters) {
      for (const p of c.practiceProblems as any[]) {
        if (!String(p.id).includes(c.id)) wrong.push(`${c.id} <- ${p.id}`);
      }
    }
    expect(wrong).toEqual([]);
  });

  it('同じ問題が 2 つの単元に現れない（配列の使い回しを防ぐ）', () => {
    const ids = allProblems.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('収録数の集計（科目選択画面に出す数字）が実データと合う', () => {
    const stats = getGrammarStats();
    expect(stats.chapters).toBe(20);
    expect(stats.questions).toBe(allProblems.length);
    expect(stats.marks).toBe(allProblems.reduce((n, p) => n + p.subQuestions.length, 0));
    // 「全20単元・4択100問」と表示している根拠
    expect(stats.marks).toBe(100);
  });
});

describe('★全網羅★ 単元が挙げた topics を問題がすべて扱っている', () => {
  // ★注意★ topic は「作るときの入力（EgItem.topic）」であって、
  // buildEgSet が組み立てた成果物（GrammarProblem）には残らない。
  // 実際に実行時のオブジェクトを調べたら topic は存在しなかった。
  // なので topics との突き合わせは、問題を書いたソースを読んで行う。
  // （ここを「実行時に topic があるはず」と決め打ちすると、
  //   テストが通らないのを見て逆にデータを壊しに行ってしまう。）
  const DATA_DIR = path.resolve(__dirname, '../src/data');
  /** 'xxx' でも "xxx" でも 1 つの文字列リテラルを読む（\' \" のエスケープ対応） */
  const STR = /'((?:[^'\\]|\\.)*)'|"((?:[^"\\]|\\.)*)"/g;
  const unquote = (m: RegExpMatchArray) =>
    (m[1] !== undefined ? m[1] : m[2]).replace(/\\(['"\\])/g, '$1');

  /** 単元ID -> ソースに書かれた topic の並び */
  const topicsInSource = new Map<string, string[]>();
  for (const f of fs.readdirSync(DATA_DIR).filter((f) => /^egProblems.*\.ts$/u.test(f))) {
    const src = fs.readFileSync(path.join(DATA_DIR, f), 'utf-8');
    for (const block of src.matchAll(/const (EG\d_\d)_ITEMS[\s\S]*?\n\];/gu)) {
      const cid = block[1].toLowerCase();
      const list = [...block[0].matchAll(/^ {4}topic: (.+),$/gmu)].map((line) => {
        const found = [...line[1].matchAll(STR)];
        return found.length ? unquote(found[0]) : line[1];
      });
      topicsInSource.set(cid, list);
    }
  }

  it('全 20 単元ぶんの問題ソースが見つかる', () => {
    expect([...topicsInSource.keys()].sort()).toEqual(chapters.map((c) => c.id).sort());
  });

  it('単元の topics と、問題ソースの topic が「順番も文字も」完全一致する', () => {
    // ★一字一句そろえる★ ことで、
    // 「単元の説明には書いたのに問題が無い（＝網羅していない）」
    // 「別の単元の問題を貼ってしまった」の両方を同時に検出できる。
    const bad: string[] = [];
    for (const c of chapters) {
      const got = topicsInSource.get(c.id) ?? [];
      if (got.length !== c.topics.length) {
        bad.push(`${c.id}: topic の個数 ${got.length} != topics ${c.topics.length}`);
        continue;
      }
      c.topics.forEach((t, i) => {
        if (got[i] !== t) bad.push(`${c.id}[${i}]: 「${got[i]}」 != 「${t}」`);
      });
    }
    expect(bad).toEqual([]);
  });

  it('1 単元あたり 5 問（＝各 topic に問題が 1 つずつ）', () => {
    for (const c of chapters) {
      const marks = (c.practiceProblems as any[]).reduce(
        (n, p) => n + (p.subQuestions as any[]).length,
        0,
      );
      expect(marks).toBe(c.topics.length);
      expect(marks).toBe(5);
    }
  });
});

describe('★4択（ネクステ／スクランブル型）である★', () => {
  it('全設問の選択肢は ①〜④ の 4 つ', () => {
    const bad: string[] = [];
    for (const p of allProblems) {
      for (const sq of p.subQuestions as any[]) {
        if (JSON.stringify(sq.options) !== JSON.stringify(['①', '②', '③', '④'])) {
          bad.push(`${sq.id}: ${JSON.stringify(sq.options)}`);
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('正解は必ず ①〜④ のいずれか', () => {
    // ★フィールド名は correctAnswer★（実行時のデータを実際に見て確認した）。
    // 他科目の設問と同じ名前なので、採点処理をそのまま流用できる。
    const bad: string[] = [];
    for (const { sq } of allSubs) {
      if (!['①', '②', '③', '④'].includes(sq.correctAnswer)) {
        bad.push(`${sq.id}: ${sq.correctAnswer}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('問題文に ①〜④ の選択肢本文が全部載っている', () => {
    // options は記号だけなので、本文が text に無いと解けない。
    const bad: string[] = [];
    for (const p of allProblems) {
      const text = String(p.text);
      const perQuestion = (p.subQuestions as any[]).length;
      for (const mark of ['①', '②', '③', '④']) {
        const n = text.split(mark).length - 1;
        if (n < perQuestion) bad.push(`${p.id}: ${mark} が ${n} 個（設問 ${perQuestion} 個）`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('正答率（correctAnswerRate）が 1〜99% の常識的な範囲にある', () => {
    for (const { sq } of allSubs) {
      expect(sq.correctAnswerRate).toBeGreaterThan(0);
      expect(sq.correctAnswerRate).toBeLessThan(100);
    }
  });

  it('英文・選択肢の本文は問題文（text）側に載っている', () => {
    // options を ①〜④ の記号だけにしているぶん、
    // 英文と選択肢の中身は text に無いと解けなくなる。
    for (const p of allProblems) {
      expect(String(p.text).length).toBeGreaterThan(50);
    }
  });
});

// =====================================================================
// ★正解そのものが正しいかを、正解データに頼らずに確かめる★
//
// ■ なぜ専用の検査が必要か
//   「解説の『正解は ○』と correctAnswer が一致する」という検査は
//   一見それらしいが、実は正解の誤りを絶対に見つけられない。
//   englishGrammarKit.ts の中で
//       correctAnswer: item.answer                     （小問データ）
//       `問N　正解は ${item.answer}`                    （解説本文）
//   と、どちらも同じ item.answer から作られているからだ。
//   answer を ① から ③ に書き換えると両方が一緒に ③ に変わり、
//   食い違いが起きないまま「間違った答え」が正解として通ってしまう。
//   （実際にミューテーション試験でこの穴が見つかった。）
//
// ■ そこで item.answer とは別に手書きしてある full（完成文）を物差しにする
//   full は「空所を埋めた正しい英文」で、記号ではなく英文そのもの。
//   answer とは独立に1問ずつ書いてあるので、
//       問題文の英文の空所に、①〜④ の本文を順番に入れてみて
//       完成文（＝音源の台本 script）と一致するのはどれか
//   を調べれば、正解の記号を使わずに正解を割り出せる。
//   その結果と correctAnswer が食い違えば、
//   「答えの記号が間違っている」か「音源が別の文を読んでいる」
//   のどちらかであり、どちらも受験生に直接害が出る不具合になる。
//
// ■ 表記のゆれだけは吸収する（意味の違いは吸収しない）
//   空所（______）のうしろに句読点がある行では
//   「is ?」のように余分な空白が残る。会話問題では
//   話者を分けるための引用符（"…" "…"）が台本には入らない。
//   この2つだけを norm() でそろえる。単語の綴りや語順は一切触らない
//   ——触ってしまうと、肝心の「別の選択肢と見分ける力」が落ちる。
// =====================================================================
describe('★正解の妥当性★ 答えの記号に頼らず、完成文（音源台本）から正解を割り出す', () => {
  const MARKS = ['①', '②', '③', '④'] as const;

  /** 句読点前の余分な空白と、会話文の引用符だけをそろえる */
  const norm = (s: string) =>
    String(s)
      .replace(/\s+/gu, ' ')
      .replace(/\s+([.,?!;:])/gu, '$1')
      .replace(/["“”]/gu, '')
      .trim();

  /** 問題文（text）から、その小問の英文と ①〜④ の本文を取り出す */
  const readQuestion = (problem: any, no: number) => {
    const lines = String(problem.text).split('\n');
    const head = lines.findIndex((l) => new RegExp(`^問${no}　`, 'u').test(l));
    if (head < 0) return null;
    const sentence = lines[head].replace(new RegExp(`^問${no}　`, 'u'), '');
    const choices = MARKS.map((m, i) =>
      String(lines[head + 1 + i] ?? '').replace(new RegExp(`^${m} `, 'u'), ''),
    );
    return { sentence, choices };
  };

  /** 空所に各選択肢を入れて、音源台本と一致した記号を返す */
  const solveFromScript = (problem: any, sq: any) => {
    const no = Number(String(sq.label).match(/問\s*(\d+)/u)?.[1]);
    const q = readQuestion(problem, no);
    const track = (problem.audioTracks as any[]).find((t) => t.subId === sq.id);
    if (!q || !track) return null;
    const script = norm(track.script);
    return {
      no,
      matched: MARKS.filter((_, i) => norm(q.sentence.replace(/_+/u, q.choices[i])) === script),
    };
  };

  it('問題文から英文と ①〜④ の本文を必ず取り出せる（本文の並びが崩れていない）', () => {
    const bad: string[] = [];
    for (const { problem, sq } of allSubs) {
      const solved = solveFromScript(problem, sq);
      if (!solved) bad.push(`${problem.id} / ${sq.label}: 本文または音源が見つからない`);
    }
    expect(bad).toEqual([]);
  });

  it('★空所に入れて完成文と一致する選択肢は、ちょうど 1 つだけ★（正解が 2 つ・0 個にならない）', () => {
    // 0 個なら音源が問題文と別の英文を読んでいる。
    // 2 つ以上なら選択肢が実質同じで、4択として成立していない。
    const bad: string[] = [];
    for (const { problem, sq } of allSubs) {
      const solved = solveFromScript(problem, sq);
      if (!solved) continue;
      if (solved.matched.length !== 1) {
        bad.push(`${problem.id} 問${solved.no}: 一致した選択肢 ${solved.matched.length} 個 [${solved.matched.join('')}]`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('★完成文から割り出した正解と、correctAnswer が一致する★（答えの記号の書き間違いを検出する）', () => {
    const bad: string[] = [];
    for (const { problem, sq } of allSubs) {
      const solved = solveFromScript(problem, sq);
      if (!solved || solved.matched.length !== 1) continue;
      if (solved.matched[0] !== sq.correctAnswer) {
        bad.push(
          `${problem.id} 問${solved.no}: 完成文は ${solved.matched[0]} なのに correctAnswer は ${sq.correctAnswer}`,
        );
      }
    }
    expect(bad).toEqual([]);
  });

  it('この検査が 100 問すべてに効いている（すり抜けている問題が無い）', () => {
    const checked = allSubs.filter(({ problem, sq }) => {
      const solved = solveFromScript(problem, sq);
      return solved !== null && solved.matched.length === 1;
    });
    expect(checked.length).toBe(allSubs.length);
    expect(checked.length).toBe(100);
  });
});

describe('★「リスニングのような形」が成立している★', () => {
  it('全問に音源（audioTracks）が付いている', () => {
    // Quiz / Explanation の再生プレーヤーは
    // 「audioTracks が配列で 1 つ以上あるか」だけを見て出る（科目判定はしない）。
    // つまりここが満たされていれば、英文法でもリスニングと同じ UI になる。
    for (const p of allProblems) {
      expect(Array.isArray(p.audioTracks)).toBe(true);
      expect((p.audioTracks as any[]).length).toBeGreaterThan(0);
    }
  });

  it('音源の subId が設問 ID と 1:1 で対応している', () => {
    const bad: string[] = [];
    for (const p of allProblems) {
      const subIds = (p.subQuestions as any[]).map((sq) => sq.id).sort();
      const trackIds = (p.audioTracks as any[]).map((t) => t.subId).sort();
      if (JSON.stringify(subIds) !== JSON.stringify(trackIds)) {
        bad.push(`${p.id}: ${JSON.stringify(trackIds)} != ${JSON.stringify(subIds)}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('全音源に読み上げ台本（script）と和訳がある', () => {
    const bad: string[] = [];
    for (const p of allProblems) {
      for (const t of p.audioTracks as any[]) {
        if (!String(t.script ?? '').trim()) bad.push(`${t.subId}: script が空`);
        if (!String(t.translation ?? '').trim()) bad.push(`${t.subId}: translation が空`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('設問ラベルに「問N」が入っている（解説の自動生成が設問を見つける手がかり）', () => {
    const bad: string[] = [];
    for (const p of allProblems) {
      for (const sq of p.subQuestions as any[]) {
        if (!/問\s*(\d+)/u.test(String(sq.label ?? ''))) bad.push(`${sq.id}: ${sq.label}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('解説の見出しが「行頭の 問N」になっている', () => {
    // 行頭でないと questionNumberOf が拾えず、
    // 見た目は正常なまま解説だけ素の文章に落ちる（気づけない不具合）。
    const bad: string[] = [];
    for (const p of allProblems) {
      const heads = String(p.explanation)
        .split('\n')
        .filter((l) => /^\s*問\s*\d+/u.test(l)).length;
      if (heads < (p.subQuestions as any[]).length) {
        bad.push(`${p.id}: 見出し ${heads} 個 < 設問 ${(p.subQuestions as any[]).length} 個`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('★リスニング型の解説が実際に組まれている★（素の解説に落ちていない）', () => {
    // buildListeningExplanation が働いた解説だけに入る目印を確認する。
    // これが無い＝4 条件のどれかが崩れて素の解説になっている、ということ。
    const bad = allProblems
      .filter((p) => !String(p.explanation).includes(LISTENING_SCRIPT_FIRST_MARK))
      .map((p) => p.id);
    expect(bad).toEqual([]);
  });

  it('英文法は 1 回読み（readCount: 1）——2回続けて再生の案内を出さない', () => {
    // 「2回続けて再生」はリスニング試験固有の話で、英文法には無い概念。
    // ListeningAudioPlayer は readCount === 2 のときだけその UI を出す。
    for (const p of allProblems) expect(p.readCount).toBe(1);
  });
});

describe('誤答肢の理由まで書いてある（4択を「当てる」で終わらせない）', () => {
  it('全設問に detailedExplanation（狙い・型・難易度・手順）がある', () => {
    // ★実行時のフィールドは detailedExplanation の中★
    // steps / commentary が設問の直下にあると思い込んでいたが、
    // 実際に中身を出して確認したら detailedExplanation.steps だった。
    // commentary は「作るときの入力」で、成果物では explanation 本文に溶けている。
    const bad: string[] = [];
    for (const { sq } of allSubs) {
      const d = sq.detailedExplanation;
      if (!d) { bad.push(`${sq.id}: detailedExplanation が無い`); continue; }
      if (!String(d.theme ?? '').trim()) bad.push(`${sq.id}: theme が空`);
      if (!String(d.type ?? '').trim()) bad.push(`${sq.id}: type が空`);
      if (!(d.difficulty >= 1 && d.difficulty <= 5)) bad.push(`${sq.id}: difficulty=${d.difficulty}`);
      if (!Array.isArray(d.steps) || d.steps.length < 2) bad.push(`${sq.id}: steps が足りない`);
    }
    expect(bad).toEqual([]);
  });

  /**
   * 解説本文を「各問の詳細ブロック」に切り分ける。
   *
   * ★単純に行頭の「問N」で切ってはいけない★
   * 実際の解説を出力して確かめたら、先頭に
   *   [解 答] 問1 【解答】① / 問2 【解答】① …
   * という一覧ブロックが付いていて、「問N」で始まる行が
   * 1 問につき 2 回（一覧＋詳細）現れる。
   * 行頭「問N」で切ると一覧の断片まで拾い、
   * 「解説に①〜④が無い」という誤った失敗になった（データは正しかった）。
   * 詳細ブロックは必ず「問N　正解は ○」で始まるので、そこで切る。
   */
  const detailSections = (explanation: string) =>
    explanation
      .split(/\n(?=\s*問\s*\d+\s*[　\s]*正解は)/u)
      .filter((s) => /^\s*問\s*\d+\s*[　\s]*正解は/u.test(s));

  it('解説の詳細ブロックが設問と同じ数だけある', () => {
    const bad: string[] = [];
    for (const p of allProblems) {
      const n = detailSections(String(p.explanation)).length;
      const want = (p.subQuestions as any[]).length;
      if (n !== want) bad.push(`${p.id}: 詳細ブロック ${n} != 設問 ${want}`);
    }
    expect(bad).toEqual([]);
  });

  it('★解説本文が 4 つの選択肢すべてに触れている★', () => {
    // 正解の理由だけ書いて誤答肢を放置すると、
    // 「なぜ他が駄目か」が分からず次に活かせない。
    // commentary は explanation 本文に溶けているので、本文側で確認する。
    const bad: string[] = [];
    for (const p of allProblems) {
      const sections = detailSections(String(p.explanation));
      (p.subQuestions as any[]).forEach((sq, i) => {
        for (const mark of ['①', '②', '③', '④']) {
          if (!(sections[i] ?? '').includes(mark)) bad.push(`${sq.id}: ${mark} の説明が無い`);
        }
      });
    }
    expect(bad).toEqual([]);
  });

  it('各問の解説の「正解は ○」が正解データと一致する', () => {
    // 解説とデータで正解がずれると、
    // 「不正解」と採点されたのに解説では自分の答えが正解になっている、
    // という一番信頼を失う不具合になる。
    const bad: string[] = [];
    for (const p of allProblems) {
      const sections = detailSections(String(p.explanation));
      (p.subQuestions as any[]).forEach((sq, i) => {
        const m = /正解は\s*([①②③④])/u.exec(sections[i] ?? '');
        if (!m) { bad.push(`${sq.id}: 解説に「正解は ○」が無い`); return; }
        if (m[1] !== sq.correctAnswer) {
          bad.push(`${sq.id}: 解説は ${m[1]} だがデータは ${sq.correctAnswer}`);
        }
      });
    }
    expect(bad).toEqual([]);
  });

  it('周辺知識・深掘りテーマが全問に付いている', () => {
    for (const p of allProblems) {
      expect((p.surroundingKnowledge as any[]).length).toBeGreaterThan(0);
      expect((p.deepDiveTopics as any[]).length).toBeGreaterThan(0);
    }
  });
});
