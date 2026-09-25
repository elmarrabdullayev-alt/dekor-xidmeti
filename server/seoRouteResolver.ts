import { CATEGORIES } from '../src/data/categories';
import { INITIAL_VENUES } from '../src/data/initialVenues';
import { INITIAL_DECORS } from '../src/data/initialDecors';
import { REGIONAL_LOCATIONS } from '../src/data/regionalData';
import {
  getLocalBusinessSchema,
  getCategoryServiceSchema,
  getFaqPageSchema,
  getBreadcrumbSchema,
  getProjectDetailSchema,
  getProjectImageSchema
} from '../src/lib/structuredData';
import { isVenueIndexable, getVenueStructuredData } from '../src/lib/venueHelper';
import { isProjectIndexable } from '../src/lib/seoHelper';
import { DecorCategorySlug } from '../src/types';

export interface RouteSeoData {
  title: string;
  description: string;
  canonicalUrl: string;
  robots: string;
  ogImage: string;
  ogType: string;
  jsonLd?: any;
}

const PRIMARY_DOMAIN = 'https://dreamartweddings.com';
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85';

export function resolveRouteSeo(pathname: string): RouteSeoData {
  const cleanPath = (pathname.split('?')[0] || '/').replace(/\/+$/, '') || '/';

  // 1. Admin routes - noindex
  if (cleanPath.startsWith('/admin')) {
    return {
      title: 'Admin Panel | DreamArt Weddings',
      description: 'DreamArt Weddings idarəetmə paneli.',
      canonicalUrl: `${PRIMARY_DOMAIN}/admin`,
      robots: 'noindex, nofollow',
      ogImage: DEFAULT_IMAGE,
      ogType: 'website'
    };
  }

  // 2. Home route
  if (cleanPath === '/') {
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

    return {
      title: 'DreamArt Weddings | Zövqlü və Premium Dekor Həlləri Bakı',
      description: 'Toy, nişan, xına, ad günü, zal dekor və xonça xidmətləri. Bakı və Azərbaycanın bütün regionlarında zövqlü və peşəkar quraşdırma.',
      canonicalUrl: `${PRIMARY_DOMAIN}/`,
      robots: 'index, follow',
      ogImage: DEFAULT_IMAGE,
      ogType: 'website',
      jsonLd: [
        getLocalBusinessSchema(),
        getFaqPageSchema(homeFaqs)
      ]
    };
  }

  // 3. Venues Catalog Page (/restoranlar)
  if (cleanPath === '/restoranlar') {
    return {
      title: 'Toy və Tədbir Məkanları | Restoran Dekoru | DreamArt Weddings',
      description: 'DreamArt Weddings müxtəlif restoran və tədbir məkanlarında dekor layihələri həyata keçirir. Məkanlara uyğun real işlər və dekor nümunələri bu bölmədə təqdim olunur.',
      canonicalUrl: `${PRIMARY_DOMAIN}/restoranlar`,
      robots: 'index, follow',
      ogImage: DEFAULT_IMAGE,
      ogType: 'website',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          'name': 'Toy və tədbir məkanları | DreamArt Weddings',
          'description': 'DreamArt Weddings müxtəlif restoran və tədbir məkanlarında dekor layihələri həyata keçirir. Məkanlara uyğun real işlər və dekor nümunələri.',
          'url': `${PRIMARY_DOMAIN}/restoranlar`
        },
        {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Ana səhifə',
              'item': PRIMARY_DOMAIN
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Restoranlar',
              'item': `${PRIMARY_DOMAIN}/restoranlar`
            }
          ]
        }
      ]
    };
  }

  // 4. Venue Detail Page (/restoranlar/:slug)
  if (cleanPath.startsWith('/restoranlar/')) {
    const slug = cleanPath.replace('/restoranlar/', '');
    const venue = INITIAL_VENUES.find(v => v.slug === slug);
    if (venue) {
      const isIndexable = isVenueIndexable(venue, INITIAL_DECORS);
      const canonicalUrl = `${PRIMARY_DOMAIN}/restoranlar/${venue.slug}`;
      const jsonLd = getVenueStructuredData(venue, canonicalUrl);
      return {
        title: venue.seoTitle || `${venue.name} Toy Dekoru | DreamArt Weddings`,
        description: venue.metaDescription || venue.shortDescription,
        canonicalUrl,
        robots: isIndexable ? 'index, follow' : 'noindex, follow',
        ogImage: venue.mainImage || DEFAULT_IMAGE,
        ogType: 'website',
        jsonLd
      };
    }
  }

  // 5. Decors Catalog Page (/dekorlar)
  if (cleanPath === '/dekorlar') {
    return {
      title: 'Bütün Dekorlar və Xidmətlər | DreamArt Weddings',
      description: 'Toy, nişan, xına, ad günü, zal dekorasiyası və xonça xidməti layihələri kataloqu. Bakı və regionlar üçün premium dekorasiya.',
      canonicalUrl: `${PRIMARY_DOMAIN}/dekorlar`,
      robots: 'index, follow',
      ogImage: DEFAULT_IMAGE,
      ogType: 'website'
    };
  }

  // 6. Project Detail Page (/dekorlar/:slug)
  if (cleanPath.startsWith('/dekorlar/')) {
    const slug = cleanPath.replace('/dekorlar/', '');
    const decor = INITIAL_DECORS.find(d => d.slug === slug);
    if (decor) {
      const isIndexable = isProjectIndexable(decor);
      const canonicalUrl = `${PRIMARY_DOMAIN}/dekorlar/${decor.slug}`;
      const jsonLd = [
        getProjectDetailSchema(decor, canonicalUrl),
        getProjectImageSchema(decor),
        getBreadcrumbSchema([
          { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
          { name: decor.categoryName, url: `${PRIMARY_DOMAIN}/${decor.category}` },
          { name: decor.name, url: canonicalUrl }
        ])
      ];
      return {
        title: decor.seoTitle || `${decor.name} | DreamArt Weddings`,
        description: decor.metaDescription || decor.shortDescription,
        canonicalUrl,
        robots: isIndexable ? 'index, follow' : 'noindex, follow',
        ogImage: decor.mainImage || DEFAULT_IMAGE,
        ogType: 'article',
        jsonLd
      };
    }
  }

  // 7. Portfolio Page (/portfolio)
  if (cleanPath === '/portfolio') {
    return {
      title: 'Portfolio və Həyata Keçirilmiş İşlər | DreamArt Weddings',
      description: 'Bakı və Azərbaycan regionlarında həyata keçirdiyimiz toy, nişan, xına və xonça dekorasiyalarının fotoları.',
      canonicalUrl: `${PRIMARY_DOMAIN}/portfolio`,
      robots: 'index, follow',
      ogImage: DEFAULT_IMAGE,
      ogType: 'website'
    };
  }

  // 8. Services Page (/xidmetler)
  if (cleanPath === '/xidmetler') {
    return {
      title: 'Dekor Xidmətlərimiz və İş Prosesi | DreamArt Weddings',
      description: 'Fərdi dekor konsepti, floristik dizayn, çatdırılma, montaj, sökülmə və xonça xidmətləri. Bakı və regionlar üçün peşəkar servis.',
      canonicalUrl: `${PRIMARY_DOMAIN}/xidmetler`,
      robots: 'index, follow',
      ogImage: DEFAULT_IMAGE,
      ogType: 'website'
    };
  }

  // 9. About Page (/haqqimizda)
  if (cleanPath === '/haqqimizda') {
    return {
      title: 'Haqqımızda | DreamArt Weddings',
      description: 'DreamArt Weddings haqqında məlumat. Azərbaycan üzrə zövqlü və premium toy, nişan, xına, xonça və tədbir dekorasiyası fəlsəfəmiz.',
      canonicalUrl: `${PRIMARY_DOMAIN}/haqqimizda`,
      robots: 'index, follow',
      ogImage: DEFAULT_IMAGE,
      ogType: 'website'
    };
  }

  // 10. Contact Page (/elaqe)
  if (cleanPath === '/elaqe') {
    return {
      title: 'Əlaqə | DreamArt Weddings Bakı',
      description: 'DreamArt Weddings ilə əlaqə. Ünvan, telefon, WhatsApp və tədbir dekorasiyası üçün sorğu göndərmə imkanı.',
      canonicalUrl: `${PRIMARY_DOMAIN}/elaqe`,
      robots: 'index, follow',
      ogImage: DEFAULT_IMAGE,
      ogType: 'website'
    };
  }

  // 10b. Indian Destination Wedding Page (/indian-wedding-azerbaijan)
  if (cleanPath === '/indian-wedding-azerbaijan') {
    const indianFaqs = [
      {
        question: 'Do you provide Indian wedding decoration in Azerbaijan?',
        answer: 'Yes. DreamArt Weddings provides event decor services across Azerbaijan, including multi-day wedding concepts, stage styling, floral decor, ceremony areas and reception decoration.'
      },
      {
        question: 'Can DreamArt Weddings decorate a 3-day Indian wedding?',
        answer: 'Yes. We design and manage coordinated yet visually distinct environments across multiple days, including Mehendi, Haldi, Sangeet, traditional ceremony and grand reception events with seamless daily transitions.'
      },
      {
        question: 'Do you provide Mehendi and Sangeet decoration?',
        answer: 'Yes. We craft colorful, bohemian or traditional setups for Mehendi and Haldi, dynamic stage and lighting backdrops for Sangeet nights, and regal settings for evening parties.'
      },
      {
        question: 'Can you provide wedding decor outside Baku?',
        answer: 'Yes. Our logistics fleet and professional setup crews manage destination weddings in Gabala, Guba, Shamakhi, and resort locations throughout Azerbaijan.'
      },
      {
        question: 'How can international clients contact DreamArt Weddings?',
        answer: 'International couples and wedding planners can reach our team via WhatsApp at +994 50 231 17 28 or phone 050 231 17 28 to schedule a virtual consultation and receive an initial decor estimate.'
      }
    ];

    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'Indian Wedding Decoration in Azerbaijan',
        'description': 'Luxury Indian wedding decoration in Azerbaijan for Mehendi, Sangeet, ceremony and reception events. DreamArt Weddings provides custom multi-day decor across Baku and regions.',
        'provider': {
          '@type': 'LocalBusiness',
          'name': 'DreamArt Weddings',
          'telephone': '+994502311728',
          'url': 'https://dreamartweddings.com',
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Baku',
            'addressCountry': 'AZ'
          }
        },
        'areaServed': {
          '@type': 'Country',
          'name': 'Azerbaijan'
        },
        'serviceType': 'Indian Destination Wedding Decor',
        'url': `${PRIMARY_DOMAIN}/indian-wedding-azerbaijan`
      },
      getBreadcrumbSchema([
        { name: 'Home', url: PRIMARY_DOMAIN },
        { name: 'Indian Wedding Decoration in Azerbaijan', url: `${PRIMARY_DOMAIN}/indian-wedding-azerbaijan` }
      ]),
      getFaqPageSchema(indianFaqs)
    ];

    return {
      title: 'Indian Wedding Decoration in Azerbaijan | DreamArt Weddings',
      description: 'Luxury Indian wedding decoration in Azerbaijan for Mehendi, Sangeet, ceremony and reception events. DreamArt Weddings provides custom multi-day decor across Baku and regions.',
      canonicalUrl: `${PRIMARY_DOMAIN}/indian-wedding-azerbaijan`,
      robots: 'index, follow',
      ogImage: '/images/dreamart-monumental-toy-sehnesi-dekoru.webp',
      ogType: 'website',
      jsonLd
    };
  }

  // 10bb. Destination Wedding in Azerbaijan Page (/destination-wedding-azerbaijan)
  if (cleanPath === '/destination-wedding-azerbaijan') {
    const destinationFaqs = [
      {
        question: 'Why choose Azerbaijan for a destination wedding?',
        answer: 'Azerbaijan offers a unique convergence of Eastern hospitality and European architectural elegance. With world-class 5-star hotels in Baku, scenic Caucasus mountain resorts in Gabala and Guba, favorable climate, simplified e-visas, and exceptional culinary traditions, Azerbaijan has become one of Eurasia’s premier destination wedding hubs.'
      },
      {
        question: 'Can DreamArt Weddings handle destination decor outside of Baku?',
        answer: 'Absolutely. DreamArt Weddings manages full-scale logistics across Azerbaijan, including Gabala, Guba, Shamakhi, Lankaran, and Sheki. We operate climate-controlled transport vehicles to ensure fresh florals and bespoke architectural structures arrive in pristine condition.'
      },
      {
        question: 'How do you coordinate with international couples and wedding planners?',
        answer: 'We work seamlessly with couples, international destination wedding planners, and hospitality concierges worldwide. Our workflow includes virtual 3D floorplans, moodboards, scheduled video consultations via Zoom or WhatsApp, and detailed itemized transparent proposals.'
      },
      {
        question: 'Do you design multi-day and cross-cultural weddings such as Indian weddings?',
        answer: 'Yes. We specialize in multi-day celebrations including Indian destination weddings with distinct themes for Mehendi, Haldi, Sangeet, Mandap ceremonies, and gala receptions, as well as European, Middle Eastern, and Caucasian cultural fusions.'
      },
      {
        question: 'What is the recommended timeline to book destination wedding decor in Azerbaijan?',
        answer: 'For peak wedding seasons (May through October), we recommend securing your date 4 to 9 months in advance. However, our modular in-house production and floral sourcing capabilities allow us to accommodate shorter lead times whenever venue dates permit.'
      },
      {
        question: 'What services are included in your destination wedding package?',
        answer: 'Our turnkey decor services include ceremony altars and arches, floral styling with imported blossoms, bespoke guest table settings, crystal candelabras, customized stage architecture, atmospheric fairy lighting, personalized signage, dance floors, and full overnight setup and breakdown.'
      }
    ];

    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'Destination Wedding Decoration in Azerbaijan',
        'description': 'Luxury destination wedding decor and production in Azerbaijan. Bespoke wedding styling in Baku, Gabala, Guba, and Shamakhi with fresh floral architecture, ceremony altars, and multi-day celebrations.',
        'provider': {
          '@type': 'LocalBusiness',
          'name': 'DreamArt Weddings',
          'telephone': '+994502311728',
          'url': PRIMARY_DOMAIN,
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Baku',
            'addressCountry': 'AZ'
          }
        },
        'areaServed': {
          '@type': 'Country',
          'name': 'Azerbaijan'
        },
        'serviceType': 'Destination Wedding Decor and Production',
        'url': `${PRIMARY_DOMAIN}/destination-wedding-azerbaijan`
      },
      getBreadcrumbSchema([
        { name: 'Home', url: PRIMARY_DOMAIN },
        { name: 'Destination Wedding in Azerbaijan', url: `${PRIMARY_DOMAIN}/destination-wedding-azerbaijan` }
      ]),
      getFaqPageSchema(destinationFaqs)
    ];

    return {
      title: 'Destination Wedding in Azerbaijan | Luxury Decor by DreamArt Weddings',
      description: 'Bespoke destination wedding decoration and styling in Azerbaijan. From Baku Caspian coastal venues to Gabala mountain resorts and multi-day celebrations.',
      canonicalUrl: `${PRIMARY_DOMAIN}/destination-wedding-azerbaijan`,
      robots: 'index, follow',
      ogImage: '/images/dreamart-monumental-toy-sehnesi-dekoru.webp',
      ogType: 'website',
      jsonLd
    };
  }

  // 10c. Bərdə Dedicated Regional Page (/toy-dekoru/berde)
  if (cleanPath === '/toy-dekoru/berde') {
    const berdeFaqs = [
      {
        question: 'DreamArt Weddings Bərdədə toy dekoru xidməti göstərir?',
        answer: 'Bəli. DreamArt Weddings Bərdə şəhəri və ətraf ərazilərdəki şadlıq sarayları, banket zalları və fərdi villalar üçün tam həcmli premium toy dekorasiyası layihələri həyata keçirir. Bütün dekorativ kompozisiyalar Bakıdakı emalatxanamızda xüsusi hazırlanır və Bərdədə peşəkar heyətimiz tərəfindən quraşdırılır.'
      },
      {
        question: 'Bakıdan Bərdəyə dekor aparılır?',
        answer: 'Bəli. Orta və genişmiqyaslı toy dekorasiyası sifarişlərində xüsusi təchiz olunmuş yük nəqliyyatı və temperatur nəzarətli qablaşdırma vasitəsilə canlı çiçəklər, dekorativ konstruksiyalar və mebellər Bakıdan birbaşa Bərdədəki tədbir məkanına çatdırılır.'
      },
      {
        question: 'Bərdədə böyük şadlıq sarayı üçün tam dekor mümkündür?',
        answer: 'Bəli. Geniş qonaq tutumuna malik zallar üçün monumental gəlin-bəy səhnəsi, bütün qonaq masalarının büllur şamdanlar və güllərlə bəzədilməsi, tavan asma instalyasiyaları və giriş fotozonası daxil olmaqla tam zal konsepti icra edilir.'
      },
      {
        question: 'Toy dekorunun qiyməti necə müəyyən olunur?',
        answer: 'Qiymət zalın ölçüsünə, səhnə və masa sayına, çiçək kompozisiyalarının sıxlığına (təbii və ya premium süni floristika), işıqlandırma detallarına və Bakı–Bərdə logistika həcminə əsasən şəffaf fərdi smeta ilə hesablanır.'
      },
      {
        question: 'Bərdədə fərdi konsept üzrə dekor hazırlamaq mümkündür?',
        answer: 'Bəli. Standart şablonlardan fərqli olaraq, gəlin və bəyin zövqünə, geyim rənginə və zalın memarlıq quruluşuna uyğun fərdi 3D eskiz və floristika dizaynı hazırlanır.'
      }
    ];

    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'Bərdədə Premium Toy Dekoru',
        'description': 'DreamArt Weddings Bərdədə premium toy dekoru, səhnə, zal, giriş, çiçək kompozisiyaları və fərdi dekor konseptləri təqdim edir. Qiymət təklifi üçün WhatsApp-la əlaqə saxlayın.',
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
        'url': `${PRIMARY_DOMAIN}/toy-dekoru/berde`
      },
      getBreadcrumbSchema([
        { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
        { name: 'Toy dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru` },
        { name: 'Bərdədə Toy Dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru/berde` }
      ]),
      getFaqPageSchema(berdeFaqs)
    ];

    return {
      title: 'Bərdədə Toy Dekoru | Premium Toy Dekorasiyası | DreamArt Weddings',
      description: 'DreamArt Weddings Bərdədə premium toy dekoru, səhnə, zal, giriş, çiçək kompozisiyaları və fərdi dekor konseptləri təqdim edir. Qiymət təklifi üçün WhatsApp-la əlaqə saxlayın.',
      canonicalUrl: `${PRIMARY_DOMAIN}/toy-dekoru/berde`,
      robots: 'index, follow',
      ogImage: '/images/dreamart-monumental-toy-sehnesi-dekoru.webp',
      ogType: 'website',
      jsonLd
    };
  }

  // 10d. Qəbələ Dedicated Destination Wedding Page (/toy-dekoru/qebele)
  if (cleanPath === '/toy-dekoru/qebele') {
    const qebeleFaqs = [
      {
        question: 'DreamArt Weddings Qəbələdə toy dekoru xidməti göstərir?',
        answer: 'Bəli. DreamArt Weddings Qəbələ şəhəri, dağ kurortları, fərdi villalar və ziyafət məkanları üçün tam həcmli toy dekorasiyası layihələri həyata keçirir. Konsept dizaynı, çiçək arxitekturası və quraşdırma komandası Bakıdan birbaşa Qəbələyə ezam olunur.'
      },
      {
        question: 'Qəbələdə destination wedding dekoru sifariş etmək mümkündür?',
        answer: 'Bəli. Azərbaycanın digər şəhərlərindən və ya xaricdən gələn cütlüklər üçün Qəbələdə çoxgünlük destination wedding dekoru təşkil edilir. Mərasim tağı, axşam ziyafəti və qonaq zonaları vahid lüks üslubda tərtib olunur.'
      },
      {
        question: 'Qəbələdə açıq hava toy dekoru hazırlamaq mümkündür?',
        answer: 'Bəli. Dağ mənzərəli çəmənliklər və meşə kənarı açıq hava məkanları üçün küləyə davamlı möhkəm altar konstruksiyaları, çiçəkli nikah tağları, işıqlandırma çilçıraqları və xüsusi oturma zonaları qurulur.'
      },
      {
        question: 'Bakıdan Qəbələyə dekor və quraşdırma komandası gəlir?',
        answer: 'Bəli. Canlı çiçəklər və dekorasiya elementləri Bakıdakı emalatxanamızdan temperatur nəzarətli xüsusi yük maşınları ilə Qəbələyə daşınır. Peşəkar florist və montaj qrupumuz tədbirdən saatlar öncə məkanda tam quraşdırmanı həyata keçirir.'
      },
      {
        question: 'Qəbələdə bir neçə günlük toy tədbiri üçün fərqli dekor konseptləri hazırlamaq mümkündür?',
        answer: 'Bəli. Welcome dinner, nikah mərasimi, qala ziyafət və after-party kimi mərhələlər üçün hər günə uyğun fərqli rəng palitrası və dekorasiya çevrilməsi (turnaround) təmin edilir.'
      },
      {
        question: 'Qəbələdə toy dekorunun qiyməti necə müəyyən olunur?',
        answer: 'Qiymət seçilən məkanın növünə (açıq hava və ya qapalı zal), səhnə və masa sayına, çiçək kompozisiyalarının sıxlığına, xüsusi konstruksiya istehsalına və Bakı–Qəbələ logistika həcminə əsasən şəffaf fərdi smeta ilə hesablanır.'
      }
    ];

    const jsonLd = [
      {
        '@context': 'https://schema.org',
        '@type': 'Service',
        'name': 'Qəbələdə Premium Toy Dekoru və Destination Wedding Dekorasiyası',
        'description': 'DreamArt Weddings Qəbələdə premium toy dekoru, destination wedding styling, açıq hava mərasimi, reception, səhnə və regional quraşdırma xidmətləri təqdim edir.',
        'provider': {
          '@type': 'LocalBusiness',
          'name': 'DreamArt Weddings',
          'telephone': '+994502311728',
          'url': PRIMARY_DOMAIN,
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
        'url': `${PRIMARY_DOMAIN}/toy-dekoru/qebele`
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': 'Qəbələdə Toy Dekoru | Destination Wedding Dekorasiyası | DreamArt Weddings',
        'description': 'DreamArt Weddings Qəbələdə premium toy dekoru, destination wedding styling, açıq hava mərasimi, reception, səhnə və regional quraşdırma xidmətləri təqdim edir.',
        'url': `${PRIMARY_DOMAIN}/toy-dekoru/qebele`
      },
      getBreadcrumbSchema([
        { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
        { name: 'Toy dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru` },
        { name: 'Qəbələdə Toy Dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru/qebele` }
      ]),
      getFaqPageSchema(qebeleFaqs)
    ];

    return {
      title: 'Qəbələdə Toy Dekoru | Destination Wedding Dekorasiyası | DreamArt Weddings',
      description: 'DreamArt Weddings Qəbələdə premium toy dekoru, destination wedding styling, açıq hava mərasimi, reception, səhnə və regional quraşdırma xidmətləri təqdim edir.',
      canonicalUrl: `${PRIMARY_DOMAIN}/toy-dekoru/qebele`,
      robots: 'index, follow',
      ogImage: '/images/dreamart-tebii-budag-agac-kompozisiyasi.webp',
      ogType: 'website',
      jsonLd
    };
  }

  // 11. Category or Local SEO Routes
  const parts = cleanPath.split('/').filter(Boolean);
  if (parts.length === 1) {
    const categorySlug = parts[0] as DecorCategorySlug;
    const category = CATEGORIES.find(c => c.slug === categorySlug);
    if (category) {
      const jsonLd = [
        getCategoryServiceSchema(category),
        getFaqPageSchema(category.faqs),
        getBreadcrumbSchema([
          { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
          { name: category.name, url: `${PRIMARY_DOMAIN}/${category.slug}` }
        ])
      ];
      return {
        title: category.metaTitle,
        description: category.metaDescription,
        canonicalUrl: `${PRIMARY_DOMAIN}/${category.slug}`,
        robots: 'index, follow',
        ogImage: category.heroImage || DEFAULT_IMAGE,
        ogType: 'website',
        jsonLd
      };
    }
  } else if (parts.length === 2) {
    const categorySlug = parts[0] as DecorCategorySlug;
    const citySlug = parts[1];
    const category = CATEGORIES.find(c => c.slug === categorySlug);
    const location = REGIONAL_LOCATIONS.find(l => l.slug === citySlug);
    if (category && location) {
      const localFaqs = [
        {
          question: `${location.city} şəhərində ${category.name.toLowerCase()} quraşdırılması necə aparılır?`,
          answer: `Komandamız tədbir günü və ya bir gün əvvəl ${location.city} şəhərindəki məkana çatır və dekorasiyanın tam təhlükəsiz quraşdırılmasını təmin edir.`
        },
        {
          question: `${location.city} üçün nəqliyyat və çatdırılma xərci necə hesablanır?`,
          answer: location.logisticsNotice
        },
        {
          question: `Hansı həcmdə ${category.name.toLowerCase()} layihələri ${location.city} üçün daha uyğundur?`,
          answer: 'Orta və lüks tam həcmli dekor layihələri üçün regiona xüsusi heyət ezam olunur.'
        }
      ];
      const jsonLd = [
        getBreadcrumbSchema([
          { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
          { name: category.name, url: `${PRIMARY_DOMAIN}/${category.slug}` },
          { name: `${location.city} ${category.name}`, url: `${PRIMARY_DOMAIN}/${category.slug}/${location.slug}` }
        ]),
        getFaqPageSchema(localFaqs)
      ];
      const isCuratedLocal = [
        'toy-dekoru/baki',
        'toy-dekoru/qebele',
        'toy-dekoru/berde',
        'nisan-dekoru/baki',
        'xina-dekoru/baki'
      ].includes(`${category.slug}/${location.slug}`);

      return {
        title: `${location.city} ${category.name} | DreamArt Weddings`,
        description: `${location.city} şəhərində peşəkar ${category.name.toLowerCase()} xidməti. Quraşdırma, unikal çiçək dizaynı və etibarlı logistika.`,
        canonicalUrl: `${PRIMARY_DOMAIN}/${category.slug}/${location.slug}`,
        robots: isCuratedLocal ? 'index, follow' : 'noindex, follow',
        ogImage: category.heroImage || DEFAULT_IMAGE,
        ogType: 'website',
        jsonLd
      };
    }
  }

  // Fallback for not found routes
  return {
    title: 'Səhifə Tapılmadı | DreamArt Weddings',
    description: 'Axtardığınız səhifə mövcud deyil və ya ünvanı dəyişdirilib.',
    canonicalUrl: `${PRIMARY_DOMAIN}/`,
    robots: 'noindex, follow',
    ogImage: DEFAULT_IMAGE,
    ogType: 'website'
  };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function injectHeadSeo(html: string, seo: RouteSeoData): string {
  let result = html;

  // Replace <title>
  if (result.includes('<title>')) {
    result = result.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(seo.title)}</title>`);
  } else {
    result = result.replace('</head>', `  <title>${escapeHtml(seo.title)}</title>\n</head>`);
  }

  // Replace <meta name="description" ... />
  const metaDescTag = `<meta name="description" content="${escapeHtml(seo.description)}" />`;
  if (/<meta\s+name=["']description["'][^>]*\/?>/i.test(result)) {
    result = result.replace(/<meta\s+name=["']description["'][^>]*\/?>/i, metaDescTag);
  } else {
    result = result.replace('</head>', `  ${metaDescTag}\n</head>`);
  }

  // Replace <meta name="robots" ... />
  const robotsTag = `<meta name="robots" content="${escapeHtml(seo.robots)}" />`;
  if (/<meta\s+name=["']robots["'][^>]*\/?>/i.test(result)) {
    result = result.replace(/<meta\s+name=["']robots["'][^>]*\/?>/i, robotsTag);
  } else {
    result = result.replace('</head>', `  ${robotsTag}\n</head>`);
  }

  // Replace <link rel="canonical" ... />
  const canonicalTag = `<link rel="canonical" href="${escapeHtml(seo.canonicalUrl)}" />`;
  if (/<link\s+rel=["']canonical["'][^>]*\/?>/i.test(result)) {
    result = result.replace(/<link\s+rel=["']canonical["'][^>]*\/?>/i, canonicalTag);
  } else {
    result = result.replace('</head>', `  ${canonicalTag}\n</head>`);
  }

  // Replace og:title
  const ogTitleTag = `<meta property="og:title" content="${escapeHtml(seo.title)}" />`;
  if (/<meta\s+property=["']og:title["'][^>]*\/?>/i.test(result)) {
    result = result.replace(/<meta\s+property=["']og:title["'][^>]*\/?>/i, ogTitleTag);
  } else {
    result = result.replace('</head>', `  ${ogTitleTag}\n</head>`);
  }

  // Replace og:description
  const ogDescTag = `<meta property="og:description" content="${escapeHtml(seo.description)}" />`;
  if (/<meta\s+property=["']og:description["'][^>]*\/?>/i.test(result)) {
    result = result.replace(/<meta\s+property=["']og:description["'][^>]*\/?>/i, ogDescTag);
  } else {
    result = result.replace('</head>', `  ${ogDescTag}\n</head>`);
  }

  // Replace og:url
  const ogUrlTag = `<meta property="og:url" content="${escapeHtml(seo.canonicalUrl)}" />`;
  if (/<meta\s+property=["']og:url["'][^>]*\/?>/i.test(result)) {
    result = result.replace(/<meta\s+property=["']og:url["'][^>]*\/?>/i, ogUrlTag);
  } else {
    result = result.replace('</head>', `  ${ogUrlTag}\n</head>`);
  }

  // Replace og:image
  const ogImageTag = `<meta property="og:image" content="${escapeHtml(seo.ogImage)}" />`;
  if (/<meta\s+property=["']og:image["'][^>]*\/?>/i.test(result)) {
    result = result.replace(/<meta\s+property=["']og:image["'][^>]*\/?>/i, ogImageTag);
  } else {
    result = result.replace('</head>', `  ${ogImageTag}\n</head>`);
  }

  // Twitter title & description & image
  const twitterTags = [
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(seo.ogImage)}" />`
  ].join('\n  ');

  if (result.includes('<meta name="twitter:card"')) {
    result = result.replace('<meta name="twitter:card" content="summary_large_image" />', `<meta name="twitter:card" content="summary_large_image" />\n  ${twitterTags}`);
  } else {
    result = result.replace('</head>', `  ${twitterTags}\n</head>`);
  }

  // JSON-LD injection (with dynamic-jsonld id matching SeoHead.tsx)
  if (seo.jsonLd) {
    const jsonStr = JSON.stringify(seo.jsonLd).replace(/<\/script/gi, '<\\/script');
    const jsonLdTag = `  <script type="application/ld+json" id="dynamic-jsonld">${jsonStr}</script>\n`;
    result = result.replace('</head>', `${jsonLdTag}</head>`);
  }

  return result;
}
