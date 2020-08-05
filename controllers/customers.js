const axios = require('axios');
const Shop = require('../models/Shop');
const Customer = require('../models/Customer');

exports.sendOTP = async (req, res) => {
  try {
    // grab customer phone number
    const { first_name, last_name, email, phone, password, shop } = req.body;

    // validation
    if (!first_name || !last_name || !email || !phone || !password || !shop) {
      return res.status(400).send('Missing Required Parameters');
    }

    // save customer data
    let newCustomer = new Customer({
      first_name,
      last_name,
      email,
      phone,
      password,
    });
    newCustomer = await newCustomer.save();

    // TODO send otp to given phone number

    // redirect user to otp verification page
    res.redirect(`https://${shop}/pages/verify-otp?id=${newCustomer._id}`);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    // get user inputted otp
    const { otp, shop } = req.body;

    // validation
    if (!otp || !shop) {
      return res.status(400).send('Missing Required Parameters');
    }

    // TODO verify otp

    // get access token
    const { access_token } = await Shop.findOne({ shop });
    if (!access_token) {
      return res.status(400).send('Invalid Shop');
    }

    // create user by making a POST request to Shopify Admin API
    const customer = await Customer.findById('5f29409abc265644280aee14', {
      _id: 0,
    });
    console.log('customer', customer);
    const { data } = await axios.post(
      `https://plaantz.myshopify.com/admin/api/2020-07/customers.json`,
      {
        customer,
      },
      {
        headers: {
          'X-Shopify-Access-Token': access_token,
        },
      }
    );
    console.log('data', data);
    // redirect to success page
    return res.redirect(`https://${shop}/account/login`);
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Internal Server Error');
  }
};
