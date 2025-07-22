from flask import Flask, jsonify
from flask_cors import CORS
from routes.api import api_bp
from config.database import supabase_config
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Enable CORS for all routes
    CORS(app, origins=['http://localhost:3000'])
    
    # Configuration
    app.config['DEBUG'] = os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    
    # Initialize database
    try:
        supabase_config.create_tables()
        print("Database connection established")
    except Exception as e:
        print(f"Warning: Database connection failed: {e}")
        print("Application will continue with limited functionality")
    
    # Register blueprints
    app.register_blueprint(api_bp, url_prefix='/api')
    
    # Root route
    @app.route('/')
    def index():
        return jsonify({
            'message': 'Chatbot API Server',
            'version': '1.0.0',
            'status': 'running'
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'error': 'Endpoint not found'
        }), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({
            'success': False,
            'error': 'Internal server error'
        }), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    print("Starting Chatbot API Server...")
    print("Frontend should be running on: http://localhost:3000")
    print("API Server running on: http://localhost:5000")
    print("API Documentation available at: http://localhost:5000/api/health")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=os.getenv('FLASK_DEBUG', 'True').lower() == 'true'
    )
