import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Map, 
  ExternalLink, 
  Navigation, 
  CheckCircle2, 
  ShieldCheck, 
  MessageSquare,
  Instagram,
  Facebook,
  Linkedin,
  Twitter
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-sky-300">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          Visit Our San Francisco Dental Clinic
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Get in Touch <span className="text-blue-600 dark:text-sky-400">With Us</span>
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          We are conveniently located in downtown San Francisco with dedicated patient parking and direct transit access.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Contact Cards */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Address Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-sky-400 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                Clinic Location
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                100 Smile Blvd, Suite 400<br />
                Financial District, San Francisco, CA 94105
              </p>
              <a 
                href="https://maps.google.com" 
                target="_blank" 
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-sky-400 pt-1 hover:underline"
              >
                <span>Get Driving Directions</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Phone Support</span>
                <a href="tel:15553214321" className="text-xs font-black text-slate-900 dark:text-white hover:text-blue-600">
                  +1 (555) 321-4321
                </a>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-md space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Email Inquiries</span>
                <a href="mailto:care@smilesyncdental.com" className="text-xs font-black text-slate-900 dark:text-white hover:text-blue-600 truncate block">
                  care@smilesyncdental.com
                </a>
              </div>
            </div>
          </div>

          {/* Hours Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-lg space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Clinic Business Hours
              </h4>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 font-medium pt-1">
              <div className="flex justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <span>Monday – Thursday:</span>
                <span className="font-bold text-slate-900 dark:text-white">8:00 AM – 6:00 PM</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <span>Friday:</span>
                <span className="font-bold text-slate-900 dark:text-white">8:00 AM – 5:00 PM</span>
              </div>
              <div className="flex justify-between pb-1 border-b border-slate-100 dark:border-slate-800">
                <span>Saturday:</span>
                <span className="font-bold text-slate-900 dark:text-white">9:00 AM – 2:00 PM</span>
              </div>
              <div className="flex justify-between text-red-500 font-bold">
                <span>Sunday:</span>
                <span>Emergency Appointments Only</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Connect With Us:</span>
            <div className="flex items-center gap-2">
              <a href="#" className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 hover:text-blue-600 shadow-xs">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 hover:text-blue-600 shadow-xs">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 hover:text-blue-600 shadow-xs">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white dark:bg-slate-800 text-slate-600 hover:text-blue-600 shadow-xs">
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>

        {/* Right Column: Google Maps Interactive Placeholder */}
        <div className="lg:col-span-7 h-full">
          <div className="rounded-[32px] overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl relative bg-slate-100 dark:bg-slate-900 min-h-[460px] flex flex-col justify-between">
            
            {/* Embedded Google Map iframe */}
            <iframe
              title="SmileSync Clinic Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.019572422036!2d-122.40137!3d37.7892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085808580858085%3A0x8085808580858085!2sFinancial%20District%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1650000000000!5m2!1sen!2sus"
              className="w-full h-[480px] border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>

            {/* Map Overlay Badge */}
            <div className="absolute bottom-6 left-6 right-6 glass-panel p-4 rounded-2xl border border-white/80 dark:border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="text-xs font-black text-slate-900 dark:text-white">SmileSync Dental Clinic</h5>
                  <p className="text-[10px] text-slate-500 font-medium">Free 2-Hour Valet Parking Available</p>
                </div>
              </div>

              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all shrink-0"
              >
                Open Map
              </a>
            </div>

          </div>
        </div>

      </div>

    </section>
  );
};
