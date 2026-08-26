import { readFileSync } from 'node:fs';
import { describe, it, expect, vi } from 'vitest';

/**
 * ===================================================================
 * 科目選択（タイトル）画面の回帰テスト
 * ===================================================================
 * ご要望の変遷：
 *   - 「英語リスニング」を科目として追加（available: true）
 *   - 「全ての科目が一つの画面で並ぶようにして」
 *     → カルーセル（横スクロール）を廃止し、1画面グリッドに変更
 *   - 「数学、生物基礎を追加して」
 *     → 数学は数III積分（全パターン演習）を公開（available: true）
 *     → 生物基礎は準備中（available: false）として先にカードだけ出す
 *   - 「英文法単元別に追加してください」
 *     → 英文法（english_grammar）を6番目の科目として公開（available: true）
 *
 * レンダリング環境（jsdom）を前提にしないため、
 *   ① SubjectId / ラベル定義などの純粋なロジックは実際に import して検証
 *   ② 見た目（グリッド・カード構成）はソース文字列で検証
 * の2段構えにしている。
 */

// firebase 実体は初期化＆ネットワークが走るためモックする
vi.mock('../src/firebase', () => ({
  auth: { currentUser: null },
  db: {},
  provider: {},
}));

const SRC = readFileSync('src/components/SubjectSelection.tsx', 'utf8');
const APP = readFileSync('src/App.tsx', 'utf8');

// 「その科目の単元が探索対象に入っているか」は、ソース文字列ではなく
// 実際に章を引けるかどうかで確かめる（探索は data/allChapters.ts に集約）
const { findChapterById } = await import('../src/data/allChapters');
const { englishListeningData } = await import('../src/data/englishListeningData');
const { mathData } = await import('../src/data/mathData');

describe('科目の定義', () => {
  it('化学基礎・化学・英語リスニング・数学・生物基礎・英文法の6科目が SubjectId に含まれる', async () => {
    const { SUBJECT_LABELS } = await import('../src/components/SubjectSelection');
    expect(Object.keys(SUBJECT_LABELS).sort()).toEqual(
      ['biology_basic', 'chemistry', 'chemistry_basic', 'english_grammar', 'english_listening', 'math'],
    );
    expect(SUBJECT_LABELS.english_listening).toBe('英語リスニング');
    expect(SUBJECT_LABELS.math).toBe('数学');
    expect(SUBJECT_LABELS.biology_basic).toBe('生物基礎');
    expect(SUBJECT_LABELS.english_grammar).toBe('英文法');
  });

  it('getSubjectLabel は未知の値でも落ちず、化学基礎に倒す', async () => {
    const { getSubjectLabel } = await import('../src/components/SubjectSelection');
    expect(getSubjectLabel('english_listening')).toBe('英語リスニング');
    expect(getSubjectLabel('chemistry')).toBe('化学');
    expect(getSubjectLabel('math')).toBe('数学');
    expect(getSubjectLabel('biology_basic')).toBe('生物基礎');
    expect(getSubjectLabel('physics')).toBe('化学基礎');
    expect(getSubjectLabel(null)).toBe('化学基礎');
    expect(getSubjectLabel(undefined)).toBe('化学基礎');
    expect(getSubjectLabel('')).toBe('化学基礎');
  });

  it('isSubjectId は保存済みの不正な値を弾く', async () => {
    const { isSubjectId } = await import('../src/components/SubjectSelection');
    expect(isSubjectId('chemistry_basic')).toBe(true);
    expect(isSubjectId('english_listening')).toBe(true);
    expect(isSubjectId('math')).toBe(true);
    expect(isSubjectId('biology_basic')).toBe(true);
    expect(isSubjectId('physics')).toBe(false);
    expect(isSubjectId(null)).toBe(false);
  });

  it('英語リスニングは available: true（＝公開中）として定義されている', () => {
    const block = SRC.slice(SRC.indexOf("id: 'english_listening'"));
    const def = block.slice(0, block.indexOf('},'));
    expect(def).toContain("title: '英語リスニング'");
    expect(def).toContain('available: true');
    expect(def).toContain('icon: Headphones');
  });

  it('化学は available: true（＝公開中）として定義されている', () => {
    const block = SRC.slice(SRC.indexOf("id: 'chemistry',"));
    const def = block.slice(0, block.indexOf('},'));
    expect(def).toContain("title: '化学'");
    expect(def).toContain('available: true');
    expect(def).toContain('icon: FlaskConical');
  });

  it('数学は available: true（＝公開中）で、数III積分を案内している', () => {
    const block = SRC.slice(SRC.indexOf("id: 'math'"));
    const def = block.slice(0, block.indexOf('},'));
    expect(def).toContain("title: '数学'");
    expect(def).toContain('available: true');
    expect(def).toContain('icon: Calculator');
    expect(def).toContain('積分');
  });

  it('生物基礎は available: true（＝公開中）で、収録数をデータから算出している', () => {
    const block = SRC.slice(SRC.indexOf("id: 'biology_basic'"));
    const def = block.slice(0, block.indexOf('},'));
    expect(def).toContain("title: '生物基礎'");
    expect(def).toContain('available: true');
    expect(def).toContain('icon: Leaf');
    // 収録数は getBiologyStats() から算出（数字のハードコードをしない）
    expect(def).toContain('biologyStats.chapters');
    expect(def).toContain('biologyStats.questions');
  });

  it('英文法は available: true（＝公開中）で、収録数をデータから算出している', () => {
    const block = SRC.slice(SRC.indexOf("id: 'english_grammar'"));
    const def = block.slice(0, block.indexOf('},'));
    expect(def).toContain("title: '英文法'");
    expect(def).toContain('available: true');
    expect(def).toContain('icon: PenLine');
    // 収録数は getGrammarStats() から算出（数字のハードコードをしない）
    expect(def).toContain('grammarStats.chapters');
    expect(def).toContain('grammarStats.marks');
  });

  it('公開中6科目（全科目公開済み）', () => {
    const availableTrue = (SRC.match(/available: true/g) || []).length;
    const availableFalse = (SRC.match(/available: false/g) || []).length;
    expect(availableTrue).toBe(6);
    expect(availableFalse).toBe(0);
  });

  it('数学の収録数はデータから算出する（数字のハードコードをしない）', () => {
    expect(SRC).toContain("import { getMathStats } from '../data/mathData'");
    expect(SRC).toContain('getMathStats()');
  });
});

