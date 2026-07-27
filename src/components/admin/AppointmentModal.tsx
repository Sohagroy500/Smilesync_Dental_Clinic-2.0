import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, Stethoscope, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
import { Appointment } from '../../types';
import { CLINIC_DOCTORS, CLINIC_SERVICES } from '../../data/dentalData';

interface AppointmentModalProps {
  mode: 'view' | 'edit' | 'create';
  appointment: Appointment | null;
  onClose: () => void;
  onSubmit: (data: Partial<Appointment>) => Promise<void>;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  mode,
  appointment,
  onClose,
  onSubmit,
}) => {
  const [patientName, setPatientName] = useState(appointment?.patient_name || '');
  const [email, setEmail] = useState(appointment?.email || '');
  const [phone, setPhone] = useState(appointment?.phone || '');
  const [service, setService] = useState(appointment?.service || CLINIC_SERVICES[0].name);
  const [doctor, setDoctor] = useState(appointment?.doctor || CLINIC_DOCTORS[0].name);
  const [date, setDate] = useState(appointment?.appointment_date || 'July 30, 2026');
  const [time, setTime] = useState(appointment?.time_slot || '09:00 AM – 09:30 AM');
  const [status, setStatus] = useState<Appointment['status']>(appointment?.status || 'Confirmed');
  const [notes, setNotes] = useState(appointment?.notes || '');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await onSubmit({
      patient_name: patientName,
      email,
      phone,
      service,
      doctor,
      appointment_date: date,
      time_slot: time,
      status,
      notes,
    });
    setSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                {mode === 'create'
                  ? 'Book New Appointment'
                  : mode === 'edit'
                  ? `Edit Appointment #APT-${appointment?.id}`
                  : `Appointment Details #APT-${appointment?.id}`}
              </h2>
              <p className="text-xs text-slate-400">SmileSync Receptionist Admin Form</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {mode === 'view' ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl">
              <div>
                <span className="text-slate-400 block font-medium">Patient Name</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">{appointment?.patient_name}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Status</span>
                <span className="font-bold text-blue-600">{appointment?.status}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Email</span>
                <span className="text-slate-700 dark:text-slate-300">{appointment?.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block font-medium">Phone</span>
                <span className="text-slate-700 dark:text-slate-300 font-mono">{appointment?.phone}</span>
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 dark:bg-slate-800/50 rounded-2xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Service:</span>
                <strong className="text-slate-900 dark:text-white">{appointment?.service}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dentist:</span>
                <strong className="text-slate-900 dark:text-white">{appointment?.doctor}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Scheduled Date:</span>
                <strong className="text-blue-600">{appointment?.appointment_date}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Time Slot:</span>
                <strong className="text-blue-600">{appointment?.time_slot}</strong>
              </div>
            </div>

            {appointment?.notes && (
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                <span className="font-bold block text-slate-900 dark:text-white mb-1">Clinical Notes:</span>
                <p>{appointment.notes}</p>
              </div>
            )}

            <div className="pt-3 text-right">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl font-bold"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Patient Full Name</label>
                <input
                  type="text"
                  required
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  placeholder="e.g. David Miller"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  placeholder="e.g. david@example.com"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Dental Service</label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {CLINIC_SERVICES.map((s) => (
                    <option key={s.id} value={s.name}>{s.name} ({s.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Assigned Doctor</label>
                <select
                  value={doctor}
                  onChange={(e) => setDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  {CLINIC_DOCTORS.map((d) => (
                    <option key={d.id} value={d.name}>{d.name} ({d.title})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Booking Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Booked">Booked</option>
                  <option value="Awaiting Confirmation">Awaiting Confirmation</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                <input
                  type="text"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  placeholder="e.g. July 30, 2026"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                <input
                  type="text"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                  placeholder="e.g. 09:00 AM – 09:30 AM"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Reception / Clinical Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                placeholder="Add special requests, allergy notes, or payment notes..."
              />
            </div>

            <div className="pt-3 flex items-center justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-md"
              >
                {submitting ? 'Saving...' : 'Save Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
