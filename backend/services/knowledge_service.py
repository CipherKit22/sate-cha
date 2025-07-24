from typing import List, Dict, Optional, Tuple
from config.database import supabase_config
from services.nlp_service import nlp_service
from services.training_service import training_service
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
        """Retrieve all knowledge items from database and training data."""
        all_knowledge = []

        # 1. Get knowledge from Supabase
        try:
            result = self.supabase.table('knowledge_base').select('*').order('created_at', desc=True).execute()
            if result.data:
                all_knowledge.extend(result.data)
        except Exception as e:
            print(f"Warning: Could not fetch knowledge from Supabase: {e}")
            # Add sample data if Supabase fails
            all_knowledge.append({
                'id': 'db_fallback_1',
                'title': 'Sample Knowledge',
                'content': 'This is a sample knowledge base entry for demonstration purposes when the database is unavailable.',
                'created_at': datetime.utcnow().isoformat()
            })

        # 2. Get cybersecurity knowledge from training_service
        cyber_knowledge = training_service.get_all_cybersecurity_knowledge()
        if cyber_knowledge:
            # Ensure the format is consistent
            for item in cyber_knowledge:
                item['source'] = 'cybersecurity_training'
            all_knowledge.extend(cyber_knowledge)

        # 3. Get team information and format it as a knowledge item
        team_info = training_service.get_team_information()
        if team_info and 'team' in team_info:
            team_data = team_info['team']
            team_content_parts = [
                f"The project was created by Team {team_data.get('name', 'N/A')}.",
                team_data.get('description', ''),
                f"The team members are: {', '.join([member['name'] for member in team_data.get('members', [])])}.",
                f"All members are students of {team_data.get('field_of_study', 'N/A')} at {team_data.get('university', 'N/A')}."
            ]
            team_content = " ".join(filter(None, team_content_parts))
            
            team_knowledge_item = {
                'id': 'team_info_001',
                'title': 'About the Development Team',
                'content': team_content,
                'source': 'team_information',
                'created_at': datetime.utcnow().isoformat()
            }
            all_knowledge.append(team_knowledge_item)

        return all_knowledge
    
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
            
            final_context = "\n\n".join(context_parts)
            print(f"--- [Knowledge Service] Retrieved Context ---")
            print(final_context)
            print("-------------------------------------------")
            return final_context
            
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
