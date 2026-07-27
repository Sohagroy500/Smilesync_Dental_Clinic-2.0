import React, { useState } from 'react';
import { CLINIC_DOCTORS } from '../data/dentalData';
import { Doctor } from '../types';
import { 
  Star, 
  Award, 
  GraduationCap, 
  Calendar, 
  Globe, 
  Linkedin, 
  Twitter, 
  Mail, 
  CheckCircle2, 
  Stethoscope,
  ChevronRight,
  Info
} from 'lucide-react';

interface DoctorsSectionProps {
  onSelectDoctorToBook: (doctorName: string) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
  onSelectDoctorToBook,
}) => {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  return (
    <section id="doctors" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900 text-xs font-bold uppercase tracking-widest text-blue-700 dark:text-sky-300">
          <Stethoscope className="w-3.5 h-3.5 text-blue-600" />
          World-Class Dental Clinicians
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
          Meet Our <span className="text-blue-600 dark:text-sky-400">Specialist Dentists</span>
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
          Board-certified clinicians from premier institutions, passionate about crafting natural, healthy smiles with compassionate care.
        </p>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {CLINIC_DOCTORS.map((doctor) => (
          <div
            key={doctor.id}
            className="group rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl hover:border-blue-200 dark:hover:border-blue-800 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Doctor Image Header */}
              <div className="relative h-72 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={doctor.image}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>

                {/* Rating Badge */}
                <div className="absolute top-4 right-4 glass-panel px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{doctor.rating}</span>
                </div>

                {/* Name Overlay */}
                <div className="absolute bottom-4 left-6 right-6 text-white space-y-1">
                  <h3 className="text-xl font-extrabold tracking-tight drop-shadow-sm">
                    {doctor.name}
                  </h3>
                  <p className="text-xs font-semibold text-sky-200">
                    {doctor.title}
                  </p>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-6 space-y-4 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200 font-bold">
                  <Award className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{doctor.experience}</span>
                </div>

                <div className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{doctor.education}</span>
                </div>

                {doctor.languages && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>Languages: {doctor.languages.join(', ')}</span>
                  </div>
                )}

                <div className="pt-1">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 block mb-1.5">Available Days</span>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.availableDays.map((day) => (
                      <span 
                        key={day}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-sky-300 font-extrabold text-[10px]"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 pt-0 space-y-3">
              <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                {/* Social icons */}
                <div className="flex items-center gap-2 text-slate-400">
                  {doctor.socials?.linkedin && (
                    <a href={doctor.socials.linkedin} target="_blank" rel="noreferrer" className="p-2 hover:text-blue-600 transition-colors">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                  {doctor.socials?.email && (
                    <a href={`mailto:${doctor.socials.email}`} className="p-2 hover:text-blue-600 transition-colors">
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>

                <button
                  onClick={() => onSelectDoctorToBook(doctor.name)}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Book Consultation</span>
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
};
