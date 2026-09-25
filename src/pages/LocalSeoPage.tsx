import React from 'react';
import { CATEGORIES } from '../data/categories';
import { REGIONAL_LOCATIONS, CURATED_LOCAL_PAGES } from '../data/regionalData';
import { INITIAL_VENUES } from '../data/initialVenues';
import { DecorCategorySlug, DecorItem } from '../types';
import { DecorCard } from '../components/decor/DecorCard';
import { SeoHead } from '../components/layout/SeoHead';
import { getBreadcrumbSchema, getFaqPageSchema } from '../lib/structuredData';
import { MapPin, Truck, ArrowLeft, Building2, CheckCircle2, MessageCircle, Phone, ArrowRight } from 'lucide-react';
import { getWhatsAppQuoteUrl, DISPLAY_PHONE } from '../lib/whatsapp';
import { PRIMARY_DOMAIN, getSeoRoute } from '../data/seoRoutes';

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

  // Quality check: Check if this local route has verified curated content or real projects
  const routePath = `${category.slug}/${location.slug}`;
  const curated = CURATED_LOCAL_PAGES[routePath];
  const seoConfig = getSeoRoute(`/${routePath}`);
  const isIndexable = Boolean(seoConfig?.indexable);

  // Filter projects matching category and city if any, or matching category
  const cityProjects = decors.filter(
    d => d.category === categorySlug && d.city.toLowerCase().includes(location.city.toLowerCase())
  );
  const otherProjects = decors.filter(
    d => d.category === categorySlug && !d.city.toLowerCase().includes(location.city.toLowerCase())
  );

  const localFaqs = curated?.faqs || [
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

  // Linked verified venues for this local page
  const linkedVenues = (curated?.verifiedVenueSlugs || [])
    .map(slug => INITIAL_VENUES.find(v => v.slug === slug))
    .filter((v): v is NonNullable<typeof v> => Boolean(v && v.hasRealProject));

  const jsonLd = [
    getBreadcrumbSchema([
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: category.name, url: `${PRIMARY_DOMAIN}/${category.slug}` },
      { name: `${location.city} ${category.name}`, url: `${PRIMARY_DOMAIN}/${category.slug}/${location.slug}` }
    ]),
    getFaqPageSchema(localFaqs)
  ];

  const whatsappUrl = getWhatsAppQuoteUrl({
    city: location.city,
    categoryName: category.name,
    customMessage: `Salam, DreamArt Weddings ${location.city} şəhərində ${category.name} xidməti ilə bağlı qiymət təklifi almaq istəyirəm.`
  });

  return (
    <>
      <SeoHead
        title={seoConfig?.title || `${location.city} ${category.name} | DreamArt Weddings`}
        description={seoConfig?.metaDescription || `${location.city} şəhərində peşəkar ${category.name.toLowerCase()} xidməti. Quraşdırma, unikal çiçək dizaynı və etibarlı logistika.`}
        canonicalPath={`/${category.slug}/${location.slug}`}
        jsonLd={jsonLd}
        noIndex={!isIndexable}
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
              <span>{location.city.toUpperCase()} ŞƏHƏRİ ÜZRƏ RƏSMİ XİDMƏT</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4">
              {curated?.localH1 || `${location.city} ${category.name}`}
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-white/70 font-light max-w-2xl mx-auto leading-relaxed mb-6">
              {curated?.localIntro || `${location.city} və ətraf məkanlar üçün zövqlü ${category.name.toLowerCase()} həlləri, peşəkar florist komandası və vaxtında çatdırılma.`}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{location.city} üçün WhatsApp-da Qiymət Al</span>
              </a>
              <a
                href="tel:+994502311728"
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-5 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{DISPLAY_PHONE}</span>
              </a>
            </div>
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
                  {location.city} üçün logistika və quraşdırma qaydası
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  {curated?.logisticsDetail || location.logisticsNotice}
                </p>
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-5 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer inline-block"
            >
              Logistika üzrə sorğu göndər
            </a>
          </div>
        </div>

        {/* Project Proof Badge if Available */}
        {curated && curated.projectProofSlug && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
            <div className="p-5 bg-gradient-to-r from-[#171510] to-[#121212] border border-[#C5A059]/30 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-mono text-[#C5A059] tracking-wider block">
                    TƏSDİQLƏNMİŞ REAL LAYİHƏ
                  </span>
                  <h4 className="font-serif text-sm sm:text-base text-white">
                    {curated.projectProofName}
                  </h4>
                </div>
              </div>
              <button
                onClick={() => navigate(`/dekorlar/${curated.projectProofSlug}`)}
                className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>Layihənin fotolarına bax</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </section>
        )}

        {/* Local Verified Venues if Available */}
        {linkedVenues.length > 0 && (
          <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-[#C5A059]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
                MƏKANLAR VƏ RESTORANLAR
              </span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-6">
              {location.city} Şəhərində Real Təcrübəmiz Olan Məkanlar
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {linkedVenues.map((v) => (
                <div
                  key={v.id}
                  onClick={() => navigate(`/restoranlar/${v.slug}`)}
                  className="group bg-[#141414] border border-white/10 hover:border-[#C5A059] rounded-sm overflow-hidden cursor-pointer transition-all duration-300"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-black/40">
                    <img
                      src={v.mainImage}
                      alt={`${v.name} toy dekoru`}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-2.5 left-2.5 right-2.5">
                      <span className="text-[10px] text-[#C5A059] uppercase tracking-wider block font-mono">
                        {v.district ? `${v.city}, ${v.district}` : v.city}
                      </span>
                      <h4 className="font-serif text-base text-white group-hover:text-[#FAF8F5] transition-colors">
                        {v.name}
                      </h4>
                    </div>
                  </div>
                  <div className="p-3 bg-[#111111] flex items-center justify-between text-xs text-white/60">
                    <span className="text-[11px] truncate">Məkan dekoru</span>
                    <span className="text-[#C5A059] text-[11px] font-medium flex items-center gap-0.5">
                      Bax <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Real Projects for this Location or Category */}
        <section className="py-14 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="mb-8 pb-3 border-b border-white/10 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-white font-normal">
              {cityProjects.length > 0 ? `${location.city} Layihələrimiz` : `Tövsiyə Olunan ${category.name} Layihələri`}
            </h2>
            <button
              onClick={() => navigate('/portfolio')}
              className="text-xs text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Bütün Portfolio</span>
              <ArrowRight className="w-3 h-3" />
            </button>
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
        <section className="py-16 sm:py-20 bg-[#0E0E0E]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                YERLİ GEO SUALLAR
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white text-center font-normal">
                {location.city} Üzrə Tez-tez Verilən Suallar
              </h2>
              <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
            </div>

            <div className="space-y-4">
              {localFaqs.map((faq, idx) => (
                <div key={idx} className="bg-[#141414] border border-white/10 p-5 rounded-sm hover:border-[#C5A059]/40 transition-colors">
                  <h3 className="font-serif text-base text-white font-normal mb-1.5 flex items-start gap-2">
                    <span className="text-[#C5A059] font-mono text-xs mt-0.5">0{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light pl-5">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            {/* Local WhatsApp CTA */}
            <div className="mt-12 text-center p-8 bg-[#141414] border border-[#C5A059]/30 rounded-sm">
              <h3 className="font-serif text-xl text-white mb-2">
                {location.city} üçün Fərdi Dekor Planlaşdırın
              </h3>
              <p className="text-xs text-white/60 mb-6 font-light max-w-md mx-auto">
                Tədbirinizin tarixini və məkanını qeyd edin, dərhal sizə xüsusi hazırlanmış smetanı təqdim edək.
              </p>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp ilə Yazın: {DISPLAY_PHONE}</span>
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
