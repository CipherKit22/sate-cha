import React, { useState, useEffect } from 'react';
import { History, Search, Filter, Download, Trash2, Calendar, MessageSquare, Bot, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  user_message: string;
  bot_response: string;
  timestamp: string;
  context_used?: boolean;
}

interface ChatSession {
  id: string;
  messages: ChatMessage[];
  startTime: string;
  endTime: string;
  messageCount: number;
}

const ChatHistory: React.FC = () => {
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedSession, setSelectedSession] = useState<ChatSession | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const fetchChatHistory = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to fetch chat history
      // In a real app, this would fetch from the backend
      const mockSessions: ChatSession[] = [
        {
          id: '1',
          startTime: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          endTime: new Date(Date.now() - 86300000).toISOString(),
          messageCount: 5,
          messages: [
            {
              id: '1',
              user_message: 'Hello, how can you help me?',
              bot_response: 'Hello! I\'m your AI assistant. I can help you with various questions and tasks. What would you like to know?',
              timestamp: new Date(Date.now() - 86400000).toISOString(),
              context_used: false
            },
            {
              id: '2',
              user_message: 'What is artificial intelligence?',
              bot_response: 'Artificial Intelligence (AI) is a branch of computer science that aims to create intelligent machines that can perform tasks that typically require human intelligence, such as learning, reasoning, problem-solving, and understanding language.',
              timestamp: new Date(Date.now() - 86350000).toISOString(),
              context_used: true
            }
          ]
        },
        {
          id: '2',
          startTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          endTime: new Date(Date.now() - 172700000).toISOString(),
          messageCount: 3,
          messages: [
            {
              id: '3',
              user_message: 'Can you explain machine learning?',
              bot_response: 'Machine Learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. It uses algorithms to analyze data, identify patterns, and make predictions or decisions.',
              timestamp: new Date(Date.now() - 172800000).toISOString(),
              context_used: true
            }
          ]
        }
      ];
      setChatSessions(mockSessions);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSessions = chatSessions.filter(session => {
    const matchesSearch = searchTerm === '' || 
      session.messages.some(msg => 
        msg.user_message.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.bot_response.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesDate = filterDate === '' || 
      new Date(session.startTime).toDateString() === new Date(filterDate).toDateString();
    
    return matchesSearch && matchesDate;
  });

  const exportChatHistory = () => {
    const dataStr = JSON.stringify(chatSessions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `chat-history-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const clearAllHistory = async () => {
    if (confirm('Are you sure you want to delete all chat history? This action cannot be undone.')) {
      try {
        // In a real app, this would call the API to clear history
        setChatSessions([]);
        setSelectedSession(null);
        alert('Chat history cleared successfully!');
      } catch (error) {
        console.error('Error clearing chat history:', error);
        alert('Failed to clear chat history. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatDuration = (start: string, end: string) => {
    const duration = new Date(end).getTime() - new Date(start).getTime();
    const minutes = Math.floor(duration / 60000);
    const seconds = Math.floor((duration % 60000) / 1000);
    return `${minutes}m ${seconds}s`;
  };

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <History className="w-6 h-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900">Chat History</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={exportChatHistory}
              className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button
              onClick={clearAllHistory}
              className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar - Chat Sessions List */}
        <div className="w-1/3 bg-white shadow-sm border-r">
          {/* Search and Filter */}
          <div className="p-4 border-b">
            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div className="relative">
              <Calendar className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Sessions List */}
          <div className="overflow-y-auto h-full">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              </div>
            ) : filteredSessions.length === 0 ? (
              <div className="text-center p-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No chat history found</p>
              </div>
            ) : (
              filteredSessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => setSelectedSession(session)}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedSession?.id === session.id ? 'bg-primary-50 border-primary-200' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-medium text-gray-900">
                      Session {session.id}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDuration(session.startTime, session.endTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {session.messages[0]?.user_message.substring(0, 50)}...
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>{formatDate(session.startTime)}</span>
                    <span>{session.messageCount} messages</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Main Content - Chat Messages */}
        <div className="flex-1 flex flex-col">
          {selectedSession ? (
            <>
              {/* Session Header */}
              <div className="bg-white border-b p-4">
                <h3 className="font-semibold text-gray-900">Session {selectedSession.id}</h3>
                <p className="text-sm text-gray-600">
                  {formatDate(selectedSession.startTime)} - {formatDate(selectedSession.endTime)}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedSession.messages.map((message) => (
                  <div key={message.id} className="space-y-4">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                        <div className="bg-primary-500 text-white px-4 py-2 rounded-lg">
                          <p className="text-sm">{message.user_message}</p>
                          <p className="text-xs mt-1 opacity-70">
                            {formatDate(message.timestamp)}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                          <User className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                        <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
                          <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                          <p className="text-sm">{message.bot_response}</p>
                          <div className="flex items-center justify-between mt-1">
                            <p className="text-xs opacity-70">
                              {formatDate(message.timestamp)}
                            </p>
                            {message.context_used && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                Context Used
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Chat Session</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to view its details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
