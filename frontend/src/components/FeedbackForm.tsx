import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Send, MessageSquare, ThumbsUp, ThumbsDown, Heart, Zap, Target, Award, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AnimatedText from './AnimatedText';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [feedback, setFeedback] = useState({
    // Overall satisfaction
    overallRating: 0,
    satisfaction: '',
    
    // Feature ratings
    uiDesign: 0,
    performance: 0,
    features: 0,
    security: 0,
    
    // Specific feedback
    favoriteFeature: '',
    leastFavorite: '',
    improvements: '',
    
    // User experience
    easeOfUse: 0,
    wouldRecommend: '',
    returnLikelihood: 0,
    
    // Creative questions
    platformMood: '',
    superpower: '',
    oneWord: '',
    
    // Contact info
    email: '',
    name: ''
  });

  const handleRatingChange = (field: string, rating: number) => {
    setFeedback(prev => ({ ...prev, [field]: rating }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFeedback(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Store feedback in database
      const { data, error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id,
          overall_rating: feedback.overallRating,
          satisfaction: feedback.satisfaction,
          ui_design: feedback.uiDesign,
          performance: feedback.performance,
          features: feedback.features,
          security: feedback.security,
          ease_of_use: feedback.easeOfUse,
          would_recommend: feedback.wouldRecommend,
          return_likelihood: feedback.returnLikelihood,
          favorite_feature: feedback.favoriteFeature,
          least_favorite: feedback.leastFavorite,
          improvements: feedback.improvements,
          platform_mood: feedback.platformMood,
          superpower: feedback.superpower,
          one_word: feedback.oneWord,
          feedback_name: feedback.name,
          feedback_email: feedback.email,
          language: language
        })
        .select()
        .single();

      if (error) {
        console.error('Error submitting feedback:', error);
        throw error;
      }

      // Also send email notification to admin
      const emailBody = `
New SateCha Platform Feedback Received
====================================

User: ${user?.email || 'Anonymous'}
Overall Rating: ${feedback.overallRating}/5 stars
Satisfaction: ${feedback.satisfaction}

View full feedback in the admin panel.

Submitted: ${new Date().toLocaleString()}
      `;

      const subject = encodeURIComponent('New SateCha Feedback Received');
      const body = encodeURIComponent(emailBody);
      
      // Open email client for admin notification
      setTimeout(() => {
        window.open(`mailto:tayzarminhtay34@gmail.com?subject=${subject}&body=${body}`);
      }, 1000);
      
      setSubmitted(true);
      
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setCurrentStep(1);
        // Reset form
        setFeedback({
          overallRating: 0,
          satisfaction: '',
          uiDesign: 0,
          performance: 0,
          features: 0,
          security: 0,
          favoriteFeature: '',
          leastFavorite: '',
          improvements: '',
          easeOfUse: 0,
          wouldRecommend: '',
          returnLikelihood: 0,
          platformMood: '',
          superpower: '',
          oneWord: '',
          email: '',
          name: ''
        });
      }, 3000);
      
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      alert(language === 'en' 
        ? 'Failed to submit feedback. Please try again.' 
        : 'အကြံပြုချက် ပေးပို့ရာတွင် အမှားရှိပါသည်။ ထပ်မံကြိုးစားပါ။'
      );
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, onRate: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <motion.button
            key={star}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onRate(star)}
            className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-600'}`}
          >
            <Star className="w-6 h-6 fill-current" />
          </motion.button>
        ))}
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
          className="relative max-w-2xl w-full bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Heart className="w-8 h-8 text-white" />
              </motion.div>
              <AnimatedText variant="bounce" className="text-2xl font-bold text-white mb-4">
                Thank You!
              </AnimatedText>
              <p className="text-gray-300">Your feedback has been sent successfully!</p>
            </motion.div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <AnimatedText variant="glow" className="text-3xl font-bold text-white mb-2">
                  We Value Your Feedback
                </AnimatedText>
                <p className="text-gray-300">Help us make SateCha even better!</p>
                <div className="flex justify-center mt-4">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`w-3 h-3 rounded-full mx-1 ${
                        step <= currentStep ? 'bg-cyan-400' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Step 1: Overall Satisfaction */}
              {currentStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <AnimatedText variant="slideUp" className="text-xl font-semibold text-white mb-4">
                    How would you rate your overall experience?
                  </AnimatedText>
                  
                  <div className="text-center">
                    {renderStars(feedback.overallRating, (rating) => handleRatingChange('overallRating', rating))}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-gray-300 text-sm font-medium">
                      How satisfied are you with SateCha?
                    </label>
                    <div className="grid grid-cols-1 gap-2">
                      {['Extremely Satisfied', 'Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'].map((option) => (
                        <motion.button
                          key={option}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleInputChange('satisfaction', option)}
                          className={`p-3 rounded-lg text-left transition-all ${
                            feedback.satisfaction === option
                              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                              : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-700/50'
                          } border`}
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Feature Ratings */}
              {currentStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <AnimatedText variant="slideUp" className="text-xl font-semibold text-white mb-4">
                    Rate our features
                  </AnimatedText>
                  
                  {[
                    { key: 'uiDesign', label: 'UI Design & Aesthetics', icon: Target },
                    { key: 'performance', label: 'Performance & Speed', icon: Zap },
                    { key: 'features', label: 'Features & Functionality', icon: Award },
                    { key: 'security', label: 'Security & Trust', icon: ThumbsUp }
                  ].map(({ key, label, icon: Icon }) => (
                    <div key={key} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Icon className="w-5 h-5 text-cyan-400" />
                        <span className="text-gray-300">{label}</span>
                      </div>
                      {renderStars(feedback[key as keyof typeof feedback] as number, (rating) => handleRatingChange(key, rating))}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Step 3: Detailed Feedback */}
              {currentStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <AnimatedText variant="slideUp" className="text-xl font-semibold text-white mb-4">
                    Tell us more
                  </AnimatedText>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        What's your favorite feature?
                      </label>
                      <textarea
                        value={feedback.favoriteFeature}
                        onChange={(e) => handleInputChange('favoriteFeature', e.target.value)}
                        className="w-full bg-gray-800/50 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                        rows={3}
                        placeholder="Tell us what you love most..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        What could we improve?
                      </label>
                      <textarea
                        value={feedback.improvements}
                        onChange={(e) => handleInputChange('improvements', e.target.value)}
                        className="w-full bg-gray-800/50 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                        rows={3}
                        placeholder="Your suggestions for improvement..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Would you recommend SateCha?
                        </label>
                        <div className="flex space-x-2">
                          {['Definitely', 'Probably', 'Maybe', 'Probably Not', 'Definitely Not'].map((option) => (
                            <motion.button
                              key={option}
                              whileHover={{ scale: 1.05 }}
                              onClick={() => handleInputChange('wouldRecommend', option)}
                              className={`px-3 py-2 rounded text-xs transition-all ${
                                feedback.wouldRecommend === option
                                  ? 'bg-cyan-500 text-white'
                                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                              }`}
                            >
                              {option.split(' ')[0]}
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Likelihood to return (1-5)
                        </label>
                        {renderStars(feedback.returnLikelihood, (rating) => handleRatingChange('returnLikelihood', rating))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Creative Questions & Contact */}
              {currentStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <AnimatedText variant="slideUp" className="text-xl font-semibold text-white mb-4">
                    Final thoughts
                  </AnimatedText>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        If SateCha was a mood, what would it be?
                      </label>
                      <input
                        type="text"
                        value={feedback.platformMood}
                        onChange={(e) => handleInputChange('platformMood', e.target.value)}
                        className="w-full bg-gray-800/50 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                        placeholder="e.g., Confident, Innovative, Secure..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        If you could give SateCha one superpower, what would it be?
                      </label>
                      <input
                        type="text"
                        value={feedback.superpower}
                        onChange={(e) => handleInputChange('superpower', e.target.value)}
                        className="w-full bg-gray-800/50 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                        placeholder="e.g., Mind reading, Time travel, Invisibility..."
                      />
                    </div>

                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Describe SateCha in one word
                      </label>
                      <input
                        type="text"
                        value={feedback.oneWord}
                        onChange={(e) => handleInputChange('oneWord', e.target.value)}
                        className="w-full bg-gray-800/50 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                        placeholder="One word that captures your experience..."
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Your Name (Optional)
                        </label>
                        <input
                          type="text"
                          value={feedback.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full bg-gray-800/50 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                          placeholder="Your name"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Your Email (Optional)
                        </label>
                        <input
                          type="email"
                          value={feedback.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-gray-800/50 text-white border border-gray-600 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  disabled={currentStep === 1}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </motion.button>

                {currentStep < 4 ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600"
                  >
                    Next
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-white rounded-lg hover:from-green-600 hover:to-cyan-600 flex items-center space-x-2"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <Send className="w-5 h-5" />
                    )}
                    <span>Submit Feedback</span>
                  </motion.button>
                )}
              </div>
            </>
          )}

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeedbackForm;
