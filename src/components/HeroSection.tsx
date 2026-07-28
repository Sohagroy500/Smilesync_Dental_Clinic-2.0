import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  ArrowRight, 
  Star, 
  Users, 
  Award, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Heart, 
  Zap,
  Clock,
  Play
} from 'lucide-react';

interface HeroSectionProps {
  onOpenBooking: () => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onExploreServices,
}) => {
  // Mouse interaction state with RAF + Lerp for zero lag/jitter
  const sectionRef = useRef<HTMLElement>(null);
  const targetMouse = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: 300 });
  const currentMouse = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0, y: 300 });
  
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, translateX: 0, translateY: 0 });

  useEffect(() => {
    let animId: number;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const relativeY = e.clientY - rect.top;

      targetMouse.current = { x: relativeX, y: relativeY };

      // Calculate relative offsets from section center (-1 to 1)
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const normalizedX = (relativeX - centerX) / (centerX || 1);
      const normalizedY = (relativeY - centerY) / (centerY || 1);

      // Smooth subtle tilt/parallax factors
      setTilt({
        rotateX: -normalizedY * 5,
        rotateY: normalizedX * 5,
        translateX: normalizedX * 12,
        translateY: normalizedY * 12,
      });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setTilt({ rotateX: 0, rotateY: 0, translateX: 0, translateY: 0 });
    };

    const updateLoop = () => {
      // Smooth lerp (8% interpolation per frame)
      const ease = 0.08;
      currentMouse.current.x += (targetMouse.current.x - currentMouse.current.x) * ease;
      currentMouse.current.y += (targetMouse.current.y - currentMouse.current.y) * ease;

      setSpotlightPos({ x: currentMouse.current.x, y: currentMouse.current.y });

      animId = requestAnimationFrame(updateLoop);
    };

    const el = sectionRef.current;
    if (el) {
      el.addEventListener('mousemove', handleMouseMove, { passive: true });
      el.addEventListener('mouseenter', handleMouseEnter);
      el.addEventListener('mouseleave', handleMouseLeave);
    }

    animId = requestAnimationFrame(updateLoop);

    return () => {
      if (el) {
        el.removeEventListener('mousemove', handleMouseMove);
        el.removeEventListener('mouseenter', handleMouseEnter);
        el.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="home" 
      className="relative pt-32 lg:pt-36 pb-16 lg:pb-24 overflow-hidden select-none"
    >
      
      {/* Interactive Mouse Spotlight Radial Glow */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-700 ease-out"
        style={{
          opacity: isHovered ? 1 : 0.4,
          background: `radial-gradient(750px circle at ${spotlightPos.x}px ${spotlightPos.y}px, rgba(59, 130, 246, 0.14), rgba(14, 165, 233, 0.05) 40%, transparent 80%)`
        }}
      />

      {/* Background Soft Animated Gradient Circles with Parallax Shift */}
      <div 
        className="absolute top-20 left-1/4 w-[480px] h-[480px] bg-blue-400/20 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none -z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${-tilt.translateX * 1.5}px, ${-tilt.translateY * 1.5}px, 0)`
        }}
      />
      <div 
        className="absolute top-40 right-1/4 w-[420px] h-[420px] bg-sky-300/25 dark:bg-sky-500/15 rounded-full blur-3xl pointer-events-none -z-10 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${tilt.translateX * 2}px, ${tilt.translateY * 2}px, 0)`
        }}
      />
      <div className="absolute bottom-10 left-1/3 w-[360px] h-[360px] bg-teal-300/20 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            {/* Top Badge responding smoothly to cursor */}
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 shadow-xs transition-transform duration-150 ease-out"
              style={{
                transform: `translate3d(${tilt.translateX * 0.4}px, ${tilt.translateY * 0.4}px, 0)`
              }}
            >
              <span className="flex h-2 w-2 rounded-full bg-blue-600 dark:text-sky-400 animate-ping"></span>
              <span className="text-xs font-bold text-blue-700 dark:text-sky-300 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                San Francisco's Premier Oral Health Clinic
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
              Your Smile Deserves <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-600 via-sky-500 to-teal-500 bg-clip-text text-transparent">
                Exceptional Care
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              Modern dentistry with compassionate care, experienced specialists, and advanced technology for healthier, brighter smiles.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white text-sm font-bold shadow-xl shadow-blue-600/25 hover:shadow-blue-600/35 transition-all flex items-center gap-2.5 active:scale-95 group"
              >
                <Calendar className="w-4 h-4 text-sky-200" />
                <span>Book Appointment</span>
                <ArrowRight className="w-4 h-4 text-sky-200 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onExploreServices}
                className="px-7 py-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 hover:bg-white dark:hover:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-bold border border-slate-200 dark:border-slate-700 shadow-sm transition-all flex items-center gap-2 backdrop-blur-md active:scale-95"
              >
                <span>Explore Services</span>
              </button>
            </div>

            {/* Quick Guarantees Bar */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Zero-Pain Technology</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">0% APR Financing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">Same-Day Slots</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Showcase & Floating Glassmorphism Cards with 3D Tilt */}
          <div className="lg:col-span-6 relative flex justify-center [perspective:1000px]">
            
            {/* Main Visual Image Container with subtle mouse tilt response */}
            <div 
              className="relative w-full max-w-lg transition-transform duration-150 ease-out"
              style={{
                transform: `translate3d(${tilt.translateX * 0.8}px, ${tilt.translateY * 0.8}px, 0) rotateX(${tilt.rotateX * 0.6}deg) rotateY(${tilt.rotateY * 0.6}deg)`
              }}
            >
              
              {/* Outer Decorative Ring */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-sky-400/20 to-teal-400/20 rounded-[44px] blur-xl pointer-events-none"></div>

              {/* Patient Photo Container */}
              <div className="relative rounded-[36px] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl shadow-blue-900/15 group">
                <img
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1000&q=80"
                  alt="Happy Patient at SmileSync Dental"
                  className="w-full h-[460px] sm:h-[500px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                {/* Image Caption overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                  <div className="flex items-center gap-1.5 text-sky-300 text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>State-of-the-Art Dental Suite</span>
                  </div>
                  <p className="text-sm font-medium text-slate-100">
                    Compassionate dental experts dedicated to your perfect smile.
                  </p>
                </div>
              </div>

              {/* Floating Card 1: ⭐ 4.9 Rating (Top Right) */}
              <div 
                className="absolute -top-6 -right-4 sm:right-2 glass-panel p-3.5 sm:p-4 rounded-2xl shadow-xl border border-white/80 dark:border-slate-700/80 flex items-center gap-3 transition-transform duration-200 ease-out hover:scale-105"
                style={{
                  transform: `translate3d(${tilt.translateX * 1.4}px, ${tilt.translateY * 1.4}px, 0)`
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-base font-black text-slate-900 dark:text-white">4.9 / 5.0</span>
                  </div>
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">1,200+ Google Reviews</p>
                </div>
              </div>

              {/* Floating Card 2: 10,000+ Happy Patients (Bottom Left) */}
              <div 
                className="absolute -bottom-6 -left-4 sm:left-2 glass-panel p-3.5 sm:p-4 rounded-2xl shadow-xl border border-white/80 dark:border-slate-700/80 flex items-center gap-3 transition-transform duration-200 ease-out hover:scale-105"
                style={{
                  transform: `translate3d(${-tilt.translateX * 1.2}px, ${-tilt.translateY * 1.2}px, 0)`
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-base font-black text-slate-900 dark:text-white block">10,000+</span>
                  <p className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">Happy Smiles Restored</p>
                </div>
              </div>

              {/* Floating Card 3: 20+ Years Experience (Top Left) */}
              <div 
                className="absolute top-1/3 -left-6 sm:-left-8 glass-panel p-3 sm:p-3.5 rounded-2xl shadow-xl border border-white/80 dark:border-slate-700/80 hidden sm:flex items-center gap-2.5 transition-transform duration-200 ease-out hover:scale-105"
                style={{
                  transform: `translate3d(${-tilt.translateX * 1.5}px, ${tilt.translateY * 0.8}px, 0)`
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div className="pr-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">20+ Years</span>
                  <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400">Clinical Mastery</p>
                </div>
              </div>

              {/* Floating Card 4: 24/7 Emergency Care (Bottom Right) */}
              <div 
                className="absolute bottom-16 -right-6 sm:-right-8 glass-panel p-3 sm:p-3.5 rounded-2xl shadow-xl border border-white/80 dark:border-slate-700/80 hidden sm:flex items-center gap-2.5 transition-transform duration-200 ease-out hover:scale-105"
                style={{
                  transform: `translate3d(${tilt.translateX * 1.3}px, ${-tilt.translateY * 1.1}px, 0)`
                }}
              >
                <div className="w-8 h-8 rounded-lg bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="pr-1">
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">24/7 Priority</span>
                  <p className="text-[9px] font-medium text-slate-500 dark:text-slate-400">Emergency Slots</p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

