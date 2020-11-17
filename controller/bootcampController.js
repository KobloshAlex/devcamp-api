const errorHandler = require("../middleware/errorHandler");
const Bootcamp = require("../model/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

/*
@desc       Get all bootcamps
@route      GET /api/v1/bootcamps
@access     public
*/
exports.getBootcamps = async (req, res, next) => {
	try {
		const bootcamps = await Bootcamp.find();
		res
			.status(200)
			.json({ success: true, count: bootcamps.length, data: bootcamps });
	} catch (err) {
		next(err);
	}
};

/*
@desc       Get one bootcamp by id
@route      GET /api/v1/bootcamps/:id
@access     public
*/
exports.getBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findById(req.params.id);

		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		}

		res.status(200).json({ success: true, data: bootcamp });
	} catch (err) {
		next(err);
	}
};

/*
@desc       Create  bootcamp
@route      POST /api/v1/bootcamps
@access     private
*/
exports.creatBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.create(req.body);

		res.status(201).json({
			success: true,
			data: bootcamp,
		});
	} catch (err) {
		next(err);
	}
};

/*
@desc       Update bootcamp
@route      PUT /api/v1/bootcamps
@access     private
*/
exports.updateBootcamp = async (req, res, next) => {
	try {
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
	} catch (err) {
		next(err);
	}
};

/*
@desc       delete bootcamp by id
@route      DELETE /api/v1/bootcamps
@access     private
*/
exports.deleteBootcamp = async (req, res, next) => {
	try {
		const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

		if (!bootcamp) {
			return next(
				new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
			);
		}
		res.status(200).json({ success: true, data: bootcamp });
	} catch (err) {
		next(err);
	}
};
