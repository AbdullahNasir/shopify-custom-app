const router = require('express').Router();
const {
  sendOTP,
  verifyOTP,
  showOTPVerification,
} = require('../controllers/customers');

router.get('/show-otp-verification', showOTPVerification);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
