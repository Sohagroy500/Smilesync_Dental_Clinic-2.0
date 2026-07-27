import React, { useState } from 'react';
import { Search, Users, Phone, Mail, Calendar, Eye, Clock, CheckCircle2, X } from 'lucide-react';
import { Patient, Appointment } from '../../types';

interface PatientListProps {
  patients: Patient[];
  appointments: Appointment[];
  loading: boolean;
}

export const PatientList: React.FC<PatientListProps> = ({ patients, appointments, loading }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const filteredPatients = patients.filter(
    (p) =>
      p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  const getPatientAppointments = (email: string) => {
    return appointments.filter((a) => a.email.toLowerCase() === email.toLowerCase());
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span>Patient Directory</span>
          </h1>
          <p className="text-xs text-slate-500">Manage patient records, contact information, and visit histories</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient name, email or phone..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Patient Grid / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400">Loading patients database...</div>
        ) : filteredPatients.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-400">No patients found.</div>
        ) : (
          filteredPatients.map((patient) => {
            const patientAppts = getPatientAppointments(patient.email);
            return (
              <div
                key={patient.id}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                        {patient.full_name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{patient.full_name}</h3>
                        <span className="text-[10px] font-mono text-slate-400">{patient.id}</span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-[10px] font-bold">
                      {patient.status}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{patient.email}</span>
                    </div>
                    <div className="flex items-center space-x-2 font-mono">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{patient.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                      <Calendar className="w-3.5 h-3.5 shrink-0" />
                      <span>Registered: {patient.created_at?.substring(0, 10)}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400">Total Visits: </span>
                    <strong className="text-blue-600 font-bold">{patientAppts.length || patient.total_visits}</strong>
                  </div>

                  <button
                    onClick={() => setSelectedPatient(patient)}
                    className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold transition flex items-center space-x-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white font-bold text-lg flex items-center justify-center shadow-md shadow-blue-500/20">
                  {selectedPatient.full_name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{selectedPatient.full_name}</h2>
                  <p className="text-xs text-slate-400">Patient ID: {selectedPatient.id}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Information */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl text-xs space-y-1">
              <div>
                <span className="text-slate-400 font-medium">Email Address</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedPatient.email}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Phone Number</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5 font-mono">{selectedPatient.phone}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Registration Date</span>
                <p className="font-bold text-slate-900 dark:text-white mt-0.5">{selectedPatient.created_at}</p>
              </div>
              <div>
                <span className="text-slate-400 font-medium">Total Clinic Visits</span>
                <p className="font-bold text-blue-600 mt-0.5">{getPatientAppointments(selectedPatient.email).length} visits</p>
              </div>
            </div>

            {/* Appointment History Timeline */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 dark:text-white mb-3">Appointment History</h3>
              <div className="space-y-2">
                {getPatientAppointments(selectedPatient.email).length === 0 ? (
                  <p className="text-xs text-slate-400">No appointments recorded for this patient.</p>
                ) : (
                  getPatientAppointments(selectedPatient.email).map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/20 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{a.service}</span>
                        <div className="text-[11px] text-slate-400 mt-0.5">{a.doctor} • {a.appointment_date} at {a.time_slot}</div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                        {a.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
