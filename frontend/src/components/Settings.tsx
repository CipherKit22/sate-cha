import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
<<<<<<< HEAD
=======
import FeedbackForm from './FeedbackForm';
import FeedbackViewer from './FeedbackViewer';
>>>>>>> daf97b202766d82f427622fa997fdfa044882444
import AnimatedText from './AnimatedText';
import { 
  User,
  Globe,
  MessageSquare,
  FileText,
  Shield,
  BookOpen,
  ChevronRight
} from 'lucide-react';

const Settings: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { user } = useAuth();
<<<<<<< HEAD
=======
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showFeedbackViewer, setShowFeedbackViewer] = useState(false);
>>>>>>> daf97b202766d82f427622fa997fdfa044882444
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleLanguageChange = (newLanguage: 'en' | 'my') => {
    setLanguage(newLanguage);
  };

  const toggleSection = (section: string) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const settingsItems = [
    {
      id: 'profile',
      title: language === 'en' ? 'Profile Settings' : 'ပရိုဖိုင် ဆက်တင်များ',
      icon: User,
      description: language === 'en' ? 'Manage your account information' : 'သင့်အကောင့် အချက်အလက်များကို စီမံပါ',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">{user?.email || 'User'}</h3>
                <p className="text-gray-400 text-sm">{language === 'en' ? 'Verified Account' : 'အတည်ပြုထားသော အကောင့်'}</p>
              </div>
            </div>
          </div>
          <div className="text-gray-300 text-sm">
            {language === 'en' 
              ? 'Profile editing is available in the navigation bar profile section.' 
              : 'ပရိုဖိုင် တည်းဖြတ်ခြင်းကို navigation bar ရှိ profile အပိုင်းတွင် ရရှိနိုင်ပါသည်။'
            }
          </div>
        </div>
      )
    },
    {
      id: 'language',
      title: language === 'en' ? 'Language Settings' : 'ဘာသာစကား ဆက်တင်များ',
      icon: Globe,
      description: language === 'en' ? 'Choose your preferred language' : 'သင်နှစ်သက်သော ဘာသာစကားကို ရွေးချယ်ပါ',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageChange('en')}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === 'en'
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                  : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">English</div>
                <div className="text-sm opacity-70">Default language</div>
              </div>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleLanguageChange('my')}
              className={`p-4 rounded-lg border-2 transition-all ${
                language === 'my'
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300'
                  : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="text-left">
                <div className="font-semibold">မြန်မာ</div>
                <div className="text-sm opacity-70">Burmese</div>
              </div>
            </motion.button>
          </div>
        </div>
      )
    },
    {
<<<<<<< HEAD
=======
      id: 'feedback',
      title: language === 'en' ? 'Feedback' : 'အကြံပြုချက်များ',
      icon: MessageSquare,
      description: language === 'en' ? 'Share your thoughts and suggestions' : 'သင့်အတွေးများနှင့် အကြံပြုချက်များကို မျှဝေပါ',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-lg border border-cyan-500/20">
            <h4 className="text-white font-semibold mb-2">
              {language === 'en' ? 'Help Us Improve' : 'ကျွန်ုပ်တို့ကို တိုးတက်အောင် ကူညီပါ'}
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              {language === 'en' 
                ? 'Your feedback is valuable to us. Share your experience and help us make SateCha better.' 
                : 'သင့်အကြံပြုချက်များသည် ကျွန်ုပ်တို့အတွက် အဖိုးတန်ပါသည်။'
              }
            </p>
            <div className="flex space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFeedbackForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all font-medium"
              >
                {language === 'en' ? 'Give Feedback' : 'အကြံပြုချက် ပေးပါ'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFeedbackViewer(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-medium"
              >
                {language === 'en' ? 'View My Feedback' : 'ကျွန်ုပ်၏ အကြံပြုချက်များ ကြည့်ရှုပါ'}
              </motion.button>
            </div>
          </div>
        </div>
      )
    },
    {
>>>>>>> daf97b202766d82f427622fa997fdfa044882444
      id: 'terms',
      title: language === 'en' ? 'Terms & Conditions' : 'စည်းမျဉ်းများ',
      icon: FileText,
      description: language === 'en' ? 'Review our terms of service' : 'ဝန်ဆောင်မှု စည်းမျဉ်းများ',
      content: (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <div className="text-gray-300 text-sm space-y-3">
            <p>1. {language === 'en' ? 'By using SateCha, you agree to comply with all applicable laws.' : 'SateCha ကို အသုံးပြုခြင်းဖြင့် ဥပဒေများကို လိုက်နာရန် သဘောတူပါသည်။'}</p>
            <p>2. {language === 'en' ? 'We protect your privacy and secure your data.' : 'ကျွန်ုပ်တို့သည် သင့်ကိုယ်ရေးကိုယ်တာကို ကာကွယ်ပါသည်။'}</p>
            <p>3. {language === 'en' ? 'Users are responsible for account security.' : 'အသုံးပြုသူများသည် အကောင့်လုံခြုံရေးအတွက် တာဝန်ရှိပါသည်။'}</p>
          </div>
        </div>
      )
    },
    {
      id: 'manual',
      title: language === 'en' ? 'User Manual' : 'အသုံးပြုသူ လမ်းညွှန်',
      icon: BookOpen,
      description: language === 'en' ? 'Learn how to use SateCha' : 'SateCha အသုံးပြုနည်း',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <h5 className="text-white font-semibold mb-2">🏠 Dashboard</h5>
            <p className="text-gray-300 text-sm">View cybersecurity moments and incidents.</p>
          </div>
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <h5 className="text-white font-semibold mb-2">🧠 Quiz</h5>
            <p className="text-gray-300 text-sm">Test your knowledge with interactive quizzes.</p>
          </div>
          <div className="p-4 bg-gray-800/30 rounded-lg">
            <h5 className="text-white font-semibold mb-2">🛠️ Tools</h5>
            <p className="text-gray-300 text-sm">Access cybersecurity tools and utilities.</p>
          </div>
        </div>
      )
    },
    {
      id: 'security',
      title: language === 'en' ? 'Security & Privacy' : 'လုံခြုံရေး',
      icon: Shield,
      description: language === 'en' ? 'Security information' : 'လုံခြုံရေး အချက်အလက်များ',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-gradient-to-r from-green-500/10 to-cyan-500/10 rounded-lg border border-green-500/20">
            <h5 className="text-white font-semibold mb-2">🔐 Your Data is Secure</h5>
            <ul className="text-gray-300 text-sm space-y-2">
              <li>• End-to-end encryption</li>
              <li>• OTP-only authentication</li>
              <li>• Regular security updates</li>
              <li>• GDPR compliant</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <AnimatedText variant="glow" className="text-4xl font-bold mb-4">
            {language === 'en' ? 'Settings' : 'ဆက်တင်များ'}
          </AnimatedText>
          <p className="text-gray-400">
            {language === 'en' ? 'Manage your preferences' : 'သင့်နှစ်သက်မှုများကို စီမံပါ'}
          </p>
        </div>

        <div className="space-y-4">
          {settingsItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-xl overflow-hidden"
              >
                <motion.button
                  onClick={() => toggleSection(item.id)}
                  className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-700/30 transition-all duration-300"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg">
                      <Icon className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.description}</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isActive ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </motion.button>
                
                <motion.div
                  initial={false}
                  animate={{
                    height: isActive ? 'auto' : 0,
                    opacity: isActive ? 1 : 0
                  }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="p-6 pt-0 border-t border-gray-700/30">
                    {item.content}
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
<<<<<<< HEAD
=======

      <FeedbackForm
        isOpen={showFeedbackForm}
        onClose={() => setShowFeedbackForm(false)}
      />
      
      <FeedbackViewer
        isOpen={showFeedbackViewer}
        onClose={() => setShowFeedbackViewer(false)}
        adminMode={false}
      />
>>>>>>> daf97b202766d82f427622fa997fdfa044882444
    </div>
  );
};

export default Settings;
