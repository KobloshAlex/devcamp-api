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

//re-rourte into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
	.route("/")
	.get(advancedResults(Bootcamp, "courses"), getBootcamps)
	.post(creatBootcamp);
router.route("/:id/photo").put(bootcampPhotoUpload);
router
	.route("/:id")
	.get(getBootcamp)
	.delete(deleteBootcamp)
	.put(updateBootcamp);

module.exports = router;
