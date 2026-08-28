import { describe, it, expect } from 'vitest';
import {
  bgmFadeFactor,
  bgmVolumeAt,
  isBgmFadeComplete,
  BGM_FADE_START_MS,
  BGM_FADE_DURATION_MS,
  BGM_FADE_END_MS,
} from '../src/utils/bgmFade';

/**
 * ===================================================================
 * BGM が「ONのままでも90秒で自然に消える」ことの検査
 * ===================================================================
 *
 * ■ なぜテストにできるのか
 *   音を鳴らす部分はブラウザが無いと確かめられないが、
 *     「鳴り始めてから何ミリ秒経ったか → 音量をどれだけにするか」
 *   という対応だけは音源と無関係に決まる。
 *   ここを純粋関数として切り出したので、
 *   ★ブラウザを開かずに検査できる。★
 *
 * ■ 何を守っているか
 *   ・90秒までは音量を勝手に下げない（急に小さくなったら不具合に見える）
 *   ・90秒を過ぎたら下がり始める
 *   ・95秒で完全に0になり、そこで再生を止める判定になる
 *   ・利用者が設定した音量を勝手に上げない（倍率をかけるだけ）
 */

describe('BGM のフェードアウト', () => {
  it('90秒＋5秒 という時間設定になっている', () => {
    // 指摘いただいた「90秒」を数字として固定する。
    // 誰かが気軽に変えたらここが落ちる。
    expect(BGM_FADE_START_MS).toBe(90_000);
    expect(BGM_FADE_DURATION_MS).toBe(5_000);
    expect(BGM_FADE_END_MS).toBe(95_000);
  });

  it('鳴り始めから90秒までは音量を下げない', () => {
    // ★ここを下げてしまうと「だんだん小さくなる不具合」に見える。★
    expect(bgmFadeFactor(0)).toBe(1);
    expect(bgmFadeFactor(1_000)).toBe(1);
    expect(bgmFadeFactor(60_000)).toBe(1);
    expect(bgmFadeFactor(89_999)).toBe(1);
    expect(bgmFadeFactor(90_000)).toBe(1);
  });

  it('90秒を過ぎると下がり始め、95秒でちょうど0になる', () => {
    // 途中の値も確認する。「端だけ合っている」実装を通さないため。
    expect(bgmFadeFactor(91_250)).toBeCloseTo(0.75, 5);
    expect(bgmFadeFactor(92_500)).toBeCloseTo(0.5, 5);
    expect(bgmFadeFactor(93_750)).toBeCloseTo(0.25, 5);
    expect(bgmFadeFactor(95_000)).toBe(0);
  });

  it('95秒より後はずっと0のまま（音が復活しない）', () => {
    // 画面を移動しただけで鳴り直したら「消えた」ことにならない。
    expect(bgmFadeFactor(95_001)).toBe(0);
    expect(bgmFadeFactor(600_000)).toBe(0);
  });

  it('倍率は必ず0以上1以下（音が大きくならない）', () => {
    for (let ms = 0; ms <= 120_000; ms += 137) {
      const f = bgmFadeFactor(ms);
      expect(f).toBeGreaterThanOrEqual(0);
      expect(f).toBeLessThanOrEqual(1);
    }
  });

  it('時間が単調に増えると音量は単調に減る（途中で上がらない）', () => {
    // 「だんだん小さくなる」以外の動きをしないことを確認する。
    let prev = bgmFadeFactor(0);
    for (let ms = 0; ms <= 120_000; ms += 250) {
      const f = bgmFadeFactor(ms);
      expect(f).toBeLessThanOrEqual(prev + 1e-9);
      prev = f;
    }
  });

  it('経過時間が壊れた値のときは音量を下げない（勝手に消さない）', () => {
    // ★分からないときに音を消すと「鳴らないアプリ」になる。★
    // 分からないときは今までどおり鳴らす方が安全。
    expect(bgmFadeFactor(Number.NaN)).toBe(1);
    expect(bgmFadeFactor(Number.POSITIVE_INFINITY)).toBe(1);
    expect(isBgmFadeComplete(Number.NaN)).toBe(false);
  });

  it('負の時間でも音量は下げない', () => {
    expect(bgmFadeFactor(-1)).toBe(1);
    expect(bgmFadeFactor(-100_000)).toBe(1);
  });
});

describe('「もう鳴らしてはいけない」の判定', () => {
  it('95秒を過ぎたら完了になる', () => {
    expect(isBgmFadeComplete(94_999)).toBe(false);
    expect(isBgmFadeComplete(95_000)).toBe(true);
    expect(isBgmFadeComplete(200_000)).toBe(true);
  });

  it('音量0のまま再生を続けないための判定である（0になる時刻と一致する）', () => {
    /*
      音量が0になっても再生を続けると、
      電池を削り、端末の「再生中の音楽」を占有し続けてしまう
      （他アプリの音楽が戻らない）。
      だから「0になった時刻」と「止める時刻」は必ず一致させる。
    */
    expect(bgmFadeFactor(BGM_FADE_END_MS)).toBe(0);
    expect(isBgmFadeComplete(BGM_FADE_END_MS)).toBe(true);
  });
});

describe('利用者が決めた音量との関係', () => {
  it('設定した音量に倍率をかけるだけ（勝手に上げない）', () => {
    expect(bgmVolumeAt(0.5, 0)).toBeCloseTo(0.5, 5);
    expect(bgmVolumeAt(0.5, 92_500)).toBeCloseTo(0.25, 5);
    expect(bgmVolumeAt(0.5, 95_000)).toBe(0);
  });

  it('音量0にしている人は最初から0のまま（勝手に鳴らさない）', () => {
    expect(bgmVolumeAt(0, 0)).toBe(0);
    expect(bgmVolumeAt(0, 60_000)).toBe(0);
  });

  it('範囲外の音量が来ても0〜1に収める', () => {
    expect(bgmVolumeAt(5, 0)).toBe(1);
    expect(bgmVolumeAt(-3, 0)).toBe(0);
    expect(bgmVolumeAt(Number.NaN, 0)).toBe(0);
  });
});
