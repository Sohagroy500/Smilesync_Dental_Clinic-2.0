import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CLINIC_SERVICES, CLINIC_DOCTORS } from '../data/dentalData';
import { 
  Calendar, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Send,
  MessageSquare,
  Stethoscope,
  Heart
} from 'lucide-react';

interface AppointmentSectionProps {
  initialServiceId?: string;
  initialDoctorName?: string;
  onAppointmentCreated?: (appointmentData: any) => void;
}

export const AppointmentSection: React.FC<AppointmentSectionProps> = ({
  initialServiceId = '',
  initialDoctorName = '',
  onAppointmentCreated,
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState(
    initialServiceId ? CLINIC_SERVICES.find(s => s.id === initialServiceId)?.name || CLINIC_SERVICES[0].name : CLINIC_SERVICES[0].name
  );
  const [doctor, setDoctor] = useState(
    initialDoctorName || CLINIC_DOCTORS[0].name
  );
  const [preferredDate, setPreferredDate] = useState('2026-07-30');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:15 AM', '01:30 PM', '02:30 PM', '04:00 PM', '05:15 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);

      // Trigger Celebration Confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (onAppointmentCreated) {
        onAppointmentCreated({
          patient_name: fullName,
          email,
          phone,
          service,
          doctor,
          appointment_date: preferredDate,
          time_slot: preferredTime,
          notes: message
        });
      }
    }, 600);
  };

  return (
    <section id="appointment" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="rounded-[36px] bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Marketing Text */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-bold uppercase tracking-widest text-sky-300">
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              Easy Online Booking
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
              Schedule Your <br />
              <span className="bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">
                Dental Visit
              </span>
            </h2>

            <p className="text-slate-300 text-sm leading-relaxed font-normal">
              Book your appointment in less than 60 seconds. Our patient coordinators will reach out immediately to confirm your preferred time slot and doctor.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">No Payment Required Upfront</h4>
                  <p className="text-xs text-slate-400">All insurance claims handled directly at desk</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Free Initial Consultation</h4>
                  <p className="text-xs text-slate-400">Includes 3D digital oral hygiene scan</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Same-Day Emergency Guarantee</h4>
                  <p className="text-xs text-slate-400">Priority triage for acute toothaches</p>
                </div>
              </div>
            </div>

            {/* Direct Phone Assistance */}
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between pt-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-300 block">Prefer to call?</span>
                <span className="text-base font-extrabold text-white">+1 (555) 321-4321</span>
              </div>
              <a
                href="tel:15553214321"
                className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors"
              >
                Call Desk
              </a>
            </div>

          </div>

          {/* Right Appointment Form UI */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-2xl border border-slate-200/80 dark:border-slate-800">
              
              {isSubmitted ? (
                <div className="text-center py-10 space-y-6 animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                      Appointment Request Received!
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                      Thank you <span className="font-bold text-blue-600 dark:text-sky-400">{fullName || 'Valued Patient'}</span>! We have reserved your requested appointment for <span className="font-bold text-slate-900 dark:text-white">{preferredDate} at {preferredTime}</span> for {service}.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-left space-y-2 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Assigned Specialist:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{doctor}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Contact Email:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{email || 'On File'}</span>
                    </div>
                    <div className="flex justify-between text-slate-500">
                      <span>Contact Phone:</span>
                      <span className="font-bold text-slate-900 dark:text-white">{phone || 'On File'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFullName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md"
                  >
                    Book Another Appointment
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      Book Your Visit
                    </h3>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                      ● Instant Confirmation
                    </span>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Dr. John Doe"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="john@example.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Phone & Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Phone Number *
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Dental Service *
                      </label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {CLINIC_SERVICES.map((s) => (
                          <option key={s.id} value={s.name}>
                            {s.name} ({s.price})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Doctor Preference & Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Doctor Specialist
                      </label>
                      <select
                        value={doctor}
                        onChange={(e) => setDoctor(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {CLINIC_DOCTORS.map((d) => (
                          <option key={d.id} value={d.name}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                        Preferred Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Preferred Time Slot */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Select Time Slot *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setPreferredTime(slot)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            preferredTime === slot
                              ? 'bg-blue-600 text-white shadow-sm'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message / Notes */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                      Additional Notes or Symptoms (Optional)
                    </label>
                    <textarea
                      rows={2}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Mention any dental anxieties, previous history, or special requests..."
                      className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 hover:from-blue-700 hover:to-sky-700 text-white font-bold text-xs shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Processing Appointment...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Confirm Appointment Request</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    🔒 Privacy Protected • No Obligation • Cancel Anytime
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
