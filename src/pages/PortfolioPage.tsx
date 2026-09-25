import React, { useState, useEffect } from 'react';
import { DecorItem, ManagedImage } from '../types';
import { DecorCard } from '../components/decor/DecorCard';
import { SeoHead } from '../components/layout/SeoHead';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { imageService } from '../lib/imageService';

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
  const [activeFilter, setActiveFilter] = useState<'all' | 'lookbook' | 'real' | 'concept' | 'baki' | 'region'>('all');
  const [lookbookImages, setLookbookImages] = useState<ManagedImage[]>(() =>
    imageService.getImagesBySection('portfolio_lookbook')
  );

  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setLookbookImages(imageService.getImagesBySection('portfolio_lookbook'));
    });
    return () => unsub();
  }, []);

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
            {lookbookImages.length > 0 && (
              <button
                onClick={() => setActiveFilter('lookbook')}
                className={`px-4 py-2 rounded-sm text-xs font-medium tracking-wider transition-all cursor-pointer ${
                  activeFilter === 'lookbook'
                    ? 'bg-[#C5A059] text-[#0B0B0B] font-semibold'
                    : 'bg-[#161616] text-white/70 border border-white/10 hover:border-[#C5A059]'
                }`}
              >
                Lookbook Vitrini ({lookbookImages.length})
              </button>
            )}
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

          {activeFilter === 'lookbook' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {lookbookImages.map((img) => (
                <div
                  key={img.id}
                  className="bg-[#141414] rounded-sm overflow-hidden border border-white/10 hover:border-[#C5A059]/60 shadow-lg transition-all duration-300 group cursor-pointer flex flex-col"
                  onClick={() => onOpenQuoteModal(img.targetName || img.altText)}
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-black/40">
                    <img
                      src={img.url}
                      alt={img.altText || img.targetName}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-30 transition-opacity" />
                    <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-[10px] text-[#C5A059] px-2 py-0.5 rounded-xs font-mono uppercase tracking-wider">
                      Müəllif İşi
                    </span>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-serif text-base text-white group-hover:text-[#E5C378] transition-colors">
                        {img.targetName || 'Müəllif İşi'}
                      </h3>
                      <p className="text-xs text-white/60 font-light mt-1 line-clamp-2">
                        {img.altText}
                      </p>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-[#C5A059]">
                      <span>Qiymət sorğusu göndər</span>
                      <span className="text-[11px] font-mono">DreamArt Events</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((decor) => (
                <DecorCard
                  key={decor.id}
                  decor={decor}
                  onClick={(slug) => navigate(`/dekorlar/${slug}`)}
                />
              ))}
            </div>
          )}

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
