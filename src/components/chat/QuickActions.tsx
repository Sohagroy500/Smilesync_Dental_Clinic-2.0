import React from 'react';
import { Calendar, Clock, Stethoscope, DollarSign, PhoneCall, AlertTriangle } from 'lucide-react';

interface QuickActionsProps {
  onSelectAction: (prompt: string) => void;
  disabled?: boolean;
}

const QUICK_PROMPTS = [
  {
    label: 'Book Appointment',
    prompt: 'I would like to book a dental appointment.',
    icon: Calendar,
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800',
  },
  {
    label: 'Clinic Hours',
    prompt: 'What are your clinic opening hours?',
    icon: Clock,
    color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800',
  },
  {
    label: 'Services',
    prompt: 'What dental services do you offer?',
    icon: Stethoscope,
    color: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100 dark:bg-sky-950/60 dark:text-sky-300 dark:border-sky-800',
  },
  {
    label: 'Pricing',
    prompt: 'Can you share pricing for treatments?',
    icon: DollarSign,
    color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800',
  },
  {
    label: 'Contact Us',
    prompt: 'What is your address and phone number?',
    icon: PhoneCall,
    color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800',
  },
  {
    label: 'Emergency Care',
    prompt: 'Do you offer emergency dental treatment?',
    icon: AlertTriangle,
    color: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800',
  },
];

export const QuickActions: React.FC<QuickActionsProps> = ({
  onSelectAction,
  disabled = false,
}) => {
  return (
    <div className="py-2 px-3 border-t border-slate-200/60 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
        {QUICK_PROMPTS.map((action, idx) => {
          const IconComp = action.icon;
          return (
            <button
              key={idx}
              onClick={() => onSelectAction(action.prompt)}
              disabled={disabled}
              className={`shrink-0 px-2.5 py-1.5 rounded-full border text-[11px] font-semibold flex items-center gap-1.5 transition-all duration-150 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${action.color}`}
            >
              <IconComp className="w-3.5 h-3.5 stroke-[2]" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
