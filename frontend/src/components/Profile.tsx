import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  Award, 
  Calendar,
  Edit3,
  Camera,
  Save,
  X,
  Settings,
  Bell,
  Lock,
  Eye,
  Globe,
  // Removed unused imports
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  
  const [profileData, setProfileData] = useState({
    username: '',
    full_name: '',
    email: '',
    bio: '',
    avatar_url: '',
    language_preference: 'english' as 'english' | 'burmese',
    role: 'user'
  });

  const [tempData, setTempData] = useState(profileData);

  // Load user profile data
  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      if (data) {
        const profile = {
          username: data.username || '',
          full_name: data.full_name || '',
          email: data.email || user.email || '',
          bio: data.bio || '',
          avatar_url: data.avatar_url || '',
          language_preference: data.language_preference || 'english',
          role: data.role || 'user'
        };
        setProfileData(profile);
        setTempData(profile);
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setMessage({ type: 'error', text: 'File size must be less than 5MB' });
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' });
        return;
      }
      
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    
    const fileExt = avatarFile.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, avatarFile);
    
    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const stats = [
    { label: 'Threats Detected', value: '1,247', icon: Shield, color: 'text-red-400' },
    { label: 'Incidents Resolved', value: '89', icon: Award, color: 'text-green-400' },
    { label: 'Security Score', value: '98%', icon: Eye, color: 'text-cyan-400' },
    { label: 'Days Active', value: '365', icon: Calendar, color: 'text-blue-400' }
  ];

  const achievements = [
    { title: 'Threat Hunter', description: 'Detected 1000+ threats', icon: Shield, color: 'from-red-400 to-red-600' },
    { title: 'Incident Master', description: 'Resolved 50+ critical incidents', icon: Award, color: 'from-yellow-400 to-yellow-600' },
    { title: 'Security Expert', description: 'Maintained 95%+ security score', icon: Lock, color: 'from-green-400 to-green-600' },
    { title: 'Team Player', description: 'Collaborated on 100+ cases', icon: Globe, color: 'from-blue-400 to-blue-600' }
  ];

  const handleSave = async () => {
    if (!user) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      let avatarUrl = tempData.avatar_url;
      
      // Upload new avatar if selected
      if (avatarFile) {
        avatarUrl = await uploadAvatar() || avatarUrl;
      }
      
      const updateData = {
        username: tempData.username,
        full_name: tempData.full_name,
        email: tempData.email,
        bio: tempData.bio,
        avatar_url: avatarUrl,
        language_preference: tempData.language_preference
      };
      
      const { error } = await supabase
        .from('user_profiles')
        .update(updateData)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      setProfileData({ ...tempData, avatar_url: avatarUrl });
      setIsEditing(false);
      setAvatarFile(null);
      setAvatarPreview(null);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempData(profileData);
    setIsEditing(false);
    setAvatarFile(null);
    setAvatarPreview(null);
    setMessage(null);
  };

  return (
    <div className="min-h-screen p-6 overflow-auto">
      <div className="max-w-6xl mx-auto">
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
            User Profile
          </h1>
          <p className="text-gray-300 text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
            Manage your account and security preferences
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card text-center">
              {/* Profile Picture */}
              <div className="relative mb-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative mx-auto w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center cursor-pointer group"
                >
                  <User className="w-16 h-16 text-black" />
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute bottom-2 right-2 bg-gray-800 rounded-full p-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4 text-cyan-400" />
                  </motion.div>
                </motion.div>
              </div>

              {/* Basic Info */}
              <div className="mb-6">
                <h2 
                  className="text-2xl font-bold text-white mb-2"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  {profileData.name}
                </h2>
                <p className="text-cyan-400 font-semibold mb-1" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {profileData.role}
                </p>
                <p className="text-gray-400 text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {profileData.department}
                </p>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-300">
                  <Mail className="w-4 h-4 mr-3 text-cyan-400" />
                  <span className="text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>{profileData.email}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="w-4 h-4 mr-3 text-cyan-400" />
                  <span className="text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>{profileData.phone}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-4 h-4 mr-3 text-cyan-400" />
                  <span className="text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>{profileData.location}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-4 h-4 mr-3 text-cyan-400" />
                  <span className="text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>Joined {profileData.joinDate}</span>
                </div>
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsEditing(!isEditing)}
                className="glass-button bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 mx-auto"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Profile</span>
              </motion.button>
            </div>
          </motion.div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 
                className="text-xl font-bold text-white mb-4"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                Performance Stats
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      className="glass-card text-center"
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                      <div 
                        className="text-2xl font-bold text-white mb-1"
                        style={{ fontFamily: 'Orbitron, monospace' }}
                      >
                        {stat.value}
                      </div>
                      <div className="text-gray-400 text-xs" style={{ fontFamily: 'Orbitron, monospace' }}>
                        {stat.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h3 
                className="text-xl font-bold text-white mb-4"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                Achievements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <motion.div
                      key={achievement.title}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      className="glass-card group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${achievement.color} flex-shrink-0`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 
                            className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors"
                            style={{ fontFamily: 'Orbitron, monospace' }}
                          >
                            {achievement.title}
                          </h4>
                          <p className="text-gray-300 text-sm" style={{ fontFamily: 'Orbitron, monospace' }}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Bio Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-card"
            >
              <h3 
                className="text-xl font-bold text-white mb-4"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                About
              </h3>
              {isEditing ? (
                <div className="space-y-4">
                  <textarea
                    value={tempData.bio}
                    onChange={(e) => setTempData({...tempData, bio: e.target.value})}
                    className="w-full bg-gray-700 text-white p-3 rounded-lg resize-none h-24"
                    style={{ fontFamily: 'Orbitron, monospace' }}
                  />
                  <div className="flex space-x-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSave}
                      className="glass-button bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
                      style={{ fontFamily: 'Orbitron, monospace' }}
                    >
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCancel}
                      className="glass-button text-white px-4 py-2 rounded-lg font-semibold flex items-center space-x-2"
                      style={{ fontFamily: 'Orbitron, monospace' }}
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </motion.button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-300 leading-relaxed" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {profileData.bio}
                </p>
              )}
            </motion.div>

            {/* Quick Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="glass-card"
            >
              <h3 
                className="text-xl font-bold text-white mb-4"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                Quick Settings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button text-white p-4 rounded-xl flex items-center space-x-3"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  <Settings className="w-5 h-5 text-cyan-400" />
                  <span>Account Settings</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button text-white p-4 rounded-xl flex items-center space-x-3"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  <Bell className="w-5 h-5 text-yellow-400" />
                  <span>Notifications</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="glass-button text-white p-4 rounded-xl flex items-center space-x-3"
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  <Lock className="w-5 h-5 text-green-400" />
                  <span>Security</span>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
