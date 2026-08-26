/**
 * ===================================================================
 * 章カタログ（科目 → 章定義の一覧）
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ なぜこのファイルが必要なのか
 * -------------------------------------------------------------------
 * 先生ダッシュボードで「知識・技能」の到達率を出すには、
 *
 *     その科目に章がいくつあり、各章に大問が何問あるか（分母）
 *
 * が必要になる。ところが章データは科目ごとに別ファイルにあり、
 * 形も微妙に違う。集計側（utils/）から科目データを
 * 直接 import すると依存が絡まるので、
 *
 *     「科目ID → ChapterDefinition[]」への変換をここ1か所に閉じ込める。
 *
 * なお「科目ID → その科目の parts」を引く部分は allChapters.ts に
 * 集約したので、このファイルは変換（ChapterDefinition への詰め替え）
 * だけを担当する。教科が増えてもこのファイルは変更不要。
 *
 * -------------------------------------------------------------------
 * ■ 分母の数え方（誠実さのルール）
 * -------------------------------------------------------------------
 * 問題が1問も入っていない章（化学発展の未収録章など）は
 * カタログから**除外**する。含めると「解きようがない章」が分母に
 * 入り、生徒の到達率が不当に低く出るため。
 * 到達率は常に「実際に解ける問題」に対する割合とする。
 */

import type { ChapterDefinition } from '../utils/studySummary';
// 教科ID → その教科の parts の取り出しと、教科IDの型は
// allChapters.ts に集約している（以前はこのファイルでも6教科ぶんを
// 個別に import し、switch で振り分けていた）
import { getPartsOfSubject, type SubjectKey } from './allChapters';
// 大問の数え方（ミニテスト＋演習）は problemCount.ts に集約している
import { countChapterProblems } from './problemCount';

/**
 * このカタログが扱う教科。
 * 実体は allChapters.ts の SubjectKey（アプリ全体で唯一の教科ID定義）。
 */
export type CatalogSubject = SubjectKey;

/** 科目の表示名（レポートの文章にも使う） */
export const SUBJECT_LABELS: Record<CatalogSubject, string> = {
  chemistry_basic: '化学基礎',
  chemistry: '化学',
  english_listening: '英語リスニング',
  english_grammar: '英文法',
  math: '数学',
  biology_basic: '生物基礎',
};

/** 章データの最小共通形（どの教科の章も id / abstractTitle / 問題配列を持つ） */
interface RawChapter {
  id: string;
  abstractTitle?: string;
  realTitle?: string;
  practiceProblems?: unknown[];
  miniTest?: unknown[];
}

interface RawPart {
  chapters: RawChapter[];
}

/**
 * parts 構造を ChapterDefinition[] に変換する。
 * 進捗の単位は「大問」（progress.ts と同じ）なので、
 * totalProblems = practiceProblems + miniTest の件数。
 */
function toDefinitions(parts: RawPart[]): ChapterDefinition[] {
  const rows: ChapterDefinition[] = [];
  parts.forEach((part) => {
    (part.chapters || []).forEach((chapter) => {
      const total = countChapterProblems(chapter);
      // 問題が無い章は到達しようがないので分母に入れない
      if (total === 0) return;
      rows.push({
        id: chapter.id,
        title: (chapter.abstractTitle || chapter.realTitle || chapter.id).trim(),
        totalProblems: total,
      });
    });
  });
  return rows;
}

/**
 * 科目データは起動後に変わらないので、初回だけ計算して使い回す。
 * （chemistryData は 2MB 級の巨大オブジェクトなので、
 *   ダッシュボードを開くたびに走査しない）
 */
const cache = new Map<CatalogSubject, ChapterDefinition[]>();

export function getChapterCatalog(subject: CatalogSubject): ChapterDefinition[] {
  const hit = cache.get(subject);
  if (hit) return hit;

  // 以前はここに6教科ぶんの switch が並んでいたが、
  // 「教科ID → その教科の parts」は allChapters.ts が持っているので任せる。
  // 未知のIDのときに化学基礎へ落とす挙動も、元の default 節と同じ。
  const rows = toDefinitions(getPartsOfSubject(subject) as unknown as RawPart[]);
  cache.set(subject, rows);
  return rows;
}

/** カタログ全体の大問総数（到達率の分母） */
export function countCatalogProblems(subject: CatalogSubject): number {
  return getChapterCatalog(subject).reduce((sum, row) => sum + row.totalProblems, 0);
}
