import { readFileSync } from 'node:fs';
import { describe, it, expect } from 'vitest';

import {
  mergeSolvedMaps,
  solvedMapChanged,
  mergeReviewItem,
  mergeReviewLists,
  reviewListChanged,
  limitReviewItemsForSync,
  toSyncableReviewItem,
  fromSyncedReviewItems,
  MAX_SYNCED_REVIEW_ITEMS,
  SYNCED_TEXT_MAX,
} from '../src/utils/studySyncCore';
import type { ReviewItem } from '../src/utils/reviewList';

/**
 * ===================================================================
 * 学習データ同期（マージ処理）のテスト
 * ===================================================================
 * これまで学習進捗は localStorage だけにあり、機種変更で消えていた。
 * Firestore へ同期するにあたり最も危険なのは
 * 「同期したら記録が減る／消える」ことなので、
 * ここでは特に **データが失われないこと** を重点的に検証する。
 */

function makeItem(overrides: Partial<ReviewItem> = {}): ReviewItem {
  return {
    key: 'c1_1::q1::s1',
    chapterId: 'c1_1',
    questionId: 'q1',
    subQuestionId: 's1',
    box: 0,
    dueAt: 1000,
    wrongCount: 1,
    correctCount: 0,
    createdAt: 1000,
    updatedAt: 1000,
    ...overrides,
  };
}

describe('進捗マップのマージ（記録が消えないこと）', () => {
  it('両方の記録が残る（和集合になる）', () => {
    const local = { 'c1_1::q1': 100, 'c1_1::q2': 200 };
    const remote = { 'c1_1::q2': 150, 'c1_2::q9': 300 };

    const merged = mergeSolvedMaps(local, remote);

    expect(Object.keys(merged).sort()).toEqual(['c1_1::q1', 'c1_1::q2', 'c1_2::q9']);
  });

  it('初回解答時刻は早い方が残る', () => {
    const merged = mergeSolvedMaps({ 'c1_1::q1': 500 }, { 'c1_1::q1': 200 });
    expect(merged['c1_1::q1']).toBe(200);
  });

  it('マージの順序を入れ替えても同じ結果になる（可換）', () => {
    const a = { 'c1_1::q1': 100, 'c1_1::q3': 400 };
    const b = { 'c1_1::q1': 90, 'c1_1::q2': 300 };
    expect(mergeSolvedMaps(a, b)).toEqual(mergeSolvedMaps(b, a));
  });

  it('何度マージしても増減しない（べき等）', () => {
    const a = { 'c1_1::q1': 100 };
    const b = { 'c1_1::q2': 200 };
    const once = mergeSolvedMaps(a, b);
    const twice = mergeSolvedMaps(once, b);
    expect(twice).toEqual(once);
  });

  it('null / undefined を渡しても壊れない', () => {
    expect(mergeSolvedMaps(null, undefined)).toEqual({});
    expect(mergeSolvedMaps({ 'c1_1::q1': 100 }, null)).toEqual({ 'c1_1::q1': 100 });
  });

  it('時刻が壊れていても「解いた事実」は残す', () => {
    const merged = mergeSolvedMaps({ 'c1_1::q1': NaN as any }, {});
    expect(Object.keys(merged)).toContain('c1_1::q1');
  });

  it('片方の時刻が不明なら有効な方を採用する', () => {
    const merged = mergeSolvedMaps({ 'c1_1::q1': 0 }, { 'c1_1::q1': 700 });
    expect(merged['c1_1::q1']).toBe(700);
  });

  it('変化の検出が正しく働く（無駄な保存を避ける）', () => {
    const before = { 'c1_1::q1': 100 };
    expect(solvedMapChanged(before, { 'c1_1::q1': 100 })).toBe(false);
    expect(solvedMapChanged(before, { 'c1_1::q1': 100, 'c1_1::q2': 200 })).toBe(true);
    expect(solvedMapChanged(before, { 'c1_1::q1': 50 })).toBe(true);
  });
});

