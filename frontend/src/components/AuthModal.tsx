import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, User, Globe } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import OTPModal from './OTPModal';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpEmail, setOtpEmail] = useState('');
  const [otpMode, setOtpMode] = useState<'signup' | 'signin'>('signin');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    fullName: '',
    languagePreference: 'en' as 'en' | 'my',
    enable2FA: false
  });
  const [authMethod, setAuthMethod] = useState<'password' | 'otp'>('password');
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [qrCode, setQrCode] = useState('');

  const { signUp, signIn, sendOTP, verifyOTP, enable2FA } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (authMethod === 'password') {
        // Password Authentication
        if (mode === 'register') {
          const userData = {
            username: formData.username,
            fullName: formData.fullName,
            languagePreference: formData.languagePreference as 'en' | 'my',
            enable2FA: formData.enable2FA
          };
          const result = await signUp(formData.email, formData.password, userData);
          
          if (result.error) {
            setError(result.error);
          } else {
            // If 2FA was enabled during signup, show setup
            if (formData.enable2FA) {
              const twoFAResult = await enable2FA();
              if (twoFAResult.qrCode) {
                setQrCode(twoFAResult.qrCode);
                setShow2FASetup(true);
              }
            } else {
              onClose();
            }
          }
        } else {
          const result = await signIn(formData.email, formData.password);
          
          if (result.error) {
            setError(result.error);
          } else {
            onClose();
          }
        }
      } else {
        // OTP Authentication (fallback)
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
      onClose();
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
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    
    // Instantly switch language when language preference changes
    if (e.target.name === 'languagePreference') {
      setLanguage(e.target.value as 'en' | 'my');
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      username: '',
      fullName: '',
      languagePreference: 'en'
    });
    setError('');
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-cyan-500/30"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white font-orbitron">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </h2>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50 transition-colors"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-black/30 text-white placeholder-gray-400 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Authentication Method Selection */}
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Authentication Method
              </label>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setAuthMethod('password')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    authMethod === 'password'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-700/30 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30'
                  }`}
                >
                  Password
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMethod('otp')}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${
                    authMethod === 'otp'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                      : 'bg-gray-700/30 text-gray-400 border border-gray-600/30 hover:bg-gray-600/30'
                  }`}
                >
                  Email OTP
                </button>
              </div>
            </div>

            {/* Password Field */}
            {authMethod === 'password' && (
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-black/30 text-white placeholder-gray-400 border border-cyan-500/30 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                    placeholder="Enter your password"
                    minLength={6}
                  />
                </div>
              </div>
            )}

            {/* Registration Fields */}
            {mode === 'register' && (
              <>
                {/* Username */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black/30 text-white placeholder-gray-400 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="Choose a username"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black/30 text-white placeholder-gray-400 border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Language Preference */}
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">
                    Language Preference
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                      name="languagePreference"
                      value={formData.languagePreference}
                      onChange={handleInputChange}
                      className="w-full bg-black/30 text-white border border-cyan-500/30 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                    >
                      <option value="en">English</option>
                      <option value="my">မြန်မာ (Myanmar)</option>
                    </select>
                  </div>
                </div>

                {/* 2FA Option (only for password auth) */}
                {authMethod === 'password' && (
                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="enable2FA"
                        checked={formData.enable2FA}
                        onChange={(e) => setFormData(prev => ({ ...prev, enable2FA: e.target.checked }))}
                        className="w-4 h-4 text-cyan-500 bg-black/30 border-cyan-500/30 rounded focus:ring-cyan-400/50 focus:ring-2"
                      />
                      <span className="text-gray-300 text-sm">
                        Enable Two-Factor Authentication (2FA) for enhanced security
                      </span>
                    </label>
                  </div>
                )}
              </>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-orbitron"
            >
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
            </motion.button>
          </form>

          {/* Switch Mode */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
              <button
                onClick={switchMode}
                className="ml-2 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
              >
                {mode === 'login' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </motion.div>
      </motion.div>
      
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
    </AnimatePresence>
  );
};

export default AuthModal;
