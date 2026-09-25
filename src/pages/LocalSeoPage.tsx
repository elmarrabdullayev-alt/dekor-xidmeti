import React from 'react';
import { CATEGORIES } from '../data/categories';
import { REGIONAL_LOCATIONS } from '../data/regionalData';
import { DecorCategorySlug, DecorItem } from '../types';
import { DecorCard } from '../components/decor/DecorCard';
import { SeoHead } from '../components/layout/SeoHead';
import { getBreadcrumbSchema, getFaqPageSchema } from '../lib/structuredData';
import { MapPin, Truck, ArrowLeft } from 'lucide-react';

interface LocalSeoPageProps {
  categorySlug: DecorCategorySlug;
  citySlug: string;
  decors: DecorItem[];
  navigate: (path: string) => void;
  onOpenQuoteModal: (decorName?: string) => void;
}

export const LocalSeoPage: React.FC<LocalSeoPageProps> = ({
  categorySlug,
  citySlug,
  decors,
  navigate,
  onOpenQuoteModal
}) => {
  const category = CATEGORIES.find(c => c.slug === categorySlug);
  const location = REGIONAL_LOCATIONS.find(l => l.slug.toLowerCase() === citySlug.toLowerCase()) || {
    city: citySlug.charAt(0).toUpperCase() + citySlug.slice(1),
    slug: citySlug,
    isMajorHub: false,
    distanceFromBaku: 'Məsafəyə görə hesablanır',
    logisticsNotice: 'Bölgə üzrə orta və premium dekorasiya layihələri fərdi logistika planı ilə quraşdırılır.',
    recommendedDecorTypes: ['Toy dekoru', 'Nişan masası', 'Zal tərtibatı']
  };

  if (!category) {
    return (
      <div className="py-24 text-center bg-[#0B0B0B] text-white">
        <h2 className="text-2xl font-serif">Səhifə tapılmadı</h2>
      </div>
    );
  }

  // Filter projects matching category and city if any, or matching category
  const cityProjects = decors.filter(
    d => d.category === categorySlug && d.city.toLowerCase().includes(location.city.toLowerCase())
  );
  const otherProjects = decors.filter(
    d => d.category === categorySlug && !d.city.toLowerCase().includes(location.city.toLowerCase())
  );

  const localFaqs = [
    {
      question: `${location.city} şəhərində ${category.name.toLowerCase()} quraşdırılması necə aparılır?`,
      answer: `Komandamız tədbir günü və ya bir gün əvvəl ${location.city} şəhərindəki məkana çatır və dekorasiyanın tam təhlükəsiz quraşdırılmasını təmin edir.`
    },
    {
      question: `${location.city} üçün nəqliyyat və çatdırılma xərci necə hesablanır?`,
      answer: location.logisticsNotice
    },
    {
      question: `Hansı həcmdə ${category.name.toLowerCase()} layihələri ${location.city} üçün daha uyğundur?`,
      answer: 'Orta və lüks tam həcmli dekor layihələri üçün regiona xüsusi heyət ezam olunur.'
    }
  ];

  const jsonLd = [
    getBreadcrumbSchema([
      { name: 'Ana səhifə', url: 'https://dreamart.az' },
      { name: category.name, url: `https://dreamart.az/${category.slug}` },
      { name: `${location.city} ${category.name}`, url: `https://dreamart.az/${category.slug}/${location.slug}` }
    ]),
    getFaqPageSchema(localFaqs)
  ];

  return (
    <>
      <SeoHead
        title={`${location.city} ${category.name} | DreamArt Events`}
        description={`${location.city} şəhərində peşəkar ${category.name.toLowerCase()} xidməti. Quraşdırma, unikal çiçək dizaynı və etibarlı logistika.`}
        canonicalPath={`/${category.slug}/${location.slug}`}
        jsonLd={jsonLd}
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen">
        {/* Local Banner */}
        <section className="py-14 sm:py-20 bg-[#121212] border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <button
              onClick={() => navigate(`/${category.slug}`)}
              className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-[#C5A059] mb-6 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bütün {category.name} layihələrinə bax</span>
            </button>

            <div className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-3 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location.city} ŞƏHƏRİ ÜZRƏ XİDMƏT</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4">
              {location.city} {category.name}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              {location.city} və ətraf məkanlar üçün zövqlü {category.name.toLowerCase()} həlləri, peşəkar florist komandası və vaxtında çatdırılma.
            </p>
          </div>
        </section>

        {/* Region Specific Logistics Card */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 -mt-6">
          <div className="bg-[#161616] border border-white/15 p-5 sm:p-6 rounded-sm shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs uppercase tracking-wider text-white font-semibold mb-1">
                  {location.city} üçün logistika və çatdırılma qaydası
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  {location.logisticsNotice}
                </p>
              </div>
            </div>

            <button
              onClick={() => onOpenQuoteModal(`${location.city} - ${category.name}`)}
              className="shrink-0 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-5 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
            >
              {location.city} üçün sorğu göndər
            </button>
          </div>
        </div>

        {/* Real Projects for this Location or Category */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="mb-8 pb-3 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-white font-normal">
              {cityProjects.length > 0 ? `${location.city} Layihələrimiz` : `Tövsiyə Olunan ${category.name} Layihələri`}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {(cityProjects.length > 0 ? cityProjects : otherProjects.slice(0, 3)).map((decor) => (
              <DecorCard
                key={decor.id}
                decor={decor}
                onClick={(slug) => navigate(`/dekorlar/${slug}`)}
              />
            ))}
          </div>
        </section>

        {/* Local FAQ */}
        <section className="py-16 bg-[#0E0E0E]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <h2 className="font-serif text-2xl text-white text-center mb-8 font-normal">
              {location.city} Üzrə Tez-tez Verilən Suallar
            </h2>

            <div className="space-y-4">
              {localFaqs.map((faq, idx) => (
                <div key={idx} className="bg-[#141414] border border-white/10 p-5 rounded-sm">
                  <h3 className="font-serif text-base text-white font-normal mb-1.5">
                    {faq.question}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
