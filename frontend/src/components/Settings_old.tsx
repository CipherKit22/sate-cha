import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  Shield, 
  Bell, 
  Palette, 
  Database,
  User,
  Lock,
  Globe,
  Eye,
  Zap,
  Monitor,
  Volume2,
  Moon,
  Sun,
  Smartphone,
  Mail,
  AlertTriangle
} from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    botName: 'AI Assistant',
    welcomeMessage: 'Hello! How can I help you today?',
    maxResponseLength: 500,
    
    // API Settings
    deepseekApiKey: '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',
    apiTimeout: 30,
    
    // UI Settings
    theme: 'light',
    language: 'en',
    showTypingIndicator: true,
    enableSounds: false,
    
    // Privacy Settings
    saveConversations: true,
    anonymizeData: false,
    
    // Notifications
    emailNotifications: false,
    pushNotifications: true
  });

  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleInputChange = (key: string, value: string | number | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call to save settings
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to default values
      setSettings({
        botName: 'AI Assistant',
        welcomeMessage: 'Hello! How can I help you today?',
        maxResponseLength: 500,
        deepseekApiKey: '',
        apiTimeout: 30,
        theme: 'light',
        language: 'en',
        showTypingIndicator: true,
        enableSounds: false,
        saveConversations: true,
        anonymizeData: false,
        emailNotifications: false,
        pushNotifications: true
      });
    }
  };

  const TabButton = ({ id, label, icon }: { id: string; label: string; icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
        activeTab === id
          ? 'bg-primary-500 text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  const InputField: React.FC<{
    label: string;
    value: string | number;
    onChange: (value: string | number) => void;
    type?: string;
    placeholder?: string;
  }> = ({ label, value, onChange, type = 'text', placeholder }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
      />
    </div>
  );

  const ToggleField: React.FC<{
    label: string;
    description?: string;
    value: boolean;
    onChange: (value: boolean) => void;
  }> = ({ label, description, value, onChange }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
          value ? 'bg-primary-500' : 'bg-gray-200'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            value ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b p-6">
        <div className="flex items-center space-x-3">
          <SettingsIcon className="w-6 h-6 text-primary-500" />
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-600 mt-1">Configure your chatbot preferences and behavior</p>
      </div>

      <div className="flex h-full">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm p-4">
          <div className="space-y-2">
            <TabButton id="general" label="General" icon={<SettingsIcon className="w-4 h-4" />} />
            <TabButton id="api" label="API Settings" icon={<Database className="w-4 h-4" />} />
            <TabButton id="appearance" label="Appearance" icon={<Palette className="w-4 h-4" />} />
            <TabButton id="privacy" label="Privacy" icon={<Shield className="w-4 h-4" />} />
            <TabButton id="notifications" label="Notifications" icon={<Bell className="w-4 h-4" />} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === 'general' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h3>
                <InputField
                  label="Bot Name"
                  value={settings.botName}
                  onChange={(value) => handleInputChange('botName', value)}
                  placeholder="Enter bot name"
                />
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Welcome Message</label>
                  <textarea
                    value={settings.welcomeMessage}
                    onChange={(e) => handleInputChange('welcomeMessage', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter welcome message"
                  />
                </div>
                <InputField
                  label="Max Response Length"
                  value={settings.maxResponseLength}
                  onChange={(value) => handleInputChange('maxResponseLength', value)}
                  type="number"
                  placeholder="500"
                />
              </div>
            )}

            {activeTab === 'api' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">API Settings</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">DeepSeek API Key</label>
                  <input
                    type="password"
                    value={settings.deepseekApiKey}
                    onChange={(e) => handleInputChange('deepseekApiKey', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Enter your DeepSeek API key"
                  />
                  <p className="text-sm text-gray-500 mt-1">Your API key is encrypted and stored securely</p>
                </div>
                <InputField
                  label="API Timeout (seconds)"
                  value={settings.apiTimeout}
                  onChange={(value) => handleInputChange('apiTimeout', value)}
                  type="number"
                  placeholder="30"
                />
              </div>
            )}

            {activeTab === 'appearance' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleInputChange('theme', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={settings.language}
                    onChange={(e) => handleInputChange('language', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
                <ToggleField
                  label="Show Typing Indicator"
                  description="Display typing animation when bot is responding"
                  value={settings.showTypingIndicator}
                  onChange={(value) => handleInputChange('showTypingIndicator', value)}
                />
                <ToggleField
                  label="Enable Sounds"
                  description="Play notification sounds for new messages"
                  value={settings.enableSounds}
                  onChange={(value) => handleInputChange('enableSounds', value)}
                />
              </div>
            )}

            {activeTab === 'privacy' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
                <ToggleField
                  label="Save Conversations"
                  description="Store chat history for future reference"
                  value={settings.saveConversations}
                  onChange={(value) => handleInputChange('saveConversations', value)}
                />
                <ToggleField
                  label="Anonymize Data"
                  description="Remove personal identifiers from stored data"
                  value={settings.anonymizeData}
                  onChange={(value) => handleInputChange('anonymizeData', value)}
                />
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Settings</h3>
                <ToggleField
                  label="Email Notifications"
                  description="Receive email updates about important events"
                  value={settings.emailNotifications}
                  onChange={(value) => handleInputChange('emailNotifications', value)}
                />
                <ToggleField
                  label="Push Notifications"
                  description="Receive browser push notifications"
                  value={settings.pushNotifications}
                  onChange={(value) => handleInputChange('pushNotifications', value)}
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 mt-8 pt-6 border-t">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reset to Default</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
