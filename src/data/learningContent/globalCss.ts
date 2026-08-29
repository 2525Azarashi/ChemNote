// 化学基礎 まとめプリントの共通スタイル（すべて .learning-content 配下にスコープ済み）
//
// ■ デザイン方針
//   mol チュートリアル（components/MolBasicsSection.tsx の .mbs-* ）と
//   同じ「紫のプリント」デザインに統一している。
//   - 紙面全体：うすい紫のグラデーション＋左に太いアクセント罫
//   - 見出し：紫（塗りつぶしの帯ではなく、罫と色で階層を示す）
//   - 囲み：白いカード＋細い紫罫＋左5pxのアクセント罫
//   - ラベル（📘 Point など）：mol の Tag と同じ「囲み文字」
//   - 式：白地・中央寄せ・角丸の囲み（.mbs-formula 相当）
//
//   既存の HTML（section_*.ts）は自動生成されたもので書き換えられないため、
//   クラス名は一切変更していない。box / box-point / box-example / formula /
//   reaction / wavy / details / ol の全角括弧カウンタなどはすべてそのまま動く。
//
// eslint-disable-next-line
export const LEARNING_GLOBAL_CSS = `.learning-content {
        /* mol チュートリアル（.mbs-root）と同じトークン */
        --lc-accent: #7c3aed;
        --lc-accent-d: #5b21b6;
        --lc-accent-l: #f3ecff;
        --lc-line: #c9bce6;
        --lc-ink: #3f3352;
        font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'Noto Sans JP', sans-serif;
        color: var(--lc-ink);
        background: linear-gradient(180deg, #fbf8ff 0%, #f7f2ff 100%);
        border: 2px solid var(--lc-line);
        border-left: 8px solid var(--lc-accent);
        border-radius: 12px;
        line-height: 1.9;
        margin: 0;
        padding: 18px 18px 22px;
      }
      .learning-content .layout {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        gap: 30px;
        padding: 0;
      }
      .learning-content .sidebar {
        width: 260px;
        flex-shrink: 0;
      }
      .learning-content .sidebar-inner {
        position: sticky;
        top: 20px;
        background: #fff;
        padding: 18px;
        border: 1.6px solid var(--lc-line);
        border-radius: 8px;
        font-size: 0.88em;
      }
      .learning-content .sidebar h3 {
        margin-top: 0;
        font-size: 1em;
        color: var(--lc-accent-d);
        background: none;
        border: 0;
        border-bottom: 2px dotted var(--lc-line);
        padding: 0 0 8px;
      }
      .learning-content .sidebar ul {
        list-style: none;
        padding-left: 0;
        margin: 8px 0;
      }
      .learning-content .sidebar li {
        padding: 4px 0;
      }
      .learning-content .sidebar ul ul {
        padding-left: 14px;
        font-size: 0.9em;
      }
      .learning-content .sidebar a {
        color: var(--lc-ink);
        text-decoration: none;
        display: block;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .learning-content .sidebar a:hover {
        background: var(--lc-accent-l);
        color: var(--lc-accent-d);
      }
      /* 紙面本体：外枠は .learning-content 側が持つので、内側は素の紙にする */
      .learning-content .main-content {
        flex-grow: 1;
        min-width: 0;
        background: transparent;
        padding: 0;
        border: 0;
        border-radius: 0;
      }
      /* ===== 見出し ===== */
      .learning-content h1 {
        text-align: center;
        font-size: 1.6em;
        font-weight: 900;
        color: var(--lc-accent-d);
        background: none;
        border: 0;
        border-bottom: 2px dotted var(--lc-line);
        padding-bottom: 14px;
        margin-top: 0;
      }
      .learning-content h1 small {
        display: block;
        font-size: 0.58em;
        color: #6b6280;
        margin-top: 8px;
        font-weight: normal;
      }
      /* 大見出し：塗りつぶしの帯ではなく、白いカード＋左のアクセント罫（mol と同じ静けさ） */
      .learning-content h2 {
        font-size: 1.24em;
        font-weight: 900;
        color: var(--lc-accent-d);
        background: #fff;
        border: 1.6px solid var(--lc-line);
        border-left: 6px solid var(--lc-accent);
        padding: 10px 16px;
        margin-top: 42px;
        border-radius: 8px;
      }
      .learning-content h3 {
        font-size: 1.1em;
        font-weight: 900;
        color: var(--lc-accent-d);
        border: 0;
        border-left: 4px solid var(--lc-accent);
        padding: 2px 0 2px 12px;
        margin-top: 32px;
        background: none;
      }
      .learning-content h4 {
        font-size: 1.02em;
        font-weight: 800;
        color: var(--lc-ink);
        margin-top: 26px;
        padding-bottom: 4px;
        border-bottom: 1px dashed var(--lc-line);
      }
      .learning-content h5 {
        font-size: 1em;
        font-weight: 800;
        color: var(--lc-accent-d);
        margin-top: 20px;
      }
      .learning-content p, .learning-content li {
        font-size: 0.94em;
      }
      /* Tailwind の Preflight で ol/ul のマーカーが消えるため、本文用リストの
         番号・行頭記号を明示的に復活させる（例題の「問題番号 抜け」対策）。 */
      .learning-content .main-content ol,
      .learning-content .box ol,
      .learning-content .box-example ol {
        list-style: none;
        counter-reset: q-counter;
        padding-left: 2.2em;
        margin: 8px 0;
      }
      /* 解答表記（（1）（2）…）と揃えるため、番号を全角括弧付きで表示する。 */
      .learning-content .main-content ol > li,
      .learning-content .box ol > li,
      .learning-content .box-example ol > li {
        position: relative;
        counter-increment: q-counter;
        margin: 4px 0;
      }
      .learning-content .main-content ol > li::before,
      .learning-content .box ol > li::before,
      .learning-content .box-example ol > li::before {
        content: '（' counter(q-counter) '）';
        position: absolute;
        left: -2.2em;
        width: 2.2em;
        text-align: left;
        font-weight: bold;
        color: var(--lc-accent);
      }
      .learning-content .main-content ul,
      .learning-content .box ul,
      .learning-content .box-example ul {
        list-style: disc;
        padding-left: 1.6em;
        margin: 8px 0;
      }
      .learning-content .main-content ul > li,
      .learning-content .box ul > li,
      .learning-content .box-example ul > li {
        margin: 4px 0;
        padding-left: 4px;
      }
      .learning-content .main-content ul > li::marker,
      .learning-content .box ul > li::marker,
      .learning-content .box-example ul > li::marker {
        color: var(--lc-accent);
      }
      /* ===== 表 ===== */
      .learning-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
        font-size: 0.88em;
        background: #fff;
      }
      .learning-content th, .learning-content td {
        border: 1px solid var(--lc-line);
        padding: 8px 10px;
        text-align: left;
        vertical-align: top;
      }
      .learning-content th {
        background: var(--lc-accent-l);
        text-align: center;
        font-weight: bold;
        color: var(--lc-accent-d);
      }
      .learning-content tr:nth-child(even) td {
        background: #fbf8ff;
      }
      /* ===== 囲み（box） =====
         mol の .mbs-ex と同じ「白いカード＋細い紫罫＋左5pxアクセント」。
         種類ごとの色は左罫とラベル文字だけで示し、地は白のまま統一する。 */
      .learning-content .box {
        background: #fff;
        padding: 12px 14px;
        margin: 16px 0;
        border: 1.6px solid var(--lc-line);
        border-radius: 8px;
        border-left: 5px solid var(--lc-accent);
      }
      /* ラベルは mol の Tag（囲み文字）と同じ見た目にする */
      .learning-content .box::before {
        display: inline-block;
        border: 1.6px solid currentColor;
        background: #fff;
        padding: 0 6px;
        margin-bottom: 8px;
        font-weight: 800;
        font-size: 0.86em;
        line-height: 1.7;
        white-space: nowrap;
      }
      .learning-content .box-point {
        border-left-color: var(--lc-accent);
      }
      .learning-content .box-point::before {
        content: '📘 Point';
        color: var(--lc-accent-d);
      }
      .learning-content .box-test {
        border-left-color: #b45309;
      }
      .learning-content .box-test::before {
        content: '✏️ 定期テスト・受験で聞かれること';
        color: #b45309;
      }
      .learning-content .box-example {
        border-left-color: #1f7a55;
      }
      .learning-content .box-example::before {
        content: '📗 例題';
        color: #1f7a55;
      }
      .learning-content .box-memory {
        border-left-color: #a16207;
      }
      /* 覚え方だけは mol の .mbs-goal（黄色の付箋）に寄せて目立たせる */
      .learning-content .box-memory {
        background: #fff6cc;
        border-color: #e8d27a;
      }
      .learning-content .box-memory::before {
        content: '😀 覚え方';
        color: #8a6d0b;
      }
      .learning-content .box-advanced {
        border-left-color: #7e22ce;
        border-style: dashed;
      }
      .learning-content .box-advanced::before {
        content: '🔬 発展';
        color: #7e22ce;
      }
      .learning-content .box-review {
        border-left-color: #64748b;
      }
      .learning-content .box-review::before {
        content: '🔄 復習';
        color: #64748b;
      }
      .learning-content .box-note {
        border-left-color: #c2410c;
      }
      .learning-content .box-note::before {
        content: '💡 補足';
        color: #c2410c;
      }
      .learning-content .box > *:first-of-type {
        margin-top: 0;
      }
      .learning-content .box > *:last-child {
        margin-bottom: 0;
      }
      /* ===== 折りたたみ（解答など） =====
         utils/learningAccordion.ts が描画直前に付ける
         .lc-ans / .lc-ans-sum に対してデザインを当てている。
         閉じているときは「押せるボタン」に見せ、開いたら
         解答用紙のような枠に変わる、という2状態を作る。 */
      .learning-content details.lc-ans {
        background: #fff;
        border: 2px solid var(--lc-line);
        border-radius: 12px;
        padding: 0;
        margin-top: 14px;
        overflow: hidden;
        transition: border-color 0.18s ease, box-shadow 0.18s ease;
      }
      .learning-content details.lc-ans[open] {
        border-color: var(--lc-accent);
        box-shadow: 0 2px 10px rgba(124, 58, 237, 0.1);
      }
      /* 見出し（ここがタップ領域。スマホでも押しやすい高さを確保する） */
      .learning-content summary.lc-ans-sum {
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: 46px;
        padding: 10px 14px;
        font-weight: 800;
        font-size: 0.92em;
        color: var(--lc-accent-d);
        background: var(--lc-accent-l);
        cursor: pointer;
        /* ネイティブの三角マーカーは消し、右側に自作の矢印を出す */
        list-style: none;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        transition: background 0.18s ease;
      }
      .learning-content summary.lc-ans-sum::-webkit-details-marker { display: none; }
      .learning-content summary.lc-ans-sum::marker { content: ''; }
      .learning-content summary.lc-ans-sum:hover { background: #e9dcff; }
      .learning-content summary.lc-ans-sum:focus-visible {
        outline: 3px solid var(--lc-accent);
        outline-offset: -3px;
      }
      .learning-content .lc-ans-ico { font-size: 1.05em; line-height: 1; }
      .learning-content .lc-ans-txt { flex: 1 1 auto; min-width: 0; }
      /* 「タップして表示 ▼」／「閉じる ▲」を状態に応じて出す */
      .learning-content .lc-ans-hint {
        flex: 0 0 auto;
        font-size: 0.82em;
        font-weight: 800;
        letter-spacing: 0.02em;
        color: var(--lc-accent);
        white-space: nowrap;
      }
      .learning-content details.lc-ans > summary .lc-ans-hint::after { content: 'タップして表示 ▼'; }
      .learning-content details.lc-ans[open] > summary .lc-ans-hint::after { content: '閉じる ▲'; }
      /* 解答本体 */
      .learning-content details.lc-ans > *:not(summary) {
        margin-left: 14px;
        margin-right: 14px;
      }
      .learning-content details.lc-ans > *:not(summary):first-of-type { margin-top: 12px; }
      .learning-content details.lc-ans > *:not(summary):last-child { margin-bottom: 14px; }
      /* 開いた瞬間に中身がふわっと出る（位置ズレを感じさせないため縦方向のみ） */
      @media (prefers-reduced-motion: no-preference) {
        .learning-content details.lc-ans[open] > *:not(summary) {
          animation: lcAnsReveal 0.22s ease-out both;
        }
      }
      @keyframes lcAnsReveal {
        from { opacity: 0; transform: translateY(-4px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @media (max-width: 640px) {
        .learning-content summary.lc-ans-sum {
          min-height: 52px;
          font-size: 0.95em;
          padding: 12px 12px;
        }
        /* スマホでは文言を短くして折り返しを防ぐ */
        .learning-content details.lc-ans > summary .lc-ans-hint::after { content: '▼'; }
        .learning-content details.lc-ans[open] > summary .lc-ans-hint::after { content: '▲'; }
      }
      /* ===== 式 ===== */
      .learning-content .formula {
        background: #fff;
        border: 1px solid var(--lc-line);
        padding: 10px 12px;
        margin: 12px 0;
        font-family: 'Cambria Math', 'Times New Roman', serif;
        border-radius: 6px;
        overflow-x: auto;
      }
      .learning-content .reaction {
        text-align: center;
        padding: 10px 8px;
        margin: 12px 0;
        background: #fff;
        border: 1px solid var(--lc-line);
        border-radius: 6px;
        font-family: 'Cambria Math', serif;
        font-weight: 700;
        overflow-x: auto;
      }
      /* ===== 図版 ===== */
      .learning-content figure {
        text-align: center;
        margin: 20px 0;
        max-width: 100%;
        overflow-x: auto;
      }
      .learning-content figure img,
      .learning-content img,
      .learning-content svg {
        /* 余白を詰めても画像が巨大化しないよう、コンテナ幅(100%)に加えて
           実寸の上限(620px)も設定し、図版が大きくなりすぎないようにする。 */
        max-width: min(100%, 620px) !important;
        height: auto;
        display: block;
        margin-left: auto;
        margin-right: auto;
        border-radius: 4px;
      }
      .learning-content figure img {
        border: 1.6px solid var(--lc-line);
        background: #fff;
      }
      /* 横に広い表は内部スクロールで全体を確認できるようにする */
      .learning-content .table-wrap,
      .learning-content .scroll-x {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .learning-content figcaption {
        font-size: 0.82em;
        color: #6b6280;
        margin-top: 6px;
      }
      /* ===== 図版レイアウト（文字を図の左に置く2カラム） =====
         上の figure ルールは max-width:620px を !important で強制しているので、
         2カラムに入れた図はそのままだと 620px のまま中央寄せになってしまう。
         .figrow の中だけは列幅いっぱい（100%）に広げ直す。 */
      .learning-content .figrow {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1.9fr);
        gap: 18px;
        align-items: start;
        margin: 22px 0;
        padding: 16px;
        background: #fbf9ff;
        border: 1.5px solid var(--lc-line);
        border-radius: 12px;
      }
      /* 図を左・文字を右にしたいときは .figrow.rev を付ける */
      .learning-content .figrow.rev {
        grid-template-columns: minmax(0, 1.9fr) minmax(0, 1fr);
      }
      .learning-content .figrow.rev > .figrow-text {
        order: 2;
      }
      .learning-content .figrow.rev > .figrow-fig {
        order: 1;
      }
      /* 図が主役で説明が短いとき（図を大きく） */
      .learning-content .figrow.wide {
        grid-template-columns: minmax(0, 0.78fr) minmax(0, 2.3fr);
      }
      /* ===== 広い画面では図の行だけ本文カラムより少し外へ広げる =====
         本文カラムは max-w-4xl（896px）だが、自作図は 880px 幅で描いてある。
         2カラムに入れると図が半分の幅まで縮み、図中の 10px の文字が読めない。
         1180px 以上の画面では、図の行だけ左右へ 102px ずつはみ出させて
         1100px 幅で見せる（1180px の画面でも左右に 20px 以上の余白が残る計算）。 */
      @media (min-width: 1180px) {
        .learning-content .figrow,
        .learning-content .figfull {
          width: 1100px;
          margin-left: -102px;
          margin-right: -102px;
        }
        /* 図は広げたいが、説明文まで 1100px に伸ばすと1行が長すぎて読みにくい。
           .figfull の中の文章だけは 880px で折り返しておく（図は全幅のまま）。 */
        .learning-content .figfull > p,
        .learning-content .figfull > ul,
        .learning-content .figfull > ol {
          max-width: 880px;
        }
      }
      .learning-content .figrow-text > :first-child {
        margin-top: 0;
      }
      .learning-content .figrow-text > :last-child {
        margin-bottom: 0;
      }
      .learning-content .figrow-text .figrow-title,
      .learning-content .figfull > .figrow-title {
        display: inline-block;
        font-weight: 800;
        font-size: 0.94em;
        color: var(--lc-accent-dark, #5b21b6);
        background: #f1e9ff;
        border-radius: 999px;
        padding: 4px 12px;
        margin-bottom: 10px;
      }
      .learning-content .figrow-text p,
      .learning-content .figrow-text li {
        font-size: 0.92em;
        line-height: 1.85;
      }
      .learning-content .figrow-text ul,
      .learning-content .figrow-text ol {
        margin: 8px 0 0;
        padding-left: 1.25em;
      }
      .learning-content .figrow-fig {
        margin: 0;
        text-align: center;
      }
      .learning-content .figrow-fig img,
      .learning-content .figrow-fig svg {
        /* 図は列の幅いっぱいまで使う（620px の上限を打ち消す） */
        max-width: 100% !important;
        width: 100%;
        height: auto;
        display: block;
        background: #fff;
        border: 1.5px solid var(--lc-line);
        border-radius: 10px;
      }
      .learning-content .figrow-fig figcaption {
        margin-top: 8px;
        text-align: left;
        font-size: 0.8em;
        line-height: 1.7;
      }
      /* ===== 図の拡大について =====
         以前は図をタップすると全画面のライトボックスが開く作りだったが、
         ご要望「クリックしてズーム機能はいらない」に合わせて廃止した。
         図が小さくならないことは、上の .figrow-fig img / 下の .figfull img の
         width:100% + max-width:100%!important で担保している（列の幅いっぱい）。
         さらに拡大したいときは端末標準のピンチ操作が使える。

         .figzoom-hint（「タップで拡大できます」の案内）は本文データ側に
         14箇所残っているため、セレクタ自体は消さず display:none で隠す。
         ・data 側の文章を機械的に削ると、前後の句読点や <br> の位置が
           問題によって不自然になる可能性がある
         ・逆にCSSを消すと、案内が普通の文字として本文に混ざって出てしまう
         そのため「非表示にする」のが最も壊れにくい。
         本文データから文言を消したあとは、このルールも削除してよい。 */
      .learning-content .figzoom-hint {
        display: none;
      }
      /* 図だけを大きく1枚見せたいとき（文字は下） */
      .learning-content .figfull {
        margin: 22px 0;
        padding: 16px;
        background: #fbf9ff;
        border: 1.5px solid var(--lc-line);
        border-radius: 12px;
      }
      .learning-content .figfull img,
      .learning-content .figfull svg {
        max-width: 100% !important;
        width: 100%;
        height: auto;
        display: block;
        background: #fff;
        border: 1.5px solid var(--lc-line);
        border-radius: 10px;
      }
      .learning-content .figfull figcaption {
        margin-top: 10px;
        text-align: left;
        font-size: 0.82em;
        line-height: 1.75;
      }
      /* .figfull の中に置いた解説文は、.figrow-text と同じ読み心地にそろえる */
      .learning-content .figfull > p,
      .learning-content .figfull > ul li,
      .learning-content .figfull > ol li {
        font-size: 0.92em;
        line-height: 1.85;
      }
      .learning-content .figfull > ul,
      .learning-content .figfull > ol {
        margin: 8px 0 14px;
        padding-left: 1.25em;
      }
      /* スマホでは2カラムをやめて縦積み（文字→図の順で読ませる） */
      @media (max-width: 760px) {
        .learning-content .figrow,
        .learning-content .figrow.rev,
        .learning-content .figrow.wide {
          grid-template-columns: minmax(0, 1fr);
          gap: 14px;
          padding: 12px;
        }
        .learning-content .figrow.rev > .figrow-text {
          order: 1;
        }
        .learning-content .figrow.rev > .figrow-fig {
          order: 2;
        }
      }
      .learning-content .top-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--lc-accent);
        color: #fff;
        padding: 10px 14px;
        text-decoration: none;
        border-radius: 50%;
        font-size: 1.2em;
      }
      @media (max-width: 900px) {
        .learning-content .layout {
          flex-direction: column;
          gap: 18px;
        }
        .learning-content .sidebar {
          width: 100%;
        }
        .learning-content .sidebar-inner {
          position: static;
        }
      }
      @media (max-width: 640px) {
        .learning-content {
          padding: 12px 12px 16px;
          border-left-width: 6px;
        }
        .learning-content h1 { font-size: 1.3em; }
        .learning-content h2 { font-size: 1.08em; padding: 8px 12px; }
        .learning-content .box { padding: 10px 12px; }
      }
      .learning-content hr.divider {
        border: 0;
        border-top: 2px dotted var(--lc-line);
        margin: 26px 0;
      }
      .learning-content .arrow-down {
        text-align: center;
        color: var(--lc-accent);
        font-size: 1.3em;
        margin: 8px 0;
      }

      /* ===================================================================
         強調表記のルール（画面・印刷で共通。printCss.ts が同じ規則を
         @media print 側でも再宣言している）
         -------------------------------------------------------------------
         語句（用語・化学式・数値・ラベル）
             <strong><u>…</u></strong>            太字 ＋ 太い直線の下線（黒）
         文章（述語をもつ言い切り・説明文）
             <strong><u class="wavy">…</u></strong> 太字 ＋ 太い波線の下線（黒）
         問題文の「下線部」（強調ではない）
             <u class="q">…</u>                    細い直線の下線だけ（太字にしない）

         ■ なぜ color / text-decoration-color を明示するのか
           .learning-content は本文色に紫寄りの --lc-ink を使っている。
           強調は「黒でしっかり」という要件なので、継承に任せず
           文字色・線の色を両方 #000 に固定する。
           text-decoration-color を省くと線だけ親の色を継承して
           薄く見える（＝強調が効いていないように見える）ため。

         ■ なぜ !important を付けるのか
           セクションHTMLは自動生成で、表のセルや figcaption など
           色を直接指定した要素の中にも強調が現れる。
           そこに負けないよう、強調だけは最優先で通す。
         =================================================================== */
      /* 語句・文章に共通の土台（太字＋黒）。
         <strong> で包み忘れた <u> 単体でも強調が消えないよう、
         セレクタは u 側にも直接当てている。 */
      .learning-content u:not(.q),
      .learning-content strong u {
        color: #000 !important;
        font-weight: 900 !important;
        text-decoration-color: #000 !important;
        /* 「g」「y」の下ばらいで下線が途切れないようにする */
        text-decoration-skip-ink: none;
      }
      /* 語句 ＝ 太字＋太い直線 */
      .learning-content u:not(.wavy):not(.q),
      .learning-content strong u:not(.wavy) {
        text-decoration-line: underline !important;
        text-decoration-style: solid !important;
        text-decoration-thickness: 3px !important;
        text-underline-offset: 3px;
      }
      /* 文章 ＝ 太字＋太い波線 */
      .learning-content u.wavy,
      .learning-content strong u.wavy {
        text-decoration-line: underline !important;
        text-decoration-style: wavy !important;
        text-decoration-thickness: 3px !important;
        /* 波線は振幅があるので、直線より少し下げて文字と干渉させない */
        text-underline-offset: 4px;
      }
      /* 問題文の「下線部」は“強調”ではなく“指示対象”。
         太字にせず、細い線だけにして強調と区別する。 */
      .learning-content u.q {
        font-weight: inherit !important;
        color: inherit !important;
        text-decoration-line: underline !important;
        text-decoration-style: solid !important;
        text-decoration-thickness: 1px !important;
        text-decoration-color: currentColor !important;
        text-underline-offset: 2px;
      }
      /* 本文中の強調は mol の .mbs-mark（網かけ）と同じ紫の下地にする */
      .learning-content mark {
        background: #ded6ef;
        color: inherit;
        padding: 1px 4px;
        font-weight: 800;
        border-radius: 2px;
      }`;
