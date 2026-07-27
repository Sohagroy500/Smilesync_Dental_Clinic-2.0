import React, { useState } from 'react';
import { MessageSquare, Bot, User, Clock, CheckCircle2, ChevronRight, X, Sparkles, Cpu } from 'lucide-react';
import { ChatSessionAdmin } from '../../types';

interface ChatHistoryViewProps {
  chatSessions: ChatSessionAdmin[];
  loading: boolean;
}

export const ChatHistoryView: React.FC<ChatHistoryViewProps> = ({ chatSessions, loading }) => {
  const [selectedSession, setSelectedSession] = useState<ChatSessionAdmin | null>(null);

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            <span>AI Chatbot Transcript Logs</span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time conversations handled by Gemini 3.6 Flash & Google ADK 2.0 Graph Agent
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-3 py-1.5 rounded-xl text-xs font-semibold">
          <Cpu className="w-4 h-4 text-blue-600" />
          <span>ADK 2.0 Graph Active</span>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-200/80 dark:border-slate-800">
                <th className="py-3 px-4">Session ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Intent</th>
                <th className="py-3 px-4">Last Agent Message</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Transcript</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">Loading AI chatbot history...</td>
                </tr>
              ) : chatSessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">No AI chat sessions recorded.</td>
                </tr>
              ) : (
                chatSessions.map((session) => (
                  <tr
                    key={session.session_id}
                    onClick={() => setSelectedSession(session)}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-600 dark:text-blue-400">
                      {session.session_id}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                      {session.patient_name}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          session.intent === 'booking'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {session.intent}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-slate-600 dark:text-slate-300">
                      {session.last_message}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 font-medium">{session.timestamp}</td>

                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {session.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button className="text-xs font-bold text-blue-600 hover:underline flex items-center space-x-1 justify-end">
                        <span>View Chat</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transcript Drawer / Modal */}
      {selectedSession && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-sm text-slate-900 dark:text-white">
                    Transcript: {selectedSession.session_id}
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Patient: {selectedSession.patient_name} ({selectedSession.email || 'No email'})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedSession(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Transcript Stream */}
            <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-2xl custom-scrollbar min-h-[300px]">
              {selectedSession.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.sender === 'user' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                  </div>

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs space-y-1 ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-800 rounded-tl-none shadow-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <span className={`text-[9px] block text-right opacity-60`}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-xl text-xs font-bold"
              >
                Close Transcript
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
