import { DecorItem, InquiryRequest, SiteSettings, DecorCategorySlug, VenueItem } from '../types';
import { INITIAL_DECORS } from '../data/initialDecors';
import { INITIAL_VENUES } from '../data/initialVenues';
import { REGIONAL_POLICY_STATEMENT } from '../data/regionalData';

const DECORS_STORAGE_KEY = 'dreamart_decors_v2';
const INQUIRIES_STORAGE_KEY = 'dreamart_inquiries_v2';
const SETTINGS_STORAGE_KEY = 'dreamart_settings_v2';
const VENUES_STORAGE_KEY = 'dreamart_venues_v2';

export const DEFAULT_SETTINGS: SiteSettings = {
  brandName: 'DreamArt Events',
  brandSubtitle: 'Tədbir Dekorasiyası',
  phoneDisplay: '050 231 17 28',
  phoneRaw: '994502311728',
  whatsappNumber: '994502311728',
  email: 'info@dreamart-events.az',
  address: 'Bakı şəhəri, Azərbaycan',
  instagram: 'dreamart.events',
  regionalLogisticsNotice: REGIONAL_POLICY_STATEMENT
};

const INITIAL_SAMPLE_INQUIRIES: InquiryRequest[] = [
  {
    id: 'inq-1',
    name: 'Nərgiz Məmmədova',
    phone: '+994 50 312 44 55',
    eventType: 'Toy dekoru',
    date: '2026-10-15',
    location: 'Bakı (Boutique 19)',
    notes: 'Ağ qızılgül və şam kompozisiyalı altar tağı və 15 masa üçün mərkəz gülləri lazımdır.',
    decorName: 'Ağ Qızılgül və Zərif Şamlı Toy Altarı',
    createdAt: '2026-09-02T11:30:00Z',
    status: 'new'
  },
  {
    id: 'inq-2',
    name: 'Rəşad Əliyev',
    phone: '+994 55 889 12 34',
    eventType: 'Nişan dekoru',
    date: '2026-11-05',
    location: 'Qəbələ (Qafqaz Riverside)',
    notes: 'Açıq havada dağ mənzərəli nişan mərasimi üçün zərif tağ və xonça masası.',
    createdAt: '2026-09-03T16:15:00Z',
    status: 'contacted'
  }
];

class DecorStore {
  private decors: DecorItem[] = [];
  private venues: VenueItem[] = [];
  private inquiries: InquiryRequest[] = [];
  private settings: SiteSettings = DEFAULT_SETTINGS;
  private listeners: Array<() => void> = [];

  constructor() {
    this.init();
  }

