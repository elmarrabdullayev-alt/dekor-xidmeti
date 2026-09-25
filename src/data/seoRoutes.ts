/**
 * Centralized SEO Source of Truth for DreamArt Weddings
 * Primary Domain: https://dreamartweddings.com
 *
 * Single authority for:
 * - Meta robots (index, follow vs noindex, follow)
 * - Canonical URLs
 * - Titles & Meta Descriptions
 * - H1 Headings
 * - Sitemap generation
 * - Raw HTML prerendering / Server injection
 * - Schema.org JSON-LD Structured Data
 */

export const PRIMARY_DOMAIN = 'https://dreamartweddings.com';

export interface SeoBreadcrumbItem {
  name: string;
  url: string;
}

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoRouteConfig {
  path: string;
  indexable: boolean;
  canonicalPath: string;
  title: string;
  metaDescription: string;
  h1: string;
  sitemapInclusion: boolean;
  schemaType: 'WebSite' | 'Service' | 'CollectionPage' | 'AboutPage' | 'ContactPage' | 'ItemPage' | 'CreativeWork' | 'None';
  changefreq: 'daily' | 'weekly' | 'monthly';
  priority: number;
  ogImage?: string;
  contentSnippet: string;
  breadcrumb: SeoBreadcrumbItem[];
  faqs?: SeoFaqItem[];
}

