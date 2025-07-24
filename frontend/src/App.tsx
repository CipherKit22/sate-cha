import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './styles/globals.css';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Tools from './components/Tools';
import Settings from './components/Settings';
import Profile from './components/Profile';
import Admin from './components/Admin';
import AuthModal from './components/AuthModal';
import Chatbot from './components/Chatbot';
import FloatingLogo from './components/FloatingLogo';
import Footer from './components/Footer';
import AdvancedNavigation from './components/AdvancedNavigation';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'dashboard' | 'quiz' | 'tools' | 'settings' | 'profile' | 'admin'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number, delay: number}>>([]);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    // Generate floating particles for background
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));
    setParticles(newParticles);
    
    // Simulate loading
    setTimeout(() => setIsLoading(false), 1500);
  }, []);



  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center overflow-hidden cyber-grid">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center glass-card"
        >
          <motion.div className="flex items-center justify-center mb-6">
            <motion.img
              src="/logo.png"
              alt="SateCha Logo"
              className="w-16 h-16 mr-4"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold text-white"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                SateCha
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-cyan-400 text-sm"
              >
                Cybersecurity Platform
              </motion.p>
            </div>
          </motion.div>
          
          {/* Advanced Tech-Based Loader */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            {/* Outer Ring */}
            <motion.div
              className="absolute inset-0 border-2 border-cyan-400/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Middle Ring */}
            <motion.div
              className="absolute inset-2 border-2 border-blue-500/50 rounded-full border-dashed"
              animate={{ rotate: -360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            
            {/* Inner Core */}
            <motion.div
              className="absolute inset-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                boxShadow: [
                  "0 0 20px rgba(6, 182, 212, 0.5)",
                  "0 0 40px rgba(6, 182, 212, 0.8)",
                  "0 0 20px rgba(6, 182, 212, 0.5)"
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            />
            
            {/* Scanning Lines */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border border-cyan-400/20 rounded-full"
                style={{
                  transform: `scale(${1 + i * 0.3})`
                }}
                animate={{
                  opacity: [0, 0.8, 0],
                  scale: [1 + i * 0.3, 1.5 + i * 0.3, 1 + i * 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
              />
            ))}
            
            {/* Data Particles */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                style={{
                  left: `${50 + 35 * Math.cos(i * 45 * Math.PI / 180)}%`,
                  top: `${50 + 35 * Math.sin(i * 45 * Math.PI / 180)}%`
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.125,
                  ease: "easeInOut"
                }}
              />
            ))}
            
            {/* Central Pulse */}
            <motion.div
              className="absolute inset-8 bg-white/20 rounded-full backdrop-blur-sm"
              animate={{
                scale: [0.8, 1, 0.8],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="text-gray-300"
          >
            Initializing Security Systems...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden relative cyber-grid flex flex-col">
      {/* Advanced Tech Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Simple Matrix Rain - 0s and 1s falling */}
        <div className="absolute inset-0">
          {[...Array(40)].map((_, i) => (
            <motion.div
              key={`matrix-${i}`}
              className="absolute text-green-400/30 text-sm font-mono"
              style={{
                left: `${i * 2.5}%`,
                top: '-10%'
              }}
              animate={{
                y: ['0vh', '110vh'],
                opacity: [0, 0.8, 0]
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 8,
                ease: "linear"
              }}
            >
              {Array.from({ length: 15 }, (_, idx) => (
                <div key={idx} className="mb-1">
                  {Math.random() > 0.5 ? '1' : '0'}
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        {/* Removed horizontal line animations and circuit grid as requested */}

        {/* Holographic Nodes */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`node-${i}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: 'radial-gradient(circle, rgba(6,182,212,0.8) 0%, rgba(59,130,246,0.4) 50%, transparent 100%)'
            }}
            animate={{
              scale: [0.5, 1.5, 0.5],
              opacity: [0.3, 0.8, 0.3],
              rotate: [0, 360]
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut"
            }}
          >
            {/* Node Pulse Ring */}
            <motion.div
              className="absolute inset-0 rounded-full border border-cyan-400/30"
              animate={{
                scale: [1, 3, 1],
                opacity: [0.5, 0, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeOut"
              }}
            />
          </motion.div>
        ))}

        {/* Floating Tech Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1"
            style={{ left: `${particle.x}%`, top: `${particle.y}%` }}
            animate={{
              y: [0, -150, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.2, 0],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-lg shadow-cyan-400/50" />
          </motion.div>
        ))}

        {/* Scanning Lines */}
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'linear-gradient(90deg, transparent 0%, rgba(6,182,212,0.1) 50%, transparent 100%)',
              'linear-gradient(180deg, transparent 0%, rgba(59,130,246,0.1) 50%, transparent 100%)',
              'linear-gradient(270deg, transparent 0%, rgba(139,92,246,0.1) 50%, transparent 100%)',
              'linear-gradient(0deg, transparent 0%, rgba(6,182,212,0.1) 50%, transparent 100%)'
            ]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Advanced Navigation */}
      <AdvancedNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAuthModalOpen={() => setShowAuthModal(true)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto relative z-10 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 300, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -300, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="h-full"
          >
            {activeTab === 'home' && <Home onNavigate={setActiveTab} />}
            {activeTab === 'dashboard' && <Dashboard />}
            {activeTab === 'quiz' && <Quiz />}
            {activeTab === 'tools' && <Tools />}
            {activeTab === 'chatbot' && <Chatbot />}
            {activeTab === 'settings' && <Settings />}
            {activeTab === 'profile' && <Profile />}
            {activeTab === 'admin' && <Admin />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />

      {/* Tech Border Effects */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent" />
      <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
      
      {/* 3D Floating Logo */}
      <FloatingLogo onClick={() => setActiveTab('chatbot')} />
    </div>
  );
};

// Main App component with AuthProvider and LanguageProvider
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
