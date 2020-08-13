const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  address1: {
    type: String,
    required: true,
  },
  address2: {
    type: String,
    require: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  zip: {
    type: String,
    required: true,
  },
});

const customerSchema = new Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    password_confirmation: {
      type: String,
    },
    verified_email: {
      type: Boolean,
      required: true,
      default: true,
    },
    addresses: [addressSchema],
  },
  {
    versionKey: false,
  }
);

customerSchema.pre('save', function (next) {
  this.password_confirmation = this.get('password');
  next();
});

module.exports = Customer = mongoose.model('customer', customerSchema);
