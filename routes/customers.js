const router = require('express').Router();
const { placeOrder, confirmOrder } = require('../controllers/customers');

router.post('/place-order', placeOrder);
router.post('/confirm-order', confirmOrder);

module.exports = router;
