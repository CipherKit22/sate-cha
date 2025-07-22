from flask import Blueprint, request, jsonify
from services.chat_service import chat_service
from services.knowledge_service import knowledge_service
from services.nlp_service import nlp_service

api_bp = Blueprint('api', __name__)

@api_bp.route('/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
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
        
        user_id = data.get('user_id', 'anonymous')
        
        # Process the message
        response = chat_service.process_message(message, user_id)
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500

@api_bp.route('/knowledge', methods=['GET'])
def get_knowledge():
    """Get all knowledge base items"""
    try:
        knowledge_items = knowledge_service.get_all_knowledge()
        return jsonify(knowledge_items)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error fetching knowledge: {str(e)}'
        }), 500

@api_bp.route('/knowledge', methods=['POST'])
def add_knowledge():
    """Add new knowledge item"""
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
        
        # Add knowledge item
        knowledge_item = knowledge_service.add_knowledge(title, content)
        
        return jsonify(knowledge_item), 201
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error adding knowledge: {str(e)}'
        }), 500

@api_bp.route('/knowledge/<knowledge_id>', methods=['DELETE'])
def delete_knowledge(knowledge_id):
    """Delete a knowledge item"""
    try:
        success = knowledge_service.delete_knowledge(knowledge_id)
        
        if success:
            return jsonify({'success': True, 'message': 'Knowledge item deleted'})
        else:
            return jsonify({
                'success': False,
                'error': 'Knowledge item not found or could not be deleted'
            }), 404
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error deleting knowledge: {str(e)}'
        }), 500

@api_bp.route('/knowledge/search', methods=['POST'])
def search_knowledge():
    """Search knowledge base"""
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
        
        limit = data.get('limit', 5)
        
        # Search knowledge base
        results = knowledge_service.search_knowledge(query, limit)
        
        # Format results
        formatted_results = [
            {
                'item': item,
                'similarity': similarity
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

@api_bp.route('/chat/history/<user_id>', methods=['GET'])
def get_chat_history(user_id):
    """Get chat history for a user"""
    try:
        limit = request.args.get('limit', 50, type=int)
        history = chat_service.get_chat_history(user_id, limit)
        
        return jsonify({
            'success': True,
            'history': history
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error fetching chat history: {str(e)}'
        }), 500

@api_bp.route('/chat/history/<user_id>', methods=['DELETE'])
def clear_chat_history(user_id):
    """Clear chat history for a user"""
    try:
        success = chat_service.clear_chat_history(user_id)
        
        if success:
            return jsonify({'success': True, 'message': 'Chat history cleared'})
        else:
            return jsonify({
                'success': False,
                'error': 'Could not clear chat history'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error clearing chat history: {str(e)}'
        }), 500

@api_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'Chatbot API is running'
    })
