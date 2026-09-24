import toyDekoru1 from '../components/decor/toy dekoru 1.webp';
import toyDekoru2 from '../components/decor/Toy dekoru 2.webp';
import toyDekoru3 from '../components/decor/Toy dekoru 3.webp';
import toyDekoru4 from '../components/decor/Toy dekoru 4.webp';
import toyDekoru5 from '../components/decor/Toy dekoru 5.webp';
import toyDekoru6 from '../components/decor/Toy dekoru 6.webp';

export interface ToyDekoruImageItem {
  id: string;
  src: string;
  url: string;
  alt: string;
  title: string;
  caption: string;
  isCover?: boolean;
  order: number;
}

/**
 * 6 yeni toy dekoru şəkli
 * Sıralama vizual gücə görə optimallaşdırılmışdır.
 * Cover: Toy dekoru 4.webp (ən zəngin və monumental toy səhnəsi kompozisiyası)
 */
export const TOY_DEKORU_COLLECTION: ToyDekoruImageItem[] = [
  {
    id: 'toy-dekor-4',
    src: toyDekoru4,
    url: '/images/Toy dekoru 4.webp',
    alt: 'DreamArt Weddings premium toy dekoru – Monumental bəy-gəlin masası və tağ arxitekturası',
    title: 'Monumental Toy Altarı və Səhnə',
    caption: 'Təbii güllər, zərif şam işıqlandırması və xüsusi arxa fon dizaynı',
    isCover: true,
    order: 1
  },
  {
    id: 'toy-dekor-6',
    src: toyDekoru6,
    url: '/images/Toy dekoru 6.webp',
    alt: 'Premium toy səhnəsi dekoru – Çilçıraq və zərif işıqlandırma detalları',
    title: 'Klassik Çilçıraq və Səhnə İşıqlandırması',
    caption: 'Zalın ümumi aurasını tamamlayan isti işıq və kristal çilçıraq instalyasiyası',
    order: 2
  },
  {
    id: 'toy-dekor-3',
    src: toyDekoru3,
    url: '/images/Toy dekoru 3.webp',
    alt: 'Toy zalı üçün zövqlü dekorasiya – Təbii çiçək aranjimanı və lüks masa tərtibatı',
    title: 'Gəlin-Bəy Masası və Çiçək Arxitekturası',
    caption: 'Ağ və krem rəngli qızılgüllər, hündür şüşə güldanlar və zərif qablaşdırma',
    order: 3
  },
  {
    id: 'toy-dekor-5',
    src: toyDekoru5,
    url: '/images/Toy dekoru 5.webp',
    alt: 'DreamArt Weddings toy dekorasiya layihəsi – Qonaq masası və şamdan kompozisiyası',
    title: 'Banket Qonaq Masası Tərtibatı',
    caption: 'Dəbdəbəli banket zalları üçün fərdi toxunuşlar və harmonik kompozisiya',
    order: 4
  },
  {
    id: 'toy-dekor-1',
    src: toyDekoru1,
    url: '/images/toy dekoru 1.webp',
    alt: 'Eksklüziv toy dekoru – Arxa fon çiçək tağı və xüsusi atmosfer',
    title: 'Eksklüziv Çiçək Tağı və Arxa Fon',
    caption: 'Zərif həndəsi karkas üzərində monumental çiçək aranjimanı',
    order: 5
  },
  {
    id: 'toy-dekor-2',
    src: toyDekoru2,
    url: '/images/Toy dekoru 2.webp',
    alt: 'Romantik toy dekoru dizaynı – Zərif güllər və estetik zal görünüşü',
    title: 'Romantik Mərasim Arxitekturası',
    caption: 'İntim və dəbdəbəli toy gecələri üçün işlənmiş estetik detallar',
    order: 6
  }
];

export const TOY_DEKORU_COVER_IMAGE = TOY_DEKORU_COLLECTION.find(img => img.isCover) || TOY_DEKORU_COLLECTION[0];
