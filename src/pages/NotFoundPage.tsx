import React from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { ArrowLeft } from 'lucide-react';

interface NotFoundPageProps {
  navigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate }) => {
  return (
    <>
      <SeoHead
        title="Səhifə Tapılmadı (404) | DreamArt Events"
        description="Axtardığınız səhifə mövcud deyil və ya ünvan dəyişdirilib."
        canonicalPath="/404"
      />

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-24 text-center bg-[#0B0B0B] text-white">
        <span className="font-serif text-6xl sm:text-8xl text-[#C5A059] font-light block mb-4">
          404
        </span>
        <h1 className="font-serif text-2xl sm:text-3xl text-white font-normal mb-3">
          Səhifə Tapılmadı
        </h1>
        <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto mb-8 leading-relaxed font-light">
          Axtardığınız səhifə silinmiş ola bilər və ya linkdə kiçik bir yanlışlıq var.
        </p>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center space-x-2 bg-[#C5A059] hover:bg-[#D4AF37] text-[#0B0B0B] px-7 py-3 rounded-sm text-xs font-medium tracking-wide uppercase shadow-lg transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ana Səhifəyə Qayıt</span>
        </button>
      </div>
    </>
  );
};
