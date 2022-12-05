const  Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.find().then(products => {
    console.log(products);
    res.status(200).json(products);
  });
}