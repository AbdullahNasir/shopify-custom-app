const router = require('express').Router();
const {
  initiateAppAuthorization,
  finishAppAuthorization,
} = require('../controllers/shopify');

router.get('/', initiateAppAuthorization);
router.get('/callback', finishAppAuthorization);

module.exports = router;
