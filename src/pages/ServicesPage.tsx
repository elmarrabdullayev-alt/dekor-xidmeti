import React, { useState, useEffect } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { ServicesSection } from '../components/home/ServicesSection';
import { Sparkles, CheckCircle, Clock, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { imageService } from '../lib/imageService';
import { getCategoryCoverImage } from '../lib/categoryHelper';
import { CATEGORIES } from '../data/categories';
import { getOptimizedImageUrl, getSrcSet } from '../lib/responsiveImage';

interface ServicesPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (name?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return () => unsub();
  }, []);

  const serviceHeaderCover = getCategoryCoverImage('toy-dekoru');

  return (
    <>
      <SeoHead
        title="Dekor Xidmətlərimiz və İş Prosesi | DreamArt Weddings"
        description="Fərdi dekor konsepti, floristik dizayn, çatdırılma, montaj, sökülmə və xonça xidmətləri. Bakı və regionlar üçün peşəkar servis."
        canonicalPath="/xidmetler"
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen border-b border-white/10">
        {/* Header Banner */}
        <section className="relative py-16 sm:py-20 bg-[#121212] border-b border-white/10 text-center overflow-hidden">
          <img
            src={serviceHeaderCover}
            alt="Dekorasiya Xidmətləri"
            className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/80 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              PEŞƏKAR FLORİSTİKA VƏ DİZAYN
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4">
              Dekorasiya Xidmətləri
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              Toy, nişan, xına, xonça və korporativ tədbirlərinizin hər bir detalını ilk eskizdən son quraşdırmaya qədər peşəkarlıqla idarə edirik.
            </p>
          </div>
        </section>

        {/* All Decor Categories Grid - Unified with Homepage and Dekorlar */}
        <section id="services-categories-grid" className="py-14 sm:py-18 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
              <div>
                <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-medium font-sans block mb-1">
                  KATEQORİYALAR ÜZRƏ XİDMƏTLƏR
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  Bütün Dekorasiya Xidmətlərimiz
                </h2>
              </div>
              <p className="text-xs text-white/60 max-w-md">
                Hər bir xidmət növü üçün fərdi konsept, təbii floristika və peşəkar montaj təmin edilir.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {CATEGORIES.map((cat) => {
                const coverUrl = getCategoryCoverImage(cat);
                const targetImages = imageService.getImagesByTarget(cat.slug, 'category_image');
                const altText = targetImages[0]?.altText || cat.name;

                return (
                  <div
                    key={cat.id}
                    id={`service-card-${cat.slug}`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${cat.name} xidmətinə bax`}
                    onClick={() => navigate(`/${cat.slug}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        navigate(`/${cat.slug}`);
                      }
                    }}
                    className="bg-[#141414] rounded-sm overflow-hidden border border-white/10 hover:border-[#C5A059]/80 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer flex flex-col focus:outline-hidden focus:ring-1 focus:ring-[#C5A059]"
                  >
                    <div className="aspect-3/4 overflow-hidden bg-[#1A1A1A] relative">
                      <img
                        key={coverUrl}
                        src={getOptimizedImageUrl(coverUrl, 480)}
                        srcSet={getSrcSet(coverUrl, [360, 480, 640])}
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        width={400}
                        height={533}
                        alt={altText}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out brightness-90 contrast-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                    </div>

                    <div className="p-3 bg-[#111111] flex items-center justify-between border-t border-white/5">
                      <span className="text-xs sm:text-[13px] font-medium text-white/90 group-hover:text-[#E5C378] transition-colors truncate">
                        {cat.name}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-[#C5A059] group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5-Step Process */}
        <ServicesSection />

        {/* Destination & Indian Wedding Banner */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
          <div className="bg-[#121212] border border-[#C5A059]/40 p-6 sm:p-8 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono font-medium block">
                DESTINATION & INTERNATIONAL WEDDINGS
              </span>
              <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                Indian Wedding Decoration in Azerbaijan
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                Multi-day wedding decor for Mehendi, Haldi, Sangeet, ceremony mandap and grand reception events across Baku and scenic regions of Azerbaijan.
              </p>
            </div>
            <button
              onClick={() => navigate('/indian-wedding-azerbaijan')}
              className="shrink-0 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 py-3 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Destination Decor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Workflow steps */}
        <section className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
              ADDIM-ADDIM İCRA
            </span>
            <h2 className="font-serif text-3xl text-white font-normal">
              İş Prosesimiz Necə Qurulur?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/50 p-6 rounded-sm transition-colors">
              <span className="font-mono text-xs text-[#C5A059] tracking-widest block mb-2">01. GÖRÜŞ VƏ KONSEPT</span>
              <h3 className="font-serif text-lg text-white mb-2">Məkan və Zövq</h3>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Tədbirinizin keçiriləcəyi məkanı incələyir, istədiyiniz rəng palitrası və dekor stilini müəyyən edirik.
              </p>
            </div>

            <div className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/50 p-6 rounded-sm transition-colors">
              <span className="font-mono text-xs text-[#C5A059] tracking-widest block mb-2">02. ESKİZ VƏ SMETA</span>
              <h3 className="font-serif text-lg text-white mb-2">Fərdi Layihə</h3>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Güllərin növləri, arxa fon və işıq detalları daxil olmaqla şəffaf smeta və vizual təqdimat hazırlayırıq.
              </p>
            </div>

            <div className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/50 p-6 rounded-sm transition-colors">
              <span className="font-mono text-xs text-[#C5A059] tracking-widest block mb-2">03. TƏDARÜK VƏ HAZIRLIQ</span>
              <h3 className="font-serif text-lg text-white mb-2">Təzə Güllər</h3>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Tədbir ərəfəsində ən təravətli güllər, aksesuarlar və konstruksiyalar emalatxanada qüsursuz hazırlanır.
              </p>
            </div>

            <div className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/50 p-6 rounded-sm transition-colors">
              <span className="font-mono text-xs text-[#C5A059] tracking-widest block mb-2">04. MONTAJ VƏ NƏZARƏT</span>
              <h3 className="font-serif text-lg text-white mb-2">Tam İcra</h3>
              <p className="text-xs text-white/70 leading-relaxed font-light">
                Tədbir saatından öncə komandamız məkana gəlir, dekorasiyanı quraşdırır və qonaqlar gəlməzdən əvvəl tam hazır edir.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onOpenQuoteModal('Xidmət Sifarişi')}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
            >
              Layihəniz üçün təklif alın
            </button>
          </div>
        </section>
      </div>
    </>
  );
};
