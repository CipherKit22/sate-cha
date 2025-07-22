import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Scan, 
  Key, 
  Globe, 
  Lock, 
  Eye, 
  AlertTriangle, 
  CheckCircle,
  Copy,
  RefreshCw,
  Download,
  Upload,
  Search,
  Zap
} from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  category: string;
  color: string;
  action: () => void;
}

const Tools: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [passwordLength, setPasswordLength] = useState(16);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let charset = lowercase + uppercase + numbers;
    if (includeSymbols) charset += symbols;
    
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    setGeneratedPassword(password);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const simulatePortScan = () => {
    setIsScanning(true);
    setScanResult(null);
    
    setTimeout(() => {
      setScanResult(`Port Scan Complete:
• Port 22 (SSH): Open
• Port 80 (HTTP): Open  
• Port 443 (HTTPS): Open
• Port 21 (FTP): Closed
• Port 25 (SMTP): Filtered
• Port 3389 (RDP): Closed

Recommendation: Close unnecessary open ports and enable firewall protection.`);
      setIsScanning(false);
    }, 3000);
  };

  const tools: Tool[] = [
    {
      id: 'password-generator',
      name: 'Password Generator',
      description: 'Generate secure, random passwords',
      icon: Key,
      category: 'security',
      color: 'from-green-400 to-emerald-500',
      action: generatePassword
    },
    {
      id: 'port-scanner',
      name: 'Port Scanner',
      description: 'Scan for open ports and vulnerabilities',
      icon: Scan,
      category: 'network',
      color: 'from-blue-400 to-cyan-500',
      action: simulatePortScan
    },
    {
      id: 'hash-checker',
      name: 'Hash Checker',
      description: 'Verify file integrity with hash comparison',
      icon: Shield,
      category: 'security',
      color: 'from-purple-400 to-pink-500',
      action: () => console.log('Hash checker activated')
    },
    {
      id: 'ssl-checker',
      name: 'SSL Certificate Checker',
      description: 'Validate SSL certificates and security',
      icon: Lock,
      category: 'network',
      color: 'from-orange-400 to-red-500',
      action: () => console.log('SSL checker activated')
    },
    {
      id: 'privacy-scanner',
      name: 'Privacy Scanner',
      description: 'Scan for privacy leaks and tracking',
      icon: Eye,
      category: 'privacy',
      color: 'from-indigo-400 to-purple-500',
      action: () => console.log('Privacy scanner activated')
    },
    {
      id: 'threat-intel',
      name: 'Threat Intelligence',
      description: 'Real-time threat intelligence feeds',
      icon: AlertTriangle,
      category: 'intelligence',
      color: 'from-yellow-400 to-orange-500',
      action: () => console.log('Threat intel activated')
    }
  ];

  const categories = [
    { id: 'all', name: 'All Tools', icon: Globe },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'network', name: 'Network', icon: Scan },
    { id: 'privacy', name: 'Privacy', icon: Eye },
    { id: 'intelligence', name: 'Intelligence', icon: AlertTriangle }
  ];

  const filteredTools = activeCategory === 'all' 
    ? tools 
    : tools.filter(tool => tool.category === activeCategory);

  return (
    <div className="min-h-screen p-6 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 
            className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: 'Orbitron, monospace' }}
          >
            Security Tools
          </h1>
          <p className="text-gray-300 text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
            Comprehensive cybersecurity toolkit for professionals
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-8"
        >
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(category.id)}
                  className={`glass-button flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeCategory === category.id
                      ? 'text-cyan-400 glow-cyan'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <AnimatePresence>
            {filteredTools.map((tool, index) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="glass-card group cursor-pointer"
                  onClick={tool.action}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${tool.color} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 
                        className="text-lg font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors"
                        style={{ fontFamily: 'Orbitron, monospace' }}
                      >
                        {tool.name}
                      </h3>
                      <p className="text-gray-300 text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {tool.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Tool Interfaces */}
        <div className="space-y-6">
          {/* Password Generator Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card"
          >
            <h3 
              className="text-xl font-bold text-white mb-4 flex items-center"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <Key className="w-5 h-5 mr-2 text-green-400" />
              Password Generator
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Password Length: {passwordLength}
                </label>
                <input
                  type="range"
                  min="8"
                  max="32"
                  value={passwordLength}
                  onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                  className="w-full accent-cyan-400"
                />
                
                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="symbols"
                    checked={includeSymbols}
                    onChange={(e) => setIncludeSymbols(e.target.checked)}
                    className="mr-2 accent-cyan-400"
                  />
                  <label htmlFor="symbols" className="text-gray-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Include symbols
                  </label>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={generatePassword}
                  className="glass-button bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold mt-4 flex items-center space-x-2"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Generate Password</span>
                </motion.button>
              </div>
              
              {generatedPassword && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card bg-gray-800/50"
                >
                  <label className="block text-gray-300 mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Generated Password:
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={generatedPassword}
                      readOnly
                      className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg font-mono text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => copyToClipboard(generatedPassword)}
                      className="glass-button p-2 rounded-lg text-cyan-400"
                    >
                      <Copy className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Port Scanner Interface */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card"
          >
            <h3 
              className="text-xl font-bold text-white mb-4 flex items-center"
              style={{ fontFamily: 'Orbitron, monospace' }}
            >
              <Scan className="w-5 h-5 mr-2 text-blue-400" />
              Port Scanner
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-300 mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Target IP/Domain:
                </label>
                <input
                  type="text"
                  placeholder="127.0.0.1 or example.com"
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded-lg mb-4"
                />
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={simulatePortScan}
                  disabled={isScanning}
                  className="glass-button bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  {isScanning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </motion.div>
                      <span>Scanning...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Start Scan</span>
                    </>
                  )}
                </motion.button>
              </div>
              
              {scanResult && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-card bg-gray-800/50"
                >
                  <label className="block text-gray-300 mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                    Scan Results:
                  </label>
                  <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                    {scanResult}
                  </pre>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Tools;
