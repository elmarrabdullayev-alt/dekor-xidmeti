import React, { useState, useEffect } from 'react';
import {
  Lock, LogOut, Upload, RefreshCw, Trash2, Star, Check, ArrowUp, ArrowDown,
  Edit3, ExternalLink, Image as ImageIcon, Sparkles, AlertCircle, Eye,
  Building2, ChevronLeft, ArrowRight, MapPin, Database, FolderOpen, Layers
} from 'lucide-react';
import { ImageSection, ManagedImage } from '../types';
import { imageService } from '../lib/imageService';
import { store } from '../lib/store';
import { CATEGORIES } from '../data/categories';
import { INITIAL_DECORS } from '../data/initialDecors';
import { INITIAL_VENUES } from '../data/initialVenues';
import { ImageUploadModal } from '../components/admin/ImageUploadModal';
import { ImageReplaceModal } from '../components/admin/ImageReplaceModal';
import { ImageMetaModal } from '../components/admin/ImageMetaModal';
import { ImageDeleteModal } from '../components/admin/ImageDeleteModal';
import { SeoHead } from '../components/layout/SeoHead';

interface AdminPageProps {
  navigate: (path: string) => void;
  currentPath?: string;
}

// 7 Dedicated Decor Categories for Admin
const DECOR_CATEGORIES = [
  { slug: 'toy-dekoru', name: 'Toy dekoru', icon: '💍', desc: 'Arxa fon tağları, bəy-gəlin masası və monumental toy zalları' },
  { slug: 'nisan-dekoru', name: 'Nişan dekoru', icon: '🌸', desc: 'Romantik pastel nişan masası, xonça stendləri və fotozonalar' },
  { slug: 'xina-dekoru', name: 'Xına dekoru', icon: '🌺', desc: 'Kraliyyət xına taxtı, antik mis şamdanlar və şərq estetikası' },
  { slug: 'ad-gunu-dekoru', name: 'Ad günü dekoru', icon: '🎂', desc: 'Yubiley və ad günü zövqlü fotozonaları və stendləri' },
  { slug: 'korporativ-dekor', name: 'Korporativ dekor', icon: '🏢', desc: 'Qala gecələri, rəsmi banketlər və şirkət tədbir tərtibatı' },
  { slug: 'zal-dekoru', name: 'Zal dekoru', icon: '🏛️', desc: 'Böyük şadlıq sarayları, tavan instalyasiyaları və çilçıraqlar' },
  { slug: 'xonca-xidmeti', name: 'Xonça', icon: '🎁', desc: 'Eksklüziv büllur, məxmər və qızılı xonça kompozisiyaları' },
];

