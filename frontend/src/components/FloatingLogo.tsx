import React from 'react';
import { motion } from 'framer-motion';

interface FloatingLogoProps {
  onClick: () => void;
}

const FloatingLogo: React.FC<FloatingLogoProps> = ({ onClick }) => {
  return (
    <motion.div
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50"
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20,
        delay: 1
      }}
    >
      <motion.button
        onClick={onClick}
        className="relative w-16 h-16 group cursor-pointer"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Outer Glow Ring */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-30"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Middle Ring */}
        <motion.div
          className="absolute inset-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 opacity-50"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        
        {/* Inner Bubble */}
        <motion.div
          className="absolute inset-2 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-cyan-400/50 backdrop-blur-sm flex items-center justify-center shadow-2xl"
          style={{
            boxShadow: `
              0 0 30px rgba(6, 182, 212, 0.4),
              inset 0 2px 4px rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3)
            `
          }}
          animate={{
            boxShadow: [
              "0 0 30px rgba(6, 182, 212, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.3)",
              "0 0 40px rgba(6, 182, 212, 0.6), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.3)",
              "0 0 30px rgba(6, 182, 212, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.1), inset 0 -2px 4px rgba(0, 0, 0, 0.3)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Logo/Icon */}
          <motion.div
            className="relative"
            animate={{
              rotateY: [0, 360]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            <img 
              src="/logo.png" 
              alt="SateCha Logo" 
              className="w-6 h-6 object-contain"
              style={{ filter: 'brightness(0) saturate(100%) invert(70%) sepia(98%) saturate(1000%) hue-rotate(180deg) brightness(100%) contrast(101%)' }}
            />
          </motion.div>
          
          {/* Sparkle Effects */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${20 + Math.cos(i * 60 * Math.PI / 180) * 15}px`,
                top: `${20 + Math.sin(i * 60 * Math.PI / 180) * 15}px`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
        
        {/* Hover Tooltip */}
        <motion.div
          className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-800 text-cyan-400 text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
          style={{ fontFamily: 'Orbitron, monospace' }}
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: 0 }}
        >
          Chat with SateCha AI
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
        </motion.div>
        
        {/* Pulse Rings */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
          animate={{
            scale: [1, 2, 1],
            opacity: [0.5, 0, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeOut"
          }}
        />
        
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-blue-500/30"
          animate={{
            scale: [1, 2.5, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1,
            ease: "easeOut"
          }}
        />
      </motion.button>
    </motion.div>
  );
};

export default FloatingLogo;
