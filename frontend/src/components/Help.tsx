import React, { useState } from 'react';
import { HelpCircle, Book, MessageSquare, Settings, Database, Zap, Shield, Search } from 'lucide-react';

const Help: React.FC = () => {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [searchTerm, setSearchTerm] = useState('');

  const helpSections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: <Zap className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Welcome to AI Chatbot</h3>
          <p className="text-gray-600">
            This AI-powered chatbot uses advanced natural language processing to provide intelligent responses 
            and can be enhanced with your custom knowledge base.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">Quick Start Guide:</h4>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Navigate to the Chat tab to start a conversation</li>
              <li>Add your knowledge in the Knowledge Base tab</li>
              <li>Configure settings in the Settings tab</li>
              <li>View analytics in the Dashboard tab</li>
              <li>Check conversation history in the History tab</li>
            </ol>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <MessageSquare className="w-8 h-8 text-primary-500 mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Start Chatting</h4>
              <p className="text-sm text-gray-600">
                Begin conversations with the AI assistant. Ask questions, request help, or have natural conversations.
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <Database className="w-8 h-8 text-green-500 mb-2" />
              <h4 className="font-semibold text-gray-900 mb-2">Add Knowledge</h4>
              <p className="text-sm text-gray-600">
                Enhance the bot's capabilities by adding your own knowledge base entries for more accurate responses.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'chat-features',
      title: 'Chat Features',
      icon: <MessageSquare className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Chat Features</h3>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">AI-Powered Responses</h4>
              <p className="text-gray-600">
                The chatbot uses DeepSeek API to provide intelligent, context-aware responses to your questions.
              </p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-gray-900">Knowledge Integration</h4>
              <p className="text-gray-600">
                Responses are enhanced with information from your custom knowledge base when relevant.
              </p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-gray-900">Conversation History</h4>
              <p className="text-gray-600">
                All conversations are saved and can be reviewed in the Chat History section.
              </p>
            </div>
            
            <div className="border-l-4 border-orange-500 pl-4">
              <h4 className="font-semibold text-gray-900">Real-time Indicators</h4>
              <p className="text-gray-600">
                See typing indicators and response status to know when the bot is processing your message.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-900 mb-2">💡 Pro Tips:</h4>
            <ul className="list-disc list-inside space-y-1 text-yellow-800">
              <li>Be specific in your questions for better responses</li>
              <li>Add relevant knowledge to improve answer accuracy</li>
              <li>Use natural language - the AI understands context</li>
              <li>Check the knowledge base indicator to see if custom data was used</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'knowledge-base',
      title: 'Knowledge Base',
      icon: <Book className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Managing Your Knowledge Base</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Adding Knowledge</h4>
              <p className="text-gray-600 mb-3">
                To add new knowledge entries:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-gray-600 ml-4">
                <li>Navigate to the Knowledge Base tab</li>
                <li>Click the "Add" button</li>
                <li>Enter a descriptive title</li>
                <li>Add the content/information</li>
                <li>Click "Add Knowledge" to save</li>
              </ol>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
              <ul className="list-disc list-inside space-y-2 text-gray-600 ml-4">
                <li>Use clear, descriptive titles</li>
                <li>Keep content focused and well-organized</li>
                <li>Include relevant keywords</li>
                <li>Update information regularly</li>
                <li>Remove outdated entries</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">How It Works</h4>
              <p className="text-gray-600">
                When you ask a question, the system searches through your knowledge base to find relevant 
                information and includes it in the AI's response context, making answers more accurate and personalized.
              </p>
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">📚 Knowledge Examples:</h4>
            <div className="space-y-2 text-green-800">
              <p><strong>Company Info:</strong> About us, services, contact details</p>
              <p><strong>Product Details:</strong> Features, specifications, pricing</p>
              <p><strong>FAQ:</strong> Common questions and answers</p>
              <p><strong>Procedures:</strong> Step-by-step guides and processes</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'settings',
      title: 'Settings & Configuration',
      icon: <Settings className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Settings & Configuration</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">General Settings</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li><strong>Bot Name:</strong> Customize the chatbot's display name</li>
                <li><strong>Welcome Message:</strong> Set the initial greeting message</li>
                <li><strong>Response Length:</strong> Control maximum response length</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">API Configuration</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li><strong>DeepSeek API Key:</strong> Your API key for AI responses</li>
                <li><strong>Timeout Settings:</strong> API request timeout duration</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Appearance</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li><strong>Theme:</strong> Light, dark, or auto mode</li>
                <li><strong>Language:</strong> Interface language selection</li>
                <li><strong>Animations:</strong> Enable/disable UI animations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Privacy & Security</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600 ml-4">
                <li><strong>Save Conversations:</strong> Control chat history storage</li>
                <li><strong>Data Anonymization:</strong> Remove personal identifiers</li>
                <li><strong>Notifications:</strong> Manage alert preferences</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold text-red-900 mb-2">🔒 Security Note:</h4>
            <p className="text-red-800">
              Your API keys are encrypted and stored securely. Never share your API keys with others.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: <Shield className="w-5 h-5" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900">Troubleshooting</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Common Issues</h4>
              
              <div className="space-y-3">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-1">Bot not responding</h5>
                  <p className="text-sm text-gray-600 mb-2">Possible causes and solutions:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                    <li>Check your internet connection</li>
                    <li>Verify API key is correctly configured</li>
                    <li>Check if API service is available</li>
                    <li>Try refreshing the page</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-1">Knowledge base not working</h5>
                  <p className="text-sm text-gray-600 mb-2">Troubleshooting steps:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                    <li>Ensure knowledge entries have clear titles</li>
                    <li>Check that content is relevant to your questions</li>
                    <li>Try using keywords from your knowledge base</li>
                    <li>Verify entries were saved successfully</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-medium text-gray-900 mb-1">Slow responses</h5>
                  <p className="text-sm text-gray-600 mb-2">Performance optimization:</p>
                  <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                    <li>Check your network speed</li>
                    <li>Reduce response length in settings</li>
                    <li>Clear browser cache</li>
                    <li>Close unnecessary browser tabs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">🆘 Need More Help?</h4>
            <p className="text-blue-800">
              If you're still experiencing issues, try refreshing the page or check the browser console 
              for error messages. Make sure your API key is valid and has sufficient credits.
            </p>
          </div>
        </div>
      )
    }
  ];

  const filteredSections = helpSections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    section.content.props.children.some((child: any) =>
      typeof child === 'string' && child.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-6 h-6 text-primary-500" />
            <h1 className="text-2xl font-bold text-gray-900">Help & Documentation</h1>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search help topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm border-r">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Help Topics</h3>
            <div className="space-y-2">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {section.icon}
                  <span className="text-sm font-medium">{section.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {helpSections.find(section => section.id === activeSection)?.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
