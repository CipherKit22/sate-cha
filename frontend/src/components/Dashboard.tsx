import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, TrendingUp, Eye, FileText, Cpu, Zap, Lock, Globe, Activity, Users, Database, Terminal, Share2, Copy, MessageCircle, Send, X, Calendar, MapPin, User } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalThreats: 1247,
    blockedAttacks: 892,
    activeScans: 15,
    systemHealth: 98.7
  });

  const [realTimeData, setRealTimeData] = useState([]);
  const [selectedMoment, setSelectedMoment] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [viewMode, setViewMode] = useState('gallery'); // 'gallery' or 'list'

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalThreats: prev.totalThreats + Math.floor(Math.random() * 3),
        blockedAttacks: prev.blockedAttacks + Math.floor(Math.random() * 2),
        activeScans: Math.floor(Math.random() * 20) + 10
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const StatCard = ({ title, value, icon: Icon, color, trend, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.05, y: -5 }}
      className="relative group"
    >
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
            <motion.p 
              key={value}
              initial={{ scale: 1.2, color: "#06b6d4" }}
              animate={{ scale: 1, color: "#ffffff" }}
              className="text-3xl font-bold text-white"
            >
              {typeof value === 'number' ? value.toLocaleString() : value}
            </motion.p>
            {trend && (
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
                <span className="text-green-400 text-sm">+{trend}%</span>
              </div>
            )}
          </div>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="relative"
          >
            <div className={`p-4 rounded-full bg-gradient-to-r ${color} shadow-lg`}>
              <Icon className="w-6 h-6 text-black" />
            </div>
            <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${color} blur-lg opacity-50`} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const threatData = [
    { type: 'Malware', count: 342, severity: 'high', color: 'from-red-500 to-red-600' },
    { type: 'Phishing', count: 189, severity: 'medium', color: 'from-yellow-500 to-yellow-600' },
    { type: 'DDoS', count: 76, severity: 'high', color: 'from-red-500 to-red-600' },
    { type: 'Intrusion', count: 23, severity: 'critical', color: 'from-purple-500 to-purple-600' }
  ];

  // Moments/Crimes data for gallery
  const momentsData = [
    {
      id: 1,
      title: 'Advanced Persistent Threat Detected',
      description: 'Sophisticated malware campaign targeting financial institutions discovered.',
      type: 'crime',
      severity: 'critical',
      date: '2025-01-20',
      location: 'Global',
      author: 'Cyber Intelligence Team',
      tags: ['APT', 'Banking', 'Malware'],
      details: 'A new advanced persistent threat (APT) group has been identified targeting major financial institutions worldwide. The attack vector involves sophisticated spear-phishing campaigns followed by lateral movement through compromised networks.'
    },
    {
      id: 2,
      title: 'Zero-Day Vulnerability Patched',
      description: 'Critical zero-day exploit in popular web framework successfully mitigated.',
      type: 'moment',
      severity: 'high',
      date: '2025-01-19',
      location: 'Worldwide',
      author: 'Security Research Team',
      tags: ['Zero-Day', 'Web Security', 'Patch'],
      details: 'Our security team successfully identified and coordinated the patching of a critical zero-day vulnerability affecting millions of web applications globally.'
    },
    {
      id: 3,
      title: 'Ransomware Group Disrupted',
      description: 'International operation successfully dismantles major ransomware operation.',
      type: 'moment',
      severity: 'high',
      date: '2025-01-18',
      location: 'International',
      author: 'Law Enforcement Coalition',
      tags: ['Ransomware', 'Law Enforcement', 'Success'],
      details: 'A coordinated international effort has successfully disrupted one of the most prolific ransomware groups, preventing millions in potential damages.'
    },
    {
      id: 4,
      title: 'IoT Botnet Campaign Exposed',
      description: 'Massive IoT botnet compromising smart home devices worldwide.',
      type: 'crime',
      severity: 'medium',
      date: '2025-01-17',
      location: 'Global',
      author: 'IoT Security Division',
      tags: ['IoT', 'Botnet', 'Smart Devices'],
      details: 'Investigation reveals a sophisticated botnet operation targeting vulnerable IoT devices, creating a network of compromised smart home systems.'
    },
    {
      id: 5,
      title: 'AI-Powered Threat Detection Breakthrough',
      description: 'New machine learning model achieves 99.7% accuracy in threat detection.',
      type: 'moment',
      severity: 'low',
      date: '2025-01-16',
      location: 'Research Lab',
      author: 'AI Security Team',
      tags: ['AI', 'Machine Learning', 'Innovation'],
      details: 'Revolutionary AI system demonstrates unprecedented accuracy in identifying and classifying cybersecurity threats in real-time.'
    }
  ];

  // Sharing functions
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const shareToViber = (moment: any) => {
    const text = `Check out this cybersecurity update: ${moment.title} - ${window.location.origin}/moment/${moment.id}`;
    window.open(`viber://forward?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToTelegram = (moment: any) => {
    const text = `🔒 ${moment.title}\n\n${moment.description}\n\nRead more: ${window.location.origin}/moment/${moment.id}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(window.location.origin + '/moment/' + moment.id)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareToMessenger = (moment: any) => {
    const url = `${window.location.origin}/moment/${moment.id}`;
    window.open(`https://www.facebook.com/dialog/send?link=${encodeURIComponent(url)}&app_id=YOUR_APP_ID`, '_blank');
  };

  return (
    <div className="min-h-screen bg-transparent p-6 text-white">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 pt-8"
      >
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 px-4"
        >
          Cyber Command Center
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto px-4"
        >
          Real-time cybersecurity monitoring and threat intelligence dashboard
        </motion.p>
      </motion.div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Threats Detected"
            value={stats.totalThreats}
            icon={AlertTriangle}
            color="from-red-400 to-red-600"
            trend={12}
            delay={0.1}
          />
          <StatCard
            title="Attacks Blocked"
            value={stats.blockedAttacks}
            icon={Shield}
            color="from-green-400 to-green-600"
            trend={8}
            delay={0.2}
          />
          <StatCard
            title="Active Scans"
            value={stats.activeScans}
            icon={Activity}
            color="from-blue-400 to-blue-600"
            delay={0.3}
          />
          <StatCard
            title="System Health"
            value={`${stats.systemHealth}%`}
            icon={Cpu}
            color="from-cyan-400 to-cyan-600"
            trend={2}
            delay={0.4}
          />
        </div>
      </div>

      {/* Threat Analysis Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Real-time Threats */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20">
            <div className="flex items-center mb-6">
              <AlertTriangle className="w-6 h-6 text-red-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Active Threat Categories</h3>
            </div>
            <div className="space-y-4">
              {threatData.map((threat, index) => (
                <motion.div
                  key={threat.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center justify-between p-4 bg-black/30 rounded-lg border border-gray-700/50"
                >
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${threat.color} mr-3`} />
                    <span className="text-white font-medium">{threat.type}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{threat.count}</div>
                    <div className={`text-xs ${
                      threat.severity === 'critical' ? 'text-purple-400' :
                      threat.severity === 'high' ? 'text-red-400' :
                      threat.severity === 'medium' ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {threat.severity.toUpperCase()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20">
            <div className="flex items-center mb-6">
              <Cpu className="w-6 h-6 text-cyan-400 mr-3" />
              <h3 className="text-xl font-bold text-white">System Status</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Firewall', status: 'Active', health: 98 },
                { label: 'Antivirus', status: 'Scanning', health: 95 },
                { label: 'VPN', status: 'Connected', health: 100 },
                { label: 'Intrusion Detection', status: 'Monitoring', health: 92 }
              ].map((system, index) => (
                <motion.div
                  key={system.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="text-white font-medium">{system.label}</div>
                    <div className="text-gray-400 text-sm">{system.status}</div>
                  </div>
                  <div className="flex items-center">
                    <div className="w-16 h-2 bg-gray-700 rounded-full mr-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${system.health}%` }}
                        transition={{ delay: 1.2 + index * 0.1, duration: 1 }}
                        className={`h-full rounded-full ${
                          system.health >= 95 ? 'bg-green-400' :
                          system.health >= 80 ? 'bg-yellow-400' : 'bg-red-400'
                        }`}
                      />
                    </div>
                    <span className="text-white text-sm font-bold">{system.health}%</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="max-w-7xl mx-auto"
      >
        <h3 className="text-2xl font-bold text-white mb-6 text-center">Security Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: 'Vulnerability Scan', icon: Terminal, description: 'Run comprehensive security scan', color: 'from-purple-500 to-purple-600' },
            { title: 'Network Monitor', icon: Globe, description: 'Monitor network traffic in real-time', color: 'from-blue-500 to-blue-600' },
            { title: 'Threat Intelligence', icon: Database, description: 'Access latest threat databases', color: 'from-green-500 to-green-600' }
          ].map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-center mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-r ${tool.color} mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">{tool.title}</h4>
                </div>
                <p className="text-gray-400 mb-4">{tool.description}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-lg font-medium hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
                >
                  Launch Tool
                </motion.button>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Moments/Crimes Gallery Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8 }}
        className="max-w-7xl mx-auto mt-16"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-bold text-white">Cyber Intelligence Feed</h3>
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('gallery')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                viewMode === 'gallery'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'glass-button text-gray-300 hover:text-white'
              }`}
            >
              Gallery
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white'
                  : 'glass-button text-gray-300 hover:text-white'
              }`}
            >
              List
            </motion.button>
          </div>
        </div>

        {/* Gallery View */}
        {viewMode === 'gallery' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {momentsData.map((moment, index) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => setSelectedMoment(moment)}
                className="bg-gray-900/50 backdrop-blur-xl rounded-xl overflow-hidden border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer group"
              >
                <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                  <div className={`p-4 rounded-full ${
                    moment.type === 'crime' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                      : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}>
                    {moment.type === 'crime' ? (
                      <AlertTriangle className="w-8 h-8 text-white" />
                    ) : (
                      <Shield className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      moment.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                      moment.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                      moment.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {moment.severity.toUpperCase()}
                    </span>
                    <span className="text-gray-400 text-xs">{moment.date}</span>
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                    {moment.title}
                  </h4>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{moment.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {moment.location}
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowShareModal(true);
                        setSelectedMoment(moment);
                      }}
                      className="p-2 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                    >
                      <Share2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {momentsData.map((moment, index) => (
              <motion.div
                key={moment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2 + index * 0.1 }}
                whileHover={{ scale: 1.01, x: 5 }}
                onClick={() => setSelectedMoment(moment)}
                className="bg-gray-900/50 backdrop-blur-xl rounded-xl p-6 border border-cyan-500/20 hover:border-cyan-400/40 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-full ${
                      moment.type === 'crime' 
                        ? 'bg-gradient-to-r from-red-500 to-red-600' 
                        : 'bg-gradient-to-r from-green-500 to-green-600'
                    }`}>
                      {moment.type === 'crime' ? (
                        <AlertTriangle className="w-5 h-5 text-white" />
                      ) : (
                        <Shield className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                          {moment.title}
                        </h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          moment.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          moment.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          moment.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
                          {moment.severity.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-gray-400 mb-3">{moment.description}</p>
                      <div className="flex items-center space-x-4 text-gray-400 text-sm">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {moment.date}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {moment.location}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {moment.author}
                        </div>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShareModal(true);
                      setSelectedMoment(moment);
                    }}
                    className="p-2 rounded-full bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setSelectedMoment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-cyan-500/30"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4">
                  <div className={`p-4 rounded-full ${
                    selectedMoment.type === 'crime' 
                      ? 'bg-gradient-to-r from-red-500 to-red-600' 
                      : 'bg-gradient-to-r from-green-500 to-green-600'
                  }`}>
                    {selectedMoment.type === 'crime' ? (
                      <AlertTriangle className="w-6 h-6 text-white" />
                    ) : (
                      <Shield className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{selectedMoment.title}</h3>
                    <div className="flex items-center space-x-4 text-gray-400 text-sm mb-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        selectedMoment.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                        selectedMoment.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                        selectedMoment.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {selectedMoment.severity.toUpperCase()}
                      </span>
                      <span>{selectedMoment.date}</span>
                      <span>{selectedMoment.location}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedMoment(null)}
                  className="p-2 rounded-full bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">{selectedMoment.details}</p>
              
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMoment.tags.map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                <div className="text-gray-400 text-sm">
                  <span>By {selectedMoment.author}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowShareModal(true);
                  }}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 flex items-center space-x-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && selectedMoment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full border border-cyan-500/30"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Share This Update</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowShareModal(false)}
                  className="p-2 rounded-full bg-gray-700/50 text-gray-400 hover:text-white hover:bg-gray-600/50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>
              
              <div className="space-y-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => copyToClipboard(`${window.location.origin}/moment/${selectedMoment.id}`)}
                  className="w-full flex items-center space-x-3 p-4 bg-gray-800/50 rounded-xl hover:bg-gray-700/50 transition-colors text-left"
                >
                  <Copy className="w-5 h-5 text-cyan-400" />
                  <div>
                    <div className="text-white font-medium">Copy Link</div>
                    <div className="text-gray-400 text-sm">Copy link to clipboard</div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToViber(selectedMoment)}
                  className="w-full flex items-center space-x-3 p-4 bg-purple-500/20 rounded-xl hover:bg-purple-500/30 transition-colors text-left"
                >
                  <MessageCircle className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-white font-medium">Share to Viber</div>
                    <div className="text-gray-400 text-sm">Share via Viber messenger</div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToTelegram(selectedMoment)}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-500/20 rounded-xl hover:bg-blue-500/30 transition-colors text-left"
                >
                  <Send className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Share to Telegram</div>
                    <div className="text-gray-400 text-sm">Share via Telegram</div>
                  </div>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => shareToMessenger(selectedMoment)}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-600/20 rounded-xl hover:bg-blue-600/30 transition-colors text-left"
                >
                  <MessageCircle className="w-5 h-5 text-blue-400" />
                  <div>
                    <div className="text-white font-medium">Share to Messenger</div>
                    <div className="text-gray-400 text-sm">Share via Facebook Messenger</div>
                  </div>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
