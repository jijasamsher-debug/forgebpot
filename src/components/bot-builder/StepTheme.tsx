import { BotConfig } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface StepThemeProps {
  config: BotConfig;
  updateConfig: (updates: Partial<BotConfig>) => void;
}

export const StepTheme = ({ config, updateConfig }: StepThemeProps) => {
  const { user } = useAuth();
  const updateTheme = (updates: Partial<BotConfig['theme']>) => {
    updateConfig({ theme: { ...config.theme, ...updates } });
  };

  const fontOptions = [
    { value: 'sans-serif', label: 'Sans-serif (Modern)' },
    { value: 'serif', label: 'Serif (Classic)' },
    { value: 'monospace', label: 'Monospace (Code)' },
    { value: '"Comic Sans MS", cursive', label: 'Rounded (Friendly)' }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Theme & Design</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Customize the appearance of your chatbot
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Widget Template
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => updateTheme({ template: 'standard' })}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                (config.theme.template || 'standard') === 'standard'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold text-gray-900 dark:text-white mb-1">Standard</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Classic chatbot design</div>
            </button>
            <button
              onClick={() => updateTheme({ template: 'modernui' })}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                config.theme.template === 'modernui'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
              }`}
            >
              <div className="font-semibold text-gray-900 dark:text-white mb-1">Modern UI</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Modern with animations</div>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Auto-Open Delay (seconds)
          </label>
          <input
            type="number"
            min="0"
            value={config.theme.autoOpenDelay || 0}
            onChange={(e) => updateTheme({ autoOpenDelay: parseInt(e.target.value) || 0 })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="0"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Set to 0 to disable auto-open. Widget will auto-open once per session.
          </p>
        </div>

        {config.theme.template === 'modernui' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bot Name
              </label>
              <input
                type="text"
                value={config.theme.botName || ''}
                onChange={(e) => updateTheme({ botName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Inaya"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bot Subtitle
              </label>
              <input
                type="text"
                value={config.theme.botSubtitle || ''}
                onChange={(e) => updateTheme({ botSubtitle: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Customer Support Assistant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Company Logo URL
              </label>
              <input
                type="url"
                value={config.theme.logoUrl || ''}
                onChange={(e) => updateTheme({ logoUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Bot Avatar URL
              </label>
              <input
                type="url"
                value={config.theme.botAvatarUrl || ''}
                onChange={(e) => updateTheme({ botAvatarUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="https://example.com/avatar.png"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CTA Message
              </label>
              <input
                type="text"
                value={config.theme.ctaMessage || ''}
                onChange={(e) => updateTheme({ ctaMessage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Get trending gift options for your Company?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                CTA Button Text
              </label>
              <input
                type="text"
                value={config.theme.ctaText || ''}
                onChange={(e) => updateTheme({ ctaText: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., YES, LET'S GO"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thank You Message
              </label>
              <input
                type="text"
                value={config.theme.thankYouMessage || ''}
                onChange={(e) => updateTheme({ thankYouMessage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Thank you! We'll get back to you soon."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Can be overridden per page in Page Rules
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thank You CTA Text (Optional)
                </label>
                <input
                  type="text"
                  value={config.theme.thankYouCtaText || ''}
                  onChange={(e) => updateTheme({ thankYouCtaText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Visit Website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thank You CTA URL (Optional)
                </label>
                <input
                  type="url"
                  value={config.theme.thankYouCtaUrl || ''}
                  onChange={(e) => updateTheme({ thankYouCtaUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>
            </div>

            {user?.role === 'admin' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="removePoweredBy"
                  checked={config.theme.removePoweredBy || false}
                  onChange={(e) => updateTheme({ removePoweredBy: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="removePoweredBy" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Remove "Powered by" watermark
                </label>
              </div>
            )}
          </>
        )}

        {config.theme.template === 'standard' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thank You Message
              </label>
              <input
                type="text"
                value={config.theme.thankYouMessage || ''}
                onChange={(e) => updateTheme({ thankYouMessage: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Thank you! We'll get back to you soon."
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Can be overridden per page in Page Rules
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thank You CTA Text (Optional)
                </label>
                <input
                  type="text"
                  value={config.theme.thankYouCtaText || ''}
                  onChange={(e) => updateTheme({ thankYouCtaText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Visit Website"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Thank You CTA URL (Optional)
                </label>
                <input
                  type="url"
                  value={config.theme.thankYouCtaUrl || ''}
                  onChange={(e) => updateTheme({ thankYouCtaUrl: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Primary Color
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={config.theme.primaryColor}
              onChange={(e) => updateTheme({ primaryColor: e.target.value })}
              className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={config.theme.primaryColor}
              onChange={(e) => updateTheme({ primaryColor: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="#2563eb"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Background Color
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={config.theme.bgColor}
              onChange={(e) => updateTheme({ bgColor: e.target.value })}
              className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={config.theme.bgColor}
              onChange={(e) => updateTheme({ bgColor: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Text Color
          </label>
          <div className="flex gap-3">
            <input
              type="color"
              value={config.theme.textColor}
              onChange={(e) => updateTheme({ textColor: e.target.value })}
              className="w-16 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
            />
            <input
              type="text"
              value={config.theme.textColor}
              onChange={(e) => updateTheme({ textColor: e.target.value })}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="#1f2937"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Font Family
          </label>
          <select
            value={config.theme.fontFamily}
            onChange={(e) => updateTheme({ fontFamily: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
          >
            {fontOptions.map(font => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
