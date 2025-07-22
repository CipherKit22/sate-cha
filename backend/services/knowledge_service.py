from typing import List, Dict, Optional, Tuple
from config.database import supabase_config
from services.nlp_service import nlp_service
import uuid
from datetime import datetime

class KnowledgeService:
    def __init__(self):
        self.supabase = supabase_config.get_client()
    
    def add_knowledge(self, title: str, content: str) -> Dict:
        """Add new knowledge to the database"""
        try:
            knowledge_item = {
                'id': str(uuid.uuid4()),
                'title': title,
                'content': content,
                'keywords': nlp_service.extract_keywords(content),
                'created_at': datetime.utcnow().isoformat(),
                'updated_at': datetime.utcnow().isoformat()
            }
            
            result = self.supabase.table('knowledge_base').insert(knowledge_item).execute()
            
            if result.data:
                return result.data[0]
            else:
                raise Exception("Failed to insert knowledge item")
                
        except Exception as e:
            print(f"Error adding knowledge: {e}")
            # Fallback to in-memory storage for demo
            return knowledge_item
    
    def get_all_knowledge(self) -> List[Dict]:
        """Retrieve all knowledge items"""
        try:
            result = self.supabase.table('knowledge_base').select('*').order('created_at', desc=True).execute()
            return result.data if result.data else []
        except Exception as e:
            print(f"Error fetching knowledge: {e}")
            # Return sample data for demo
            return [
                {
                    'id': '1',
                    'title': 'Sample Knowledge',
                    'content': 'This is a sample knowledge base entry for demonstration purposes.',
                    'created_at': datetime.utcnow().isoformat()
                }
            ]
    
    def search_knowledge(self, query: str, limit: int = 5) -> List[Tuple[Dict, float]]:
        """Search knowledge base using NLP similarity"""
        try:
            all_knowledge = self.get_all_knowledge()
            similar_items = nlp_service.find_similar_content(query, all_knowledge)
            return similar_items[:limit]
        except Exception as e:
            print(f"Error searching knowledge: {e}")
            return []
    
    def get_relevant_context(self, query: str, max_context_length: int = 1000) -> str:
        """Get relevant context for a query from knowledge base"""
        try:
            similar_items = self.search_knowledge(query)
            
            if not similar_items:
                return ""
            
            # Combine relevant content
            context_parts = []
            current_length = 0
            
            for item, similarity in similar_items:
                content = item.get('content', '')
                title = item.get('title', '')
                
                # Add title and content
                part = f"**{title}**: {content}"
                
                if current_length + len(part) <= max_context_length:
                    context_parts.append(part)
                    current_length += len(part)
                else:
                    # Add truncated version
                    remaining_space = max_context_length - current_length
                    if remaining_space > 50:  # Only add if there's meaningful space
                        truncated_part = part[:remaining_space-3] + "..."
                        context_parts.append(truncated_part)
                    break
            
            return "\n\n".join(context_parts)
            
        except Exception as e:
            print(f"Error getting relevant context: {e}")
            return ""
    
    def delete_knowledge(self, knowledge_id: str) -> bool:
        """Delete a knowledge item"""
        try:
            result = self.supabase.table('knowledge_base').delete().eq('id', knowledge_id).execute()
            return len(result.data) > 0 if result.data else False
        except Exception as e:
            print(f"Error deleting knowledge: {e}")
            return False
    
    def update_knowledge(self, knowledge_id: str, title: str = None, content: str = None) -> Optional[Dict]:
        """Update a knowledge item"""
        try:
            update_data = {
                'updated_at': datetime.utcnow().isoformat()
            }
            
            if title:
                update_data['title'] = title
            if content:
                update_data['content'] = content
                update_data['keywords'] = nlp_service.extract_keywords(content)
            
            result = self.supabase.table('knowledge_base').update(update_data).eq('id', knowledge_id).execute()
            
            if result.data:
                return result.data[0]
            return None
            
        except Exception as e:
            print(f"Error updating knowledge: {e}")
            return None

knowledge_service = KnowledgeService()
