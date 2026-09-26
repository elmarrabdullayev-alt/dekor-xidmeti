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
          ? 'bg-[#0B0B0B]/95 backdrop-blur-md shadow-md border-b border-[#C5A059]/20'
          : 'bg-[#0B0B0B] border-b border-[#C5A059]/15'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo with DA Monogram matching mockup */}
          <button
            id="brand-logo-button"
            onClick={() => handleNav('/')}
            className="flex items-center gap-3 text-left group focus:outline-hidden cursor-pointer"
          >
            {/* Elegant Monogram DA */}
            <div className="w-10 h-10 rounded-sm border border-[#C5A059]/50 bg-gradient-to-br from-[#1C1A14] to-[#0D0D0D] flex items-center justify-center shrink-0 shadow-sm group-hover:border-[#C5A059] transition-colors">
              <span className="font-serif text-xl font-bold tracking-tighter text-[#E5C378] group-hover:text-white transition-colors select-none">
                DA
              </span>
            </div>

            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl tracking-[0.18em] text-[#FAF8F5] uppercase font-medium group-hover:text-[#E5C378] transition-colors leading-none">
                DREAMART WEDDINGS
              </span>
              <span className="text-[8px] sm:text-[9px] tracking-[0.32em] text-[#C5A059] uppercase font-sans mt-1 font-normal">
                TƏDBİR DEKORASİYASI
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-5 xl:space-x-7 text-[14px] xl:text-[15px] font-sans font-medium tracking-[0.02em]">
            {navLinks.map((link) => {
              const active = isCurrentActive(link.path);
              return (
                <button
                  key={link.path}
                  id={`nav-link-${link.path.replace(/[^a-z0-9]/g, '') || 'home'}`}
                  onClick={() => handleNav(link.path)}
                  className={`relative transition-colors duration-200 py-1.5 whitespace-nowrap cursor-pointer ${
                    active
                      ? 'text-[#E5C378] font-semibold'
                      : 'text-[#EAE6DF]/85 hover:text-white'
                  }`}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C5A059] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Header Action CTA: Desktop (Phone Pill + Golden Button with dedicated spacing from "Əlaqə") */}
          <div className="hidden lg:flex items-center shrink-0 ml-6 xl:ml-10 pl-5 xl:pl-8 border-l border-white/15 space-x-3 xl:space-x-4">
            <a
              href={`tel:${settings.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-sm bg-[#161616] border border-[#C5A059]/35 hover:border-[#C5A059] text-white/95 text-[13px] font-sans font-medium whitespace-nowrap shrink-0 transition-colors leading-none"
            >
              <Phone className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
              <span className="whitespace-nowrap tracking-wide leading-none">{settings.phoneDisplay}</span>
            </a>

            <button
              id="header-cta-quote-button"
              onClick={onOpenQuoteModal}
              className="bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-5 xl:px-6 py-2.5 rounded-sm text-xs xl:text-[13px] font-medium tracking-wide uppercase shadow-sm hover:shadow transition-all duration-300 cursor-pointer whitespace-nowrap shrink-0 leading-none"
            >
              Qiymət təklifi al
            </button>
          </div>

          {/* Tablet & Mobile Header Right Actions (Prevents overlap across breakpoints) */}
          <div className="flex items-center space-x-2.5 lg:hidden shrink-0">
            {/* Tablet phone link (hidden on small mobile, visible on sm and md) */}
            <a
              href={`tel:${settings.phoneRaw}`}
              className="hidden sm:inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-sm bg-[#161616] border border-[#C5A059]/30 text-white/90 text-xs font-sans font-medium whitespace-nowrap leading-none shrink-0"
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
              className="p-2 text-white/80 hover:text-white focus:outline-hidden shrink-0"
              aria-label="Menyu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
        <div className="lg:hidden fixed inset-x-0 top-20 bottom-0 bg-[#0E0E0E] border-t border-[#C5A059]/20 z-50 flex flex-col justify-between px-6 py-8 overflow-y-auto animate-fadeIn">
          <div className="space-y-6">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] font-medium pb-2 border-b border-white/10">
              Naviqasiya
            </div>
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`text-left text-base font-serif tracking-wide transition-colors ${
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
              className="w-full bg-[#C5A059] text-[#0B0B0B] py-3 rounded-sm text-xs font-medium tracking-wider uppercase text-center shadow-sm hover:bg-[#D4AF37]"
            >
              Qiymət təklifi al
            </button>
            <div className="flex items-center justify-between text-xs text-white/70 pt-2">
              <a href={`tel:${settings.phoneRaw}`} className="flex items-center space-x-2 hover:text-[#C5A059]">
                <Phone className="w-3.5 h-3.5 text-[#C5A059]" />
                <span className="font-mono">{settings.phoneDisplay}</span>
              </a>
              <button
                onClick={() => handleNav('/admin')}
                className="flex items-center space-x-1 text-white/60 hover:text-[#C5A059]"
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
