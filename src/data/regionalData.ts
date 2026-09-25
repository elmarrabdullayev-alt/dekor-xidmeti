import { RegionalLocationInfo, FAQItem } from '../types';

export const REGIONAL_LOCATIONS: RegionalLocationInfo[] = [
  {
    city: 'Bakı',
    slug: 'baki',
    isMajorHub: true,
    distanceFromBaku: '0 km',
    logisticsNotice: 'Bakı şəhəri və Abşeron yarımadası üzrə operativ çatdırılma və günün istənilən saatında quraşdırma təmin olunur.',
    recommendedDecorTypes: ['Toy dekoru', 'Nişan masası', 'Xına gecəsi', 'Ad günü fotozona', 'Korporativ', 'Zal tərtibatı'],
    sampleVenues: ['Meridian', 'By Meridian', 'Bağçalı Saray', 'Böyük Saray']
  },
  {
    city: 'Sumqayıt',
    slug: 'sumqayit',
    isMajorHub: true,
    distanceFromBaku: '35 km',
    logisticsNotice: 'Abşeron yarımadası zonası üzrə sürətli çatdırılma və minimal logistika xərci ilə quraşdırma.',
    recommendedDecorTypes: ['Toy dekoru', 'Nişan dekoru', 'Ad günü fotozonası', 'Restoran zalı'],
    sampleVenues: ['Abşeron sahili məkanları']
  },
  {
    city: 'Qəbələ',
    slug: 'qebele',
    isMajorHub: false,
    distanceFromBaku: '225 km',
    logisticsNotice: 'Dağlıq və açıq hava villaları üçün xüsusi möhkəmləndirilmiş tağ konstruksiyaları və iqlimə dayanıqlı floristika logistikası təmin edilir.',
    recommendedDecorTypes: ['Açıq hava toy dekoru', 'Villa nişan dekoru', 'Təbiət qoynunda nikah altarı'],
    sampleVenues: ['Açıq hava və villa məkanları']
  },
  {
    city: 'Gəncə',
    slug: 'gence',
    isMajorHub: false,
    distanceFromBaku: '360 km',
    logisticsNotice: 'Qərb bölgəsi üzrə böyük zal və intim toy layihələri üçün xüsusi logistika komandası ayrılır.',
    recommendedDecorTypes: ['Böyük zal dekoru', 'Klassik nişan və xonça tərtibatı'],
    sampleVenues: ['Ziyafət zalları']
  },
  {
    city: 'Şəki',
    slug: 'seki',
    isMajorHub: false,
    distanceFromBaku: '300 km',
    logisticsNotice: 'Tarixi və etnik məkanlara uyğun milli və modern xına, nişan və toy dekorları.',
    recommendedDecorTypes: ['Milli xına gecəsi', 'Açıq hava tədbirləri'],
    sampleVenues: ['Tədbir məkanları']
  },
  {
    city: 'Quba / Qusar',
    slug: 'quba-qusar',
    isMajorHub: false,
    distanceFromBaku: '175 km',
    logisticsNotice: 'Şimal bölgəsi üçün dağ və bağ evi məkanlarında mövsümə uyğun dayanıqlı dekorasiya.',
    recommendedDecorTypes: ['Bağ evi nişan dekoru', 'Açıq hava ziyafəti'],
    sampleVenues: ['Villa və kurort məkanları']
  }
];

export interface CuratedLocalPageData {
  routeKey: string; // e.g. 'toy-dekoru/baki'
  localTitle: string;
  localH1: string;
  localIntro: string;
  logisticsDetail: string;
  venueRelevanceText: string;
  verifiedVenueSlugs: string[];
  projectProofName: string;
  projectProofSlug: string;
  faqs: FAQItem[];
}

