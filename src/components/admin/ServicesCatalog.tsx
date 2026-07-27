import React from 'react';
import { Sparkles, Clock, DollarSign, CheckCircle2 } from 'lucide-react';
import { CLINIC_SERVICES } from '../../data/dentalData';

export const ServicesCatalog: React.FC = () => {
  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <span>Clinic Dental Services</span>
          </h1>
          <p className="text-xs text-slate-500">Service catalog, procedure durations, and current pricing structure</p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CLINIC_SERVICES.map((srv) => (
          <div
            key={srv.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2.5 py-0.5 rounded-full">
                    {srv.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mt-1.5">{srv.name}</h3>
                </div>

                {srv.popular && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-[10px] font-bold">
                    Popular
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                {srv.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                <DollarSign className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{srv.price}</span>
              </div>

              <div className="flex items-center space-x-1 text-slate-400 font-medium">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>{srv.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
