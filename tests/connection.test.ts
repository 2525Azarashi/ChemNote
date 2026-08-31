/**
 * ===================================================================
 * connection（通信の途切れ・復帰）の試験
 * ===================================================================
 *
 * ★試験で固める理由★
 * 圏外・アプリの切り替え・画面消灯は、開発中の手元ではまず再現しない。
 * だが実際の利用（電車、休み時間、通知）では必ず起きる。
 * 「電車に乗って確かめる」ことはできないので、
 * 起こりうる状況をここに全部書き出して固定する。
 */

import { describe, expect, it } from 'vitest';

import {
  SUSPEND_GAP_MS,
  canSubmitAnswer,
  didSuspend,
  offlineNotice,
  resumeNotice,
} from '../src/battle/core/connection';

// ============================================================
// 解答して良いか
// ============================================================

describe('canSubmitAnswer', () => {
  it('通信できていて、未回答で、時間が残っていれば送れる', () => {
    expect(
      canSubmitAnswer({ connection: 'online', remainMs: 3000, answered: false }),
    ).toBe(true);
  });

  it('★圏外では送らせない（送ると「答えたのに消える」が起きる）★', () => {
    // Firestore は圏外でも書き込みを受け取り、画面は解答済みになる。
    // だが実際に送られるのは通信が戻ってからで、
    // その時点では締切を過ぎているのでルールに拒否される。
    // 最初から押せないと伝えた方が誠実である。
    expect(
      canSubmitAnswer({ connection: 'offline', remainMs: 8000, answered: false }),
    ).toBe(false);
  });

  it('すでに答えていれば送らない', () => {
    expect(
      canSubmitAnswer({ connection: 'online', remainMs: 3000, answered: true }),
    ).toBe(false);
  });

  it('締切を過ぎていれば送らない', () => {
    expect(
      canSubmitAnswer({ connection: 'online', remainMs: 0, answered: false }),
    ).toBe(false);
  });

  it('★残り時間が負でも送らない（時計が飛んだ場合）★', () => {
    expect(
      canSubmitAnswer({ connection: 'online', remainMs: -500, answered: false }),
    ).toBe(false);
  });
});

// ============================================================
// 休止の判定
// ============================================================

describe('didSuspend', () => {
  it('タイマーが普通に動いている間は休止とみなさない', () => {
    expect(didSuspend(1000, 1200)).toBe(false);
  });

  it('★少し詰まった程度では休止とみなさない（毎回警告が出ると邪魔）★', () => {
    expect(didSuspend(1000, 1000 + SUSPEND_GAP_MS - 1)).toBe(false);
  });

  it('★大きく飛んだら休止とみなす（画面消灯・別アプリ）★', () => {
    expect(didSuspend(1000, 1000 + SUSPEND_GAP_MS)).toBe(true);
    expect(didSuspend(1000, 1000 + 60_000)).toBe(true);
  });

  it('時刻が巻き戻っていても壊れない', () => {
    expect(didSuspend(5000, 1000)).toBe(false);
  });

  it('おかしな値では休止と言わない', () => {
    expect(didSuspend(NaN, 1000)).toBe(false);
    expect(didSuspend(1000, NaN)).toBe(false);
  });
});

// ============================================================
// 復帰時に伝えること
// ============================================================

describe('resumeNotice', () => {
  it('休止していなければ何も言わない', () => {
    expect(
      resumeNotice({ suspended: false, indexChanged: true, finished: true }),
    ).toBeNull();
  });

  it('★離れている間に終わっていたら、そう伝える★', () => {
    const msg = resumeNotice({ suspended: true, indexChanged: true, finished: true });
    expect(msg).toContain('終了');
  });

  it('★離れている間に問題が進んだら、無回答が0点になることまで伝える★', () => {
    // 「進みました」だけだと、なぜ点が入っていないのか分からない。
    const msg = resumeNotice({ suspended: true, indexChanged: true, finished: false });
    expect(msg).toContain('進みました');
    expect(msg).toContain('0点');
  });

  it('同じ問題のままなら、戻ったことだけ伝える', () => {
    const msg = resumeNotice({ suspended: true, indexChanged: false, finished: false });
    expect(msg).toBe('対戦に戻りました。');
  });

  it('★終了の知らせが問題進行の知らせより優先される★', () => {
    // 両方起きているとき、利用者にとって重要なのは「終わった」こと。
    const msg = resumeNotice({ suspended: true, indexChanged: true, finished: true });
    expect(msg).not.toContain('0点');
  });
});

// ============================================================
// 圏外の知らせ
// ============================================================

describe('offlineNotice', () => {
  it('繋がっていれば何も言わない', () => {
    expect(offlineNotice({ connection: 'online', playing: true })).toBeNull();
  });

  it('★試合中に切れたら伝える★', () => {
    const msg = offlineNotice({ connection: 'offline', playing: true });
    expect(msg).toContain('通信が切れています');
    // 「解答できない」ことと「無回答になる」ことの両方を伝える必要がある。
    expect(msg).toContain('解答できません');
    expect(msg).toContain('無回答');
  });

  it('試合中でなければ出さない（待機・結果画面では邪魔になるだけ）', () => {
    expect(offlineNotice({ connection: 'offline', playing: false })).toBeNull();
  });
});
