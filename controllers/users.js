const User = require("../models/user");
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) => {
  const data = req.body;
  console.log(data);
  const saltRound = Number(process.env.SALT_ROUND);
  console.log('salt round: ', saltRound);
  const hashedPassword = bcrypt.hashSync(data.password,saltRound);
  const user = new User({
    fullName: data.fullname,
    email: data.email,
    password: hashedPassword,
    phone: data.phone
  });
  user.save().then(result => {
    console.log('User Saved');
    res.status(200).end();
  });
}

exports.getUserDetail = (req, res, next) => {
  const { id } = req.params;
  console.log('#101 req.params: ', req.params);
  console.log('#102 id: ', id);
  User.findOne({ _id: id })
    .then(u => {
      console.log('#103 nhạn thông tin user: ', u);
      if (u) {
        res.status(200).json(u);
      } else {
        res.status(200).json(null);
      }
      
    })
    .catch(err => {
      console.log('#104 lỗi trong quá trình nhận user: ', err);
      res.status(500).json({ message: 'Lỗi trong quá trình tìm user'});
    });


}