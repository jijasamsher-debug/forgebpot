import { useState } from 'react';
import { Check, X, Bot, Sparkles, Lock, HelpCircle } from 'lucide-react';
import { PublicNav } from '../components/PublicNav';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Pricing = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = (plan: 'free' | 'starter' | 'growth') => {
    if (!user) {
      navigate('/login?plan=' + plan);
    } else if (plan === 'free') {
      navigate('/dashboard');
    } else {
      navigate('/dashboard/billing?upgrade=' + plan);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8">
            Choose the perfect plan for your business. Start free, upgrade as you grow.
          </p>

          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-lg p-1 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-6 py-2 rounded-md font-medium transition-colors relative ${
                billingPeriod === 'annual'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                Save 15%
              </span>
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Free</h3>
              <div className="flex items-baseline mb-4">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">₹0</span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">/forever</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">Perfect for trying out BotForge</p>
            </div>

            <button
              onClick={() => handleGetStarted('free')}
              className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors mb-6"
            >
              Get Started Free
            </button>

            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">3 bots maximum</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Leads Generator only</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Unlimited chats</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">First 30 leads visible</span>
              </li>
              <li className="flex items-start text-gray-500 dark:text-gray-400">
                <Lock className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                <span>Leads 31+ locked (unlock for ₹19 each)</span>
              </li>
              <li className="flex items-start text-gray-500 dark:text-gray-400">
                <X className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                <span>No AI bots</span>
              </li>
            </ul>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-500 p-8 relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
              Popular
            </div>

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Starter</h3>
              <div className="flex items-baseline mb-1">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹{billingPeriod === 'monthly' ? '999' : '10,190'}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'annual' && (
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                  ₹849/month • Save ₹1,798/year
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-400">Great for small businesses</p>
            </div>

            <button
              onClick={() => handleGetStarted('starter')}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors mb-6"
            >
              Start Free Trial
            </button>

            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">3 bots included</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Unlimited leads visible</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Unlimited chats</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Extra bots: +₹39/bot/month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">AI bot addon: +₹249/bot/month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Email support</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl border-2 border-blue-300 dark:border-blue-700 p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                Growth <Sparkles className="w-5 h-5 text-yellow-500 ml-2" />
              </h3>
              <div className="flex items-baseline mb-1">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">
                  ₹{billingPeriod === 'monthly' ? '2,499' : '25,490'}
                </span>
                <span className="text-gray-500 dark:text-gray-400 ml-2">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'annual' && (
                <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                  ₹2,124/month • Save ₹4,498/year
                </p>
              )}
              <p className="text-gray-600 dark:text-gray-400">For growing businesses</p>
            </div>

            <button
              onClick={() => handleGetStarted('growth')}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors mb-6"
            >
              Start Free Trial
            </button>

            <ul className="space-y-4">
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">6 bots included</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">3 AI bots included</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Unlimited leads visible</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Unlimited chats</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Extra AI bots: +₹199/bot/month</span>
              </li>
              <li className="flex items-start">
                <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 dark:text-gray-300">Priority support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add-ons</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Bot className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Extra Bot Slot</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Add more lead generation bots to your plan
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ₹{billingPeriod === 'monthly' ? '490' : '5,000'}{billingPeriod === 'monthly' ? '/month' : '/year'}
              </p>
              {billingPeriod === 'annual' && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                  Save ₹880/year
                </p>
              )}
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">AI Bot Addon</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Enable Smart AI capabilities for any bot
              </p>
              <div className="space-y-2">
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{billingPeriod === 'monthly' ? '990' : '10,098'}{billingPeriod === 'monthly' ? '/month' : '/year'}
                    <span className="text-sm text-gray-500 ml-2">(Starter)</span>
                  </p>
                  {billingPeriod === 'annual' && (
                    <p className="text-xs text-green-600 dark:text-green-400">Save ₹1,782/year</p>
                  )}
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    ₹{billingPeriod === 'monthly' ? '790' : '8,058'}{billingPeriod === 'monthly' ? '/month' : '/year'}
                    <span className="text-sm text-gray-500 ml-2">(Growth)</span>
                  </p>
                  {billingPeriod === 'annual' && (
                    <p className="text-xs text-green-600 dark:text-green-400">Save ₹1,422/year</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 mb-16 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Unlock Individual Leads</h2>
          <p className="text-xl mb-6 text-blue-100">
            On the free plan? Unlock leads beyond your first 30 for just ₹19 each
          </p>
          <p className="text-blue-100">
            Perfect for testing the platform before committing to a monthly plan
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <HelpCircle className="w-6 h-6 mr-2" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Can I upgrade or downgrade my plan?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Yes, you can upgrade or downgrade at any time from your dashboard. Changes take effect immediately, and billing is prorated based on your current billing cycle.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                What happens if my payment fails?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                If a subscription payment fails, all your bots will be immediately deactivated. You can reactivate them by updating your payment method and clearing any overdue amounts.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Is there a refund policy?
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Monthly subscription payments are non-refundable, but you can cancel at any time to prevent future charges. Your service will continue until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Still have questions?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our team is here to help you choose the right plan
          </p>
          <Link
            to="/contact"
            className="inline-block px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};
