import React, { useState, useRef, useEffect } from 'react';
import { Send, CornerDownLeft } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  isLoading,
}) => {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 110)}px`;
    }
  }, [text]);

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-2xl">
      <div className="relative flex items-end gap-2 bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-1.5 border border-slate-200/80 dark:border-slate-700/60 focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or book an appointment..."
          rows={1}
          disabled={isLoading}
          className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none resize-none max-h-28 overflow-y-auto font-sans"
        />

        <button
          onClick={handleSend}
          disabled={isLoading || !text.trim()}
          aria-label="Send message"
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 ${
            text.trim() && !isLoading
              ? 'bg-[#2563EB] hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 active:scale-95'
              : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
          }`}
        >
          <Send className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      <div className="flex items-center justify-between px-2 pt-1.5 text-[10px] text-slate-400 font-medium">
        <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for line break</span>
        <span className="hidden sm:inline">SmileSync ADK 2.0 Agent</span>
      </div>
    </div>
  );
};
