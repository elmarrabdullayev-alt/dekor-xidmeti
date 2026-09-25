import React, { useState, useEffect } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { getBreadcrumbSchema, getFaqPageSchema } from '../lib/structuredData';
import { imageService } from '../lib/imageService';
import { store } from '../lib/store';
import {
  Sparkles,
  MapPin,
  Trees,
  Check,
  Building2,
  ArrowRight,
  MessageCircle,
  Phone,
  ShieldCheck,
  Calendar,
  Layers,
  Clock,
  HelpCircle,
  ArrowLeft,
  Compass,
  Sun,
  Flame,
  Gem
} from 'lucide-react';

interface QebeleToyDekoruPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (eventName?: string) => void;
}

export const QebeleToyDekoruPage: React.FC<QebeleToyDekoruPageProps> = ({
  navigate,
  onOpenQuoteModal
}) => {
  const phoneDisplay = '050 231 17 28';
  const phoneRaw = '+994502311728';
  const whatsappNumber = '994502311728';

  const whatsappMessage =
    'Salam, Qəbələdə toy və ya destination wedding dekoru üçün qiymət təklifi almaq istəyirəm.';

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directAnswerFaqs = [
    {
      question: 'DreamArt Weddings Qəbələdə toy dekoru xidməti göstərir?',
      answer:
        'Bəli. DreamArt Weddings Qəbələ şəhəri, dağ kurortları, fərdi villalar və ziyafət məkanları üçün tam həcmli toy dekorasiyası layihələri həyata keçirir. Konsept dizaynı, çiçək arxitekturası və quraşdırma komandası Bakıdan birbaşa Qəbələyə ezam olunur.'
    },
    {
      question: 'Qəbələdə destination wedding dekoru sifariş etmək mümkündür?',
      answer:
        'Bəli. Azərbaycanın digər şəhərlərindən və ya xaricdən gələn cütlüklər üçün Qəbələdə çoxgünlük destination wedding dekoru təşkil edilir. Mərasim tağı, axşam ziyafəti və qonaq zonaları vahid lüks üslubda tərtib olunur.'
    },
    {
      question: 'Qəbələdə açıq hava toy dekoru hazırlamaq mümkündür?',
      answer:
        'Bəli. Dağ mənzərəli çəmənliklər və meşə kənarı açıq hava məkanları üçün küləyə davamlı möhkəm altar konstruksiyaları, çiçəkli nikah tağları, işıqlandırma çilçıraqları və xüsusi oturma zonaları qurulur.'
    },
    {
      question: 'Bakıdan Qəbələyə dekor və quraşdırma komandası gəlir?',
      answer:
        'Bəli. Canlı çiçəklər və dekorasiya elementləri Bakıdakı emalatxanamızdan temperatur nəzarətli xüsusi yük maşınları ilə Qəbələyə daşınır. Peşəkar florist və montaj qrupumuz tədbirdən saatlar öncə məkanda tam quraşdırmanı həyata keçirir.'
    },
    {
      question: 'Qəbələdə bir neçə günlük toy tədbiri üçün fərqli dekor konseptləri hazırlamaq mümkündür?',
      answer:
        'Bəli. Welcome dinner, nikah mərasimi, qala ziyafət və after-party kimi mərhələlər üçün hər günə uyğun fərqli rəng palitrası və dekorasiya çevrilməsi (turnaround) təmin edilir.'
    },
    {
      question: 'Qəbələdə toy dekorunun qiyməti necə müəyyən olunur?',
      answer:
        'Qiymət seçilən məkanın növünə (açıq hava və ya qapalı zal), səhnə və masa sayına, çiçək kompozisiyalarının sıxlığına, xüsusi konstruksiya istehsalına və Bakı–Qəbələ logistika həcminə əsasən şəffaf fərdi smeta ilə hesablanır.'
    }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Qəbələdə Premium Toy Dekoru və Destination Wedding Dekorasiyası',
      'description':
        'DreamArt Weddings Qəbələdə premium toy dekoru, destination wedding styling, açıq hava mərasimi, reception, səhnə və regional quraşdırma xidmətləri təqdim edir.',
      'provider': {
        '@type': 'LocalBusiness',
        'name': 'DreamArt Weddings',
        'telephone': '+994502311728',
        'url': 'https://dreamartweddings.com',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Qəbələ',
          'addressCountry': 'AZ'
        }
      },
      'areaServed': {
        '@type': 'City',
        'name': 'Qəbələ'
      },
      'serviceType': 'Destination Wedding Dekoru',
      'url': 'https://dreamartweddings.com/toy-dekoru/qebele'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Qəbələdə Toy Dekoru | Destination Wedding Dekorasiyası | DreamArt Weddings',
      'description':
        'DreamArt Weddings Qəbələdə premium toy dekoru, destination wedding styling, açıq hava mərasimi, reception, səhnə və regional quraşdırma xidmətləri təqdim edir.',
      'url': 'https://dreamartweddings.com/toy-dekoru/qebele'
    },
    getBreadcrumbSchema([
      { name: 'Ana səhifə', url: 'https://dreamartweddings.com' },
      { name: 'Toy dekoru', url: 'https://dreamartweddings.com/toy-dekoru' },
      { name: 'Qəbələdə Toy Dekoru', url: 'https://dreamartweddings.com/toy-dekoru/qebele' }
    ]),
    getFaqPageSchema(directAnswerFaqs)
  ];

  const premiumServices = [
    {
      title: 'Qəbələdə Destination Wedding Dekoru',
      description:
        'Dağ kurortları, füsunkar təbiət əraziləri və ziyafət zalları üçün beynəlxalq standartlara uyğun tam konsept tərtibatı və stilistika.'
    },
    {
      title: 'Açıq Hava Mərasim Dekorasiyası',
      description:
        'Panoramik dağ fonunda canlı çiçəkli nikah altarları, zərif kürsülər, şamlarla bəzədilmiş keçid zolaqları və açıq çəmənlik quraşdırmaları.'
    },
    {
      title: 'Toy Zalı və Reception Dekoru',
      description:
        'Qonaq masalarının büllur şamdanlar və güllərlə bəzədilməsi, fərdi süfrə toxumaları, xüsusi menyu kartları və mütənasib zal dizaynı.'
    },
    {
      title: 'Fərdi Səhnə və Monumental Backdrop',
      description:
        'Bəy və gəlin üçün memarlıq tağları, 3D dekorativ panellər, zəngin təbii gül kompozisiyaları və estetik podium işıqlandırması.'
    },
    {
      title: 'Premium Çiçək Kompozisiyaları',
      description:
        'Hollandiya və Ekvadordan birbaşa idxal edilən birinci sinif qızılgüllər, qortenziyalar, orxideyalar və zərif təbii meşə budaqları.'
    },
    {
      title: 'Giriş və Qarşılama Zonası',
      description:
        'Qonaqların qarşılandığı çiçəkli giriş arkaları, güzgülü xoşgəldin stendləri və şamlarla işıqlandırılmış istiqamətləndirici cığırlar.'
    },
    {
      title: 'Fotozona və Lounge Styling',
      description:
        'Dağ havasına uyğun axşam işıqlı foto zonaları, rahat velvet mebellərdən ibarət istirahət güşələri və xüsusi kokteyl masaları.'
    },
    {
      title: 'Bakı–Qəbələ Regional Logistika',
      description:
        'Xüsusi temperatur nəzarətli yük maşınları ilə canlı güllərin və konstruksiyaların Bakıdan Qəbələyə təhlükəsiz daşınması.'
    },
    {
      title: 'Peşəkar Quraşdırma və Sökülmə',
      description:
        'Təcrübəli florist və texniki heyətimiz tərəfindən saatlar öncə dəqiq quraşdırma və tədbir bitdikdən sonra səliqəli demontaj.'
    }
  ];

  const multiDayFlows = [
    {
      day: '1. Qarşılama Şamı',
      label: 'Welcome Dinner / Cocktail',
      description:
        'Uzaqdan gələn qonaqlar üçün səmimi dağ ab-havasında zərif şamlar, alçaq çiçək kompozisiyaları və rahat lounge guşələri.'
    },
    {
      day: '2. Əsas Toy Mərasimi',
      label: 'Ceremony & Grand Reception',
      description:
        'Açıq hava nikah altarı, monumental bəy-gəlin səhnəsi, yüksək çiçək arxitekturası və işıq instalyasiyaları ilə qala ziyafəti.'
    },
    {
      day: '3. Əyləncə və After-Party',
      label: 'Late Night Celebration',
      description:
        'Dinamik gecə işıqları, neon detallar, fərdi bar stendi və rəqs meydançası ətrafında parlaq partiya tərtibatı.'
    }
  ];

  const pricingFactors = [
    {
      label: 'Məkan və Ərazi Tipi',
      desc: 'Açıq hava çəmənliyi, dağ ətəyi teras, fərdi villa və ya qapalı şadlıq sarayı zalı.'
    },
    {
      label: 'Çiçək Sıxlığı və Növləri',
      desc: 'İstifadə olunacaq canlı idxal güllərin həcmi və ya premium real-touch kompozisiyalar.'
    },
    {
      label: 'Səhnə və Altar Miqyası',
      desc: 'Gəlin-bəy arxa fonunun eni, hündürlüyü və fərdi istehsal konstruksiyalarının mürəkkəbliyi.'
    },
    {
      label: 'Qonaq Masalarının Sayı',
      desc: 'Zalda tərtib ediləcək masaların miqdarı, istifadə olunacaq hündür şamdan və güldan dəstləri.'
    },
    {
      label: 'Çoxzonallıq və Tədbir Müddəti',
      desc: 'Mərasim, qarşılama, fotozona, zal və bir neçə günlük tədbirlərdə dekor çevrilməsi tələbləri.'
    },
    {
      label: 'Bakı–Qəbələ Logistika Həcmi',
      desc: 'Məsafə (~220 km), soyuduculu nəqliyyat və məkanda çalışan montaj heyətinin ezamiyyəti.'
    }
  ];

  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return () => unsub();
  }, []);

  const heroImage =
    imageService.getCoverImage('qebele-toy-dekoru') ||
    imageService.getCoverImage('qebele', 'regional_service') ||
    imageService.getCoverImage('img-portfolio-9', 'portfolio_lookbook', '/images/dreamart-tebii-budag-agac-kompozisiyasi.webp');
  const heroImgs = imageService.getImagesByTarget('qebele-toy-dekoru');
  const heroAlt = heroImgs[0]?.altText || 'Qəbələdə toy dekoru və destination wedding dekorasiyası';

  const verifiedReferenceProjects = [
    {
      name: 'Ağ Qızılgül Toy Altarı Dekoru',
      category: 'Toy dekoru',
      slug: 'ag-qizilgul-ve-zerif-samli-toy-altari-baki',
      image: store.getDecorBySlug('ag-qizilgul-ve-zerif-samli-toy-altari-baki')?.mainImage || imageService.getCoverImage('decor-1', 'decor_project', '/images/dreamart-toy-dekoru-qizili-altar.webp'),
      description: 'Klassik lüks toy altar dekoru, canlı ağ güllər, şam işıqlandırması və zərif bəy-gəlin masası.'
    },
    {
      name: 'Monumental Toy Səhnəsi Dekoru',
      category: 'Səhnə dekoru',
      slug: 'panoramik-sadliq-zali-tavan-isig-instalyasiyasi-baki',
      image: store.getDecorBySlug('panoramik-sadliq-zali-tavan-isig-instalyasiyasi-baki')?.mainImage || imageService.getCoverImage('img-portfolio-4', 'portfolio_lookbook', '/images/dreamart-monumental-toy-sehnesi-dekoru.webp'),
      description: 'Geniş zallar üçün hündür tağlar, pilləli şam kompozisiyaları və zəngin gül arxitekturası.'
    },
    {
      name: 'Büllur və Qızılı Ziyafət Masası Tərtibatı',
      category: 'Qala dekoru',
      slug: 'qala-sam-yemeyi-korporativ-tedbir-tertibati-baki',
      image: store.getDecorBySlug('qala-sam-yemeyi-korporativ-tedbir-tertibati-baki')?.mainImage || imageService.getCoverImage('decor-5', 'decor_project', '/images/dreamart-qala-gecesi-samdan-dekoru.webp'),
      description: 'Zərif şamdanlar, ziyafət runnerləri və büllur detallarla zənginləşdirilmiş ziyafət stili.'
    }
  ];

  return (
    <>
      <SeoHead
        title="Qəbələdə Toy Dekoru | Destination Wedding Dekorasiyası | DreamArt Weddings"
        description="DreamArt Weddings Qəbələdə premium toy dekoru, destination wedding styling, açıq hava mərasimi, reception, səhnə və regional quraşdırma xidmətləri təqdim edir."
        canonicalPath="/toy-dekoru/qebele"
        ogImage={heroImage}
        jsonLd={jsonLd}
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen">
        {/* Breadcrumb Bar */}
        <div className="bg-[#111111] border-b border-white/5 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-white/60">
            <button
              onClick={() => navigate('/toy-dekoru')}
              className="inline-flex items-center gap-2 hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bütün Toy Dekoru Xidmətləri</span>
            </button>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Ana səhifə</span>
              <span>/</span>
              <span className="cursor-pointer hover:text-white" onClick={() => navigate('/toy-dekoru')}>Toy dekoru</span>
              <span>/</span>
              <span className="text-[#C5A059]">Qəbələ</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[480px] sm:min-h-[540px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src={heroImage}
            alt={heroAlt}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-[0.6]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-black/40" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#161616]/90 backdrop-blur-md mb-6 shadow-md">
              <Trees className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#E5C378] font-mono font-medium">
                QƏBƏLƏ • DESTINATION WEDDING DÉCOR
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-5xl font-normal text-white tracking-tight leading-[1.2] mb-6">
              Qəbələdə Premium Toy Dekoru və <br className="hidden sm:block" />
              <span className="italic text-[#E5C378]">Destination Wedding Dekorasiyası</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              DreamArt Weddings Qəbələdə fərdi toy dekoru və tədbir dizaynı layihələri həyata keçirir: dağ mənzərəli açıq hava mərasim zonaları, ziyafət zalları, reception tərtibatı və Bakıdan birbaşa peşəkar regional quraşdırma.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                onClick={handleWhatsApp}
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {phoneDisplay}</span>
              </button>

              <button
                onClick={() => onOpenQuoteModal('Qəbələdə Toy Dekoru')}
                className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-7 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
              >
                Qəbələ üçün qiymət təklifi al
              </button>

              <button
                onClick={() => navigate('/destination-wedding-azerbaijan')}
                className="w-full sm:w-auto bg-[#181818] hover:bg-[#222222] text-white border border-white/20 px-6 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <span>Destination Weddings</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C5A059]" />
              </button>
            </div>
          </div>
        </section>

        {/* Destination Wedding Positioning Statement */}
        <section className="py-14 sm:py-16 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono font-medium block">
              MƏKAN VƏ XİDMƏT MÖVQEYİ
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Qəbələdə Niyə Destination Wedding Dekoru?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/75 font-light leading-relaxed max-w-3xl mx-auto">
              Qəbələ dağ ətəklərində yerləşən zəngin təbiəti, meşə mənzərələri və kurort məkanları ilə cütlüklərə unikal açıq hava və qapalı ziyafət imkanları təqdim edir. DreamArt Weddings bu bölgədəki layihələrdə iqlimə uyğun möhkəm dekorativ strukturlar, təzə çiçəklərin xüsusi qorunması və zövqlü axşam işıqlandırması ilə fərqlənən unikal məkanlar yaradır.
            </p>
            <div className="pt-2">
              <button
                onClick={() => navigate('/destination-wedding-azerbaijan')}
                className="text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1.5 font-medium cursor-pointer"
              >
                <span>Azərbaycan üzrə Destination Wedding bələdçisinə baxın</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* 9 Premium Service Blocks */}
        <section className="py-16 sm:py-20 bg-[#0B0B0B] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                TAM XİDMƏT SPEKTRİ
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
                Qəbələ Üçün Təqdim Etdiyimiz Dekor Həlləri
              </h2>
              <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumServices.map((svc, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] border border-white/10 p-6 rounded-sm hover:border-[#C5A059]/40 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-[#C5A059]">0{idx + 1}.</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#C5A059]/50" />
                    </div>
                    <h3 className="font-serif text-lg text-white font-normal">{svc.title}</h3>
                    <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Multi-Day Event Capability Section */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-12">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium font-mono">
                ÇOXGÜNLÜK TƏDBİR İMKANLARI
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
                Çoxgünlük Destination Wedding Konseptləri
              </h2>
              <p className="text-xs sm:text-sm text-white/70 font-light mt-2 leading-relaxed">
                Qəbələdə təşkil olunan destination toyları adətən bir neçə mərhələdən ibarət olur. Komandamız hər bir tədbir zonasının günbəgün yenilənməsini və fərqli əhval-ruhiyyə yaratmasını təmin edir:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {multiDayFlows.map((flow, i) => (
                <div
                  key={i}
                  className="bg-[#141414] border border-white/10 p-6 rounded-sm space-y-3 hover:border-[#C5A059]/40 transition-colors"
                >
                  <span className="text-xs font-mono text-[#C5A059] block uppercase tracking-wider">
                    {flow.day}
                  </span>
                  <h3 className="font-serif text-lg text-white font-medium">{flow.label}</h3>
                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                    {flow.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Indian Wedding Connection Callout */}
            <div className="mt-10 p-6 sm:p-8 bg-[#141414] border border-[#C5A059]/40 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-mono font-medium block">
                  BEYNƏLXALQ VƏ HİND TOYLARI
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                  Çoxgünlük Hind Toyu Konseptləri
                </h3>
                <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                  Azərbaycanda təşkil edilən çoxgünlük Hind toyları üçün DreamArt Weddings Mehendi, Haldi, Sangeet musiqi gecəsi, ənənəvi mərasim və qala ziyafətləri üçün ayrı-ayrı fərdi dekorasiya konseptləri hazırlamaq imkanına malikdir.
                </p>
              </div>

              <div className="shrink-0 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/indian-wedding-azerbaijan')}
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 py-3 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>Hind Toyu Detalları</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Factors Section */}
        <section className="py-16 sm:py-20 bg-[#0B0B0B] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 max-w-3xl mx-auto">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                ŞƏFFAF VƏ FƏRDİ YANAŞMA
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
                Qəbələdə Toy Dekoru Qiyməti Necə Hesablanır?
              </h2>
              <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
              <p className="text-xs sm:text-sm text-white/70 font-light mt-4">
                Standart şablon qiymətlər əvəzinə layihənin faktiki miqyasına uyğun şəffaf smeta tərtib olunur. Əsas qiymət amilləri:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {pricingFactors.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] border border-white/10 p-5 rounded-sm flex items-start gap-4"
                >
                  <div className="w-7 h-7 rounded-sm bg-[#1C1A14] border border-[#C5A059]/30 flex items-center justify-center text-[#E5C378] shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <h4 className="font-serif text-sm sm:text-base text-white font-medium mb-1">
                      {item.label}
                    </h4>
                    <p className="text-xs text-white/70 font-light leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => onOpenQuoteModal('Qəbələ Toy Dekoru')}
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer shadow-xl"
              >
                Qəbələdə toy dekoru üçün qiymət təklifi al
              </button>
            </div>
          </div>
        </section>

        {/* GEO / AI Direct Answer Block */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                TEZ-TEZ VERİLƏN SUALLAR
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
                Qəbələdə Toy Dekoru Haqqında Məlumat
              </h2>
              <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
            </div>

            <div className="space-y-4">
              {directAnswerFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] border border-white/10 hover:border-[#C5A059]/40 p-6 rounded-sm transition-colors"
                >
                  <h3 className="font-serif text-base sm:text-lg text-white font-normal mb-2 flex items-start gap-2.5">
                    <span className="text-[#C5A059] font-mono text-xs mt-1">0{idx + 1}.</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 leading-relaxed pl-6 font-light">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Craftsmanship Reference Gallery (Verified DreamArt Work) */}
        <section className="py-16 sm:py-20 bg-[#0B0B0B] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono font-medium block mb-1">
                  USTALIQ VƏ İŞ MİQYASI
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  DreamArt Weddings Tərəfindən İcra Edilmiş Layihələr
                </h2>
                <p className="text-xs text-white/60 font-light mt-1">
                  Qəbələdəki layihəniz üçün çiçək keyfiyyəti, səhnə miqyası və zövq nümunəsi kimi real işlərimizlə tanış olun.
                </p>
              </div>
              <button
                onClick={() => navigate('/portfolio')}
                className="text-xs text-[#C5A059] hover:underline mt-2 sm:mt-0 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Bütün portfoliomuz</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {verifiedReferenceProjects.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(`/dekorlar/${item.slug}`)}
                  className="bg-[#141414] border border-white/10 rounded-sm overflow-hidden hover:border-[#C5A059]/40 transition-all cursor-pointer group"
                >
                  <div className="relative aspect-16/10 overflow-hidden bg-[#181818]">
                    <img
                      src={item.image}
                      alt={item.name}
                      width={640}
                      height={400}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-sm border border-white/10 text-[9px] uppercase px-2 py-0.5 text-white/80 font-mono">
                      {item.category}
                    </div>
                  </div>
                  <div className="p-5 space-y-2">
                    <h3 className="font-serif text-base text-white group-hover:text-[#E5C378] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-white/60 font-light leading-relaxed">
                      {item.description}
                    </p>
                    <div className="pt-2 text-xs text-[#C5A059] font-medium inline-flex items-center gap-1">
                      <span>Layihəyə bax</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final Contextual WhatsApp CTA Section */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-10 bg-[#121212] border border-[#C5A059]/40 text-center rounded-sm space-y-5 shadow-2xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono block">
                QƏBƏLƏ LAYİHƏNİZ ÜÇÜN BİZİMLƏ ƏLAQƏ SAXLAYIN
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Qəbələdə Unudulmaz Toy Günü Yaratmağa Hazırsınız?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl mx-auto leading-relaxed">
                Tədbirinizin tarixi, məkan növü və arzuladığınız üslub barədə birbaşa WhatsApp vasitəsilə komandamızla məsləhətləşin və ilkin smeta əldə edin.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <button
                  onClick={handleWhatsApp}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: {phoneDisplay}</span>
                </button>
                <button
                  onClick={() => onOpenQuoteModal('Qəbələ Toy Dekoru')}
                  className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Təklif İstəyin
                </button>
              </div>

              {/* Natural Internal Links Navigation */}
              <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-xs text-white/60">
                <button onClick={() => navigate('/destination-wedding-azerbaijan')} className="hover:text-[#E5C378] transition-colors cursor-pointer">
                  Destination Wedding Azerbaijan
                </button>
                <span>•</span>
                <button onClick={() => navigate('/indian-wedding-azerbaijan')} className="hover:text-[#E5C378] transition-colors cursor-pointer">
                  Indian Weddings
                </button>
                <span>•</span>
                <button onClick={() => navigate('/toy-dekoru')} className="hover:text-[#E5C378] transition-colors cursor-pointer">
                  Toy Dekoru
                </button>
                <span>•</span>
                <button onClick={() => navigate('/zal-dekoru')} className="hover:text-[#E5C378] transition-colors cursor-pointer">
                  Zal Dekoru
                </button>
                <span>•</span>
                <button onClick={() => navigate('/portfolio')} className="hover:text-[#E5C378] transition-colors cursor-pointer">
                  Portfolio
                </button>
                <span>•</span>
                <button onClick={() => navigate('/elaqe')} className="hover:text-[#E5C378] transition-colors cursor-pointer">
                  Əlaqə
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
