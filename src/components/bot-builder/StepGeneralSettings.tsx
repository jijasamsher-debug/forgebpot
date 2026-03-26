import { BotConfig } from '../../types';

interface StepGeneralSettingsProps {
  botName: string;
  setBotName: (name: string) => void;
  config: BotConfig;
  updateConfig: (updates: Partial<BotConfig>) => void;
}

export const StepGeneralSettings = ({ botName, setBotName, config, updateConfig }: StepGeneralSettingsProps) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">General Settings</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Configure basic settings for your chatbot
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Bot Name
          </label>
          <input
            type="text"
            value={botName}
            onChange={(e) => setBotName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Support Bot"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Welcome Message
          </label>
          <textarea
            value={config.welcomeMessage}
            onChange={(e) => updateConfig({ welcomeMessage: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Hi there! How can I help you today?"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Popup Message
          </label>
          <input
            type="text"
            value={config.popupMessage}
            onChange={(e) => updateConfig({ popupMessage: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Have a question? Chat with us!"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Popup Delay (seconds)
          </label>
          <input
            type="number"
            value={config.popupDelay}
            onChange={(e) => updateConfig({ popupDelay: parseInt(e.target.value) || 0 })}
            min="0"
            max="60"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Time before showing the popup message (0 to disable)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Leads Table Name
          </label>
          <input
            type="text"
            value={config.leadsTableName || botName || ''}
            onChange={(e) => updateConfig({ leadsTableName: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="e.g., Support Leads, Contact Form"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            This name will appear in your leads dashboard
          </p>
        </div>
      </div>
    </div>
  );
};
