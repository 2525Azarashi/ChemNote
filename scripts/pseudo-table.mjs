/**
 * pseudo-table
 * ------------------------------------------------------------------
 * 「｜」「|」を並べただけのプレーンテキスト疑似テーブルを検出し、
 * Markdown テーブルへ変換するための共有ユーティリティ。
 *
 * 【重要】誤検出してはならないもの
 *  - 電池の構成式（例: (-) Zn ｜ H₂SO₄ aq ｜ Cu (+)）は化学の正式表記であり表ではない
 *  - すでに Markdown テーブルになっている行
 *  - 罫線アート（│ ├ └）によるツリー図
 */

/** Markdown テーブルの区切り行（例: |---|:--:|---|） */
export const DELIMITER_ROW = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)+\|?\s*$/;
/** Markdown テーブルの行（先頭と末尾が | の行） */
export const MD_TABLE_ROW = /^\s*\|.*\|\s*$/;

/** 区切り記号（半角 | / 全角 ｜）の個数 */
const sepCount = (line) => (String(line).match(/[｜|]/g) || []).length;

/**
 * 電池の構成式（セルダイアグラム）か判定する。
 * 例: (-) Zn ｜ H₂SO₄ aq ｜ Cu (+) ／ (-) Zn ｜ ZnSO₄ aq ｜｜ CuSO₄ aq ｜ Cu (+)
 * これらは化学の正式表記なので表に変換してはいけない。
 *
 * 判定は「構成式にしか現れない特徴」だけに絞る（表の見出しを誤って
 * 除外しないため、「構成」「電池」などの一般語は使わない）。
 */
export function isCellDiagramLine(line) {
  const s = String(line);
  // 塩橋・素焼き板を表す二重区切り ｜｜
  if (/｜\s*｜|\|\s*\|/.test(s)) return true;
  // 両端の極性表記 (-) … (+) を持つ構成式
  if (/[(（][-−＋+][)）]/.test(s)) return true;
  return false;
}

/** 罫線アート（ツリー図・装置図）の行か */
export function isBoxDrawingLine(line) {
  return /[│├└┌┐┘─▼▲⇄]/.test(String(line));
}

/**
 * テキスト中の Markdown テーブル行のインデックス集合を返す。
 */
export function markdownTableRowIndexes(lines) {
  const idx = new Set();
  for (let i = 0; i < lines.length - 1; i++) {
    if (MD_TABLE_ROW.test(lines[i]) && DELIMITER_ROW.test(lines[i + 1])) {
      let j = i;
      while (j < lines.length && (MD_TABLE_ROW.test(lines[j]) || DELIMITER_ROW.test(lines[j]))) {
        idx.add(j);
        j++;
      }
    }
  }
  return idx;
}

/**
 * 疑似テーブルのブロックを検出する。
 *
 * 表の本質的な signature は「区切り記号を持つ行が連続して並ぶ」こと。
 * 文章中に1行だけ現れる区切り記号（電池の構成式など）は表ではない。
 *
 * 判定条件:
 *  - 区切り記号を含む行が空行を挟まずに連続している
 *  - 3列以上（区切り2個以上の行を含む）なら 2行以上で表とみなす
 *  - 2列のみ（全行が区切り1個）なら誤検出を避けるため 3行以上を要求する
 *  - 電池の構成式・罫線アート・既存 Markdown テーブル行は対象外
 *
 * @returns {{start:number,end:number,lines:string[]}[]} 行番号は 0-based, end は inclusive
 */
export function findPseudoTableBlocks(text) {
  const lines = String(text).split('\n');
  const mdIdx = markdownTableRowIndexes(lines);
  const blocks = [];

  const isCandidate = (k) =>
    k >= 0 &&
    k < lines.length &&
    !mdIdx.has(k) &&
    sepCount(lines[k]) >= 1 &&
    !isCellDiagramLine(lines[k]) &&
    !isBoxDrawingLine(lines[k]);

  let i = 0;
  while (i < lines.length) {
    if (!isCandidate(i)) { i++; continue; }

    let j = i;
    while (isCandidate(j + 1)) j++;

    const block = lines.slice(i, j + 1);
    const maxSep = Math.max(...block.map(sepCount));
    const minRows = maxSep >= 2 ? 2 : 3;

    if (block.length >= minRows) {
      blocks.push({ start: i, end: j, lines: block });
    }
    i = j + 1;
  }
  return blocks;
}

/** テキストに疑似テーブルが含まれるか */
export function hasPseudoTable(text) {
  return findPseudoTableBlocks(text).length > 0;
}

/**
 * 1行をセル配列に分解する。
 *
 * 【重要】先頭・末尾の区切り記号の扱い
 *  Markdown 風に両端を囲んだ行（例: `｜鉄｜—｜（ア）｜`）のときだけ両端を捨てる。
 *  片側だけ区切りがある行（例: `｜ 固体 ｜ 液体 ｜ 気体`）は、
 *  先頭の空セルが「表の左上の角（行見出し列のヘッダー）」を意味するため保持する。
 *  これを捨てると列が1つずれて表全体の意味が壊れる。
 */
export function splitPseudoRow(line) {
  let s = String(line);
  const hasLead = /^\s*[｜|]/.test(s);
  const hasTrail = /[｜|]\s*$/.test(s);

  // 両端を囲む書き方のときのみ、囲みの区切り記号を除去する
  if (hasLead && hasTrail) {
    s = s.replace(/^\s*[｜|]/, '').replace(/[｜|]\s*$/, '');
  }

  return s.split(/[｜|]/).map((c) => c.trim());
}

/**
 * 疑似テーブルブロックを Markdown テーブル文字列に変換する。
 * 1行目をヘッダー、以降をデータ行として扱う。
 * 列数が揃っていない場合は最大列数に合わせて空セルで埋める。
 * ヘッダーが1列少ない場合は「左上の角セル」が省略されたものとみなし、先頭に空セルを補う。
 */
export function toMarkdownTable(blockLines) {
  const rows = blockLines.map(splitPseudoRow);
  const colCount = Math.max(...rows.map((r) => r.length));

  // ヘッダー行だけ列数が少ない場合は、左上の角セルが省略された比較表とみなす。
  // 例: `｜ 固体 ｜ 液体 ｜ 気体` + `粒子間距離 ｜ 小 ｜ やや小 ｜ 大`
  if (rows.length >= 2 && rows[0].length === colCount - 1) {
    rows[0] = ['', ...rows[0]];
  }

  // 残りの不足分は末尾に空セルを補う
  const pad = (r) => {
    const out = [...r];
    while (out.length < colCount) out.push('');
    return out;
  };

  const header = pad(rows[0]);
  const body = rows.slice(1).map(pad);

  const fmt = (cells) => `| ${cells.join(' | ')} |`;
  const delimiter = `| ${Array.from({ length: colCount }, () => '---').join(' | ')} |`;

  return [fmt(header), delimiter, ...body.map(fmt)].join('\n');
}

/**
 * テキスト中のすべての疑似テーブルを Markdown テーブルへ変換して返す。
 * 疑似テーブルが無い場合は入力をそのまま返す。
 */
export function convertPseudoTables(text) {
  const blocks = findPseudoTableBlocks(text);
  if (blocks.length === 0) return { text: String(text), converted: 0 };

  const lines = String(text).split('\n');
  const out = [];
  let cursor = 0;
  for (const b of blocks) {
    out.push(...lines.slice(cursor, b.start));
    out.push(toMarkdownTable(b.lines));
    cursor = b.end + 1;
  }
  out.push(...lines.slice(cursor));
  return { text: out.join('\n'), converted: blocks.length };
}
