/**
 * 数学の選び方（数ⅠA／数ⅡB／数ⅢC → 科目 → 単元）の対応表。
 *
 * mathData の parts は「教材の束」（基礎から標準・全範囲・全パターン演習）で並んでいて、
 * 同じ「数学A」の単元が3か所に散らばっていた。利用者は教科書の区分で探すので、
 * ここで各単元を「段階（ⅠA/ⅡB/ⅢC）」と「科目（数Ⅰ・数A…）」に振り分ける。
 * データ本体（mathData.ts）や章IDは変えない（学習記録・対戦の問題IDを壊さないため）。
 */

export type MathLevelId = 'IA' | 'IIB' | 'IIIC';
export type MathCourseKey = 'mc1' | 'mca' | 'mc2' | 'mcb' | 'mc3' | 'mcc';

export const MATH_LEVELS: readonly { id: MathLevelId; label: string; courses: readonly MathCourseKey[] }[] = [
  { id: 'IA', label: '数ⅠA', courses: ['mc1', 'mca'] },
  { id: 'IIB', label: '数ⅡB', courses: ['mc2', 'mcb'] },
  { id: 'IIIC', label: '数ⅢC', courses: ['mc3', 'mcc'] },
];

export const MATH_COURSE_LABELS: Record<MathCourseKey, string> = {
  mc1: '数学Ⅰ', mca: '数学A', mc2: '数学Ⅱ', mcb: '数学B', mc3: '数学Ⅲ', mcc: '数学C',
};

/**
 * 章ID → 科目。
 *   mc1_* / mca_* / … … 学習指導要領の単元（IDの頭がそのまま科目）
 *   ia1〜ia4（数と式・2次関数・図形と計量・データの分析）… 数学Ⅰ
 *   ia5〜ia7（場合の数と確率・整数・図形の性質）… 数学A
 *   mp_*（場合の数・確率）・mi_*（整数）… 数学A
 *   m1_* / m2_*（積分法）… 数学Ⅲ
 *   mv_*（ベクトル）… 数学C
 */
export function mathCourseOfChapter(chapterId: string): MathCourseKey | null {
  const id = String(chapterId || '');
  const direct = id.match(/^(mc1|mca|mc2|mcb|mc3|mcc)_/);
  if (direct) return direct[1] as MathCourseKey;
  const ia = id.match(/^ia(\d)_/);
  if (ia) return Number(ia[1]) <= 4 ? 'mc1' : 'mca';
  if (/^m[pi]_/.test(id)) return 'mca';
  if (/^m[12]_/.test(id)) return 'mc3';
  if (/^mv_/.test(id)) return 'mcc';
  return null;
}

export function mathLevelOfCourse(course: MathCourseKey): MathLevelId {
  return MATH_LEVELS.find((l) => l.courses.includes(course))!.id;
}

/** タブ（章のまとまり）の科目。まとまりの中の最初の単元で決める（同じまとまりは同じ科目） */
export function mathCourseOfGroup(group: { chapters: { id: string }[] }): MathCourseKey | null {
  for (const ch of group.chapters) {
    const c = mathCourseOfChapter(ch.id);
    if (c) return c;
  }
  return null;
}

/** 教材の束の短い名前（同じ科目の中で「基礎から標準」「全範囲」などを見分ける） */
export function mathSourceLabel(partTitle: string): string {
  if (/基礎から標準/.test(partTitle)) return '基礎〜標準';
  if (/全範囲/.test(partTitle)) return '全範囲・網羅';
  if (/全パターン/.test(partTitle)) return '全パターン演習';
  return partTitle;
}

// ===================================================================
// ★科目の中は「教科書の分野」でまとめる★
// ===================================================================
//
// 以前は科目の中のタブが「教材の束（基礎から標準／全範囲／全パターン演習）」
// ごとの章名のままだった。そのため数学Aを開くと
//   「数学A・基礎から標準」「5章 場合の数と確率」「1章 場合の数の土台」「2章 確率の基本」…
// のように、★同じ分野（場合の数・確率）が3か所に散らばり★、章番号も
// 「1章」と「5章」が混ざって、生徒にはどれが何なのか分からなかった。
//
// そこで科目の中を教科書の分野（数学A なら 場合の数と確率／整数の性質／図形の性質…）
// で1つのタブにまとめ、タブの中で「基礎〜標準 → 網羅 → パターン演習」の順に並べる。
// ★問題・章ID・学習記録は一切変えない★（表示のまとめ方だけ）。

export interface MathTopic {
  /** 分野の名前（教科書の章名に合わせる） */
  title: string;
  /** この分野に入る章ID（前方一致の条件） */
  match: (chapterId: string) => boolean;
}

const idIn = (...ids: string[]) => (id: string) => ids.includes(id);
const prefix = (...ps: string[]) => (id: string) => ps.some((p) => id.startsWith(p));

