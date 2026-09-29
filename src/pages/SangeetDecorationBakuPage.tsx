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
  Music,
  Wine,
  HelpCircle,
  Briefcase,
  Layers
} from 'lucide-react';

interface SangeetDecorationBakuPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (eventName?: string) => void;
}

export const SangeetDecorationBakuPage: React.FC<SangeetDecorationBakuPageProps> = ({
  navigate,
  onOpenQuoteModal
}) => {
  const phoneDisplay = '050 231 17 28';
  const phoneRaw = '+994502311728';
  const whatsappNumber = '994502311728';

  const whatsappMessage =
    'Hello DreamArt Weddings. We are planning a Sangeet night in Baku, Azerbaijan and would like to discuss stage design, lighting, and decor production.';

  const handleWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const directAnswers = [
    {
      question: 'Can you create decor for Sangeet events in Baku?',
      answer:
        'Yes. DreamArt Weddings designs and constructs concert-grade Sangeet decor environments across Baku. We build wide performance stages, layered acoustic backdrops, illuminated dance floor frames, dynamic entrance tunnels, and luxury cocktail lounge vignettes tailored for musical celebrations.'
    },
    {
      question: 'Do you build custom performance stages for family choreographies?',
      answer:
        'Yes. Our in-house technical carpentry team in Baku constructs reinforced stages with non-slip surfaces, safety skirting, and custom stair access engineered to accommodate energetic group dance performances.'
    },
    {
      question: 'How do you coordinate decor with AV and sound crews in Baku?',
      answer:
        'We work closely with sound, lighting, and LED screen technicians, providing exact CAD stage dimensions, weight-bearing truss integration, and cable pass-throughs to ensure a clean, visually unified production.'
    },
    {
      question: 'Can DreamArt Weddings handle rapid overnight turnover after a Sangeet?',
      answer:
        'Yes. Our Baku warehouse and dedicated night-shift crews regularly conduct overnight teardowns to transform the ballroom for a morning Mandap ceremony or afternoon reception.'
    }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'Service',
      'name': 'Sangeet Decoration in Baku',
      'description':
        'Custom Sangeet decoration in Baku, Azerbaijan by DreamArt Weddings. Specializing in performance stage architecture, concert lighting, dance floor perimeters, and cocktail party styling.',
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
      'serviceType': 'Sangeet Event Decoration and Production',
      'url': 'https://dreamartweddings.com/sangeet-decoration-baku'
    },
    getBreadcrumbSchema([
      { name: 'Home', url: 'https://dreamartweddings.com' },
      {
        name: 'Indian Wedding Decoration in Azerbaijan',
        url: 'https://dreamartweddings.com/indian-wedding-azerbaijan'
      },
      {
        name: 'Sangeet Decoration in Baku',
        url: 'https://dreamartweddings.com/sangeet-decoration-baku'
      }
    ]),
    getFaqPageSchema(directAnswers)
  ];

  const sangeetFeatures = [
    {
      title: 'Choreography Performance Stages',
      description:
        'Reinforced wide staging with integrated steps, non-slip dance flooring, and custom fascia skirting designed for live performances.'
    },
    {
      title: 'Layered 3D Scenic Backdrops',
      description:
        'Geometric and organic architectural backdrops integrating gold foil finishes, metallic panels, and LED screen framing.'
    },
    {
      title: 'Illuminated Dance Floor Borders',
      description:
        'Seamless dance floor perimeters bordered by ambient floral curbs, crystal candelabras, and atmospheric low fog integration.'
    },
    {
      title: 'Dramatic Entrance Tunnels',
      description:
        'Tunnel gateways with cascading crystal beads, warm fairy light canopies, and branded couple monograms to welcome guests.'
    },
    {
      title: 'VIP Cocktail Lounges & Bar Styling',
      description:
        'High-top cocktail tables adorned with glowing floral arrangements, paired with plush velvet sofas and custom mirrored bar facades.'
    },
    {
      title: 'Rigging & Ambient Lighting Decor',
      description:
        'Truss wraps, ceiling fairy-light drapes, and pinpoint floral illumination creating concert-grade glamour on video and photos.'
    }
  ];

  return (
    <>
      <SeoHead
        title="Sangeet Decoration in Baku | Grand Stage & Dance Floor Styling | DreamArt Weddings"
        description="Concert-grade Sangeet decoration in Baku by DreamArt Weddings. Custom performance stage architecture, 3D backdrops, dance floor styling, and cocktail lounge design."
        canonicalPath="/sangeet-decoration-baku"
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
            <span className="text-white/90">Sangeet Decoration Baku</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[480px] flex items-center justify-center bg-[#0B0B0B] overflow-hidden border-b border-white/10">
          <img
            src="/images/dreamart-monumental-toy-sehnesi-dekoru.webp"
            alt="Sangeet stage decoration in Baku by DreamArt Weddings"
            className="absolute inset-0 w-full h-full object-cover object-center opacity-30 brightness-[0.55]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/70 to-black/50" />

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 border border-[#C5A059]/40 bg-[#121212]/85 px-3.5 py-1.5 rounded-sm mb-5 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#E5C378] font-mono">
              <Music className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>SANGEET NIGHT STAGING IN BAKU</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#FAF8F5] font-normal mb-6 leading-tight">
              Sangeet Decoration in Baku
            </h1>

            {/* Core Entity Statement */}
            <div className="p-4 sm:p-5 bg-black/60 border border-[#C5A059]/30 rounded-sm max-w-3xl mx-auto mb-6 backdrop-blur-sm text-left sm:text-center">
              <p className="text-xs sm:text-sm text-white/95 font-light leading-relaxed">
                <strong className="text-[#E5C378] font-medium">DreamArt Weddings</strong> is an Azerbaijan-based event decoration company providing custom wedding and event decor in Baku and other regions of Azerbaijan. We specialize in producing grand Sangeet musical stage designs, architectural backdrops, and glamorous party lounges for destination celebrations.
              </p>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-white/80 font-light max-w-2xl mx-auto leading-relaxed mb-8">
              From performance-ready choreography stages and custom LED screen frames to dramatic entrance walkways and cocktail vignettes, our in-house carpentry and lighting specialists deliver an electric, unforgettable party atmosphere.
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
                onClick={() => onOpenQuoteModal('Sangeet Baku Decor')}
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
              <span>DIRECT FACTS • SANGEET PRODUCTION</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal">
              Direct Answers: Sangeet Decoration in Baku
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

        {/* Specific Sangeet Features */}
        <section className="py-16 sm:py-20 bg-[#0E0E0E] border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-mono">
                STAGE & PRODUCTION EXCELLENCE
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-white font-normal">
                Signature Sangeet Staging Capabilities
              </h2>
              <p className="text-xs sm:text-sm text-white/70 font-light mt-2">
                Built to international concert specifications with custom styling by our in-house Baku production teams.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sangeetFeatures.map((svc, idx) => (
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

        {/* Section: For Indian Wedding Planners (Sangeet Staging & AV) */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-white/10">
          <div className="bg-[#121212] border border-[#C5A059]/40 p-8 sm:p-10 rounded-sm">
            <div className="max-w-3xl mb-6">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-mono mb-2">
                <Briefcase className="w-4 h-4" />
                <span>B2B STAGING PARTNER</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
                For Destination Planners Organizing Sangeet Nights in Baku
              </h2>
              <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed">
                We handle the structural staging and decor production, coordinating seamlessly with your sound, lighting, and DJ providers to deliver a flawless, high-energy musical evening.
              </p>
            </div>

            <div className="p-4 bg-black/40 rounded border border-white/10 text-xs text-white/70 font-light mb-6">
              <strong className="text-white">Clear Focus:</strong> We provide structural staging, visual decor, floral framing, bar styling, and lighting design. We do not provide artist bookings, flight tickets, catering, or hotel management.
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={handleWhatsApp}
                className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3 rounded-sm text-xs font-medium tracking-wider uppercase flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Discuss Sangeet Requirements</span>
              </button>
              <button
                onClick={() => navigate('/mandap-decoration-azerbaijan')}
                className="bg-white/10 hover:bg-white/15 text-white px-6 py-3 rounded-sm text-xs tracking-wider uppercase transition-colors cursor-pointer"
              >
                Explore Mandap & Ceremony Decor
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

              <div className="bg-[#141414] border border-white/10 rounded-sm overflow-hidden">
                <img
                  src="/images/dreamart-banket-zali-goy-isiq-dekoru.webp"
                  alt="Real DreamArt stage lighting and ballroom decor in Baku"
                  className="w-full aspect-[16/10] object-cover"
                  loading="lazy"
                />
                <div className="p-4 space-y-1">
                  <span className="text-[10px] text-[#C5A059] font-mono uppercase">Atmospheric Lighting & Staging</span>
                  <h4 className="font-serif text-base text-white">Ballroom Lighting & Staging Production</h4>
                  <p className="text-xs text-white/70 font-light">Real DreamArt setup displaying atmospheric stage lighting, custom arches, and banquet table alignment.</p>
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
                SANGEET STAGING INQUIRY
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Plan Your Indian Wedding Decor in Azerbaijan
              </h3>
              <p className="text-xs sm:text-sm text-white/75 font-light max-w-xl mx-auto leading-relaxed">
                Connect with our technical production designers on WhatsApp to discuss your stage dimensions, lighting integration, and venue floor plan.
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
                  onClick={() => onOpenQuoteModal('Sangeet Baku Decor')}
                  className="w-full sm:w-auto bg-[#C5A059] hover:bg-[#D4AF37] text-black px-8 py-3.5 rounded-sm text-xs font-medium tracking-wide uppercase transition-colors cursor-pointer"
                >
                  Request Proposal
                </button>
              </div>

              <p className="text-[11px] text-white/50 pt-2 font-mono">
                Direct WhatsApp: +994 50 231 17 28 • Local Production in Baku
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