  private init() {
    // Load decors
    try {
      const savedDecors = localStorage.getItem(DECORS_STORAGE_KEY);
      if (savedDecors) {
        this.decors = JSON.parse(savedDecors);
      } else {
        this.decors = [...INITIAL_DECORS];
        this.persistDecors();
      }
    } catch {
      this.decors = [...INITIAL_DECORS];
    }

    // Load venues
    try {
      const savedVenues = localStorage.getItem(VENUES_STORAGE_KEY);
      if (savedVenues) {
        this.venues = JSON.parse(savedVenues);
      } else {
        this.venues = [...INITIAL_VENUES];
        this.persistVenues();
      }
    } catch {
      this.venues = [...INITIAL_VENUES];
    }

    // Load inquiries
    try {
      const savedInq = localStorage.getItem(INQUIRIES_STORAGE_KEY);
      if (savedInq) {
        this.inquiries = JSON.parse(savedInq);
      } else {
        this.inquiries = [...INITIAL_SAMPLE_INQUIRIES];
        this.persistInquiries();
      }
    } catch {
      this.inquiries = [...INITIAL_SAMPLE_INQUIRIES];
    }

    // Load settings
    try {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(savedSettings) };
      }
    } catch {
      this.settings = { ...DEFAULT_SETTINGS };
    }
  }

  private persistDecors() {
    try {
      localStorage.setItem(DECORS_STORAGE_KEY, JSON.stringify(this.decors));
    } catch (e) {
      console.warn('Storage limit reached or unavailable:', e);
    }
    this.notify();
  }

  private persistVenues() {
    try {
      localStorage.setItem(VENUES_STORAGE_KEY, JSON.stringify(this.venues));
    } catch (e) {
      console.warn('Storage limit reached or unavailable:', e);
    }
    this.notify();
  }

  private persistInquiries() {
    try {
      localStorage.setItem(INQUIRIES_STORAGE_KEY, JSON.stringify(this.inquiries));
    } catch (e) {
      console.warn('Storage limit reached or unavailable:', e);
    }
    this.notify();
  }

  private persistSettings() {
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Storage limit reached or unavailable:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l());
  }

  // Getters
  public getDecors(onlyPublished: boolean = true): DecorItem[] {
    if (onlyPublished) {
      return this.decors.filter(d => d.status === 'published');
    }
    return [...this.decors];
  }

  public getDecorById(id: string): DecorItem | undefined {
    return this.decors.find(d => d.id === id);
  }

  public getDecorBySlug(slug: string): DecorItem | undefined {
    return this.decors.find(d => d.slug === slug);
  }

  public getDecorsByCategory(category: DecorCategorySlug): DecorItem[] {
    return this.decors.filter(d => d.status === 'published' && d.category === category);
  }

  public getFeaturedDecors(): DecorItem[] {
    return this.decors.filter(d => d.status === 'published' && d.isFeatured);
  }

  public getDecorsByCity(citySlug: string): DecorItem[] {
    const cityNameLower = citySlug.toLowerCase();
    return this.decors.filter(d =>
      d.status === 'published' &&
      d.city.toLowerCase().includes(cityNameLower)
    );
  }

  // Decor Mutations
  public addDecor(decor: Omit<DecorItem, 'id' | 'createdAt'>): DecorItem {
    const newDecor: DecorItem = {
      ...decor,
      id: `decor-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.decors.unshift(newDecor);
    this.persistDecors();
    return newDecor;
  }

  public updateDecor(id: string, updates: Partial<DecorItem>): boolean {
    const index = this.decors.findIndex(d => d.id === id);
    if (index === -1) return false;
    this.decors[index] = { ...this.decors[index], ...updates };
    this.persistDecors();
    return true;
  }

  public deleteDecor(id: string): boolean {
    const initialLen = this.decors.length;
    this.decors = this.decors.filter(d => d.id !== id);
    if (this.decors.length !== initialLen) {
      this.persistDecors();
      return true;
    }
    return false;
  }

  public resetToDefaultDecors(): void {
    this.decors = [...INITIAL_DECORS];
    this.persistDecors();
  }

  // Venue Operations
  public getVenues(onlyPublished: boolean = false): VenueItem[] {
    if (onlyPublished) {
      return this.venues.filter(v => v.status === 'published');
    }
    return [...this.venues];
  }

  public getVenueById(id: string): VenueItem | undefined {
    return this.venues.find(v => v.id === id);
  }

  public getVenueBySlug(slug: string): VenueItem | undefined {
    return this.venues.find(v => v.slug === slug);
  }

  public addVenue(venue: Omit<VenueItem, 'id' | 'createdAt'>): VenueItem {
    const newVenue: VenueItem = {
      ...venue,
      id: `venue-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.venues.unshift(newVenue);
    this.persistVenues();
    return newVenue;
  }

  public updateVenue(id: string, updates: Partial<VenueItem>): boolean {
    const index = this.venues.findIndex(v => v.id === id);
    if (index === -1) return false;
    this.venues[index] = {
      ...this.venues[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.persistVenues();
    return true;
  }

  public deleteVenue(id: string): boolean {
    const initialLen = this.venues.length;
    this.venues = this.venues.filter(v => v.id !== id);
    if (this.venues.length !== initialLen) {
      this.persistVenues();
      return true;
    }
    return false;
  }

  public resetToDefaultVenues(): void {
    this.venues = [...INITIAL_VENUES];
    this.persistVenues();
  }

  // Inquiry Operations
  public getInquiries(): InquiryRequest[] {
    return [...this.inquiries];
  }

  public addInquiry(inquiry: Omit<InquiryRequest, 'id' | 'createdAt' | 'status'>): InquiryRequest {
    const newInquiry: InquiryRequest = {
      ...inquiry,
      id: `inq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new'
    };
    this.inquiries.unshift(newInquiry);
    this.persistInquiries();
    return newInquiry;
  }

  public updateInquiryStatus(id: string, status: 'new' | 'contacted' | 'completed'): boolean {
    const inq = this.inquiries.find(i => i.id === id);
    if (!inq) return false;
    inq.status = status;
    this.persistInquiries();
    return true;
  }

  public deleteInquiry(id: string): boolean {
    const initialLen = this.inquiries.length;
    this.inquiries = this.inquiries.filter(i => i.id !== id);
    if (this.inquiries.length !== initialLen) {
      this.persistInquiries();
      return true;
    }
    return false;
  }

  // Settings Operations
  public getSettings(): SiteSettings {
    return { ...this.settings };
  }

  public updateSettings(updates: Partial<SiteSettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.persistSettings();
  }
}

export const store = new DecorStore();
