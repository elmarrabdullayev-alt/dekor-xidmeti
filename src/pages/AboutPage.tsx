import React, { useState, useEffect } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { Sparkles, Heart, Award } from 'lucide-react';
import { imageService } from '../lib/imageService';

interface AboutPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return () => unsub();
  }, []);

  const aboutCover =
    imageService.getCoverImage('about-main') ||
    imageService.getCoverImage('portfolio-showcase', 'portfolio_lookbook') ||
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85';

  const aboutImgs = imageService.getImagesByTarget('about-main');
  const aboutAlt = aboutImgs[0]?.altText || 'DreamArt Events Fəlsəfəsi';
  return (
    <>
      <SeoHead
        title="Haqqımızda | DreamArt Weddings"
        description="DreamArt Weddings haqqında məlumat. Azərbaycan üzrə zövqlü və premium toy, nişan, xına, xonça və tədbir dekorasiyası fəlsəfəmiz."
        canonicalPath="/haqqimizda"
      />

      <div className="bg-[#0B0B0B] text-white py-16 sm:py-24 min-h-screen border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              BREND HEKAYƏMİZ
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4">
              Zövq, Estetika və Emosiya
            </h1>
            <div className="w-12 h-px bg-[#C5A059] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center mb-16">
            <div className="md:col-span-6 relative aspect-4/3 sm:aspect-square overflow-hidden rounded-sm border border-white/10 bg-[#161616]">
              <img
                src={aboutCover}
                alt={aboutAlt}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="md:col-span-6 space-y-4 text-xs sm:text-sm text-white/75 font-light leading-relaxed">
              <h2 className="font-serif text-2xl text-white font-normal">
                Məqsədimiz hər məqamı sənət əsərinə çevirməkdir
              </h2>
              <p>
                DreamArt Events olaraq, hər bir tədbirə sadəcə dekorasiya kimi deyil, unudulmaz həyat anlarının səhnəsi kimi yanaşırıq. Biz şablon həllərdən uzaq durur, məkanın ruhuna və cütlüyün xarakterinə uyğun fərdi hekayələr qururuq.
              </p>
              <p>
                Kolleksiyamızda canlı çiçək arxitekturası, zərif şam işıqlandırması, eksklüziv xonça xidmətləri və ən son trendlər birləşir. Bakı ilə yanaşı, Qəbələ, Gəncə, Şəki və digər bölgələrdə də layihələrimizi eyni yüksək keyfiyyət standartı ilə icra edirik.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-white/10">
            <div className="bg-[#121212] p-6 border border-white/10 rounded-sm text-center">
              <span className="font-serif text-3xl text-[#C5A059] block mb-1">500+</span>
              <h3 className="text-xs uppercase tracking-wider text-white font-medium mb-1">Uğurlu Layihə</h3>
              <p className="text-xs text-white/60 font-light">Bakı və Azərbaycanın hər guşəsində unudulmaz tədbirlər.</p>
            </div>
            <div className="bg-[#121212] p-6 border border-white/10 rounded-sm text-center">
              <span className="font-serif text-3xl text-[#C5A059] block mb-1">100%</span>
              <h3 className="text-xs uppercase tracking-wider text-white font-medium mb-1">Fərdi Konsept</h3>
              <p className="text-xs text-white/60 font-light">Hər müştərimiz üçün eksklüziv rəng və eskiz seçimi.</p>
            </div>
            <div className="bg-[#121212] p-6 border border-white/10 rounded-sm text-center">
              <span className="font-serif text-3xl text-[#C5A059] block mb-1">24/7</span>
              <h3 className="text-xs uppercase tracking-wider text-white font-medium mb-1">Peşəkar Komanda</h3>
              <p className="text-xs text-white/60 font-light">Tədbir boyu montaj, nəzarət və dəstək xidməti.</p>
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={onOpenQuoteModal}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
            >
              Bizimlə əlaqə saxlayın
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
