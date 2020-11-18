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

	//create token

	const token = user.getSignedJwtToken();

	res.status(200).json({ success: true, token: token });
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
    const isMatch = await user.matchPassword(password)
    if(!isMatch) {
        return next(new ErrorResponse(`Invalid crudentials`, 401));
    }

	//create token
	const token = user.getSignedJwtToken();

	res.status(200).json({ success: true, token: token });
});
