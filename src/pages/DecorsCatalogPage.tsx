import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/categories';
import { DecorCategorySlug, DecorItem } from '../types';
import { DecorCard } from '../components/decor/DecorCard';
import { SeoHead } from '../components/layout/SeoHead';
import { imageService } from '../lib/imageService';
import { getCategoryCoverImage } from '../lib/categoryHelper';
import { getOptimizedImageUrl, getSrcSet } from '../lib/responsiveImage';
import { ArrowRight } from 'lucide-react';

interface DecorsCatalogPageProps {
  decors: DecorItem[];
  navigate: (path: string) => void;
  onOpenQuoteModal: (decorName?: string) => void;
}

export const DecorsCatalogPage: React.FC<DecorsCatalogPageProps> = ({
  decors,
  navigate,
  onOpenQuoteModal
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return () => unsub();
  }, []);

  const filteredDecors = decors.filter(d => {
    const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
    const matchCity = selectedCity === 'all' || d.city.toLowerCase().includes(selectedCity.toLowerCase());
    return matchCat && matchCity;
  });

  return (
    <>
      <SeoHead
        title="Bütün Dekorlar və Xidmətlər | DreamArt Weddings"
        description="Toy, nişan, xına, ad günü, zal dekorasiyası və xonça xidməti layihələri kataloqu. Bakı və regionlar üçün premium dekorasiya."
        canonicalPath="/dekorlar"
      />

      <div className="bg-[#0B0B0B] text-white py-14 sm:py-20 min-h-screen border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              KOLLEKSİYA VƏ LAYİHƏLƏR
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-3">
              Dekorlar Kataloqu
            </h1>
            <p className="text-xs sm:text-sm text-white/70 font-light max-w-md mx-auto">
              Tədbirinizə uyğun ən zövqlü və unikal dekor konseptlərini kəşf edin.
            </p>
          </div>

          {/* Category Showcase Cards - Unified single source of truth across website */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/10">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-medium font-sans">
                DEKOR KATEQORİYALARI
              </span>
              <span className="text-xs text-white/50">
                11 Əsas Xidmət İstiqaməti
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {CATEGORIES.slice(0, 6).map((cat) => {
                const coverUrl = getCategoryCoverImage(cat);
                const isSelected = selectedCategory === cat.slug;
                return (
                  <div
                    key={cat.id}
                    id={`catalog-cat-card-${cat.slug}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${cat.name} kateqoriyası üzrə layihələr`}
                    onClick={() => setSelectedCategory(selectedCategory === cat.slug ? 'all' : cat.slug)}
                    className={`bg-[#141414] rounded-sm overflow-hidden border transition-all duration-300 group cursor-pointer flex flex-col ${
                      isSelected
                        ? 'border-[#C5A059] ring-1 ring-[#C5A059]'
                        : 'border-white/10 hover:border-[#C5A059]/60'
                    }`}
                  >
                    <div className="aspect-4/3 overflow-hidden bg-[#1A1A1A] relative">
                      <img
                        key={coverUrl}
                        src={getOptimizedImageUrl(coverUrl, 360)}
                        srcSet={getSrcSet(coverUrl, [240, 360, 480])}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 16vw"
                        width={300}
                        height={225}
                        alt={cat.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 brightness-90"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    </div>
                    <div className="p-2.5 bg-[#111111] flex items-center justify-between border-t border-white/5">
                      <span className="text-[11px] sm:text-xs font-medium text-white/90 group-hover:text-[#E5C378] transition-colors truncate">
                        {cat.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-[#C5A059] shrink-0 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10 pb-6 border-b border-white/10">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-xs tracking-wider uppercase transition-all rounded-sm cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-[#C5A059] text-[#0B0B0B] font-semibold'
                  : 'bg-[#161616] text-white/75 border border-white/10 hover:border-[#C5A059]'
              }`}
            >
              Hamısı ({decors.length})
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 text-xs tracking-wider uppercase transition-all rounded-sm cursor-pointer ${
                  selectedCategory === cat.slug
                    ? 'bg-[#C5A059] text-[#0B0B0B] font-semibold'
                    : 'bg-[#161616] text-white/75 border border-white/10 hover:border-[#C5A059]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          {filteredDecors.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredDecors.map((decor) => (
                <DecorCard
                  key={decor.id}
                  decor={decor}
                  onClick={(slug) => navigate(`/dekorlar/${slug}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#121212] border border-white/10 rounded-sm">
              <p className="text-xs sm:text-sm text-white/60 mb-4 font-light">Bu seçim üzrə heç bir dekor tapılmadı.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedCity('all');
                }}
                className="bg-[#C5A059] text-[#0B0B0B] hover:bg-[#D4AF37] px-6 py-2.5 text-xs uppercase tracking-wider font-medium transition-colors rounded-sm cursor-pointer"
              >
                Filtrləri sıfırla
              </button>
            </div>
          )}

          {/* Quote CTA Box */}
          <div className="mt-16 p-8 sm:p-12 bg-[#121212] border border-[#C5A059]/30 rounded-sm text-center max-w-3xl mx-auto">
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-2">
              Axtardığınız tərzi tapmadınız?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 mb-6 max-w-lg mx-auto font-light leading-relaxed">
              Biz hər bir müştəri üçün unikal, təkrarolunmaz və fərdi eskiz əsasında dekorasiya hazırlayırıq.
            </p>
            <button
              onClick={() => onOpenQuoteModal('Fərdi Dekor Sorğusu')}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer"
            >
              Fərdi konsept sifariş et
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
