import React from 'react';

// 縦書き分数の HTML を生成するヘルパー。
// 分子・分母はそのまま埋め込み、後段の化学式処理で変数（w, M など）も適切にイタリック化される。
function buildFractionHtml(numerator: string, denominator: string) {
  return (
    '<span class="inline-flex flex-col justify-center text-center mx-1" style="font-size: 0.85em; vertical-align: middle; line-height: 1;">' +
      '<span class="border-b border-stone-400 pb-[1.5px] leading-none px-1 font-serif font-medium">' + numerator + '</span>' +
      '<span class="leading-none pt-[1.5px] px-1 font-serif font-medium">' + denominator + '</span>' +
    '</span>'
  );
}

// 分母（または分子）が「単位」を表す場合は分数化しない。
// 例: g/mol, mol/L, kJ/mol, g/cm3, L/mol などは横書きのまま残す。
const UNIT_TOKENS = new Set([
  'mol', 'L', 'mL', 'g', 'kg', 'mg', 'cm', 'cm2', 'cm3', 'm', 'm2', 'm3',
  'kJ', 'J', 'kcal', 'cal', 'K', 's', 'min', 'h', 'Pa', 'kPa', 'atm', 'N',
  'V', 'A', 'W', 'dm', 'dm3', 'mmol',
]);

function isUnitToken(token: string) {
  return UNIT_TOKENS.has(token);
}

const SUBSCRIPT_CLASS = 'text-[0.75em] font-sans align-sub leading-none';
const SUPERSCRIPT_CLASS = 'text-[0.75em] font-sans align-super leading-none';

const SUBSCRIPT_CHAR_MAP: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
  '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
};
const SUPERSCRIPT_CHAR_MAP: Record<string, string> = {
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5',
  '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9', '⁺': '+', '⁻': '−',
};

/** Unicode / TeX風の添字を semantic HTML に統一し、フォントに依存せず上下配置する。 */
function normalizeScientificScripts(text: string) {
  return text
    .replace(/[₀₁₂₃₄₅₆₇₈₉]+/g, (value) =>
      `<sub class="${SUBSCRIPT_CLASS}">${[...value].map((char) => SUBSCRIPT_CHAR_MAP[char]).join('')}</sub>`
    )
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻]+/g, (value) =>
      `<sup class="${SUPERSCRIPT_CLASS}">${[...value].map((char) => SUPERSCRIPT_CHAR_MAP[char]).join('')}</sup>`
    )
    // 問題データに残る H^+ / Fe^2+ / cm^3 / x_{1} も同じ表示へ揃える。
    .replace(/([A-Za-z0-9)])_\{?([0-9]+)\}?/g, `$1<sub class="${SUBSCRIPT_CLASS}">$2</sub>`)
    .replace(/([A-Za-z0-9)])\^\{?([0-9]*[+\-−]?|[+\-−])\}?/g, `$1<sup class="${SUPERSCRIPT_CLASS}">$2</sup>`)
    // 半反応式データ（redoxProblems.ts）で使われる MINUS SIGN(U+2212) の電荷を
    // ASCII の "-" に寄せて、下の化学式変換でイオンとして上付きにできるようにする。
    //   Cl−・e−・NO3− → 電荷なので変換する
    //   C−H・O−H・N−H → 構造式の結合線なので変換しない（直後が英大文字なら除外）
    .replace(/([A-Za-z][A-Za-z]?[0-9]*)\u2212(?![A-Za-z0-9(])/g, '$1-');
}

