const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  applyCandidate,
  getCandidates,
  processCandidate,
  rejectCandidate
} = require("../controllers/candidateController");

router.post(
  "/apply",
  upload.single("resume"),
  applyCandidate
);

router.get("/all", getCandidates);

router.put("/process/:id", processCandidate);

router.put("/reject/:id", rejectCandidate);

module.exports = router;