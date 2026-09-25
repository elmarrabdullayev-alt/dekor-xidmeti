import React from 'react';
import { CATEGORIES } from '../data/categories';
import { DecorCategorySlug, DecorItem } from '../types';
import { DecorCard } from '../components/decor/DecorCard';
import { SeoHead } from '../components/layout/SeoHead';
import { getCategoryServiceSchema, getFaqPageSchema, getBreadcrumbSchema } from '../lib/structuredData';
import { ArrowRight, Sparkles, MapPin } from 'lucide-react';

interface CategorySeoPageProps {
  categorySlug: DecorCategorySlug;
  decors: DecorItem[];
  navigate: (path: string) => void;
  onOpenQuoteModal: (decorName?: string) => void;
}

export const CategorySeoPage: React.FC<CategorySeoPageProps> = ({
  categorySlug,
  decors,
  navigate,
  onOpenQuoteModal
}) => {
  const category = CATEGORIES.find(c => c.slug === categorySlug);

  if (!category) {
    return (
      <div className="py-24 text-center bg-[#0B0B0B] text-white">
        <h2 className="text-2xl font-serif">Kateqoriya tapılmadı</h2>
      </div>
    );
  }

  // Filter real projects for this category
  const categoryProjects = decors.filter(d => d.category === categorySlug);

  const jsonLd = [
    getCategoryServiceSchema(category),
    getFaqPageSchema(category.faqs),
    getBreadcrumbSchema([
      { name: 'Ana səhifə', url: 'https://dreamart.az' },
      { name: category.name, url: `https://dreamart.az/${category.slug}` }
    ])
  ];

  return (
    <>
      <SeoHead
        title={category.metaTitle}
        description={category.metaDescription}
        canonicalPath={`/${category.slug}`}
        ogImage={category.heroImage}
        jsonLd={jsonLd}
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen">
        {/* Category Hero Banner */}
        <section className="relative h-[44vh] min-h-[340px] max-h-[480px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src={category.heroImage}
            alt={category.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-[0.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-3 font-medium">
              DEKORASİYA VƏ DİZAYN
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4 leading-tight">
              {category.seoH1}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/75 font-light max-w-2xl mx-auto leading-relaxed">
              {category.seoIntroduction}
            </p>
          </div>
        </section>

        {/* Real Projects Gallery */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-1 font-medium">
                REAL İŞLƏRİMİZ
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                {category.name} Üzrə Seçilmiş Layihələr
              </h2>
            </div>
            <div className="mt-3 sm:mt-0 text-xs uppercase tracking-wider text-white/50 font-mono">
              Cəmi {categoryProjects.length} layihə
            </div>
          </div>

          {categoryProjects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProjects.map((decor) => (
                <DecorCard
                  key={decor.id}
                  decor={decor}
                  onClick={(slug) => navigate(`/dekorlar/${slug}`)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-[#121212] border border-white/10 rounded-sm p-8">
              <p className="text-xs sm:text-sm text-white/60 mb-4 font-light">Bu kateqoriya üzrə yeni layihələr hazırlanır.</p>
              <button
                onClick={() => onOpenQuoteModal(category.name)}
                className="bg-[#C5A059] text-[#0B0B0B] hover:bg-[#D4AF37] px-6 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
              >
                Fərdi konsept sifariş et
              </button>
            </div>
          )}

          {/* Quick regional links for local SEO */}
          <div className="mt-14 p-6 sm:p-8 bg-[#121212] border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80 font-light">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>
                <strong className="font-medium text-white">{category.name}</strong> Bakı və digər bölgələrdə quraşdırılır:
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                onClick={() => navigate(`/${category.slug}/baki`)}
                className="px-3.5 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs tracking-wide uppercase font-medium rounded-sm transition-colors cursor-pointer"
              >
                Bakı
              </button>
              <button
                onClick={() => navigate(`/${category.slug}/sumqayit`)}
                className="px-3.5 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs tracking-wide uppercase font-medium rounded-sm transition-colors cursor-pointer"
              >
                Sumqayıt
              </button>
              <button
                onClick={() => navigate(`/${category.slug}/qebele`)}
                className="px-3.5 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs tracking-wide uppercase font-medium rounded-sm transition-colors cursor-pointer"
              >
                Qəbələ
              </button>
            </div>
          </div>
        </section>

        {/* Category Specific FAQ */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                {category.name.toUpperCase()} HAQQINDA
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Suallar və Ətraflı Məlumat
              </h2>
              <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
            </div>

            <div className="space-y-4">
              {category.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-[#141414] border border-white/10 hover:border-[#C5A059]/40 p-6 rounded-sm transition-colors"
                >
                  <h3 className="font-serif text-base sm:text-lg text-white font-normal mb-2 flex items-start gap-2">
                    <span className="text-[#C5A059] font-mono text-xs mt-1">0{index + 1}.</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed pl-5 font-light">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <button
                onClick={() => onOpenQuoteModal(`${category.name} Sorğusu`)}
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer"
              >
                {category.name} üçün qiymət al
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
