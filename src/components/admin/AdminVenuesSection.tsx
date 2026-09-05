import React, { useState, useEffect } from 'react';
import {
  Plus, Edit2, Trash2, Check, X, Upload, Eye, Star,
  MapPin, CheckCircle2, AlertCircle, Sparkles, Building2,
  ExternalLink, Search, RefreshCw
} from 'lucide-react';
import { VenueItem, DecorItem, FAQItem } from '../../types';
import { store } from '../../lib/store';
import {
  isVenueIndexable,
  generateVenueSlug,
  generateVenueSeoTitle,
  generateVenueMetaDescription,
  generateDefaultVenueFaqs
} from '../../lib/venueHelper';
import { processUploadedImage, formatFileSize, ProcessedImage } from '../../lib/imageOptimizer';

interface AdminVenuesSectionProps {
  navigate: (path: string) => void;
  currentPath?: string;
}

export const AdminVenuesSection: React.FC<AdminVenuesSectionProps> = ({ navigate, currentPath }) => {
  const [venues, setVenues] = useState<VenueItem[]>(() => store.getVenues(false));
  const decors = store.getDecors(false);

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [city, setCity] = useState('Bakı');
  const [district, setDistrict] = useState('');
  const [address, setAddress] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [venueNotes, setVenueNotes] = useState('');
  const [mainImage, setMainImage] = useState('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [hasRealProject, setHasRealProject] = useState(true);
  const [relatedDecorIds, setRelatedDecorIds] = useState<string[]>([]);
  const [servicesInput, setServicesInput] = useState('Toy dekoru, Səhnə dekoru, Masa dekoru, Fotozona');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [indexStatus, setIndexStatus] = useState<'index' | 'noindex'>('index');

  // FAQs
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  // Search & filter in table
  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Image upload
  const [uploadProcessing, setUploadProcessing] = useState(false);
  const [lastOptimization, setLastOptimization] = useState<ProcessedImage | null>(null);

  // Sync store
  const refreshVenues = () => {
    setVenues(store.getVenues(false));
  };

  // Check URL route on mount or change
  useEffect(() => {
    if (!currentPath) return;
    if (currentPath === '/admin/restoranlar/yeni') {
      openNewForm();
    } else if (currentPath.startsWith('/admin/restoranlar/') && currentPath !== '/admin/restoranlar') {
      const idOrSlug = currentPath.replace('/admin/restoranlar/', '');
      const matched = venues.find(v => v.id === idOrSlug || v.slug === idOrSlug);
      if (matched) {
        openEditForm(matched);
      }
    }
  }, [currentPath]);

  // Handle Name Change with auto-fill
  const handleNameChange = (val: string) => {
    setName(val);
    const autoSlug = generateVenueSlug(val);
    setSlug(autoSlug);
    setSeoTitle(generateVenueSeoTitle(val, city));
    setMetaDescription(generateVenueMetaDescription(val, city, district));
    setFaqs(generateDefaultVenueFaqs(val, hasRealProject, '050 231 17 28'));
  };

  const handleCityDistrictChange = (newCity: string, newDistrict: string) => {
    setCity(newCity);
    setDistrict(newDistrict);
    if (name.trim()) {
      setSeoTitle(generateVenueSeoTitle(name, newCity));
      setMetaDescription(generateVenueMetaDescription(name, newCity, newDistrict));
    }
  };

  const handleRealProjectToggle = (checked: boolean) => {
    setHasRealProject(checked);
    if (!checked) {
      setIndexStatus('noindex');
    }
    if (name.trim()) {
      setFaqs(generateDefaultVenueFaqs(name, checked, '050 231 17 28'));
    }
  };

  const openNewForm = () => {
    setEditingId(null);
    setName('');
    setSlug('');
    setCity('Bakı');
    setDistrict('');
    setAddress('');
    setShortDescription('');
    setVenueNotes('');
    setMainImage('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85');
    setGalleryImages([]);
    setHasRealProject(true);
    setRelatedDecorIds(decors.slice(0, 1).map(d => d.id));
    setServicesInput('Toy dekoru, Səhnə dekoru, Masa dekoru, Fotozona');
    setSeoTitle('');
    setMetaDescription('');
    setStatus('published');
    setIndexStatus('index');
    setFaqs(generateDefaultVenueFaqs('', true, '050 231 17 28'));
    setLastOptimization(null);
    setIsFormOpen(true);
    navigate('/admin/restoranlar/yeni');
  };

  const openEditForm = (venue: VenueItem) => {
    setEditingId(venue.id);
    setName(venue.name);
    setSlug(venue.slug);
    setCity(venue.city);
    setDistrict(venue.district || '');
    setAddress(venue.address || '');
    setShortDescription(venue.shortDescription);
    setVenueNotes(venue.venueNotes || '');
    setMainImage(venue.mainImage);
    setGalleryImages(venue.galleryImages || []);
    setHasRealProject(venue.hasRealProject);
    setRelatedDecorIds(venue.relatedDecorIds || []);
    setServicesInput((venue.relatedServices || []).join(', '));
    setSeoTitle(venue.seoTitle);
    setMetaDescription(venue.metaDescription);
    setStatus(venue.status);
    setIndexStatus(venue.indexStatus);
    setFaqs(venue.faqs || generateDefaultVenueFaqs(venue.name, venue.hasRealProject, '050 231 17 28'));
    setLastOptimization(null);
    setIsFormOpen(true);
    navigate(`/admin/restoranlar/${venue.id}`);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
    navigate('/admin/restoranlar');
  };

  // Image upload
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>, isMain: boolean = true) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadProcessing(true);
    try {
      if (isMain) {
        const processed = await processUploadedImage(files[0], {
          maxWidth: 1600,
          quality: 0.85,
          targetFilename: slug || generateVenueSlug(name) || 'restoran'
        });
        setMainImage(processed.dataUrl);
        setLastOptimization(processed);
      } else {
        const newImages: string[] = [];
        for (let i = 0; i < files.length; i++) {
          const processed = await processUploadedImage(files[i], {
            maxWidth: 1400,
            quality: 0.85,
            targetFilename: `${slug || 'restoran'}-gallery-${i + 1}`
          });
          newImages.push(processed.dataUrl);
        }
        setGalleryImages(prev => [...prev, ...newImages]);
      }
    } catch (err) {
      console.error('Şəkil yüklənərkən xəta:', err);
    } finally {
      setUploadProcessing(false);
    }
  };

  // Toggle decor relation
  const toggleDecorRelation = (decorId: string) => {
    setRelatedDecorIds(prev =>
      prev.includes(decorId) ? prev.filter(id => id !== decorId) : [...prev, decorId]
    );
  };

  // Save venue with specific status
  const handleSaveVenue = (forcedStatus?: 'published' | 'draft') => {
    if (!name.trim()) {
      alert('Zəhmət olmasa restoran və ya məkan adını qeyd edin.');
      return;
    }

    const finalStatus = forcedStatus || status;
    let finalIndexStatus = indexStatus;

    if (finalStatus === 'draft' || !hasRealProject || relatedDecorIds.length === 0) {
      finalIndexStatus = 'noindex';
    }

    const servicesArr = servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const venueData: Omit<VenueItem, 'id' | 'createdAt'> = {
      name: name.trim(),
      slug: slug.trim() || generateVenueSlug(name),
      city: city.trim() || 'Bakı',
      district: district.trim() || undefined,
      address: address.trim() || undefined,
      shortDescription: shortDescription.trim() || `${name} restoranında DreamArt Events tərəfindən icra edilmiş toy və tədbir dekorasiyaları.`,
      venueNotes: venueNotes.trim() || undefined,
      mainImage,
      galleryImages,
      hasRealProject,
      relatedDecorIds,
      relatedServices: servicesArr,
      faqs: faqs.length > 0 ? faqs : generateDefaultVenueFaqs(name, hasRealProject, '050 231 17 28'),
      seoTitle: seoTitle.trim() || generateVenueSeoTitle(name, city),
      metaDescription: metaDescription.trim() || generateVenueMetaDescription(name, city, district),
      status: finalStatus,
      indexStatus: finalIndexStatus
    };

    if (editingId) {
      store.updateVenue(editingId, venueData);
    } else {
      store.addVenue(venueData);
    }

    refreshVenues();
    closeForm();
  };

  const handleDeleteVenue = (id: string, venueName: string) => {
    if (window.confirm(`"${venueName}" məkanını silmək istədiyinizdən əminsiniz?`)) {
      store.deleteVenue(id);
      refreshVenues();
    }
  };

  // Calculate stats
  const totalVenues = venues.length;
  const publishedVenues = venues.filter(v => v.status === 'published').length;
  const draftVenues = venues.filter(v => v.status === 'draft').length;
  const indexableVenues = venues.filter(v => isVenueIndexable(v, decors)).length;
  const noindexVenues = totalVenues - indexableVenues;
  const withRealProjects = venues.filter(v => v.hasRealProject).length;
  const withoutRealProjects = venues.filter(v => !v.hasRealProject).length;

  const filteredList = venues.filter(v => {
    const matchStatus = statusFilter === 'all' || v.status === statusFilter;
    const matchSearch = !searchFilter.trim() ||
      v.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      v.city.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (v.district && v.district.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-white p-3 rounded-xs border border-[#EAE2D5]">
          <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] block">Ümumi Məkan</span>
          <span className="text-xl font-bold text-[#1C1C1C]">{totalVenues}</span>
        </div>
        <div className="bg-white p-3 rounded-xs border border-[#EAE2D5]">
          <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] block">Yayımlanmış</span>
          <span className="text-xl font-bold text-emerald-700">{publishedVenues}</span>
        </div>
        <div className="bg-white p-3 rounded-xs border border-[#EAE2D5]">
          <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] block">Qaralama</span>
          <span className="text-xl font-bold text-amber-700">{draftVenues}</span>
        </div>
        <div className="bg-white p-3 rounded-xs border border-[#EAE2D5]">
          <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] block">İndekslənən</span>
          <span className="text-xl font-bold text-blue-700">{indexableVenues}</span>
        </div>
        <div className="bg-white p-3 rounded-xs border border-[#EAE2D5]">
          <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] block">Noindex</span>
          <span className="text-xl font-bold text-zinc-600">{noindexVenues}</span>
        </div>
        <div className="bg-white p-3 rounded-xs border border-[#EAE2D5]">
          <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] block">Real Layihəli</span>
          <span className="text-xl font-bold text-[#B8925A]">{withRealProjects}</span>
        </div>
        <div className="bg-white p-3 rounded-xs border border-[#EAE2D5]">
          <span className="text-[10px] uppercase tracking-wider text-[#7A6E63] block">Real Layihəsiz</span>
          <span className="text-xl font-bold text-zinc-500">{withoutRealProjects}</span>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white p-4 rounded-xs border border-[#EAE2D5] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Məkan axtarışı..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#EAE2D5] pl-9 pr-3 py-1.5 text-xs rounded-xs outline-none focus:border-[#B8925A]"
            />
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 text-xs rounded-xs ${statusFilter === 'all' ? 'bg-[#B8925A] text-white' : 'bg-[#FAF8F5] text-zinc-600 hover:bg-zinc-100'}`}
            >
              Hamısı ({totalVenues})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1.5 text-xs rounded-xs ${statusFilter === 'published' ? 'bg-[#B8925A] text-white' : 'bg-[#FAF8F5] text-zinc-600 hover:bg-zinc-100'}`}
            >
              Yayımlanan ({publishedVenues})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1.5 text-xs rounded-xs ${statusFilter === 'draft' ? 'bg-[#B8925A] text-white' : 'bg-[#FAF8F5] text-zinc-600 hover:bg-zinc-100'}`}
            >
              Qaralama ({draftVenues})
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            onClick={() => navigate('/restoranlar')}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs border border-[#EAE2D5] rounded-xs text-zinc-700 hover:bg-[#FAF8F5]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Saytda Gör</span>
          </button>

          <button
            onClick={openNewForm}
            className="inline-flex items-center gap-1.5 bg-[#B8925A] hover:bg-[#A37E48] text-white px-4 py-2 rounded-xs text-xs font-medium cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Məkan Əlavə Et</span>
          </button>
        </div>
      </div>

      {/* Venues Table */}
      <div className="bg-white border border-[#EAE2D5] rounded-xs shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-[#EAE2D5] bg-[#FAF8F5] text-[#7A6E63] font-medium text-[11px] uppercase tracking-wider">
                <th className="py-3 px-4">Şəkil</th>
                <th className="py-3 px-4">Restoran / Məkan</th>
                <th className="py-3 px-4">Şəhər / Rayon</th>
                <th className="py-3 px-4 text-center">Real Layihə</th>
                <th className="py-3 px-4 text-center">Dekor Sayı</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">İndeks</th>
                <th className="py-3 px-4 text-right">Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EAE2D5]">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-zinc-500 text-xs">
                    Məkan tapılmadı.
                  </td>
                </tr>
              ) : (
                filteredList.map((v) => {
                  const isIndexable = isVenueIndexable(v, decors);
                  const linkedCount = v.relatedDecorIds?.length || 0;

                  return (
                    <tr key={v.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-4 w-16">
                        <img
                          src={v.mainImage}
                          alt={v.name}
                          className="w-12 h-10 object-cover rounded-xs border border-[#EAE2D5]"
                        />
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-[#1C1C1C] block">{v.name}</span>
                        <span className="text-[11px] text-zinc-400 font-mono">/restoranlar/{v.slug}</span>
                      </td>

                      <td className="py-3 px-4 text-zinc-700">
                        <span>{v.city}</span>
                        {v.district && <span className="text-zinc-400 block text-[11px]">{v.district} r.</span>}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {v.hasRealProject ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-full">
                            <Check className="w-3 h-3" /> Bəli
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded-full">
                            <X className="w-3 h-3" /> Xeyr
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center font-mono text-zinc-700">
                        {linkedCount > 0 ? (
                          <span className="text-[#B8925A] font-semibold">{linkedCount} layihə</span>
                        ) : (
                          <span className="text-zinc-400">0</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {v.status === 'published' ? (
                          <span className="text-[10px] tracking-wider uppercase font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                            Yayımlanıb
                          </span>
                        ) : (
                          <span className="text-[10px] tracking-wider uppercase font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">
                            Qaralama
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        {isIndexable ? (
                          <span className="text-[10px] tracking-wider font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full" title="Sitemap-ə daxildir və Google indeksinə açıqdır">
                            Index
                          </span>
                        ) : (
                          <span className="text-[10px] tracking-wider font-semibold bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-full" title="Qaralama və ya real layihəsi olmadığından sitemap-dən xaric edilib">
                            Noindex
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigate(`/restoranlar/${v.slug}`)}
                            className="p-1.5 text-zinc-500 hover:text-[#B8925A] hover:bg-white rounded-xs transition-colors"
                            title="Məkanı saytda aç"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditForm(v)}
                            className="p-1.5 text-zinc-500 hover:text-[#B8925A] hover:bg-white rounded-xs transition-colors"
                            title="Redaktə et"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVenue(v.id, v.name)}
                            className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-white rounded-xs transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM FOR VENUE CREATE / EDIT */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-sm border border-[#EAE2D5] shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-[#EAE2D5] flex items-center justify-between bg-[#FAF8F5]">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#B8925A]" />
                <h3 className="font-serif text-lg text-[#1C1C1C] font-semibold">
                  {editingId ? `"${name || 'Məkan'}" redaktəsi` : 'Yeni Restoran / Məkan Əlavə Et'}
                </h3>
              </div>
              <button
                onClick={closeForm}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs sm:text-sm">
              {/* Row 1: Name, Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                    Restoran / məkan adı *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Məsələn: Meridian"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs focus:border-[#B8925A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                    Slug (URL ünvanı) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="meridian"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs font-mono text-xs focus:border-[#B8925A] outline-none"
                  />
                  <span className="text-[10px] text-zinc-400 mt-0.5 block">
                    URL: /restoranlar/{slug || '...'}
                  </span>
                </div>
              </div>

              {/* Row 2: City, District, Address */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                    Şəhər *
                  </label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => handleCityDistrictChange(e.target.value, district)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs focus:border-[#B8925A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                    Rayon (əgər məlumdursa)
                  </label>
                  <input
                    type="text"
                    placeholder="Məs: Səbail, Nərimanov, Xətai"
                    value={district}
                    onChange={(e) => handleCityDistrictChange(city, e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs focus:border-[#B8925A] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                    Ünvan (ixtiyari)
                  </label>
                  <input
                    type="text"
                    placeholder="Məs: Badamdar qəs., 3-cü massiv"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs focus:border-[#B8925A] outline-none"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                  Qısa açıqlama *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Məkan və burada göstərilən dekorasiya xidmətləri haqqında xülasə..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs focus:border-[#B8925A] outline-none"
                />
              </div>

              {/* Venue-Specific Notes */}
              <div>
                <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                  Məkan xüsusiyyətləri və dekor qaydaları / tövsiyələri
                </label>
                <textarea
                  rows={2}
                  placeholder="Tavan hündürlüyü, səhnə genişliyi, işıqlandırma infrastrukturu və ya məkanın xüsusi tələbləri..."
                  value={venueNotes}
                  onChange={(e) => setVenueNotes(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs focus:border-[#B8925A] outline-none"
                />
              </div>

              {/* Real Project Verification & Index Status */}
              <div className="bg-[#FAF8F5] p-4 rounded-xs border border-[#EAE2D5] space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="font-semibold text-xs text-[#1C1C1C] block">
                      Real layihə icra olunub:
                    </span>
                    <span className="text-[11px] text-zinc-500">
                      DreamArt Events bu məkanda faktiki dekorasiya layihəsi həyata keçiribmi?
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="hasRealProject"
                        checked={hasRealProject === true}
                        onChange={() => handleRealProjectToggle(true)}
                        className="text-[#B8925A] focus:ring-[#B8925A]"
                      />
                      <span className="text-xs font-medium text-emerald-800">Bəli (Real layihə var)</span>
                    </label>

                    <label className="inline-flex items-center gap-1.5 cursor-pointer">
                      <input
                        type="radio"
                        name="hasRealProject"
                        checked={hasRealProject === false}
                        onChange={() => handleRealProjectToggle(false)}
                        className="text-[#B8925A] focus:ring-[#B8925A]"
                      />
                      <span className="text-xs font-medium text-zinc-600">Xeyr (Yalnız qaralama/noindex)</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#EAE2D5] flex items-center justify-between text-xs">
                  <span className="text-zinc-600">
                    Axtarış motoru indeksi (Robots):
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                    hasRealProject && relatedDecorIds.length > 0 && status === 'published'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-zinc-200 text-zinc-700'
                  }`}>
                    {hasRealProject && relatedDecorIds.length > 0 && status === 'published' ? 'index, follow' : 'noindex, follow'}
                  </span>
                </div>
              </div>

              {/* Related Decors Multi-select */}
              <div>
                <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                  Əlaqəli dekor layihələri ({relatedDecorIds.length} seçilib)
                </label>
                <div className="max-h-40 overflow-y-auto border border-[#EAE2D5] bg-[#FAF8F5] p-2 rounded-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {decors.map((d) => {
                    const isChecked = relatedDecorIds.includes(d.id);
                    return (
                      <label
                        key={d.id}
                        className={`flex items-center gap-2 p-2 rounded-xs border cursor-pointer transition-colors ${
                          isChecked ? 'bg-white border-[#B8925A]' : 'border-transparent hover:bg-white/60'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleDecorRelation(d.id)}
                          className="rounded text-[#B8925A] focus:ring-[#B8925A]"
                        />
                        <img src={d.mainImage} alt={d.name} className="w-8 h-8 object-cover rounded-xs" />
                        <div className="min-w-0 flex-1">
                          <span className="text-xs font-medium truncate block text-zinc-800">{d.name}</span>
                          <span className="text-[10px] text-zinc-400">{d.categoryName} ({d.city})</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Related Services */}
              <div>
                <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                  Əlaqəli xidmətlər (vergüllə ayırın)
                </label>
                <input
                  type="text"
                  placeholder="Toy dekoru, Səhnə dekoru, Masa dekoru, Fotozona"
                  value={servicesInput}
                  onChange={(e) => setServicesInput(e.target.value)}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs focus:border-[#B8925A] outline-none"
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                    Əsas şəkil (URL və ya Yüklə)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={mainImage}
                      onChange={(e) => setMainImage(e.target.value)}
                      className="w-full p-2 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs text-xs outline-none"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1.5 rounded-xs text-xs cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadProcessing ? 'İşlənir...' : 'Cihazdan yüklə'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageFileChange(e, true)}
                      />
                    </label>
                  </div>
                  {mainImage && (
                    <img
                      src={mainImage}
                      alt="Əsas şəkil önizləmə"
                      className="mt-2 w-full h-28 object-cover rounded-xs border border-[#EAE2D5]"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                    Əlavə şəkillər (Qalereya)
                  </label>
                  <label className="inline-flex items-center gap-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 px-3 py-1.5 rounded-xs text-xs cursor-pointer mb-2">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Qalereyaya şəkillər əlavə et</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleImageFileChange(e, false)}
                    />
                  </label>
                  <div className="flex flex-wrap gap-2 mt-1 max-h-28 overflow-y-auto">
                    {galleryImages.map((img, idx) => (
                      <div key={idx} className="relative group">
                        <img src={img} alt="" className="w-14 h-14 object-cover rounded-xs border" />
                        <button
                          type="button"
                          onClick={() => setGalleryImages(prev => prev.filter((_, i) => i !== idx))}
                          className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full p-0.5 text-[9px]"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SEO Title & Meta Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#EAE2D5]">
                <div>
                  <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                    SEO Title
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#1C1C1C] mb-1">
                    Meta Description
                  </label>
                  <input
                    type="text"
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    className="w-full p-2 bg-[#FAF8F5] border border-[#EAE2D5] rounded-xs text-xs outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer Buttons */}
            <div className="px-6 py-4 border-t border-[#EAE2D5] bg-[#FAF8F5] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500">Hazırkı status:</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  {status === 'published' ? 'Yayımlanacaq' : 'Qaralama qalacaq'}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleSaveVenue('draft')}
                  className="px-4 py-2 border border-zinc-300 hover:bg-zinc-100 text-zinc-700 text-xs font-medium rounded-xs transition-colors cursor-pointer"
                >
                  Qaralama saxla
                </button>

                <button
                  type="button"
                  onClick={() => handleSaveVenue('published')}
                  className="px-5 py-2 bg-[#B8925A] hover:bg-[#A37E48] text-white text-xs font-medium rounded-xs transition-colors cursor-pointer shadow-xs"
                >
                  Yayımla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
