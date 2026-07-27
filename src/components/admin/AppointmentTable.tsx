import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Eye, 
  Edit3, 
  XCircle, 
  CheckCircle2, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Download,
  Clock,
  Phone,
  Mail,
  X
} from 'lucide-react';
import { Appointment } from '../../types';

interface AppointmentTableProps {
  appointments: Appointment[];
  loading: boolean;
  onRefresh: () => void;
  onOpenNewModal: () => void;
  onUpdateStatus: (id: number, status: 'Confirmed' | 'Completed' | 'Cancelled') => void;
  onViewDetails: (appt: Appointment) => void;
  onEditDetails: (appt: Appointment) => void;
}

export const AppointmentTable: React.FC<AppointmentTableProps> = ({
  appointments,
  loading,
  onRefresh,
  onOpenNewModal,
  onUpdateStatus,
  onViewDetails,
  onEditDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Filter & Search Logic
  const filteredAppointments = useMemo(() => {
    return appointments.filter((appt) => {
      const matchesSearch =
        searchTerm === '' ||
        appt.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.phone.includes(searchTerm) ||
        appt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.id.toString().includes(searchTerm);

      const matchesStatus =
        statusFilter === 'All' ||
        (statusFilter === 'Booked' && (appt.status === 'Confirmed' || appt.status === 'Booked')) ||
        appt.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesDate =
        dateFilter === '' ||
        appt.appointment_date.includes(dateFilter);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage) || 1;
  const paginatedAppointments = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAppointments.slice(start, start + itemsPerPage);
  }, [filteredAppointments, currentPage]);

  const exportCSV = () => {
    const headers = ['ID,Patient Name,Email,Phone,Service,Doctor,Date,Time,Status,Created At'];
    const rows = filteredAppointments.map(a => 
      `"${a.id}","${a.patient_name}","${a.email}","${a.phone}","${a.service}","${a.doctor}","${a.appointment_date}","${a.time_slot}","${a.status}","${a.created_at}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `smilesync_appointments_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Table Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <span>Appointment Management</span>
          </h1>
          <p className="text-xs text-slate-500">View, search, edit, and filter patient clinic appointments</p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={exportCSV}
            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={onOpenNewModal}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 transition active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Appointment</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by ID, Patient Name, Email, Phone, or Service..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto py-1">
          <span className="text-xs font-semibold text-slate-400 flex items-center space-x-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
          </span>
          {['All', 'Booked', 'Completed', 'Cancelled', 'Awaiting Confirmation'].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                <th className="py-3 px-4">Appt ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Service & Doctor</th>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Loading appointments from database...
                  </td>
                </tr>
              ) : paginatedAppointments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    No appointments match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      APT-{appt.id}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {appt.patient_name}
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{appt.email}</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-slate-500 font-mono text-[11px]">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{appt.phone}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <p className="font-semibold text-slate-900 dark:text-white">{appt.service}</p>
                      <p className="text-[11px] text-slate-400">{appt.doctor}</p>
                    </td>

                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-medium text-slate-900 dark:text-white">{appt.appointment_date}</div>
                      <div className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{appt.time_slot}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center space-x-1 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                          appt.status === 'Confirmed' || appt.status === 'Booked'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : appt.status === 'Completed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                            : appt.status === 'Cancelled'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        <span>{appt.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1">
                      <button
                        onClick={() => onViewDetails(appt)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onEditDetails(appt)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-slate-800 transition"
                        title="Edit Appointment"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {appt.status !== 'Completed' && (
                        <button
                          onClick={() => onUpdateStatus(appt.id, 'Completed')}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 transition"
                          title="Mark Completed"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      {appt.status !== 'Cancelled' && (
                        <button
                          onClick={() => onUpdateStatus(appt.id, 'Cancelled')}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition"
                          title="Cancel Appointment"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-900 dark:text-white">{filteredAppointments.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}</strong> to{' '}
            <strong className="text-slate-900 dark:text-white">{Math.min(currentPage * itemsPerPage, filteredAppointments.length)}</strong> of{' '}
            <strong className="text-slate-900 dark:text-white">{filteredAppointments.length}</strong> entries
          </span>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-slate-900 dark:text-white">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-white dark:hover:bg-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
