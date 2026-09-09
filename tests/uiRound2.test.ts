import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolveReviewTarget } from '../src/utils/reviewTarget';
import { SUBJECTS, getPartsOfSubject, getChaptersOfSubject } from '../src/data/allChapters';
import * as trees from '../src/data/chemistryTreeData';
import { isAppState } from '../src/App';

const subjects = SUBJECTS.map(s => ({ id: s.id, parts: getPartsOfSubject(s.id) }));
const read = (p: string) => readFileSync(p, 'utf8');

describe('第2弾: ロジックツリーの確認問題が演習へつながる', () => {
  const linked = new Set<string>();
  const walk = (n: any) => {
    if (!n || typeof n !== 'object') return;
    (n.relatedQuestions || []).forEach((q: any) => linked.add(q.id));
    (n.children || []).forEach(walk);
  };
  Object.values(trees).forEach(walk);

  it('小問IDだけのリンクから、章と問題位置を一意に解決できる', () => {
    const chapter = getChaptersOfSubject('chemistry_basic').find((c: any) => c.id === 'c1_2_B');
    const sub = chapter.practiceProblems[0].subQuestions[0].id;
    expect(resolveReviewTarget({ subQuestionId: sub }, subjects)).toMatchObject({ subject: 'chemistry_basic', chapterId: 'c1_2_B', questionIndex: 0 });
  });
  it('教材に無い小問IDは無関係の問題へ置き換えない', () => {
    expect(resolveReviewTarget({ subQuestionId: 'q_missing_zzz' }, subjects)).toBeNull();
  });
  it('ツリーの確認問題のうち、現在の教材で解決できる割合を記録する（未解決は画面で説明する）', () => {
    let ok = 0;
    for (const id of linked) if (resolveReviewTarget({ subQuestionId: id }, subjects)) ok++;
    expect(linked.size).toBeGreaterThan(300);
    expect(ok / linked.size).toBeGreaterThan(0.8);
  });
  it('画面に戻る操作と問題を開く処理が接続されている', () => {
    const tree = read('src/components/LogicalTree.tsx');
    expect(tree).not.toContain("console.log('Question clicked:'");
    expect(tree).toContain('onOpenQuestion');
    expect(tree).toContain('aria-label="ホームに戻る"');
    expect(read('src/App.tsx')).toContain('onOpenQuestion={(subQuestionId) => handleReviewNote({ subQuestionId })}');
  });
});

describe('第2弾: 結果画面の次の行動', () => {
  const app = read('src/App.tsx');
  const quizScreens = read('src/components/QuizScreens.tsx');
  const explanation = read('src/components/Explanation.tsx');
  it('間違えた問題からの解き直しは通常の演習開始と同じ経路（保存キーの初期化）を通る', () => {
    expect(app).toContain('onRetryWrong={(chapterId, firstWrongIndex) => handleSelectChapter(chapterId, firstWrongIndex, false, quizRange, appMode)}');
    expect(app).toContain('onNextChapter={(chapterId) => handleSelectChapter(chapterId, 0, false, null, appMode)}');
  });
  it('次の単元は同じ科目・同じモードで問題を持つ単元に限る。1回分だけ解いたときは出さない', () => {
    expect(quizScreens).toContain("if (screen !== 'explanation' || questionRange || !subject) return null;");
    expect(quizScreens).toContain("(c[pool] || []).length > 0");
  });
  it('未解答は「間違えた」に数えない', () => {
    expect(explanation).toMatch(/firstWrongQuestionIndex[\s\S]*isAttempted\(answers\[sq\.id\]\) && !isAnswerCorrect/);
  });
  it('実データで次の単元が正しく求まる', () => {
    const list = getChaptersOfSubject('chemistry_basic');
    const first = list.findIndex((c: any) => (c.practiceProblems || []).length > 0);
    const next = list.slice(first + 1).find((c: any) => (c.practiceProblems || []).length > 0);
    expect(next).toBeTruthy();
    expect(next.id).not.toBe(list[first].id);
  });
});

describe('第2弾: ノート・ランキング・状態の整合', () => {
  it('ノートの保存先キーが保存・一覧・詳細で一致する（ゲストも含む）', () => {
    const key = "notes_${auth.currentUser?.uid || 'guest'}";
    expect(read('src/components/Explanation.tsx')).toContain(key);
    expect(read('src/components/NoteDetail.tsx')).toContain(key);
    expect(read('src/components/StudyHub.tsx')).toContain("notes_${uid || 'guest'}");
    expect(read('src/components/Explanation.tsx')).not.toContain('ゲストモードではノート機能は使用できません');
  });
  it('ノート詳細の重要・復習回数・タグは変更時に保存される', () => {
    const s = read('src/components/NoteDetail.tsx');
    expect(s).toContain('quickPersist({ isImportant: next })');
    expect(s).toContain('quickPersist({ tags: next })');
    expect(s).toMatch(/quickPersist\(\{ reviewCount: next/);
    expect(s).not.toContain("role={canReview ? 'button' : undefined}");
  });
  it('章別ランキングは公開中の全科目から選べる', () => {
    const s = read('src/components/Leaderboard.tsx');
    expect(s).toContain('SUBJECT_INDEX');
    expect(s).toContain('aria-label="章別ベストの科目"');
    expect(s).not.toContain("getChapterIndexOfSubject('chemistry_basic')");
  });
  it('描画先の無い画面状態は復元しない', () => {
    expect(isAppState('flowchart')).toBe(false);
    expect(isAppState('logical_tree')).toBe(true);
  });
  it('科目選択で現在の科目が示され、単元一覧の戻る先が名前で分かる', () => {
    expect(read('src/components/SubjectSelection.tsx')).toContain("aria-current={isCurrent ? 'true' : undefined}");
    expect(read('src/App.tsx')).toContain("backLabel={studyEntry(selectedSubject) === 'chapters' ? 'ホーム' : '学習モード'}");
  });
  it('フレンド戦の再戦ボタンは実際の動き（新しい部屋）を示す', () => {
    expect(read('src/battle/ui/BattleRoomScreen.tsx')).toContain('rematchLabel="同じ科目で新しい部屋を作る"');
    expect(read('src/battle/ui/BattleResult.tsx')).toContain("rematchLabel = 'もう1回たいせん'");
  });
});
