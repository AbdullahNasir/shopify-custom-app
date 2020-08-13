const axios = require('../utils/axios-for-shopify');
const Shop = require('../models/Shop');
const Customer = require('../models/Customer');

exports.sendOTP = async (req, res) => {
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
    const { access_token } = await Shop.findOne({ shop });
    if (!access_token) {
      return res.status(400).send('Invalid Shop');
    }

    // create user by making a POST request to Shopify Admin API
    const { data: createdCustomer } = await axios(access_token).post(
      `https://${shop}/admin/api/2020-07/customers.json`,
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

    console.log('createdCustomer', createdCustomer);

    const a = (variants) => {
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

    const draft_order = {
      line_items: a(variants),
      customer: {
        id: createdCustomer.customer['id'],
      },
      use_customer_default_address: true,
    };

    console.log('draft_order', draft_order);

    // create draft order
    const { data: createdDraftOrder } = await axios(access_token).post(
      `https://${shop}/admin/api/2020-07/draft_orders.json`,
      {
        draft_order,
      }
    );

    console.log('createdDraftOrder', createdDraftOrder);

    // save customer data
    // let newCustomer = new Customer({
    //   first_name,
    //   last_name,
    //   email,
    //   phone,
    //   password: 'projectforloops',
    //   addresses: [address1, address2, city, state, zip],
    // });
    // newCustomer = await newCustomer.save();

    // create a draft order

    // TODO send otp to given phone number

    // redirect user to otp verification page
    res.redirect(
      `https://${shop}/apps/verify-otp?id=${createdDraftOrder.draft_order['id']}&redirect_uri=${redirect_uri}`
    );
  } catch (error) {
    console.log('error', error.response);
    return res.status(500).send('Internal Server Error');
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    // get user inputted otp
    const { id, otp, shop } = req.body;

    // validation
    if (!id || !otp || !shop) {
      return res.status(400).send('Missing Required Parameters');
    }

    // TODO verify otp

    // get access token
    const { access_token } = await Shop.findOne({ shop });
    if (!access_token) {
      return res.status(400).send('Invalid Shop');
    }

    // complete draft order
    await axios(access_token).put(
      `https://${shop}/admin/api/2020-07/draft_orders/${id}/complete.json`
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