export const SEO_ROUTES: SeoRouteConfig[] = [
  // ==========================================
  // 1. CORE PUBLIC PAGES
  // ==========================================
  {
    path: '/',
    indexable: true,
    canonicalPath: '/',
    title: 'DreamArt Weddings | Zövqlü Toy və Tədbir Dekoru Bakı',
    metaDescription: 'Bakı və Azərbaycan üzrə zövqlü toy, nişan, xına, ad günü, zal və xonça dekor xidməti. Eksklüziv dizayn, təbii güllər və peşəkar quraşdırma.',
    h1: 'Zövqlü Toy və Tədbir Dekoru Həlləri',
    sitemapInclusion: true,
    schemaType: 'WebSite',
    changefreq: 'daily',
    priority: 1.0,
    ogImage: '/images/dreamart-toy-dekoru-qizili-altar.webp',
    contentSnippet: 'DreamArt Weddings Bakıda və Azərbaycanın regionlarında toy, nişan, xına, ad günü, zal və xonça dekorasiyası üzrə zövqlü həllər təqdim edir.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN }
    ],
    faqs: [
      {
        question: 'DreamArt Weddings hansı dekor xidmətlərini göstərir?',
        answer: 'Toy dekoru, nişan masası, xına gecəsi, ad günü fotozonaları, böyük zallar və xonça xidmətləri göstəririk.'
      },
      {
        question: 'Regionlarda sifariş qəbul olunur?',
        answer: 'Bəli, Bakı ilə yanaşı Sumqayıt, Qəbələ, Gəncə, Şəki və digər bölgələrdə quraşdırma həyata keçiririk.'
      }
    ]
  },
  {
    path: '/dekorlar',
    indexable: true,
    canonicalPath: '/dekorlar',
    title: 'Dekor Layihələri Kataloqu | DreamArt Weddings',
    metaDescription: 'DreamArt Weddings tərəfindən icra edilmiş toy, nişan, xına, zal və tədbir dekor layihələri kataloqu. Real fotoşəkillər və detallı kompozisiyalar.',
    h1: 'Bütün Dekor Layihələri',
    sitemapInclusion: true,
    schemaType: 'CollectionPage',
    changefreq: 'daily',
    priority: 0.9,
    ogImage: '/images/dreamart-monumental-toy-sehnesi-dekoru.webp',
    contentSnippet: 'Bütün real dekorasiya layihələrimizlə tanış olun. Toy altarları, gəlin masaları, zal tərtibatları və xonça kompozisiyaları.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Dekorlar', url: `${PRIMARY_DOMAIN}/dekorlar` }
    ]
  },
  {
    path: '/portfolio',
    indexable: true,
    canonicalPath: '/portfolio',
    title: 'Portfolio və Lookbook | DreamArt Weddings',
    metaDescription: 'Seçilmiş toy, nişan, böyük zal və xonça dekor işlərimizin vizual portfolio və lookbook təqdimatı.',
    h1: 'Seçilmiş İşlər və Lookbook',
    sitemapInclusion: true,
    schemaType: 'CollectionPage',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-bey-gelin-masasi-cicek-tagi.webp',
    contentSnippet: 'DreamArt Weddings vizual lookbook və arxiv layihələri. Real tədbir fotoşəkilləri ilə estetik dekorasiya nümunələri.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Portfolio', url: `${PRIMARY_DOMAIN}/portfolio` }
    ]
  },
  {
    path: '/xidmetler',
    indexable: true,
    canonicalPath: '/xidmetler',
    title: 'Dekorasiya Xidmətlərimiz | DreamArt Weddings',
    metaDescription: 'Toy, nişan, xına, ad günü, korporativ tədbir, böyük zal və xonça dekorasiyası üzrə peşəkar xidmətlərimiz.',
    h1: 'Zövqlü Dekorasiya Xidmətlərimiz',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'monthly',
    priority: 0.8,
    ogImage: '/images/dreamart-zal-dekoru-tavan-instalyasiyasi.webp',
    contentSnippet: 'Hər bir tədbir növünə uyğun ixtisaslaşmış dekor xidmətləri: toy, nişan, xına, ad günü, korporativ, zal və xonça.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Xidmətlər', url: `${PRIMARY_DOMAIN}/xidmetler` }
    ]
  },
  {
    path: '/haqqimizda',
    indexable: true,
    canonicalPath: '/haqqimizda',
    title: 'Haqqımızda | DreamArt Weddings',
    metaDescription: 'DreamArt Weddings haqqında məlumat. Azərbaycan üzrə zövqlü və premium toy, nişan, xına, xonça və tədbir dekorasiyası fəlsəfəmiz.',
    h1: 'Zövq, Estetika və Emosiya',
    sitemapInclusion: true,
    schemaType: 'AboutPage',
    changefreq: 'monthly',
    priority: 0.7,
    ogImage: '/images/dreamart-restoran-qonaq-masasi-dekoru.webp',
    contentSnippet: 'DreamArt Weddings olaraq hər bir tədbirə həyat anlarının səhnəsi kimi yanaşır, fərdi və unudulmaz dekor hekayələri qururuq.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Haqqımızda', url: `${PRIMARY_DOMAIN}/haqqimizda` }
    ]
  },
  {
    path: '/elaqe',
    indexable: true,
    canonicalPath: '/elaqe',
    title: 'Əlaqə | DreamArt Weddings',
    metaDescription: 'DreamArt Weddings ilə əlaqə. Toy və tədbir dekor sifarişləri üçün WhatsApp və telefon xətti: 050 231 17 28.',
    h1: 'Əlaqə və Fərdi Məsləhət',
    sitemapInclusion: true,
    schemaType: 'ContactPage',
    changefreq: 'monthly',
    priority: 0.7,
    ogImage: '/images/dreamart-toy-dekoru-qizili-altar.webp',
    contentSnippet: 'Xəyalınızdakı dekorasiyanı müzakirə etmək üçün bizimlə birbaşa əlaqə saxlayın. Telefon və WhatsApp: 050 231 17 28.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Əlaqə', url: `${PRIMARY_DOMAIN}/elaqe` }
    ]
  },
  {
    path: '/restoranlar',
    indexable: true,
    canonicalPath: '/restoranlar',
    title: 'Şadlıq Sarayları və Məkan Dekoru | DreamArt Weddings',
    metaDescription: 'Bakının ən nüfuzlu restoran və şadlıq saraylarında DreamArt Weddings dekorasiya təcrübəsi və real layihələri.',
    h1: 'Məkanlar və Restoranlar',
    sitemapInclusion: true,
    schemaType: 'CollectionPage',
    changefreq: 'daily',
    priority: 0.9,
    ogImage: '/images/dreamart-monumental-toy-sehnesi-dekoru.webp',
    contentSnippet: 'Meridian, By Meridian, Bağçalı Saray, Böyük Saray və digər məkanlarda DreamArt Weddings tərəfindən həyata keçirilmiş real dekorasiya nümunələri.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Məkanlar', url: `${PRIMARY_DOMAIN}/restoranlar` }
    ]
  },

  // ==========================================
  // 2. CORE SERVICE SEO PAGES
  // ==========================================
  {
    path: '/toy-dekoru',
    indexable: true,
    canonicalPath: '/toy-dekoru',
    title: 'Toy Dekoru Bakı | Zövqlü Gəlin Masası və Tağ Tərtibatı',
    metaDescription: 'Bakıda unudulmaz toy mərasimləri üçün premium dekorasiya xidməti. Canlı gül tağı, bəy-gəlin masası, şam işıqlandırması və peşəkar quraşdırma.',
    h1: 'Toy Dekoru',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.9,
    ogImage: '/images/dreamart-toy-dekoru-qizili-altar.webp',
    contentSnippet: 'Zövqlü və unudulmaz toy mərasimləri üçün eksklüziv toy dekoru xidməti. Giriş fotozonası, bəy-gəlin masası, monumental arxa fon tağı və təbii güllər.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Toy Dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru` }
    ],
    faqs: [
      {
        question: 'Toy dekoru paketlərinə nələr daxildir?',
        answer: 'Fərdi dizayn eskizi, arxa fon tağ konstruksiyası, təbii və süni gül kompozisiyaları, gəlin masası aksesuarları, şamdanlar, çatdırılma və montaj daxildir.'
      },
      {
        question: 'Toy dekorunu nə qədər əvvəl sifariş etmək lazımdır?',
        answer: 'Tədbir tarixindən ən azı 2-4 həftə əvvəl müraciət etməyiniz tövsiyə olunur.'
      }
    ]
  },
  {
    path: '/nisan-dekoru',
    indexable: true,
    canonicalPath: '/nisan-dekoru',
    title: 'Nişan Dekoru Bakı | Zərif Pastel və Qızılı Nişan Masası',
    metaDescription: 'Zövqlü nişan mərasimləri üçün fərdi dekor həlləri. Romantik gül kompozisiyaları, üzük masası və zərif fotozona tərtibatı.',
    h1: 'Nişan Dekoru',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.9,
    ogImage: '/images/dreamart-nisan-dekoru-fotozona.webp',
    contentSnippet: 'Nişan mərasimini nağılvari edən romantik pastel və qızılı kompozisiyalar, xüsusi xonça və üzük masaları, güzgü aksesuarlar.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Nişan Dekoru', url: `${PRIMARY_DOMAIN}/nisan-dekoru` }
    ],
    faqs: [
      {
        question: 'Ev və ya restoran nişanı üçün dekorasiya mümkündürmü?',
        answer: 'Bəli, həm restoran zalları, həm də ev və ya həyət məkanları üçün ölçülərə uyğunlaşdırılmış xüsusi nişan dekorları hazırlayırıq.'
      }
    ]
  },
  {
    path: '/xina-dekoru',
    indexable: true,
    canonicalPath: '/xina-dekoru',
    title: 'Xına Dekoru Bakı | Milli və Modern Xına Gecəsi Tərtibatı',
    metaDescription: 'Milli adət-ənənələr və müasir estetika ilə zənginləşdirilmiş xına dekorasiyası. Qırmızı-qızılı tağ, xonçalar və xüsusi oturacaqlar.',
    h1: 'Xına Dekoru',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.9,
    ogImage: '/images/dreamart-bey-gelin-masasi-cicek-tagi.webp',
    contentSnippet: 'Dəbdəbəli xına gecələri üçün milli ornamentlər, zərif məxmər elementlər, qızılı tağlar və xonça stendləri ilə bəzədilmiş dekorlar.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Xına Dekoru', url: `${PRIMARY_DOMAIN}/xina-dekoru` }
    ],
    faqs: [
      {
        question: 'Xına dekoruna xonçalar daxil edilirmi?',
        answer: 'Bəli, sifarişçinin istəyinə uyğun olaraq xına dekorasiyası ilə yanaşı xonça dəstləri də təmin edilir.'
      }
    ]
  },
  {
    path: '/ad-gunu-dekoru',
    indexable: true,
    canonicalPath: '/ad-gunu-dekoru',
    title: 'Ad Günü Dekoru Bakı | Estetik Fotozona və Şam İşıqları',
    metaDescription: 'Böyüklər və uşaqlar üçün estetik ad günü dekorları, neon yazılı fotozonalar və zərif masa tərtibatı.',
    h1: 'Ad Günü Dekoru',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-tebii-budag-agac-kompozisiyasi.webp',
    contentSnippet: 'Yubileylər və xüsusi ad günləri üçün estetik fotozonalar, fərdi neon yazılar, gül kompozisiyaları və şam tərtibatı.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Ad Günü Dekoru', url: `${PRIMARY_DOMAIN}/ad-gunu-dekoru` }
    ]
  },
  {
    path: '/korporativ-dekor',
    indexable: true,
    canonicalPath: '/korporativ-dekor',
    title: 'Korporativ Tədbir Dekoru Bakı | Qala Gecələri və Brendinq',
    metaDescription: 'Şirkət qala gecələri, rəsmi banketlər və yubileylər üçün nüfuzlu dekorasiya və monumental zal arxitekturası.',
    h1: 'Korporativ Tədbir Dekoru',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-qala-gecesi-samdan-dekoru.webp',
    contentSnippet: 'Şirkətlərin illik tədbirləri, qala şam yeməkləri və konfrans zalları üçün korporativ rənglərdə zövqlü və nüfuzlu dekorasiya.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Korporativ Dekoru', url: `${PRIMARY_DOMAIN}/korporativ-dekor` }
    ]
  },
  {
    path: '/zal-dekoru',
    indexable: true,
    canonicalPath: '/zal-dekoru',
    title: 'Böyük Şadlıq Zalı Dekoru | Tavan İnstalyasiyası və Səhnə',
    metaDescription: 'Genişmiqyaslı şadlıq sarayları üçün monumental tavan gül instalyasiyaları, podyum və xüsusi işıqlandırma həlləri.',
    h1: 'Zal və Şadlıq Sarayı Dekoru',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-zal-dekoru-tavan-instalyasiyasi.webp',
    contentSnippet: 'Hündür tavanlı böyük zallarda asma gül çilçıraqları, banket masası kompozisiyaları və monumental səhnə tərtibatı.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Zal Dekoru', url: `${PRIMARY_DOMAIN}/zal-dekoru` }
    ]
  },
  {
    path: '/xonca-xidmeti',
    indexable: true,
    canonicalPath: '/xonca-xidmeti',
    title: 'Xonça Xidməti Bakı | Eksklüziv Nişan və Xına Xonçaları',
    metaDescription: 'Büllur, məxmər və qızılı zərif aksesuarlarla bəzədilmiş eksklüziv nişan, xına və cehiz xonçaları xidməti.',
    h1: 'Xonça Xidməti',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/xonca-xidmeti-cover.jpg',
    contentSnippet: 'Milli adətlərimizə uyğun hazırlanmış büllur, məxmər və təbii güllərlə bəzədilmiş eksklüziv nişan və xına xonçaları.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Xonça Xidməti', url: `${PRIMARY_DOMAIN}/xonca-xidmeti` }
    ],
    faqs: [
      {
        question: 'Xonçalar icarəyə verilir, yoxsa satılır?',
        answer: 'Həm bəzədilmiş komplekt icarəsi, həm də xüsusi bəzədilmə xidməti təklif olunur.'
      }
    ]
  },

  // ==========================================
  // 3. CURATED REAL-PROJECT VENUES
  // ==========================================
  {
    path: '/restoranlar/meridian',
    indexable: true,
    canonicalPath: '/restoranlar/meridian',
    title: 'Meridian Restoranı Toy Dekoru | Bakı | DreamArt Weddings',
    metaDescription: 'Meridian restoranında toy dekoru, zərif gəlin masası və möhtəşəm səhnə tərtibatı. DreamArt Weddings real layihələri və sifariş: 050 231 17 28.',
    h1: 'Meridian',
    sitemapInclusion: true,
    schemaType: 'ItemPage',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-monumental-toy-sehnesi-dekoru.webp',
    contentSnippet: 'Bakının Səbail rayonu Badamdar qəsəbəsində yerləşən Meridian restoranında DreamArt Weddings tərəfindən həyata keçirilmiş real toy və səhnə dekorasiyası.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Məkanlar', url: `${PRIMARY_DOMAIN}/restoranlar` },
      { name: 'Meridian', url: `${PRIMARY_DOMAIN}/restoranlar/meridian` }
    ],
    faqs: [
      {
        question: 'Meridian restoranında DreamArt Weddings dekorasiya quraşdırıbmı?',
        answer: 'Bəli, Meridian restoranında monumental toy səhnəsi, qızılı tağ və qonaq masaları tərtibatı üzrə real işlərimiz icra edilmişdir.'
      },
      {
        question: 'Meridian zalı üçün hansı dekorasiya tərzi tövsiyə olunur?',
        answer: 'Dairəvi səhnə quruluşuna uyğun monumental gül tağları və zərif işıqlandırma ən gözəl nəticəni verir.'
      }
    ]
  },
  {
    path: '/restoranlar/by-meridian',
    indexable: true,
    canonicalPath: '/restoranlar/by-meridian',
    title: 'By Meridian Toy Dekoru və Ziyafət Tərtibatı | DreamArt Weddings',
    metaDescription: 'By Meridian zalında unudulmaz toy və nişan mərasimləri üçün eksklüziv dekorasiya xidməti. Peşəkar floristika, gəlin masası və montaj.',
    h1: 'By Meridian',
    sitemapInclusion: true,
    schemaType: 'ItemPage',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-bey-gelin-masasi-cicek-tagi.webp',
    contentSnippet: 'By Meridian ziyafət zalı üçün pastel və klassik ağ qızılgül kompozisiyaları, bəy-gəlin masası və zərif fotozona layihələri.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Məkanlar', url: `${PRIMARY_DOMAIN}/restoranlar` },
      { name: 'By Meridian', url: `${PRIMARY_DOMAIN}/restoranlar/by-meridian` }
    ],
    faqs: [
      {
        question: 'By Meridian üçün dekor konsepti necə seçilir?',
        answer: 'Zalın zərif interyerinə uyğun olaraq pastel çəhrayı, krem və ağ canlı çiçək arxitekturası fərdi olaraq layihələndirilir.'
      }
    ]
  },
  {
    path: '/restoranlar/bagcali-saray',
    indexable: true,
    canonicalPath: '/restoranlar/bagcali-saray',
    title: 'Bağçalı Saray Toy Dekoru və Şadlıq Zalı Tərtibatı | DreamArt Weddings',
    metaDescription: 'Bağçalı Saray üçün premium toy dekorasiyası, gəlin masası və zal bəzəyi. DreamArt Weddings real işləri və əlaqə: 050 231 17 28.',
    h1: 'Bağçalı Saray',
    sitemapInclusion: true,
    schemaType: 'ItemPage',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-restoran-qonaq-masasi-dekoru.webp',
    contentSnippet: 'Xətai rayonunda yerləşən Bağçalı Saray şadlıq sarayında icra edilmiş banket masaları, büllur şamdanlar və təbii çiçək runner-ləri.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Məkanlar', url: `${PRIMARY_DOMAIN}/restoranlar` },
      { name: 'Bağçalı Saray', url: `${PRIMARY_DOMAIN}/restoranlar/bagcali-saray` }
    ],
    faqs: [
      {
        question: 'Bağçalı Saray üçün real layihə nümunələri varmı?',
        answer: 'Bəli, qonaq masası və qala gecəsi şamdan dekorasiyalarımız bu məkanda həyata keçirilmişdir.'
      }
    ]
  },
  {
    path: '/restoranlar/boyuk-saray',
    indexable: true,
    canonicalPath: '/restoranlar/boyuk-saray',
    title: 'Böyük Saray Monumental Toy Dekoru və Zal Tərtibatı | DreamArt Weddings',
    metaDescription: 'Böyük Saray şadlıq sarayında monumental toy və zal dekorasiyası. Tavan gül instalyasiyaları, səhnə dizaynı və sifariş: 050 231 17 28.',
    h1: 'Böyük Saray',
    sitemapInclusion: true,
    schemaType: 'ItemPage',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-zal-dekoru-tavan-instalyasiyasi.webp',
    contentSnippet: 'Nərimanov rayonunda yerləşən Böyük Saray üçün monumental tavan instalyasiyaları, genişmiqyaslı zal dekoru və qala səhnəsi arxitekturası.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Məkanlar', url: `${PRIMARY_DOMAIN}/restoranlar` },
      { name: 'Böyük Saray', url: `${PRIMARY_DOMAIN}/restoranlar/boyuk-saray` }
    ],
    faqs: [
      {
        question: 'Böyük Saray üçün quraşdırma vaxtı nə qədər çəkir?',
        answer: 'Genişmiqyaslı zal olduğundan təcrübəli floristika komandamız tədbirdən 8-12 saat öncə montaja başlayır.'
      }
    ]
  },
  {
    path: '/restoranlar/green-city',
    indexable: false,
    canonicalPath: '/restoranlar/green-city',
    title: 'Green City Açıq Hava Toy Dekoru | DreamArt Weddings',
    metaDescription: 'Green City kompleksi üçün fərdi açıq hava və hovuz kənarı dekorasiyası.',
    h1: 'Green City',
    sitemapInclusion: false,
    schemaType: 'ItemPage',
    changefreq: 'monthly',
    priority: 0.5,
    contentSnippet: 'Green City üçün açıq hava və ziyafət dekorasiyası məlumatı.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Məkanlar', url: `${PRIMARY_DOMAIN}/restoranlar` },
      { name: 'Green City', url: `${PRIMARY_DOMAIN}/restoranlar/green-city` }
    ]
  },
  {
    path: '/restoranlar/yegane',
    indexable: false,
    canonicalPath: '/restoranlar/yegane',
    title: 'Yeganə Şadlıq Sarayı Toy Dekoru | DreamArt Weddings',
    metaDescription: 'Yeganə Şadlıq Sarayı üçün toy və nişan dekorasiyası xidməti.',
    h1: 'Yeganə Şadlıq Sarayı',
    sitemapInclusion: false,
    schemaType: 'ItemPage',
    changefreq: 'monthly',
    priority: 0.5,
    contentSnippet: 'Yeganə Şadlıq Sarayı üçün toy və tədbir dekorasiyası məlumatı.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Məkanlar', url: `${PRIMARY_DOMAIN}/restoranlar` },
      { name: 'Yeganə', url: `${PRIMARY_DOMAIN}/restoranlar/yegane` }
    ]
  },
  {
    path: '/admin',
    indexable: false,
    canonicalPath: '/admin',
    title: 'Şəkil İdarəetmə Girişi | DreamArt Weddings Admin',
    metaDescription: 'DreamArt Weddings şəkil idarəetmə və admin paneli.',
    h1: 'DreamArt Weddings İdarəetmə Paneli',
    sitemapInclusion: false,
    schemaType: 'None',
    changefreq: 'monthly',
    priority: 0.1,
    contentSnippet: 'DreamArt Weddings admin paneli.',
    breadcrumb: []
  },

  // ==========================================
  // 4. CURATED HIGH-VALUE LOCAL SEO PAGES
  // ==========================================
  {
    path: '/toy-dekoru/baki',
    indexable: true,
    canonicalPath: '/toy-dekoru/baki',
    title: 'Bakıda Toy Dekoru | DreamArt Weddings',
    metaDescription: 'Bakı şəhərinin ən gözəl məkanlarında eksklüziv toy dekorasiyası. Operativ çatdırılma, quraşdırma və canlı gül floristika tərtibatı.',
    h1: 'Bakı Toy Dekoru',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-toy-dekoru-qizili-altar.webp',
    contentSnippet: 'Bakı şəhəri üzrə bütün növ toy dekorasiyaları: restoran, şadlıq sarayı və açıq hava dənizkənarı məkanlar üçün peşəkar floristika.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Toy Dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru` },
      { name: 'Bakı Toy Dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru/baki` }
    ]
  },
  {
    path: '/toy-dekoru/qebele',
    indexable: true,
    canonicalPath: '/toy-dekoru/qebele',
    title: 'Qəbələdə Açıq Hava və Villa Toy Dekoru | DreamArt Weddings',
    metaDescription: 'Qəbələnin füsunkar təbiətində açıq hava və villa toyları üçün xüsusi möhkəmləndirilmiş zövqlü dekorasiya və logistika xidməti.',
    h1: 'Qəbələ Toy Dekoru',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-monumental-toy-sehnesi-dekoru.webp',
    contentSnippet: 'Qəbələnin dağlıq landşaftı və kurort villalarında təbii materiallar, dayanıqlı tağlar və dağ mənzərəli toy altarları quraşdırırıq.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Toy Dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru` },
      { name: 'Qəbələ Toy Dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru/qebele` }
    ]
  },
  {
    path: '/nisan-dekoru/baki',
    indexable: true,
    canonicalPath: '/nisan-dekoru/baki',
    title: 'Bakıda Nişan Dekoru və Masası | DreamArt Weddings',
    metaDescription: 'Bakıda restoran və ev mərasimləri üçün zərif nişan masası dekorasiyası. Təbii güllər, şam işıqlandırması və fotozona.',
    h1: 'Bakı Nişan Dekoru',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-nisan-dekoru-fotozona.webp',
    contentSnippet: 'Bakı üzrə ev, bağ və restoran nişan mərasimləri üçün zövqlü pastel güllər, xüsusi şamlar və üzük masası quraşdırılması.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Nişan Dekoru', url: `${PRIMARY_DOMAIN}/nisan-dekoru` },
      { name: 'Bakı Nişan Dekoru', url: `${PRIMARY_DOMAIN}/nisan-dekoru/baki` }
    ]
  },
  {
    path: '/xina-dekoru/baki',
    indexable: true,
    canonicalPath: '/xina-dekoru/baki',
    title: 'Bakıda Xına Gecəsi Dekoru | DreamArt Weddings',
    metaDescription: 'Bakıda unudulmaz xına gecəsi üçün milli və modern dekor kompozisiyaları, xonçalar və fərdi səhnə tərtibatı.',
    h1: 'Bakı Xına Dekoru',
    sitemapInclusion: true,
    schemaType: 'Service',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-bey-gelin-masasi-cicek-tagi.webp',
    contentSnippet: 'Bakının şadlıq məkanlarında milli qırmızı və qızılı elementlərlə işlənmiş xına dekoru, oturacaqlar və xonça tərtibatı.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Xına Dekoru', url: `${PRIMARY_DOMAIN}/xina-dekoru` },
      { name: 'Bakı Xına Dekoru', url: `${PRIMARY_DOMAIN}/xina-dekoru/baki` }
    ]
  },

  // ==========================================
  // 5. VERIFIED REAL DECOR PROJECTS
  // ==========================================
  {
    path: '/dekorlar/ag-qizilgul-ve-zerif-samli-toy-altari-baki',
    indexable: true,
    canonicalPath: '/dekorlar/ag-qizilgul-ve-zerif-samli-toy-altari-baki',
    title: 'Ağ Qızılgül və Zərif Şamlı Toy Altarı | DreamArt Weddings',
    metaDescription: 'Bakıda klassik lüks toy altar dekoru. Canlı ağ güllər, şam işıqlandırması və eksklüziv gəlin masası tərtibatı.',
    h1: 'Ağ Qızılgül və Zərif Şamlı Toy Altarı',
    sitemapInclusion: true,
    schemaType: 'CreativeWork',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-toy-dekoru-qizili-altar.webp',
    contentSnippet: 'Təbii ağ qızılgüllər, hündür şüşə şamdanlar və qızılı elementlərlə işlənmiş möhtəşəm toy altar tağı layihəsi.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Toy Dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru` },
      { name: 'Ağ Qızılgül Toy Altarı', url: `${PRIMARY_DOMAIN}/dekorlar/ag-qizilgul-ve-zerif-samli-toy-altari-baki` }
    ]
  },
  {
    path: '/dekorlar/pudra-cehrayi-qizili-pastel-nisan-masasi-sumqayit',
    indexable: true,
    canonicalPath: '/dekorlar/pudra-cehrayi-qizili-pastel-nisan-masasi-sumqayit',
    title: 'Pudra Çəhrayı və Qızılı Pastel Nişan Masası | DreamArt Weddings',
    metaDescription: 'Romantik pastel tonlarda zərif nişan masası və fotozona dekorasiyası layihəsi.',
    h1: 'Pudra Çəhrayı və Qızılı Pastel Nişan Masası',
    sitemapInclusion: true,
    schemaType: 'CreativeWork',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-nisan-dekoru-fotozona.webp',
    contentSnippet: 'İpək parçalar, pudra pionlar və qızılı zərif tağ ilə işlənmiş intim nişan dekorasiyası.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Nişan Dekoru', url: `${PRIMARY_DOMAIN}/nisan-dekoru` },
      { name: 'Pudra Pastel Nişan Masası', url: `${PRIMARY_DOMAIN}/dekorlar/pudra-cehrayi-qizili-pastel-nisan-masasi-sumqayit` }
    ]
  },
  {
    path: '/dekorlar/kraliyyet-mexmeri-sam-kompozisiyali-xina-dekoru-qebele',
    indexable: true,
    canonicalPath: '/dekorlar/kraliyyet-mexmeri-sam-kompozisiyali-xina-dekoru-qebele',
    title: 'Krallıq Məxməri Şam Kompozisiyalı Xına Dekoru | DreamArt Weddings',
    metaDescription: 'Klassik və modern elementlərin vəhdəti ilə hazırlanmış dəbdəbəli xına gecəsi dekor layihəsi.',
    h1: 'Krallıq Məxməri Şam Kompozisiyalı Xına Dekoru',
    sitemapInclusion: true,
    schemaType: 'CreativeWork',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-bey-gelin-masasi-cicek-tagi.webp',
    contentSnippet: 'Tünd qırmızı məxmər parçalar, qızılı tağ və xüsusi işıqlandırmalı xına gecəsi dekor kompozisiyası.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Xına Dekoru', url: `${PRIMARY_DOMAIN}/xina-dekoru` },
      { name: 'Krallıq Xına Dekoru', url: `${PRIMARY_DOMAIN}/dekorlar/kraliyyet-mexmeri-sam-kompozisiyali-xina-dekoru-qebele` }
    ]
  },
  {
    path: '/dekorlar/krem-qizili-isigli-estetik-ad-gunu-fotozonasi-baki',
    indexable: true,
    canonicalPath: '/dekorlar/krem-qizili-isigli-estetik-ad-gunu-fotozonasi-baki',
    title: 'Krem Qızılı İşıqlı Estetik Ad Günü Fotozonası | DreamArt Weddings',
    metaDescription: 'Zərif krem rəngli şarlar, qızılı dairəvi tağ və neon yazılı estetik ad günü fotozonası.',
    h1: 'Krem Qızılı İşıqlı Estetik Ad Günü Fotozonası',
    sitemapInclusion: true,
    schemaType: 'CreativeWork',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-tebii-budag-agac-kompozisiyasi.webp',
    contentSnippet: 'Xüsusi yubiley və ad günü tədbirləri üçün zövqlü və fotoqrafiya üçün ideal işıqlandırılmış fotozona.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Ad Günü Dekoru', url: `${PRIMARY_DOMAIN}/ad-gunu-dekoru` },
      { name: 'Estetik Ad Günü Fotozonası', url: `${PRIMARY_DOMAIN}/dekorlar/krem-qizili-isigli-estetik-ad-gunu-fotozonasi-baki` }
    ]
  },
  {
    path: '/dekorlar/qala-sam-yemeyi-korporativ-tedbir-tertibati-baki',
    indexable: true,
    canonicalPath: '/dekorlar/qala-sam-yemeyi-korporativ-tedbir-tertibati-baki',
    title: 'Qala Şam Yeməyi Korporativ Tədbir Tərtibatı | DreamArt Weddings',
    metaDescription: 'Nüfuzlu şirkət banketləri üçün uzun masa çiçək runner-ləri və şamdan kompozisiyaları.',
    h1: 'Qala Şam Yeməyi Korporativ Tədbir Tərtibatı',
    sitemapInclusion: true,
    schemaType: 'CreativeWork',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-qala-gecesi-samdan-dekoru.webp',
    contentSnippet: 'Rəsmi korporativ ziyafətlər üçün büllur şamdanlar, zərif floristika və masaların simmetrik bəzədilməsi.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Korporativ Dekoru', url: `${PRIMARY_DOMAIN}/korporativ-dekor` },
      { name: 'Qala Şam Yeməyi', url: `${PRIMARY_DOMAIN}/dekorlar/qala-sam-yemeyi-korporativ-tedbir-tertibati-baki` }
    ]
  },
  {
    path: '/dekorlar/panoramik-sadliq-zali-tavan-isig-instalyasiyasi-baki',
    indexable: true,
    canonicalPath: '/dekorlar/panoramik-sadliq-zali-tavan-isig-instalyasiyasi-baki',
    title: 'Panoramik Şadlıq Zalı Tavan İşıq İnstalyasiyası | DreamArt Weddings',
    metaDescription: '500+ nəfərlik zallar üçün asma gül çilçıraqları və tavan instalyasiyaları dekorasiyası.',
    h1: 'Panoramik Şadlıq Zalı Tavan İşıq İnstalyasiyası',
    sitemapInclusion: true,
    schemaType: 'CreativeWork',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-zal-dekoru-tavan-instalyasiyasi.webp',
    contentSnippet: 'Böyük zallarda məkanın həcmini dolduran monumental gül çilçıraqları və işıq instalyasiyası layihəsi.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Zal Dekoru', url: `${PRIMARY_DOMAIN}/zal-dekoru` },
      { name: 'Tavan İnstalyasiyası', url: `${PRIMARY_DOMAIN}/dekorlar/panoramik-sadliq-zali-tavan-isig-instalyasiyasi-baki` }
    ]
  },
  {
    path: '/dekorlar/aciq-hava-dag-menzereli-toy-altari-qebele',
    indexable: true,
    canonicalPath: '/dekorlar/aciq-hava-dag-menzereli-toy-altari-qebele',
    title: 'Açıq Hava Dağ Mənzərəli Toy Altarı Qəbələ | DreamArt Weddings',
    metaDescription: 'Qəbələdə dağ panoramalı açıq hava toyu üçün təbii budaq və vəhşi çiçək kompozisiyaları.',
    h1: 'Açıq Hava Dağ Mənzərəli Toy Altarı',
    sitemapInclusion: true,
    schemaType: 'CreativeWork',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-monumental-toy-sehnesi-dekoru.webp',
    contentSnippet: 'Təbiətlə harmoniyada olan rustik və modern açıq hava nikah altar kompozisiyası.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Toy Dekoru', url: `${PRIMARY_DOMAIN}/toy-dekoru` },
      { name: 'Qəbələ Toy Altarı', url: `${PRIMARY_DOMAIN}/dekorlar/aciq-hava-dag-menzereli-toy-altari-qebele` }
    ]
  },
  {
    path: '/dekorlar/klassik-gence-intim-nisan-ve-xonca-tertibati-gence',
    indexable: true,
    canonicalPath: '/dekorlar/klassik-gence-intim-nisan-ve-xonca-tertibati-gence',
    title: 'Klassik İntim Nişan və Xonça Tərtibatı Gəncə | DreamArt Weddings',
    metaDescription: 'Gəncədə ailəvi nişan mərasimləri üçün zərif arxa fon, üzük masası və bəzədilmiş xonça dəstləri.',
    h1: 'Klassik İntim Nişan və Xonça Tərtibatı',
    sitemapInclusion: true,
    schemaType: 'CreativeWork',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/dreamart-restoran-qonaq-masasi-dekoru.webp',
    contentSnippet: 'Ailəvi və intim nişan mərasimləri üçün bəzədilmiş güzgü stend, zərif şamlar və təbii çiçəklər.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Nişan Dekoru', url: `${PRIMARY_DOMAIN}/nisan-dekoru` },
      { name: 'İntim Nişan Tərtibatı', url: `${PRIMARY_DOMAIN}/dekorlar/klassik-gence-intim-nisan-ve-xonca-tertibati-gence` }
    ]
  },
  {
    path: '/dekorlar/ekskluziv-bullur-ve-qizili-xonca-kompozisiyasi-baki',
    indexable: true,
    canonicalPath: '/dekorlar/ekskluziv-bullur-ve-qizili-xonca-kompozisiyasi-baki',
    title: 'Eksklüziv Büllur və Qızılı Xonça Kompozisiyası | DreamArt Weddings',
    metaDescription: 'Xüsusi sifarişlə hazırlanan büllur qapaqlı və canlı çiçək bəzəkli nişan-xına xonçaları.',
    h1: 'Eksklüziv Büllur və Qızılı Xonça Kompozisiyası',
    sitemapInclusion: true,
    schemaType: 'CreativeWork',
    changefreq: 'weekly',
    priority: 0.8,
    ogImage: '/images/xonca-xidmeti-cover.jpg',
    contentSnippet: 'Toy və nişan mərasimləri üçün zərif büllur qablar, qızılı aksesuarlar və canlı qızılgüllərlə hazırlanmış xonça dəsti.',
    breadcrumb: [
      { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
      { name: 'Xonça Xidməti', url: `${PRIMARY_DOMAIN}/xonca-xidmeti` },
      { name: 'Büllur Xonça Kompozisiyası', url: `${PRIMARY_DOMAIN}/dekorlar/ekskluziv-bullur-ve-qizili-xonca-kompozisiyasi-baki` }
    ]
  }
];