export const CURATED_LOCAL_PAGES: Record<string, CuratedLocalPageData> = {
  'toy-dekoru/baki': {
    routeKey: 'toy-dekoru/baki',
    localTitle: 'Bakıda Toy Dekoru | DreamArt Weddings',
    localH1: 'Bakı Toy Dekoru Xidməti',
    localIntro: 'Bakı şəhərinin ən gözəl restoran, şadlıq sarayı və dənizkənarı məkanlarında unudulmaz toy dekorasiyası. Canlı gül tağları, bəy-gəlin masası və fərdi arxitektura həlləri.',
    logisticsDetail: 'Bakı və Abşeron ərazisindəki bütün məkanlara çatdırılma və montaj xüsusi təchizatlı nəqliyyatımızla həyata keçirilir. Floristika komandamız məkanın qrafikinə uyğun səhər və ya gecə saatlarında operativ quraşdırmanı təmin edir.',
    venueRelevanceText: 'Meridian, By Meridian, Bağçalı Saray və Böyük Saray kimi Bakının aparıcı məkanlarında real layihələrimiz icra edilmişdir.',
    verifiedVenueSlugs: ['meridian', 'by-meridian', 'bagcali-saray', 'boyuk-saray'],
    projectProofName: 'Ağ Qızılgül və Zərif Şamlı Toy Altarı',
    projectProofSlug: 'ag-qizilgul-ve-zerif-samli-toy-altari-baki',
    faqs: [
      {
        question: 'Bakıda toy dekoru üçün sifariş neçə gün əvvəl verilməlidir?',
        answer: 'Fərdi konsept eskizi və təbii güllərin sifarişi üçün ən azı 15-20 gün öncədən əlaqə saxlamağınız tövsiyə olunur.'
      },
      {
        question: 'Bakının hansı rayon və məkanlarına xidmət göstərirsiniz?',
        answer: 'Səbail, Xətai, Nərimanov, Nəsimi, Yasamal və Abşeronun bütün qəsəbələrində yerləşən şadlıq sarayı və villalarda quraşdırma aparırıq.'
      },
      {
        question: 'Bakıda restorana quraşdırma və sökülmə necə tənzimlənir?',
        answer: 'Restoran rəhbərliyi ilə montaj saatları tərəfimizdən razılaşdırılır və mərasim bitdikdən dərhal sonra zal təmiz təhvil verilir.'
      },
      {
        question: 'Bakıda toy dekorunun qiymət aralığı necədir?',
        answer: 'Qiymət arxa fon ölçüsü, təbii gül həcmi və masa sayına görə dəyişir. Fərdi tələblərinizə əsasən dəqiq şəffaf smeta tərtib edilir.'
      },
      {
        question: 'Bakıda toy dekoru ilə bağlı necə əlaqə saxlamaq olar?',
        answer: 'Rəsmi əlaqə və WhatsApp xəttimiz: 050 231 17 28. Dərhal portfoliomuzu və qiymət təklifini təqdim edirik.'
      }
    ]
  },
  'toy-dekoru/qebele': {
    routeKey: 'toy-dekoru/qebele',
    localTitle: 'Qəbələdə Açıq Hava və Villa Toy Dekoru | DreamArt Weddings',
    localH1: 'Qəbələ Toy Dekoru Xidməti',
    localIntro: 'Qəbələnin füsunkar dağ təbiətində açıq hava və villa toyları üçün xüsusi layihələndirilmiş, dayanıqlı və zövqlü toy dekorasiyası.',
    logisticsDetail: 'Qəbələnin dağlıq iqlimi və külək amilləri nəzərə alınaraq xüsusi möhkəmləndirilmiş konstruksiyalar, su tərkibli xüsusi floristik süngərlər və ixtisaslaşmış montaj briqadası ezam olunur.',
    venueRelevanceText: 'Qəbələdə dağ panoramalı açıq hava və xüsusi villa həyətlərində təbii budaq və vəhşi çiçək kompozisiyaları ilə real layihələrimiz mövcuddur.',
    verifiedVenueSlugs: [],
    projectProofName: 'Açıq Hava Dağ Mənzərəli Toy Altarı Qəbələ',
    projectProofSlug: 'aciq-hava-dag-menzereli-toy-altari-qebele',
    faqs: [
      {
        question: 'Qəbələyə çatdırılma və logistika necə təşkil olunur?',
        answer: 'Bütün dekor materialları və soyuduculu gül daşıma avtomobili tədbirdən 1 gün öncə və ya sübh tezdən Qəbələyə çatdırılır.'
      },
      {
        question: 'Açıq hava dağ toyunda hava şəraiti dəyişərsə nə edilir?',
        answer: 'Dekor konstruksiyalarımız küləyə və nəmə qarşı əlavə dayaqlarla möhkəmləndirilir və alternativ örtülü plan təmin olunur.'
      },
      {
        question: 'Qəbələdə hansı tərzdə toy dekoru daha məşhurdur?',
        answer: 'Təbiətlə vəhdət təşkil edən rustik, boho və ağ canlı çiçəkli romantik altar tağları ən çox seçilən modellərdir.'
      },
      {
        question: 'Qəbələ üçün logistika xərci necə hesablanır?',
        answer: 'Bakıdan məsafə və komandanın qalma tələbatına uyğun olaraq smetaya şəffaf nəqliyyat tarifi daxil edilir.'
      },
      {
        question: 'Qəbələdə toy dekoru üçün müraciət necə edilir?',
        answer: 'WhatsApp: 050 231 17 28. Qəbələ layihələrimizin videosunu və ilkin smetanı göndərə bilərik.'
      }
    ]
  },
  'nisan-dekoru/baki': {
    routeKey: 'nisan-dekoru/baki',
    localTitle: 'Bakıda Nişan Dekoru və Masası | DreamArt Weddings',
    localH1: 'Bakı Nişan Dekoru Xidməti',
    localIntro: 'Bakıda mənzil, bağ evi və restoran mərasimləri üçün romantik nişan masası və zərif fotozona dekorasiyası.',
    logisticsDetail: 'Bakı daxilində çoxmərtəbəli binaların liftlərinə və dar giriş qapılarına uyğun modul konstruksiyalar istifadə olunur. Məkana heç bir zərər vurulmadan səliqəli montaj aparılır.',
    venueRelevanceText: 'By Meridian və Bağçalı Saray kimi zallarda və Bakının mərkəzi məkanlarında nişan tərtibatı təcrübəmiz mövcuddur.',
    verifiedVenueSlugs: ['by-meridian', 'bagcali-saray'],
    projectProofName: 'Pudra Çəhrayı və Qızılı Pastel Nişan Masası',
    projectProofSlug: 'pudra-cehrayi-qizili-pastel-nisan-masasi-sumqayit',
    faqs: [
      {
        question: 'Bakıda ev şəraitində nişan dekoru quraşdırmaq mümkündürmü?',
        answer: 'Bəli, evin qonaq otağı və ya həyətinin ölçülərinə uyğunlaşdırılmış kompakt və zərif arxa fon modelləri qururuq.'
      },
      {
        question: 'Bakı üzrə quraşdırma neçə saat çəkir?',
        answer: 'Nişan masası və arxa fon adətən 1.5 - 2 saat ərzində tam hazır vəziyyətə gətirilir.'
      },
      {
        question: 'Xonçalar üçün xüsusi masa və ya stend gətirilirmi?',
        answer: 'Bəli, bəzədilmiş xonça qutuları və nişan atributları üçün zövqlü pilləli stendlər təmin edilir.'
      },
      {
        question: 'Bakıda nişan dekoru üçün necə sifariş verə bilərəm?',
        answer: 'WhatsApp nömrəmizə (050 231 17 28) otağın və ya restoranın fotosunu göndərərək dərhal uyğun variantları ala bilərsiniz.'
      }
    ]
  },
  'xina-dekoru/baki': {
    routeKey: 'xina-dekoru/baki',
    localTitle: 'Bakıda Xına Gecəsi Dekoru | DreamArt Weddings',
    localH1: 'Bakı Xına Dekoru Xidməti',
    localIntro: 'Bakının şadlıq saraylarında və banket zallarında milli ənənələr və lüks dizaynla zənginləşdirilmiş xına gecəsi dekorasiyası.',
    logisticsDetail: 'Kraliyyət gəlin taxtı, zərif oturacaqlar, büllur xonça stendləri və xına yaxma atributları xüsusi qoruyucu çexollarla zədələnmədən zala çatdırılır.',
    venueRelevanceText: 'Meridian və By Meridian zallarında milli və modern xına tərtibatlarımız icra edilmişdir.',
    verifiedVenueSlugs: ['meridian', 'by-meridian'],
    projectProofName: 'Krallıq Məxməri Şam Kompozisiyalı Xına Dekoru',
    projectProofSlug: 'kraliyyet-mexmeri-sam-kompozisiyali-xina-dekoru-qebele',
    faqs: [
      {
        question: 'Bakıda xına dekoruna gəlin taxtı daxildirmi?',
        answer: 'Bəli, paketə kraliyyət taxtı, xüsusi döşəkcələr, tağ və şam kompozisiyaları daxildir.'
      },
      {
        question: 'Bakıda xına dekorunun çatdırılması və montajı necə aparılır?',
        answer: 'Tədbir başlamazdan 2-3 saat öncə məkanda montaj tamamlanır və sınaq işıqlandırılması aparılır.'
      },
      {
        question: 'Xonça xidmətini xına dekoru ilə birlikdə sifariş etmək olarmı?',
        answer: 'Bəli, həm bəzədilmiş xonçalar, həm də xına dekorasiyası vahid endirimli paketlə təqdim edilir.'
      },
      {
        question: 'Bakıda xına sifarişi üçün əlaqə nömrəsi hansıdır?',
        answer: 'Telefon və WhatsApp: 050 231 17 28. İstənilən vaxt xına kataloqumuzu təqdim etməyə hazırıq.'
      }
    ]
  }
};
