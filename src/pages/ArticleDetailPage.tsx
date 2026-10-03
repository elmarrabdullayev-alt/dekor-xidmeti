import React, { useState } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { getArticleBySlug, getRelatedArticles } from '../data/articles';
import { resolveArticleImage, isArticleIndexable } from '../lib/articleHelper';
import { getArticleSchema, getFaqPageSchema, getBreadcrumbSchema } from '../lib/structuredData';
import { store } from '../lib/store';
import {
  ChevronRight,
  Calendar,
  Clock,
  User,
  Share2,
  CheckCircle2,
  ChevronDown,
  MessageCircle,
  Sparkles,
  ArrowRight,
  BookOpen,
  ArrowLeft,
  Building2
} from 'lucide-react';

interface ArticleDetailPageProps {
  slug: string;
  navigate: (path: string) => void;
  onOpenQuoteModal?: (source?: string) => void;
}

export const ArticleDetailPage: React.FC<ArticleDetailPageProps> = ({
  slug,
  navigate,
  onOpenQuoteModal
}) => {
  const article = getArticleBySlug(slug);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const settings = store.getSettings();

  if (!article) {
    return (
      <div className="bg-[#0B0B0B] text-white min-h-[70vh] flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] mb-4">
          Məqalə Tapılmadı
        </h1>
        <p className="text-white/60 text-sm max-w-md mb-8">
          Axtardığınız məqalə mövcud deyil və ya ünvanı dəyişdirilmiş ola bilər.
        </p>
        <button
          onClick={() => navigate('/meqaleler')}
          className="px-6 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#DFC17B] text-[#0B0B0B] font-semibold text-xs uppercase tracking-widest rounded-sm cursor-pointer"
        >
          Bütün Məqalələrə Qayıt
        </button>
      </div>
    );
  }

  const isIndexable = isArticleIndexable(article);
  const imgData = resolveArticleImage(article);
  const relatedArticles = getRelatedArticles(article.slug, article.categorySlug);

  // Retrieve factual related decor projects
  const allDecors = store.getDecors();
  const matchedProjects = (article.relatedProjects || [])
    .map(projSlug => allDecors.find(d => d.slug === projSlug || d.id === projSlug))
    .filter(Boolean);

  // Retrieve factual related venues
  const allVenues = store.getVenues();
  const matchedVenues = (article.relatedVenues || [])
    .map(vSlug => allVenues.find(v => v.slug === vSlug || v.id === vSlug))
    .filter(Boolean);

  const canonicalUrl = `https://dreamartweddings.com/meqaleler/${article.slug}`;

  const breadcrumbs = [
    { name: 'Ana səhifə', url: 'https://dreamartweddings.com/' },
    { name: 'Məqalələr', url: 'https://dreamartweddings.com/meqaleler' },
    { name: article.title, url: canonicalUrl }
  ];

  const jsonLd: any[] = [
    getBreadcrumbSchema(breadcrumbs),
    getArticleSchema(article, canonicalUrl)
  ];

  if (article.faqs && article.faqs.length > 0) {
    jsonLd.push(getFaqPageSchema(article.faqs));
  }

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const whatsappMessage = `Salam, DreamArt Weddings! "${article.title}" məqalənizi oxudum və bu mövzuda tədbir dekorasiyası üçün məsləhət almaq istəyirəm.`;
  const whatsappUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  const renderRichText = (text: string) => {
    if (!text) return null;
    const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        const [, label, url] = match;
        if (url.startsWith('/')) {
          return (
            <a
              key={i}
              href={url}
              onClick={(e) => {
                e.preventDefault();
                navigate(url);
              }}
              className="text-[#C5A059] underline hover:text-[#DFC17B] transition-colors font-medium"
            >
              {label}
            </a>
          );
        }
        return (
          <a
            key={i}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#C5A059] underline hover:text-[#DFC17B] transition-colors font-medium"
          >
            {label}
          </a>
        );
      }
      return <React.Fragment key={i}>{part}</React.Fragment>;
    });
  };

  return (
    <div className="bg-[#0B0B0B] text-[#EAEAEA] min-h-screen">
      <SeoHead
        title={article.metaTitle || `${article.title} | DreamArt Weddings`}
        description={article.metaDescription || article.excerpt}
        canonicalPath={`/meqaleler/${article.slug}`}
        ogImage={imgData.url.startsWith('http') ? imgData.url : `https://dreamartweddings.com${imgData.url}`}
        jsonLd={jsonLd}
        noIndex={!isIndexable}
      />

      {/* Breadcrumb & Navigation Bar */}
      <section className="pt-24 pb-8 border-b border-white/10 bg-gradient-to-b from-[#141414] to-[#0B0B0B]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-white/50 mb-6 overflow-x-auto whitespace-nowrap py-1">
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#E5C378] transition-colors cursor-pointer shrink-0"
            >
              Ana səhifə
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <button
              onClick={() => navigate('/meqaleler')}
              className="hover:text-[#E5C378] transition-colors cursor-pointer shrink-0"
            >
              Məqalələr
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-white/30 shrink-0" />
            <span className="text-[#C5A059] font-medium truncate max-w-[200px] sm:max-w-none">
              {article.title}
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 text-xs text-white/60 mb-4">
            <span className="bg-[#C5A059]/15 border border-[#C5A059]/35 text-[#E5C378] px-2.5 py-1 rounded-sm uppercase tracking-wider text-[11px] font-medium">
              {article.category}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
              {new Date(article.publishDate).toLocaleDateString('az-AZ', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
              {article.readingTimeMinutes} dəqiqəlik oxu
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#FAF8F5] tracking-wide leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex items-center justify-between pt-4 border-t border-white/10 text-xs text-white/55">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#C5A059]" />
              <div>
                <span className="text-white/80 font-medium block">{article.author}</span>
                {article.authorRole && (
                  <span className="text-white/45 text-[11px]">{article.authorRole}</span>
                )}
              </div>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#25D366]/15 hover:bg-[#25D366]/25 border border-[#25D366]/30 text-[#25D366] font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Sual ver</span>
            </a>
          </div>
        </div>
      </section>

      {/* Main Article Content Container */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Hero Image */}
        <div className="mb-10 rounded-sm overflow-hidden border border-white/10 bg-[#121212] aspect-[16/9] relative shadow-2xl">
          <img
            src={imgData.url}
            alt={imgData.alt}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B]/80 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 text-xs text-white/70 italic bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-sm inline-block">
            {imgData.alt}
          </div>
        </div>

        {/* Direct Answer Featured Snippet Callout */}
        {article.directAnswer && (
          <div className="mb-12 p-6 sm:p-7 rounded-sm bg-gradient-to-br from-[#181611] to-[#121212] border-l-4 border-[#C5A059] border-y border-r border-white/10 shadow-lg">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#E5C378] font-mono mb-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>Qısa və Aydın Cavab</span>
            </div>
            <p className="text-sm sm:text-base text-[#FAF8F5] leading-relaxed font-light">
              {renderRichText(article.directAnswer)}
            </p>
          </div>
        )}

        {/* Article Body Sections */}
        <div className="space-y-12 text-[#DADADA]">
          {article.sections.map((section, idx) => (
            <section key={section.id || idx} className="space-y-4">
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-light pt-2 pb-1 border-b border-white/10">
                {section.title}
              </h2>

              <p className="text-sm sm:text-base leading-relaxed text-white/80 font-light">
                {renderRichText(section.content)}
              </p>

              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2.5 my-4 pl-1">
                  {section.bulletPoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-white/75 font-light">
                      <CheckCircle2 className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                      <span>{renderRichText(point)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {section.callout && (
                <div className="my-5 p-4 rounded-sm bg-[#151515] border border-[#C5A059]/30 text-xs sm:text-sm text-[#E5C378] italic leading-relaxed">
                  {renderRichText(section.callout)}
                </div>
              )}

              {section.subSections && section.subSections.length > 0 && (
                <div className="space-y-5 pt-3">
                  {section.subSections.map((sub, sIdx) => (
                    <div key={sIdx} className="pl-4 border-l-2 border-[#C5A059]/40 space-y-2">
                      <h3 className="font-serif text-lg sm:text-xl text-[#FAF8F5] font-light">
                        {sub.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                        {renderRichText(sub.content)}
                      </p>
                      {sub.bulletPoints && (
                        <ul className="space-y-1.5 pt-1">
                          {sub.bulletPoints.map((bp, bpIdx) => (
                            <li key={bpIdx} className="text-xs text-white/70 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
                              <span>{renderRichText(bp)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>

        {/* WhatsApp Direct Inquiry Banner */}
        <div className="my-14 p-6 sm:p-8 rounded-sm bg-gradient-to-r from-[#121212] via-[#1A1812] to-[#121212] border border-[#C5A059]/40 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-serif text-xl sm:text-2xl text-[#FAF8F5] font-light mb-2">
              Bu mövzuda sualınız var?
            </h3>
            <p className="text-xs sm:text-sm text-white/70 max-w-md font-light leading-relaxed">
              Məkanınızın ölçülərinə uyğun xüsusi dekorasiya seçimi və smeta hesabı üçün mütəxəssisimizlə dərhal əlaqə saxlayın.
            </p>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba59] text-black font-semibold text-xs uppercase tracking-widest rounded-sm transition-colors flex items-center gap-2 shrink-0 shadow-lg shadow-[#25D366]/20"
          >
            <MessageCircle className="w-4 h-4" />
            <span>WhatsApp ilə Əlaqə</span>
          </a>
        </div>

        {/* Frequently Asked Questions (FAQ) Section */}
        {article.faqs && article.faqs.length > 0 && (
          <section className="my-14 pt-10 border-t border-white/10">
            <div className="mb-6">
              <span className="text-xs text-[#C5A059] uppercase tracking-widest font-mono">
                Tez-tez Verilən Suallar
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-light mt-1">
                Faydalı Cavablar
              </h2>
            </div>

            <div className="space-y-3">
              {article.faqs.map((faq, fIdx) => {
                const isOpen = openFaqIndex === fIdx;
                return (
                  <div
                    key={fIdx}
                    className="border border-white/10 bg-[#121212] rounded-sm overflow-hidden transition-colors hover:border-[#C5A059]/30"
                  >
                    <button
                      onClick={() => toggleFaq(fIdx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-serif text-base sm:text-lg text-[#FAF8F5] font-normal">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#C5A059] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-white/75 font-light leading-relaxed border-t border-white/5">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Relevant Services Internal Linking Section */}
        {article.relatedServices && article.relatedServices.length > 0 && (
          <section className="my-14 pt-10 border-t border-white/10">
            <div className="mb-6">
              <span className="text-xs text-[#C5A059] uppercase tracking-widest font-mono">
                Əlaqəli Xidmətlər
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-light mt-1">
                Mövzu üzrə Peşəkar Xidmətlərimiz
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {article.relatedServices.map((svc) => (
                <div
                  key={svc.slug}
                  onClick={() => navigate(`/${svc.slug}`)}
                  className="p-5 bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 hover:border-[#C5A059]/50 rounded-sm transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <h3 className="font-serif text-lg text-[#FAF8F5] group-hover:text-[#E5C378] transition-colors mb-2">
                      {svc.title}
                    </h3>
                    <p className="text-xs text-white/60 font-light leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-xs text-[#C5A059] font-medium">
                    <span>Xidmətə Bax</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Factual Related Decor Projects */}
        {matchedProjects.length > 0 && (
          <section className="my-14 pt-10 border-t border-white/10">
            <div className="mb-6">
              <span className="text-xs text-[#C5A059] uppercase tracking-widest font-mono">
                Real Layihələrimiz
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-light mt-1">
                Təcrübəmizdən Nümunələr
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {matchedProjects.map((proj) => {
                if (!proj) return null;
                return (
                  <div
                    key={proj.id}
                    onClick={() => navigate(`/dekorlar/${proj.slug}`)}
                    className="group bg-[#121212] border border-white/10 hover:border-[#C5A059]/50 rounded-sm overflow-hidden transition-all cursor-pointer"
                  >
                    <div className="aspect-[16/10] overflow-hidden bg-[#1A1A1A]">
                      <img
                        src={proj.mainImage}
                        alt={proj.imageAltText || proj.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="text-[11px] text-[#C5A059] uppercase tracking-wider mb-1 font-mono">
                        {proj.categoryName} • {proj.city}
                      </div>
                      <h3 className="font-serif text-lg text-[#FAF8F5] group-hover:text-[#E5C378] transition-colors line-clamp-1 mb-2">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-white/60 line-clamp-2 font-light leading-relaxed mb-3">
                        {proj.shortDescription}
                      </p>
                      <div className="flex items-center text-xs text-[#E5C378] font-medium">
                        <span>Layihəyə Bax</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Factual Related Venues */}
        {matchedVenues.length > 0 && (
          <section className="my-14 pt-10 border-t border-white/10">
            <div className="mb-6">
              <span className="text-xs text-[#C5A059] uppercase tracking-widest font-mono">
                Tədbir Məkanları
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-light mt-1">
                İşlədiyimiz Restoran və Şadlıq Sarayları
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {matchedVenues.map((venue) => {
                if (!venue) return null;
                return (
                  <div
                    key={venue.id}
                    onClick={() => navigate(`/restoranlar/${venue.slug}`)}
                    className="p-5 bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 hover:border-[#C5A059]/40 rounded-sm transition-all cursor-pointer group flex items-start gap-4"
                  >
                    <div className="w-16 h-16 rounded-sm overflow-hidden bg-[#222] shrink-0">
                      <img
                        src={venue.mainImage}
                        alt={venue.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[11px] text-[#C5A059] mb-1">
                        <Building2 className="w-3 h-3" />
                        <span>{venue.city}</span>
                      </div>
                      <h3 className="font-serif text-base text-[#FAF8F5] group-hover:text-[#E5C378] transition-colors truncate">
                        {venue.name}
                      </h3>
                      <p className="text-xs text-white/55 line-clamp-1 font-light mt-1">
                        {venue.shortDescription}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Other Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="my-14 pt-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-2xl text-[#FAF8F5] font-light">
                Digər Faydalı Məqalələr
              </h2>
              <button
                onClick={() => navigate('/meqaleler')}
                className="text-xs text-[#C5A059] hover:text-[#E5C378] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Hamısına bax</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedArticles.map((relArt) => {
                const relImg = resolveArticleImage(relArt);
                return (
                  <div
                    key={relArt.id}
                    onClick={() => navigate(`/meqaleler/${relArt.slug}`)}
                    className="group p-4 bg-[#121212] border border-white/10 hover:border-[#C5A059]/40 rounded-sm transition-all cursor-pointer flex gap-4 items-center"
                  >
                    <div className="w-20 h-20 rounded-sm overflow-hidden bg-[#222] shrink-0">
                      <img
                        src={relImg.url}
                        alt={relArt.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-[#C5A059] uppercase tracking-wider block mb-1">
                        {relArt.category}
                      </span>
                      <h3 className="font-serif text-base text-[#FAF8F5] group-hover:text-[#E5C378] transition-colors line-clamp-2 leading-snug">
                        {relArt.title}
                      </h3>
                      <span className="text-[11px] text-white/45 mt-1 block">
                        {relArt.readingTimeMinutes} dəqiqəlik oxu
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Bottom Back Button */}
        <div className="pt-8 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={() => navigate('/meqaleler')}
            className="inline-flex items-center gap-2 text-xs text-white/70 hover:text-[#E5C378] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Məqalələr siyahısına qayıt</span>
          </button>

          <button
            onClick={() => onOpenQuoteModal ? onOpenQuoteModal(`Məqalə: ${article.title}`) : navigate('/elaqe')}
            className="px-5 py-2.5 bg-gradient-to-r from-[#C5A059] to-[#DFC17B] text-[#0B0B0B] font-semibold text-xs uppercase tracking-widest rounded-sm hover:opacity-95 transition-opacity cursor-pointer"
          >
            Sifariş Et
          </button>
        </div>
      </article>
    </div>
  );
};
