import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  loading?: boolean;
  error?: string;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onComplete, loading, error }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  useEffect(() => {
    if (otp.every(digit => digit !== '') && otp.join('').length === length) {
      onComplete(otp.join(''));
    }
  }, [otp, length, onComplete]);

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-3">
        {otp.map((data, index) => (
          <motion.input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            name="otp"
            maxLength={1}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            disabled={loading}
            className={`w-12 h-12 text-center text-xl font-bold bg-gray-800/50 border-2 rounded-lg focus:outline-none transition-all duration-300 font-orbitron ${
              error 
                ? 'border-red-500 text-red-400' 
                : 'border-gray-600 focus:border-cyan-400 text-white'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            whileFocus={{ scale: 1.05 }}
            animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-sm text-center font-orbitron"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default OTPInput;
