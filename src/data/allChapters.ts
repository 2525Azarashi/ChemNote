/**
 * ===================================================================
 * 全教科の章を1本にまとめて引くためのファイル
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ なぜこのファイルが必要なのか
 * -------------------------------------------------------------------
 * 「章ID から章オブジェクトを引く」という処理は、教科をまたいで探す必要がある。
 * これまで App.tsx に次のような形で直接書かれていた。
 *
 *     const selectedChapter = [
 *       ...chemistryData.parts.flatMap(p => p.chapters),
 *       ...chemistryAdvancedData.parts.flatMap(p => p.chapters),
 *       ...englishListeningData.parts.flatMap(p => p.chapters),
 *       ...mathData.parts.flatMap(p => p.chapters),
 *       ...biologyBasicData.parts.flatMap(p => p.chapters),
 *       ...englishGrammarData.parts.flatMap(p => p.chapters),
 *     ].find(c => c.id === selectedChapterId);
 *
 * この書き方には次の問題があった。
 *
 *   1. 教科を1つ増やすたびに、App.tsx の import と、この配列の両方に
 *      手で行を足す必要がある（足し忘れると「章が見つからない」不具合になる）
 *   2. 画面のファイルである App.tsx が、6教科ぶんのデータ構造の中身
 *      （parts / chapters というネスト）を知ってしまっている
 *   3. 章を選ぶたびに毎回 6 教科ぶんの flatMap が走る
 *
 * そこで「どの教科があるか」の一覧をこのファイル1か所に集約した。
 * 教科を追加するときは、下の SUBJECT_PARTS に1行足すだけでよい。
 *
 * -------------------------------------------------------------------
 * ■ 章IDが教科をまたいで衝突しないこと
 * -------------------------------------------------------------------
 * 章ID は教科ごとに接頭辞が分かれているため（化学基礎 c… / 化学 a… /
 * リスニング el… など）、単純に連結しても取り違えは起きない。
 * これは元の App.tsx のコメントに書かれていた前提をそのまま引き継いでいる。
 *
 * -------------------------------------------------------------------
 * ■ 挙動は変えていない
 * -------------------------------------------------------------------
 * 連結する順序・対象・find の条件は元のコードと同一。
 * 唯一の違いは、結果を初回だけ計算して使い回す（キャッシュする）点で、
 * 教科データは起動後に変化しないため結果は常に同じになる。
 */

import { chemistryData } from './chemistryData';
import { chemistryAdvancedData } from './chemistryAdvancedData';
import { englishListeningData } from './englishListeningData';
import { mathData } from './mathData';
import { biologyBasicData } from './biologyBasicData';
import { englishGrammarData } from './englishGrammarData';

/** 章の最小共通形（教科をまたいで確実にあるのは id だけ） */
interface ChapterLike {
  id: string;
}

interface PartsLike {
  parts: { chapters: unknown[] }[];
}

/**
 * 章を探す対象の教科。
 *
 * ★教科を追加するときは、ここに1行足すだけでよい。★
 * 並び順は元の App.tsx の連結順を保っている
 * （同じIDが複数教科にあった場合、先に書いた教科が優先される）。
 */
const SUBJECT_PARTS: PartsLike[] = [
  chemistryData as unknown as PartsLike,
  chemistryAdvancedData as unknown as PartsLike,
  englishListeningData as unknown as PartsLike,
  mathData as unknown as PartsLike,
  biologyBasicData as unknown as PartsLike,
  englishGrammarData as unknown as PartsLike,
];

/**
 * 全教科の章を連結した配列。
 * 教科データは起動後に変わらないので、初回だけ作って使い回す。
 */
let cachedChapters: ChapterLike[] | null = null;

function getAllChapters(): ChapterLike[] {
  if (cachedChapters) return cachedChapters;
  cachedChapters = SUBJECT_PARTS.flatMap((subject) =>
    (subject.parts || []).flatMap((part) => (part.chapters || []) as ChapterLike[]),
  );
  return cachedChapters;
}

/**
 * 章IDから章を引く（全教科横断）。
 * 見つからなければ undefined を返す。
 *
 * 戻り値を any にしているのは、教科ごとに章オブジェクトの形が
 * 少しずつ違い（practiceProblems / miniTest / listeningScript など）、
 * 呼び出し側が元々 `as any[]` で受けていた挙動をそのまま保つため。
 * ここで無理に共通型を作ると、実データと合わない型を後から
 * 信じてしまう危険があるので、あえて絞っていない。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function findChapterById(chapterId: string | null | undefined): any {
  if (!chapterId) return undefined;
  return getAllChapters().find((chapter) => chapter.id === chapterId);
}
