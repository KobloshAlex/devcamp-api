const asyncHandler = require("../middleware/asyncHandler");
const errorHandler = require("../middleware/errorHandler");
const Bootcamp = require("../model/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

/*
@desc       Get all bootcamps
@route      GET /api/v1/bootcamps
@access     public
*/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	const bootcamps = await Bootcamp.find();
	res
		.status(200)
		.json({ success: true, count: bootcamps.length, data: bootcamps });
});

/*
@desc       Get one bootcamp by id
@route      GET /api/v1/bootcamps/:id
@access     public
*/
exports.getBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	res.status(200).json({ success: true, data: bootcamp });
});

/*
@desc       Create  bootcamp
@route      POST /api/v1/bootcamps
@access     private
*/
exports.creatBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.create(req.body);

	res.status(201).json({
		success: true,
		data: bootcamp,
	});
});

/*
@desc       Update bootcamp
@route      PUT /api/v1/bootcamps
@access     private
*/
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true,
	});

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: bootcamp });
});

/*
@desc       delete bootcamp by id
@route      DELETE /api/v1/bootcamps
@access     private
*/
exports.deleteBootcamp = async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: bootcamp });
};
