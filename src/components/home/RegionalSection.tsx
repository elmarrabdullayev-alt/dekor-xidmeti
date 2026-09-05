import React from 'react';
import { ArrowRight, MapPin, Sparkles } from 'lucide-react';

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
    <section id="spotlight-section" className="py-14 sm:py-20 bg-[#0B0B0B] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          {/* Card 1: Azərbaycan üzrə dekor xidməti */}
          <div className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/60 rounded-sm p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 relative overflow-hidden group">
            <div className="relative z-10">
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-medium font-sans block mb-2">
                AZƏRBAYCANIN HƏR BİR BÖLGƏSİ
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
                Azərbaycan üzrə dekor xidməti
              </h3>
              <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed mb-6 max-w-md">
                Böyük və premium layihələr üçün regionlarda quraşdırma xüsusilə uyğundur. Azərbaycanın bütün bölgələrində dekor xidmətlərimizi peşəkar komandamızla həyata keçiririk.
              </p>

              <button
                onClick={onViewMoreRegional || onRequestRegionalQuote}
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
                  src="/images/azerbaijan-regional-cover.jpg"
                  alt="Azərbaycan üzrə dekor xidməti - Bakı və Regionlar"
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
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
                Xonça xidməti
              </h3>
              <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed mb-6 max-w-md">
                Ənənəvi dəyərləri müasir zövqlə birləşdirən xonça dizaynları. Nişan, xına və digər xüsusi günləriniz üçün zərif və fərqli həllər.
              </p>

              <button
                onClick={onViewXoncha}
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
                  src="/images/xonca-xidmeti-cover.jpg"
                  alt="Eksklüziv Xonça Dizaynı"
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
