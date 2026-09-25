import React, { useState, useMemo } from 'react';
import { MapPin, Sparkles, ArrowRight, CheckCircle2, Search } from 'lucide-react';
import { VenueItem, DecorItem } from '../types';
import { SeoHead } from '../components/layout/SeoHead';
import { store } from '../lib/store';
import { isVenueIndexable } from '../lib/venueHelper';

interface VenuesCatalogPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal: (venueName?: string) => void;
}

export const VenuesCatalogPage: React.FC<VenuesCatalogPageProps> = ({
  navigate,
  onOpenQuoteModal
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const venues = store.getVenues(true); // get published venues
  const allDecors = store.getDecors(false);

  // Filter cities
  const cities = useMemo(() => {
    const unique = Array.from(new Set(venues.map(v => v.city).filter(Boolean)));
    return ['all', ...unique];
  }, [venues]);

  const filteredVenues = useMemo(() => {
    return venues.filter(v => {
      const matchCity = selectedCity === 'all' || v.city.toLowerCase() === selectedCity.toLowerCase();
      const matchQuery = !searchQuery.trim() ||
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (v.district && v.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
        v.city.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCity && matchQuery;
    });
  }, [venues, selectedCity, searchQuery]);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Toy və tədbir məkanları | DreamArt Events',
      'description': 'DreamArt Events müxtəlif restoran və tədbir məkanlarında dekor layihələri həyata keçirir. Məkanlara uyğun real işlər və dekor nümunələri.',
      'url': 'https://dreamart.az/restoranlar'
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Ana səhifə',
          'item': 'https://dreamart.az'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Restoranlar',
          'item': 'https://dreamart.az/restoranlar'
        }
      ]
    }
  ];

  return (
    <>
      <SeoHead
        title="Toy və Tədbir Məkanları | Restoran Dekoru | DreamArt Events"
        description="DreamArt Events müxtəlif restoran və tədbir məkanlarında dekor layihələri həyata keçirir. Məkanlara uyğun real işlər və dekor nümunələri bu bölmədə təqdim olunur."
        canonicalPath="/restoranlar"
        jsonLd={jsonLd}
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen pb-20">
        {/* Hero Section */}
        <section className="relative pt-20 pb-12 sm:pt-24 sm:pb-16 border-b border-white/10 overflow-hidden bg-radial from-[#1A1813] via-[#0B0B0B] to-[#0B0B0B]">
          <div className="absolute inset-0 bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <span className="text-[#C5A059] text-xs uppercase tracking-[0.3em] font-sans block mb-3 font-medium">
              RESTORANLAR VƏ ŞADLIQ SARAYLARI
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#FAF8F5] tracking-tight mb-4">
              Toy və tədbir məkanları
            </h1>
            <p className="text-white/70 max-w-3xl mx-auto text-sm sm:text-base leading-relaxed font-light">
              DreamArt Events müxtəlif restoran və tədbir məkanlarında dekor layihələri həyata keçirir. Məkanlara uyğun real işlər və dekor nümunələri bu bölmədə təqdim olunur.
            </p>

            {/* Filter & Search Bar */}
            <div className="mt-8 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Restoran və ya məkan adı axtarın..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#C5A059] text-white pl-10 pr-4 py-2.5 text-xs rounded-sm outline-none transition-colors"
                />
              </div>

              {cities.length > 2 && (
                <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                  {cities.map(city => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3.5 py-2 text-xs rounded-sm transition-all whitespace-nowrap cursor-pointer ${
                        selectedCity === city
                          ? 'bg-[#C5A059] text-[#0B0B0B] font-medium shadow-sm'
                          : 'bg-white/5 text-white/70 hover:text-white border border-white/10'
                      }`}
                    >
                      {city === 'all' ? 'Bütün şəhərlər' : city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Venues Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {filteredVenues.length === 0 ? (
            <div className="text-center py-20 bg-white/[0.02] border border-white/5 rounded-sm">
              <Sparkles className="w-8 h-8 text-[#C5A059] mx-auto mb-3 opacity-60" />
              <h3 className="font-serif text-lg text-white mb-1">Məkan tapılmadı</h3>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                Axtarışınıza uyğun restoran və ya tədbir zalı tapılmadı. Zəhmət olmasa başqa açar söz sınayın.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredVenues.map((venue) => {
                const isIndexable = isVenueIndexable(venue, allDecors);
                const relatedCount = venue.relatedDecorIds?.length || 0;

                return (
                  <article
                    key={venue.id}
                    id={`venue-card-${venue.slug}`}
                    className="group bg-gradient-to-b from-[#141414] to-[#0E0E0E] rounded-sm border border-white/10 hover:border-[#C5A059]/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg hover:shadow-2xl cursor-pointer"
                    onClick={() => navigate(`/restoranlar/${venue.slug}`)}
                  >
                    {/* Venue Image */}
                    <div className="relative h-56 sm:h-60 w-full overflow-hidden bg-black/40">
                      <img
                        src={venue.mainImage}
                        alt={`${venue.name} toy dekoru`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* City Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-[#0B0B0B]/85 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/10 text-[11px] text-white/90">
                        <MapPin className="w-3 h-3 text-[#C5A059]" />
                        <span>{venue.city}{venue.district ? `, ${venue.district}` : ''}</span>
                      </div>

                      {/* Real Project Badge if verified */}
                      {venue.hasRealProject && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-[#C5A059]/90 text-[#0B0B0B] font-medium px-2 py-0.5 rounded-xs text-[10px] tracking-wider uppercase shadow-md">
                          <CheckCircle2 className="w-3 h-3 text-[#0B0B0B]" />
                          <span>Real layihə</span>
                        </div>
                      )}

                      {/* Title on image bottom */}
                      <div className="absolute bottom-3 left-4 right-4">
                        <h2 className="font-serif text-xl sm:text-2xl text-white font-medium group-hover:text-[#E5C378] transition-colors">
                          {venue.name}
                        </h2>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                        {venue.shortDescription}
                      </p>

                      {/* Services Chips */}
                      {venue.relatedServices && venue.relatedServices.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {venue.relatedServices.slice(0, 3).map((srv, idx) => (
                            <span
                              key={idx}
                              className="text-[10px] tracking-wider bg-white/5 border border-white/10 text-[#C5A059] px-2 py-0.5 rounded-xs"
                            >
                              {srv}
                            </span>
                          ))}
                          {venue.relatedServices.length > 3 && (
                            <span className="text-[10px] text-white/40 self-center">
                              +{venue.relatedServices.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      {/* CTA Button */}
                      <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[11px] text-white/50">
                          {relatedCount > 0 ? `${relatedCount} dekor layihəsi` : 'Məkan tərtibatı'}
                        </span>

                        <div className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] group-hover:text-[#E5C378] font-medium tracking-wider">
                          <span>Layihələrə bax</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {/* Bottom Consultation Banner */}
          <div className="mt-16 bg-gradient-to-r from-[#171510] via-[#201D16] to-[#171510] border border-[#C5A059]/30 p-8 sm:p-10 rounded-sm text-center">
            <h3 className="font-serif text-2xl text-[#FAF8F5] mb-2">
              Siyahıda olmayan məkanda tədbiriniz var?
            </h3>
            <p className="text-sm text-white/70 max-w-2xl mx-auto mb-6">
              DreamArt Events Azərbaycanın istənilən restoran və ya şadlıq sarayında fərdi dekor konsepti hazırlayaraq quraşdırma həyata keçirir.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => onOpenQuoteModal('Ümumi Məkan Sorğusu')}
                className="bg-[#C5A059] hover:bg-[#D4B26F] text-[#0B0B0B] font-medium text-xs tracking-wider uppercase px-6 py-3 rounded-sm transition-colors cursor-pointer"
              >
                Məkanınız üçün təklif alın
              </button>
              <a
                href="https://wa.me/994502311728?text=Salam%2C%20DreamArt%20Events!%20Restoran%20dekoru%20haqq%C4%B1nda%20m%C9%99lumat%20almaq%20ist%C9%99yir%C9%99m."
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[#C5A059]/50 hover:border-[#C5A059] text-white text-xs tracking-wider uppercase px-6 py-3 rounded-sm transition-colors"
              >
                WhatsApp ilə yazın
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};
