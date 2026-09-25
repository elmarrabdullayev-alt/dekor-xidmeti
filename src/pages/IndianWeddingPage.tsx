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
  HeartHandshake
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
    'Hello, I am planning an Indian wedding in Azerbaijan and would like to discuss decor, venue styling and pricing with DreamArt Weddings.';

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const faqs = [
    {
      question: 'Do you provide Indian wedding decoration in Azerbaijan?',
      answer:
        'Yes. DreamArt Weddings provides custom event decor services across Azerbaijan, including multi-day wedding concepts, stage styling, floral decor, ceremony areas and reception decoration.'
    },
    {
      question: 'Can DreamArt Weddings decorate a 3-day Indian wedding?',
      answer:
        'Yes. We design and manage coordinated yet visually distinct environments across multiple days, including Mehendi, Haldi, Sangeet, traditional ceremony and grand reception events with seamless daily transitions.'
    },
    {
      question: 'Do you provide Mehendi and Sangeet decoration?',
      answer:
        'Yes. We craft colorful, bohemian or traditional setups for Mehendi and Haldi, dynamic stage and lighting backdrops for Sangeet nights, and regal settings for evening parties.'
    },
    {
      question: 'Can you provide wedding decor outside Baku?',
      answer:
        'Yes. Our logistics fleet and professional setup crews manage destination weddings in Gabala, Guba, Shamakhi, and resort locations throughout Azerbaijan.'
    },
    {
      question: 'How can international clients contact DreamArt Weddings?',
      answer:
        'International couples and wedding planners can reach our team via WhatsApp at +994 50 231 17 28 or phone 050 231 17 28 to schedule a virtual consultation and receive an initial decor estimate.'
    },
    {
      question: 'What materials and florals are used in your Mandap and ceremony setups?',
      answer:
        'We combine architectural structures with fresh imported florals (such as Ecuadorian roses, hydrangeas, orchids, and seasonal foliage), custom draped fabrics, and safe candlelight installations.'
    }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Indian Wedding Decoration in Azerbaijan',
      'description':
        'Luxury Indian wedding decoration in Azerbaijan for Mehendi, Sangeet, ceremony and reception events. DreamArt Weddings provides custom multi-day decor across Baku and regions.',
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
      'url': 'https://dreamartweddings.com/indian-wedding-azerbaijan'
    },
    getBreadcrumbSchema([
      { name: 'Home', url: 'https://dreamartweddings.com' },
      {
        name: 'Indian Wedding Decoration in Azerbaijan',
        url: 'https://dreamartweddings.com/indian-wedding-azerbaijan'
      }
    ]),
    getFaqPageSchema(faqs)
  ];

  const multiDayEvents = [
    {
      day: 'Day 1',
      title: 'Mehendi & Haldi Ceremonies',
      theme: 'Vibrant, Warm & Celebratory',
      description:
        'Sun-kissed yellow, orange, and fuchsia palettes with festive marigold touches, draped canopies, low-seating bohemian lounge areas, patterned cushions, and interactive photo backdrops.',
      features: [
        'Color-blocked draped pergolas & gazebos',
        'Comfortable low floor-cushion seating for guests',
        'Fresh flower jewelry display stations',
        'Playful floral swings and greeting photo booths'
      ]
    },
    {
      day: 'Day 2',
      title: 'Sangeet & Musical Night',
      theme: 'High Energy & Cinematic Glamour',
      description:
        'Grand performance stage architecture, integrated ambient stage lighting, LED-compatible floral frames, dramatic entrance tunnels, cocktail lounges, and dance floor perimeters.',
      features: [
        'Wide performance stage with custom backdrop',
        'Warm concert-grade illumination & fairy light ceilings',
        'Cocktail high-tables with glowing floral accents',
        'Signature party lounge vignette with velvet seating'
      ]
    },
    {
      day: 'Day 3',
      title: 'Wedding Ceremony & Mandap',
      theme: 'Sacred Romance & Opulent Grandeur',
      description:
        'A focal 4-pillar Mandap canopy lavishly adorned with imported roses and cascading greens, raised ceremonial stage, aisle runner flanked by brass lanterns, and petal-strewn pathways.',
      features: [
        'Four-pillar custom Mandap structure with rich florals',
        'Aisle walkway bordered by glass hurricanes & pillars',
        'Family and guest seating with coordinated slipcovers',
        'Sacred havan kund setup area with safety provisions'
      ]
    },
    {
      day: 'Gala Night',
      title: 'Grand Reception Dinner',
      theme: 'Imperial Ballroom Luxury',
      description:
        'Spectacular presidential head table for the newlyweds, high-low floral arrangements on guest round tables, Italian crystal candelabras, illuminated entry tunnels, and dramatic chandeliers.',
      features: [
        'Monumental floral backdrop behind the newlyweds',
        'Tall crystal candelabras and lush flower runners',
        'Custom charger plates and personalized stationery styling',
        'Seamless overnight dismantling and venue handover'
      ]
    }
  ];

  const decorServices = [
    {
      title: 'Bespoke Floral Architecture',
      description:
        'Curated fresh flower imports including premium Ecuadorian roses, orchids, hydrangeas, carnations, and local greenery arranged by master florists.'
    },
    {
      title: 'Custom Mandap & Ceremony Canopies',
      description:
        'Sturdy, elegant four-post or circular Mandap pavilions engineered specifically for indoor ballrooms, open lawns, and seaside terraces.'
    },
    {
      title: 'Sangeet Stages & Backdrops',
      description:
        'Wide performance stages with layered 3D textures, acoustic lighting integration, and dynamic backdrops designed for live music and choreographies.'
    },
    {
      title: 'Imperial Tabletop Styling',
      description:
        'High-low floral centerpieces, crystal candelabras, velvet runners, fine glassware, and candlelit pathways customized to your theme.'
    },
    {
      title: 'Immersive Entrance & Photo Zones',
      description:
        'Signature welcome arches, customized signage with couple monograms, floral photo walls, and experiential entrance tunnels.'
    },
    {
      title: 'Multi-Day Logistics & Overnight Turnarounds',
      description:
        'Dedicated crew of florists, technicians, and supervisors managing quick overnight decor transformations between consecutive event days.'
    }
  ];

  const verifiedVenues = [
    {
      name: 'Meridian',
      slug: 'meridian',
      city: 'Baku',
      note: 'DreamArt Weddings has completed decor projects at this venue.'
    },
    {
      name: 'By Meridian',
      slug: 'by-meridian',
      city: 'Baku',
      note: 'DreamArt Weddings has completed decor projects at this venue.'
    },
    {
      name: 'Bağçalı Saray',
      slug: 'bagcali-saray',
      city: 'Baku',
      note: 'DreamArt Weddings has completed decor projects at this venue.'
    },
    {
      name: 'Böyük Saray',
      slug: 'boyuk-saray',
      city: 'Baku',
      note: 'DreamArt Weddings has completed decor projects at this venue.'
    }
  ];

  const destinationRegions = [
    {
      name: 'Baku (Capital City)',
      tagline: 'Cosmopolitan Coastline & Grand Ballrooms',
      description:
        'Ideal for large-scale multi-day celebrations with world-class international hotels, panoramic Caspian sea-view lawns, and state-of-the-art palace banquet venues.'
    },
    {
      name: 'Gabala (Qəbələ)',
      tagline: 'Mountain Valley Splendor & Resort Lawns',
      description:
        'Surrounded by lush emerald Caucasus peaks, cool mountain breezes, luxury forest resorts, and expansive outdoor garden settings perfect for summer ceremonies.'
    },
    {
      name: 'Guba (Quba)',
      tagline: 'Forest Landscapes & Crisp Mountain Air',
      description:
        'Picturesque mountain valleys and secluded highland estates offering privacy, dramatic natural backdrops, and five-star resort infrastructure.'
    },
    {
      name: 'Shamakhi (Şamaxı)',
      tagline: 'Rolling Vineyard Hills & Pastoral Serenity',
      description:
        'Sunlit rolling hills, vineyards, and tranquil countryside venues providing open skies and intimate destination wedding romance.'
    }
  ];

  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return () => unsub();
  }, []);

  const heroImage =
    imageService.getCoverImage('indian-wedding') ||
    imageService.getCoverImage('img-portfolio-4', 'portfolio_lookbook', '/images/dreamart-monumental-toy-sehnesi-dekoru.webp');
  const heroImgs = imageService.getImagesByTarget('indian-wedding');
  const heroAlt = heroImgs[0]?.altText || 'Indian wedding decoration in Azerbaijan';

  return (
    <>
      <SeoHead
        title="Indian Wedding Decoration in Azerbaijan | DreamArt Weddings"
        description="Luxury Indian wedding decoration in Azerbaijan for Mehendi, Sangeet, ceremony and reception events. DreamArt Weddings provides custom multi-day decor across Baku and regions."
        canonicalPath="/indian-wedding-azerbaijan"
        ogImage={heroImage}
        jsonLd={jsonLd}
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[520px] lg:min-h-[580px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src={heroImage}
            alt={heroAlt}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-black/40" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 border border-[#C5A059]/40 bg-[#121212]/80 backdrop-blur-md px-3.5 py-1.5 rounded-sm mb-5 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C378] font-mono">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>DESTINATION WEDDINGS IN AZERBAIJAN</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF8F5] font-normal mb-6 leading-tight max-w-4xl mx-auto">
              Indian Wedding Decoration in Azerbaijan
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light max-w-3xl mx-auto leading-relaxed mb-8">
              DreamArt Weddings provides custom decor and event styling for multi-day Indian weddings in Azerbaijan.
              From vibrant Mehendi and Sangeet celebrations to sacred Mandap ceremonies and opulent gala receptions,
              we deliver bespoke floral architecture, custom stage design, and flawless production across Baku and scenic regions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleWhatsApp}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-sm text-xs font-medium tracking-wider uppercase flex items-center gap-2.5 transition-all shadow-xl cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Plan Your Indian Wedding Decor</span>
              </button>

              <a
                href={`tel:${phoneRaw}`}
                className="bg-white/10 hover:bg-white/15 text-white border border-white/20 px-6 py-3.5 rounded-sm text-xs tracking-wider uppercase flex items-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Call {phoneDisplay}</span>
              </a>
            </div>

            <p className="mt-4 text-[11px] text-white/50 font-light">
              English and Azerbaijani language consultation available • Direct WhatsApp support
            </p>
          </div>
        </section>

        {/* AI & GEO Direct Answer Callout Block */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="bg-[#121212] border border-[#C5A059]/40 rounded-sm p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-medium font-mono">
              <Sparkles className="w-3.5 h-3.5" />
              <span>DIRECT FACTS • DESTINATION EVENT SERVICES</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <h3 className="font-serif text-base text-white font-medium">
                  Do you provide Indian wedding decoration in Azerbaijan?
                </h3>
                <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                  Yes. DreamArt Weddings provides event decor services across Azerbaijan, including multi-day wedding concepts,
                  stage styling, floral decor, ceremony areas and reception decoration.
                </p>
              </div>

              <div className="space-y-1.5">
                <h3 className="font-serif text-base text-white font-medium">
                  Can DreamArt Weddings decorate a 3-day Indian wedding?
                </h3>
                <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                  Yes. We design and coordinate distinct visual concepts for Mehendi, Haldi, Sangeet, Mandap rituals, and
                  gala receptions with smooth turnaround between event days.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-white/70">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>Service Area: Baku, Gabala, Guba, Shamakhi, and nationwide</span>
              </div>
              <div className="flex items-center gap-2 text-[#E5C378] font-mono">
                <span>Official Contact: +994 50 231 17 28</span>
              </div>
            </div>
          </div>
        </section>

        {/* Multi-Day Wedding Positioning */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              CELEBRATION TIMELINE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal mb-4">
              Multi-Day Wedding Decoration Structure
            </h2>
            <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
              Indian weddings frequently span multiple festive days, each calling for an individual visual identity,
              distinct color palette, and tailored spatial arrangement. Below is a sample framework illustrating how
              DreamArt Weddings transforms celebration spaces across consecutive days:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {multiDayEvents.map((evt, idx) => (
              <div
                key={idx}
                className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/40 p-6 sm:p-8 rounded-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs uppercase tracking-wider text-[#C5A059] bg-[#181818] px-2.5 py-1 rounded-xs border border-white/5">
                      {evt.day}
                    </span>
                    <span className="text-[11px] text-white/50 font-light italic">{evt.theme}</span>
                  </div>

                  <h3 className="font-serif text-xl sm:text-2xl text-white font-normal mb-3">
                    {evt.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed mb-6">
                    {evt.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <span className="text-[10px] uppercase tracking-wider text-white/50 font-mono block">
                    Core Design Elements:
                  </span>
                  <ul className="space-y-1.5">
                    {evt.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-white/80 font-light">
                        <Check className="w-3.5 h-3.5 text-[#C5A059] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-5 bg-[#141414] border border-white/10 rounded-sm text-xs sm:text-sm text-white/70 font-light flex items-center gap-3">
            <HeartHandshake className="w-5 h-5 text-[#C5A059] shrink-0" />
            <span>
              <strong>Flexible Concept Planning:</strong> Every Indian wedding is custom. We adapt fully to your family’s traditions,
              event duration, and venue requirements, whether you need a two-day weekend package or an elaborate multi-day affair.
            </span>
          </div>
        </section>

        {/* Premium Decor Services Scope */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                WHAT WE PROVIDE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Comprehensive Destination Decor Services
              </h2>
              <p className="text-xs sm:text-sm text-white/70 font-light mt-2">
                All design and production elements are executed by DreamArt Weddings in-house florists, carpenters, and technicians.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {decorServices.map((svc, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] border border-white/10 p-6 rounded-sm hover:border-[#C5A059]/40 transition-colors"
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
          </div>
        </section>

        {/* Destination Regions in Azerbaijan */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              DESTINATION GEOGRAPHY
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
              Azerbaijan Wedding Destinations We Serve
            </h2>
            <p className="text-xs sm:text-sm text-white/70 font-light mt-2">
              From the vibrant capital of Baku to majestic mountain resorts, our production logistics cover all prime wedding destinations.
            </p>
            <div className="mt-4">
              <button
                onClick={() => navigate('/destination-wedding-azerbaijan')}
                className="text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1.5 cursor-pointer font-medium"
              >
                <span>Explore all Azerbaijan Destination Wedding options & Gabala resorts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {destinationRegions.map((reg, idx) => (
              <div
                key={idx}
                className="bg-[#121212] border border-white/10 p-6 sm:p-7 rounded-sm space-y-2 hover:border-[#C5A059]/30 transition-colors"
              >
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#C5A059] font-mono">
                  <Compass className="w-4 h-4" />
                  <span>{reg.name}</span>
                </div>
                <h3 className="font-serif text-lg text-white font-medium">
                  {reg.tagline}
                </h3>
                <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                  {reg.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Venue Connections */}
        <section className="py-16 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-1 font-medium font-mono">
                  VENUE CONNECTIONS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  Established Venue Experience
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

            <p className="text-xs sm:text-sm text-white/70 font-light mb-6 max-w-3xl">
              While destination weddings take place at private estates, resorts, and five-star hotels across the country,
              DreamArt Weddings has extensive decor and logistical experience across Baku’s prominent event venues:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {verifiedVenues.map((v, i) => (
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
                      {v.note}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/restoranlar/${v.slug}`)}
                    className="text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium pt-2 border-t border-white/5"
                  >
                    <span>Explore venue decor</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Visual Inspiration vs Real Portfolio Note */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="bg-[#121212] border border-white/10 p-8 rounded-sm flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono font-medium block">
                PORTFOLIO & TRANSPARENCY
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Explore Our Real Completed Event Work
              </h2>
              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                DreamArt Weddings values authenticity. We invite you to view our verified Azerbaijani portfolio of grand ballroom
                floral installations, monumental altar stages, and table styling to assess our craftsmanship, flower quality, and scale.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => navigate('/portfolio')}
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 py-3 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
              >
                View Real Portfolio
              </button>
              <button
                onClick={() => navigate('/toy-dekoru')}
                className="bg-[#181818] hover:bg-[#202020] text-white border border-white/20 px-6 py-3 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
              >
                Wedding Decor
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 sm:py-24 bg-[#0E0E0E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
                FREQUENTLY ASKED QUESTIONS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Indian Wedding Planning in Azerbaijan
              </h2>
              <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
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

            {/* Bottom Final CTA */}
            <div className="mt-14 p-8 bg-[#121212] border border-[#C5A059]/40 text-center rounded-sm space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono block">
                GET IN TOUCH WITH OUR WEDDING STYLISTS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Ready to Design Your Destination Wedding?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl mx-auto leading-relaxed">
                Connect with our production managers directly on WhatsApp to share your dates, guest count, and visual vision.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: +994 50 231 17 28</span>
                </button>
                <button
                  onClick={() => onOpenQuoteModal('Indian Destination Wedding')}
                  className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Request Proposal
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
