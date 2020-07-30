const axios = require('axios');
const { shopifyScopes } = require('../constants');

exports.initiateAppAuthorization = async (req, res) => {
  try {
    const { shop } = req.query;
    if (shop) {
      const state = process.env.SHOPIFY_API_STATE;
      const redirectURI = `${process.env.NGROK_APP_URL}/shopify/callback`;
      const installURL = `https://${shop}/admin/oauth/authorize?client_id=${
        process.env.SHOPIFY_API_KEY
      }&scope=${shopifyScopes.join(
        ' '
      )}&state=${state}&redirect_uri=${redirectURI}`;
      return res.redirect(installURL);
    } else {
      return res.status(400).send('Missinge shop parameter');
    }
  } catch (error) {
    return res.status(500).send('Internal Server Error');
  }
};

exports.finishAppAuthorization = async (req, res) => {
  try {
    const { shop, hmac, code, state } = req.query;
    if (state !== process.env.SHOPIFY_API_STATE) {
      return res.status(403).send('Request origin cannot be verified');
    }

    if (shop && hmac && code) {
      // TODO
      // Validate request is from Shopify
      // Exchange temporary code for a permanent access token
      const { data: credentials } = await axios.post(
        `https://${shop}/admin/oauth/access_token`,
        {
          client_id: process.env.SHOPIFY_API_KEY,
          client_secret: process.env.SHOPIFY_API_SECRET,
          code,
        }
      );
      console.log('credentials', credentials);

      // Use access token to make API call to 'shop' endpoint
      const responseShop = await axios.get(
        `https://${shop}/admin/api/2020-07/shop.json`,
        {
          headers: {
            'X-Shopify-Access-Token': credentials.access_token,
          },
        }
      );
      console.log('responseShop', responseShop.data);
      return res.status(200).send(responseShop.data);
    } else {
      return res.status(400).send('Required parameters missing');
    }
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Internal Server Error');
  }
};
