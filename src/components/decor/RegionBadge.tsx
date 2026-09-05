import React from 'react';
import { MapPin, CheckCircle, Info } from 'lucide-react';
import { RegionalSuitability } from '../../types';

interface RegionBadgeProps {
  suitability: RegionalSuitability;
  isDetailed?: boolean;
}

export const RegionBadge: React.FC<RegionBadgeProps> = ({ suitability, isDetailed = false }) => {
  if (suitability === 'premiumRegional') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${isDetailed ? 'p-3 bg-[#161616] border border-[#C5A059]/40 rounded-sm' : 'px-2.5 py-1 bg-[#1A1A1A] text-white border border-[#C5A059]/50 text-[10px] tracking-wider uppercase font-medium'}`}>
        <CheckCircle className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
        <span className={isDetailed ? 'text-xs sm:text-sm text-white/80 font-light' : ''}>
          {isDetailed
            ? 'Azərbaycan üzrə quraşdırma üçün tam uyğundur. Bütün regionlara xidmət göstərilir.'
            : 'Azərbaycan üzrə quraşdırma'}
        </span>
      </div>
    );
  }

  if (suitability === 'regional') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${isDetailed ? 'p-3 bg-[#141414] border border-white/10 rounded-sm' : 'px-2.5 py-1 bg-[#141414] text-white/80 border border-white/15 text-[10px] tracking-wider uppercase font-medium'}`}>
        <MapPin className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
        <span className={isDetailed ? 'text-xs sm:text-sm text-white/80 font-light' : ''}>
          {isDetailed
            ? 'Bu dekor regionlarda quraşdırıla bilər. Logistika ayrıca hesablanır.'
            : 'Regionlara uyğundur (logistika əlavə olunur)'}
        </span>
      </div>
    );
  }

  // local
  return (
    <div className={`inline-flex items-center gap-1.5 ${isDetailed ? 'p-3 bg-[#141414] border border-white/10 rounded-sm' : 'px-2.5 py-1 bg-[#141414] text-white/70 border border-white/10 text-[10px] tracking-wider uppercase font-medium'}`}>
      <Info className="w-3.5 h-3.5 text-[#C5A059]/70 shrink-0" />
      <span className={isDetailed ? 'text-xs sm:text-sm text-white/70 font-light' : ''}>
        {isDetailed
          ? 'Bu dekor əsasən Bakı və yaxın ərazilər üçün tövsiyə olunur.'
          : 'Bakı və yaxın ərazilər'}
      </span>
    </div>
  );
};
