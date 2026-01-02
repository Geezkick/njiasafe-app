import React, { createContext, useState, useContext } from 'react';

const SubscriptionContext = createContext({});

export const useSubscription = () => useContext(SubscriptionContext);

export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState({
    plan: 'free',
    status: 'active',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
  });

  const upgradePlan = (newPlan) => {
    setSubscription({
      plan: newPlan,
      status: 'active',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
  };

  const cancelSubscription = () => {
    setSubscription({
      ...subscription,
      status: 'cancelled',
    });
  };

  const value = {
    subscription,
    upgradePlan,
    cancelSubscription,
    isPremium: subscription.plan === 'premium' || subscription.plan === 'enterprise',
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};
