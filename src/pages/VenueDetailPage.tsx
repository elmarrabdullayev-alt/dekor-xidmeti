import React, { useState } from 'react';
import {
  ArrowLeft, MapPin, Check, Phone, MessageCircle, Sparkles,
  ChevronDown, ChevronUp, Image as ImageIcon, Calendar, CheckCircle2,
  Share2, ShieldCheck, ArrowRight
} from 'lucide-react';
import { VenueItem, DecorItem } from '../types';
import { SeoHead } from '../components/layout/SeoHead';
import { store } from '../lib/store';
import { isVenueIndexable, getVenueStructuredData } from '../lib/venueHelper';
import { getWhatsAppQuoteUrl } from '../lib/whatsapp';

interface VenueDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
  onOpenQuoteModal: (decorOrVenueName?: string) => void;
}

export const VenueDetailPage: React.FC<VenueDetailPageProps> = ({
  slug,
  navigate,
  onOpenQuoteModal
}) => {
  const venue = store.getVenueBySlug(slug);
  const allVenues = store.getVenues(true);
  const allDecors = store.getDecors(false);
  const settings = store.getSettings();

  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  if (!venue) {
    return (
      <div className="min-h-[65vh] flex flex-col items-center justify-center px-4 py-24 text-center bg-[#0B0B0B] text-white">
        <Sparkles className="w-10 h-10 text-[#C5A059] mb-4 opacity-60" />
        <h2 className="font-serif text-3xl text-white mb-3">Məkan tapılmadı</h2>
        <p className="text-sm text-white/70 max-w-md mb-6">
          Axtardığınız restoran və ya məkan səhifəsi mövcud deyil və ya ünvan yenilənib.
        </p>
        <button
          onClick={() => navigate('/restoranlar')}
          className="bg-[#C5A059] hover:bg-[#D4B26F] text-[#0B0B0B] px-6 py-2.5 rounded-sm text-xs font-medium tracking-wider cursor-pointer transition-colors"
        >
          Bütün Məkanlara Bax
        </button>
      </div>
    );
  }

  // Linked real decors
  const relatedDecors: DecorItem[] = (venue.relatedDecorIds || [])
    .map(id => allDecors.find(d => d.id === id))
    .filter((d): d is DecorItem => Boolean(d));

  // Related other venues
  const otherVenues = allVenues
    .filter(v => v.id !== venue.id && v.status === 'published')
    .slice(0, 3);

  // Indexability check
  const isIndexable = isVenueIndexable(venue, allDecors);

  // All gallery photos
  const allPhotos = [
    venue.mainImage,
    ...(venue.galleryImages || []),
    ...relatedDecors.flatMap(d => [d.mainImage, ...(d.galleryImages || [])])
  ].filter((img, idx, arr) => arr.indexOf(img) === idx);

  // Phone and WhatsApp links
  const phoneDisplay = '050 231 17 28';
  const phoneRaw = '+994502311728';
  const whatsappNumber = '994502311728';
  const venueWhatsAppUrl = getWhatsAppQuoteUrl({ venueName: venue.name });

  const handleWhatsApp = () => {
    window.open(venueWhatsAppUrl, '_blank', 'noopener,noreferrer');
  };

  const canonicalUrl = `https://dreamartweddings.com/restoranlar/${venue.slug}`;
  const jsonLd = getVenueStructuredData(venue, canonicalUrl);

  return (
    <>
      <SeoHead
        title={venue.seoTitle ? venue.seoTitle.replace(/DreamArt Events/g, 'DreamArt Weddings') : `${venue.name} Toy Dekoru | DreamArt Weddings`}
        description={venue.metaDescription || venue.shortDescription}
        canonicalPath={`/restoranlar/${venue.slug}`}
        ogImage={venue.mainImage}
        jsonLd={jsonLd}
        noIndex={!isIndexable}
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen pb-24 border-b border-white/10">
        {/* Breadcrumb & Top Bar */}
        <div className="bg-[#111111] border-b border-white/5 py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-white/60">
            <button
              onClick={() => navigate('/restoranlar')}
              className="inline-flex items-center gap-2 hover:text-[#C5A059] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Bütün Restoranlar</span>
            </button>

            <div className="flex items-center gap-2 text-[11px]">
              <span className="cursor-pointer hover:text-white" onClick={() => navigate('/')}>Ana səhifə</span>
              <span>/</span>
              <span className="cursor-pointer hover:text-white" onClick={() => navigate('/restoranlar')}>Restoranlar</span>
              <span>/</span>
              <span className="text-[#C5A059] truncate max-w-[140px] sm:max-w-xs">{venue.name}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-[380px] sm:h-[460px] lg:h-[500px] w-full overflow-hidden">
          <img
            src={venue.mainImage}
            alt={`${venue.name} toy dekoru`}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/60 to-black/40" />

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
              <div className="max-w-3xl space-y-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="bg-[#0B0B0B]/80 backdrop-blur-md border border-[#C5A059]/40 text-[#C5A059] text-[11px] px-3 py-1 rounded-sm uppercase tracking-wider font-mono">
                    Restoran / Məkan Dekoru
                  </span>

                  <div className="flex items-center gap-1.5 text-xs text-white/90 bg-black/60 px-3 py-1 rounded-sm border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{venue.city}{venue.district ? `, ${venue.district}` : ''}{venue.address ? ` (${venue.address})` : ''}</span>
                  </div>

                  {venue.hasRealProject && (
                    <span className="flex items-center gap-1 bg-[#C5A059] text-[#0B0B0B] font-semibold text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      İcra edilmiş real layihə
                    </span>
                  )}
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF8F5] tracking-tight">
                  {venue.name}
                </h1>

                <p className="text-white/80 text-sm sm:text-base leading-relaxed max-w-2xl font-light">
                  {venue.shortDescription}
                </p>

                {/* Direct Action Buttons */}
                <div className="pt-3 flex flex-wrap items-center gap-3">
                  <a
                    href={venueWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#C5A059] hover:bg-[#D4B26F] text-[#0B0B0B] font-medium text-xs tracking-wider uppercase px-6 py-3 rounded-sm flex items-center gap-2 transition-colors cursor-pointer shadow-lg inline-flex"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp ilə sorğu göndərin</span>
                  </a>

                  <a
                    href={`tel:${phoneRaw}`}
                    className="bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs tracking-wider uppercase px-5 py-3 rounded-sm flex items-center gap-2 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#C5A059]" />
                    <span>Zəng: {phoneDisplay}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Main Content (8 cols) */}
            <div className="lg:col-span-8 space-y-12">
              {/* Venue-Specific Notes */}
              {venue.venueNotes && (
                <section className="bg-[#121212] border border-white/10 p-6 sm:p-8 rounded-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-5 h-5 text-[#C5A059]" />
                    <h2 className="font-serif text-xl text-white font-medium">
                      Məkan xüsusiyyətləri və dekor tövsiyələri
                    </h2>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed whitespace-pre-line font-light">
                    {venue.venueNotes}
                  </p>
                </section>
              )}

              {/* Real DreamArt Weddings Projects */}
              <section className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <h2 className="font-serif text-2xl text-white">
                      {venue.name} məkanında real dekor layihələri
                    </h2>
                    <p className="text-xs text-white/50 mt-1">
                      DreamArt Weddings komandası tərəfindən icra edilmiş faktiki tərtibatlar
                    </p>
                  </div>
                  {relatedDecors.length > 0 && (
                    <span className="text-xs text-[#C5A059] font-mono">
                      {relatedDecors.length} layihə
                    </span>
                  )}
                </div>

                {relatedDecors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {relatedDecors.map((decor) => (
                      <div
                        key={decor.id}
                        className="group bg-[#141414] border border-white/10 hover:border-[#C5A059]/40 rounded-sm overflow-hidden transition-all duration-300 flex flex-col cursor-pointer"
                        onClick={() => navigate(`/dekorlar/${decor.slug}`)}
                      >
                        <div className="relative h-48 w-full overflow-hidden bg-black/40">
                          <img
                            src={decor.mainImage}
                            alt={decor.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-sm text-[10px] text-[#C5A059] px-2 py-0.5 rounded-xs font-mono">
                            {decor.categoryName}
                          </span>
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                          <div>
                            <h3 className="font-serif text-base text-white group-hover:text-[#E5C378] transition-colors">
                              {decor.name}
                            </h3>
                            <p className="text-xs text-white/60 line-clamp-2 mt-1 font-light">
                              {decor.shortDescription}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-[#C5A059]">
                            <span className="text-[11px] text-white/40">{decor.style || 'Lüks konsept'}</span>
                            <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Ətraflı bax <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/[0.02] border border-white/5 p-6 rounded-sm text-center">
                    <p className="text-xs text-white/60">
                      Bu məkan üçün yeni layihələr arxivə əlavə olunur. Məkana uyğun xüsusi dizayn və foto portfoliomuzu WhatsApp vasitəsilə dərhal əldə edə bilərsiniz.
                    </p>
                    <button
                      onClick={handleWhatsApp}
                      className="mt-4 inline-flex items-center gap-2 text-xs text-[#C5A059] hover:underline"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>WhatsApp ilə şəkilləri istəyin</span>
                    </button>
                  </div>
                )}
              </section>

              {/* Contextual Service Internal Links */}
              <section className="p-6 bg-[#121212] border border-white/10 rounded-sm">
                <h3 className="font-serif text-base text-white mb-2">
                  {venue.name} üçün əlaqəli dekorasiya xidmətlərimiz
                </h3>
                <p className="text-xs text-white/60 font-light mb-4">
                  Məkanın miqyasına və tədbir növünə uyğun olaraq ixtisaslaşmış xidmətlərimizlə tanış olun:
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate('/toy-dekoru')}
                    className="px-3 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs rounded-sm transition-colors cursor-pointer"
                  >
                    Toy Dekoru
                  </button>
                  <button
                    onClick={() => navigate('/zal-dekoru')}
                    className="px-3 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs rounded-sm transition-colors cursor-pointer"
                  >
                    Zal Dekoru
                  </button>
                  <button
                    onClick={() => navigate('/nisan-dekoru')}
                    className="px-3 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs rounded-sm transition-colors cursor-pointer"
                  >
                    Nişan Dekoru
                  </button>
                  <button
                    onClick={() => navigate('/xonca-xidmeti')}
                    className="px-3 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs rounded-sm transition-colors cursor-pointer"
                  >
                    Xonça Xidməti
                  </button>
                  <button
                    onClick={() => navigate('/korporativ-dekor')}
                    className="px-3 py-1.5 bg-[#181818] border border-white/10 hover:border-[#C5A059] text-white text-xs rounded-sm transition-colors cursor-pointer"
                  >
                    Korporativ Dekoru
                  </button>
                </div>
              </section>

              {/* Gallery Section */}
              {allPhotos.length > 0 && (
                <section className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <h2 className="font-serif text-2xl text-white">Qalereya və Vizual Nümunələr</h2>
                    <span className="text-xs text-white/50">{allPhotos.length} foto</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="relative h-32 sm:h-40 rounded-sm overflow-hidden border border-white/5 hover:border-[#C5A059]/40 cursor-pointer group"
                        onClick={() => setSelectedGalleryImage(photo)}
                      >
                        <img
                          src={photo}
                          alt={`${venue.name} dekorasiya ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* GEO / AI Search Direct-Answer FAQ Section */}
              {venue.faqs && venue.faqs.length > 0 && (
                <section className="space-y-4 pt-4">
                  <div className="pb-3 border-b border-white/10">
                    <span className="text-[#C5A059] text-[11px] uppercase tracking-wider font-mono block mb-1">
                      GEO / Sürətli Cavablar
                    </span>
                    <h2 className="font-serif text-2xl text-white">
                      Tez-tez verilən suallar ({venue.name})
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {venue.faqs.map((faq, index) => {
                      const isOpen = activeFaqIndex === index;
                      return (
                        <div
                          key={index}
                          className="bg-[#121212] border border-white/10 rounded-sm overflow-hidden transition-colors"
                        >
                          <button
                            onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                            className="w-full p-4 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02]"
                          >
                            <span className="font-serif text-sm sm:text-base text-white font-medium">
                              {faq.question}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="w-4 h-4 text-[#C5A059] shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-white/40 shrink-0" />
                            )}
                          </button>

                          {isOpen && (
                            <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-white/70 leading-relaxed border-t border-white/5 font-light">
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* Right Sidebar (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Quick Inquiry Card */}
              <div className="bg-gradient-to-b from-[#181611] to-[#0F0E0B] border border-[#C5A059]/40 p-6 rounded-sm space-y-5 sticky top-24 shadow-xl">
                <div>
                  <span className="text-[#C5A059] text-[10px] tracking-[0.25em] uppercase font-mono block mb-1 font-semibold">
                    REZERVASIYA VƏ QİYMƏT
                  </span>
                  <h3 className="font-serif text-xl text-[#FAF8F5]">
                    {venue.name} üçün dekor sifarişi
                  </h3>
                  <p className="text-xs text-white/70 mt-1 leading-relaxed">
                    Tarixinizi və qonaq sayını qeyd edin, məkanın planına uyğun fərdi 3D konsept və smeta hazırlayaq.
                  </p>
                </div>

                <div className="space-y-2.5 text-xs text-white/80 pt-2 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Məkan ölçülərinə uyğun fərdi floristika</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Gecə və səhər operativ montaj</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-[#C5A059] shrink-0" />
                    <span>Rəsmi müqavilə və təhlükəsizlik zəmanəti</span>
                  </div>
                </div>

                <div className="space-y-2.5 pt-2">
                  <a
                    href={venueWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#C5A059] hover:bg-[#D4B26F] text-[#0B0B0B] font-medium text-xs tracking-wider uppercase py-3 rounded-sm transition-colors cursor-pointer block text-center"
                  >
                    Qiymət Təklifi Alın
                  </a>

                  <a
                    href={venueWhatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-[#C5A059]/40 text-xs tracking-wider uppercase py-3 rounded-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 text-[#C5A059]" />
                    <span>WhatsApp: {phoneDisplay}</span>
                  </a>
                </div>

                {/* Venue Details Snapshot */}
                <div className="pt-4 border-t border-white/10 text-[11px] space-y-2 text-white/60">
                  <div className="flex justify-between">
                    <span>Şəhər:</span>
                    <span className="text-white">{venue.city}</span>
                  </div>
                  {venue.district && (
                    <div className="flex justify-between">
                      <span>Rayon:</span>
                      <span className="text-white">{venue.district}</span>
                    </div>
                  )}
                  {venue.address && (
                    <div className="flex justify-between">
                      <span>Ünvan:</span>
                      <span className="text-white truncate max-w-[170px]">{venue.address}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Xidmət zonası:</span>
                    <span className="text-[#C5A059]">Azərbaycan</span>
                  </div>
                </div>
              </div>

              {/* Related Venues */}
              {otherVenues.length > 0 && (
                <div className="bg-[#121212] border border-white/10 p-5 rounded-sm space-y-4">
                  <h4 className="font-serif text-base text-white">Digər Məkanlar</h4>
                  <div className="space-y-3">
                    {otherVenues.map((ov) => (
                      <div
                        key={ov.id}
                        onClick={() => navigate(`/restoranlar/${ov.slug}`)}
                        className="flex items-center gap-3 group cursor-pointer hover:bg-white/[0.02] p-1.5 rounded-sm transition-colors"
                      >
                        <img
                          src={ov.mainImage}
                          alt={ov.name}
                          className="w-14 h-14 object-cover rounded-xs border border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-serif text-sm text-white group-hover:text-[#C5A059] transition-colors truncate">
                            {ov.name}
                          </h5>
                          <span className="text-[11px] text-white/50 block">
                            {ov.city}{ov.district ? `, ${ov.district}` : ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>

      {/* Gallery Modal */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedGalleryImage}
              alt="Məkan foto"
              className="w-full h-auto max-h-[85vh] object-contain rounded-sm"
            />
            <button
              onClick={() => setSelectedGalleryImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#C5A059] text-sm cursor-pointer"
            >
              Bağla ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};
