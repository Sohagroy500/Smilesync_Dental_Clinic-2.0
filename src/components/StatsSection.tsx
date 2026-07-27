import React from 'react';
import { CLINIC_STATS } from '../data/dentalData';
import { Users, Award, Stethoscope, CheckCircle2, Star } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="w-6 h-6 text-blue-600 dark:text-sky-400" />;
      case 'Award': return <Award className="w-6 h-6 text-sky-600 dark:text-sky-300" />;
      case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Star': return <Star className="w-6 h-6 text-amber-500 fill-amber-400" />;
      default: return <Users className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="p-8 sm:p-10 rounded-[32px] bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-blue-900/5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100 dark:divide-slate-800">
          {CLINIC_STATS.map((stat, idx) => (
            <div 
              key={stat.id} 
              className={`flex flex-col items-center text-center p-3 space-y-2 group hover:scale-105 transition-transform ${
                idx !== 0 ? 'pt-6 md:pt-3' : ''
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-colors">
                {getIcon(stat.icon)}
              </div>
              <div className="pt-1">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  {stat.value.toLocaleString()}{stat.suffix}
                </span>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 pt-1">
                  {stat.label}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                  {stat.sublabel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
