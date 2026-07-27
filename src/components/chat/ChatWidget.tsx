import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChatMessage } from '../../types';
import { sendChatMessage } from '../../services/apiService';
import { ChatButton } from './ChatButton';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { QuickActions } from './QuickActions';
import { MessageInput } from './MessageInput';

const INITIAL_WELCOME_TEXT = `Hello 👋

Welcome to SmileSync Dental Clinic.

I'm your AI assistant.

I can help you:
• Answer clinic questions
• Book an appointment
• Explain our dental services
• Share clinic information

How can I help you today?`;

export const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // Initialize or restore session_id and chat history from sessionStorage
  useEffect(() => {
    let existingSessionId = sessionStorage.getItem('smilesync_chat_session_id');
    if (!existingSessionId) {
      existingSessionId = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      sessionStorage.setItem('smilesync_chat_session_id', existingSessionId);
    }
    setSessionId(existingSessionId);

    // Restore saved messages or load initial welcome message
    const savedMessages = sessionStorage.getItem('smilesync_chat_history');
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch (e) {
        console.error('Failed to parse saved chat history:', e);
      }
    }

    // Default Initial Welcome Message
    const initialMsg: ChatMessage = {
      id: 'welcome-msg',
      sender: 'ai',
      text: INITIAL_WELCOME_TEXT,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: 'question',
    };
    setMessages([initialMsg]);
    sessionStorage.setItem('smilesync_chat_history', JSON.stringify([initialMsg]));
  }, []);

  // Sync messages to sessionStorage whenever updated
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('smilesync_chat_history', JSON.stringify(messages));
    }
  }, [messages]);

  // Open / Close / Minimize Toggles
  const handleToggleOpen = () => {
    if (!isOpen) {
      setIsOpen(true);
      setIsMinimized(false);
      setUnreadCount(0);
    } else if (isMinimized) {
      setIsMinimized(false);
      setUnreadCount(0);
    } else {
      setIsOpen(false);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  // Reset Session
  const handleResetSession = () => {
    const newSid = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('smilesync_chat_session_id', newSid);
    setSessionId(newSid);

    const initialMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'ai',
      text: INITIAL_WELCOME_TEXT,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      intent: 'question',
    };
    setMessages([initialMsg]);
    sessionStorage.setItem('smilesync_chat_history', JSON.stringify([initialMsg]));
  };

  // Handle Sending a Message
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: timeStr,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(sessionId, text);

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        intent: response.intent,
        appointment_id: response.appointment_id,
        request_input: response.request_input,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (isMinimized || !isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Error receiving AI reply:', err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: 'I am sorry, I am having trouble reaching our clinic service. Please try again or call our reception desk directly.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <ChatButton
        isOpen={isOpen && !isMinimized}
        onClick={handleToggleOpen}
        unreadCount={unreadCount}
      />

      {/* Floating Chat Window Modal */}
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.92 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[400px] h-[550px] max-h-[82vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-blue-900/20 border border-slate-200/80 dark:border-slate-800 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <ChatHeader
              onMinimize={handleMinimize}
              onClose={handleClose}
              onResetSession={handleResetSession}
            />

            {/* Messages Body */}
            <ChatMessages messages={messages} isLoading={isLoading} />

            {/* Suggested Quick Actions */}
            <QuickActions
              onSelectAction={handleSendMessage}
              disabled={isLoading}
            />

            {/* Input Footer */}
            <MessageInput
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
