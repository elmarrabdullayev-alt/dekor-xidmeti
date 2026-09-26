import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, ShieldCheck, Instagram } from 'lucide-react';
import { store } from '../../lib/store';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate, onOpenQuoteModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const settings = store.getSettings();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Ana səhifə', path: '/' },
    { label: 'Dekorlar', path: '/dekorlar' },
    { label: 'İşlədiyimiz Məkanlar', path: '/restoranlar' },
    { label: 'Portfolio', path: '/portfolio' },
    { label: 'Xidmətlər', path: '/xidmetler' },
    { label: 'Haqqımızda', path: '/haqqimizda' },
    { label: 'Əlaqə', path: '/elaqe' },
  ];

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentActive = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      id="site-header"
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0B0B]/95 backdrop-blur-md shadow-lg border-b border-[#C5A059]/20'
          : 'bg-[#0B0B0B] border-b border-[#C5A059]/15'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[84px] sm:h-[88px]">
          {/* 1. Logo Area: DA icon with vertically stacked typography */}
          <button
            id="brand-logo-button"
            onClick={() => handleNav('/')}
            className="flex items-center gap-2.5 sm:gap-3 text-left group focus:outline-hidden cursor-pointer shrink-0"
          >
            {/* Elegant Monogram DA */}
            <div className="w-8.5 h-8.5 sm:w-9.5 sm:h-9.5 rounded-sm border border-[#C5A059]/40 bg-[#141414] flex items-center justify-center shrink-0 shadow-xs group-hover:border-[#C5A059] transition-colors">
              <span className="font-serif text-[14px] sm:text-[16px] font-bold tracking-tight text-[#E5C378] group-hover:text-white transition-colors select-none">
                DA
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="font-serif text-[13.5px] sm:text-[14.5px] xl:text-[15px] tracking-[0.18em] text-[#FAF8F5] uppercase font-semibold group-hover:text-[#E5C378] transition-colors whitespace-nowrap leading-tight">
                DREAMART
              </span>
              <span className="font-serif text-[10.5px] sm:text-[11.5px] xl:text-[12px] tracking-[0.24em] text-[#EAE6DF]/90 uppercase font-medium group-hover:text-[#E5C378] transition-colors whitespace-nowrap leading-tight">
                WEDDINGS
              </span>
            </div>
          </button>

          {/* 2. Desktop Navigation: Increased Spacing, Single Line, Elegant Underline */}
          <nav className="hidden lg:flex items-center flex-nowrap gap-5 xl:gap-8 2xl:gap-9 text-[14px] xl:text-[15px] font-sans font-medium tracking-[0.015em]">
            {navLinks.map((link) => {
              const active = isCurrentActive(link.path);
              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.path.replace(/[^a-z0-9]/g, '') || 'home'}`}
                  onClick={() => handleNav(link.path)}
                  className={`relative transition-colors duration-200 py-1.5 whitespace-nowrap cursor-pointer shrink-0 ${
                    active
                      ? 'text-[#E5C378] font-semibold'
                      : 'text-[#EAE6DF]/85 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-1.5 left-0 right-0 h-[1.5px] bg-[#C5A059] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* 3. Contact Area: Phone + CTA aligned on the right */}
          <div className="hidden lg:flex items-center shrink-0 ml-4 xl:ml-7 pl-4 xl:pl-7 border-l border-white/10 space-x-3 xl:space-x-3.5">
            <a
              href={`tel:${settings.phoneRaw}`}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#141414] border border-[#C5A059]/30 hover:border-[#C5A059] text-white/90 hover:text-white text-xs xl:text-[12.5px] font-mono tracking-wide whitespace-nowrap shrink-0 transition-colors leading-none"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="whitespace-nowrap leading-none">{settings.phoneDisplay}</span>
            </a>

            <button
              id="header-cta-quote-button"
              onClick={onOpenQuoteModal}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-3.5 xl:px-4.5 py-2 rounded-sm text-[11.5px] xl:text-xs font-medium tracking-wider uppercase shadow-xs hover:shadow transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 leading-none"
            >
              Qiymət təklifi al
            </button>
          </div>

          {/* 4. Tablet & Mobile Right Actions */}
          <div className="flex items-center space-x-2.5 lg:hidden shrink-0">
            {/* Tablet phone link (visible on sm and md screens) */}
            <a
              href={`tel:${settings.phoneRaw}`}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm bg-[#141414] border border-[#C5A059]/30 text-white/90 text-xs font-mono whitespace-nowrap leading-none shrink-0"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="whitespace-nowrap leading-none">{settings.phoneDisplay}</span>
            </a>

            {/* Quick quote button */}
            <button
              id="mobile-quote-btn"
              onClick={onOpenQuoteModal}
              className="bg-[#C5A059] text-[#0B0B0B] px-3.5 py-2 rounded-sm text-xs font-medium hover:bg-[#D4AF37] whitespace-nowrap shrink-0 leading-none"
            >
              Təklif al
            </button>

            {/* Hamburger menu button */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-white/80 hover:text-white focus:outline-hidden shrink-0 cursor-pointer"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[84px] sm:top-[88px] bottom-0 bg-[#0E0E0E] border-t border-[#C5A059]/20 z-50 flex flex-col justify-between px-6 py-8 overflow-y-auto animate-fadeIn">
          <div className="space-y-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium pb-2 border-b border-white/10 font-mono">
              Naviqasiya
            </div>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-left text-base font-serif tracking-wide transition-colors cursor-pointer ${
                    isCurrentActive(link.path)
                      ? 'text-[#E5C378] font-medium'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full bg-[#C5A059] text-[#0B0B0B] py-3 rounded-sm text-xs font-medium tracking-wider uppercase text-center shadow-xs hover:bg-[#D4AF37] cursor-pointer"
            >
              Qiymət təklifi al
            </button>
            <div className="flex items-center justify-between text-xs text-white/70 pt-2">
              <a href={`tel:${settings.phoneRaw}`} className="flex items-center space-x-2 hover:text-[#C5A059]">
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-mono">{settings.phoneDisplay}</span>
              </a>
              <a
                href="https://www.instagram.com/dreamartevents?stkn=M2Z2dTZuZDJmOW0y"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1.5 text-white/80 hover:text-[#E5C378] transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Instagram</span>
              </a>
              <button
                onClick={() => handleNav('/admin')}
                className="flex items-center space-x-1 text-white/60 hover:text-[#C5A059] cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
