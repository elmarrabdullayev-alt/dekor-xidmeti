import React, { useState, useEffect } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { ServicesSection } from '../components/home/ServicesSection';
import { Sparkles, CheckCircle, Clock, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';
import { imageService } from '../lib/imageService';

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

  const serviceHeaderCover =
    imageService.getCoverImage('toy-dekoru', 'category_cover') ||
    '/images/dreamart-toy-dekoru-qizili-altar.webp';

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
