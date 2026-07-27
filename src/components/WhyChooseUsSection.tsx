import React from 'react';
import { WHY_CHOOSE_US_FEATURES } from '../data/dentalData';
import { 
  Cpu, 
  UserCheck, 
  HeartPulse, 
  BadgeDollarSign, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Check 
} from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const getFeatureIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-6 h-6 text-blue-600 dark:text-sky-400" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-sky-600 dark:text-sky-300" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-500" />;
      case 'BadgeDollarSign': return <BadgeDollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Calendar': return <Calendar className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-500" />;
      default: return <ShieldCheck className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="why-us" className="py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-sky-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
            Patient-Centric Dental Care
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Why Choose <span className="text-blue-600 dark:text-sky-400">SmileSync</span>?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            We blend human warmth with cutting-edge medical technology to provide a gentle, high-precision dental experience like no other.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US_FEATURES.map((feature) => (
            <div
              key={feature.id}
              className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-blue-200 dark:hover:border-blue-800 transition-all space-y-4 group relative overflow-hidden"
            >
              {/* Top Row: Icon & Badge */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {getFeatureIcon(feature.icon)}
                </div>
                {feature.badge && (
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {feature.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                  {feature.description}
                </p>
              </div>

              {/* Decorative Subtle Check */}
              <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-sky-400">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>Guaranteed Standard of Excellence</span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
