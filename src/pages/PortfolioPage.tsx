import React, { useState } from 'react';
import { DecorItem } from '../types';
import { DecorCard } from '../components/decor/DecorCard';
import { SeoHead } from '../components/layout/SeoHead';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface PortfolioPageProps {
  decors: DecorItem[];
  navigate: (path: string) => void;
  onOpenQuoteModal: (decorName?: string) => void;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({
  decors,
  navigate,
  onOpenQuoteModal
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'real' | 'concept' | 'baki' | 'region'>('all');

  const filtered = decors.filter(d => {
    if (activeFilter === 'real') return d.isRealProject !== false && d.indexStatus !== 'noindex';
    if (activeFilter === 'concept') return d.isRealProject === false || d.indexStatus === 'noindex';
    if (activeFilter === 'baki') return d.city.toLowerCase() === 'bakı';
    if (activeFilter === 'region') return d.city.toLowerCase() !== 'bakı';
    return true;
  });

  const realCount = decors.filter(d => d.isRealProject !== false && d.indexStatus !== 'noindex').length;
  const conceptCount = decors.filter(d => d.isRealProject === false || d.indexStatus === 'noindex').length;

  return (
    <>
      <SeoHead
        title="Portfolio və Həyata Keçirilmiş İşlər | DreamArt Weddings"
        description="Bakı və Azərbaycan regionlarında həyata keçirdiyimiz toy, nişan, xına və xonça dekorasiyalarının fotoları."
        canonicalPath="/portfolio"
      />

      <div className="bg-[#0B0B0B] py-14 sm:py-20 text-white min-h-screen border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              LOOKBOOK & PORTFOLİO
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-3">
              Portfoliomuz
            </h1>
            <p className="text-xs sm:text-sm text-white/70 font-light">
              DreamArt Weddings tərəfindən müxtəlif məkan və şəhərlərdə reallaşdırılmış seçilmiş müəllif işləri və yaradıcı dizayn konseptləri.
            </p>
          </div>

          {/* Transparency & Credibility Notice */}
          <div className="max-w-3xl mx-auto mb-8 p-4 bg-[#121212] border border-white/10 rounded-sm flex items-center justify-between gap-4 text-xs text-white/70">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>
                <strong className="text-white font-medium">Şəffaflıq:</strong> Şəkillərdə <span className="text-[#E5C378]">"Real Layihə"</span> nişanı ilə göstərilən işlər komandamız tərəfindən faktiki icra edilmiş layihələrdir.
              </span>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-sm text-xs font-medium tracking-wider transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#C5A059] text-[#0B0B0B] font-semibold'
                  : 'bg-[#161616] text-white/70 border border-white/10 hover:border-[#C5A059]'
              }`}
            >
              Bütün İşlər ({decors.length})
            </button>
            <button
              onClick={() => setActiveFilter('real')}
              className={`px-4 py-2 rounded-sm text-xs font-medium tracking-wider transition-all cursor-pointer ${
                activeFilter === 'real'
                  ? 'bg-[#C5A059] text-[#0B0B0B] font-semibold'
                  : 'bg-[#161616] text-white/70 border border-white/10 hover:border-[#C5A059]'
              }`}
            >
              İcra Edilmiş Real Layihələr ({realCount})
            </button>
            <button
              onClick={() => setActiveFilter('concept')}
              className={`px-4 py-2 rounded-sm text-xs font-medium tracking-wider transition-all cursor-pointer ${
                activeFilter === 'concept'
                  ? 'bg-[#C5A059] text-[#0B0B0B] font-semibold'
                  : 'bg-[#161616] text-white/70 border border-white/10 hover:border-[#C5A059]'
              }`}
            >
              Dizayn Konseptləri ({conceptCount})
            </button>
            <button
              onClick={() => setActiveFilter('baki')}
              className={`px-4 py-2 rounded-sm text-xs font-medium tracking-wider transition-all cursor-pointer ${
                activeFilter === 'baki'
                  ? 'bg-[#C5A059] text-[#0B0B0B] font-semibold'
                  : 'bg-[#161616] text-white/70 border border-white/10 hover:border-[#C5A059]'
              }`}
            >
              Bakı Məkanları
            </button>
            <button
              onClick={() => setActiveFilter('region')}
              className={`px-4 py-2 rounded-sm text-xs font-medium tracking-wider transition-all cursor-pointer ${
                activeFilter === 'region'
                  ? 'bg-[#C5A059] text-[#0B0B0B] font-semibold'
                  : 'bg-[#161616] text-white/70 border border-white/10 hover:border-[#C5A059]'
              }`}
            >
              Region Layihələri
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filtered.map((decor) => (
              <DecorCard
                key={decor.id}
                decor={decor}
                onClick={(slug) => navigate(`/dekorlar/${slug}`)}
              />
            ))}
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => onOpenQuoteModal('Portfoliodan Təklif')}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer shadow-xl"
            >
              Tədbiriniz üçün təklif alın
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
