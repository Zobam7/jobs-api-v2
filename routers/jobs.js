const express = require("express");
const router = express.Router();

const {
  getUserJobs,
  getUserSingleJob,
  createJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

router.route("/").get(getUserJobs).post(createJob);
router.route("/:id").get(getUserSingleJob).patch(updateJob).delete(deleteJob);

module.exports = router;
