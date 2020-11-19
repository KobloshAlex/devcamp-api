const path = require("path");
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
	res.status(200).json(res.advancedResults);
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
	//add user to body request.body
	req.body.user = req.user.id;

	//check for published bootcamp
	const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

	//If the user is not an admin, they can only add one bootcamp
	
	if (publishedBootcamp && req.user.role !== "admin") {
		return next(
			new ErrorResponse(
				`The user with ID ${req.user.id} has already published a bootcamp `,
				400
			)
		);
	}

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
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}
	bootcamp.remove();

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

/*
@desc       Upload photo for bootcamp 
@route      PUT /api/v1/bootcamps/:id/photo
@access     private
*/
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
	const bootcamp = await Bootcamp.findById(req.params.id);

	if (!bootcamp) {
		return next(
			new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
		);
	}

	if (!req.files) {
		return next(new ErrorResponse(`Please upload a file`, 400));
	}

	const file = req.files.file;

	//check if file is picture
	if (!file.mimetype.startsWith("image")) {
		return next(new ErrorResponse("Please upload image file", 400));
	}

	//check filesize
	if (file.size > process.env.MAX_FILE_UPLOAD) {
		return next(
			new ErrorResponse(
				`Please upload the image less that ${process.env.MAX_FILE_UPLOAD}`,
				400
			)
		);
	}

	// create custom file name
	file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

	file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
		if (err) {
			console.log(err);
			return next(new ErrorResponse(`Problem with file upload`, 500));
		}

		await Bootcamp.findOneAndUpdate(req.params.id, { photo: file.name });

		res.status(200).json({
			success: true,
			data: file.name,
		});
	});
	console.log(file.name);
});
