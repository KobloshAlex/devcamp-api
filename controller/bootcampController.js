const asyncHandler = require("../middleware/asyncHandler");
const errorHandler = require("../middleware/errorHandler");
const geocoder = require("../utils/geocoder");
const Bootcamp = require("../model/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");

/*
@desc       Get all bootcamps
@route      GET /api/v1/bootcamps
@access     public
*/
exports.getBootcamps = asyncHandler(async (req, res, next) => {
	let query;

	//coppy requesr query
	const reqQuery = { ...req.query };

	//fields to exlude
	const removeFields = ["select", "sort", "page", "limit"];

	//loopover removefields and delete them from request query
	removeFields.forEach((param) => delete reqQuery[param]);

	//create query string
	let queryStr = JSON.stringify(reqQuery);

	//create operators for advance search
	queryStr = queryStr.replace(
		/\b(gt|gte|lt|lte|in)\b/g,
		(match) => `$${match}`
	);

	//finding resourse
	query = Bootcamp.find(JSON.parse(queryStr));

	//select fields
	if (req.query.select) {
		const fields = req.query.select.split(",").join(" ");
		query = query.select(fields);
	}

	//sort
	if (req.query.sort) {
		const sortBy = req.query.sort.split(",").join(" ");
		query = query.sort(sortBy);
	} else {
		query = query.sort("-createdAt");
	}

    //pagination
	const page = parseInt(req.query.page, 10) || 1;
	const limit = parseInt(req.query.limit, 10) || 5;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Bootcamp.countDocuments();

	query = query.skip(startIndex).limit(limit);

	//paginaion result
	const pagination = {};

    //if next page exist - display pagination object
	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

    //if prev page exist - display pagination object
	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	const bootcamps = await query;

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		pagination: pagination,
		data: bootcamps,
	});
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
@desc       Delete bootcamp by id
@route      DELETE /api/v1/bootcamps
@access     private
*/
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	res.status(200).json({ success: true, data: bootcamp });
});

/*
@desc       Get bootcamps within the radius
@route      GET /api/v1/bootcamps/radius/:zipcode/:distance
@access     private
*/
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	// Get lat/lng from geocoder
	const loc = await geocoder.geocode(zipcode);
	const lat = loc[0].latitude;
	const lng = loc[0].longitude;

	// Calc radius using radians
	// Divide dist by radius of Earth
	// Earth Radius = 3,963 mi / 6,378 km
	const radius = distance / 3963;

	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		success: true,
		count: bootcamps.length,
		data: bootcamps,
	});
});
