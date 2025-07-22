import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  children: React.ReactNode;
  variant?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'typewriter' | 'bounce' | 'scale' | 'glow' | 'wave';
  delay?: number;
  duration?: number;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  variant = 'fadeIn',
  delay = 0,
  duration = 0.6,
  className = '',
  as: Component = 'div'
}) => {
  const variants = {
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration, delay }
    },
    slideUp: {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 },
      transition: { duration, delay, type: "spring", stiffness: 100 }
    },
    slideLeft: {
      initial: { opacity: 0, x: 50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay, type: "spring", stiffness: 100 }
    },
    slideRight: {
      initial: { opacity: 0, x: -50 },
      animate: { opacity: 1, x: 0 },
      transition: { duration, delay, type: "spring", stiffness: 100 }
    },
    typewriter: {
      initial: { width: 0 },
      animate: { width: "auto" },
      transition: { duration: duration * 2, delay, ease: "linear" }
    },
    bounce: {
      initial: { opacity: 0, scale: 0.3 },
      animate: { opacity: 1, scale: 1 },
      transition: { 
        duration, 
        delay, 
        type: "spring", 
        stiffness: 260, 
        damping: 20 
      }
    },
    scale: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration, delay, type: "spring", stiffness: 200 }
    },
    glow: {
      initial: { opacity: 0, textShadow: "0 0 0px #00ffff" },
      animate: { 
        opacity: 1, 
        textShadow: [
          "0 0 5px #00ffff",
          "0 0 10px #00ffff",
          "0 0 15px #00ffff",
          "0 0 10px #00ffff",
          "0 0 5px #00ffff"
        ]
      },
      transition: { 
        duration: duration * 2, 
        delay,
        textShadow: {
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut"
        }
      }
    },
    wave: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration, delay }
    }
  };

  const currentVariant = variants[variant];

  if (variant === 'wave') {
    // Special handling for wave animation - animate each character
    const text = typeof children === 'string' ? children : '';
    return (
      <Component className={className}>
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: delay + index * 0.05,
              type: "spring",
              stiffness: 200
            }}
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </Component>
    );
  }

  if (variant === 'typewriter') {
    return (
      <motion.div
        className={`overflow-hidden whitespace-nowrap ${className}`}
        initial={currentVariant.initial}
        animate={currentVariant.animate}
        transition={currentVariant.transition}
      >
        <Component>{children}</Component>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial={currentVariant.initial}
      animate={currentVariant.animate}
      transition={currentVariant.transition}
    >
      <Component>{children}</Component>
    </motion.div>
  );
};

export default AnimatedText;
