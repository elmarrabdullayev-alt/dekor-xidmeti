import React, { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

export interface LightboxImage {
  url: string;
  alt: string;
  title?: string;
  caption?: string;
}

interface ImageLightboxProps {
  isOpen: boolean;
  images: LightboxImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate?: (newIndex: number) => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  isOpen,
  images,
  currentIndex: propCurrentIndex,
  onClose,
  onNavigate
}) => {
  const [index, setIndex] = useState(propCurrentIndex);
  const [isZoomed, setIsZoomed] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    setIndex(propCurrentIndex);
    setIsZoomed(false);
  }, [propCurrentIndex, isOpen]);

  const handlePrev = useCallback(() => {
    setIndex((prev) => {
      const nextIdx = prev > 0 ? prev - 1 : images.length - 1;
      onNavigate?.(nextIdx);
      return nextIdx;
    });
    setIsZoomed(false);
  }, [images.length, onNavigate]);

  const handleNext = useCallback(() => {
    setIndex((prev) => {
      const nextIdx = prev < images.length - 1 ? prev + 1 : 0;
      onNavigate?.(nextIdx);
      return nextIdx;
    });
    setIsZoomed(false);
  }, [images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleNext, handlePrev, onClose]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    if (Math.abs(diffX) > 40) {
      if (diffX > 0) {
        handleNext(); // swipe left -> next
      } else {
        handlePrev(); // swipe right -> prev
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  if (!isOpen || images.length === 0) return null;

  const currentImg = images[index] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Şəkil Qalereyası"
      className="fixed inset-0 z-[100] flex flex-col bg-black/95 backdrop-blur-md select-none transition-opacity duration-300 animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Header Controls */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#C5A059]/20 bg-gradient-to-b from-black/80 to-transparent z-20">
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-[#E5C378] tracking-widest px-2.5 py-1 rounded-sm bg-[#C5A059]/10 border border-[#C5A059]/30">
            {index + 1} / {images.length}
          </span>
          {currentImg.title && (
            <span className="hidden sm:inline-block font-serif text-sm text-white/90 truncate max-w-md">
              {currentImg.title}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom toggle button */}
          <button
            type="button"
            onClick={() => setIsZoomed(!isZoomed)}
            title={isZoomed ? 'Kiçilt' : 'Böyüt'}
            className="p-2 text-white/70 hover:text-[#E5C378] hover:bg-white/5 rounded-full transition-colors cursor-pointer"
          >
            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
          </button>

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            title="Bağla (Esc)"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden cursor-default"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            title="Əvvəlki şəkil"
            className="absolute left-2 sm:left-4 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#C5A059] text-white hover:text-black border border-white/20 hover:border-[#C5A059] transition-all duration-200 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Current Image Container (No distortion, strict aspect ratio preservation) */}
        <div
          className={`relative max-w-full max-h-full flex items-center justify-center transition-transform duration-300 ${
            isZoomed ? 'scale-125 sm:scale-150 cursor-zoom-out' : 'cursor-zoom-in'
          }`}
          onClick={() => setIsZoomed(!isZoomed)}
        >
          <img
            src={currentImg.url}
            alt={currentImg.alt}
            className="max-h-[72vh] sm:max-h-[78vh] max-w-[92vw] object-contain rounded-xs shadow-[0_10px_40px_rgba(0,0,0,0.9)] border border-white/10"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            title="Növbəti şəkil"
            className="absolute right-2 sm:right-4 z-30 p-2.5 sm:p-3 rounded-full bg-black/60 hover:bg-[#C5A059] text-white hover:text-black border border-white/20 hover:border-[#C5A059] transition-all duration-200 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Info & Thumbnail Bar */}
      <div className="z-20 bg-gradient-to-t from-black via-black/90 to-transparent border-t border-[#C5A059]/20 px-4 py-3">
        {/* Caption & Alt Text */}
        <div className="text-center max-w-2xl mx-auto mb-2.5">
          <p className="text-xs sm:text-sm text-[#F5E6C8] font-serif font-light leading-snug">
            {currentImg.alt}
          </p>
          {currentImg.caption && (
            <p className="text-[11px] text-white/50 font-light mt-0.5">
              {currentImg.caption}
            </p>
          )}
        </div>

        {/* Thumbnails Row */}
        {images.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto py-1 max-w-3xl mx-auto no-scrollbar">
            {images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setIndex(i);
                  setIsZoomed(false);
                  onNavigate?.(i);
                }}
                className={`relative w-11 h-11 sm:w-14 sm:h-14 shrink-0 rounded-xs overflow-hidden border transition-all cursor-pointer ${
                  i === index
                    ? 'border-[#E5C378] ring-2 ring-[#C5A059]/50 scale-105'
                    : 'border-white/15 opacity-50 hover:opacity-100'
                }`}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
