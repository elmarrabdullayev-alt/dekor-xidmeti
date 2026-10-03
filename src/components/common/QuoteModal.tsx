import React, { useState } from 'react';
import { X, Send, CheckCircle2, Phone, User, AlertCircle, MessageCircle } from 'lucide-react';
import { store } from '../../lib/store';
import { sendQuoteRequest } from '../../lib/quoteService';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  presetDecorName?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, presetDecorName }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    eventType: 'Toy dekoru',
    date: '',
    location: 'Bakı',
    notes: '',
    honeypot: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const settings = store.getSettings();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent duplicate submissions

    if (!formData.name.trim() || !formData.phone.trim()) {
      setErrorMessage('Zəhmət olmasa adınızı və telefon nömrənizi qeyd edin.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    // Record inquiry locally for admin panel
    store.addInquiry({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      eventType: formData.eventType,
      date: formData.date,
      location: formData.location.trim() || 'Bakı',
      notes: formData.notes.trim(),
      decorName: presetDecorName
    });

    // Send securely to DreamArt server -> Telegram Bot API
    const response = await sendQuoteRequest({
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      service: formData.eventType,
      eventType: formData.eventType,
      eventDate: formData.date,
      date: formData.date,
      location: formData.location.trim() || 'Bakı',
      message: formData.notes.trim(),
      notes: formData.notes.trim(),
      decorName: presetDecorName,
      honeypot: formData.honeypot
    });

    setLoading(false);

    if (response.success) {
      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        eventType: 'Toy dekoru',
        date: '',
        location: 'Bakı',
        notes: '',
        honeypot: ''
      });
    } else {
      // Do not lose entered customer information on failure
      setErrorMessage(
        response.message || 'Sorğu göndərilərkən problem yarandı. Zəhmət olmasa yenidən cəhd edin.'
      );
    }
  };

  const handleWhatsApp = () => {
    const text = `Salam, DreamArt Events! Qiymət təklifi almaq istəyirəm.\n\n` +
      `Ad: ${formData.name || 'Müştəri'}\n` +
      `Telefon: ${formData.phone || ''}\n` +
      `Tədbir: ${formData.eventType}\n` +
      `Məkan: ${formData.location}\n` +
      `Tarix: ${formData.date || 'Dəqiqləşdirilir'}\n` +
      (presetDecorName ? `Seçilmiş dekor: ${presetDecorName}\n` : '') +
      (formData.notes ? `Qeyd: ${formData.notes}` : '');

    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#121212] border border-[#C5A059]/40 rounded-sm shadow-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
          aria-label="Bağla"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#C5A059]/20 border border-[#C5A059] text-[#C5A059] flex items-center justify-center shadow-lg shadow-[#C5A059]/10">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl text-white">Müraciətiniz qəbul olundu</h3>
            <p className="text-xs sm:text-sm text-white/80 font-light max-w-sm mx-auto leading-relaxed">
              Sorğunuz uğurla göndərildi. Komandamız sizinlə qısa zamanda əlaqə saxlayacaq.
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="mt-4 bg-[#C5A059] text-[#0B0B0B] px-8 py-2.5 text-xs font-medium tracking-wide uppercase hover:bg-[#D4AF37] transition-all rounded-sm cursor-pointer shadow-md"
            >
              Bağla
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-1 font-medium">
                DREAMART EVENTS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-normal">
                Qiymət Təklifi Al
              </h3>
              {presetDecorName && (
                <p className="text-xs text-[#E5C378] font-medium mt-1 tracking-wider uppercase">
                  Seçilmiş dekor: {presetDecorName}
                </p>
              )}
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-red-950/40 border border-red-500/40 rounded-sm flex items-start gap-2.5 text-red-200 text-xs">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Spam Honeypot Field */}
              <div className="hidden" aria-hidden="true">
                <input
                  type="text"
                  name="website_url"
                  value={formData.honeypot}
                  onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Adınız və Soyadınız *
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#C5A059] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value });
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="Məs: Aysel Qasımova"
                    className="w-full bg-[#181818] border border-white/10 rounded-sm pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#C5A059] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Əlaqə Nömrəsi *
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#C5A059] absolute left-3 top-3.5" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (errorMessage) setErrorMessage(null);
                    }}
                    placeholder="+994 50 123 45 67"
                    className="w-full bg-[#181818] border border-white/10 rounded-sm pl-9 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#C5A059] transition-colors font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                    Tədbir Növü
                  </label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-sm px-2.5 py-2.5 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#C5A059] transition-colors"
                  >
                    <option value="Toy dekoru" className="bg-[#181818] text-white">Toy dekoru</option>
                    <option value="Nişan dekoru" className="bg-[#181818] text-white">Nişan dekoru</option>
                    <option value="Xına dekoru" className="bg-[#181818] text-white">Xına gecəsi</option>
                    <option value="Ad günü dekoru" className="bg-[#181818] text-white">Ad günü</option>
                    <option value="Korporativ tədbir" className="bg-[#181818] text-white">Korporativ</option>
                    <option value="Zal dekoru" className="bg-[#181818] text-white">Zal tərtibatı</option>
                    <option value="Xonça xidməti" className="bg-[#181818] text-white">Xonça xidməti</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                    Tarix
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#181818] border border-white/10 rounded-sm px-2.5 py-2 text-xs sm:text-sm text-white focus:outline-hidden focus:border-[#C5A059] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Məkan / Şəhər
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Bakı, Qəbələ, Sumqayıt və ya restoran adı"
                  className="w-full bg-[#181818] border border-white/10 rounded-sm px-3 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#C5A059] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-white/70 mb-1 font-medium">
                  Əlavə qeydlər
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="İstədiyiniz rənglər, çiçəklər və ya xüsusi tələblər..."
                  className="w-full bg-[#181818] border border-white/10 rounded-sm p-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:outline-hidden focus:border-[#C5A059] resize-none transition-colors"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#C5A059] hover:bg-[#D4AF37] disabled:opacity-60 text-[#0B0B0B] py-3 text-xs font-medium tracking-wide uppercase flex items-center justify-center space-x-2 transition-all rounded-sm cursor-pointer shadow-md disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Göndərilir...' : 'Təklif Göndər'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="flex-1 border border-white/20 hover:border-[#25D366] text-white py-3 text-xs font-medium tracking-wide uppercase flex items-center justify-center space-x-2 transition-all rounded-sm cursor-pointer hover:bg-[#25D366]/10"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                  <span>WhatsApp</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
