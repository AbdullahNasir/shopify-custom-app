const Shop = require('../models/Shop');
const shopifyAPI = require('shopify-node-api');
const { shopifyScopes } = require('../constants');

const config = {
  shopify_api_key: process.env.SHOPIFY_API_KEY,
  shopify_shared_secret: process.env.SHOPIFY_API_SECRET,
  shopify_scope: shopifyScopes.join(' '),
  redirect_uri: `${process.env.NGROK_APP_URL}/shopify/callback`,
  nonce: process.env.SHOPIFY_API_STATE,
};

exports.initiateAppAuthorization = async (req, res) => {
  try {
    const { shop } = req.query;
    const Shopify = new shopifyAPI({
      shop,
      ...config,
    });
    const auth_url = Shopify.buildAuthURL();
    return res.redirect(auth_url);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.finishAppAuthorization = async (req, res) => {
  try {
    const { shop } = req.query;
    const Shopify = new shopifyAPI({
      shop,
      ...config,
    });
    // exchange code for permanent access token
    Shopify.exchange_temporary_token(req.query, async (error, data) => {
      if (error) throw error;
      // save shop credentials in DB
      let newShop = new Shop({
        shop,
        access_token: data.access_token,
        scopes: data.scope.split(','),
      });
      newShop = await newShop.save();
      console.log('newShop', newShop);
    });
    return res.status(200).send('Successfully Installed');
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Internal Server Error');
  }
};
