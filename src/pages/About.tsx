import { Target, Heart, Users, Zap } from 'lucide-react';
import { PublicNav } from '../components/PublicNav';

export const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            About BotForge
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            We're on a mission to make powerful chatbot technology accessible to every business, regardless of size or technical expertise.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              BotForge was born from a simple observation: businesses of all sizes were losing potential customers simply because they couldn't respond fast enough to website visitors. Traditional chatbot solutions were either too expensive, too complex, or required coding knowledge that most small business owners didn't have.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              We set out to change that. Our goal was to create a platform where anyone could build professional, intelligent chatbots in minutes, not days. A platform that would be powerful enough for enterprises yet simple enough for solopreneurs.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Today, BotForge powers thousands of conversations daily, helping businesses capture leads, answer questions, and provide instant support to their visitors. We're proud to be part of our customers' growth stories.
            </p>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-800 rounded-xl p-8 border border-blue-200 dark:border-blue-700">
              <Target className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Accessibility First</h3>
              <p className="text-gray-700 dark:text-gray-300">
                We believe powerful technology should be accessible to everyone. No coding required, no technical barriers, just simple tools that work.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-800 dark:to-gray-800 rounded-xl p-8 border border-purple-200 dark:border-purple-700">
              <Heart className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Customer Success</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Your success is our success. We're committed to providing the tools, support, and resources you need to grow your business.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Innovation</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Constantly improving and evolving our platform
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Integrity</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Transparent pricing and honest communication
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Community</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Building together with our customers
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Excellence</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Delivering quality in everything we do
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-12 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                AK
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Amit Kumar</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">CEO & Founder</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                PS
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Priya Sharma</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Head of Product</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                RG
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Rahul Gupta</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lead Engineer</p>
            </div>

            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                SM
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Sneha Mehta</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Customer Success</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We're just getting started. Be part of the chatbot revolution and help us build the future of customer engagement.
          </p>
          <a
            href="/pricing"
            className="inline-block px-8 py-3 bg-white text-blue-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </div>
  );
};
