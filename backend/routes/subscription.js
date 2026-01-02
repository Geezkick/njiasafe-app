const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const plans = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Basic navigation',
      'Limited emergency alerts',
      'Community access',
      'Basic weather updates',
    ],
  },
  basic: {
    name: 'Basic',
    price_monthly: 499,
    price_yearly: 4999,
    features: [
      'All Free features',
      'Real-time traffic updates',
      'Unlimited emergency alerts',
      'Basic analytics',
      'Ad-free experience',
    ],
  },
  premium: {
    name: 'Premium',
    price_monthly: 999,
    price_yearly: 9999,
    features: [
      'All Basic features',
      'EV charging locations',
      'V2V communication',
      'Advanced analytics',
      'AI Assistant',
      'Priority support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price_monthly: 2499,
    price_yearly: 24999,
    features: [
      'All Premium features',
      'Custom solutions',
      'API access',
      'Dedicated support',
      'Multiple users',
      'Custom branding',
    ],
  },
};

// Get all plans
router.get('/plans', (req, res) => {
  res.json(plans);
});

// Create subscription
router.post('/subscribe', async (req, res) => {
  try {
    const { plan, billing, paymentMethod, userId } = req.body;
    
    // For demo, just return success
    const subscription = {
      id: 'sub_' + Date.now(),
      plan,
      billing,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      paymentMethod,
    };

    res.json({
      message: 'Subscription created successfully',
      subscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Cancel subscription
router.post('/cancel', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    
    res.json({
      message: 'Subscription cancelled successfully',
      cancelledAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update subscription
router.put('/:id', async (req, res) => {
  try {
    const { plan, billing } = req.body;
    
    res.json({
      message: 'Subscription updated successfully',
      subscription: {
        id: req.params.id,
        plan,
        billing,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
