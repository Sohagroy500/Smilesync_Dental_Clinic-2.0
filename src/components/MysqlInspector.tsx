import React, { useState } from 'react';
import { Database, Terminal, Play, RefreshCw, CheckCircle2, Clock, MailCheck, Table } from 'lucide-react';
import { Appointment } from '../types';

interface MysqlInspectorProps {
  appointments: Appointment[];
  onApproveAppointment: (id: number) => void;
}

export const MysqlInspector: React.FC<MysqlInspectorProps> = ({
  appointments,
  onApproveAppointment,
}) => {
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM appointments;");
  const [queryResult, setQueryResult] = useState<{
    columns: string[];
    rows: any[][];
    total: number;
    sql: string;
  } | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const handleRunQuery = async (queryToRun?: string) => {
    const q = queryToRun || sqlQuery;
    setIsExecuting(true);

    try {
      const response = await fetch('/api/appointments/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q })
      });

      const data = await response.json();
      setQueryResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-teal-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-700">
              MySQL Database Storage (`smilesync_db`)
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Appointment Table & SQL Console Inspector
          </h2>
          <p className="text-xs text-slate-500">
            View real-time records collected by the <code className="font-mono text-cyan-700 font-bold">book_appoint</code> node or execute custom MySQL queries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRunQuery("SELECT * FROM appointments;")}
            className="px-3.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Table className="w-3.5 h-3.5 text-teal-600" />
            <span>SELECT * FROM appointments</span>
          </button>
        </div>
      </div>

      {/* Primary Appointments Table Card */}
      <div className="rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-xl shadow-cyan-950/5 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-sm font-bold text-slate-900">
              `appointments` Table Rows ({appointments.length} Records)
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-100/80 text-slate-600 uppercase text-[10px] tracking-wider font-mono border-b border-slate-200/80">
                <th className="p-3.5">ID</th>
                <th className="p-3.5">Patient Name</th>
                <th className="p-3.5">Email & Phone</th>
                <th className="p-3.5">Service & Practitioner</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Email Sent</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-cyan-50/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-slate-900">#{appt.id}</td>
                  <td className="p-3.5 font-bold text-slate-900">{appt.patient_name}</td>
                  <td className="p-3.5">
                    <div className="text-slate-800">{appt.email}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{appt.phone}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-cyan-900">{appt.service}</div>
                    <div className="text-[10px] text-slate-500">{appt.doctor}</div>
                  </td>
                  <td className="p-3.5 whitespace-nowrap">
                    <div className="font-bold text-slate-800">{appt.appointment_date}</div>
                    <div className="text-[10px] text-slate-500">{appt.time_slot}</div>
                  </td>
                  <td className="p-3.5">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      appt.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                      appt.status === 'Awaiting Confirmation' ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                      appt.status === 'Cancelled' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    {appt.email_sent ? (
                      <span className="text-emerald-600 font-bold flex items-center gap-1 text-[11px]">
                        <MailCheck className="w-3.5 h-3.5" /> Sent
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold text-[11px]">Pending Approval</span>
                    )}
                  </td>
                  <td className="p-3.5 text-right">
                    {appt.status === 'Awaiting Confirmation' && (
                      <button
                        onClick={() => onApproveAppointment(appt.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SQL Query Console Card */}
      <div className="rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-teal-400" />
            <h3 className="text-sm font-bold text-teal-300">Interactive MySQL Console</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">
            Database: `smilesync_db`
          </span>
        </div>

        {/* Input & Run */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            placeholder="SELECT * FROM appointments;"
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:ring-2 focus:ring-teal-500/30"
          />
          <button
            onClick={() => handleRunQuery()}
            disabled={isExecuting}
            className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold font-mono transition-colors flex items-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5" />
            <span>{isExecuting ? 'Executing...' : 'Run Query'}</span>
          </button>
        </div>

        {/* Sample Shortcut Buttons */}
        <div className="flex items-center gap-2 flex-wrap text-xs text-slate-400 font-mono">
          <span>Preset Queries:</span>
          <button onClick={() => { setSqlQuery("SELECT * FROM appointments;"); handleRunQuery("SELECT * FROM appointments;"); }} className="underline hover:text-teal-300">
            SELECT *
          </button>
          <span>•</span>
          <button onClick={() => { setSqlQuery("SHOW TABLES;"); handleRunQuery("SHOW TABLES;"); }} className="underline hover:text-teal-300">
            SHOW TABLES
          </button>
        </div>

        {/* Query Results Table */}
        {queryResult && (
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <p className="text-[11px] font-mono text-slate-400">
              Executed: <code className="text-teal-300">{queryResult.sql}</code> ({queryResult.total} rows returned)
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-2 max-h-60">
              <table className="w-full text-left font-mono text-[11px]">
                <thead>
                  <tr className="border-b border-slate-800 text-cyan-400">
                    {queryResult.columns.map((col, idx) => (
                      <th key={idx} className="p-2">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900 text-slate-300">
                  {queryResult.rows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-900">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-2 whitespace-nowrap">{String(cell)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
