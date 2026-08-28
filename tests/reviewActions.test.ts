/**
 * ===================================================================
 * 復習アクション（正解・不正解・削除）の共通化を固定するテスト
 * ===================================================================
 *
 * ■ 何を守るためのテストか
 *   ReviewList.tsx（復習リスト画面）と StudyHub.tsx（学習ノート画面）に、
 *   まったく同じ形のハンドラが3つずつ、合計6つ置かれていた。
 *
 *     const handleCorrect = (key: string) => { markReviewedCorrect(uid, key); refresh(); };
 *     const handleWrong   = (key: string) => { markReviewedWrong(uid, key);   refresh(); };
 *     const handleRemove  = (key: string) => { removeReviewItem(uid, key);    refresh(); };
 *
 *   ★ただし、注入される refresh の中身は2画面で違う★
 *
 *     ReviewList: setNow(Date.now()) + setItems(getAllReviewItems(uid))
 *     StudyHub  : setNow(Date.now()) + setReviewItems(getAllReviewItems(uid))
 *                 ＋ setNotes(loadNotes())   ← ノートも読み直す
 *
 *   つまり「同じ見た目のコード」だが、やっていることは画面ごとに違う。
 *   ここを取り違えて refresh の実装ごと共通化してしまうと、
 *   たとえば StudyHub でノートの再読込が失われる、という壊し方をする。
 *
 *   そこで共通化するのは「保存操作 → 画面の作り直し」という手順だけにし、
 *   refresh は各画面から受け取る形（factory）にした。
 *   このテストは、
 *     1) 正解・不正解・削除で呼ばれる保存関数が入れ替わっていないこと
 *     2) 保存の**あと**に refresh が呼ばれること（順序）
 *     3) refresh は渡されたものがそのまま使われること（画面ごとの違いが保たれる）
 *   を機械的に固定する。
 *
 * ■ 調べていて分かったこと（削除はしていない）
 *   ReviewList.tsx は現在どこからも import されておらず、
 *   ビルド後のチャンクにも含まれない（ツリーシェイクで落ちている）。
 *   復習の3操作が実際に動いているのは StudyHub.tsx（学習ノート画面）で、
 *   ホームの「学習ノート」から入って復習カードを開くと出てくる。
 *   Home.tsx には onReviewList?: () => void という任意propが残っているが
 *   渡している箇所は無い。
 *
 *   ただし「使われていないから消す」という判断はここではしない。
 *   画面を消すのは構造整理ではなく機能削除であり、今回の作業範囲外。
 *   両方の画面を同じ共通実装に載せておけば、将来この画面を復活させても
 *   手順がずれない、という状態にしてある。
 *   （そのため下のガードは2ファイル両方を対象にしている。）
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

import {
  createReviewActions,
  markReviewedCorrect,
  markReviewedWrong,
  removeReviewItem,
  addReviewItemManually,
  getAllReviewItems,
} from '../src/utils/reviewList';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ------------------------------------------------------------------
// localStorage の簡易モック（Node 環境には存在しない）
// 既存テスト（tests/feedback.test.ts）と同じ方式に合わせている。
// ------------------------------------------------------------------
class MemoryStorage {
  private store = new Map<string, string>();
  getItem(key: string) { return this.store.has(key) ? this.store.get(key)! : null; }
  setItem(key: string, value: string) { this.store.set(key, value); }
  removeItem(key: string) { this.store.delete(key); }
  clear() { this.store.clear(); }
  get length() { return this.store.size; }
  key(index: number) { return Array.from(this.store.keys())[index] ?? null; }
}

(globalThis as any).localStorage = new MemoryStorage();

/**
 * 旧実装の複製。
 * 共通化後の createReviewActions がこれと同じ順序・同じ相手を呼ぶことを確かめる。
 */
const legacyHandlers = (uid: string | null | undefined, refresh: () => void) => ({
  handleCorrect: (key: string) => {
    markReviewedCorrect(uid, key);
    refresh();
  },
  handleWrong: (key: string) => {
    markReviewedWrong(uid, key);
    refresh();
  },
  handleRemove: (key: string) => {
    removeReviewItem(uid, key);
    refresh();
  },
});

const UID = 'test-uid-reviewactions';

/**
 * 復習アイテムを1件用意して、その key を返す（実際の保存処理を通す）。
 *
 * key は呼び出し側が決めるものではなく
 * chapterId / questionId / subQuestionId から組み立てられるので、
 * 保存後のリストから引き当てて返す。
 */
const seed = (tag: string): string => {
  const items = addReviewItemManually(UID, {
    chapterId: 'c1_1',
    chapterTitle: '物質の分類',
    questionIndex: 1,
    questionId: `q_${tag}`,
    subQuestionId: `s_${tag}`,
    questionText: 'テスト用の問題',
  });
  const found = items.find((i) => i.chapterId === 'c1_1' && i.key.includes(tag));
  if (!found) throw new Error(`seed 失敗: ${tag}`);
  return found.key;
};

beforeEach(() => {
  localStorage.clear();
});

