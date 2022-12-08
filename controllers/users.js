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