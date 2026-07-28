import React, { useState, useRef } from 'react';
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
            <FeatureCard 
              key={feature.id} 
              feature={feature} 
              getFeatureIcon={getFeatureIcon} 
            />
          ))}
        </div>

      </div>
    </section>
  );
};

interface FeatureCardProps {
  feature: typeof WHY_CHOOSE_US_FEATURES[0];
  getFeatureIcon: (iconName: string) => React.ReactNode;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature, getFeatureIcon }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 space-y-4 group relative overflow-hidden select-none"
    >
      {/* Individual Card Mouse Spotlight Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.12), rgba(14, 165, 233, 0.03) 40%, transparent 80%)`
        }}
      />

      {/* Top Row: Icon & Badge */}
      <div className="flex items-center justify-between z-10 relative">
        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/80 transition-all">
          {getFeatureIcon(feature.icon)}
        </div>
        {feature.badge && (
          <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {feature.badge}
          </span>
        )}
      </div>

      {/* Title & Description */}
      <div className="space-y-2 pt-2 z-10 relative">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
          {feature.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          {feature.description}
        </p>
      </div>

      {/* Decorative Subtle Check */}
      <div className="pt-2 flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-sky-400 z-10 relative">
        <Check className="w-3.5 h-3.5 stroke-[3]" />
        <span>Guaranteed Standard of Excellence</span>
      </div>
    </div>
  );
};

