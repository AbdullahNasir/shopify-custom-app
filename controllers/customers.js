// const axios = require('axios');
const Shop = require('../models/Shop');
const Customer = require('../models/Customer');

const axios = require('../utils/axios-for-shopify');

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
    res.redirect(`https://${shop}/apps/verify-otp?id=${newCustomer._id}`);
  } catch (error) {
    console.log('error', error);
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

    // create user by making a POST request to Shopify Admin API
    const customer = await Customer.findById(id, {
      _id: 0,
    });
    console.log('customer', customer);
    const { data } = await axios(access_token).post(
      `https://${shop}/admin/api/2020-07/customers.json`,
      {
        customer,
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

exports.showOTPVerification = (req, res) => {
  const { id, shop } = req.query;

  // validation
  if (!id || !shop) {
    return res.status(400).send('Missing Required Parameters');
  }

  res.set('Content-Type', 'application/liquid');
  return res.status(200).render('otp-verification', { id, shop });
};
