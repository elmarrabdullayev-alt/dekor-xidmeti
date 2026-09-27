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

/**
 * Strict verification that a project belongs to a given venue.
 * A project may appear on a venue page ONLY if its stored venueId / venueSlug explicitly matches that venue.
 * Never infer relationships from category, city, visual similarity, or generic metadata.
 */
export function isProjectStrictlyLinkedToVenue(
  decor: DecorItem,
  venue: { id: string; slug: string }
): boolean {
  if (!decor || !venue) return false;

  const targetSlug = venue.slug.toLowerCase().trim();
  const targetId = venue.id.toLowerCase().trim();

  const decorVenueSlug = (decor.venueSlug || '').toLowerCase().trim();
  const decorVenueId = (decor.venueId || '').toLowerCase().trim();

  // Explicit non-empty exact match only
  if (decorVenueSlug && (decorVenueSlug === targetSlug || decorVenueSlug === targetId)) {
    return true;
  }
  if (decorVenueId && (decorVenueId === targetId || decorVenueId === targetSlug)) {
    return true;
  }

  return false;
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
export function generateDefaultVenueFaqs(
  venueName: string,
  hasRealProject: boolean,
  phoneDisplay: string = '050 231 17 28',
  verifiedProject?: { name: string; slug: string; serviceName?: string; serviceSlug?: string }
): FAQItem[] {
  const safeName = venueName.trim() || 'Bu restoranda';

  if (hasRealProject) {
    const projectAnswerPart = verifiedProject
      ? ` Bu məkanda icra edilmiş real layihəmizlə "${verifiedProject.name}" (https://dreamartweddings.com/dekorlar/${verifiedProject.slug}) layihə səhifəsində tanış ola bilərsiniz.`
      : ` Bu məkanda icra edilmiş real dekor layihələrimizlə portfolio və layihə səhifələrimizdə tanış ola bilərsiniz.`;

    const servicePart = verifiedProject?.serviceName
      ? `${verifiedProject.serviceName}, `
      : '';

    return [
      {
        question: `DreamArt Weddings bu məkanda dekor işi həyata keçirib?`,
        answer: `Bəli. DreamArt Weddings ${safeName} məkanında real dekor layihəsi həyata keçirib.${projectAnswerPart}`
      },
      {
        question: `Bu məkanda toy dekorunu kimə sifariş etmək olar?`,
        answer: `${safeName} məkanında toy və ziyafət dekorasiyasını birbaşa DreamArt Weddings komandasına sifariş etmək olar. Məkanın daxili memarlığına uyğun fərdi floristika, bəy-gəlin masası və səhnə tərtibatı təqdim edilir. Əlaqə və operativ konsultasiya üçün WhatsApp: ${phoneDisplay}.`
      },
      {
        question: `Bu məkanda hansı dekor xidmətləri mümkündür?`,
        answer: `${safeName} məkanında DreamArt Weddings tərəfindən ${servicePart}toy dekoru, bəy-gəlin masası, monumental arxa fon tağı, qonaq masaları üçün hündür gül kompozisiyaları, zərif şam işıqlandırması və qarşılama fotozonası xidmətləri mümkündür. Bütün nümunələr DreamArt Weddings portfoliosunda təqdim olunur.`
      },
      {
        question: `Bu məkanda dekorasiya quraşdırılması necə təşkil olunur?`,
        answer: `DreamArt Weddings komandası ${safeName} rəhbərliyi ilə montaj saatlarını və logistikanı öncədən tənzimləyir, tədbir başlamazdan saatlar öncə hər detalı tam hazır edir.`
      },
      {
        question: `DreamArt Weddings ilə necə əlaqə saxlamaq olar?`,
        answer: `Telefon və WhatsApp: ${phoneDisplay}. İstənilən vaxt ${safeName} üçün fərdi eskiz, smeta və dizayn təklifi əldə edə bilərsiniz.`
      }
    ];
  }

  // If no real project yet - strictly informational without recommendation claims (Rule 8)
  return [
    {
      question: `DreamArt Weddings bu məkanda dekor işi həyata keçirib?`,
      answer: `Hazırda portfoliomuzda ${safeName} məkanına aid tamamlanmış layihə qeyd olunmayıb. Bununla belə, DreamArt Weddings bu məkanın memarlıq xüsusiyyətlərinə və zal parametrlərinə uyğun fərdi toy və tədbir dekor layihələrini sifarişlə hazırlayır.`
    },
    {
      question: `Bu məkanda toy dekorunu kimə sifariş etmək olar?`,
      answer: `${safeName} məkanında toy, nişan və ya ziyafət dekorasiyasını DreamArt Weddings komandasına sifariş edə bilərsiniz. Əlaqə və WhatsApp: ${phoneDisplay}.`
    },
    {
      question: `Bu məkanda hansı dekor xidmətləri mümkündür?`,
      answer: `${safeName} üçün toy dekoru, nişan masası, zal bəzədilməsi, fotozona və floristika xidmətləri sifariş verilə bilər.`
    },
    {
      question: `DreamArt Weddings ilə necə əlaqə saxlamaq olar?`,
      answer: `Telefon və WhatsApp: ${phoneDisplay}.`
    }
  ];
}

/**
 * Valid structured data for venue page strengthening entity relationships:
 * Venue → Project → Service → Portfolio → DreamArt Weddings
 */
export function getVenueStructuredData(venue: VenueItem, canonicalUrl: string, decors?: DecorItem[]) {
  const verifiedProjects = (decors || []).filter(d => isProjectStrictlyLinkedToVenue(d, venue));

  const serviceSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': `${venue.name} Toy və Tədbir Dekoru`,
    'serviceType': 'Toy və Tədbir Dekorasiyası',
    'description': venue.shortDescription,
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'DreamArt Weddings',
      'telephone': '+994502311728',
      'url': 'https://dreamartweddings.com',
      'image': 'https://dreamartweddings.com/images/dreamart-toy-dekoru-qizili-altar.webp',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': venue.city || 'Bakı',
        'addressCountry': 'AZ'
      }
    },
    'areaServed': {
      '@type': 'Place',
      'name': venue.name,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': venue.address || '',
        'addressLocality': venue.city || 'Bakı',
        'addressCountry': 'AZ'
      }
    },
    'url': canonicalUrl
  };

  if (verifiedProjects.length > 0) {
    serviceSchema.hasPart = verifiedProjects.map(p => ({
      '@type': 'CreativeWork',
      'name': p.name,
      'headline': p.name,
      'url': `https://dreamartweddings.com/dekorlar/${p.slug}`,
      'image': p.mainImage.startsWith('http') ? p.mainImage : `https://dreamartweddings.com${p.mainImage}`,
      'creator': {
        '@type': 'Organization',
        'name': 'DreamArt Weddings',
        'url': 'https://dreamartweddings.com'
      }
    }));
  }

  const schemas: object[] = [
    serviceSchema,
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
