const Cart = require ('../models/cart');

exports.addToCart = (req, res, next) => {
  console.log('in controller addtocart');
  const data = req.body;
  const cart = new Cart({
    userId: data.idUser,
    productId: data.idProduct,
    count: data.count,
    nameProduct: data.nameProduct,
    priceProduct: data.priceProduct,
    img: data.img,
  });
  cart.save().then((prd)=>{
    // console.log('#38 Product added to cart: ', prd);
    res.status(201).json({ message: 'Product added to cart'});
  })
  .catch(err=> {
    console.log('#38 Error while adding to cart: ', err);
    res.status(500).json({ message: 'Failed to save product to cart'});
  })
  ;
}

exports.getCart = (req, res, next) => {
  console.log ('#46 in getCart cartController');
  const idUser = req.query.idUser;
  console.log('#50 request params: ', req.query);
  Cart.find({ userid: idUser }).then(carts => {
    console.log('#49 cart return', carts);
    res.status(200).json(carts);
  }).catch(err => {
    res.status(500).json({ message: `Internal error when finding carts for this userid ${idUser}`});
  })
}

exports.deleteCart = (req, res, next) => {
  console.log('#69 in Deletecart');
  const { idUser, idProduct } = req.query;
  console.log('#73 req: ', req);
  console.log('#72 idUser and idProduct: ', idUser, '------', idProduct);
  Cart.deleteOne({ userId: idUser, productId: idProduct })
  .then(result => {
    console.log('#70 Deleted successfully: ', result);
    res.status(200).json({ message: 'Sản phẩm đã xóa khỏi giỏ hàng'});
  }).catch (err =>{
    console.log('#71 Deleting failed', err);
    res.status(500).json({ message: 'Lỗi trong quá trình xóa'});
  });
}