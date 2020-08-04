const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ShopSchema = new Schema(
  {
    shop: {
      type: String,
      required: true,
    },
    accessToken: {
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

module.exports = Shop = mongoose.model('shop', ShopSchema);
