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
