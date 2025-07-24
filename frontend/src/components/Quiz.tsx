import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Trophy, 
  Clock, 
  CheckCircle, 
  XCircle, 
  ArrowRight, 
  Settings,
  Brain,
  Globe,
  Award,
  Star,
  Target,
  Zap
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
  const { user } = useAuth();
  
  // Core quiz state
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [quizStats, setQuizStats] = useState<QuizStats | null>(null);
  
  // Quiz settings
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTimerActive, setIsTimerActive] = useState(false);

  // Cybersecurity Questions
  const questions: Question[] = [
    {
      id: 1,
      question: language === 'en' ? "What does 'phishing' refer to in cybersecurity?" : "Cybersecurity တွင် 'phishing' ဆိုသည်မှာ အဘယ်နည်း?",
      options: language === 'en' 
        ? ["A type of malware", "Fraudulent attempt to obtain sensitive information", "Network monitoring", "Data encryption"]
        : ["မယ်လ်ဝဲ အမျိုးအစား", "အရေးကြီးသော အချက်အလက်များ လှည့်ဖြားယူခြင်း", "ကွန်ယက် စောင့်ကြည့်ခြင်း", "ဒေတာ ကုဒ်ဝှက်ခြင်း"],
      correctAnswer: 1,
      explanation: language === 'en' 
        ? "Phishing is a fraudulent attempt to obtain sensitive information by disguising as a trustworthy entity."
        : "Phishing သည် ယုံကြည်ရသော အဖွဲ့အစည်းအဖြစ် ဟန်ဆောင်ပြီး အရေးကြီးသော အချက်အလက်များကို လှည့်ဖြားယူခြင်း ဖြစ်သည်။",
      category: language === 'en' ? "Social Engineering" : "လူမှုရေး အင်ဂျင်နီယာရင်",
      difficulty: 'beginner'
    },
    {
      id: 2,
      question: language === 'en' ? "What is two-factor authentication (2FA)?" : "Two-factor authentication (2FA) ဆိုသည်မှာ အဘယ်နည်း?",
      options: language === 'en'
        ? ["Using two passwords", "Authentication requiring two different methods", "Two-step login process", "Double encryption"]
        : ["စကားဝှက် နှစ်ခု အသုံးပြုခြင်း", "မတူညီသော နည်းလမ်း နှစ်ခု လိုအပ်သော authentication", "နှစ်ဆင့် login လုပ်ငန်းစဉ်", "နှစ်ဆ ကုဒ်ဝှက်ခြင်း"],
      correctAnswer: 1,
      explanation: language === 'en'
        ? "2FA requires two different authentication methods, like password + SMS code, for enhanced security."
        : "2FA သည် လုံခြုံရေး မြှင့်တင်ရန် စကားဝှက် + SMS ကုဒ်ကဲ့သို့ အထောက်အထားပြ နည်းလမ်း နှစ်မျိုး လိုအပ်သည်။",
      category: language === 'en' ? "Authentication" : "အထောက်အထားပြခြင်း",
      difficulty: 'intermediate'
    },
    {
      id: 3,
      question: language === 'en' ? "What is a firewall?" : "Firewall ဆိုသည်မှာ အဘယ်နည်း?",
      options: language === 'en'
        ? ["A physical barrier", "Network security system", "Antivirus software", "Password manager"]
        : ["ရုပ်ပိုင်းဆိုင်ရာ အတားအဆီး", "ကွန်ယက် လုံခြုံရေး စနစ်", "ဗိုင်းရပ်စ် တားဆီးဆော့ဖ်ဝဲ", "စကားဝှက် စီမံခန့်ခွဲမှု"],
      correctAnswer: 1,
      explanation: language === 'en'
        ? "A firewall is a network security system that monitors and controls incoming and outgoing network traffic."
        : "Firewall သည် ဝင်လာသော နှင့် ထွက်သွားသော ကွန်ယက်အသွားအလာကို စောင့်ကြည့်ပြီး ထိန်းချုပ်သော ကွန်ယက်လုံခြုံရေးစနစ် ဖြစ်သည်။",
      category: language === 'en' ? "Network Security" : "ကွန်ယက် လုံခြုံရေး",
      difficulty: 'beginner'
    }
  ];

  // Filter questions by difficulty
  const filteredQuestions = questions.filter(q => q.difficulty === difficulty);
  const currentQuestion = filteredQuestions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (isTimerActive && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleNextQuestion();
    }
  }, [isTimerActive, timeLeft]);

  const startQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSelectedAnswer(null);
    setShowResults(false);
    setTimeLeft(30);
    setIsTimerActive(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      setUserAnswers([...userAnswers, selectedAnswer]);
    }

    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setIsTimerActive(false);
    const finalAnswers = selectedAnswer !== null ? [...userAnswers, selectedAnswer] : userAnswers;
    const correctCount = finalAnswers.reduce((count, answer, index) => {
      return count + (answer === filteredQuestions[index]?.correctAnswer ? 1 : 0);
    }, 0);

    setQuizStats({
      score: Math.round((correctCount / filteredQuestions.length) * 100),
      totalQuestions: filteredQuestions.length,
      correctAnswers: correctCount,
      timeSpent: (filteredQuestions.length * 30) - timeLeft,
      difficulty: difficulty
    });
    setShowResults(true);
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
  };

  // Quiz Setup Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <AnimatedText variant="glow" className="text-5xl font-bold mb-4">
                {language === 'en' ? 'Cybersecurity Quiz' : 'ဆိုက်ဘာလုံခြုံရေး ပဟေဠိ'}
              </AnimatedText>
              <p className="text-gray-400 text-xl">
                {language === 'en' 
                  ? 'Test your cybersecurity knowledge and earn achievements' 
                  : 'သင့်ဆိုက်ဘာလုံခြုံရေး အသိပညာကို စမ်းသပ်ပြီး အောင်မြင်မှုများ ရယူပါ'
                }
              </p>
            </motion.div>
          </div>

          {/* Quiz Settings Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center mb-6">
              <Settings className="w-6 h-6 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-bold text-white">
                {language === 'en' ? 'Quiz Settings' : 'ပဟေဠိ ဆက်တင်များ'}
              </h2>
            </div>

            {/* Difficulty Selection */}
            <div className="mb-8">
              <label className="block text-white font-semibold mb-4">
                {language === 'en' ? 'Select Difficulty Level' : 'အခက်အခဲ အဆင့် ရွေးချယ်ပါ'}
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['beginner', 'intermediate', 'advanced'] as const).map((level) => (
                  <motion.button
                    key={level}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setDifficulty(level)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      difficulty === level
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400 text-white'
                        : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-cyan-400/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">
                        {level === 'beginner' && '🌟'}
                        {level === 'intermediate' && '🎯'}
                        {level === 'advanced' && '⚡'}
                      </div>
                      <h3 className="font-bold text-lg mb-2 capitalize">{level}</h3>
                      <p className="text-sm opacity-80">
                        {level === 'beginner' && (language === 'en' ? 'Basic concepts' : 'အခြေခံ အယူအဆများ')}
                        {level === 'intermediate' && (language === 'en' ? 'Practical knowledge' : 'လက်တွေ့ အသိပညာ')}
                        {level === 'advanced' && (language === 'en' ? 'Expert level' : 'ကျွမ်းကျင်သူ အဆင့်')}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Quiz Info */}
            <div className="bg-gray-700/30 rounded-xl p-6 mb-8">
              <h3 className="text-white font-semibold mb-4">
                {language === 'en' ? 'Quiz Information' : 'ပဟေဠိ အချက်အလက်များ'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center">
                  <Brain className="w-4 h-4 text-cyan-400 mr-2" />
                  <span className="text-gray-300">
                    {language === 'en' ? 'Questions' : 'မေးခွန်းများ'}: {filteredQuestions.length}
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-yellow-400 mr-2" />
                  <span className="text-gray-300">
                    {language === 'en' ? 'Time' : 'အချိန်'}: 30s {language === 'en' ? 'per question' : 'မေးခွန်းတစ်ခုလျှင်'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Target className="w-4 h-4 text-purple-400 mr-2" />
                  <span className="text-gray-300">
                    {language === 'en' ? 'Difficulty' : 'အခက်အခဲ'}: {difficulty}
                  </span>
                </div>
                <div className="flex items-center">
                  <Award className="w-4 h-4 text-green-400 mr-2" />
                  <span className="text-gray-300">
                    {language === 'en' ? 'Certificate Available' : 'လက်မှတ် ရရှိနိုင်သည်'}
                  </span>
                </div>
              </div>
            </div>

            {/* Start Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startQuiz}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
            >
              <Play className="w-5 h-5" />
              <span>{language === 'en' ? 'Start Quiz' : 'ပဟေဠိ စတင်ပါ'}</span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz Results Screen
  if (showResults && quizStats) {
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
                  <div className="text-3xl font-bold text-cyan-400">{quizStats.score}%</div>
                  <div className="text-gray-400">{language === 'en' ? 'Score' : 'ရမှတ်'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{quizStats.correctAnswers}</div>
                  <div className="text-gray-400">{language === 'en' ? 'Correct' : 'မှန်ကန်သော'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{quizStats.totalQuestions}</div>
                  <div className="text-gray-400">{language === 'en' ? 'Total' : 'စုစုပေါင်း'}</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{Math.floor(quizStats.timeSpent / 60)}:{(quizStats.timeSpent % 60).toString().padStart(2, '0')}</div>
                  <div className="text-gray-400">{language === 'en' ? 'Time' : 'အချိန်'}</div>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetQuiz}
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 hover:from-cyan-400 hover:to-blue-400 transition-all duration-300"
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

  // Quiz Question Screen
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
              onClick={handleNextQuestion}
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
};

export default Quiz;
