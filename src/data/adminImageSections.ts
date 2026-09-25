import React from 'react';
import {
  Sparkles,
  Layers,
  Flower2,
  Building2,
  Gift,
  Grid,
  MapPin
} from 'lucide-react';
import { ImageSection } from '../types';
import { CATEGORIES } from './categories';
import { INITIAL_DECORS } from './initialDecors';
import { INITIAL_VENUES } from './initialVenues';

export interface TargetItem {
  id: string;
  name: string;
  subtitle?: string;
}

export interface SectionConfigItem {
  id: ImageSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  getTargets: () => TargetItem[];
}

export const SECTION_CONFIG: SectionConfigItem[] = [
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
