import React, { useState } from 'react';
import { 
  Calendar, 
  Search, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Heart, 
  FileText, 
  PhoneCall, 
  ChevronRight, 
  Download, 
  UserCheck,
  AlertCircle,
  Zap,
  Smile
} from 'lucide-react';
import { Appointment } from '../types';

interface PatientServicesSectionProps {
  appointments: Appointment[];
  onOpenBooking: (serviceId?: string) => void;
  onNavigateToAssistant: () => void;
}

export const PatientServicesSection: React.FC<PatientServicesSectionProps> = ({
  appointments,
  onOpenBooking,
  onNavigateToAssistant,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedAppointments, setSearchedAppointments] = useState<Appointment[] | null>(null);
  const [activeInstructionTab, setActiveInstructionTab] = useState<'whitening' | 'implant' | 'invisalign'>('whitening');

  const handleSearchAppointments = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setSearchedAppointments(null);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = appointments.filter(
      a => a.email.toLowerCase().includes(q) || a.patient_name.toLowerCase().includes(q) || a.phone.includes(q)
    );
    setSearchedAppointments(matches);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Top Banner: Patient Services Hub */}
      <div className="p-8 sm:p-10 rounded-[36px] bg-gradient-to-r from-cyan-600 via-teal-600 to-slate-900 text-white shadow-2xl shadow-cyan-900/10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        
        <div className="space-y-3 max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold uppercase tracking-widest text-cyan-200 border border-white/20">
            <Heart className="w-3.5 h-3.5 text-cyan-300 fill-cyan-300" />
            Patient Care & Self-Service Portal
          </div>
          <h2 className="text-3xl sm:text-4xl font-light leading-tight tracking-tight">
            Dedicated Services for <span className="font-bold text-cyan-200">Our Patients</span>
          </h2>
          <p className="text-sm sm:text-base text-cyan-100/90 leading-relaxed font-normal">
            Access instant appointment lookup, 24/7 ambient AI reception, emergency care triage, and personalized post-treatment guidelines.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10">
          <button
            onClick={() => onOpenBooking()}
            className="px-6 py-3.5 bg-white text-slate-900 hover:bg-cyan-50 font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 active:scale-95 text-xs uppercase tracking-wider"
          >
            <Calendar className="w-4 h-4 text-cyan-600" />
            <span>Book New Appointment</span>
          </button>
          
          <button
            onClick={onNavigateToAssistant}
            className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md font-bold rounded-2xl transition-all flex items-center gap-2 active:scale-95 text-xs uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4 text-cyan-300" />
            <span>Ask AI Receptionist</span>
          </button>
        </div>
      </div>

      {/* 1. Patient Appointment Tracker & Search */}
      <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 sm:p-10 rounded-[32px] shadow-xl shadow-blue-900/5 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600">Patient Dashboard</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Check Your Appointment Status</h3>
            <p className="text-xs text-slate-500">Search by your name, email address, or phone number to verify booking status</p>
          </div>

          <form onSubmit={handleSearchAppointments} className="flex items-center gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter email, name, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold transition-all shrink-0"
            >
              Lookup
            </button>
          </form>
        </div>

        {/* Search Results Display */}
        {searchedAppointments !== null ? (
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-500">
              Found {searchedAppointments.length} record(s) for "{searchQuery}":
            </p>
            {searchedAppointments.length === 0 ? (
              <div className="p-6 bg-slate-50 rounded-2xl text-center space-y-2 border border-slate-200/60">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No active appointments found matching that query.</p>
                <p className="text-[11px] text-slate-500">Would you like to schedule a new visit or ask our 24/7 AI Receptionist?</p>
                <button
                  onClick={() => onOpenBooking()}
                  className="mt-2 px-4 py-2 bg-cyan-600 text-white text-xs font-bold rounded-xl hover:bg-cyan-700"
                >
                  Schedule Appointment Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchedAppointments.map((appt) => (
                  <div key={appt.id} className="p-5 bg-white border border-slate-100 rounded-2xl shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{appt.patient_name}</h4>
                        <p className="text-xs text-cyan-700 font-medium">{appt.service}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        appt.status === 'Confirmed' 
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {appt.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 border-t border-slate-50 pt-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Doctor</span>
                        <span>{appt.doctor}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">Date & Time</span>
                        <span>{appt.appointment_date} @ {appt.time_slot}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white/80 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Instant Email Confirmation</span>
                <span className="text-[11px] text-slate-500">Sent automatically upon staff review</span>
              </div>
            </div>

            <div className="p-4 bg-white/80 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">Flexible Rescheduling</span>
                <span className="text-[11px] text-slate-500">Up to 24 hours prior to visit</span>
              </div>
            </div>

            <div className="p-4 bg-white/80 rounded-2xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block">24/7 Desk Line</span>
                <span className="text-[11px] text-slate-500">+1 (555) 321-4321</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Emergency Dental Triage & Care */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-red-50 text-red-600 border border-red-100 inline-flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
            24/7 Patient Emergency Care Triage
          </span>
          <h3 className="text-3xl font-light text-slate-900 tracking-tight">
            Experiencing Urgent <span className="font-bold text-red-600">Dental Discomfort?</span>
          </h3>
          <p className="text-xs text-slate-500">
            Immediate guidance and priority same-day emergency slots available.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 bg-white/60 border border-red-100 rounded-[28px] shadow-sm space-y-3 hover:border-red-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Severe Toothache</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Rinse with warm salt water. Apply cold compress externally. Avoid placing aspirin directly on gums.
            </p>
            <button
              onClick={() => onOpenBooking('emergency')}
              className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 pt-2"
            >
              <span>Emergency Slot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 bg-white/60 border border-red-100 rounded-[28px] shadow-sm space-y-3 hover:border-red-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Chipped or Broken Tooth</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Save any broken fragments. Rinse mouth gently. Apply clean gauze if bleeding occurs.
            </p>
            <button
              onClick={() => onOpenBooking('emergency')}
              className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 pt-2"
            >
              <span>Emergency Slot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 bg-white/60 border border-red-100 rounded-[28px] shadow-sm space-y-3 hover:border-red-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Smile className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Knocked-Out Permanent Tooth</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Keep tooth moist in milk or saline. Do not scrub the root. Visit clinic within 60 minutes.
            </p>
            <button
              onClick={() => onOpenBooking('emergency')}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-2"
            >
              <span>Emergency Slot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-6 bg-white/60 border border-red-100 rounded-[28px] shadow-sm space-y-3 hover:border-red-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <PhoneCall className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Lost Crown or Filler</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Keep area clean. Use temporary dental cement from pharmacy if sensitive. Schedule repair.
            </p>
            <button
              onClick={() => onOpenBooking('emergency')}
              className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1 pt-2"
            >
              <span>Emergency Slot</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Post-Treatment Patient Care Guides */}
      <div className="p-8 sm:p-10 rounded-[32px] bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-blue-900/5 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-600">Post-Procedure Instructions</span>
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Patient Recovery Guidelines</h3>
            <p className="text-xs text-slate-500">Essential post-treatment guidelines curated by our chief dental surgeons</p>
          </div>

          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveInstructionTab('whitening')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeInstructionTab === 'whitening'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Laser Whitening
            </button>

            <button
              onClick={() => setActiveInstructionTab('implant')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeInstructionTab === 'implant'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dental Implants
            </button>

            <button
              onClick={() => setActiveInstructionTab('invisalign')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeInstructionTab === 'invisalign'
                  ? 'bg-cyan-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Invisalign Care
            </button>
          </div>
        </div>

        {/* Tab Content Instructions */}
        <div className="bg-white/80 p-6 rounded-2xl border border-slate-100/80 space-y-4">
          {activeInstructionTab === 'whitening' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                Post Laser Whitening "White Diet" Rule (48 Hours)
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Avoid Dark Staining Foods:</strong> Coffee, red wine, soy sauce, dark berries, and dark sodas for 48 hours.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Sensitivity Relief:</strong> Mild sensitivity is normal. Use desensitizing toothpaste provided in your kit.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Hydration:</strong> Drink plenty of water to rehydrate enamel tubules.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Touch-Up Gel:</strong> Apply touch-up tray gel 2 weeks after initial treatment for maximum longevity.</span>
                </li>
              </ul>
            </div>
          )}

          {activeInstructionTab === 'implant' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-teal-600" />
                Post 3D Titanium Implant Placement Aftercare
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Gauze & Pressure:</strong> Maintain gentle bite pressure on gauze pad for 45 minutes post-surgery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Soft Food Diet:</strong> Stick to lukewarm soups, yogurts, and smoothies for the first 3 days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>No Straws or Smoking:</strong> Avoid suction forces that can disturb the surgical site clot.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Prescription Antibiotics:</strong> Complete the full course of prescribed oral rinse and antibiotics.</span>
                </li>
              </ul>
            </div>
          )}

          {activeInstructionTab === 'invisalign' && (
            <div className="space-y-4">
              <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-sky-600" />
                Invisalign Clear Aligner Daily Maintenance Routine
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Wear Time:</strong> Wear aligners 20 to 22 hours per day. Only remove for eating and brushing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Cleaning:</strong> Clean aligners twice daily with lukewarm water and soft toothbrush or cleaning crystals.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Store Safely:</strong> Always place tray in protective case when eating to prevent loss or damage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span><strong>Tray Change Schedule:</strong> Switch to new aligner tray every 10–14 days as instructed by Dr. Vance.</span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

    </section>
  );
};
