import { describe, it, expect } from 'vitest';
import {
  bgmFadeFactor,
  bgmVolumeAt,
  isBgmFadeComplete,
  BGM_AUTO_FADE_ENABLED,
  BGM_FADE_START_MS,
  BGM_FADE_DURATION_MS,
  BGM_FADE_END_MS,
} from '../src/utils/bgmFade';

/**
 * ===================================================================
 * BGM が「勝手に切れない」ことの検査
 * ===================================================================
 *
 * ■ 経緯（要件が反転した）
 *   以前は「ONのままでも90秒で自然に消える」を仕様にしていた。
 *   その後、利用者から
 *     > BGMが自動で切れるのはオフにして
 *   と指示があった。鳴らすか止めるかはヘッダーのボタンで 1 タップで
 *   決められるので、アプリ側が勝手に判断する必要は無い。
 *
 * ■ なぜテストにできるのか
 *   音を鳴らす部分はブラウザが無いと確かめられないが、
 *     「鳴り始めてから何ミリ秒経ったか → 音量をどれだけにするか」
 *   という対応だけは音源と無関係に決まる。
 *   ここを純粋関数として切り出したので、ブラウザを開かずに検査できる。
 *
 * ■ 何を守っているか
 *   ・自動フェードのスイッチが OFF である（★ここが本体★）
 *   ・OFF のとき、どれだけ時間が経っても音量は下がらず、止まる判定も出ない
 *   ・利用者が設定した音量を勝手に上げない（倍率をかけるだけ）
 *   ・計算式そのものは残っている（スイッチを戻せば 90秒+5秒 で動く）
 */

describe('★BGM は自動で切れない★', () => {
  it('自動フェードのスイッチは OFF', () => {
    // ご指示「BGMが自動で切れるのはオフにして」を数値で固定する。
    // 誰かが気軽に true に戻したらここが落ちる。
    expect(BGM_AUTO_FADE_ENABLED).toBe(false);
  });

  it('どれだけ時間が経っても音量は下がらない', () => {
    // 以前は 90 秒で下がり始め 95 秒で 0 になっていた。その時刻を含めて全部 1。
    for (const ms of [0, 1_000, 60_000, 89_999, 90_000, 92_500, 95_000, 95_001, 600_000, 3_600_000]) {
      expect(bgmFadeFactor(ms), `${ms}ms で音量が下がっています`).toBe(1);
    }
  });

  it('どれだけ時間が経っても「止める」判定にならない', () => {
    // 止める判定が出ると App 側が audio.pause() を呼ぶ＝勝手に切れる。
    for (const ms of [0, 94_999, 95_000, 200_000, 3_600_000]) {
      expect(isBgmFadeComplete(ms), `${ms}ms で止まる判定になっています`).toBe(false);
    }
  });

  it('経過時間が壊れた値でも音量を下げない・止めない', () => {
    // ★分からないときに音を消すと「鳴らないアプリ」になる。★
    expect(bgmFadeFactor(Number.NaN)).toBe(1);
    expect(bgmFadeFactor(Number.POSITIVE_INFINITY)).toBe(1);
    expect(bgmFadeFactor(-1)).toBe(1);
    expect(isBgmFadeComplete(Number.NaN)).toBe(false);
  });
});

describe('利用者が決めた音量との関係', () => {
  it('設定した音量に倍率をかけるだけ（勝手に上げない・下げない）', () => {
    expect(bgmVolumeAt(0.5, 0)).toBeCloseTo(0.5, 5);
    // 以前は 92.5 秒で半分・95 秒で 0 になっていた。いまは変わらない。
    expect(bgmVolumeAt(0.5, 92_500)).toBeCloseTo(0.5, 5);
    expect(bgmVolumeAt(0.5, 95_000)).toBeCloseTo(0.5, 5);
  });

  it('音量0にしている人は最初から0のまま（勝手に鳴らさない）', () => {
    expect(bgmVolumeAt(0, 0)).toBe(0);
    expect(bgmVolumeAt(0, 50_000)).toBe(0);
  });

  it('音量は 0〜1 に収める（範囲外の設定値でも壊れない）', () => {
    expect(bgmVolumeAt(1.5, 0)).toBe(1);
    expect(bgmVolumeAt(-0.2, 0)).toBe(0);
    expect(bgmVolumeAt(Number.NaN, 0)).toBe(0);
  });
});

describe('計算式そのものは残してある（スイッチを戻せば使える）', () => {
  it('90秒＋5秒 という時間設定は変えていない', () => {
    // スイッチで止めているだけで、式と定数は消していない。
    // 後で「やっぱり自動で消したい」となったとき 1 行で戻せる。
    expect(BGM_FADE_START_MS).toBe(90_000);
    expect(BGM_FADE_DURATION_MS).toBe(5_000);
    expect(BGM_FADE_END_MS).toBe(95_000);
  });
});
