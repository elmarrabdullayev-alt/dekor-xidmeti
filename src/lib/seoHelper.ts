/**
 * SEO helper for Azerbaijani character normalization, slug generation,
 * SEO file naming, and automated meta tags suggestion.
 */

export function transliterateAzerbaijani(text: string): string {
  if (!text) return '';
  const azMap: Record<string, string> = {
    'ə': 'e', 'Ə': 'E',
    'ı': 'i', 'I': 'I', 'İ': 'I',
    'ö': 'o', 'Ö': 'O',
    'ü': 'u', 'Ü': 'U',
    'ç': 'c', 'Ç': 'C',
    'ş': 's', 'Ş': 'S',
    'ğ': 'g', 'Ğ': 'G'
  };

  return text
    .split('')
    .map(char => azMap[char] || char)
    .join('');
}

export function generateSlug(text: string): string {
  const normalized = transliterateAzerbaijani(text)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
  return normalized || 'dekor';
}

export function generateSeoFilename(decorName: string, categoryName: string, index: number = 1, extension: string = 'webp'): string {
  const basePart = generateSlug(`${decorName} ${categoryName}`);
  const paddedIndex = index.toString().padStart(2, '0');
  return `${basePart}-${paddedIndex}.${extension}`;
}

export interface SuggestedSeoFields {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  imageAltText: string;
  suggestedFilename: string;
}

export function generateAutoSeo(decorName: string, categoryName: string, city: string = 'Bakı'): SuggestedSeoFields {
  const safeName = decorName.trim() || 'Premium Dekor';
  const safeCat = categoryName.trim() || 'Dekor';
  const safeCity = city.trim() || 'Bakı';

  const slug = generateSlug(`${safeName}-${safeCity}`);
  const seoTitle = `${safeName} | ${safeCity} ${safeCat} | DreamArt Events`;
  const metaDescription = `${safeCity} şəhərində ${safeName.toLowerCase()} xidməti. Peşəkar quraşdırma, zərif dizayn və tədbir üçün xüsusi dekor həlləri.`;
  const imageAltText = `${safeCity} şəhərində ${safeName.toLowerCase()} və ${safeCat.toLowerCase()} layihəsi`;
  const suggestedFilename = generateSeoFilename(safeName, safeCat, 1, 'webp');

  return {
    slug,
    seoTitle,
    metaDescription,
    imageAltText,
    suggestedFilename
  };
}

export function generateDecorSlug(decorName: string, category: string, city: string = 'Bakı'): string {
  return generateSlug(`${decorName}-${city}`);
}

export function generateSeoTitle(decorName: string, categoryName: string, city: string = 'Bakı'): string {
  const safeName = decorName.trim() || 'Dekor';
  const safeCity = city.trim() || 'Bakı';
  return `${safeName} | ${safeCity} ${categoryName} | DreamArt Events`;
}

export function generateMetaDescription(decorName: string, categoryName: string, city: string = 'Bakı', style?: string): string {
  const safeName = decorName.trim() || 'Dekor';
  const safeCity = city.trim() || 'Bakı';
  const styleStr = style ? ` (${style})` : '';
  return `${safeCity} şəhərində ${safeName.toLowerCase()}${styleStr} tərtibatı. Zövqlü floristika, təbii güllər və peşəkar quraşdırma.`;
}

export function generateImageAltText(decorName: string, categoryName: string, city: string = 'Bakı'): string {
  return `${city} ${categoryName} - ${decorName}`;
}

export function generateSeoFileName(decorName: string, category: string, city: string = 'Bakı', extension: string = 'webp'): string {
  return generateSeoFilename(`${decorName}-${city}`, category, 1, extension);
}