export function formatText(text: string, highlights: string[] = []) {
  if (!text) return null;

  // Replace * with proper math multiplication crosses
  let processedText = normalizeScientificScripts(text).replace(
    /([A-Za-z0-9]|\)|[％%]|\])[\s ]*\*[\s ]*([A-Za-z0-9]|\(|\[)/g,
    '$1 <span class="font-sans font-semibold text-stone-500 mx-0.5">×</span> $2'
  );

  // (1) 明示的な分数表記 \frac{分子}{分母} を最優先で縦書き分数に変換する。
  //     入れ子は想定せず、波括弧内に } を含まないシンプルな書式に対応。
  processedText = processedText.replace(
    /\\frac\s*\{([^{}]+)\}\s*\{([^{}]+)\}/g,
    (_m: string, num: string, den: string) => buildFractionHtml(num.trim(), den.trim())
  );

  // (2) 括弧で囲まれた分数 (分子)/(分母) を縦書き分数にする。
  //     例: (w/M), (x/100) のように括弧つきで書かれた割り算の中身を確実に拾う。
  processedText = processedText.replace(
    /\(([^()/]+)\)\s*\/\s*\(([^()/]+)\)/g,
    (_m: string, num: string, den: string) => buildFractionHtml(num.trim(), den.trim())
  );

  // (3) 一般的な分数 a/b を縦書き分数にする。
  //     - 分子・分母は「数字・小数・1〜2文字の英字変数（添字 _ を許可）」に限定。
  //     - 分母（または分子）が単位トークン（mol, L, g など）の場合は変換せず横書きのまま残す。
  //       これにより g/mol・mol/L・kJ/mol などの単位表記が壊れない。
  processedText = processedText.replace(
    /(?<![A-Za-z0-9_.\/])([0-9]+(?:\.[0-9]+)?|[A-Za-z][A-Za-z]?(?:_[A-Za-z0-9]+)?)\s*\/\s*([0-9]+(?:\.[0-9]+)?|[A-Za-z][A-Za-z]?(?:_[A-Za-z0-9]+)?)(?![A-Za-z0-9_.\/])/g,
    (match: string, num: string, den: string) => {
      // 分母が単位トークン（g/mol・mol/L・kJ/mol など）の場合は単位表記とみなし分数化しない。
      // 分子のみが単位っぽくても分母が変数（L/a など）なら数式の分数として扱う。
      if (isUnitToken(den)) return match;
      return buildFractionHtml(num, den);
    }
  );

  // Replace atomic weight annotations with a smaller inline-block style
  processedText = processedText.replace(
    /([（(][A-Za-z]+[\s ]*[=＝][\s ]*[0-9.]+(?:[、,，\s ]+[A-Za-z]+[\s ]*[=＝][\s ]*[0-9.]+)*[）)])/g,
    '<span class="text-[0.82em] font-sans text-stone-500 bg-stone-50 border border-stone-200/60 px-2 py-0.5 rounded-lg inline-block my-0.5 font-normal select-none shadow-xs">$1</span>'
  );

  // 質量数（同位体）の上付き表記。35Cl / 12C / 26Mg のような「質量数＋元素記号」を ³⁵Cl と描画する。
  //
  // ★重要★ ここは化学反応式の「係数」と衝突しやすい。
  //   2H₂O・8H⁺・2Cl⁻・3Cu ＋ … の先頭の数字は係数であって質量数ではないため、
  //   上付きにしてしまうと「係数が左上に小さく出る」という誤表示になる。
  //   そこで「直後に化学式が続かない位置（日本語・句読点・行末など）」に限って
  //   質量数とみなす。反応式の中では必ず直後に
  //     ・下付き数字（H₂O → <sub> タグ）
  //     ・電荷記号（+ / - / − / <sup> タグ）
  //     ・空白＋演算子（ ＋ 、→ など）
  //   のいずれかが来るため、この条件だけで係数を確実に除外できる。
  const ISOTOPE_ELEMENTS = [
    'Cl', 'Ca', 'Cu', 'Co', 'Cr', 'Mg', 'Mn', 'Na', 'Ne', 'Ni', 'Ar', 'Ag', 'Al',
    'Ba', 'Be', 'Br', 'Fe', 'He', 'Li', 'Pb', 'Si', 'Sn', 'Zn',
    'B', 'C', 'F', 'H', 'I', 'K', 'N', 'O', 'P', 'S', 'U', 'A', 'X',
  ].join('|');
  //   直後に来てよい文字（＝ここで途切れるなら化学式ではない）。
  //   ASCII の "(" は Cu(NO₃)₂ / Al(OH)₃ のように化学式が続く合図なので許可しない。
  //   全角の「（」は日本語の注記（26Mg（相対質量…）なので許可する。
  const AFTER_ISOTOPE = '[ぁ-んァ-ヶー一-龥、。，．・「」『』（）)：:；;％%\\n]';
  const ISOTOPE_RE = new RegExp(
    `(?<![A-Za-z0-9<\\-−])([0-9]{1,3})(${ISOTOPE_ELEMENTS})(?![A-Za-z0-9])` +
      `(?=${AFTER_ISOTOPE}|\\s*[-−–]\\s*[0-9]{1,3}[A-Z]|$)`,
    'g'
  );
  //   さらに、反応式の行では行末の「＋ 2Ag」のような係数も拾ってしまうため、
  //   反応の矢印を含む行は質量数変換の対象から丸ごと外す。
  //   （化学基礎の反応式に核反応＝質量数表記が現れることは無い）
  const REACTION_LINE = /[→⟶⟵←⇄⇌⇔⟷]/;
  processedText = processedText
    .split('\n')
    .map((line) => (REACTION_LINE.test(line)
      ? line
      : line.replace(ISOTOPE_RE, `<sup class="${SUPERSCRIPT_CLASS} font-bold pr-[1px] select-none">$1</sup>$2`)))
    .join('\n');

  // First, apply custom highlights to the text. We surround them with custom tags <hl>...</hl>
  let highlightedText = processedText;
  if (highlights.length > 0) {
    // Sort highlights by length descending to avoid partial matches
    const sortedHighlights = [...highlights].sort((a, b) => b.length - a.length);
    sortedHighlights.forEach(hl => {
      if (!hl.trim()) return;
      // Simple string replacement for all occurrences
      // Escape for regex
      const escaped = hl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(`(${escaped})`, 'g');
      // We must avoid highlighting inside already created <hl> tags
      highlightedText = highlightedText.replace(regex, '<hl>$1</hl>');
    });
  }

  // Split text by a regex that matches chemical formulas, math variables, AND our <hl> tags
  // BUT we must avoid matching inside HTML tags like <u> or </u> or <hl>.
  
  // Split by HTML tags (e.g., <u>, </u>, <br/>, <hl>, </hl>) and HTML comments.
  //
  // ★HTMLコメントを必ずトークンとして切り出すこと★
  // コメント（例：整形エンジンの冪等マーカー <!--fmt-v1-->）を素通しせずに
  // 下の化学式変換へ流すと、末尾の "-->" の "-" がイオンの電荷として
  // <sup>-</sup> に化けてコメントが閉じなくなり、
  // 「以降の解説本文がまるごとブラウザに飲み込まれて消える」という致命的な事故になる。
  const tagRegex = /(<!--[\s\S]*?-->|<\/?[a-z][a-z0-9]*[^>]*>)/gi;
  const tokens = highlightedText.split(tagRegex);

  const htmlString = tokens.map((token) => {
    // HTML コメントはそのまま（中身を一切加工せずに）出力する
    if (token.startsWith('<!--') && token.endsWith('-->')) {
      return token;
    }

    // If it's an HTML tag, render it directly
    if (token.match(/^<\/?[a-z][a-z0-9]*[^>]*>$/i)) {
      // Replace <u> with our styled version (marker-like UI)
      if (token.toLowerCase() === '<u>') {
        return '<span class="bg-gradient-to-t from-[#F9E79F] to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat font-bold px-1">';
      }
      if (token.toLowerCase() === '</u>') {
        return '</span>';
      }
      if (token.toLowerCase() === '<hl>') {
        return '<mark class="bg-yellow-200 text-gray-900 rounded-sm px-1 shadow-sm font-bold mx-0.5 transition-colors">';
      }
      if (token.toLowerCase() === '</hl>') {
        return '</mark>';
      }
      return token;
    }

    // It's normal text, now we can safely look for chemical formulas
    // Matches: A sequence of letters, optional digits, optional charge
    // 末尾の +/- は「電荷」のときだけ取り込む。直後に数字が続く場合
    // （35Cl-35Cl の同位体ペアや mol-1 のような表記）はハイフンであって電荷ではない。
    const chemRegex = /([A-Za-z]+[0-9]*(?:[+-](?![0-9]))?)/g;
    const parts = token.split(chemRegex);

    return parts.map((part) => {
      if (part.match(/^[A-Za-z]+[0-9]*[+-]?$/)) {
        // Check if it's an ion (ends with + or -). Compact notation is ambiguous:
        // Cu2+ is Cu²⁺, NH4+ is NH₄⁺, SO42- is SO₄²⁻. Element数と末尾数字から判定する。
        const ionMatch = part.match(/^([A-Za-z]+)([0-9]*)([+-])$/);
        
        let elements = '';

        if (ionMatch) {
          const letters = ionMatch[1];
          const digits = ionMatch[2];
          const sign = ionMatch[3];
          const elementSymbols = letters.match(/[A-Z][a-z]?/g) || [];
          const isSingleElement = elementSymbols.length === 1 && elementSymbols[0] === letters;
          let base = letters;
          let charge = sign;

          if (digits && isSingleElement) {
            charge = `${digits}${sign}`;
          } else if (digits.length > 1) {
            base = `${letters}${digits.slice(0, -1)}`;
            charge = `${digits.slice(-1)}${sign}`;
          } else if (digits) {
            base = `${letters}${digits}`;
          }
          
          // Process base for subscripts (e.g., NH4 / SO4).
          const baseParts = base.split(/([0-9]+)/);
          const formattedBase = baseParts.map((bp) => {
            if (bp.match(/^[0-9]+$/)) {
              return `<sub class="${SUBSCRIPT_CLASS}">${bp}</sub>`;
            }
            return bp;
          }).join('');
          
          elements = `${formattedBase}<sup class="${SUPERSCRIPT_CLASS}">${charge}</sup>`;
        } else {
          // Normal molecule like H2O, CO2, or just text like A, B
          const molParts = part.split(/([0-9]+)/);
          elements = molParts.map((mp) => {
            if (mp.match(/^[0-9]+$/)) {
              return `<sub class="${SUBSCRIPT_CLASS}">${mp}</sub>`;
            }
            return mp;
          }).join('');
        }

        // If it's a single letter (like A, B, x, y), italicize it as a math variable
        const isSingleLetter = /^[A-Za-z]$/.test(part);
        const fontClass = isSingleLetter ? 'font-serif italic' : 'font-serif';

        return `<span class="${fontClass} text-[1.05em] tracking-wide mx-[1px]" style="font-family: 'Cambria Math', 'Times New Roman', serif;">${elements}</span>`;
      }
      
      // Normal text, replace newlines with <br/>
      if (part) {
        return part.replace(/\n/g, '<br/>');
      }
      return '';
    }).join('');
  }).join('');

  return <span dangerouslySetInnerHTML={{ __html: htmlString }} />;
}
