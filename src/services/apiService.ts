import { ChatResponse } from '../types';

/**
 * Communicates with the Google ADK 2.0 backend endpoint (POST /api/chat)
 */
export async function sendChatMessage(
  sessionId: string,
  message: string
): Promise<ChatResponse> {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: sessionId,
        message: message.trim(),
      }),
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data: ChatResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Failed to send chat message:', error);
    return {
      reply: 'Sorry, I encountered a network error connecting to our clinic server. Please check your connection and try again.',
      intent: 'question',
      request_input: false,
      error: error.message || 'Network Error',
    };
  }
}
