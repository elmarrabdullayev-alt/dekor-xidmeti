import React, { useState } from 'react';
import { Phone, ArrowRight, CheckCircle2, MessageCircle } from 'lucide-react';
import { store } from '../../lib/store';

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
      if (onSuccess) onSuccess();
    }, 400);
  };

  const handleWhatsAppDirect = () => {
    const text = `Salam, DreamArt Events! Tədbirim üçün qiymət təklifi almaq istəyirəm.\n\n` +
      `Ad: ${formData.name || 'Göstərilməyib'}\n` +
      `Telefon: ${formData.phone || 'Göstərilməyib'}\n` +
      (initialDecorName ? `Seçilmiş dekor: ${initialDecorName}\n` : '') +
      (formData.notes ? `Qeyd: ${formData.notes}` : '');

    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="quote-section" className="py-16 sm:py-24 bg-[#0B0B0B] text-white border-b border-white/10 relative overflow-hidden">
      {/* Subtle atmospheric glow behind quote section */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#C5A059]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column matching mockup */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-medium font-sans block">
              BİZİMLƏ ƏLAQƏ
            </span>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-[1.15]">
              Gəlin, xəyalınızdakı tədbiri birlikdə gerçəkləşdirək!
            </h2>

            <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed max-w-lg">
              Tədbiriniz üçün fərdi təklif almaq və ətraflı məlumat üçün bizimlə əlaqə saxlayın.
            </p>

            {/* Direct Phone Callout Box matching mockup */}
            <div className="pt-2">
              <a
                href={`tel:${settings.phoneRaw}`}
                className="inline-flex items-center gap-4 bg-[#141414] border border-[#C5A059]/40 hover:border-[#C5A059] p-4 sm:p-5 rounded-sm transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-[#C5A059]/15 border border-[#C5A059]/40 flex items-center justify-center text-[#C5A059] group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-[#0B0B0B] transition-all shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-mono font-medium text-white group-hover:text-[#E5C378] transition-colors">
                    {settings.phoneDisplay}
                  </div>
                  <div className="text-xs text-[#C5A059] mt-0.5">
                    Hər zaman sizin üçün buradayıq!
                  </div>
                </div>
              </a>
            </div>

            <div className="pt-1">
              <button
                type="button"
                onClick={handleWhatsAppDirect}
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/80 hover:text-[#25D366] transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>WhatsApp ilə birbaşa yazın</span>
              </button>
            </div>
          </div>

          {/* Right Column: Refined Direct Form matching mockup */}
          <div className="lg:col-span-6">
            <div className="bg-[#121212] rounded-sm border border-white/10 hover:border-[#C5A059]/40 p-6 sm:p-8 shadow-2xl transition-colors">
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
                    className="text-xs text-[#C5A059] underline hover:text-white pt-2"
                  >
                    Yeni müraciət göndər
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="pb-1">
                    <h3 className="font-serif text-xl sm:text-2xl text-white font-normal">
                      Qiymət təklifi alın
                    </h3>
                    <p className="text-xs text-white/60 font-light mt-1">
                      Məlumatlarınızı qeyd edin, dərhal əlaqə saxlayaq.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                      Adınız
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Məsələn: Leyla Əliyeva"
                      className="w-full bg-[#181818] border border-white/10 focus:border-[#C5A059] rounded-sm px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                      Telefon nömrəniz
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="050 123 45 67"
                      className="w-full bg-[#181818] border border-white/10 focus:border-[#C5A059] rounded-sm px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                      Tədbir haqqında qısa məlumat
                    </label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Tədbir növü, planlaşdırılan tarix, məkan və ya arzuladığınız konsept..."
                      className="w-full bg-[#181818] border border-white/10 focus:border-[#C5A059] rounded-sm px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-50 text-[#0B0B0B] font-medium py-3.5 rounded-sm text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{loading ? 'Göndərilir...' : 'Qiymət təklifi al'}</span>
                    <ArrowRight className="w-4 h-4" />
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
