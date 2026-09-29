import React from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { getBreadcrumbSchema, getFaqPageSchema } from '../lib/structuredData';
import {
  Sparkles,
  MapPin,
  Building2,
  ArrowRight,
  MessageCircle,
  Phone,
  Check,
  Flame,
  Flower2,
  Compass,
  HelpCircle,
  Briefcase,
  ShieldCheck
} from 'lucide-react';

interface MandapDecorationAzerbaijanPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (eventName?: string) => void;
}

export const MandapDecorationAzerbaijanPage: React.FC<MandapDecorationAzerbaijanPageProps> = ({
  navigate,
  onOpenQuoteModal
}) => {
  const phoneDisplay = '050 231 17 28';
  const phoneRaw = '+994502311728';
  const whatsappNumber = '994502311728';

  const whatsappMessage =
    'Hello DreamArt Weddings. We are planning an Indian wedding ceremony in Azerbaijan and would like to discuss custom Mandap design and floral decor.';

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directAnswers = [
    {
      question: 'Can DreamArt Weddings design a custom Mandap in Azerbaijan?',
      answer:
        'Yes. DreamArt Weddings engineers and constructs custom four-pillar and circular dome Mandaps tailored for indoor luxury ballrooms, open-air seaside terraces, or mountain resort lawns across Azerbaijan. We adorn structures with fresh imported florals, custom fabrics, and ceremonial staging.'
    },
    {
      question: 'What materials and florals are used in your Mandap setups?',
      answer:
        'Our Mandap structures are built from reinforced steel or timber frameworks with fireproof coatings. We dress pavilions with fresh imported Ecuadorian roses, Dutch hydrangeas, orchids, and lush seasonal greenery, complemented by custom pleated silks, brass lanterns, and glass hurricanes.'
    },
    {
      question: 'How do you handle fire safety for the sacred havan kund in Azerbaijan?',
      answer:
        'We work strictly in compliance with venue safety standards. Our team installs non-combustible protective heat-resistant floor plates, fire-retardant mats under carpeting, and maintains discreet on-site fire extinguishing equipment during the sacred ceremony.'
    },
    {
      question: 'Can you install outdoor Mandaps in Gabala or seaside Baku?',
      answer:
        'Yes. For open-air venues on the Absheron coast or mountain resort lawns in Gabala, we engineer weighted internal ballasts to ensure wind stability, use specialized floral hydration foam, and protect the structure against sudden climate shifts.'
    }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Mandap Decoration in Azerbaijan',
      'description':
        'Custom Mandap decoration and ceremonial pavilion design in Azerbaijan by DreamArt Weddings. Specializing in 4-pillar and circular floral Mandaps, sacred aisle styling, and fire-safe ceremony staging.',
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
          'DreamArt Weddings is an Azerbaijan-based event decoration company providing custom wedding and event decor in Baku and other regions of Azerbaijan.'
      },
      'areaServed': [
        { '@type': 'Country', 'name': 'Azerbaijan' },
        { '@type': 'City', 'name': 'Baku' },
        { '@type': 'City', 'name': 'Gabala' }
      ],
      'serviceType': 'Mandap Decoration & Ceremonial Staging',
      'url': 'https://dreamartweddings.com/mandap-decoration-azerbaijan'
    },
    getBreadcrumbSchema([
      { name: 'Home', url: 'https://dreamartweddings.com' },
      {
        name: 'Indian Wedding Decoration in Azerbaijan',
        url: 'https://dreamartweddings.com/indian-wedding-azerbaijan'
      },
      {
        name: 'Mandap Decoration in Azerbaijan',
        url: 'https://dreamartweddings.com/mandap-decoration-azerbaijan'
      }
    ]),
    getFaqPageSchema(directAnswers)
  ];

  const mandapCapabilities = [
    {
      title: 'Four-Pillar Architectural Mandaps',
      description:
        'Sturdy freestanding rectangular pavilions built with gold, ivory, or carved floral pillars engineered for indoor ballrooms and lawn settings.'
    },
    {
      title: 'Circular & Dome Floral Canopies',
      description:
        'Grand 360-degree round ceremonial domes featuring dense floral coronets, suspended crystal chandeliers, and cascading rose runners.'
    },
    {
      title: 'Extended Ceremonial Aisle (Walkway)',
      description:
        'Custom-built raised or carpeted ceremony aisles flanked by mirror pedestals, brass lamps, glass hurricane candleholders, and fresh rose petals.'
    },
    {
      title: 'Fire-Safe Havan Kund Staging',
      description:
        'Engineered platforms with non-combustible underlying layers, heat shields, and discreet fire-prevention measures compliant with luxury hotel standards.'
    },
    {
      title: 'Coordinated Family Seating & Chairs',
      description:
        'Chairs with custom-tailored slipcovers, velvet ties, and floral posies for immediate family inside the Mandap perimeter and guests.'
    },
    {
      title: 'Seaside & Lawn Weatherproof Engineering',
      description:
        'Discrete high-mass internal ballasts ensuring total structural integrity during breezy coastal Caspian or Gabala mountain lawn ceremonies.'
    }
  ];

  return (
    <>
      <SeoHead
        title="Mandap Decoration in Azerbaijan | Bespoke Sacred Pavilions | DreamArt Weddings"
        description="Bespoke Mandap decoration in Azerbaijan by DreamArt Weddings. Custom four-pillar floral pavilions, circular domes, sacred ceremony aisles, and fire-safe staging."
        canonicalPath="/mandap-decoration-azerbaijan"
        ogImage="/images/dreamart-toy-dekoru-qizili-altar.webp"
        jsonLd={jsonLd}
        lang="en"
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen">
        {/* Breadcrumb Header */}
        <div className="bg-[#121212] border-b border-white/10 py-3 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-white/60">
            <button onClick={() => navigate('/')} className="hover:text-white cursor-pointer">
              Home
            </button>
            <span>/</span>
            <button
              onClick={() => navigate('/indian-wedding-azerbaijan')}
              className="hover:text-white cursor-pointer text-[#E5C378]"
            >
              Indian Wedding Azerbaijan
            </button>
            <span>/</span>
            <span className="text-white/90">Mandap Decoration Azerbaijan</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[480px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src="/images/dreamart-toy-dekoru-qizili-altar.webp"
            alt="Custom Mandap and ceremonial altar decoration in Azerbaijan by DreamArt Weddings"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-black/50" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 border border-[#C5A059]/40 bg-[#121212]/85 px-3.5 py-1.5 rounded-sm mb-5 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C378] font-mono">
              <Flame className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>SACRED CEREMONIAL PAVILION DESIGN</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF8F5] font-normal mb-6 leading-tight">
              Mandap Decoration in Azerbaijan
            </h1>

            {/* Core Entity Statement */}
            <div className="p-4 sm:p-5 bg-black/60 border border-[#C5A059]/30 rounded-sm max-w-3xl mx-auto mb-6 backdrop-blur-sm text-left sm:text-center">
              <p className="text-xs sm:text-sm text-white/95 font-light leading-relaxed">
                <strong className="text-[#E5C378] font-medium">DreamArt Weddings</strong> is an Azerbaijan-based event decoration company providing custom wedding and event decor in Baku and other regions of Azerbaijan. We specialize in engineering and styling bespoke Mandap pavilions for traditional and contemporary Indian destination weddings.
              </p>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light max-w-2xl mx-auto leading-relaxed mb-8">
              From freestanding four-pillar architectural pavilions to circular floral domes and sea-view lawn canopies, we bring sacred romance to life with fresh imported blooms, graceful drapery, petal-strewn aisles, and certified fire-safe ceremonial staging.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleWhatsApp}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-7 py-3.5 rounded-sm text-xs font-medium tracking-wider uppercase flex items-center gap-2.5 transition-all shadow-xl cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Plan Your Indian Wedding Decor in Azerbaijan</span>
              </button>

              <button
                onClick={() => onOpenQuoteModal('Mandap Decoration Azerbaijan')}
                className="bg-[#C5A059] hover:bg-[#D4AF37] text-black px-7 py-3.5 rounded-sm text-xs font-medium tracking-wider uppercase transition-colors cursor-pointer"
              >
                Request Proposal
              </button>
            </div>
          </div>
        </section>

        {/* AI & GEO Direct Answers Block */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono font-medium mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>DIRECT FACTS • MANDAP ARCHITECTURE</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Direct Answers: Mandap Decoration in Azerbaijan
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {directAnswers.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#121212] border border-[#C5A059]/30 p-6 rounded-sm shadow-xl flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-base text-white font-medium mb-2 flex items-start gap-2">
                    <span className="text-[#C5A059] font-mono text-xs mt-1 shrink-0">Q{idx + 1}.</span>
                    <span>{item.question}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed pl-5">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Mandap Engineering Capabilities */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-mono">
                ENGINEERING & FLORISTRY
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Bespoke Mandap Staging & Structural Features
              </h2>
              <p className="text-xs sm:text-sm text-white/70 font-light mt-2">
                Designed to harmonize with ballroom architecture or open landscapes, with complete technical safety.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mandapCapabilities.map((svc, idx) => (
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

        {/* Section: For Indian Wedding Planners (Mandap Specifics) */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="bg-[#121212] border border-[#C5A059]/40 p-8 sm:p-10 rounded-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono mb-2">
                <Briefcase className="w-4 h-4" />
                <span>PLANNER PRODUCTION COLLABORATION</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
                For Wedding Planners Sourcing Mandap Fabrication in Azerbaijan
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                Rather than shipping bulky Mandap structures overseas, international planners work with DreamArt Weddings to construct bespoke pavilions in Baku. We provide detailed structural schematics, floral density calculations, and load-in timelines.
              </p>
            </div>

            <div className="p-4 bg-black/40 rounded border border-white/10 text-xs text-white/70 font-light mb-6">
              <strong className="text-white">Our Specific Scope:</strong> We build the Mandap, install all floral arrangements, arrange ceremonial furniture, and safeguard the havan platform. We do not provide priest services, flight bookings, or hotel rooms.
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleWhatsApp}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-sm text-xs font-medium tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Inquire About Custom Mandap Specs</span>
              </button>
              <button
                onClick={() => navigate('/indian-wedding-azerbaijan')}
                className="bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-sm text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                View Full Multi-Day Decor Options
              </button>
            </div>
          </div>
        </section>

        {/* Real Production Work Showcase */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-mono">
                REAL EVIDENCE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Real DreamArt Ceremonial Altar Craftsmanship
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-[#141414] border border-white/10 rounded-sm overflow-hidden">
                <img
                  src="/images/dreamart-toy-dekoru-qizili-altar.webp"
                  alt="Real DreamArt golden ceremonial altar and floral craftsmanship"
                  className="w-full aspect-[16/10] object-cover"
                  loading="lazy"
                />
                <div className="p-4 space-y-1">
                  <span className="text-[10px] text-[#C5A059] font-mono uppercase">Ceremonial Pavilions</span>
                  <h4 className="font-serif text-base text-white">Golden Altar & Floral Arch Structure</h4>
                  <p className="text-xs text-white/70 font-light">Real DreamArt setup displaying custom gilded metal arches, dense floral clusters, and candle styling.</p>
                </div>
              </div>

              <div className="bg-[#141414] border border-white/10 rounded-sm overflow-hidden">
                <img
                  src="/images/dreamart-bey-gelin-masasi-cicek-tagi.webp"
                  alt="Real DreamArt floral arch and ceremonial seating production"
                  className="w-full aspect-[16/10] object-cover"
                  loading="lazy"
                />
                <div className="p-4 space-y-1">
                  <span className="text-[10px] text-[#C5A059] font-mono uppercase">Floral Arch Architecture</span>
                  <h4 className="font-serif text-base text-white">Ceremonial Floral Arch Artistry</h4>
                  <p className="text-xs text-white/70 font-light">Real DreamArt production highlighting lush white rose arrangements and balanced framing.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Commercial CTA */}
        <section className="py-16 sm:py-20 bg-[#0B0B0B]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-10 bg-[#121212] border border-[#C5A059]/40 rounded-sm space-y-4 shadow-2xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono block">
                MANDAP DECOR INQUIRY
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Plan Your Indian Wedding Decor in Azerbaijan
              </h3>
              <p className="text-xs sm:text-sm text-white/75 font-light max-w-xl mx-auto leading-relaxed">
                Connect with our senior architectural florists on WhatsApp to discuss your Mandap dimensions, color theme, and floral preferences.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={handleWhatsApp}
                  className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba59] text-white px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Plan Your Indian Wedding Decor in Azerbaijan</span>
                </button>
                <button
                  onClick={() => onOpenQuoteModal('Mandap Decoration Azerbaijan')}
                  className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-black px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Request Proposal
                </button>
              </div>

              <p className="text-[11px] text-white/50 pt-2 font-mono">
                Direct WhatsApp: +994 50 231 17 28 • Local Production in Baku & Nationwide
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
