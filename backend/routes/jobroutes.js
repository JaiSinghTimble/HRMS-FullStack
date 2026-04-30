const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  getOpenJobs,
    deleteJob

} = require("../controllers/jobController");

router.post("/create", createJob);

router.get("/all", getJobs);

router.get("/open", getOpenJobs);

router.delete("/delete/:id", deleteJob);

module.exports = router;