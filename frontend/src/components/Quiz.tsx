import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, ArrowRight, ArrowLeft, Trophy, Target, Brain, Award, Medal, Download, Star, Globe, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import AnimatedText from './AnimatedText';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
}

interface QuizSettings {
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  questionsCount: number;
}

interface Medal {
  type: 'bronze' | 'silver' | 'gold' | 'platinum';
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  minScore: number;
}

const Quiz: React.FC = () => {
  const { language, t } = useLanguage();
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    difficulty: 'beginner',
    language: 'english',
    questionsCount: 5
  });
  const [earnedMedal, setEarnedMedal] = useState<Medal | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const medals: Medal[] = [
    {
      type: 'bronze',
      title: 'Security Novice',
      description: 'Good start! Keep learning cybersecurity basics.',
      icon: Medal,
      color: 'from-amber-600 to-yellow-700',
      minScore: 40
    },
    {
      type: 'silver',
      title: 'Security Practitioner',
      description: 'Well done! You have solid cybersecurity knowledge.',
      icon: Award,
      color: 'from-gray-400 to-gray-600',
      minScore: 60
    },
    {
      type: 'gold',
      title: 'Security Expert',
      description: 'Excellent! You demonstrate advanced security expertise.',
      icon: Trophy,
      color: 'from-yellow-400 to-yellow-600',
      minScore: 80
    },
    {
      type: 'platinum',
      title: 'Cybersecurity Master',
      description: 'Outstanding! You are a true cybersecurity professional.',
      icon: Star,
      color: 'from-purple-400 to-indigo-600',
      minScore: 95
    }
  ];

  const allQuestions: Question[] = [
    // Beginner Level Questions
    {
      id: 1,
      question: language === 'en' ? "What is the most common type of cyber attack?" : "ဆိုက်ဘာတိုက်ခိုက်မှု အမျိုးအစားတွင် အများဆုံးမှာ အဘယ်နည်း?",
      options: language === 'en' ? ["Phishing", "Malware", "DDoS", "SQL Injection"] : ["ဖစ်ရှင်း", "မယ်လ်ဝဲ", "DDoS", "SQL Injection"],
      correctAnswer: 0,
      explanation: language === 'en' ? "Phishing attacks are the most common, accounting for over 80% of reported security incidents." : "ဖစ်ရှင်းတိုက်ခိုက်မှုများသည် အများဆုံးဖြစ်ပြီး၊ အစီရင်ခံထားသော လုံခြုံရေးဖြစ်ရပ်များ၏ ၈၀% ကျော်ကို ကိုယ်စားပြုသည်။",
      category: language === 'en' ? "General Security" : "ယေဘုယျ လုံခြုံရေး",
      difficulty: 'beginner',
      language: language
    },
    {
      id: 2,
      question: language === 'en' ? "Which of these is the strongest password?" : "ဤစကားဝှက်များထဲမှ အအားကောင်းဆုံးမှာ အဘယ်နည်း?",
      options: language === 'en' ? ["password123", "P@ssw0rd!", "MyDog'sName2023!", "Tr0ub4dor&3"] : ["password123", "P@ssw0rd!", "MyDog'sName2023!", "Tr0ub4dor&3"],
      correctAnswer: 3,
      explanation: language === 'en' ? "Tr0ub4dor&3 follows best practices with length, complexity, and unpredictability." : "Tr0ub4dor&3 သည် အရှည်၊ ရှုပ်ထွေးမှု နှင့် ခန့်မှန်းမရနိုင်မှုတို့ဖြင့် အကောင်းဆုံး အလေ့အကျင့်များကို လိုက်နာသည်။",
      category: language === 'en' ? "Password Security" : "စကားဝှက် လုံခြုံရေး",
      difficulty: 'beginner',
      language: language
    },
    {
      id: 3,
      question: language === 'en' ? "What does 'https://' indicate?" : "'https://' သည် အဘယ်အရာကို ညွှန်းဆိုသနည်း?",
      options: language === 'en' ? ["High-speed connection", "Secure encrypted connection", "Hypertext protocol", "Home page security"] : ["မြန်နှုန်းမြင့် ချိတ်ဆက်မှု", "လုံခြုံသော ကုဒ်ဝှက်ချိတ်ဆက်မှု", "Hypertext protocol", "ပင်မစာမျက်နှာ လုံခြုံရေး"],
      correctAnswer: 1,
      explanation: language === 'en' ? "HTTPS indicates that the connection between your browser and the website is encrypted and secure." : "HTTPS သည် သင့်ဘရောက်ဇာနှင့် ဝဘ်ဆိုက်အကြား ချိတ်ဆက်မှုကို ကုဒ်ဝှက်ပြီး လုံခြုံကြောင်း ညွှန်းဆိုသည်။",
      category: language === 'en' ? "Web Security" : "ဝဘ် လုံခြုံရေး",
      difficulty: 'beginner',
      language: language
    },
    {
      id: 4,
      question: language === 'en' ? "How often should you update your software?" : "သင့်ဆော့ဖ်ဝဲကို မည်မျှကြာကြာ အပ်ဒိတ်လုပ်သင့်သနည်း?",
      options: language === 'en' ? ["Once a year", "Only when it breaks", "As soon as updates are available", "Once a month"] : ["တစ်နှစ်တစ်ကြိမ်", "ပျက်သွားမှသာ", "အပ်ဒိတ်များ ရရှိနိုင်သည်နှင့်တပြေးညီ", "တစ်လတစ်ကြိမ်"],
      correctAnswer: 2,
      explanation: language === 'en' ? "Software should be updated as soon as updates are available to patch security vulnerabilities." : "လုံခြုံရေး အားနည်းချက်များကို ပြုပြင်ရန် အပ်ဒိတ်များ ရရှိနိုင်သည်နှင့်တပြေးညီ ဆော့ဖ်ဝဲကို အပ်ဒိတ်လုပ်သင့်သည်။",
      category: language === 'en' ? "Software Security" : "ဆော့ဖ်ဝဲ လုံခြုံရေး",
      difficulty: 'beginner',
      language: language
    },
    {
      id: 5,
      question: language === 'en' ? "What is two-factor authentication (2FA)?" : "Two-factor authentication (2FA) ဆိုသည်မှာ အဘယ်နည်း?",
      options: language === 'en' ? ["Using two passwords", "Authentication with two different methods", "Logging in twice", "Having two user accounts"] : ["စကားဝှက် နှစ်ခုသုံးခြင်း", "နည်းလမ်း နှစ်မျိုးဖြင့် အထောက်အထား ပြခြင်း", "နှစ်ကြိမ် လော့ဂ်အင်ဝင်ခြင်း", "အသုံးပြုသူ အကောင့် နှစ်ခုရှိခြင်း"],
      correctAnswer: 1,
      explanation: language === 'en' ? "2FA requires two different authentication methods, like password + SMS code, for enhanced security." : "2FA သည် လုံခြုံရေး မြှင့်တင်ရန် စကားဝှက် + SMS ကုဒ်ကဲ့သို့ အထောက်အထားပြ နည်းလမ်း နှစ်မျိုး လိုအပ်သည်။",
      category: language === 'en' ? "Authentication" : "အထောက်အထားပြခြင်း",
      difficulty: 'intermediate',
      language: language
    },
    // Advanced Level Questions
    {
      id: 6,
      question: language === 'en' ? "What is a zero-day vulnerability?" : "Zero-day vulnerability ဆိုသည်မှာ အဘယ်နည်း?",
      options: language === 'en' ? ["A vulnerability discovered on day zero", "A security flaw unknown to vendors", "A bug that takes zero days to fix", "A vulnerability with zero impact"] : ["နေ့သုညတွင် ရှာဖွေတွေ့ရှိသော အားနည်းချက်", "ရောင်းချသူများ မသိရှိသော လုံခြုံရေး ချို့ယွင်းချက်", "သုညနေ့ဖြင့် ပြုပြင်နိုင်သော ချို့ယွင်းချက်", "သက်ရောက်မှု သုညရှိသော အားနည်းချက်"],
      correctAnswer: 1,
      explanation: language === 'en' ? "A zero-day vulnerability is a security flaw that is unknown to the software vendor and has no available patch." : "Zero-day vulnerability သည် ဆော့ဖ်ဝဲရောင်းချသူများ မသိရှိသော လုံခြုံရေးချို့ယွင်းချက်ဖြစ်ပြီး ပြုပြင်မှု မရရှိနိုင်သေးသော အားနည်းချက်ဖြစ်သည်။",
      category: language === 'en' ? "Advanced Security" : "အဆင့်မြင့် လုံခြုံရေး",
      difficulty: 'advanced',
      language: language
    },
    {
      id: 7,
      question: language === 'en' ? "What is the purpose of a firewall?" : "Firewall ၏ ရည်ရွယ်ချက်မှာ အဘယ်နည်း?",
      options: language === 'en' ? ["To prevent computer overheating", "To block unauthorized network access", "To speed up internet connection", "To backup important files"] : ["ကွန်ပျူတာ အပူလွန်ခြင်းကို တားဆီးရန်", "ခွင့်ပြုချက်မရှိသော ကွန်ယက်ဝင်ရောက်မှုကို ပိတ်ဆို့ရန်", "အင်တာနက် ချိတ်ဆက်မှုကို မြန်ဆန်စေရန်", "အရေးကြီးသော ဖိုင်များကို အရံသိမ်းရန်"],
      correctAnswer: 1,
      explanation: language === 'en' ? "A firewall monitors and controls incoming and outgoing network traffic based on predetermined security rules." : "Firewall သည် ကြိုတင်သတ်မှတ်ထားသော လုံခြုံရေးစည်းမျဉ်းများအပေါ် အခြေခံ၍ ဝင်လာသော နှင့် ထွက်သွားသော ကွန်ယက်အသွားအလာကို စောင့်ကြည့်ပြီး ထိန်းချုပ်သည်။",
      category: language === 'en' ? "Network Security" : "ကွန်ယက် လုံခြုံရေး",
      difficulty: 'intermediate',
      language: language
    },
    {
      id: 8,
      question: language === 'en' ? "What is social engineering in cybersecurity?" : "ဆိုက်ဘာလုံခြုံရေးတွင် social engineering ဆိုသည်မှာ အဘယ်နည်း?",
      options: language === 'en' ? ["Building social networks", "Manipulating people to reveal confidential information", "Engineering social media platforms", "Creating user-friendly interfaces"] : ["လူမှုကွန်ယက်များ တည်ဆောက်ခြင်း", "လျှို့ဝှက်အချက်အလက်များ ဖော်ပြစေရန် လူများကို လှည့်ဖြားခြင်း", "လူမှုကွန်ယက် ပလပ်ဖောင်းများ တည်ဆောက်ခြင်း", "အသုံးပြုရလွယ်သော အင်တာဖေ့စ်များ ဖန်တီးခြင်း"],
      correctAnswer: 1,
      explanation: language === 'en' ? "Social engineering is the psychological manipulation of people to perform actions or divulge confidential information." : "Social engineering သည် လူများကို လုပ်ဆောင်ချက်များ ပြုလုပ်စေရန် သို့မဟုတ် လျှို့ဝှက်အချက်အလက်များ ဖော်ပြစေရန် စိတ်ပိုင်းဆိုင်ရာ လှည့်ဖြားမှုဖြစ်သည်။",
      category: language === 'en' ? "Social Engineering" : "လူမှုရေး အင်ဂျင်နီယာရင်",
      difficulty: 'intermediate',
      language: language
    },
    // Additional Advanced Questions
    {
      id: 9,
      question: language === 'en' ? "What is the primary purpose of a honeypot in cybersecurity?" : "ဆိုက်ဘာလုံခြုံရေးတွင် honeypot ၏ အဓိကရည်ရွယ်ချက်မှာ အဘယ်နည်း?",
      options: language === 'en' ? ["Store sensitive data", "Attract and detect attackers", "Encrypt network traffic", "Backup system files"] : ["အရေးကြီးသော ဒေတာများ သိမ်းဆည်းရန်", "တိုက်ခိုက်သူများကို ဆွဲဆောင်ပြီး ရှာဖွေတွေ့ရှိရန်", "ကွန်ယက်အသွားအလာကို ကုဒ်ဝှက်ရန်", "စနစ်ဖိုင်များကို အရံသိမ်းရန်"],
      correctAnswer: 1,
      explanation: language === 'en' ? "A honeypot is a decoy system designed to attract attackers and gather intelligence about their methods." : "Honeypot သည် တိုက်ခိုက်သူများကို ဆွဲဆောင်ပြီး ၎င်းတို့၏ နည်းလမ်းများအကြောင်း သတင်းအချက်အလက်များ စုဆောင်းရန် ဒီဇိုင်းထုတ်ထားသော လှည့်စားစနစ်ဖြစ်သည်။",
      category: language === 'en' ? "Advanced Security" : "အဆင့်မြင့် လုံခြုံရေး",
      difficulty: 'advanced',
      language: language
    },
    {
      id: 10,
      question: language === 'en' ? "Which cryptographic algorithm is considered quantum-resistant?" : "မည်သည့် ကုဒ်ဝှက်နည်းပညာ algorithm သည် quantum-resistant ဟု ယူဆရသနည်း?",
      options: language === 'en' ? ["RSA-2048", "AES-256", "Lattice-based cryptography", "Elliptic Curve"] : ["RSA-2048", "AES-256", "Lattice-based cryptography", "Elliptic Curve"],
      correctAnswer: 2,
      explanation: language === 'en' ? "Lattice-based cryptography is one of the post-quantum cryptographic methods resistant to quantum attacks." : "Lattice-based cryptography သည် quantum တိုက်ခိုက်မှုများကို ခံနိုင်ရည်ရှိသော post-quantum ကုဒ်ဝှက်နည်းလမ်းများထဲမှ တစ်ခုဖြစ်သည်။",
      category: language === 'en' ? "Cryptography" : "ကုဒ်ဝှက်နည်းပညာ",
      difficulty: 'advanced',
      language: language
    }
  ];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowExplanation(false);
  };

  const handleAnswerSubmit = () => {
    if (selectedAnswer === null) return;
    
    const currentQuestion = filteredQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setBestStreak(Math.max(bestStreak, streak + 1));
    } else {
      setStreak(0);
    }
    
    setUserAnswers([...userAnswers, selectedAnswer]);
    setShowExplanation(true);
    
    setTimeout(() => {
      if (currentQuestionIndex < filteredQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowExplanation(false);
        setTimeLeft(30);
      } else {
        handleQuizComplete();
      }
    }, 3000);
  };

  const handleQuizComplete = () => {
    setQuizCompleted(true);
    setShowResults(true);
    setIsTimerActive(false);
    
    // Award medal based on score and difficulty
    const percentage = (score / filteredQuestions.length) * 100;
    let medal = null;
    
    if (percentage >= 90) {
      medal = medals.find(m => m.type === 'gold');
    } else if (percentage >= 70) {
      medal = medals.find(m => m.type === 'silver');
    } else if (percentage >= 50) {
      medal = medals.find(m => m.type === 'bronze');
    }
    
    if (medal) {
      setEarnedMedal(medal);
      if (score > 0) {
        setShowCertificate(true);
      }
    }
  };

  // Filter questions based on settings
  const questions = allQuestions.filter(q => 
    q.difficulty === quizSettings.difficulty && 
    q.language === quizSettings.language
  ).slice(0, quizSettings.questionsCount);

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newUserAnswers = [...userAnswers, selectedAnswer];
    setUserAnswers(newUserAnswers);

    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setShowResult(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
      } else {
        completeQuiz();
      }
    }, 2000);
  };

  const completeQuiz = () => {
    const percentage = (score / questions.length) * 100;
    const difficultyMultiplier = quizSettings.difficulty === 'advanced' ? 1.2 : quizSettings.difficulty === 'intermediate' ? 1.1 : 1.0;
    const adjustedScore = percentage * difficultyMultiplier;
    
    // Determine medal based on adjusted score
    const medal = medals.reverse().find(m => adjustedScore >= m.minScore) || null;
    setEarnedMedal(medal);
    
    // Show certificate immediately if score > 0
    if (score > 0) {
      setShowCertificate(true);
    }
    
    setQuizCompleted(true);
  };

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuizCompleted(false);
    setUserAnswers([]);
    setEarnedMedal(null);
  };

  const generateCertificate = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 800;
    canvas.height = 600;

    // Background - dark blue gradient matching reference
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#1a2332');
    gradient.addColorStop(1, '#0f1419');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Border - cyan color matching reference
    ctx.strokeStyle = '#00d4ff';
    ctx.lineWidth = 3;
    ctx.strokeRect(50, 50, 700, 500);

    // Title
    ctx.fillStyle = '#00d4ff';
    ctx.font = 'bold 32px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('Certificate of Achievement', 400, 120);

    // Main text
    ctx.font = '18px Orbitron';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('This certifies that', 400, 180);

    // User name placeholder
    ctx.font = 'bold 24px Orbitron';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('[User Name]', 400, 220);

    // Achievement text
    ctx.font = '16px Orbitron';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`has successfully completed the Cybersecurity Challenge with a score of`, 400, 280);
    
    // Score - large and prominent like in reference
    ctx.font = 'bold 48px Orbitron';
    ctx.fillStyle = '#00d4ff';
    ctx.fillText(`${Math.round((score/questions.length)*100)}%`, 400, 340);

    // "and has been awarded the" text
    ctx.font = '16px Orbitron';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('and has been awarded the', 400, 400);

    // Medal and achievement
    if (earnedMedal) {
      // Draw medal icon/illustration
      ctx.save();
      
      // Medal background circle
      const medalX = 400;
      const medalY = 350;
      const medalRadius = 40;
      
      // Medal outer ring (gold/silver/bronze based on type)
      const medalColors = {
        bronze: ['#CD7F32', '#8B4513'],
        silver: ['#C0C0C0', '#808080'],
        gold: ['#FFD700', '#FFA500'],
        platinum: ['#E5E4E2', '#B8860B']
      };
      
      const [color1, color2] = medalColors[earnedMedal.type] || medalColors.gold;
      
      const medalGradient = ctx.createRadialGradient(medalX, medalY, 0, medalX, medalY, medalRadius);
      medalGradient.addColorStop(0, color1);
      medalGradient.addColorStop(1, color2);
      
      ctx.fillStyle = medalGradient;
      ctx.beginPath();
      ctx.arc(medalX, medalY, medalRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Medal inner circle
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(medalX, medalY, medalRadius - 8, 0, 2 * Math.PI);
      ctx.fill();
      
      // Medal center icon (star for all medals)
      ctx.fillStyle = color1;
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('★', medalX, medalY + 10);
      
      // Medal ribbon/banner
      ctx.fillStyle = color1;
      ctx.fillRect(medalX - 50, medalY + 30, 100, 20);
      ctx.fillStyle = color2;
      ctx.fillRect(medalX - 45, medalY + 32, 90, 16);
      
      ctx.restore();
      
      // Medal title
      ctx.font = 'bold 24px Orbitron';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.fillText(earnedMedal.title, 400, 440);
      
      // Subtitle
      ctx.font = '16px Orbitron';
      ctx.fillStyle = '#888888';
      ctx.fillText('Cyber Sentinel', 400, 470);
    }

    // Date
    ctx.font = '14px Orbitron';
    ctx.fillStyle = '#888888';
    const today = new Date().toLocaleDateString();
    ctx.fillText(`Date: ${today}`, 400, 510);

    // Certified by
    ctx.fillText('Certified by Sate Cha', 400, 530);

    // Download
    const link = document.createElement('a');
    link.download = `SateCha_Certificate_${today.replace(/\//g, '-')}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setQuizCompleted(false);
    setUserAnswers([]);
    setEarnedMedal(null);
    setShowCertificate(false);
  };

  const getScoreColor = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return 'Excellent! You have strong cybersecurity knowledge.';
    if (percentage >= 60) return 'Good job! Consider reviewing some security concepts.';
    return 'Keep learning! Cybersecurity knowledge is crucial for everyone.';
  };

  // Quiz Setup Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-4 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl animate-bounce"></div>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl font-bold text-white mb-4 font-orbitron bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              {t('quiz.title')}
            </h1>
            <p className="text-gray-300 text-xl font-medium">
              {t('quiz.subtitle')}
            </p>
          </motion.div>

          {/* Setup Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card max-w-2xl mx-auto"
          >
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">
                Quiz Settings
              </h2>
            </div>

            <div className="space-y-6">
              {/* Difficulty Selection */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Select Difficulty Level
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['beginner', 'intermediate', 'advanced'].map((level) => (
                    <motion.button
                      key={level}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuizSettings({...quizSettings, difficulty: level as any})}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                        quizSettings.difficulty === level
                          ? 'bg-gradient-to-r from-cyan-500 to-blue-500 border-cyan-400 text-white'
                          : 'glass-button border-gray-600 text-gray-300 hover:border-cyan-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-lg font-bold capitalize mb-2">{level}</div>
                        <div className="text-sm opacity-80">
                          {level === 'beginner' && '5 Questions • Basic concepts'}
                          {level === 'intermediate' && '7 Questions • Practical knowledge'}
                          {level === 'advanced' && '10 Questions • Expert level'}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div>
                <label className="block text-white font-semibold mb-3">
                  Select Language
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { code: 'english', name: 'English', flag: '🇺🇸' },
                    { code: 'burmese', name: 'မြန်မာ', flag: '🇲🇲' }
                  ].map((lang) => (
                    <motion.button
                      key={lang.code}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setQuizSettings({...quizSettings, language: lang.code})}
                      className={`p-3 rounded-lg border transition-all duration-300 ${
                        quizSettings.language === lang.code
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-400 text-white'
                          : 'glass-button border-gray-600 text-gray-300 hover:border-green-400'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{lang.flag}</div>
                        <div className="text-sm font-semibold">{lang.name}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quiz Info */}
              <div className="glass-card bg-gray-800/50 p-4">
                <h3 className="text-lg font-bold text-white mb-3">Quiz Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center">
                    <Target className="w-4 h-4 text-cyan-400 mr-2" />
                    <span className="text-gray-300">
                      Questions: {quizSettings.difficulty === 'beginner' ? '5' : quizSettings.difficulty === 'intermediate' ? '7' : '10'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Brain className="w-4 h-4 text-purple-400 mr-2" />
                    <span className="text-gray-300">Difficulty: {quizSettings.difficulty}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-4 h-4 text-green-400 mr-2" />
                    <span className="text-gray-300">Language: {quizSettings.language}</span>
                  </div>
                  <div className="flex items-center">
                    <Award className="w-4 h-4 text-yellow-400 mr-2" />
                    <span className="text-gray-300">Certificate Available</span>
                  </div>
                </div>
              </div>

              {/* Start Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startQuiz}
                className="w-full glass-button bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Start Quiz</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Show certificate immediately if eligible
  if (showCertificate && score > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card max-w-4xl w-full"
        >
          {/* Certificate Display */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">
              Congratulations!
            </h2>
            <p className="text-gray-300 text-lg mb-6">
              You have earned a certificate for completing the cybersecurity quiz!
            </p>
          </div>

          {/* Certificate Preview */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-xl border border-cyan-400/30 mb-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">Certificate of Achievement</h3>
              <p className="text-white mb-2">This certifies that</p>
              <p className="text-xl font-bold text-white mb-4">[User Name]</p>
              <p className="text-white mb-2">has successfully completed the Cybersecurity Challenge with a score of</p>
              <p className="text-4xl font-bold text-cyan-400 mb-4">{Math.round((score/questions.length)*100)}%</p>
              <p className="text-white mb-2">and has been awarded the</p>
              {earnedMedal && (
                <>
                  <p className="text-2xl font-bold text-white mb-2">{earnedMedal.title}</p>
                  <p className="text-gray-400 mb-4">Cyber Sentinel</p>
                </>
              )}
              <p className="text-gray-400 text-sm mb-2">Date: {new Date().toLocaleDateString()}</p>
              <p className="text-gray-400 text-sm">Certified by Sate Cha</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateCertificate}
              className="glass-button bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Certificate</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCertificate(false)}
              className="glass-button text-white px-8 py-3 rounded-xl font-semibold"
            >
              Continue to Results
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card max-w-2xl w-full text-center"
        >
          {/* Medal Display */}
          {earnedMedal && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="mb-6"
            >
              <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-r ${earnedMedal.color} flex items-center justify-center mb-4`}>
                <earnedMedal.icon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{earnedMedal.title}</h3>
              <p className="text-gray-300 text-sm">{earnedMedal.description}</p>
            </motion.div>
          )}
          
          <h2 className="text-3xl font-bold text-white mb-4">
            Quiz Completed!
          </h2>
          
          <div className="mb-6">
            <div className={`text-5xl font-bold mb-2 ${getScoreColor()}`} style={{ fontFamily: 'Orbitron, monospace' }}>
              {score}/{questions.length}
            </div>
            <div className="text-gray-300" style={{ fontFamily: 'Orbitron, monospace' }}>
              {Math.round((score / questions.length) * 100)}% Correct
            </div>
          </div>
          
          <p className="text-lg text-gray-300 mb-8" style={{ fontFamily: 'Orbitron, monospace' }}>
            {getScoreMessage()}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {score > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCertificate(true)}
                className="glass-button bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2"
              >
                <Award className="w-5 h-5" />
                <span>View Certificate</span>
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetQuiz}
              className="glass-button bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold"
            >
              Take Quiz Again
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
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
            Cybersecurity Quiz
          </h1>
          <p className="text-gray-300" style={{ fontFamily: 'Orbitron, monospace' }}>
            Test your knowledge of cybersecurity best practices
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold" style={{ fontFamily: 'Orbitron, monospace' }}>
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-cyan-400 font-semibold" style={{ fontFamily: 'Orbitron, monospace' }}>
              Score: {score}/{currentQuestion}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="glass-card mb-8"
          >
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <Brain className="w-5 h-5 text-cyan-400 mr-2" />
                <span className="text-cyan-400 text-sm font-semibold" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {questions[currentQuestion].category}
                </span>
              </div>
              <h2 
                className="text-2xl font-bold text-white mb-6"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                {questions[currentQuestion].question}
              </h2>
            </div>

            <div className="space-y-4 mb-8">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showResult}
                  className={`w-full p-4 rounded-xl text-left transition-all duration-300 ${
                    selectedAnswer === index
                      ? showResult
                        ? index === questions[currentQuestion].correctAnswer
                          ? 'bg-green-500/20 border-green-400 text-green-400'
                          : 'bg-red-500/20 border-red-400 text-red-400'
                        : 'bg-cyan-500/20 border-cyan-400 text-cyan-400'
                      : showResult && index === questions[currentQuestion].correctAnswer
                      ? 'bg-green-500/20 border-green-400 text-green-400'
                      : 'glass-button text-white hover:border-cyan-400/50'
                  } border`}
                  style={{ fontFamily: 'Orbitron, monospace' }}
                >
                  <div className="flex items-center">
                    <span className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-bold mr-4">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                    {showResult && (
                      <div className="ml-auto">
                        {index === questions[currentQuestion].correctAnswer ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : selectedAnswer === index ? (
                          <XCircle className="w-6 h-6 text-red-400" />
                        ) : null}
                      </div>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card bg-gray-800/50 p-4 mb-6"
              >
                <h3 className="text-lg font-bold text-white mb-2" style={{ fontFamily: 'Orbitron, monospace' }}>
                  Explanation:
                </h3>
                <p className="text-gray-300" style={{ fontFamily: 'Orbitron, monospace' }}>
                  {questions[currentQuestion].explanation}
                </p>
              </motion.div>
            )}

            <div className="flex justify-between">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={currentQuestion === 0}
                className="glass-button text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className="glass-button bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                style={{ fontFamily: 'Orbitron, monospace' }}
              >
                <span>{currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Quiz;
