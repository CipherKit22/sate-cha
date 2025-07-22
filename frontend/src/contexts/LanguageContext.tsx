import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'my';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.quiz': 'Quiz',
    'nav.tools': 'Tools',
    'nav.settings': 'Settings',
    'nav.profile': 'Profile',
    'nav.admin': 'Admin',
    'nav.signin': 'Sign In',
    'nav.signout': 'Sign Out',
    'nav.aichat': 'AI Chat',
    
    // Home Page
    'home.welcome': 'Welcome to SateCha',
    'home.subtitle': 'Advanced Cybersecurity Platform',
    'home.description': 'Protect your digital world with cutting-edge security solutions and real-time threat detection.',
    'home.getStarted': 'Get Started',
    'home.learnMore': 'Learn More',
    'home.features.realtime': 'Real-time Monitoring',
    'home.features.ai': 'AI-Powered Detection',
    'home.features.secure': 'Enterprise Security',
    
    // Authentication
    'auth.signin': 'Sign In',
    'auth.signup': 'Create Account',
    'auth.email': 'Email Address',
    'auth.username': 'Username',
    'auth.fullname': 'Full Name',
    'auth.language': 'Language Preference',
    'auth.english': 'English',
    'auth.burmese': 'မြန်မာ (Burmese)',
    'auth.enterEmail': 'Enter your email',
    'auth.enterUsername': 'Choose a username',
    'auth.enterFullname': 'Enter your full name',
    'auth.alreadyAccount': 'Already have an account?',
    'auth.noAccount': "Don't have an account?",
    'auth.processing': 'Processing...',
    
    // OTP
    'otp.title': 'Enter Verification Code',
    'otp.subtitle': "We've sent a 6-digit code to",
    'otp.verifying': 'Verifying...',
    'otp.resend': 'Resend Code',
    'otp.sending': 'Sending...',
    'otp.instructions': 'Check your email inbox and spam folder. The code expires in 10 minutes.',
    'otp.noCode': "Didn't receive the code?",
    
    // Settings
    'settings.title': 'Settings',
    'settings.language': 'Language',
    'settings.theme': 'Theme',
    'settings.notifications': 'Notifications',
    'settings.security': 'Security',
    'settings.save': 'Save Changes',
    
    // Footer
    'footer.createdWith': 'Created with',
    'footer.by': 'by',
    'footer.contact': 'Click to contact us',
    'footer.copyright': '© 2024 SateCha Security Platform. All rights reserved.',
    
    // Common
    'common.loading': 'Loading...',
    'common.error': 'An error occurred',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
  },
  my: {
    // Navigation
    'nav.dashboard': 'ဒက်ရှ်ဘုတ်',
    'nav.quiz': 'ဉာဏ်စမ်း',
    'nav.tools': 'ကိရိယာများ',
    'nav.settings': 'ဆက်တင်များ',
    'nav.profile': 'ပရိုဖိုင်',
    'nav.admin': 'အက်ဒမင်',
    'nav.signin': 'ဝင်ရန်',
    'nav.signout': 'ထွက်ရန်',
    'nav.aichat': 'AI စကားပြော',
    
    // Home Page
    'home.welcome': 'SateCha မှကြိုဆိုပါသည်',
    'home.subtitle': 'အဆင့်မြင့် ဆိုက်ဘာလုံခြုံရေး ပလပ်ဖောင်း',
    'home.description': 'ခေတ်မီ လုံခြုံရေး ဖြေရှင်းချက်များနှင့် အချိန်နှင့်တပြေးညီ ခြိမ်းခြောက်မှု ရှာဖွေတွေ့ရှိမှုဖြင့် သင့်ဒစ်ဂျစ်တယ် ကမ္ဘာကို ကာကွယ်ပါ။',
    'home.getStarted': 'စတင်ရန်',
    'home.learnMore': 'ပိုမိုလေ့လာရန်',
    'home.features.realtime': 'အချိန်နှင့်တပြေးညီ စောင့်ကြည့်မှု',
    'home.features.ai': 'AI-စွမ်းအား ရှာဖွေတွေ့ရှိမှု',
    'home.features.secure': 'လုပ်ငန်း လုံခြုံရေး',
    
    // Authentication
    'auth.signin': 'လော့ဂ်အင်',
    'auth.signup': 'အကောင့်ဖွင့်ရန်',
    'auth.email': 'အီးမေးလ် လိပ်စာ',
    'auth.username': 'အသုံးပြုသူအမည်',
    'auth.fullname': 'အမည်အပြည့်အစုံ',
    'auth.language': 'ဘာသာစကား ရွေးချယ်မှု',
    'auth.english': 'English',
    'auth.burmese': 'မြန်မာ (Burmese)',
    'auth.enterEmail': 'သင့်အီးမေးလ်ကို ရိုက်ထည့်ပါ',
    'auth.enterUsername': 'အသုံးပြုသူအမည် ရွေးချယ်ပါ',
    'auth.enterFullname': 'သင့်အမည်အပြည့်အစုံကို ရိုက်ထည့်ပါ',
    'auth.alreadyAccount': 'အကောင့်ရှိပြီးသားလား?',
    'auth.noAccount': 'အကောင့်မရှိသေးလား?',
    'auth.processing': 'လုပ်ဆောင်နေသည်...',
    
    // OTP
    'otp.title': 'အတည်ပြုကုဒ် ရိုက်ထည့်ပါ',
    'otp.subtitle': 'ကျွန်ုပ်တို့သည် ၆ လုံးကုဒ်ကို ပို့ပြီးပါပြီ',
    'otp.verifying': 'အတည်ပြုနေသည်...',
    'otp.resend': 'ကုဒ်ပြန်ပို့ရန်',
    'otp.sending': 'ပို့နေသည်...',
    'otp.instructions': 'သင့်အီးမေးလ် inbox နှင့် spam folder ကို စစ်ကြည့်ပါ။ ကုဒ်သည် ၁၀ မိနစ်အတွင်း သက်တမ်းကုန်ပါမည်။',
    'otp.noCode': 'ကုဒ်မရရှိလား?',
    
    // Settings
    'settings.title': 'ဆက်တင်များ',
    'settings.language': 'ဘာသာစကား',
    'settings.theme': 'အပြင်အဆင်',
    'settings.notifications': 'အကြောင်းကြားချက်များ',
    'settings.security': 'လုံခြုံရေး',
    'settings.save': 'ပြောင်းလဲမှုများ သိမ်းဆည်းရန်',
    
    // Footer
    'footer.createdWith': 'ဖန်တီးသည်',
    'footer.by': 'မှ',
    'footer.contact': 'ဆက်သွယ်ရန် နှိပ်ပါ',
    'footer.copyright': '© ၂၀၂၄ SateCha လုံခြုံရေး ပလပ်ဖောင်း။ မူပိုင်ခွင့်များ လုံးဝ ကြေးမုံ။',
    
    // Common
    'common.loading': 'ရယူနေသည်...',
    'common.error': 'အမှားတစ်ခု ဖြစ်ပွားခဲ့သည်',
    'common.success': 'အောင်မြင်သည်',
    'common.cancel': 'ပယ်ဖျက်ရန်',
    'common.save': 'သိမ်းဆည်းရန်',
    'common.edit': 'တည်းဖြတ်ရန်',
    'common.delete': 'ဖျက်ရန်',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    // Load language from localStorage
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en' || savedLanguage === 'my')) {
      handleSetLanguage(savedLanguage);
    } else {
      // Set default language and font class
      document.documentElement.classList.add('english-font');
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    
    // Update document font class for Burmese
    if (lang === 'my') {
      document.documentElement.classList.add('burmese-font');
      document.documentElement.classList.remove('english-font');
    } else {
      document.documentElement.classList.add('english-font');
      document.documentElement.classList.remove('burmese-font');
    }
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  const value: LanguageContextType = {
    language,
    setLanguage: handleSetLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageContext;
