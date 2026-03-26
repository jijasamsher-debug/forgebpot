import { useEffect, useState, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { Bot, Question } from '../types';
import { setDoc, doc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface ModernUIWidgetProps {
  bot: Bot;
  owner?: {
    removePoweredBy?: boolean;
    trialActive?: boolean;
    subscription?: {
      status: string;
    };
  };
}

export const ModernUIWidget = ({ bot, owner }: ModernUIWidgetProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [messages, setMessages] = useState<Array<{ type: 'bot' | 'user'; text: string }>>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const config = bot.config;
  const theme = config.theme;

  const isBotPaused = owner && !owner.trialActive && owner.subscription?.status !== 'active';

  const currentPageRule = config.pageRules.find(rule => {
    const pattern = rule.urlPattern.replace(/\*/g, '.*');
    const regex = new RegExp(`^${pattern}$`);
    return regex.test(window.location.pathname);
  });

  useEffect(() => {
    if (!isOpen && config.popupDelay > 0) {
      const timer = setTimeout(() => {
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 8000);
      }, config.popupDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, config.popupDelay]);

  useEffect(() => {
    if (!isOpen && !hasAutoOpened && theme.autoOpenDelay && theme.autoOpenDelay > 0) {
      const timer = setTimeout(() => {
        setHasAutoOpened(true);
        openWidget();
      }, theme.autoOpenDelay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, hasAutoOpened, theme.autoOpenDelay]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const typeMessage = async (text: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMessages(prev => [...prev, { type: 'bot', text }]);
    setIsTyping(false);
  };

  const openWidget = async () => {
    setIsOpen(true);
    setShowPopup(false);

    if (messages.length === 0) {
      await typeMessage(config.welcomeMessage);

      if (config.questions.length > 0) {
        setTimeout(() => {
          const ctaMsg = theme.ctaMessage || 'Ready to get started?';
          const div = document.createElement('div');
          div.className = 'tapwell-cta-message';
          setMessages(prev => [...prev, { type: 'bot', text: `__CTA__${ctaMsg}` }]);
        }, 1200);
      }
    }
  };

  const handleCtaClick = async () => {
    setMessages(prev => prev.filter(m => !m.text.startsWith('__CTA__')));
    setMessages(prev => [...prev, { type: 'user', text: theme.ctaText || 'Yes, let\'s go' }]);

    if (config.questions.length > 0) {
      setCurrentQuestionIndex(0);
      await typeMessage(config.questions[0].text);
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
  };

  const handleSubmit = async () => {
    if (!currentInput.trim()) return;

    const currentQuestion = config.questions[currentQuestionIndex];

    if (currentQuestion.type === 'email' && !validateEmail(currentInput)) {
      setValidationError('Please enter a valid email address');
      return;
    }

    if (currentQuestion.type === 'phone' && !validatePhone(currentInput)) {
      setValidationError('Please enter a valid phone number (at least 10 digits)');
      return;
    }

    setValidationError('');
    setMessages(prev => [...prev, { type: 'user', text: currentInput }]);

    const questionKey = currentQuestion.columnHeader || currentQuestion.text;
    const newAnswers = { ...answers, [questionKey]: currentInput };
    setAnswers(newAnswers);
    setCurrentInput('');

    if (currentQuestionIndex < config.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      await typeMessage(config.questions[currentQuestionIndex + 1].text);
    } else {
      await saveLead(newAnswers);
      const thankYouMsg = currentPageRule?.customThankYouMessage || theme.thankYouMessage || 'Thank you! We\'ll get back to you soon.';
      setIsTyping(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessages(prev => [...prev, { type: 'bot', text: `__THANKYOU__${thankYouMsg}` }]);
      setIsTyping(false);
      setLeadSubmitted(true);
    }
  };

  const saveLead = async (finalAnswers: Record<string, string>) => {
    try {
      const emailQuestion = config.questions.find(q => q.type === 'email');
      const phoneQuestion = config.questions.find(q => q.type === 'phone');

      const emailKey = emailQuestion ? (emailQuestion.columnHeader || emailQuestion.text) : '';
      const phoneKey = phoneQuestion ? (phoneQuestion.columnHeader || phoneQuestion.text) : '';

      const email = emailKey ? finalAnswers[emailKey] : '';
      const phone = phoneKey ? finalAnswers[phoneKey] : '';

      const leadId = `${bot.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      await setDoc(doc(db, 'leads', leadId), {
        botId: bot.id,
        ownerId: bot.ownerId,
        collectedAt: Timestamp.now(),
        pageUrl: window.location.href,
        email: email,
        phone: phone,
        answers: finalAnswers,
        sessionId: leadId
      });
    } catch (err) {
      console.error('Error saving lead:', err);
    }
  };

  const renderMessage = (msg: { type: 'bot' | 'user'; text: string }, index: number) => {
    if (msg.text.startsWith('__CTA__')) {
      const ctaMessage = msg.text.replace('__CTA__', '');
      return (
        <div key={index} className="tapwell-cta-container" style={{
          alignSelf: 'flex-start',
          background: '#f5f5f5',
          padding: '6px 10px',
          borderRadius: '14px',
          maxWidth: '85%',
          margin: '4px 0',
          fontSize: '14px',
          lineHeight: '1.4'
        }}>
          <span>{ctaMessage}</span>
          <div style={{ marginTop: '4px' }}>
            <button
              onClick={handleCtaClick}
              style={{
                backgroundColor: theme.primaryColor,
                color: '#fff',
                border: `1px solid ${theme.primaryColor}`,
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              {theme.ctaText || 'YES, LET\'S GO'} <span style={{ fontSize: '16px' }}>➔</span>
            </button>
          </div>
        </div>
      );
    }

    if (msg.text.startsWith('__THANKYOU__')) {
      const thankYouText = msg.text.replace('__THANKYOU__', '');
      return (
        <div key={index} style={{
          alignSelf: 'flex-start',
          background: '#f1f0f0',
          padding: '10px 14px',
          borderRadius: '18px 18px 18px 0',
          fontSize: '14px',
          color: '#333',
          maxWidth: '80%'
        }}>
          <div>{thankYouText}</div>
          {theme.thankYouCtaText && theme.thankYouCtaUrl && (
            <div style={{ marginTop: '8px' }}>
              <a
                href={theme.thankYouCtaUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  backgroundColor: theme.primaryColor,
                  color: '#fff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'inline-block',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
              >
                {theme.thankYouCtaText}
              </a>
            </div>
          )}
          <div style={{ fontSize: '10px', color: '#888', marginTop: '3px' }}>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      );
    }

    return (
      <div
        key={index}
        style={{
          alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
          background: msg.type === 'user' ? '#dcf8c6' : '#f1f0f0',
          padding: '10px 14px',
          borderRadius: msg.type === 'user' ? '18px 18px 0 18px' : '18px 18px 18px 0',
          fontSize: '14px',
          color: msg.type === 'user' ? '#222' : '#333',
          maxWidth: '80%',
          wordWrap: 'break-word',
          whiteSpace: 'pre-wrap'
        }}
      >
        {msg.text}
        <div style={{ fontSize: '10px', color: '#888', marginTop: '3px' }}>
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        @keyframes pulseGreen {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(76, 175, 80, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
        @keyframes pulse {
          0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(76, 175, 80, 0); }
          100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(76, 175, 80, 0); }
        }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        @keyframes popupSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {showPopup && !isOpen && (
        <div
          onClick={openWidget}
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            background: '#fff',
            color: '#333',
            padding: '12px 16px',
            fontSize: '15px',
            maxWidth: '260px',
            borderRadius: '12px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            cursor: 'pointer',
            border: '1px solid #e0e0e0',
            animation: 'popupSlideIn 0.3s ease',
            zIndex: 999
          }}
        >
          {config.popupMessage}
        </div>
      )}

      <button
        onClick={openWidget}
        style={{
          position: 'fixed',
          bottom: '19px',
          right: '20px',
          width: '72px',
          height: '72px',
          border: 'none',
          background: 'none',
          padding: 0,
          cursor: 'pointer',
          borderRadius: '50%',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
          zIndex: 999,
          display: isOpen ? 'none' : 'block'
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <img
            src={theme.botAvatarUrl || 'https://via.placeholder.com/72'}
            alt="Chat"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '50%'
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '2px',
              right: '2px',
              width: '20px',
              height: '20px',
              backgroundColor: isBotPaused ? '#999' : '#4CAF50',
              borderRadius: '50%',
              animation: isBotPaused ? 'none' : 'pulseGreen 2s infinite',
              border: '3px solid white'
            }}
          />
        </div>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            width: '320px',
            height: '480px',
            background: 'white',
            border: '1px solid #ccc',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: theme.primaryColor,
              color: 'white',
              padding: '8px 12px'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'white',
                marginRight: '10px',
                overflow: 'hidden',
                flexShrink: 0
              }}
            >
              <img
                src={theme.logoUrl || 'https://via.placeholder.com/36'}
                alt="Logo"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div style={{ fontWeight: 'bold', fontSize: '18px', flexGrow: 1 }}>
              {bot.name}
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                fontSize: '22px',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              padding: '12px',
              overflowY: 'auto',
              background: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}
          >
            <div style={{ textAlign: 'center', userSelect: 'none', marginBottom: '12px' }}>
              <div style={{ position: 'relative', width: '72px', height: '72px', margin: '0 auto 8px' }}>
                <img
                  src={theme.botAvatarUrl || 'https://via.placeholder.com/72'}
                  alt="Bot"
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '4px',
                    right: '4px',
                    width: '12px',
                    height: '12px',
                    backgroundColor: isBotPaused ? '#999' : '#4CAF50',
                    borderRadius: '50%',
                    animation: isBotPaused ? 'none' : 'pulse 1.5s infinite',
                    border: '2px solid white'
                  }}
                />
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '18px', color: theme.primaryColor, marginBottom: '4px' }}>
                {theme.botName || 'Assistant'}
              </div>
              <div style={{ fontSize: '14px', color: isBotPaused ? '#000000' : '#666' }}>
                {isBotPaused ? 'This bot is currently paused. Please contact the site owner.' : (theme.botSubtitle || 'Customer Support')}
              </div>
            </div>

            {messages.map(renderMessage)}

            {isTyping && (
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  background: '#f1f0f0',
                  borderRadius: '18px 18px 18px 0',
                  padding: '10px 14px',
                  alignSelf: 'flex-start'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[0, 1, 2].map(i => (
                    <span
                      key={i}
                      style={{
                        width: '6px',
                        height: '6px',
                        background: '#666',
                        borderRadius: '50%',
                        display: 'inline-block',
                        animation: 'bounce 1.2s infinite ease-in-out both',
                        animationDelay: `${-0.32 + i * 0.16}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!leadSubmitted && currentQuestionIndex >= 0 && (
            <div style={{ borderTop: '1px solid #ccc', background: 'white' }}>
              {validationError && (
                <div style={{
                  padding: '8px 12px',
                  background: '#fee',
                  color: '#c33',
                  fontSize: '12px',
                  borderBottom: '1px solid #fcc'
                }}>
                  {validationError}
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '50px'
                }}
              >
                <input
                  type={config.questions[currentQuestionIndex]?.type === 'email' ? 'email' : config.questions[currentQuestionIndex]?.type === 'phone' ? 'tel' : 'text'}
                  value={currentInput}
                  onChange={(e) => {
                    setCurrentInput(e.target.value);
                    setValidationError('');
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="Type a message..."
                  style={{
                    flex: 1,
                    height: '100%',
                    padding: '0 12px',
                    fontSize: '14px',
                    border: 'none',
                    outline: 'none',
                    background: 'white',
                    color: '#333'
                  }}
                />
                <button
                  onClick={handleSubmit}
                  style={{
                    width: '70px',
                    height: '100%',
                    background: theme.primaryColor,
                    color: 'white',
                    border: 'none',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  SEND
                </button>
              </div>
            </div>
          )}

          {!owner?.removePoweredBy && (
            <div
              style={{
                padding: '6px 12px',
                textAlign: 'center',
                fontSize: '11px',
                color: '#999',
                borderTop: '1px solid #eee',
                background: 'white'
              }}
            >
              Powered by <a href="/" target="_blank" rel="noopener noreferrer" style={{ fontWeight: '600', color: '#666', textDecoration: 'none' }}>Clientsark</a>
            </div>
          )}
        </div>
      )}
    </>
  );
};
