import { useState, useEffect } from 'react';
import { CreditCard, Calendar, TrendingUp, Package, Sparkles, Send, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import type { PaymentRequest } from '../types';
import { PaymentRequestBanner } from '../components/PaymentRequestBanner';

export const Billing = () => {
  const { user } = useAuth();
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<{ type: string; plan?: string; addonType?: string; amount?: number } | null>(null);

  useEffect(() => {
    loadPaymentRequests();
  }, [user]);

  const loadPaymentRequests = async () => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'paymentRequests'),
        where('userId', '==', user.uid)
      );
      const snapshot = await getDocs(q);
      const requestsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          processedAt: data.processedAt?.toDate?.() || data.processedAt,
          expiryDate: data.expiryDate?.toDate?.() || data.expiryDate
        } as PaymentRequest;
      }).sort((a, b) => {
        const aTime = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
        const bTime = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
        return bTime - aTime;
      });
      setPaymentRequests(requestsData);
    } catch (error) {
      console.error('Error loading payment requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const createPaymentRequest = async () => {
    if (!user || !selectedRequest) return;

    setProcessingPlan('processing');
    try {
      await addDoc(collection(db, 'paymentRequests'), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        type: selectedRequest.type,
        plan: selectedRequest.plan || null,
        addonType: selectedRequest.addonType || null,
        amount: selectedRequest.amount || null,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      alert('Payment request submitted! Admin will review and send you a payment link.');
      await loadPaymentRequests();
      setShowPaymentModal(false);
      setSelectedRequest(null);
    } catch (error) {
      console.error('Payment request failed:', error);
      alert('Failed to submit payment request. Please try again.');
    } finally {
      setProcessingPlan(null);
    }
  };

  const handleUpgrade = (plan: 'starter' | 'growth') => {
    setSelectedRequest({ type: 'subscription', plan });
    setShowPaymentModal(true);
  };

  const handleBuyAddon = (addonType: 'bot' | 'ai_bot') => {
    setSelectedRequest({ type: 'addon', addonType });
    setShowPaymentModal(true);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      paid: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      payment_link_sent: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentPlan = user.subscription?.plan || 'free';
  const isOnTrial = user.trialActive && user.trialEndsAt && new Date(user.trialEndsAt) > new Date();
  const trialDaysLeft = isOnTrial
    ? Math.ceil((new Date(user.trialEndsAt!).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Billing & Subscription</h1>
      <PaymentRequestBanner />


      <PaymentRequestBanner />

      <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8">
        <div className="flex items-start gap-3">
          <CreditCard className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Manual Payment Process</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Submit a payment request and our admin will contact you with payment details.
              Your plan will be activated after payment confirmation.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <Package className="w-8 h-8 text-blue-600" />
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              currentPlan === 'growth' ? 'bg-green-100 text-green-800' :
              currentPlan === 'starter' ? 'bg-blue-100 text-blue-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Current Plan
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            {currentPlan === 'free' && 'Basic features included'}
            {currentPlan === 'starter' && '₹99/month'}
            {currentPlan === 'growth' && '₹699/month'}
          </div>
        </div>

        {isOnTrial && (
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900 dark:to-cyan-900 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold">
                Active
              </span>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {trialDaysLeft} Days Left
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Trial ends on {new Date(user.trialEndsAt!).toLocaleDateString()}
            </div>
          </div>
        )}

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <CreditCard className="w-8 h-8 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {user.subscription?.status === 'active' ? 'Active' : 'Inactive'}
          </div>
          <div className="text-gray-600 dark:text-gray-400 text-sm">
            Account status
          </div>
        </div>
      </div>

      {currentPlan === 'free' && !isOnTrial && (
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-8 mb-8 text-white">
          <h2 className="text-2xl font-bold mb-4">Upgrade Your Plan</h2>
          <p className="mb-6 text-blue-100">
            Get more bots, AI capabilities, and advanced features with our premium plans.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => handleUpgrade('starter')}
              className="bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Request Starter Plan - ₹99/mo
            </button>
            <button
              onClick={() => handleUpgrade('growth')}
              className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Request Growth Plan - ₹699/mo
            </button>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Add-ons
          </h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Package className="w-8 h-8 text-blue-600" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Extra Bot Slot</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">₹49/month</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Add one more chatbot to your account
              </p>
              <button
                onClick={() => handleBuyAddon('bot')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Request Purchase
              </button>
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-8 h-8 text-green-600" />
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">AI Bot Slot</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">₹99/month</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                Add one more AI-powered chatbot
              </p>
              <button
                onClick={() => handleBuyAddon('ai_bot')}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Request Purchase
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Payment Requests</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading payment requests...
            </div>
          ) : paymentRequests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No payment requests yet
            </div>
          ) : (
            paymentRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(request.status)}`}>
                        {request.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(request.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Type</p>
                        <p className="font-semibold text-gray-900 dark:text-white capitalize">{request.type}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Details</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {request.plan && `${request.plan.charAt(0).toUpperCase() + request.plan.slice(1)} Plan`}
                          {request.addonType && `${request.addonType === 'bot' ? 'Extra Bot' : 'AI Bot'} Addon`}
                        </p>
                      </div>
                    </div>
                    {request.paymentLink && request.status === 'payment_link_sent' && (
                      <div className="mt-3 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">
                          Payment Link Ready
                        </p>
                        <p className="text-xs text-blue-800 dark:text-blue-200 mb-3">
                          Please complete your payment using the link below:
                        </p>
                        <a
                          href={request.paymentLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Complete Payment
                        </a>
                      </div>
                    )}
                    {request.status === 'paid' && request.expiryDate && (
                      <div className="mt-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Subscription active until {request.expiryDate.toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {request.notes && (
                      <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                        <p className="font-medium">Admin Notes:</p>
                        <p>{request.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showPaymentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Confirm Payment Request
            </h3>
            <div className="space-y-4 mb-6">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                  {selectedRequest.type}
                </p>
              </div>
              {selectedRequest.plan && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Plan</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedRequest.plan.charAt(0).toUpperCase() + selectedRequest.plan.slice(1)}
                  </p>
                </div>
              )}
              {selectedRequest.addonType && (
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Addon</p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedRequest.addonType === 'bot' ? 'Extra Bot Slot' : 'AI Bot Slot'}
                  </p>
                </div>
              )}
            </div>
            <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-4 mb-6">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                After submitting this request, our admin will contact you via email with payment instructions.
                Your plan will be activated once payment is confirmed.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedRequest(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPaymentRequest}
                disabled={processingPlan !== null}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {processingPlan ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
