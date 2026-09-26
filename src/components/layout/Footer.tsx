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
    { label: 'İşlədiyimiz Məkanlar', path: '/restoranlar' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Xidmətlər', path: '/xidmetler' },
    { label: 'Indian Weddings', path: '/indian-wedding-azerbaijan' },
    { label: 'Destination Weddings', path: '/destination-wedding-azerbaijan' },
    { label: 'Haqqımızda', path: '/haqqimizda' },
    { label: 'Əlaqə', path: '/elaqe' },
  ];

  return (
    <footer id="site-footer" className="bg-[#0A0A0A] text-white pt-14 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center space-y-8 pb-10 border-b border-white/10">
          {/* Logo with DA Monogram matching mockup */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm border border-[#C5A059]/60 bg-gradient-to-br from-[#1C1A14] to-[#0D0D0D] flex items-center justify-center shrink-0">
              <span className="font-serif text-xl font-bold tracking-tighter text-[#E5C378]">
                DA
              </span>
            </div>
            <div className="text-left">
              <span className="font-serif text-xl tracking-[0.18em] text-[#FAF8F5] uppercase font-medium block leading-none">
                DREAMART WEDDINGS
              </span>
              <span className="text-[8px] tracking-[0.32em] text-[#C5A059] uppercase font-sans mt-1 block">
                TƏDBİR DEKORASİYASI
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
              href="https://www.instagram.com/dreamartevents?stkn=M2Z2dTZuZDJmOW0y"
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

          {/* Emotional Tagline from mockup */}
          <p className="font-serif italic text-sm text-white/60">
            Xüsusi günlər həmişə daha gözəldir ♡
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
