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

export function formatText(text: string, highlights: string[] = []) {
  if (!text) return null;

  // Replace * with proper math multiplication crosses
  let processedText = text.replace(
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

  // Replace isotopic notation like 12C, 35Cl, 10B, 24Mg with superscript representation.
  // We match numbers immediately preceded by non-alphanumeric and immediately followed by specific element symbols or A/B/X variables.
  processedText = processedText.replace(
    /(?<![A-Za-z0-9])([0-9]+)(C|B|Cl|Mg|H|O|N|S|P|Na|Ca|Fe|Cu|A|B)(?![A-Za-z0-9])/g,
    '<sup class="text-[0.75em] font-sans font-bold pr-[1px] select-none align-baseline relative -top-[0.35em]">$1</sup>$2'
  );

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
  
  // Split by HTML tags (e.g., <u>, </u>, <br/>, <hl>, </hl>)
  const tagRegex = /(<\/?[a-z][a-z0-9]*[^>]*>)/gi;
  const tokens = highlightedText.split(tagRegex);

  const htmlString = tokens.map((token) => {
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
    const chemRegex = /([A-Za-z]+[0-9]*[+-]?)/g;
    const parts = token.split(chemRegex);

    return parts.map((part) => {
      if (part.match(/^[A-Za-z]+[0-9]*[+-]?$/)) {
        // Check if it's an ion (ends with + or -)
        const ionMatch = part.match(/^([A-Za-z0-9]+?)([0-9]*[+-])$/);
        
        let elements = '';

        if (ionMatch) {
          // It's an ion like Cu2+, Cl-, SO42-
          const base = ionMatch[1];
          const charge = ionMatch[2];
          
          // Process base for subscripts (e.g., SO4 -> SO_4)
          const baseParts = base.split(/([0-9]+)/);
          const formattedBase = baseParts.map((bp) => {
            if (bp.match(/^[0-9]+$/)) {
              return `<sub class="text-[0.75em] font-sans">${bp}</sub>`;
            }
            return bp;
          }).join('');
          
          elements = `${formattedBase}<sup class="text-[0.75em] font-sans">${charge}</sup>`;
        } else {
          // Normal molecule like H2O, CO2, or just text like A, B
          const molParts = part.split(/([0-9]+)/);
          elements = molParts.map((mp) => {
            if (mp.match(/^[0-9]+$/)) {
              return `<sub class="text-[0.75em] font-sans">${mp}</sub>`;
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
