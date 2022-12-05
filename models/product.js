const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema ({
  category: {
    type: String,
    required: true,
  },
  img1: String,
  img2: String,
  img3: String,
  long_desc: String,
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  short_desc: String,
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User',
  //   required: true
  // }
});

module.exports = mongoose.model('Product', productSchema);