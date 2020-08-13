const axios = require('../utils/axios-for-shopify');
const Shop = require('../models/Shop');
const { verify_otp } = require('../constants/proxy-actions');

const adminAPIVersion = process.env.SHOPIFY_ADMIN_API_VERSION;

exports.placeOrder = async (req, res) => {
  try {
    // grab required data
    const {
      first_name,
      last_name,
      email,
      address1,
      address2,
      city,
      state,
      zip,
      variants,
      quantity,
      phone,
      shop,
      redirect_uri,
    } = req.body;

    // validation
    if (
      !first_name ||
      !last_name ||
      !email ||
      !address1 ||
      !address2 ||
      !city ||
      !state ||
      !zip ||
      !variants ||
      !quantity ||
      !phone ||
      !shop ||
      !redirect_uri
    ) {
      return res.status(400).send('Missing Required Parameters');
    }

    // get access token
    const access_token = await getShopAccessToken(shop);

    // create user by making a POST request to Shopify Admin API
    const { data: createdCustomer } = await axios(access_token).post(
      `https://${shop}/admin/api/${adminAPIVersion}/customers.json`,
      {
        customer: {
          first_name,
          last_name,
          email,
          phone,
          password: 'projectforloops',
          password_confirmation: 'projectforloops',
          addresses: [{ address1, address2, city, state, zip }],
        },
      }
    );

    // make draft order
    const draft_order = {
      line_items: makeDraftLineItems(variants, quantity),
      customer: {
        id: createdCustomer.customer['id'],
      },
      use_customer_default_address: true,
    };
    const { data: createdDraftOrder } = await axios(access_token).post(
      `https://${shop}/admin/api/${adminAPIVersion}/draft_orders.json`,
      {
        draft_order,
      }
    );

    // TODO send otp to given phone number

    // redirect user to otp verification page
    res.redirect(
      `https://${shop}/apps/custom?action=${verify_otp}&id=${createdDraftOrder.draft_order['id']}&redirect_uri=${redirect_uri}`
    );
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.confirmOrder = async (req, res) => {
  try {
    // get user inputted otp
    const { id, otp, shop } = req.body;

    // validation
    if (!id || !otp || !shop) {
      return res.status(400).send('Missing Required Parameters');
    }

    // TODO verify otp

    // get access token
    const access_token = await getShopAccessToken(shop);

    // complete draft order
    await axios(access_token).put(
      `https://${shop}/admin/api/${adminAPIVersion}/draft_orders/${id}/complete.json`
    );

    // respond with success
    return res.status(200).send('Order Completed Successfully');
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.showOTPVerificationPage = (req, res) => {
  const { id, shop, redirect_uri } = req.query;

  // validation
  // if (!id || !shop || !redirect_uri) {
  //   return res.status(400).send('Missing Required Parameters');
  // }

  res.set('Content-Type', 'application/liquid');
  return res.status(200).render('otp-verification', { id, shop, redirect_uri });
};

/* Helper Methods */
const makeDraftLineItems = (variants, quantity) => {
  if (Array.isArray(variants)) {
    return variants.map((variant, idx) => ({
      variant_id: variant,
      quantity: quantity[idx] || 1,
    }));
  }
  return {
    variant_id: variants,
    quantity: quantity || 1,
  };
};

const getShopAccessToken = async (shop) => {
  const { access_token } = await Shop.findOne({ shop });
  if (!access_token) {
    return res.status(400).send('Invalid Shop');
  }
  return access_token;
};
