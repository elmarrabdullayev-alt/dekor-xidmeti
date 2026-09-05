import React, { useState, useRef } from 'react';
import { X, RefreshCw, Check, ArrowRight, Smartphone } from 'lucide-react';
import { ManagedImage } from '../../types';
import {
  optimizeUploadedImage,
  OptimizedImageResult,
  formatFileSize
} from '../../lib/imageOptimizer';
import { imageService } from '../../lib/imageService';

interface ImageReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ManagedImage;
  onSuccess: (updatedImage: ManagedImage) => void;
}

export const ImageReplaceModal: React.FC<ImageReplaceModalProps> = ({
  isOpen,
  onClose,
  image,
  onSuccess
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [optimized, setOptimized] = useState<OptimizedImageResult | null>(null);
  const [altText, setAltText] = useState(image.altText);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const isHero = image.section === 'home_hero';
      const result = await optimizeUploadedImage(file, {
        section: image.section,
        targetId: image.targetId,
        targetName: image.targetName,
        isCover: image.isCover,
        isHero
      });

      setOptimized(result);
    } catch (err: any) {
      setError(err.message || 'Şəkil emal edilərkən xəta baş verdi');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReplace = async () => {
    if (!optimized) {
      setError('Zəhmət olmasa yeni bir şəkil seçin');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const updated = await imageService.replaceImage(image.id, {
        imageBase64: optimized.fullDataUrl,
        thumbBase64: optimized.thumbDataUrl,
        altText: altText.trim() || image.altText,
        width: optimized.width,
        height: optimized.height
      });

      onSuccess(updated);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Şəkil əvəzlənərkən xəta baş verdi');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setOptimized(null);
    setError(null);
    setIsProcessing(false);
    setIsUploading(false);
    onClose();
  };

  return (
    <div
      id="image-replace-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="image-replace-modal-container"
        className="relative w-full max-w-lg bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl p-4 sm:p-6 text-white my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
          <div>
            <h3 className="text-lg font-semibold text-[#F5F5F7] flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-[#C5A262]" />
              Şəkli Dəyişdir (Əvəzlə)
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Fayl: <span className="text-neutral-200 font-mono">{image.filename}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Current vs New visual comparison */}
        <div className="mt-4 grid grid-cols-2 gap-3 items-center">
          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-neutral-400">Cari Şəkil:</span>
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#333] bg-black/50">
              <img src={image.url} alt={image.altText} className="w-full h-full object-cover" />
            </div>
            <span className="text-[10px] text-neutral-500 block truncate">{image.filename}</span>
          </div>

          <div className="space-y-1.5">
            <span className="text-[11px] font-medium text-neutral-400">Yeni Şəkil:</span>
            {optimized ? (
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-[#C5A262] bg-black/50">
                <img src={optimized.fullDataUrl} alt="Yeni şəkil" className="w-full h-full object-cover" />
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
                className="aspect-video w-full rounded-lg border-2 border-dashed border-[#3A3A3A] hover:border-[#C5A262] bg-[#1A1A1A] flex flex-col items-center justify-center p-2 text-center transition cursor-pointer"
              >
                <Smartphone className="w-5 h-5 text-[#C5A262] mb-1" />
                <span className="text-[11px] text-neutral-300">
                  {isProcessing ? 'Sıxılır...' : 'Yeni şəkil seç'}
                </span>
              </button>
            )}
            {optimized && (
              <span className="text-[10px] text-emerald-400 block font-mono">
                WebP {formatFileSize(optimized.optimizedSizeKb)}
              </span>
            )}
          </div>
        </div>

        {/* Hidden input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {optimized && (
          <div className="mt-4 space-y-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#C5A262] hover:underline"
            >
              Fərqli şəkil seç
            </button>

            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Alt Təsviri (Yeniləmək istəyirsinizsə):
              </label>
              <textarea
                rows={2}
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1E1E1E] border border-[#333] rounded-lg text-neutral-200 focus:outline-none focus:border-[#C5A262]"
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-[#242424] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 text-xs font-medium rounded-lg text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition"
          >
            Ləğv et
          </button>
          <button
            type="button"
            onClick={handleReplace}
            disabled={!optimized || isUploading || isProcessing}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#C5A262] hover:bg-[#b08d4f] text-black transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isUploading ? (
              <>Əvəzlənir...</>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Dəyişikliyi Təsdiqlə
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
