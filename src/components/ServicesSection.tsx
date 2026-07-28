import React, { useState, useRef } from 'react';
import { CLINIC_SERVICES } from '../data/dentalData';
import { Service } from '../types';
import { 
  Sparkles, 
  Smile, 
  ShieldCheck, 
  Gem, 
  Activity, 
  CheckCircle2, 
  Zap, 
  ArrowRight, 
  Clock, 
  DollarSign, 
  X, 
  SlidersHorizontal,
  ChevronRight,
  Info
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceToBook: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  onSelectServiceToBook,
}) => {
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [sliderPos, setSliderPos] = useState<number>(50);

  const categories = ['All', 'Cosmetic Dentistry', 'Orthodontics', 'Restorative Dentistry', 'General Dentistry', 'Endodontics', 'Emergency Care'];

  const filteredServices = activeCategory === 'All' 
    ? CLINIC_SERVICES 
    : CLINIC_SERVICES.filter(s => s.category === activeCategory);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-blue-600 dark:text-sky-400" />;
      case 'Smile': return <Smile className="w-6 h-6 text-sky-600 dark:text-sky-300" />;
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />;
      case 'Gem': return <Gem className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      case 'Activity': return <Activity className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-amber-500 fill-amber-400" />;
      default: return <Sparkles className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="services" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-sky-300">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Clinical Excellence & Aesthetic Dentistry
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Comprehensive <span className="text-blue-600 dark:text-sky-400">Dental Services</span>
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          From laser teeth whitening to 3D precision dental implants, our specialists deliver brilliant, pain-free smiles with state-of-the-art technology.
        </p>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <ServiceCard 
            key={service.id} 
            service={service} 
            getServiceIcon={getServiceIcon}
            onOpenDetails={() => setSelectedService(service)}
            onBook={() => onSelectServiceToBook(service.id)}
          />
        ))}
      </div>

      {/* Service Detail Modal with Before/After Slider */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  {getServiceIcon(selectedService.icon)}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 dark:text-sky-400 block">
                    {selectedService.category}
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {selectedService.name}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedService(null)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Description & Specs */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
              {selectedService.description}
            </p>

            <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Estimated Price</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{selectedService.price}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-bold uppercase text-[10px]">Procedure Duration</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{selectedService.duration}</span>
              </div>
            </div>

            {/* Before / After Slider Comparison (If Available) */}
            {selectedService.beforeAfterImage && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                    Treatment Results (Before & After Comparison)
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500">Drag slider to compare</span>
                </div>

                <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 select-none">
                  {/* After Image (Background) */}
                  <img
                    src={selectedService.beforeAfterImage.after}
                    alt="After Treatment"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-md">
                    AFTER
                  </span>

                  {/* Before Image (Clipped Foreground) */}
                  <div
                    className="absolute top-0 left-0 bottom-0 overflow-hidden"
                    style={{ width: `${sliderPos}%` }}
                  >
                    <img
                      src={selectedService.beforeAfterImage.before}
                      alt="Before Treatment"
                      className="absolute top-0 left-0 h-full max-w-none object-cover"
                      style={{ width: '100%', minWidth: '600px' }}
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 text-white text-[10px] font-bold shadow-md">
                      BEFORE
                    </span>
                  </div>

                  {/* Divider Line & Handle */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-xl cursor-ew-resize flex items-center justify-center"
                    style={{ left: `${sliderPos}%` }}
                  >
                    <div className="w-7 h-7 rounded-full bg-white text-blue-600 shadow-xl flex items-center justify-center text-[10px] font-bold border border-slate-200">
                      ↔
                    </div>
                  </div>

                  {/* Invisible Range Input for Dragging */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPos}
                    onChange={(e) => setSliderPos(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize"
                  />
                </div>
              </div>
            )}

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                onClick={() => setSelectedService(null)}
                className="px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const sId = selectedService.id;
                  setSelectedService(null);
                  onSelectServiceToBook(sId);
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                <span>Book This Treatment</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};

// Interactive Mouse-Responsive Service Card
interface ServiceCardProps {
  service: Service;
  getServiceIcon: (iconName: string) => React.ReactNode;
  onOpenDetails: () => void;
  onBook: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  getServiceIcon,
  onOpenDetails,
  onBook
}) => {
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
      className="group rounded-3xl bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 p-7 shadow-lg shadow-slate-900/5 hover:shadow-2xl hover:shadow-blue-600/10 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 flex flex-col justify-between relative overflow-hidden select-none"
    >
      {/* Individual Card Mouse Spotlight Overlay */}
      <div 
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.12), rgba(14, 165, 233, 0.03) 40%, transparent 80%)`
        }}
      />

      {/* Popular Badge */}
      {service.popular && (
        <span className="absolute top-6 right-6 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-sky-300 border border-blue-200 dark:border-blue-800 z-10">
          Most Requested
        </span>
      )}

      <div className="space-y-4 z-10">
        {/* Icon & Category */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-all">
            {getServiceIcon(service.icon)}
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 block">
              {service.category}
            </span>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>{service.duration}</span>
            </div>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 pt-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
            {service.name}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3 font-normal">
            {service.description}
          </p>
        </div>
      </div>

      {/* Bottom Price & Action */}
      <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between z-10">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">Pricing</span>
          <span className="text-lg font-black text-slate-900 dark:text-white">{service.price}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDetails}
            className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all active:scale-95"
          >
            Learn More
          </button>
          <button
            onClick={onBook}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1 active:scale-95"
          >
            <span>Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

