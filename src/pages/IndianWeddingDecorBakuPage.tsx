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
  Compass,
  Layers,
  HeartHandshake,
  Flower2,
  Palette,
  Music,
  Flame,
  HelpCircle,
  ShieldCheck,
  Briefcase
} from 'lucide-react';

interface IndianWeddingDecorBakuPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (eventName?: string) => void;
}

export const IndianWeddingDecorBakuPage: React.FC<IndianWeddingDecorBakuPageProps> = ({
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
      question: 'Do you provide Indian wedding decoration in Baku?',
      answer:
        'Yes. DreamArt Weddings is an Azerbaijan-based event decoration company headquartered in Baku, providing custom Indian wedding decoration across Baku’s luxury five-star hotel ballrooms, Caspian seaside estates, and palace banquet venues. We produce turnkey multi-day styling including Mandaps, Mehndi setups, Sangeet stages, and gala receptions.'
    },
    {
      question: 'Can you work inside major five-star hotels and palace venues in Baku?',
      answer:
        'Yes. Our team has extensive experience working within Baku’s leading hotel ballrooms and private event halls. We adhere strictly to hotel engineering requirements, loading dock schedules, floor protection standards, and fire-safety protocols.'
    },
    {
      question: 'How do you handle coastal wind conditions for outdoor Indian weddings in Baku?',
      answer:
        'Baku is historically known as the City of Winds. For outdoor coastal terraces and Absheron lawn events, we engineer weighted internal steel ballasts for Mandap structures, use wind-resistant floral netting techniques, and secure canopy drapery with discrete structural anchors.'
    },
    {
      question: 'Can DreamArt Weddings handle quick overnight turnarounds in Baku venues?',
      answer:
        'Yes. With our central fabrication studio and dedicated warehouse located in Baku, our local crews manage rapid overnight room transitions between consecutive multi-day events such as an evening Sangeet transformed into a morning Mandap ceremony or evening gala Reception.'
    }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Indian Wedding Decoration in Baku',
      'description':
        'Bespoke Indian wedding decoration in Baku, Azerbaijan by DreamArt Weddings. Specializing in luxury ballroom transformations, Mandap setups, Mehndi lounges, Sangeet stages, and Caspian coastal celebrations.',
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
      'areaServed': {
        '@type': 'City',
        'name': 'Baku'
      },
      'serviceType': 'Indian Destination Wedding Decor in Baku',
      'url': 'https://dreamartweddings.com/indian-wedding-decor-baku'
    },
    getBreadcrumbSchema([
      { name: 'Home', url: 'https://dreamartweddings.com' },
      {
        name: 'Indian Wedding Decoration in Azerbaijan',
        url: 'https://dreamartweddings.com/indian-wedding-azerbaijan'
      },
      {
        name: 'Indian Wedding Decor in Baku',
        url: 'https://dreamartweddings.com/indian-wedding-decor-baku'
      }
    ]),
    getFaqPageSchema(directAnswers)
  ];

  const bakuCapabilities = [
    {
      title: 'Grand Ballroom Transformations',
      description:
        'Custom rigging, monumental stage backdrops, panoramic ceiling tulle drapes, and crystal chandelier styling for high-capacity Baku banquet halls.'
    },
    {
      title: 'Caspian Coastal & Terrace Setups',
      description:
        'Wind-engineered Mandap pavilions, outdoor pergola drapery, floral swings for seaside Mehndis, and ambient lawn lighting across the Absheron coast.'
    },
    {
      title: 'Sangeet Stages & Technical Fabrication',
      description:
        'Reinforced performance stages, layered 3D acoustic backdrops, concert lighting integration, and dynamic dance floor perimeters.'
    },
    {
      title: 'Direct Local Floral Sourcing',
      description:
        'Immediate daily access to freshly arrived imported blossoms (Ecuadorian roses, Dutch hydrangeas, orchids) conditioned in our Baku studio cold storage.'
    },
    {
      title: 'Rapid Overnight Conversions',
      description:
        'Disciplined logistics crews based in Baku providing swift overnight transformations between multi-day Indian wedding celebrations.'
    },
    {
      title: 'B2B Production for International Planners',
      description:
        'English-speaking production management, laser-measured CAD floor plans, photorealistic 3D renderings, and transparent itemized decor budgets.'
    }
  ];

  const documentedBakuVenues = [
    {
      name: 'Meridian',
      slug: 'meridian',
      district: 'Badamdar, Baku',
      desc: 'Documented DreamArt wedding stage & monumental floral arch project.',
      link: '/restoranlar/meridian'
    },
    {
      name: 'Bağçalı Saray',
      slug: 'bagcali-saray',
      district: 'Khatai, Baku',
      desc: 'Documented DreamArt gala banquet & candelabra guest table styling.',
      link: '/restoranlar/bagcali-saray'
    },
    {
      name: 'Böyük Saray',
      slug: 'boyuk-saray',
      district: 'Narimanov, Baku',
      desc: 'Documented DreamArt monumental ceiling installation & palace hall decor.',
      link: '/restoranlar/boyuk-saray'
    },
    {
      name: 'By Meridian',
      slug: 'by-meridian',
      district: 'Badamdar, Baku',
      desc: 'Documented DreamArt banquet hall & floral arch project location.',
      link: '/restoranlar/by-meridian'
    }
  ];

  return (
    <>
      <SeoHead
        title="Indian Wedding Decor in Baku | Luxury Destination Styling | DreamArt Weddings"
        description="Luxury Indian wedding decor in Baku, Azerbaijan. DreamArt Weddings designs custom Mandaps, Sangeet stages, Mehndi setups, and reception ballroom styling in Baku."
        canonicalPath="/indian-wedding-decor-baku"
        ogImage="/images/dreamart-monumental-toy-sehnesi-dekoru.webp"
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
            <span className="text-white/90">Baku Decor</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[500px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src="/images/dreamart-monumental-toy-sehnesi-dekoru.webp"
            alt="Indian wedding decor in Baku ballrooms by DreamArt Weddings"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-black/50" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 border border-[#C5A059]/40 bg-[#121212]/85 px-3.5 py-1.5 rounded-sm mb-5 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C378] font-mono">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>BAKU DESTINATION WEDDING PRODUCTION</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF8F5] font-normal mb-6 leading-tight">
              Indian Wedding Decor in Baku
            </h1>

            {/* Core Entity Statement */}
            <div className="p-4 sm:p-5 bg-black/60 border border-[#C5A059]/30 rounded-sm max-w-3xl mx-auto mb-6 backdrop-blur-sm text-left sm:text-center">
              <p className="text-xs sm:text-sm text-white/95 font-light leading-relaxed">
                <strong className="text-[#E5C378] font-medium">DreamArt Weddings</strong> is an Azerbaijan-based event decoration company providing custom wedding and event decor in Baku and other regions of Azerbaijan. Operating from our central Baku studio, we deliver turnkey decor production for multi-day Indian celebrations across the capital.
              </p>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light max-w-2xl mx-auto leading-relaxed mb-8">
              From monumental ballroom stages and sacred Mandaps overlooking the Caspian Sea to festive Mehndi garden swings and high-energy Sangeet stages, we transform Baku’s premier venues with in-house floral artistry, custom carpentry, and rapid overnight turnarounds.
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
                onClick={() => onOpenQuoteModal('Indian Wedding Baku Decor')}
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
              <span>DIRECT FACTS FOR BAKU EVENTS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Direct Answers: Indian Weddings in Baku
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

        {/* Baku Specific Venue Transformation Capabilities */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-mono">
                LOCAL PRODUCTION STRENGTH
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Why Host Your Indian Wedding Decor in Baku With Us
              </h2>
              <p className="text-xs sm:text-sm text-white/70 font-light mt-2">
                Our Baku headquarters grants immediate logistical access, complete inventory control, and skilled craftsmen on call 24/7.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bakuCapabilities.map((cap, idx) => (
                <div
                  key={idx}
                  className="bg-[#141414] border border-white/10 p-6 rounded-sm hover:border-[#C5A059]/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-[#C5A059]/20 text-[#C5A059] flex items-center justify-center mb-4 text-xs font-mono">
                    0{idx + 1}
                  </div>
                  <h3 className="font-serif text-lg text-white font-normal mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Section: For Indian Wedding Planners (Baku Focus) */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="bg-[#121212] border border-[#C5A059]/40 p-8 sm:p-10 rounded-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono mb-2">
                <Briefcase className="w-4 h-4" />
                <span>LOCAL DECOR SUPPLIER IN BAKU</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
                For Indian Wedding Planners Managing Baku Events
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                DreamArt Weddings acts as your local execution partner in Baku. We eliminate cross-border freight costs and language barriers by providing local carpentry fabrication, prop rentals, floral supply, and technical on-site management.
              </p>
            </div>

            <div className="p-4 bg-black/40 rounded border border-white/10 text-xs text-white/70 font-light mb-6">
              <strong className="text-white">Strict Supplier Boundaries:</strong> We provide full visual decor, floral architecture, staging, and lighting. We do NOT provide flight bookings, hotel reservations, catering, or visas. We respect your client relationship and work under your direction.
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleWhatsApp}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-sm text-xs font-medium tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss Baku Dates on WhatsApp</span>
              </button>
              <button
                onClick={() => navigate('/indian-wedding-azerbaijan')}
                className="bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-sm text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                View Full Ceremony Details
              </button>
            </div>
          </div>
        </section>

        {/* Documented Baku Venues Context */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-1 font-mono">
                  VERIFIED REAL PROJECT LOCATIONS
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                  Baku Venues With Documented DreamArt Decor Experience
                </h2>
              </div>
              <button
                onClick={() => navigate('/restoranlar')}
                className="text-xs text-[#C5A059] hover:underline mt-2 sm:mt-0 inline-flex items-center gap-1 cursor-pointer"
              >
                <span>Browse all Baku venues</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {documentedBakuVenues.map((v, i) => (
                <div
                  key={i}
                  className="bg-[#141414] border border-white/10 p-5 rounded-sm flex flex-col justify-between hover:border-[#C5A059]/40 transition-colors"
                >
                  <div className="space-y-1 mb-4">
                    <div className="text-[10px] text-[#C5A059] font-mono uppercase">
                      {v.district}
                    </div>
                    <h3 className="font-serif text-base text-white">{v.name}</h3>
                    <p className="text-[11px] text-white/60 font-light leading-snug">
                      {v.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(v.link)}
                    className="text-xs text-[#E5C378] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium pt-2 border-t border-white/5"
                  >
                    <span>View venue decor profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <p className="mt-4 text-[11px] text-white/50 italic">
              Notice: Mention of venues indicates verified historical decor production by DreamArt Weddings and does not represent official hotel endorsement or exclusive partnership.
            </p>
          </div>
        </section>

        {/* Real Production Work Showcase */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-mono">
              REAL EVIDENCE
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Real DreamArt Production Work in Baku
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden">
              <img
                src="/images/dreamart-monumental-toy-sehnesi-dekoru.webp"
                alt="Real DreamArt wedding stage craftsmanship in Baku"
                className="w-full aspect-[16/10] object-cover"
                loading="lazy"
              />
              <div className="p-4 space-y-1">
                <span className="text-[10px] text-[#C5A059] font-mono uppercase">Stage & Floral Artistry</span>
                <h4 className="font-serif text-base text-white">Monumental Stage Architecture</h4>
                <p className="text-xs text-white/70 font-light">Real DreamArt ballroom production demonstrating multi-tier staging and imported floral density.</p>
              </div>
            </div>

            <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden">
              <img
                src="/images/dreamart-qala-gecesi-samdan-dekoru.webp"
                alt="Real DreamArt candelabra banquet table styling in Baku"
                className="w-full aspect-[16/10] object-cover"
                loading="lazy"
              />
              <div className="p-4 space-y-1">
                <span className="text-[10px] text-[#C5A059] font-mono uppercase">Tabletop & Ambient Styling</span>
                <h4 className="font-serif text-base text-white">Imperial Candelabra Styling</h4>
                <p className="text-xs text-white/70 font-light">Real DreamArt banquet table styling with crystal candelabras and lush floral runners in Baku.</p>
              </div>
            </div>

            <div className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden">
              <img
                src="/images/dreamart-zal-dekoru-tavan-instalyasiyasi.webp"
                alt="Real DreamArt ceiling drapery and chandelier rigging in Baku"
                className="w-full aspect-[16/10] object-cover"
                loading="lazy"
              />
              <div className="p-4 space-y-1">
                <span className="text-[10px] text-[#C5A059] font-mono uppercase">Rigging & Ceiling Design</span>
                <h4 className="font-serif text-base text-white">Palace Ceiling Transformation</h4>
                <p className="text-xs text-white/70 font-light">Real DreamArt ballroom ceiling rigging with cascading tulles and chandeliers at Böyük Saray.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Commercial CTA */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="p-8 sm:p-10 bg-[#121212] border border-[#C5A059]/40 rounded-sm space-y-4 shadow-2xl">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono block">
                BAKU WEDDING DECOR INQUIRY
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Plan Your Indian Wedding Decor in Azerbaijan
              </h3>
              <p className="text-xs sm:text-sm text-white/75 font-light max-w-xl mx-auto leading-relaxed">
                Connect directly on WhatsApp to check date availability for Baku ballrooms, discuss your event themes, and receive a customized decor proposal.
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
                  onClick={() => onOpenQuoteModal('Indian Wedding Baku Decor')}
                  className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-black px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Request Proposal
                </button>
              </div>

              <p className="text-[11px] text-white/50 pt-2 font-mono">
                Direct WhatsApp: +994 50 231 17 28 • Local Baku Production Studio
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
