import { Plus, Trash2 } from 'lucide-react';
import { BotConfig, PageRule } from '../../types';

interface StepPageRulesProps {
  config: BotConfig;
  updateConfig: (updates: Partial<BotConfig>) => void;
}

export const StepPageRules = ({ config, updateConfig }: StepPageRulesProps) => {
  const addRule = () => {
    const newRule: PageRule = {
      id: `rule_${Date.now()}`,
      urlPattern: '',
      welcomeMessage: '',
      popupMessage: ''
    };
    updateConfig({ pageRules: [...config.pageRules, newRule] });
  };

  const updateRule = (id: string, updates: Partial<PageRule>) => {
    updateConfig({
      pageRules: config.pageRules.map(r => (r.id === id ? { ...r, ...updates } : r))
    });
  };

  const deleteRule = (id: string) => {
    updateConfig({ pageRules: config.pageRules.filter(r => r.id !== id) });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page Rules</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Customize bot behavior for specific pages (optional)
      </p>

      <div className="space-y-4 mb-4">
        {config.pageRules.map((rule) => (
          <div
            key={rule.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
          >
            <div className="flex items-start gap-3">
              <div className="flex-1 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    URL Pattern
                  </label>
                  <input
                    type="text"
                    value={rule.urlPattern}
                    onChange={(e) => updateRule(rule.id, { urlPattern: e.target.value })}
                    placeholder="/pricing, /contact, *.example.com/products/*"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Custom Welcome Message (optional)
                  </label>
                  <input
                    type="text"
                    value={rule.welcomeMessage || ''}
                    onChange={(e) => updateRule(rule.id, { welcomeMessage: e.target.value })}
                    placeholder="Leave empty to use default"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Custom Popup Message (optional)
                  </label>
                  <input
                    type="text"
                    value={rule.popupMessage || ''}
                    onChange={(e) => updateRule(rule.id, { popupMessage: e.target.value })}
                    placeholder="Leave empty to use default"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Custom Thank You Message (optional)
                  </label>
                  <input
                    type="text"
                    value={rule.customThankYouMessage || ''}
                    onChange={(e) => updateRule(rule.id, { customThankYouMessage: e.target.value })}
                    placeholder="Leave empty to use default from theme"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                  />
                </div>
              </div>

              <button
                onClick={() => deleteRule(rule.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {config.pageRules.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No page-specific rules configured. The default settings will apply to all pages.
        </div>
      )}

      <button
        onClick={addRule}
        className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Page Rule
      </button>
    </div>
  );
};
