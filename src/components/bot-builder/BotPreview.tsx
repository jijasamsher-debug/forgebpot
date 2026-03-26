import { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { BotConfig, BotType } from '../../types';

interface BotPreviewProps {
  config: BotConfig;
  botType: BotType;
}

export const BotPreview = ({ config, botType }: BotPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'bot' | 'user'; text: string }>>([
    { type: 'bot', text: config.welcomeMessage }
  ]);

  return (
    <div className="relative">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-4 mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Preview of your chatbot widget
        </p>
      </div>

      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        {!isOpen && (
          <div className="p-4">
            <button
              onClick={() => setIsOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-colors"
              style={{ backgroundColor: config.theme.primaryColor, color: '#ffffff' }}
            >
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">Chat with us</span>
            </button>
          </div>
        )}

        {isOpen && (
          <div className="flex flex-col h-96">
            <div
              className="p-4 flex items-center justify-between"
              style={{ backgroundColor: config.theme.primaryColor }}
            >
              <h3 className="font-semibold text-white" style={{ fontFamily: config.theme.fontFamily }}>
                Chat
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-1 rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div
              className="flex-1 p-4 overflow-y-auto space-y-3"
              style={{ backgroundColor: config.theme.bgColor }}
            >
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-lg ${
                      msg.type === 'user' ? 'rounded-br-none' : 'rounded-bl-none'
                    }`}
                    style={{
                      backgroundColor: msg.type === 'user' ? config.theme.primaryColor : '#f3f4f6',
                      color: msg.type === 'user' ? '#ffffff' : config.theme.textColor,
                      fontFamily: config.theme.fontFamily
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  style={{ fontFamily: config.theme.fontFamily }}
                />
                <button
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: config.theme.primaryColor, color: '#ffffff' }}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <p className="text-xs text-gray-600 dark:text-gray-400">
          <strong>Type:</strong> {botType === 'leads' ? 'Leads Generator' : 'Smart AI'}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
          <strong>Questions:</strong> {config.questions.length}
        </p>
      </div>
    </div>
  );
};
