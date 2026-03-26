import { Bot, Sparkles, Lock } from 'lucide-react';
import { BotType } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface StepChooseTypeProps {
  botType: BotType;
  setBotType: (type: BotType) => void;
}

export const StepChooseType = ({ botType, setBotType }: StepChooseTypeProps) => {
  const { userData } = useAuth();

  const plan = userData?.plan || 'free';
  const isAiAllowed = plan !== 'free';
  const aiLimitReached = false;
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Choose Bot Type</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Select the type of chatbot you want to create
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setBotType('leads')}
          className={`p-6 rounded-xl border-2 text-left transition-all ${
            botType === 'leads'
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          }`}
        >
          <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mb-4">
            <Bot className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Leads Generator</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Collect visitor information through a conversational form. Perfect for capturing leads with
            customizable questions.
          </p>
        </button>

        <button
          onClick={() => isAiAllowed && setBotType('smart')}
          disabled={!isAiAllowed}
          className={`relative p-6 rounded-xl border-2 text-left transition-all ${
            botType === 'smart'
              ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
          } ${!isAiAllowed ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {!isAiAllowed && (
            <div className="absolute top-4 right-4">
              <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-md text-xs font-semibold">
                <Lock className="w-3 h-3" />
                Pro
              </div>
            </div>
          )}
          <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mb-4">
            <Sparkles className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Smart AI</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Powered by Google Gemini AI with your knowledge base. Provides intelligent responses to customer
            questions.
          </p>
          {!isAiAllowed && (
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-3 font-medium">
              Upgrade to Starter or Growth plan to use AI bots
            </p>
          )}
        </button>
      </div>
    </div>
  );
};
