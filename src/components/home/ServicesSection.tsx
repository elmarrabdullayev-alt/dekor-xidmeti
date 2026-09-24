import React from 'react';
import { Lightbulb, PenTool, Truck, Wrench, PackageCheck, Sparkles } from 'lucide-react';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Konsept & Məsləhət',
    icon: Lightbulb,
    description: 'Xəyalınızdakı dekor tərzini, rəng harmoniyasını və büdcənizi müəyyənləşdiririk.'
  },
  {
    step: '02',
    title: 'Fərdi Dizayn & Eskiz',
    icon: PenTool,
    description: 'Seçilmiş məkana uyğun vizual kompozisiya və çiçək arxitekturasını layihələndiririk.'
  },
  {
    step: '03',
    title: 'Logistika & Nəqliyyat',
    icon: Truck,
    description: 'Konstruksiyaları və zərif gülləri xüsusi temperatur rejimi ilə ünvana çatdırırıq.'
  },
  {
    step: '04',
    title: 'Master Quraşdırma',
    icon: Wrench,
    description: 'Təcrübəli montaj və florist komandamızla tədbir öncəsi qüsursuz dekoru qururuq.'
  },
  {
    step: '05',
    title: 'Tədbir Sonrası Qayğı',
    icon: PackageCheck,
    description: 'Mərasim bitdikdən sonra məkanın səliqəli şəkildə boşaldılmasını təmin edirik.'
  }
];

export const ServicesSection: React.FC = () => {
  return (
    <section id="process-section" className="py-20 sm:py-28 bg-[#0E0E0C] border-b border-[#C5A059]/15 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#C5A059]/3 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20">
          <div className="flex items-center justify-center gap-3 mb-2.5">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-[#C5A059]" />
            <span className="font-script text-2xl sm:text-3xl text-[#E5C378] tracking-wide select-none">
              Yaradıcılıq Yolu
            </span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-[#C5A059]" />
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white font-normal leading-tight">
            Xidmət və Quraşdırma Mərhələlərimiz
          </h2>
          <p className="text-xs sm:text-sm text-white/70 font-light mt-3 leading-relaxed">
            İlkin ideyadan tədbir gününə qədər hər bir xırdalığı zövqlə, vaxtında və etibarlı şəkildə həyata keçiririk.
          </p>
        </div>

        {/* 5 Process Cards in an Atelier Timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-5 relative">
          {PROCESS_STEPS.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#12110E] border border-[#C5A059]/20 hover:border-[#C5A059]/70 p-6 sm:p-7 rounded-sm flex flex-col justify-between transition-all duration-500 group shadow-md hover:shadow-[0_8px_30px_rgba(197,160,89,0.18)] hover:-translate-y-1 relative"
              >
                <div>
                  {/* Step Header */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-11 h-11 rounded-sm bg-[#1A1814] border border-[#C5A059]/30 group-hover:border-[#C5A059] flex items-center justify-center text-[#C5A059] group-hover:scale-105 group-hover:bg-[#C5A059] group-hover:text-[#0A0A0A] transition-all duration-300 shadow-inner">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-serif text-xl sm:text-2xl text-[#E5C378] font-light">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg sm:text-xl text-[#FAF8F5] group-hover:text-[#F5E6CA] font-normal mb-2.5 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-white/70 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#C5A059]/15 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#C5A059]/70 group-hover:text-[#C5A059] transition-colors">
                    Mərhələ {idx + 1}
                  </span>
                  <span className="w-4 h-0.5 bg-[#C5A059]/40 group-hover:w-8 group-hover:bg-[#C5A059] transition-all duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

