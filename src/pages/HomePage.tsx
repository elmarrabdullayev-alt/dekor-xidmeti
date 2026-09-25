import React from 'react';
import { HeroSection } from '../components/home/HeroSection';
import { CategorySection } from '../components/home/CategorySection';
import { FeaturedSection } from '../components/home/FeaturedSection';
import { RegionalSection } from '../components/home/RegionalSection';
import { ServicesSection } from '../components/home/ServicesSection';
import { QuoteSection } from '../components/home/QuoteSection';
import { SeoHead } from '../components/layout/SeoHead';
import { DecorItem } from '../types';
import { getLocalBusinessSchema, getFaqPageSchema } from '../lib/structuredData';
import { HelpCircle, ChevronDown } from 'lucide-react';

interface HomePageProps {
  decors: DecorItem[];
  navigate: (path: string) => void;
  onOpenQuoteModal: (decorName?: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ decors, navigate, onOpenQuoteModal }) => {
  const homeFaqs = [
    {
      question: 'Bakıda toy və nişan dekoru xidməti göstərirsiniz?',
      answer: 'Bəli. Bakı və ətraf ərazilərdə toy, nişan, xına və digər mərasimlərin dekorunun hazırlanması, çatdırılması və peşəkar quraşdırılması həyata keçirilir.'
    },
    {
      question: 'Regionlara dekor xidməti göstərilir?',
      answer: 'Bəli. Orta və premium dekor layihələri Azərbaycanın bütün regionlarında (Qəbələ, Gəncə, Sumqayıt, Şəki və s.) quraşdırılır. Kiçik dekor sifarişlərində logistika xərci ayrıca qiymətləndirilir.'
    },
    {
      question: 'Dekor sifarişi neçə gün əvvəl verilməlidir?',
      answer: 'Xüsusi konseptin hazırlanması, 3D vizuallaşdırma və təbii güllərin tədarükü üçün ən azı 15–30 gün öncədən müraciət etməyiniz tövsiyə olunur.'
    },
    {
      question: 'Dekorun qiyməti necə hesablanır?',
      answer: 'Tədbirin növü, məkanın sahəsi, istifadə olunan güllərin tərkibi (təbii və ya premium süni) və arxa fon konstruksiyasına əsasən fərdi smeta tərtib edilir.'
    }
  ];

  const jsonLd = [
    getLocalBusinessSchema(),
    getFaqPageSchema(homeFaqs)
  ];

  return (
    <>
      <SeoHead
        title="DreamArt Weddings | Zövqlü Toy və Tədbir Dekoru Bakı"
        description="Bakı və Azərbaycan üzrə zövqlü toy, nişan, xına, ad günü, zal və xonça dekor xidməti. Eksklüziv dizayn, təbii güllər və peşəkar quraşdırma."
        canonicalPath="/"
        jsonLd={jsonLd}
      />

      <div className="flex flex-col">
        {/* 1. Cinematic Hero */}
        <HeroSection
          onExplore={() => {
            const el = document.getElementById('categories-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onViewPortfolio={() => navigate('/portfolio')}
        />

        {/* 2. 7 Decor Categories matching mockup */}
        <CategorySection
          onSelectCategory={(slug) => navigate(`/${slug}`)}
          onViewAll={() => navigate('/dekorlar')}
        />

        {/* 3. Featured / Recent Decor Projects */}
        <FeaturedSection
          decors={decors}
          onSelectProject={(slug) => navigate(`/dekorlar/${slug}`)}
          onViewAll={() => navigate('/portfolio')}
        />

        {/* 4. Dual Spotlight Banners: Regional Coverage + Xonça Service */}
        <RegionalSection
          onRequestRegionalQuote={() => onOpenQuoteModal('Regional Dekor Sifarişi')}
          onViewXoncha={() => navigate('/xonca-xidmeti')}
          onViewMoreRegional={() => navigate('/xidmetler')}
        />

        {/* 5. 5-step Service Process */}
        <ServicesSection />

        {/* 6. Geo / Direct-Answer FAQ Section in Dark Luxury Styling */}
        <section className="py-20 sm:py-28 bg-[#0E0E0C] border-b border-[#C5A059]/15 relative overflow-hidden">
          <div className="absolute top-1/2 right-10 w-80 h-80 bg-[#C5A059]/3 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-2.5">
                <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#C5A059]" />
                <span className="font-script text-2xl sm:text-3xl text-[#E5C378] tracking-wide select-none">
                  Məlumat & Cavablar
                </span>
                <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#C5A059]" />
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal">
                Tez-tez Verilən Suallar
              </h2>
              <p className="text-xs sm:text-sm text-white/65 font-light mt-2 max-w-md mx-auto">
                Dekor seçimi, büdcə, sifariş müddətləri və regionlara çatdırılma haqqında əsas məqamlar.
              </p>
            </div>

            <div className="space-y-4">
              {homeFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-[#12110E] border border-[#C5A059]/20 hover:border-[#C5A059]/60 p-6 sm:p-7 rounded-sm transition-all duration-300 shadow-sm hover:shadow-[0_4px_20px_rgba(197,160,89,0.12)] group"
                >
                  <h3 className="font-serif text-lg sm:text-xl text-[#FAF8F5] group-hover:text-[#F5E6CA] font-normal mb-2.5 flex items-start gap-3.5 transition-colors">
                    <span className="text-[#C5A059] font-mono text-xs mt-1 shrink-0 font-medium">0{index + 1}.</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed pl-8 font-light">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Direct Quote & Contact Section */}
        <QuoteSection
          onSuccess={() => {}}
        />
      </div>
    </>
  );
};
