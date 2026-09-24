import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/categories';

interface CategorySectionProps {
  onSelectCategory: (slug: string) => void;
  onViewAll?: () => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({ onSelectCategory, onViewAll }) => {
  return (
    <section id="categories-section" className="py-20 sm:py-28 bg-[#0B0B0B] border-b border-[#C5A059]/15 relative overflow-hidden">
      {/* Delicate background ambient tint */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with artistic overline & calligraphy accent */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-6 h-px bg-[#C5A059]" />
              <span className="font-script text-2xl sm:text-3xl text-[#E5C378] tracking-wide select-none">
                Zərif Toxunuşlar
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-[1.12]">
              Tədbir Növünə Görə Kolleksiyalar
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light mt-2.5 max-w-xl leading-relaxed">
              Hər bir mərasimin özünəməxsus aurası və rəng fəlsəfəsi var. İstədiyiniz xidmət kateqoriyasını seçərək layihələrimizlə tanış olun.
            </p>
          </div>

          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] uppercase tracking-wider text-[#C5A059] hover:text-[#F5E6CA] transition-colors cursor-pointer group shrink-0 pb-1 border-b border-[#C5A059]/30 hover:border-[#C5A059]"
          >
            <span className="font-medium">Bütün dekor kateqoriyaları</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 7 Boutique Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3.5 sm:gap-4 lg:gap-5">
          {CATEGORIES.map((cat, index) => (
            <div
              key={cat.id}
              id={`category-card-${cat.slug}`}
              onClick={() => onSelectCategory(cat.slug)}
              className="group relative flex flex-col bg-[#12110E] rounded-sm overflow-hidden border border-[#C5A059]/20 hover:border-[#C5A059]/80 shadow-lg hover:shadow-[0_8px_30px_rgba(197,160,89,0.2)] transition-all duration-500 cursor-pointer"
            >
              {/* Image Frame with Editorial Proportions */}
              <div className="relative aspect-[3/4.4] overflow-hidden bg-[#171614]">
                <img
                  src={cat.heroImage}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out brightness-90 contrast-[1.03]"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes('dreamart-toy-dekoru-qizili-altar.webp')) {
                      target.src = '/images/dreamart-toy-dekoru-qizili-altar.webp';
                    }
                  }}
                />

                {/* Multi-layered luxury scrim: Ensures text is deeply readable while image shines */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/35 to-black/10 group-hover:via-black/25 transition-all duration-500" />

                {/* Subtle Interior Hairline Framing for Boutique Presentation */}
                <div className="absolute inset-2.5 sm:inset-3 border border-white/10 group-hover:border-[#C5A059]/40 transition-colors duration-500 pointer-events-none rounded-xs" />

                {/* Top index number */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="font-mono text-[10px] text-[#E5C378] tracking-widest bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-xs border border-[#C5A059]/30">
                    0{index + 1}
                  </span>
                </div>

                {/* Bottom Overlay Content */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-4 z-10 flex flex-col justify-end">
                  <h3 className="font-serif text-sm sm:text-base text-[#FAF8F5] group-hover:text-[#F5E6CA] transition-colors leading-snug font-normal drop-shadow-md">
                    {cat.name}
                  </h3>

                  <div className="mt-2.5 pt-2 border-t border-white/10 group-hover:border-[#C5A059]/40 flex items-center justify-between transition-colors">
                    <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-medium font-sans opacity-90 group-hover:opacity-100">
                      Kəşf et
                    </span>
                    <div className="w-6 h-6 rounded-full bg-black/40 group-hover:bg-[#C5A059] border border-white/15 group-hover:border-[#C5A059] flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-3 h-3 text-[#C5A059] group-hover:text-[#0A0A0A] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

