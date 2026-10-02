export const PRESERVED_SLUG = 'klassik-gence-intim-nisan-ve-xonca-tertibati-gence';
export const TARGET_PUBLIC_TITLE = 'Təbii Ağac Budaqları və Sıx Ağ Güllərlə Zərif Masa Dekoru';

function sanitizeDecorTextInternal(text: string): string {
  // First handle multi-word compound expressions
  let result = text.replace(/(?:[\u0130\u0131iI]\u0307?[\u006e\u004e][\u0074\u0054][\u0130\u0131iI]\u0307?[\u006d\u004d])\s+([mM][aA][sS][aA])/gu, (_match, masa) => {
    if (masa === 'MASA') return 'ZƏRİF MASA';
    if (masa === 'Masa') return 'Zərif Masa';
    return 'zərif masa';
  });

  // Replace standalone or punctuated variations
  const regex = /(^|[^\p{L}\p{N}])([\u0130\u0131iI]\u0307?[\u006e\u004e][\u0074\u0054][\u0130\u0131iI]\u0307?[\u006d\u004d])(?=$|[^\p{L}\p{N}])/giu;

  result = result.replace(regex, (_fullMatch, prefix, word) => {
    const chars: string[] = Array.from(word);
    const upperCount = chars.filter((c: string) => c === c.toUpperCase() && c !== c.toLowerCase()).length;
    if (upperCount >= 4) {
      return prefix + 'ZƏRİF';
    }
    const firstChar = chars[0] || '';
    if (firstChar === firstChar.toUpperCase() && firstChar !== firstChar.toLowerCase()) {
      return prefix + 'Zərif';
    }
    return prefix + 'zərif';
  });

  return result;
}

/**
 * Sanitizes any public-facing text string, replacing sensitive project naming
 * while strictly preserving the URL slug: "klassik-gence-intim-nisan-ve-xonca-tertibati-gence".
 */
export function sanitizeDecorText(text: string | undefined | null): string {
  if (!text || typeof text !== 'string') return '';
  if (text.includes(PRESERVED_SLUG)) {
    const placeholder = '___PRESERVED_TARGET_SLUG___';
    const safeText = text.split(PRESERVED_SLUG).join(placeholder);
    const sanitized = sanitizeDecorTextInternal(safeText);
    return sanitized.split(placeholder).join(PRESERVED_SLUG);
  }
  return sanitizeDecorTextInternal(text);
}
