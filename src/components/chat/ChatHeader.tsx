import React from 'react';
import { Smile, Minus, X, RefreshCw, Bot } from 'lucide-react';

interface ChatHeaderProps {
  onMinimize: () => void;
  onClose: () => void;
  onResetSession: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  onMinimize,
  onClose,
  onResetSession,
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-sky-600 text-white px-4 py-3.5 rounded-t-2xl flex items-center justify-between shadow-md relative z-10">
      
      {/* Clinic & Agent Identity */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-inner">
            <Bot className="w-5 h-5 stroke-[2.2]" />
          </div>
          {/* Online Pulsing Indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-blue-700 shadow-sm animate-pulse" />
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-sm tracking-tight text-white">
              SmileSync AI Assistant
            </h3>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-white/20 text-sky-100 backdrop-blur-sm">
              ADK 2.0
            </span>
          </div>
          <p className="text-[11px] text-blue-100/90 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
            Online • Ready to assist
          </p>
        </div>
      </div>

      {/* Action Buttons: Reset, Minimize, Close */}
      <div className="flex items-center gap-1">
        <button
          onClick={onResetSession}
          title="Reset conversation session"
          aria-label="Reset conversation"
          className="p-1.5 rounded-lg hover:bg-white/15 text-blue-100 hover:text-white transition-colors duration-150"
        >
          <RefreshCw className="w-4 h-4" />
        </button>

        <button
          onClick={onMinimize}
          title="Minimize chat"
          aria-label="Minimize chat window"
          className="p-1.5 rounded-lg hover:bg-white/15 text-blue-100 hover:text-white transition-colors duration-150"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          onClick={onClose}
          title="Close chat"
          aria-label="Close chat window"
          className="p-1.5 rounded-lg hover:bg-white/15 text-blue-100 hover:text-white transition-colors duration-150"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
