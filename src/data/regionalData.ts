import { RegionalLocationInfo } from '../types';

export const REGIONAL_LOCATIONS: RegionalLocationInfo[] = [
  {
    city: 'Bakı',
    slug: 'baki',
    isMajorHub: true,
    distanceFromBaku: '0 km',
    logisticsNotice: 'Bütün növ (kiçik, orta və lüks) dekorasiyalar üçün standart çatdırılma və operativ quraşdırma mövcuddur.',
    recommendedDecorTypes: ['Toy dekoru', 'Nişan masası', 'Xına gecəsi', 'Ad günü fotozona', 'Korporativ', 'Zal tərtibatı'],
    sampleVenues: ['Boutique 19', 'Four Seasons Baku', 'JW Marriott Absheron', 'Amburan Beach Club', 'Sea Breeze']
  },
  {
    city: 'Sumqayıt',
    slug: 'sumqayit',
    isMajorHub: true,
    distanceFromBaku: '35 km',
    logisticsNotice: 'Abşeron yarımadası zonası üzrə sürətli çatdırılma və minimal logistika xərci ilə quraşdırma.',
    recommendedDecorTypes: ['Toy dekoru', 'Nişan dekoru', 'Ad günü fotozonası', 'Restoran zalı'],
    sampleVenues: ['Sumqayıt Bulvar Restoranları', 'Səadət Sarayı', 'Xəzər Sahil Məkanları']
  },
  {
    city: 'Qəbələ',
    slug: 'qebele',
    isMajorHub: false,
    distanceFromBaku: '225 km',
    logisticsNotice: 'Dağlıq və açıq hava villaları üçün orta və premium toy/nişan layihələri tövsiyə olunur. Nəqliyyat və montaj qrupu öncədən təmin edilir.',
    recommendedDecorTypes: ['Açıq hava toy dekoru', 'Villa nişan dekoru', 'Lüks təbiət konseptləri'],
    sampleVenues: ['Qafqaz Riverside Resort', 'Qafqaz Tufandag', 'Chenot Palace Health Wellness Hotel']
  },
  {
    city: 'Gəncə',
    slug: 'gence',
    isMajorHub: false,
    distanceFromBaku: '360 km',
    logisticsNotice: 'Qərb bölgəsi üzrə genişmiqyaslı zal və premium toy layihələri üçün xüsusi logistika komandası ayrılır.',
    recommendedDecorTypes: ['Böyük zal dekoru', 'Premium gəlin-bəy masası', 'Dəbdəbəli xına gecəsi'],
    sampleVenues: ['Ramada Plaza Gence', 'Ganja Mall Event Hall', 'Göy-Göl Milli Park Məkanları']
  },
  {
    city: 'Şəki',
    slug: 'seki',
    isMajorHub: false,
    distanceFromBaku: '300 km',
    logisticsNotice: 'Tarixi və etnik məkanlara uyğun milli və modern xına, nişan və toy dekorları.',
    recommendedDecorTypes: ['Tarixi məkan toy dekoru', 'Milli xına gecəsi', 'Açıq hava tədbirləri'],
    sampleVenues: ['Şəki Saray Hotel', 'Marxal Resort & Spa', 'Karvansaray Tədbir Həyəti']
  },
  {
    city: 'Quba / Qusar',
    slug: 'quba-qusar',
    isMajorHub: false,
    distanceFromBaku: '175 km',
    logisticsNotice: 'Şimal bölgəsi və dağ kurortları üçün həm qış, həm yay mövsümlərində dayanıqlı premium dekorasiya.',
    recommendedDecorTypes: ['Dağ kurortu toyu', 'Bağ evi nişan dekoru', 'Qala şam yeməyi'],
    sampleVenues: ['Quba Palace Hotel', 'Shahdag Mountain Resort', 'Macara Lake Park']
  }
];

export const REGIONAL_POLICY_STATEMENT =
  'Premium və orta ölçülü dekor layihələri Bakı və bir çox regionlarda quraşdırılır. Kiçik dekor sifarişlərində logistika xərci ayrıca qiymətləndirilir.';
