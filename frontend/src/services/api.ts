import axios from 'axios';
import { ChatResponse, KnowledgeBase } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const chatService = {
  sendMessage: async (message: string): Promise<ChatResponse> => {
    try {
      const response = await api.post('/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },

  getKnowledgeBase: async (): Promise<KnowledgeBase[]> => {
    try {
      const response = await api.get('/knowledge');
      return response.data;
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
      throw error;
    }
  },

  addKnowledge: async (title: string, content: string): Promise<KnowledgeBase> => {
    try {
      const response = await api.post('/knowledge', { title, content });
      return response.data;
    } catch (error) {
      console.error('Error adding knowledge:', error);
      throw error;
    }
  },
};
