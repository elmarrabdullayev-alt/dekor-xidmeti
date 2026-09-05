import React from 'react';
import { ArrowRight } from 'lucide-react';
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
  // Show top 4 recent projects matching mockup
  const displayDecors = decors.slice(0, 4);

  return (
    <section id="recent-projects-section" className="py-14 sm:py-20 bg-[#0B0B0B] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching mockup */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] text-[#C5A059] font-medium font-sans block mb-1">
              PORTFOLİO
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
              Seçilmiş layihələr
            </h2>
          </div>

          <button
            id="view-all-projects-button"
            onClick={onViewAll}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#C5A059] hover:text-[#E5C378] transition-colors group cursor-pointer"
          >
            <span>Bütün layihələrə bax</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Projects Grid matching mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayDecors.map((decor) => (
            <DecorCard
              key={decor.id}
              decor={decor}
              onClick={onSelectProject}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
