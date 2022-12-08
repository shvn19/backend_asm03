const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CartSchema = new Schema ({
  userId: {
    type: String,
    required: true,
  },
  productId: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
  nameProduct: String,
  priceProduct: Number,
  img: String,
});

module.exports = mongoose.model('Cart', CartSchema);