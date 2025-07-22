import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseConfig:
    def __init__(self):
        self.url = os.getenv('SUPABASE_URL')
        self.key = os.getenv('SUPABASE_KEY')
        self.client = None
        
    def get_client(self) -> Client:
        if not self.client:
            self.client = create_client(self.url, self.key)
        return self.client
    
    def create_tables(self):
        """Create necessary tables if they don't exist"""
        client = self.get_client()
        
        # Create knowledge_base table
        try:
            client.table('knowledge_base').select('*').limit(1).execute()
        except Exception:
            # Table doesn't exist, create it
            print("Creating knowledge_base table...")
            # Note: In a real scenario, you'd create this table via Supabase dashboard
            # or use SQL migrations. This is just for reference.
            pass
        
        # Create chat_history table
        try:
            client.table('chat_history').select('*').limit(1).execute()
        except Exception:
            print("Creating chat_history table...")
            pass

supabase_config = SupabaseConfig()
