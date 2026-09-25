/**
 * ===================================================================
 * sfxSamples — 対戦用の効果音ファイル（public/sfx/battle/*.mp3）を鳴らす
 * ===================================================================
 *
 * ■ 音源について
 *   scripts/sfx/gen_battle_sfx.py が numpy で一から合成したオリジナル音。
 *   外部素材を使っていないので商用利用可（public/sfx/battle/LICENSE_SFX.md）。
 *
 * ■ 読み込み方
 *   ・最初に鳴らそうとした時点（＝ユーザー操作の後）で全部をまとめて先読みする。
 *     合計 約430KB・26ファイル。1ファイルずつ decode するので失敗しても他は使える。
 *   ・まだ読み込めていない／読み込みに失敗した音は false を返す。
 *     呼び出し側はそのとき従来の WebAudio 合成音で鳴らす（無音にはならない）。
 *
 * ■ AudioContext ごとにキャッシュを持つ
 *   対戦エンジン（battleAudio.ts）と報酬演出（ui/feedback.ts）は別々の
 *   AudioContext を使っているため、コンテキスト単位で decode 結果を保持する。
 */

export const SAMPLE_SFX = [
  'tap', 'tick', 'correct', 'wrong', 'timeup',
  'opponent-answered', 'opponent-correct', 'combo', 'overtake', 'overtaken', 'caught-up',
  'matched', 'countdown', 'start', 'hurry', 'final',
  'win', 'lose', 'draw',
  'levelup', 'rankup', 'badge', 'coin', 'chest', 'jackpot', 'gacha',
] as const;

export type SampleSfx = (typeof SAMPLE_SFX)[number];

const BASE = '/sfx/battle/';

export function sampleUrl(name: SampleSfx): string {
  return `${BASE}${name}.mp3`;
}

export function isSampleSfx(name: string): name is SampleSfx {
  return (SAMPLE_SFX as readonly string[]).includes(name);
}

/** 読み込み中の残り件数（全部終わったら、足りない分を次に読み直せるようにする） */
const pendingCount = new WeakMap<BaseAudioContext, number>();

type Cache = { buffers: Map<SampleSfx, AudioBuffer>; loading: boolean };
const caches = new WeakMap<BaseAudioContext, Cache>();

function cacheFor(ctx: BaseAudioContext): Cache {
  let c = caches.get(ctx);
  if (!c) {
    c = { buffers: new Map(), loading: false };
    caches.set(ctx, c);
  }
  return c;
}

/** 全効果音を先読みする（2回目以降は何もしない） */
export function preloadSamples(ctx: BaseAudioContext): void {
  const c = cacheFor(ctx);
  if (c.loading || typeof fetch !== 'function') return;
  c.loading = true;
  const missing = SAMPLE_SFX.filter((n) => !c.buffers.has(n));
  pendingCount.set(ctx, missing.length);
  for (const name of missing) {
    void fetch(sampleUrl(name))
      .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error(String(r.status)))))
      .then((buf) => ctx.decodeAudioData(buf))
      .then((ab) => {
        c.buffers.set(name, ab);
      })
      .catch(() => {
        /* 読み込めなければ合成音で鳴る */
      })
      .finally(() => {
        // ★1つでも読めなかったら、あとで読み直せるようにする★
        //   最初の読み込みが圏外・通信の瞬断と重なると、以前はそのまま
        //   その端末ではずっと合成音になっていた。次に鳴らすときにもう一度読む。
        if (SAMPLE_SFX.every((n) => c.buffers.has(n))) return;
        pendingCount.set(ctx, (pendingCount.get(ctx) ?? 1) - 1);
        if ((pendingCount.get(ctx) ?? 0) <= 0) {
          pendingCount.delete(ctx);
          c.loading = false;
        }
      });
  }
}

/**
 * 読み込み済みなら鳴らして true。まだなら先読みを始めて false。
 * @param gain 0〜1。ファイル側で音量差はつけてあるので通常は 1
 */
export function playSample(ctx: AudioContext, out: AudioNode, name: string, gain = 1): boolean {
  if (!isSampleSfx(name)) return false;
  const c = cacheFor(ctx);
  const buf = c.buffers.get(name);
  if (!buf) {
    preloadSamples(ctx);
    return false;
  }
  try {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    if (gain !== 1) {
      const g = ctx.createGain();
      g.gain.value = gain;
      src.connect(g).connect(out);
    } else {
      src.connect(out);
    }
    src.start();
    return true;
  } catch {
    return false;
  }
}
