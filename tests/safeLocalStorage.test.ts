/**
 * ===================================================================
 * localStorage の安全な取り出し口（safeLocalStorage）の特性テスト
 * ===================================================================
 *
 * ■ なにを守るテストか
 *
 * このアプリは進捗・既読・再送キューなどを localStorage に置いている。
 * ただし localStorage は「必ず使える」ものではない。
 *
 *   ・プライベートブラウズ／Cookie ブロック
 *       → `localStorage` を **参照した瞬間に例外が飛ぶ** ブラウザがある
 *   ・Node（vitest / SSR）
 *       → そもそも `localStorage` が存在しない
 *   ・容量超過
 *       → `setItem` で例外が飛ぶ
 *
 * そのため「読めなければ既定値で続行し、例外は外に漏らさない」形が
 * 全体の約束になっている。この約束を守る取り出し口が
 *
 *   src/utils/progress.ts       の storage()
 *   src/utils/userRegistry.ts   の safeStorage()
 *   src/utils/updateNotices.ts  の safeStorage()
 *   src/utils/feedback.ts       の readStorage()
 *
 * と **名前だけ違う同じ関数で4本** 存在していた。
 * 1本に集約するにあたって、集約の前と後で挙動が1ミリも変わらないことを
 * このテストで先に固定しておく。
 *
 * ■ 集約前の実装（4本すべて文字どおり同一だった）
 *
 *     function storage(): Storage | null {
 *       try {
 *         const ls = (globalThis as any)?.localStorage;
 *         if (ls && typeof ls.getItem === 'function') return ls as Storage;
 *       } catch {
 *       }
 *       return null;
 *     }
 *
 * ここが押さえどころ:
 *   ・`getItem` が関数でないものは受け取らない（＝偽の localStorage を弾く）
 *   ・参照で例外が飛んでも null を返すだけで、外へ投げない
 *   ・返すのは同一オブジェクトそのもの（ラップしない）
 */
import { describe, it, expect, afterEach } from 'vitest';

/** 集約前の実装をこのテストの中に写したもの（比較の基準） */
function legacySafeStorage(): Storage | null {
  try {
    const ls = (globalThis as any)?.localStorage;
    if (ls && typeof ls.getItem === 'function') return ls as Storage;
  } catch {
    /* プライベートブラウズ等では保存できないが、動作は続ける */
  }
  return null;
}

const ORIGINAL = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

function restore() {
  if (ORIGINAL) {
    Object.defineProperty(globalThis, 'localStorage', ORIGINAL);
  } else {
    delete (globalThis as any).localStorage;
  }
}

/** ごく単純な localStorage 相当（テスト間で状態を持ち越さない） */
function makeStorage() {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => (map.has(k) ? map.get(k)! : null),
    setItem: (k: string, v: string) => void map.set(k, String(v)),
    removeItem: (k: string) => void map.delete(k),
    clear: () => map.clear(),
    key: (i: number) => [...map.keys()][i] ?? null,
    get length() {
      return map.size;
    },
  };
}

/** `localStorage` を参照した瞬間に投げる環境（Cookie ブロック時の Safari 等） */
function installThrowingStorage() {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get() {
      throw new DOMException('The operation is insecure.', 'SecurityError');
    },
  });
}

function install(value: unknown) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value,
  });
}

afterEach(() => {
  restore();
});

/**
 * 集約後の実装。
 * まだ作っていない段階でもこのテストを流せるように動的 import する。
 */
async function loadSafeStorage() {
  const mod = await import('../src/utils/safeLocalStorage');
  return mod.safeLocalStorage;
}

