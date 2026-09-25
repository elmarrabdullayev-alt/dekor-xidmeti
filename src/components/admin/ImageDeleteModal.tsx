import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { ManagedImage } from '../../types';

interface ImageDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  image?: ManagedImage | null;
  isDeleting?: boolean;
}

export const ImageDeleteModal: React.FC<ImageDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  image,
  isDeleting = false
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="image-delete-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs"
    >
      <div
        id="image-delete-modal-container"
        className="relative w-full max-w-md bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl p-4 sm:p-6 text-white"
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#242424]">
          <h3 className="text-base font-semibold text-red-400 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Şəkli Sil
          </h3>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition disabled:opacity-50 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          <p className="text-sm text-neutral-300">
            Bu şəkli silmək istədiyinizə əminsiniz? Bu əməliyyat geri qaytarılmır.
          </p>

          {image && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-black/40 border border-[#242424]">
              <img
                src={image.thumbUrl || image.url}
                alt={image.altText || image.filename}
                className="w-14 h-14 object-cover rounded-lg border border-white/10 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{image.filename}</p>
                <p className="text-[11px] text-neutral-400 truncate mt-0.5">{image.altText || 'Alt mətni yoxdur'}</p>
                {image.isCover && (
                  <span className="inline-block mt-1 text-[10px] text-amber-400 font-mono">
                    ★ Əsas Qapaq Şəkli
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#242424]">
          <button
            id="cancel-delete-btn"
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-medium text-neutral-300 hover:text-white bg-[#1E1E1E] hover:bg-[#252525] rounded-xl transition disabled:opacity-50 cursor-pointer"
          >
            İmtina
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition flex items-center gap-2 shadow-lg shadow-red-600/30 disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
            <span>Bəli, Sil</span>
          </button>
        </div>
      </div>
    </div>
  );
};
