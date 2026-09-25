import React from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { getBreadcrumbSchema, getFaqPageSchema } from '../lib/structuredData';
import {
  Sparkles,
  MapPin,
  Truck,
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
  ArrowLeft
} from 'lucide-react';

interface BerdeToyDekoruPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (eventName?: string) => void;
}

export const BerdeToyDekoruPage: React.FC<BerdeToyDekoruPageProps> = ({
  navigate,
  onOpenQuoteModal
}) => {
  const phoneDisplay = '050 231 17 28';
  const phoneRaw = '+994502311728';
  const whatsappNumber = '994502311728';

  const whatsappMessage =
    'Salam, Bərdədə toy dekoru xidməti üçün qiymət təklifi almaq istəyirəm.';

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directAnswerFaqs = [
    {
      question: 'DreamArt Weddings Bərdədə toy dekoru xidməti göstərir?',
      answer:
        'Bəli. DreamArt Weddings Bərdə şəhəri və ətraf ərazilərdəki şadlıq sarayları, banket zalları və fərdi villalar üçün tam həcmli premium toy dekorasiyası layihələri həyata keçirir. Bütün dekorativ kompozisiyalar Bakıdakı emalatxanamızda xüsusi hazırlanır və Bərdədə peşəkar heyətimiz tərəfindən quraşdırılır.'
    },
    {
      question: 'Bakıdan Bərdəyə dekor aparılır?',
      answer:
        'Bəli. Orta və genişmiqyaslı toy dekorasiyası sifarişlərində xüsusi təchiz olunmuş yük nəqliyyatı və temperatur nəzarətli qablaşdırma vasitəsilə canlı çiçəklər, dekorativ konstruksiyalar və mebellər Bakıdan birbaşa Bərdədəki tədbir məkanına çatdırılır.'
    },
    {
      question: 'Bərdədə böyük şadlıq sarayı üçün tam dekor mümkündür?',
      answer:
        'Bəli. Geniş qonaq tutumuna malik zallar üçün monumental gəlin-bəy səhnəsi, bütün qonaq masalarının büllur şamdanlar və güllərlə bəzədilməsi, tavan asma instalyasiyaları və giriş fotozonası daxil olmaqla tam zal konsepti icra edilir.'
    },
    {
      question: 'Toy dekorunun qiyməti necə müəyyən olunur?',
      answer:
        'Qiymət zalın ölçüsünə, səhnə və masa sayına, çiçək kompozisiyalarının sıxlığına (təbii və ya premium süni floristika), işıqlandırma detallarına və Bakı–Bərdə logistika həcminə əsasən şəffaf fərdi smeta ilə hesablanır.'
    },
    {
      question: 'Bərdədə fərdi konsept üzrə dekor hazırlamaq mümkündür?',
      answer:
        'Bəli. Standart şablonlardan fərqli olaraq, gəlin və bəyin zövqünə, geyim rənginə və zalın memarlıq quruluşuna uyğun fərdi 3D eskiz və floristika dizaynı hazırlanır.'
    }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Bərdədə Premium Toy Dekoru',
      'description':
        'DreamArt Weddings Bərdədə premium toy dekoru, səhnə, zal, giriş, çiçək kompozisiyaları və fərdi dekor konseptləri təqdim edir. Qiymət təklifi üçün WhatsApp-la əlaqə saxlayın.',
      'provider': {
        '@type': 'LocalBusiness',
        'name': 'DreamArt Weddings',
        'telephone': '+994502311728',
        'url': 'https://dreamartweddings.com',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Bərdə',
          'addressCountry': 'AZ'
        }
      },
      'areaServed': {
        '@type': 'City',
        'name': 'Bərdə'
      },
      'serviceType': 'Toy Dekoru',
      'url': 'https://dreamartweddings.com/toy-dekoru/berde'
    },
    getBreadcrumbSchema([
      { name: 'Ana səhifə', url: 'https://dreamartweddings.com' },
      { name: 'Toy dekoru', url: 'https://dreamartweddings.com/toy-dekoru' },
      { name: 'Bərdədə Toy Dekoru', url: 'https://dreamartweddings.com/toy-dekoru/berde' }
    ]),
    getFaqPageSchema(directAnswerFaqs)
  ];

  const serviceFeatures = [
    {
      title: 'Monumental Gəlin-Bəy Səhnəsi',
      description:
        'Bərdənin geniş ziyafət zallarına uyğun hündür memarlıq arxa fon tağları, pilləli şam podiumları və zəngin çiçək kompozisiyaları.'
    },
    {
      title: 'Tam Zal və Tavan İnstalyasiyaları',
      description:
        'Tavan hündürlüyünə uyğun asma çiçək kompozisiyaları, çilçıraq bəzəkləri və zalın ümumi rəng ahəngini dəyişən zərif pərdə sistemləri.'
    },
    {
      title: 'Qonaq Masalarının Zövqlü Düzümü',
      description:
        'Hündür İtalyan büllur şamdanlar, zərif güldanlar, təbii qızılgül kompozisiyaları və xüsusi ziyafət süfrə runner-ləri.'
    },
    {
      title: 'Giriş Tuneli və Qarşılama Zonası',
      description:
        'Qonaqların ilk addımdan heyran qalacağı çiçəkli qarşılama qapıları, zərif işıqlandırma və cütlüyün adı qeyd olunmuş stendlər.'
    },
    {
      title: 'Fərdi Xatirə Fotozonası',
      description:
        'Neon yazılı arxa divarlar, dəbdəbəli gül arxitekturası və fotoqraflar üçün ideal işıq balansı ilə tərtib edilmiş xüsusi fotozona.'
    },
    {
      title: 'Təhlükəsiz Montaj və Operativ Sökülmə',
      description:
        'Bakıdan ezam olunmuş peşəkar heyət tərəfindən saatlar öncə quraşdırma və tədbir bitdikdən dərhal sonra səliqəli sökülmə.'
    }
  ];

  const pricingFactors = [
    {
      label: 'Məkan və Səhnə Ölçüsü',
      desc: 'Şadlıq sarayının zal sahəsi və qurulacaq gəlin-bəy səhnəsinin memarlıq miqyası.'
    },
    {
      label: 'Çiçək Sıxlığı və Tərkibi',
      desc: 'Hollandiya və Ekvadordan gətirilən təbii çiçəklərin həcmi və ya premium real-touch kompozisiyalar.'
    },
    {
      label: 'Qonaq Masalarının Sayı',
      desc: 'Tərtib ediləcək masaların miqdarı, istifadə olunacaq hündür şamdanlar və güldan dəstləri.'
    },
    {
      label: 'Fərdi İstehsal Konstruksiyaları',
      desc: 'Xüsusi sifarişlə hazırlanan tağlar, fərdi neon yazılar, xüsusi podyum və işıq sistemləri.'
    },
    {
      label: 'Bakı–Bərdə Logistika Xərcləri',
      desc: 'Nəqliyyat məsafəsi (~315 km), təbii güllərin soyuducu qutularda daşınması və montaj qrupunun ezamiyyəti.'
    },
    {
      label: 'Çoxzonallı Tərtibat',
      desc: 'Yalnız səhnə deyil, giriş tuneli, fotozona, tavan və masaların tam kompleks dekorasiyası.'
    }
  ];

  const orderingSteps = [
    {
      step: '01',
      title: 'İlkin Əlaqə və Məkan Məlumatı',
      description: 'WhatsApp və ya telefonla Bərdədəki toy tarixi, qonaq sayı və şadlıq sarayının adı bildirilir.'
    },
    {
      step: '02',
      title: '3D Eskiz və Şəffaf Smeta',
      description: 'Zalın parametrlərinə uyğun fərdi rəng palitrası, gül eskizi və detallı qiymət smetası hazırlanır.'
    },
    {
      step: '03',
      title: 'Hazırlıq və Logistika Planı',
      description: 'Bakıdakı emalatxanada konstruksiyalar və çiçəklər hazırlanır, nəqliyyat qrafiki təsdiqlənir.'
    },
    {
      step: '04',
      title: 'Məkanda Quraşdırma və Təhvil',
      description: 'Tədbir günü florist və texniki komandamız mərasimdən saatlar öncə dekoru tam hazır təhvil verir.'
    }
  ];

  const inspirationProjects = [
    {
      name: 'Ağ Qızılgül Toy Altarı Dekoru',
      category: 'Toy dekoru',
      slug: 'ag-qizilgul-ve-zerif-samli-toy-altari-baki',
      image: '/images/dreamart-toy-dekoru-qizili-altar.webp',
      description: 'Klassik lüks toy altar dekoru, canlı ağ güllər, şam işıqlandırması və zərif bəy-gəlin masası.'
    },
    {
      name: 'Monumental Toy Səhnəsi Dekoru',
      category: 'Səhnə dekoru',
      slug: 'qizili-arkali-ve-monumental-toy-sehnesi-baki',
      image: '/images/dreamart-monumental-toy-sehnesi-dekoru.webp',
      description: 'Geniş zallar üçün hündür qızılı tağlar, pilləli şam kompozisiyaları və zəngin gül arxitekturası.'
    },
    {
      name: 'Böyük Şadlıq Sarayı Zal Dekoru',
      category: 'Zal dekoru',
      slug: 'boyuk-sadliq-sarayi-zal-dekoru-baki',
      image: '/images/dreamart-zal-dekoru-tavan-instalyasiyasi.webp',
      description: 'Böyük ziyafət zalları üçün tavan pərdələri, asma çilçıraq gülləri və qonaq masası tərtibatı.'
    }
  ];

  return (
    <>
      <SeoHead
        title="Bərdədə Toy Dekoru | Premium Toy Dekorasiyası | DreamArt Weddings"
        description="DreamArt Weddings Bərdədə premium toy dekoru, səhnə, zal, giriş, çiçək kompozisiyaları və fərdi dekor konseptləri təqdim edir. Qiymət təklifi üçün WhatsApp-la əlaqə saxlayın."
        canonicalPath="/toy-dekoru/berde"
        ogImage="/images/dreamart-monumental-toy-sehnesi-dekoru.webp"
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
              <span className="text-[#C5A059]">Bərdə</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[460px] sm:min-h-[520px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src="/images/dreamart-monumental-toy-sehnesi-dekoru.webp"
            alt="Bərdədə premium toy dekoru"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-black/40" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-flex items-center gap-2 border border-[#C5A059]/40 bg-[#121212]/80 backdrop-blur-md px-3.5 py-1.5 rounded-sm mb-4 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C378] font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>BƏRDƏ VƏ QARABAĞ BÖLGƏSİ</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF8F5] font-normal mb-5 leading-tight">
              Bərdədə Premium Toy Dekoru
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light max-w-2xl mx-auto leading-relaxed mb-8">
              DreamArt Weddings Bərdənin şadlıq sarayları və fərdi məkanları üçün paytaxt standartlarında dəbdəbəli toy dekorasiyası,
              monumental səhnə memarlığı, canlı gül kompozisiyaları və tam zal tərtibatı təqdim edir.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleWhatsApp}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3 rounded-sm text-xs font-medium tracking-wider uppercase flex items-center gap-2 transition-all shadow-xl cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Bərdə Üzrə Qiymət Təklifi Al</span>
              </button>

              <button
                onClick={() => onOpenQuoteModal('Bərdə Toy Dekoru')}
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 py-3 rounded-sm text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
              >
                Sayt üzərindən sorğu göndər
              </button>
            </div>

            <div className="mt-4 flex items-center justify-center gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <Phone className="w-3 h-3 text-[#C5A059]" />
                <span>Rəsmi əlaqə: {phoneDisplay}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Truck className="w-3 h-3 text-[#C5A059]" />
                <span>Bakıdan birbaşa çatdırılma</span>
              </span>
            </div>
          </div>
        </section>

        {/* AI & GEO Direct Answer Callout Block */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-[#121212] border border-[#C5A059]/40 rounded-sm p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BƏRDƏ ÜZRƏ DİREKT FAKTLAR VƏ XİDMƏT MƏLUMATI</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {directAnswerFaqs.slice(0, 4).map((item, idx) => (
                <div key={idx} className="space-y-1.5 bg-[#161616] p-4 rounded-sm border border-white/5">
                  <h3 className="font-serif text-sm sm:text-base text-white font-medium flex items-start gap-2">
                    <span className="text-[#C5A059] font-mono text-xs mt-0.5">0{idx + 1}.</span>
                    <span>{item.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed pl-5">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C5A059]" />
                <span>Bakı–Bərdə logistika məsafəsi: ~315 km (xüsusi təhlükəsiz qablaşdırma ilə)</span>
              </div>
              <div className="flex items-center gap-2 text-[#E5C378] font-mono">
                <span>Birbaşa əlaqə: +994 50 231 17 28</span>
              </div>
            </div>
          </div>
        </section>

        {/* Commercial Content: Services Scope in Bərdə */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              XİDMƏT TƏRKİBİ
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal mb-4">
              Bərdədə Hansı Toy Dekor Xidmətləri Göstərilir?
            </h2>
            <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
              Bərdənin möhtəşəm şadlıq sarayları və banket məkanları üçün hazırlanan layihələrimiz yalnız standart masaları deyil,
              bütün zalın vizual aurasını dəyişən kompleks memarlıq həllərini əhatə edir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceFeatures.map((svc, idx) => (
              <div
                key={idx}
                className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/40 p-6 rounded-sm transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center mb-4 text-xs font-mono">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-lg text-white font-medium mb-2">
                  {svc.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  {svc.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Full Hall Decoration Details */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-6 space-y-4">
                <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block font-medium">
                  GENİŞMİQYASLI TƏRTİBAT
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                  Bərdədə Şadlıq Sarayı Üçün Tam Zal Dekoru
                </h2>
                <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                  Bərdədəki toy ziyafətləri adətən böyük qonaq heyəti ilə qeyd olunur. Zalın ölçülərindən asılı olaraq tam konsept aşağıdakı zonalardan ibarət olur:
                </p>

                <ul className="space-y-3 pt-2">
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-white/80 font-light">
                    <span className="w-4 h-4 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span><strong>Prezidium Zonası:</strong> Gəlin və bəy üçün xüsusi arxa fon, çiçəkli podyum və pilləli şam işıqlandırması.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-white/80 font-light">
                    <span className="w-4 h-4 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span><strong>Qonaq Masaları:</strong> Bütün masalar üçün vahid üslubda hündür büllur şamdanlar, zərif güllər və süfrə runner-ləri.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-white/80 font-light">
                    <span className="w-4 h-4 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span><strong>Foye və Giriş Tuneli:</strong> Qonaqların qarşılanması üçün çiçəkli tağlar və fərdi xatirə lövhəsi.</span>
                  </li>
                  <li className="flex items-start gap-3 text-xs sm:text-sm text-white/80 font-light">
                    <span className="w-4 h-4 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center shrink-0 mt-0.5">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                    <span><strong>Tavan və Çilçıraq Arxitekturası:</strong> Zalın tavan quruluşuna uyğun asma çiçək kompozisiyaları.</span>
                  </li>
                </ul>

                <div className="pt-4 flex flex-wrap gap-3">
                  <button
                    onClick={() => navigate('/zal-dekoru')}
                    className="bg-[#181818] border border-white/20 hover:border-[#C5A059] text-white px-5 py-2.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Zal Dekoru Xidmətimiz</span>
                    <ArrowRight className="w-3 h-3 text-[#C5A059]" />
                  </button>
                  <button
                    onClick={() => navigate('/portfolio')}
                    className="text-xs text-[#C5A059] hover:underline px-4 py-2.5 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>Portfolio bax</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 bg-[#121212] border border-white/10 p-6 sm:p-8 rounded-sm space-y-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono block">
                  BƏRDƏ SİFARİŞLƏRİNDƏ LOGİSTİKA
                </span>
                <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                  Çatdırılma və Quraşdırma Necə Təşkil Olunur?
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  Bakıdan Bərdəyə təxminən 315 km məsafə vardır. Canlı çiçəklərin təravətini və şüşə aksesuarların bütövlüyünü qorumaq üçün logistika planı belə icra edilir:
                </p>

                <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-white/80 font-light">
                  <div className="p-3 bg-[#161616] rounded-xs border border-white/5 flex items-start gap-2">
                    <span className="text-[#C5A059] mt-0.5">◆</span>
                    <span>Çiçəklər xüsusi su qablarında və iqlim nəzarətli qutularda daşınır.</span>
                  </div>
                  <div className="p-3 bg-[#161616] rounded-xs border border-white/5 flex items-start gap-2">
                    <span className="text-[#C5A059] mt-0.5">◆</span>
                    <span>Quraşdırma komandası tədbirdən 6–12 saat öncə Bərdədəki zala daxil olur.</span>
                  </div>
                  <div className="p-3 bg-[#161616] rounded-xs border border-white/5 flex items-start gap-2">
                    <span className="text-[#C5A059] mt-0.5">◆</span>
                    <span>Tədbir gecə bitdikdən dərhal sonra zal təmiz və səliqəli şəkildə təhvil verilir.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Factors Section (Price Intent Handled Honestly) */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              ŞƏFFAF HESABLAMA
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal mb-4">
              Bərdədə Toy Dekorunun Qiymətinə Təsir Edən Faktorlar
            </h2>
            <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
              Hər bir toy layihəsi unikal olduğu üçün sabit qiymət cədvəli əvəzinə fərdi smeta tərtib edilir.
              Qiyməti formalaşdıran əsas parametrlər bunlardır:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pricingFactors.map((f, i) => (
              <div key={i} className="bg-[#121212] border border-white/10 p-5 rounded-sm space-y-2">
                <span className="text-[10px] uppercase tracking-wider text-[#C5A059] font-mono block">
                  Faktor 0{i + 1}
                </span>
                <h3 className="font-serif text-base text-white font-medium">{f.label}</h3>
                <p className="text-xs text-white/70 font-light leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 bg-[#141414] border border-[#C5A059]/30 rounded-sm text-center max-w-2xl mx-auto">
            <p className="text-xs sm:text-sm text-white/80 font-light mb-4">
              Bərdədə keçiriləcək toyunuz üçün məkan parametrlərini və arzu etdiyiniz tərzi bizə bildirin,
              komandamız sizə dəqiq smeta təklifi hazırlasın.
            </p>
            <button
              onClick={handleWhatsApp}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3 rounded-sm text-xs font-medium tracking-wide uppercase transition-all inline-flex items-center gap-2 cursor-pointer shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Qiymət Təklifi Al</span>
            </button>
          </div>
        </section>

        {/* Ordering Steps */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                SİFARİŞ PROSESİ
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Bərdə Toy Sifarişinin 4 Mərhələsi
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {orderingSteps.map((step, idx) => (
                <div key={idx} className="bg-[#141414] border border-white/10 p-5 rounded-sm space-y-2">
                  <span className="font-mono text-xl text-[#C5A059] font-medium block">
                    {step.step}
                  </span>
                  <h3 className="font-serif text-base text-white font-normal">{step.title}</h3>
                  <p className="text-xs text-white/70 font-light leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Real Completed Projects as Inspiration Note */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-white/10">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-1 font-medium font-mono">
                REAL İŞLƏR VƏ İLHAM NÜMUNƏLƏRİ
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                DreamArt Weddings Layihələri
              </h2>
            </div>
            <button
              onClick={() => navigate('/portfolio')}
              className="text-xs text-[#C5A059] hover:underline mt-2 sm:mt-0 inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Bütün portfoliomuz</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <p className="text-xs sm:text-sm text-white/70 font-light mb-8 max-w-3xl">
            Bərdə sifarişləri üçün DreamArt Weddings-in Bakı və digər bölgələrdə icra etdiyi monumental layihələr keyfiyyət və dizayn standartı kimi təqdim olunur.
            Bərdədəki toyunuz üçün fərdi konsept sıfırdan hazırlanır.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {inspirationProjects.map((p, idx) => (
              <div
                key={idx}
                className="group bg-[#141414] border border-white/10 hover:border-[#C5A059]/40 rounded-sm overflow-hidden transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => navigate(`/dekorlar/${p.slug}`)}
              >
                <div className="relative h-48 w-full overflow-hidden bg-black/40">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-[10px] text-[#C5A059] px-2 py-0.5 rounded-xs font-mono">
                    {p.category}
                  </span>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-serif text-base text-white group-hover:text-[#E5C378] transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-white/60 line-clamp-2 mt-1 font-light">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#C5A059]">
                    <span className="text-[11px] text-white/40">Real icra olunmuş layihə</span>
                    <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ətraflı bax <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <section className="py-16 sm:py-24 bg-[#0E0E0E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                TEZ-TEZ VERİLƏN SUALLAR
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Bərdədə Toy Dekoru Haqqında Ətraflı
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

            {/* Bottom Final CTA */}
            <div className="mt-14 p-8 bg-[#121212] border border-[#C5A059]/40 text-center rounded-sm space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono block">
                BƏRDƏ TOYUNUZU UNUDULMAZ EDİN
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Fərdi Konsept və Qiymət Təklifi Alın
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl mx-auto leading-relaxed">
                Tədbirinizin tarixini və məkanını WhatsApp vasitəsilə komandamızla paylaşın, sizə özəl dekor layihəsi hazırlayaq.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: 050 231 17 28</span>
                </button>
                <button
                  onClick={() => onOpenQuoteModal('Bərdə Toy Dekoru')}
                  className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Sayt üzərindən sorğu göndər
                </button>
              </div>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-white/60">
                <button onClick={() => navigate('/toy-dekoru')} className="hover:text-[#C5A059] cursor-pointer">
                  Toy Dekoru
                </button>
                <span>•</span>
                <button onClick={() => navigate('/zal-dekoru')} className="hover:text-[#C5A059] cursor-pointer">
                  Zal Dekoru
                </button>
                <span>•</span>
                <button onClick={() => navigate('/portfolio')} className="hover:text-[#C5A059] cursor-pointer">
                  Portfolio
                </button>
                <span>•</span>
                <button onClick={() => navigate('/restoranlar')} className="hover:text-[#C5A059] cursor-pointer">
                  Məkanlar
                </button>
                <span>•</span>
                <button onClick={() => navigate('/elaqe')} className="hover:text-[#C5A059] cursor-pointer">
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
