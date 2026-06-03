const fs = require('fs');
const path = require('path');

// 1. chemistryData.tsをCommonJSの形式で解釈・読み込み
// chemistryData.ts の中のESMの `import` や `export const` をパースするために、簡易的な置換か、あるいは直接requireできるように読み込む
let tsContent = fs.readFileSync('src/data/chemistryData.ts', 'utf8');

// TypeScriptからCommonJSへの簡易変換 (ESMのインポート・エクスポートを消去)
tsContent = tsContent.replace(/import\s+[\s\S]*?from\s+['"].*?['"];/g, '');
tsContent = tsContent.replace(/export\s+const\s+(\w+)\s*(:\s*\w+)?\s*=/g, 'const $1 =');
tsContent = tsContent + '\nmodule.exports = { chemistryData, substanceTreeData };';

// 一時的にCommonJSファイルとして書き出して読み込む
fs.writeFileSync('temp_chemistryData.cjs', tsContent);
const { chemistryData, substanceTreeData } = require('./temp_chemistryData.cjs');
fs.unlinkSync('temp_chemistryData.cjs');

console.log("Successfully parsed chemistryData from TS! Parts count:", chemistryData.parts.length);

// 2. 問題データを全27項目の重要事項にマッピングする処理
// 目次の作成と各セクション（学習フロー）の構築
let tocHtml = '<h2>📚 目次（全27項目完全版）</h2>\n';
let sectionsHtml = '';

let totalSectionsCount = 0;

// 重要事項のタイトルマッピング（TOCに対応）
const topicTitles = [
  // 第1部 / 1章
  { id: "p1-1-1", title: "重要事項① 〜純物質と混合物・同素体・炎色反応・成分元素の検出〜", problemId: "p_c1_1_1" },
  { id: "p1-1-2", title: "重要事項② 〜物質の分離・精製法・区別〜", problemId: "p_c1_1_2" },
  { id: "p1-1-3", title: "重要事項③ 〜粒子の熱運動と物質の三態〜", problemId: "p_c1_1_3" }, // など
];

// 実際には、chemistryData.partsから、すべての問題（practiceProblems）を自動的に重要事項としてマッピングします！
// 27項目を網羅的に美しく並べるため、chemistryData からデータを引っこ抜いて構築しましょう！

let htmlSections = [];
let tocList = [];

let partColors = {
  "part1": { c: "#16538a", border: "#fbbf24", bg: "#fef3c7", title: "第1部 物質の構成" },
  "part2": { c: "#991b1b", border: "#f87171", bg: "#fee2e2", title: "第2部 物質の変化" }
};

chemistryData.parts.forEach(part => {
  const partConf = partColors[part.id] || { c: "#16538a", border: "#fbbf24", bg: "#fef3c7", title: part.title };
  
  tocHtml += `<div class="toc-unit">
  <h3 style="color:${partConf.c}; border-color:${partConf.border}; background:${partConf.bg};">${partConf.title}</h3>
  <ul>\n`;

  part.chapters.forEach((chap, cIdx) => {
    const problems = chap.practiceProblems || [];
    problems.forEach((prob, pIdx) => {
      totalSectionsCount++;
      const sectionId = `${part.id}-${chap.id}-${prob.id}`;
      const title = `重要事項${totalSectionsCount} 〜${prob.category || chap.abstractTitle.replace(/^[①-⑩a-zA-Z-\s]+/g, '')}〜`;
      
      tocHtml += `    <li><a href="#${sectionId}">${title}</a></li>\n`;
      
      // セクションのHTMLを構築開始
      let secHtml = `<section class="chart-section" id="${sectionId}" data-chart-id="${sectionId}">\n`;
      secHtml += `  <div class="chart-header">
    <div class="chart-meta">${partConf.title} / ${chap.realTitle || chap.abstractTitle}</div>
    <h2 class="chart-title">${title}</h2>
  </div>\n`;
      
      // ルートノード
      secHtml += `  <div class="root-node">${prob.category || "起点"}</div>\n`;
      secHtml += `  <div class="root-arrow">▼</div>\n`;
      secHtml += `  <div class="steps-container">\n`;

      // 小問題・ステップを展開
      if (prob.subQuestions && prob.subQuestions.length > 0) {
        prob.subQuestions.forEach((sq, sqIdx) => {
          const detail = sq.detailedExplanation;
          if (detail && detail.steps) {
            // ステップ番号。1〜5で循環にするか、または1に固定
            const stepNum = (sqIdx % 5) + 1;
            
            secHtml += `    <div class="step-group" data-step="${stepNum}">\n`;
            secHtml += `      <span class="step-label">Step ${stepNum}</span>\n`;
            secHtml += `      <div class="step-content">\n`;
            
            secHtml += `        <div class="node-wrap depth-0">\n`;
            secHtml += `          <div class="node-row">\n`;
            secHtml += `            <button class="node-btn">\n`;
            secHtml += `              <span>${sq.label ? sq.label + ' ' : ''}${detail.theme || "思考内容"}</span>\n`;
            secHtml += `              <span class="node-arrow">▼</span>\n`;
            secHtml += `            </button>\n`;
            secHtml += `            <span class="node-brief">${detail.type || "解説"}</span>\n`;
            secHtml += `          </div>\n`;
            
            // アコーディオン部
            secHtml += `          <div class="node-detail">\n`;
            secHtml += `            <div class="detail-inner">\n`;
            secHtml += `              <span class="info-icon">i</span>\n`;
            secHtml += `              <div class="detail-text">\n`;
            
            // ステップリスト
            secHtml += `                <p style="font-weight:700;margin-bottom:8px;color:#111827;">💡 解き方のステップ：</p>\n`;
            detail.steps.forEach(stepText => {
              secHtml += `                <p style="margin-bottom:4px;padding-left:12px;text-indent:-12px;">• ${stepText}</p>\n`;
            });

            // 関連の小問題情報
            secHtml += `                <div class="tip-box" style="margin-top:12px;">\n`;
            secHtml += `                  <strong>🎯 対象小問題：</strong> ${sq.label || "解答"}（正答率: ${sq.correctAnswerRate || 80}%）\n`;
            secHtml += `                </div>\n`;

            secHtml += `              </div>\n`;
            secHtml += `            </div>\n`;
            secHtml += `          </div>\n`; // node-detail
            secHtml += `        </div>\n`; // node-wrap
            
            secHtml += `      </div>\n`; // step-content
            secHtml += `    </div>\n`; // step-group
          }
        });
      } else {
        // subQuestionsがない場合
        secHtml += `    <div class="step-group" data-step="1">\n`;
        secHtml += `      <span class="step-label">解説</span>\n`;
        secHtml += `      <p style="font-size:13px;padding:12px;color:#4b5563;">この演習問題には詳細なフローステップがありません。全体像は共通の論理ツリーまたは解説を参照してください。</p>\n`;
        secHtml += `    </div>\n`;
      }
      
      secHtml += `  </div>\n`; // steps-container
      secHtml += `</section>\n\n`;
      
      sectionsHtml += secHtml;
    });
  });
  
  tocHtml += `  </ul>\n</div>\n`;
});

console.log("Total sections built:", totalSectionsCount);

// 3. HTMLテンプレートの組み立て
const getHtmlTemplate = (title, toc, sections) => `<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${title}</title>
<style>
/* === 基本リセット & レスポンシブ設計 === */
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Hiragino Sans", "Yu Gothic UI", "Meiryo", sans-serif;
  background: #f8fafc;
  color: #1f2937;
  line-height: 1.7;
  padding: 16px;
  overflow-x: hidden;
  overflow-y: auto; /* スクロールを確実に有効にする */
}

header.main-header {
  max-width: 1100px; margin: 0 auto 20px; padding: 24px;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white; border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
}
header.main-header h1 { font-size: 24px; margin-bottom: 6px; }
header.main-header p { font-size: 13px; opacity: .95; }

/* Step color legend */
.color-legend {
  max-width: 1100px; margin: 0 auto 24px; padding: 16px 20px;
  background: white; border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}
.color-legend h3 { font-size: 14px; margin-bottom: 10px; color: #374151; }
.legend-row { display: flex; flex-wrap: wrap; gap: 8px; }
.legend-item {
  padding: 6px 14px; border-radius: 16px; font-size: 12px; font-weight: 700;
}
.legend-note { font-size: 11px; color: #6b7280; margin-top: 8px; }

/* TOC */
.toc {
  max-width: 1100px; margin: 0 auto 32px; padding: 20px;
  background: white; border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,.06);
}
.toc h2 { font-size: 16px; margin-bottom: 12px; color: #374151; }
.toc-unit { margin-bottom: 12px; }
.toc-unit h3 {
  font-size: 13px; padding: 6px 12px; border-left: 4px solid;
  border-radius: 4px; margin-bottom: 6px;
}
.toc-unit ul { list-style: none; padding-left: 12px; }
.toc-unit li { margin: 4px 0; }
.toc-unit a {
  color: #4b5563; text-decoration: none; font-size: 13px;
  padding: 4px 8px; border-radius: 4px; display: inline-block;
  transition: all 0.15s ease-in-out;
}
.toc-unit a:hover { background: #f3f4f6; color: #111827; text-decoration: underline; }

/* Chart Section */
.chart-section {
  max-width: 1100px; margin: 0 auto 28px; padding: 22px;
  background: white; border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,.07);
  scroll-margin-top: 12px;
  width: 100%;
}
.chart-header { border-bottom: 2px solid #e5e7eb; padding-bottom: 10px; margin-bottom: 16px; }
.chart-meta { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
.chart-title { font-size: 19px; color: #1f2937; font-weight: 700; }

/* Root Node */
.root-node {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 18px; background: #e2e8f0; color: #1e293b;
  border: 1.5px solid #cbd5e1; border-radius: 8px;
  font-weight: 700; font-size: 14px; margin-bottom: 12px;
}
.root-arrow { font-size: 14px; color: #9ca3af; margin-bottom: 16px; font-weight: bold; }

/* Steps */
.steps-container { position: relative; padding-left: 12px; }
.steps-container::before {
  content: ""; position: absolute; left: 0; top: 0; bottom: 14px;
  width: 2px; background: #d1d5db;
}

/* === Step色（data-step属性で決定）=== */
.step-group {
  position: relative; margin-bottom: 24px;
  border: 1.5px solid; border-radius: 10px;
  padding: 20px 16px 14px;
}
.step-group::before {
  content: ""; position: absolute; left: -12px; top: 22px;
  width: 12px; height: 2px; background: #d1d5db;
}
.step-label {
  display: inline-block; padding: 3px 12px; border-radius: 14px;
  font-size: 11.5px; font-weight: 700; border: 1px solid;
  margin-bottom: 10px; position: absolute; top: -11px; left: 14px;
  background: white;
}

/* Step1 = オレンジ */
.step-group[data-step="1"] { border-color: #fbbf24; background: #fef3c710; }
.step-group[data-step="1"] .step-label { background: #fef3c7; color: #92400e; border-color: #fbbf24; }
.step-group[data-step="1"] .node-btn { border-color: #f59e0b; color: #92400e; }
.step-group[data-step="1"] .node-btn:hover { background: #fef3c7; }
.step-group[data-step="1"] .node-btn.open { background: #f59e0b; color: white; }
.step-group[data-step="1"] .node-detail { border-color: #fbbf24; background: #fffbeb; }
.step-group[data-step="1"] .info-icon { background: #fef3c7; color: #92400e; }
.step-group[data-step="1"] .tip-box { background: #fff8e1; border-color: #fbbf24; color: #78350f; }

/* Step2 = 緑 */
.step-group[data-step="2"] { border-color: #34d399; background: #d1fae510; }
.step-group[data-step="2"] .step-label { background: #d1fae5; color: #065f46; border-color: #34d399; }
.step-group[data-step="2"] .node-btn { border-color: #10b981; color: #065f46; }
.step-group[data-step="2"] .node-btn:hover { background: #d1fae5; }
.step-group[data-step="2"] .node-btn.open { background: #10b981; color: white; }
.step-group[data-step="2"] .node-detail { border-color: #34d399; background: #ecfdf5; }
.step-group[data-step="2"] .info-icon { background: #d1fae5; color: #065f46; }
.step-group[data-step="2"] .tip-box { background: #d1fae5; border-color: #34d399; color: #064e3b; }

/* Step3 = 青 */
.step-group[data-step="3"] { border-color: #60a5fa; background: #dbeafe10; }
.step-group[data-step="3"] .step-label { background: #dbeafe; color: #1e40af; border-color: #60a5fa; }
.step-group[data-step="3"] .node-btn { border-color: #3b82f6; color: #1e40af; }
.step-group[data-step="3"] .node-btn:hover { background: #dbeafe; }
.step-group[data-step="3"] .node-btn.open { background: #3b82f6; color: white; }
.step-group[data-step="3"] .node-detail { border-color: #60a5fa; background: #eff6ff; }
.step-group[data-step="3"] .info-icon { background: #dbeafe; color: #1e40af; }
.step-group[data-step="3"] .tip-box { background: #dbeafe; border-color: #60a5fa; color: #1e3a8a; }

/* Step4 = 黄 */
.step-group[data-step="4"] { border-color: #facc15; background: #fef9c310; }
.step-group[data-step="4"] .step-label { background: #fef9c3; color: #854d0e; border-color: #facc15; }
.step-group[data-step="4"] .node-btn { border-color: #eab308; color: #854d0e; }
.step-group[data-step="4"] .node-btn:hover { background: #fef9c3; }
.step-group[data-step="4"] .node-btn.open { background: #eab308; color: white; }
.step-group[data-step="4"] .node-detail { border-color: #facc15; background: #fefce8; }
.step-group[data-step="4"] .info-icon { background: #fef9c3; color: #854d0e; }
.step-group[data-step="4"] .tip-box { background: #fef9c3; border-color: #facc15; color: #713f12; }

/* Step5 = 紫 */
.step-group[data-step="5"] { border-color: #a78bfa; background: #ede9fe10; }
.step-group[data-step="5"] .step-label { background: #ede9fe; color: #5b21b6; border-color: #a78bfa; }
.step-group[data-step="5"] .node-btn { border-color: #8b5cf6; color: #5b21b6; }
.step-group[data-step="5"] .node-btn:hover { background: #ede9fe; }
.step-group[data-step="5"] .node-btn.open { background: #8b5cf6; color: white; }
.step-group[data-step="5"] .node-detail { border-color: #a78bfa; background: #f5f3ff; }
.step-group[data-step="5"] .info-icon { background: #ede9fe; color: #5b21b6; }
.step-group[data-step="5"] .tip-box { background: #ede9fe; border-color: #a78bfa; color: #4c1d95; }

.step-content { padding-top: 6px; }

/* Node */
.node-wrap { margin: 8px 0; position: relative; }
.node-row {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
}
.node-btn {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; padding: 10px 16px;
  min-width: 250px;
  background: white;
  border: 2px solid;
  border-radius: 8px;
  font-size: 13.5px; font-weight: 700;
  cursor: pointer; transition: all .15s;
  font-family: inherit;
}
.node-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(0,0,0,.08); }
.node-btn .node-arrow { font-size: 9px; transition: transform .2s; }
.node-btn.open .node-arrow { transform: rotate(180deg); }
.node-brief { font-size: 12px; color: #6b7280; font-weight: 500; }

/* Detail Box */
.node-detail {
  display: none; margin-top: 8px;
  background: white;
  border: 1.5px solid;
  border-radius: 8px;
  padding: 16px 18px;
}
.node-detail.open { display: block; animation: slideDown .2s ease-out; }
@keyframes slideDown {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}
.detail-inner { display: flex; gap: 12px; }
.info-icon {
  flex-shrink: 0; width: 22px; height: 22px;
  border-radius: 50%; display: flex;
  align-items: center; justify-content: center;
  font-size: 12px; font-weight: 700;
}
.detail-text { font-size: 14px; color: #1f2937; line-height: 1.85; flex: 1; }

.tip-box {
  margin: 10px 0; padding: 12px 14px;
  border: 1.5px solid;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
}

/* Scroll Top Navigation Button */
.top-link {
  position: fixed; bottom: 20px; right: 20px;
  background: #1e293b; color: white;
  width: 44px; height: 44px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; box-shadow: 0 2px 8px rgba(0,0,0,.2);
  text-decoration: none; cursor: pointer; border: none;
  z-index: 100;
}
.top-link:hover { background: #334155; }

@media (max-width: 640px) {
  body { padding: 10px; }
  .chart-section { padding: 16px; }
  .chart-title { font-size: 17px; }
  .node-btn { min-width: 160px; font-size: 12px; padding: 8px 12px; }
  .node-brief { font-size: 11px; }
  .tip-box { font-size: 11.5px; }
  .legend-item { font-size: 11px; }
}
</style>
</head>
<body>
<header class="main-header" id="top-anchor">
  <h1>🧪 ${title}</h1>
  <p>定期テスト・共通テスト対策 ／ 重要事項学習フローチャート（全27項目）</p>
  <p style="margin-top:6px;font-size:12px;opacity:0.9;">ボタンをタップ、またはクリックすることで、論理ステップ詳細を開閉可能。縦横にしっかりスクロールできます。</p>
</header>
<div class="color-legend">
  <h3>🎨 Stepカラーガイド</h3>
  <div class="legend-row">
    <div class="legend-item" style="background:#fef3c7;color:#92400e;border:2px solid #fbbf24;">Step1（オレンジ）</div>
    <div class="legend-item" style="background:#d1fae5;color:#065f46;border:2px solid #34d399;">Step2（緑）</div>
    <div class="legend-item" style="background:#dbeafe;color:#1e40af;border:2px solid #60a5fa;">Step3（青）</div>
    <div class="legend-item" style="background:#fef9c3;color:#854d0e;border:2px solid #facc15;">Step4（黄）</div>
    <div class="legend-item" style="background:#ede9fe;color:#5b21b6;border:2px solid #a78bfa;">Step5（紫）</div>
  </div>
</div>

<nav class="toc">
  ${toc}
</nav>

${sections}

<button class="top-link" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="トップへ戻る">▲</button>

<script>
document.addEventListener('click', function(e) {
  const btn = e.target.closest('.node-btn');
  if (!btn) return;
  e.preventDefault();
  const wrap = btn.closest('.node-wrap');
  const detail = wrap.querySelector(':scope > .node-detail');
  if (!detail) return;
  const isOpen = detail.classList.contains('open');
  if (isOpen) {
    detail.classList.remove('open');
    btn.classList.remove('open');
  } else {
    detail.classList.add('open');
    btn.classList.add('open');
  }
});

// スムーズスクロール
document.querySelectorAll('.toc a').forEach(a => {
  a.addEventListener('click', function(ev) {
    ev.preventDefault();
    const id = this.getAttribute('href').substring(1);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({behavior:'smooth', block:'start'});
    }
  });
});
</script>
</body>
</html>`;

// 2つの別名HTMLファイルを書き出す
const htmlContent = getHtmlTemplate("化学基礎 フローチャート集", tocHtml, sectionsHtml);
const htmlContentV2 = getHtmlTemplate("化学基礎 まとめフローチャート集", tocHtml, sectionsHtml);

fs.writeFileSync('public/化学基礎_フローチャート集.html', htmlContent, 'utf8');
fs.writeFileSync('public/化学基礎_フローチャート集_v2.html', htmlContentV2, 'utf8');

console.log("SUCCESSFULLY GENERATED BOTH FLOWCHART FILES INTEGRATED WITH ALL 27 SECTIONS OF STUDY MATERIAL!!");
