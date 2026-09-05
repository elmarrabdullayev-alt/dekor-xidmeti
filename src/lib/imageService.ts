import { ManagedImage, ImageSection } from '../types';

const TOKEN_KEY = 'dreamart_admin_token';

class ImageService {
  private images: ManagedImage[] = [];
  private listeners: Array<() => void> = [];
  private isLoaded: boolean = false;

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

  // Token management
  public hasToken(): boolean {
    return this.getAuthToken() !== null;
  }

  public getAuthToken(): string | null {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  public setAuthToken(token: string | null) {
    try {
      if (token) {
        sessionStorage.setItem(TOKEN_KEY, token);
      } else {
        sessionStorage.removeItem(TOKEN_KEY);
      }
    } catch {}
  }

  // Server Auth Calls
  public async loginAdmin(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Daxil olmaq mümkün olmadı' };
      }

      if (data.token) {
        this.setAuthToken(data.token);
        return { success: true };
      }
      return { success: false, error: 'Token alına bilmədi' };
    } catch {
      return { success: false, error: 'Serverlə əlaqə qurula bilmədi' };
    }
  }

  public async verifyAdminSession(): Promise<boolean> {
    const token = this.getAuthToken();
    if (!token) return false;

    try {
      const res = await fetch('/api/admin/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        return true;
      }
      this.setAuthToken(null);
      return false;
    } catch {
      return false;
    }
  }

  public async logoutAdmin(): Promise<void> {
    const token = this.getAuthToken();
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch {}
    }
    this.setAuthToken(null);
  }

  // Images fetching & getters
  public async fetchImages(): Promise<ManagedImage[]> {
    try {
      const res = await fetch('/api/images');
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

  // Protected Admin Actions
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
    const token = this.getAuthToken();
    if (!token) throw new Error('İcazəsiz müraciət. Zəhmət olmasa yenidən daxil olun.');

    const res = await fetch('/api/images/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

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
    const token = this.getAuthToken();
    if (!token) throw new Error('İcazəsiz müraciət. Zəhmət olmasa yenidən daxil olun.');

    const res = await fetch(`/api/images/${id}/replace`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

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
    const token = this.getAuthToken();
    if (!token) throw new Error('İcazəsiz müraciət');

    const res = await fetch(`/api/images/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
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
    const token = this.getAuthToken();
    if (!token) throw new Error('İcazəsiz müraciət');

    const res = await fetch(`/api/images/${id}/cover`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
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
    const token = this.getAuthToken();
    if (!token) throw new Error('İcazəsiz müraciət');

    const res = await fetch('/api/images/reorder', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ids })
    });

    if (!res.ok) {
      throw new Error('Sıralama yadda saxlanılmadı');
    }
    await this.fetchImages();
  }

  public async deleteImage(id: string): Promise<void> {
    const token = this.getAuthToken();
    if (!token) throw new Error('İcazəsiz müraciət');

    const res = await fetch(`/api/images/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Şəkil silinə bilmədi');
    }
    await this.fetchImages();
  }
}

export const imageService = new ImageService();
