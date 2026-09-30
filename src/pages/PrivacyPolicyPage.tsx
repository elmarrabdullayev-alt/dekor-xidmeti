import React from 'react';
import { SeoHead } from '../components/layout/SeoHead';
import { Shield, Lock, FileText, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyPageProps {
  navigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ navigate }) => {
  return (
    <>
      <SeoHead
        title="Məxfilik Siyasəti | DreamArt Weddings"
        description="DreamArt Events fərdi məlumatların qorunması və məxfilik siyasəti. Müştərilərimizin məxfiliyi bizim üçün prioritetdir."
        canonicalPath="/mexfilik-siyaseti"
      />

      <div className="bg-[#0B0B0B] text-white py-16 sm:py-24 min-h-screen border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-[10px] uppercase tracking-[0.35em] text-[#C5A059] block mb-2 font-medium">
              HÜQUQİ BİLDİRİŞ
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal mb-4">
              Məxfilik Siyasəti
            </h1>
            <div className="w-12 h-px bg-[#C5A059] mx-auto mb-6" />
            <p className="text-xs sm:text-sm text-white/60 max-w-xl mx-auto font-light">
              DreamArt Events müştərilərinin və ziyarətçilərinin fərdi məlumatlarının məxfiliyinə və qorunmasına tam təminat verir.
            </p>
          </div>

          {/* Policy Content */}
          <div className="space-y-10 text-xs sm:text-sm text-white/80 font-light leading-relaxed">
            {/* Section 1 */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#121212] border border-white/10 space-y-3">
              <div className="flex items-center gap-2.5 text-[#E5C378] font-serif text-lg sm:text-xl font-normal">
                <Shield className="w-5 h-5 text-[#C5A059] shrink-0" />
                <h2>1. Ümumi Müddəalar</h2>
              </div>
              <p>
                DreamArt Events (bundan sonra «Şirkət») olaraq veb-saytımızdan istifadə edən hər bir şəxsin fərdi məlumatlarının toxunulmazlığına böyük önəm veririk. Bu Məxfilik Siyasəti platformamızdan istifadə zamanı əldə edilən məlumatların toplanması, saxlanması və qorunması qaydalarını müəyyən edir.
              </p>
            </div>

            {/* Section 2 */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#121212] border border-white/10 space-y-3">
              <div className="flex items-center gap-2.5 text-[#E5C378] font-serif text-lg sm:text-xl font-normal">
                <FileText className="w-5 h-5 text-[#C5A059] shrink-0" />
                <h2>2. Toplanılan Məlumatlar</h2>
              </div>
              <p>
                Bizimlə əlaqə yaratdıqda, qiymət təklifi və ya konsultasiya üçün müraciət etdikdə aşağıdakı məlumatlar tələb oluna bilər:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-white/70">
                <li>Ad və soyad</li>
                <li>Əlaqə nömrəsi və WhatsApp məlumatları</li>
                <li>Tədbirin növü (toy, nişan, xına, ad günü, korporativ və s.), tarixi və keçirilmə məkanı</li>
                <li>Fərdi dekorasiya istəkləri və smeta detalları</li>
              </ul>
            </div>

            {/* Section 3 */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#121212] border border-white/10 space-y-3">
              <div className="flex items-center gap-2.5 text-[#E5C378] font-serif text-lg sm:text-xl font-normal">
                <CheckCircle2 className="w-5 h-5 text-[#C5A059] shrink-0" />
                <h2>3. Məlumatların İstifadə Məqsədləri</h2>
              </div>
              <p>
                Toplanan fərdi məlumatlar müstəsna olaraq aşağıdakı məqsədlər üçün istifadə edilir:
              </p>
              <ul className="list-disc list-inside space-y-1.5 pl-2 text-white/70">
                <li>Müraciətiniz üzrə operativ əlaqə saxlamaq və fərdi təklif təqdim etmək</li>
                <li>Dekorasiya və təşkilatçılıq xidmətlərini yüksək səviyyədə təmin etmək</li>
                <li>Müqavilə və razılaşmalar üzrə öhdəlikləri icra etmək</li>
                <li>Xidmət keyfiyyətini və müştəri məmnuniyyətini daimi inkişaf etdirmək</li>
              </ul>
            </div>

            {/* Section 4 */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#121212] border border-white/10 space-y-3">
              <div className="flex items-center gap-2.5 text-[#E5C378] font-serif text-lg sm:text-xl font-normal">
                <Lock className="w-5 h-5 text-[#C5A059] shrink-0" />
                <h2>4. Məlumatların Təhlükəsizliyi və Üçüncü Tərəflər</h2>
              </div>
              <p>
                Müştərilərimizin fərdi məlumatları heç bir halda kommersiya məqsədilə üçüncü tərəflərə satılmır, icarəyə verilmir və paylaşılmır. Bütün məlumatlar müasir rəqəmsal təhlükəsizlik standartlarına uyğun qorunur və yalnız tədbirinizin təşkili ilə birbaşa məşğul olan məsul heyət üçün əlçatandır.
              </p>
            </div>

            {/* Section 5 */}
            <div className="p-6 sm:p-8 rounded-sm bg-[#121212] border border-white/10 space-y-3">
              <h2 className="text-[#E5C378] font-serif text-lg sm:text-xl font-normal">
                5. Əlaqə və Dəyişikliklər
              </h2>
              <p>
                Məxfilik siyasəti zərurət yarandıqda qanunvericiliyin və xidmət tələblərinin dəyişməsinə uyğun olaraq yenilənə bilər. Məxfilik siyasəti ilə bağlı hər hansı sualınız olduqda bizimlə əlaqə saxlamağınız xahiş olunur:
              </p>
              <div className="pt-2 text-white/70 space-y-1">
                <p>📍 Ünvan: Bakı şəhəri, Yasamal rayonu, Şərifzadə küçəsi 241E</p>
                <p>📞 Əlaqə telefonu: +994 50 231 17 28</p>
                <p>🕒 İş saatları: Hər gün 09:00 – 21:00</p>
              </div>
            </div>

            {/* Back button */}
            <div className="text-center pt-4">
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-sm border border-[#C5A059]/40 hover:border-[#C5A059] text-[#E5C378] hover:text-white transition-colors text-xs uppercase tracking-wider font-medium cursor-pointer"
              >
                ← Ana Səhifəyə Qayıt
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
