const router = require('express').Router();
const validateProxyAction = require('../middlewares/validate-proxy-action');
const verifyShopifyRequest = require('../middlewares/verify-shopify-request');
const { showOTPVerificationPage } = require('../controllers/customers');

router.get('/', validateProxyAction, verifyShopifyRequest, (req, res, next) => {
  const { action } = req.query;
  switch (action) {
    case 'verify_otp':
      showOTPVerificationPage(req, res, next);
      return;
    default:
      return res.status(400).send('Invalid action');
  }
});

module.exports = router;
