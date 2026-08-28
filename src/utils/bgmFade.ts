/*
  ===== BGM のフェードアウト（純粋関数だけを置く） =====

  ■ なぜ「90秒で消える」必要があるのか
    BGM を ON にした人でも、鳴り続けることを望んでいるとは限らない。
    ・最初の数十秒は「始めた感」が出て気分が乗る
    ・そのあとは問題文を読む作業に入るので、音は邪魔になる
    という使い方が普通で、実際に「途中で止めたいのに設定画面まで
    戻るのが面倒」という手間が発生する。
    そこで ★ON のままでも一定時間で自然に消える★ ようにする。
    「消える」＝一時停止であり、機能を消したわけではない。
    次にアプリを開いた（または ON に入れ直した）ときにはまた鳴る。

  ■ なぜ「純粋関数」に切り出すのか
    音量を時間で変える処理は、実際の <audio> を触らないと
    確かめられないと思われがちだが、
      「経過ミリ秒 → 音量の倍率」
    という対応だけは音源と無関係に決まる。
    ここだけ切り出しておけば、
    ★ブラウザを起動しなくても機械検査できる★（tests/bgmFade.test.ts）。
    App.tsx 側に埋め込むと、この計算は目視でしか確認できなくなる。

  ■ 時間の決め方
    ・FADE_START … 鳴り始めてから 90 秒。指摘どおりの値。
    ・FADE_DURATION … 5 秒かけて絞る。
      いきなり 0 にすると「音が切れた＝壊れた」と受け取られるため、
      気づかないうちに消えている状態を作る。
*/

/** 鳴り始めてからフェードを開始するまでの時間（ミリ秒） */
export const BGM_FADE_START_MS = 90_000;

/** フェードにかける時間（ミリ秒）。この時間の終わりに音量 0 になる。 */
export const BGM_FADE_DURATION_MS = 5_000;

/** フェード完了までの合計時間（ミリ秒）。 */
export const BGM_FADE_END_MS = BGM_FADE_START_MS + BGM_FADE_DURATION_MS;

/**
 * 鳴り始めからの経過時間に対する「音量の倍率」を返す（0〜1）。
 *
 * ・90 秒までは 1（＝設定した音量そのまま）
 * ・90〜95 秒は 1 → 0 へ直線的に下がる
 * ・95 秒以降は 0
 *
 * 経過時間が数値として壊れている場合（NaN 等）は 1 を返す。
 * ★分からないときに勝手に音を消さない★ のが安全側だから。
 */
export function bgmFadeFactor(elapsedMs: number): number {
  if (!Number.isFinite(elapsedMs)) return 1;
  if (elapsedMs <= BGM_FADE_START_MS) return 1;
  const passed = elapsedMs - BGM_FADE_START_MS;
  if (passed >= BGM_FADE_DURATION_MS) return 0;
  const factor = 1 - passed / BGM_FADE_DURATION_MS;
  // 浮動小数の誤差で 1 を超えたり負になったりしないよう挟む。
  return Math.min(1, Math.max(0, factor));
}

/**
 * フェードが完了しているか（＝もう鳴らしてはいけない状態か）。
 *
 * 音量が 0 になっただけで再生を続けると、
 * 端末のバッテリーを削り、他アプリの音楽再生を奪ったままになる。
 * これが true になったら一時停止する。
 */
export function isBgmFadeComplete(elapsedMs: number): boolean {
  if (!Number.isFinite(elapsedMs)) return false;
  return elapsedMs >= BGM_FADE_END_MS;
}

/**
 * 実際に <audio> へ設定する音量を求める。
 *
 * baseVolume は利用者が設定画面で決めた音量。
 * ★倍率をかけるだけ★なので、音量 0 の人は 0 のまま（勝手に上げない）。
 */
export function bgmVolumeAt(baseVolume: number, elapsedMs: number): number {
  const base = Number.isFinite(baseVolume) ? Math.min(1, Math.max(0, baseVolume)) : 0;
  return base * bgmFadeFactor(elapsedMs);
}
