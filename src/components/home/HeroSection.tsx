import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Gem, ShieldCheck, MapPin } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onViewPortfolio: () => void;
}

const HERO_SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2200&q=90',
    eyebrow: 'XÜSUSİ GÜNLƏR ÜÇÜN',
    titleLine1: 'Zövqlü Dekor',
    titleLine2: 'Həlləri',
    subtitle: 'Toy, nişan, xına, ad günü, korporativ tədbirlər və xonça xidməti üçün peşəkar dekor və konsept həlləri.',
  },
  {
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=2200&q=90',
    eyebrow: 'MÜASİR ZƏRİFLİK',
    titleLine1: 'Fərdi və Emosional',
    titleLine2: 'Məkanlar',
    subtitle: 'Hər bir tədbiriniz üçün təbiətin və incəsənətin harmoniyasını əks etdirən konseptlər.',
  },
  {
    image: '/images/boyuk-zal-dekor.jpg',
    eyebrow: 'BAKI VƏ REGİONLAR',
    titleLine1: 'Böyük Zallar və',
    titleLine2: 'İnstalyasiyalar',
    subtitle: 'Genişmiqyaslı şadlıq sarayları və açıq hava villaları üçün tam həcmli dekor.',
  }
];

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onViewPortfolio }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  return (
    <section id="hero-section" className="relative w-full min-h-[680px] lg:h-[86vh] lg:max-h-[820px] flex items-center overflow-hidden bg-[#0A0A0A]">
      {/* Background Images with Crossfade */}
      {HERO_SLIDES.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            idx === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={s.image}
            alt="DreamArt Events Dekorasiya"
            className="w-full h-full object-cover object-center brightness-[0.75] contrast-[1.05]"
          />
        </div>
      ))}

      {/* Atmospheric gradient overlay for typography readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/20 sm:w-4/5 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-5 sm:px-8 lg:px-10 py-16 sm:py-24 flex flex-col justify-between h-full">
        <div className="max-w-2xl pt-6 sm:pt-10">
          {/* Eyebrow */}
          <span className="text-[11px] sm:text-xs uppercase tracking-[0.32em] text-[#E5C378] font-medium font-sans block mb-3">
            {slide.eyebrow}
          </span>

          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl text-white font-normal leading-[1.05] tracking-tight mb-5">
            {slide.titleLine1} <br />
            {slide.titleLine2}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm md:text-base text-white/80 font-light leading-relaxed max-w-lg mb-8">
            {slide.subtitle}
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-10 sm:mb-12">
            <button
              id="hero-primary-cta"
              onClick={onExplore}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 sm:px-8 py-3.5 rounded-sm text-xs sm:text-[13px] font-medium tracking-wide inline-flex items-center gap-2 transition-all duration-300 shadow-md cursor-pointer"
            >
              <span>Dekorları kəşf et</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="hero-secondary-cta"
              onClick={onViewPortfolio}
              className="bg-black/40 hover:bg-black/70 border border-white/25 hover:border-[#C5A059] text-white px-6 sm:px-8 py-3.5 rounded-sm text-xs sm:text-[13px] font-medium tracking-wide inline-flex items-center gap-2 transition-all duration-300 cursor-pointer"
            >
              <span>Portfoliyoya bax</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Trust Badges Row matching mockup */}
          <div className="flex flex-wrap items-center gap-6 sm:gap-8 pt-4 border-t border-white/10 text-white/85 text-xs sm:text-[13px]">
            <div className="flex items-center gap-2">
              <Gem className="w-4 h-4 text-[#C5A059]" />
              <span>Premium dizaynlar</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Peşəkar komanda</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C5A059]" />
              <span>Azərbaycan üzrə xidmət</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Slider indicators and Next/Prev buttons matching mockup */}
        <div className="flex items-center justify-between pt-8 sm:pt-12">
          <div className="flex items-center gap-2 text-white/60 font-mono text-xs sm:text-sm">
            <span className={currentSlide === 0 ? 'text-[#C5A059] font-bold' : ''}>01</span>
            <span className="w-8 h-px bg-white/30 inline-block" />
            <span className={currentSlide === 1 ? 'text-[#C5A059] font-bold' : ''}>02</span>
            <span className={currentSlide === 2 ? 'text-[#C5A059] font-bold' : ''}>03</span>
            <span className="w-12 h-px bg-white/20 inline-block" />
          </div>

          {/* Arrow navigation buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              aria-label="Əvvəlki slayd"
              className="w-9 h-9 rounded-full border border-white/20 hover:border-[#C5A059] hover:text-[#C5A059] text-white flex items-center justify-center transition-colors cursor-pointer bg-black/40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Növbəti slayd"
              className="w-9 h-9 rounded-full border border-white/20 hover:border-[#C5A059] hover:text-[#C5A059] text-white flex items-center justify-center transition-colors cursor-pointer bg-black/40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
