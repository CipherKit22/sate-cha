import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  ArrowLeft,
  Settings,
  Brain,
  Globe,
  Award,
  Star,
  Target,
  Zap,
  Medal,
  Download,
  RotateCcw
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
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

interface Certificate {
  name: string;
  date: string;
  score: number;
}

interface QuizStats {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  difficulty: string;
}

const Quiz: React.FC = () => {
  const { language, t } = useLanguage();
  const { user, loading, updateUserData } = useAuth();

  // Core quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [userLevel, setUserLevel] = useState(1);
  const [earnedMedal, setEarnedMedal] = useState<Medal | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Quiz settings
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [quizSettings, setQuizSettings] = useState<QuizSettings>({
    difficulty: 'beginner',
    language: 'english',
    questionsCount: 5
  });

  // Cybersecurity Questions
  const questions: Question[] = [
    // ... questions array
  ];

  const medals: Medal[] = [
    // ... medals array
  ];

  const allQuestions: Question[] = [
    // ... allQuestions array
  ];

  const filteredQuestions = allQuestions
    .filter(q => q.language === quizSettings.language)
    .filter(q => q.difficulty === quizSettings.difficulty)
    .slice(0, quizSettings.questionsCount);

  const currentQuestion = filteredQuestions[currentQuestionIndex];

  useEffect(() => {
    if (user && user.user_metadata) {
      setStreak(user.user_metadata.streak || 0);
      setBestStreak(user.user_metadata.bestStreak || 0);
      setUserLevel(user.user_metadata.level || 1);
    }
  }, [user]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (isTimerActive && timeLeft === 0) {
      handleAnswerSubmit(true); // Auto-submit when timer runs out
    }
    return () => clearTimeout(timer);
  }, [isTimerActive, timeLeft]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setScore(0);
    setEarnedMedal(null);
    setShowCertificate(false);
    setQuizCompleted(false);
    setTimeLeft(30);
    setIsTimerActive(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!showResults) {
      setSelectedAnswer(answerIndex);
    }
  };

  const handleAnswerSubmit = (isTimeout: boolean = false) => {
    if (selectedAnswer === null && !isTimeout) return;

    setIsTimerActive(false);
    const answer = isTimeout ? -1 : selectedAnswer;
    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      const newStreak = streak + 1;
      setStreak(newStreak);
      setBestStreak(Math.max(bestStreak, newStreak));
    } else {
      setStreak(0);
    }

    setUserAnswers([...userAnswers, answer!]);
    setShowResults(true);

    setTimeout(() => {
      if (currentQuestionIndex < filteredQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowResults(false);
        setTimeLeft(30);
        setIsTimerActive(true);
      } else {
        handleQuizComplete();
      }
    }, 3000);
  };

  const handleQuizComplete = async () => {
    setQuizCompleted(true);
    setShowResults(true);
    setIsTimerActive(false);
    setShowCertificate(true);
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
    ctx.fillText(`${Math.round((score/filteredQuestions.length)*100)}%`, 400, 340);

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
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setUserAnswers([]);
    setShowResults(false);
    setQuizStats(null);
    setTimeLeft(30);
    setIsTimerActive(false);
    setScore(0);
    setQuizCompleted(false);
    setEarnedMedal(null);
    setShowCertificate(false);
  };

  const getScoreColor = () => {
    const percentage = (score / filteredQuestions.length) * 100;
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreMessage = () => {
    const percentage = (score / filteredQuestions.length) * 100;
    if (percentage >= 80) return 'Excellent! You have strong cybersecurity knowledge.';
    if (percentage >= 60) return 'Good job! Consider reviewing some security concepts.';
    return 'Keep learning! Cybersecurity knowledge is crucial for everyone.';
  };

  // Quiz Setup Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-cyan-300 mb-8" style={{ fontFamily: 'Orbitron, monospace' }}>
            Test Your Digital Defense Skills
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card bg-gray-800/50 p-6"
          >
            <div className="mb-8">
              <h2 className="text-lg font-bold text-white mb-4">
                {language === 'en' ? 'Quiz Settings' : 'ပဟေဠိ ဆက်တင်များ'}
              </h2>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-3">
                {language === 'en' ? 'Select Difficulty Level' : 'အခက်အခဲ အဆင့် ရွေးချယ်ပါ'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
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
                        {level === 'beginner' && (language === 'en' ? 'Basic concepts' : 'အခြေခံ အယူအဆများ')}
                        {level === 'intermediate' && (language === 'en' ? 'Practical knowledge' : 'လက်တွေ့ အသိပညာ')}
                        {level === 'advanced' && (language === 'en' ? 'Expert level' : 'ကျွမ်းကျင်သူ အဆင့်')}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Language Selection */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-3">
                {language === 'en' ? 'Select Language' : 'ဘာသာစကား ရွေးချယ်ပါ'}
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
            <div className="glass-card bg-gray-800/50 p-4 mb-8">
              <h3 className="text-lg font-bold text-white mb-3">
                {language === 'en' ? 'Quiz Information' : 'ပဟေဠိ အချက်အလက်များ'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-cyan-400 mr-2" />
                  <span className="text-gray-300">
                    {language === 'en' ? 'Questions' : 'မေးခွန်းများ'}: {filteredQuestions.length}
                  </span>
                </div>
                <div className="flex items-center">
                  <Brain className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-gray-300">
                    {language === 'en' ? 'Difficulty' : 'အခက်အခဲ'}: {quizSettings.difficulty}
                  </span>
                </div>
                <div className="flex items-center">
                  <Globe className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-gray-300">
                    {language === 'en' ? 'Language' : 'ဘာသာစကား'}: {quizSettings.language}
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-gray-300">
                    {language === 'en' ? 'Certificate Available' : 'လက်မှတ် ရရှိနိုင်သည်'}
                  </span>
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
              <Play className="w-5 h-5" />
              <span>
                {language === 'en' ? 'Start Quiz' : 'ပဟေဠိ စတင်ပါ'}
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  if (quizStarted && !quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400">
                {language === 'en' ? 'Question' : 'မေးခွန်း'} {currentQuestionIndex + 1} {language === 'en' ? 'of' : '/'} {filteredQuestions.length}
              </span>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400 font-bold">{timeLeft}s</span>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / filteredQuestions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 mb-8"
          >
            <div className="mb-6">
              <div className="text-sm text-cyan-400 mb-2">{currentQuestion.category}</div>
              <h2 className="text-2xl font-bold text-white mb-6">{currentQuestion.question}</h2>
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${
                    selectedAnswer === index
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 text-white'
                      : 'bg-gray-700/30 border-gray-600 text-gray-300 hover:border-cyan-400/50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      selectedAnswer === index ? 'border-cyan-400 bg-cyan-400' : 'border-gray-500'
                    }`}>
                      {selectedAnswer === index && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <span>{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Next Button */}
            <div className="flex justify-end mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAnswerSubmit}
                disabled={selectedAnswer === null}
                className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
              >
                <span>
                  {currentQuestionIndex === filteredQuestions.length - 1 
                    ? (language === 'en' ? 'Finish' : 'ပြီးဆုံး') 
                    : (language === 'en' ? 'Next' : 'ရှေ့သို့')
                  }
                </span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="mb-8">
              <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
              <AnimatedText variant="glow" className="text-4xl font-bold mb-4">
                {language === 'en' ? 'Quiz Complete!' : 'ပဟေဠိ ပြီးဆုံးပါပြီ!'}
              </AnimatedText>
            </div>

            {/* Results Card */}
            <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 mb-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-400">{score}/{filteredQuestions.length}</div>
                  <div className="text-gray-400">{language === 'en' ? 'Score' : 'ရမှတ်'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{userAnswers.filter((answer, index) => answer === filteredQuestions[index].correctAnswer).length}</div>
                  <div className="text-gray-400">{language === 'en' ? 'Correct' : 'မှန်ကန်သော'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{filteredQuestions.length}</div>
                  <div className="text-gray-400">{language === 'en' ? 'Total' : 'စုစုပေါင်း'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{Math.floor(30 * filteredQuestions.length / 60)}:{(30 * filteredQuestions.length % 60).toString().padStart(2, '0')}</div>
                  <div className="text-gray-400">{language === 'en' ? 'Time' : 'အချိန်'}</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>{language === 'en' ? 'Try Again' : 'ထပ်စမ်းကြည့်ပါ'}</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

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
>>>>>>> daf97b202766d82f427622fa997fdfa044882444
            </motion.button>
          </div>
        </motion.div>
      </div>
<<<<<<< HEAD
=======
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
>>>>>>> daf97b202766d82f427622fa997fdfa044882444
    </div>
  );
};

export default Quiz;