// Map for O(1) lookup
export const SEO_ROUTES_BY_PATH = new Map<string, SeoRouteConfig>(
  SEO_ROUTES.map(route => [route.path.toLowerCase(), route])
);

/**
 * Returns the exact SEO route config for a given pathname.
 * Handles trailing slashes cleanly.
 */
export function getSeoRoute(pathname: string): SeoRouteConfig | undefined {
  const normalized = (pathname.replace(/\/$/, '') || '/').toLowerCase();
  const directMatch = SEO_ROUTES_BY_PATH.get(normalized);
  if (directMatch) return directMatch;

  // Admin routes: strictly non-indexable
  if (normalized.startsWith('/admin')) {
    return {
      path: normalized,
      indexable: false,
      canonicalPath: normalized,
      title: 'İdarəetmə Paneli | DreamArt Weddings',
      metaDescription: 'DreamArt Weddings idarəetmə paneli.',
      h1: 'İdarəetmə Paneli',
      sitemapInclusion: false,
      schemaType: 'None',
      changefreq: 'monthly',
      priority: 0.1,
      contentSnippet: 'DreamArt Weddings admin paneli.',
      breadcrumb: []
    };
  }

  // Thin / arbitrary local city-service combinations: strictly noindex, follow
  const parts = normalized.split('/').filter(Boolean);
  if (parts.length === 2) {
    const [cat, city] = parts;
    const catName = cat.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const cityName = city.charAt(0).toUpperCase() + city.slice(1);
    return {
      path: normalized,
      indexable: false,
      canonicalPath: normalized,
      title: `${cityName} ${catName} | DreamArt Weddings`,
      metaDescription: `${cityName} şəhərində ${catName.toLowerCase()} xidməti haqqında məlumat.`,
      h1: `${cityName} ${catName}`,
      sitemapInclusion: false,
      schemaType: 'Service',
      changefreq: 'monthly',
      priority: 0.5,
      contentSnippet: `${cityName} üzrə tədbir dekorasiyası və logistika məlumatı.`,
      breadcrumb: [
        { name: 'Ana səhifə', url: PRIMARY_DOMAIN },
        { name: catName, url: `${PRIMARY_DOMAIN}/${cat}` }
      ]
    };
  }

  return undefined;
}

/**
 * Returns all indexable routes.
 */
export function getIndexableRoutes(): SeoRouteConfig[] {
  return SEO_ROUTES.filter(route => route.indexable && route.sitemapInclusion);
}

/**
 * Generates an XML sitemap based exclusively on the centralized indexability source.
 */
export function generateSitemapXml(): string {
  const indexableRoutes = getIndexableRoutes();
  const currentDate = new Date().toISOString().split('T')[0];

  const urlsXml = indexableRoutes
    .map(route => {
      const fullUrl = `${PRIMARY_DOMAIN}${route.canonicalPath === '/' ? '/' : route.canonicalPath}`;
      return `  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq || 'weekly'}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;
}

/**
 * Generates robots.txt with disallows and accurate sitemap directive.
 */
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/*
Disallow: /api/

Sitemap: ${PRIMARY_DOMAIN}/sitemap.xml
`;
}
