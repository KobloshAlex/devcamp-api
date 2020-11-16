const express = require("express");
const router = express.Router();
const {
  getBootcamp,
  getBootcamps,
  updateBootcamp,
  creatBootcamp,
  deleteBootcamp,
} = require("../controller/bootcampController");

router.route("/").get(getBootcamps).post(creatBootcamp);
router
  .route("/:id")
  .get(getBootcamp)
  .delete(deleteBootcamp)
  .put(updateBootcamp);

module.exports = router;
