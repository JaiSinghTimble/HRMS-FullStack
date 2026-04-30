const express = require("express");
const router = express.Router();

const {
  moveToOnboard,
  getOnboard
} = require("../controllers/onboardController");

router.post("/move/:id", moveToOnboard);

router.get("/all", getOnboard);

module.exports = router;