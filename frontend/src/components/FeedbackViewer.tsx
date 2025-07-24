import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, 
  Search, 
  Star, 
  Calendar, 
  User, 
  MessageSquare, 
  Download, 
  Eye, 
  EyeOff,
  ChevronDown,
  ChevronUp,
  Trash2,
  Edit3,
  BarChart3,
  TrendingUp,
  Users,
  Heart,
  ThumbsUp,
  Award,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';
import AnimatedText from './AnimatedText';

interface FeedbackEntry {
  id: string;
  user_id: string;
  username: string;
  full_name: string;
  user_email: string;
  overall_rating: number;
  satisfaction: string;
  ui_design: number;
  performance: number;
  features: number;
  security: number;
  ease_of_use: number;
  would_recommend: string;
  return_likelihood: number;
  favorite_feature: string;
  least_favorite: string;
  improvements: string;
  platform_mood: string;
  superpower: string;
  one_word: string;
  feedback_name: string;
  feedback_email: string;
  language: string;
  status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

interface FeedbackStats {
  total_feedback: number;
  avg_overall_rating: number;
  avg_ui_design: number;
  avg_performance: number;
  avg_features: number;
  avg_security: number;
  avg_ease_of_use: number;
  avg_return_likelihood: number;
  satisfaction_breakdown: Record<string, number>;
  rating_distribution: Record<string, number>;
  recent_feedback_count: number;
}

interface FeedbackViewerProps {
  isOpen: boolean;
  onClose: () => void;
  adminMode?: boolean;
}

const FeedbackViewer: React.FC<FeedbackViewerProps> = ({ isOpen, onClose, adminMode = false }) => {
  const { user } = useAuth();
  const { language } = useLanguage();
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  
  // Filters
  const [filters, setFilters] = useState({
    searchTerm: '',
    minRating: '',
    maxRating: '',
    satisfaction: '',
    language: '',
    dateFrom: '',
    dateTo: '',
    showMyFeedback: !adminMode
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (isOpen && user) {
      loadFeedback();
      if (adminMode) {
        loadStats();
      }
    }
  }, [isOpen, user, adminMode, filters, currentPage]);

  const loadFeedback = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_filtered_feedback', {
        p_user_id: filters.showMyFeedback && !adminMode ? user?.id : null,
        p_min_rating: filters.minRating ? parseInt(filters.minRating) : null,
        p_max_rating: filters.maxRating ? parseInt(filters.maxRating) : null,
        p_satisfaction: filters.satisfaction || null,
        p_language: filters.language || null,
        p_date_from: filters.dateFrom ? new Date(filters.dateFrom).toISOString() : null,
        p_date_to: filters.dateTo ? new Date(filters.dateTo).toISOString() : null,
        p_limit: itemsPerPage,
        p_offset: (currentPage - 1) * itemsPerPage
      });

      if (error) throw error;
      setFeedback(data || []);
      
      // Calculate total pages (rough estimate)
      setTotalPages(Math.ceil((data?.length || 0) / itemsPerPage) || 1);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_feedback_stats');
      if (error) throw error;
      setStats(data);
    } catch (error) {
      console.error('Error loading feedback stats:', error);
    }
  };

  const handleFilterChange = (key: string, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      minRating: '',
      maxRating: '',
      satisfaction: '',
      language: '',
      dateFrom: '',
      dateTo: '',
      showMyFeedback: !adminMode
    });
    setCurrentPage(1);
  };

  const exportFeedback = () => {
    const csvContent = [
      // CSV Headers
      ['Date', 'User', 'Overall Rating', 'Satisfaction', 'UI Design', 'Performance', 'Features', 'Security', 'Ease of Use', 'Would Recommend', 'Return Likelihood', 'Favorite Feature', 'Improvements', 'Platform Mood', 'One Word'].join(','),
      // CSV Data
      ...feedback.map(f => [
        new Date(f.created_at).toLocaleDateString(),
        f.username || f.feedback_name || 'Anonymous',
        f.overall_rating,
        f.satisfaction,
        f.ui_design,
        f.performance,
        f.features,
        f.security,
        f.ease_of_use,
        f.would_recommend,
        f.return_likelihood,
        `"${f.favorite_feature || ''}"`,
        `"${f.improvements || ''}"`,
        `"${f.platform_mood || ''}"`,
        `"${f.one_word || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `satecha-feedback-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
          />
        ))}
      </div>
    );
  };

  const renderStats = () => {
    if (!stats || !adminMode) return null;

    return (
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg p-4 border border-blue-500/30"
        >
          <div className="flex items-center space-x-3">
            <MessageSquare className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.total_feedback}</p>
              <p className="text-gray-300 text-sm">Total Feedback</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg p-4 border border-yellow-500/30"
        >
          <div className="flex items-center space-x-3">
            <Star className="w-8 h-8 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.avg_overall_rating?.toFixed(1)}</p>
              <p className="text-gray-300 text-sm">Avg Rating</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg p-4 border border-green-500/30"
        >
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-8 h-8 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.recent_feedback_count}</p>
              <p className="text-gray-300 text-sm">Recent (30d)</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4 border border-purple-500/30"
        >
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8 text-pink-400" />
            <div>
              <p className="text-2xl font-bold text-white">{stats.avg_return_likelihood?.toFixed(1)}</p>
              <p className="text-gray-300 text-sm">Return Score</p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-7xl w-full bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <AnimatedText variant="glow" className="text-3xl font-bold text-white mb-2">
                {adminMode 
                  ? (language === 'en' ? 'Feedback Management' : 'အကြံပြုချက် စီမံခန့်ခွဲမှု')
                  : (language === 'en' ? 'My Feedback' : 'ကျွန်ုပ်၏ အကြံပြုချက်များ')
                }
              </AnimatedText>
              <p className="text-gray-400">
                {language === 'en' 
                  ? 'View and manage user feedback' 
                  : 'အသုံးပြုသူ အကြံပြုချက်များကို ကြည့်ရှုပြီး စီမံပါ'
                }
              </p>
            </div>
            <div className="flex items-center space-x-2">
              {adminMode && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={exportFeedback}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </motion.button>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Eye className="w-6 h-6" />
              </motion.button>
            </div>
          </div>

          {/* Stats */}
          {renderStats()}

          {/* Filters */}
          <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center space-x-2">
                <Filter className="w-5 h-5" />
                <span>{language === 'en' ? 'Filters' : 'စစ်ထုတ်မှုများ'}</span>
              </h3>
              <button
                onClick={clearFilters}
                className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center space-x-1"
              >
                <RefreshCw className="w-4 h-4" />
                <span>{language === 'en' ? 'Clear' : 'ရှင်းလင်းပါ'}</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {language === 'en' ? 'Min Rating' : 'အနည်းဆုံး အဆင့်သတ်မှတ်ချက်'}
                </label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2"
                >
                  <option value="">{language === 'en' ? 'Any' : 'မည်သည့်အရာမဆို'}</option>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <option key={rating} value={rating}>{rating} Star{rating > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {language === 'en' ? 'Satisfaction' : 'စိတ်ကျေနပ်မှု'}
                </label>
                <select
                  value={filters.satisfaction}
                  onChange={(e) => handleFilterChange('satisfaction', e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2"
                >
                  <option value="">{language === 'en' ? 'Any' : 'မည်သည့်အရာမဆို'}</option>
                  <option value="Extremely Satisfied">Extremely Satisfied</option>
                  <option value="Very Satisfied">Very Satisfied</option>
                  <option value="Satisfied">Satisfied</option>
                  <option value="Neutral">Neutral</option>
                  <option value="Dissatisfied">Dissatisfied</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {language === 'en' ? 'Language' : 'ဘာသာစကား'}
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => handleFilterChange('language', e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2"
                >
                  <option value="">{language === 'en' ? 'Any' : 'မည်သည့်အရာမဆို'}</option>
                  <option value="en">English</option>
                  <option value="my">မြန်မာ</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-300 text-sm mb-2">
                  {language === 'en' ? 'Date From' : 'ရက်စွဲမှ'}
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded-lg p-2"
                />
              </div>
            </div>

            {adminMode && (
              <div className="mt-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={filters.showMyFeedback}
                    onChange={(e) => handleFilterChange('showMyFeedback', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-gray-300">
                    {language === 'en' ? 'Show only my feedback' : 'ကျွန်ုပ်၏ အကြံပြုချက်များသာ ပြပါ'}
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-400">{language === 'en' ? 'Loading feedback...' : 'အကြံပြုချက်များ ဖွင့်နေသည်...'}</p>
              </div>
            ) : feedback.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">{language === 'en' ? 'No feedback found' : 'အကြံပြုချက်များ မတွေ့ရှိပါ'}</p>
              </div>
            ) : (
              feedback.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-semibold">
                            {item.username || item.feedback_name || 'Anonymous'}
                          </h4>
                          <p className="text-gray-400 text-sm">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            {renderStars(item.overall_rating)}
                            <span className="text-white font-semibold">{item.overall_rating}/5</span>
                          </div>
                          <p className="text-gray-400 text-sm">{item.satisfaction}</p>
                        </div>
                        <button
                          onClick={() => setExpandedFeedback(
                            expandedFeedback === item.id ? null : item.id
                          )}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {expandedFeedback === item.id ? (
                            <ChevronUp className="w-5 h-5" />
                          ) : (
                            <ChevronDown className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Quick Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">UI Design</p>
                        <div className="flex justify-center">{renderStars(item.ui_design)}</div>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">Performance</p>
                        <div className="flex justify-center">{renderStars(item.performance)}</div>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">Features</p>
                        <div className="flex justify-center">{renderStars(item.features)}</div>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400 text-xs">Security</p>
                        <div className="flex justify-center">{renderStars(item.security)}</div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {expandedFeedback === item.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-700/50 pt-4 space-y-4"
                        >
                          {item.favorite_feature && (
                            <div>
                              <h5 className="text-green-400 font-semibold mb-2">Favorite Feature</h5>
                              <p className="text-gray-300">{item.favorite_feature}</p>
                            </div>
                          )}
                          
                          {item.improvements && (
                            <div>
                              <h5 className="text-yellow-400 font-semibold mb-2">Suggested Improvements</h5>
                              <p className="text-gray-300">{item.improvements}</p>
                            </div>
                          )}
                          
                          {item.platform_mood && (
                            <div>
                              <h5 className="text-purple-400 font-semibold mb-2">Platform Mood</h5>
                              <p className="text-gray-300">{item.platform_mood}</p>
                            </div>
                          )}
                          
                          {item.one_word && (
                            <div>
                              <h5 className="text-cyan-400 font-semibold mb-2">One Word Description</h5>
                              <p className="text-gray-300 text-lg font-semibold">{item.one_word}</p>
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                            <div className="text-sm text-gray-400">
                              Would Recommend: <span className="text-white">{item.would_recommend}</span>
                            </div>
                            <div className="text-sm text-gray-400">
                              Return Likelihood: <span className="text-white">{item.return_likelihood}/5</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackViewer;
