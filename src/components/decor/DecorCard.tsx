import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { DecorItem } from '../../types';

interface DecorCardProps {
  decor: DecorItem;
  onClick: (slug: string) => void;
  featured?: boolean;
}

export const DecorCard: React.FC<DecorCardProps> = ({ decor, onClick, featured = false }) => {
  return (
    <div
      id={`decor-card-${decor.id}`}
      onClick={() => onClick(decor.slug)}
      className={`group cursor-pointer flex flex-col bg-[#12110E] rounded-sm overflow-hidden border border-[#C5A059]/20 hover:border-[#C5A059]/80 shadow-md hover:shadow-[0_10px_35px_rgba(197,160,89,0.22)] transition-all duration-500 relative ${
        featured ? 'lg:col-span-2' : ''
      }`}
    >
      {/* Image container with luxury framing */}
      <div className={`relative overflow-hidden bg-[#171614] ${featured ? 'aspect-[16/10] sm:aspect-[16/9]' : 'aspect-[4/3] sm:aspect-[16/11]'}`}>
        <img
          src={decor.mainImage}
          alt={decor.imageAltText || `${decor.name} - ${decor.city}`}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-700 ease-out brightness-90 contrast-[1.02]"
        />

        {/* Delicate Scrim for Contrast & Elegance */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/30 to-transparent opacity-75 group-hover:opacity-50 transition-opacity duration-500" />

        {/* Interior Hairline Frame */}
        <div className="absolute inset-2.5 sm:inset-3 border border-white/10 group-hover:border-[#C5A059]/40 pointer-events-none transition-colors duration-500 rounded-xs" />

        {/* Unboxed Location Tag in Top Corner */}
        <div className="absolute top-4 left-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xs bg-black/65 backdrop-blur-xs border border-[#C5A059]/30 text-white/90 text-[11px] font-sans">
            <MapPin className="w-3 h-3 text-[#C5A059]" />
            <span className="tracking-wide font-light">{decor.city}</span>
          </div>
        </div>
      </div>

      {/* Content panel */}
      <div className="p-4 sm:p-5 bg-[#12110E] border-t border-[#C5A059]/15 flex items-center justify-between transition-colors group-hover:bg-[#161410]">
        <div className="pr-3">
          <div className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium font-sans mb-1">
            {decor.categoryName || 'Eksklüziv Layihə'}
          </div>
          <h3 className="font-serif text-base sm:text-lg text-[#FAF8F5] group-hover:text-[#F5E6CA] transition-colors leading-snug font-normal line-clamp-1">
            {decor.name}
          </h3>
        </div>

        <div className="w-9 h-9 rounded-full border border-[#C5A059]/30 group-hover:border-[#C5A059] group-hover:bg-[#C5A059] flex items-center justify-center text-[#C5A059] group-hover:text-[#0A0A0A] transition-all duration-300 shrink-0 shadow-sm">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};

