import React, { useState } from 'react';
import { ArrowLeft, MapPin, Check, MessageCircle, Sparkles, Maximize2, Image as ImageIcon } from 'lucide-react';
import { DecorItem } from '../types';
import { RegionBadge } from '../components/decor/RegionBadge';
import { SeoHead } from '../components/layout/SeoHead';
import { getProjectDetailSchema, getBreadcrumbSchema } from '../lib/structuredData';
import { store } from '../lib/store';
import { ImageLightbox, LightboxImage } from '../components/common/ImageLightbox';
import { TOY_DEKORU_COLLECTION } from '../data/toyDekoruImages';

interface ProjectDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
  onOpenQuoteModal: (decorName?: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  slug,
  navigate,
  onOpenQuoteModal
}) => {
  const decor = store.getDecorBySlug(slug);
  const settings = store.getSettings();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!decor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center bg-[#0B0B0B] text-white">
        <h2 className="font-serif text-3xl text-white mb-3">Layihə tapılmadı</h2>
        <p className="text-sm text-white/70 mb-6">Axtardığınız dekorasiya layihəsi mövcud deyil və ya ünvan dəyişdirilib.</p>
        <button
          onClick={() => navigate('/dekorlar')}
          className="bg-[#C5A059] text-[#0B0B0B] px-6 py-2.5 rounded-sm text-xs font-medium tracking-wider cursor-pointer"
        >
          Dekorlar Kataloquna Qayıt
        </button>
      </div>
    );
  }

  const currentMainImage = selectedImage || decor.mainImage;
  const allImages = [decor.mainImage, ...(decor.galleryImages || [])];

  // Map images with accurate Azerbaijani alt texts and captions for SEO and accessibility
  const lightboxImages: LightboxImage[] = allImages.map((img, idx) => {
    const matched = TOY_DEKORU_COLLECTION.find(t => t.src === img || t.url === img);
    if (matched) {
      return {
        url: matched.url || matched.src,
        alt: matched.alt,
        title: matched.title,
        caption: matched.caption
      };
    }
    if (img.includes('toy-dekoru-qizili-altar')) {
      return {
        url: img,
        alt: 'DreamArt Weddings qızılı tağ və dəbdəbəli bəy-gəlin masası toy dekoru',
        title: 'Qızılı Tağ və Toy Altarı',
        caption: 'Təbii ağ qızılgüllər və zərif şam işıqlandırması'
      };
    }
    if (img.includes('monumental-toy-sehnesi')) {
      return {
        url: img,
        alt: 'Premium toy səhnəsi dekoru – Monumental arxa fon və pilləli şamlar',
        title: 'Monumental Toy Səhnəsi',
        caption: 'Böyük toy zalları üçün fərdi konsept'
      };
    }
    if (img.includes('bey-gelin-masasi')) {
      return {
        url: img,
        alt: 'Toy zalı üçün zövqlü dekorasiya – Çiçək tağları və büllur çilçıraqlı masa',
        title: 'Bəy-Gəlin Masası Çiçək Arxitekturası',
        caption: 'Zərif güllər və estetik işıqlandırma'
      };
    }
    if (img.includes('tavan-instalyasiyasi')) {
      return {
        url: img,
        alt: 'DreamArt Weddings toy dekorasiya layihəsi – Tavan instalyasiyası və çilçıraqlar',
        title: 'Zal Tavan İnstalyasiyası',
        caption: 'Həcmli büllur və çiçək tavan dekoru'
      };
    }
    return {
      url: img,
      alt: `DreamArt Weddings ${decor.name} – Toy dekoru layihəsi (${idx + 1})`,
      title: `${decor.name} (${idx + 1})`,
      caption: `${decor.city} · ${decor.style || 'Premium Toy Dekoru'}`
    };
  });

  const handleOpenLightbox = (indexToOpen: number) => {
    setLightboxIndex(indexToOpen);
    setIsLightboxOpen(true);
  };

  const handleWhatsApp = () => {
    const text = `Salam, DreamArt Events! "${decor.name}" (${decor.categoryName}, ${decor.city}) dekorasiyası üçün qiymət təklifi və məlumat almaq istəyirəm.`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const jsonLd = [
    getProjectDetailSchema(decor),
    getBreadcrumbSchema([
      { name: 'Ana səhifə', url: 'https://dreamart.az' },
      { name: decor.categoryName, url: `https://dreamart.az/${decor.category}` },
      { name: decor.name, url: `https://dreamart.az/dekorlar/${decor.slug}` }
    ])
  ];

  const currentIdx = allImages.findIndex(img => img === currentMainImage);

  return (
    <>
      <SeoHead
        title={decor.seoTitle || `${decor.name} | DreamArt Events`}
        description={decor.metaDescription || decor.shortDescription}
        canonicalPath={`/dekorlar/${decor.slug}`}
        ogImage={decor.mainImage}
        jsonLd={jsonLd}
      />

      <div className="bg-[#0B0B0B] text-white py-8 sm:py-14 min-h-screen border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Back */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10 text-xs text-white/60">
            <button
              onClick={() => navigate(`/${decor.category}`)}
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider hover:text-[#C5A059] transition-colors font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{decor.categoryName} bölməsinə qayıt</span>
            </button>
            <div className="flex items-center space-x-2 text-xs tracking-wider uppercase font-medium">
              <span>{decor.city}</span>
              <span className="text-[#C5A059]">•</span>
              <span className="text-[#C5A059]">{decor.style || 'Lüks'}</span>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Col: Imagery */}
            <div className="lg:col-span-7 space-y-4">
              {/* Active Hero Image with Zoom Trigger */}
              <div
                onClick={() => handleOpenLightbox(currentIdx >= 0 ? currentIdx : 0)}
                className="group relative aspect-4/3 sm:aspect-16/11 bg-[#141413] border border-[#C5A059]/25 hover:border-[#C5A059] overflow-hidden rounded-sm shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <img
                  src={currentMainImage}
                  alt={lightboxImages[currentIdx]?.alt || decor.imageAltText || decor.name}
                  className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                />

                {/* City location badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 bg-black/80 backdrop-blur-md text-white text-[10px] tracking-wider uppercase px-2.5 py-1 border border-white/15 rounded-xs">
                  <MapPin className="w-3 h-3 text-[#C5A059]" />
                  <span>{decor.city}</span>
                </div>

                {/* Lightbox / Zoom Prompt Overlay */}
                <div className="absolute bottom-3.5 right-3.5 flex items-center gap-1.5 bg-black/75 backdrop-blur-md text-[#E5C378] text-[11px] font-medium tracking-wide px-3 py-1.5 border border-[#C5A059]/40 rounded-xs opacity-90 group-hover:opacity-100 group-hover:bg-black/90 transition-all">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Tam ekranda bax</span>
                </div>
              </div>

              {/* Gallery Thumbnails Strip */}
              {allImages.length > 1 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A059] font-medium">
                      Layihənin digər görüntüləri ({allImages.length} şəkil)
                    </span>
                    <span className="text-[10px] text-white/50">
                      Böyütmək üçün toxunun
                    </span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-2.5">
                    {allImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedImage(img);
                          handleOpenLightbox(idx);
                        }}
                        className={`group relative aspect-4/3 border overflow-hidden rounded-xs transition-all cursor-pointer ${
                          currentMainImage === img
                            ? 'border-[#C5A059] ring-2 ring-[#C5A059]/50 scale-[1.02]'
                            : 'border-white/15 opacity-70 hover:opacity-100 hover:border-white/40'
                        }`}
                      >
                        <img
                          src={img}
                          alt={lightboxImages[idx]?.alt || `${decor.name} - ${idx + 1}`}
                          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col: Details, Included, Region Suitability & CTAs */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                {/* Category & Style Tag */}
                <div className="flex items-center space-x-2 text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-2 font-medium">
                  <span>{decor.categoryName}</span>
                  <span>/</span>
                  <span className="text-white/70">{decor.style}</span>
                </div>

                {/* Decor Name */}
                <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal leading-tight mb-4">
                  {decor.name}
                </h1>

                {/* Short & Full Description */}
                <p className="text-xs sm:text-sm text-white/75 leading-relaxed font-light mb-6">
                  {decor.fullDescription || decor.shortDescription}
                </p>

                {/* Smart Region Suitability Notice */}
                <div className="mb-6">
                  <RegionBadge suitability={decor.regionalSuitability} isDetailed={true} />
                </div>

                {/* Included Services List */}
                <div className="mb-6 pt-4 border-t border-white/10">
                  <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium mb-3">
                    Daxildir:
                  </h3>
                  <ul className="space-y-2 text-xs sm:text-sm text-white/80 font-light">
                    {decor.includedServices.map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-4 h-4 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {decor.priceDisplay && (
                  <div className="mb-6 p-4 bg-[#141414] border border-[#C5A059]/30 rounded-sm text-sm">
                    <span className="text-[10px] uppercase tracking-wider text-white/60 block">Təxmini başlanğıc büdcə:</span>
                    <span className="font-serif text-xl font-normal text-[#E5C378]">{decor.priceDisplay}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <button
                  id="project-quote-cta-btn"
                  onClick={() => onOpenQuoteModal(decor.name)}
                  className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] py-3.5 text-xs font-medium tracking-wide uppercase transition-all duration-300 rounded-sm text-center cursor-pointer shadow-lg hover:shadow-[0_4px_20px_rgba(197,160,89,0.3)]"
                >
                  Bu dekor üçün qiymət al
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 border border-white/20 hover:border-[#25D366] text-white py-3 text-xs font-medium tracking-wide uppercase transition-all duration-300 rounded-sm cursor-pointer hover:bg-[#25D366]/10"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp ilə soruş</span>
                </button>
              </div>
            </div>
          </div>

          {/* Full Visual Project Gallery Section */}
          <div className="mt-14 sm:mt-20 pt-10 border-t border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-1 font-medium">
                  FOTOGALEREYA
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  {decor.name} – Bütün Detallar
                </h2>
              </div>
              <div className="mt-2 sm:mt-0 text-xs text-white/50">
                {allImages.length} yüksək keyfiyyətli kadr
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {allImages.map((img, idx) => {
                const info = lightboxImages[idx];
                return (
                  <div
                    key={idx}
                    onClick={() => handleOpenLightbox(idx)}
                    className="group relative bg-[#121211] rounded-sm overflow-hidden border border-white/10 hover:border-[#C5A059]/60 shadow-lg transition-all duration-400 cursor-pointer"
                  >
                    <div className="relative aspect-4/3 overflow-hidden bg-[#181816]">
                      <img
                        src={img}
                        alt={info.alt}
                        loading="lazy"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                      
                      <div className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 text-white/80 group-hover:text-[#E5C378] group-hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100">
                        <Maximize2 className="w-3.5 h-3.5" />
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-xs font-serif text-[#F5E6C8] font-normal leading-snug truncate">
                          {info.title || info.alt}
                        </p>
                        {info.caption && (
                          <p className="text-[10px] text-white/60 font-light truncate mt-0.5">
                            {info.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Interactive Lightbox */}
      <ImageLightbox
        isOpen={isLightboxOpen}
        images={lightboxImages}
        currentIndex={lightboxIndex}
        onClose={() => setIsLightboxOpen(false)}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
      />
    </>
  );
};
