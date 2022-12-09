const Order = require("../models/order");


exports.getUserHistory = (req, res, next) => {
  const idUser = req.query.idUser;

  Order.find({ userId: idUser })
  .populate('products.product')
  .then(orders => {
    const ordersToReturn = [];
    orders.forEach(o => {
      // tính tổng lưu vào biến t
      let t = 0;
      o.products.forEach((orderDetail,index) => {
        // o.populate(`products.product`);
        // o.index.populate({
        //   path: 'product', 
        //   model: 'Product'
        // });
        t += orderDetail.product.price * orderDetail.count;
        console.log('#107 order: ', o.products[0].product);
      });
      const tempOrder = o.toObject();
      tempOrder.total = t;
      console.log('#109 order after adding total: ', tempOrder);
      ordersToReturn.push(tempOrder);
    });
    console.log('#108 orders: ', ordersToReturn);
    return res.status(200).json(ordersToReturn);
  })
  .catch(err => {
    console.log('#106 Lỗi trong quá trình tìm order: ', err);
    res.status(500).json({ message: 'Lỗi hệ thống'});
  })
}