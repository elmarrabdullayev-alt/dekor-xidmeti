export const OFFICIAL_WHATSAPP_NUMBER = '994502311728';
export const DISPLAY_PHONE = '050 231 17 28';
export const TEL_PHONE = '+994502311728';

export const DEFAULT_QUOTE_MESSAGE = 'Salam, DreamArt Weddings dekor xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';

export interface WhatsAppQuoteContext {
  categorySlug?: string;
  categoryName?: string;
  decorName?: string;
  venueName?: string;
  city?: string;
  isProject?: boolean;
  customMessage?: string;
}

/**
 * Builds a standardized, context-aware WhatsApp quote URL.
 * Exactly adheres to DreamArt Weddings official requirements:
 * Official Number: 994502311728
 */
export function getWhatsAppQuoteUrl(context?: string | WhatsAppQuoteContext): string {
  let message = DEFAULT_QUOTE_MESSAGE;

  if (typeof context === 'string') {
    const trimmed = context.trim();
    const lower = trimmed.toLowerCase();

    if (lower === 'toy-dekoru' || (lower.includes('toy') && lower.includes('dekor'))) {
      message = 'Salam, DreamArt Weddings toy dekoru xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (lower === 'nisan-dekoru' || lower.includes('nişan') || lower.includes('nisan')) {
      message = 'Salam, DreamArt Weddings nişan dekoru xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (lower === 'xina-dekoru' || lower.includes('xına') || lower.includes('xina')) {
      message = 'Salam, DreamArt Weddings xına dekoru xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (lower === 'xonca-xidmeti' || lower.includes('xonça') || lower.includes('xonca')) {
      message = 'Salam, DreamArt Weddings xonça xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (lower.includes('ad günü') || lower.includes('ad gunu')) {
      message = 'Salam, DreamArt Weddings ad günü dekoru xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (lower.includes('korporativ')) {
      message = 'Salam, DreamArt Weddings korporativ tədbir dekoru ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (lower.includes('zal dekoru') || lower.includes('şadlıq')) {
      message = 'Salam, DreamArt Weddings zal dekoru xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (lower.includes('restoran') || lower.includes('məkan') || lower.includes('mekan')) {
      message = 'Salam, DreamArt Weddings restoran və məkan dekoru üçün qiymət təklifi almaq istəyirəm.';
    } else if (lower.includes('layihə') || lower.includes('decor') || lower.includes('dekor')) {
      message = 'Salam, bu dekor layihəsi ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (trimmed.length > 0) {
      message = `Salam, DreamArt Weddings! "${trimmed}" ilə bağlı qiymət təklifi almaq istəyirəm.`;
    }
  } else if (context) {
    if (context.customMessage) {
      message = context.customMessage;
    } else if (context.venueName) {
      message = `Salam, ${context.venueName} məkanında dekor xidməti üçün qiymət təklifi almaq istəyirəm.`;
    } else if (context.isProject) {
      message = 'Salam, bu dekor layihəsi ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (context.decorName) {
      message = 'Salam, bu dekor layihəsi ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (context.categorySlug === 'toy-dekoru' || context.categoryName?.toLowerCase().includes('toy')) {
      message = 'Salam, DreamArt Weddings toy dekoru xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (context.categorySlug === 'nisan-dekoru' || context.categoryName?.toLowerCase().includes('nişan')) {
      message = 'Salam, DreamArt Weddings nişan dekoru xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (context.categorySlug === 'xina-dekoru' || context.categoryName?.toLowerCase().includes('xına')) {
      message = 'Salam, DreamArt Weddings xına dekoru xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (context.categorySlug === 'xonca-xidmeti' || context.categoryName?.toLowerCase().includes('xonça')) {
      message = 'Salam, DreamArt Weddings xonça xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (context.categorySlug === 'korporativ-dekor' || context.categoryName?.toLowerCase().includes('korporativ')) {
      message = 'Salam, DreamArt Weddings korporativ tədbir dekoru ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (context.categorySlug === 'zal-dekoru' || context.categoryName?.toLowerCase().includes('zal')) {
      message = 'Salam, DreamArt Weddings zal dekoru xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (context.categorySlug === 'ad-gunu-dekoru' || context.categoryName?.toLowerCase().includes('ad günü')) {
      message = 'Salam, DreamArt Weddings ad günü dekoru xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';
    } else if (context.city) {
      message = `Salam, DreamArt Weddings ${context.city} üzrə dekor xidməti ilə bağlı qiymət təklifi almaq istəyirəm.`;
    }
  }

  return `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/**
 * Directly opens WhatsApp in a new tab on desktop or mobile app intent.
 */
export function openWhatsAppQuote(context?: string | WhatsAppQuoteContext): void {
  const url = getWhatsAppQuoteUrl(context);
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
