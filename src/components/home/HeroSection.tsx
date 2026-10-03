import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Gem, ShieldCheck, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { imageService } from '../../lib/imageService';
import { getOptimizedImageUrl, getSrcSet } from '../../lib/responsiveImage';
import { ManagedImage } from '../../types';

interface HeroSectionProps {
  onExplore: () => void;
  onViewPortfolio: () => void;
}

interface HeroSlide {
  id: string;
  image: string;
  fallbackUrl: string;
  mobileImage?: string;
  title: string;
  subtitle: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-slide-1',
    image: '/images/dreamart-toy-dekoru-qizili-altar.webp',
    fallbackUrl: '/images/dreamart-toy-dekoru-qizili-altar.webp',
    title: 'Eksklüziv Toy Səhnəsi & Masası',
    subtitle: 'Zövqlü Qızılı Çiçək Kompozisiyaları',
    alt: 'DreamArt Events lüks toy və məclis dekorasiyası, zövqlü dekor həlləri',
  },
  {
    id: 'hero-slide-2',
    image: '/images/dreamart-nisan-dekoru-fotozona.webp',
    fallbackUrl: '/images/dreamart-nisan-dekoru-fotozona.webp',
    title: 'Zərif Nişan & Fotozona Dekoru',
    subtitle: 'Müasir İşıqlandırma və Estetik Dizayn',
    alt: 'DreamArt Events eksklüziv tədbir və nişan dizaynı, fotozona və konsept bəzədilməsi',
  },
  {
    id: 'hero-slide-3',
    image: '/images/dreamart-zal-dekoru-tavan-instalyasiyasi.webp',
    fallbackUrl: '/images/dreamart-zal-dekoru-tavan-instalyasiyasi.webp',
    title: 'Panoramik Şadlıq Zalı & Banket',
    subtitle: 'Möhtəşəm Tavan Pərdələri və İşıq Dekoru',
    alt: 'DreamArt Events premium banket və korporativ zal dekorasiyası Bakı Azərbaycan',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onViewPortfolio }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cmsHeroImages, setCmsHeroImages] = useState<ManagedImage[]>(() =>
    imageService.getImagesBySection('home_hero')
  );
  const [cmsMobileHeroImages, setCmsMobileHeroImages] = useState<ManagedImage[]>(() =>
    imageService.getImagesBySection('hero_mobile')
  );
  // Track loaded slide indices to ensure only active hero slide loads initially (saving network payload)
  const [loadedSlideIndices, setLoadedSlideIndices] = useState<Set<number>>(() => new Set([0]));
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Subscribe to CMS changes and proactively fetch fresh data from server
  useEffect(() => {
    const syncImages = () => {
      setCmsHeroImages(imageService.getImagesBySection('home_hero'));
      setCmsMobileHeroImages(imageService.getImagesBySection('hero_mobile'));
    };

    // Sync with memory cache immediately
    syncImages();

    // Proactively fetch latest records from server (Supabase / disk) with cache-busting
    imageService.fetchImages().then((imgs) => {
      if (imgs && imgs.length > 0) {
        syncImages();
      }
    });

    const unsub = imageService.subscribe(syncImages);
    return () => unsub();
  }, []);

  // Compute slides prioritizing CMS images with cache-busting timestamp to prevent stale browser cache
  const activeSlides: HeroSlide[] = HERO_SLIDES.map((defaultSlide, idx) => {
    // 1. Desktop match (strictly unchanged from existing logic)
    const cmsMatch =
      cmsHeroImages.find((img) => img.targetId === defaultSlide.id) ||
      cmsHeroImages.find((img) => img.order === idx) ||
      cmsHeroImages[idx];

    let desktopUrl = defaultSlide.image;
    let altText = defaultSlide.alt;

    if (cmsMatch && cmsMatch.url) {
      const timestamp = cmsMatch.updatedAt ? new Date(cmsMatch.updatedAt).getTime() : '';
      desktopUrl = timestamp
        ? (cmsMatch.url.includes('?') ? `${cmsMatch.url}&_t=${timestamp}` : `${cmsMatch.url}?_t=${timestamp}`)
        : cmsMatch.url;
      altText = cmsMatch.altText || cmsMatch.alt || defaultSlide.alt;
    }

    // 2. Mobile match: independent slot hero-mobile-1, hero-mobile-2, hero-mobile-3
    const mobileSlotId = `hero-mobile-${idx + 1}`;
    const mobileMatch =
      cmsMobileHeroImages.find((img) => img.targetId === mobileSlotId) ||
      cmsMobileHeroImages.find((img) => img.order === idx);

    let mobileUrl = desktopUrl; // Fallback to corresponding desktop slide if no mobile override
    if (mobileMatch && mobileMatch.url) {
      const mobileTimestamp = mobileMatch.updatedAt ? new Date(mobileMatch.updatedAt).getTime() : '';
      mobileUrl = mobileTimestamp
        ? (mobileMatch.url.includes('?') ? `${mobileMatch.url}&_t=${mobileTimestamp}` : `${mobileMatch.url}?_t=${mobileTimestamp}`)
        : mobileMatch.url;
    }

    return {
      ...defaultSlide,
      image: desktopUrl,
      fallbackUrl: desktopUrl,
      mobileImage: mobileUrl,
      alt: altText,
    };
  });

  // If CMS contains additional slides beyond the default 3
  if (cmsHeroImages.length > HERO_SLIDES.length) {
    for (let i = HERO_SLIDES.length; i < cmsHeroImages.length; i++) {
      const extra = cmsHeroImages[i];
      const timestamp = extra.updatedAt ? new Date(extra.updatedAt).getTime() : '';
      const resolvedUrl = timestamp
        ? (extra.url.includes('?') ? `${extra.url}&_t=${timestamp}` : `${extra.url}?_t=${timestamp}`)
        : extra.url;

      activeSlides.push({
        id: extra.targetId || `hero-slide-${i + 1}`,
        image: resolvedUrl,
        fallbackUrl: extra.url,
        title: extra.targetName || 'Zövqlü Toy & Tədbir Dekoru',
        subtitle: 'DreamArt Events Eksklüziv Kompozisiyası',
        alt: extra.altText || 'DreamArt Events dekorasiyası',
      });
    }
  }

  const totalSlides = activeSlides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const next = (prev + 1) % totalSlides;
      setLoadedSlideIndices((loaded) => new Set(loaded).add(next).add((next + 1) % totalSlides));
      return next;
    });
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => {
      const prevIdx = (prev - 1 + totalSlides) % totalSlides;
      setLoadedSlideIndices((loaded) => new Set(loaded).add(prevIdx));
      return prevIdx;
    });
  }, [totalSlides]);

  const goToSlide = useCallback((idx: number) => {
    setLoadedSlideIndices((loaded) => new Set(loaded).add(idx));
    setCurrentSlide(idx);
  }, []);

  // Defer loading inactive slider images until after initial paint / LCP measurement (2.5s)
  useEffect(() => {
    const idleTimer = setTimeout(() => {
      setLoadedSlideIndices((prev) => {
        const next = new Set(prev);
        next.add(1);
        return next;
      });
    }, 2500);
    return () => clearTimeout(idleTimer);
  }, []);

  // Reliable Auto-advance carousel: rotates every 5 seconds, resets upon slide change
  useEffect(() => {
    if (totalSlides <= 1) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides, nextSlide]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    // Preload next/prev slides on touch start
    setLoadedSlideIndices((loaded) => {
      const next = new Set(loaded);
      next.add((currentSlide + 1) % totalSlides);
      next.add((currentSlide - 1 + totalSlides) % totalSlides);
      return next;
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <>
      <section
        id="hero-section"
        className="relative w-full min-h-[520px] sm:min-h-[640px] md:min-h-[700px] lg:min-h-[750px] flex items-center overflow-hidden bg-[#0A0A0A] select-none border-b border-[#C5A059]/20"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        aria-label="Əsas cover karusel"
      >
        {/* 1. CAROUSEL BACKGROUND SLIDES WITH LUXURY TRANSITION */}
        <div className="absolute inset-0 z-0">
          {activeSlides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            const isLoaded = loadedSlideIndices.has(idx);
            const slideImg = slide.image || slide.fallbackUrl;

            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  isActive
                    ? 'opacity-100 pointer-events-auto z-10'
                    : 'opacity-0 pointer-events-none z-0'
                }`}
                aria-hidden={!isActive}
              >
                {isLoaded ? (
                  <picture className="w-full h-full block">
                    {/* Mobile portrait / smartphone viewport: <= 767px */}
                    <source
                      media="(max-width: 767px)"
                      srcSet={getSrcSet(slide.mobileImage || slideImg, [480, 640, 768])}
                      sizes="100vw"
                    />
                    {/* Tablet and Desktop viewport: >= 768px */}
                    <source
                      media="(min-width: 768px)"
                      srcSet={getSrcSet(slideImg, [1024, 1440, 1920])}
                      sizes="100vw"
                    />
                    {/* Default fallback img tag: preserves existing desktop layout and loading behavior */}
                    <img
                      key={slideImg}
                      src={getOptimizedImageUrl(slideImg, idx === 0 ? 1200 : 1024)}
                      srcSet={getSrcSet(slideImg, [640, 1024, 1440, 1920])}
                      sizes="100vw"
                      width={1920}
                      height={1080}
                      alt={slide.alt}
                      loading={idx === 0 ? 'eager' : 'lazy'}
                      fetchPriority={idx === 0 ? 'high' : 'low'}
                      decoding={idx === 0 ? 'sync' : 'async'}
                      className="w-full h-full object-cover object-center"
                    />
                  </picture>
                ) : (
                  <div className="w-full h-full bg-[#0A0A0A]" />
                )}
              </div>
            );
          })}

          {/* Soft, lightweight overlay (average 20%-35% opacity):
              Left-to-right soft gradient ensures effortless text readability on the left,
              while the center and right areas remain vivid, bright, and showcase decoration details. */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-black/75 via-black/40 via-45% to-black/10 sm:to-transparent" />

          {/* Delicate bottom edge gradient for smooth transition into the next page section */}
          <div className="absolute inset-x-0 bottom-0 h-24 z-20 pointer-events-none bg-gradient-to-t from-[#0A0A0A]/90 via-[#0A0A0A]/40 to-transparent" />

          {/* Soft top gradient to support navigation bar readability */}
          <div className="absolute inset-x-0 top-0 h-16 z-20 pointer-events-none bg-gradient-to-b from-black/40 to-transparent" />
        </div>

        {/* 2. HERO CONTENT CONTAINER (TEXT, CTAs, BADGES) */}
        <div className="relative z-30 max-w-7xl w-full mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-20 lg:py-24">
          <div className="max-w-3xl">
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/60 border border-[#C5A059]/40 backdrop-blur-md mb-3 sm:mb-5 shadow-lg">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#C5A059] animate-pulse" />
              <span className="text-[9px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.28em] text-[#E5C378] font-medium font-sans">
                XÜSUSİ GÜNLƏR ÜÇÜN
              </span>
            </div>

            {/* Main Heading with crisp drop shadow for clarity */}
            <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-6.5xl text-white font-normal leading-[1.1] sm:leading-[1.08] tracking-tight mb-3 sm:mb-5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
              Zövqlü Dekor <br />
              <span className="text-[#FAF8F5] bg-gradient-to-r from-white via-[#F5E6CA] to-[#C5A059] bg-clip-text text-transparent">
                Həlləri
              </span>
            </h1>

            {/* Supporting Text with gentle text shadow: concise 2-3 lines on mobile */}
            <p className="text-xs sm:text-base md:text-lg text-white/90 sm:text-white/95 font-light leading-relaxed max-w-xs sm:max-w-2xl mb-5 sm:mb-9 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)] line-clamp-3 sm:line-clamp-none">
              Toy, nişan, xına, ad günü, korporativ tədbirlər və xonça xidməti üçün fərdi dizayn və peşəkar dekorasiya xidməti.
            </p>

            {/* CTA Buttons: primary prominent, secondary subtle */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4 mb-2 sm:mb-11">
              <button
                id="hero-primary-cta"
                onClick={onExplore}
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-5 sm:px-8 py-3 sm:py-3.5 rounded-sm text-xs sm:text-[13px] font-semibold sm:font-medium tracking-wide inline-flex items-center gap-2 transition-all duration-300 shadow-xl hover:shadow-[#C5A059]/30 hover:translate-y-[-1px] cursor-pointer"
              >
                <span>Dekorları kəşf et</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>

              <button
                id="hero-secondary-cta"
                onClick={onViewPortfolio}
                className="bg-black/40 sm:bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/20 sm:border-white/30 hover:border-[#C5A059] text-white/85 sm:text-white px-4 sm:px-8 py-3 sm:py-3.5 rounded-sm text-[11px] sm:text-[13px] font-normal sm:font-medium tracking-wide inline-flex items-center gap-1.5 sm:gap-2.5 transition-all duration-300 shadow-lg hover:translate-y-[-1px] cursor-pointer"
              >
                <span>Portfolioya bax</span>
                <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 opacity-75" />
              </button>
            </div>

            {/* Desktop Premium Service Badges Row (Hidden on mobile, preserved strictly inside desktop hero) */}
            <div className="hidden sm:flex flex-wrap items-center gap-5 sm:gap-8 pt-5 sm:pt-6 border-t border-white/20 text-white/95 text-xs sm:text-[13px] drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-2">
                <Gem className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Premium dizaynlar</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Peşəkar komanda</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
                <span>Azərbaycan üzrə xidmət</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. NAVIGATION ARROWS (LEFT / RIGHT: adjusted size & moved closer to edge on mobile) */}
        <button
          type="button"
          id="hero-prev-arrow"
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          aria-label="Əvvəlki slayd"
          className="absolute left-1.5 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white/80 hover:text-white border border-white/15 hover:border-[#C5A059] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg group"
        >
          <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <button
          type="button"
          id="hero-next-arrow"
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          aria-label="Növbəti slayd"
          className="absolute right-1.5 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white/80 hover:text-white border border-white/15 hover:border-[#C5A059] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg group"
        >
          <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
        </button>

        {/* 4. BOTTOM CONTROLS: 3 INDICATOR DOTS + CURRENT SLIDE INFO */}
        <div className="absolute bottom-4 sm:bottom-7 left-0 right-0 z-30 flex items-center justify-center md:justify-between max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pointer-events-none">
          {/* Subtle slide caption indicator for desktop */}
          <div className="hidden md:flex items-center gap-3 text-white/70 text-xs font-light">
            <span className="font-mono text-[#E5C378] tracking-widest text-[11px] font-medium">
              0{currentSlide + 1} / 0{totalSlides}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/30" />
            <span className="text-white/80 tracking-wide font-sans">
              {activeSlides[currentSlide]?.title || ''}
            </span>
          </div>

          {/* Clickable Indicator Dots: centered on mobile */}
          <div className="flex items-center gap-2.5 pointer-events-auto bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
            {activeSlides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  type="button"
                  id={`hero-dot-${idx + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToSlide(idx);
                  }}
                  aria-label={`Slayd ${idx + 1}: ${slide.title}`}
                  className={`transition-all duration-500 rounded-full cursor-pointer h-2 ${
                    isActive
                      ? 'w-8 bg-gradient-to-r from-[#C5A059] to-[#E5C378] shadow-md shadow-[#C5A059]/40'
                      : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. MOBILE-ONLY FEATURE STRIP (Moved cleanly outside hero on mobile) */}
      <div className="sm:hidden w-full bg-[#0D0D0D] border-b border-[#C5A059]/20 px-3 py-3">
        <div className="grid grid-cols-3 divide-x divide-white/10 text-center">
          <div className="flex flex-col items-center justify-center gap-1 px-1">
            <Gem className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="text-[10px] font-medium tracking-tight text-white/90">Premium dizaynlar</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 px-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="text-[10px] font-medium tracking-tight text-white/90">Peşəkar komanda</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1 px-1">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="text-[10px] font-medium tracking-tight text-white/90">Azərbaycan üzrə</span>
          </div>
        </div>
      </div>
    </>
  );
};
