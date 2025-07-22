import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  User, 
  BarChart3, 
  Settings as SettingsIcon, 
  Wrench, 
  LogOut, 
  MessageCircle,
  Menu,
  X,
  Crown,
  Bell,
  Search,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedText from './AnimatedText';

interface AdvancedNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onAuthModalOpen: () => void;
}

const AdvancedNavigation: React.FC<AdvancedNavigationProps> = ({ 
  activeTab, 
  onTabChange, 
  onAuthModalOpen 
}) => {
  const { user, signOut } = useAuth();
  const { language } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      id: 'dashboard', 
      label: language === 'en' ? 'Dashboard' : 'ဒက်ရှ်ဘုတ်', 
      icon: Shield,
      gradient: 'from-cyan-500 to-blue-600',
      description: language === 'en' ? 'Security Overview' : 'လုံခြုံရေး ခြုံငုံသုံးသပ်ချက်'
    },
    { 
      id: 'quiz', 
      label: language === 'en' ? 'Quiz' : 'ဉာဏ်စမ်း', 
      icon: BarChart3,
      gradient: 'from-purple-500 to-pink-600',
      description: language === 'en' ? 'Test Knowledge' : 'အသိပညာ စမ်းသပ်မှု'
    },
    { 
      id: 'tools', 
      label: language === 'en' ? 'Tools' : 'ကိရိယာများ', 
      icon: Wrench,
      gradient: 'from-green-500 to-emerald-600',
      description: language === 'en' ? 'Security Tools' : 'လုံခြုံရေး ကိရိယာများ'
    },
    { 
      id: 'chatbot', 
      label: language === 'en' ? 'AI Chat' : 'AI စကားပြော', 
      icon: MessageCircle,
      gradient: 'from-orange-500 to-red-600',
      description: language === 'en' ? 'AI Assistant' : 'AI လက်ထောက်'
    },
    { 
      id: 'settings', 
      label: language === 'en' ? 'Settings' : 'ဆက်တင်များ', 
      icon: SettingsIcon,
      gradient: 'from-indigo-500 to-purple-600',
      description: language === 'en' ? 'Preferences' : 'နှစ်သက်မှုများ'
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    onTabChange('home');
    setIsProfileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      {/* Main Navigation Bar */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-gray-900/95 backdrop-blur-xl border-b border-cyan-500/30 shadow-2xl' 
            : 'bg-gray-900/80 backdrop-blur-md border-b border-cyan-500/20'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo Section */}
            <motion.button
              onClick={() => onTabChange('home')}
              className="flex items-center space-x-3 group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative">
                <motion.img
                  src="/logo.png"
                  alt="SateCha Logo"
                  className="w-10 h-10 lg:w-12 lg:h-12 object-contain"
                  animate={{ 
                    filter: activeTab === 'home' 
                      ? ['hue-rotate(0deg)', 'hue-rotate(360deg)', 'hue-rotate(0deg)']
                      : 'hue-rotate(0deg)'
                  }}
                  transition={{ duration: 3, repeat: activeTab === 'home' ? Infinity : 0 }}
                />
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-blue-500/30 rounded-lg blur-lg -z-10"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
              <div className="hidden sm:block">
                <AnimatedText 
                  variant="glow" 
                  className="text-xl lg:text-2xl font-bold text-white"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  SateCha
                </AnimatedText>
                <p className="text-xs lg:text-sm text-cyan-400 font-medium">
                  {language === 'en' ? 'Cybersecurity Platform' : 'ဆိုက်ဘာလုံခြုံရေး ပလပ်ဖောင်'}
                </p>
              </div>
            </motion.button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <motion.button
                      onClick={() => onTabChange(item.id)}
                      className={`relative px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center space-x-2 overflow-hidden ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'text-gray-300 hover:text-white'
                      }`}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {/* Active Background */}
                      {isActive && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} rounded-xl`}
                          layoutId="activeTab"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      
                      {/* Hover Background */}
                      {!isActive && (
                        <motion.div
                          className={`absolute inset-0 bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-20 rounded-xl transition-opacity duration-300`}
                        />
                      )}

                      {/* Icon with Glow Effect */}
                      <motion.div className="relative z-10">
                        {isActive && (
                          <motion.div
                            className="absolute inset-0 bg-white/30 rounded-full blur-sm"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.3, 0.6, 0.3]
                            }}
                            transition={{ duration: 2, repeat: Infinity }}
                          />
                        )}
                        <Icon className="w-5 h-5 relative z-10" />
                      </motion.div>
                      
                      {/* Label */}
                      <span className="relative z-10 font-bold tracking-wide">
                        {item.label}
                      </span>

                      {/* Floating Particles for Active Tab */}
                      {isActive && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="absolute w-1 h-1 bg-white/60 rounded-full"
                              style={{
                                left: `${20 + Math.random() * 60}%`,
                                top: `${20 + Math.random() * 60}%`
                              }}
                              animate={{
                                y: [-3, -8, -3],
                                x: [0, Math.random() * 6 - 3, 0],
                                opacity: [0, 1, 0],
                                scale: [0, 1, 0]
                              }}
                              transition={{
                                duration: 1.5 + Math.random() * 0.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut"
                              }}
                            />
                          ))}
                        </div>
                      )}
                    </motion.button>

                    {/* Tooltip */}
                    <motion.div
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-gray-800/90 backdrop-blur-sm text-white text-xs rounded-lg border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-50"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 0, y: -10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                    >
                      {item.description}
                      <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45 border-l border-t border-cyan-500/30"></div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  {/* Notifications */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="relative p-2 text-gray-400 hover:text-white transition-colors hidden sm:block"
                  >
                    <Bell className="w-5 h-5" />
                    <motion.div
                      className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.button>

                  {/* Profile Menu */}
                  <div className="relative">
                    <motion.button
                      onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                      className="flex items-center space-x-2 p-2 rounded-xl bg-gray-800/50 hover:bg-gray-700/50 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-white" />
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-white text-sm font-semibold">{user.email?.split('@')[0]}</p>
                        <p className="text-gray-400 text-xs">
                          {language === 'en' ? 'Online' : 'အွန်လိုင်း'}
                        </p>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.button>

                    {/* Profile Dropdown */}
                    <AnimatePresence>
                      {isProfileMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute right-0 top-full mt-2 w-64 bg-gray-800/95 backdrop-blur-xl rounded-xl border border-cyan-500/30 shadow-2xl overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-gray-700/50">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <p className="text-white font-semibold">{user.email}</p>
                                <p className="text-gray-400 text-sm">
                                  {language === 'en' ? 'Verified Account' : 'အတည်ပြုထားသော အကောင့်'}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-2">
                            <motion.button
                              onClick={() => {
                                onTabChange('profile');
                                setIsProfileMenuOpen(false);
                              }}
                              className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors"
                              whileHover={{ x: 4 }}
                            >
                              <User className="w-4 h-4" />
                              <span>{language === 'en' ? 'Profile Settings' : 'ပရိုဖိုင် ဆက်တင်များ'}</span>
                            </motion.button>
                            
                            <motion.button
                              onClick={handleSignOut}
                              className="w-full flex items-center space-x-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                              whileHover={{ x: 4 }}
                            >
                              <LogOut className="w-4 h-4" />
                              <span>{language === 'en' ? 'Sign Out' : 'ထွက်ရန်'}</span>
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <motion.button
                  onClick={onAuthModalOpen}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {language === 'en' ? 'Sign In' : 'ဝင်ရန်'}
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={toggleMobileMenu}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-16 right-0 bottom-0 w-80 bg-gray-900/95 backdrop-blur-xl border-l border-cyan-500/30 z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="space-y-2">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          onTabChange(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center space-x-4 p-4 rounded-xl font-semibold transition-all duration-300 ${
                          isActive
                            ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }`}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="relative">
                          {isActive && (
                            <motion.div
                              className="absolute inset-0 bg-white/30 rounded-full blur-sm"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.6, 0.3]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          )}
                          <Icon className="w-6 h-6 relative z-10" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold">{item.label}</p>
                          <p className="text-sm opacity-70">{item.description}</p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Mobile User Section */}
                {user && (
                  <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <div className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-xl mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{user.email}</p>
                        <p className="text-gray-400 text-sm">
                          {language === 'en' ? 'Verified Account' : 'အတည်ပြုထားသော အကောင့်'}
                        </p>
                      </div>
                    </div>
                    
                    <motion.button
                      onClick={() => {
                        onTabChange('profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors mb-2"
                      whileHover={{ x: 4 }}
                    >
                      <User className="w-5 h-5" />
                      <span>{language === 'en' ? 'Profile Settings' : 'ပရိုဖိုင် ဆက်တင်များ'}</span>
                    </motion.button>
                    
                    <motion.button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-3 p-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                      whileHover={{ x: 4 }}
                    >
                      <LogOut className="w-5 h-5" />
                      <span>{language === 'en' ? 'Sign Out' : 'ထွက်ရန်'}</span>
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Click outside handler for profile menu */}
      {isProfileMenuOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default AdvancedNavigation;
