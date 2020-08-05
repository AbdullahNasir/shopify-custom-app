const router = require('express').Router();
const {
  sendOTP,
  verifyOTP,
  showOTPVerificationPage,
} = require('../controllers/customers');

router.get('/show-otp-verification', showOTPVerificationPage);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
