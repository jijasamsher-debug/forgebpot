declare global {
  interface Window {
    Razorpay: any;
  }
}

const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

interface PaymentOptions {
  orderId: string;
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  onSuccess: (response: any) => void;
  onError: (error: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
}

export const initiatePayment = async (options: PaymentOptions) => {
  const res = await loadRazorpayScript();
  if (!res) {
    alert('Razorpay SDK failed to load. Please check your connection.');
    return;
  }

  const rzpOptions = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: options.amount,
    currency: options.currency || 'INR',
    name: options.name || 'BotForge',
    description: options.description || 'Payment',
    order_id: options.orderId,
    handler: function (response: any) {
      options.onSuccess(response);
    },
    prefill: options.prefill || {},
    theme: {
      color: '#2563eb',
    },
    modal: {
      ondismiss: function () {
        options.onError({ message: 'Payment cancelled' });
      },
    },
  };

  const paymentObject = new window.Razorpay(rzpOptions);
  paymentObject.open();
};

export const createActivationOrder = async (userId: string, offerConfig?: any) => {
  const response = await fetch(`${EDGE_FUNCTION_URL}/create-activation-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ userId, offerConfig }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create activation order');
  }

  const data = await response.json();

  return new Promise((resolve, reject) => {
    initiatePayment({
      orderId: data.orderId,
      amount: data.amount,
      description: 'Account Activation - ₹10',
      onSuccess: (response) => {
        resolve(response);
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
};

export const createSubscriptionOrder = async (userId: string, plan: 'starter' | 'growth') => {
  const response = await fetch(`${EDGE_FUNCTION_URL}/create-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ userId, plan }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create subscription');
  }

  const data = await response.json();

  return new Promise((resolve, reject) => {
    initiatePayment({
      orderId: data.orderId,
      amount: data.amount,
      description: `${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan Subscription`,
      onSuccess: (response) => {
        resolve(response);
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
};

export const createLeadUnlockOrder = async (userId: string, leadId: string) => {
  const response = await fetch(`${EDGE_FUNCTION_URL}/create-lead-unlock-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ userId, leadId }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create lead unlock order');
  }

  const data = await response.json();

  return new Promise((resolve, reject) => {
    initiatePayment({
      orderId: data.orderId,
      amount: data.amount,
      description: 'Unlock Lead - ₹19',
      onSuccess: (response) => {
        resolve(response);
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
};

export const createAddonOrder = async (userId: string, addonType: 'bot' | 'ai_bot', userPlan?: string) => {
  const response = await fetch(`${EDGE_FUNCTION_URL}/create-addon-order`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ userId, addonType, userPlan }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to create addon order');
  }

  const data = await response.json();

  return new Promise((resolve, reject) => {
    initiatePayment({
      orderId: data.orderId,
      amount: data.amount,
      description: `${addonType === 'bot' ? 'Extra Bot' : 'AI Bot'} Addon`,
      onSuccess: (response) => {
        resolve(response);
      },
      onError: (error) => {
        reject(error);
      },
    });
  });
};
