import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { ManagedImage } from '../../types';
import { imageService } from '../../lib/imageService';

interface ImageDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: ManagedImage | null;
  sectionLabel?: string;
  onSuccess: (deletedId: string) => void;
}

export const ImageDeleteModal: React.FC<ImageDeleteModalProps> = ({
  isOpen,
  onClose,
  image,
  sectionLabel,
  onSuccess
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !image) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      await imageService.deleteImage(image.id);
      onSuccess(image.id);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Şəkil silinərkən xəta baş verdi');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      id="image-delete-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs"
    >
      <div
        id="image-delete-modal-container"
        className="relative w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl p-4 sm:p-6 text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
          <h3 className="text-base font-semibold text-red-400 flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-400" />
            Şəklin Silinməsi
          </h3>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-2.5 rounded-lg bg-red-950/50 border border-red-800/50 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="mt-4 space-y-4">
          {/* Thumbnail & File details */}
          <div className="flex items-center gap-3.5 p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A]">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-neutral-900 shrink-0 border border-white/10 relative">
              <img
                src={image.thumbUrl || image.url}
                alt={image.altText || image.filename}
                className="w-full h-full object-cover"
              />
              {image.isCover && (
                <div className="absolute top-1 left-1 bg-[#C5A262] text-black text-[9px] font-bold px-1 rounded">
                  Qapaq
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-neutral-200 truncate">
                {image.filename}
              </p>
              <p className="text-[11px] text-neutral-400 mt-0.5 truncate">
                Bölmə: <span className="text-[#C5A262]">{sectionLabel || image.section}</span>
              </p>
              {image.targetName && (
                <p className="text-[11px] text-neutral-400 truncate">
                  Hədəf: {image.targetName}
                </p>
              )}
            </div>
          </div>

          {/* Warning */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-950/30 border border-red-900/40 text-red-300 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <div>
              <p className="font-semibold text-red-200">
                Bu şəkli silmək istədiyinizə əminsiniz?
              </p>
              <p className="text-neutral-400 text-[11px] mt-1">
                Bu əməliyyat faylı və bütün məlumatları serverdən tamamilə silir və geri qaytarıla bilməz.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-5 pt-3 border-t border-[#242424] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-3.5 py-2 text-xs font-medium rounded-lg text-neutral-300 bg-white/5 hover:bg-white/10 transition disabled:opacity-50"
          >
            İmtina
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition flex items-center gap-1.5 disabled:opacity-50 shadow-lg shadow-red-900/30"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Silinir...
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                Sil
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
