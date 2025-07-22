import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Globe, ArrowRight, Star, Award, TrendingUp, MessageCircle, Play, Lock, Eye, Cpu, Network, Database } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedText from './AnimatedText';

interface HomeProps {
  onNavigate?: (tab: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { t } = useLanguage();
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
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Worldwide threat intelligence and security updates',
      color: 'from-green-400 to-cyan-500'
    }
  ];

  const stats = [
    { label: 'Threats Blocked', value: '2.5M+', icon: Shield },
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Security Score', value: '99.8%', icon: Star },
    { label: 'Response Time', value: '<1s', icon: Zap }
  ];

  return (
    <div className="min-h-screen overflow-auto">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-4 sm:py-8">
        <div className="max-w-6xl mx-auto text-center z-10 px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.img
              src="/logo.png"
              alt="SateCha Logo"
              className="w-24 h-24 mx-auto mb-6"
              animate={{ scale: [1, 1.05, 1], opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-4 sm:mb-6 leading-tight"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Welcome to{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                SateCha
              </span>
            </h1>
            <AnimatedText variant="slideUp" delay={0.8} className="text-xl sm:text-2xl text-cyan-300 mb-4 font-orbitron" as="p">
              {t('home.subtitle')}
            </AnimatedText>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto mb-12" style={{ fontFamily: 'Orbitron, monospace' }}>
              Protect yourself and your organization with cutting-edge threat intelligence, 
              real-time monitoring, and AI-powered security solutions.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('dashboard')}
              className="glass-button bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 glow-cyan"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate?.('chatbot')}
              className="glass-button bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-xl font-semibold flex items-center space-x-2 glow-purple"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Chat with AI</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.6 }}
                  className="glass-card text-center"
                >
                  <Icon className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>
                    {stat.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="text-center mb-16"
          >
            <AnimatedText variant="wave" delay={0.5} className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 font-orbitron" as="h1">
              {t('home.welcome')}
            </AnimatedText>
            <AnimatedText variant="fadeIn" delay={1.1} className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto font-orbitron" as="p">
              {t('home.description')}
            </AnimatedText>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 + 1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="glass-card group cursor-pointer"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} flex-shrink-0`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 
                        className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors"
                        style={{ fontFamily: 'Orbitron, monospace' }}
                      >
                        {feature.title}
                      </h3>
                      <p className="text-gray-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="glass-card"
          >
            <h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Ready to Secure Your Digital World?
            </h2>
            <p className="text-lg text-gray-300 mb-8" style={{ fontFamily: 'Orbitron, monospace' }}>
              Join thousands of users who trust SateCha for their cybersecurity needs
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-12 py-4 rounded-xl font-semibold text-lg glow-cyan"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              Start Your Security Journey
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
