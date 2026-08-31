/**
 * ===================================================================
 * serverClock の試験
 * ===================================================================
 *
 * ★この部品を試験で固めておく理由★
 *
 * 端末の時計ずれは「開発中にはまず起きない」不具合である。
 * 手元の端末は時刻が合っているので、壊れていても気付けない。
 * そして実際に起きたときの症状は
 *   ・対戦が始まらない（「許可されていません」と出るだけ）
 *   ・答えたのに解答が消える
 * であり、★利用者も開発者も原因に辿り着けない★。
 *
 * つまり「動かして確かめる」が効かない類の部品なので、
 * 想定する状況を全部ここに書き出して固定する。
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CLOCK_SKEW_WARN_MS,
  MAX_USABLE_ROUND_TRIP_MS,
  OBSERVATION_STALE_MS,
  isClockSkewed,
  observeLowerBound,
  observeRoundTrip,
  resetServerClock,
  serverClockOffsetMs,
  serverNow,
  shouldAdoptObservation,
  toMillis,
} from '../src/battle/core/serverClock';

/** 端末時刻を固定する（試験の再現性のため） */
function freezeLocal(ms: number) {
  vi.spyOn(Date, 'now').mockReturnValue(ms);
}

const LOCAL = 1_700_000_000_000;

beforeEach(() => {
  resetServerClock();
  vi.restoreAllMocks();
});

// ============================================================
// 観測が無いとき
// ============================================================

describe('観測が無いとき', () => {
  it('補正は0で、端末時刻をそのまま返す', () => {
    freezeLocal(LOCAL);
    expect(serverClockOffsetMs()).toBe(0);
    expect(serverNow()).toBe(LOCAL);
  });

  it('★時計ずれの警告を出さない（誤って警告すると混乱させる）★', () => {
    expect(isClockSkewed()).toBe(false);
  });
});

// ============================================================
// 往復観測（本命の経路）
// ============================================================

describe('observeRoundTrip — 自分の書き込みから測る', () => {
  it('時計が合っていれば補正はほぼ0', () => {
    // 送信 → 200ms後に応答。サーバはその中点あたりで刻んだ。
    observeRoundTrip(LOCAL + 100, LOCAL, LOCAL + 200);
    expect(serverClockOffsetMs()).toBe(0);
  });

  it('★端末が2分進んでいる場合、−2分の補正が入る★', () => {
    // 端末時刻 LOCAL のとき、サーバの本当の時刻は LOCAL − 120000。
    const skew = 120_000;
    observeRoundTrip(LOCAL - skew, LOCAL, LOCAL + 200);
    // 中点は LOCAL+100 なので、補正は −(skew+100)
    expect(serverClockOffsetMs()).toBe(-(skew + 100));
  });

  it('★端末が2分遅れている場合、+2分の補正が入る★', () => {
    const skew = 120_000;
    observeRoundTrip(LOCAL + skew, LOCAL, LOCAL + 200);
    expect(serverClockOffsetMs()).toBe(skew - 100);
  });

  it('★serverNow() がサーバ時刻に一致する（これが目的）★', () => {
    const skew = 90_000; // 端末が1分半進んでいる
    freezeLocal(LOCAL);
    observeRoundTrip(LOCAL - skew, LOCAL, LOCAL); // 往復0の理想的な観測
    expect(serverNow()).toBe(LOCAL - skew);
  });

  it('往復が速い観測の方が採用される', () => {
    // まず遅い往復（誤差2000ms）
    observeRoundTrip(LOCAL, LOCAL, LOCAL + 4000);
    const slow = serverClockOffsetMs();
    // 次に速い往復（誤差25ms）。値がずれているので上書きされたか分かる。
    observeRoundTrip(LOCAL + 10_000, LOCAL, LOCAL + 50);
    expect(serverClockOffsetMs()).not.toBe(slow);
    expect(serverClockOffsetMs()).toBe(10_000 - 25);
  });

  it('★遅い往復は良い観測を上書きしない★', () => {
    observeRoundTrip(LOCAL, LOCAL, LOCAL + 50); // 良い観測（誤差25ms）
    const good = serverClockOffsetMs();
    observeRoundTrip(LOCAL + 10_000, LOCAL, LOCAL + 4000); // 悪い観測
    expect(serverClockOffsetMs()).toBe(good);
  });

  it('★極端に遅い往復（上限超え）は完全に捨てる★', () => {
    // 電波が悪いときの往復は中点の誤差が大きすぎて役に立たない。
    observeRoundTrip(LOCAL + 50_000, LOCAL, LOCAL + MAX_USABLE_ROUND_TRIP_MS + 1);
    expect(serverClockOffsetMs()).toBe(0);
  });

  it('負の往復（測定中に時計が飛んだ）は捨てる', () => {
    observeRoundTrip(LOCAL, LOCAL + 500, LOCAL);
    expect(serverClockOffsetMs()).toBe(0);
  });

  it('★おかしな値では状態を壊さない★', () => {
    observeRoundTrip(0, LOCAL, LOCAL + 100);
    observeRoundTrip(-1, LOCAL, LOCAL + 100);
    observeRoundTrip(NaN, LOCAL, LOCAL + 100);
    observeRoundTrip(LOCAL, NaN, LOCAL + 100);
    observeRoundTrip(LOCAL, LOCAL, NaN);
    expect(serverClockOffsetMs()).toBe(0);
  });

  it('★時計が直ったら追従する（古い観測に固執しない）★', () => {
    // 端末が2分進んでいた状態で、とても良い観測を得る
    observeRoundTrip(LOCAL - 120_000, LOCAL, LOCAL + 10);
    expect(serverClockOffsetMs()).toBe(-120_005);

    // その後、端末側で自動時刻合わせが働いてズレが解消した。
    // 新しい観測は誤差が大きい（往復2秒）が、十分に時間が経っているので
    // 採用されなければならない。されないと「直った後もずれ続ける」。
    const later = LOCAL + OBSERVATION_STALE_MS + 1;
    observeRoundTrip(later, later, later + 2000);
    expect(serverClockOffsetMs()).toBe(-1000);
  });
});

