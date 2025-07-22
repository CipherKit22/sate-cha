# AI Chatbot with Custom Knowledge Base

A modern chatbot application built with React/TypeScript frontend and Python/Flask backend, featuring custom knowledge base integration and DeepSeek API support.

## Features

- 🤖 **AI-Powered Chat**: Integration with DeepSeek API for intelligent responses
- 📚 **Custom Knowledge Base**: Add and manage your own knowledge data
- 🔍 **Smart Search**: NLP-powered semantic search through knowledge base
- 💾 **Persistent Storage**: Supabase integration for data persistence
- 🎨 **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- 📱 **Real-time Chat**: Smooth chat experience with typing indicators

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Axios for API communication
- Lucide React for icons

### Backend
- Python Flask API
- Natural Language Processing (NLTK, scikit-learn)
- Sentence Transformers for semantic similarity
- Supabase for database
- DeepSeek API integration

## Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Python 3.8+
- DeepSeek API key (optional - fallback responses available)

### 1. Setup Backend

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file:
```env
# Supabase Configuration (already configured)
SUPABASE_URL=https://rapbqfseaeeuzyvuoqjj.supabase.co
SUPABASE_KEY=your_supabase_key_here

# DeepSeek API Configuration
DEEPSEEK_API_KEY=your_deepseek_api_key_here
DEEPSEEK_BASE_URL=https://api.deepseek.com

# Flask Configuration
FLASK_ENV=development
FLASK_DEBUG=True
```

### 3. Setup Frontend

```bash
cd frontend
npm install
```

### 4. Run the Application

**Start Backend (Terminal 1):**
```bash
cd backend
python app.py
```

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### Chat Interface
1. Navigate to the Chat tab
2. Type your message and press Enter
3. The bot will respond using DeepSeek API and custom knowledge

### Knowledge Base Management
1. Navigate to the Knowledge Base tab
2. Click "Add" to create new knowledge entries
3. Add title and content for your knowledge items
4. The system will automatically use this knowledge to enhance chat responses

## API Endpoints

### Chat
- `POST /api/chat` - Send chat message
- `GET /api/chat/history/{user_id}` - Get chat history
- `DELETE /api/chat/history/{user_id}` - Clear chat history

### Knowledge Base
- `GET /api/knowledge` - Get all knowledge items
- `POST /api/knowledge` - Add new knowledge item
- `DELETE /api/knowledge/{id}` - Delete knowledge item
- `POST /api/knowledge/search` - Search knowledge base

### Health
- `GET /api/health` - Health check

## Configuration

### DeepSeek API
To use DeepSeek API, you need to:
1. Sign up at DeepSeek platform
2. Get your API key
3. Update `DEEPSEEK_API_KEY` in `.env` file

**Note**: The application works without DeepSeek API using intelligent fallback responses.

### Supabase Database
The application is pre-configured with Supabase. To use your own database:
1. Create a Supabase project
2. Update `SUPABASE_URL` and `SUPABASE_KEY` in `.env`
3. Create the following tables:

```sql
-- Knowledge Base Table
CREATE TABLE knowledge_base (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat History Table
CREATE TABLE chat_history (
    id UUID PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_message TEXT NOT NULL,
    bot_response TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Development

### Project Structure
```
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API services
│   │   ├── types/          # TypeScript types
│   │   └── App.tsx         # Main app component
│   └── package.json
├── backend/                 # Python Flask backend
│   ├── config/             # Configuration files
│   ├── routes/             # API routes
│   ├── services/           # Business logic services
│   ├── app.py             # Main Flask application
│   └── requirements.txt
└── README.md
```

### Adding New Features
1. **Frontend**: Add components in `frontend/src/components/`
2. **Backend**: Add services in `backend/services/` and routes in `backend/routes/`
3. **API**: Update `frontend/src/services/api.ts` for new endpoints

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure backend is running on port 5000
2. **API Connection**: Check if backend server is accessible at http://localhost:5000
3. **Database Errors**: Verify Supabase credentials in `.env` file
4. **DeepSeek API**: Check API key and ensure you have credits

### Logs
- Backend logs: Check terminal running `python app.py`
- Frontend logs: Check browser console (F12)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.
