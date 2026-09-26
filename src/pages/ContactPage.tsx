import React from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { QuoteSection } from '../components/home/QuoteSection';
import { store } from '../lib/store';
import { MapPin, Phone, Mail, Instagram, MessageCircle } from 'lucide-react';

interface ContactPageProps {
  onOpenQuoteModal: () => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  const settings = store.getSettings();

  return (
    <>
      <SeoHead
        title="Əlaqə | DreamArt Weddings Bakı"
        description="DreamArt Weddings ilə əlaqə. Ünvan, telefon, WhatsApp və tədbir dekorasiyası üçün sorğu göndərmə imkanı."
        canonicalPath="/elaqe"
      />

      <div className="bg-[#0B0B0B] text-white min-h-screen border-b border-white/10">
        <section className="py-16 sm:py-20 bg-[#121212] border-b border-white/10 text-center">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              BİZİMLƏ ƏLAQƏ
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4">
              Əlaqə Məlumatları
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-white/70 font-light max-w-xl mx-auto leading-relaxed">
              Tədbirinizin dekorasiyası və ya xonça xidmətləri ilə bağlı suallarınızı cavablandırmağa hər zaman hazırıq.
            </p>
          </div>
        </section>

        {/* Contact info cards */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Phone */}
            <div className="bg-[#121212] p-6 border border-white/10 hover:border-[#C5A059]/50 rounded-sm transition-colors">
              <Phone className="w-5 h-5 text-[#C5A059] mb-3" />
              <h3 className="text-xs uppercase tracking-wider text-white font-semibold mb-1">Telefon</h3>
              <p className="text-sm text-white/80 font-mono mb-2">{settings.phoneDisplay}</p>
              <a
                href={`tel:${settings.phoneRaw}`}
                className="text-xs text-[#C5A059] hover:underline font-medium"
              >
                Zəng edin →
              </a>
            </div>

            {/* WhatsApp */}
            <div className="bg-[#121212] p-6 border border-white/10 hover:border-[#25D366]/50 rounded-sm transition-colors">
              <MessageCircle className="w-5 h-5 text-[#25D366] mb-3" />
              <h3 className="text-xs uppercase tracking-wider text-white font-semibold mb-1">WhatsApp</h3>
              <p className="text-sm text-white/80 mb-2">Sürətli cavab</p>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#25D366] hover:underline font-medium"
              >
                Mesaj yazın →
              </a>
            </div>

            {/* Address */}
            <div className="bg-[#121212] p-6 border border-white/10 hover:border-[#C5A059]/50 rounded-sm transition-colors">
              <MapPin className="w-5 h-5 text-[#C5A059] mb-3" />
              <h3 className="text-xs uppercase tracking-wider text-white font-semibold mb-1">Ünvan</h3>
              <p className="text-sm text-white/80 mb-1">{settings.address}</p>
              <span className="text-[11px] text-white/50">Görüşlər üçün öncədən yazılmaq tövsiyə olunur</span>
            </div>

            {/* Instagram */}
            <div className="bg-[#121212] p-6 border border-white/10 hover:border-[#C5A059]/50 rounded-sm transition-colors">
              <Instagram className="w-5 h-5 text-[#C5A059] mb-3" />
              <h3 className="text-xs uppercase tracking-wider text-white font-semibold mb-1">Instagram</h3>
              <p className="text-sm text-white/80 mb-2">@dreamartevents</p>
              <a
                href="https://www.instagram.com/dreamartevents?stkn=M2Z2dTZuZDJmOW0y"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#C5A059] hover:underline font-medium"
              >
                Səhifəyə keç →
              </a>
            </div>
          </div>
        </section>

        {/* Embedded Interactive Quote Section */}
        <QuoteSection />
      </div>
    </>
  );
};
