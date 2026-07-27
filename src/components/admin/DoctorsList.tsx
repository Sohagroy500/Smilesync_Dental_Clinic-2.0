import React from 'react';
import { Stethoscope, Star, Calendar, Award, Mail, ExternalLink } from 'lucide-react';
import { CLINIC_DOCTORS } from '../../data/dentalData';

export const DoctorsList: React.FC = () => {
  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-blue-600" />
            <span>Clinic Dentists & Specialists</span>
          </h1>
          <p className="text-xs text-slate-500">Overview of active dental clinicians, specialties, and schedules</p>
        </div>
      </div>

      {/* Doctor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {CLINIC_DOCTORS.map((doctor) => (
          <div
            key={doctor.id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-3.5">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-blue-500/20 shadow-xs"
                />
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{doctor.name}</h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">{doctor.title}</p>
                  <div className="flex items-center space-x-1 mt-1 text-xs text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{doctor.rating}</span>
                    <span className="text-slate-400 text-[11px] font-normal">({doctor.experience})</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{doctor.education}</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-900 dark:text-white">Available Days: </span>
                    <span className="text-slate-500">{doctor.availableDays.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Specialty: {doctor.specialty}</span>
              <button
                onClick={() => alert(`Managing schedule for ${doctor.name}`)}
                className="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 text-blue-600 dark:text-blue-400 rounded-xl font-bold transition"
              >
                Schedule
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
