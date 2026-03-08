import React from 'react';

export function formatText(text: string) {
  if (!text) return null;

  // Split text by a regex that matches chemical formulas and math variables,
  // BUT we must avoid matching inside HTML tags like <u> or </u>.
  // We can do this by first splitting by HTML tags, then formatting the text content,
  // and finally joining everything back into a single HTML string.
  
  // Split by HTML tags (e.g., <u>, </u>, <br/>)
  const tagRegex = /(<\/?[a-z]+[^>]*>)/gi;
  const tokens = text.split(tagRegex);

  const htmlString = tokens.map((token) => {
    // If it's an HTML tag, render it directly
    if (token.match(/^<\/?[a-z]+[^>]*>$/i)) {
      // Replace <u> with our styled version (marker-like UI)
      if (token.toLowerCase() === '<u>') {
        return '<span class="bg-gradient-to-t from-[#F9E79F] to-transparent bg-[length:100%_40%] bg-bottom bg-no-repeat font-bold px-1">';
      }
      if (token.toLowerCase() === '</u>') {
        return '</span>';
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
