const User = require('../models/user');

const authMethod = require('../controllers/auths.methods');

exports.isAuth = async (req, res, next) => {
	// Lấy access token từ header
	// console.log('#40 in middleware auth');
	const accessTokenFromHeader = req.headers.x_authorization;
	// console.log('#41 request headers: ', req.headers);
	// console.log('#39 accessToken from header: ', accessTokenFromHeader);
	if (!accessTokenFromHeader) {
		return res.status(401).send('Không tìm thấy access token!');
	}

	const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

	const verified = await authMethod.verifyToken(
		accessTokenFromHeader,
		accessTokenSecret,
	);
	if (!verified) {
		return res
			.status(401)
			.send('Bạn không có quyền truy cập vào tính năng này!');
	}

	const user = await User.findOne({ email:verified.email});
	req.user = user;

	return next();
};