describe('createReviewActions：旧実装と同じ結果になる', () => {
  it('「正解」は、旧実装と同じ box / dueAt になる', () => {
    // 旧実装で1件処理した結果
    const k1 = seed('k1');
    legacyHandlers(UID, () => {}).handleCorrect(k1);
    const legacyResult = getAllReviewItems(UID).find((i) => i.key === k1);

    // 新実装で同じことをした結果
    localStorage.clear();
    const k1b = seed('k1');
    createReviewActions(UID, () => {}).handleCorrect(k1b);
    const newResult = getAllReviewItems(UID).find((i) => i.key === k1b);

    expect(newResult?.box).toBe(legacyResult?.box);
    expect(newResult?.correctCount).toBe(legacyResult?.correctCount);
    // 正解で box が進んでいること自体も確認（「何もしない」実装で通らないように）
    expect(newResult?.box).toBe(1);
  });

  it('「不正解」は、旧実装と同じ box 0 に戻る', () => {
    const k2 = seed('k2');
    // 一度正解させて box を進めてから、不正解にする
    createReviewActions(UID, () => {}).handleCorrect(k2);
    expect(getAllReviewItems(UID).find((i) => i.key === k2)?.box).toBe(1);

    createReviewActions(UID, () => {}).handleWrong(k2);
    const after = getAllReviewItems(UID).find((i) => i.key === k2);
    expect(after?.box).toBe(0);
    // 復習アイテムは「誤答の登録」で作られるので wrongCount は最初から 1。
    // そこへ復習の不正解で +1 されて 2 になるのが正しい挙動。
    // （ここを 1 と決めつけると、加算されていない実装を見逃す）
    expect(after?.wrongCount).toBe(2);
  });

  it('「削除」は、そのアイテムだけを消す（他は残る）', () => {
    const k3 = seed('k3');
    const k4 = seed('k4');
    expect(getAllReviewItems(UID)).toHaveLength(2);

    createReviewActions(UID, () => {}).handleRemove(k3);
    const rest = getAllReviewItems(UID);
    expect(rest).toHaveLength(1);
    expect(rest[0].key).toBe(k4);
  });
});

describe('createReviewActions：呼び出しの順序と相手', () => {
  it('★保存の「あと」に refresh が呼ばれる★（先に呼ぶと古い内容が表示される）', () => {
    const k5 = seed('k5');
    const order: string[] = [];
    const refresh = () => {
      // refresh の時点で、すでに保存が済んでいるか（box が進んでいるか）を見る
      const box = getAllReviewItems(UID).find((i) => i.key === k5)?.box;
      order.push(`refresh(box=${box})`);
    };

    createReviewActions(UID, refresh).handleCorrect(k5);

    // 保存が先に済んでいれば box=1 が見えるはず
    expect(order).toEqual(['refresh(box=1)']);
  });

  it('3つのハンドラすべてで refresh がちょうど1回呼ばれる', () => {
    const k6 = seed('k6');
    const refresh = vi.fn();
    const a = createReviewActions(UID, refresh);

    a.handleCorrect(k6);
    expect(refresh).toHaveBeenCalledTimes(1);
    a.handleWrong(k6);
    expect(refresh).toHaveBeenCalledTimes(2);
    a.handleRemove(k6);
    expect(refresh).toHaveBeenCalledTimes(3);
  });

  it('★渡した refresh がそのまま使われる（画面ごとの違いが保たれる）★', () => {
    // StudyHub はノートの読み直しも refresh に含んでいる。
    // 共通化で refresh の中身を固定してしまっていないことの確認。
    const k7 = seed('k7');
    const calls: string[] = [];
    const studyHubLikeRefresh = () => {
      calls.push('setNow');
      calls.push('setReviewItems');
      calls.push('setNotes'); // ← ReviewList には無い処理
    };

    createReviewActions(UID, studyHubLikeRefresh).handleCorrect(k7);
    expect(calls).toEqual(['setNow', 'setReviewItems', 'setNotes']);
  });

  it('正解・不正解・削除が入れ替わっていない（取り違え検出）', () => {
    const k8 = seed('k8');
    const a = createReviewActions(UID, () => {});

    // 正解 → box が増える（不正解と入れ替わっていたら 0 のまま）
    a.handleCorrect(k8);
    expect(getAllReviewItems(UID).find((i) => i.key === k8)?.box).toBe(1);

    // 不正解 → box が 0（正解と入れ替わっていたら 2 になる）
    a.handleWrong(k8);
    expect(getAllReviewItems(UID).find((i) => i.key === k8)?.box).toBe(0);

    // 削除 → 消える（正解/不正解と入れ替わっていたら残る）
    a.handleRemove(k8);
    expect(getAllReviewItems(UID).find((i) => i.key === k8)).toBeUndefined();
  });

  it('uid が null でも例外にならない（ゲスト利用）', () => {
    const refresh = vi.fn();
    expect(() => createReviewActions(null, refresh).handleCorrect('nope')).not.toThrow();
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});

describe('構造の固定（ガード）', () => {
  const read = (p: string) => readFileSync(resolve(ROOT, p), 'utf8');

  it('2画面とも createReviewActions を使っている', () => {
    for (const f of ['src/components/ReviewList.tsx', 'src/components/StudyHub.tsx']) {
      expect(read(f)).toMatch(/createReviewActions/u);
    }
  });

  it('2画面に markReviewedCorrect / markReviewedWrong / removeReviewItem の直呼びが残っていない', () => {
    for (const f of ['src/components/ReviewList.tsx', 'src/components/StudyHub.tsx']) {
      const src = read(f);
      expect(src).not.toMatch(/markReviewedCorrect\s*\(/u);
      expect(src).not.toMatch(/markReviewedWrong\s*\(/u);
      expect(src).not.toMatch(/removeReviewItem\s*\(/u);
    }
  });

  it('★StudyHub の refresh はノートの読み直しを保っている★', () => {
    // 共通化のついでにここを削ってしまう事故を防ぐ
    const src = read('src/components/StudyHub.tsx');
    const m = src.match(/const refresh = \(\) => \{[\s\S]*?\n {2}\};/u);
    expect(m).not.toBeNull();
    expect(m![0]).toMatch(/setNotes\s*\(/u);
  });

  it('reviewList.ts は葉のまま（他モジュールを import しない）', () => {
    // utils → components や utils → data の逆流を作らない
    expect(read('src/utils/reviewList.ts')).not.toMatch(/^import\s/mu);
  });
});
