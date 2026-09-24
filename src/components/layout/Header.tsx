import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, ShieldCheck, Search } from 'lucide-react';
import { store } from '../../lib/store';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenQuoteModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate, onOpenQuoteModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
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
    { label: 'Restoranlar', path: '/restoranlar' },
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/dekorlar?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
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
          ? 'bg-[#0B0B0A]/92 backdrop-blur-lg shadow-[0_6px_30px_rgba(0,0,0,0.65)] border-b border-[#C5A059]/25 py-0'
          : 'bg-[#0B0B0A]/80 backdrop-blur-md shadow-[0_4px_25px_rgba(0,0,0,0.4)] border-b border-[#C5A059]/20 py-1'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with DA Monogram & Atelier Wordmark */}
          <button
            id="brand-logo-button"
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer"
          >
            {/* Elegant Monogram DA: Refined, restrained, no excessive glow */}
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xs border border-[#C5A059]/40 bg-[#141310] flex items-center justify-center shrink-0 shadow-sm group-hover:border-[#C5A059]/75 transition-colors duration-300">
              <span className="font-serif text-base sm:text-lg font-normal tracking-tight text-[#E5C378] group-hover:text-[#FAF8F5] transition-colors select-none">
                DA
              </span>
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-cinzel text-base sm:text-[17px] tracking-[0.24em] text-[#FAF8F5] uppercase font-semibold group-hover:text-[#E5C378] transition-colors duration-300 leading-none">
                  DREAMART
                </span>
                <span className="font-script text-base sm:text-lg text-[#C5A059] opacity-90 group-hover:opacity-100 transition-opacity">
                  Weddings
                </span>
              </div>
              <span className="text-[8px] sm:text-[8.5px] tracking-[0.38em] text-[#C5A059]/75 uppercase font-sans mt-1 font-light flex items-center gap-1">
                <span>ZÖVQLÜ TƏDBİR DEKORU</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation with restrained dark luxury pill container */}
          <nav className="hidden lg:flex items-center space-x-1.5 xl:space-x-2 bg-[#141310]/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-[#C5A059]/20 shadow-inner">
            {navLinks.map((link) => {
              const active = isCurrentActive(link.path);
              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.path.replace(/[^a-z0-9]/g, '') || 'home'}`}
                  onClick={() => handleNav(link.path)}
                  className={`relative transition-all duration-300 ease-out px-3.5 py-1.5 rounded-full text-xs tracking-wide cursor-pointer ${
                    active
                      ? 'bg-[#C5A059]/12 text-[#F5E6CA] border border-[#C5A059]/35 font-medium shadow-[0_0_10px_rgba(197,160,89,0.12)]'
                      : 'text-[#F5F2EB]/90 hover:text-[#E5C378] hover:bg-[#C5A059]/5 border border-transparent'
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {link.label}
                    {active && <span className="w-1 h-1 rounded-full bg-[#D4AF37]" />}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Header Action CTA: Refined Phone Pill + Golden Button */}
          <div className="hidden sm:flex items-center space-x-3.5">
            <a
              href={`tel:${settings.phoneRaw}`}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#12110E]/60 border border-[#C5A059]/30 hover:border-[#C5A059]/70 text-[#F5F2EB]/90 hover:text-[#FAF8F5] hover:shadow-[0_0_12px_rgba(197,160,89,0.14)] text-xs font-mono transition-all duration-300 group"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059] group-hover:scale-105 transition-transform duration-300" />
              <span className="tracking-wider">{settings.phoneDisplay}</span>
            </a>

            <button
              id="header-cta-quote-button"
              onClick={onOpenQuoteModal}
              className="relative group bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#DFC17B] text-[#0B0B0A] px-5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-[0_2px_14px_rgba(197,160,89,0.28)] hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span className="relative z-10 font-sans">Qiymət təklifi al</span>
            </button>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center space-x-2.5 lg:hidden">
            <button
              id="mobile-quote-btn"
              onClick={onOpenQuoteModal}
              className="bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0B0B0A] px-3.5 py-1.5 rounded-full text-xs font-semibold hover:from-[#D4AF37] hover:to-[#DFC17B] sm:hidden shadow-sm"
            >
              Təklif al
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F5F2EB]/80 hover:text-[#FAF8F5] focus:outline-hidden rounded-full border border-[#C5A059]/30 hover:border-[#C5A059]/60 transition-colors bg-[#141310]/80"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#E5C378]" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Input Bar (Drops down when search clicked) */}
      {searchOpen && (
        <div className="bg-[#FAF8F5] border-t border-[#EBE4D8] px-4 py-3 animate-fadeIn">
          <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
            <Search className="w-4 h-4 text-[#8C7A6B] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Dekor, konsept və ya şəhər axtarın (məs: toy, nişan, Qəbələ)..."
              autoFocus
              className="w-full bg-transparent border-none text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C7A6B] focus:outline-hidden py-1"
            />
            <button
              type="submit"
              className="bg-[#B8925A] text-white text-xs px-4 py-1.5 rounded-md hover:bg-[#A67E48] transition-colors shrink-0"
            >
              Axtar
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-[#8C7A6B] hover:text-[#1A1A1A] p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-[#0C0C0B]/98 backdrop-blur-xl border-t border-[#C5A059]/20 z-50 flex flex-col justify-between px-6 py-8 overflow-y-auto animate-fadeIn">
          <div className="space-y-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium pb-2 border-b border-[#C5A059]/15">
              Naviqasiya
            </div>
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => {
                const active = isCurrentActive(link.path);
                return (
                  <button
                    key={link.path}
                    onClick={() => handleNav(link.path)}
                    className={`text-left text-base font-serif tracking-wide transition-all duration-300 py-2.5 px-3 rounded-sm ${
                      active
                        ? 'bg-[#C5A059]/12 text-[#E5C378] border-l-2 border-[#C5A059] font-medium pl-3.5'
                        : 'text-[#F5F2EB]/80 hover:text-[#FAF8F5] hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-6 border-t border-[#C5A059]/15 space-y-4">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuoteModal();
              }}
              className="w-full bg-gradient-to-r from-[#C5A059] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#DFC17B] text-[#0B0B0A] py-3 rounded-full text-xs font-semibold tracking-wider uppercase text-center shadow-md transition-all"
            >
              Qiymət təklifi al
            </button>
            <div className="flex items-center justify-between text-xs text-[#F5F2EB]/70 pt-2">
              <a href={`tel:${settings.phoneRaw}`} className="flex items-center space-x-2 text-[#F5F2EB]/90 hover:text-[#C5A059] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-mono">{settings.phoneDisplay}</span>
              </a>
              <button
                onClick={() => handleNav('/admin')}
                className="flex items-center space-x-1 text-white/50 hover:text-[#C5A059] transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