export const AdminPage: React.FC<AdminPageProps> = ({ navigate, currentPath }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => imageService.hasToken());
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Top Admin View Tabs: 'decors' (Default & Unified Category -> Project -> Images) | 'venues' | 'hero'
  const [activeAdminTab, setActiveAdminTab] = useState<'decors' | 'venues' | 'hero'>(() => {
    if (currentPath?.includes('restoranlar')) return 'venues';
    return 'decors';
  });

  // Decor Category Selection (Default: 'toy-dekoru')
  const [activeCategorySlug, setActiveCategorySlug] = useState<string>('toy-dekoru');

  // Currently Open Project ID (null = list all projects in active category)
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Venue selection for 'venues' tab
  const [activeVenueSlug, setActiveVenueSlug] = useState<string>(() => INITIAL_VENUES[0]?.slug || '');

  // Hero slide selection for 'hero' tab
  const [activeHeroTargetId, setActiveHeroTargetId] = useState<string>('hero-slide-1');

  // Images reactive state from imageService
  const [images, setImages] = useState<ManagedImage[]>(() => imageService.getImages());
  const [decors, setDecors] = useState(() => store.getDecors());
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [replacingImage, setReplacingImage] = useState<ManagedImage | null>(null);
  const [editingMetaImage, setEditingMetaImage] = useState<ManagedImage | null>(null);
  const [deletingImage, setDeletingImage] = useState<ManagedImage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);

  // Verify server cookie session on mount
  useEffect(() => {
    imageService.verifyAdminSession().then(valid => {
      setIsAuthenticated(valid);
    });
  }, []);

  // Subscribe to image changes
  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setImages(imageService.getImages());
      setDecors(store.getDecors());
    });
    return () => unsub();
  }, []);

  // Notice helper
  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsLoggingIn(true);

    try {
      const res = await imageService.loginAdmin(passwordInput);
      if (res.success) {
        setIsAuthenticated(true);
        setPasswordInput('');
      } else {
        setAuthError(res.error || 'Şifrə yalnışdır');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Daxil olarkən xəta baş verdi');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    imageService.logoutAdmin();
    setIsAuthenticated(false);
  };

  // Image actions
  const handleSetCover = async (imgId: string) => {
    try {
      await imageService.setCoverImage(imgId);
      showNotice('Əsas qapaq şəkli təyin olundu! Bütün sayt üzrə tək mənbə kimi yeniləndi.');
    } catch (err: any) {
      alert(err.message || 'Xəta baş verdi');
    }
  };

  const handleMove = async (imgId: string, direction: 'up' | 'down') => {
    try {
      await imageService.reorderImage(imgId, direction);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingImage) return;
    setIsDeleting(true);
    try {
      await imageService.deleteImage(deletingImage.id);
      showNotice('Şəkil uğurla silindi');
      setDeletingImage(null);
    } catch (err: any) {
      showNotice(err.message || 'Şəkil silinərkən xəta baş verdi');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMigrateToSupabase = async () => {
    setIsMigrating(true);
    try {
      const res = await imageService.migrateToSupabase();
      showNotice(`Supabase miqrasiyası: ${res.migrated} köçürüldü, ${res.skipped} mövcud idi.`);
    } catch (err: any) {
      showNotice(err.message || 'Miqrasiya xətası baş verdi');
    } finally {
      setIsMigrating(false);
    }
  };

  // Filter projects by active category
  const categoryProjects = decors.filter(d => d.category === activeCategorySlug);
  const selectedProject = decors.find(d => d.id === selectedProjectId);
  const activeCategory = DECOR_CATEGORIES.find(c => c.slug === activeCategorySlug) || DECOR_CATEGORIES[0];

  // Images for current active target
  let activeImages: ManagedImage[] = [];
  let uploadSection: ImageSection = 'decor_project';
  let uploadTargetId = '';
  let uploadTargetName = '';

  if (activeAdminTab === 'decors' && selectedProject) {
    uploadSection = 'decor_project';
    uploadTargetId = selectedProject.id;
    uploadTargetName = selectedProject.name;
    activeImages = images
      .filter(img => img.section === 'decor_project' && img.targetId === selectedProject.id)
      .sort((a, b) => a.order - b.order);
  } else if (activeAdminTab === 'venues') {
    uploadSection = 'venue_project';
    uploadTargetId = activeVenueSlug;
    const v = INITIAL_VENUES.find(item => item.slug === activeVenueSlug);
    uploadTargetName = v?.name || activeVenueSlug;
    activeImages = images
      .filter(img => img.section === 'venue_project' && img.targetId === activeVenueSlug)
      .sort((a, b) => a.order - b.order);
  } else if (activeAdminTab === 'hero') {
    uploadSection = 'home_hero';
    uploadTargetId = activeHeroTargetId;
    uploadTargetName = activeHeroTargetId === 'hero-slide-1'
      ? 'Slayd 1: Zövqlü Dekor Həlləri'
      : activeHeroTargetId === 'hero-slide-2'
      ? 'Slayd 2: Müasir Zəriflik'
      : 'Slayd 3: Böyük Zallar və İnstalyasiyalar';
    activeImages = images
      .filter(img => img.section === 'home_hero' && img.targetId === activeHeroTargetId)
      .sort((a, b) => a.order - b.order);
  }

  // Render Login View if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0E0E0E] text-white flex flex-col justify-center items-center px-4 py-12">
        <SeoHead
          title="DreamArt Events - Şəkil İdarəetmə Girişi"
          description="DreamArt Events minimal şəkil idarəetmə paneli"
          noindex={true}
        />
        <div className="w-full max-w-md bg-[#161616] border border-[#2B2B2B] rounded-2xl p-6 sm:p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#C5A262]/10 border border-[#C5A262]/30 flex items-center justify-center text-[#C5A262] mb-3">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-[#F5F5F7]">DreamArt Events</h1>
            <p className="text-xs text-neutral-400 mt-1">
              Şəkil İdarəetmə Paneli (Təhlükəsiz Giriş)
            </p>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Admin Şifrəsi:
              </label>
              <input
                id="admin-password-input"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Şifrənizi daxil edin..."
                className="w-full px-4 py-3 text-sm bg-[#1E1E1E] border border-[#333] rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#C5A262] transition"
              />
            </div>

            <button
              id="admin-login-button"
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl bg-[#C5A262] hover:bg-[#b08d4f] text-black font-semibold text-sm transition shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoggingIn ? (
                <>Daxil olunur...</>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Daxil ol
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#252525] text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-neutral-400 hover:text-[#C5A262] transition flex items-center justify-center gap-1 mx-auto"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Sayta qayıt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white">
      <SeoHead
        title="Admin - DreamArt Events Şəkil İdarəetmə"
        description="Kateqoriya → Layihə → Şəkillər İdarəetmə Paneli"
        noindex={true}
      />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#141414]/95 backdrop-blur-md border-b border-[#242424] px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#C5A262]/15 border border-[#C5A262]/30 flex items-center justify-center text-[#C5A262]">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm sm:text-base text-[#F5F5F7]">DreamArt Events</span>
              <span className="px-2 py-0.5 rounded-full bg-[#C5A262]/20 border border-[#C5A262]/40 text-[#C5A262] text-[10px] font-medium uppercase tracking-wider">
                Şəkil İdarəetməsi
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Sadə Model: Kateqoriya → Layihə → Şəkillər (Qapaq + Qalereya)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="admin-view-site-btn"
            onClick={() => navigate('/')}
            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 text-xs flex items-center gap-1.5 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sayta bax</span>
          </button>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 text-xs flex items-center gap-1.5 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Çıxış</span>
          </button>
        </div>
      </header>

      {/* Action Notice toast */}
      {actionNotice && (
        <div className="fixed top-16 right-4 z-50 bg-emerald-900/90 border border-emerald-500/80 text-emerald-100 px-4 py-2.5 rounded-xl shadow-2xl text-xs flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">

        {/* Top Scope / Status Notice */}
        <div className="p-3.5 rounded-xl bg-[#1A1A1A] border border-[#2C2C2C] flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-[#C5A262] shrink-0 mt-0.5" />
            <div className="text-xs text-neutral-300 space-y-0.5">
              <span className="font-semibold text-[#F5F5F7]">Vahid Şəkil İdarəetməsi:</span> Hər bir layihənin tək bir qapaq şəkli və qalereyası mövcuddur. Qapaq şəkli avtomatik olaraq kataloq kartında, layihə səhifəsində və portfolioda tətbiq olunur.
            </div>
          </div>
          <button
            id="admin-supabase-migration-btn"
            onClick={handleMigrateToSupabase}
            disabled={isMigrating}
            className="px-3 py-1.5 rounded-lg bg-[#C5A262]/20 hover:bg-[#C5A262]/30 border border-[#C5A262]/40 text-[#C5A262] text-xs font-medium flex items-center gap-1.5 transition cursor-pointer disabled:opacity-50 shrink-0"
            title="Mövcud şəkilləri Supabase Storage və Postgres DB-yə təhlükəsiz köçür"
          >
            {isMigrating ? (
              <>
                <span className="inline-block w-3.5 h-3.5 border-2 border-[#C5A262]/30 border-t-[#C5A262] rounded-full animate-spin" />
                <span>Supabase-ə Köçürülür...</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5" />
                <span>Supabase Sinxronizasiyası</span>
              </>
            )}
          </button>
        </div>

        {/* 1. TOP MODE SWITCHER */}
        <div className="flex border-b border-[#242424] gap-2 pb-2">
          <button
            onClick={() => {
              setActiveAdminTab('decors');
              setSelectedProjectId(null);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeAdminTab === 'decors'
                ? 'bg-[#C5A262] text-black shadow-md'
                : 'bg-[#161616] text-neutral-300 hover:bg-[#202020] border border-[#262626]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Dekorlar (Kateqoriya → Layihə)</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('venues')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeAdminTab === 'venues'
                ? 'bg-[#C5A262] text-black shadow-md'
                : 'bg-[#161616] text-neutral-300 hover:bg-[#202020] border border-[#262626]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Restoran / Məkanlar ({INITIAL_VENUES.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab('hero')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition cursor-pointer ${
              activeAdminTab === 'hero'
                ? 'bg-[#C5A262] text-black shadow-md'
                : 'bg-[#161616] text-neutral-300 hover:bg-[#202020] border border-[#262626]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Ana Səhifə Hero</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* VIEW A: UNIFIED DECOR MANAGEMENT (Category -> Project -> Images) */}
        {/* ============================================================== */}
        {activeAdminTab === 'decors' && (
          <div className="space-y-6">
            {/* Category Switcher Tabs */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
                Dekor Kateqoriyasını Seçin:
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {DECOR_CATEGORIES.map(cat => {
                  const isActive = activeCategorySlug === cat.slug;
                  const catProjectsCount = decors.filter(d => d.category === cat.slug).length;

                  return (
                    <button
                      key={cat.slug}
                      id={`cat-tab-${cat.slug}`}
                      onClick={() => {
                        setActiveCategorySlug(cat.slug);
                        setSelectedProjectId(null); // Return to category project cards view
                      }}
                      className={`px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 border transition shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-[#C5A262] text-black font-semibold border-[#C5A262] shadow-md'
                          : 'bg-[#161616] text-neutral-300 border-[#2A2A2A] hover:bg-[#202020]'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                        isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-neutral-400'
                      }`}>
                        {catProjectsCount} layihə
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* LEVEL 1: Category Project List (Shown when no project is open) */}
            {!selectedProjectId && (
              <div className="space-y-4">
                <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-semibold text-white flex items-center gap-2">
                      <span>{activeCategory.icon}</span>
                      <span>{activeCategory.name} Layihələri</span>
                    </h2>
                    <p className="text-xs text-neutral-400 mt-1">{activeCategory.desc}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => navigate(`/${activeCategory.slug}`)}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 text-xs flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C5A262]" />
                      <span>İctimai Səhifəyə Bax</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {categoryProjects.map(proj => {
                    const projImages = images.filter(img => img.section === 'decor_project' && img.targetId === proj.id);
                    const coverImg = proj.mainImage;

                    return (
                      <div
                        key={proj.id}
                        id={`project-card-${proj.id}`}
                        className="bg-[#161616] border border-[#262626] hover:border-[#C5A262]/80 rounded-2xl overflow-hidden transition flex flex-col group shadow-lg"
                      >
                        {/* Project Cover Image */}
                        <div className="relative aspect-video w-full bg-black/60 overflow-hidden">
                          <img
                            src={coverImg}
                            alt={proj.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#C5A262] text-black font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md">
                            <Star className="w-3 h-3 fill-black" />
                            Əsas Qapaq
                          </div>
                          <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/80 border border-white/10 text-white text-[10px] font-mono">
                            {projImages.length > 0 ? `${projImages.length} şəkil` : 'Varsayılan'}
                          </div>
                          <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-neutral-300 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#C5A262]" />
                            <span>{proj.city}</span>
                            {proj.venueName && <span>• {proj.venueName}</span>}
                          </div>
                        </div>

                        {/* Project Info & Manage Action */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h3 className="font-serif text-base text-white group-hover:text-[#E5C378] transition-colors leading-snug">
                              {proj.name}
                            </h3>
                            <p className="text-xs text-neutral-400 font-light mt-1.5 line-clamp-2">
                              {proj.shortDescription}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-[#242424] flex items-center justify-between gap-2">
                            <button
                              onClick={() => setSelectedProjectId(proj.id)}
                              className="flex-1 py-2 px-3 rounded-xl bg-[#C5A262] hover:bg-[#b08d4f] text-black font-semibold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                            >
                              <FolderOpen className="w-3.5 h-3.5" />
                              <span>Şəkilləri İdarə Et</span>
                            </button>
                            <button
                              onClick={() => navigate(`/dekorlar/${proj.slug}`)}
                              title="Saytda canlı bax"
                              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LEVEL 2: ONE UNIFIED IMAGE MANAGER FOR THE SELECTED PROJECT */}
            {selectedProjectId && selectedProject && (
              <div className="space-y-6 animate-fade-in">
                {/* Breadcrumb & Project Header */}
                <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-5 space-y-4">
                  <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#242424]">
                    <button
                      onClick={() => setSelectedProjectId(null)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-[#C5A262] hover:underline cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span>{activeCategory.name} layihələrinə qayıt</span>
                    </button>
                    <button
                      onClick={() => navigate(`/dekorlar/${selectedProject.slug}`)}
                      className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#C5A262]" />
                      <span>Saytda Layihəyə Bax</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-[#C5A262] font-mono uppercase tracking-wider mb-1">
                        <span>{activeCategory.name}</span>
                        <span>•</span>
                        <span>{selectedProject.city}</span>
                        {selectedProject.venueName && <span>• {selectedProject.venueName}</span>}
                      </div>
                      <h2 className="text-lg sm:text-xl font-serif text-white font-normal">
                        {selectedProject.name}
                      </h2>
                      <p className="text-xs text-neutral-400 mt-1 max-w-2xl font-light">
                        {selectedProject.shortDescription}
                      </p>
                    </div>

                    <button
                      id="project-add-image-btn"
                      onClick={() => setIsUploadOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#C5A262] hover:bg-[#b08d4f] text-black font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer self-start sm:self-auto shrink-0"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Yeni Şəkil Əlavə Et</span>
                    </button>
                  </div>

                  {/* Quick Project Switcher Pills within the Category */}
                  <div className="pt-2 flex flex-wrap gap-2 border-t border-[#222]">
                    <span className="text-[11px] text-neutral-500 self-center mr-1">Digər Layihələr:</span>
                    {categoryProjects.map(p => (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProjectId(p.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition border cursor-pointer ${
                          p.id === selectedProjectId
                            ? 'bg-white/15 text-white border-[#C5A262] font-semibold'
                            : 'bg-[#1E1E1E] text-neutral-400 border-[#2E2E2E] hover:text-white hover:bg-[#252525]'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Single Unified Images Grid for Selected Project */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                        Layihənin Bütün Şəkilləri ({activeImages.length})
                      </h3>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Tək mənbə: 1 ədəd qapaq şəkli + qalereya şəkilləri. İstənilən şəkli bir toxunuşla "Qapaq et" edə bilərsiniz.
                      </p>
                    </div>
                  </div>

                  {activeImages.length === 0 ? (
                    <div className="py-12 text-center border-2 border-dashed border-[#262626] rounded-2xl bg-[#141414]/50 p-6 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-neutral-500">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-medium text-neutral-300">
                        Bu layihə üçün hələ fərdi CMS şəkli yüklənməyib
                      </p>
                      <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                        Hazırda layihə saytda ilkin arxiv şəkilləri ilə nümayiş olunur. İlk şəkli yükləyərək onu dərhal əsas qapaq şəkli edə bilərsiniz.
                      </p>
                      <button
                        onClick={() => setIsUploadOpen(true)}
                        className="px-4 py-2 rounded-xl bg-[#C5A262] text-black font-semibold text-xs inline-flex items-center gap-1.5 mt-2 cursor-pointer hover:bg-[#b08d4f] transition"
                      >
                        <Upload className="w-4 h-4" />
                        <span>İlk Şəkli Yüklə</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                      {activeImages.map((img, idx) => {
                        const isCover = img.isCover;

                        return (
                          <div
                            key={img.id}
                            id={`image-card-${img.id}`}
                            className={`relative rounded-2xl overflow-hidden bg-[#161616] border transition flex flex-col shadow-lg ${
                              isCover ? 'border-[#C5A262] ring-2 ring-[#C5A262]/50 shadow-xl' : 'border-[#262626]'
                            }`}
                          >
                            {/* Visual Card Image */}
                            <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                              <img
                                src={img.thumbUrl || img.url}
                                alt={img.altText}
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />

                              {/* Single Cover Badge */}
                              {isCover ? (
                                <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#C5A262] text-black font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md">
                                  <Star className="w-3 h-3 fill-black" />
                                  Əsas Qapaq Şəkli
                                </div>
                              ) : (
                                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 border border-white/10 text-neutral-300 text-[10px] font-mono">
                                  Qalereya Şəkli
                                </div>
                              )}

                              {/* Order indicator */}
                              <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-white text-[10px] font-mono">
                                #{idx + 1}
                              </div>

                              {/* Resolution & Size */}
                              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-neutral-300">
                                {img.width || 1200}×{img.height || 800} • WebP
                              </div>
                            </div>

                            {/* Metadata & Actions */}
                            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                              <div className="space-y-1">
                                <div className="text-xs font-mono text-neutral-200 truncate" title={img.filename}>
                                  {img.filename}
                                </div>
                                <div className="text-[11px] text-neutral-400 line-clamp-2" title={img.altText}>
                                  {img.altText}
                                </div>
                              </div>

                              {/* Action Toolbar */}
                              <div className="pt-2 border-t border-[#242424] space-y-2">
                                <div className="grid grid-cols-2 gap-2">
                                  <button
                                    id={`set-cover-btn-${img.id}`}
                                    type="button"
                                    onClick={() => handleSetCover(img.id)}
                                    disabled={isCover}
                                    className={`py-1.5 px-2 text-[11px] rounded-lg border font-medium flex items-center justify-center gap-1 transition ${
                                      isCover
                                        ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40 cursor-default'
                                        : 'bg-white/5 text-neutral-200 border-white/10 hover:bg-[#C5A262] hover:text-black hover:border-[#C5A262] cursor-pointer'
                                    }`}
                                  >
                                    <Star className="w-3 h-3" />
                                    <span>{isCover ? 'Qapaqdır' : 'Qapaq et'}</span>
                                  </button>

                                  <button
                                    id={`replace-img-btn-${img.id}`}
                                    type="button"
                                    onClick={() => setReplacingImage(img)}
                                    className="py-1.5 px-2 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 font-medium flex items-center justify-center gap-1 transition cursor-pointer"
                                  >
                                    <RefreshCw className="w-3 h-3 text-[#C5A262]" />
                                    <span>Şəkil dəyiş</span>
                                  </button>
                                </div>

                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1">
                                    <button
                                      id={`move-up-btn-${img.id}`}
                                      type="button"
                                      onClick={() => handleMove(img.id, 'up')}
                                      disabled={idx === 0}
                                      title="Əvvələ çək"
                                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      id={`move-down-btn-${img.id}`}
                                      type="button"
                                      onClick={() => handleMove(img.id, 'down')}
                                      disabled={idx === activeImages.length - 1}
                                      title="Sonraya çək"
                                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  <div className="flex items-center gap-1">
                                    <button
                                      id={`edit-meta-btn-${img.id}`}
                                      type="button"
                                      onClick={() => setEditingMetaImage(img)}
                                      title="Fayl adı və Alt mətnini redaktə et"
                                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-[#C5A262] transition cursor-pointer"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      id={`delete-img-btn-${img.id}`}
                                      type="button"
                                      onClick={() => setDeletingImage(img)}
                                      title="Şəkli sil"
                                      className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200 transition cursor-pointer"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW B: VENUES MANAGEMENT                                       */}
        {/* ============================================================== */}
        {activeAdminTab === 'venues' && (
          <div className="space-y-6">
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222]">
                <div>
                  <h2 className="text-sm font-semibold text-[#F5F5F7]">Restoran / Məkan Seçin</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">DreamArt Events real məkan dekorasiyası fotoları</p>
                </div>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#C5A262] hover:bg-[#b08d4f] text-black font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer self-start sm:self-auto"
                >
                  <Upload className="w-4 h-4" />
                  <span>Yeni Şəkil Əlavə Et</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {INITIAL_VENUES.map(v => {
                  const isSelected = v.slug === activeVenueSlug;
                  const count = images.filter(img => img.section === 'venue_project' && img.targetId === v.slug).length;

                  return (
                    <button
                      key={v.slug}
                      onClick={() => setActiveVenueSlug(v.slug)}
                      className={`px-3 py-1.5 rounded-lg text-xs transition border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-white/15 text-white border-[#C5A262] font-medium'
                          : 'bg-[#1E1E1E] text-neutral-400 border-[#2E2E2E] hover:text-white hover:bg-[#252525]'
                      }`}
                    >
                      <span>{v.name}</span>
                      <span className="text-[10px] text-neutral-500 font-mono">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Venue Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeImages.map((img, idx) => (
                <div
                  key={img.id}
                  className={`relative rounded-2xl overflow-hidden bg-[#161616] border transition flex flex-col ${
                    img.isCover ? 'border-[#C5A262] ring-1 ring-[#C5A262]/50 shadow-lg' : 'border-[#262626]'
                  }`}
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                    <img src={img.thumbUrl || img.url} alt={img.altText} className="w-full h-full object-cover" />
                    {img.isCover && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#C5A262] text-black font-bold text-[10px] tracking-wider uppercase flex items-center gap-1">
                        <Star className="w-3 h-3 fill-black" />
                        Əsas Qapaq
                      </div>
                    )}
                  </div>
                  <div className="p-3.5 space-y-2">
                    <div className="text-xs font-mono text-neutral-200 truncate">{img.filename}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleSetCover(img.id)}
                        disabled={img.isCover}
                        className={`py-1.5 px-2 text-[11px] rounded-lg border font-medium flex items-center justify-center gap-1 ${
                          img.isCover ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40' : 'bg-white/5 text-neutral-200 border-white/10 hover:bg-[#C5A262] hover:text-black cursor-pointer'
                        }`}
                      >
                        <Star className="w-3 h-3" />
                        <span>{img.isCover ? 'Qapaqdır' : 'Qapaq et'}</span>
                      </button>
                      <button
                        onClick={() => setReplacingImage(img)}
                        className="py-1.5 px-2 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 font-medium flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 text-[#C5A262]" />
                        <span>Dəyiş</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW C: HOME HERO SLIDES                                        */}
        {/* ============================================================== */}
        {activeAdminTab === 'hero' && (
          <div className="space-y-6">
            <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222]">
                <div>
                  <h2 className="text-sm font-semibold text-[#F5F5F7]">Ana Səhifə 16:9 Karusel Slaydları</h2>
                  <p className="text-xs text-neutral-400 mt-0.5">3 əsas böyük banner slaydının idarə olunması</p>
                </div>
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-[#C5A262] hover:bg-[#b08d4f] text-black font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer self-start sm:self-auto"
                >
                  <Upload className="w-4 h-4" />
                  <span>Yeni Şəkil Əlavə Et</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {[
                  { id: 'hero-slide-1', name: 'Slayd 1: Zövqlü Dekor Həlləri' },
                  { id: 'hero-slide-2', name: 'Slayd 2: Müasir Zəriflik' },
                  { id: 'hero-slide-3', name: 'Slayd 3: Böyük Zallar və İnstalyasiyalar' },
                ].map(slide => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveHeroTargetId(slide.id)}
                    className={`px-3.5 py-2 rounded-lg text-xs transition border flex items-center gap-1.5 cursor-pointer ${
                      activeHeroTargetId === slide.id
                        ? 'bg-white/15 text-white border-[#C5A262] font-semibold'
                        : 'bg-[#1E1E1E] text-neutral-400 border-[#2E2E2E] hover:text-white hover:bg-[#252525]'
                    }`}
                  >
                    <span>{slide.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeImages.map(img => (
                <div
                  key={img.id}
                  className="relative rounded-2xl overflow-hidden bg-[#161616] border border-[#262626] transition flex flex-col"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-black/60">
                    <img src={img.thumbUrl || img.url} alt={img.altText} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3.5 space-y-2">
                    <div className="text-xs font-mono text-neutral-200 truncate">{img.filename}</div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setReplacingImage(img)}
                        className="py-1.5 px-2 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 font-medium flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3 text-[#C5A262]" />
                        <span>Dəyiş</span>
                      </button>
                      <button
                        onClick={() => setEditingMetaImage(img)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-[#C5A262] transition cursor-pointer flex items-center justify-center gap-1 text-[11px]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Alt Mətni</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {isUploadOpen && (
        <ImageUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          section={uploadSection}
          targetId={uploadTargetId}
          targetName={uploadTargetName}
          onSuccess={() => {
            showNotice('Yeni şəkil uğurla yükləndi və optimallaşdırıldı!');
          }}
        />
      )}

      {/* Replace Modal */}
      {replacingImage && (
        <ImageReplaceModal
          isOpen={!!replacingImage}
          onClose={() => setReplacingImage(null)}
          image={replacingImage}
          onSuccess={() => {
            showNotice('Şəkil uğurla əvəzləndi!');
          }}
        />
      )}

      {/* Edit Meta Modal */}
      {editingMetaImage && (
        <ImageMetaModal
          isOpen={!!editingMetaImage}
          onClose={() => setEditingMetaImage(null)}
          image={editingMetaImage}
          onSuccess={() => {
            showNotice('Şəkil təsviri və fayl adı yeniləndi!');
          }}
        />
      )}

      {/* Delete Modal */}
      {deletingImage && (
        <ImageDeleteModal
          isOpen={!!deletingImage}
          onClose={() => setDeletingImage(null)}
          image={deletingImage}
          onConfirm={handleConfirmDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};
