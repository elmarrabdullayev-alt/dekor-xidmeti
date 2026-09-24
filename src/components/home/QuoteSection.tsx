import React, { useState } from 'react';
import { Phone, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { store } from '../../lib/store';
import { getWhatsAppQuoteUrl, OFFICIAL_WHATSAPP_NUMBER } from '../../lib/whatsapp';

interface QuoteSectionProps {
  initialDecorName?: string;
  onSuccess?: () => void;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ initialDecorName, onSuccess }) => {
  const settings = store.getSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleWhatsAppDirect = () => {
    let text = initialDecorName
      ? `Salam, DreamArt Weddings! "${initialDecorName}" üçün qiymət təklifi almaq istəyirəm.`
      : 'Salam, DreamArt Weddings dekor xidməti ilə bağlı qiymət təklifi almaq istəyirəm.';

    if (formData.name || formData.phone || formData.notes) {
      text += `\n\nAd: ${formData.name || 'Göstərilməyib'}\nTelefon: ${formData.phone || 'Göstərilməyib'}`;
      if (formData.notes) text += `\nQeyd: ${formData.notes}`;
    }

    const url = `https://wa.me/${OFFICIAL_WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    setLoading(true);
    setTimeout(() => {
      store.addInquiry({
        name: formData.name,
        phone: formData.phone,
        eventType: initialDecorName || 'Dekor Sifarişi',
        date: '',
        location: 'Bakı',
        notes: formData.notes,
        decorName: initialDecorName
      });
      setLoading(false);
      setSubmitted(true);
      handleWhatsAppDirect();
      if (onSuccess) onSuccess();
    }, 400);
  };

  return (
    <section id="quote-section" className="py-20 sm:py-28 bg-[#0B0B0B] text-white border-b border-[#C5A059]/15 relative overflow-hidden">
      {/* Subtle atmospheric glow behind quote section */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-[#C5A059]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Brand Invitation Message */}
          <div className="lg:col-span-6 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-px bg-[#C5A059]" />
              <span className="font-script text-2xl sm:text-3xl text-[#E5C378] select-none">
                Birlikdə Yaradaq
              </span>
            </div>

            <h2 className="font-serif text-3.5xl sm:text-4.5xl md:text-5xl text-white font-normal leading-[1.12]">
              Gəlin, xəyalınızdakı mərasimi birlikdə gerçəkləşdirək!
            </h2>

            <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed max-w-lg">
              Toy, nişan, xına və ya korporativ tədbiriniz üçün fərdi bədii baxış və konsept hesabatı almaq üçün bizimlə əlaqə saxlayın.
            </p>

            {/* Direct Phone Callout Box */}
            <div className="pt-2">
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex items-center gap-4 bg-[#12110E] border border-[#C5A059]/35 hover:border-[#C5A059] p-4 sm:p-5 rounded-sm transition-all duration-300 group shadow-lg hover:shadow-[0_4px_25px_rgba(197,160,89,0.2)]"
              >
                <div className="w-12 h-12 rounded-full bg-[#1A1814] border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-[#0A0A0A] transition-all shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-mono font-medium text-white group-hover:text-[#E5C378] transition-colors tracking-wide">
                    {settings.phoneDisplay}
                  </div>
                  <div className="text-xs text-[#C5A059]/90 mt-0.5 font-light">
                    Hər zaman zərif məsləhət üçün buradayıq!
                  </div>
                </div>
              </a>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="inline-flex items-center gap-2.5 text-xs sm:text-sm text-white/80 hover:text-[#25D366] transition-colors cursor-pointer group"
              >
                <div className="w-7 h-7 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <span className="border-b border-white/20 group-hover:border-[#25D366]">WhatsApp ilə birbaşa yazın</span>
              </button>
            </div>
          </div>

          {/* Right Column: Refined Atelier Direct Form */}
          <div className="lg:col-span-6">
            <div className="bg-[#12110E] rounded-sm border border-[#C5A059]/25 hover:border-[#C5A059]/50 p-6 sm:p-9 shadow-2xl transition-colors relative">
              {/* Subtle top frame notch */}
              <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#C5A059]/40 to-transparent" />

              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059]">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif text-2xl text-white">Müraciətiniz qəbul edildi!</h3>
                  <p className="text-xs sm:text-sm text-white/70 max-w-sm mx-auto font-light">
                    Təşəkkür edirik. Dizaynerimiz ən qısa zamanda sizinlə əlaqə saxlayaraq fərdi təklif təqdim edəcək.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', notes: '' });
                    }}
                    className="text-xs text-[#C5A059] underline hover:text-white pt-2 cursor-pointer"
                  >
                    Yeni müraciət göndər
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="pb-1">
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                      Qiymət Təklifi Alın
                    </h3>
                    <p className="text-xs text-white/60 font-light mt-1">
                      Məlumatlarınızı qeyd edin, dizaynerimiz dərhal əlaqə saxlasın.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/75 mb-1.5 font-medium font-sans">
                      Ad və Soyadınız
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Məsələn: Leyla Əliyeva"
                      className="w-full bg-[#181714] border border-[#C5A059]/20 focus:border-[#C5A059] rounded-sm px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/75 mb-1.5 font-medium font-sans">
                      Telefon nömrəniz
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="050 123 45 67"
                      className="w-full bg-[#181714] border border-[#C5A059]/20 focus:border-[#C5A059] rounded-sm px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-white/75 mb-1.5 font-medium font-sans">
                      Tədbir haqqında qısa məlumat
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Tədbir növü, planlaşdırılan tarix, məkan və ya arzuladığınız konsept..."
                      className="w-full bg-[#181714] border border-[#C5A059]/20 focus:border-[#C5A059] rounded-sm px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#C5A059] via-[#D4AF37] to-[#C5A059] hover:from-[#D4AF37] hover:to-[#E5C378] disabled:opacity-50 text-[#0A0A0A] font-semibold py-3.5 rounded-sm text-xs sm:text-sm tracking-wider uppercase transition-all duration-300 shadow-[0_4px_20px_rgba(197,160,89,0.3)] hover:shadow-[0_6px_30px_rgba(197,160,89,0.5)] flex items-center justify-center gap-2 cursor-pointer mt-3"
                  >
                    <span>{loading ? 'Göndərilir...' : 'Qiymət təklifi al'}</span>
                    <ArrowRight className="w-4 h-4 text-[#0A0A0A]" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
