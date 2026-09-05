import React, { useState, useEffect } from 'react';
import {
  Lock, LogOut, Upload, RefreshCw, Trash2, Star, Check, ArrowUp, ArrowDown,
  Edit3, ExternalLink, Image as ImageIcon, Sparkles, AlertCircle, Eye,
  Building2, Flower2, Layers, Grid, MapPin, Gift, ChevronRight
} from 'lucide-react';
import { ImageSection, ManagedImage } from '../types';
import { imageService } from '../lib/imageService';
import { CATEGORIES } from '../data/categories';
import { INITIAL_DECORS } from '../data/initialDecors';
import { INITIAL_VENUES } from '../data/initialVenues';
import { ImageUploadModal } from '../components/admin/ImageUploadModal';
import { ImageReplaceModal } from '../components/admin/ImageReplaceModal';
import { ImageMetaModal } from '../components/admin/ImageMetaModal';
import { SeoHead } from '../components/layout/SeoHead';

interface AdminPageProps {
  navigate: (path: string) => void;
  currentPath?: string;
}

interface TargetItem {
  id: string;
  name: string;
  subtitle?: string;
}

const SECTION_CONFIG: Array<{
  id: ImageSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  getTargets: () => TargetItem[];
}> = [
  {
    id: 'home_hero',
    label: 'Ana Səhifə Hero',
    icon: Sparkles,
    description: 'Ana səhifənin ən yuxarı 16:9 böyük banner slaydları (mobil və masaüstü fokal nöqtə dəstəyi ilə).',
    getTargets: () => [
      { id: 'hero-slide-1', name: 'Slayd 1: Zövqlü Dekor Həlləri', subtitle: 'Əsas açılış slayd' },
      { id: 'hero-slide-2', name: 'Slayd 2: Müasir Zəriflik', subtitle: 'İkinci zəriflik slayd' },
      { id: 'hero-slide-3', name: 'Slayd 3: Böyük Zallar və İnstalyasiyalar', subtitle: 'Üçüncü genişmiqyaslı slayd' }
    ]
  },
  {
    id: 'category_cover',
    label: 'Xidmət Kateqoriyaları',
    icon: Layers,
    description: 'Xidmətlər kataloqu və SEO səhifələrinin əsas təqdimat örtük şəkilləri.',
    getTargets: () => CATEGORIES.map(c => ({
      id: c.slug,
      name: c.name,
      subtitle: c.shortDescription
    }))
  },
  {
    id: 'decor_project',
    label: 'Dekor Layihələri',
    icon: Flower2,
    description: 'Dekor layihələrinin kart örtük şəkli və ətraflı layihə foto qalereyası.',
    getTargets: () => INITIAL_DECORS.map(d => ({
      id: d.id,
      name: d.name,
      subtitle: `${d.city} • ${d.category}`
    }))
  },
  {
    id: 'venue_project',
    label: 'Restoran / Məkanlar',
    icon: Building2,
    description: 'Məkanların örtük şəkli və DreamArt Events real layihə foto sübutları qalereyası.',
    getTargets: () => INITIAL_VENUES.map(v => ({
      id: v.slug,
      name: v.name,
      subtitle: `${v.city}${v.district ? ', ' + v.district : ''}`
    }))
  },
  {
    id: 'xonca_service',
    label: 'Xonça Xidməti',
    icon: Gift,
    description: 'Xonça xidməti bölməsinin vitrin və təqdimat fotoşəkilləri.',
    getTargets: () => [
      { id: 'xonca-main', name: 'Əsas Xonça Vitrini', subtitle: 'Xonça bölməsi örtük şəkli' },
      { id: 'xonca-nisan', name: 'Nişan Xonçaları', subtitle: 'Nişan üçün eksklüziv dəst' },
      { id: 'xonca-xina', name: 'Xına Xonçaları', subtitle: 'Xına və şirniyyat kompozisiyası' }
    ]
  },
  {
    id: 'portfolio_lookbook',
    label: 'Portfolio Vitrini',
    icon: Grid,
    description: 'Portfolio və Lookbook səhifəsində nümayiş olunan işlərin şəkilləri.',
    getTargets: () => [
      { id: 'portfolio-showcase', name: 'Əsas Lookbook Vitrini', subtitle: 'Bütün seçilmiş işlər' }
    ]
  },
  {
    id: 'regional_service',
    label: 'Region Xidməti',
    icon: MapPin,
    description: 'Bölgələr və rayonlar tədbir loqistikası bölməsinin vizualı.',
    getTargets: () => [
      { id: 'regional-main', name: 'Azərbaycan Regionları Xidməti', subtitle: 'Bütün rayonlar üzrə dekor tərtibatı' }
    ]
  }
];