// ============================================================
// 下限観測（相手の書き込みが届いたとき）
// ============================================================

describe('observeLowerBound — 届いた書き込みから下限だけ測る', () => {
  it('★大きなずれを最初の1通で見つけられる★', () => {
    // 端末が5分遅れている。相手の書き込みに乗ったサーバ時刻は
    // 端末時刻よりずっと先を指しているので、その差が下限になる。
    freezeLocal(LOCAL);
    observeLowerBound(LOCAL + 300_000, LOCAL);
    expect(serverClockOffsetMs()).toBe(300_000);
    expect(isClockSkewed()).toBe(true);
  });

  it('★推定より下の下限では何もしない（下げると悪化する）★', () => {
    observeRoundTrip(LOCAL + 10_000, LOCAL, LOCAL); // 補正 +10000
    observeLowerBound(LOCAL + 5_000, LOCAL); // 下限は +5000 で、今より低い
    expect(serverClockOffsetMs()).toBe(10_000);
  });

  it('後から往復観測が来たら、そちらで上書きされる', () => {
    observeLowerBound(LOCAL + 300_000, LOCAL);
    observeRoundTrip(LOCAL + 301_000, LOCAL, LOCAL + 40);
    expect(serverClockOffsetMs()).toBe(301_000 - 20);
  });

  it('おかしな値では状態を壊さない', () => {
    observeLowerBound(0, LOCAL);
    observeLowerBound(NaN, LOCAL);
    observeLowerBound(LOCAL, NaN);
    expect(serverClockOffsetMs()).toBe(0);
  });
});

// ============================================================
// 採用判定（いちばん間違えやすい所なので単体で試験する）
// ============================================================

describe('shouldAdoptObservation', () => {
  it('観測が無ければ必ず採用する', () => {
    expect(shouldAdoptObservation(null, { uncertaintyMs: 9999, atMs: LOCAL })).toBe(true);
  });

  it('誤差が小さくなるなら採用する', () => {
    expect(
      shouldAdoptObservation(
        { uncertaintyMs: 500, atMs: LOCAL },
        { uncertaintyMs: 100, atMs: LOCAL + 1000 },
      ),
    ).toBe(true);
  });

  it('誤差が大きくなるだけなら採用しない', () => {
    expect(
      shouldAdoptObservation(
        { uncertaintyMs: 100, atMs: LOCAL },
        { uncertaintyMs: 500, atMs: LOCAL + 1000 },
      ),
    ).toBe(false);
  });

  it('★古くなっていれば誤差が大きくても採用する★', () => {
    expect(
      shouldAdoptObservation(
        { uncertaintyMs: 10, atMs: LOCAL },
        { uncertaintyMs: 5000, atMs: LOCAL + OBSERVATION_STALE_MS },
      ),
    ).toBe(true);
  });

  it('同じ誤差なら新しい方に入れ替える（値を新鮮に保つ）', () => {
    expect(
      shouldAdoptObservation(
        { uncertaintyMs: 100, atMs: LOCAL },
        { uncertaintyMs: 100, atMs: LOCAL + 1000 },
      ),
    ).toBe(true);
  });
});

// ============================================================
// 時計ずれの警告
// ============================================================

describe('isClockSkewed', () => {
  it('閾値未満では警告しない', () => {
    observeRoundTrip(LOCAL + CLOCK_SKEW_WARN_MS - 1_000, LOCAL, LOCAL);
    expect(isClockSkewed()).toBe(false);
  });

  it('★閾値以上で警告する（ここを超えると実際に締切が書けなくなる）★', () => {
    observeRoundTrip(LOCAL + CLOCK_SKEW_WARN_MS + 1_000, LOCAL, LOCAL);
    expect(isClockSkewed()).toBe(true);
  });

  it('遅れている側でも警告する（符号に関係なく実害が出る）', () => {
    observeRoundTrip(LOCAL - CLOCK_SKEW_WARN_MS - 1_000, LOCAL, LOCAL);
    expect(isClockSkewed()).toBe(true);
  });
});

// ============================================================
// toMillis
// ============================================================

describe('toMillis', () => {
  it('Firestore Timestamp 風のものを読める', () => {
    expect(toMillis({ toMillis: () => 12_345 })).toBe(12_345);
  });

  it('Date を読める', () => {
    expect(toMillis(new Date(12_345))).toBe(12_345);
  });

  it('数値を読める', () => {
    expect(toMillis(12_345)).toBe(12_345);
  });

  it('★null / undefined は null を返す（0 にしない）★', () => {
    // 0 を返すと「1970年が締切」になり、残り時間が常に0になる。
    // serverTimestamp() の直後は端末側で null に見える瞬間があるため、
    // ここを取り違えると「開始直後だけ即締切」という症状が出る。
    expect(toMillis(null)).toBeNull();
    expect(toMillis(undefined)).toBeNull();
  });

  it('読めない値は null を返す', () => {
    expect(toMillis('2024-01-01')).toBeNull();
    expect(toMillis({})).toBeNull();
    expect(toMillis(NaN)).toBeNull();
    expect(toMillis(new Date('おかしな日付'))).toBeNull();
  });
});
