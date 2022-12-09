const { Types, default: mongoose, Schema, Mongoose } = require("mongoose");
const Cart = require("../models/cart");
const Order = require('../models/order');
const User = require("../models/user");

exports.placeOrder = async (data) => {
  if (!data.idUser) {
    console.log('#93 No idUser');
    return;
  }
  const orderDetails = [];
  await Cart.find({ userId: data.idUser }).then(carts => {
    console.log('#88 carts: ', carts);
    carts.forEach(cart=> {
      console.log('#95 productId: ', cart.productId);
      const ojid = mongoose.Types.ObjectId(cart.productId);
      console.log('#96 productId objectID: ', ojid);
      const detail = {
        product: ojid,
        count: cart.count,
      };
      orderDetails.push(detail);
    })
  }).catch(err=> {
    console.log('Error occure wile finding user', err);
    return;
  });
  console.log('#100 orderDetails: ', orderDetails);
  const date = (new Date()).getTime();
  console.log('#89 createAt: ', date);
  try {
    const user = await User.findOne({ _id: data.idUser});
    const order = new Order({
      userId: user,
      email: data.email,
      phoneNumber: data.phone,
      address: data.address,
      fullName:data.fullName,
      createdAt: date,
      products: orderDetails,
    });
    console.log('#94: order: ', order);
    await order.save().then(o=> {
      console.log('#90 Order saved');
      return;
    }).catch(e => {
      console.log('#91 Error occurs while saving order', e);
    });
  }
  catch (err){
    console.log('#99 Error finding: ', err);
  }
  
  
}