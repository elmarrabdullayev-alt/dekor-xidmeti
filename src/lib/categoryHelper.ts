import { imageService } from './imageService.ts';
import { CATEGORIES } from '../data/categories.ts';
import type { CategoryInfo } from '../types/index.ts';
import { normalizeCategoryIdentifier, getCategoryAliases } from './categoryMapping.ts';

/**
 * Single Authoritative Source of Truth for Decor Category Cover Image Resolution.
 * Priority:
 * 1. group_name = category_image, target_id = canonical category slug, is_cover = true
 * 2. legacy group_name = category_cover (is_cover = true, backwards compatibility)
 * 3. Any category_image/category_cover record for this canonical slug or alias
 * 4. Category-specific static fallback only when no managed image exists at all
 */
export function getCategoryCoverImage(categoryIdentifier: string | CategoryInfo): string {
  if (!categoryIdentifier) {
    return '/images/dreamart-toy-dekoru-qizili-altar.webp';
  }

  const rawId = typeof categoryIdentifier === 'string'
    ? categoryIdentifier
    : (categoryIdentifier.slug || categoryIdentifier.canonicalSlug || categoryIdentifier.id);

  const canonical = normalizeCategoryIdentifier(rawId);
  const aliases = getCategoryAliases(rawId);
  const allImages = imageService.getAllImages();

  // Priority 1: Canonical category_image with targetId === canonical and is_cover === true
  const canonicalCover = allImages.find(
    (img) =>
      (img.section === 'category_image' || img.group === 'category_image') &&
      img.targetId === canonical &&
      img.isCover === true &&
      Boolean(img.url)
  );
  if (canonicalCover?.url) {
    return canonicalCover.url;
  }

  // Priority 1B: Canonical category_image matching recognized aliases with is_cover === true
  const canonicalAliasCover = allImages.find(
    (img) =>
      (img.section === 'category_image' || img.group === 'category_image') &&
      aliases.includes(img.targetId) &&
      img.isCover === true &&
      Boolean(img.url)
  );
  if (canonicalAliasCover?.url) {
    return canonicalAliasCover.url;
  }

  // Priority 2: Legacy category_cover record with is_cover === true
  const legacyCover = allImages.find(
    (img) =>
      (img.section === 'category_cover' || img.group === 'category_cover') &&
      (img.targetId === canonical || aliases.includes(img.targetId)) &&
      img.isCover === true &&
      Boolean(img.url)
  );
  if (legacyCover?.url) {
    return legacyCover.url;
  }

  // Priority 2B: Any canonical category_image (first uploaded if none marked is_cover)
  const firstCatImage = allImages.find(
    (img) =>
      (img.section === 'category_image' || img.group === 'category_image') &&
      (img.targetId === canonical || aliases.includes(img.targetId)) &&
      Boolean(img.url)
  );
  if (firstCatImage?.url) {
    return firstCatImage.url;
  }

  // Priority 2C: Any legacy category_cover image
  const firstLegacyCover = allImages.find(
    (img) =>
      (img.section === 'category_cover' || img.group === 'category_cover') &&
      (img.targetId === canonical || aliases.includes(img.targetId)) &&
      Boolean(img.url)
  );
  if (firstLegacyCover?.url) {
    return firstLegacyCover.url;
  }

  // Priority 3: Category-specific static fallback only when no managed image exists at all
  const staticCat = CATEGORIES.find(
    (c) => c.slug === canonical || c.canonicalSlug === canonical || c.id === canonical || aliases.includes(c.slug)
  );
  if (staticCat?.heroImage) {
    return staticCat.heroImage;
  }

  if (typeof categoryIdentifier !== 'string' && categoryIdentifier?.heroImage) {
    return categoryIdentifier.heroImage;
  }

  return '/images/dreamart-toy-dekoru-qizili-altar.webp';
}
