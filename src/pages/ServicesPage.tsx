import React from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { ServicesSection } from '../components/home/ServicesSection';
import { Sparkles, CheckCircle, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import { getWhatsAppQuoteUrl } from '../lib/whatsapp';
import { getBreadcrumbSchema } from '../lib/structuredData';
import { PRIMARY_DOMAIN } from '../data/seoRoutes';

interface ServicesPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (name?: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const jsonLd = [
    getBreadcrumbSchema([
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Xidmətlər', url: `${PRIMARY_DOMAIN}/xidmetler` }
    ])
  ];

  return (
    <>
      <SeoHead
        title="Dekorasiya Xidmətlərimiz | DreamArt Weddings"
        description="Toy, nişan, xına, ad günü, korporativ tədbir, böyük zal və xonça dekorasiyası üzrə peşəkar xidmətlərimiz."
        canonicalPath="/xidmetler"
        jsonLd={jsonLd}
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen border-b border-white/10">
        {/* Header Banner */}
        <section className="py-16 sm:py-20 bg-[#121212] border-b border-white/10 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              PEŞƏKAR FLORİSTİKA VƏ DİZAYN
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4">
              Zövqlü Dekorasiya Xidmətlərimiz
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/70 font-light max-w-2xl mx-auto leading-relaxed">
              Toy, nişan, xına, xonça və korporativ tədbirlərinizin hər bir detalını ilk eskizdən son quraşdırmaya qədər peşəkarlıqla idarə edirik.
            </p>
          </div>
        </section>

        {/* 5-Step Process */}
        <ServicesSection />

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
            <a
              href={getWhatsAppQuoteUrl({ customMessage: 'Salam, DreamArt Weddings dekorasiya xidmətləri ilə bağlı qiymət təklifi almaq istəyirəm.' })}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer inline-block"
            >
              Layihəniz üçün təklif alın
            </a>
          </div>
        </section>
      </div>
    </>
  );
};
