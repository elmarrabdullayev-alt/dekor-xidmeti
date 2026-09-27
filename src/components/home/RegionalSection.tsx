import React, { useState, useEffect } from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { imageService } from '../../lib/imageService';
import { getOptimizedImageUrl, getSrcSet } from '../../lib/responsiveImage';

interface RegionalSectionProps {
  onRequestRegionalQuote: () => void;
  onSelectCity?: (citySlug: string) => void;
  onViewXoncha?: () => void;
  onViewMoreRegional?: () => void;
}

export const RegionalSection: React.FC<RegionalSectionProps> = ({
  onRequestRegionalQuote,
  onViewXoncha,
  onViewMoreRegional
}) => {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return () => unsub();
  }, []);

  const regionalCover = imageService.getCoverImage('regional-main', 'regional_service', '/images/azerbaijan-regional-cover.jpg');
  const regionalImgs = imageService.getImagesByTarget('regional-main', 'regional_service');
  const regionalAlt = regionalImgs[0]?.altText || 'Azərbaycan üzrə dekor xidməti - Bakı və Regionlar';

  const xoncaCover = imageService.getCoverImage('xonca-main', 'xonca_service', '/images/xonca-xidmeti-cover.jpg');
  const xoncaImgs = imageService.getImagesByTarget('xonca-main', 'xonca_service');
  const xoncaAlt = xoncaImgs[0]?.altText || 'Eksklüziv Xonça Dizaynı';
  return (
    <section id="spotlight-section" className="py-14 sm:py-20 bg-[#0B0B0B] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Azərbaycan üzrə dekor xidməti */}
          <div className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/60 rounded-sm p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-medium font-sans block mb-2">
                AZƏRBAYCANIN HƏR BİR BÖLGƏSİ
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
                Azərbaycan üzrə dekor xidməti
              </h2>
              <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed mb-6 max-w-md">
                Böyük və premium layihələr üçün regionlarda quraşdırma xüsusilə uyğundur. Azərbaycanın bütün bölgələrində dekor xidmətlərimizi peşəkar komandamızla həyata keçiririk.
              </p>

              <button
                onClick={onViewMoreRegional || onRequestRegionalQuote}
                aria-label="Azərbaycan üzrə dekor xidməti haqqında daha ətraflı məlumat"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[#C5A059]/50 hover:border-[#C5A059] text-white hover:text-[#E5C378] text-xs font-medium tracking-wide transition-colors cursor-pointer group/btn"
              >
                <span>Daha ətraflı</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Visual element: Baku Skyline / Azerbaijan Regional Map with Glowing Nodes */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="h-44 sm:h-48 w-full rounded-sm overflow-hidden relative border border-white/5 group-hover:border-[#C5A059]/40 transition-colors">
                <img
                  src={getOptimizedImageUrl(regionalCover, 800)}
                  srcSet={getSrcSet(regionalCover, [480, 640, 800, 1200])}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  width={800}
                  height={400}
                  alt={regionalAlt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <span className="font-serif tracking-wide text-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                    Bakı və bütün bölgələr
                  </span>
                  <span className="text-[#C5A059] text-[11px] font-mono uppercase tracking-wider">
                    Ölkə daxili logistika
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Xonça xidməti */}
          <div className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/60 rounded-sm p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-medium font-sans block mb-2">
                EKSKLÜZİV DİZAYNLAR
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
                Xonça xidməti
              </h2>
              <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed mb-6 max-w-md">
                Ənənəvi dəyərləri müasir zövqlə birləşdirən xonça dizaynları. Nişan, xına və digər xüsusi günləriniz üçün zərif və fərqli həllər.
              </p>

              <button
                onClick={onViewXoncha}
                aria-label="Xonça modelləri və bəzədilmə xidmətinə bax"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-sm border border-[#C5A059]/50 hover:border-[#C5A059] text-white hover:text-[#E5C378] text-xs font-medium tracking-wide transition-colors cursor-pointer group/btn"
              >
                <span>Xonça modellərinə bax</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Visual element: Luxury Azerbaijani Wedding Xoncha */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="h-44 sm:h-48 w-full rounded-sm overflow-hidden relative border border-white/5 group-hover:border-[#C5A059]/40 transition-colors">
                <img
                  src={getOptimizedImageUrl(xoncaCover, 800)}
                  srcSet={getSrcSet(xoncaCover, [480, 640, 800, 1200])}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  width={800}
                  height={400}
                  alt={xoncaAlt}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <span className="font-serif tracking-wide text-sm">Milli adətlər & müasir lüks</span>
                  <span className="text-[#C5A059] text-[11px] font-mono">Bəzədilmə və icarə</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
