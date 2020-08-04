const router = require('express').Router();

router.post('/send-otp', (req, res) => {
  // grab customer phone number
  const { phone } = req.body;
  console.log('phone', phone);

  // TODO send otp to given phone number
  // redirect user to otp verification page
  res.redirect('https://plaantz.myshopify.com/pages/verify-otp');
});

router.post('/verify-otp', (req, res) => {
  // verify otp
  // create user by making a POST request to Shopify Admin API
  // redirect to success page
});
