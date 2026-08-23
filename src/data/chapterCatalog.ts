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
 * が必要になる。ところが章データは科目ごとに別ファイル
 * （chemistryData / chemistryAdvancedData / englishListeningData）に
 * あり、形も微妙に違う。集計側（utils/）から科目データを
 * 直接 import すると依存が絡まるので、
 *
 *     「科目ID → ChapterDefinition[]」への変換をここ1か所に閉じ込める。
 *
 * -------------------------------------------------------------------
 * ■ 分母の数え方（誠実さのルール）
 * -------------------------------------------------------------------
 * 問題が1問も入っていない章（化学発展の未収録章など）は
 * カタログから**除外**する。含めると「解きようがない章」が分母に
 * 入り、生徒の到達率が不当に低く出るため。
 * 到達率は常に「実際に解ける問題」に対する割合とする。
 */

import { chemistryData } from './chemistryData';
import { chemistryAdvancedData } from './chemistryAdvancedData';
import { englishListeningData } from './englishListeningData';
import { mathData } from './mathData';
import { biologyBasicData } from './biologyBasicData';
import type { ChapterDefinition } from '../utils/studySummary';

export type CatalogSubject =
  | 'chemistry_basic'
  | 'chemistry'
  | 'english_listening'
  | 'math'
  | 'biology_basic';

/** 科目の表示名（レポートの文章にも使う） */
export const SUBJECT_LABELS: Record<CatalogSubject, string> = {
  chemistry_basic: '化学基礎',
  chemistry: '化学',
  english_listening: '英語リスニング',
  math: '数学',
  biology_basic: '生物基礎',
};

/** 章データの最小共通形（3科目とも id / abstractTitle / 問題配列を持つ） */
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
      const total =
        (Array.isArray(chapter.practiceProblems) ? chapter.practiceProblems.length : 0) +
        (Array.isArray(chapter.miniTest) ? chapter.miniTest.length : 0);
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

  let rows: ChapterDefinition[];
  switch (subject) {
    case 'chemistry':
      rows = toDefinitions(chemistryAdvancedData.parts as unknown as RawPart[]);
      break;
    case 'english_listening':
      rows = toDefinitions(englishListeningData.parts as unknown as RawPart[]);
      break;
    case 'math':
      rows = toDefinitions(mathData.parts as unknown as RawPart[]);
      break;
    case 'biology_basic':
      rows = toDefinitions(biologyBasicData.parts as unknown as RawPart[]);
      break;
    case 'chemistry_basic':
    default:
      rows = toDefinitions(chemistryData.parts as unknown as RawPart[]);
      break;
  }
  cache.set(subject, rows);
  return rows;
}

/** カタログ全体の大問総数（到達率の分母） */
export function countCatalogProblems(subject: CatalogSubject): number {
  return getChapterCatalog(subject).reduce((sum, row) => sum + row.totalProblems, 0);
}
