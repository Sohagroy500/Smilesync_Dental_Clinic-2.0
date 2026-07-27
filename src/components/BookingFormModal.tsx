import React, { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, Stethoscope, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';
import { CLINIC_SERVICES, CLINIC_DOCTORS } from '../data/dentalData';
import { Appointment } from '../types';

interface BookingFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppointmentCreated: (appt: Appointment) => void;
  preselectedServiceId?: string;
  preselectedDoctorId?: string;
}

export const BookingFormModal: React.FC<BookingFormModalProps> = ({
  isOpen,
  onClose,
  onAppointmentCreated,
  preselectedServiceId,
  preselectedDoctorId,
}) => {
  const [patientName, setPatientName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedService, setSelectedService] = useState(
    CLINIC_SERVICES.find(s => s.id === preselectedServiceId)?.name || CLINIC_SERVICES[0].name
  );
  const [selectedDoctor, setSelectedDoctor] = useState(
    CLINIC_DOCTORS.find(d => d.id === preselectedDoctorId)?.name || CLINIC_DOCTORS[0].name
  );
  const [appointmentDate, setAppointmentDate] = useState('2026-07-31');
  const [timeSlot, setTimeSlot] = useState('10:00 AM');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !email || !phone) return;

    setIsSubmitting(true);

    try {
      // Direct call to ADK 2.0 Workflow API trigger
      const response = await fetch('/api/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_query: `Book appointment for ${patientName} - ${selectedService}`,
          patient_data: {
            patient_name: patientName,
            email: email,
            phone: phone,
            service: selectedService,
            doctor: selectedDoctor,
            appointment_date: appointmentDate,
            time_slot: timeSlot,
            notes: notes
          }
        })
      });

      const data = await response.json();
      if (data.appointment_data) {
        onAppointmentCreated(data.appointment_data as Appointment);
      }
      onClose();
    } catch (err) {
      console.error("Booking submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-white/95 rounded-3xl border border-white/80 shadow-2xl shadow-cyan-950/20 overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-cyan-600 via-teal-600 to-cyan-700 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Calendar className="w-6 h-6 text-cyan-100" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                ADK 2.0 book_appoint Node
              </span>
              <h3 className="text-lg font-bold">Book Appointment Online</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Patient Name */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
                />
              </div>
            </div>

            {/* Service Select */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Dental Service
              </label>
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              >
                {CLINIC_SERVICES.map(s => (
                  <option key={s.id} value={s.name}>{s.name} ({s.price})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Doctor Select */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preferred Doctor
              </label>
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              >
                {CLINIC_DOCTORS.map(d => (
                  <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Preferred Date
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Available Time Slot
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {['09:00 AM', '10:00 AM', '11:15 AM', '01:30 PM', '02:30 PM', '04:00 PM'].map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all ${
                    timeSlot === slot
                      ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Additional Symptoms or Medical Notes (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Sensitive lower teeth, previous dental work..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          {/* Technical Note */}
          <div className="p-3 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-cyan-900 text-[11px] leading-relaxed flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-600 shrink-0" />
            <span>
              Submitting triggers the ADK 2.0 <code className="font-mono font-bold">book_appoint</code> node (MySQL save) followed by the <code className="font-mono font-bold">send_mail</code> Human-in-the-Loop pause.
            </span>
          </div>

          {/* Submit CTA */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 text-white text-xs font-bold shadow-md shadow-cyan-600/20 hover:from-cyan-500 hover:to-teal-500 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'Processing ADK Graph...' : 'Confirm & Save Appointment'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
