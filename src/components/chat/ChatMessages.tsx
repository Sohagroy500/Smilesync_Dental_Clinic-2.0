import React, { useEffect, useRef } from 'react';
import { Bot, Sparkles, Smile, ShieldCheck } from 'lucide-react';
import { ChatMessage } from '../../types';
import { ChatBubble } from './ChatBubble';
import { TypingIndicator } from './TypingIndicator';

interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isLoading,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages update or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2 flex flex-col bg-slate-50/50 dark:bg-slate-950/50 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
      
      {/* Welcome Card banner if only welcome message or start */}
      {messages.length <= 1 && (
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-sky-50/40 to-teal-50/50 dark:from-slate-900/80 dark:via-slate-800/60 dark:to-slate-900/90 border border-blue-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 shadow-sm animate-fade-in">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <Smile className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs tracking-tight text-slate-900 dark:text-white">
                SmileSync Dental Reception
              </h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
                Powered by Google ADK 2.0 & Gemini 3.6 Flash
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Ask about treatments, pricing, opening hours, or schedule an appointment instantly.
          </p>
        </div>
      )}

      {/* Render All Conversation Messages */}
      {messages.map((msg) => (
        <ChatBubble key={msg.id} message={msg} />
      ))}

      {/* Render Typing Indicator when AI is generating response */}
      {isLoading && <TypingIndicator />}

      {/* Invisible element for auto-scrolling */}
      <div ref={bottomRef} />

    </div>
  );
};
