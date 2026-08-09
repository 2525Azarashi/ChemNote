/**
 * ===================================================================
 * 学習進捗の記録（大問ベース・1点でも取れば「解いた」とみなす）
 * ===================================================================
 *
 * -------------------------------------------------------------------
 * ■ なぜ専用の仕組みが必要だったのか（元の不具合）
 * -------------------------------------------------------------------
 * タイトル画面（ホーム）の「学習進捗」は、以前は
 *
 *     localStorage[`quiz_answers_${章ID}_mini_test`] のキー数
 *
 * を数えていた。これには3つの致命的な問題があった。
 *
 *   ① **章をやり終えると進捗が消える**
 *      Quiz.tsx は章の最終問題を終えた時点で
 *      `quiz_run_*` を削除し、App.tsx も章に入り直すと
 *      `quiz_answers_*` を削除する。
 *      つまり「最後までやり切った章」ほど進捗から消えるという、
 *      本来の意図と正反対の挙動になっていた。
 *
 *   ② **mini_test しか数えていない**
 *      実際の問題は 174 大問のうち 153 問が practiceProblems 側にある。
 *      演習をどれだけ解いても進捗はほぼ動かなかった。
 *
 *   ③ **分母と分子の単位が違う**
 *      分母は miniTest の「小問」数（170）なのに、
 *      分子は `quiz_answers` のキー数（＝小問IDごと）で、
 *      さらに mini_test の1モード分だけ。数字の意味が噛み合っていなかった。
 *
 * -------------------------------------------------------------------
 * ■ 今回の方針（ご要望：「1点でも獲得した大問は進捗としてカウント」）
 * -------------------------------------------------------------------
 *   - 単位は **大問**（miniTest ＋ practiceProblems の合計 174 問）。
 *   - **獲得点が 1 点以上なら「解いた」** として記録する。
 *     記述式は自動採点できないが、書けば参加点が入るので同じ扱いで拾える。
 *   - 記録は **消さない**（追記のみ）。一度解いた事実は
 *     章をやり直しても、ランをリセットしても失われない。
 *   - 章IDと大問IDの組で持つ。大問IDは章をまたぐと重複する例があるため
 *     （例：c2_1 の miniTest と practiceProblems に同じ q_c2_1_1 がある）、
 *     `章ID::大問ID` を単位にする。
 *
 * -------------------------------------------------------------------
 * ■ 保存形式
 * -------------------------------------------------------------------
 *   localStorage['solved_problems_v1_<uid>'] = {
 *     "c1_1::q_c1_1_1": 1,   // 値は「初めて解いた時刻(ms)」
 *     "c1_1::p_c1_1_a": 1,
 *     ...
 *   }
 *   （uid ごとに分けるのは、既存の profile_/streak_/completed_ と同じ作法）
 */

export const SOLVED_KEY_PREFIX = 'solved_problems_v1_';

/** 旧データからの引き継ぎが済んだかを覚えておくキー */
const BACKFILL_DONE_PREFIX = 'solved_backfilled_v1_';

/** クイズのモード（進捗の単位ではないが、旧データ読み出しに使う） */
const LEGACY_MODES = ['mini_test', 'practice'] as const;

function storage(): Storage | null {
  try {
    const ls = (globalThis as any)?.localStorage;
    if (ls && typeof ls.getItem === 'function') return ls as Storage;
  } catch {
    /* プライベートブラウズ等では進捗を保存できないが、動作は続ける */
  }
  return null;
}

/** uid を localStorage のキーに使える形に正規化する */
function normalizeUid(uid: string | null | undefined): string {
  return uid && uid.trim() ? uid : 'guest';
}

function solvedKey(uid: string | null | undefined): string {
  return `${SOLVED_KEY_PREFIX}${normalizeUid(uid)}`;
}

/**
 * 大問1つを指す一意なキー。
 * 大問IDは章をまたぐと重複しうるので、必ず章IDと組にする。
 */
export function problemKey(chapterId: string, questionId: string): string {
  return `${chapterId}::${questionId}`;
}

/** 解いた大問の一覧を読む（壊れた値は空として扱い、例外は投げない） */
export function readSolvedMap(uid: string | null | undefined): Record<string, number> {
  const ls = storage();
  if (!ls) return {};
  try {
    const raw = ls.getItem(solvedKey(uid));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    return parsed as Record<string, number>;
  } catch {
    return {};
  }
}

function writeSolvedMap(uid: string | null | undefined, map: Record<string, number>): void {
  const ls = storage();
  if (!ls) return;
  try {
    ls.setItem(solvedKey(uid), JSON.stringify(map));
  } catch {
    /* 容量超過などで保存できなくても学習は続行させる */
  }
}

/**
 * 「この大問を解いた」と記録する。
 *
 * @param score その大問で獲得した点数。**1点以上のときだけ**記録する。
 *              0点（＝白紙・全問誤答で参加点もなし）は進捗に数えない。
 * @returns 新しく記録されたら true（既に記録済みなら false）
 */
export function markProblemSolved(
  uid: string | null | undefined,
  chapterId: string,
  questionId: string,
  score: number,
): boolean {
  if (!chapterId || !questionId) return false;
  if (!Number.isFinite(score) || score < 1) return false;

  const key = problemKey(chapterId, questionId);
  const map = readSolvedMap(uid);
  if (map[key]) return false; // 既に記録済み（初回時刻は上書きしない）

  map[key] = Date.now();
  writeSolvedMap(uid, map);
  return true;
}

/** その大問を既に解いているか */
export function isProblemSolved(
  uid: string | null | undefined,
  chapterId: string,
  questionId: string,
): boolean {
  return Boolean(readSolvedMap(uid)[problemKey(chapterId, questionId)]);
}

