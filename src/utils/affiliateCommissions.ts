import { recordAffiliateSubscription } from './affiliateTracking';

export const trackSubscriptionCommission = async (
  userId: string,
  plan: string,
  amount: number
) => {
  await recordAffiliateSubscription(userId, plan, amount);
};

export const getPlanAmount = (plan: string): number => {
  const planPrices: Record<string, number> = {
    starter: 999,
    starter_yearly: 10190,
    growth: 2499,
    growth_yearly: 25490,
    professional: 2499,
    professional_yearly: 25490,
    pro: 4999,
    pro_yearly: 50990,
    enterprise: 4999,
    enterprise_yearly: 50990,
    addon_bot: 490,
    addon_bot_yearly: 5000,
    addon_ai_bot: 990,
    addon_ai_bot_yearly: 10098,
    addon_ai_bot_growth: 790,
    addon_ai_bot_growth_yearly: 8058
  };

  return planPrices[plan.toLowerCase()] || 0;
};
