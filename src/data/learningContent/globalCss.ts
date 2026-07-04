// Auto-generated global CSS - already scoped to .learning-content
// eslint-disable-next-line
export const LEARNING_GLOBAL_CSS = `.learning-content {
        font-family: 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'Noto Sans JP', sans-serif;
        color: #2c3e50;
        background: #fafafa;
        line-height: 1.7;
        margin: 0;
        padding: 0;
      }
      .learning-content .layout {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        gap: 30px;
        padding: 20px;
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
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        font-size: 0.88em;
      }
      .learning-content .sidebar h3 {
        margin-top: 0;
        font-size: 1em;
        color: #16538a;
        border-bottom: 2px solid #16538a;
        padding-bottom: 8px;
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
        color: #444;
        text-decoration: none;
        display: block;
        padding: 2px 6px;
        border-radius: 4px;
      }
      .learning-content .main-content {
        flex-grow: 1;
        min-width: 0;
        background: #fff;
        padding: 30px 40px;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
      }
      .learning-content h1 {
        text-align: center;
        font-size: 1.9em;
        color: #16538a;
        border-bottom: 3px double #16538a;
        padding-bottom: 14px;
        margin-top: 0;
      }
      .learning-content h1 small {
        display: block;
        font-size: 0.55em;
        color: #555;
        margin-top: 8px;
        font-weight: normal;
      }
      .learning-content h2 {
        font-size: 1.4em;
        background: linear-gradient(90deg, #16538a, #2980b9);
        color: #fff;
        padding: 10px 16px;
        margin-top: 48px;
        border-radius: 6px;
      }
      .learning-content h3 {
        font-size: 1.2em;
        color: #16538a;
        border-left: 6px solid #16538a;
        padding: 4px 0 4px 12px;
        margin-top: 36px;
        background: #eef5fa;
      }
      .learning-content h4 {
        font-size: 1.05em;
        color: #c0392b;
        margin-top: 28px;
        padding-bottom: 4px;
        border-bottom: 1px dashed #c0392b;
      }
      .learning-content h5 {
        font-size: 1em;
        color: #2c3e50;
        margin-top: 20px;
      }
      .learning-content p, .learning-content li {
        font-size: 0.95em;
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
        color: #16538a;
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
      .learning-content table {
        width: 100%;
        border-collapse: collapse;
        margin: 16px 0;
        font-size: 0.88em;
      }
      .learning-content th, .learning-content td {
        border: 1px solid #b0bec5;
        padding: 8px 10px;
        text-align: left;
        vertical-align: top;
      }
      .learning-content th {
        background: #cfe2f3;
        text-align: center;
        font-weight: bold;
        color: #16538a;
      }
      .learning-content tr:nth-child(even) td {
        background: #f7fafc;
      }
      .learning-content .box {
        padding: 14px 18px;
        margin: 16px 0;
        border-radius: 6px;
        border-left: 5px solid;
      }
      .learning-content .box-point {
        background: #e8f4fb;
        border-color: #3498db;
      }
      .learning-content .box-point::before {
        content: '📘 Point';
        display: block;
        font-weight: bold;
        color: #2980b9;
        margin-bottom: 8px;
      }
      .learning-content .box-test {
        background: #fff7e0;
        border-color: #f39c12;
      }
      .learning-content .box-test::before {
        content: '✏️ 定期テスト・受験で聞かれること';
        display: block;
        font-weight: bold;
        color: #e67e22;
        margin-bottom: 8px;
      }
      .learning-content .box-example {
        background: #eafaf1;
        border-color: #27ae60;
      }
      .learning-content .box-example::before {
        content: '📗 例題';
        display: block;
        font-weight: bold;
        color: #27ae60;
        margin-bottom: 8px;
      }
      .learning-content .box-memory {
        background: #fef9e7;
        border-color: #f1c40f;
      }
      .learning-content .box-memory::before {
        content: '😀 覚え方';
        display: block;
        font-weight: bold;
        color: #b7950b;
        margin-bottom: 8px;
      }
      .learning-content .box-advanced {
        background: #f5eef8;
        border-color: #9b59b6;
      }
      .learning-content .box-advanced::before {
        content: '🔬 発展';
        display: block;
        font-weight: bold;
        color: #8e44ad;
        margin-bottom: 8px;
      }
      .learning-content .box-review {
        background: #f4f6f7;
        border-color: #7f8c8d;
      }
      .learning-content .box-review::before {
        content: '🔄 復習';
        display: block;
        font-weight: bold;
        color: #7f8c8d;
        margin-bottom: 8px;
      }
      .learning-content .box-note {
        background: #fdf2e9;
        border-color: #e67e22;
      }
      .learning-content .box-note::before {
        content: '💡 補足';
        display: block;
        font-weight: bold;
        color: #d35400;
        margin-bottom: 8px;
      }
      .learning-content details {
        background: #fff;
        border: 2px dashed #16a085;
        border-radius: 6px;
        padding: 10px 14px;
        margin-top: 10px;
      }
      .learning-content summary {
        font-weight: bold;
        color: #16a085;
        cursor: pointer;
        padding: 4px 0;
      }
      .learning-content .formula {
        background: #f8f9fa;
        border: 1px solid #dee2e6;
        padding: 8px 12px;
        margin: 8px 0;
        font-family: 'Cambria Math', 'Times New Roman', serif;
        border-radius: 4px;
      }
      .learning-content .reaction {
        text-align: center;
        padding: 8px;
        background: #f8f9fa;
        margin: 8px 0;
        font-family: 'Cambria Math', serif;
      }
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
        border: 1px solid #ddd;
      }
      /* 横に広い表は内部スクロールで全体を確認できるようにする */
      .learning-content .table-wrap,
      .learning-content .scroll-x {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
      .learning-content figcaption {
        font-size: 0.85em;
        color: #7f8c8d;
        margin-top: 6px;
      }
      .learning-content .top-btn {
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: #16538a;
        color: #fff;
        padding: 10px 14px;
        text-decoration: none;
        border-radius: 50%;
        font-size: 1.2em;
      }
      @media (max-width: 900px) {
        .learning-content .layout {
          flex-direction: column;
        }
        .learning-content .sidebar {
          width: 100%;
        }
        .learning-content .sidebar-inner {
          position: static;
        }
        .learning-content .main-content {
          padding: 20px;
        }
      }
      .learning-content hr.divider {
        border: 0;
        border-top: 2px dotted #b0bec5;
        margin: 30px 0;
      }
      .learning-content .arrow-down {
        text-align: center;
        color: #3498db;
        font-size: 1.3em;
        margin: 8px 0;
      }
    
      .learning-content u.wavy { text-decoration: underline wavy; text-decoration-thickness: 1.5px; text-underline-offset: 3px; }
      .learning-content strong u { text-decoration: underline; text-decoration-thickness: 2px; text-underline-offset: 3px; }
      .learning-content strong u.wavy { text-decoration: underline wavy; text-decoration-thickness: 1.5px; text-underline-offset: 3px; }`;
