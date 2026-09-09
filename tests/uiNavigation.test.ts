import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { studyEntry, isLearningScreen, safeStudyResume } from '../src/utils/studyNavigation';
import { resolveReviewTarget } from '../src/utils/reviewTarget';
import { SUBJECTS, getPartsOfSubject } from '../src/data/allChapters';

const app = readFileSync('src/App.tsx', 'utf8');
const subjects = SUBJECTS.map(s => ({ id: s.id, parts: getPartsOfSubject(s.id) }));

describe('科目を維持した学習導線', () => {
  it.each(['english_grammar', 'english_listening', 'geography'] as const)('%s has no redundant learning-mode step', subject => {
    expect(studyEntry(subject)).toBe('chapters');
  });
  it.each(['chemistry_basic', 'chemistry', 'math', 'biology_basic'] as const)('%s retains its multiple modes', subject => {
    expect(studyEntry(subject)).toBe('mode_selection');
  });
  it('retains a valid chapter in the same subject', () => {
    expect(safeStudyResume('chemistry_basic', 'quiz', 'c1_1')).toBe('quiz');
  });
  it('rejects a previous subject chapter', () => {
    expect(safeStudyResume('english_grammar', 'quiz', 'c1_1')).toBe('chapters');
  });
  it.each(['home', 'settings', 'note_detail', 'battle', 'bad-state'])('does not resume %s as learning', screen => {
    expect(safeStudyResume('chemistry_basic', screen, null)).toBe('mode_selection');
  });
  it('guards unavailable chapter and mode contexts', () => {
    expect(safeStudyResume('chemistry', 'quiz', null)).toBe('mode_selection');
    expect(safeStudyResume('english_grammar', 'learning', null)).toBe('chapters');
    expect(safeStudyResume('biology_basic', 'mock_exam', null)).toBe('mode_selection');
    expect(safeStudyResume('english_grammar', 'advanced_fields', null)).toBe('chapters');
    expect(isLearningScreen('advanced_fields')).toBe(true);
    expect(isLearningScreen('battle')).toBe(false);
  });
});

describe('復習先の全科目検索（実教材のIDで確認）', () => {
  it.each(subjects)('$id resolves its own saved question', subject => {
    const chapter = subject.parts.flatMap(p => p.chapters).find(c => c.practiceProblems?.length);
    expect(chapter).toBeTruthy();
    const target = resolveReviewTarget({ chapterId: chapter.id, questionId: chapter.practiceProblems[0].id }, subjects);
    expect(target).toMatchObject({ subject: subject.id, chapterId: chapter.id, questionIndex: 0 });
  });
  it('never falls back from deleted identifiers to a different question', () => {
    expect(resolveReviewTarget({ chapterId:'missing', questionIndex:1 }, subjects)).toBeNull();
    expect(resolveReviewTarget({ chapterId:'c1_1', questionId:'deleted' }, subjects)).toBeNull();
    expect(resolveReviewTarget({ chapterId:'c1_1', questionIndex:99999 }, subjects)).toBeNull();
    expect(resolveReviewTarget({ chapterId:'c1_1', questionIndex:0 }, subjects)).toBeNull();
  });
  it('rejects ambiguous old titles', () => {
    const chapter = {id:'a', abstractTitle:'same', practiceProblems:[{id:'q'}]};
    expect(resolveReviewTarget({chapterTitle:'same',questionIndex:1},[{id:'chemistry_basic',parts:[{chapters:[chapter,{...chapter,id:'b'}]}]}])).toBeNull();
  });
  it('keeps legacy chapter+index notes usable without silently clamping', () => {
    expect(resolveReviewTarget({chapterId:'c1_1',questionIndex:1},subjects)).toMatchObject({subject:'chemistry_basic',questionIndex:0});
  });
});

describe('UIの接続と保護', () => {
  it('does not let global navigation or idle timeout bypass battle exit', () => {
    expect(app).toMatch(/appState !== 'quiz' && appState !== 'explanation' && \(/);
    expect(app).toContain("appState === 'battle' && next !== 'battle' && battleActive");
    expect(app).toContain('!window.confirm(');
    expect(app).toContain("navigateMain('home')");
    expect(app).toMatch(/const idleResetEnabled =[^;]*appState !== 'battle'/);
  });
  it('preserves study tabs and stops active learning-tab resets', () => {
    expect(app).toContain('view={studyHubView} onViewChange={setStudyHubView}');
    expect(app).toContain('if (!isLearningScreen(appState))');
  });
  it('resets quiz storage using an explicit mode and resets listening step', () => {
    expect(app).toContain('handleSelectChapter(chapterId, index, false, problemId ? { startIndex: index, endIndex: index } : null, mode)');
    expect(app).toContain('quizStepKey(chapterId, targetMode)');
    expect(app).toContain('quizIndexKey(chapterId, targetMode)');
  });
  it('keeps loaded-subject checks and a stale-navigation guard for reviews', () => {
    expect(app).toContain('.filter(entry => isSubjectEnabled(entry.id))');
    expect(app).toContain('if (request !== reviewRequest.current) return;');
  });
  it('offers review before exposing answers and puts tabs before content', () => {
    const s=readFileSync('src/components/StudyHub.tsx','utf8');
    expect(s.indexOf('答えを見ずにこの問題を解き直す')).toBeLessThan(s.indexOf('{open && ('));
    expect(s.indexOf('aria-label="学習ノートの表示切替"')).toBeLessThan(s.indexOf('id="subject-scoped-panel"'));
    expect(s).toContain('学習状況のグラフを見る');
  });
  it('uses honest matching copy rather than claiming non-existent rating expansion', () => {
    const s=readFileSync('src/battle/ui/BattleMatching.tsx','utf8');
    expect(s).not.toContain('レートの近い人を優先');
    expect(s).not.toContain('レートの条件をゆるめて');
  });
  it('has an explicit empty-state escape route', () => {
    expect(readFileSync('src/components/QuizScreens.tsx','utf8')).toContain('if (!chapter) return <ScreenUnavailable');
    expect(app).toContain('backLabel="学習ノートへ戻る"');
  });
});
