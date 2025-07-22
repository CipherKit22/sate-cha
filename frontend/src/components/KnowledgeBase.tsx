import React, { useState, useEffect } from 'react';
import { Plus, Book, Trash2 } from 'lucide-react';
import { chatService } from '../services/api';

interface KnowledgeBaseType {
  id: string;
  title: string;
  content: string;
  created_at: Date;
}

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  category: string;
  createdAt: Date;
}

const KnowledgeBase = () => {
  const [knowledgeItems, setKnowledgeItems] = useState<KnowledgeBaseType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    fetchKnowledgeBase();
  }, []);

  const fetchKnowledgeBase = async () => {
    try {
      setIsLoading(true);
      const items = await chatService.getKnowledgeBase();
      setKnowledgeItems(items);
    } catch (error) {
      console.error('Error fetching knowledge base:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddKnowledge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      const newItem = await chatService.addKnowledge(newTitle, newContent);
      setKnowledgeItems(prev => [...prev, newItem]);
      setNewTitle('');
      setNewContent('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error adding knowledge:', error);
    }
  };

  return (
    <div className="h-full bg-white">
      {/* Header */}
      <div className="bg-primary-600 text-white p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Book className="w-6 h-6" />
            <h1 className="text-xl font-semibold">Knowledge Base</h1>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary-700 hover:bg-primary-800 px-3 py-1 rounded-lg flex items-center space-x-1 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <div className="p-4 bg-gray-50 border-b">
          <form onSubmit={handleAddKnowledge} className="space-y-3">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Knowledge title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Knowledge content..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                Add Knowledge
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Knowledge Items */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          </div>
        ) : knowledgeItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <Book className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No knowledge items yet. Add some to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {knowledgeItems.map((item) => (
              <div key={item.id} className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">{item.title}</h3>
                  <button className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-2">{item.content}</p>
                <p className="text-xs text-gray-400">
                  Added: {new Date(item.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
