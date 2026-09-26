import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Gem, ShieldCheck, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import heroImg1 from '../../1.webp';
import heroImg2 from '../../2.webp';
import heroImg3 from '../../3.webp';
import { imageService } from '../../lib/imageService';
import { ManagedImage } from '../../types';

interface HeroSectionProps {
  onExplore: () => void;
  onViewPortfolio: () => void;
}

interface HeroSlide {
  id: string;
  image: string;
  fallbackUrl: string;
  title: string;
  subtitle: string;
  alt: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'hero-slide-1',
    image: heroImg1,
    fallbackUrl: '/1.webp',
    title: 'Eksklüziv Toy Altarı & Masası',
    subtitle: 'Zövqlü Qızılı Çiçək Kompozisiyaları',
    alt: 'DreamArt Events lüks toy və məclis dekorasiyası, zövqlü dekor həlləri',
  },
  {
    id: 'hero-slide-2',
    image: heroImg2,
    fallbackUrl: '/2.webp',
    title: 'Zərif Nişan & Fotozona Tərtibatı',
    subtitle: 'Müasir İşıqlandırma və Estetik Dizayn',
    alt: 'DreamArt Events eksklüziv tədbir və nişan dizaynı, fotozona və konsept bəzədilməsi',
  },
  {
    id: 'hero-slide-3',
    image: heroImg3,
    fallbackUrl: '/3.webp',
    title: 'Panoramik Şadlıq Zalı & Banket',
    subtitle: 'Möhtəşəm Tavan Pərdələri və İnstalyasiya',
    alt: 'DreamArt Events premium banket və korporativ zal dekorasiyası Bakı Azərbaycan',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onViewPortfolio }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [cmsHeroImages, setCmsHeroImages] = useState<ManagedImage[]>(() =>
    imageService.getImagesBySection('home_hero')
  );
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Subscribe to CMS changes
  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setCmsHeroImages(imageService.getImagesBySection('home_hero'));
    });
    return () => unsub();
  }, []);

  // Compute slides prioritizing CMS images and falling back to default bundled images
  const activeSlides: HeroSlide[] = HERO_SLIDES.map((defaultSlide, idx) => {
    const cmsMatch =
      cmsHeroImages.find((img) => img.targetId === defaultSlide.id) ||
      cmsHeroImages[idx];

    if (cmsMatch) {
      return {
        ...defaultSlide,
        image: cmsMatch.url,
        fallbackUrl: defaultSlide.image || defaultSlide.fallbackUrl,
        alt: cmsMatch.altText || defaultSlide.alt,
      };
    }
    return defaultSlide;
  });

  // If CMS contains additional slides beyond the default 3
  if (cmsHeroImages.length > HERO_SLIDES.length) {
    for (let i = HERO_SLIDES.length; i < cmsHeroImages.length; i++) {
      const extra = cmsHeroImages[i];
      activeSlides.push({
        id: extra.targetId || `hero-slide-${i + 1}`,
        image: extra.url,
        fallbackUrl: extra.url,
        title: extra.targetName || 'Zövqlü Toy & Tədbir Dekoru',
        subtitle: 'DreamArt Events Eksklüziv Kompozisiyası',
        alt: extra.altText || 'DreamArt Events dekorasiyası',
      });
    }
  }

  const totalSlides = activeSlides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  // Auto-advance carousel every 5.5 seconds (paused on hover)
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch swipe support for mobile devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      // Swiped left -> next slide
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      // Swiped right -> prev slide
      prevSlide();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <section
      id="hero-section"
      className="relative w-full min-h-[580px] sm:min-h-[640px] md:min-h-[700px] lg:min-h-[750px] flex items-center overflow-hidden bg-[#0A0A0A] select-none border-b border-[#C5A059]/20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      aria-label="Əsas cover karusel"
    >
      {/* 1. CAROUSEL BACKGROUND SLIDES WITH LUXURY TRANSITION */}
      <div className="absolute inset-0 z-0">
        {activeSlides.map((slide, idx) => {
          const isActive = idx === currentSlide;
          const isSlide2 = slide.id === 'hero-slide-2' || idx === 1;

          if (isSlide2) {
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-all duration-1000 ease-out ${
                  isActive
                    ? 'opacity-100 scale-100 pointer-events-auto z-10'
                    : 'opacity-0 scale-105 pointer-events-none z-0'
                }`}
                aria-hidden={!isActive}
              >
                {/* Full-size edge-to-edge background layer covering the full hero container with zero side gutters */}
                <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                  <img
                    src={slide.image || slide.fallbackUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute -inset-10 w-[calc(100%+5rem)] h-[calc(100%+5rem)] max-w-none object-cover object-center blur-2xl sm:blur-3xl brightness-95 opacity-100"
                  />
                  <div className="absolute inset-0 bg-black/10 pointer-events-none" />
                </div>

                {/* Main foreground image: sharp, centered, undistorted, fully visible with object-contain */}
                <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                  <img
                    src={slide.image || slide.fallbackUrl}
                    alt={slide.alt}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                    className="w-full h-full object-contain object-center max-w-full max-h-full"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (target.src !== slide.fallbackUrl) {
                        target.src = slide.fallbackUrl;
                      }
                    }}
                  />
                </div>
              </div>
            );
          }

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-all duration-1000 ease-out ${
                isActive
                  ? 'opacity-100 scale-100 pointer-events-auto z-10'
                  : 'opacity-0 scale-105 pointer-events-none z-0'
              }`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image || slide.fallbackUrl}
                alt={slide.alt}
                loading={idx === 0 ? 'eager' : 'lazy'}
                fetchPriority={idx === 0 ? 'high' : 'auto'}
                className="w-full h-full object-cover object-center"
                onError={(e) => {
                  // Fallback if bundled asset path differs
                  const target = e.currentTarget;
                  if (target.src !== slide.fallbackUrl) {
                    target.src = slide.fallbackUrl;
                  }
                }}
              />
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
      <div className="relative z-30 max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        <div className="max-w-3xl">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-black/55 border border-[#C5A059]/40 backdrop-blur-md mb-4 sm:mb-5 shadow-lg">
            <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
            <span className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#E5C378] font-medium font-sans">
              XÜSUSİ GÜNLƏR ÜÇÜN
            </span>
          </div>

          {/* Main Heading with crisp drop shadow for clarity */}
          <h1 className="font-serif text-3.5xl sm:text-5xl md:text-6xl lg:text-6.5xl text-white font-normal leading-[1.08] tracking-tight mb-4 sm:mb-5 drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]">
            Zövqlü Dekor <br />
            <span className="text-[#FAF8F5] bg-gradient-to-r from-white via-[#F5E6CA] to-[#C5A059] bg-clip-text text-transparent">
              Həlləri
            </span>
          </h1>

          {/* Supporting Text with gentle text shadow */}
          <p className="text-sm sm:text-base md:text-lg text-white/95 font-light leading-relaxed max-w-2xl mb-7 sm:mb-9 drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">
            Toy, nişan, xına, ad günü, korporativ tədbirlər və xonça xidməti üçün peşəkar dekor və konsept həlləri.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-9 sm:mb-11">
            <button
              id="hero-primary-cta"
              onClick={onExplore}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 sm:px-8 py-3.5 rounded-sm text-xs sm:text-[13px] font-medium tracking-wide inline-flex items-center gap-2.5 transition-all duration-300 shadow-2xl hover:shadow-[#C5A059]/30 hover:translate-y-[-1px] cursor-pointer"
            >
              <span>Dekorları kəşf et</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-secondary-cta"
              onClick={onViewPortfolio}
              className="bg-black/60 hover:bg-black/85 backdrop-blur-md border border-white/30 hover:border-[#C5A059] text-white px-6 sm:px-8 py-3.5 rounded-sm text-xs sm:text-[13px] font-medium tracking-wide inline-flex items-center gap-2.5 transition-all duration-300 shadow-xl hover:translate-y-[-1px] cursor-pointer"
            >
              <span>Portfoliyoya bax</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Premium Service Badges Row */}
          <div className="flex flex-wrap items-center gap-5 sm:gap-8 pt-5 sm:pt-6 border-t border-white/20 text-white/95 text-xs sm:text-[13px] drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">
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

      {/* 3. NAVIGATION ARROWS (LEFT / RIGHT) */}
      <button
        onClick={prevSlide}
        aria-label="Əvvəlki slayd"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white/80 hover:text-white border border-white/15 hover:border-[#C5A059] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg group"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Növbəti slayd"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/45 hover:bg-black/80 text-white/80 hover:text-white border border-white/15 hover:border-[#C5A059] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-lg group"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* 4. BOTTOM CONTROLS: 3 INDICATOR DOTS + CURRENT SLIDE INFO */}
      <div className="absolute bottom-5 sm:bottom-7 left-0 right-0 z-40 flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pointer-events-none">
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

        {/* Clickable Indicator Dots */}
        <div className="flex items-center gap-2.5 pointer-events-auto bg-black/40 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          {activeSlides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
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
  );
};
