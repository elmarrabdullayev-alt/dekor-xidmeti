import React, { useState } from 'react';
import { Phone, ArrowRight, CheckCircle2, MessageCircle, AlertCircle } from 'lucide-react';
import { store } from '../../lib/store';
import { sendQuoteRequest } from '../../lib/quoteService';

interface QuoteSectionProps {
  initialDecorName?: string;
  onSuccess?: () => void;
}

export const QuoteSection: React.FC<QuoteSectionProps> = ({ initialDecorName, onSuccess }) => {
  const settings = store.getSettings();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
    honeypot: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Zəhmət olmasa adınızı və əlaqə nömrənizi daxil edin.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Save inquiry locally for admin panel
    store.addInquiry({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      eventType: initialDecorName || 'Dekor Sifarişi',
      date: '',
      location: 'Bakı',
      notes: formData.notes.trim(),
      decorName: initialDecorName
    });

    // Send securely to DreamArt server -> Telegram Bot API
    const response = await sendQuoteRequest({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      service: initialDecorName || 'Dekor Sifarişi',
      eventType: initialDecorName || 'Dekor Sifarişi',
      location: 'Bakı',
      message: formData.notes.trim(),
      notes: formData.notes.trim(),
      decorName: initialDecorName,
      honeypot: formData.honeypot
    });

    setLoading(false);

    if (response.success) {
      setSubmitted(true);
      setFormData({ name: '', phone: '', notes: '', honeypot: '' });
      if (onSuccess) onSuccess();
    } else {
      // Preserve customer entered data on error
      setErrorMessage(
        response.message || 'Sorğu göndərilərkən problem yarandı. Zəhmət olmasa yenidən cəhd edin.'
      );
    }
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
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/80 hover:text-[#25D366] transition-colors cursor-pointer"
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
                  <div className="w-14 h-14 mx-auto rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center text-[#C5A059] shadow-lg shadow-[#C5A059]/10">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-2xl text-white">Müraciətiniz qəbul edildi!</h3>
                  <p className="text-xs sm:text-sm text-white/80 max-w-sm mx-auto font-light leading-relaxed">
                    Sorğunuz uğurla göndərildi. Komandamız sizinlə qısa zamanda əlaqə saxlayacaq.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', notes: '', honeypot: '' });
                      setErrorMessage(null);
                    }}
                    className="text-xs text-[#C5A059] hover:text-white pt-2 cursor-pointer font-medium underline"
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

                  {errorMessage && (
                    <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-sm flex items-start gap-2.5 text-red-200 text-xs">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Spam Honeypot Field */}
                  <div className="hidden" aria-hidden="true">
                    <input
                      type="text"
                      name="company_website"
                      value={formData.honeypot}
                      onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                      Adınız *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (errorMessage) setErrorMessage(null);
                      }}
                      placeholder="Məsələn: Leyla Əliyeva"
                      className="w-full bg-[#181818] border border-white/10 focus:border-[#C5A059] rounded-sm px-4 py-3 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-white/70 mb-1.5 font-medium">
                      Telefon nömrəniz *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errorMessage) setErrorMessage(null);
                      }}
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
                    className="w-full bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-60 text-[#0B0B0B] font-medium py-3.5 rounded-sm text-xs sm:text-sm tracking-wide transition-all duration-300 shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:cursor-not-allowed"
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
