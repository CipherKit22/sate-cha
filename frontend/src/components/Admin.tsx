import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BookOpen, 
  Shield, 
  Settings as SettingsIcon,
  Search,
  Plus,
  Edit3,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface User {
  id: string;
  username: string;
  full_name: string;
  email: string;
  role: 'user' | 'admin' | 'analyst';
  language_preference: 'english' | 'burmese';
  created_at: string;
  avatar_url?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
  difficulty: 'easy' | 'medium' | 'hard';
  language: 'english' | 'burmese';
  category: string;
  explanation: string;
  is_active: boolean;
  created_at: string;
}

const Admin: React.FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState<'users' | 'quiz' | 'content' | 'settings'>('users');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Users Management
  const [users, setUsers] = useState<User[]>([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  
  // Quiz Management
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [questionSearchTerm, setQuestionSearchTerm] = useState('');
  
  // New Question Form
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correct_answer: 0,
    difficulty: 'medium' as 'easy' | 'medium' | 'hard',
    language: 'english' as 'english' | 'burmese',
    category: '',
    explanation: '',
    is_active: true
  });

  const checkAdminAccess = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      
      if (error || data?.role !== 'admin') {
        setMessage({ type: 'error', text: 'Access denied. Admin privileges required.' });
        return;
      }
    } catch (error) {
      console.error('Error checking admin access:', error);
      setMessage({ type: 'error', text: 'Failed to verify admin access' });
    }
  };

  useEffect(() => {
    if (user) {
      checkAdminAccess();
      loadUsers();
      loadQuizQuestions();
    }
  }, [user]);

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    }
  };

  const loadQuizQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setQuizQuestions(data || []);
    } catch (error) {
      console.error('Error loading quiz questions:', error);
      setMessage({ type: 'error', text: 'Failed to load quiz questions' });
    }
  };

  const updateUserRole = async (userId: string, newRole: 'user' | 'admin' | 'analyst') => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);
      
      if (error) throw error;
      
      await loadUsers();
      setMessage({ type: 'success', text: 'User role updated successfully' });
    } catch (error) {
      console.error('Error updating user role:', error);
      setMessage({ type: 'error', text: 'Failed to update user role' });
    } finally {
      setLoading(false);
    }
  };

  const addQuizQuestion = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('quiz_questions')
        .insert([{
          ...newQuestion,
          options: JSON.stringify(newQuestion.options),
          created_by: user?.id
        }]);
      
      if (error) throw error;
      
      await loadQuizQuestions();
      setShowAddQuestion(false);
      setNewQuestion({
        question: '',
        options: ['', '', '', ''],
        correct_answer: 0,
        difficulty: 'medium',
        language: 'english',
        category: '',
        explanation: '',
        is_active: true
      });
      setMessage({ type: 'success', text: 'Quiz question added successfully' });
    } catch (error) {
      console.error('Error adding quiz question:', error);
      setMessage({ type: 'error', text: 'Failed to add quiz question' });
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestionStatus = async (questionId: string, isActive: boolean) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('quiz_questions')
        .update({ is_active: !isActive })
        .eq('id', questionId);
      
      if (error) throw error;
      
      await loadQuizQuestions();
      setMessage({ type: 'success', text: 'Question status updated successfully' });
    } catch (error) {
      console.error('Error updating question status:', error);
      setMessage({ type: 'error', text: 'Failed to update question status' });
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.full_name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const filteredQuestions = quizQuestions.filter(question =>
    question.question.toLowerCase().includes(questionSearchTerm.toLowerCase()) ||
    question.category.toLowerCase().includes(questionSearchTerm.toLowerCase())
  );

  const adminSections = [
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'quiz', label: 'Quiz Management', icon: BookOpen },
    { id: 'content', label: 'Content Management', icon: Shield },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2 font-orbitron">
            Admin Dashboard
          </h1>
          <p className="text-gray-400">
            Manage users, content, and system settings
          </p>
        </motion.div>

        {/* Message Display */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span>{message.text}</span>
            <button 
              onClick={() => setMessage(null)}
              className="ml-auto hover:opacity-70"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Admin Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <nav className="flex flex-wrap gap-2 justify-center">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <motion.button
                  key={section.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveSection(section.id as any)}
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-orbitron">{section.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </motion.div>

        {/* Content Sections */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-card"
        >
          {activeSection === 'users' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-orbitron">User Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="pb-3 text-gray-300 font-orbitron">User</th>
                      <th className="pb-3 text-gray-300 font-orbitron">Email</th>
                      <th className="pb-3 text-gray-300 font-orbitron">Role</th>
                      <th className="pb-3 text-gray-300 font-orbitron">Language</th>
                      <th className="pb-3 text-gray-300 font-orbitron">Joined</th>
                      <th className="pb-3 text-gray-300 font-orbitron">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-white/10">
                        <td className="py-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-black font-bold text-sm">
                                {user.username.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <div className="text-white font-semibold">{user.username}</div>
                              <div className="text-gray-400 text-sm">{user.full_name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-300">{user.email}</td>
                        <td className="py-4">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value as any)}
                            className="bg-white/10 border border-white/20 rounded px-2 py-1 text-white text-sm"
                            disabled={loading}
                          >
                            <option value="user">User</option>
                            <option value="analyst">Analyst</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-4 text-gray-300 capitalize">{user.language_preference}</td>
                        <td className="py-4 text-gray-300">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-1 text-cyan-400 hover:text-cyan-300"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-1 text-blue-400 hover:text-blue-300"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'quiz' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-orbitron">Quiz Management</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Search questions..."
                      value={questionSearchTerm}
                      onChange={(e) => setQuestionSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <button
                    onClick={() => setShowAddQuestion(true)}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-400 hover:to-green-500 flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Question</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredQuestions.map((question) => (
                  <div key={question.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="text-white font-semibold mb-2">{question.question}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400">
                          <span className="capitalize">{question.difficulty}</span>
                          <span className="capitalize">{question.language}</span>
                          <span>{question.category}</span>
                          <span className={question.is_active ? 'text-green-400' : 'text-red-400'}>
                            {question.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleQuestionStatus(question.id, question.is_active)}
                          className={`p-2 rounded ${
                            question.is_active 
                              ? 'text-red-400 hover:text-red-300' 
                              : 'text-green-400 hover:text-green-300'
                          }`}
                        >
                          {question.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingQuestion(question)}
                          className="p-2 text-blue-400 hover:text-blue-300"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      {JSON.parse(question.options).map((option: string, index: number) => (
                        <div 
                          key={index}
                          className={`p-2 rounded ${
                            index === question.correct_answer 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-white/5 text-gray-300'
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'content' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">Content Management</h2>
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">Content management features coming soon...</p>
              </div>
            </div>
          )}

          {activeSection === 'settings' && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 font-orbitron">System Settings</h2>
              <div className="text-center py-12">
                <SettingsIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-400">System settings features coming soon...</p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Add Question Modal */}
        {showAddQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white font-orbitron">Add New Question</h3>
                <button
                  onClick={() => setShowAddQuestion(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Question</label>
                  <textarea
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    rows={3}
                    placeholder="Enter your question..."
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Options</label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                      <input
                        type="radio"
                        name="correct_answer"
                        checked={newQuestion.correct_answer === index}
                        onChange={() => setNewQuestion({...newQuestion, correct_answer: index})}
                        className="text-cyan-400"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...newQuestion.options];
                          newOptions[index] = e.target.value;
                          setNewQuestion({...newQuestion, options: newOptions});
                        }}
                        className="flex-1 p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                        placeholder={`Option ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">Difficulty</label>
                    <select
                      value={newQuestion.difficulty}
                      onChange={(e) => setNewQuestion({...newQuestion, difficulty: e.target.value as any})}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Language</label>
                    <select
                      value={newQuestion.language}
                      onChange={(e) => setNewQuestion({...newQuestion, language: e.target.value as any})}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="english">English</option>
                      <option value="burmese">Burmese</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Category</label>
                  <input
                    type="text"
                    value={newQuestion.category}
                    onChange={(e) => setNewQuestion({...newQuestion, category: e.target.value})}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    placeholder="e.g., Network Security, Cryptography"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Explanation</label>
                  <textarea
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                    className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
                    rows={3}
                    placeholder="Explain why this is the correct answer..."
                  />
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    onClick={() => setShowAddQuestion(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addQuizQuestion}
                    disabled={loading || !newQuestion.question || !newQuestion.options.every(opt => opt.trim())}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {loading ? <Clock className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{loading ? 'Adding...' : 'Add Question'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Admin;
