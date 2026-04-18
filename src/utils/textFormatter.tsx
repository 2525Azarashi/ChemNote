import React from 'react';

export function formatText(text: string, highlights: string[] = []) {
  if (!text) return null;

  // First, apply custom highlights to the text. We surround them with custom tags <hl>...</hl>
  let highlightedText = text;
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
