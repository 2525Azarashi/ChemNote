import { describe, it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { chemistryData } from '../src/data/chemistryData';
import { sanitizeInlineHtml, SANITIZER_ALLOWLIST } from '../src/utils/sanitizeHtml';
import { buildFigureNumberMap, getFigureNumber } from '../src/utils/figureNumbering';

/**
 * ===================================================================
 * 問題に付随する図が「実際に画面へ出る形」で持たれているかの回帰テスト
 * ===================================================================
 *
 * ■ 何が起きていたか（このテストが生まれた理由）
 *   1章②A（物質の分離と精製）の演習問題では、図を
 *     "text": "... <img src=\"/fig_filtration_abcd.png\" ...> ..."
 *   のように問題文の文字列へ直接埋め込んでいた。
 *
 *   ところが問題文は formatText() → sanitizeInlineHtml() を通して描画される。
 *   サニタイザは許可リスト方式で、<img> は「外部リソースを読み込む副作用がある」
 *   ため意図的に許可していない。結果、タグが丸ごと落ちて
 *   **図がまったく表示されない**（画像ファイルは public に存在していた）。
 *
 * ■ どう直したか
 *   図は問題文の文字列ではなく、問題オブジェクトの imageUrl / imageCaption に持たせ、
 *   QuestionFigure コンポーネントで描画する設計へ寄せた。
 *   これなら図番号の採番・拡大表示・代替テキストも一緒に効く。
 *
 * ■ このテストが守ること
 *   ① 問題文に <img> を書き戻さない（書いても表示されないため）
 *   ② imageUrl の指す画像が public に実在する（リンク切れを防ぐ）
 *   ③ サニタイザが <img> を落とす仕様であること自体（前提の明文化）
 */

type AnyQuestion = {
  id?: string;
  text?: string;
  imageUrl?: string;
  imageCaption?: string;
};

/** 全章の全問題（演習＋小テスト）を平らに集める */
function collectAllQuestions(): AnyQuestion[] {
  const out: AnyQuestion[] = [];
  for (const part of (chemistryData as any).parts ?? []) {
    for (const chapter of part.chapters ?? []) {
      for (const q of chapter.practiceProblems ?? []) out.push(q);
      for (const q of chapter.miniTest ?? []) out.push(q);
    }
  }
  return out;
}

/** 指定 ID の章を探す */
function findChapter(chapterId: string): any {
  for (const part of (chemistryData as any).parts ?? []) {
    for (const chapter of part.chapters ?? []) {
      if (chapter.id === chapterId) return chapter;
    }
  }
  return null;
}

const allQuestions = collectAllQuestions();

describe('問題文に生の <img> を書かない（書いても表示されない）', () => {
  it('サニタイザは <img> を許可していない（前提の確認）', () => {
    expect(SANITIZER_ALLOWLIST.tags.has('img')).toBe(false);
  });

  it('サニタイザを通すと <img> は消える（不具合の再現）', () => {
    const html = '前<img src="/fig_filtration_abcd.png" alt="図" />後';
    const sanitized = sanitizeInlineHtml(html);
    expect(sanitized).not.toContain('<img');
    // タグは消えるがテキストは残る（情報を失わない設計）
    expect(sanitized).toContain('前');
    expect(sanitized).toContain('後');
  });

  it('化学基礎の問題データに <img> が残っていない', () => {
    const offenders = allQuestions
      .filter((q) => typeof q.text === 'string' && /<img\b/i.test(q.text))
      .map((q) => q.id);
    expect(offenders, `問題文に <img> が残っている: ${offenders.join(', ')}`).toEqual([]);
  });

  it('問題データのソースにも <img> が残っていない（新規追加の防止）', () => {
    const source = readFileSync(resolve(__dirname, '../src/data/chemistryData.ts'), 'utf-8');
    expect(source).not.toContain('<img');
  });
});

describe('imageUrl で持たれた図は実在し、正しく採番される', () => {
  it('imageUrl を持つ問題が存在する（移行できている）', () => {
    const withImage = allQuestions.filter((q) => !!q.imageUrl);
    expect(withImage.length).toBeGreaterThanOrEqual(7);
  });

  it('imageUrl の画像が public に実在する', () => {
    for (const q of allQuestions) {
      if (!q.imageUrl) continue;
      const path = resolve(__dirname, '../public', q.imageUrl.replace(/^\//, ''));
      expect(existsSync(path), `画像が見つからない: ${q.imageUrl}（${q.id}）`).toBe(true);
    }
  });

  it('imageUrl を持つ問題には説明文（imageCaption）も付いている', () => {
    for (const q of allQuestions) {
      if (!q.imageUrl) continue;
      expect(q.imageCaption, `${q.id} に imageCaption が無い`).toBeTruthy();
    }
  });
});

describe('1章②A（物質の分離と精製）の図が復活している', () => {
  const chapter = findChapter('c1_2_A');

  it('章が存在する', () => {
    expect(chapter).not.toBeNull();
    expect(chapter.abstractTitle).toContain('物質の分離と精製');
  });

  it('ろ過・蒸留・昇華・抽出の図が imageUrl として持たれている', () => {
    const map = new Map<string, string>(
      (chapter.practiceProblems as AnyQuestion[])
        .filter((q) => !!q.imageUrl)
        .map((q) => [q.id as string, q.imageUrl as string]),
    );
    expect(map.get('q_c1_2_A_1')).toBe('/fig_filtration_abcd.png');
    expect(map.get('q_c1_2_A_2')).toBe('/fig_distillation_setup.png');
    expect(map.get('q_c1_2_A_4')).toBe('/fig_sublimation_setups.png');
    expect(map.get('q_c1_2_A_5')).toBe('/fig_separating_funnel.png');
  });

  it('小テスト側の蒸留装置の図も imageUrl になっている', () => {
    const mt = (chapter.miniTest as AnyQuestion[]).find((q) => q.id === 'q_c1_2_A_mt_3');
    expect(mt?.imageUrl).toBe('/graph2.jpg');
  });

  it('演習問題の図が出現順に「図1・図2 …」と採番される', () => {
    const map = buildFigureNumberMap(chapter.practiceProblems);
    expect(getFigureNumber(map, 'q_c1_2_A_1')).toBe(1);
    expect(getFigureNumber(map, 'q_c1_2_A_2')).toBe(2);
    expect(getFigureNumber(map, 'q_c1_2_A_4')).toBe(3);
    // 図を持たない問題は採番されない
    expect(getFigureNumber(map, 'q_c1_2_A_3')).toBeUndefined();
  });

  it('図の位置を指す表現が「下の図」に直っている（図は問題文の後ろに出る）', () => {
    const texts = (chapter.practiceProblems as AnyQuestion[]).map((q) => q.text ?? '').join('\n');
    // 図は問題文の下に描画されるため、「上の図」と書くと指示が食い違う
    expect(texts).not.toContain('上の図の');
    expect(texts).not.toContain('上の(ア)');
    expect(texts).toContain('下の図の');
  });
});

describe('QuestionFigure 経由で描画されている（配線の確認）', () => {
  const quiz = readFileSync(resolve(__dirname, '../src/components/Quiz.tsx'), 'utf-8');
  // 問題文ペイン（図の描画を含む）は components/ProblemPane.tsx へ切り出した。
  const problem = readFileSync(resolve(__dirname, '../src/components/ProblemPane.tsx'), 'utf-8');
  const explanation = readFileSync(resolve(__dirname, '../src/components/Explanation.tsx'), 'utf-8');

  it('演習画面（Quiz）が imageUrl を QuestionFigure に渡している', () => {
    // 図の描画は問題文ペイン（ProblemPane.tsx）が持つ。
    // Quiz.tsx は「何番の図か」の対応表を作って props で渡すだけ。
    expect(problem).toContain('QuestionFigure');
    expect(problem).toContain('currentQuestion.imageUrl');
    expect(quiz).toContain('buildFigureNumberMap');
    expect(quiz).toContain('figureNumberMap={figureNumberMap}');
  });

  it('解説画面（Explanation）も同じ仕組みで図を出している', () => {
    expect(explanation).toContain('QuestionFigure');
    expect(explanation).toContain('imageUrl');
  });

  it('両画面で図番号が共有される（同じ問題は同じ図番号）', () => {
    expect(quiz).toContain('buildFigureNumberMap');
    expect(explanation).toContain('buildFigureNumberMap');
  });
});

/**
 * ★高校入試 理科（src/features/rika/）の図★
 *
 * ■ 見つけた不具合
 *   理科の問題データ（rikaData.ts）には imgs という欄があり、
 *   原典の図の番号（rId470 など）が入っている。ところが導入時の
 *   仕様書（app/導入手順.md）には図の扱いが1行も書かれておらず、
 *   画面（RikaPractice）も imgs を1度も読んでいなかった。
 *   そのため
 *     「図1のように炭酸水素ナトリウムを加熱して…」
 *     「(2) 図2で、炭素粉末の質量が 0.75g のとき…」
 *   といった設問が★図なしで出ていた★。グラフを読ませる問題なので
 *   図が無いと答えを出す手がかりが無い。
 *
 * ■ 直した内容
 *   原典の図 6 枚を public/rika/<rId>.png として置き、
 *   RikaPractice の exam 形式で本文の直後に描くようにした。
 *   （元は 1.11MB のスキャン画像。線画なので白黒 16 階調にして
 *     324KB まで落としてある。文字とグラフの目盛りは読める）
 *
 * ■ ここで見張ること
 *   ① imgs を持つ問題の図が public/rika に実在する（リンク切れ防止）
 *   ② 画面が imgs を読んでいる（配線が外れたら気づく）
 *   ③ 逆に、使っていない図をリポジトリに置いたままにしない
 */
describe('高校入試 理科の図が実在し、画面に配線されている', () => {
  const rikaData = readFileSync(resolve(__dirname, '../src/features/rika/rikaData.ts'), 'utf-8');
  const practice = readFileSync(resolve(__dirname, '../src/features/rika/RikaPractice.tsx'), 'utf-8');

  /** rikaData.ts の imgs 欄に出てくる図の番号をすべて集める */
  const usedIds = (() => {
    const set = new Set<string>();
    for (const m of rikaData.matchAll(/imgs:\s*\[([^\]]*)\]/g)) {
      for (const id of m[1].matchAll(/'([^']+)'/g)) set.add(id[1]);
    }
    return [...set].sort();
  })();

  it('図を持つ問題が存在する（欄が空のまま放置されていない）', () => {
    expect(usedIds.length).toBeGreaterThan(0);
  });

  it('① 使われている図がすべて public/rika に実在する', () => {
    const missing = usedIds.filter(
      (id) => !existsSync(resolve(__dirname, '../public/rika', `${id}.png`)),
    );
    expect(
      missing,
      `★図のファイルが無い★ public/rika/ に置いてください: ${missing.join(', ')}`,
    ).toEqual([]);
  });

  it('② 画面（RikaPractice）が imgs を読んで図を描いている', () => {
    expect(practice).toContain('item.imgs');
    expect(practice).toContain("'/rika/'");
    // 図を持たない問題では1枚も読み込まないこと（長さの条件が入っている）
    expect(practice).toMatch(/item\.imgs\.length\s*>\s*0/);
  });

  it('③ 使っていない図をリポジトリに置いたままにしない', () => {
    const dir = resolve(__dirname, '../public/rika');
    const files = existsSync(dir)
      ? readdirSync(dir).filter((f) => f.endsWith('.png')).map((f) => f.replace(/\.png$/, ''))
      : [];
    const unused = files.filter((f) => !usedIds.includes(f));
    expect(
      unused,
      `★どの問題からも使われていない図がある★: ${unused.join(', ')}`,
    ).toEqual([]);
  });
});
