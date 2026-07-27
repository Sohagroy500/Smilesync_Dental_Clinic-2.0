import React from 'react';
import { 
  Calendar, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  UserPlus, 
  TrendingUp, 
  Phone, 
  Mail, 
  ChevronRight, 
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { DashboardSummary, Appointment, Patient } from '../../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

interface DashboardOverviewProps {
  summary: DashboardSummary | null;
  loading: boolean;
  onNavigateToTab: (tab: 'appointments' | 'patients' | 'analytics') => void;
  onViewAppointmentDetails: (appt: Appointment) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  summary,
  loading,
  onNavigateToTab,
  onViewAppointmentDetails,
}) => {
  if (loading || !summary) {
    return (
      <div className="p-6 space-y-6 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  const { kpis, todaysSchedule, recentPatients, analytics } = summary;

  const kpiItems = [
    {
      title: "Today's Appointments",
      value: kpis.todaysAppointments,
      icon: Calendar,
      color: 'bg-blue-500 text-white',
      badge: '+2 vs yesterday',
      positive: true,
    },
    {
      title: 'Upcoming Bookings',
      value: kpis.upcomingAppointments,
      icon: Clock,
      color: 'bg-indigo-500 text-white',
      badge: 'Active schedule',
      positive: true,
    },
    {
      title: 'Completed Visits',
      value: kpis.completedAppointments,
      icon: CheckCircle2,
      color: 'bg-emerald-500 text-white',
      badge: '98% satisfaction',
      positive: true,
    },
    {
      title: 'Cancelled',
      value: kpis.cancelledAppointments,
      icon: XCircle,
      color: 'bg-rose-500 text-white',
      badge: 'Low rate',
      positive: false,
    },
    {
      title: 'Total Patients',
      value: kpis.registeredPatients,
      icon: Users,
      color: 'bg-sky-500 text-white',
      badge: '+12 this week',
      positive: true,
    },
    {
      title: 'New Patients Today',
      value: kpis.newPatientsToday,
      icon: UserPlus,
      color: 'bg-violet-500 text-white',
      badge: '3 registered',
      positive: true,
    },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-md mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>SmileSync AI Dashboard Active</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Good day, Dr. Sarah Jenkins! 👋
            </h1>
            <p className="text-xs md:text-sm text-blue-100 mt-1 max-w-xl">
              You have <span className="font-bold text-white">{kpis.todaysAppointments} appointments</span> scheduled for today. All AI chatbot systems and SQLite databases are operating smoothly.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigateToTab('appointments')}
              className="px-4 py-2.5 bg-white text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50 transition shadow-md active:scale-95"
            >
              Manage Schedule
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {kpiItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 rounded-xl ${item.color} shadow-xs group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                  {item.badge}
                </span>
              </div>

              <div className="mt-2">
                <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  {item.value}
                </p>
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                  {item.title}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Grid: Today's Schedule Timeline & Analytics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule (2 cols) */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900 dark:text-white">Today's Schedule</h2>
                <p className="text-[11px] text-slate-500">Appointments scheduled for today</p>
              </div>
            </div>

            <button
              onClick={() => onNavigateToTab('appointments')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar pr-1">
            {todaysSchedule.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">No appointments scheduled for today yet.</p>
              </div>
            ) : (
              todaysSchedule.map((appt, idx) => (
                <div
                  key={appt.id || idx}
                  onClick={() => onViewAppointmentDetails(appt)}
                  className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-blue-50/50 dark:hover:bg-slate-800/80 hover:border-blue-200 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Time pill */}
                    <div className="px-2.5 py-1.5 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-xl font-bold text-xs shrink-0 text-center">
                      {appt.time_slot}
                    </div>

                    <div>
                      <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                        {appt.patient_name}
                      </h3>
                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        <span className="font-medium text-blue-600 dark:text-blue-400">{appt.service}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {appt.phone}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        appt.status === 'Confirmed' || appt.status === 'Booked'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                          : appt.status === 'Completed'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400'
                          : appt.status === 'Cancelled'
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                          : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      }`}
                    >
                      {appt.status}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Analytics Mini Breakdown (1 col) */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900 dark:text-white">Status Breakdown</h2>
                  <p className="text-[11px] text-slate-500">Distribution by booking status</p>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab('analytics')}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Analytics
              </button>
            </div>

            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.appointmentsByStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {analytics.appointmentsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0F172A',
                      borderColor: '#334155',
                      borderRadius: '12px',
                      color: '#FFF',
                      fontSize: '12px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              {analytics.appointmentsByStatus.map((st, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: st.color }} />
                  <span className="text-slate-600 dark:text-slate-400 font-medium truncate">{st.name}:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{st.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Patients Section */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-sky-50 dark:bg-sky-950/50 text-sky-600 rounded-xl">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-900 dark:text-white">Recent Patients</h2>
              <p className="text-[11px] text-slate-500">Recently registered patient profiles</p>
            </div>
          </div>

          <button
            onClick={() => onNavigateToTab('patients')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center space-x-1"
          >
            <span>Patients Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2">
                <th className="pb-3 px-3">Patient Name</th>
                <th className="pb-3 px-3">Email Address</th>
                <th className="pb-3 px-3">Phone</th>
                <th className="pb-3 px-3">Registration Date</th>
                <th className="pb-3 px-3 text-center">Visits</th>
                <th className="pb-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {recentPatients.map((pat) => (
                <tr key={pat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs shrink-0">
                      {pat.full_name.charAt(0)}
                    </div>
                    <span>{pat.full_name}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{pat.email}</td>
                  <td className="py-3 px-3 font-mono text-slate-600 dark:text-slate-300">{pat.phone}</td>
                  <td className="py-3 px-3 text-slate-500">{pat.created_at?.substring(0, 10)}</td>
                  <td className="py-3 px-3 text-center font-bold text-blue-600">{pat.total_visits}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onNavigateToTab('patients')}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
