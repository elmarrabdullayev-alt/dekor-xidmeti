import React, { useState } from 'react';
import { X, Edit3, Check } from 'lucide-react';
import { ManagedImage } from '../../types';
import { imageService } from '../../lib/imageService';

interface ImageMetaModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ManagedImage;
  onSuccess: (updatedImage: ManagedImage) => void;
}

export const ImageMetaModal: React.FC<ImageMetaModalProps> = ({
  isOpen,
  onClose,
  image,
  onSuccess
}) => {
  const [filename, setFilename] = useState(image.filename);
  const [altText, setAltText] = useState(image.altText);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!filename.trim()) {
      setError('Fayl adı boş ola bilməz');
      return;
    }
    if (!altText.trim()) {
      setError('Alt mətni boş ola bilməz');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const updated = await imageService.updateImageMeta(image.id, {
        filename: filename.trim(),
        altText: altText.trim()
      });
      onSuccess(updated);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Məlumat yenilənərkən xəta baş verdi');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      id="image-meta-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs"
    >
      <div
        id="image-meta-modal-container"
        className="relative w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl p-4 sm:p-6 text-white"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
          <h3 className="text-base font-semibold text-[#F5F5F7] flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[#C5A262]" />
            Fayl Adı və Alt Mətni
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-950/50 border border-red-800/50 text-red-300 text-xs">
            {error}
          </div>
        )}

        <div className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Fayl Adı:
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#1E1E1E] border border-[#333] rounded-lg text-neutral-200 focus:outline-none focus:border-[#C5A262]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Alt Təsviri (SEO Şəkil İzahı):
            </label>
            <textarea
              rows={3}
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-[#1E1E1E] border border-[#333] rounded-lg text-neutral-200 focus:outline-none focus:border-[#C5A262]"
            />
          </div>
        </div>

        <div className="mt-5 pt-3 border-t border-[#242424] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs rounded-lg text-neutral-400 hover:text-white bg-white/5"
          >
            Ləğv et
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#C5A262] text-black hover:bg-[#b08d4f] transition flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            {isSaving ? 'Yadda saxlanılır...' : 'Yadda Saxla'}
          </button>
        </div>
      </div>
    </div>
  );
};
