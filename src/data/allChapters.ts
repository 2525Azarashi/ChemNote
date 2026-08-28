/**
 * ===================================================================
 * 「アプリにどの教科があるか」を1か所にまとめたファイル
 * ===================================================================
 *
 * このファイルが持つのは次の2つ。
 *
 *   1. SUBJECTS … 教科の一覧（ID・表示名・章の取り出し方）
 *   2. findChapterById / getChaptersOfSubject … 上を使った検索
 *
 * どちらも「6教科ぶんを手で並べる」コードを画面側から無くすためにある。
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
 * 教科を追加するときは、下の SUBJECTS に1件足すだけでよい。
 *
 * -------------------------------------------------------------------
 * ■ 同じ「6教科の列挙」が Home.tsx にもあった
 * -------------------------------------------------------------------
 * ホーム画面にも次の2か所に同じ列挙があり、教科を足すときの
 * 修正箇所がさらに増えていた。
 *
 *   ・allChaptersList     … 選択中の教科の章を出す if 連鎖（6分岐）
 *   ・subjectProgressDefs … 教科別の進捗バーを出す { id, label, chapters } の6件配列
 *
 * これらも SUBJECTS から作れるようにして、列挙を1か所に寄せた。
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
 * 教科ID。★アプリ全体で唯一の定義。★
 *
 * 以前はまったく同じ並びが9か所（components 4・data 4・utils 1）に
 * 手書きされていて、教科を1つ増やすと9か所すべてを直す必要があった。
 * 1か所でも漏らすと「その画面にだけ新しい教科を渡せない」状態になる。
 *
 * いまは各所がこの型の別名（type SubjectId = SubjectKey など）を
 * 公開しているだけなので、教科の追加はここ1行で足りる。
 * 別名を残しているのは、呼び出し側が今まで使ってきた名前
 * （SubjectId / CatalogSubject / TipSubject）をそのまま使えるようにするため。
 *
 * この型を data 層に置いているのは、components 層に置くと
 * data から components を参照することになり依存が逆流するため。
 * 顔ぶれが SUBJECTS とズレていないことは tests/subjectKey.test.ts で検査している。
 */
export type SubjectKey =
  | 'chemistry_basic'
  | 'chemistry'
  | 'english_listening'
  | 'english_grammar'
  | 'math'
  | 'biology_basic';

interface SubjectEntry {
  id: SubjectKey;
  /** 画面に出す教科名 */
  label: string;
  /** この教科のデータ本体（章の取り出し元） */
  data: PartsLike;
}

/**
 * アプリが扱う教科の一覧。
 *
 * ★教科を追加するときは、ここに1件足すだけでよい。★
 *
 * 並び順には2つの意味がある。
 *   1. 章IDの検索順（findChapterById）… 元の App.tsx の連結順そのまま。
 *      同じIDが複数教科にあった場合、先に書いた教科が優先される。
 *   2. ホーム画面の「教科ごとの進捗」の表示順（SUBJECTS の順に縦に並ぶ）。
 * どちらも従来の並びと同じにしてあるので、順番を変えると画面の並びも変わる。
 */
export const SUBJECTS: readonly SubjectEntry[] = [
  { id: 'chemistry_basic', label: '化学基礎', data: chemistryData as unknown as PartsLike },
  { id: 'chemistry', label: '化学', data: chemistryAdvancedData as unknown as PartsLike },
  {
    id: 'english_listening',
    label: '英語リスニング',
    data: englishListeningData as unknown as PartsLike,
  },
  { id: 'math', label: '数学', data: mathData as unknown as PartsLike },
  { id: 'biology_basic', label: '生物基礎', data: biologyBasicData as unknown as PartsLike },
  {
    id: 'english_grammar',
    label: '英文法',
    data: englishGrammarData as unknown as PartsLike,
  },
];

