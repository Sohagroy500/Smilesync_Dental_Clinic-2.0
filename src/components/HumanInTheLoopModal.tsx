import React, { useState } from 'react';
import { Mail, CheckCircle, XCircle, AlertCircle, Edit3, Send, ShieldAlert, Sparkles } from 'lucide-react';
import { Appointment } from '../types';

interface HumanInTheLoopModalProps {
  isOpen: boolean;
  appointment?: Appointment;
  emailDraft?: {
    to: string;
    subject: string;
    body: string;
  };
  onApprove: (appointmentId: number, customNotes?: string) => void;
  onReject: (appointmentId: number) => void;
  onClose: () => void;
}

export const HumanInTheLoopModal: React.FC<HumanInTheLoopModalProps> = ({
  isOpen,
  appointment,
  emailDraft,
  onApprove,
  onReject,
  onClose,
}) => {
  const [editableBody, setEditableBody] = useState(emailDraft?.body || '');
  const [isEditing, setIsEditing] = useState(false);
  const [staffNotes, setStaffNotes] = useState('');

  if (!isOpen || !appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl border border-white/80 shadow-2xl shadow-cyan-950/20 overflow-hidden">
        
        {/* Header with RequestInput Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-white shadow-inner">
              <ShieldAlert className="w-6 h-6 text-amber-100 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-700/80 text-[10px] font-mono uppercase tracking-wider font-bold">
                  ADK 2.0 RequestInput Pause
                </span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                  send_mail Node
                </span>
              </div>
              <h3 className="text-lg font-bold">Human-in-the-Loop Email Approval Required</h3>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          
          {/* Explanation Alert */}
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Workflow Paused at Node: <code className="font-mono text-amber-900">send_mail</code></p>
              <p>
                The ADK 2.0 graph workflow registered patient data into the MySQL database (Appointment #{appointment.id}). Before sending the confirmation email, the agent emitted a <code className="font-mono font-bold">RequestInputSignal</code> awaiting clinic desk staff authorization.
              </p>
            </div>
          </div>

          {/* Appointment Data Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Patient Name</span>
              <span className="font-bold text-slate-800">{appointment.patient_name}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Service</span>
              <span className="font-bold text-slate-800">{appointment.service}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Practitioner</span>
              <span className="font-bold text-slate-800">{appointment.doctor}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Date & Time</span>
              <span className="font-bold text-slate-800">{appointment.appointment_date} @ {appointment.time_slot}</span>
            </div>
          </div>

          {/* Email Preview & Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-cyan-600" />
                Confirmation Email Draft
              </label>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-semibold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 hover:underline"
              >
                <Edit3 className="w-3.5 h-3.5" />
                {isEditing ? 'Lock Draft' : 'Edit Email Text'}
              </button>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-900/95 text-slate-100 p-4 font-mono text-xs space-y-2 shadow-inner">
              <div className="pb-2 border-b border-slate-800 text-slate-400 space-y-1">
                <p><span className="text-cyan-400">To:</span> {emailDraft?.to || appointment.email}</p>
                <p><span className="text-cyan-400">Subject:</span> {emailDraft?.subject || `Appointment Confirmation - #${appointment.id}`}</p>
              </div>

              {isEditing ? (
                <textarea
                  value={editableBody}
                  onChange={(e) => setEditableBody(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-800 text-slate-100 p-2 rounded-xl text-xs font-mono focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              ) : (
                <div className="whitespace-pre-wrap text-slate-300 leading-relaxed max-h-48 overflow-y-auto pr-1">
                  {editableBody || emailDraft?.body || `Dear ${appointment.patient_name},\n\nYour appointment for ${appointment.service} on ${appointment.appointment_date} at ${appointment.time_slot} is received.\n\nSmile Sync Dental Team`}
                </div>
              )}
            </div>
          </div>

          {/* Staff Verification Note */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-1">
              Internal Staff Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Verified insurance eligibility over phone"
              value={staffNotes}
              onChange={(e) => setStaffNotes(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              onClick={() => onReject(appointment.id)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <XCircle className="w-4 h-4 text-rose-500" />
              <span>Reject Email & Cancel</span>
            </button>

            <button
              onClick={() => onApprove(appointment.id, staffNotes)}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Approve & Send Confirmation Email</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
