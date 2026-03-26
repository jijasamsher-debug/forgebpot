import { Link } from 'react-router-dom';
import { Bot, MessageCircle, Sparkles, Zap, Shield, BarChart3, CheckCircle, ArrowRight, Users, Clock, Globe } from 'lucide-react';
import { PublicNav } from '../components/PublicNav';

export const Home = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Leads Generator',
      description: 'Create conversational forms that engage visitors and collect high-quality leads automatically.'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Bots',
      description: 'Deploy intelligent chatbots powered by Google Gemini AI with your custom knowledge base.'
    },
    {
      icon: Zap,
      title: 'Easy Integration',
      description: 'Embed your chatbot on any website with a simple iframe or script tag. No coding required.'
    },
    {
      icon: BarChart3,
      title: 'Lead Analytics',
      description: 'Track and export all collected leads with detailed analytics and CSV export capabilities.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Built on Firebase with enterprise-grade security and 99.9% uptime guarantee.'
    },
    {
      icon: Globe,
      title: 'Page-Specific Rules',
      description: 'Customize bot behavior for different pages with dynamic URL-based configurations.'
    }
  ];

  const plans = [
    {
      name: 'Free',
      price: '₹0',
      period: 'forever',
      features: [
        '3 bots maximum',
        'Leads Generator only',
        'Unlimited chats',
        'First 30 leads visible',
        'Leads 31+ locked (₹19 each)'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Starter',
      price: '₹99',
      period: 'month',
      features: [
        '3 bots included',
        'Unlimited leads visible',
        'Unlimited chats',
        'Extra bots: +₹39/bot/month',
        'AI bot addon: +₹249/bot/month',
        'Email support'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Growth',
      price: '₹699',
      period: 'month',
      features: [
        '6 bots included',
        '3 AI bots included',
        'Unlimited leads & chats',
        'Extra AI bots: +₹199/bot/month',
        'Priority support',
        'Advanced features'
      ],
      cta: 'Start Free Trial',
      popular: false
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: MessageCircle, value: '1M+', label: 'Conversations' },
    { icon: Bot, value: '50,000+', label: 'Bots Created' },
    { icon: Clock, value: '24/7', label: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <PublicNav />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 opacity-70"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
              Create Smart Chatbots
              <br />
              <span className="text-blue-600">In Minutes</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Build AI-powered chatbots and lead generation forms for your website. No coding required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors shadow-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-600 text-gray-900 dark:text-white text-lg font-semibold rounded-lg transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>

          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 to-transparent h-32 bottom-0 z-10"></div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-gray-900 dark:text-white">Support Bot</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Live Preview</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-full text-sm font-medium">
                  Active
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg rounded-bl-none max-w-xs">
                    <p className="text-gray-900 dark:text-white">Hi there! How can I help you today?</p>
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="bg-blue-600 px-4 py-3 rounded-lg rounded-br-none max-w-xs">
                    <p className="text-white">I need help with pricing</p>
                  </div>
                </div>
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-lg rounded-bl-none max-w-xs">
                    <p className="text-gray-900 dark:text-white">I'd be happy to help! We offer flexible plans starting at ₹499/month...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center">
                  <Icon className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="features" className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features to help you capture leads and engage visitors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg transition-shadow"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Get your chatbot up and running in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Create Your Bot',
                description: 'Choose between Leads Generator or Smart AI bot, customize the design and questions'
              },
              {
                step: '2',
                title: 'Configure Settings',
                description: 'Set up your welcome message, theme, and add your knowledge base articles'
              },
              {
                step: '3',
                title: 'Embed & Launch',
                description: 'Copy the embed code and paste it on your website. That\'s it!'
              }
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
                  <div className="w-12 h-12 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{item.title}</h3>
                  <p className="text-blue-100">{item.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-white/50" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the perfect plan for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-900 rounded-2xl border-2 p-6 sm:p-8 relative transition-all ${
                  plan.popular
                    ? 'border-blue-600 shadow-xl md:scale-105'
                    : 'border-gray-200 dark:border-gray-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap">
                      Most Popular
                    </span>
                  </div>
                )}

                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white">{plan.price}</span>
                  {plan.period && (
                    <span className="text-base sm:text-lg text-gray-500 dark:text-gray-400">/{plan.period}</span>
                  )}
                </div>

                <ul className="space-y-3 sm:space-y-4 mb-8 min-h-[180px] sm:min-h-[200px]">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mr-2 sm:mr-3 flex-shrink-0 mt-0.5" />
                      <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/pricing"
                  className={`block text-center py-3 px-6 rounded-lg font-medium transition-colors text-sm sm:text-base ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of businesses using BotForge to engage visitors and capture leads
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-lg transition-colors shadow-lg"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
          <p className="mt-4 text-gray-500 dark:text-gray-400">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      <footer className="bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Bot className="w-8 h-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">BotForge</span>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Create smart chatbots and capture leads effortlessly.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2">
                <li><Link to="/features" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Pricing</Link></li>
                <li><Link to="/pricing" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Get Started</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">About</Link></li>
                <li><Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Blog</Link></li>
                <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Privacy</Link></li>
                <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Terms</Link></li>
                <li><Link to="/security" className="text-gray-600 dark:text-gray-400 hover:text-blue-600">Security</Link></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-gray-600 dark:text-gray-400">
            <p>&copy; 2024 BotForge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
