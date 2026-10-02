/**
 * Category Identifier Mapping and Alias Resolution
 * Central source of truth for category slugs, aliases, and identifier normalization.
 */

export const CATEGORY_IDENTIFIER_MAP: Record<string, string> = {
  // Ad günü dekoru aliases
  'adgunu': 'ad-gunu-dekoru',
  'ad-gunu': 'ad-gunu-dekoru',
  'ad_gunu': 'ad-gunu-dekoru',
  'adgunudekoru': 'ad-gunu-dekoru',
  'adgunu-dekoru': 'ad-gunu-dekoru',
  'ad_gunu_dekoru': 'ad-gunu-dekoru',
  'ad-gunu-dekoru': 'ad-gunu-dekoru',
  '4': 'ad-gunu-dekoru',

  // Özəl günlər aliases
  'ozel': 'ozel-gunler-dekoru',
  'ozel-gun': 'ozel-gunler-dekoru',
  'ozel-gunler': 'ozel-gunler-dekoru',
  'ozel_gunler': 'ozel-gunler-dekoru',
  'ozelgunler': 'ozel-gunler-dekoru',
  'ozelgunlerdekoru': 'ozel-gunler-dekoru',
  'ozel-gunler-dekoru': 'ozel-gunler-dekoru',
  'ozel_gunler_dekoru': 'ozel-gunler-dekoru',
  '10': 'ozel-gunler-dekoru',

  // Toy dekoru aliases
  'toy': 'toy-dekoru',
  'toy_dekoru': 'toy-dekoru',
  'toy-dekoru': 'toy-dekoru',
  '1': 'toy-dekoru',

  // Nişan dekoru aliases
  'nisan': 'nisan-dekoru',
  'nisan_dekoru': 'nisan-dekoru',
  'nisan-dekoru': 'nisan-dekoru',
  '2': 'nisan-dekoru',

  // Xına dekoru aliases
  'xina': 'xina-dekoru',
  'xina_dekoru': 'xina-dekoru',
  'xina-dekoru': 'xina-dekoru',
  '3': 'xina-dekoru',

  // Korporativ dekor aliases
  'korporativ': 'korporativ-dekor',
  'korporativ_dekor': 'korporativ-dekor',
  'korporativ-tedbirler': 'korporativ-dekor',
  'korporativ-dekor': 'korporativ-dekor',
  '5': 'korporativ-dekor',

  // Zal dekoru aliases
  'zal': 'zal-dekoru',
  'zal_dekoru': 'zal-dekoru',
  'zal-dekoru': 'zal-dekoru',
  '6': 'zal-dekoru',

  // Xonça xidməti aliases
  'xonca': 'xonca-xidmeti',
  'xonca_xidmeti': 'xonca-xidmeti',
  'xonca-dekoru': 'xonca-xidmeti',
  'xonca-xidmeti': 'xonca-xidmeti',
  '7': 'xonca-xidmeti',

  // Həri süfrəsi aliases
  'heri': 'heri-sufresi',
  'heri_sufresi': 'heri-sufresi',
  'heri-dekoru': 'heri-sufresi',
  'heri-sufresi': 'heri-sufresi',
  '8': 'heri-sufresi',

  // Yubiley dekoru aliases
  'yubiley': 'yubiley-dekoru',
  'yubiley_dekoru': 'yubiley-dekoru',
  'yubiley-dekoru': 'yubiley-dekoru',
  '9': 'yubiley-dekoru',

  // Mağaza açılış dekoru aliases
  'magaza': 'magaza-acilis-dekoru',
  'magaza-acilis': 'magaza-acilis-dekoru',
  'magaza_acilis': 'magaza-acilis-dekoru',
  'magaza-acilisi': 'magaza-acilis-dekoru',
  'magaza-acilis-dekoru': 'magaza-acilis-dekoru',
  '11': 'magaza-acilis-dekoru',
};

/**
 * Normalizes any category identifier, slug or alias into its canonical slug.
 */
export function normalizeCategoryIdentifier(identifier: string): string {
  if (!identifier) return '';
  const clean = identifier.trim().toLowerCase().replace(/_/g, '-');
  return CATEGORY_IDENTIFIER_MAP[clean] || CATEGORY_IDENTIFIER_MAP[identifier.trim().toLowerCase()] || clean;
}

/**
 * Returns all recognized alias strings for a given category identifier.
 */
export function getCategoryAliases(identifier: string): string[] {
  if (!identifier) return [];
  const canonical = normalizeCategoryIdentifier(identifier);
  const aliases = new Set<string>([canonical, identifier]);

  for (const [alias, mapped] of Object.entries(CATEGORY_IDENTIFIER_MAP)) {
    if (mapped === canonical) {
      aliases.add(alias);
    }
  }

  return Array.from(aliases);
}

/**
 * Default decor project mapping for each category to ensure visual consistency
 */
export const CATEGORY_DECOR_MAP: Record<string, string> = {
  'toy-dekoru': 'decor-1',
  'nisan-dekoru': 'decor-2',
  'xina-dekoru': 'decor-3',
  'ad-gunu-dekoru': 'decor-4',
  'korporativ-dekor': 'decor-5',
  'zal-dekoru': 'decor-6',
  'xonca-xidmeti': 'decor-9',
  'heri-sufresi': 'decor-8',
  'yubiley-dekoru': 'decor-5',
  'ozel-gunler-dekoru': 'decor-2',
  'magaza-acilis-dekoru': 'decor-2',
};
