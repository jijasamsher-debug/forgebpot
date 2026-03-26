import { Plus, Trash2, GripVertical } from 'lucide-react';
import { BotConfig, Question, BotType } from '../../types';

interface StepQuestionsProps {
  config: BotConfig;
  updateConfig: (updates: Partial<BotConfig>) => void;
  botType: BotType;
}

export const StepQuestions = ({ config, updateConfig, botType }: StepQuestionsProps) => {
  const addQuestion = () => {
    const newQuestion: Question = {
      id: `q_${Date.now()}`,
      text: '',
      type: 'text',
      required: false
    };
    updateConfig({ questions: [...config.questions, newQuestion] });
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    updateConfig({
      questions: config.questions.map(q => (q.id === id ? { ...q, ...updates } : q))
    });
  };

  const deleteQuestion = (id: string) => {
    updateConfig({ questions: config.questions.filter(q => q.id !== id) });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Questions</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        {botType === 'smart'
          ? 'Configure lead collection questions (shown before AI chat if enabled)'
          : 'Configure the questions to ask your visitors'}
      </p>

      {botType === 'smart' && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={config.collectLeadsFirst}
              onChange={(e) => updateConfig({ collectLeadsFirst: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Collect lead information before AI chat
            </span>
          </label>
        </div>
      )}

      <div className="space-y-4 mb-4">
        {config.questions.map((question, index) => (
          <div
            key={question.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-900"
          >
            <div className="flex items-start gap-3">
              <GripVertical className="w-5 h-5 text-gray-400 mt-2 cursor-move" />

              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={question.text}
                  onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                  placeholder="Question text (e.g., What is your email address?)"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />

                <input
                  type="text"
                  value={question.columnHeader || ''}
                  onChange={(e) => updateQuestion(question.id, { columnHeader: e.target.value })}
                  placeholder="Column header (e.g., Email, Phone) - Optional"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
                />

                <div className="flex gap-3">
                  <select
                    value={question.type}
                    onChange={(e) =>
                      updateQuestion(question.id, { type: e.target.value as Question['type'] })
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  >
                    <option value="text">Short Text</option>
                    <option value="email">Email</option>
                    <option value="phone">Phone Number</option>
                    <option value="select">Dropdown</option>
                  </select>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={question.required}
                      onChange={(e) => updateQuestion(question.id, { required: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Required</span>
                  </label>
                </div>

                {question.type === 'select' && (
                  <input
                    type="text"
                    value={question.options?.join(', ') || ''}
                    onChange={(e) =>
                      updateQuestion(question.id, {
                        options: e.target.value.split(',').map(o => o.trim()).filter(Boolean)
                      })
                    }
                    placeholder="Options (comma separated)"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                )}
              </div>

              <button
                onClick={() => deleteQuestion(question.id)}
                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addQuestion}
        className="flex items-center px-4 py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Question
      </button>
    </div>
  );
};
