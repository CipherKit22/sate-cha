import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Shield, X, RefreshCw } from 'lucide-react';
import OTPInput from './OTPInput';

interface OTPModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  mode: 'signup' | 'signin';
  onVerifyOTP: (otp: string) => Promise<{ error?: string }>;
  onResendCode: () => Promise<{ error?: string }>;
  loading?: boolean;
}

const OTPModal: React.FC<OTPModalProps> = ({
  isOpen,
  onClose,
  email,
  mode,
  onVerifyOTP,
  onResendCode,
  loading = false
}) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);

  const handleOTPComplete = async (otpCode: string) => {
    setOtp(otpCode);
    setError('');
    setVerifying(true);

    try {
      const result = await onVerifyOTP(otpCode);
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    setError('');
    setResending(true);

    try {
      const result = await onResendCode();
      if (result.error) {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative max-w-md w-full bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-xl border border-cyan-500/30 rounded-2xl p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Shield className="w-8 h-8 text-white" />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-2xl font-bold text-white font-orbitron mb-2"
              >
                Enter Verification Code
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-300 text-sm"
              >
                We've sent a 6-digit code to
              </motion.p>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-cyan-400 font-semibold font-orbitron mt-1"
              >
                {email}
              </motion.p>
            </div>

            {/* OTP Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-6"
            >
              <OTPInput
                length={6}
                onComplete={handleOTPComplete}
                loading={verifying}
                error={error}
              />
            </motion.div>

            {/* Loading State */}
            {verifying && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center mb-4"
              >
                <div className="inline-flex items-center space-x-2 text-cyan-400">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-orbitron">Verifying...</span>
                </div>
              </motion.div>
            )}

            {/* Resend Code */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <p className="text-gray-400 text-sm mb-3">
                Didn't receive the code?
              </p>
              <button
                onClick={handleResendCode}
                disabled={resending || verifying}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gray-800/50 text-cyan-400 hover:text-white hover:bg-cyan-500/20 font-semibold rounded-lg transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed font-orbitron"
              >
                {resending ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4" />
                    <span>Resend Code</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg"
            >
              <p className="text-gray-300 text-xs text-center">
                Check your email inbox and spam folder. The code expires in 10 minutes.
              </p>
            </motion.div>

            {/* Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OTPModal;