describe('復習リストのマージ（累計回数が消えないこと）', () => {
  it('updatedAt が新しい方の状態を採用する', () => {
    const older = makeItem({ box: 1, dueAt: 5000, updatedAt: 1000 });
    const newer = makeItem({ box: 3, dueAt: 9000, updatedAt: 2000 });

    const merged = mergeReviewItem(older, newer);

    expect(merged.box).toBe(3);
    expect(merged.dueAt).toBe(9000);
  });

  it('間違えた回数は大きい方が残る（別端末の記録を失わない）', () => {
    // スマホで2回間違え、PCで1回間違えた状況
    const phone = makeItem({ wrongCount: 2, updatedAt: 1000 });
    const pc = makeItem({ wrongCount: 1, updatedAt: 2000 });

    const merged = mergeReviewItem(phone, pc);

    // 新しいのは PC 側だが、回数は多い方（2）を残さないと
    // 「何回つまずいたか」という評価上重要な情報が失われる
    expect(merged.wrongCount).toBe(2);
  });

  it('解き直した回数も大きい方が残る', () => {
    const merged = mergeReviewItem(
      makeItem({ correctCount: 5, updatedAt: 1000 }),
      makeItem({ correctCount: 2, updatedAt: 3000 }),
    );
    expect(merged.correctCount).toBe(5);
  });

  it('初回登録日時は早い方が残る', () => {
    const merged = mergeReviewItem(
      makeItem({ createdAt: 500, updatedAt: 1000 }),
      makeItem({ createdAt: 900, updatedAt: 2000 }),
    );
    expect(merged.createdAt).toBe(500);
  });

  it('片方にしか無い項目は消えない（削除は同期しない）', () => {
    const local = [makeItem({ key: 'a' })];
    const remote = [makeItem({ key: 'b' })];

    const merged = mergeReviewLists(local, remote);

    expect(merged.map((item) => item.key).sort()).toEqual(['a', 'b']);
  });

  it('復習予定が近い順に並ぶ', () => {
    const merged = mergeReviewLists(
      [makeItem({ key: 'late', dueAt: 9000 }), makeItem({ key: 'soon', dueAt: 100 })],
      [],
    );
    expect(merged.map((item) => item.key)).toEqual(['soon', 'late']);
  });

  it('key が無い壊れた行は捨てる', () => {
    const merged = mergeReviewLists([{ chapterId: 'c1' } as any, makeItem({ key: 'ok' })], []);
    expect(merged).toHaveLength(1);
    expect(merged[0].key).toBe('ok');
  });

  it('配列以外を渡しても壊れない', () => {
    expect(mergeReviewLists(null, undefined)).toEqual([]);
    expect(mergeReviewLists('x' as any, null)).toEqual([]);
  });

  it('変化の検出が回数の増加も拾う', () => {
    const before = [makeItem({ key: 'a', wrongCount: 1 })];
    expect(reviewListChanged(before, [makeItem({ key: 'a', wrongCount: 1 })])).toBe(false);
    expect(reviewListChanged(before, [makeItem({ key: 'a', wrongCount: 2 })])).toBe(true);
  });
});

describe('Firestore へ載せる形への変換', () => {
  it('undefined を含まない（Firestore は undefined を拒否する）', () => {
    const payload = toSyncableReviewItem(makeItem({ chapterTitle: undefined }));
    Object.values(payload).forEach((value) => {
      expect(value).not.toBeUndefined();
    });
    expect('chapterTitle' in payload).toBe(false);
  });

  it('長い問題文は切り詰める（ドキュメント上限対策）', () => {
    const long = 'あ'.repeat(SYNCED_TEXT_MAX + 100);
    const payload = toSyncableReviewItem(makeItem({ questionText: long }));
    expect(String(payload.questionText).length).toBeLessThanOrEqual(SYNCED_TEXT_MAX + 1);
  });

  it('同期件数に上限を掛け、復習が近いものを優先して残す', () => {
    const items = Array.from({ length: MAX_SYNCED_REVIEW_ITEMS + 50 }, (_, index) =>
      makeItem({ key: `k${index}`, dueAt: index }),
    );

    const limited = limitReviewItemsForSync(items);

    expect(limited).toHaveLength(MAX_SYNCED_REVIEW_ITEMS);
    // due が早い（=いま必要な）ものが残る
    expect(limited[0].dueAt).toBe(0);
  });

  it('上限以下ならそのまま返す', () => {
    const items = [makeItem()];
    expect(limitReviewItemsForSync(items)).toBe(items);
  });

  it('壊れた行は読み込み時に捨てる', () => {
    const restored = fromSyncedReviewItems([
      makeItem({ key: 'ok' }),
      { key: '', chapterId: 'c1' },
      { chapterId: 'c1' },
      null,
      'x',
    ]);
    expect(restored).toHaveLength(1);
    expect(restored[0].key).toBe('ok');
  });

  it('配列以外は空配列として扱う', () => {
    expect(fromSyncedReviewItems(null)).toEqual([]);
    expect(fromSyncedReviewItems({ a: 1 })).toEqual([]);
  });
});

describe('同期の設計方針がコードに残っていること', () => {
  const source = readFileSync(new URL('../src/utils/studySync.ts', import.meta.url), 'utf-8');

  it('localStorage を主、Firestore を従とする方針が明記されている', () => {
    expect(source).toContain('localStorage を主');
  });

  it('書き込みをまとめて通信量を抑えている', () => {
    expect(source).toContain('FLUSH_DEBOUNCE_MS');
  });

  it('iOS Safari 対策で pagehide を使っている（beforeunload では取りこぼす）', () => {
    expect(source).toContain('pagehide');
    expect(source).toContain('visibilitychange');
  });

  it('同期失敗で学習を止めない（例外を投げず警告に留める）', () => {
    expect(source).toContain('console.warn');
    expect(source).not.toContain('throw new Error');
  });

  it('ゲストは同期しない（他人の記録と混ざらないようにする）', () => {
    expect(source).toContain('auth.currentUser?.uid');
    expect(source).toContain('isSyncEnabled');
  });
});
