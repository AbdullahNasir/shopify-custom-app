const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopSchema = new Schema(
  {
    shop: {
      type: String,
      required: true,
    },
    access_token: {
      type: String,
      required: true,
    },
    scopes: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = Shop = mongoose.model('shop', shopSchema);
