import { readFileSync } from 'node:fs';
import { describe, it, expect, vi } from 'vitest';

/**
 * ===================================================================
 * 科目選択（タイトル）画面の回帰テスト
 * ===================================================================
 * ご要望：
 *   - 「英語リスニング」を、化学と同じく未開発（準備中）として追加する
 *   - ウィンドウのサイズは今までと同じ
 *   - 横スクロールで選べるようにする（カルーセル方式）
 *
 * レンダリング環境（jsdom）を前提にしないため、
 *   ① SubjectId / ラベル定義などの純粋なロジックは実際に import して検証
 *   ② 見た目（カード寸法・カルーセル指定）はソース文字列で検証
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
const CSS = readFileSync('src/index.css', 'utf8');

describe('科目の定義', () => {
  it('化学基礎・化学・英語リスニングの3科目が SubjectId に含まれる', async () => {
    const { SUBJECT_LABELS } = await import('../src/components/SubjectSelection');
    expect(Object.keys(SUBJECT_LABELS).sort()).toEqual(
      ['chemistry', 'chemistry_basic', 'english_listening'],
    );
    expect(SUBJECT_LABELS.english_listening).toBe('英語リスニング');
  });

  it('getSubjectLabel は未知の値でも落ちず、化学基礎に倒す', async () => {
    const { getSubjectLabel } = await import('../src/components/SubjectSelection');
    expect(getSubjectLabel('english_listening')).toBe('英語リスニング');
    expect(getSubjectLabel('chemistry')).toBe('化学');
    expect(getSubjectLabel('mathematics')).toBe('化学基礎');
    expect(getSubjectLabel(null)).toBe('化学基礎');
    expect(getSubjectLabel(undefined)).toBe('化学基礎');
    expect(getSubjectLabel('')).toBe('化学基礎');
  });

  it('isSubjectId は保存済みの不正な値を弾く', async () => {
    const { isSubjectId } = await import('../src/components/SubjectSelection');
    expect(isSubjectId('chemistry_basic')).toBe(true);
    expect(isSubjectId('english_listening')).toBe(true);
    expect(isSubjectId('physics')).toBe(false);
    expect(isSubjectId(null)).toBe(false);
  });

  it('英語リスニングは available: false（＝準備中）として定義されている', () => {
    // 定義ブロックを切り出して確認する
    const block = SRC.slice(SRC.indexOf("id: 'english_listening'"));
    const end = block.indexOf('},');
    const def = block.slice(0, end);
    expect(def).toContain("title: '英語リスニング'");
    expect(def).toContain('available: false');
    expect(def).toContain('icon: Headphones');
  });

  it('化学は available: true（＝公開中）として定義されている', () => {
    // 化学（発展）は単元だけ先に公開し、問題は順次追加していく方針。
    const block = SRC.slice(SRC.indexOf("id: 'chemistry',"));
    const end = block.indexOf('},');
    const def = block.slice(0, end);
    expect(def).toContain("title: '化学'");
    expect(def).toContain('available: true');
    expect(def).toContain('icon: FlaskConical');
  });

  it('化学基礎と化学が公開中で、英語リスニングだけ準備中', () => {
    const availableTrue = (SRC.match(/available: true/g) || []).length;
    const availableFalse = (SRC.match(/available: false/g) || []).length;
    expect(availableTrue).toBe(2);
    expect(availableFalse).toBe(1);
  });
});

describe('カルーセル（横スクロール）', () => {
  it('グリッド2カラムではなく、横スクロールのトラックになっている', () => {
    expect(SRC).not.toContain('grid grid-cols-1 md:grid-cols-2');
    expect(SRC).toContain('overflow-x-auto');
    expect(SRC).toContain('snap-x snap-mandatory');
    expect(SRC).toContain('snap-center');
  });

  it('カード1枚の寸法は従来のまま（ウィンドウのサイズを変えない）', () => {
    // カード本体の見た目に関わる指定が従来値で残っていること
    expect(SRC).toContain('min-h-[248px]');
    expect(SRC).toContain('rounded-[24px]');
    expect(SRC).toContain('p-6 md:p-7');
    // 外枠の最大幅と間隔も 2カラム時代と同じ
    expect(SRC).toContain('max-w-4xl');
    expect(SRC).toContain('gap-5 md:gap-6');
    // md以上では従来の2カラム時と同じ幅（50% − gap/2 = 50% − 12px）
    expect(SRC).toContain('md:w-[calc(50%-12px)]');
  });

  it('矢印・ドット・案内文の操作導線がそろっている', () => {
    expect(SRC).toContain('aria-label="前の科目を表示する"');
    expect(SRC).toContain('aria-label="次の科目を表示する"');
    expect(SRC).toContain('role="tablist"');
    expect(SRC).toMatch(/横にスワイプ/);
  });

  it('←→キーでも送れる（キーボード操作の担保）', () => {
    expect(SRC).toContain("e.key === 'ArrowRight'");
    expect(SRC).toContain("e.key === 'ArrowLeft'");
    expect(SRC).toContain('tabIndex={0}');
  });

  it('スクロールバーを隠す専用クラスが CSS に定義されている（既存の no-op に頼らない）', () => {
    expect(SRC).toContain('carousel-x');
    expect(CSS).toContain('.carousel-x');
    expect(CSS).toContain('scrollbar-width: none');
    expect(CSS).toContain('.carousel-x::-webkit-scrollbar');
  });

  it('端のカードも中央に寄せられるようスペーサーを置いている', () => {
    const spacers = (SRC.match(/shrink-0 w-\[7vw\] md:hidden/g) || []).length;
    expect(spacers).toBe(2);
    // カード要素は data 属性で引く（スペーサーを数に含めないため）
    expect(SRC).toContain('data-subject-card');
    expect(SRC).toContain("querySelectorAll<HTMLElement>('[data-subject-card]')");
  });

  it('横スクロールでページ全体が動かないようにしている', () => {
    expect(SRC).toContain('overscroll-x-contain');
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
  it('科目名の表示は3科目対応のヘルパー経由になっている', () => {
    expect(APP).toContain('getSubjectLabel(selectedSubject)');
    // 2科目前提の三項演算子が残っていないこと
    expect(APP).not.toContain("selectedSubject === 'chemistry_basic' ? '化学基礎' : '化学'");
  });

  it('localStorage に古い/壊れた科目IDが入っていても化学基礎に倒す', () => {
    expect(APP).toContain('isSubjectId(saved)');
    expect(APP).not.toContain('as SubjectId) ||');
  });
});