/** 解いた大問の総数 */
export function countSolvedProblems(uid: string | null | undefined): number {
  return Object.keys(readSolvedMap(uid)).length;
}

/**
 * 指定した章の集合に限って、解いた大問数を数える。
 *
 * ホームの「学習進捗」を科目ごとに出すために追加した。
 * countSolvedProblems は全科目の合計を返すため、化学基礎の分母（174問）に
 * 化学（発展）で解いた分が乗ってしまい、数字が分母を超えることがあった。
 *
 * @param chapterIds 集計対象の章ID（例：化学基礎の全章）
 */
export function countSolvedProblemsIn(
  uid: string | null | undefined,
  chapterIds: Iterable<string>,
): number {
  const target = new Set(chapterIds);
  let count = 0;
  Object.keys(readSolvedMap(uid)).forEach((key) => {
    const chapterId = key.split('::')[0];
    if (chapterId && target.has(chapterId)) count++;
  });
  return count;
}

/**
 * 章ごとに解いた大問数を数える。
 * 章の進捗表示や「次の章」の判定に使える。
 */
export function countSolvedByChapter(uid: string | null | undefined): Record<string, number> {
  const result: Record<string, number> = {};
  Object.keys(readSolvedMap(uid)).forEach((key) => {
    const chapterId = key.split('::')[0];
    if (!chapterId) return;
    result[chapterId] = (result[chapterId] || 0) + 1;
  });
  return result;
}

/**
 * -------------------------------------------------------------------
 * 旧データからの引き継ぎ（1回だけ実行）
 * -------------------------------------------------------------------
 * 今日までに解いてくれた分を無かったことにしないため、
 * 残っている旧キーから復元する。
 *
 *   ① `quiz_run_<章>_<モード>` の perQuestion
 *      → 大問ごとの獲得点が入っているので、これが最も正確。
 *        finalScore >= 1 のものを記録する。
 *   ② `quiz_answers_<章>_<モード>`
 *      → 小問IDごとの解答しか無く点数が分からないので、
 *        「解答が入っている小問を含む大問」を対象にする。
 *        （章を解き終えて run が消えている場合の救済）
 *
 * 章を修了して両方消えているケースまでは復元できないが、
 * その分は `completed_<uid>` から章単位で復元する。
 *
 * @param chapters chemistryData の章配列（大問の実体を引くために必要）
 */
export function backfillLegacyProgress(
  uid: string | null | undefined,
  chapters: Array<{ id: string; miniTest?: any[]; practiceProblems?: any[] }>,
): number {
  const ls = storage();
  if (!ls) return 0;

  const doneKey = `${BACKFILL_DONE_PREFIX}${normalizeUid(uid)}`;
  try {
    if (ls.getItem(doneKey)) return 0; // 既に引き継ぎ済み
  } catch {
    return 0;
  }

  const map = readSolvedMap(uid);
  let added = 0;

  const add = (chapterId: string, questionId: string) => {
    const key = problemKey(chapterId, questionId);
    if (map[key]) return;
    map[key] = Date.now();
    added += 1;
  };

  // 修了済みの章（＝最後までやり切った章）を先に押さえる
  let completedChapters: string[] = [];
  try {
    const raw = ls.getItem(`completed_${normalizeUid(uid)}`);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) completedChapters = parsed.map(String);
  } catch {
    /* 壊れていれば無視 */
  }

  chapters.forEach((chapter) => {
    const problems = [...(chapter.miniTest || []), ...(chapter.practiceProblems || [])];
    if (problems.length === 0) return;

    // 小問ID → その小問が属する大問ID
    const subToProblem = new Map<string, string>();
    problems.forEach((q: any) => {
      (q?.subQuestions || []).forEach((sq: any) => {
        if (sq?.id) subToProblem.set(String(sq.id), String(q.id));
      });
    });

    LEGACY_MODES.forEach((mode) => {
      // ① 点数が残っている場合（最も正確）
      try {
        const raw = ls.getItem(`quiz_run_${chapter.id}_${mode}`);
        if (raw) {
          const run = JSON.parse(raw);
          const perQuestion = run?.perQuestion || {};
          Object.keys(perQuestion).forEach((questionId) => {
            const score = Number(perQuestion[questionId]?.finalScore);
            if (Number.isFinite(score) && score >= 1) add(chapter.id, questionId);
          });
        }
      } catch {
        /* 壊れた値は飛ばす */
      }

      // ② 解答だけ残っている場合（点数不明なので「解答済み」を根拠にする）
      try {
        const raw = ls.getItem(`quiz_answers_${chapter.id}_${mode}`);
        if (raw) {
          const answers = JSON.parse(raw);
          if (answers && typeof answers === 'object') {
            Object.keys(answers).forEach((subId) => {
              const value = answers[subId];
              if (typeof value !== 'string' || value.trim() === '') return;
              const questionId = subToProblem.get(subId);
              if (questionId) add(chapter.id, questionId);
            });
          }
        }
      } catch {
        /* 壊れた値は飛ばす */
      }
    });

    // ③ 章を修了していれば、その章の大問はすべて解いたものとして扱う
    //    （run も answers も消えているため、他に復元手段がない）
    if (completedChapters.includes(chapter.id)) {
      problems.forEach((q: any) => {
        if (q?.id) add(chapter.id, String(q.id));
      });
    }
  });

  if (added > 0) writeSolvedMap(uid, map);
  try {
    ls.setItem(doneKey, String(Date.now()));
  } catch {
    /* 記録できなくても、次回もう一度走るだけで害はない（追記なので二重計上しない） */
  }
  return added;
}
