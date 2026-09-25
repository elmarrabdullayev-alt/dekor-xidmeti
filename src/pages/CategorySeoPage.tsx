import React, { useState } from 'react';
import { CATEGORIES } from '../data/categories';
import { INITIAL_VENUES } from '../data/initialVenues';
import { DecorCategorySlug, DecorItem } from '../types';
import { DecorCard } from '../components/decor/DecorCard';
import { SeoHead } from '../components/layout/SeoHead';
import { getCategoryServiceSchema, getFaqPageSchema, getBreadcrumbSchema } from '../lib/structuredData';
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Maximize2,
  Camera,
  CheckCircle2,
  Clock,
  ShieldCheck,
  MessageCircle,
  HelpCircle,
  Building2,
  Phone
} from 'lucide-react';
import { TOY_DEKORU_COLLECTION } from '../data/toyDekoruImages';
import { ImageLightbox, LightboxImage } from '../components/common/ImageLightbox';
import { getWhatsAppQuoteUrl, DISPLAY_PHONE } from '../lib/whatsapp';
import { PRIMARY_DOMAIN } from '../data/seoRoutes';

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
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!category) {
    return (
      <div className="py-24 text-center bg-[#0B0B0B] text-white">
        <h2 className="text-2xl font-serif">Kateqoriya tapılmadı</h2>
      </div>
    );
  }

  // Filter projects by this category
  const categoryProjects = decors.filter(
    (d) => d.category === categorySlug && (d.status === 'published' || d.isPublished !== false)
  );

  // Find related verified venues
  const relatedVenues = (category.relatedVenueSlugs || [])
    .map(slug => INITIAL_VENUES.find(v => v.slug === slug))
    .filter((v): v is NonNullable<typeof v> => Boolean(v && v.hasRealProject));

  // Build JSON-LD Structured Data
  const jsonLd = [
    getCategoryServiceSchema(category),
    getFaqPageSchema(category.faqs),
    getBreadcrumbSchema([
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: category.name, url: `${PRIMARY_DOMAIN}/${category.slug}` }
    ])
  ];

  // Prepare images for Lightbox
  const toyGalleryLightboxImages: LightboxImage[] = TOY_DEKORU_COLLECTION.map(img => ({
    url: img.src,
    caption: `${img.title} – ${img.caption}`,
    alt: img.alt
  }));

  const handleOpenToyLightbox = (idx: number) => {
    setLightboxIndex(idx);
    setLightboxOpen(true);
  };

  const whatsappQuoteUrl = getWhatsAppQuoteUrl({
    categorySlug: category.slug,
    categoryName: category.name
  });

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
        {/* Breadcrumb Navigation */}
        <div className="bg-[#111111] border-b border-white/5 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-white/60">
            <button
              onClick={() => navigate('/dekorlar')}
              className="inline-flex items-center gap-2 hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              <span>Bütün Xidmətlər və Layihələr</span>
            </button>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Ana səhifə</span>
              <span>/</span>
              <span className="text-[#C5A059]">{category.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Section with Direct Answer Introduction */}
        <section className="relative h-[48vh] min-h-[360px] max-h-[500px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src={category.heroImage}
            alt={`${category.name} – DreamArt Weddings`}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-40 brightness-[0.75] transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/50 to-black/20" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-3 font-medium">
              PEŞƏKAR DEKORASİYA VƏ FLORİSTİKA
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4 leading-tight">
              {category.seoH1}
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light max-w-2xl mx-auto leading-relaxed mb-6">
              {category.seoIntroduction}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp ilə Qiymət Təklifi Al</span>
              </a>
              <a
                href={`tel:+994502311728`}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-5 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>{DISPLAY_PHONE}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Real Projects Section */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-1 font-medium">
                REAL İŞLƏRİMİZ VƏ FOTOLAR
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
              <p className="text-xs sm:text-sm text-white/60 mb-4 font-light">Bu kateqoriya üzrə yeni layihələr arxivə əlavə olunur.</p>
              <a
                href={whatsappQuoteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#C5A059] text-[#0B0B0B] hover:bg-[#D4AF37] px-6 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer inline-block"
              >
                Fərdi konsept sifariş et
              </a>
            </div>
          )}

          {/* Dedicated Toy Dekoru Real Project Photo Gallery */}
          {categorySlug === 'toy-dekoru' && (
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#C5A059]/30">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Camera className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
                      EKSKLÜZİV TOY DEKORU FOTOQALEREYASI
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                    Real Layihələrdən Ən Son Kadrlar
                  </h3>
                  <p className="text-xs text-white/60 font-light mt-1">
                    Böyütmək və tam ekranda detalları nəzərdən keçirmək üçün şəkillərə klikləyin.
                  </p>
                </div>
                <div className="mt-3 sm:mt-0 text-xs font-mono text-[#E5C378]">
                  6 yeni layihə fotosu
                </div>
              </div>

              {/* Responsive Gallery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {TOY_DEKORU_COLLECTION.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenToyLightbox(idx)}
                    className="group relative bg-[#131211] rounded-sm overflow-hidden border border-[#C5A059]/25 hover:border-[#C5A059] shadow-lg hover:shadow-[0_8px_30px_rgba(197,160,89,0.2)] transition-all duration-400 cursor-pointer"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-[#181715]">
                      <img
                        src={item.src}
                        alt={item.alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-70 group-hover:opacity-85 transition-opacity" />

                      {item.isCover && (
                        <div className="absolute top-3 left-3 bg-[#C5A059] text-[#0B0B0B] text-[10px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-xs shadow-md">
                          Əsas Seçim
                        </div>
                      )}

                      <div className="absolute top-3 right-3 p-2 rounded-full bg-black/70 backdrop-blur-xs text-[#E5C378] border border-[#C5A059]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>

                      <div className="absolute bottom-3.5 left-3.5 right-3.5">
                        <h4 className="font-serif text-sm sm:text-base text-[#F5E6C8] font-normal leading-snug mb-1">
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-white/70 font-light line-clamp-1">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Service Deliverables: What is Included */}
          {category.serviceDeliverables && category.serviceDeliverables.length > 0 && (
            <div className="mt-16 pt-12 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                XİDMƏTƏ NƏLƏR DAXİLDİR?
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-6">
                {category.name} Paketinə Daxil Olan Həllər
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {category.serviceDeliverables.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 bg-[#141414] border border-white/5 rounded-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Process Steps */}
          {category.process && category.process.length > 0 && (
            <div className="mt-16 pt-12 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                İŞ PROSESİMİZ
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-8">
                Sifarişdən Məkanda Montaja Qədər
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {category.process.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-5 bg-[#141414] border border-white/10 hover:border-[#C5A059]/40 rounded-sm transition-colors relative"
                  >
                    <span className="font-mono text-2xl text-[#C5A059] font-light block mb-2">{step.step}</span>
                    <h4 className="font-serif text-base text-white mb-2">{step.title}</h4>
                    <p className="text-xs text-white/70 font-light leading-relaxed">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suitable Event Types */}
          {category.suitableEvents && category.suitableEvents.length > 0 && (
            <div className="mt-16 pt-12 border-t border-white/10">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                TƏDBİR FORMATLARI
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-6">
                Uyğun Məkan və Tədbir Növləri
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.suitableEvents.map((evt, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 bg-[#161616] border border-white/10 rounded-sm text-xs sm:text-sm text-white/80"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{evt}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related Verified Venues */}
          {relatedVenues.length > 0 && (
            <div className="mt-16 pt-12 border-t border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Building2 className="w-4 h-4 text-[#C5A059]" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium">
                      MƏKANLAR VƏ REAL TƏCRÜBƏMİZ
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                    {category.name} Quraşdırdığımız Şadlıq Sarayları
                  </h3>
                  <p className="text-xs text-white/60 font-light mt-1">
                    Bu məkanlar üzrə memarlıq xüsusiyyətlərini və təcrübəmizi əks etdirən səhifələr.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/restoranlar')}
                  className="mt-3 sm:mt-0 text-xs text-[#C5A059] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Bütün Restoranlar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {relatedVenues.map((v) => (
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
                          {v.city}
                        </span>
                        <h4 className="font-serif text-base text-white group-hover:text-[#FAF8F5] transition-colors">
                          {v.name}
                        </h4>
                      </div>
                    </div>
                    <div className="p-3 bg-[#111111] flex items-center justify-between text-xs text-white/60">
                      <span className="text-[11px] truncate">{v.relatedServices[0] || 'Toy dekoru'}</span>
                      <span className="text-[#C5A059] text-[11px] font-medium flex items-center gap-0.5">
                        Bax <ArrowRight className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Regional Links for Local SEO */}
          <div className="mt-16 p-6 sm:p-8 bg-[#121212] border border-white/10 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              <button
                onClick={() => navigate(`/${category.slug}/gence`)}
                className="px-3.5 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs tracking-wide uppercase font-medium rounded-sm transition-colors cursor-pointer"
              >
                Gəncə
              </button>
            </div>
          </div>
        </section>

        {/* GEO & AI Direct Answer Section */}
        {category.directAnswers && category.directAnswers.length > 0 && (
          <section className="py-14 sm:py-16 bg-[#0D0D0D] border-b border-white/10">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-4 h-4 text-[#C5A059]" />
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] font-medium">
                  SÜRƏTLİ CAVABLAR VƏ GEO MƏLUMAT
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-8">
                {category.name} Haqqında Əsas Faktlar
              </h2>

              <div className="space-y-4">
                {category.directAnswers.map((item, idx) => (
                  <article
                    key={idx}
                    className="p-5 bg-[#131313] border border-white/10 rounded-sm hover:border-[#C5A059]/40 transition-colors"
                  >
                    <h3 className="font-serif text-base text-white font-medium mb-1.5 flex items-start gap-2">
                      <span className="text-[#C5A059] text-xs font-mono mt-0.5">•</span>
                      <span>{item.question}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed pl-4">
                      {item.answer}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Category Specific FAQ */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                TEZ-TEZ VERİLƏN SUALLAR
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                {category.name} Üzrə Ətraflı Məlumat
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

            {/* High Conversion WhatsApp CTA Card */}
            <div className="mt-14 p-8 bg-gradient-to-r from-[#171511] via-[#1A1813] to-[#12110D] border border-[#C5A059]/40 rounded-sm text-center shadow-xl">
              <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-2">
                {category.name} üçün Fərdi Qiymət Təklifi Alın
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl mx-auto mb-6">
                Məkanınızın ünvanını və tədbir tarixinizi qeyd edərək ən uyğun konsept eskizlərini və ilkin smetanı dərhal WhatsApp-da əldə edin.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href={whatsappQuoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all duration-300 cursor-pointer shadow-lg inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: {DISPLAY_PHONE}</span>
                </a>
                <button
                  onClick={() => onOpenQuoteModal(category.name)}
                  className="bg-transparent hover:bg-white/5 border border-[#C5A059]/50 text-[#C5A059] px-6 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Sayt üzərindən sorğu göndər
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Lightbox for Category Gallery */}
      <ImageLightbox
        isOpen={lightboxOpen}
        images={toyGalleryLightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </>
  );
};
