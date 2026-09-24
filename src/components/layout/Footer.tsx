import React from 'react';
import { Phone, Instagram, Facebook, Youtube, MessageCircle, MapPin, ShieldCheck } from 'lucide-react';
import { store } from '../../lib/store';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const settings = store.getSettings();

  const handleNav = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Ana səhifə', path: '/' },
    { label: 'Dekorlar', path: '/dekorlar' },
    { label: 'Restoranlar', path: '/restoranlar' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Xidmətlər', path: '/xidmetler' },
    { label: 'Haqqımızda', path: '/haqqimizda' },
    { label: 'Əlaqə', path: '/elaqe' },
  ];

  return (
    <footer id="site-footer" className="bg-[#0A0A0A] text-white pt-14 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8 pb-10 border-b border-white/10">
          {/* Logo with DA Monogram & Atelier Wordmark */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-10 h-10 rounded-sm border border-[#C5A059]/40 bg-gradient-to-br from-[#1C1A14] via-[#12110E] to-[#0A0A0A] flex items-center justify-center shrink-0 shadow-sm">
              <span className="font-serif text-lg font-light tracking-tight text-[#E5C378]">
                DA
              </span>
              <span className="absolute -inset-0.5 rounded-sm border border-[#C5A059]/10 pointer-events-none" />
            </div>
            <div className="text-left">
              <div className="flex items-baseline gap-1.5">
                <span className="font-cinzel text-base tracking-[0.22em] text-[#FAF8F5] uppercase font-semibold leading-none">
                  DREAMART
                </span>
                <span className="font-script text-base text-[#C5A059]">
                  Weddings
                </span>
              </div>
              <span className="text-[8px] tracking-[0.36em] text-[#C5A059]/80 uppercase font-sans mt-1 block font-light">
                ZÖVQLÜ TƏDBİR DEKORU
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs sm:text-[13px] text-white/80">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className="hover:text-[#E5C378] transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Social Icons matching mockup: Instagram, Facebook, YouTube, WhatsApp */}
          <div className="flex items-center space-x-4">
            <a
              href={`https://instagram.com/${settings.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/15 hover:border-[#C5A059] text-white/80 hover:text-[#E5C378] flex items-center justify-center transition-all bg-[#121212]"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/15 hover:border-[#C5A059] text-white/80 hover:text-[#E5C378] flex items-center justify-center transition-all bg-[#121212]"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/15 hover:border-[#C5A059] text-white/80 hover:text-[#E5C378] flex items-center justify-center transition-all bg-[#121212]"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4" />
            </a>
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-white/15 hover:border-[#25D366] text-white/80 hover:text-[#25D366] flex items-center justify-center transition-all bg-[#121212]"
              aria-label="WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          </div>

          {/* Emotional Tagline */}
          <p className="font-script text-2xl sm:text-3xl text-[#E5C378]/90 tracking-wide select-none">
            Xüsusi günlər həmişə daha gözəldir...
          </p>
        </div>

        {/* Bottom Bar matching mockup */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 space-y-3 sm:space-y-0 font-light">
          <p>© {new Date().getFullYear()} DreamArt Events. Bütün hüquqlar qorunur.</p>

          <div className="flex items-center gap-1.5 text-white/70">
            <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Azərbaycanın hər yerində sizinləyik.</span>
          </div>

          <button
            onClick={() => handleNav('/admin')}
            className="flex items-center gap-1 text-white/40 hover:text-[#C5A059] transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
