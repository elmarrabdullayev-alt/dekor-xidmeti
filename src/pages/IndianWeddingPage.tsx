import React, { useState, useEffect } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { getBreadcrumbSchema, getFaqPageSchema } from '../lib/structuredData';
import { imageService } from '../lib/imageService';
import {
  Sparkles,
  Calendar,
  MapPin,
  Clock,
  ShieldCheck,
  Building2,
  ArrowRight,
  MessageCircle,
  Phone,
  Check,
  Compass,
  Layers,
  HeartHandshake,
  Flower2,
  Palette,
  Music,
  Sun,
  Flame,
  Wine,
  HelpCircle,
  Briefcase
} from 'lucide-react';

interface IndianWeddingPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (eventName?: string) => void;
}

export const IndianWeddingPage: React.FC<IndianWeddingPageProps> = ({
  navigate,
  onOpenQuoteModal
}) => {
  const phoneDisplay = '050 231 17 28';
  const phoneRaw = '+994502311728';
  const whatsappNumber = '994502311728';

  const whatsappMessage =
    'Hello DreamArt Weddings. We are planning an Indian destination wedding in Azerbaijan and would like to discuss decoration for our events.';

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directAnswers = [
    {
      question: 'Can DreamArt Weddings decorate an Indian wedding in Azerbaijan?',
      answer:
        'Yes. DreamArt Weddings is an Azerbaijan-based event decoration company providing custom wedding and event decor in Baku and other regions of Azerbaijan. We design, build, and coordinate multi-event decor programs for destination weddings, including stage design, floral architecture, Mandap construction, tabletop styling, lighting, and ambient installations.'
    },
    {
      question: 'Can you create decor for Mehndi and Sangeet events in Baku?',
      answer:
        'Yes. We regularly produce vibrant daytime decor for Mehndi rituals—including custom floral swings, draped pavilions, and colorful lounge seating—as well as large-scale Sangeet evening stages equipped with acoustic-friendly performance backdrops, concert lighting rigs, and illuminated dance floors.'
    },
    {
      question: 'Can DreamArt Weddings design a custom Mandap in Azerbaijan?',
      answer:
        'Yes. Our in-house production team builds custom four-pillar and circular Mandap pavilions engineered specifically for indoor ballrooms, sea-view terraces, or open lawn venues across Azerbaijan. We adorn structures with fresh imported florals (roses, hydrangeas, orchids) and integrate fire-safe havan staging areas.'
    },
    {
      question: 'Do you provide wedding decoration outside Baku?',
      answer:
        'Yes. While our primary design studio and fabrication workshop are in Baku, our specialized logistics fleet and on-site floral teams regularly manage full setups across Azerbaijan, including Gabala (Qəbələ), Guba (Quba), and Shamakhi (Şamaxı).'
    },
    {
      question: 'Can Indian wedding planners work with DreamArt Weddings as a local decor supplier?',
      answer:
        'Yes. We frequently collaborate with international wedding planners and destination agencies as their dedicated on-the-ground decoration and production partner in Azerbaijan. We provide technical floor plans, 3D renderings, local floral sourcing, custom carpentry, and complete setup and breakdown crews.'
    },
    {
      question: 'Can you decorate multi-day destination weddings in Azerbaijan?',
      answer:
        'Yes. We routinely handle 2- to 4-day destination wedding programs, organizing seamless overnight turnarounds between consecutive events such as Welcome Dinners, Haldi, Mehndi, Sangeet nights, Mandap wedding ceremonies, and gala Receptions.'
    }
  ];

  const additionalFaqs = [
    {
      question: 'What materials and florals are used in your Mandap and ceremony setups?',
      answer:
        'We combine architectural wooden and metal structures with fresh imported florals (such as Ecuadorian roses, Dutch hydrangeas, orchids, and seasonal foliage), custom draped fabrics, and safe candlelight installations.'
    },
    {
      question: 'How do you coordinate with couples and planners before arriving in Baku?',
      answer:
        'We establish structured communication via WhatsApp and video conferences, sharing mood boards, itemized decor quotes, color palettes, and venue measurements well in advance of the wedding week.'
    }
  ];

  const allFaqs = [...directAnswers, ...additionalFaqs];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Indian Wedding Decoration in Azerbaijan',
      'description':
        'DreamArt Weddings is an Azerbaijan-based event decoration company providing custom wedding and event decor in Baku and other regions of Azerbaijan, specializing in Mehndi, Sangeet, Mandap, and reception styling.',
      'provider': {
        '@type': 'LocalBusiness',
        'name': 'DreamArt Weddings',
        'telephone': '+994502311728',
        'url': 'https://dreamartweddings.com',
        'address': {
          '@type': 'PostalAddress',
          'addressLocality': 'Baku',
          'addressCountry': 'AZ'
        },
        'description':
          'Azerbaijan-based event decoration company providing custom wedding and event decor in Baku and other regions of Azerbaijan.'
      },
      'areaServed': [
        { '@type': 'Country', 'name': 'Azerbaijan' },
        { '@type': 'City', 'name': 'Baku' },
        { '@type': 'City', 'name': 'Gabala' },
        { '@type': 'City', 'name': 'Guba' }
      ],
      'serviceType': 'Indian Destination Wedding Decor and Production',
      'url': 'https://dreamartweddings.com/indian-wedding-azerbaijan'
    },
    getBreadcrumbSchema([
      { name: 'Home', url: 'https://dreamartweddings.com' },
      {
        name: 'Indian Wedding Decoration in Azerbaijan',
        url: 'https://dreamartweddings.com/indian-wedding-azerbaijan'
      }
    ]),
    getFaqPageSchema(allFaqs)
  ];

  const ceremonySections = [
    {
      id: 'mehndi',
      title: 'Mehndi Decoration',
      subtitle: 'Vibrant Colors, Festive Drapes & Floral Swings',
      icon: Palette,
      tag: 'Daytime Celebration',
      description:
        'The Mehndi is a jubilant celebration of color, art, and music. We craft cheerful, sunlit spaces using layered drape canopies in rich marigold yellow, emerald green, and hot pink palettes. Our custom-fabricated floral swings serve as breathtaking focal points for the bride, paired with comfortable low-seating bohemian lounges, bolsters, and playful photo backdrops.',
      capabilities: [
        'Custom floral swing (jhoola) installations with fresh blooms',
        'Color-blocked fabric draping for outdoor pergolas and lawns',
        'Low-seating guest lounges with traditional cushions & bolsters',
        'Bespoke photo points with floral arches & customized signboards',
        'Handmade floral jewelry display stations and accessory tables'
      ],
      linkUrl: '/mehndi-decoration-baku',
      linkLabel: 'Explore Dedicated Mehndi Decor in Baku'
    },
    {
      id: 'sangeet',
      title: 'Sangeet Decoration',
      subtitle: 'Concert-Grade Stages, Dramatic Lighting & Party Lounges',
      icon: Music,
      tag: 'Musical Evening',
      description:
        'The Sangeet demands high-impact visual glamour and performance-ready spatial design. We construct wide, multi-level performance stages backed by dynamic architectural panels, metallic textures, and LED-compatible floral frames. Integrated ambient lighting, dramatic entryway tunnels, illuminated dance floors, and sleek cocktail high-tables ensure high energy throughout the night.',
      capabilities: [
        'Reinforced performance stages engineered for high-energy choreographies',
        'Acoustic-compatible layered backdrops with gold and metallic accents',
        'Dynamic dance floor perimeters and ambient fairy-light canopies',
        'Cocktail high-tables styled with glowing floral centerpieces',
        'VIP lounge vignettes with plush velvet seating and bespoke cocktail bars'
      ],
      linkUrl: '/sangeet-decoration-baku',
      linkLabel: 'Explore Dedicated Sangeet Decor in Baku'
    },
    {
      id: 'haldi',
      title: 'Haldi Decoration',
      subtitle: 'Sun-Drenched Palettes, Marigold Accents & Ritual Comfort',
      icon: Sun,
      tag: 'Morning Ritual',
      description:
        'The Haldi ceremony is an intimate, joy-filled morning ritual requiring clean, picturesque, and functional staging. We build dedicated wooden ritual platforms bordered by cascading yellow and white blooms, fresh marigolds, and airy sheer curtains. Low tables with brass urns (urli) filled with floating rose petals provide sacred elegance with easy cleanup.',
      capabilities: [
        'Dedicated raised ritual seating for the couple with floral backboards',
        'Traditional brass urli decorative bowls with floating candles & blossoms',
        'Bright saffron, canary yellow, and ivory drapery concepts',
        'Protective floor coverings and easy-to-clean ceremonial perimeters',
        'Shaded garden gazebos or terrace settings with fresh morning florals'
      ]
    },
    {
      id: 'mandap',
      title: 'Mandap & Wedding Ceremony Decoration',
      subtitle: 'Architectural Pavilions, Sacred Aisle & Floral Opulence',
      icon: Flame,
      tag: 'Sacred Ceremony',
      description:
        'The wedding ceremony is the spiritual climax of the destination celebration. We engineer robust, freestanding four-pillar or circular Mandap pavilions adorned with tens of thousands of imported roses, hydrangeas, and trailing foliage. The ceremonial aisle is lined with glowing brass lanterns, floral pillars, and rose petals leading to a dedicated, fire-safe havan platform.',
      capabilities: [
        'Engineered 4-pillar and circular Mandap structures for ballrooms & lawns',
        'Lush floral canopies featuring imported roses, hydrangeas, and orchids',
        'Extended ceremony aisle runners bordered by hurricane glass lamps',
        'Fire-safe ceremonial havan kund platform setup with fireproof safeguards',
        'Coordinated family seating chairs with velvet ribbons and floral ties'
      ],
      linkUrl: '/mandap-decoration-azerbaijan',
      linkLabel: 'Explore Dedicated Mandap Decor in Azerbaijan'
    },
    {
      id: 'reception',
      title: 'Grand Reception Decoration',
      subtitle: 'Imperial Ballroom Splendor, Crystal Candelabras & Monumental Stages',
      icon: Wine,
      tag: 'Gala Night',
      description:
        'The finale reception calls for imperial luxury and sophisticated ambiance. We transform Azerbaijan’s grandest ballrooms with breathtaking presidential stages for the newlyweds, tall Italian crystal candelabras on guest tables, cascading floral runners, and bespoke lighting installations that create a timeless, cinematic atmosphere.',
      capabilities: [
        'Monumental stage backdrop featuring custom 3D molding and rich florals',
        'High-low tabletop floral arrangements with crystal and gold candelabras',
        'Custom charger plates, personalized menus, and luxury fabric napkins',
        'Dramatic illuminated tunnel entrances with hanging crystals',
        'Synchronized ambient stage lighting and warm chandelier washes'
      ]
    },
    {
      id: 'welcome',
      title: 'Welcome Dinner & Mehmaan Nawazi',
      subtitle: 'Warm Hospitality, Ambient Fairy Lights & Intimate Elegance',
      icon: HeartHandshake,
      tag: 'Arrival Evening',
      description:
        'Setting the tone for the entire destination weekend, the Welcome Dinner offers arriving guests an inviting, warm introduction to Azerbaijan. We design intimate candlelit dinner settings, personalized welcome signage, customized seating charts, and ambient fairy-light ceilings that foster connection.',
      capabilities: [
        'Personalized welcome signage featuring bespoke couple monograms',
        'Long banquet table styling with fresh olive branches, roses, and tapered candles',
        'Atmospheric acoustic lighting, Edison bulbs, and fairy-light pergolas',
        'Cocktail reception bars with customized botanical displays'
      ]
    }
  ];

  const coreServices = [
    {
      title: 'Stage & Backdrop Architecture',
      description:
        'Precision carpentry, layered 3D scenic backdrops, and custom-built staging tailored to venue ceiling heights and performance needs.'
    },
    {
      title: 'Imported Floral Architecture',
      description:
        'Master floral design using premium imported blooms—Ecuadorian roses, Dutch hydrangeas, orchids, and carnations—paired with fresh local greens.'
    },
    {
      title: 'Imperial Tabletop & Linen Styling',
      description:
        'High-low centerpieces, crystal candelabras, velvet runners, bespoke chargers, and curated candlelit table runners.'
    },
    {
      title: 'Entrance Design & Experiential Photo Zones',
      description:
        'Grand floral arches, dramatic illuminated entrance tunnels, and branded photo points that greet guests upon arrival.'
    },
    {
      title: 'Lighting & Production Decor',
      description:
        'Warm ambient washes, fairy-light ceilings, chandelier rigging, and accent pin-spotting to enhance floral brilliance on camera.'
    },
    {
      title: 'Turnkey Setup, Turnaround & Dismantling',
      description:
        'Dedicated on-site logistics crew managing rapid overnight room conversions between multi-day events and spotless post-event handover.'
    }
  ];

  const documentedVenues = [
    {
      name: 'Meridian',
      slug: 'meridian',
      city: 'Baku (Badamdar)',
      evidence: 'Documented DreamArt wedding stage & grand ballroom floral project.',
      link: '/restoranlar/meridian'
    },
    {
      name: 'Bağçalı Saray',
      slug: 'bagcali-saray',
      city: 'Baku (Khatai)',
      evidence: 'Documented DreamArt gala banquet & candelabra guest table styling.',
      link: '/restoranlar/bagcali-saray'
    },
    {
      name: 'Böyük Saray',
      slug: 'boyuk-saray',
      city: 'Baku (Narimanov)',
      evidence: 'Documented DreamArt monumental ceiling installation & palace hall decor.',
      link: '/restoranlar/boyuk-saray'
    },
    {
      name: 'By Meridian',
      slug: 'by-meridian',
      city: 'Baku (Badamdar)',
      evidence: 'Documented DreamArt banquet hall & floral arch project location.',
      link: '/restoranlar/by-meridian'
    }
  ];

  const realCapabilityProjects = [
    {
      title: 'Monumental Wedding Stage & Altar Craftsmanship',
      category: 'Stage Architecture & Floral Artistry',
      location: 'Baku Ballroom',
      image: '/images/dreamart-monumental-toy-sehnesi-dekoru.webp',
      alt: 'Real DreamArt monumental wedding stage and floral arch production in Baku',
      note: 'Real DreamArt production demonstrating large-scale stage framing, layered backdrops, and fresh rose installations.'
    },
    {
      title: 'Imperial Gala Tabletop & Candelabra Styling',
      category: 'Tabletop & Ambient Lighting',
      location: 'Bağçalı Saray, Baku',
      image: '/images/dreamart-qala-gecesi-samdan-dekoru.webp',
      alt: 'Real DreamArt candelabra and luxury banquet guest table styling',
      note: 'Real DreamArt production showing high-tier tabletop styling with Italian crystal candelabras and lush floral runners.'
    },
    {
      title: 'Palace Hall Panoramic Ceiling & Light Installation',
      category: 'Venue Transformation & Rigging',
      location: 'Böyük Saray, Baku',
      image: '/images/dreamart-zal-dekoru-tavan-instalyasiyasi.webp',
      alt: 'Real DreamArt palace ceiling fabric and chandelier installation in Baku',
      note: 'Real DreamArt production showcasing complex ceiling rigging, cascading tulle drapery, and grand room scale.'
    },
    {
      title: 'Golden Altar & Fresh Floral Pavilion Craftsmanship',
      category: 'Ceremonial Altars & Pavilions',
      location: 'Baku Luxury Venue',
      image: '/images/dreamart-toy-dekoru-qizili-altar.webp',
      alt: 'Real DreamArt gold altar and fresh floral installation in Azerbaijan',
      note: 'Real DreamArt production displaying custom gilded metal arches, dense floral clusters, and candle styling.'
    }
  ];

  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return () => unsub();
  }, []);

  const heroImgs = (() => {
    const byTarget = imageService.getImagesByTarget('indian-wedding');
    if (byTarget.length > 0) return byTarget;
    return imageService.getImagesBySection('indian_wedding');
  })();

  const heroImage =
    (heroImgs.length > 0 && (heroImgs.find(i => i.isCover)?.url || heroImgs[0].url)) ||
    imageService.getCoverImage('indian-wedding') ||
    imageService.getCoverImage('img-portfolio-4', 'portfolio_lookbook', '/images/dreamart-monumental-toy-sehnesi-dekoru.webp');
  const heroAlt = heroImgs[0]?.altText || 'Indian wedding decoration in Azerbaijan by DreamArt Weddings';

  return (
    <>
      <SeoHead
        title="Indian Wedding Decoration in Azerbaijan | DreamArt Weddings"
        description="Bespoke Indian wedding decoration in Azerbaijan by DreamArt Weddings. Custom Mandap, Mehndi, Sangeet, and reception decor across Baku ballrooms and scenic regions."
        canonicalPath="/indian-wedding-azerbaijan"
        ogImage={heroImage}
        jsonLd={jsonLd}
        lang="en"
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[560px] lg:min-h-[640px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src={heroImage}
            alt={heroAlt}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-black/50" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            {/* Entity Clarity Pill */}
            <div className="inline-flex items-center gap-2 border border-[#C5A059]/40 bg-[#121212]/85 backdrop-blur-md px-3.5 py-1.5 rounded-sm mb-5 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C378] font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>AZERBAIJAN LOCAL EVENT DECORATION COMPANY</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF8F5] font-normal mb-6 leading-tight max-w-4xl mx-auto">
              Indian Wedding Decoration in Azerbaijan
            </h1>

            {/* Core Entity Statement */}
            <div className="p-4 sm:p-5 bg-black/60 border border-[#C5A059]/30 rounded-sm max-w-3xl mx-auto mb-6 backdrop-blur-sm text-left sm:text-center">
              <p className="text-xs sm:text-sm text-white/95 font-light leading-relaxed">
                <strong className="text-[#E5C378] font-medium">DreamArt Weddings</strong> is an Azerbaijan-based event decoration company providing custom wedding and event decor in Baku and other regions of Azerbaijan. We partner with couples, families, and international planners to produce magnificent multi-day Indian destination weddings with authentic elegance and flawless technical execution.
              </p>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              From colorful daytime Mehndi and Haldi celebrations to high-energy Sangeet performance stages, sacred Mandap ceremony canopies, and opulent gala receptions, our in-house florists, carpenters, and production technicians transform Azerbaijan’s premier ballrooms, coastal lawns, and mountain resort estates.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleWhatsApp}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-sm text-xs font-medium tracking-wider uppercase flex items-center gap-2.5 transition-all shadow-xl cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Plan Your Indian Wedding Decor in Azerbaijan</span>
              </button>

              <a
                href={`tel:${phoneRaw}`}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3.5 rounded-sm text-xs tracking-wider uppercase flex items-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Call {phoneDisplay}</span>
              </a>
            </div>

            <p className="mt-4 text-[11px] text-white/60 font-light">
              English & Azerbaijani speaking production liaison • WhatsApp: +994 50 231 17 28
            </p>

            {/* Top Admin Showcase: 1 or 2 images near the top/hero */}
            {heroImgs.length > 0 && (
              <div className="mt-10 pt-8 border-t border-white/10 max-w-5xl mx-auto">
                <div
                  className={`grid gap-4 sm:gap-6 ${
                    heroImgs.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : 'grid-cols-1 sm:grid-cols-2'
                  }`}
                >
                  {heroImgs.slice(0, 2).map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="group relative rounded-xl overflow-hidden border border-[#C5A059]/35 bg-[#141414] shadow-2xl aspect-[16/10]"
                    >
                      <img
                        src={img.url}
                        alt={img.altText || img.alt || `DreamArt Indian Wedding Decor ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                      <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end justify-between gap-2">
                        <p className="text-xs sm:text-sm text-white/95 font-medium truncate drop-shadow text-left">
                          {img.altText || (img.isCover ? 'Featured Wedding Production' : 'Custom Stage & Floral Design')}
                        </p>
                        {img.isCover && (
                          <span className="shrink-0 px-2 py-0.5 rounded text-[10px] bg-[#C5A059] text-black font-semibold uppercase tracking-wider">
                            Cover
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Quick Hub Navigation: Supporting Dedicated SEO Pages */}
        <section className="bg-[#121212] border-b border-white/10 py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-white/60 uppercase tracking-wider text-[11px] font-mono">
                Explore Focused Guides:
              </span>
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                <button
                  onClick={() => navigate('/indian-wedding-decor-baku')}
                  className="text-[#E5C378] hover:text-white px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  Baku Wedding Decor
                </button>
                <button
                  onClick={() => navigate('/mehndi-decoration-baku')}
                  className="text-[#E5C378] hover:text-white px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  Mehndi Decor Baku
                </button>
                <button
                  onClick={() => navigate('/sangeet-decoration-baku')}
                  className="text-[#E5C378] hover:text-white px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  Sangeet Decor Baku
                </button>
                <button
                  onClick={() => navigate('/mandap-decoration-azerbaijan')}
                  className="text-[#E5C378] hover:text-white px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                >
                  Mandap Decor Azerbaijan
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* AI & GEO Direct Answers Block */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono font-medium mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>AI & GEO DIRECT ANSWERS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal mb-3">
              Direct Facts for Couples & International Planners
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
              Clear, transparent answers regarding DreamArt Weddings' actual decoration capabilities, logistics coverage, and collaboration model in Azerbaijan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {directAnswers.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#121212] border border-[#C5A059]/30 hover:border-[#C5A059]/60 p-6 rounded-sm shadow-xl transition-all flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-base sm:text-lg text-white font-medium mb-3 flex items-start gap-2.5">
                    <span className="text-[#C5A059] font-mono text-xs mt-1 shrink-0">Q{idx + 1}.</span>
                    <span>{item.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed pl-6">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-[#141414] border border-white/10 rounded-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#C5A059] shrink-0" />
              <span>Local Workshop: Baku, Azerbaijan • Servicing Baku, Gabala, Guba & Nationwide</span>
            </div>
            <button
              onClick={handleWhatsApp}
              className="text-[#E5C378] hover:underline font-mono text-xs inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ask a Specific Question on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Substantial Ceremony Sections */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium font-mono">
              CEREMONY-BY-CEREMONY EXPERTISE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal mb-4">
              Bespoke Styling Across Every Indian Wedding Celebration
            </h2>
            <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
              Every ceremonial stage in a destination wedding carries a distinct mood, color story, and spatial function. We tailor architectural backdrops, floristry, furniture, and lighting to create an immersive, seamless flow from arrival to final farewell.
            </p>
          </div>

          <div className="space-y-12">
            {ceremonySections.map((ceremony, idx) => {
              const IconComponent = ceremony.icon;
              return (
                <div
                  key={ceremony.id}
                  id={ceremony.id}
                  className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/40 p-6 sm:p-8 lg:p-10 rounded-sm transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-white/10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="p-2 rounded bg-[#C5A059]/15 text-[#C5A059]">
                          <IconComponent className="w-5 h-5" />
                        </span>
                        <span className="text-[11px] font-mono uppercase tracking-widest text-[#C5A059] bg-[#181818] px-2.5 py-1 rounded border border-white/5">
                          {ceremony.tag}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                        {ceremony.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#E5C378] font-light">
                        {ceremony.subtitle}
                      </p>
                    </div>

                    {ceremony.linkUrl && (
                      <button
                        onClick={() => navigate(ceremony.linkUrl!)}
                        className="self-start text-xs text-[#C5A059] hover:text-white border border-[#C5A059]/40 hover:border-white px-4 py-2 rounded-sm transition-colors inline-flex items-center gap-1.5 cursor-pointer font-medium shrink-0"
                      >
                        <span>{ceremony.linkLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-7">
                      <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed mb-6">
                        {ceremony.description}
                      </p>
                      <div className="p-4 bg-black/40 rounded border border-white/5 text-[11px] text-white/60 font-light">
                        <strong>Factual Note:</strong> We execute all production and styling based on client mood boards, technical venue guidelines, and safety codes. We do not impose religious dictates; we build beautiful, culturally respectful decorative environments.
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-[#161616] p-5 sm:p-6 rounded-sm border border-white/5 space-y-3">
                      <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-mono block font-medium">
                        Key Production Capabilities:
                      </span>
                      <ul className="space-y-2">
                        {ceremony.capabilities.map((cap, cIdx) => (
                          <li key={cIdx} className="flex items-start gap-2.5 text-xs text-white/80 font-light">
                            <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                            <span>{cap}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: For Indian Wedding Planners */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#121212] border border-[#C5A059]/40 p-8 sm:p-12 rounded-sm shadow-2xl">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono font-medium mb-3">
                  <Briefcase className="w-4 h-4" />
                  <span>B2B & PLANNER COLLABORATION</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal mb-4">
                  For Indian Wedding Planners & Event Agencies
                </h2>
                <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed mb-6">
                  Are you an international wedding planner based in India, UAE, UK, or the USA organizing a destination wedding in Azerbaijan? DreamArt Weddings acts as your trusted, agile on-the-ground decor supplier and production powerhouse in Baku.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8 pt-6 border-t border-white/10">
                <div className="space-y-2">
                  <h4 className="font-serif text-base text-white font-medium flex items-center gap-2">
                    <span className="text-[#C5A059]">01.</span>
                    <span>Local Fabrication & Florals</span>
                  </h4>
                  <p className="text-xs text-white/70 font-light leading-relaxed">
                    Direct access to our Baku carpentry workshops, vast inventory of luxury props, and regular fresh flower import pipelines from Ecuador and the Netherlands.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-base text-white font-medium flex items-center gap-2">
                    <span className="text-[#C5A059]">02.</span>
                    <span>Technical Floor Plans & 3D</span>
                  </h4>
                  <p className="text-xs text-white/70 font-light leading-relaxed">
                    We adapt your design briefs into laser-measured venue floor plans, structural load calculations, and photorealistic 3D previews for your clients.
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="font-serif text-base text-white font-medium flex items-center gap-2">
                    <span className="text-[#C5A059]">03.</span>
                    <span>Rapid Multi-Day Turnaround</span>
                  </h4>
                  <p className="text-xs text-white/70 font-light leading-relaxed">
                    Disciplined overnight installation and teardown crews trained to execute total room conversions between consecutive event days without venue delays.
                  </p>
                </div>
              </div>

              {/* Service Boundaries Disclaimer */}
              <div className="p-4 sm:p-5 bg-black/50 border border-white/10 rounded text-xs text-white/70 font-light mb-8">
                <strong className="text-white font-medium">Clear Supplier Scope:</strong> DreamArt Weddings focuses exclusively on event decoration, floral design, scenic carpentry, stage and lighting production, and on-site visual execution. We do not provide travel bookings, flight ticketing, hotel reservations, tourist visas, or catering services. This focused specialization allows us to be the most reliable production collaborator for full-service planners.
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={handleWhatsApp}
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3 rounded-sm text-xs font-medium tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Connect With Our Production Manager</span>
                </button>
                <button
                  onClick={() => onOpenQuoteModal('Planner RFP / Partner Inquiry')}
                  className="bg-[#C5A059] hover:bg-[#D4AF37] text-black px-7 py-3 rounded-sm text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
                >
                  Submit Decor RFP
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Real Project Evidence & Craftsmanship Showcase */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium font-mono">
              REAL PROJECT EVIDENCE & PRODUCTION SCALE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal mb-3">
              Documented DreamArt Decor Craftsmanship
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
              We present real completed projects executed by the DreamArt Weddings team in Azerbaijan. These examples illustrate our structural carpentry, floral density, lighting balance, and ballroom transformation capability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {realCapabilityProjects.map((proj, idx) => (
              <div
                key={idx}
                className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden group hover:border-[#C5A059]/40 transition-all shadow-xl flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <img
                      src={proj.image}
                      alt={proj.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-[#E5C378] border border-white/10 uppercase">
                      {proj.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-1.5 text-[11px] text-[#C5A059] font-mono mb-2">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{proj.location}</span>
                    </div>
                    <h3 className="font-serif text-xl text-white font-normal mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-white/70 font-light leading-relaxed">
                      {proj.note}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-white/50 italic">Verified DreamArt Build</span>
                  <button
                    onClick={() => navigate('/portfolio')}
                    className="text-[#E5C378] hover:underline inline-flex items-center gap-1 font-medium cursor-pointer"
                  >
                    <span>View in portfolio</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigate('/portfolio')}
              className="bg-white/5 hover:bg-white/10 border border-white/20 text-white px-8 py-3.5 rounded-sm text-xs tracking-wider uppercase inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Explore All Verified Azerbaijani Portfolios</span>
              <ArrowRight className="w-4 h-4 text-[#C5A059]" />
            </button>
          </div>
        </section>

        {/* Verified Venue Context */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-1 font-medium font-mono">
                  VENUE FAMILIARITY & LOGISTICS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  Venues Where DreamArt Has Produced Real Decor Projects
                </h2>
              </div>
              <button
                onClick={() => navigate('/restoranlar')}
                className="text-xs text-[#C5A059] hover:underline mt-2 sm:mt-0 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View all verified venues</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-white/70 font-light mb-6 max-w-3xl leading-relaxed">
              We operate independently across Azerbaijan. While international destination couples frequently celebrate at five-star hotels and private coastal resorts, DreamArt Weddings possesses documented hands-on decor installation experience at prominent Baku venues:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {documentedVenues.map((v, i) => (
                <div
                  key={i}
                  className="bg-[#141414] border border-white/10 p-5 rounded-sm flex flex-col justify-between hover:border-[#C5A059]/40 transition-colors"
                >
                  <div className="space-y-1 mb-4">
                    <div className="flex items-center gap-1.5 text-[10px] text-[#C5A059] font-mono uppercase">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{v.city}</span>
                    </div>
                    <h3 className="font-serif text-base text-white">{v.name}</h3>
                    <p className="text-[11px] text-white/60 font-light leading-snug">
                      {v.evidence}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(v.link)}
                    className="text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium pt-2 border-t border-white/5"
                  >
                    <span>View venue decor history</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[11px] text-white/50 italic">
              Notice: DreamArt Weddings acts as an independent event designer and contractor. Mention of any venue reflects documented decor production history and does not imply exclusive vendor endorsement.
            </p>
          </div>
        </section>

        {/* Turnkey Decor Services Scope */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium font-mono">
              COMPREHENSIVE CAPABILITIES
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
              Full Spectrum of In-House Production Services
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light mt-2">
              From structural fabrication to delicate tabletop floristry, every element is managed by our dedicated in-house specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreServices.map((svc, idx) => (
              <div
                key={idx}
                className="bg-[#121212] border border-white/10 p-6 rounded-sm hover:border-[#C5A059]/40 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center mb-4 text-xs font-mono">
                  0{idx + 1}
                </div>
                <h3 className="font-serif text-lg text-white font-normal mb-2">
                  {svc.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  {svc.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Regional Geography */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium font-mono">
                REGIONAL DECOR LOGISTICS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Destination Locations Across Azerbaijan
              </h2>
              <p className="text-xs sm:text-sm text-white/70 font-light mt-2">
                Our temperature-controlled transport vehicles and mobile setup teams ensure fresh florals and pristine staging nationwide.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[#121212] border border-white/10 p-6 rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A059] font-mono">
                  <Compass className="w-4 h-4" />
                  <span>Baku & Absheron Coast</span>
                </div>
                <h3 className="font-serif text-lg text-white">Urban Palaces & Caspian Lawns</h3>
                <p className="text-xs text-white/70 font-light leading-relaxed">
                  Home to grand five-star international ballrooms and seaside open lawns suitable for large-scale multi-day Indian celebrations.
                </p>
                <button
                  onClick={() => navigate('/indian-wedding-decor-baku')}
                  className="pt-2 text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <span>Explore Baku decor details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-[#121212] border border-white/10 p-6 rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A059] font-mono">
                  <Compass className="w-4 h-4" />
                  <span>Gabala (Qəbələ)</span>
                </div>
                <h3 className="font-serif text-lg text-white">Mountain Resort Lawns</h3>
                <p className="text-xs text-white/70 font-light leading-relaxed">
                  Stunning Caucasus mountain backdrops, cool forest retreats, and expansive private hotel lawns ideal for open-air Mandaps and daytime Mehndis.
                </p>
                <button
                  onClick={() => navigate('/toy-dekoru/qebele')}
                  className="pt-2 text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <span>Explore Gabala destination setups</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-[#121212] border border-white/10 p-6 rounded-sm space-y-2">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A059] font-mono">
                  <Compass className="w-4 h-4" />
                  <span>Guba & Shamakhi</span>
                </div>
                <h3 className="font-serif text-lg text-white">Highland Estates & Vineyards</h3>
                <p className="text-xs text-white/70 font-light leading-relaxed">
                  Picturesque alpine scenery, rolling vineyard hills, and seclusion for multi-day family weddings with on-site production teams.
                </p>
                <button
                  onClick={() => navigate('/destination-wedding-azerbaijan')}
                  className="pt-2 text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
                >
                  <span>View Azerbaijan destination overview</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive FAQ Section */}
        <section className="py-16 sm:py-24 bg-[#0B0B0B]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium font-mono">
                QUESTIONS & ANSWERS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Frequently Asked Questions
              </h2>
              <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
            </div>

            <div className="space-y-4">
              {allFaqs.map((faq, idx) => (
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

            {/* Bottom Final Commercial CTA */}
            <div className="mt-14 p-8 sm:p-10 bg-[#121212] border border-[#C5A059]/40 text-center rounded-sm space-y-4 shadow-2xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono block">
                COMMERCIAL INQUIRY & ESTIMATES
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Plan Your Indian Wedding Decor in Azerbaijan
              </h3>
              <p className="text-xs sm:text-sm text-white/75 font-light max-w-xl mx-auto leading-relaxed">
                Connect with our senior production team on WhatsApp to discuss your event dates, venue selection, and customized decorative concepts.
              </p>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Plan Your Indian Wedding Decor in Azerbaijan</span>
                </button>
                <button
                  onClick={() => onOpenQuoteModal('Indian Destination Wedding')}
                  className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Request Proposal
                </button>
              </div>

              <p className="text-[11px] text-white/50 pt-2 font-mono">
                Direct WhatsApp: +994 50 231 17 28 • Local Baku Studio
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
