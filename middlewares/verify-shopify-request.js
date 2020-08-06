const crypto = require('crypto');
const querystring = require('querystring');

module.exports = (req, res, next) => {
  try {
    const { signature, hmac } = req.query;
    const map = Object.assign({}, req.query);
    // remove signature or hmac key for generating hmac for verification
    delete map['signature'];
    delete map['hmac'];
    let message = querystring.stringify(map);
    message = querystring.unescape(message).split('&').sort().join('');
    const providedHmac = signature || hmac;
    // generate hmac from query params and shopify secret
    const generatedHmac = crypto
      .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
      .update(message)
      .digest('hex');

    // verify hmac
    const hashEquals = crypto.timingSafeEqual(
      Buffer.from(generatedHmac, 'utf-8'),
      Buffer.from(providedHmac, 'utf-8')
    );

    // if signature is not verified respond with bad request
    if (!hashEquals) {
      return res
        .status(400)
        .send('Signature of the request cannot be verified');
    }
    // if hash is equal then call the next middleware
    next();
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Internal Server Error');
  }
};
