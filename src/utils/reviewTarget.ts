import type { SubjectKey } from '../data/allChapters';
import type { AdvancedFieldId } from '../data/advancedFields';

type Problem = { id: string; subQuestions?: { id: string }[] };
type Chapter = { id: string; abstractTitle?: string; realTitle?: string; practiceProblems?: Problem[] };
type Subject = { id: SubjectKey; parts: { field?: AdvancedFieldId; chapters: Chapter[] }[] };
export type ReviewLocator = {
  chapterId?: string;
  chapterTitle?: string;
  questionId?: string;
  /** 小問IDだけを持つリンク（ロジックツリーの「確認問題」など）からも問題を引けるようにする */
  subQuestionId?: string;
  questionIndex?: number;
};

/** Never fall back to an unrelated first question when a saved ID is missing. */
export function resolveReviewTarget(note: ReviewLocator, subjects: Subject[]) {
  const entries = subjects.flatMap(subject => subject.parts.flatMap(part => part.chapters.map(chapter => ({
    subject: subject.id, field: part.field, chapter,
  }))));
  const hasSub = (q: Problem) => !!note.subQuestionId && !!q.subQuestions?.some(sq => sq.id === note.subQuestionId);
  const candidates = entries.filter(({ chapter }) => {
    if (note.chapterId) return chapter.id === note.chapterId;
    if (note.questionId) return chapter.practiceProblems?.some(q => q.id === note.questionId);
    if (note.subQuestionId) return chapter.practiceProblems?.some(hasSub);
    return !!note.chapterTitle && [chapter.abstractTitle, chapter.realTitle].includes(note.chapterTitle);
  });
  if (candidates.length !== 1) return null;
  const entry = candidates[0];
  const questions = entry.chapter.practiceProblems || [];
  const questionIndex = note.questionId
    ? questions.findIndex(q => q.id === note.questionId)
    : note.subQuestionId
      ? questions.findIndex(hasSub)
      : Number.isSafeInteger(note.questionIndex) ? note.questionIndex! - 1 : -1;
  if (questionIndex < 0 || questionIndex >= questions.length) return null;
  return { subject: entry.subject, field: entry.field, chapterId: entry.chapter.id, questionIndex };
}
