import React, { useState, useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { QuoteModal } from './components/common/QuoteModal';
import { HomePage } from './pages/HomePage';
import { DecorsCatalogPage } from './pages/DecorsCatalogPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { CategorySeoPage } from './pages/CategorySeoPage';
import { LocalSeoPage } from './pages/LocalSeoPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';
import { VenuesCatalogPage } from './pages/VenuesCatalogPage';
import { VenueDetailPage } from './pages/VenueDetailPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { store } from './lib/store';
import { DecorItem, DecorCategorySlug } from './types';
import { CATEGORIES } from './data/categories';
import { MessageCircle } from 'lucide-react';

export default function App() {
  // Client-side router state from window.location.pathname
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  // Reactive store state
  const [decors, setDecors] = useState<DecorItem[]>(() => store.getDecors());
  const settings = store.getSettings();

  // Quote modal state
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [quoteDecorName, setQuoteDecorName] = useState<string | undefined>(undefined);

  // Subscribe to store updates (Admin edits, deletions, additions)
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setDecors(store.getDecors());
    });
    return () => unsubscribe();
  }, []);

  // Listen to browser popstate (back/forward)
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Custom navigate helper
  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQuoteModal = (decorName?: string) => {
    setQuoteDecorName(decorName);
    setIsQuoteModalOpen(true);
  };

  const handleCloseQuoteModal = () => {
    setIsQuoteModalOpen(false);
    setQuoteDecorName(undefined);
  };

  // Route matching logic
  const renderRoute = () => {
    const path = currentPath.replace(/\/$/, '') || '/';

    const publishedDecors = decors.filter(d => d.status === 'published' || d.isPublished !== false);

    // 1. Admin Page (/admin, /admin/restoranlar, /admin/restoranlar/yeni, /admin/restoranlar/:id)
    if (path.startsWith('/admin')) {
      return <AdminPage navigate={navigate} currentPath={path} />;
    }

    // 2. Venues Catalog Page (/restoranlar)
    if (path === '/restoranlar') {
      return (
        <VenuesCatalogPage
          navigate={navigate}
          onOpenQuoteModal={handleOpenQuoteModal}
        />
      );
    }

    // 3. Venue Detail Page (/restoranlar/:slug)
    if (path.startsWith('/restoranlar/')) {
      const slug = path.replace('/restoranlar/', '');
      return (
        <VenueDetailPage
          slug={slug}
          navigate={navigate}
          onOpenQuoteModal={handleOpenQuoteModal}
        />
      );
    }

    // 4. Home Page
    if (path === '/') {
      return (
        <HomePage
          decors={publishedDecors}
          navigate={navigate}
          onOpenQuoteModal={handleOpenQuoteModal}
        />
      );
    }

    // 3. Decors Catalog Page
    if (path === '/dekorlar') {
      return (
        <DecorsCatalogPage
          decors={publishedDecors}
          navigate={navigate}
          onOpenQuoteModal={handleOpenQuoteModal}
        />
      );
    }

    // 4. Project Detail Page (/dekorlar/:slug)
    if (path.startsWith('/dekorlar/')) {
      const slug = path.replace('/dekorlar/', '');
      return (
        <ProjectDetailPage
          slug={slug}
          navigate={navigate}
          onOpenQuoteModal={handleOpenQuoteModal}
        />
      );
    }

    // 5. Lookbook / Portfolio
    if (path === '/portfolio') {
      return (
        <PortfolioPage
          decors={publishedDecors}
          navigate={navigate}
          onOpenQuoteModal={handleOpenQuoteModal}
        />
      );
    }

    // 6. Services Page
    if (path === '/xidmetler') {
      return (
        <ServicesPage
          navigate={navigate}
          onOpenQuoteModal={handleOpenQuoteModal}
        />
      );
    }

    // 7. About Page
    if (path === '/haqqimizda') {
      return (
        <AboutPage
          navigate={navigate}
          onOpenQuoteModal={() => handleOpenQuoteModal('Ümumi Əlaqə')}
        />
      );
    }

    // 8. Contact Page
    if (path === '/elaqe') {
      return (
        <ContactPage
          onOpenQuoteModal={() => handleOpenQuoteModal('Ümumi Əlaqə')}
        />
      );
    }

    // 9. Category or Local SEO Routes
    // Format: /:categorySlug or /:categorySlug/:citySlug
    const parts = path.split('/').filter(Boolean);
    if (parts.length === 1) {
      const potentialCatSlug = parts[0] as DecorCategorySlug;
      const matchedCat = CATEGORIES.find(c => c.slug === potentialCatSlug);
      if (matchedCat) {
        return (
          <CategorySeoPage
            categorySlug={potentialCatSlug}
            decors={publishedDecors}
            navigate={navigate}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        );
      }
    } else if (parts.length === 2) {
      const potentialCatSlug = parts[0] as DecorCategorySlug;
      const citySlug = parts[1];
      const matchedCat = CATEGORIES.find(c => c.slug === potentialCatSlug);
      if (matchedCat) {
        return (
          <LocalSeoPage
            categorySlug={potentialCatSlug}
            citySlug={citySlug}
            decors={publishedDecors}
            navigate={navigate}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        );
      }
    }

    // 10. Fallback 404
    return <NotFoundPage navigate={navigate} />;
  };

  const isAdmin = currentPath === '/admin';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1C1C1C] font-sans antialiased selection:bg-[#C5A059] selection:text-[#FAF9F6]">
      {/* Global Header (Hidden on Admin page for clean focused workspace) */}
      {!isAdmin && (
        <Header
          currentPath={currentPath}
          navigate={navigate}
          onOpenQuoteModal={() => handleOpenQuoteModal('Header Müraciəti')}
        />
      )}

      {/* Main Dynamic View */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Global Footer (Hidden on Admin page) */}
      {!isAdmin && (
        <Footer navigate={navigate} />
      )}

      {/* Floating WhatsApp Action Button */}
      {!isAdmin && (
        <a
          href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Salam, Aurora Event Decor! Tədbir dekorasiyası ilə bağlı məlumat almaq istəyirəm.')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-40 bg-[#1C1C1C] hover:bg-[#C5A059] text-[#FAF9F6] p-3.5 border border-[#C5A059]/30 shadow-xl transition-all duration-300 flex items-center justify-center group"
          aria-label="WhatsApp ilə əlaqə"
          title="WhatsApp ilə əlaqə"
        >
          <MessageCircle className="w-5 h-5 text-[#C5A059] group-hover:text-[#FAF9F6] transition-colors" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-2.5 transition-all duration-300 text-[10px] tracking-[0.2em] uppercase font-medium">
            WhatsApp ilə yazın
          </span>
        </a>
      )}

      {/* Quote Modal */}
      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={handleCloseQuoteModal}
        presetDecorName={quoteDecorName}
      />
    </div>
  );
}
