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
      phone,
      password,
      shop,
      redirect_uri,
    } = req.body;

    // validation
    if (
      !first_name ||
      !last_name ||
      !email ||
      !phone ||
      !password ||
      !shop ||
      !redirect_uri
    ) {
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
    res.redirect(
      `https://${shop}/apps/verify-otp?id=${newCustomer._id}&redirect_uri=${redirect_uri}`
    );
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
    const customer = await Customer.findById(id);
    await axios(access_token).post(
      `https://${shop}/admin/api/2020-07/customers.json`,
      {
        customer,
      }
    );

    // delete customer from local DB
    await customer.deleteOne();

    // redirect to login page
    return res.redirect(`https://${shop}/account/login`);
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
