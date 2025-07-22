import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedText from './AnimatedText';

const Footer: React.FC = () => {
  const { language } = useLanguage();
  const handleTeamClick = () => {
    window.location.href = 'mailto:tayzarminhtay34@gmail.com';
  };

  return (
    <footer className="relative bg-gradient-to-t from-black/50 to-transparent border-t border-cyan-500/20 py-6 mt-auto">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-3"
        >
          {/* Created by text */}
          <div className="flex items-center space-x-2 text-gray-400 text-sm">
            <span className="font-orbitron">Created by</span>
            
          </div>

          {/* Team Name with Glowing Gradient Effect */}
          <motion.button
            onClick={handleTeamClick}
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="text-2xl font-bold font-orbitron relative z-10 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
              animate={{
                backgroundImage: [
                  'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)',
                  'linear-gradient(45deg, #3b82f6, #8b5cf6, #ec4899)',
                  'linear-gradient(45deg, #8b5cf6, #ec4899, #06b6d4)',
                  'linear-gradient(45deg, #ec4899, #06b6d4, #3b82f6)',
                  'linear-gradient(45deg, #06b6d4, #3b82f6, #8b5cf6)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              Team NexTech_Five
            </motion.div>

            {/* Glowing Background Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-lg blur-lg"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />

            {/* Hover Glow Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-blue-500/0 to-purple-600/0 rounded-lg blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300"
              animate={{
                backgroundImage: [
                  'linear-gradient(45deg, rgba(6,182,212,0.3), rgba(59,130,246,0.3), rgba(139,92,246,0.3))',
                  'linear-gradient(45deg, rgba(59,130,246,0.3), rgba(139,92,246,0.3), rgba(236,72,153,0.3))',
                  'linear-gradient(45deg, rgba(139,92,246,0.3), rgba(236,72,153,0.3), rgba(6,182,212,0.3))',
                  'linear-gradient(45deg, rgba(236,72,153,0.3), rgba(6,182,212,0.3), rgba(59,130,246,0.3))'
                ]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.button>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center space-x-2 text-gray-500 text-xs"
          >
            <Mail className="w-3 h-3" />
            <span className="font-orbitron">Click to contact us</span>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-600 text-xs font-orbitron"
          >
            © 2025 SateCha Security Platform. All rights reserved.
          </motion.div>
        </motion.div>

        {/* Decorative Tech Lines */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      </div>
    </footer>
  );
};

export default Footer;
