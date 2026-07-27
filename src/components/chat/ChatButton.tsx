import React from 'react';
import { Bot, Sparkles, X } from 'lucide-react';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export const ChatButton: React.FC<ChatButtonProps> = ({
  isOpen,
  onClick,
  unreadCount = 0,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Floating Tooltip Pill when closed */}
      {!isOpen && (
        <div className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900/90 dark:bg-slate-800/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md border border-slate-700/50 animate-fade-in pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>Need help? Chat with us</span>
        </div>
      )}

      {/* Main Circular Floating Trigger */}
      <button
        onClick={onClick}
        aria-label={isOpen ? 'Close Chatbot' : 'Open SmileSync AI Chatbot'}
        className={`group relative w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-600/30 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400/50 ${
          isOpen
            ? 'bg-slate-800 hover:bg-slate-700'
            : 'bg-[#2563EB] hover:bg-blue-700'
        }`}
      >
        {/* Pulsing Aura Ring when idle */}
        {!isOpen && (
          <span className="absolute -inset-1 rounded-full bg-blue-500/30 animate-ping duration-1000 pointer-events-none" />
        )}

        {/* Icon Toggle */}
        <div className="relative z-10">
          {isOpen ? (
            <X className="w-6 h-6 stroke-[2.5] transition-transform duration-300 group-hover:rotate-90" />
          ) : (
            <Bot className="w-7 h-7 stroke-[2.2] transition-transform duration-300 group-hover:scale-110" />
          )}
        </div>

        {/* Notification Badge if unread */}
        {!isOpen && unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900 animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