/**
 * ★教科名の対応表（SUBJECT_LABELS）はこのファイルには置かない★
 *
 * 以前はここに
 *     export const SUBJECT_LABELS = Object.fromEntries(
 *       SUBJECTS.map((s) => [s.id, s.label]));
 * があった。今の置き場所は data/subjectLabels.ts。
 *
 * なぜ移したか（消したのではなく移した）:
 *
 *   1. 誰も import していなかった。
 *      画面側は SubjectSelection / chapterCatalog 経由で引いていて、
 *      この export は実際には一度も使われていない状態だった。
 *
 *   2. ★残しておくと「重い入口」になる★
 *      このファイルは冒頭で6教科ぶんの問題データを静的に読む。
 *      つまり「教科名を1つ引きたいだけ」でもここを import すると、
 *      約2.5MB の問題データが起動時の読み込みに入ってしまう。
 *      軽い置き場所（subjectLabels.ts は索引だけを読む）がある以上、
 *      重い入口を残すのは将来の踏み間違いを招くだけである。
 *
 * 出どころは変わっていない。subjectLabels.ts は生成済み索引
 * （chapterIndex.generated.ts）の id / label から作り、その索引は
 * 下の SUBJECTS から自動生成している。両者が一致することは
 * tests/chapterIndex.test.ts と tests/allChapters.test.ts が検査する。
 *
 * 教科名が必要なときは:
 *     import { SUBJECT_LABELS } from './subjectLabels';        // data 層
 *     import { getSubjectLabel } from './components/SubjectSelection'; // 画面層
 */

/**
 * 教科データから章の配列を取り出す。
 *
 * これは各教科ファイルにある getAllAdvancedChapters() / getAllMathChapters() などと
 * 完全に同じ処理（`data.parts.flatMap(p => p.chapters)`）。
 * 同じ内容であることは tests/allChapters.test.ts で実際に突き合わせて確認している。
 */
function flattenChapters(data: PartsLike): ChapterLike[] {
  return (data.parts || []).flatMap((part) => (part.chapters || []) as ChapterLike[]);
}

/**
 * 教科ID → その教科の章配列。
 *
 * 教科データは起動後に変化しないため、初回だけ作って使い回す。
 * ★返す配列を呼び出し側で書き換えない（sort / push など）こと。★
 * 現在の呼び出し側はすべて読み取りのみ（reduce / map / find）であることを
 * 確認したうえでキャッシュしている。
 */
const chaptersBySubject = new Map<SubjectKey, ChapterLike[]>();

/**
 * 指定した教科の章一覧を返す。
 * 未知の教科IDが来た場合は、従来の Home.tsx の既定分岐に合わせて
 * 化学基礎の章を返す（画面が空にならないようにするため）。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getChaptersOfSubject(subjectId: string | null | undefined): any[] {
  const entry =
    SUBJECTS.find((subject) => subject.id === subjectId) ??
    // 既定は化学基礎（元の Home.tsx の if 連鎖の最後の return と同じ挙動）
    SUBJECTS[0];

  const cached = chaptersBySubject.get(entry.id);
  if (cached) return cached;

  const chapters = flattenChapters(entry.data);
  chaptersBySubject.set(entry.id, chapters);
  return chapters;
}

/**
 * 指定した教科の parts（章のまとまり）をそのまま返す。
 *
 * 単元選択画面（ChapterSelection）は章をタブへまとめ直すために
 * parts の情報（part.id / part.title / part.field）まで必要なので、
 * 章だけを返す getChaptersOfSubject では足りない。
 *
 * 未知の教科IDのときは、getChaptersOfSubject と同じく化学基礎を返す。
 * 返す配列は元データそのものなので、書き換えないこと。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getPartsOfSubject(subjectId: string | null | undefined): any[] {
  const entry = SUBJECTS.find((subject) => subject.id === subjectId) ?? SUBJECTS[0];
  return (entry.data.parts || []) as any[];
}

/**
 * 全教科の章を連結した配列。
 * 教科データは起動後に変わらないので、初回だけ作って使い回す。
 */
let cachedChapters: ChapterLike[] | null = null;

function getAllChapters(): ChapterLike[] {
  if (cachedChapters) return cachedChapters;
  cachedChapters = SUBJECTS.flatMap((subject) => getChaptersOfSubject(subject.id));
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
