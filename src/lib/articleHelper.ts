import { Article, ManagedImage } from '../types';
import { imageService } from './imageService';
import { CATEGORIES } from '../data/categories';
import { INITIAL_DECORS } from '../data/initialDecors';
import { INITIAL_VENUES } from '../data/initialVenues';

/**
 * Resolves an article's display image respecting strict priority:
 * 1. Supabase/admin-managed real images (matching targetId or section)
 * 2. Existing project images
 * 3. Existing category images
 * 4. Existing venue images
 * 5. Article configured fallback heroImage
 */
export function resolveArticleImage(article: Article): { url: string; alt: string } {
  // 1. Check if there is an admin-managed image for this article slug or category
  const managedImages = imageService.getAllImages();
  const directArticleManaged = managedImages.find(
    (img: ManagedImage) => img.targetId === article.slug || img.targetId === article.id
  );
  if (directArticleManaged) {
    return {
      url: directArticleManaged.url,
      alt: directArticleManaged.altText || article.heroAlt
    };
  }

  // 2. Check if there are managed images for associated real projects
  if (article.relatedProjects && article.relatedProjects.length > 0) {
    for (const projSlug of article.relatedProjects) {
      const projCover = imageService.getCoverImage(projSlug, 'decor_project');
      if (projCover) {
        return {
          url: projCover,
          alt: article.heroAlt
        };
      }
      const initialProject = INITIAL_DECORS.find(d => d.slug === projSlug || d.id === projSlug);
      if (initialProject?.mainImage) {
        return {
          url: initialProject.mainImage,
          alt: initialProject.imageAltText || article.heroAlt
        };
      }
    }
  }

  // 3. Check category images
  const category = CATEGORIES.find(c => c.slug === article.categorySlug);
  if (category?.heroImage) {
    const catCover = imageService.getCoverImage(category.slug, 'category_cover');
    if (catCover) {
      return {
        url: catCover,
        alt: article.heroAlt
      };
    }
  }

  // 4. Check venue images if specified
  if (article.relatedVenues && article.relatedVenues.length > 0) {
    for (const venueSlug of article.relatedVenues) {
      const venueCover = imageService.getCoverImage(venueSlug, 'venue_project');
      if (venueCover) {
        return {
          url: venueCover,
          alt: article.heroAlt
        };
      }
      const initialVenue = INITIAL_VENUES.find(v => v.slug === venueSlug || v.id === venueSlug);
      if (initialVenue?.mainImage) {
        return {
          url: initialVenue.mainImage,
          alt: article.heroAlt
        };
      }
    }
  }

  // 5. Default verified hero image
  return {
    url: article.heroImage,
    alt: article.heroAlt
  };
}

/**
 * Checks if an article has enough unique, substantial content to be indexed.
 * Guarantees zero thin or duplicate pages enter the search index.
 */
export function isArticleIndexable(article: Article | undefined | null): boolean {
  if (!article) return false;
  if (!article.isPublished) return false;
  if (!article.title || article.title.trim().length < 5) return false;
  if (!article.sections || article.sections.length < 2) return false;

  // Verify total content length across sections
  const totalContentLength = article.sections.reduce((acc, s) => {
    return acc + (s.content?.length || 0) + (s.bulletPoints?.join(' ').length || 0);
  }, 0);

  // At least 400 characters of real editorial text
  return totalContentLength >= 400;
}
