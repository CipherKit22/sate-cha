export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  success: boolean;
  error?: string;
}

export interface KnowledgeBase {
  id: string;
  title: string;
  content: string;
  created_at: string;
}
