import React from 'react';
import { ArrowRight, MapPin } from 'lucide-react';
import { DecorItem } from '../../types';

interface DecorCardProps {
  decor: DecorItem;
  onClick: (slug: string) => void;
}

export const DecorCard: React.FC<DecorCardProps> = ({ decor, onClick }) => {
  return (
    <div
      id={`decor-card-${decor.id}`}
      onClick={() => onClick(decor.slug)}
      className="group cursor-pointer flex flex-col bg-[#141414] rounded-sm overflow-hidden border border-white/10 hover:border-[#C5A059] shadow-md hover:shadow-2xl transition-all duration-300"
    >
      {/* Image container */}
      <div className="relative aspect-4/3 sm:aspect-16/11 overflow-hidden bg-[#1A1A1A]">
        <img
          src={decor.mainImage}
          alt={decor.imageAltText || `${decor.name} - ${decor.city}`}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out brightness-90 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
        
        {/* Project Distinction Badge */}
        {decor.isRealProject ? (
          <span className="absolute top-2.5 left-2.5 bg-[#0B0B0B]/85 backdrop-blur-sm border border-[#C5A059]/40 text-[#E5C378] text-[9px] px-2 py-0.5 rounded-xs font-mono tracking-wider uppercase">
            Real Layihə
          </span>
        ) : decor.indexStatus === 'noindex' ? (
          <span className="absolute top-2.5 left-2.5 bg-black/85 backdrop-blur-sm border border-white/20 text-white/70 text-[9px] px-2 py-0.5 rounded-xs font-mono tracking-wider uppercase">
            Dizayn Konsepti
          </span>
        ) : null}
      </div>

      {/* Content panel matching mockup */}
      <div className="p-4 bg-[#121212] border-t border-white/5 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-sm sm:text-base text-white/95 group-hover:text-[#E5C378] transition-colors leading-snug">
            {decor.categoryName || decor.name}
          </h3>
          <div className="flex items-center gap-1 text-[11px] text-[#C5A059]/90 mt-1">
            <MapPin className="w-3 h-3 text-[#C5A059]" />
            <span>{decor.city}</span>
          </div>
        </div>

        <div className="w-8 h-8 rounded-full border border-white/10 group-hover:border-[#C5A059] flex items-center justify-center text-white/60 group-hover:text-[#C5A059] transition-colors">
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </div>
  );
};
