import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowRight, Gem, ShieldCheck, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import heroImg1 from '../../1.webp';
import heroImg2 from '../../2.webp';
import heroImg3 from '../../3.webp';

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
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const totalSlides = HERO_SLIDES.length;

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
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === currentSlide;
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
                className="w-full h-full object-cover object-center brightness-100 contrast-100"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== slide.fallbackUrl) {
                    target.src = slide.fallbackUrl;
                  }
                }}
              />
            </div>
          );
        })}

        {/* Soft, controlled gradient scrim on the left text area (35%-45% opacity fading to completely transparent so images shine) */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-black/55 via-black/35 via-40% to-transparent" />

        {/* Ambient warm champagne gold glow */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-[radial-gradient(ellipse_at_20%_45%,rgba(197,160,89,0.1)_0%,transparent_60%)]" />

        {/* Delicate bottom edge gradient for seamless transition into the canvas */}
        <div className="absolute inset-x-0 bottom-0 h-24 z-20 pointer-events-none bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/40 to-transparent" />

        {/* Soft top gradient to support navigation bar readability */}
        <div className="absolute inset-x-0 top-0 h-16 z-20 pointer-events-none bg-gradient-to-b from-black/35 to-transparent" />
      </div>

      {/* 2. HERO CONTENT CONTAINER (TEXT, CTAs, TRUST MARKERS) */}
      <div className="relative z-30 max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        {/* Localized soft dark fade behind text (ensures text readability without dimming the overall image) */}
        <div className="relative max-w-xl lg:max-w-2xl">
          <div className="absolute -inset-6 sm:-inset-8 bg-gradient-to-r from-black/45 via-black/25 to-transparent rounded-3xl blur-2xl -z-10 pointer-events-none" />

          {/* Decorative artistic overline with handwritten / calligraphy accent */}
          <div className="flex items-center gap-2.5 mb-3 sm:mb-4">
            <span className="w-6 h-px bg-[#C5A059]" />
            <span className="font-script text-xl sm:text-2xl text-[#E5C378] tracking-wide select-none">
              Unudulmaz Anlar Üçün
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.3em] text-[#C5A059]/90 font-medium font-sans">
              · ZÖVQLÜ TƏDBİR DEKORU
            </span>
          </div>

          {/* Main Heading: refined scale, perfectly balanced, does not obstruct decor */}
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[52px] text-white font-normal leading-[1.12] tracking-tight mb-4 sm:mb-5 drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]">
            Həyatınızın Ən Özəl Gününə <br />
            <span className="font-serif italic font-light text-[#F5E6CA] mr-1.5">Zövqlü &</span>
            <span className="gold-gradient-text font-serif font-medium">Monumental</span> <br />
            <span>Dekor Həlləri</span>
          </h1>

          {/* Short poetic supporting text with comfortable line-height */}
          <p className="text-xs sm:text-sm md:text-[15px] text-white/90 font-light leading-relaxed max-w-lg mb-7 sm:mb-9 drop-shadow-[0_1px_8px_rgba(0,0,0,0.85)]">
            Bakı və Azərbaycanın bütün regionlarında toy, nişan, xına və banket zallarını fərdi bədii baxış, zərif işıqlandırma və canlı çiçək kompozisiyaları ilə unudulmaz təcrübəyə çeviririk.
          </p>

          {/* Luxury CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-8 sm:mb-10">
            <button
              id="hero-primary-cta"
              onClick={onExplore}
              className="group relative overflow-hidden bg-gradient-to-r from-[#C5A059] via-[#E0C079] to-[#C5A059] hover:from-[#D4AF37] hover:to-[#F0D590] text-[#0A0A0A] px-6 sm:px-7 py-3 rounded-full text-xs font-semibold tracking-wider uppercase inline-flex items-center gap-2.5 transition-all duration-300 shadow-[0_3px_20px_rgba(197,160,89,0.35)] hover:shadow-[0_5px_28px_rgba(197,160,89,0.55)] hover:-translate-y-0.5 cursor-pointer"
            >
              <span className="relative z-10">Dekorları kəşf et</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0A0A0A] group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              id="hero-secondary-cta"
              onClick={onViewPortfolio}
              className="bg-[#12110E]/70 hover:bg-[#1A1814] backdrop-blur-md border border-[#C5A059]/35 hover:border-[#C5A059] text-[#FAF8F5] px-6 sm:px-7 py-3 rounded-full text-xs font-medium tracking-wider uppercase inline-flex items-center gap-2.5 transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-[0_3px_18px_rgba(197,160,89,0.2)] cursor-pointer group"
            >
              <span>Portfoliyoya bax</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Refined Unboxed Trust Indicators (Anti-Slop Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 pt-5 sm:pt-6 border-t border-[#C5A059]/20 text-white/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              <span className="font-light tracking-wide text-white/90">Fərdi Konsept & Eskiz</span>
            </div>
            <span className="text-[#C5A059]/40 select-none">·</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              <span className="font-light tracking-wide text-white/90">Təbii Çiçək Arxitekturası</span>
            </div>
            <span className="text-[#C5A059]/40 select-none hidden sm:inline">·</span>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              <span className="font-light tracking-wide text-white/90">Azərbaycan üzrə Quraşdırma</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. NAVIGATION ARROWS (ELEGANT MINIMAL HOVER) */}
      <button
        onClick={prevSlide}
        aria-label="Əvvəlki slayd"
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0E0E0E]/60 hover:bg-[#1A1814] text-white/70 hover:text-[#E5C378] border border-[#C5A059]/30 hover:border-[#C5A059] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-xl group"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-0.5" />
      </button>

      <button
        onClick={nextSlide}
        aria-label="Növbəti slayd"
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0E0E0E]/60 hover:bg-[#1A1814] text-white/70 hover:text-[#E5C378] border border-[#C5A059]/30 hover:border-[#C5A059] backdrop-blur-md flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-xl group"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:translate-x-0.5" />
      </button>

      {/* 4. BOTTOM CONTROLS: EDITORIAL SLIDE INDICATOR + PROGRESS DOTS */}
      <div className="absolute bottom-6 sm:bottom-8 left-0 right-0 z-40 flex items-center justify-between max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pointer-events-none">
        {/* Subtle slide caption indicator for desktop */}
        <div className="hidden md:flex items-center gap-3 text-white/75 text-xs font-light">
          <span className="font-mono text-[#E5C378] tracking-widest text-xs font-medium">
            0{currentSlide + 1} / 0{totalSlides}
          </span>
          <span className="w-1 h-1 rounded-full bg-[#C5A059]/50" />
          <span className="font-serif italic text-[#F5E6CA] text-sm tracking-wide">
            {HERO_SLIDES[currentSlide].title}
          </span>
        </div>

        {/* 3 Clickable Indicator Lines */}
        <div className="flex items-center gap-2.5 pointer-events-auto bg-[#0A0A0A]/70 px-4 py-2 rounded-full border border-[#C5A059]/20 backdrop-blur-md">
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                onClick={() => goToSlide(idx)}
                aria-label={`Slayd ${idx + 1}: ${slide.title}`}
                className={`transition-all duration-500 rounded-full cursor-pointer h-1.5 ${
                  isActive
                    ? 'w-9 bg-gradient-to-r from-[#C5A059] to-[#E5C378] shadow-[0_0_10px_rgba(197,160,89,0.5)]'
                    : 'w-2.5 bg-white/25 hover:bg-white/50'
                }`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
