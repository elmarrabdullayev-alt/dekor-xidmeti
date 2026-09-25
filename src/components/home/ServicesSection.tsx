import React from 'react';
import { Lightbulb, PenTool, Truck, Wrench, PackageCheck } from 'lucide-react';

const PROCESS_STEPS = [
  {
    step: '01',
    title: 'Konsept',
    icon: Lightbulb,
    description: 'Sizin arzuladığınız detayı, ideyanı formalaşdırırıq.'
  },
  {
    step: '02',
    title: 'Fərdi dizayn',
    icon: PenTool,
    description: 'Məkanınıza uyğun unikal həllər hazırlayırıq.'
  },
  {
    step: '03',
    title: 'Çatdırılma',
    icon: Truck,
    description: 'Bütün lazımi elementləri təhlükəsiz şəkildə çatdırırıq.'
  },
  {
    step: '04',
    title: 'Quraşdırma',
    icon: Wrench,
    description: 'Peşəkar komanda ilə quraşdırmanı həyata keçiririk.'
  },
  {
    step: '05',
    title: 'Sökülmə',
    icon: PackageCheck,
    description: 'Tədbir sonrası sökülmə işlərini də biz edirik.'
  }
];

export const ServicesSection: React.FC = () => {
  return (
    <section id="process-section" className="py-14 sm:py-20 bg-[#0B0B0B] border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching mockup */}
        <div className="mb-10 sm:mb-12">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#C5A059] font-medium font-sans block mb-1">
            MƏRHƏLƏLƏR
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-white font-normal">
            Xidmət prosesimiz
          </h2>
        </div>

        {/* 5 Process Cards in a responsive 5-column grid matching mockup */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {PROCESS_STEPS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="bg-[#121212] border border-white/10 hover:border-[#C5A059]/60 p-5 sm:p-6 rounded-sm flex flex-col justify-between transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-sm bg-[#181818] border border-white/10 group-hover:border-[#C5A059] flex items-center justify-center text-[#C5A059] transition-colors">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-xs text-white/40 group-hover:text-[#C5A059] transition-colors">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg text-white font-normal mb-2 group-hover:text-[#E5C378] transition-colors">
                    {item.step} {item.title}
                  </h3>

                  <p className="text-xs text-white/70 font-light leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-white/5">
                  <span className="h-0.5 w-6 bg-[#C5A059]/40 group-hover:w-12 group-hover:bg-[#C5A059] transition-all duration-300 block" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
