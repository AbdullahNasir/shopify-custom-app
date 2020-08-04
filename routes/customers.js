const router = require('express').Router();
const { sendOTP, verifyOTP } = require('../controllers/customers');

router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;
