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
        title="DreamArt Events | Zövqlü və Premium Dekor Həlləri Bakı"
        description="Toy, nişan, xına, ad günü, zal dekor və xonça xidmətləri. Bakı və Azərbaycanın bütün regionlarında zövqlü və peşəkar quraşdırma."
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
        <section className="py-16 sm:py-24 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                MƏLUMAT & CAVABLAR
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
                Tez-tez verilən suallar
              </h2>
              <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
            </div>

            <div className="space-y-4">
              {homeFaqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-[#141414] border border-white/10 hover:border-[#C5A059]/50 p-6 rounded-sm transition-colors"
                >
                  <h3 className="font-serif text-base sm:text-lg text-white font-normal mb-2 flex items-start gap-3">
                    <span className="text-[#C5A059] font-mono text-xs mt-1">0{index + 1}.</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed pl-7 font-light">
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
