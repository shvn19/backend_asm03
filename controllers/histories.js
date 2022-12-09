const Order = require("../models/order");
const product = require("../models/product");


exports.getUserHistory = (req, res, next) => {
  const idUser = req.query.idUser;

  Order.find({ userId: idUser })
  .populate('products.product')
  .then(orders => {
    orders.forEach(o => {
      // let t = 0;
      // o.products.forEach((product,index) => {
      //   o.populate(`products.product`);
        // o.index.populate({
        //   path: 'product', 
        //   model: 'Product'
        // });
        console.log('#107 order: ', o.products[0].product);
      // })
    });
  })
  .catch(err => {
    console.log('#106 Lỗi trong quá trình tìm order: ', err);
    res.status(500).json({ message: 'Lỗi hệ thống'});
  })
}