const express = require('express');
const router = express.Router();
const axios = require('axios');

// M-Pesa STK Push
router.post('/stk-push', async (req, res) => {
  try {
    const { phone, amount, account } = req.body;
    
    // Mock M-Pesa response
    const response = {
      MerchantRequestID: '29115-34620561-1',
      CheckoutRequestID: 'ws_CO_191220191020363925',
      ResponseCode: '0',
      ResponseDescription: 'Success. Request accepted for processing',
      CustomerMessage: 'Success. Request accepted for processing',
    };

    // Simulate callback after 5 seconds
    setTimeout(() => {
      console.log('M-Pesa payment completed for:', phone, amount, account);
    }, 5000);

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// M-Pesa callback
router.post('/callback', (req, res) => {
  const callback = req.body;
  
  if (callback.Body.stkCallback.ResultCode === 0) {
    console.log('Payment successful:', callback);
    
    // Update subscription in database
    // This would typically update the user's subscription status
  } else {
    console.log('Payment failed:', callback);
  }
  
  res.status(200).send('OK');
});

// Check transaction status
router.get('/status/:id', async (req, res) => {
  try {
    // Mock status check
    const status = {
      transactionId: req.params.id,
      status: 'Completed',
      amount: 999,
      phone: '2547XXXXXXXX',
      timestamp: new Date().toISOString(),
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
