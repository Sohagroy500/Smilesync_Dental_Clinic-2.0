import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Database, Mail, PauseCircle, Play, RefreshCw, Terminal, CheckCircle2, ArrowRight, ShieldCheck, Info } from 'lucide-react';
import { Appointment, WorkflowState } from '../types';
import { HumanInTheLoopModal } from './HumanInTheLoopModal';

interface AiGraphAssistantProps {
  onAppointmentBooked: () => void;
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  node?: 'FAQs_Answer' | 'book_appoint' | 'send_mail' | 'router';
  appointment?: Appointment;
  isPaused?: boolean;
}

export const AiGraphAssistant: React.FC<AiGraphAssistantProps> = ({
  onAppointmentBooked,
  appointments,
  setAppointments,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: "Hello! I am the Smile Sync Ambient AI Agent, built on the ADK 2.0 Graph Workflow engine.\n\nI can automatically answer clinic FAQs via our `FAQs_Answer` node or guide you through booking an appointment (which saves to MySQL via `book_appoint` and requests human confirmation review via `send_mail`). How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeNode, setActiveNode] = useState<'idle' | 'router' | 'FAQs_Answer' | 'book_appoint' | 'send_mail' | 'completed'>('idle');
  const [executionLogs, setExecutionLogs] = useState<WorkflowState['execution_logs']>([]);
  
  // Human-in-the-Loop State
  const [pausedAppt, setPausedAppt] = useState<Appointment | undefined>(undefined);
  const [emailDraft, setEmailDraft] = useState<{ to: string; subject: string; body: string } | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, executionLogs]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputQuery.trim() || isLoading) return;

    const queryText = inputQuery.trim();
    setInputQuery('');

    // Add user message
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    // Node 1: Router
    setActiveNode('router');

    try {
      const response = await fetch('/api/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_query: queryText,
          patient_data: {
            patient_name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+1 (555) 987-6543",
            service: "Laser Teeth Whitening",
            doctor: "Dr. Sarah Jenkins, DDS",
            appointment_date: "2026-07-31",
            time_slot: "02:00 PM",
            notes: queryText
          }
        })
      });

      const data: WorkflowState = await response.json();
      setExecutionLogs(prev => [...prev, ...(data.execution_logs || [])]);

      if (data.intent === 'faq') {
        setActiveNode('FAQs_Answer');
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: `agent-${Date.now()}`,
              sender: 'agent',
              text: data.faq_answer || "Smile Sync Dental Clinic provides comprehensive dental care.",
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              node: 'FAQs_Answer'
            }
          ]);
          setActiveNode('completed');
          setIsLoading(false);
        }, 600);
      } else {
        // Booking branch
        setActiveNode('book_appoint');
        setTimeout(() => {
          if (data.appointment_data) {
            const appt = data.appointment_data as Appointment;
            
            // Sync local appointment list
            setAppointments(prev => {
              if (prev.some(a => a.id === appt.id)) return prev;
              return [appt, ...prev];
            });

            onAppointmentBooked();

            // Transition to send_mail node & trigger Human Pause
            setActiveNode('send_mail');
            setPausedAppt(appt);
            setEmailDraft(data.email_draft);

            setMessages(prev => [
              ...prev,
              {
                id: `agent-${Date.now()}`,
                sender: 'agent',
                text: `✔ Registered appointment #${appt.id} in MySQL database for ${appt.patient_name}.\n\n⏸ **[ADK 2.0 RequestInput Pause Triggered]**: Workflow paused at node \`send_mail\`. Waiting for human staff confirmation approval before dispatching email to ${appt.email}.`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                node: 'send_mail',
                appointment: appt,
                isPaused: true
              }
            ]);

            // Open Human-in-the-Loop Modal
            setIsModalOpen(true);
          }
          setIsLoading(false);
        }, 800);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'agent',
          text: "I encountered an issue executing the workflow. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setActiveNode('idle');
      setIsLoading(false);
    }
  };

  const handleApproveHumanInput = async (appointmentId: number, customNotes?: string) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESUME_HUMAN_INPUT',
          human_decision: 'approve',
          appointment_id: appointmentId,
          custom_notes: customNotes
        })
      });

      const data: WorkflowState = await res.json();
      setExecutionLogs(prev => [...prev, ...(data.execution_logs || [])]);

      // Update state in local appointments
      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Confirmed', email_sent: true } : a));

      setMessages(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          text: `✔ **Human Staff Action**: Approved confirmation email dispatch for Appointment #${appointmentId}. Workflow execution resumed & completed!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          node: 'send_mail'
        }
      ]);

      setIsModalOpen(false);
      setActiveNode('completed');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectHumanInput = async (appointmentId: number) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/workflow/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESUME_HUMAN_INPUT',
          human_decision: 'reject',
          appointment_id: appointmentId
        })
      });

      const data: WorkflowState = await res.json();
      setExecutionLogs(prev => [...prev, ...(data.execution_logs || [])]);

      setAppointments(prev => prev.map(a => a.id === appointmentId ? { ...a, status: 'Cancelled' } : a));

      setMessages(prev => [
        ...prev,
        {
          id: `sys-${Date.now()}`,
          sender: 'system',
          text: `❌ **Human Staff Action**: Email rejected & appointment cancelled for Appointment #${appointmentId}.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      setIsModalOpen(false);
      setActiveNode('completed');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Header Card */}
      <div className="p-6 sm:p-8 rounded-[32px] bg-white/40 backdrop-blur-xl border border-white/60 shadow-xl shadow-blue-900/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-700">
              ADK 2.0 Graph Engine Active
            </span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            Ambient Dental Clinic Agent Terminal
          </h2>
          <p className="text-xs text-slate-500">
            Interactive simulation of ADK 2.0 Function Nodes (<code className="text-cyan-700 font-mono font-semibold">FAQs_Answer</code>, <code className="text-teal-700 font-mono font-semibold">book_appoint</code>, <code className="text-amber-700 font-mono font-semibold">send_mail</code>) with real-time Graph state & Human Pause.
          </p>
        </div>

        {/* Quick Sample Prompts */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => { setInputQuery("What dental whitening packages do you offer and what are the prices?"); }}
            className="text-xs px-3 py-1.5 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 transition-colors font-medium"
          >
            "Ask Whitening Prices"
          </button>
          <button
            onClick={() => { setInputQuery("I would like to book a teeth whitening appointment with Dr. Sarah Jenkins on Friday"); }}
            className="text-xs px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 transition-colors font-medium"
          >
            "Book Appointment"
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (7 cols): Patient AI Chat */}
        <div className="lg:col-span-7 flex flex-col h-[620px] bg-white/80 backdrop-blur-xl rounded-3xl border border-white/80 shadow-xl shadow-cyan-950/5 overflow-hidden">
          
          {/* Chat Header */}
          <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold">Smile Sync AI Assistant</h3>
                <p className="text-[10px] text-slate-400">Powered by ADK 2.0 & Gemini 3.6 Flash</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 border border-slate-700">
                Active Node: {activeNode}
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender !== 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md shadow-cyan-600/15'
                      : msg.sender === 'system'
                      ? 'bg-amber-50 border border-amber-200 text-amber-950 font-medium'
                      : 'bg-white border border-slate-200/80 text-slate-800 shadow-xs'
                  }`}
                >
                  {/* Node Badge */}
                  {msg.node && (
                    <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-slate-100">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-cyan-100 text-cyan-800">
                        Node: {msg.node}
                      </span>
                    </div>
                  )}

                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Paused Action Button in Chat */}
                  {msg.isPaused && msg.appointment && (
                    <div className="mt-3 pt-2 border-t border-amber-200 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-800 flex items-center gap-1">
                        <PauseCircle className="w-3.5 h-3.5 text-amber-600" />
                        Awaiting Staff Review
                      </span>
                      <button
                        onClick={() => {
                          setPausedAppt(msg.appointment);
                          setIsModalOpen(true);
                        }}
                        className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold shadow-xs transition-colors"
                      >
                        Review Email & Approve
                      </button>
                    </div>
                  )}

                  <span className={`text-[10px] mt-1 block text-right ${msg.sender === 'user' ? 'text-cyan-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 italic p-2 bg-white rounded-xl border border-slate-200 w-fit">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-600 animate-spin" />
                Executing ADK 2.0 Graph Node ({activeNode})...
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask about dental services or request an appointment..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 rounded-2xl text-xs border border-slate-200/80 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isLoading}
              className="p-2.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50 transition-all active:scale-95 shadow-md shadow-cyan-600/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

        {/* Right Column (5 cols): ADK 2.0 Graph Visualizer & Execution Log Console */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* ADK Graph Topology Card */}
          <div className="p-5 rounded-3xl bg-white/80 backdrop-blur-xl border border-white/80 shadow-xl shadow-cyan-950/5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                ADK 2.0 Node Execution State
              </h3>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 font-semibold">
                Graph API v2.0
              </span>
            </div>

            {/* Interactive Graph Nodes */}
            <div className="space-y-2.5 text-xs">
              
              {/* Router Node */}
              <div className={`p-3 rounded-2xl border transition-all ${
                activeNode === 'router'
                  ? 'bg-cyan-500 text-white border-cyan-600 shadow-md ring-2 ring-cyan-400/40 animate-pulse'
                  : 'bg-slate-50 border-slate-200/80 text-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold">1. intent_router</span>
                  <span className="text-[10px] font-mono opacity-80">RouterNode</span>
                </div>
                <p className="text-[11px] opacity-90 mt-0.5">Classifies intent (FAQ vs Booking)</p>
              </div>

              {/* Edge arrow */}
              <div className="text-center text-slate-300 font-mono text-[10px]">│ Conditional Branch │</div>

              {/* FAQs_Answer Node */}
              <div className={`p-3 rounded-2xl border transition-all ${
                activeNode === 'FAQs_Answer'
                  ? 'bg-teal-600 text-white border-teal-700 shadow-md ring-2 ring-teal-400/40 animate-pulse'
                  : 'bg-slate-50 border-slate-200/80 text-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold">2A. FAQs_Answer</span>
                  <span className="text-[10px] font-mono opacity-80">Node (Gemini)</span>
                </div>
                <p className="text-[11px] opacity-90 mt-0.5">Answers clinic & service questions automatically</p>
              </div>

              {/* book_appoint Node */}
              <div className={`p-3 rounded-2xl border transition-all ${
                activeNode === 'book_appoint'
                  ? 'bg-sky-600 text-white border-sky-700 shadow-md ring-2 ring-sky-400/40 animate-pulse'
                  : 'bg-slate-50 border-slate-200/80 text-slate-800'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold">2B. book_appoint</span>
                  <span className="text-[10px] font-mono opacity-80">Node (MySQL)</span>
                </div>
                <p className="text-[11px] opacity-90 mt-0.5">Inserts patient appointment record into MySQL database</p>
              </div>

              {/* send_mail Node (RequestInput) */}
              <div className={`p-3 rounded-2xl border transition-all ${
                activeNode === 'send_mail'
                  ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-300 animate-bounce'
                  : 'bg-amber-50/60 border-amber-200 text-amber-950'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold">3. send_mail</span>
                    <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded uppercase">
                      RequestInput
                    </span>
                  </div>
                  <PauseCircle className="w-4 h-4 text-amber-700" />
                </div>
                <p className="text-[11px] opacity-90 mt-0.5">Triggers human-in-the-loop pause before sending email</p>
              </div>

            </div>
          </div>

          {/* Execution Log Terminal */}
          <div className="p-5 rounded-3xl bg-slate-900 text-slate-100 border border-slate-800 shadow-xl shadow-cyan-950/10 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                <Terminal className="w-4 h-4" />
                ADK 2.0 Execution Logs
              </span>
              <button
                onClick={() => setExecutionLogs([])}
                className="text-[10px] text-slate-400 hover:text-slate-200 underline"
              >
                Clear Logs
              </button>
            </div>

            <div className="h-44 overflow-y-auto space-y-2 pr-1 text-[11px] leading-relaxed">
              {executionLogs.length === 0 ? (
                <p className="text-slate-500 italic">No execution logs yet. Send a query to observe ADK 2.0 graph events.</p>
              ) : (
                executionLogs.map((log, index) => (
                  <div key={index} className="space-y-0.5 border-b border-slate-800/60 pb-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span className={`font-bold ${
                        log.type === 'success' ? 'text-emerald-400' :
                        log.type === 'pause' ? 'text-amber-400 font-mono underline' : 'text-cyan-400'
                      }`}>
                        Node: {log.node}
                      </span>
                    </div>
                    <p className={log.type === 'pause' ? 'text-amber-200 font-semibold' : 'text-slate-300'}>
                      {log.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

      {/* Human In The Loop Pause Modal */}
      <HumanInTheLoopModal
        isOpen={isModalOpen}
        appointment={pausedAppt}
        emailDraft={emailDraft}
        onApprove={handleApproveHumanInput}
        onReject={handleRejectHumanInput}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};
