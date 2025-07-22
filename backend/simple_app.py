from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import json
from datetime import datetime
import uuid
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

# In-memory storage for demo (replace with database in production)
knowledge_base = [
    {
        'id': '1',
        'title': 'Welcome to the Chatbot',
        'content': 'This is an AI chatbot with custom knowledge base integration. You can add your own knowledge and the bot will use it to answer questions.',
        'created_at': datetime.utcnow().isoformat()
    },
    {
        'id': '2',
        'title': 'How to use the chatbot',
        'content': 'Simply type your questions in the chat interface. The bot will search through the knowledge base and provide relevant answers using AI.',
        'created_at': datetime.utcnow().isoformat()
    }
]

chat_history = []

def simple_similarity_search(query, knowledge_items):
    """Simple keyword-based similarity search"""
    query_words = set(query.lower().split())
    results = []
    
    for item in knowledge_items:
        content_words = set(item['content'].lower().split())
        title_words = set(item['title'].lower().split())
        
        # Calculate simple overlap score
        content_overlap = len(query_words.intersection(content_words))
        title_overlap = len(query_words.intersection(title_words)) * 2  # Weight title matches more
        
        total_score = content_overlap + title_overlap
        if total_score > 0:
            results.append((item, total_score))
    
    # Sort by score descending
    results.sort(key=lambda x: x[1], reverse=True)
    return results[:3]  # Return top 3 matches

def call_deepseek_api(message, context=""):
    """Call DeepSeek API for intelligent responses"""
    api_key = os.getenv('DEEPSEEK_API_KEY')
    base_url = os.getenv('DEEPSEEK_BASE_URL', 'https://api.deepseek.com')
    
    if not api_key or api_key == 'your_deepseek_api_key_here':
        return None
    
    try:
        # Prepare the prompt with context
        system_prompt = "You are a helpful AI assistant. Use the provided context to answer questions accurately and helpfully."
        user_prompt = f"Context: {context}\n\nUser: {message}\n\nAssistant:" if context else f"User: {message}\n\nAssistant:"
        
        headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            "model": "deepseek-chat",
            "messages": [
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ],
            "max_tokens": 500,
            "temperature": 0.7
        }
        
        response = requests.post(
            f"{base_url}/v1/chat/completions",
            headers=headers,
            json=payload,
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            return result['choices'][0]['message']['content'].strip()
        else:
            print(f"DeepSeek API error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Error calling DeepSeek API: {str(e)}")
        return None

def generate_response(message, context=""):
    """Generate response using DeepSeek API or fallback to simple responses"""
    # Try DeepSeek API first
    deepseek_response = call_deepseek_api(message, context)
    if deepseek_response:
        return deepseek_response
    
    # Fallback to simple responses
    message_lower = message.lower()
    
    # Simple response patterns
    if any(word in message_lower for word in ['hello', 'hi', 'hey']):
        return "Hello! I'm your AI assistant. How can I help you today?"
    
    elif any(word in message_lower for word in ['thank', 'thanks']):
        return "You're welcome! Is there anything else I can help you with?"
    
    elif any(word in message_lower for word in ['how are you', 'how do you do']):
        return "I'm doing well, thank you for asking! I'm here to help you with any questions you have."
    
    elif context:
        return f"Based on what I know: {context[:300]}... Feel free to ask more specific questions about this topic!"
    
    elif any(word in message_lower for word in ['what', 'how', 'why', 'when', 'where', 'who']):
        return "That's an interesting question! I'd be happy to help, but I don't have specific information about that topic in my knowledge base yet. You can add relevant information in the Knowledge Base tab."
    
    else:
        return "I understand you're asking about something. Could you provide more details or check if there's relevant information in the Knowledge Base that I can help you with?"

@app.route('/')
def index():
    return jsonify({
        'message': 'Chatbot API Server',
        'version': '1.0.0',
        'status': 'running'
    })

@app.route('/api/health')
def health():
    return jsonify({
        'status': 'healthy',
        'message': 'Chatbot API is running'
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        
        if not data or 'message' not in data:
            return jsonify({
                'success': False,
                'error': 'Message is required'
            }), 400
        
        message = data['message'].strip()
        if not message:
            return jsonify({
                'success': False,
                'error': 'Message cannot be empty'
            }), 400
        
        # Search for relevant knowledge
        similar_items = simple_similarity_search(message, knowledge_base)
        
        # Build context from similar items
        context = ""
        if similar_items:
            context_parts = []
            for item, score in similar_items:
                context_parts.append(f"{item['title']}: {item['content']}")
            context = " | ".join(context_parts)
        
        # Generate response
        response_text = generate_response(message, context)
        
        # Save to chat history
        chat_entry = {
            'id': str(uuid.uuid4()),
            'user_message': message,
            'bot_response': response_text,
            'timestamp': datetime.utcnow().isoformat(),
            'context_used': bool(context)
        }
        chat_history.append(chat_entry)
        
        return jsonify({
            'message': response_text,
            'success': True,
            'context_used': bool(context)
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.route('/api/knowledge', methods=['GET'])
def get_knowledge():
    return jsonify(knowledge_base)

@app.route('/api/knowledge', methods=['POST'])
def add_knowledge():
    try:
        data = request.get_json()
        
        if not data or 'title' not in data or 'content' not in data:
            return jsonify({
                'success': False,
                'error': 'Title and content are required'
            }), 400
        
        title = data['title'].strip()
        content = data['content'].strip()
        
        if not title or not content:
            return jsonify({
                'success': False,
                'error': 'Title and content cannot be empty'
            }), 400
        
        # Add new knowledge item
        knowledge_item = {
            'id': str(uuid.uuid4()),
            'title': title,
            'content': content,
            'created_at': datetime.utcnow().isoformat()
        }
        
        knowledge_base.append(knowledge_item)
        
        return jsonify(knowledge_item), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error adding knowledge: {str(e)}'
        }), 500

@app.route('/api/knowledge/<knowledge_id>', methods=['DELETE'])
def delete_knowledge(knowledge_id):
    try:
        global knowledge_base
        knowledge_base = [item for item in knowledge_base if item['id'] != knowledge_id]
        
        return jsonify({'success': True, 'message': 'Knowledge item deleted'})
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error deleting knowledge: {str(e)}'
        }), 500

@app.route('/api/knowledge/search', methods=['POST'])
def search_knowledge():
    try:
        data = request.get_json()
        
        if not data or 'query' not in data:
            return jsonify({
                'success': False,
                'error': 'Query is required'
            }), 400
        
        query = data['query'].strip()
        if not query:
            return jsonify({
                'success': False,
                'error': 'Query cannot be empty'
            }), 400
        
        # Search knowledge base
        results = simple_similarity_search(query, knowledge_base)
        
        # Format results
        formatted_results = [
            {
                'item': item,
                'similarity': similarity / 10.0  # Normalize score
            }
            for item, similarity in results
        ]
        
        return jsonify({
            'success': True,
            'results': formatted_results
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error searching knowledge: {str(e)}'
        }), 500

if __name__ == '__main__':
    print("Starting Simple Chatbot API Server...")
    print("Frontend should be running on: http://localhost:3000")
    print("API Server running on: http://localhost:5000")
    print("API Health check: http://localhost:5000/api/health")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
