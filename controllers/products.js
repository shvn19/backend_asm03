const  Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.find().then(products => {
    res.status(200).json(products);
  });
}

exports.getOneProduct = (req, res, next) => {
  const _id = req.params._id;
  Product.findOne({ _id:_id }).then(product => {
    console.log('#37 Got Product: ', product);
    res.status(200).json(product);
  }).catch(err => {
    console.log(`#36 Got error while finding product with _id: ${_id}. Error is: `,err);
    res.status(400).json({ message: 'Got error while finding .'});
  });
}