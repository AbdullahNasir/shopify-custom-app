const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomerSchema = new Schema(
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
  },
  {
    versionKey: false,
  }
);

CustomerSchema.pre('save', function (next) {
  this.password_confirmation = this.get('password');
  next();
});

module.exports = Customer = mongoose.model('customer', CustomerSchema);
