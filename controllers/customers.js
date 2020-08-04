const axios = require('axios');
const Shop = require('../models/Shop');
const Customer = require('../models/Customer');

exports.sendOTP = async (req, res) => {
  try {
    // grab customer phone number
    const { first_name, last_name, email, phone, password } = req.body;
    console.log('phone', phone);

    // save customer data
    let newCustomer = new Customer({
      first_name,
      last_name,
      email,
      phone,
      password,
    });
    newCustomer = await newCustomer.save();
    console.log('newCustomer', newCustomer);

    // TODO send otp to given phone number
    // redirect user to otp verification page
    res.redirect('https://plaantz.myshopify.com/pages/verify-otp');
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Internal Server Error');
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    // get user inputted otp
    const { otp } = req.body;
    console.log('otp', otp);
    // verify otp

    // get access token
    const credentials = await Shop.findOne({ shop: 'plaantz.myshopify.com' });
    console.log('credentials', credentials);
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
          'X-Shopify-Access-Token': credentials.access_token,
        },
      }
    );
    console.log('data', data);
    // redirect to success page
  } catch (error) {
    console.log('error', error);
    return res.status(500).send('Internal Server Error');
  }
};
