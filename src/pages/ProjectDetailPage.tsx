import React, { useState } from 'react';
import { ArrowLeft, MapPin, Check, MessageCircle, Sparkles } from 'lucide-react';
import { DecorItem } from '../types';
import { RegionBadge } from '../components/decor/RegionBadge';
import { SeoHead } from '../components/layout/SeoHead';
import { getProjectDetailSchema, getBreadcrumbSchema } from '../lib/structuredData';
import { store } from '../lib/store';

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

  const handleWhatsApp = () => {
    const text = `Salam, DreamArt Events! "${decor.name}" (${decor.categoryName}, ${decor.city}) dekorasiyası üçün qiymət təklifi və məlumat almaq istəyirəm.`;
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const jsonLd = [
    getProjectDetailSchema(decor),
    getBreadcrumbSchema([
      { name: 'Ana səhifə', url: 'https://dreamartweddings.com' },
      { name: decor.categoryName, url: `https://dreamartweddings.com/${decor.category}` },
      { name: decor.name, url: `https://dreamartweddings.com/dekorlar/${decor.slug}` }
    ])
  ];

  return (
    <>
      <SeoHead
        title={decor.seoTitle || `${decor.name} | DreamArt Events`}
        description={decor.metaDescription || decor.shortDescription}
        canonicalPath={`/dekorlar/${decor.slug}`}
        ogImage={decor.mainImage}
        jsonLd={jsonLd}
      />

      <div className="bg-[#0B0B0B] text-white py-10 sm:py-16 min-h-screen border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb & Back */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10 text-xs text-white/60">
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            {/* Left Col: Imagery */}
            <div className="lg:col-span-7 space-y-4">
              {/* Active Hero Image */}
              <div className="relative aspect-4/3 sm:aspect-16/11 bg-[#161616] border border-white/10 overflow-hidden rounded-sm shadow-xl">
                <img
                  src={currentMainImage}
                  alt={decor.imageAltText || decor.name}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/80 backdrop-blur-sm text-white text-[10px] tracking-wider uppercase px-3 py-1 border border-white/10">
                  <MapPin className="w-3 h-3 text-[#C5A059]" />
                  <span>{decor.city}</span>
                </div>
              </div>

              {/* Gallery Thumbnails */}
              {allImages.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-2">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative aspect-square border overflow-hidden rounded-sm transition-all cursor-pointer ${
                        currentMainImage === img
                          ? 'border-[#C5A059] ring-2 ring-[#C5A059]/40'
                          : 'border-white/10 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${decor.name} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
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
                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight mb-4">
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
                <div className="mb-8 pt-4 border-t border-white/10">
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
                  className="w-full bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] py-3.5 text-xs font-medium tracking-wide uppercase transition-all duration-300 rounded-sm text-center cursor-pointer"
                >
                  Bu dekor üçün qiymət al
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full flex items-center justify-center gap-2 border border-white/20 hover:border-[#25D366] text-white py-3 text-xs font-medium tracking-wide uppercase transition-all duration-300 rounded-sm cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>WhatsApp ilə soruş</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
