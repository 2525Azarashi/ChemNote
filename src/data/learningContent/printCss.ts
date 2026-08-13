/**
 * ===================================================================
 * まとめプリントの印刷（PDF書き出し）用スタイル
 * ===================================================================
 *
 * ■ 何をするCSSか
 *   ブラウザの「印刷」ダイアログ（＝PDFとして保存）で、まとめプリントが
 *   そのまま配布可能な紙面になるようにする。画面用のデザインは
 *   globalCss.ts の LEARNING_GLOBAL_CSS が持っており、こちらは
 *   `@media print` の中だけで上書きするので、画面表示には一切影響しない。
 *
 * ■ 設計方針
 *   1. 画面のためのUIは全部消す
 *      ヘッダー・タブ・戻るボタン・一括開閉ボタン・装飾ブラーなどは
 *      紙には不要なので `.lc-no-print` を付けた要素をまとめて隠す。
 *      （個々のコンポーネントに print 用の分岐を書かずに済む）
 *
 *   2. 解答は「開いた状態」で必ず出す
 *      <details> は閉じていると中身が印刷されない。生徒用（問題のみ）と
 *      指導用（解答つき）を選べるように、印刷モードを body の class で
 *      切り替える方式にした。
 *        .lc-print-answers  … すべての解答を開いて印刷する
 *        .lc-print-blank    … 解答を伏せて印刷する（自習用）
 *
 *   3. 紙の都合に合わせて改ページを制御する
 *      見出しの直後で切れる（見出しだけが前ページに残る）のを防ぎ、
 *      囲み・表・図が途中で分断されないようにする。
 *
 *   4. インクを節約し、白黒でも読めるようにする
 *      背景のグラデーションや色の塗りは落として白地にし、
 *      罫線と太字で階層を表す。`print-color-adjust: exact` は使わない
 *      （プリンタ側の「背景を印刷しない」設定でも崩れないようにするため）。
 *
 * ■ 使い方
 *   LearningViewer が <style> でこのCSSを流し込み、印刷ボタンで
 *   body に印刷モードのクラスを付けてから window.print() を呼ぶ。
 */

/** 印刷モードを表す body のクラス名（TS側と CSS側で取り違えないよう定数化） */
export const PRINT_MODE_CLASS = {
  /** 解答つき（指導用・答え合わせ用） */
  answers: 'lc-print-answers',
  /** 解答を伏せる（自習用・配布用） */
  blank: 'lc-print-blank',
} as const;

export type PrintMode = keyof typeof PRINT_MODE_CLASS;

/** 画面専用のUIに付けるクラス（印刷時に display:none になる） */
export const NO_PRINT_CLASS = 'lc-no-print';

/** 印刷時だけ現れる要素に付けるクラス（表紙の見出しなど） */
export const PRINT_ONLY_CLASS = 'lc-print-only';

