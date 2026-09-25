import { PRIMARY_DOMAIN, getSeoRoute, type SeoRouteConfig } from '../src/data/seoRoutes.ts';

/**
 * Builds the Schema.org JSON-LD object for raw HTML inclusion
 */
export function buildRouteStructuredData(route: SeoRouteConfig): object[] {
  const schemas: object[] = [];

  // Breadcrumb schema
  if (route.breadcrumb && route.breadcrumb.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': route.breadcrumb.map((item, idx) => ({
        '@type': 'ListItem',
        'position': idx + 1,
        'name': item.name,
        'item': item.url
      }))
    });
  }

  // FAQ schema if available
  if (route.faqs && route.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      'mainEntity': route.faqs.map(faq => ({
        '@type': 'Question',
        'name': faq.question,
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': faq.answer
        }
      }))
    });
  }

  // Core Type Schema
  if (route.schemaType === 'WebSite') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${PRIMARY_DOMAIN}/#business`,
      'name': 'DreamArt Weddings',
      'image': `${PRIMARY_DOMAIN}/images/dreamart-toy-dekoru-qizili-altar.webp`,
      'telephone': '+994 50 231 17 28',
      'priceRange': '$$$',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Nizami küç. 142',
        'addressLocality': 'Bakı',
        'addressRegion': 'Bakı',
        'addressCountry': 'AZ'
      },
      'url': PRIMARY_DOMAIN,
      'sameAs': ['https://instagram.com/dreamart.events']
    });
  } else if (route.schemaType === 'Service') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': route.h1,
      'description': route.metaDescription,
      'provider': {
        '@type': 'LocalBusiness',
        'name': 'DreamArt Weddings',
        'telephone': '+994 50 231 17 28',
        'url': PRIMARY_DOMAIN
      },
      'areaServed': 'Azerbaijan',
      'url': `${PRIMARY_DOMAIN}${route.canonicalPath}`
    });
  } else if (route.schemaType === 'ItemPage') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemPage',
      'name': `${route.h1} Restoran Toy Dekoru`,
      'description': route.metaDescription,
      'provider': {
        '@type': 'LocalBusiness',
        'name': 'DreamArt Weddings',
        'url': PRIMARY_DOMAIN
      },
      'url': `${PRIMARY_DOMAIN}${route.canonicalPath}`
    });
  } else if (route.schemaType === 'CreativeWork') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      'name': route.h1,
      'description': route.metaDescription,
      'creator': {
        '@type': 'Organization',
        'name': 'DreamArt Weddings'
      },
      'url': `${PRIMARY_DOMAIN}${route.canonicalPath}`
    });
  }

  return schemas;
}

/**
 * Injects route-specific SEO metadata, canonical link, OpenGraph tags,
 * structured JSON-LD data, and semantic raw HTML into the index.html template.
 */
export function injectSeoHtml(html: string, pathname: string): string {
  const route = getSeoRoute(pathname);

  // If path is not a configured public SEO route, return HTML with standard canonical
  if (!route) {
    const canonicalUrl = `${PRIMARY_DOMAIN}${pathname}`;
    return html.replace(
      '</head>',
      `  <link rel="canonical" href="${canonicalUrl}" />\n  </head>`
    );
  }

  const canonicalUrl = `${PRIMARY_DOMAIN}${route.canonicalPath === '/' ? '/' : route.canonicalPath}`;
  const ogImgUrl = route.ogImage?.startsWith('http')
    ? route.ogImage
    : `${PRIMARY_DOMAIN}${route.ogImage || '/images/dreamart-toy-dekoru-qizili-altar.webp'}`;

  const structuredData = buildRouteStructuredData(route);
  const jsonLdScript = structuredData.length > 0
    ? `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`
    : '';

  // 1. Replace <title>
  let transformed = html.replace(
    /<title>.*?<\/title>/i,
    `<title>${route.title}</title>`
  );

  // 2. Replace or inject meta description
  if (transformed.includes('<meta name="description"')) {
    transformed = transformed.replace(
      /<meta name="description" content=".*?" \/>/i,
      `<meta name="description" content="${route.metaDescription}" />`
    );
  }

  // 3. Replace or inject og:title & og:description
  if (transformed.includes('property="og:title"')) {
    transformed = transformed.replace(
      /<meta property="og:title" content=".*?" \/>/i,
      `<meta property="og:title" content="${route.title}" />`
    );
  }
  if (transformed.includes('property="og:description"')) {
    transformed = transformed.replace(
      /<meta property="og:description" content=".*?" \/>/i,
      `<meta property="og:description" content="${route.metaDescription}" />`
    );
  }

  // 4. Inject canonical, robots, og:url, og:image, and JSON-LD into </head>
  const robotsDirective = route.indexable ? 'index, follow' : 'noindex, follow';
  const headInject = `
    <link rel="canonical" href="${canonicalUrl}" />
    <meta name="robots" content="${robotsDirective}" />
    <meta property="og:url" content="${canonicalUrl}" />
    <meta property="og:image" content="${ogImgUrl}" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.metaDescription}" />
    ${jsonLdScript}
  </head>`;

  transformed = transformed.replace('</head>', headInject);

  // 5. Inject semantic raw HTML into <div id="root"> for web crawlers & immediate rendering
  let semanticBody = `
    <header class="py-12 px-6 max-w-5xl mx-auto text-center">
      <h1 class="text-3xl sm:text-4xl md:text-5xl font-serif text-white mb-4">${route.h1}</h1>
      <p class="text-neutral-300 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">${route.contentSnippet}</p>
    </header>
  `;

  if (route.faqs && route.faqs.length > 0) {
    semanticBody += `
    <section class="max-w-4xl mx-auto px-6 py-8 border-t border-white/10">
      <h2 class="text-xl font-serif text-[#C5A059] mb-4">Tez-tez Verilən Suallar</h2>
      <div class="space-y-4">
        ${route.faqs.map(f => `
        <article class="p-4 rounded bg-[#161616] border border-white/10">
          <h3 class="font-medium text-white text-sm mb-1">${f.question}</h3>
          <p class="text-neutral-400 text-xs">${f.answer}</p>
        </article>
        `).join('')}
      </div>
    </section>
    `;
  }

  // Internal navigation links
  semanticBody += `
    <nav class="max-w-4xl mx-auto px-6 py-6 text-center text-xs text-neutral-400 border-t border-white/10">
      <a href="/" class="hover:text-[#C5A059] mx-2">Ana Səhifə</a> •
      <a href="/toy-dekoru" class="hover:text-[#C5A059] mx-2">Toy Dekoru</a> •
      <a href="/nisan-dekoru" class="hover:text-[#C5A059] mx-2">Nişan Dekoru</a> •
      <a href="/xina-dekoru" class="hover:text-[#C5A059] mx-2">Xına Dekoru</a> •
      <a href="/restoranlar" class="hover:text-[#C5A059] mx-2">Məkanlar</a> •
      <a href="/dekorlar" class="hover:text-[#C5A059] mx-2">Dekor Kataloqu</a> •
      <a href="/elaqe" class="hover:text-[#C5A059] mx-2">Əlaqə</a>
    </nav>
  `;

  transformed = transformed.replace(
    '<div id="root"></div>',
    `<div id="root"><main class="min-h-screen bg-[#0B0B0B] text-[#EAEAEA]">${semanticBody}</main></div>`
  );

  return transformed;
}
