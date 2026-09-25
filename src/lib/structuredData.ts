import { CategoryInfo, DecorItem, FAQItem } from '../types';

export function getLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': 'https://dreamartweddings.com/#business',
    'name': 'DreamArt Events',
    'image': 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85',
    'telephone': '+994 50 231 17 28',
    'priceRange': '$$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Nizami küç. 142',
      'addressLocality': 'Bakı',
      'addressRegion': 'Bakı',
      'addressCountry': 'AZ'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': '40.4093',
      'longitude': '49.8671'
    },
    'url': 'https://dreamartweddings.com',
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        'opens': '09:00',
        'closes': '21:00'
      }
    ],
    'sameAs': [
      'https://instagram.com/dreamart.events'
    ],
    'areaServed': [
      { '@type': 'City', 'name': 'Bakı' },
      { '@type': 'City', 'name': 'Sumqayıt' },
      { '@type': 'City', 'name': 'Gəncə' },
      { '@type': 'City', 'name': 'Qəbələ' },
      { '@type': 'City', 'name': 'Şəki' }
    ]
  };
}

export function getCategoryServiceSchema(category: CategoryInfo) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'name': category.name,
    'description': category.seoIntroduction,
    'provider': {
      '@type': 'LocalBusiness',
      'name': 'DreamArt Events'
    },
    'areaServed': 'Azerbaijan',
    'serviceType': category.name,
    'url': `https://dreamartweddings.com/${category.slug}`
  };
}

export function getFaqPageSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(item => ({
      '@type': 'Question',
      'name': item.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.answer
      }
    }))
  };
}

export function getBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url
    }))
  };
}

export function getProjectDetailSchema(decor: DecorItem) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    'contentUrl': decor.mainImage,
    'name': decor.name,
    'description': decor.shortDescription,
    'author': {
      '@type': 'Organization',
      'name': 'DreamArt Events'
    },
    'locationCreated': {
      '@type': 'Place',
      'name': `${decor.city}, Azərbaycan`
    }
  };
}
