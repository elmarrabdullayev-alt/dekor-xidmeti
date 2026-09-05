import React, { useState } from 'react';
import { store } from '../lib/store';
import { DecorItem, DecorCategorySlug, RegionalSuitability, CustomerInquiry } from '../types';
import { CATEGORIES } from '../data/categories';
import { REGIONAL_LOCATIONS } from '../data/regionalData';
import {
  generateDecorSlug,
  generateSeoTitle,
  generateMetaDescription,
  generateImageAltText,
  generateSeoFileName
} from '../lib/seoHelper';
import { processUploadedImage, formatFileSize, ProcessedImage } from '../lib/imageOptimizer';
import {
  Plus, Edit2, Trash2, Check, X, Upload, Eye, Star,
  Lock, LogOut, Phone, MessageCircle, Settings, Image as ImageIcon,
  Sparkles, CheckCircle2, AlertCircle, FileText, Building2
} from 'lucide-react';
import { AdminVenuesSection } from '../components/admin/AdminVenuesSection';

interface AdminPageProps {
  navigate: (path: string) => void;
  currentPath?: string;
}

export const AdminPage: React.FC<AdminPageProps> = ({ navigate, currentPath }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem('dreamart_admin_auth') === 'true' || sessionStorage.getItem('aurora_admin_auth') === 'true'
  );
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState(false);

  // Tabs: 'decors' | 'venues' | 'inquiries' | 'settings'
  const [activeTab, setActiveTab] = useState<'decors' | 'venues' | 'inquiries' | 'settings'>(() => {
    if (currentPath?.startsWith('/admin/restoranlar')) return 'venues';
    return 'decors';
  });

  // Decor List State
  const [decors, setDecors] = useState<DecorItem[]>(() => store.getDecors());
  const [inquiries, setInquiries] = useState<CustomerInquiry[]>(() => store.getInquiries());
  const [settings, setSettings] = useState(() => store.getSettings());

  // Form modal state for Add / Edit
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Decor Form Data
  const [name, setName] = useState('');
  const [category, setCategory] = useState<DecorCategorySlug>('toy-dekoru');
  const [city, setCity] = useState('Bakı');
  const [style, setStyle] = useState('Klassik Lüks');
  const [regionalSuitability, setRegionalSuitability] = useState<RegionalSuitability>('regional');
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [includedInput, setIncludedInput] = useState('dekor konsepti, arxa fon, gül kompozisiyası, masa dekoru, quraşdırma, sökülmə');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [priceDisplay, setPriceDisplay] = useState('');

  // SEO Fields (auto-generated but editable)
  const [slug, setSlug] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [imageAltText, setImageAltText] = useState('');

  // Images state
  const [mainImage, setMainImage] = useState<string>('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [lastOptimization, setLastOptimization] = useState<ProcessedImage | null>(null);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin code for demo: admin123 or dreamart2026 or admin
    if (password === 'admin123' || password === 'dreamart2026' || password === 'aurora2026' || password === 'admin') {
      sessionStorage.setItem('dreamart_admin_auth', 'true');
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dreamart_admin_auth');
    sessionStorage.removeItem('aurora_admin_auth');
    setIsAuthenticated(false);
  };

  // Auto-generate SEO fields when Name, Category or City changes
  const handleNameChange = (val: string) => {
    setName(val);
    const catName = CATEGORIES.find(c => c.slug === category)?.name || 'Dekor';
    const autoSlug = generateDecorSlug(val, category, city);
    setSlug(autoSlug);
    setSeoTitle(generateSeoTitle(val, catName, city));
    setMetaDescription(generateMetaDescription(val, catName, city, style));
    setImageAltText(generateImageAltText(val, catName, city));
  };

  // Open modal for new decor
  const openNewForm = () => {
    setEditingId(null);
    setName('');
    setCategory('toy-dekoru');
    setCity('Bakı');
    setStyle('Klassik Lüks');
    setRegionalSuitability('regional');
    setShortDescription('');
    setFullDescription('');
    setIncludedInput('dekor konsepti, arxa fon, gül kompozisiyası, masa dekoru, quraşdırma, sökülmə');
    setIsFeatured(false);
    setIsPublished(true);
    setPriceDisplay('');
    setMainImage('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85');
    setGalleryImages([]);
    setSlug('');
    setSeoTitle('');
    setMetaDescription('');
    setImageAltText('');
    setLastOptimization(null);
    setIsFormOpen(true);
  };

  // Open modal for editing existing decor
  const openEditForm = (item: DecorItem) => {
    setEditingId(item.id);
    setName(item.name);
    setCategory(item.category);
    setCity(item.city);
    setStyle(item.style || '');
    setRegionalSuitability(item.regionalSuitability);
    setShortDescription(item.shortDescription);
    setFullDescription(item.fullDescription || '');
    setIncludedInput(item.includedServices.join(', '));
    setIsFeatured(item.isFeatured);
    setIsPublished(item.status === 'published' || item.isPublished === true);
    setPriceDisplay(item.priceDisplay || '');
    setMainImage(item.mainImage);
    setGalleryImages(item.galleryImages || []);
    setSlug(item.slug);
    setSeoTitle(item.seoTitle);
    setMetaDescription(item.metaDescription);
    setImageAltText(item.imageAltText);
    setLastOptimization(null);
    setIsFormOpen(true);
  };

  // Save Decor (Create or Update)
  const handleSaveDecor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const catObj = CATEGORIES.find(c => c.slug === category);
    const includedArr = includedInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const decorData: Omit<DecorItem, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      slug: slug || generateDecorSlug(name, category, city),
      category,
      categoryName: catObj?.name || 'Dekor',
      city,
      style,
      regionalSuitability,
      shortDescription,
      fullDescription,
      includedServices: includedArr,
      mainImage,
      galleryImages,
      isFeatured,
      isPublished,
      status: isPublished ? 'published' : 'draft',
      regionalService: regionalSuitability !== 'local',
      seoTitle: seoTitle || generateSeoTitle(name, catObj?.name || 'Dekor', city),
      metaDescription: metaDescription || generateMetaDescription(name, catObj?.name || 'Dekor', city, style),
      imageAltText: imageAltText || generateImageAltText(name, catObj?.name || 'Dekor', city),
      priceDisplay
    };

    if (editingId) {
      store.updateDecor(editingId, decorData);
    } else {
      store.addDecor(decorData);
    }

    setDecors(store.getDecors());
    setIsFormOpen(false);
  };

  // Delete Decor
  const handleDelete = (id: string, decorName: string) => {
    if (window.confirm(`"${decorName}" layihəsini silmək istədiyinizdən əminsiniz?`)) {
      store.deleteDecor(id);
      setDecors(store.getDecors());
    }
  };

  // Client-Side Image Upload & Compression Pipeline
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProcessing(true);
    try {
      const file = files[0];
      const seoFileName = generateSeoFileName(name || 'dekor', category, city);
      const optimized = await processUploadedImage(file, {
        maxWidth: 1600,
        maxHeight: 1200,
        quality: 0.84,
        targetFilename: seoFileName
      });

      setLastOptimization(optimized);

      if (isGallery) {
        setGalleryImages(prev => [...prev, optimized.dataUrl]);
      } else {
        setMainImage(optimized.dataUrl);
      }
    } catch (err) {
      console.error('Image optimization failed', err);
      alert('Şəkil emalı zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setUploadProcessing(false);
    }
  };

  // If not logged in, render PIN/Password Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#F6F2EC] px-4 py-16">
        <div className="w-full max-w-md bg-[#FCFBF8] border border-[#EAE2D5] rounded-xs shadow-lg p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-[#B8925A]/15 text-[#B8925A] flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A059] block mb-1">
            DREAMART EVENTS
          </span>
          <h1 className="font-serif text-2xl text-[#1F1A17] font-normal mb-2">
            İdarəetmə Paneli
          </h1>
          <p className="text-xs text-[#7A6E63] mb-6">
            Yeni dekorasiya əlavə etmək və ya məlumatları yeniləmək üçün daxil olun.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError(false);
                }}
                placeholder="Giriş şifrəsi (məs: admin)"
                className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm px-4 py-2.5 text-sm text-[#1F1A17] focus:outline-hidden focus:border-[#B8925A]"
              />
              {authError && (
                <p className="text-xs text-red-600 mt-1.5 flex items-center justify-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Şifrə yanlışdır</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#B8925A] hover:bg-[#A37E48] text-white py-2.5 rounded-full text-xs font-medium tracking-wider transition-colors cursor-pointer"
            >
              Daxil Ol
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[#EFE8DD]">
            <button
              onClick={() => navigate('/')}
              className="text-xs text-[#8C7A6B] hover:text-[#1F1A17]"
            >
              ← Sayta qayıt
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F2EC] text-[#1F1A17] pb-20">
      {/* Top Admin Navigation Bar */}
      <header className="bg-[#1C1714] text-[#FAF8F5] border-b border-[#352B24] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="font-serif text-lg tracking-widest text-[#FAF8F5] uppercase">
              DREAMART
            </span>
            <span className="text-[10px] tracking-wider bg-[#C5A059] text-[#0B0B0B] font-semibold px-2 py-0.5 rounded-xs uppercase">
              Admin
            </span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <button
              onClick={() => navigate('/')}
              className="text-[#D8D0C5] hover:text-white transition-colors"
            >
              Sayta bax
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1 text-[#A6998A] hover:text-red-400 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Çıxış</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Admin Navigation Tabs & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center space-x-2 border-b sm:border-b-0 border-[#E5DACD] pb-2 sm:pb-0 overflow-x-auto">
            <button
              onClick={() => {
                setActiveTab('decors');
                navigate('/admin');
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-medium tracking-wide rounded-sm transition-colors whitespace-nowrap ${
                activeTab === 'decors'
                  ? 'bg-[#B8925A] text-white shadow-xs'
                  : 'bg-white text-[#524941] hover:bg-[#EAE2D5]'
              }`}
            >
              Dekorlar ({decors.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('venues');
                navigate('/admin/restoranlar');
              }}
              className={`px-4 py-2 text-xs sm:text-sm font-medium tracking-wide rounded-sm transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'venues'
                  ? 'bg-[#B8925A] text-white shadow-xs'
                  : 'bg-white text-[#524941] hover:bg-[#EAE2D5]'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Restoranlar ({store.getVenues(false).length})</span>
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium tracking-wide rounded-sm transition-colors relative whitespace-nowrap ${
                activeTab === 'inquiries'
                  ? 'bg-[#B8925A] text-white shadow-xs'
                  : 'bg-white text-[#524941] hover:bg-[#EAE2D5]'
              }`}
            >
              Müraciətlər ({inquiries.length})
              {inquiries.some(i => i.status === 'new') && (
                <span className="w-2 h-2 rounded-full bg-red-500 absolute -top-1 -right-1" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-xs sm:text-sm font-medium tracking-wide rounded-sm transition-colors whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-[#B8925A] text-white shadow-xs'
                  : 'bg-white text-[#524941] hover:bg-[#EAE2D5]'
              }`}
            >
              Tənzimləmələr
            </button>
          </div>

          {activeTab === 'decors' && (
            <button
              onClick={openNewForm}
              className="inline-flex items-center space-x-2 bg-[#B8925A] hover:bg-[#A37E48] text-white px-5 py-2.5 rounded-full text-xs font-medium tracking-wider shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Dekor Əlavə Et</span>
            </button>
          )}
        </div>

        {/* TAB 1: DECORS LIST */}
        {activeTab === 'decors' && (
          <div className="bg-white border border-[#EAE2D5] rounded-xs shadow-2xs overflow-hidden">
            <div className="p-4 bg-[#FAF8F5] border-b border-[#EAE2D5] flex items-center justify-between text-xs text-[#7A6E63]">
              <span>Mövcud layihələr və statuslar</span>
              <span>Mobil telefondan birbaşa foto yükləyə bilərsiniz</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-[#EAE2D5] bg-[#FAF8F5] text-[#7A6E63] uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Şəkil</th>
                    <th className="py-3 px-4">Ad & Kateqoriya</th>
                    <th className="py-3 px-4">Məkan</th>
                    <th className="py-3 px-4">Region Uyğunluğu</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE2D5]">
                  {decors.map((d) => (
                    <tr key={d.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="w-14 h-12 rounded-xs overflow-hidden bg-[#ECE5DB] border border-[#EAE2D5]">
                          <img
                            src={d.mainImage}
                            alt={d.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-serif font-medium text-[#1F1A17] text-sm sm:text-base">
                          {d.name}
                        </div>
                        <div className="text-xs text-[#8C7A6B] flex items-center gap-1 mt-0.5">
                          <span>{d.categoryName}</span>
                          {d.style && <span>• {d.style}</span>}
                          {d.isFeatured && (
                            <span className="bg-[#B8925A]/15 text-[#B8925A] text-[10px] px-1.5 py-0.2 rounded-xs ml-1 font-medium">
                              Seçilmiş
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium text-[#4A413A]">
                        {d.city}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-[11px] text-[#7A6E63]">
                          {d.regionalSuitability === 'premiumRegional'
                            ? 'Azərbaycan üzrə'
                            : d.regionalSuitability === 'regional'
                            ? 'Regionlara uyğun'
                            : 'Yalnız Bakı'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium uppercase ${
                            d.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {d.isPublished ? 'Aktiv' : 'Qaralama'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditForm(d)}
                          className="p-1.5 text-[#5A5047] hover:text-[#B8925A] transition-colors"
                          title="Redaktə et"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id, d.name)}
                          className="p-1.5 text-[#5A5047] hover:text-red-600 transition-colors"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: VENUES LIST */}
        {activeTab === 'venues' && (
          <AdminVenuesSection navigate={navigate} currentPath={currentPath} />
        )}

        {/* TAB 3: INQUIRIES LIST */}
        {activeTab === 'inquiries' && (
          <div className="bg-white border border-[#EAE2D5] rounded-xs shadow-2xs p-6">
            <h2 className="font-serif text-xl text-[#1F1A17] mb-4">Müştəri Sorğuları</h2>
            {inquiries.length === 0 ? (
              <p className="text-sm text-[#7A6E63] py-8 text-center">Hələ heç bir sorğu daxil olmayıb.</p>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-4 border border-[#EAE2D5] rounded-xs bg-[#FAF8F5] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm text-[#1F1A17]">{inq.name}</h3>
                        <span className="text-xs bg-[#B8925A]/15 text-[#B8925A] px-2 py-0.5 rounded-full font-medium">
                          {inq.eventType}
                        </span>
                        {inq.decorName && (
                          <span className="text-xs text-[#7A6E63]">• {inq.decorName}</span>
                        )}
                      </div>
                      <div className="text-xs text-[#524941] space-y-0.5">
                        <p><strong>Telefon:</strong> {inq.phone}</p>
                        <p><strong>Məkan / Şəhər:</strong> {inq.location || 'Göstərilməyib'} | <strong>Tarix:</strong> {inq.date || 'Dəqiqləşdirilməyib'}</p>
                        {inq.notes && <p className="text-[#7A6E63] mt-1"><em>"{inq.notes}"</em></p>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <a
                        href={`https://wa.me/${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Salam, ${inq.name}! Aurora Event Decor-a müraciətiniz üçün təşəkkür edirik.`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#25D366] text-white px-3 py-1.5 rounded-full text-xs font-medium"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>WhatsApp ilə yaz</span>
                      </a>
                      <a
                        href={`tel:${inq.phone}`}
                        className="inline-flex items-center gap-1.5 bg-[#1F1A17] text-white px-3 py-1.5 rounded-full text-xs font-medium"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Zəng et</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-[#EAE2D5] rounded-xs shadow-2xs p-6 max-w-2xl">
            <h2 className="font-serif text-xl text-[#1F1A17] mb-4">Əlaqə və Brend Tənzimləmələri</h2>
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-[#6B5F54] mb-1 font-medium">WhatsApp Nömrəsi (ölkə kodu ilə)</label>
                <input
                  type="text"
                  value={settings.whatsappNumber}
                  onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm p-2 text-[#1F1A17]"
                />
              </div>
              <div>
                <label className="block text-[#6B5F54] mb-1 font-medium">Telefon (görünən format)</label>
                <input
                  type="text"
                  value={settings.phoneDisplay}
                  onChange={(e) => setSettings({ ...settings, phoneDisplay: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm p-2 text-[#1F1A17]"
                />
              </div>
              <div>
                <label className="block text-[#6B5F54] mb-1 font-medium">Instagram Hesabı</label>
                <input
                  type="text"
                  value={settings.instagram}
                  onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm p-2 text-[#1F1A17]"
                />
              </div>
              <div>
                <label className="block text-[#6B5F54] mb-1 font-medium">Ünvan</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm p-2 text-[#1F1A17]"
                />
              </div>
              <button
                onClick={() => {
                  store.updateSettings(settings);
                  alert('Tənzimləmələr uğurla yadda saxlanıldı!');
                }}
                className="bg-[#B8925A] text-white px-6 py-2 rounded-full text-xs font-medium tracking-wider"
              >
                Yadda saxla
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD / EDIT DECOR FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#FCFBF8] border border-[#EAE2D5] rounded-xs shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#EAE2D5]">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C7A6B] block">
                  AURORA EVENT DECOR
                </span>
                <h2 className="font-serif text-2xl text-[#1F1A17]">
                  {editingId ? 'Dekor Layihəsini Redaktə Et' : 'Yeni Dekor Layihəsi Əlavə Et'}
                </h2>
              </div>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-2 text-[#7A6E63] hover:text-[#1F1A17]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDecor} className="space-y-6">
              {/* 1. Basic Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#665B51] font-medium mb-1">
                    Dekorun Adı *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder="Məs: Ağ Qızılgül və Şam Kompozisiyası"
                    className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm px-3 py-2 text-sm text-[#1F1A17] focus:outline-hidden focus:border-[#B8925A]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#665B51] font-medium mb-1">
                    Kateqoriya
                  </label>
                  <select
                    value={category}
                    onChange={(e) => {
                      const newCat = e.target.value as DecorCategorySlug;
                      setCategory(newCat);
                      const catName = CATEGORIES.find(c => c.slug === newCat)?.name || 'Dekor';
                      setSlug(generateDecorSlug(name, newCat, city));
                      setSeoTitle(generateSeoTitle(name, catName, city));
                      setMetaDescription(generateMetaDescription(name, catName, city, style));
                    }}
                    className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm px-3 py-2 text-sm text-[#1F1A17] focus:outline-hidden focus:border-[#B8925A]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 2. City, Style & Regional Suitability */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#665B51] font-medium mb-1">
                    Şəhər / Məkan
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value);
                      const catName = CATEGORIES.find(c => c.slug === category)?.name || 'Dekor';
                      setSlug(generateDecorSlug(name, category, e.target.value));
                      setSeoTitle(generateSeoTitle(name, catName, e.target.value));
                    }}
                    placeholder="Bakı, Sumqayıt, Qəbələ..."
                    className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm px-3 py-2 text-sm text-[#1F1A17] focus:outline-hidden focus:border-[#B8925A]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#665B51] font-medium mb-1">
                    Stil
                  </label>
                  <input
                    type="text"
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    placeholder="Məs: Klassik Lüks, Romantik..."
                    className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm px-3 py-2 text-sm text-[#1F1A17] focus:outline-hidden focus:border-[#B8925A]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#665B51] font-medium mb-1">
                    Region Uyğunluğu
                  </label>
                  <select
                    value={regionalSuitability}
                    onChange={(e) => setRegionalSuitability(e.target.value as RegionalSuitability)}
                    className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm px-3 py-2 text-sm text-[#1F1A17] focus:outline-hidden focus:border-[#B8925A]"
                  >
                    <option value="local">Yalnız Bakı və yaxın ərazilər</option>
                    <option value="regional">Regionlara uyğun (logistika ilə)</option>
                    <option value="premiumRegional">Azərbaycan üzrə quraşdırma</option>
                  </select>
                </div>
              </div>

              {/* 3. Descriptions */}
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#665B51] font-medium mb-1">
                  Qısa Təsvir
                </label>
                <textarea
                  rows={2}
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Layihənin qısa estetik təsviri..."
                  className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm p-2.5 text-sm text-[#1F1A17] focus:outline-hidden focus:border-[#B8925A]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#665B51] font-medium mb-1">
                  Daxil Olan Xidmətlər (vergüllə ayırın)
                </label>
                <input
                  type="text"
                  value={includedInput}
                  onChange={(e) => setIncludedInput(e.target.value)}
                  placeholder="dekor konsepti, arxa fon, gül kompozisiyası, quraşdırma, sökülmə"
                  className="w-full bg-[#FAF8F5] border border-[#E5DACD] rounded-sm px-3 py-2 text-sm text-[#1F1A17] focus:outline-hidden focus:border-[#B8925A]"
                />
              </div>

              {/* 4. Client-Side Image Optimizer Pipeline */}
              <div className="p-4 bg-[#F5F0E8] border border-[#E2D5C3] rounded-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-[#B38E5D]" />
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#1F1A17]">
                      Şəkil Emalı & Optimizasiya (Mobil Dostu)
                    </span>
                  </div>
                  {uploadProcessing && (
                    <span className="text-xs text-[#B38E5D] animate-pulse font-medium">
                      Optimizasiya edilir...
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#665B51]">
                  Mobil telefondan çəkilən 10MB+ şəkillər avtomatik olaraq <strong>WebP</strong> formatına sıxılır, EXIF məlumatları silinir və SEO uyğun fayl adı verilir.
                </p>

                {/* Upload Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#4A413A] mb-1">
                      Əsas Şəkil
                    </label>
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#D6BD96] p-3 rounded-xs cursor-pointer hover:bg-[#FAF8F5] transition-colors">
                      <Upload className="w-4 h-4 text-[#B38E5D]" />
                      <span className="text-xs text-[#524941]">Telefondan / Kompüterdən Seç</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileChange(e, false)}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4A413A] mb-1">
                      Qalereyaya Əlavə Et
                    </label>
                    <label className="flex items-center justify-center gap-2 border-2 border-dashed border-[#D6BD96] p-3 rounded-xs cursor-pointer hover:bg-[#FAF8F5] transition-colors">
                      <Plus className="w-4 h-4 text-[#B38E5D]" />
                      <span className="text-xs text-[#524941]">Əlavə Foto Yüklə</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageFileChange(e, true)}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* Compression Metrics Feedback */}
                {lastOptimization && (
                  <div className="p-3 bg-white border border-[#E5DACD] rounded-xs text-xs space-y-1">
                    <div className="flex items-center justify-between font-medium text-[#1F1A17]">
                      <span>Optimizasiya Nəticəsi:</span>
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {lastOptimization.savedPercentage}% Qənaət olundu
                      </span>
                    </div>
                    <div className="text-[11px] text-[#665B51] flex items-center justify-between">
                      <span>İlkin həcm: {formatFileSize(lastOptimization.originalSize)}</span>
                      <span>Sıxılmış WebP: {formatFileSize(lastOptimization.compressedSize)}</span>
                    </div>
                    <div className="text-[10px] text-[#8C7A6B] font-mono">
                      Fayl adı: {lastOptimization.filename}
                    </div>
                  </div>
                )}

                {/* Main Image Preview */}
                {mainImage && (
                  <div className="relative w-32 h-24 rounded-xs overflow-hidden border border-[#E5DACD]">
                    <img src={mainImage} alt="Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded-xs">
                      Əsas şəkil
                    </span>
                  </div>
                )}
              </div>

              {/* 5. SEO Automation Preview */}
              <div className="p-4 bg-[#FAF8F5] border border-[#E5DACD] rounded-xs space-y-3">
                <div className="flex items-center space-x-2 text-xs uppercase tracking-wider font-semibold text-[#8C7A6B]">
                  <Sparkles className="w-4 h-4 text-[#B38E5D]" />
                  <span>Avtomatik SEO & GEO Parametrləri</span>
                </div>

                <div>
                  <label className="block text-[11px] text-[#7A6E63] mb-1 font-mono">
                    URL Slug (avtomatik yaranır): /dekorlar/{slug}
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-white border border-[#E5DACD] rounded-sm p-1.5 text-xs text-[#1F1A17] font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#7A6E63] mb-1">
                    SEO Başlıq (Title Tag)
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full bg-white border border-[#E5DACD] rounded-sm p-1.5 text-xs text-[#1F1A17]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-[#7A6E63] mb-1">
                    Meta Təsvir (Meta Description)
                  </label>
                  <textarea
                    rows={2}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full bg-white border border-[#E5DACD] rounded-sm p-1.5 text-xs text-[#1F1A17]"
                  />
                </div>
              </div>

              {/* 6. Status & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#EAE2D5]">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="rounded-sm text-[#B8925A]"
                    />
                    <span>Saytda dərc edilsin</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer text-xs font-medium">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="rounded-sm text-[#B8925A]"
                    />
                    <span>Ana səhifədə göstərilsin</span>
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-[#E5DACD] rounded-full text-xs font-medium hover:bg-[#FAF8F5]"
                  >
                    Ləğv et
                  </button>
                  <button
                    type="submit"
                    className="bg-[#B8925A] hover:bg-[#A37E48] text-white px-6 py-2 rounded-full text-xs font-medium tracking-wider shadow-xs"
                  >
                    Yadda saxla
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
