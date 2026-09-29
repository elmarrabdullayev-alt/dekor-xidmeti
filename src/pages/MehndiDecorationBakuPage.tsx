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
  Palette,
  Flower2,
  Sun,
  HelpCircle,
  Briefcase
} from 'lucide-react';

interface MehndiDecorationBakuPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (eventName?: string) => void;
}

export const MehndiDecorationBakuPage: React.FC<MehndiDecorationBakuPageProps> = ({
  navigate,
  onOpenQuoteModal
}) => {
  const phoneDisplay = '050 231 17 28';
  const phoneRaw = '+994502311728';
  const whatsappNumber = '994502311728';

  const whatsappMessage =
    'Hello DreamArt Weddings. We are planning a Mehndi celebration in Baku, Azerbaijan and would like to discuss decoration and floral styling.';

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directAnswers = [
    {
      question: 'Can you create decor for Mehndi events in Baku?',
      answer:
        'Yes. DreamArt Weddings designs and constructs full Mehndi decorative environments across Baku. We specialize in custom-built floral swings (jhoola), color-blocked pergola drapery, low-seating bohemian lounges with vibrant cushions, and colorful photo backdrops for garden, seaside terrace, or ballroom settings.'
    },
    {
      question: 'Do you fabricate custom floral swings (jhoola) in Baku?',
      answer:
        'Yes. Our in-house carpentry workshop in Baku crafts sturdy, suspended floral swings engineered for stability and adorned with lush clusters of fresh imported roses, seasonal blooms, and greenery to create the signature bridal focal point.'
    },
    {
      question: 'What color palettes do you offer for Mehndi setups in Azerbaijan?',
      answer:
        'We tailor colors to your design brief, frequently working with festive marigold yellows, citrus oranges, fuchsia pinks, emerald greens, and turquoise accents through custom fabrics, pillows, and floral arrangements.'
    },
    {
      question: 'Can you transition a daytime Mehndi into an evening Sangeet space?',
      answer:
        'Yes. Our on-site setup crews coordinate rapid turnaround times to dismantle daytime Mehndi structures or transition the venue space into an evening party environment with stage lighting and dining arrangements.'
    }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Mehndi Decoration in Baku',
      'description':
        'Custom Mehndi decoration in Baku, Azerbaijan by DreamArt Weddings. Specializing in bespoke floral swings, colorful drapes, low-seating lounges, and festive photo zones.',
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
      'serviceType': 'Mehndi Event Decoration and Production',
      'url': 'https://dreamartweddings.com/mehndi-decoration-baku'
    },
    getBreadcrumbSchema([
      { name: 'Home', url: 'https://dreamartweddings.com' },
      {
        name: 'Indian Wedding Decoration in Azerbaijan',
        url: 'https://dreamartweddings.com/indian-wedding-azerbaijan'
      },
      {
        name: 'Mehndi Decoration in Baku',
        url: 'https://dreamartweddings.com/mehndi-decoration-baku'
      }
    ]),
    getFaqPageSchema(directAnswers)
  ];

  const mehndiServices = [
    {
      title: 'Bespoke Bridal Floral Swings (Jhoola)',
      description:
        'Engineered freestanding wooden swings dressed in cascading fresh florals, providing an exquisite, comfortable photo setting for the bride.'
    },
    {
      title: 'Bohemian Low-Seating Lounges',
      description:
        'Floor mattresses, patterned rugs, colorful bolster cushions, and low tables creating relaxed spaces for guests and henna artists.'
    },
    {
      title: 'Canopy & Pergola Fabric Draping',
      description:
        'Vibrant color-blocked ceiling and wall drapery in chiffon and georgette, offering shade and festival energy for garden and terrace venues.'
    },
    {
      title: 'Fresh Floral Garlands & Brass Urli',
      description:
        'Decorative water bowls with floating marigolds and tea lights, floral tassel garlands, and custom entrance greeting arches.'
    },
    {
      title: 'Interactive Photo Points & Henna Stations',
      description:
        'Customized backdrop signage, floral arches, bridal accessory display tables, and branded photo points for family portraits.'
    },
    {
      title: 'Turnaround & Teardown Coordination',
      description:
        'Efficient on-site logistics crew ensuring rapid setup before sunrise and orderly pack-down following the celebration.'
    }
  ];

  return (
    <>
      <SeoHead
        title="Mehndi Decoration in Baku | Vibrant Swings & Lounge Styling | DreamArt Weddings"
        description="Vibrant Mehndi decoration in Baku by DreamArt Weddings. Custom floral swings, colorful drapes, low-seating bohemian lounges, and festive henna party styling."
        canonicalPath="/mehndi-decoration-baku"
        ogImage="/images/dreamart-tebii-budag-agac-kompozisiyasi.webp"
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
            <span className="text-white/90">Mehndi Decoration Baku</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[480px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src="/images/dreamart-tebii-budag-agac-kompozisiyasi.webp"
            alt="Mehndi decoration and floral styling in Baku"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-black/50" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 border border-[#C5A059]/40 bg-[#121212]/85 px-3.5 py-1.5 rounded-sm mb-5 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C378] font-mono">
              <Palette className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>MEHNDI CELEBRATION STYLING IN BAKU</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF8F5] font-normal mb-6 leading-tight">
              Mehndi Decoration in Baku
            </h1>

            {/* Core Entity Statement */}
            <div className="p-4 sm:p-5 bg-black/60 border border-[#C5A059]/30 rounded-sm max-w-3xl mx-auto mb-6 backdrop-blur-sm text-left sm:text-center">
              <p className="text-xs sm:text-sm text-white/95 font-light leading-relaxed">
                <strong className="text-[#E5C378] font-medium">DreamArt Weddings</strong> is an Azerbaijan-based event decoration company providing custom wedding and event decor in Baku and other regions of Azerbaijan. We specialize in producing joyous, color-saturated Mehndi setups featuring custom floral swings, festive drapery, and comfortable lounge seating for destination weddings.
              </p>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light max-w-2xl mx-auto leading-relaxed mb-8">
              Whether hosted in an open-air seaside garden on the Absheron coast or inside a private ballroom, our in-house florists and carpenters deliver vibrant yellow, fuchsia, and emerald palettes with handcrafted details and seamless on-site management.
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
                onClick={() => onOpenQuoteModal('Mehndi Baku Decor')}
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
              <span>DIRECT FACTS • MEHNDI EVENTS</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Direct Answers: Mehndi Decoration in Baku
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

        {/* Specific Mehndi Design Capabilities */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-mono">
                SIGNATURE ELEMENTS
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Curated Decor Components for Your Baku Mehndi
              </h2>
              <p className="text-xs sm:text-sm text-white/70 font-light mt-2">
                Every detail is tailored to your color concept and venue specifications by our Baku craft workshop.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mehndiServices.map((svc, idx) => (
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

        {/* Section: For Indian Wedding Planners (Mehndi Logistics) */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="bg-[#121212] border border-[#C5A059]/40 p-8 sm:p-10 rounded-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono mb-2">
                <Briefcase className="w-4 h-4" />
                <span>PLANNER COLLABORATION</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
                For Destination Planners Coordinating Mehndi Events in Baku
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                We provide full local production support: weather-appropriate sun-shading, sturdy furniture rentals, floral styling, and rapid turnaround before evening Sangeet programs.
              </p>
            </div>

            <div className="p-4 bg-black/40 rounded border border-white/10 text-xs text-white/70 font-light mb-6">
              <strong className="text-white">Professional Role:</strong> We operate strictly as decoration and scenic production specialists in Azerbaijan. We do not provide travel bookings, flight tickets, or catering.
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleWhatsApp}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-sm text-xs font-medium tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss Mehndi Ideas on WhatsApp</span>
              </button>
              <button
                onClick={() => navigate('/sangeet-decoration-baku')}
                className="bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-sm text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Explore Sangeet Evening Decor
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
                Real DreamArt Production Work in Azerbaijan
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-[#141414] border border-white/10 rounded-sm overflow-hidden">
                <img
                  src="/images/dreamart-tebii-budag-agac-kompozisiyasi.webp"
                  alt="Real DreamArt floral arch and branch artistry in Azerbaijan"
                  className="w-full aspect-[16/10] object-cover"
                  loading="lazy"
                />
                <div className="p-4 space-y-1">
                  <span className="text-[10px] text-[#C5A059] font-mono uppercase">Floral & Branch Architecture</span>
                  <h4 className="font-serif text-base text-white">Botanical Structure Artistry</h4>
                  <p className="text-xs text-white/70 font-light">Real DreamArt installation showing natural branch framing, dense floral placement, and garden atmosphere.</p>
                </div>
              </div>

              <div className="bg-[#141414] border border-white/10 rounded-sm overflow-hidden">
                <img
                  src="/images/dreamart-nisan-dekoru-fotozona.webp"
                  alt="Real DreamArt photo zone and backdrop production"
                  className="w-full aspect-[16/10] object-cover"
                  loading="lazy"
                />
                <div className="p-4 space-y-1">
                  <span className="text-[10px] text-[#C5A059] font-mono uppercase">Backdrop & Photo Point Design</span>
                  <h4 className="font-serif text-base text-white">Custom Backdrop Craftsmanship</h4>
                  <p className="text-xs text-white/70 font-light">Real DreamArt photo point production showcasing layered floral borders and custom signage integration.</p>
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
                MEHNDI DECOR INQUIRY
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Plan Your Indian Wedding Decor in Azerbaijan
              </h3>
              <p className="text-xs sm:text-sm text-white/75 font-light max-w-xl mx-auto leading-relaxed">
                Connect with our floral designers and production managers to craft a custom Mehndi setup tailored to your wedding vision.
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
                  onClick={() => onOpenQuoteModal('Mehndi Baku Decor')}
                  className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-black px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Request Proposal
                </button>
              </div>

              <p className="text-[11px] text-white/50 pt-2 font-mono">
                Direct WhatsApp: +994 50 231 17 28 • DreamArt Weddings Baku
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