export const AdminPage: React.FC<AdminPageProps> = ({ navigate, currentPath }) => {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => imageService.hasToken());
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Section selection
  const [activeSection, setActiveSection] = useState<ImageSection>(() => {
    if (currentPath?.includes('restoranlar')) return 'venue_project';
    if (currentPath?.includes('dekorlar')) return 'decor_project';
    return 'home_hero';
  });

  // Target selection
  const currentSectionConfig = SECTION_CONFIG.find(s => s.id === activeSection) || SECTION_CONFIG[0];
  const targets = currentSectionConfig.getTargets();
  const [activeTargetId, setActiveTargetId] = useState<string>(() => targets[0]?.id || '');

  // Keep target ID in sync when section changes
  useEffect(() => {
    const newTargets = currentSectionConfig.getTargets();
    if (!newTargets.some(t => t.id === activeTargetId)) {
      setActiveTargetId(newTargets[0]?.id || '');
    }
  }, [activeSection]);

  // Images state
  const [images, setImages] = useState<ManagedImage[]>(() => imageService.getImages());
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [replacingImage, setReplacingImage] = useState<ManagedImage | null>(null);
  const [editingMetaImage, setEditingMetaImage] = useState<ManagedImage | null>(null);

  // Verify server token on mount
  useEffect(() => {
    if (isAuthenticated) {
      imageService.verifyAdminSession().then(valid => {
        if (!valid) {
          setIsAuthenticated(false);
        }
      });
    }
  }, []);

  // Subscribe to image changes
  useEffect(() => {
    const unsub = imageService.subscribe(() => {
      setImages(imageService.getImages());
    });
    return () => unsub();
  }, []);

  // Filter images for active section and target
  const currentTarget = targets.find(t => t.id === activeTargetId) || targets[0];
  const activeImages = images
    .filter(img => img.section === activeSection && img.targetId === activeTargetId)
    .sort((a, b) => a.order - b.order);

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
      showNotice('Qapaq şəkli uğurla yeniləndi!');
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

  const handleDelete = async (imgId: string) => {
    if (!window.confirm('Bu şəkli silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarılmır.')) {
      return;
    }

    try {
      await imageService.deleteImage(imgId);
      showNotice('Şəkil uğurla silindi');
    } catch (err: any) {
      alert(err.message || 'Şəkil silinərkən xəta baş verdi');
    }
  };

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
        description="Minimal Şəkil İdarəetmə Paneli"
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
                Yalnız Şəkillər
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 hidden sm:block">
              Mobil-dostu sürətli WebP yükləmə və şəkil idarəetməsi
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

        {/* Security / Scope Reminder Notice */}
        <div className="p-3.5 rounded-xl bg-[#1A1A1A] border border-[#2C2C2C] flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-[#C5A262] shrink-0 mt-0.5" />
          <div className="text-xs text-neutral-300 space-y-0.5">
            <span className="font-semibold text-[#F5F5F7]">Minimal Şəkil İdarəetmə Rejimi:</span> Bu paneldə yalnız saytın fotoşəkilləri idarə olunur. Mətnlər, SEO başlıqları, telefon nömrələri və strukturlaşdırılmış məlumatlar sabit kod təhlükəsizliyi altında qorunur.
          </div>
        </div>

        {/* 1. SECTION TABS (7 Image Groups) */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-neutral-400 uppercase tracking-wider px-1">
            Şəkil Bölməsini Seçin (7 Qrup):
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {SECTION_CONFIG.map(sec => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              const count = images.filter(img => img.section === sec.id).length;

              return (
                <button
                  key={sec.id}
                  id={`section-tab-${sec.id}`}
                  onClick={() => setActiveSection(sec.id)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap flex items-center gap-2 border transition shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#C5A262] text-black font-semibold border-[#C5A262] shadow-md'
                      : 'bg-[#161616] text-neutral-300 border-[#2A2A2A] hover:bg-[#202020]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-[#C5A262]'}`} />
                  <span>{sec.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive ? 'bg-black/20 text-black font-bold' : 'bg-white/10 text-neutral-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Description Bar */}
        <div className="text-xs text-neutral-400 bg-white/3 border border-white/5 rounded-xl px-4 py-2.5">
          {currentSectionConfig.description}
        </div>

        {/* 2. TARGET SELECTOR */}
        <div className="bg-[#141414] border border-[#242424] rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#222]">
            <div>
              <h2 className="text-sm font-semibold text-[#F5F5F7] flex items-center gap-2">
                <span>Hədəf Element / Layihə:</span>
                <span className="text-[#C5A262] font-bold">{currentTarget?.name}</span>
              </h2>
              {currentTarget?.subtitle && (
                <p className="text-xs text-neutral-400 mt-0.5">{currentTarget.subtitle}</p>
              )}
            </div>

            {/* Tap to Upload New Image Button (Mobile-First) */}
            <button
              id="open-upload-modal-btn"
              onClick={() => setIsUploadOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-[#C5A262] hover:bg-[#b08d4f] text-black font-semibold text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer self-start sm:self-auto"
            >
              <Upload className="w-4 h-4" />
              Yeni Şəkil Əlavə Et
            </button>
          </div>

          {/* Targets Horizontal Scroll / Pills */}
          <div className="flex flex-wrap gap-2 pt-1">
            {targets.map(t => {
              const isSelected = t.id === activeTargetId;
              const targetCount = images.filter(
                img => img.section === activeSection && img.targetId === t.id
              ).length;

              return (
                <button
                  key={t.id}
                  id={`target-btn-${t.id}`}
                  onClick={() => setActiveTargetId(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition border flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-white/15 text-white border-[#C5A262] font-medium'
                      : 'bg-[#1E1E1E] text-neutral-400 border-[#2E2E2E] hover:text-white hover:bg-[#252525]'
                  }`}
                >
                  <span>{t.name}</span>
                  <span className="text-[10px] text-neutral-500 font-mono">({targetCount})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. IMAGES GALLERY GRID */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
              Mövcud Şəkillər ({activeImages.length})
            </h3>
            <span className="text-[11px] text-neutral-500">
              Sıranı dəyişmək üçün oxlardan istifadə edin
            </span>
          </div>

          {activeImages.length === 0 ? (
            <div className="py-16 text-center border-2 border-dashed border-[#262626] rounded-2xl bg-[#141414]/50 p-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto text-neutral-500">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-neutral-300">
                Bu bölmə üçün hələ heç bir şəkil yüklənməyib
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Telefondan və ya kompüterdən bir toxunuşla yeni şəkil əlavə edin. WebP optimallaşdırılması avtomatik aparılacaq.
              </p>
              <button
                onClick={() => setIsUploadOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#C5A262] text-black font-semibold text-xs inline-flex items-center gap-1.5 mt-2 cursor-pointer hover:bg-[#b08d4f] transition"
              >
                <Upload className="w-4 h-4" />
                İlk Şəkli Yüklə
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeImages.map((img, idx) => {
                const isCover = img.isCover;

                return (
                  <div
                    key={img.id}
                    id={`image-card-${img.id}`}
                    className={`relative rounded-2xl overflow-hidden bg-[#161616] border transition flex flex-col ${
                      isCover ? 'border-[#C5A262] ring-1 ring-[#C5A262]/50 shadow-lg' : 'border-[#262626]'
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

                      {/* Cover Badge */}
                      {isCover && (
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md bg-[#C5A262] text-black font-bold text-[10px] tracking-wider uppercase flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-black" />
                          Əsas Qapaq Şəkli
                        </div>
                      )}

                      {/* Order indicator */}
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-white text-[10px] font-mono">
                        #{idx + 1}
                      </div>

                      {/* Resolution & Size */}
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/75 text-[10px] font-mono text-neutral-300">
                        {img.width}×{img.height} • WebP
                      </div>
                    </div>

                    {/* Metadata & Details */}
                    <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <div className="text-xs font-mono text-neutral-200 truncate" title={img.filename}>
                          {img.filename}
                        </div>
                        <div className="text-[11px] text-neutral-400 line-clamp-2" title={img.altText}>
                          {img.altText}
                        </div>
                      </div>

                      {/* Action Buttons Toolbar */}
                      <div className="pt-2 border-t border-[#242424] space-y-2">
                        {/* Primary actions: Cover & Replace */}
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
                            {isCover ? 'Qapaqdır' : 'Qapaq et'}
                          </button>

                          <button
                            id={`replace-img-btn-${img.id}`}
                            type="button"
                            onClick={() => setReplacingImage(img)}
                            className="py-1.5 px-2 text-[11px] rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-200 font-medium flex items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <RefreshCw className="w-3 h-3 text-[#C5A262]" />
                            Şəkil dəyiş
                          </button>
                        </div>

                        {/* Secondary actions: Reorder, Edit Meta, Delete */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1">
                            <button
                              id={`move-up-btn-${img.id}`}
                              type="button"
                              onClick={() => handleMove(img.id, 'up')}
                              disabled={idx === 0}
                              title="Əvvələ çək"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`move-down-btn-${img.id}`}
                              type="button"
                              onClick={() => handleMove(img.id, 'down')}
                              disabled={idx === activeImages.length - 1}
                              title="Sonraya çək"
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
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
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-[#C5A262] transition"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              id={`delete-img-btn-${img.id}`}
                              type="button"
                              onClick={() => handleDelete(img.id)}
                              title="Şəkli sil"
                              className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 hover:text-red-200 transition"
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
      </main>

      {/* Upload Modal */}
      {isUploadOpen && (
        <ImageUploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          section={activeSection}
          targetId={activeTargetId}
          targetName={currentTarget?.name || ''}
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
    </div>
  );
};