/** 科目ごとの分野（並び順＝教科書の順） */
export const MATH_TOPICS: Record<MathCourseKey, readonly MathTopic[]> = {
  mc1: [
    { title: '数と式', match: (id) => idIn('mc1_algebra', 'mc1_inequality')(id) || /^ia1_[1-5]$/.test(id) },
    { title: '集合と命題', match: (id) => idIn('mc1_logic', 'ia1_6', 'ia1_7')(id) },
    { title: '2次関数', match: (id) => idIn('mc1_quadratic', 'mc1_extrema')(id) || prefix('ia2_')(id) },
    { title: '図形と計量', match: (id) => idIn('mc1_trigonometry')(id) || prefix('ia3_')(id) },
    { title: 'データの分析', match: (id) => idIn('mc1_data', 'mc1_hypothesis')(id) || prefix('ia4_')(id) },
  ],
  mca: [
    { title: '場合の数と確率', match: prefix('ia5_', 'mp_') },
    { title: '整数の性質', match: prefix('ia6_', 'mi_') },
    { title: '図形の性質', match: (id) => idIn('mca_triangle', 'mca_circle', 'mca_space')(id) || prefix('ia7_')(id) },
    { title: '数学と人間の活動', match: idIn('mca_activity') },
  ],
  mc2: [
    { title: '式と証明', match: idIn('mc2_expression') },
    { title: '複素数と方程式', match: idIn('mc2_complex', 'mc2_equations') },
    { title: '図形と方程式', match: idIn('mc2_coordinate', 'mc2_locus') },
    { title: '三角関数', match: idIn('mc2_trig') },
    { title: '指数関数・対数関数', match: idIn('mc2_exponential', 'mc2_logarithm') },
    { title: '微分法と積分法', match: idIn('mc2_derivative', 'mc2_integral') },
  ],
  mcb: [
    { title: '数列', match: idIn('mcb_sequences', 'mcb_sums', 'mcb_recurrence') },
    { title: '統計的な推測', match: idIn('mcb_distribution', 'mcb_normal', 'mcb_inference') },
    { title: '数学と社会生活', match: idIn('mcb_society') },
  ],
  mc3: [
    { title: '関数と極限', match: idIn('mc3_functions', 'mc3_limits') },
    { title: '微分法', match: idIn('mc3_differentiation', 'mc3_applications') },
    { title: '積分法', match: (id) => idIn('mc3_area', 'mc3_volume')(id) || prefix('m1_', 'm2_')(id) },
  ],
  mcc: [
    { title: 'ベクトル', match: prefix('mv_') },
    { title: '平面上の曲線', match: idIn('mcc_curves') },
    { title: '複素数平面', match: idIn('mcc_complexplane') },
    { title: '数学的な表現の工夫', match: idIn('mcc_representation') },
  ],
};

/** 章ID → 分野名（どこにも入らなければ null） */
export function mathTopicOfChapter(chapterId: string): string | null {
  const course = mathCourseOfChapter(chapterId);
  if (!course) return null;
  return MATH_TOPICS[course].find((t) => t.match(chapterId))?.title ?? null;
}

/** 教材の段階（タブの中の並び順と見出しに使う） */
export type MathStage = 'basic' | 'full' | 'pattern';
export const MATH_STAGE_LABELS: Record<MathStage, string> = {
  basic: '基礎〜標準',
  full: '網羅（全範囲）',
  pattern: 'パターン演習',
};
export function mathStageOfPart(partTitle: string): MathStage {
  if (/全範囲/.test(partTitle)) return 'full';
  if (/全パターン/.test(partTitle)) return 'pattern';
  return 'basic';
}
const STAGE_ORDER: Record<MathStage, number> = { basic: 0, full: 1, pattern: 2 };

export interface MathTopicGroup<C extends { id: string }> {
  /** 画面内で一意なタブの名前（記憶にも使う） */
  title: string;
  /** タブ上段の小さな文字（科目名） */
  kicker: string;
  /** タブ下段の文字（分野名） */
  label: string;
  course: MathCourseKey;
  chapters: (C & { mathStage: MathStage })[];
  partId: string;
  partTitle: string;
}

/**
 * 数学の parts（教材の束）を「科目 → 分野」のタブに組み直す。
 * 章の中身（オブジェクト）はそのまま使い、段階（mathStage）だけ添える。
 */
export function buildMathTopicGroups<C extends { id: string }>(
  parts: readonly { id: string; title: string; chapters: readonly C[] }[],
): MathTopicGroup<C>[] {
  const withStage = parts.flatMap((part, partIndex) =>
    part.chapters.map((chapter, index) => ({
      chapter,
      stage: mathStageOfPart(part.title),
      order: partIndex * 1000 + index,
    })),
  );
  const out: MathTopicGroup<C>[] = [];
  for (const level of MATH_LEVELS) {
    for (const course of level.courses) {
      for (const topic of MATH_TOPICS[course]) {
        const items = withStage
          .filter(({ chapter }) => mathCourseOfChapter(chapter.id) === course && topic.match(chapter.id))
          .sort((a, b) => STAGE_ORDER[a.stage] - STAGE_ORDER[b.stage] || a.order - b.order);
        if (items.length === 0) continue;
        out.push({
          title: `${MATH_COURSE_LABELS[course]}｜${topic.title}`,
          kicker: MATH_COURSE_LABELS[course],
          label: topic.title,
          course,
          chapters: items.map(({ chapter, stage }) => Object.assign(Object.create(Object.getPrototypeOf(chapter)), chapter, { mathStage: stage })),
          partId: `math_${course}`,
          partTitle: `${level.label} ／ ${MATH_COURSE_LABELS[course]}`,
        });
      }
    }
  }
  return out;
}
