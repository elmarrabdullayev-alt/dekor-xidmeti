import React, { useState, useMemo } from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { getAllArticles, ARTICLE_CATEGORIES } from '../data/articles';
import { resolveArticleImage } from '../lib/articleHelper';
import { getBreadcrumbSchema } from '../lib/structuredData';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, ChevronRight, Flower2, Heart, Award } from 'lucide-react';
import { Article } from '../types';

interface ArticlesHubPageProps {
  navigate: (path: string) => void;
  onOpenQuoteModal?: (source?: string) => void;
}

export const ArticlesHubPage: React.FC<ArticlesHubPageProps> = ({ navigate, onOpenQuoteModal }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const allArticles = useMemo(() => getAllArticles(), []);

  const filteredArticles = useMemo(() => {
    if (selectedCategory === 'all') return allArticles;
    return allArticles.filter(art => art.categorySlug === selectedCategory);
  }, [allArticles, selectedCategory]);

  const breadcrumbs = [
    { name: 'Ana səhifə', url: 'https://dreamartweddings.com/' },
    { name: 'Məqalələr', url: 'https://dreamartweddings.com/meqaleler' }
  ];

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      'name': 'Məqalələr | Toy, Nişan və Tədbir Dekoru üzrə Faydalı Məlumatlar',
      'description': 'Toy, nişan, xına və tədbir dekorunun planlanması, gül seçimi, fotozona və büdcə planlaması üzrə DreamArt Weddings peşəkar məqalələri və bələdçiləri.',
      'url': 'https://dreamartweddings.com/meqaleler'
    },
    getBreadcrumbSchema(breadcrumbs)
  ];

  const serviceShortcuts = [
    { name: 'Toy Dekoru', path: '/toy-dekoru', desc: 'Lüks toy səhnəsi və zal dekorasiyası' },
    { name: 'Nişan Dekoru', path: '/nisan-dekoru', desc: 'Ev və restoran üçün romantik fon tağları' },
    { name: 'Xına Dekoru', path: '/xina-dekoru', desc: 'Xına taxtı, bəzəkli süfrə və fotozonalar' },
    { name: 'Xonça Xidməti', path: '/xonca-xidmeti', desc: 'Eksklüziv büllur və çiçəkli xonçalar' },
    { name: 'Zal Dekoru', path: '/zal-dekoru', desc: 'Asma tavan dekorları və podyum dizaynı' }
  ];

  return (
    <div className="bg-[#0B0B0B] text-[#EAEAEA] min-h-screen">
      <SeoHead
        title="Məqalələr | Toy, Nişan və Tədbir Dekoru üzrə Faydalı Məlumatlar"
        description="Toy, nişan, xına və tədbir dekorunun planlanması, gül seçimi, fotozona və büdcə planlaması üzrə DreamArt Weddings peşəkar məqalələri və bələdçiləri."
        canonicalPath="/meqaleler"
        ogImage="https://dreamartweddings.com/images/dreamart-toy-dekoru-qizili-altar.webp"
        jsonLd={jsonLd}
        noIndex={false}
      />

      {/* Header Banner & Breadcrumbs */}
      <section className="relative pt-24 pb-16 border-b border-white/10 overflow-hidden bg-gradient-to-b from-[#141414] via-[#0D0D0D] to-[#0B0B0B]">
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center space-x-2 text-xs text-white/50">
            <button
              onClick={() => navigate('/')}
              className="hover:text-[#E5C378] transition-colors cursor-pointer"
            >
              Ana səhifə
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-white/30" />
            <span className="text-[#C5A059] font-medium">Məqalələr</span>
          </nav>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#C5A059]/10 border border-[#C5A059]/30 text-[#E5C378] text-xs uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Tədbir və Dekor Bələdçisi</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#FAF8F5] tracking-wide mb-5">
            Dekor və Tədbir Planlaması üzrə Məqalələr
          </h1>

          <p className="max-w-3xl text-sm sm:text-base text-white/70 leading-relaxed font-light">
            DreamArt Weddings dizaynerləri və floristləri tərəfindən hazırlanmış peşəkar bələdçilər. Toy, nişan, xına və korporativ mərasimləriniz üçün konsept seçimi, rəng harmoniyası, büdcə planlaması və trendlər haqqında ən dolğun məlumatlar.
          </p>

          {/* Category Filter Tabs */}
          <div className="mt-8 flex flex-wrap gap-2.5 pt-2">
            {ARTICLE_CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`px-4 py-2 text-xs sm:text-sm rounded-sm transition-all cursor-pointer font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-[#C5A059] to-[#DFC17B] text-[#0B0B0B] shadow-md shadow-[#C5A059]/20 font-semibold'
                      : 'bg-[#161616] text-white/70 hover:text-white border border-white/10 hover:border-[#C5A059]/40'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Articles List Section */}
      <section className="py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article: Article) => {
            const imgData = resolveArticleImage(article);
            return (
              <article
                key={article.id}
                className="group flex flex-col bg-[#121212] border border-white/10 hover:border-[#C5A059]/50 rounded-sm overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#C5A059]/5"
              >
                {/* Article Card Image */}
                <div
                  className="relative aspect-[16/10] overflow-hidden bg-[#1A1A1A] cursor-pointer"
                  onClick={() => navigate(`/meqaleler/${article.slug}`)}
                >
                  <img
                    src={imgData.url}
                    alt={imgData.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-black/30" />

                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 bg-[#0B0B0B]/85 backdrop-blur-sm border border-[#C5A059]/40 text-[#E5C378] text-[11px] font-medium px-2.5 py-1 rounded-sm uppercase tracking-wider">
                    {article.category}
                  </div>

                  {/* Reading Time */}
                  <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white/70 text-[11px] px-2 py-0.5 rounded-sm flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#C5A059]" />
                    <span>{article.readingTimeMinutes} dəq</span>
                  </div>
                </div>

                {/* Article Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 text-xs text-white/45 mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-[#C5A059]/70" />
                        {new Date(article.publishDate).toLocaleDateString('az-AZ', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>

                    <h2
                      onClick={() => navigate(`/meqaleler/${article.slug}`)}
                      className="font-serif text-xl sm:text-2xl text-[#FAF8F5] group-hover:text-[#E5C378] transition-colors line-clamp-2 mb-3 cursor-pointer leading-snug"
                    >
                      {article.title}
                    </h2>

                    <p className="text-sm text-white/65 leading-relaxed line-clamp-3 mb-4 font-light">
                      {article.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-white/50 truncate max-w-[170px]">
                      {article.author}
                    </span>

                    <button
                      onClick={() => navigate(`/meqaleler/${article.slug}`)}
                      className="inline-flex items-center gap-1.5 text-xs text-[#E5C378] hover:text-white font-medium transition-colors cursor-pointer group/btn"
                    >
                      <span>Oxu</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-16 bg-[#121212] rounded-sm border border-white/10">
            <p className="text-white/60 text-sm">Seçilmiş kateqoriyada hələ məqalə yoxdur.</p>
          </div>
        )}
      </section>

      {/* Relevant Services Internal Linking Showcase */}
      <section className="py-16 bg-[#0E0E0E] border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/10 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs text-[#C5A059] uppercase tracking-widest mb-2 font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                <span>DreamArt Xidmətləri</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-light">
                Dekor və Tədbir Həllərimizlə Tanış Olun
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-white/60 max-w-md font-light">
              Məqalələrimizdə bəhs etdiyimiz bütün konseptləri zövqlə və zəmanətlə həyata keçiririk.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {serviceShortcuts.map((svc) => (
              <div
                key={svc.path}
                onClick={() => navigate(svc.path)}
                className="p-5 bg-[#141414] hover:bg-[#1A1A1A] border border-white/10 hover:border-[#C5A059]/40 rounded-sm transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-lg text-[#FAF8F5] group-hover:text-[#E5C378] transition-colors mb-2">
                    {svc.name}
                  </h3>
                  <p className="text-xs text-white/60 font-light leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center text-[11px] text-[#C5A059] font-medium">
                  <span>Baxın</span>
                  <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-14 border-t border-white/10 bg-gradient-to-r from-[#111111] via-[#16140F] to-[#111111]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] font-light mb-3">
            Tədbiriniz üçün Fərdi Dekor Konsepti İstəyirsiniz?
          </h2>
          <p className="text-sm text-white/70 max-w-xl mx-auto mb-6 font-light leading-relaxed">
            Məkanın ölçüsünə, büdcənizə və zövqünüzə uyğun xüsusi 3D eskiz və təklif almaq üçün komandamızla əlaqə saxlayın.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenQuoteModal ? onOpenQuoteModal('Məqalələr Hub Səhifəsi') : navigate('/elaqe')}
              className="px-6 py-3 bg-gradient-to-r from-[#C5A059] to-[#DFC17B] text-[#0B0B0B] font-semibold text-xs uppercase tracking-widest hover:opacity-90 transition-opacity cursor-pointer rounded-sm"
            >
              Qiymət Təklifi Al
            </button>
            <button
              onClick={() => navigate('/portfolio')}
              className="px-6 py-3 border border-[#C5A059]/40 text-[#FAF8F5] hover:border-[#C5A059] text-xs uppercase tracking-widest transition-colors cursor-pointer rounded-sm"
            >
              Portfoliomuz
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
