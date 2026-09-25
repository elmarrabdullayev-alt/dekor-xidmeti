import React, { useState, useEffect } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { getBreadcrumbSchema, getFaqPageSchema } from '../lib/structuredData';
import { imageService } from '../lib/imageService';
import {
  Sparkles,
  MapPin,
  Calendar,
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
  Sun,
  Trees,
  Gem
} from 'lucide-react';

interface DestinationWeddingPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (eventName?: string) => void;
}

export const DestinationWeddingPage: React.FC<DestinationWeddingPageProps> = ({
  navigate,
  onOpenQuoteModal
}) => {
  const phoneDisplay = '050 231 17 28';
  const phoneRaw = '+994502311728';
  const whatsappNumber = '994502311728';

  const whatsappMessage =
    'Hello DreamArt Weddings, I am planning a luxury destination wedding in Azerbaijan and would like to consult on decor concepts, floral installations, and regional logistics.';

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const faqs = [
    {
      question: 'Why choose Azerbaijan for a destination wedding?',
      answer:
        'Azerbaijan offers a unique convergence of Eastern hospitality and European architectural elegance. With world-class 5-star hotels in Baku, scenic Caucasus mountain resorts in Gabala and Guba, favorable climate, simplified e-visas, and exceptional culinary traditions, Azerbaijan has become one of Eurasia’s premier destination wedding hubs.'
    },
    {
      question: 'Can DreamArt Weddings handle destination decor outside of Baku?',
      answer:
        'Absolutely. DreamArt Weddings manages full-scale logistics across Azerbaijan, including Gabala, Guba, Shamakhi, Lankaran, and Sheki. We operate climate-controlled transport vehicles to ensure fresh florals and bespoke architectural structures arrive in pristine condition.'
    },
    {
      question: 'How do you coordinate with international couples and wedding planners?',
      answer:
        'We work seamlessly with couples, international destination wedding planners, and hospitality concierges worldwide. Our workflow includes virtual 3D floorplans, moodboards, scheduled video consultations via Zoom or WhatsApp, and detailed itemized transparent proposals.'
    },
    {
      question: 'Do you design multi-day and cross-cultural weddings such as Indian weddings?',
      answer:
        'Yes. We specialize in multi-day celebrations including Indian destination weddings with distinct themes for Mehendi, Haldi, Sangeet, Mandap ceremonies, and gala receptions, as well as European, Middle Eastern, and Caucasian cultural fusions.'
    },
    {
      question: 'What is the recommended timeline to book destination wedding decor in Azerbaijan?',
      answer:
        'For peak wedding seasons (May through October), we recommend securing your date 4 to 9 months in advance. However, our modular in-house production and floral sourcing capabilities allow us to accommodate shorter lead times whenever venue dates permit.'
    },
    {
      question: 'What services are included in your destination wedding package?',
      answer:
        'Our turnkey decor services include ceremony altars and arches, floral styling with imported blossoms, bespoke guest table settings, crystal candelabras, customized stage architecture, atmospheric fairy lighting, personalized signage, dance floors, and full overnight setup and breakdown.'
    }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Destination Wedding Decoration in Azerbaijan',
      'description':
        'Luxury destination wedding decor and production in Azerbaijan. Bespoke wedding styling in Baku, Gabala, Guba, and Shamakhi with fresh floral architecture, ceremony altars, and multi-day celebrations.',
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
      'serviceType': 'Destination Wedding Decor and Production',
      'url': 'https://dreamartweddings.com/destination-wedding-azerbaijan'
    },
    getBreadcrumbSchema([
      { name: 'Home', url: 'https://dreamartweddings.com' },
      {
        name: 'Destination Wedding in Azerbaijan',
        url: 'https://dreamartweddings.com/destination-wedding-azerbaijan'
      }
    ]),
    getFaqPageSchema(faqs)
  ];

  const destinationHighlights = [
    {
      icon: Gem,
      title: 'Bespoke Floral Architecture',
      description:
        'Premium Ecuadorian long-stem roses, delicate Dutch hydrangeas, cascading orchids, and lush seasonal greenery tailored to your wedding aesthetic.'
    },
    {
      icon: Compass,
      title: 'Comprehensive Regional Logistics',
      description:
        'Dedicated logistics fleet and setup crews capable of transforming mountain estates, seaside terraces, and grand ballrooms anywhere in Azerbaijan.'
    },
    {
      icon: Layers,
      title: 'Multi-Day Transitions',
      description:
        'Seamless overnight resets for multi-day itineraries, ensuring every celebration day presents a fresh visual atmosphere.'
    },
    {
      icon: HeartHandshake,
      title: 'International Planner Collaboration',
      description:
        'Flawless coordination with global wedding planners, agencies, and luxury hotel concierges across different time zones.'
    }
  ];

  const verifiedVenues = [
    {
      name: 'Meridian',
      slug: 'meridian',
      city: 'Baku',
      note: 'Panoramic celebrations along the Caspian shoreline with opulent interior architecture.'
    },
    {
      name: 'By Meridian',
      slug: 'by-meridian',
      city: 'Baku',
      note: 'Contemporary luxury event space with flexible layout options for destination ceremonies.'
    },
    {
      name: 'Bağçalı Saray',
      slug: 'bagcali-saray',
      city: 'Baku',
      note: 'Spacious palace atmosphere blending garden aesthetics with majestic ballroom high ceilings.'
    },
    {
      name: 'Böyük Saray',
      slug: 'boyuk-saray',
      city: 'Baku',
      note: 'Monumental ballroom venue renowned for high-capacity royal celebrations and banquets.'
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
    imageService.getCoverImage('destination-wedding') ||
    imageService.getCoverImage('img-portfolio-4', 'portfolio_lookbook', '/images/dreamart-monumental-toy-sehnesi-dekoru.webp');
  const heroImgs = imageService.getImagesByTarget('destination-wedding');
  const heroAlt = heroImgs[0]?.altText || 'Luxury Destination Wedding Decor in Azerbaijan';

  const gabalaFeatureImage =
    imageService.getCoverImage('qebele-wedding') ||
    imageService.getCoverImage('img-portfolio-9', 'portfolio_lookbook', '/images/dreamart-tebii-budag-agac-kompozisiyasi.webp');
  const gabalaImgs = imageService.getImagesByTarget('qebele-wedding');
  const gabalaAlt = gabalaImgs[0]?.altText || 'Gabala Outdoor Mountain Wedding Decor Setup';

  return (
    <>
      <SeoHead
        title="Destination Wedding in Azerbaijan | Luxury Decor by DreamArt Weddings"
        description="Bespoke destination wedding decoration and styling in Azerbaijan. From Baku Caspian coastal venues to Gabala mountain resorts and multi-day celebrations."
        canonicalPath="/destination-wedding-azerbaijan"
        ogImage={heroImage}
        jsonLd={jsonLd}
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen">
        {/* Hero Section */}
        <section className="relative min-h-[540px] lg:min-h-[620px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src={heroImage}
            alt={heroAlt}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/75 to-transparent" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-20">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#C5A059]/40 bg-[#141414]/90 backdrop-blur-md mb-6 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#E5C378] font-mono font-medium">
                LUXURY DESTINATION WEDDINGS • AZERBAIJAN
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.15] mb-6">
              Enchanting Destination Weddings <br className="hidden sm:block" />
              <span className="italic text-[#E5C378]">in Azerbaijan</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-3xl mx-auto font-light leading-relaxed mb-8">
              From majestic seaside ballrooms in Baku to verdant mountain resorts in Gabala and Guba, DreamArt Weddings crafts bespoke floral architecture, monumental altars, and transcendent event environments for couples worldwide.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleWhatsApp}
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: {phoneDisplay}</span>
              </button>

              <button
                onClick={() => onOpenQuoteModal('Destination Wedding in Azerbaijan')}
                className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
              >
                Request Proposal
              </button>

              <button
                onClick={() => navigate('/portfolio')}
                className="w-full sm:w-auto bg-[#161616] hover:bg-[#222222] text-white border border-white/20 px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
              >
                View Lookbook
              </button>
            </div>
          </div>
        </section>

        {/* Quick Highlights Grid */}
        <section className="py-16 sm:py-20 border-b border-white/10 bg-[#0E0E0E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14 max-w-3xl mx-auto">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                WORLD-CLASS EVENT PRODUCTION
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
                Why Couples Choose DreamArt Weddings
              </h2>
              <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {destinationHighlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-[#141414] border border-white/10 p-6 rounded-sm hover:border-[#C5A059]/40 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="w-10 h-10 rounded-sm bg-[#1C1A14] border border-[#C5A059]/30 flex items-center justify-center text-[#E5C378] mb-4">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <h3 className="font-serif text-lg text-white mb-2 font-normal">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Dedicated Gabala Destination Wedding Section */}
        <section id="gabala-section" className="py-20 bg-[#0B0B0B] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/30 bg-[#161616]">
                  <Trees className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#C5A059] font-mono">
                    MOUNTAIN RETREAT WEDDINGS
                  </span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-normal leading-tight">
                  Gabala (Qəbələ): <br />
                  <span className="italic text-[#E5C378]">Mountain Luxury & Forest Romance</span>
                </h2>

                <p className="text-xs sm:text-sm md:text-base text-white/80 font-light leading-relaxed">
                  Surrounded by emerald Caucasus mountain peaks and serene alpine lakes, Gabala offers an unforgettable open-air canvas for destination celebrations. DreamArt Weddings provides custom wedding decor and event styling for projects in Qəbələ, including destination wedding concepts, outdoor ceremony areas, reception styling, and regional installation.
                </p>

                <div className="space-y-3 pt-2">
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-white/75 font-light">
                      <strong className="text-white font-medium">Bespoke Outdoor Altars:</strong> Panoramic ceremony backdrops framed with fresh imported blooms, glass pillars, and mountain vistas.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-white/75 font-light">
                      <strong className="text-white font-medium">Climate-Controlled Logistics:</strong> Specialized temperature-monitored fleet transporting delicate florals directly from Baku to Gabala venues.
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#C5A059] mt-0.5 shrink-0" />
                    <p className="text-xs sm:text-sm text-white/75 font-light">
                      <strong className="text-white font-medium">Evening Mountain Illumination:</strong> Ambient fairy lighting ceilings, safe candlelit aisle walkways, and warm chandelier arrays.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    onClick={() => navigate('/toy-dekoru/qebele')}
                    className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 py-3 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <span>Destination wedding decor in Qəbələ</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleWhatsApp}
                    className="bg-[#181818] hover:bg-[#222222] text-white border border-white/20 px-6 py-3 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    <span>Inquire About Gabala Dates</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6 relative">
                <div className="relative rounded-sm overflow-hidden border border-white/10 shadow-2xl">
                  <img
                    src={gabalaFeatureImage}
                    alt={gabalaAlt}
                    loading="lazy"
                    className="w-full h-[400px] sm:h-[480px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <span className="text-[10px] font-mono tracking-widest text-[#E5C378] uppercase block mb-1">
                      REAL PROJECT COMPOSITION
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                      Natural Botanical Mountain Scenography
                    </h3>
                    <p className="text-xs text-white/70 mt-1 font-light">
                      Harmonious natural elements engineered for open-air resort celebrations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dedicated Indian Wedding Connection Section */}
        <section id="indian-wedding-connection" className="py-20 bg-[#121212] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#161616] border border-[#C5A059]/40 p-8 sm:p-12 rounded-sm">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-8 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#C5A059]/40 bg-[#1C1A14]">
                    <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#E5C378] font-mono font-medium">
                      CROSS-CULTURAL EXCELLENCE
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
                    Planning an Indian Wedding in Azerbaijan?
                  </h2>

                  <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed max-w-3xl">
                    Azerbaijan has emerged as one of the world’s most sought-after settings for grand Indian destination weddings. DreamArt Weddings offers dedicated multi-day production for Mehendi, Haldi, Sangeet musical nights, sacred Mandap ceremonies, and imperial gala dinners.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="flex items-center gap-2 text-xs text-white/75">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                      <span>Custom 4-Pillar Mandap Architecture</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/75">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                      <span>Color-Blocked Mehendi Lounges</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/75">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                      <span>High-Energy Sangeet Concert Stages</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/75">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                      <span>Overnight Set Turnarounds & Logistics</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col gap-3 justify-center items-start lg:items-end">
                  <button
                    onClick={() => navigate('/indian-wedding-azerbaijan')}
                    className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-6 py-3.5 rounded-sm text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>View Indian Wedding Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleWhatsApp}
                    className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Consultation</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Destination Regions Overview */}
        <section className="py-20 bg-[#0B0B0B] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-2 font-medium">
                GEOGRAPHIC DIVERSITY
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl text-white font-normal">
                Premier Destination Regions in Azerbaijan
              </h2>
              <div className="w-12 h-px bg-[#C5A059]/40 mx-auto mt-4" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-[#141414] border border-white/10 p-6 rounded-sm flex flex-col justify-between hover:border-[#C5A059]/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#C5A059] font-mono mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>CAPITAL CITY</span>
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">Baku & Caspian Coast</h3>
                  <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
                    World-class international 5-star hotels, seaside terraces, and palatial grand banquet halls.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/toy-dekoru/baki')}
                  className="text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium pt-3 border-t border-white/5"
                >
                  <span>Baku Wedding Decor</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-[#141414] border border-white/10 p-6 rounded-sm flex flex-col justify-between hover:border-[#C5A059]/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#C5A059] font-mono mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>ALPINE RETREAT</span>
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">Gabala (Qəbələ)</h3>
                  <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
                    Mountain forests, crystal lakes, and premier luxury resort lawns for open-air romance.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/toy-dekoru/qebele')}
                  className="text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium pt-3 border-t border-white/5"
                >
                  <span>Gabala Wedding Decor</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-[#141414] border border-white/10 p-6 rounded-sm flex flex-col justify-between hover:border-[#C5A059]/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#C5A059] font-mono mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>FOREST HIGHLANDS</span>
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">Guba & Shahdag</h3>
                  <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
                    Dramatic mountain peaks, crisp alpine breezes, and exclusive secluded highland chalets.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/toy-dekoru')}
                  className="text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium pt-3 border-t border-white/5"
                >
                  <span>Explore Decors</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-[#141414] border border-white/10 p-6 rounded-sm flex flex-col justify-between hover:border-[#C5A059]/40 transition-colors">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#C5A059] font-mono mb-2">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>VINEYARD HILLS</span>
                  </div>
                  <h3 className="font-serif text-xl text-white mb-2">Shamakhi (Şamaxı)</h3>
                  <p className="text-xs text-white/70 font-light leading-relaxed mb-4">
                    Rolling pastoral hills, romantic vineyard estates, and tranquil countryside settings.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/portfolio')}
                  className="text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium pt-3 border-t border-white/5"
                >
                  <span>View Lookbook</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Verified Venues with Internal Links */}
        <section className="py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono font-medium block mb-1">
                  ESTABLISHED PARTNERSHIPS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  Prominent Venues in Azerbaijan
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

            <p className="text-xs sm:text-sm text-white/70 font-light mb-8 max-w-3xl">
              While destination weddings occur across private villas, luxury mountain resorts, and seaside hotels, DreamArt Weddings holds proven decor and logistical track records at prominent Azerbaijani venues:
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

        {/* Real Portfolio Callout */}
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
                DreamArt Weddings values authentic craftsmanship. We invite you to view our verified Azerbaijani portfolio of grand ballroom floral installations, monumental altar stages, and table styling to assess our flower quality and scale.
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
                Destination Weddings in Azerbaijan
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

            {/* Bottom Final WhatsApp CTA Card */}
            <div className="mt-14 p-8 bg-[#121212] border border-[#C5A059]/40 text-center rounded-sm space-y-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono block">
                GET IN TOUCH WITH OUR PRODUCTION TEAM
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Ready to Design Your Destination Wedding?
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light max-w-xl mx-auto leading-relaxed">
                Connect with our production managers directly on WhatsApp to discuss your event dates, guest count, and visual vision.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp: {phoneDisplay}</span>
                </button>
                <button
                  onClick={() => onOpenQuoteModal('Destination Wedding in Azerbaijan')}
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
