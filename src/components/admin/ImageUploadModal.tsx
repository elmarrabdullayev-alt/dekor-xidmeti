import React, { useState, useRef } from 'react';
import { X, Upload, Sparkles, Check, Image as ImageIcon, Sliders, Smartphone, Layers, Loader2 } from 'lucide-react';
import { ImageSection, ManagedImage } from '../../types';
import {
  optimizeUploadedImage,
  OptimizedImageResult,
  formatFileSize,
  generateSuggestedFilename,
  generateSuggestedAltText
} from '../../lib/imageOptimizer';
import { imageService } from '../../lib/imageService';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  section: ImageSection;
  targetId: string;
  targetName: string;
  maxAllowed?: number;
  currentCount?: number;
  onSuccess: (newImage: ManagedImage) => void;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  section,
  targetId,
  targetName,
  maxAllowed,
  currentCount = 0,
  onSuccess
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Single file mode
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [optimized, setOptimized] = useState<OptimizedImageResult | null>(null);

  // Multiple files mode
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User-editable fields
  const [filename, setFilename] = useState('');
  const [altText, setAltText] = useState('');
  const [isCover, setIsCover] = useState(false);

  // Focal point for Hero 16:9
  const [focalPosition, setFocalPosition] = useState<'center' | 'top' | 'bottom'>('center');

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    setError(null);

    const isIndianWedding = section === 'indian_wedding' || targetId === 'indian-wedding';
    const isDestinationWedding = section === 'destination_wedding' || targetId === 'destination-wedding';
    const effectiveLimit = maxAllowed || (isIndianWedding || isDestinationWedding ? 2 : undefined);
    if (effectiveLimit !== undefined) {
      if (currentCount >= effectiveLimit) {
        setError(`Maksimum ${effectiveLimit} şəkil həddi dolub (${currentCount}/${effectiveLimit}).`);
        return;
      }
      if (fileList.length > (effectiveLimit - currentCount)) {
        setError(`Bu bölmə üçün yalnız ${effectiveLimit - currentCount} əlavə şəkil yükləyə bilərsiniz (maksimum ${effectiveLimit}).`);
        return;
      }
    }

    // If user selected multiple files
    if (fileList.length > 1) {
      const filesArray = Array.from(fileList);
      setBatchFiles(filesArray);
      setSelectedFile(null);
      setOptimized(null);
      return;
    }

    // Single file selected
    const file = fileList[0];
    setBatchFiles([]);
    setSelectedFile(file);
    setIsProcessing(true);

    try {
      const isHero = section === 'home_hero';
      const focalY = focalPosition === 'top' ? 20 : focalPosition === 'bottom' ? 80 : 50;

      const result = await optimizeUploadedImage(file, {
        section,
        targetId,
        targetName,
        isCover,
        isHero,
        focalPoint: { x: 50, y: focalY }
      });

      setOptimized(result);
      setFilename(result.suggestedFilename);
      setAltText(result.suggestedAltText);
    } catch (err: any) {
      setError(err.message || 'Şəkil emal edilərkən xəta baş verdi');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFocalChange = async (pos: 'center' | 'top' | 'bottom') => {
    setFocalPosition(pos);
    if (!selectedFile) return;

    setIsProcessing(true);
    try {
      const focalY = pos === 'top' ? 20 : pos === 'bottom' ? 80 : 50;
      const result = await optimizeUploadedImage(selectedFile, {
        section,
        targetId,
        targetName,
        isCover,
        isHero: section === 'home_hero',
        focalPoint: { x: 50, y: focalY }
      });
      setOptimized(result);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSingleSave = async () => {
    if (!optimized) {
      setError('Zəhmət olmasa bir şəkil seçin');
      return;
    }

    if (!filename.trim()) {
      setError('Fayl adı boş ola bilməz');
      return;
    }

    if (!altText.trim()) {
      setError('Alt mətni (təsviri) boş ola bilməz');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const focalY = focalPosition === 'top' ? 20 : focalPosition === 'bottom' ? 80 : 50;
      const newImage = await imageService.uploadImage({
        section,
        targetId,
        targetName,
        filename: filename.trim(),
        altText: altText.trim(),
        isCover,
        imageBase64: optimized.fullDataUrl,
        thumbBase64: optimized.thumbDataUrl,
        width: optimized.width,
        height: optimized.height,
        focalPoint: section === 'home_hero' ? { x: 50, y: focalY } : undefined
      });

      onSuccess(newImage);
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Serverə yüklənmə zamanı xəta baş verdi');
    } finally {
      setIsUploading(false);
    }
  };

  const handleBatchSave = async () => {
    if (batchFiles.length === 0) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress({ current: 0, total: batchFiles.length });

    let lastUploaded: ManagedImage | null = null;

    try {
      for (let i = 0; i < batchFiles.length; i++) {
        setUploadProgress({ current: i + 1, total: batchFiles.length });
        const file = batchFiles[i];

        const shouldBeCover = i === 0 && isCover;
        const result = await optimizeUploadedImage(file, {
          section,
          targetId,
          targetName,
          isCover: shouldBeCover,
          isHero: section === 'home_hero',
          focalPoint: { x: 50, y: 50 }
        });

        // Unique filename per batch item
        const uniqueFilename = result.suggestedFilename.replace(
          /\.webp$/,
          `-${Date.now().toString(36)}-${i + 1}.webp`
        );

        lastUploaded = await imageService.uploadImage({
          section,
          targetId,
          targetName,
          filename: uniqueFilename,
          altText: `${result.suggestedAltText} #${i + 1}`,
          isCover: shouldBeCover,
          imageBase64: result.fullDataUrl,
          thumbBase64: result.thumbDataUrl,
          width: result.width,
          height: result.height,
        });
      }

      if (lastUploaded) {
        onSuccess(lastUploaded);
      }
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Bəzi şəkillər yüklənərkən xəta baş verdi');
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setBatchFiles([]);
    setOptimized(null);
    setError(null);
    setIsProcessing(false);
    setIsUploading(false);
    setUploadProgress(null);
    onClose();
  };

  return (
    <div
      id="image-upload-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs overflow-y-auto"
    >
      <div
        id="image-upload-modal-container"
        className="relative w-full max-w-lg bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl p-4 sm:p-6 text-white my-8 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#242424]">
          <div>
            <h3 className="text-lg font-semibold text-[#F5F5F7] flex items-center gap-2">
              <Upload className="w-5 h-5 text-[#C5A262]" />
              {batchFiles.length > 1 ? 'Çoxsaylı Şəkil Yüklə' : 'Yeni Şəkil Yüklə'}
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Hədəf: <span className="text-[#C5A262] font-medium">{targetName}</span>
            </p>
          </div>
          <button
            id="close-upload-modal-btn"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mt-3 p-3 rounded-xl bg-red-950/50 border border-red-800/50 text-red-300 text-xs">
            {error}
          </div>
        )}

        {/* Hidden Multi-file File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileChange}
          className="hidden"
          id="mobile-image-file-input"
        />

        {/* State 1: No file selected */}
        {!optimized && batchFiles.length === 0 && (
          <div className="mt-4">
            <button
              id="select-image-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              className="w-full py-10 px-4 border-2 border-dashed border-[#3A3A3A] hover:border-[#C5A262] rounded-xl flex flex-col items-center justify-center gap-2 bg-[#1A1A1A] transition text-center group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-[#C5A262] group-hover:scale-110 transition">
                <Smartphone className="w-6 h-6" />
              </div>
              <div className="text-sm font-medium text-neutral-200">
                {isProcessing ? 'Şəkillər emal edilir...' : 'Şəkil və ya şəkillər seçin'}
              </div>
              <div className="text-xs text-neutral-500 max-w-xs">
                Bir və ya bir neçə şəkil seçə bilərsiniz (Multiple upload dəstəklənir). Avtomatik WebP və ölçü optimallaşdırılması aparılır.
              </div>
            </button>
          </div>
        )}

        {/* State 2: Multiple Files Batch View */}
        {batchFiles.length > 1 && (
          <div className="mt-4 space-y-4">
            <div className="p-3.5 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-[#C5A262]/10 border border-[#C5A262]/30 flex items-center justify-center text-[#C5A262]">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {batchFiles.length} şəkil seçildi
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Bütün şəkillər ardıcıl şəkildə optimallaşdırılıb yüklənəcək
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-[#C5A262] hover:underline cursor-pointer"
              >
                Dəyiş
              </button>
            </div>

            {/* List preview of batch files */}
            <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-black/40 rounded-xl border border-white/5">
              {batchFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-white/[0.03]">
                  <span className="font-mono text-neutral-300 truncate max-w-[240px]">
                    {idx + 1}. {file.name}
                  </span>
                  <span className="text-neutral-500 text-[11px] font-mono">
                    {formatFileSize(Math.round(file.size / 1024))}
                  </span>
                </div>
              ))}
            </div>

            {/* Cover option */}
            <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={isCover}
                onChange={(e) => setIsCover(e.target.checked)}
                className="w-4 h-4 rounded text-[#C5A262] focus:ring-[#C5A262]"
              />
              <span className="text-xs text-neutral-200 font-medium">
                İlk şəkli əsas "Qapaq şəkli" (Cover image) kimi təyin et
              </span>
            </label>

            {uploadProgress && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300 flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 text-[#C5A262] animate-spin" />
                    Şəkillər yüklənir...
                  </span>
                  <span className="font-mono text-[#C5A262]">
                    {uploadProgress.current} / {uploadProgress.total}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-black/60 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#C5A262] transition-all duration-300 rounded-full"
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* State 3: Single File Detailed View */}
        {optimized && batchFiles.length === 0 && (
          <div className="mt-4 space-y-4">
            {/* Preview with Optimization Stats */}
            <div className="relative rounded-xl overflow-hidden border border-[#2E2E2E] bg-black/40">
              <div className={section === 'home_hero' ? 'aspect-16/9 w-full' : 'max-h-64 w-full flex items-center justify-center'}>
                <img
                  src={optimized.fullDataUrl}
                  alt={altText || 'Önizləmə'}
                  className={`w-full h-full object-cover ${
                    focalPosition === 'top' ? 'object-top' : focalPosition === 'bottom' ? 'object-bottom' : 'object-center'
                  }`}
                />
              </div>

              {/* Badges overlay */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-[11px] font-medium">
                  WebP formatı
                </span>
                <span className="px-2 py-0.5 rounded-md bg-black/70 border border-white/10 text-white text-[11px]">
                  {optimized.width} × {optimized.height} px
                </span>
              </div>

              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/80 border border-white/20 text-[11px] font-mono text-neutral-300">
                <span className="line-through text-neutral-500 mr-1.5">{formatFileSize(optimized.originalSizeKb)}</span>
                <span className="text-[#C5A262] font-semibold">{formatFileSize(optimized.optimizedSizeKb)}</span>
              </div>
            </div>

            {/* 16:9 Focal Position controls for Hero */}
            {section === 'home_hero' && (
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <div className="text-xs font-medium text-neutral-300 mb-2 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#C5A262]" />
                  Hero Kəsim və Fokus Nöqtəsi (16:9 Ekranlar üçün):
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleFocalChange('top')}
                    className={`py-1.5 text-xs rounded-lg border transition ${
                      focalPosition === 'top'
                        ? 'bg-[#C5A262] text-black font-semibold border-[#C5A262]'
                        : 'bg-[#222] text-neutral-300 border-[#333] hover:bg-[#2A2A2A]'
                    }`}
                  >
                    Yuxarı Fokus
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFocalChange('center')}
                    className={`py-1.5 text-xs rounded-lg border transition ${
                      focalPosition === 'center'
                        ? 'bg-[#C5A262] text-black font-semibold border-[#C5A262]'
                        : 'bg-[#222] text-neutral-300 border-[#333] hover:bg-[#2A2A2A]'
                    }`}
                  >
                    Mərkəz Fokus
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFocalChange('bottom')}
                    className={`py-1.5 text-xs rounded-lg border transition ${
                      focalPosition === 'bottom'
                        ? 'bg-[#C5A262] text-black font-semibold border-[#C5A262]'
                        : 'bg-[#222] text-neutral-300 border-[#333] hover:bg-[#2A2A2A]'
                    }`}
                  >
                    Aşağı Fokus
                  </button>
                </div>
              </div>
            )}

            {/* Editable Filename */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                SEO Fayl Adı (avtomatik təklif olunub):
              </label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1E1E1E] border border-[#333] rounded-lg text-neutral-200 focus:outline-none focus:border-[#C5A262]"
                placeholder="dreamart-toy-dekoru-01.webp"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Telefondakı IMG_XXXX kimi adlar təmizlənərək axtarış dostu formata salınır.
              </p>
            </div>

            {/* Editable Alt Text */}
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1">
                Alt Təsviri (Şəkil mətni):
              </label>
              <textarea
                rows={2}
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-[#1E1E1E] border border-[#333] rounded-lg text-neutral-200 focus:outline-none focus:border-[#C5A262]"
                placeholder="DreamArt Events premium dekor tərtibatı"
              />
            </div>

            {/* Cover Image checkbox */}
            <label className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/5 border border-white/10 cursor-pointer">
              <input
                type="checkbox"
                checked={isCover}
                onChange={(e) => setIsCover(e.target.checked)}
                className="w-4 h-4 rounded text-[#C5A262] focus:ring-[#C5A262]"
              />
              <span className="text-xs text-neutral-200 font-medium">
                Bu şəkli əsas "Qapaq şəkli" (Cover image) kimi təyin et
              </span>
            </label>

            {/* Change selection button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-xs text-[#C5A262] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Başqa şəkil seç
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-[#242424] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="px-4 py-2 text-xs font-medium rounded-lg text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
          >
            Ləğv et
          </button>

          {batchFiles.length > 1 ? (
            <button
              id="confirm-batch-upload-btn"
              type="button"
              onClick={handleBatchSave}
              disabled={isUploading || isProcessing}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#C5A262] hover:bg-[#b08d4f] text-black transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              {isUploading ? (
                <>Yüklənir...</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Hamısını Yüklə ({batchFiles.length} şəkil)
                </>
              )}
            </button>
          ) : (
            <button
              id="confirm-upload-btn"
              type="button"
              onClick={handleSingleSave}
              disabled={!optimized || isUploading || isProcessing}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#C5A262] hover:bg-[#b08d4f] text-black transition flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-md"
            >
              {isUploading ? (
                <>Serverə yüklənir...</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Yadda Saxla və Yüklə
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
