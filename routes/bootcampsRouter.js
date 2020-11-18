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

//Include other resource router
const courseRouter = require("./coursesRouter");

const router = express.Router();

//re-rourte into other resource routers
router.use("/:bootcampId/courses", courseRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/").get(getBootcamps).post(creatBootcamp);
router.route("/:id/photo").put(bootcampPhotoUpload);
router
	.route("/:id")
	.get(getBootcamp)
	.delete(deleteBootcamp)
	.put(updateBootcamp);

module.exports = router;
