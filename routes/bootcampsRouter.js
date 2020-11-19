const express = require("express");
const {
	getBootcamp,
	getBootcamps,
	updateBootcamp,
	creatBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
	bootcampPhotoUpload,
} = require("../controller/bootcampController");

const Bootcamp = require("../model/Bootcamp");

const advancedResults = require("../middleware/advanceResults");

//Include other resource router
const courseRouter = require("./coursesRouter");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

//re-rourte into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
	.route("/:id/photo")
	.put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);

router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), getBootcamps)
	.post(protect, authorize("publisher", "admin"), creatBootcamp);

router
	.route("/:id")
	.get(getBootcamp)
	.delete(protect, authorize("publisher", "admin"), deleteBootcamp)
	.put(protect, authorize("publisher", "admin"), updateBootcamp);

module.exports = router;
