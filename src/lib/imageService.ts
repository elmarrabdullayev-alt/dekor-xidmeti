import { ManagedImage, ImageSection } from '../types';

class ImageService {
  private images: ManagedImage[] = [];
  private listeners: Array<() => void> = [];
  private isLoaded: boolean = false;
  private isAuthenticated: boolean = false;

  constructor() {
    this.init();
  }

  private async init() {
    await this.fetchImages();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (e) {
        console.error('Listener notification error:', e);
      }
    });
  }

  // Session state (no tokens stored in localStorage or sessionStorage)
  public hasToken(): boolean {
    return this.isAuthenticated;
  }

  public isSessionActive(): boolean {
    return this.isAuthenticated;
  }

  // Server Auth Calls using httpOnly cookie (credentials: 'include')
  public async loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      console.log('[Auth Client Debug] login response status:', res.status);
      const data = await res.json();
      if (!res.ok) {
        this.isAuthenticated = false;
        return { success: false, error: data.error || 'Daxil olmaq mümkün olmadı' };
      }

      if (data.authenticated || data.success) {
        this.isAuthenticated = true;
        return { success: true };
      }
      return { success: false, error: 'Daxil olmaq mümkün olmadı' };
    } catch {
      return { success: false, error: 'Serverlə əlaqə qurula bilmədi' };
    }
  }

  public async verifyAdminSession(): Promise<boolean> {
    try {
      const res = await fetch('/api/admin/verify', {
        credentials: 'include'
      });
      console.log('[Auth Client Debug] verify response status:', res.status);
      const data = await res.json();
      if (res.ok && data.authenticated) {
        this.isAuthenticated = true;
        return true;
      }
      this.isAuthenticated = false;
      return false;
    } catch {
      this.isAuthenticated = false;
      return false;
    }
  }

  public async logoutAdmin(): Promise<void> {
    try {
      const res = await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      });
      console.log('[Auth Client Debug] logout response status:', res.status);
    } catch {}
    this.isAuthenticated = false;
  }

  // Images fetching & getters
  public async fetchImages(): Promise<ManagedImage[]> {
    try {
      const res = await fetch('/api/images', {
        credentials: 'include'
      });
      if (res.ok) {
        const data = await res.json();
        this.images = data;
        this.isLoaded = true;
        this.notify();
        return this.images;
      }
    } catch (e) {
      console.warn('Could not fetch images from server, using existing cache:', e);
    }
    return this.images;
  }

  public getAllImages(): ManagedImage[] {
    return [...this.images];
  }

  public getImages(): ManagedImage[] {
    return [...this.images];
  }

  public getImagesBySection(section: ImageSection): ManagedImage[] {
    return this.images
      .filter((img) => img.section === section)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public getImagesByTarget(targetId: string, section?: ImageSection): ManagedImage[] {
    return this.images
      .filter((img) => img.targetId === targetId && (!section || img.section === section))
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  public getCoverImage(targetId: string, section?: ImageSection, fallbackUrl: string = ''): string {
    const targetImages = this.getImagesByTarget(targetId, section);
    const cover = targetImages.find((img) => img.isCover);
    if (cover) return cover.url;
    if (targetImages.length > 0) return targetImages[0].url;
    return fallbackUrl;
  }

  public getGalleryImages(targetId: string, section?: ImageSection, fallbackUrls: string[] = []): string[] {
    const targetImages = this.getImagesByTarget(targetId, section);
    if (targetImages.length > 0) {
      return targetImages.map((img) => img.url);
    }
    return fallbackUrls;
  }

  // Protected Admin Actions (uses httpOnly cookie session)
  public async uploadImage(data: {
    section: ImageSection;
    targetId: string;
    targetName?: string;
    filename: string;
    altText: string;
    isCover: boolean;
    imageBase64: string;
    thumbBase64?: string;
    width?: number;
    height?: number;
    focalPoint?: { x: number; y: number };
  }): Promise<ManagedImage> {
    console.log('[Auth Client Debug] uploadImage calling /api/images/upload with credentials: include');
    const res = await fetch('/api/images/upload', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    console.log('[Auth Client Debug] uploadImage response status:', res.status);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Yükləmə xətası' }));
      throw new Error(err.error || 'Şəkil yüklənə bilmədi');
    }

    const created = await res.json();
    await this.fetchImages();
    return created;
  }

  public async replaceImage(
    id: string,
    data: {
      imageBase64: string;
      thumbBase64?: string;
      filename?: string;
      altText?: string;
      width?: number;
      height?: number;
      focalPoint?: { x: number; y: number };
    }
  ): Promise<ManagedImage> {
    console.log('[Auth Client Debug] replaceImage calling /api/images/' + id + '/replace with credentials: include');
    const res = await fetch(`/api/images/${id}/replace`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    console.log('[Auth Client Debug] replaceImage response status:', res.status);

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Əvəzetmə xətası' }));
      throw new Error(err.error || 'Şəkil əvəzlənə bilmədi');
    }

    const updated = await res.json();
    await this.fetchImages();
    return updated;
  }

  public async updateImageMeta(
    id: string,
    data: {
      altText?: string;
      filename?: string;
      focalPoint?: { x: number; y: number };
    }
  ): Promise<ManagedImage> {
    const res = await fetch(`/api/images/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      throw new Error('Məlumat yenilənmədi');
    }

    const updated = await res.json();
    await this.fetchImages();
    return updated;
  }

  public async setImageCover(id: string): Promise<void> {
    const res = await fetch(`/api/images/${id}/cover`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Qapaq şəkli dəyişdirilə bilmədi');
    }
    await this.fetchImages();
  }

  public async setCoverImage(id: string): Promise<void> {
    return this.setImageCover(id);
  }

  public async reorderImage(id: string, direction: 'up' | 'down'): Promise<void> {
    const targetImg = this.images.find((img) => img.id === id);
    if (!targetImg) return;

    const group = this.images
      .filter((img) => img.section === targetImg.section && img.targetId === targetImg.targetId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const index = group.findIndex((img) => img.id === id);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = group[index];
      group[index] = group[index - 1];
      group[index - 1] = temp;
    } else if (direction === 'down' && index < group.length - 1) {
      const temp = group[index];
      group[index] = group[index + 1];
      group[index + 1] = temp;
    } else {
      return;
    }

    const ids = group.map((img) => img.id);
    await this.reorderImages(ids);
  }

  public async reorderImages(ids: string[]): Promise<void> {
    const res = await fetch('/api/images/reorder', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ ids })
    });

    if (!res.ok) {
      throw new Error('Sıralama yadda saxlanılmadı');
    }
    await this.fetchImages();
  }

  public async deleteImage(id: string): Promise<void> {
    const res = await fetch(`/api/images/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });

    if (!res.ok) {
      throw new Error('Şəkil silinə bilmədi');
    }
    await this.fetchImages();
  }

  public async migrateToSupabase(): Promise<{
    success: boolean;
    total: number;
    migrated: number;
    skipped: number;
    errors: Array<{ id: string; error: string }>;
  }> {
    const res = await fetch('/api/admin/migrate-to-supabase', {
      method: 'POST',
      credentials: 'include',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'Miqrasiya xətası' }));
      throw new Error(err.error || 'Supabase miqrasiyası yerinə yetirilə bilmədi');
    }
    const result = await res.json();
    await this.fetchImages();
    return result;
  }
}

export const imageService = new ImageService();
