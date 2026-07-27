import React from 'react';
import { Bot, User, CheckCircle2, Calendar } from 'lucide-react';
import { ChatMessage } from '../../types';

interface ChatBubbleProps {
  message: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  // Format line breaks and bold markers like **text**
  const renderFormattedText = (text: string) => {
    return text.split('\n').map((line, idx) => {
      // Replace **text** with bold tags
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
          {parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={pIdx} className="font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            return part;
          })}
        </p>
      );
    });
  };

  return (
    <div
      className={`flex items-end gap-2.5 my-2.5 ${
        isUser ? 'flex-row-reverse self-end' : 'flex-row self-start'
      } max-w-[88%] sm:max-w-[82%] animate-fade-in`}
    >
      {/* Avatar */}
      <div
        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 shadow-sm text-xs font-bold ${
          isUser
            ? 'bg-slate-700 dark:bg-slate-600 text-white'
            : 'bg-gradient-to-tr from-blue-600 via-sky-500 to-teal-400 text-white'
        }`}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 stroke-[2.2]" />}
      </div>

      {/* Bubble Container */}
      <div className="flex flex-col gap-1">
        <div
          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm transition-all ${
            isUser
              ? 'bg-[#2563EB] text-white rounded-br-none font-medium'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200/80 dark:border-slate-700/60'
          }`}
        >
          {/* Main Text Content */}
          {renderFormattedText(message.text)}

          {/* Appointment ID Badge if present */}
          {message.appointment_id && (
            <div className="mt-2.5 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 flex items-center gap-2 font-semibold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>
                Confirmed Ref: <strong>{message.appointment_id}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <span
          className={`text-[10px] text-slate-400 font-medium px-1 ${
            isUser ? 'text-right' : 'text-left'
          }`}
        >
          {message.timestamp}
        </span>
      </div>
    </div>
  );
};
