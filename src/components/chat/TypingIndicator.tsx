import React from 'react';
import { Bot } from 'lucide-react';

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-end gap-2 my-2.5 animate-fade-in">
      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm text-xs font-bold">
        <Bot className="w-4 h-4 stroke-[2.2]" />
      </div>

      <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
      </div>
    </div>
  );
};
