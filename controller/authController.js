const asyncHandler = require("../middleware/asyncHandler");
const User = require("../model/User");
const { use } = require("../routes/authRouter");
const ErrorResponse = require("../utils/errorResponse");

/*
@desc       Register user
@route      POST /api/v1/auth/register
@access     public
*/

exports.register = asyncHandler(async (req, res, next) => {
	const { name, email, password, role } = req.body;

	//Create User
	const user = await User.create({ name, email, password, role });

	sendTokenResponse(user, 200, res);
});

/*
@desc       Login user
@route      POST /api/v1/auth/login
@access     public
*/
exports.login = asyncHandler(async (req, res, next) => {
	//validate email and password
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new ErrorResponse(`Please provide valid crudentials`, 400));
	}

	//check for user
	const user = await User.findOne({ email }).select("+password");
	if (!user) {
		return next(new ErrorResponse(`Invalid crudentials`, 401));
	}

	//check if password matches
	const isMatch = await user.matchPassword(password);
	if (!isMatch) {
		return next(new ErrorResponse(`Invalid crudentials`, 401));
	}

	sendTokenResponse(user, 200, res);
});

//Get token from model, reate cookie nad send response

const sendTokenResponse = (user, statusCode, res) => {
	//create token
	const token = user.getSignedJwtToken();

	const options = {
		expires: new Date(
			Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
		),
		httpOnly: true,
	};

	res
		.status(statusCode)
		.cookie("token", token, options)
		.json({ success: true, token: token });
};

/*
@desc       get current logged in user
@route      POST /api/v1/auth/login
@access     public
*/
exports.getMe = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user.id);

	res.status(200).json({
		success: true,
		data: user,
	});
});
