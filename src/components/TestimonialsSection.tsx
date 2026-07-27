import React, { useState, useEffect } from 'react';
import { CLINIC_TESTIMONIALS } from '../data/dentalData';
import { Star, Quote, ChevronLeft, ChevronRight, Heart, Sparkles } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % CLINIC_TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CLINIC_TESTIMONIALS.length) % CLINIC_TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CLINIC_TESTIMONIALS.length);
  };

  return (
    <section id="testimonials" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-sky-300">
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          Real Patient Experiences
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Stories of <span className="text-blue-600 dark:text-sky-400">Transformed Smiles</span>
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Over 10,000+ patients trust SmileSync for their dental health. Here is what they have to say about our clinicians and patient care.
        </p>
      </div>

      {/* Featured Testimonial Spotlight */}
      <div className="relative max-w-4xl mx-auto">
        <div className="p-8 sm:p-12 rounded-[36px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl shadow-blue-900/5 relative overflow-hidden space-y-8">
          
          <Quote className="absolute top-6 right-8 w-20 h-20 text-blue-500/10 pointer-events-none" />

          {/* Rating Stars & Service Tag */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-1">
              {[...Array(CLINIC_TESTIMONIALS[currentIndex].rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-sky-300">
              {CLINIC_TESTIMONIALS[currentIndex].serviceReceived}
            </span>
          </div>

          {/* Review Text */}
          <p className="text-lg sm:text-2xl font-medium text-slate-800 dark:text-slate-100 leading-relaxed italic">
            "{CLINIC_TESTIMONIALS[currentIndex].review}"
          </p>

          {/* Patient Author info */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <img
                src={CLINIC_TESTIMONIALS[currentIndex].photo}
                alt={CLINIC_TESTIMONIALS[currentIndex].name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-blue-500/30"
              />
              <div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {CLINIC_TESTIMONIALS[currentIndex].name}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {CLINIC_TESTIMONIALS[currentIndex].role} • {CLINIC_TESTIMONIALS[currentIndex].date}
                </p>
              </div>
            </div>

            {/* Slider Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center gap-2 pt-6">
          {CLINIC_TESTIMONIALS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2.5 rounded-full transition-all ${
                currentIndex === idx ? 'w-8 bg-blue-600' : 'w-2.5 bg-slate-300 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>

    </section>
  );
};
