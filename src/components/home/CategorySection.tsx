import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { imageService } from '../../lib/imageService';
import { getOptimizedImageUrl, getSrcSet } from '../../lib/responsiveImage';
import { store } from '../../lib/store';
import { CategoryInfo } from '../../types';
import { getCategoryAliases, normalizeCategoryIdentifier, CATEGORY_DECOR_MAP } from '../../lib/categoryMapping';

interface CategorySectionProps {
  onSelectCategory: (slug: string) => void;
  onViewAll?: () => void;
}

/**
 * Resolves the real Supabase admin-managed cover image for each category.
 * Guaranteed to match desktop and mobile seamlessly without static unsplash fallback overriding Supabase.
 */
export const getCategoryCoverImage = (cat: CategoryInfo): string => {
  const canonical = normalizeCategoryIdentifier(cat.slug || cat.canonicalSlug || cat.id);
  const aliases = getCategoryAliases(cat.slug || cat.canonicalSlug || cat.id);

  // 1. Direct match by slug, canonicalSlug, id or any alias for category_cover
  for (const alias of aliases) {
    const directCover = imageService.getCoverImage(alias, 'category_cover');
    if (directCover && !directCover.includes('unsplash.com')) {
      return directCover;
    }
  }

  // 2. Direct match across any section by slug, canonicalSlug, or alias
  for (const alias of aliases) {
    const anySectionCover = imageService.getCoverImage(alias);
    if (anySectionCover && !anySectionCover.includes('unsplash.com')) {
      return anySectionCover;
    }
  }

  // 3. Decor projects belonging to this category from store (hydrated with real Supabase images)
  const categoryProjects = store.getDecorsByCategory(canonical as any);
  if (categoryProjects && categoryProjects.length > 0) {
    for (const proj of categoryProjects) {
      const projCover =
        imageService.getCoverImage(proj.id, 'decor_project') ||
        imageService.getCoverImage(proj.slug, 'decor_project') ||
        imageService.getCoverImage(proj.id) ||
        imageService.getCoverImage(proj.slug);

      if (projCover && !projCover.includes('unsplash.com')) {
        return projCover;
      }
      if (proj.mainImage && !proj.mainImage.includes('unsplash.com')) {
        return proj.mainImage;
      }
    }
  }

  // 4. Default decor ID mapping for admin-managed projects (decor-4 for adgunu, decor-2 for ozelgunler, etc.)
  const mappedId = CATEGORY_DECOR_MAP[canonical] || CATEGORY_DECOR_MAP[cat.slug];
  if (mappedId) {
    const mappedCover =
      imageService.getCoverImage(mappedId, 'decor_project') ||
      imageService.getCoverImage(mappedId);
    if (mappedCover && !mappedCover.includes('unsplash.com')) {
      return mappedCover;
    }
  }

  // 5. Look for any managed Supabase image matching category slug or keywords
  const allImages = imageService.getAllImages();
  const slugClean = canonical.toLowerCase().replace(/[^a-z0-9]/g, '');
  const match = allImages.find((img) => {
    if (!img.url || img.url.includes('unsplash.com')) return false;
    const targetClean = (img.targetId || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const nameClean = (img.targetName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const altClean = (img.altText || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return (
      targetClean.includes(slugClean) ||
      nameClean.includes(slugClean) ||
      altClean.includes(slugClean)
    );
  });
  if (match && match.url) {
    return match.url;
  }

  // 6. Direct cover if found (including fallback)
  for (const alias of aliases) {
    const fallbackCover = imageService.getCoverImage(alias, 'category_cover');
    if (fallbackCover) return fallbackCover;
  }

  // 7. Project main image if present
  if (categoryProjects && categoryProjects[0]?.mainImage) {
    return categoryProjects[0].mainImage;
  }

  // 8. Category heroImage
  return cat.heroImage;
};

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory, onViewAll }) => {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return () => unsub();
  }, []);

  return (
    <section id="categories-section" className="py-14 sm:py-20 bg-[#0B0B0B] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with top-right link matching mockup */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-medium font-sans block mb-1">
              TƏDBİR NÖVÜNƏ GÖRƏ
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Xidmətlərimiz
            </h2>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#C5A059] hover:text-[#E5C378] transition-colors cursor-pointer group"
          >
            <span>Bütün dekor kateqoriyalarına bax</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const cmsCoverUrl = getCategoryCoverImage(cat);
            const targetImages = imageService.getImagesByTarget(cat.slug, 'category_cover');
            const altText = targetImages[0]?.altText || cat.name;

            return (
              <div
                key={cat.id}
                id={`category-card-${cat.slug}`}
                role="button"
                tabIndex={0}
                aria-label={`${cat.name} dekorasiyası kateqoriyasına bax`}
                onClick={() => onSelectCategory(cat.slug)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectCategory(cat.slug);
                  }
                }}
                className="bg-[#141414] rounded-sm overflow-hidden border border-white/10 hover:border-[#C5A059]/80 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col focus:outline-hidden focus:ring-1 focus:ring-[#C5A059]"
              >
                {/* Image container */}
                <div className="aspect-3/4 overflow-hidden bg-[#1A1A1A] relative">
                  <img
                    key={cmsCoverUrl}
                    src={getOptimizedImageUrl(cmsCoverUrl, 480)}
                    srcSet={getSrcSet(cmsCoverUrl, [360, 480, 640])}
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    width={400}
                    height={533}
                    alt={altText}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>

                {/* Card Footer with Title and Arrow */}
                <div className="p-3 bg-[#111111] flex items-center justify-between border-t border-white/5">
                  <span className="text-xs sm:text-[13px] font-medium text-white/90 group-hover:text-[#E5C378] transition-colors truncate">
                    {cat.name}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

