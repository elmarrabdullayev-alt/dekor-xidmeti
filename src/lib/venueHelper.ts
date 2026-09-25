import { VenueItem, DecorItem, FAQItem } from '../types';
import { generateSlug } from './seoHelper';

/**
 * Checks if a venue satisfies all quality and project criteria to be indexable.
 * Requirements:
 * - Status must be 'published'
 * - Index status must be 'index'
 * - Must have at least one verified real DreamArt Events project (hasRealProject: true)
 * - Must have at least one linked valid decor project
 * - Must have genuine unique description and venue notes
 */
export function isVenueIndexable(venue: VenueItem, decors?: DecorItem[]): boolean {
  if (venue.status !== 'published') return false;
  if (venue.indexStatus !== 'index') return false;
  if (!venue.hasRealProject) return false;
  if (!venue.relatedDecorIds || venue.relatedDecorIds.length === 0) return false;

  // If decors list provided, confirm at least one linked decor is published
  if (decors && decors.length > 0) {
    const hasPublishedDecor = venue.relatedDecorIds.some(id => {
      const d = decors.find(dec => dec.id === id);
      return d && (d.status === 'published' || d.isPublished !== false);
    });
    if (!hasPublishedDecor) return false;
  }

  if (!venue.shortDescription || venue.shortDescription.trim().length < 20) return false;
  return true;
}

export function generateVenueSlug(name: string): string {
  return generateSlug(name);
}

export function generateVenueSeoTitle(name: string, city: string = 'Bakı'): string {
  const safeName = name.trim() || 'Məkan';
  const safeCity = city.trim() || 'Bakı';
  return `${safeName} Toy Dekoru və Tədbir Tərtibatı | ${safeCity} | DreamArt Weddings`;
}

export function generateVenueMetaDescription(name: string, city: string = 'Bakı', district?: string): string {
  const safeName = name.trim() || 'Məkan';
  const locStr = district ? `${city}, ${district} rayonu` : city;
  return `${safeName} (${locStr}) üçün eksklüziv toy dekoru, gəlin masası və səhnə tərtibatı. DreamArt Weddings tərəfindən icra edilmiş real layihələr və fərdi dizayn həlləri.`;
}

/**
 * Generates concise direct-answer GEO / AI search optimization FAQ blocks
 * adhering strictly to the user specification.
 */
export function generateDefaultVenueFaqs(venueName: string, hasRealProject: boolean, phoneDisplay: string = '050 231 17 28'): FAQItem[] {
  const safeName = venueName.trim() || 'Bu restoranda';

  if (hasRealProject) {
    return [
      {
        question: `${safeName}-da toy və tədbir dekoru üçün DreamArt Weddings ilə işləmək mümkündür?`,
        answer: `Bəli. DreamArt Weddings ${safeName}-da real dekor layihələri həyata keçirib və məkanın daxili memarlığına uyğun toy, nişan və zal dekoru xidmətləri təqdim edir. Əlaqə və WhatsApp: ${phoneDisplay}.`
      },
      {
        question: `${safeName} üçün hansı dekor xidmətləri mümkündür?`,
        answer: `Layihəyə əsasən gəlin-bəy masası, monumental arxa fon altar tağı, qonaq masaları üçün hündür gül kompozisiyaları, şam işıqlandırması və qarşılama fotozonası təqdim olunur.`
      },
      {
        question: `Bu məkanda dekorasiya quraşdırılması necə təşkil olunur?`,
        answer: `DreamArt Weddings komandası məkan rəhbərliyi ilə montaj saatlarını və logistikanı öncədən tənzimləyir, tədbir başlamazdan saatlar öncə hər detalı hazır edir.`
      },
      {
        question: `DreamArt Weddings ilə necə əlaqə saxlamaq olar?`,
        answer: `Telefon və WhatsApp: ${phoneDisplay}. İstənilən vaxt ${safeName} üçün xüsusi eskiz və qiymət təklifi əldə edə bilərsiniz.`
      }
    ];
  }

  // If no real project yet
  return [
    {
      question: `${safeName} məkanında DreamArt Weddings dekor xidməti sifariş etmək olarmı?`,
      answer: `Bəli. DreamArt Weddings Azərbaycanın bütün şadlıq sarayları və restoranlarında olduğu kimi, ${safeName} məkanında da fərdi dekorasiya və floristika layihələrini həyata keçirməyə hazırdır. Əlaqə: ${phoneDisplay}.`
    },
    {
      question: `DreamArt Weddings ilə necə əlaqə saxlamaq olar?`,
      answer: `Telefon və WhatsApp: ${phoneDisplay}.`
    }
  ];
}

/**
 * Valid structured data for venue page
 */
export function getVenueStructuredData(venue: VenueItem, canonicalUrl: string) {
  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': `${venue.name} Toy və Tədbir Dekoru`,
      'description': venue.shortDescription,
      'provider': {
        '@type': 'LocalBusiness',
        'name': 'DreamArt Weddings',
        'telephone': '+994502311728',
        'url': 'https://dreamartweddings.com',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': venue.city || 'Bakı',
          'addressCountry': 'AZ'
        }
      },
      'areaServed': {
        '@type': 'AdministrativeArea',
        'name': venue.city || 'Azərbaycan'
      },
      'url': canonicalUrl
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Ana səhifə',
          'item': 'https://dreamartweddings.com'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Restoranlar',
          'item': 'https://dreamartweddings.com/restoranlar'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': venue.name,
          'item': canonicalUrl
        }
      ]
    }
  ];

  if (venue.faqs && venue.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': venue.faqs.map(item => ({
        '@type': 'Question',
        'name': item.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': item.answer
        }
      }))
    });
  }

  return schemas;
}
