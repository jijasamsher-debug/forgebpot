import { useState } from 'react';
import { Check } from 'lucide-react';
import { PaymentRequestBanner } from '../components/PaymentRequestBanner';
import { UpgradeRequestModal } from '../components/UpgradeRequestModal';

export const Upgrade = () => {
  const [selectedPlan, setSelectedPlan] = useState<{ name: string; price: string } | null>(null);
  const plans = [
    {
      name: 'Basic',
      price: '₹499',
      period: 'month',
      features: [
        'Up to 3 chatbots',
        '1,000 conversations/month',
        'Basic analytics',
        'Email support',
        'Custom branding'
      ]
    },
    {
      name: 'Pro',
      price: '₹999',
      period: 'month',
      popular: true,
      features: [
        'Unlimited chatbots',
        'Unlimited conversations',
        'Advanced analytics',
        'Priority support',
        'Custom branding',
        'API access',
        'White-label option'
      ]
    }
  ];

  return (
    <div className="min-h-screen p-6">
        <PaymentRequestBanner />

      <div className="max-w-5xl mx-auto">
        <PaymentRequestBanner />

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Upgrade to unlock unlimited features and scale your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white dark:bg-gray-800 rounded-2xl border-2 p-8 relative ${
                plan.popular
                  ? 'border-blue-600 shadow-xl'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400">/{plan.period}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlan({ name: plan.name, price: plan.price })}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                Request This Plan
              </button>
            </div>
          ))}
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-900 dark:text-blue-100 mb-2">
            How It Works
          </h3>
          <p className="text-blue-800 dark:text-blue-200 mb-4">
            Click "Request This Plan" and our admin will send you payment details via email. Once payment is confirmed, your account will be upgraded instantly.
          </p>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            Need a custom plan or have questions? Include them in your request message!
          </p>
        </div>
      </div>

      <UpgradeRequestModal
        isOpen={!!selectedPlan}
        onClose={() => setSelectedPlan(null)}
        planName={selectedPlan?.name || ''}
        planPrice={selectedPlan?.price || ''}
      />
    </div>
  );
};
