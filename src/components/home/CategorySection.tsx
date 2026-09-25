import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';
import { imageService } from '../../lib/imageService';

interface CategorySectionProps {
  onSelectCategory: (slug: string) => void;
  onViewAll?: () => void;
}

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

        {/* 7 Category Cards Grid matching mockup */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const cmsCoverUrl = imageService.getCoverImage(cat.slug, 'category_cover', cat.heroImage);
            const targetImages = imageService.getImagesByTarget(cat.slug, 'category_cover');
            const altText = targetImages[0]?.altText || cat.name;

            return (
              <div
                key={cat.id}
                id={`category-card-${cat.slug}`}
                onClick={() => onSelectCategory(cat.slug)}
                className="bg-[#141414] rounded-sm overflow-hidden border border-white/10 hover:border-[#C5A059]/80 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col"
              >
                {/* Image container */}
                <div className="aspect-3/4 overflow-hidden bg-[#1A1A1A] relative">
                  <img
                    src={cmsCoverUrl}
                    alt={altText}
                    loading="lazy"
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