// eslint-disable-next-line
export const LEARNING_PRINT_CSS = `
/* 画面表示中は「印刷専用」の要素を隠しておく */
.${PRINT_ONLY_CLASS} { display: none !important; }

@media print {
  /* ---------------------------------------------------------------
     用紙とページ余白
     A4縦。左右の余白はバインダー穴あけを想定して左を少し広く取る。
     --------------------------------------------------------------- */
  @page {
    size: A4 portrait;
    margin: 14mm 12mm 16mm 16mm;
  }

  /* ---------------------------------------------------------------
     全体のリセット：画面用の背景・影・角丸を落として白地にする
     --------------------------------------------------------------- */
  html, body {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
  }
  body {
    /* 紙は 10.5pt 前後が読みやすい。画面の px 指定を上書きする */
    font-size: 10.5pt !important;
    line-height: 1.65 !important;
    color: #000 !important;
  }

  /* 画面専用UI（ヘッダー・タブ・ボタン・装飾）は印刷しない */
  .${NO_PRINT_CLASS},
  .${NO_PRINT_CLASS} * {
    display: none !important;
  }

  /* 印刷専用の要素（プリント表紙の見出しなど）を出す */
  .${PRINT_ONLY_CLASS} { display: block !important; }

  /* ノート紙の罫線・背景ぼかし・赤いバインダー線は紙では邪魔になる */
  .notebook-paper,
  .notebook-paper::before,
  .notebook-paper::after {
    background: #fff !important;
    background-image: none !important;
    box-shadow: none !important;
    border: 0 !important;
  }

  /* sticky / fixed は印刷時に各ページへ焼き付いてしまうので通常配置に戻す */
  .sticky, .fixed {
    position: static !important;
  }

  /* 画面用の最大幅・中央寄せ・左パディングを解除して紙幅を使い切る */
  .learning-print-area {
    max-width: none !important;
    width: 100% !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* ---------------------------------------------------------------
     本文（.learning-content）を紙面用に組み直す
     --------------------------------------------------------------- */
  .learning-content {
    background: #fff !important;
    background-image: none !important;
    border: 0 !important;
    border-left: 0 !important;
    border-radius: 0 !important;
    padding: 0 !important;
    margin: 0 !important;
    line-height: 1.65 !important;
    color: #000 !important;
  }

  /* 2カラムのレイアウトは紙では1カラムに落とす（サイドバーは目次なので残す） */
  .learning-content .layout {
    display: block !important;
    max-width: none !important;
    gap: 0 !important;
  }
  .learning-content .sidebar {
    width: 100% !important;
    float: none !important;
  }
  .learning-content .sidebar-inner {
    position: static !important;
    border: 1pt solid #999 !important;
    background: #fff !important;
    padding: 8pt 10pt !important;
    font-size: 9pt !important;
  }

  /* 見出し：色の帯をやめ、罫線と太字で階層を示す */
  .learning-content h1 {
    font-size: 15pt !important;
    color: #000 !important;
    background: none !important;
    border: 0 !important;
    border-bottom: 2pt solid #000 !important;
    padding: 0 0 4pt !important;
    margin: 0 0 10pt !important;
  }
  .learning-content h2 {
    font-size: 12.5pt !important;
    color: #000 !important;
    background: none !important;
    border: 0 !important;
    border-left: 4pt solid #000 !important;
    border-bottom: 1pt solid #666 !important;
    padding: 2pt 0 3pt 8pt !important;
    margin: 14pt 0 8pt !important;
  }
  .learning-content h3,
  .learning-content h4 {
    font-size: 11pt !important;
    color: #000 !important;
    background: none !important;
    border: 0 !important;
    border-bottom: 1pt dotted #666 !important;
    padding: 0 0 2pt !important;
    margin: 10pt 0 6pt !important;
  }

  /* 見出しがページ末尾で孤立しないようにする */
  .learning-content h1,
  .learning-content h2,
  .learning-content h3,
  .learning-content h4 {
    break-after: avoid-page;
    page-break-after: avoid;
    break-inside: avoid;
  }

  /* 囲み・表・図・式は途中で分断させない */
  .learning-content .box,
  .learning-content .box-point,
  .learning-content .box-example,
  .learning-content .formula,
  .learning-content .reaction,
  .learning-content table,
  .learning-content figure,
  .learning-content .figrow,
  .learning-content .figfull,
  .learning-content .lc-ans {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  /* 囲みは白地＋細罫に。色の塗りはインクを食うので落とす */
  .learning-content .box,
  .learning-content .box-point,
  .learning-content .box-example {
    background: #fff !important;
    background-image: none !important;
    border: 1pt solid #666 !important;
    border-left: 3pt solid #000 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 7pt 9pt !important;
    margin: 8pt 0 !important;
  }

  /* 式・反応式は中央寄せの細枠のまま（読み取りやすさを優先） */
  .learning-content .formula,
  .learning-content .reaction {
    background: #fff !important;
    border: 1pt solid #999 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 5pt 8pt !important;
  }

  /* 表：罫線を必ず出す（背景色は落とす） */
  .learning-content table {
    width: 100% !important;
    border-collapse: collapse !important;
    font-size: 9.5pt !important;
  }
  .learning-content th,
  .learning-content td {
    border: 0.75pt solid #444 !important;
    background: #fff !important;
    padding: 3pt 5pt !important;
    color: #000 !important;
  }
  .learning-content th {
    font-weight: 800 !important;
    border-bottom-width: 1.5pt !important;
  }
  /* 表の見出し行は改ページ後も繰り返す */
  .learning-content thead { display: table-header-group; }
  .learning-content tr { break-inside: avoid; page-break-inside: avoid; }

  /* 図は紙幅に収める。拡大用の当たり判定は不要。
     自作図（インラインSVG）は viewBox で描いてあるので、
     幅だけ紙幅に合わせれば中身は自動で縮尺される。 */
  .learning-content img,
  .learning-content svg {
    max-width: 100% !important;
    height: auto !important;
    cursor: default !important;
  }
  /* 画面では「タップで拡大できます」のバッジを出しているが、紙では無意味 */
  .learning-content .figzoom-hint { display: none !important; }

  /* ---------------------------------------------------------------
     強調表記（紙面）
     ---------------------------------------------------------------
       語句（用語・化学式・数値）
           <strong><u>…</u></strong>              太字 ＋ 太い直線の下線（黒）
       文章（述語をもつ言い切り・説明文）
           <strong><u class="wavy">…</u></strong>  太字 ＋ 太い波線の下線（黒）
       問題文の「下線部」（強調ではない）
           <u class="q">…</u>                     細い直線の下線だけ

     ■ 以前ここが効いていなかった理由
       ① 上の見出し・表・囲みのルールが color:#000 !important を
          広範囲に当てており、強調側には色指定が無かったため、
          線の色（text-decoration-color）が親の色を継承して薄く出ていた。
       ② 波線を dotted（点線）に置き換えていたので、
          「文章＝波線」の区別が紙では消えていた。
       ③ 太さを 1pt にしていたため、A4 に縮小されると
          本文の罫線と見分けがつかなかった。
       → いずれも「語句＝太い直線／文章＝太い波線／どちらも黒」に統一する。

     ■ print-color-adjust は使わない方針だが、下線は「背景」ではなく
       文字装飾なので、プリンタの「背景を印刷しない」設定でも必ず出る。
     --------------------------------------------------------------- */
  .learning-content u:not(.q),
  .learning-content strong u {
    color: #000 !important;
    font-weight: 900 !important;
    text-decoration-color: #000 !important;
    text-decoration-skip-ink: none !important;
    /* 旧ブラウザ向けの保険。border-bottom では波線が出せないので
       あくまで text-decoration を主にする */
    background: none !important;
  }
  /* 語句 ＝ 太字＋太い直線 */
  .learning-content u:not(.wavy):not(.q),
  .learning-content strong u:not(.wavy) {
    text-decoration-line: underline !important;
    text-decoration-style: solid !important;
    text-decoration-thickness: 1.6pt !important;
    text-underline-offset: 2pt !important;
  }
  /* 文章 ＝ 太字＋太い波線 */
  .learning-content u.wavy,
  .learning-content strong u.wavy {
    text-decoration-line: underline !important;
    text-decoration-style: wavy !important;
    text-decoration-thickness: 1.6pt !important;
    text-underline-offset: 2.5pt !important;
  }
  /* 問題文の「下線部」は強調ではないので、細線のみ・太字にしない */
  .learning-content u.q {
    font-weight: normal !important;
    text-decoration-line: underline !important;
    text-decoration-style: solid !important;
    text-decoration-thickness: 0.5pt !important;
    text-decoration-color: #000 !important;
    text-underline-offset: 1.5pt !important;
  }
  /* 強調の中に <sub>/<sup>（化学式の添字）が入っても太字・黒を保つ */
  .learning-content strong u sub,
  .learning-content strong u sup,
  .learning-content u:not(.q) sub,
  .learning-content u:not(.q) sup {
    color: #000 !important;
    font-weight: 900 !important;
  }

  /* 強調：網かけは白黒で潰れるので、下線＋太字に置き換える */
  .learning-content mark {
    background: none !important;
    color: #000 !important;
    font-weight: 900 !important;
    text-decoration: underline !important;
    text-decoration-thickness: 1.6pt !important;
    text-decoration-color: #000 !important;
    padding: 0 !important;
    border-radius: 0 !important;
  }

  /* リンクは紙では下線だけ（URLは出さない：本文が読みにくくなるため） */
  .learning-content a {
    color: #000 !important;
    text-decoration: underline !important;
  }

  /* ---------------------------------------------------------------
     解答アコーディオン（<details class="lc-ans">）の印刷制御
     --------------------------------------------------------------- */
  /* 開閉の▼や「開く/閉じる」のヒント文は紙では意味がないので消す */
  .learning-content .lc-ans-sum::marker,
  .learning-content .lc-ans-sum::-webkit-details-marker { display: none !important; }
  .learning-content .lc-ans-hint { display: none !important; }

  .learning-content .lc-ans {
    border: 1pt solid #666 !important;
    border-left: 3pt solid #000 !important;
    border-radius: 0 !important;
    background: #fff !important;
    margin: 6pt 0 !important;
  }
  .learning-content .lc-ans-sum {
    background: #fff !important;
    color: #000 !important;
    font-weight: 800 !important;
    border-bottom: 0.75pt dotted #666 !important;
    padding: 3pt 6pt !important;
    cursor: default !important;
    list-style: none !important;
  }

  /* --- 解答つきで印刷（指導用） ---
     <details> が閉じていても中身を強制的に見せる。
     details[open] だけに頼ると、原稿側の open 有無に左右されるため
     「子要素を display:block で出す」方式にしている。 */
  body.${PRINT_MODE_CLASS.answers} .learning-content .lc-ans > *:not(summary) {
    display: revert !important;
  }
  body.${PRINT_MODE_CLASS.answers} .learning-content .lc-ans-sum::after {
    content: '（解答）';
    font-size: 8.5pt;
    font-weight: 700;
    margin-left: 4pt;
  }

  /* --- 解答を伏せて印刷（自習・配布用） ---
     見出しだけ残し、中身は出さない。答えを書き込むための余白を確保する。 */
  body.${PRINT_MODE_CLASS.blank} .learning-content .lc-ans > *:not(summary) {
    display: none !important;
  }
  body.${PRINT_MODE_CLASS.blank} .learning-content .lc-ans-sum::after {
    content: '（解答欄）';
    font-size: 8.5pt;
    font-weight: 700;
    margin-left: 4pt;
  }
  body.${PRINT_MODE_CLASS.blank} .learning-content .lc-ans {
    /* 書き込み用の余白 */
    min-height: 22mm;
  }

  /* ---------------------------------------------------------------
     物質量 補講（MolBasicsSection / .mbs-* ）の印刷制御
     本文HTMLではなく React コンポーネントで組んでいるため、
     .learning-content とは別系統のクラス名を持つ。同じ思想で紙面化する。
     --------------------------------------------------------------- */
  .mbs-root {
    background: #fff !important;
    background-image: none !important;
    border: 0 !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0 !important;
    margin: 0 !important;
    color: #000 !important;
  }
  /* 補講内の「戻る」ボタン・一括開閉ツールバーは紙では不要 */
  .mbs-back,
  .mbs-toolbar { display: none !important; }

  .mbs-h3,
  .mbs-header-title {
    color: #000 !important;
    background: none !important;
    border: 0 !important;
    border-bottom: 1.5pt solid #000 !important;
    border-radius: 0 !important;
    break-after: avoid-page;
    page-break-after: avoid;
  }
  .mbs-box,
  .mbs-formula,
  .mbs-ex,
  .mbs-fig,
  .mbs-note-inline,
  .mbs-details {
    break-inside: avoid;
    page-break-inside: avoid;
    background: #fff !important;
    background-image: none !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
  .mbs-mark {
    background: none !important;
    color: #000 !important;
    font-weight: 800 !important;
    border-bottom: 1.5pt solid #000 !important;
  }
  .mbs-details-sum::marker,
  .mbs-details-sum::-webkit-details-marker { display: none !important; }
  .mbs-details-hint { display: none !important; }
  .mbs-details-sum {
    background: #fff !important;
    color: #000 !important;
    cursor: default !important;
    list-style: none !important;
  }
  body.${PRINT_MODE_CLASS.answers} .mbs-details > *:not(summary) {
    display: revert !important;
  }
  body.${PRINT_MODE_CLASS.blank} .mbs-details > *:not(summary) {
    display: none !important;
  }
  body.${PRINT_MODE_CLASS.blank} .mbs-details {
    min-height: 22mm;
  }

  /* ---------------------------------------------------------------
     印刷用の紙のヘッダー（表紙情報）
     --------------------------------------------------------------- */
  .lc-print-head {
    display: block !important;
    border-bottom: 2pt solid #000;
    padding-bottom: 5pt;
    margin-bottom: 10pt;
  }
  .lc-print-head .lc-print-title {
    font-size: 16pt;
    font-weight: 900;
    letter-spacing: 0.04em;
  }
  .lc-print-head .lc-print-sub {
    font-size: 9.5pt;
    font-weight: 700;
    margin-top: 2pt;
  }
  .lc-print-head .lc-print-meta {
    font-size: 8.5pt;
    margin-top: 4pt;
    display: flex;
    gap: 14pt;
  }
  /* 名前・日付の記入欄（配布プリントとして使えるようにする） */
  .lc-print-head .lc-print-field {
    border-bottom: 0.75pt solid #000;
    min-width: 38mm;
    display: inline-block;
  }
}
`;
