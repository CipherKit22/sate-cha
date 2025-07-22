import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, User, Globe, ArrowRight, Shield, Zap, Users, UserPlus, LogIn, Sparkles, Binary, Code2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import OTPModal from './OTPModal';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onSuccess?: () => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'login', onSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    languagePreference: 'en'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpMode, setOtpMode] = useState<'signup' | 'signin'>('signin');

  const { sendOTP, verifyOTP } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = mode === 'register' ? {
        username: formData.username,
        fullName: formData.fullName,
        languagePreference: formData.languagePreference as 'en' | 'my'
      } : undefined;

      const result = await sendOTP(formData.email, mode === 'login' ? 'signin' : 'signup', userData);
      
      if (result.error) {
        setError(result.error);
      } else {
        // Show OTP modal
        setOtpEmail(formData.email);
        setOtpMode(mode === 'login' ? 'signin' : 'signup');
        setShowOTPModal(true);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    const result = await verifyOTP(otpEmail, otp, otpMode);
    if (result.error) {
      return { error: result.error };
    } else {
      setShowOTPModal(false);
      onSuccess?.();
      return {};
    }
  };

  const handleResendOTP = async () => {
    const userData = otpMode === 'signup' ? {
      username: formData.username,
      fullName: formData.fullName,
      languagePreference: formData.languagePreference as 'en' | 'my'
    } : undefined;
    
    return await sendOTP(otpEmail, otpMode, userData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Instantly switch language when language preference changes
    if (name === 'languagePreference') {
      setLanguage(value as 'en' | 'my');
    }
    setError('');
  };

  const features = [
    {
      icon: Shield,
      title: 'Advanced Security',
      description: 'State-of-the-art cybersecurity monitoring and threat detection',
      color: 'from-cyan-400 to-blue-500'
    },
    {
      icon: Zap,
      title: 'Real-time Analysis',
      description: 'Instant threat analysis and response with AI-powered intelligence',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Learn from shared experiences and community threat reports',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-transparent relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [-30, 30, -30],
              x: [-15, 15, -15],
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(90deg, rgba(6,182,212,0.3) 1px, transparent 1px),
              linear-gradient(rgba(6,182,212,0.3) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Main Auth Container */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          className="w-full max-w-md"
        >
          {/* Auth Card */}
          <div className="glass-card p-6 sm:p-8 backdrop-blur-xl bg-gray-900/40 border border-cyan-500/30 rounded-2xl shadow-2xl">
            {/* Header with Icon */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center"
              >
                {mode === 'login' ? (
                  <LogIn className="w-8 h-8 text-white" />
                ) : (
                  <UserPlus className="w-8 h-8 text-white" />
                )}
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-2xl sm:text-3xl font-bold text-white mb-2"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                {mode === 'login' ? 'Welcome Back' : 'Create Account'}
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-400 text-sm sm:text-base"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                {mode === 'login' 
                  ? 'Access your cybersecurity dashboard' 
                  : 'Join the SateCha security platform'
                }
              </motion.p>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username - First field for Register */}
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <label className="block text-cyan-300 text-sm font-medium mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    {t('auth.username')}
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800/60 text-white pl-12 pr-4 py-3.5 rounded-xl border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ fontFamily: 'Orbitron, monospace' }}
                      placeholder={t('auth.enterUsername')}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </motion.div>
              )}

              {/* Full Name - Second field for Register */}
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="relative"
                >
                  <label className="block text-cyan-300 text-sm font-medium mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    {t('auth.fullname')}
                  </label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-gray-800/60 text-white pl-12 pr-4 py-3.5 rounded-xl border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                      style={{ fontFamily: 'Orbitron, monospace' }}
                      placeholder={t('auth.enterFullname')}
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </motion.div>
              )}

              {/* Email - Third field for Register, First for Login */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mode === 'register' ? 0.8 : 0.6 }}
                className="relative"
              >
                <label className="block text-cyan-300 text-sm font-medium mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {t('auth.email')}
                </label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-800/60 text-white pl-12 pr-4 py-3.5 rounded-xl border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                    placeholder={t('auth.enterEmail')}
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                </div>
              </motion.div>



              {/* Language Preference - Fourth field for Register */}
              {mode === 'register' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="relative"
                >
                  <label className="block text-cyan-300 text-sm font-medium mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    {t('auth.language')}
                  </label>
                  <div className="relative group">
                    <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-cyan-400 transition-colors" />
                    <select
                      name="languagePreference"
                      value={formData.languagePreference}
                      onChange={handleInputChange}
                      className="w-full bg-gray-800/60 text-white pl-12 pr-4 py-3.5 rounded-xl border border-gray-600/50 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 focus:outline-none transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                      style={{ fontFamily: 'Orbitron, monospace' }}
                    >
                      <option value="en">{t('auth.english')}</option>
                      <option value="my">{t('auth.burmese')}</option>
                    </select>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                </motion.div>
              )}

              {/* Submit Button */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: mode === 'register' ? 1.0 : 0.7 }}
                type="submit"
                disabled={loading}
                className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 group shadow-lg hover:shadow-cyan-500/25"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    {mode === 'login' ? (
                      <LogIn className="w-5 h-5" />
                    ) : (
                      <UserPlus className="w-5 h-5" />
                    )}
                    <span>{mode === 'login' ? t('auth.signin') : t('auth.signup')}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>
            </form>

            {/* Toggle Mode */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: mode === 'register' ? 1.1 : 0.8 }}
              className="text-center mt-6 pt-6 border-t border-gray-700/50"
            >
              <p className="text-gray-400 text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>
                {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                className="mt-2 px-6 py-2 bg-gray-800/50 text-cyan-400 hover:text-white hover:bg-cyan-500/20 font-semibold rounded-lg transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                {mode === 'login' ? 'Create Account' : 'Sign In Instead'}
              </motion.button>
            </motion.div>
            
            {/* Test Button for Modal - Remove after testing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-center mt-4"
            >
              <button
                onClick={() => {
                  setRegisteredEmail('test@example.com');
                  setShowEmailConfirmation(true);
                }}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-colors text-sm"
              >
                🧪 Test Email Confirmation Modal
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
      
      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        email={otpEmail}
        mode={otpMode}
        onVerifyOTP={handleVerifyOTP}
        onResendCode={handleResendOTP}
        loading={loading}
      />
    </div>
  );
};

export default AuthPage;
