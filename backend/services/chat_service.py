from typing import Dict, List, Optional
from services.deepseek_service import deepseek_service
from services.knowledge_service import knowledge_service
from services.nlp_service import nlp_service
from config.database import supabase_config
import uuid
from datetime import datetime

class ChatService:
    def __init__(self):
        self.supabase = supabase_config.get_client()
    
    def process_message(self, message: str, user_id: str = "anonymous") -> Dict:
        """Process incoming chat message and generate response"""
        try:
            # Analyze user intent
            intent = nlp_service.analyze_intent(message)
            
            # Get relevant context from knowledge base
            context = knowledge_service.get_relevant_context(message)
            
            # Generate response using DeepSeek API with context
            response = deepseek_service.generate_response(message, context)
            
            # Save chat history
            self._save_chat_history(user_id, message, response)
            
            return {
                'message': response,
                'success': True,
                'intent': intent,
                'context_used': bool(context)
            }
            
        except Exception as e:
            print(f"Error processing message: {e}")
            return {
                'message': 'Sorry, I encountered an error processing your message. Please try again.',
                'success': False,
                'error': str(e)
            }
    
    def _save_chat_history(self, user_id: str, user_message: str, bot_response: str):
        """Save chat conversation to database"""
        try:
            chat_entry = {
                'id': str(uuid.uuid4()),
                'user_id': user_id,
                'user_message': user_message,
                'bot_response': bot_response,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            self.supabase.table('chat_history').insert(chat_entry).execute()
            
        except Exception as e:
            print(f"Error saving chat history: {e}")
            # Continue without saving if database is unavailable
            pass
    
    def get_chat_history(self, user_id: str, limit: int = 50) -> List[Dict]:
        """Retrieve chat history for a user"""
        try:
            result = self.supabase.table('chat_history')\
                .select('*')\
                .eq('user_id', user_id)\
                .order('timestamp', desc=True)\
                .limit(limit)\
                .execute()
            
            return result.data if result.data else []
            
        except Exception as e:
            print(f"Error fetching chat history: {e}")
            return []
    
    def clear_chat_history(self, user_id: str) -> bool:
        """Clear chat history for a user"""
        try:
            result = self.supabase.table('chat_history')\
                .delete()\
                .eq('user_id', user_id)\
                .execute()
            
            return True
            
        except Exception as e:
            print(f"Error clearing chat history: {e}")
            return False

chat_service = ChatService()
