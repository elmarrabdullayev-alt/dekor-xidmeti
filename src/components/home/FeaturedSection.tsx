import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { DecorItem } from '../../types';
import { DecorCard } from '../decor/DecorCard';

interface FeaturedSectionProps {
  decors: DecorItem[];
  onSelectProject: (slug: string) => void;
  onViewAll: () => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  decors,
  onSelectProject,
  onViewAll
}) => {
  // Show top 4 recent projects in an asymmetrical editorial gallery
  const displayDecors = decors.slice(0, 4);

  return (
    <section id="recent-projects-section" className="py-20 sm:py-28 bg-[#0E0E0C] border-b border-[#C5A059]/15 relative overflow-hidden">
      {/* Subtle Ambient Vignette */}
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-[#C5A059]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-6 h-px bg-[#C5A059]" />
              <span className="font-script text-2xl sm:text-3xl text-[#E5C378] tracking-wide select-none">
                Uğurlu Mərasimlər
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-[1.12]">
              Seçilmiş Əsərlər & Portfoliomuz
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light mt-2 max-w-lg leading-relaxed">
              Məkanın memarlığına uyğunlaşdırılmış, ən incə detallarına qədər düşünülmüş bədii toy və ziyafət layihələri.
            </p>
          </div>

          <button
            id="view-all-projects-button"
            onClick={onViewAll}
            className="inline-flex items-center gap-2.5 text-xs sm:text-[13px] uppercase tracking-wider text-[#C5A059] hover:text-[#F5E6CA] transition-colors group cursor-pointer shrink-0 pb-1 border-b border-[#C5A059]/30 hover:border-[#C5A059]"
          >
            <span className="font-medium">Bütün layihələri nəzərdən keçir</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Asymmetrical Luxury Showcase Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {displayDecors.map((decor, idx) => (
            <DecorCard
              key={decor.id}
              decor={decor}
              onClick={onSelectProject}
              featured={idx === 0}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

