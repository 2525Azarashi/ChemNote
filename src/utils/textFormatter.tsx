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
      // Replace <u> with our styled version
      return token.replace(/<u>/gi, '<u class="decoration-[#D9A0A0] decoration-4 underline-offset-4">');
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
              return `<sub class="text-[0.7em] align-sub">${bp}</sub>`;
            }
            return bp;
          }).join('');
          
          elements = `${formattedBase}<sup class="text-[0.7em] align-super">${charge}</sup>`;
        } else {
          // Normal molecule like H2O, CO2, or just text like A, B
          const molParts = part.split(/([0-9]+)/);
          elements = molParts.map((mp) => {
            if (mp.match(/^[0-9]+$/)) {
              return `<sub class="text-[0.7em] align-sub">${mp}</sub>`;
            }
            return mp;
          }).join('');
        }

        return `<span class="font-serif text-[1.1em] tracking-wide mx-[1px]">${elements}</span>`;
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
