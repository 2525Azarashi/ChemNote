/**
 * ===================================================================
 * 教科名（画面に出す表示名）の ★唯一の出どころ★
 * ===================================================================
 *
 * 「chemistry_basic → 化学基礎」のような対応表を1か所だけで作る。
 *
 * -------------------------------------------------------------------
 * ■ なぜこのファイルを作ったのか（直前まであった弱点）
 * -------------------------------------------------------------------
 * 教科名の対応表を組み立てるコードが、次の2か所に
 * ★1文字も違わない同じ3行★として重複していた。
 *
 *   src/data/chapterCatalog.ts
 *   src/components/SubjectSelection.tsx
 *
 *     export const SUBJECT_LABELS: Record<SubjectKey, string> = Object.fromEntries(
 *       SUBJECT_INDEX.map((subject) => [subject.id, subject.label]),
 *     ) as Record<SubjectKey, string>;
 *
 * 元をたどると理由がある。以前は allChapters.ts の SUBJECT_LABELS が
 * 唯一の出どころだったが、「教科名を引くだけで 2.5MB の教科データを
 * 読み込む」のを避けるため、各所を軽い索引（SUBJECT_INDEX）から
 * 組み立てる形へ順番に移した。その結果
 *
 *   ・移した先が2か所あったので、同じ組み立てが2つできた
 *   ・元の allChapters.ts の SUBJECT_LABELS は誰も import しない
 *     ★死んだ輸出★ になった（それでも残っていた）
 *     → こちらは同じ整理の中で取り除いた。単に使われていないだけでなく、
 *       allChapters.ts は6教科ぶんの問題データを静的に読むため、
 *       「教科名を引くだけ」でも約2.5MB を連れてくる★重い入口★
 *       として残ってしまうのが危なかった。
 *
 * という状態になっていた。今は同じ索引を見ているので値は一致するが、
 * 「唯一の定義」が2つあるという構造そのものが弱い。
 * 片方の組み立て方だけを将来変えたとき（例：未収録の教科を除く、
 * 別名を付ける）、画面ごとに違う教科名が出て、しかも
 * ★どちらが正しいのか誰にも分からない★ 状態になる。
 *
 * そこで組み立てをこのファイル1本に集約し、
 * 2か所はここを再公開するだけにした。
 *
 * -------------------------------------------------------------------
 * ■ 呼び出し側は今までどおり（import 文を変えなくてよい）
 * -------------------------------------------------------------------
 * chapterCatalog.ts と SubjectSelection.tsx は、これまでどおり
 * SUBJECT_LABELS を export し続ける（実体がここになるだけ）。
 * そのため既存の呼び出し側・テストは1文字も変えずに動く。
 * ★機能を消していない。★
 *
 * -------------------------------------------------------------------
 * ■ 依存はこれ1本だけ（軽さを壊さない）
 * -------------------------------------------------------------------
 * このファイルが import するのは chapterIndex.generated.ts だけで、
 * それは★何も import しない葉★（＝そこから教科データへは辿れない）。
 * つまりこのファイルを読んでも問題データには行き着かない。
 * この性質は tests/subjectLabels.test.ts が機械検査している。
 *
 * -------------------------------------------------------------------
 * ■ 値の出どころは変わっていない
 * -------------------------------------------------------------------
 * 索引の id / label は教科データの SUBJECTS から自動生成したもので、
 * 一致は tests/chapterIndex.test.ts が検査している。
 * つまり「教科名の真の出どころ」は今も SUBJECTS のままで、
 * このファイルはその写しを1か所で組み立てているだけ。
 */

import type { SubjectKey } from './allChapters';
import { SUBJECT_INDEX } from './chapterIndex.generated';

/**
 * 教科ID → 画面に出す教科名。
 *
 * ★アプリ全体でこの表を作るのはここだけ。★
 * 他の場所（chapterCatalog / SubjectSelection）は、これを
 * 再公開しているだけなので、必ず同じ値になる。
 */
export const SUBJECT_LABELS: Record<SubjectKey, string> = Object.fromEntries(
  SUBJECT_INDEX.map((subject) => [subject.id, subject.label]),
) as Record<SubjectKey, string>;

/**
 * 未知の値が入っていても安全に教科名を引く。
 *
 * 既定を化学基礎にしているのは、保存された教科IDが壊れていたり
 * 古い名前だったときに画面の見出しが空になるのを避けるためで、
 * 従来（SubjectSelection.getSubjectLabel）と同じ振る舞い。
 */
export function labelOfSubject(id: string | null | undefined): string {
  return SUBJECT_LABELS[(id || '') as SubjectKey] || SUBJECT_LABELS.chemistry_basic;
}
