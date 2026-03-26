import { useState } from 'react';
import { PublicNav } from '../components/PublicNav';
import { DollarSign, Users, TrendingUp, CheckCircle } from 'lucide-react';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';

export const Affiliates = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    socialMedia: '',
    promotionPlan: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await addDoc(collection(db, 'affiliateApplications'), {
        userId: user?.uid || null,
        userEmail: formData.email,
        fullName: formData.name,
        websiteUrl: formData.website,
        socialMedia: formData.socialMedia,
        promotionPlan: formData.promotionPlan,
        status: 'pending',
        appliedAt: Timestamp.now()
      });
      setSubmitted(true);
      setFormData({ name: '', email: '', website: '', socialMedia: '', promotionPlan: '' });
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <PublicNav />

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Become an Affiliate Partner
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Earn up to 30% recurring commission by referring customers to BotForge
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full mb-4">
              <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">30% Commission</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Earn recurring commission on all referrals for 12 months
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Marketing Support</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get access to banners, landing pages, and marketing materials
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Real-time Tracking</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Monitor your referrals and earnings with our affiliate dashboard
            </p>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              Apply to Join Our Affiliate Program
            </h2>

            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Application Submitted!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  We'll review your application and get back to you within 2-3 business days.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Submit Another Application
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Website / Social Media URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Social Media / Additional URL
                  </label>
                  <input
                    type="text"
                    value={formData.socialMedia}
                    onChange={(e) => setFormData({ ...formData, socialMedia: e.target.value })}
                    placeholder="e.g., Twitter, LinkedIn, YouTube channel"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    How will you promote BotForge? *
                  </label>
                  <textarea
                    required
                    value={formData.promotionPlan}
                    onChange={(e) => setFormData({ ...formData, promotionPlan: e.target.value })}
                    rows={4}
                    placeholder="Describe your audience and promotion strategy"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors font-semibold text-lg"
                >
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
