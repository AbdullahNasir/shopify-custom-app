const router = require('express').Router();
const {
  sendOTP,
  verifyOTP,
  showOTPVerificationPage,
} = require('../controllers/customers');
const verifyShopifyRequest = require('../middlewares/verify-shopify-request');

router.get(
  '/show-otp-verification',
  verifyShopifyRequest,
  showOTPVerificationPage
);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
