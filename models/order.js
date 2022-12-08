const mongoose = require('mongoose');
const OrderDetail = require('./order_detail');
const product = require('./product');
const Schema = mongoose.Schema;

const defaultCreateAt = () => {
  return (new Date()).getTime();
}

// const orderDetailSchema = newSchema({
  
// })

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
    default: defaultCreateAt,
  },
  products: {
    type: [{
      product: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      count: {
        type: Number,
        required: true,
      }
    }],
    required: true,
  }
})

module.exports = mongoose.model('Order', orderSchema);