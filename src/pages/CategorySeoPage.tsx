import React, { useState, useEffect } from 'react';
import { CATEGORIES } from '../data/categories';
import { INITIAL_VENUES } from '../data/initialVenues';
import { DecorCategorySlug, DecorItem } from '../types';
import { DecorCard } from '../components/decor/DecorCard';
import { SeoHead } from '../components/layout/SeoHead';
import { getCategoryServiceSchema, getFaqPageSchema, getBreadcrumbSchema } from '../lib/structuredData';
import { isVenueIndexable } from '../lib/venueHelper';
import { imageService } from '../lib/imageService';
import { getCategoryCoverImage } from '../components/home/CategorySection';
import {
  Sparkles,
  MapPin,
  Check,
  Building2,
  MessageCircle,
  Phone,
  HelpCircle,
  ArrowRight,
  Clock,
  ShieldCheck
} from 'lucide-react';

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

  // Filter real projects for this category, including explicitly connected verified projects
  const categoryProjects = decors.filter(d =>
    d.category === categorySlug ||
    (category.relatedDecorIds && category.relatedDecorIds.includes(d.id)) ||
    (category.relatedProjectSlugs && category.relatedProjectSlugs.includes(d.slug))
  );

  // Find related verified venues
  const relatedVenues = (category.relatedVenueSlugs || [])
    .map(slug => INITIAL_VENUES.find(v => v.slug === slug))
    .filter((v): v is typeof INITIAL_VENUES[0] => Boolean(v && isVenueIndexable(v)));

  const whatsappNumber = '994502311728';
  const phoneDisplay = '050 231 17 28';
  const phoneRaw = '+994502311728';

  const handleWhatsApp = () => {
    const text = category.whatsappPrefill || `Salam, ${category.name} xidməti üçün qiymət təklifi almaq istəyirəm.`;
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
  };

  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return () => unsub();
  }, []);

  const renderRichText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, label, url] = match;
        if (url.startsWith('/')) {
          return (
            <a
              key={i}
              href={url}
              onClick={(e) => {
                e.preventDefault();
                navigate(url);
              }}
              className="text-[#C5A059] underline hover:text-[#DFC17B] transition-colors font-medium"
            >
              {label}
            </a>
          );
        }
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C5A059] underline hover:text-[#DFC17B] transition-colors font-medium"
          >
            {label}
          </a>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  const heroImage = getCategoryCoverImage(category);
  const cmsImgs = imageService.getImagesByTarget(category.slug, 'category_cover');
  const heroAlt = cmsImgs[0]?.altText || category.seoH1 || categoryProjects[0]?.imageAltText || `${category.name} - DreamArt Weddings`;

  const jsonLd = [
    getCategoryServiceSchema(category),
    getFaqPageSchema(category.faqs),
    getBreadcrumbSchema([
      { name: 'Ana səhifə', url: 'https://dreamartweddings.com' },
      { name: category.name, url: `https://dreamartweddings.com/${category.slug}` }
    ])
  ];

  return (
    <>
      <SeoHead
        title={category.metaTitle}
        description={category.metaDescription}
        canonicalPath={`/${category.slug}`}
        ogImage={heroImage}
        jsonLd={jsonLd}
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen">
        {/* Category Hero Banner */}
        <section className="relative h-[46vh] min-h-[360px] max-h-[500px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src={heroImage}
            alt={heroAlt}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/50 to-transparent" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-3 font-medium">
              DREAMART WEDDINGS • DEKORASİYA
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4 leading-tight">
              {category.seoH1}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light max-w-2xl mx-auto leading-relaxed">
              {category.seoIntroduction}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleWhatsApp}
                className="bg-[#C5A059] hover:bg-[#D4B26F] text-[#0B0B0B] px-5 py-2.5 rounded-sm text-xs font-medium tracking-wider uppercase flex items-center gap-2 transition-colors cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp ilə Qiymət Al</span>
              </button>
              <a
                href={`tel:${phoneRaw}`}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-4 py-2.5 rounded-sm text-xs tracking-wider uppercase flex items-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{phoneDisplay}</span>
              </a>
            </div>
          </div>
        </section>

        {/* AI & GEO Direct Answer Callout Block */}
        {category.directAnswers && category.directAnswers.length > 0 ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
            <div className="bg-[#121212] border border-[#C5A059]/40 rounded-sm p-6 sm:p-7 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.25em] text-[#C5A059] font-medium font-mono">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>GEO & AI DİREKT CAVAB BLOKU • ƏSAS XİDMƏT ŞƏRTLƏRİ</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-white/70">
                  <span className="text-[11px] text-white/50 font-mono">Rəsmi Əlaqə & Smeta:</span>
                  <a href={`tel:${phoneRaw}`} className="font-semibold text-[#E5C378] hover:underline font-mono">{phoneDisplay}</a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {category.directAnswers.map((item, idx) => (
                  <div key={idx} className="bg-[#181818] border border-white/10 hover:border-[#C5A059]/50 p-4 sm:p-5 rounded-sm transition-colors">
                    <h2 className="text-xs sm:text-sm font-serif text-[#E5C378] font-medium mb-2">
                      {item.question}
                    </h2>
                    <p className="text-xs text-white/80 font-light leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : category.geoDirectAnswer ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
            <div className="bg-[#121212] border border-[#C5A059]/40 rounded-sm p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>DİREKT MƏLUMAT VƏ XİDMƏT ŞƏRTLƏRİ</span>
                </div>
                <h2 className="text-sm sm:text-base font-serif text-white font-normal">
                  {category.geoDirectAnswer.question}
                </h2>
                <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                  {category.geoDirectAnswer.answer}
                </p>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                <span className="text-[11px] text-white/60 font-mono">Rəsmi Əlaqə:</span>
                <span className="text-xs sm:text-sm font-semibold text-[#E5C378] tracking-wider">{phoneDisplay}</span>
              </div>
            </div>
          </section>
        ) : null}

        {/* Commercial Features: What Included & Suitable For */}
        {(category.whatIncluded || category.suitableFor) && (
          <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left Column: What Included */}
              {category.whatIncluded && (
                <div className="lg:col-span-7 bg-[#121212] border border-white/10 p-6 sm:p-8 rounded-sm">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                    PAKET TƏRKİBİ
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-5">
                    {category.name} Xidmətinə Nələr Daxildir?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {category.whatIncluded.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Right Column: Suitable For & Key Perks */}
              {category.suitableFor && (
                <div className="lg:col-span-5 bg-[#121212] border border-white/10 p-6 sm:p-8 rounded-sm flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                      UYĞUNLUQ
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-5">
                      Kimlər Üçün Nəzərdə Tutulub?
                    </h3>
                    <ul className="space-y-3">
                      {category.suitableFor.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80 font-light">
                          <span className="text-[#C5A059] mt-1 font-mono text-xs">◆</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
                      <span>Keyfiyyət və Təhlükəsizlik Zəmanəti</span>
                    </span>
                    <button
                      onClick={() => navigate('/portfolio')}
                      className="text-[#C5A059] hover:underline cursor-pointer inline-flex items-center gap-1"
                    >
                      <span>Portfolio</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Strengthened Rich Editorial & Commercial H2 Sections */}
        {category.richSections && category.richSections.length > 0 && (
          <section className="py-14 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
              <div className="text-center max-w-3xl mx-auto mb-4">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                  ƏTRAFLI XİDMƏT VƏ TEXNİKİ TƏRTİBAT
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                  {category.name} üzrə Peşəkar Həllərimiz
                </h2>
                <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
              </div>

              {category.richSections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/40 rounded-sm p-6 sm:p-8 lg:p-10 transition-colors shadow-xl"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    {sec.badge && (
                      <span className="text-[10px] font-mono uppercase tracking-[0.25em] px-2.5 py-1 bg-[#C5A059]/15 text-[#E5C378] border border-[#C5A059]/30 rounded-sm inline-block w-fit">
                        {sec.badge}
                      </span>
                    )}
                    <span className="text-xs text-white/40 font-mono">0{idx + 1} / 0{category.richSections?.length}</span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-4">
                    {sec.h2}
                  </h2>

                  {sec.lead && (
                    <p className="text-sm sm:text-base text-white/90 font-light leading-relaxed mb-4">
                      {renderRichText(sec.lead)}
                    </p>
                  )}

                  {sec.paragraphs && sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className="text-xs sm:text-sm text-white/75 font-light leading-relaxed mb-3">
                      {renderRichText(p)}
                    </p>
                  ))}

                  {sec.bulletPoints && sec.bulletPoints.length > 0 && (
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 my-5">
                      {sec.bulletPoints.map((point, bpIdx) => (
                        <li key={bpIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/80 font-light bg-[#171717] p-3.5 rounded-sm border border-white/5">
                          <span className="w-4 h-4 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                            ✓
                          </span>
                          <span>{renderRichText(point)}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {sec.callout && (
                    <div className="my-5 p-4 sm:p-5 rounded-sm bg-[#171510] border-l-4 border-[#C5A059] text-xs sm:text-sm text-[#E5C378] font-light leading-relaxed flex items-start gap-3">
                      <Sparkles className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <div>{renderRichText(sec.callout)}</div>
                    </div>
                  )}

                  {sec.ctaText && (
                    <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center gap-4">
                      {sec.ctaAction === 'whatsapp' ? (
                        <button
                          onClick={() => {
                            const text = sec.ctaPrefill || category.whatsappPrefill || 'Mağaza və ya obyekt açılışınız üçün dekor təklifi alın';
                            window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
                          }}
                          className="bg-[#25D366] hover:bg-[#20ba59] text-white px-5 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors flex items-center gap-2 cursor-pointer shadow-md"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>{sec.ctaText}</span>
                        </button>
                      ) : sec.ctaAction === 'link' && sec.ctaLink ? (
                        <button
                          onClick={() => navigate(sec.ctaLink!)}
                          className="bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#0B0B0B] text-[#C5A059] border border-[#C5A059]/40 px-5 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <span>{sec.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => onOpenQuoteModal(`${category.name} - ${sec.h2}`)}
                          className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-5 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <span>{sec.ctaText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Sub-Intent Sections (e.g. for Ad Günü: Fikirlər, Uşaq üçün, Qız üçün) */}
        {category.subSections && category.subSections.length > 0 && (
          <section className="py-14 sm:py-18 bg-[#0D0D0D] border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                  KONSEPT VƏ FİKİRLƏR
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                  Fərdi Tələbat və Maraqlara Uyğun Həllər
                </h2>
                <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {category.subSections.map((sub, idx) => (
                  <div key={idx} className="bg-[#141414] border border-white/10 p-6 sm:p-7 rounded-sm flex flex-col justify-between hover:border-[#C5A059]/40 transition-colors">
                    <div>
                      {sub.badge && (
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 bg-[#C5A059]/15 text-[#E5C378] border border-[#C5A059]/30 rounded-sm inline-block mb-3">
                          {sub.badge}
                        </span>
                      )}
                      <h3 className="font-serif text-lg sm:text-xl text-white font-normal mb-3">
                        {sub.title}
                      </h3>
                      <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
                        {sub.description}
                      </p>
                      {sub.items && (
                        <ul className="space-y-2 mb-6">
                          {sub.items.map((it, i) => (
                            <li key={i} className="flex items-start gap-2 text-xs text-white/80 font-light">
                              <span className="text-[#C5A059] mt-0.5">▪</span>
                              <span>{it}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button
                      onClick={() => onOpenQuoteModal(`${category.name} - ${sub.title}`)}
                      className="w-full mt-4 py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#C5A059] hover:text-[#0B0B0B] text-[#C5A059] border border-[#C5A059]/30 text-xs font-medium tracking-wide uppercase transition-colors rounded-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{sub.ctaText || 'Qiymət təklifi al'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Pricing Factors Section (Realistic Pricing Factors & Direct CTA) */}
        {category.pricingFactors && (
          <section className="py-14 sm:py-18 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
            <div className="bg-[#121212] border border-white/10 rounded-sm p-6 sm:p-10">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-white/10">
                <div className="max-w-2xl">
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                    ŞƏFFAF QİYMƏTLƏNDİRMƏ
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                    {category.pricingFactors.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/70 font-light mt-2 leading-relaxed">
                    {category.pricingFactors.intro}
                  </p>
                </div>
                <div className="shrink-0">
                  <button
                    onClick={() => onOpenQuoteModal(`${category.name} Qiymət Təklifi`)}
                    className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 py-3 rounded-sm text-xs font-semibold tracking-wider uppercase transition-all shadow-md cursor-pointer flex items-center gap-2"
                  >
                    <span>{category.pricingFactors.ctaLabel || 'Qiymət təklifi al'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {category.pricingFactors.factors.map((factor, idx) => (
                  <div key={idx} className="bg-[#181818] border border-white/5 p-4 sm:p-5 rounded-sm hover:border-[#C5A059]/40 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-5 h-5 rounded-full bg-[#C5A059]/20 text-[#E5C378] font-mono text-[11px] flex items-center justify-center font-bold">
                        {idx + 1}
                      </span>
                      <h3 className="font-serif text-sm text-white font-medium">
                        {factor.title}
                      </h3>
                    </div>
                    <p className="text-xs text-white/70 font-light leading-relaxed pl-7">
                      {factor.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Planning & Process Section */}
        {category.planningProcess && category.planningProcess.length > 0 && (
          <section className="py-14 sm:py-18 bg-[#0E0E0E] border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-10">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                  İŞ PROSESİ VƏ PLANLAMA
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  Addım-Addım Hazırlıq Mərhələsi
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light mt-2">
                  İlk ideyadan tədbir gecəsinə qədər hər bir detal peşəkar nəzarətimiz altındadır.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.planningProcess.map((step, idx) => (
                  <div key={idx} className="bg-[#141414] border border-white/10 p-5 rounded-sm hover:border-[#C5A059]/40 transition-colors">
                    <span className="font-mono text-xl text-[#C5A059] font-medium block mb-2">
                      {step.step}
                    </span>
                    <h4 className="font-serif text-base text-white font-normal mb-2">
                      {step.title}
                    </h4>
                    <p className="text-xs text-white/70 font-light leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

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

          {/* Connected Verified Venues & Curated Local Pages */}
          <div className="mt-14 space-y-4">
            {relatedVenues.length > 0 && (
              <div className="p-6 bg-[#121212] border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-xs sm:text-sm text-white/80 font-light">
                  <Building2 className="w-4 h-4 text-[#C5A059] shrink-0" />
                  <span>
                    <strong className="font-medium text-white">{category.name}</strong> layihələri icra edilmiş məkanlar:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {relatedVenues.map(venue => (
                    <button
                      key={venue.id}
                      onClick={() => navigate(`/restoranlar/${venue.slug}`)}
                      className="px-3.5 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs tracking-wider uppercase font-medium rounded-sm transition-colors cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <span>{venue.name}</span>
                      <ArrowRight className="w-3 h-3 text-[#C5A059]" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick regional links for curated local SEO */}
            <div className="p-6 bg-[#121212] border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80 font-light">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>
                  <strong className="font-medium text-white">{category.name}</strong> xidməti fəal olan əsas bölgələr:
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                {(category.relatedCuratedLocalSlugs || ['baki']).map(locSlug => (
                  <button
                    key={locSlug}
                    onClick={() => navigate(`/${category.slug}/${locSlug}`)}
                    className="px-3.5 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs tracking-wide uppercase font-medium rounded-sm transition-colors cursor-pointer"
                  >
                    {locSlug === 'baki' ? 'Bakı' : locSlug === 'qebele' ? 'Qəbələ' : locSlug === 'berde' ? 'Bərdə' : locSlug.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct evidence chain link: Service -> Real Project -> Venue -> Portfolio -> DreamArt Weddings */}
            <div className="p-4 sm:p-5 bg-[#121212] border border-white/10 rounded-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/70">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>Bütün real işlərimiz, məkan dekorasiyaları və arxiv layihələrimiz tam portfolioda təqdim olunur.</span>
              </span>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => navigate('/portfolio')}
                  className="text-[#C5A059] hover:text-[#E5C378] tracking-wider uppercase font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Bütün Portfolio</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <span className="text-white/20">•</span>
                <button
                  onClick={() => navigate('/restoranlar')}
                  className="text-white/80 hover:text-white tracking-wider uppercase font-medium inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Bütün Məkanlar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Category Specific FAQ */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                {category.name.toUpperCase()} • TEZ-TEZ VERİLƏN SUALLAR
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

            {/* Contextual WhatsApp and Quote CTAs */}
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleWhatsApp}
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp ilə Fərdi Təklif Al</span>
              </button>

              <button
                onClick={() => onOpenQuoteModal(`${category.name} Sorğusu`)}
                className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer"
              >
                Sayt üzərindən sorğu göndər
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
