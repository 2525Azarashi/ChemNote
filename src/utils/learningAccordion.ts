/**
 * ===================================================================
 * まとめプリント内の「💡 解答を表示」折りたたみを整える
 * ===================================================================
 *
 * ■ なぜ必要か
 *   section_*.ts の HTML は自動生成された「原稿」であり、直接書き換えない
 *   運用になっている。そのため折りたたみの見出し文字が
 *     「💡 解答を表示」「💡 解答と解説を表示」「💡 解答・解説を表示」
 *     「💡 6ステップの解説を表示」
 *   と4種類に散らばっていて、
 *     - 押せる場所（タップ領域）が細く、スマホで開きにくい
 *     - 開いているのか閉じているのかが一目で分からない
 *     - クリック音（useGlobalClickSound）が鳴らない
 *   といった使いにくさが残っていた。
 *
 * ■ 方針
 *   原稿ファイルには手を入れず、**描画直前に HTML を正規化**する。
 *   ここで付けたクラスに対して globalCss.ts 側でデザインを当てるため、
 *   原稿が増えても（新しい section_*.ts を追加しても）自動で同じ見た目になる。
 *
 * ■ 出力する構造
 *   <details class="lc-ans">
 *     <summary class="lc-ans-sum cursor-pointer">
 *       <span class="lc-ans-ico">💡</span>
 *       <span class="lc-ans-txt">解答・解説</span>
 *       <span class="lc-ans-hint"></span>   ← 開/閉の文言は CSS の content で出す
 *     </summary>
 *     …解答本体…
 *   </details>
 *
 *   `cursor-pointer` を付けているのは意図的で、
 *   useGlobalClickSound が `.cursor-pointer` を対象にしているため、
 *   これだけで「解答を開いたときにもクリック音が鳴る」ようになる。
 */

/** summary の中身（タグ込み）から、表示用のラベル文字列を作る */
export function toAnswerLabel(rawSummaryInner: string): string {
  const text = rawSummaryInner
    // タグを除去
    .replace(/<[^>]+>/g, '')
    // 実体参照のうち、ラベルに現れうるものだけ戻す
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    // 先頭の絵文字・記号（💡▼▶など）と空白を除去
    .replace(/^[\s\u{1F300}-\u{1FAFF}\u{2190}-\u{27BF}\u{FE0F}]+/u, '')
    .replace(/\s+/g, ' ')
    .trim()
    // 末尾の「を表示」「を見る」は不要（開閉状態は別に出すため）
    .replace(/(を表示|を見る|をひらく|を開く)$/u, '')
    .trim();

  if (!text) return '解答';
  // 「解答と解説」「解答・解説」は同じ意味なので中黒に寄せる
  return text.replace(/^解答(と|および)解説$/u, '解答・解説');
}

/**
 * 学習コンテンツHTMLの <details>/<summary> を正規化する。
 * 副作用なし・純粋関数なので、useMemo でキャッシュして使う。
 *
 * @param openAll true なら全ての <details> に open 属性を付けて返す。
 *   「解答をすべて表示」は DOM を直接触る（d.open = true）実装だと、
 *   React の再レンダリングで innerHTML が貼り直された瞬間に open が
 *   失われてしまう（ラベルだけ変わって実際は開かない）。
 *   そのため *HTML 文字列そのものに open を埋め込む* 方式にしている。
 */
export function normalizeAnswerAccordions(html: string, openAll = false): string {
  if (!html) return html;

  const openAttr = openAll ? ' open' : '';

  // 1) <details> に共通クラスを付与（既存の class があれば残す）。
  //    原稿側に open が書かれていても、状態は openAll に一本化する。
  let out = html.replace(/<details(\s[^>]*)?>/g, (_m, attrs: string | undefined) => {
    const a = (attrs || '').replace(/\sopen(?==|\b)(="[^"]*")?/g, '');
    if (/\sclass\s*=/.test(a)) {
      return `<details${a.replace(/class\s*=\s*"([^"]*)"/, (_c, v: string) => `class="${v} lc-ans"`)}${openAttr}>`;
    }
    return `<details${a} class="lc-ans"${openAttr}>`;
  });

  // 2) <summary> をボタン風の構造に置き換え
  out = out.replace(/<summary(?:\s[^>]*)?>([\s\S]*?)<\/summary>/g, (_m, inner: string) => {
    const label = toAnswerLabel(inner);
    return (
      '<summary class="lc-ans-sum cursor-pointer">' +
      '<span class="lc-ans-ico" aria-hidden="true">💡</span>' +
      `<span class="lc-ans-txt">${label}</span>` +
      '<span class="lc-ans-hint" aria-hidden="true"></span>' +
      '</summary>'
    );
  });

  return out;
}

/** HTML内の折りたたみ（＝解答）の個数を数える。「すべて開く」ボタンの出し分けに使う */
export function countAnswerAccordions(html: string): number {
  if (!html) return 0;
  return (html.match(/<details/g) || []).length;
}
