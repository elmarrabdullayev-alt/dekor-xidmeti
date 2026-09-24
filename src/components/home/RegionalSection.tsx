import React from 'react';
import { ArrowRight, MapPin, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

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
  return (
    <section id="spotlight-section" className="py-20 sm:py-28 bg-[#0B0B0B] border-b border-[#C5A059]/15 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#C5A059]/3 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-[#C5A059]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="font-script text-2xl sm:text-3xl text-[#E5C378] tracking-wide select-none">
              Özəl İxtisaslaşma
            </span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
            Sərhədsiz Zövq & Milli Zəriflik
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-light mt-3 leading-relaxed">
            Azərbaycanın bütün bölgələrində möhtəşəm məkan quraşdırmaları və milli adətlərimizə xüsusi dəbdəbə bəxş edən eksklüziv xidmətlərimiz.
          </p>
        </div>

        {/* 2 Feature Atelier Showcases */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          {/* Card 1: Regional Coverage */}
          <div className="bg-[#12110E] border border-[#C5A059]/25 hover:border-[#C5A059]/70 rounded-sm p-6 sm:p-9 lg:p-10 flex flex-col justify-between transition-all duration-500 relative overflow-hidden group shadow-xl hover:shadow-[0_12px_40px_rgba(197,160,89,0.18)]">
            {/* Subtle corner decorative accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C5A059]/10 to-transparent pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-script text-xl sm:text-2xl text-[#E5C378]">
                  Sərhədsiz Quraşdırma
                </span>
                <span className="text-[#C5A059]/40">·</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-sans font-medium">
                  Bütün Bölgələr
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-3.5xl text-white font-normal mb-3.5 leading-snug">
                Azərbaycan üzrə dekor və logistika xidməti
              </h3>

              <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed mb-6">
                Bakı, Qəbələ, Gəncə, Şəki, Quba, Sumqayıt və digər şəhərlərdə möhtəşəm açıq hava və şadlıq sarayı layihələrini şəxsi logistika bazamız və peşəkar mühəndis-florist komandamızla təhlükəsiz təhvil veririk.
              </p>

              {/* Trust Hallmarks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7 text-xs text-white/85">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Şəxsi yük & logistika bazası</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Vaxtında dəqiq təhvil</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Məkanın fərdi ölçülməsi</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Tədbir sonrası sökülmə</span>
                </div>
              </div>

              <div>
                <button
                  onClick={onViewMoreRegional || onRequestRegionalQuote}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-sm bg-[#1A1814] border border-[#C5A059]/40 hover:border-[#C5A059] text-[#F5E6CA] hover:text-white text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_2px_15px_rgba(197,160,89,0.2)] group/btn"
                >
                  <span>Regional xidməti kəşf et</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Visual element: Azerbaijan Regional Map / Showcase */}
            <div className="mt-8 pt-6 border-t border-[#C5A059]/15">
              <div className="h-48 sm:h-56 w-full rounded-sm overflow-hidden relative border border-[#C5A059]/20 group-hover:border-[#C5A059]/60 transition-colors duration-500">
                <img
                  src="/images/azerbaijan-regional-cover.jpg"
                  alt="Azərbaycan üzrə dekor xidməti - Bakı və Regionlar"
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                <div className="absolute inset-2 border border-white/10 group-hover:border-[#C5A059]/30 pointer-events-none transition-colors" />

                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <span className="font-serif tracking-wide text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#C5A059] animate-pulse" />
                    Bakı · Qəbələ · Gəncə · Şəki · Quba
                  </span>
                  <span className="text-[#C5A059] text-[10px] uppercase font-mono tracking-widest bg-black/60 px-2 py-0.5 rounded-xs border border-[#C5A059]/30">
                    Ölkə daxili
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Xonça xidməti */}
          <div className="bg-[#12110E] border border-[#C5A059]/25 hover:border-[#C5A059]/70 rounded-sm p-6 sm:p-9 lg:p-10 flex flex-col justify-between transition-all duration-500 relative overflow-hidden group shadow-xl hover:shadow-[0_12px_40px_rgba(197,160,89,0.18)]">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#C5A059]/10 to-transparent pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="font-script text-xl sm:text-2xl text-[#E5C378]">
                  Ənənə & Zəriflik
                </span>
                <span className="text-[#C5A059]/40">·</span>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-sans font-medium">
                  Eksklüziv Xidmət
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl lg:text-3.5xl text-white font-normal mb-3.5 leading-snug">
                Xüsusi günlər üçün xonça dizaynı
              </h3>

              <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed mb-6">
                Elçilik, nişan və xına mərasimlərinin əvəzolunmaz dəyərlərini yüksək zövq, ipək lentlər, fransız detalları və canlı çiçəklərlə fərdi sənət əsərinə çeviririk.
              </p>

              {/* Exclusive Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-7 text-xs text-white/85">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Fərdi rəng və parça uyğunluğu</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Zərif güzgülü sinilər & qutular</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Həm bəzədilmə, həm icarə</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                  <span>Təbii və qalıcı çiçək seçimi</span>
                </div>
              </div>

              <div>
                <button
                  onClick={onViewXoncha}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-sm bg-[#1A1814] border border-[#C5A059]/40 hover:border-[#C5A059] text-[#F5E6CA] hover:text-white text-xs font-medium tracking-wider uppercase transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_2px_15px_rgba(197,160,89,0.2)] group/btn"
                >
                  <span>Xonça modellərini nəzərdən keçir</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Visual element: Luxury Azerbaijani Wedding Xoncha */}
            <div className="mt-8 pt-6 border-t border-[#C5A059]/15">
              <div className="h-48 sm:h-56 w-full rounded-sm overflow-hidden relative border border-[#C5A059]/20 group-hover:border-[#C5A059]/60 transition-colors duration-500">
                <img
                  src="/images/xonca-xidmeti-cover.jpg"
                  alt="Eksklüziv Xonça Dizaynı"
                  className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 brightness-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                <div className="absolute inset-2 border border-white/10 group-hover:border-[#C5A059]/30 pointer-events-none transition-colors" />

                <div className="absolute bottom-3.5 left-4 right-4 flex items-center justify-between text-xs text-white/90">
                  <span className="font-serif tracking-wide text-sm">
                    Milli adətlər & müasir zəriflik
                  </span>
                  <span className="text-[#C5A059] text-[10px] uppercase font-mono tracking-widest bg-black/60 px-2 py-0.5 rounded-xs border border-[#C5A059]/30">
                    Bəzədilmə & İcarə
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

