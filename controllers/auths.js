const User = require('../models/user');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const bcrypt = require('bcrypt');

const authMethod = require('./auths.methods');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    email: email
  });

  console.log(user);
  
  if(!user) {
    console.log('Tên đăng nhập không tồn tại');
    return res.status(401).json({ message: 'Tên đăng nhập không tồn tại'});
  }

  const matchPassword = bcrypt.compareSync(password,user.password);

  if(!matchPassword) {
    console.log('Mật khẩu không đúng');
    return res.status(401).json({ message: 'Mật khẩu không đúng'});
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;
  const refreshTokenSize = process.env.REFRESH_TOKEN_SIZE;
  let accessToken;
  try {
    accessToken = jwt.sign({
      email: email    // payload
    },
    accessTokenSecret,  // secret
    {                 // signing-option
      algorithm: 'HS256',
      expiresIn: accessTokenLife
    }
    );
  } catch (err) {
    console.log('#29 Lỗi khi Sign accessToken ');
    console.log(err);
    return res.status(500).json( { message: 'Lỗi hệ thống'})
  }

  const accessTokenExpiredAt = Date.now() + Number(accessTokenLife);
  // console.log('#35 now: ', Date.now());
  // console.log('#35 life: ', Number(accessTokenLife));
  // console.log('#35 life: ', process.env.ACCESS_TOKEN_LIFE);
  // console.log('#35 expired at: ', accessTokenExpiredAt);

  let refreshToken;
  try {
    refreshToken = randToken.generate(refreshTokenSize);
  } catch (err) {
    console.log('#30 Lỗi khi generate refreshToken ');
    return res.status(500).json( { message: 'Lỗi hệ thống'})
  }
  
  if (!user.refreshToken) {
    await User.findOneAndUpdate({ email: email},
      { refreshToken: refreshToken }, 
      { new: true });
  } else {
    refreshToken = user.refreshToken;
  }

  // Delete the two properties password and refreshToken 
  // before sending back in term of security
  delete user.password;
  delete user.refreshToken;
  console.log('user: ', user);

  return res.json({
    message: 'đăng nhập thành công',
    accessToken,
    refreshToken,
    accessTokenExpiredAt,
    user,
  })
}

exports.refreshToken = async (req, res, next) => {
  const accessTokenFromHeader = req.headers.x_authorization;
  console.log('#59 in refreshToken')
  if (!accessTokenFromHeader) {
    console.log('#60 khong co token trong header');
    return res.status(400).json({
      message: 'Không tìm thấy access token'
    })
  }

  // Lấy refresh Token từ body
  const refreshTokenFromBody = req.body.refreshToken;
  if (!refreshTokenFromBody) {
    console.log('#61 khong co refreshToken trong body');
    return res.status(400).json({
      message: 'Không tìm thấy refresh token'
    })
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
  const accessTokenLife = process.env.ACCESS_TOKEN_LIFE;

  // decode access token
  const decoded = await authMethod.decodeToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);

  if (!decoded) {
    console.log('#62 access token khong hop le sau khi decode');
    return res.status(400).send('Access token không hợp lệ.');
  }

  const email = decoded.email;

  const user = await User.findOne({ email: email });

  if (!user) {
    console.log('#63 email khong ton tai');
    return res.status(401).json({ message: 'Email không tồn tại'});
  }

  if(refreshTokenFromBody != user.refreshToken) {
    console.log('#64 refresh token khong hop le sau khi decode');
    return res.status(400).json('Refresh Token không hợp lệ');
  }

  // Tạo access token mới

  const dataForAccessToken = {
    email
  };

  const accessToken = await authMethod.generateToken (dataForAccessToken, accessTokenSecret, accessTokenLife);

  if (!accessToken) {
    console.log('#65 tao access token khong thanh cong');
    return res.status(400).json({ message: 'Tạo access token không thành công, vui lòng thử lại'});
  }

  console.log('#66 accesstoken da duoc tao: ', accessToken);
  return res.status(200).json({ accessToken });
}