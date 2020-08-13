const router = require('express').Router();
const {
  placeOrder,
  confirmOrder,
  showOTPVerificationPage,
} = require('../controllers/customers');
const verifyShopifyRequest = require('../middlewares/verify-shopify-request');

router.get(
  '/show-otp-verification',
  verifyShopifyRequest,
  showOTPVerificationPage
);
router.post('/place-order', placeOrder);
router.post('/confirm-order', confirmOrder);

module.exports = router;
