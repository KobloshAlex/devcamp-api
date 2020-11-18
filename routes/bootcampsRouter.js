const express = require("express");
const {
	getBootcamp,
	getBootcamps,
	updateBootcamp,
	creatBootcamp,
	deleteBootcamp,
	getBootcampsInRadius,
} = require("../controller/bootcampController");
const router = express.Router();

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/").get(getBootcamps).post(creatBootcamp);
router
	.route("/:id")
	.get(getBootcamp)
	.delete(deleteBootcamp)
	.put(updateBootcamp);

module.exports = router;