describe('safeLocalStorage: 集約前の4本と同じ挙動', () => {
  it('使える localStorage はそのまま返す（ラップせず同一オブジェクト）', async () => {
    const safeLocalStorage = await loadSafeStorage();
    const ls = makeStorage();
    install(ls);

    // 集約前と同じ結果か
    expect(safeLocalStorage()).toBe(legacySafeStorage());
    // 「同じ」だけでなく「渡したそのもの」であること。
    // ラップして返すと、呼び出し側が握った参照と別物になり
    // 片方への書き込みがもう片方に見えない事故が起きうる。
    expect(safeLocalStorage()).toBe(ls);
  });

  it('localStorage が無い環境では null（Node / SSR）', async () => {
    const safeLocalStorage = await loadSafeStorage();
    delete (globalThis as any).localStorage;

    expect(legacySafeStorage()).toBeNull();
    expect(safeLocalStorage()).toBeNull();
  });

  it('参照した瞬間に例外が飛ぶ環境でも投げずに null（プライベートブラウズ）', async () => {
    const safeLocalStorage = await loadSafeStorage();
    installThrowingStorage();

    // まず「本当に投げる環境」を作れているかを確かめる。
    // ここが投げないなら、このテストは何も検証していないことになる。
    expect(() => (globalThis as any).localStorage).toThrow();

    expect(legacySafeStorage()).toBeNull();
    expect(() => safeLocalStorage()).not.toThrow();
    expect(safeLocalStorage()).toBeNull();
  });

  it('getItem を持たない偽物は受け取らない', async () => {
    const safeLocalStorage = await loadSafeStorage();
    for (const fake of [
      {},
      { getItem: 'not a function' },
      { getItem: 123 },
      { setItem: () => {} },
      [],
    ]) {
      install(fake);
      expect(legacySafeStorage()).toBeNull();
      expect(safeLocalStorage(), `${JSON.stringify(fake)} を通してしまっている`).toBeNull();
    }
  });

  it('null / undefined / プリミティブでも null', async () => {
    const safeLocalStorage = await loadSafeStorage();
    for (const value of [null, undefined, 0, '', false, 'localStorage']) {
      install(value);
      expect(legacySafeStorage()).toBeNull();
      expect(safeLocalStorage(), `${String(value)} を通してしまっている`).toBeNull();
    }
  });

  it('毎回その時点の globalThis を見る（値をキャッシュしない）', async () => {
    const safeLocalStorage = await loadSafeStorage();

    // 集約でモジュール先頭の定数に固めてしまうと、
    // 「起動時は無かったが後から生えた」ケースを取りこぼす。
    // テスト側で localStorage を差し替える既存テストも壊れる。
    delete (globalThis as any).localStorage;
    expect(safeLocalStorage()).toBeNull();

    const first = makeStorage();
    install(first);
    expect(safeLocalStorage()).toBe(first);

    const second = makeStorage();
    install(second);
    expect(safeLocalStorage()).toBe(second);

    delete (globalThis as any).localStorage;
    expect(safeLocalStorage()).toBeNull();
  });
});

describe('集約後も4つの利用側モジュールが同じように動く', () => {
  it('お知らせの既読は保存・読み出しできる（updateNotices）', async () => {
    install(makeStorage());
    const { loadReadIds, markAllNoticesRead, unreadNoticeCount } = await import(
      '../src/utils/updateNotices'
    );
    const { UPDATE_NOTICES } = await import('../src/data/updateNotices');

    expect(loadReadIds().size).toBe(0);
    markAllNoticesRead();
    expect(loadReadIds().size).toBe(UPDATE_NOTICES.length);
    expect(unreadNoticeCount()).toBe(0);
  });

  it('localStorage が使えなくてもお知らせ機能は例外を投げない（updateNotices）', async () => {
    installThrowingStorage();
    const { loadReadIds, markAllNoticesRead, unreadNoticeCount } = await import(
      '../src/utils/updateNotices'
    );

    expect(() => markAllNoticesRead()).not.toThrow();
    expect(loadReadIds().size).toBe(0);
    // 保存できない環境では「毎回未読のまま」＝バッジが出るだけ。機能は壊れない。
    expect(unreadNoticeCount()).toBeGreaterThan(0);
  });

  it('進捗の記録・読み出しができる（progress）', async () => {
    install(makeStorage());
    const { markProblemSolved, readSolvedMap, problemKey } = await import('../src/utils/progress');

    expect(readSolvedMap('guest')).toEqual({});
    expect(markProblemSolved('guest', 'ch1', 'q1', 5)).toBe(true);
    expect(readSolvedMap('guest')[problemKey('ch1', 'q1')]).toBeGreaterThan(0);
    // 同じ大問の2回目は「新規」ではない
    expect(markProblemSolved('guest', 'ch1', 'q1', 5)).toBe(false);
  });

  it('localStorage が使えなくても進捗処理は例外を投げない（progress）', async () => {
    installThrowingStorage();
    const { markProblemSolved, readSolvedMap } = await import('../src/utils/progress');

    expect(() => readSolvedMap('guest')).not.toThrow();
    expect(readSolvedMap('guest')).toEqual({});
    expect(() => markProblemSolved('guest', 'ch1', 'q1', 5)).not.toThrow();
  });

  it('フィードバック再送キューが読める（feedback）', async () => {
    install(makeStorage());
    const { readFeedbackQueue } = await import('../src/utils/feedback');
    expect(readFeedbackQueue()).toEqual([]);
  });

  it('localStorage が使えなくても再送キューは例外を投げない（feedback）', async () => {
    installThrowingStorage();
    const { readFeedbackQueue } = await import('../src/utils/feedback');
    expect(() => readFeedbackQueue()).not.toThrow();
    expect(readFeedbackQueue()).toEqual([]);
  });
});
