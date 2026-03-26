import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { Bot, BotConfig, Question, User } from '../types';
import { ModernUIWidget } from '../components/ModernUIWidget';

export const Widget = () => {
  const { botId } = useParams();
  const [bot, setBot] = useState<Bot | null>(null);
  const [owner, setOwner] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'bot' | 'user'; text: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [aiMode, setAiMode] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [validationError, setValidationError] = useState('');
  const [hasAutoOpened, setHasAutoOpened] = useState(false);

  useEffect(() => {
    loadBot();
  }, [botId]);

  useEffect(() => {
    if (bot && !isOpen && bot.config.popupDelay > 0) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, bot.config.popupDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [bot, isOpen]);

  useEffect(() => {
    if (bot && !isOpen && !hasAutoOpened && bot.config.theme.autoOpenDelay && bot.config.theme.autoOpenDelay > 0) {
      const timer = setTimeout(() => {
        setHasAutoOpened(true);
        setIsOpen(true);
        setShowPopup(false);
      }, bot.config.theme.autoOpenDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [bot, isOpen, hasAutoOpened]);

  const loadBot = async () => {
    if (!botId) return;

    try {
      const botDoc = await getDoc(doc(db, 'bots', botId));
      if (!botDoc.exists()) {
        setError('Bot not found');
        setLoading(false);
        return;
      }

      const botData = { id: botDoc.id, ...botDoc.data() } as Bot;
      setBot(botData);

      const ownerDoc = await getDoc(doc(db, 'users', botData.ownerId));
      if (ownerDoc.exists()) {
        const ownerData = {
          uid: ownerDoc.id,
          ...ownerDoc.data(),
          trialEndsAt: ownerDoc.data().trialEndsAt?.toDate()
        } as User;
        setOwner(ownerData);

        if (!ownerData.trialActive && ownerData.subscription?.status !== 'active') {
          setError('This bot is currently paused. Please contact the site owner.');
        }
      }

      if (botData.config.theme.template !== 'modernui') {
        setMessages([{ type: 'bot', text: botData.config.welcomeMessage }]);
      }
    } catch (err) {
      console.error('Error loading bot:', err);
      setError('Failed to load bot');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentPageRule = () => {
    if (!bot) return null;
    return bot.config.pageRules.find(rule => {
      const pattern = rule.urlPattern.replace(/\*/g, '.*');
      const regex = new RegExp(`^${pattern}$`);
      return regex.test(window.location.pathname);
    });
  };

  const typeMessage = async (text: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setMessages(prev => [...prev, { type: 'bot', text }]);
    setIsTyping(false);
  };

  const validateInput = (question: Question, input: string): string | null => {
    if (question.required && !input.trim()) {
      return 'This field is required';
    }

    if (question.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input)) {
        return 'Please enter a valid email address';
      }
    }

    if (question.type === 'phone') {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(input) || input.replace(/\D/g, '').length < 10) {
        return 'Please enter a valid phone number';
      }
    }

    return null;
  };

  const handleQuestionSubmit = async () => {
    if (!bot || !currentInput.trim()) return;

    const currentQuestion = bot.config.questions[currentQuestionIndex];
    if (!currentQuestion) return;

    const error = validateInput(currentQuestion, currentInput);
    if (error) {
      setValidationError(error);
      await typeMessage(error);
      return;
    }

    setValidationError('');
    setMessages(prev => [...prev, { type: 'user', text: currentInput }]);
    const columnKey = currentQuestion.columnHeader || currentQuestion.text;
    const updatedAnswers = { ...answers, [columnKey]: currentInput };
    setAnswers(updatedAnswers);
    setCurrentInput('');

    if (currentQuestionIndex < bot.config.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      await typeMessage(bot.config.questions[currentQuestionIndex + 1].text);
    } else {
      await saveLead(updatedAnswers);
      if (bot.type === 'smart' && !bot.config.collectLeadsFirst) {
        setAiMode(true);
        await typeMessage('Thank you! How can I help you today?');
      } else {
        setLeadSubmitted(true);
        const currentPageRule = getCurrentPageRule();
        const thankYouMsg = currentPageRule?.customThankYouMessage || bot.config.theme.thankYouMessage || 'Thank you for your information! We\'ll get back to you soon.';
        await typeMessage(thankYouMsg);
      }
    }
  };

  const handleAiMessage = async () => {
    if (!aiInput.trim() || !bot || !owner) return;

    const userMessage = aiInput;
    setMessages(prev => [...prev, { type: 'user', text: userMessage }]);
    setAiInput('');
    setIsTyping(true);

    try {
      let apiKey = owner.geminiApiKey;
      if (!apiKey) {
        const settingsDoc = await getDoc(doc(db, 'adminSettings', 'global'));
        apiKey = settingsDoc.exists() ? settingsDoc.data().geminiApiKey : '';
      }

      if (!apiKey) {
        await typeMessage('AI service is currently unavailable. Please try again later.');
        return;
      }

      let context = '';
      if (bot.config.knowledgeBaseId) {
        const kbDoc = await getDoc(doc(db, 'knowledgeBases', bot.config.knowledgeBaseId));
        if (kbDoc.exists()) {
          const kb = kbDoc.data();
          context = kb.articles.map((a: any) => `${a.title}\n${a.content}`).join('\n\n');
        }
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: context
                  ? `Using this context:\n${context}\n\nAnswer this question: ${userMessage}`
                  : userMessage
              }]
            }]
          })
        }
      );

      const data = await response.json();
      const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I couldn\'t generate a response.';

      await typeMessage(aiResponse);
    } catch (err) {
      console.error('AI error:', err);
      await typeMessage('I apologize, but I encountered an error. Please try again.');
    } finally {
      setIsTyping(false);
    }
  };

  const saveLead = async (leadAnswers: Record<string, string>) => {
    if (!bot) return;

    try {
      const leadId = `lead_${Date.now()}`;
      const pageUrl = document.referrer || window.location.href;

      await setDoc(doc(db, 'leads', leadId), {
        botId: bot.id,
        ownerId: bot.ownerId,
        collectedAt: Timestamp.now(),
        pageUrl,
        answers: leadAnswers,
        sessionId: `session_${Date.now()}`
      });

      console.log('Lead saved successfully:', leadAnswers);
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  const openWidget = () => {
    setIsOpen(true);
    setShowPopup(false);
    if (bot && messages.length === 1) {
      typeMessage(bot.config.questions[0].text);
    }
  };

  if (loading) {
    return (
      <div className="fixed bottom-6 right-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !bot) {
    return (
      <div className="fixed bottom-6 right-6 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 max-w-sm">
        <p className="text-red-800 dark:text-red-200">{error || 'Bot not found'}</p>
      </div>
    );
  }

  if (bot.config.theme.template === 'modernui') {
    return <ModernUIWidget bot={bot} owner={owner || undefined} />;
  }

  const config = bot.config;

  return (
    <div style={{ fontFamily: config.theme.fontFamily }}>
      {showPopup && !isOpen && (
        <div className="fixed bottom-24 right-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 max-w-xs border border-gray-200 dark:border-gray-700 animate-bounce">
          <div className="flex items-start justify-between">
            <p className="text-gray-900 dark:text-white">{config.popupMessage}</p>
            <button
              onClick={() => setShowPopup(false)}
              className="ml-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {!isOpen ? (
        <button
          onClick={openWidget}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
          style={{ backgroundColor: config.theme.primaryColor }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      ) : (
        <div
          className="fixed bottom-6 right-6 w-[380px] h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ backgroundColor: config.theme.bgColor }}
        >
          <div
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: config.theme.primaryColor }}
          >
            <div className="flex items-center">
              <MessageCircle className="w-5 h-5 text-white mr-2" />
              <h3 className="font-semibold text-white">{bot.name}</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-1 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg ${
                    msg.type === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                  }`}
                  style={{
                    backgroundColor: msg.type === 'user' ? config.theme.primaryColor : '#f3f4f6',
                    color: msg.type === 'user' ? '#ffffff' : config.theme.textColor
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {!leadSubmitted && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              {validationError && (
                <div className="mb-2 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded">
                  {validationError}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type={
                    aiMode
                      ? 'text'
                      : bot.config.questions[currentQuestionIndex]?.type === 'email'
                      ? 'email'
                      : bot.config.questions[currentQuestionIndex]?.type === 'phone'
                      ? 'tel'
                      : 'text'
                  }
                  value={aiMode ? aiInput : currentInput}
                  onChange={(e) => {
                    if (aiMode) {
                      setAiInput(e.target.value);
                    } else {
                      setCurrentInput(e.target.value);
                      setValidationError('');
                    }
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && (aiMode ? handleAiMessage() : handleQuestionSubmit())}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:border-transparent text-sm"
                  style={{ color: config.theme.textColor }}
                />
                <button
                  onClick={aiMode ? handleAiMessage : handleQuestionSubmit}
                  className="p-2 rounded-lg transition-colors"
                  style={{ backgroundColor: config.theme.primaryColor }}
                  disabled={isTyping}
                >
                  <Send className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}

          <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs text-gray-500 dark:text-gray-400">
            {bot.type === 'smart' && (
              <>
                <Sparkles className="w-3 h-3 mr-1" />
                Powered by AI •{' '}
              </>
            )}
            Powered by <a href="/" target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">Clientsark</a>
          </div>
        </div>
      )}
    </div>
  );
};