describe('1画面グリッド（全科目を一望して選ぶ）', () => {
  it('カルーセル（横スクロール）を廃止し、グリッドで並べている', () => {
    // ご要望「全ての科目が一つの画面で並ぶようにして」
    expect(SRC).toContain('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3');
    expect(SRC).not.toContain('snap-x snap-mandatory');
    expect(SRC).not.toContain('overflow-x-auto');
    expect(SRC).not.toContain('carousel-x');
  });

  it('カルーセル固有の制御（スクロール追跡・矢印・ドット・スペーサー）が残っていない', () => {
    expect(SRC).not.toContain('scrollToIndex');
    expect(SRC).not.toContain('activeIndex');
    expect(SRC).not.toContain('aria-label="前の科目を表示する"');
    expect(SRC).not.toContain('aria-label="次の科目を表示する"');
    expect(SRC).not.toContain('role="tablist"');
    expect(SRC).not.toContain('w-[7vw]');
    expect(SRC).not.toMatch(/横にスワイプ/);
  });

  it('5科目すべてのカードがマップで描画される（隠れる科目が無い）', () => {
    expect(SRC).toContain('subjects.map((subject, index)');
    expect(SRC).toContain('data-subject-card');
    // グループとしてアクセシブルにラベル付けされている
    expect(SRC).toContain('aria-label="学習する科目を選択"');
  });

  it('準備中カードもタップでき、公開通知の受け皿に繋がる', () => {
    expect(SRC).toContain('setNotifySubject(subject)');
    expect(SRC).toContain('公開のお知らせを受け取る');
  });
});

describe('準備中の科目を押したときの案内', () => {
  it('文面が押された科目名に追従する（「化学」固定ではない）', () => {
    expect(SRC).toContain('notifySubject');
    expect(SRC).not.toContain('initialMessage="「化学」の公開を希望します。"');
    expect(SRC).toContain('initialMessage={`「${notifySubject.title}」の公開を希望します。`}');
    expect(SRC).toContain('requestedSubject: notifySubject.id');
  });
});

describe('App 側の結線', () => {
  it('科目名の表示は5科目対応のヘルパー経由になっている', () => {
    expect(APP).toContain('getSubjectLabel(selectedSubject)');
    // 2科目前提の三項演算子が残っていないこと
    expect(APP).not.toContain("selectedSubject === 'chemistry_basic' ? '化学基礎' : '化学'");
  });

  it('localStorage に古い/壊れた科目IDが入っていても化学基礎に倒す', () => {
    expect(APP).toContain('isSubjectId(saved)');
    expect(APP).not.toContain('as SubjectId) ||');
  });

  it('選択中の科目が「化学 or 化学基礎」に潰されず、そのまま各画面へ渡る', () => {
    expect(APP).toContain('subject={selectedSubject}');
    // まとめプリント（LearningViewer）は化学基礎／化学／数学の3分岐
    expect(APP).toContain("selectedSubject === 'math' ? 'math'");
  });

  it('英語リスニングは分野選択を挟まず、直接単元選択へ進む', () => {
    expect(APP).toContain("selectedSubject === 'english_listening'");
    // 「リスニングの単元が探索対象に入っているか」は
    // App.tsx のソース文字列ではなく、実際に引けるかどうかで確かめる
    // （探索処理は data/allChapters.ts の findChapterById に集約した）。
    const firstListening = englishListeningData.parts.flatMap((p: any) => p.chapters)[0] as any;
    expect(firstListening).toBeTruthy();
    expect(findChapterById(firstListening.id)).toBe(firstListening);
  });

  it('数学の単元が「選択中の単元」の探索対象に含まれている', () => {
    const firstMath = mathData.parts.flatMap((p: any) => p.chapters)[0] as any;
    expect(firstMath).toBeTruthy();
    expect(findChapterById(firstMath.id)).toBe(firstMath);
  });
});
